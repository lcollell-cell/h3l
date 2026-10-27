/* Armado del reporte diario (HTML + texto). Solo lee la base D1; no depende de nada externo. */

const SERVICES = [
  ['reservas', 'Reservas y recursos'],
  ['auditoria', 'Auditoría energética'],
  ['emisiones', 'Emisiones y compensación'],
  ['datos', 'Ciencia de datos'],
  ['transicion', 'Transición energética'],
  ['plataformas', 'Plataformas digitales'],
  ['geociencias', 'Geociencias'],
  ['capacitacion', 'Capacitación'],
];
const SVC_NAME = Object.fromEntries(SERVICES);
const PAGES = { '/': 'Sitio principal', '/index.html': 'Sitio principal', '/v2/': 'Portada con intro', '/v2/index.html': 'Portada con intro', '/v2/reservas.html': 'Sala de reservas', '/v2/dashboards.html': 'Tableros' };
const SECTIONS = { somos: 'Quiénes somos', servicios: 'Servicios', noticias: 'Noticias Oil & Gas', eventos: 'Eventos', contacto: 'Contactos' };
const ACTIONS = { mailto: 'Clic en el mail', tel: 'Clic en el teléfono', linkedin: 'Clic en LinkedIn', brochure: 'Descarga del brochure', contact_send: 'Formulario de contacto (Enviar)', chat_open: 'Abrió el chat Copilot', intro_skip: 'Omitió la intro' };
const LANG_NAME = { es: 'Español', en: 'English', fr: 'Français', pt: 'Português' };
const DEV_NAME = { movil: 'Móvil', tablet: 'Tablet', escritorio: 'Escritorio' };
const DAYS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

