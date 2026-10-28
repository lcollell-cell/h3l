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
const PAGES = { '/': 'Sitio principal', '/index.html': 'Sitio principal', '/v2/': 'Portada con intro', '/v2/index.html': 'Portada con intro', '/es/': 'Portada con intro', '/en/': 'Portada con intro', '/fr/': 'Portada con intro', '/pt/': 'Portada con intro', '/v2/reservas.html': 'Sala de reservas', '/v2/dashboards.html': 'Tableros' };
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

export async function buildReport(db, day, hosts, env, opts = {}) {
  const ph = hosts.map(() => '?').join(',');
  const rows = (await db.prepare(`SELECT ts, type, path, sid, vid, country, lang, dev, label, svc, n, ref FROM events WHERE day=? AND host IN (${ph})`).bind(day, ...hosts).all()).results || [];
  const trend = (await db.prepare(
    `SELECT day, SUM(type='pv') pv, COUNT(DISTINCT vid) vis, COUNT(DISTINCT sid) ses, SUM(CASE WHEN type='eng' THEN n ELSE 0 END) eng
     FROM events WHERE day BETWEEN ? AND ? AND host IN (${ph}) GROUP BY day`).bind(shiftDay(day, -6), day, ...hosts).all()).results || [];
  const hist = await db.prepare(`SELECT COUNT(*) pv, MIN(day) first FROM events WHERE type='pv' AND host IN (${ph})`).bind(...hosts).first();

  /* ---- tráfico del equipo (navegadores marcados con ?h3l-equipo=1): se guarda aparte y no entra en las cifras públicas ---- */
  const th = hosts.map((h) => `interno|${h}`), tph = th.map(() => '?').join(',');
  const trows = (await db.prepare(`SELECT type, label, sid, country, n FROM events WHERE day=? AND host IN (${tph})`).bind(day, ...th).all()).results || [];
  const T = { pv: 0, ses: new Set(), eng: new Map(), clicks: 0, countries: new Map() };
  for (const r of trows) {
    T.ses.add(r.sid);
    if (r.type === 'pv') { T.pv++; tally(T.countries, r.country || 'XX'); }
    else if (r.type === 'eng') T.eng.set(r.sid, (T.eng.get(r.sid) || 0) + (r.n || 0));
    else if (r.type === 'vclick' || r.type === 'click' || (r.type === 'vplay' && r.label === 'manual')) T.clicks++;
  }
  const tEng = avg([...T.ses].map((sid) => T.eng.get(sid) || 0));

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
  const introPv = rows.filter((r) => r.type === 'pv' && (r.path === '/v2/' || r.path === '/v2/index.html' || /^\/(es|en|fr|pt)\/?$/.test(r.path))).length;
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

  /* ---- métricas en formato largo: alimentan el CSV adjunto, la base histórica (D1) y la base local ---- */
  const M = [];
  const m = (metrica, dim1, dim2, valor) => { if (Number.isFinite(valor)) M.push([day, metrica, dim1 == null ? '' : String(dim1), dim2 == null ? '' : String(dim2), Math.round(valor * 100) / 100]); };
  m('vistas', '', '', pvTotal); m('visitantes', '', '', visitors); m('sesiones', '', '', nS);
  m('tiempo_medio_s', '', '', avgTime); m('tiempo_mediano_s', '', '', median(times)); m('rebote_sesiones', '', '', bounce);
  if (T.ses.size) { m('interno_vistas', '', '', T.pv); m('interno_sesiones', '', '', T.ses.size); m('interno_clics', '', '', T.clicks); m('interno_tiempo_medio_s', '', '', tEng); }
  for (const [c, o] of countries) { m('pais_sesiones', c, '', o.ses); m('pais_vistas', c, '', pvByCountry.get(c) || 0); m('pais_tiempo_medio_s', c, '', avg(o.eng)); }
  for (const s of svRows) {
    m('servicio_visitantes_clic', s.id, '', s.people); m('servicio_repro_clic', s.id, '', s.manual); m('servicio_repro_auto', s.id, '', s.auto);
    m('servicio_segundos_vistos', s.id, '', s.secs); m('servicio_completados', s.id, '', s.end); m('servicio_cotizaciones', s.id, '', s.quote); m('servicio_ver_mas', s.id, '', s.more);
    for (const [c, v] of s.countries) m('servicio_visitantes_clic_pais', s.id, c, v);
    for (const [l, v] of s.langs) m('servicio_visitantes_clic_idioma', s.id, l === '?' ? 'sin_dato' : l, v);
    for (const [c, v] of s.autoCountries) m('servicio_repro_auto_pais', s.id, c, v);
  }
  const rawAct = new Map(), rawActC = new Map(), rawPages = new Map(), rawSecs = new Map(), refSes = new Map();
  for (const r of rows) {
    if (r.type === 'click' && r.label !== 'quote' && r.label !== 'more') { tally(rawAct, r.label); tally(rawActC, `${r.label}\t${r.country || 'XX'}`); }
    else if (r.type === 'pv') { tally(rawPages, r.path); if (r.ref && !refSes.has(r.sid)) refSes.set(r.sid, r.ref); }
    else if (r.type === 'sec') tally(rawSecs, r.label);
  }
  const originS = new Map(); for (const h of refSes.values()) tally(originS, h);
  const directoS = sessions.filter((s) => s.pv > 0 && !refSes.has(s.sid)).length;
  if (directoS) originS.set('Directo / sin origen', directoS);
  for (const [k, v] of rawAct) m('accion_veces', k, '', v);
  for (const [k, v] of rawActC) { const [a, c] = k.split('\t'); m('accion_pais', a, c, v); }
  hours.forEach((v, h) => { if (v) m('hora_vistas', h, '', v); });
  for (const [k, v] of langs) m('idioma_sesiones', k === '?' ? 'sin_dato' : k, '', v);
  for (const [k, v] of devs) m('dispositivo_sesiones', k === '?' ? 'sin_dato' : k, '', v);
  for (const [k, v] of originS) m('origen_sesiones', k === 'Directo / sin origen' ? 'directo' : k, '', v);
  for (const [k, v] of rawPages) m('pagina_vistas', k, '', v);
  for (const [k, v] of rawSecs) m('seccion_vistas', k, '', v);
  [['lt10', 0, 10], ['10-30', 10, 30], ['30-60', 30, 60], ['60-180', 60, 180], ['gt180', 180, Infinity]].forEach(([k, a, b]) => m('tiempo_sesiones_rango', k, '', times.filter((t) => t >= a && t < b).length));
  const csvCell = (v) => (/[",\n\r]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v));
  const csv = ['fecha,metrica,dim1,dim2,valor', ...M.map((r) => r.map(csvCell).join(','))].join('\n') + '\n';

  /* ---- HTML con gráficos (tablas y divs con estilos en línea: se ven igual en Gmail, Outlook y Apple Mail) ---- */
  /* paleta del Hero y del logo: azul noche (#091A2D → #233F58), verde del “3” (#4FB27C), ámbar del atardecer (#E8A15A) y azul del resplandor (#6EB4FF) */
  const C = { navy: '#0F2A42', ink: '#1B2A41', mute: '#6B7A90', track: '#E6ECF3', bg: '#F3F6FA', teal: '#4FB27C', blue: '#6EB4FF', coral: '#E8A15A', amber: '#E8A15A', violet: '#233F58' };
  const PAL = [C.teal, C.blue, C.coral, C.violet, '#12735A', '#94A3B8'];
  const nf = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const none = `<p style="margin:6px 0;font-size:13px;color:${C.mute}">Sin datos todavía.</p>`;
  const h2 = (t, sub) => `<div style="margin:34px 0 12px"><div style="font-size:21px;line-height:1.25;font-weight:800;color:${C.navy}">${t}</div>${sub ? `<div style="font-size:13px;line-height:1.4;color:${C.mute};margin-top:3px">${sub}</div>` : ''}</div>`;
  const note = (t) => `<p style="margin:8px 0 0;font-size:12px;line-height:1.45;color:${C.mute}">${t}</p>`;

  const hbars = (items) => {
    if (!items.length) return none;
    const max = Math.max(1, ...items.map((i) => i.v));
    return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${items.map((i, k) => {
      const w = i.v ? Math.max(3, Math.round((i.v / max) * 100)) : 0;
      return `<tr><td width="36%" valign="middle" style="padding:6px 10px 6px 0;font-size:13px;line-height:1.3;color:${C.ink};font-weight:600">${i.label}${i.sub ? `<div style="font-size:11px;font-weight:400;color:${C.mute}">${i.sub}</div>` : ''}</td>
      <td valign="middle" style="padding:6px 0"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
        <td style="background:${C.track};border-radius:7px"><div style="width:${w}%;background:${i.color || PAL[k % PAL.length]};border-radius:7px;height:22px;line-height:22px;font-size:1px">&nbsp;</div></td>
        <td width="70" style="padding-left:9px;font-size:14px;font-weight:800;color:${C.navy};white-space:nowrap">${i.fmt || nf(i.v)}</td></tr></table></td></tr>`;
    }).join('')}</table>`;
  };

  const colbars = (items, o = {}) => {
    const H = o.h || 120, max = Math.max(1, ...items.map((i) => i.v));
    return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="table-layout:fixed"><tr>${items.map((i) => {
      const bh = i.v ? Math.max(4, Math.round((i.v / max) * H)) : 2;
      return `<td valign="bottom" align="center" style="padding:0 ${o.gap == null ? 4 : o.gap}px;height:${H + 20}px"><div style="font-size:${o.vs || 12}px;font-weight:800;color:${C.navy};line-height:18px">${i.v || o.zero === false ? (i.v ? nf(i.v) : '') : nf(i.v)}</div><div style="height:${bh}px;line-height:${bh}px;font-size:1px;background:${i.hl ? (o.hl || C.coral) : (o.color || C.blue)};border-radius:5px 5px 0 0">&nbsp;</div></td>`;
    }).join('')}</tr><tr>${items.map((i) => `<td align="center" style="padding-top:6px;font-size:${o.ls || 11}px;color:${i.hl ? C.navy : C.mute};font-weight:${i.hl ? 800 : 400}">${i.label}</td>`).join('')}</tr></table>`;
  };

  const stack = (items) => {
    const tot = items.reduce((a, i) => a + i.v, 0);
    if (!tot) return none;
    const parts = items.filter((i) => i.v > 0);
    const bar = `<div style="border-radius:8px;overflow:hidden"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>${parts.map((i, k) => {
      const p = Math.round((i.v / tot) * 100);
      return `<td width="${Math.max(p, 1)}%" align="center" style="background:${i.color || PAL[k % PAL.length]};height:30px;font-size:12px;font-weight:800;color:#fff">${p >= 10 ? p + ' %' : '&nbsp;'}</td>`;
    }).join('')}</tr></table></div>`;
    const legend = `<div style="margin-top:7px;font-size:12px;line-height:1.7;color:${C.ink}">${parts.map((i, k) => `<span style="white-space:nowrap;margin-right:12px"><span style="color:${i.color || PAL[k % PAL.length]};font-size:14px">●</span> ${i.label} <b>${nf(i.v)}</b></span>`).join(' ')}</div>`;
    return bar + legend;
  };

  const kpi = (label, val, sub, color) => `<td width="25%" valign="top" style="padding:0 4px"><div style="background:${C.bg};border-radius:12px;border-top:4px solid ${color};padding:12px 10px 10px;text-align:left"><div style="font-size:11px;font-weight:700;letter-spacing:.6px;text-transform:uppercase;color:${C.mute}">${label}</div><div style="font-size:28px;line-height:1.15;font-weight:800;color:${C.navy};margin-top:4px">${val}</div><div style="font-size:11px;color:${C.mute};margin-top:3px">${sub || '&nbsp;'}</div></div></td>`;

  const kpis = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:18px -4px 0;width:calc(100% + 8px)"><tr>
    ${kpi('Vistas', nf(pvTotal), prev ? `ayer ${prev.pv || 0}${delta(pvTotal, prev.pv || 0)}` : '', C.blue)}
    ${kpi('Visitantes', nf(visitors), prev ? `ayer ${prev.vis || 0}${delta(visitors, prev.vis || 0)}` : '', C.teal)}
    ${kpi('Sesiones', nf(nS), prev ? `ayer ${prev.ses || 0}${delta(nS, prev.ses || 0)}` : '', C.coral)}
    ${kpi('Tiempo medio', fmtT(avgTime).replace(' min ', 'm ').replace(' s', 's').replace(' h ', 'h '), `mediana ${fmtT(median(times))}`, C.violet)}
  </tr></table>`;

  const lead = !pvTotal && !nS
    ? 'No se registraron visitas este día.'
    : `${nf(pvTotal)} ${pvTotal === 1 ? 'vista' : 'vistas'} de ${nf(visitors)} ${visitors === 1 ? 'visitante' : 'visitantes'}${topC ? `, con ${countryName(topC[0])} a la cabeza` : ''}.`;
  const hlHtml = `<div style="font-size:19px;line-height:1.35;font-weight:800;color:${C.navy};margin-top:20px">${esc(lead)}</div>
    <ul style="margin:10px 0 0;padding-left:18px;font-size:14px;line-height:1.55;color:${C.ink}">${hl.slice(1).map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`;

  /* tendencia 7 días */
  const days7 = []; for (let i = 6; i >= 0; i--) { const d = shiftDay(day, -i); days7.push([d, tmap.get(d)]); }
  const sumPv = days7.reduce((a, [, t]) => a + (t ? t.pv : 0), 0);
  const trendChart = colbars(days7.map(([d, t]) => ({ label: `${esc(weekday(d).slice(0, 3))}<br>${dmy(d).slice(0, 5)}`, v: t ? t.pv : 0, hl: d === day })), { h: 120, gap: 6, vs: 13, ls: 11 });
  const histNote = hist && hist.pv ? ` Desde el ${dmy(hist.first)} hay ${nf(hist.pv)} vistas registradas (se conservan 90 días).` : '';

  /* países */
  const countryChart = hbars(countries.slice(0, 8).map(([c, o], k) => ({
    label: esc(countryLabel(c)), v: o.ses, color: k === 0 ? C.coral : C.blue,
    sub: `${pvByCountry.get(c) || 0} ${(pvByCountry.get(c) || 0) === 1 ? 'vista' : 'vistas'} · ${fmtT(avg(o.eng))}`, fmt: `${o.ses} ses.`,
  })));

  /* servicios y videos */
  const svcChart = hbars(svSorted.map((s, k) => ({
    label: esc(s.name), v: s.people, color: s.people ? (k === 0 ? C.coral : C.teal) : C.track,
    sub: s.people ? `${listStr(s.countries, 3)}${s.langs.size ? ` · ${top(s.langs).map(([l, v]) => `${esc(LANG_NAME[l] || l)} ${v}`).join(', ')}` : ''}` : 'sin clics',
    fmt: `${s.people} ${s.people === 1 ? 'visitante' : 'visitantes'}`,
  })));
  const watchChart = svRows.some((s) => s.secs) ? hbars([...svRows].filter((s) => s.secs).sort((a, b) => b.secs - a.secs).map((s) => ({
    label: esc(s.name), v: s.secs, color: C.violet, fmt: fmtT(s.secs), sub: `${s.manual} por clic · ${s.auto} automáticas · ${s.end} completaron`,
  }))) : none;
  const quotes = svRows.filter((s) => s.quote || s.more);
  const quoteLine = quotes.length ? note(`<b>Cotizaciones y “Ver más”:</b> ${quotes.map((s) => `${esc(s.name)} (${s.quote} cotiz., ${s.more} ver más)`).join(' · ')}`) : '';
  const autoTotal = svRows.reduce((a, s) => a + s.auto, 0);

  /* tiempo */
  const buckets = [['Menos de 10 s', 0, 10], ['10 – 30 s', 10, 30], ['30 s – 1 min', 30, 60], ['1 – 3 min', 60, 180], ['Más de 3 min', 180, Infinity]]
    .map(([l, a, b]) => [l, times.filter((t) => t >= a && t < b).length]);
  const timeChart = nS ? hbars(buckets.map(([l, n], k) => ({ label: l, v: n, color: ['#B9D5F3', C.blue, '#3D8FE0', C.violet, '#091A2D'][k], fmt: `${n} (${pct(n, nS)})` }))) : none;

  /* horas */
  const hmax = Math.max(...hours);
  const hoursChart = pvTotal ? colbars(hours.map((h, i) => ({ label: i % 3 === 0 ? String(i) : '', v: h, hl: h > 0 && h === hmax })), { h: 90, gap: 1, vs: 10, ls: 10, zero: false, color: C.teal, hl: C.coral }) : none;

  /* audiencia */
  const origin = originS;
  const langStack = stack(top(langs).map(([k, v], i) => ({ label: esc(LANG_NAME[k] || 'Sin dato'), v, color: PAL[i % PAL.length] })));
  const devStack = stack(top(devs).map(([k, v], i) => ({ label: esc(DEV_NAME[k] || 'Sin dato'), v, color: PAL[(i + 1) % PAL.length] })));
  const originStack = stack(top(origin, 6).map(([k, v], i) => ({ label: esc(k), v, color: PAL[(i + 2) % PAL.length] })));
  const sub3 = (t) => `<div style="font-size:12px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;color:${C.mute};margin:16px 0 6px">${t}</div>`;

  /* acciones */
  const actChart = act.size ? hbars(top(act).map(([n, v]) => ({ label: esc(n), v, color: C.amber, sub: listStr(actC.get(n), 3) }))) : none;
  const introNote = introPv ? note(`Intro de la portada: ${introSkip} de ${introPv} visitas la omitieron (${pct(introSkip, introPv)}).`) : '';

  /* páginas y secciones */
  const pagesChart = hbars(top(pages, 6).map(([k, v]) => ({ label: esc(k), v, color: C.blue })));
  const secsChart = secs.size ? hbars(top(secs, 6).map(([k, v]) => ({ label: esc(k), v, color: C.violet }))) : none;

  const teamHtml = T.ses.size
    ? `${h2('Tráfico del equipo', 'Navegadores marcados como internos. No están incluidos en ninguna cifra de arriba.')}<p style="margin:6px 0;font-size:14px;line-height:1.6;color:${C.ink}">${nf(T.pv)} ${T.pv === 1 ? 'vista' : 'vistas'} · ${nf(T.ses.size)} ${T.ses.size === 1 ? 'sesión' : 'sesiones'} · tiempo medio ${fmtT(tEng)} · ${nf(T.clicks)} ${T.clicks === 1 ? 'clic' : 'clics'}${T.countries.size ? ` · ${listStr(T.countries, 3)}` : ''}</p>`
    : '';
  const title = `${weekday(day)} ${dmy(day)}`;
  const banner = opts.banner ? `<tr><td style="background:${C.amber};padding:9px 24px;font-size:13px;font-weight:800;color:#3B2A00">${esc(opts.banner)}</td></tr>` : '';
  const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"></head>
<body style="margin:0;padding:0;background:#E9EEF4;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;-webkit-text-size-adjust:100%">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#E9EEF4"><tr><td align="center" style="padding:18px 8px">
<table role="presentation" width="680" cellpadding="0" cellspacing="0" style="max-width:680px;width:100%;background:#FFFFFF;border-radius:14px;overflow:hidden">
<tr><td style="background:#091A2D;background-image:linear-gradient(180deg,#050C18 0%,#0F2A42 70%,#233F58 100%);padding:24px 24px 22px"><div style="font-size:24px;font-weight:700;color:#FFFFFF;letter-spacing:2px">H<span style="color:#4FB27C">3</span>L</div><div style="font-size:12px;letter-spacing:2.5px;text-transform:uppercase;color:#C9D3E6;margin-top:2px">Global Energy</div>
<div style="font-size:16px;font-weight:700;color:#FFFFFF;margin-top:16px">Reporte diario del sitio</div><div style="font-size:13px;color:#C9D3E6;margin-top:2px">${esc(title)}</div></td></tr>
<tr><td style="background:#E8A15A;height:4px;line-height:4px;font-size:1px">&nbsp;</td></tr>
${banner}
<tr><td style="padding:6px 24px 26px">
${hlHtml}
${kpis}
${h2('Vistas de los últimos 7 días', `Hoy: ${nf(pvTotal)} · total de la semana: ${nf(sumPv)}.${histNote}`)}${trendChart}
${h2(topC ? `${esc(countryName(topC[0]))} lidera las visitas` : 'Visitas por país', 'Sesiones por país (con vistas y tiempo medio)')}${countryChart}
${h2(best ? `${esc(best.name)} es el servicio que más interesa` : 'Videos y servicios', 'Visitantes que hicieron clic (play, pantalla completa, sonido, cotizar o “Ver más”), con su país e idioma')}${svcChart}${quoteLine}
${h2('Tiempo visto de video', 'Segundos reproducidos por servicio')}${watchChart}${note(`${nf(autoTotal)} reproducciones arrancaron solas al llegar con el scroll; no cuentan como clic. Cada cifra cuenta una vez por visita de página.`)}
${h2('Tiempo navegando', `Tiempo activo por sesión. Rebote: ${bounce} sesiones (${pct(bounce, nS)}) con una sola página, sin clics y menos de 10 s.`)}${timeChart}
${h2(pvTotal ? `Hora pico: ${String(hours.indexOf(hmax)).padStart(2, '0')}:00` : 'Visitas por hora', 'Vistas por hora del día, hora de Argentina')}${hoursChart}
${h2('Contacto y otras acciones')}${actChart}${introNote}
${h2('Quién nos visita')}${sub3('Idioma')}${langStack}${sub3('Dispositivo')}${devStack}${sub3('Origen')}${originStack}
${h2('Páginas y secciones del sitio')}${sub3('Páginas')}${pagesChart}${sub3('Secciones del sitio principal')}${secsChart}
${teamHtml}
<p style="margin:30px 0 0;font-size:11px;color:#9AA7B8;line-height:1.5">Medición propia de www.h3lglobalenergy.com, sin cookies ni datos personales (no se guarda la IP; el país lo informa Cloudflare). Los visitantes se estiman por día y no incluyen bots ni navegadores con “No rastrear”. Día calculado en hora de Argentina (00:00 a 23:59).</p>
</td></tr></table></td></tr></table></body></html>`;

  /* ---- texto plano ---- */
  const L = [];
  L.push(`H3L Global Energy · Reporte diario del sitio · ${title}`, '', ...hl.map((x) => `- ${x}`), '');
  L.push(`Vistas ${pvTotal} | Visitantes ${visitors} | Sesiones ${nS} | Tiempo medio ${fmtT(avgTime)}`, '');
  if (countries.length) { L.push('PAÍSES'); countries.slice(0, 12).forEach(([c, o]) => L.push(`  ${countryName(c)}: ${o.ses} sesiones, ${pvByCountry.get(c) || 0} vistas, ${fmtT(avg(o.eng))}`)); L.push(''); }
  L.push('VIDEOS Y SERVICIOS (clic = play, pantalla completa, sonido, cotización o ver más)');
  svSorted.forEach((s) => L.push(`  ${s.name}: ${s.people} visitantes con clic, ${s.manual} reprod. por clic, ${s.auto} auto, tiempo visto ${s.secs ? fmtT(s.secs) : '—'}, ${s.quote} cotizaciones | ${[...s.countries.entries()].map(([c, v]) => `${countryName(c)} ${v}`).join(', ') || '—'}`));
  if (act.size) { L.push('', 'ACCIONES'); top(act).forEach(([n, v]) => L.push(`  ${n}: ${v}`)); }
  if (T.ses.size) L.push('', `TRÁFICO DEL EQUIPO (aparte, no incluido arriba): ${T.pv} vista(s), ${T.ses.size} sesión(es), ${T.clicks} clic(s), tiempo medio ${fmtT(tEng)}`);
  L.push('', 'ÚLTIMOS 7 DÍAS'); days7.forEach(([d, t]) => L.push(`  ${dmy(d)}: ${t ? t.pv : 0} vistas, ${t ? t.vis : 0} visitantes`));
  const text = L.join('\n');

  const subject = `H3L · Reporte diario ${weekday(day)} ${dmy(day)}: ${pvTotal} ${pvTotal === 1 ? 'vista' : 'vistas'}, ${visitors} ${visitors === 1 ? 'visitante' : 'visitantes'}`;
  return { subject, html, text, csv, metrics: M, csvName: `h3l_metricas_${day}.csv` };
}
