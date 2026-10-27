/* H3L Global Energy: Worker de estadísticas.
   - POST /api/collect      recibe los eventos anónimos que envía assets/h3l-stats.js y los guarda en D1.
   - cron diario            arma el reporte del día anterior (hora de Argentina) y lo envía por mail.
   - POST /api/report-test  (solo si existe el secreto REPORT_KEY) envía o muestra un reporte a pedido.
   Todo lo demás lo sirve Cloudflare como archivos estáticos (run_worker_first solo para /api/*). */
import { buildReport, dayOf, shiftDay } from './report.js';

const TYPES = new Set(['pv', 'eng', 'sec', 'vclick', 'vplay', 'vsec', 'vend', 'click']);
const SERVICES = new Set(['reservas', 'auditoria', 'emisiones', 'datos', 'transicion', 'plataformas', 'geociencias', 'capacitacion']);
const LANGS = new Set(['es', 'en', 'fr', 'pt']);
const DEVS = new Set(['movil', 'tablet', 'escritorio']);
const BOT_RE = /bot|crawl|spider|slurp|headless|lighthouse|pagespeed|preview|monitor|uptime|curl|wget|python|node-fetch|axios|java\/|go-http|facebookexternalhit|whatsapp|telegram/i;
const MAX_BODY = 8000;
const MAX_EVENTS = 12;
const MAX_PER_VISITOR_DAY = 400;
const RETENTION_DAYS = 90;

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS events (id INTEGER PRIMARY KEY AUTOINCREMENT, ts INTEGER NOT NULL, day TEXT NOT NULL, host TEXT NOT NULL, type TEXT NOT NULL, path TEXT, sid TEXT, pvid TEXT, vid TEXT, country TEXT, lang TEXT, dev TEXT, label TEXT, svc TEXT, n REAL, ref TEXT, ukey TEXT UNIQUE)`,
  `CREATE INDEX IF NOT EXISTS events_day ON events (day, type)`,
  `CREATE INDEX IF NOT EXISTS events_vid ON events (day, vid)`,
  `CREATE TABLE IF NOT EXISTS meta (k TEXT PRIMARY KEY, v TEXT)`,
  `CREATE TABLE IF NOT EXISTS reports (day TEXT PRIMARY KEY, sent_at INTEGER, error TEXT)`,
  `CREATE TABLE IF NOT EXISTS metrics (day TEXT NOT NULL, metric TEXT NOT NULL, dim1 TEXT NOT NULL DEFAULT '', dim2 TEXT NOT NULL DEFAULT '', value REAL NOT NULL, PRIMARY KEY (day, metric, dim1, dim2))`,
];

let schemaReady = null;
function ensureSchema(env) {
  if (!schemaReady) {
    schemaReady = env.DB.batch(SCHEMA.map((s) => env.DB.prepare(s))).catch((e) => { schemaReady = null; throw e; });
  }
  return schemaReady;
}

const hex = (buf) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
async function sha(text) { return hex(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))); }

/* Sal aleatoria propia (se crea sola la primera vez y no sale de la base). Se combina con el día: el identificador de
   visitante cambia cada día y no se puede volver a la IP a partir de él. */
async function getSalt(env) {
  const row = await env.DB.prepare(`SELECT v FROM meta WHERE k='salt'`).first();
  if (row) return row.v;
  const salt = hex(crypto.getRandomValues(new Uint8Array(16)));
  await env.DB.prepare(`INSERT OR IGNORE INTO meta (k, v) VALUES ('salt', ?)`).bind(salt).run();
  return (await env.DB.prepare(`SELECT v FROM meta WHERE k='salt'`).first()).v;
}

const clean = (s, re, max) => (typeof s === 'string' && s.length <= max && re.test(s) ? s : '');
const ID_RE = /^[a-z0-9]{8,16}$/;

function sanitize(ev, ownHost) {
  if (!ev || typeof ev !== 'object' || !TYPES.has(ev.t)) return null;
  const out = {
    type: ev.t,
    sid: clean(ev.sid, ID_RE, 16),
    pvid: clean(ev.pv, ID_RE, 16),
    path: clean(ev.p, /^\/[A-Za-z0-9/._~-]*$/, 120) || '/',
    lang: LANGS.has(ev.l) ? ev.l : '',
    dev: DEVS.has(ev.dev) ? ev.dev : '',
    label: clean(ev.k, /^[a-z0-9:_-]{1,30}$/, 30),
    svc: SERVICES.has(ev.s) ? ev.s : '',
    n: Math.min(86400, Math.max(0, Number.isFinite(+ev.n) ? Math.round(+ev.n) : 0)),
    ref: clean(ev.ref, /^[a-z0-9.-]{3,80}$/i, 80).toLowerCase(),
    team: ev.i === 1,
  };
  if (!out.sid || !out.pvid) return null;
  if (out.ref === ownHost || out.ref === ownHost.replace(/^www\./, '')) out.ref = '';
  return out;
}

/* Las visitas marcadas como del equipo se guardan con este prefijo en host: el reporte público las excluye y las resume aparte. */
const TEAM_PREFIX = 'interno|';

/* Clave de unicidad: eng/vsec se actualizan (valor acumulado); el resto cuenta una sola vez por visita de página. */
function keyOf(e) {
  const base = `${e.type}|${e.pvid}`;
  if (e.type === 'pv') return base;
  if (e.type === 'eng') return base;
  return `${base}|${e.label}|${e.svc}`;
}

async function collect(request, env, ctx) {
  const url = new URL(request.url);
  const origin = request.headers.get('Origin');
  const sameOrigin = origin ? safeHost(origin) === url.host : request.headers.get('Sec-Fetch-Site') === 'same-origin';
  if (!sameOrigin) return new Response(null, { status: 204 });
  const ua = request.headers.get('User-Agent') || '';
  if (!ua || BOT_RE.test(ua) || (request.cf && request.cf.verifiedBotCategory)) return new Response(null, { status: 204 });

  const text = await request.text();
  if (text.length > MAX_BODY) return new Response(null, { status: 204 });
  let data;
  try { data = JSON.parse(text); } catch { return new Response(null, { status: 204 }); }
  const list = Array.isArray(data && data.events) ? data.events.slice(0, MAX_EVENTS) : [];
  const events = list.map((e) => sanitize(e, url.host)).filter(Boolean);
  if (!events.length) return new Response(null, { status: 204 });

  ctx.waitUntil(store(request, env, url.host, events).catch((e) => console.error('collect', e && e.message)));
  return new Response(null, { status: 204 });
}

function safeHost(u) { try { return new URL(u).host; } catch { return ''; } }

async function store(request, env, host, events) {
  await ensureSchema(env);
  const now = Math.floor(Date.now() / 1000);
  const day = dayOf(now, env);
  const ip = request.headers.get('CF-Connecting-IP') || '';
  const ua = request.headers.get('User-Agent') || '';
  const vid = (await sha(`${await getSalt(env)}|${day}|${ip}|${ua}`)).slice(0, 16);
  const country = ((request.cf && request.cf.country) || 'XX').toUpperCase().slice(0, 2);

  const used = await env.DB.prepare(`SELECT COUNT(*) c FROM events WHERE day=? AND vid=?`).bind(day, vid).first();
  if (used && used.c >= MAX_PER_VISITOR_DAY) return;

  const upsert = `INSERT INTO events (ts, day, host, type, path, sid, pvid, vid, country, lang, dev, label, svc, n, ref, ukey)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    ON CONFLICT(ukey) DO UPDATE SET n = MAX(COALESCE(events.n,0), COALESCE(excluded.n,0)), ts = excluded.ts`;
  await env.DB.batch(events.map((e) => env.DB.prepare(upsert).bind(
    now, day, e.team ? `${TEAM_PREFIX}${host}` : host, e.type, e.path, e.sid, e.pvid, vid, country, e.lang, e.dev, e.label, e.svc, e.n, e.ref, keyOf(e),
  )));
}

/* ---------- reporte ---------- */
function hostsOf(env) { return String(env.REPORT_HOSTS || 'www.h3lglobalenergy.com,h3lglobalenergy.com').split(',').map((s) => s.trim()).filter(Boolean); }

async function saveMetrics(env, day, rows) {
  const db = env.DB;
  await db.prepare(`DELETE FROM metrics WHERE day=?`).bind(day).run();
  const ins = `INSERT OR REPLACE INTO metrics (day, metric, dim1, dim2, value) VALUES (?,?,?,?,?)`;
  for (let k = 0; k < rows.length; k += 50) {
    await db.batch(rows.slice(k, k + 50).map((r) => db.prepare(ins).bind(...r)));
  }
}

async function sendReport(env, day, { test = false, banner = '' } = {}) {
  await ensureSchema(env);
  const rep = await buildReport(env.DB, day, hostsOf(env), env, { banner: test ? (banner || 'Envío de prueba') : '' });
  /* el historial de métricas se guarda siempre (no vence a los 90 días como los eventos) y antes de enviar el mail */
  await saveMetrics(env, day, rep.metrics);
  const subject = `${test ? '[PRUEBA] ' : ''}${rep.subject}`;
  const csvBytes = new TextEncoder().encode('\ufeff' + rep.csv);
  if (env.RESEND_API_KEY) {
    /* Resend (plan gratuito: 100 mails por dia, 3.000 por mes). El mail sale desde REPORT_FROM, dominio verificado en Resend. */
    let bin = ''; for (const b of csvBytes) bin += String.fromCharCode(b);
    const headers = { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' };
    if (!test) headers['Idempotency-Key'] = `h3l-reporte-${day}`;
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST', headers,
      body: JSON.stringify({
        from: `H3L Global Energy · Reportes <${env.REPORT_FROM}>`,
        to: [env.REPORT_TO],
        subject, html: rep.html, text: rep.text,
        attachments: [{ filename: rep.csvName, content: btoa(bin) }],
      }),
    });
    if (!res.ok) throw new Error(`resend ${res.status} ${(await res.text()).slice(0, 150)}`);
  } else if (env.EMAIL) {
    /* alternativa: Cloudflare Email Service (requiere Workers Paid y el binding send_email en wrangler.jsonc) */
    await env.EMAIL.send({
      to: env.REPORT_TO,
      from: { email: env.REPORT_FROM, name: 'H3L Global Energy · Reportes' },
      subject, html: rep.html, text: rep.text,
      attachments: [{ filename: rep.csvName, content: csvBytes.buffer, type: 'text/csv', disposition: 'attachment' }],
    });
  } else {
    throw new Error('sin servicio de envio: definir el secreto RESEND_API_KEY');
  }
  return rep;
}

async function runDaily(env) {
  await ensureSchema(env);
  const today = dayOf(Math.floor(Date.now() / 1000), env);
  const yesterday = shiftDay(today, -1);

  /* reintenta los últimos 3 días cuyo envío falló (solo si quedó registrado el error) */
  const failed = await env.DB.prepare(`SELECT day FROM reports WHERE sent_at IS NULL AND day >= ? AND day < ? ORDER BY day`).bind(shiftDay(today, -4), yesterday).all();
  const days = [...(failed.results || []).map((r) => r.day), yesterday];

  for (const day of days) {
    const done = await env.DB.prepare(`SELECT sent_at FROM reports WHERE day=?`).bind(day).first();
    if (done && done.sent_at) continue;
    try {
      await sendReport(env, day);
      await env.DB.prepare(`INSERT INTO reports (day, sent_at, error) VALUES (?, ?, NULL) ON CONFLICT(day) DO UPDATE SET sent_at=excluded.sent_at, error=NULL`).bind(day, Math.floor(Date.now() / 1000)).run();
    } catch (e) {
      console.error('report', day, e && (e.code || e.message));
      await env.DB.prepare(`INSERT INTO reports (day, sent_at, error) VALUES (?, NULL, ?) ON CONFLICT(day) DO UPDATE SET error=excluded.error`).bind(day, String((e && (e.code || e.message)) || e).slice(0, 200)).run();
    }
  }
  /* limpieza: se conservan los eventos de los últimos 90 días */
  await env.DB.prepare(`DELETE FROM events WHERE day < ?`).bind(shiftDay(today, -RETENTION_DAYS)).run();
}

function timingSafeEqual(a, b) {
  const x = new TextEncoder().encode(a), y = new TextEncoder().encode(b);
  if (x.length !== y.length) return false;
  let r = 0; for (let i = 0; i < x.length; i++) r |= x[i] ^ y[i];
  return r === 0;
}

async function reportTest(request, env) {
  if (!env.REPORT_KEY) return new Response('Not found', { status: 404 });
  if (!timingSafeEqual(request.headers.get('x-report-key') || '', env.REPORT_KEY)) return new Response('Unauthorized', { status: 401 });
  const url = new URL(request.url);
  const today = dayOf(Math.floor(Date.now() / 1000), env);
  const day = /^\d{4}-\d{2}-\d{2}$/.test(url.searchParams.get('day') || '') ? url.searchParams.get('day') : shiftDay(today, -1);
  if (url.searchParams.get('format') === 'csv') {
    await ensureSchema(env);
    const rep = await buildReport(env.DB, day, hostsOf(env), env);
    return new Response(rep.csv, { headers: { 'content-type': 'text/csv; charset=utf-8', 'content-disposition': `attachment; filename="${rep.csvName}"`, 'cache-control': 'no-store' } });
  }
  if (url.searchParams.get('preview') === '1') {
    await ensureSchema(env);
    const rep = await buildReport(env.DB, day, hostsOf(env), env, { banner: (url.searchParams.get('banner') || '').slice(0, 160) });
    return new Response(rep.html, { headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' } });
  }
  try {
    const rep = await sendReport(env, day, { test: true, banner: (url.searchParams.get('banner') || '').slice(0, 160) });
    return Response.json({ ok: true, day, subject: rep.subject, to: env.REPORT_TO });
  } catch (e) {
    return Response.json({ ok: false, day, error: String((e && (e.code || e.message)) || e) }, { status: 500 });
  }
}

/* GET /api/export?from=AAAA-MM-DD&to=AAAA-MM-DD  (con el encabezado x-report-key): historial de métricas en CSV para la base local */
async function exportMetrics(request, env) {
  if (!env.REPORT_KEY) return new Response('Not found', { status: 404 });
  if (!timingSafeEqual(request.headers.get('x-report-key') || '', env.REPORT_KEY)) return new Response('Unauthorized', { status: 401 });
  await ensureSchema(env);
  const url = new URL(request.url);
  const ok = (v) => /^\d{4}-\d{2}-\d{2}$/.test(v || '');
  const from = ok(url.searchParams.get('from')) ? url.searchParams.get('from') : '2000-01-01';
  const to = ok(url.searchParams.get('to')) ? url.searchParams.get('to') : '2999-12-31';
  const rows = (await env.DB.prepare(`SELECT day, metric, dim1, dim2, value FROM metrics WHERE day BETWEEN ? AND ? ORDER BY day, metric, dim1, dim2`).bind(from, to).all()).results || [];
  const cell = (v) => (/[",\n\r]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v));
  const csv = ['fecha,metrica,dim1,dim2,valor', ...rows.map((r) => [r.day, r.metric, r.dim1, r.dim2, r.value].map(cell).join(','))].join('\n') + '\n';
  return new Response(csv, { headers: { 'content-type': 'text/csv; charset=utf-8', 'cache-control': 'no-store' } });
}

export default {
  async fetch(request, env, ctx) {
    const { pathname } = new URL(request.url);
    if (pathname === '/api/collect' && request.method === 'POST') return collect(request, env, ctx);
    if (pathname === '/api/report-test' && request.method === 'POST') return reportTest(request, env);
    if (pathname === '/api/export' && request.method === 'GET') return exportMetrics(request, env);
    if (pathname.startsWith('/api/')) return new Response('Not found', { status: 404 });
    return env.ASSETS.fetch(request);
  },
  async scheduled(event, env, ctx) {
    ctx.waitUntil(runDaily(env));
  },
};