export function dayOf(ts, env) {
  const off = Number(env && env.TZ_OFFSET_MIN != null && env.TZ_OFFSET_MIN !== '' ? env.TZ_OFFSET_MIN : -180);
  return new Date((ts + off * 60) * 1000).toISOString().slice(0, 10);
}
export function shiftDay(day, n) {
  const d = new Date(day + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const dmy = (day) => `${day.slice(8, 10)}/${day.slice(5, 7)}/${day.slice(0, 4)}`;
const weekday = (day) => DAYS[new Date(day + 'T12:00:00Z').getUTCDay()];
const fmtT = (s) => { s = Math.round(s || 0); if (s < 60) return `${s} s`; const m = Math.floor(s / 60); const r = s % 60; return m < 60 ? `${m} min ${r} s` : `${Math.floor(m / 60)} h ${m % 60} min`; };
const pct = (a, b) => (b ? `${Math.round((a / b) * 100)} %` : '—');
const avg = (a) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0);
const median = (a) => { if (!a.length) return 0; const s = [...a].sort((x, y) => x - y); const m = Math.floor(s.length / 2); return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };

let regionNames = null;
function countryName(c) {
  if (c === 'XX' || !c) return 'Desconocido';
  if (c === 'T1') return 'Red Tor';
  try { regionNames = regionNames || new Intl.DisplayNames(['es'], { type: 'region' }); return regionNames.of(c) || c; } catch { return c; }
}
function flag(c) { return /^[A-Z]{2}$/.test(c) && c !== 'XX' && c !== 'T1' ? String.fromCodePoint(...[...c].map((ch) => 127397 + ch.charCodeAt(0))) : '🌐'; }
const countryLabel = (c) => `${flag(c)} ${countryName(c)}`;

function tally(map, key, by = 1) { map.set(key, (map.get(key) || 0) + by); }
const top = (map, n = 99) => [...map.entries()].sort((a, b) => b[1] - a[1] || String(a[0]).localeCompare(String(b[0]))).slice(0, n);
const listStr = (map, n = 5) => (map.size ? top(map, n).map(([c, v]) => `${esc(countryLabel(c))} ${v}`).join(' · ') : '—');

function delta(cur, prev) {
  if (prev == null) return '';
  if (!prev && !cur) return '';
  if (!prev) return ' <span style="color:#1a7f4b">▲ nuevo</span>';
  const d = Math.round(((cur - prev) / prev) * 100);
  if (d === 0) return ' <span style="color:#6b7280">= igual</span>';
  return ` <span style="color:${d > 0 ? '#1a7f4b' : '#b42318'}">${d > 0 ? '▲' : '▼'} ${Math.abs(d)} %</span>`;
}

export async function buildReport(db, day, hosts, env) {
  const ph = hosts.map(() => '?').join(',');
  const rows = (await db.prepare(`SELECT ts, type, path, sid, vid, country, lang, dev, label, svc, n, ref FROM events WHERE day=? AND host IN (${ph})`).bind(day, ...hosts).all()).results || [];
  const trend = (await db.prepare(
    `SELECT day, SUM(type='pv') pv, COUNT(DISTINCT vid) vis, COUNT(DISTINCT sid) ses, SUM(CASE WHEN type='eng' THEN n ELSE 0 END) eng
     FROM events WHERE day BETWEEN ? AND ? AND host IN (${ph}) GROUP BY day`).bind(shiftDay(day, -6), day, ...hosts).all()).results || [];
  const hist = await db.prepare(`SELECT COUNT(*) pv, MIN(day) first FROM events WHERE type='pv' AND host IN (${ph})`).bind(...hosts).first();

  /* ---- sesiones ---- */
  const S = new Map();
  const sess = (r) => { let s = S.get(r.sid); if (!s) { s = { sid: r.sid, pv: 0, eng: 0, inter: 0, country: r.country, lang: '', dev: '', vid: r.vid }; S.set(r.sid, s); } return s; };
  const hours = new Array(24).fill(0);
  const off = Number(env && env.TZ_OFFSET_MIN != null && env.TZ_OFFSET_MIN !== '' ? env.TZ_OFFSET_MIN : -180);
  const pages = new Map(), refs = new Map(), langs = new Map(), devs = new Map(), secs = new Map();
  let pvTotal = 0;
  for (const r of rows) {
    const s = sess(r);
    if (r.type === 'pv') {
      s.pv++; pvTotal++;
      if (r.lang && !s.lang) s.lang = r.lang;
      if (r.dev && !s.dev) s.dev = r.dev;
      tally(pages, PAGES[r.path] || r.path);
      hours[new Date((r.ts + off * 60) * 1000).getUTCHours()]++;
      if (r.ref) tally(refs, r.ref);
    } else if (r.type === 'eng') s.eng += r.n || 0;
    else if (r.type === 'vclick' || r.type === 'click' || (r.type === 'vplay' && r.label === 'manual')) s.inter++;
  }
  const sessions = [...S.values()];
  const nS = sessions.length;
  const visitors = new Set(sessions.map((s) => s.vid)).size;
  const times = sessions.map((s) => s.eng);
  const bounce = sessions.filter((s) => s.pv <= 1 && s.inter === 0 && s.eng < 10).length;
  const withRef = new Set(rows.filter((r) => r.type === 'pv' && r.ref).map((r) => r.sid));
  const directo = sessions.filter((s) => s.pv > 0 && !withRef.has(s.sid)).length;
  for (const s of sessions) { tally(langs, s.lang || '?'); tally(devs, s.dev || '?'); }
  for (const r of rows) if (r.type === 'sec') tally(secs, SECTIONS[r.label] || r.label);

  /* ---- países ---- */
  const cMap = new Map();
  for (const s of sessions) {
    const c = s.country || 'XX';
    const o = cMap.get(c) || { ses: 0, eng: [] }; o.ses++; o.eng.push(s.eng); cMap.set(c, o);
  }
  const pvByCountry = new Map();
  for (const r of rows) if (r.type === 'pv') tally(pvByCountry, r.country || 'XX');
  const countries = [...cMap.entries()].sort((a, b) => b[1].ses - a[1].ses || (pvByCountry.get(b[0]) || 0) - (pvByCountry.get(a[0]) || 0));

  /* ---- servicios / videos ---- */
  const sv = {};
  for (const [id] of SERVICES) sv[id] = { manual: 0, auto: 0, play: 0, fs: 0, snd: 0, quote: 0, more: 0, secs: 0, end: 0, cl: new Map(), au: new Map(), lg: new Map(), inter: new Set() };
  for (const r of rows) {
    const o = sv[r.svc]; if (!o) continue;
    const c = r.country || 'XX';
    if (r.type === 'vplay') { if (r.label === 'manual') { o.manual++; o.inter.add(r.sid); o.cl.set(r.sid, c); o.lg.set(r.sid, r.lang || '?'); } else { o.auto++; o.au.set(r.sid, c); } }
    else if (r.type === 'vclick') { o[r.label === 'play' ? 'play' : r.label === 'fullscreen' ? 'fs' : 'snd']++; o.inter.add(r.sid); o.cl.set(r.sid, c); o.lg.set(r.sid, r.lang || '?'); }
    else if (r.type === 'click' && (r.label === 'quote' || r.label === 'more')) { o[r.label]++; o.inter.add(r.sid); o.cl.set(r.sid, c); o.lg.set(r.sid, r.lang || '?'); }
    else if (r.type === 'vsec') o.secs += r.n || 0;
    else if (r.type === 'vend') o.end++;
  }
  const cnt = (m) => { const t = new Map(); for (const c of m.values()) tally(t, c); return t; };
  const svRows = SERVICES.map(([id, name]) => {
    const o = sv[id];
    return { id, name, clicks: o.play + o.fs + o.snd, manual: o.manual, auto: o.auto, quote: o.quote, more: o.more, secs: o.secs, end: o.end, people: o.inter.size, countries: cnt(o.cl), autoCountries: cnt(o.au), langs: cnt(o.lg) };
  });
  const svSorted = [...svRows].sort((a, b) => (b.people + b.manual + b.quote) - (a.people + a.manual + a.quote));

  /* ---- acciones de contacto ---- */
  const act = new Map(), actC = new Map();
  for (const r of rows) {
    if (r.type !== 'click' || r.label === 'quote' || r.label === 'more') continue;
    const name = ACTIONS[r.label] || (r.label.startsWith('go:') ? `Botón hacia «${r.label.slice(3)}»` : r.label);
    tally(act, name);
    const m = actC.get(name) || new Map(); tally(m, r.country || 'XX'); actC.set(name, m);
  }
  const introPv = rows.filter((r) => r.type === 'pv' && (r.path === '/v2/' || r.path === '/v2/index.html')).length;
  const introSkip = rows.filter((r) => r.type === 'click' && r.label === 'intro_skip').length;

  /* ---- tendencia y comparaciones ---- */
  const tmap = new Map(trend.map((t) => [t.day, t]));
  const prev = tmap.get(shiftDay(day, -1));
  const prior = [-1, -2, -3, -4, -5, -6].map((n) => tmap.get(shiftDay(day, n))).filter(Boolean);
  const avg7 = (k) => (prior.length ? avg(prior.map((p) => p[k] || 0)) : null);
  const avgTime = avg(times);

  const totClicks = svRows.reduce((a, s) => a + s.people, 0);
  const best = svSorted[0] && (svSorted[0].people + svSorted[0].manual + svSorted[0].quote) > 0 ? svSorted[0] : null;
  const topC = countries[0];
  const peak = hours.indexOf(Math.max(...hours));
  const hl = [];
  if (!pvTotal && !nS) hl.push('No se registraron visitas este día.');
  else {
    hl.push(`${pvTotal} vistas de página, ${visitors} ${visitors === 1 ? 'visitante' : 'visitantes'} y ${nS} ${nS === 1 ? 'sesión' : 'sesiones'}; tiempo medio por sesión: ${fmtT(avgTime)}.`);
    if (topC) hl.push(`País con más visitas: ${countryName(topC[0])} (${topC[1].ses} ${topC[1].ses === 1 ? 'sesión' : 'sesiones'}).`);
    if (best) hl.push(`Servicio con más interacción: ${best.name} (${best.people} ${best.people === 1 ? 'visitante hizo' : 'visitantes hicieron'} clic${best.quote ? `, ${best.quote} pidieron cotización` : ''}).`);
    else hl.push('Ningún visitante hizo clic en los videos o servicios.');
    if (hours[peak] > 0) hl.push(`Hora pico: ${String(peak).padStart(2, '0')}:00 a ${String(peak).padStart(2, '0')}:59 (hora de Argentina).`);
    const contact = (act.get('Formulario de contacto (Enviar)') || 0) + (act.get('Clic en el mail') || 0) + (act.get('Clic en el teléfono') || 0);
    if (contact) hl.push(`Intentos de contacto: ${contact}.`);
  }

  /* ---- HTML ---- */
  const th = 'padding:6px 8px;background:#0b2545;color:#fff;font-size:12px;text-align:left;font-weight:600';
  const td = 'padding:6px 8px;border-bottom:1px solid #e5e7eb;font-size:13px;color:#111827;vertical-align:top';
  const table = (heads, body, widths) => body.length
    ? `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;margin:6px 0 4px"><tr>${heads.map((h, i) => `<th style="${th}${i ? ';text-align:right' : ''}"${widths ? ` width="${widths[i]}"` : ''}>${h}</th>`).join('')}</tr>${body.map((r) => `<tr>${r.map((c, i) => `<td style="${td}${i ? ';text-align:right' : ''}">${c}</td>`).join('')}</tr>`).join('')}</table>`
    : '<p style="margin:6px 0;color:#6b7280;font-size:13px">Sin datos.</p>';
  const h2 = (t) => `<h2 style="margin:22px 0 4px;font-size:15px;color:#0b2545;border-bottom:2px solid #14b8a6;padding-bottom:3px">${t}</h2>`;
  const kpi = (label, val, sub) => `<td style="padding:10px 8px;background:#f3f6fa;border-radius:6px;text-align:center" width="25%"><div style="font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:.4px">${label}</div><div style="font-size:22px;font-weight:700;color:#0b2545;margin-top:2px">${val}</div><div style="font-size:11px;color:#6b7280;margin-top:2px">${sub || '&nbsp;'}</div></td>`;

  const kpis = `<table role="presentation" cellpadding="0" cellspacing="6" width="100%" style="margin:10px -6px 0"><tr>
    ${kpi('Vistas', pvTotal, prev ? `ayer ${prev.pv || 0}${delta(pvTotal, prev.pv || 0)}` : '')}
    ${kpi('Visitantes', visitors, prev ? `ayer ${prev.vis || 0}${delta(visitors, prev.vis || 0)}` : '')}
    ${kpi('Sesiones', nS, prev ? `ayer ${prev.ses || 0}${delta(nS, prev.ses || 0)}` : '')}
    ${kpi('Tiempo medio', fmtT(avgTime), `mediana ${fmtT(median(times))}`)}
  </tr></table>`;

  const hlHtml = `<ul style="margin:8px 0 0;padding-left:18px;font-size:14px;color:#111827;line-height:1.5">${hl.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`;

  const buckets = [['menos de 10 s', 0, 10], ['10 – 30 s', 10, 30], ['30 s – 1 min', 30, 60], ['1 – 3 min', 60, 180], ['más de 3 min', 180, Infinity]]
    .map(([l, a, b]) => [l, times.filter((t) => t >= a && t < b).length]);
  const timeBlock = nS ? table(['Tiempo navegando por sesión', 'Sesiones', '%'],
    buckets.map(([l, n]) => [l, n, pct(n, nS)])) +
    `<p style="margin:4px 0;font-size:12px;color:#6b7280">Tiempo activo (pestaña visible y con actividad o video en reproducción). Rebote: ${bounce} sesiones (${pct(bounce, nS)}) con una sola página, sin clics y menos de 10 s.</p>` : '';

  const countryBlock = table(['País', 'Sesiones', 'Vistas', 'Tiempo medio'],
    countries.slice(0, 12).map(([c, o]) => [esc(countryLabel(c)), o.ses, pvByCountry.get(c) || 0, fmtT(avg(o.eng))]));

  const svcBlock = table(['Servicio / video', 'Visitantes con clic', 'Reprod. por clic', 'Reprod. auto', 'Tiempo visto', 'Cotiz.', 'Ver más', 'Países (clic)'],
    svSorted.map((s) => [
      `<b>${esc(s.name)}</b>${s.langs.size ? `<br><span style="font-size:11px;color:#6b7280">${top(s.langs).map(([l, v]) => `${esc(LANG_NAME[l] || l)} ${v}`).join(' · ')}</span>` : ''}`,
      s.people, s.manual, s.auto, s.secs ? fmtT(s.secs) : '—', s.quote, s.more,
      `<span style="font-size:12px">${listStr(s.countries)}</span>`,
    ]));
  const svcNote = `<p style="margin:4px 0;font-size:12px;color:#6b7280">“Clic” = play, pantalla completa, sonido, “Pedir cotización” o “Ver más”. “Reprod. auto” = el video arrancó solo al llegar a él con el scroll. Cada cifra cuenta una vez por visita de página.${totClicks ? '' : ' Hoy nadie hizo clic en los videos.'}</p>`;
  const autoCountries = svRows.some((s) => s.autoCountries.size)
    ? `<p style="margin:4px 0;font-size:12px;color:#374151"><b>Países con reproducción automática:</b> ${svRows.filter((s) => s.autoCountries.size).map((s) => `${esc(s.name)}: ${listStr(s.autoCountries, 3)}`).join(' &nbsp;|&nbsp; ')}</p>` : '';

  const actBlock = act.size ? table(['Acción', 'Veces', 'Países'],
    top(act).map(([n, v]) => [esc(n), v, `<span style="font-size:12px">${listStr(actC.get(n), 4)}</span>`])) : '';
  const introNote = introPv ? `<p style="margin:4px 0;font-size:12px;color:#6b7280">Intro de la portada: ${introSkip} de ${introPv} visitas la omitieron (${pct(introSkip, introPv)}).</p>` : '';

  const hmax = Math.max(1, ...hours);
  const bars = '▁▂▃▄▅▆▇█';
  const hoursStr = hours.map((h) => (h ? bars[Math.min(7, Math.ceil((h / hmax) * 8) - 1)] : '·')).join('');
  const hoursBlock = pvTotal ? `<p style="margin:6px 0 2px;font-family:Consolas,monospace;font-size:15px;letter-spacing:1px;color:#0b2545">${hoursStr}</p><p style="margin:0;font-size:11px;color:#6b7280">De 0 h (izquierda) a 23 h (derecha), hora de Argentina.</p>` : '';

  const small = (title, map, name) => `<td valign="top" width="33%" style="padding-right:8px">${table([title, ''], top(map, 6).map(([k, v]) => [esc(name ? (name[k] || k) : k), v]))}</td>`;
  const origin = new Map(refs); if (directo > 0) origin.set('Directo / sin origen', directo);
  const trio = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>${small('Idioma', langs, { ...LANG_NAME, '?': 'Sin dato' })}${small('Dispositivo', devs, { ...DEV_NAME, '?': 'Sin dato' })}${small('Origen', origin)}</tr></table>`;
  const pagesBlock = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>${small('Página', pages)}${small('Sección del sitio', secs)}<td></td></tr></table>`;

  const days7 = []; for (let i = 6; i >= 0; i--) { const d = shiftDay(day, -i); days7.push([d, tmap.get(d)]); }
  const trendBlock = table(['Día', 'Vistas', 'Visitantes', 'Sesiones', 'Tiempo medio'],
    days7.map(([d, t]) => [`${esc(weekday(d).slice(0, 3))} ${dmy(d).slice(0, 5)}${d === day ? ' ◀' : ''}`, t ? t.pv : 0, t ? t.vis : 0, t ? t.ses : 0, t && t.ses ? fmtT(t.eng / t.ses) : '—']));
  const sumPv = days7.reduce((a, [, t]) => a + (t ? t.pv : 0), 0);
  const histNote = hist && hist.pv ? `Desde el ${dmy(hist.first)} hay ${hist.pv} vistas registradas (se conservan 90 días).` : '';

  const title = `${weekday(day)} ${dmy(day)}`;
  const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#eef1f5;font-family:Arial,Helvetica,sans-serif">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef1f5"><tr><td align="center" style="padding:16px 8px">
<table role="presentation" width="680" cellpadding="0" cellspacing="0" style="max-width:680px;width:100%;background:#ffffff;border-radius:8px;overflow:hidden">
<tr><td style="background:#0b2545;padding:18px 22px"><div style="font-size:20px;font-weight:700;color:#fff;letter-spacing:1px">H<span style="color:#14b8a6">3</span>L <span style="font-weight:400;font-size:13px;color:#9fb3c8">Global Energy</span></div>
<div style="font-size:13px;color:#cfe3f1;margin-top:4px">Reporte diario del sitio · ${esc(title)}</div></td></tr>
<tr><td style="padding:6px 22px 22px">
${kpis}
${hlHtml}
${h2('Visitas por país')}${countryBlock}
${h2('Videos y servicios: qué se clickeó y desde dónde')}${svcBlock}${svcNote}${autoCountries}
${h2('Tiempo navegando')}${timeBlock || '<p style="margin:6px 0;color:#6b7280;font-size:13px">Sin datos.</p>'}
${h2('Contacto y otras acciones')}${actBlock || '<p style="margin:6px 0;color:#6b7280;font-size:13px">Sin acciones registradas.</p>'}${introNote}
${h2('Páginas y secciones')}${pagesBlock}
${h2('Audiencia')}${trio}
${h2('Visitas por hora')}${hoursBlock || '<p style="margin:6px 0;color:#6b7280;font-size:13px">Sin datos.</p>'}
${h2('Últimos 7 días')}${trendBlock}<p style="margin:4px 0;font-size:12px;color:#6b7280">Total de la semana: ${sumPv} vistas. ${esc(histNote)}</p>
<p style="margin:18px 0 0;font-size:11px;color:#9ca3af;line-height:1.4">Medición propia de www.h3lglobalenergy.com, sin cookies ni datos personales (no se guarda la IP; el país lo informa Cloudflare). Los visitantes se estiman por día y no incluyen bots ni navegadores con “No rastrear”. Día calculado en hora de Argentina (00:00 a 23:59).</p>
</td></tr></table></td></tr></table></body></html>`;

  /* ---- texto plano ---- */
  const L = [];
  L.push(`H3L Global Energy · Reporte diario del sitio · ${title}`, '', ...hl.map((x) => `- ${x}`), '');
  L.push(`Vistas ${pvTotal} | Visitantes ${visitors} | Sesiones ${nS} | Tiempo medio ${fmtT(avgTime)}`, '');
  if (countries.length) { L.push('PAÍSES'); countries.slice(0, 12).forEach(([c, o]) => L.push(`  ${countryName(c)}: ${o.ses} sesiones, ${pvByCountry.get(c) || 0} vistas, ${fmtT(avg(o.eng))}`)); L.push(''); }
  L.push('VIDEOS Y SERVICIOS (clic = play, pantalla completa, sonido, cotización o ver más)');
  svSorted.forEach((s) => L.push(`  ${s.name}: ${s.people} visitantes con clic, ${s.manual} reprod. por clic, ${s.auto} auto, tiempo visto ${s.secs ? fmtT(s.secs) : '—'}, ${s.quote} cotizaciones | ${[...s.countries.entries()].map(([c, v]) => `${countryName(c)} ${v}`).join(', ') || '—'}`));
  if (act.size) { L.push('', 'ACCIONES'); top(act).forEach(([n, v]) => L.push(`  ${n}: ${v}`)); }
  L.push('', 'ÚLTIMOS 7 DÍAS'); days7.forEach(([d, t]) => L.push(`  ${dmy(d)}: ${t ? t.pv : 0} vistas, ${t ? t.vis : 0} visitantes`));
  const text = L.join('\n');

  const subject = `H3L · Reporte diario ${weekday(day)} ${dmy(day)}: ${pvTotal} ${pvTotal === 1 ? 'vista' : 'vistas'}, ${visitors} ${visitors === 1 ? 'visitante' : 'visitantes'}`;
  return { subject, html, text };
}
