var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/report.js
var SERVICES = [
  ["reservas", "Reservas y recursos"],
  ["auditoria", "Auditor\xEDa energ\xE9tica"],
  ["emisiones", "Emisiones y compensaci\xF3n"],
  ["datos", "Ciencia de datos"],
  ["transicion", "Transici\xF3n energ\xE9tica"],
  ["plataformas", "Plataformas digitales"],
  ["geociencias", "Geociencias"],
  ["capacitacion", "Capacitaci\xF3n"]
];
var SVC_NAME = Object.fromEntries(SERVICES);
var PAGES = { "/": "Sitio principal", "/index.html": "Sitio principal", "/v2/": "Portada con intro", "/v2/index.html": "Portada con intro", "/v2/reservas.html": "Sala de reservas", "/v2/dashboards.html": "Tableros" };
var SECTIONS = { somos: "Qui\xE9nes somos", servicios: "Servicios", noticias: "Noticias Oil & Gas", eventos: "Eventos", contacto: "Contactos" };
var ACTIONS = { mailto: "Clic en el mail", tel: "Clic en el tel\xE9fono", linkedin: "Clic en LinkedIn", brochure: "Descarga del brochure", contact_send: "Formulario de contacto (Enviar)", chat_open: "Abri\xF3 el chat Copilot", intro_skip: "Omiti\xF3 la intro" };
var LANG_NAME = { es: "Espa\xF1ol", en: "English", fr: "Fran\xE7ais", pt: "Portugu\xEAs" };
var DEV_NAME = { movil: "M\xF3vil", tablet: "Tablet", escritorio: "Escritorio" };
var DAYS = ["domingo", "lunes", "martes", "mi\xE9rcoles", "jueves", "viernes", "s\xE1bado"];
function dayOf(ts, env) {
  const off = Number(env && env.TZ_OFFSET_MIN != null && env.TZ_OFFSET_MIN !== "" ? env.TZ_OFFSET_MIN : -180);
  return new Date((ts + off * 60) * 1e3).toISOString().slice(0, 10);
}
__name(dayOf, "dayOf");
function shiftDay(day, n) {
  const d = /* @__PURE__ */ new Date(day + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}
__name(shiftDay, "shiftDay");
var esc = /* @__PURE__ */ __name((s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]), "esc");
var dmy = /* @__PURE__ */ __name((day) => `${day.slice(8, 10)}/${day.slice(5, 7)}/${day.slice(0, 4)}`, "dmy");
var weekday = /* @__PURE__ */ __name((day) => DAYS[(/* @__PURE__ */ new Date(day + "T12:00:00Z")).getUTCDay()], "weekday");
var fmtT = /* @__PURE__ */ __name((s) => {
  s = Math.round(s || 0);
  if (s < 60) return `${s} s`;
  const m = Math.floor(s / 60);
  const r = s % 60;
  return m < 60 ? `${m} min ${r} s` : `${Math.floor(m / 60)} h ${m % 60} min`;
}, "fmtT");
var pct = /* @__PURE__ */ __name((a, b) => b ? `${Math.round(a / b * 100)} %` : "\u2014", "pct");
var avg = /* @__PURE__ */ __name((a) => a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0, "avg");
var median = /* @__PURE__ */ __name((a) => {
  if (!a.length) return 0;
  const s = [...a].sort((x, y) => x - y);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}, "median");
var regionNames = null;
function countryName(c) {
  if (c === "XX" || !c) return "Desconocido";
  if (c === "T1") return "Red Tor";
  try {
    regionNames = regionNames || new Intl.DisplayNames(["es"], { type: "region" });
    return regionNames.of(c) || c;
  } catch {
    return c;
  }
}
__name(countryName, "countryName");
function flag(c) {
  return /^[A-Z]{2}$/.test(c) && c !== "XX" && c !== "T1" ? String.fromCodePoint(...[...c].map((ch) => 127397 + ch.charCodeAt(0))) : "\u{1F310}";
}
__name(flag, "flag");
var countryLabel = /* @__PURE__ */ __name((c) => `${flag(c)} ${countryName(c)}`, "countryLabel");
function tally(map, key, by = 1) {
  map.set(key, (map.get(key) || 0) + by);
}
__name(tally, "tally");
var top = /* @__PURE__ */ __name((map, n = 99) => [...map.entries()].sort((a, b) => b[1] - a[1] || String(a[0]).localeCompare(String(b[0]))).slice(0, n), "top");
var listStr = /* @__PURE__ */ __name((map, n = 5) => map.size ? top(map, n).map(([c, v]) => `${esc(countryLabel(c))} ${v}`).join(" \xB7 ") : "\u2014", "listStr");
function delta(cur, prev) {
  if (prev == null) return "";
  if (!prev && !cur) return "";
  if (!prev) return ' <span style="color:#1a7f4b">\u25B2 nuevo</span>';
  const d = Math.round((cur - prev) / prev * 100);
  if (d === 0) return ' <span style="color:#6b7280">= igual</span>';
  return ` <span style="color:${d > 0 ? "#1a7f4b" : "#b42318"}">${d > 0 ? "\u25B2" : "\u25BC"} ${Math.abs(d)} %</span>`;
}
__name(delta, "delta");
async function buildReport(db, day, hosts, env, opts = {}) {
  const ph = hosts.map(() => "?").join(",");
  const rows = (await db.prepare(`SELECT ts, type, path, sid, vid, country, lang, dev, label, svc, n, ref FROM events WHERE day=? AND host IN (${ph})`).bind(day, ...hosts).all()).results || [];
  const trend = (await db.prepare(
    `SELECT day, SUM(type='pv') pv, COUNT(DISTINCT vid) vis, COUNT(DISTINCT sid) ses, SUM(CASE WHEN type='eng' THEN n ELSE 0 END) eng
     FROM events WHERE day BETWEEN ? AND ? AND host IN (${ph}) GROUP BY day`
  ).bind(shiftDay(day, -6), day, ...hosts).all()).results || [];
  const hist = await db.prepare(`SELECT COUNT(*) pv, MIN(day) first FROM events WHERE type='pv' AND host IN (${ph})`).bind(...hosts).first();
  const S = /* @__PURE__ */ new Map();
  const sess = /* @__PURE__ */ __name((r) => {
    let s = S.get(r.sid);
    if (!s) {
      s = { sid: r.sid, pv: 0, eng: 0, inter: 0, country: r.country, lang: "", dev: "", vid: r.vid };
      S.set(r.sid, s);
    }
    return s;
  }, "sess");
  const hours = new Array(24).fill(0);
  const off = Number(env && env.TZ_OFFSET_MIN != null && env.TZ_OFFSET_MIN !== "" ? env.TZ_OFFSET_MIN : -180);
  const pages = /* @__PURE__ */ new Map(), refs = /* @__PURE__ */ new Map(), langs = /* @__PURE__ */ new Map(), devs = /* @__PURE__ */ new Map(), secs = /* @__PURE__ */ new Map();
  let pvTotal = 0;
  for (const r of rows) {
    const s = sess(r);
    if (r.type === "pv") {
      s.pv++;
      pvTotal++;
      if (r.lang && !s.lang) s.lang = r.lang;
      if (r.dev && !s.dev) s.dev = r.dev;
      tally(pages, PAGES[r.path] || r.path);
      hours[new Date((r.ts + off * 60) * 1e3).getUTCHours()]++;
      if (r.ref) tally(refs, r.ref);
    } else if (r.type === "eng") s.eng += r.n || 0;
    else if (r.type === "vclick" || r.type === "click" || r.type === "vplay" && r.label === "manual") s.inter++;
  }
  const sessions = [...S.values()];
  const nS = sessions.length;
  const visitors = new Set(sessions.map((s) => s.vid)).size;
  const times = sessions.map((s) => s.eng);
  const bounce = sessions.filter((s) => s.pv <= 1 && s.inter === 0 && s.eng < 10).length;
  const withRef = new Set(rows.filter((r) => r.type === "pv" && r.ref).map((r) => r.sid));
  const directo = sessions.filter((s) => s.pv > 0 && !withRef.has(s.sid)).length;
  for (const s of sessions) {
    tally(langs, s.lang || "?");
    tally(devs, s.dev || "?");
  }
  for (const r of rows) if (r.type === "sec") tally(secs, SECTIONS[r.label] || r.label);
  const cMap = /* @__PURE__ */ new Map();
  for (const s of sessions) {
    const c = s.country || "XX";
    const o = cMap.get(c) || { ses: 0, eng: [] };
    o.ses++;
    o.eng.push(s.eng);
    cMap.set(c, o);
  }
  const pvByCountry = /* @__PURE__ */ new Map();
  for (const r of rows) if (r.type === "pv") tally(pvByCountry, r.country || "XX");
  const countries = [...cMap.entries()].sort((a, b) => b[1].ses - a[1].ses || (pvByCountry.get(b[0]) || 0) - (pvByCountry.get(a[0]) || 0));
  const sv = {};
  for (const [id] of SERVICES) sv[id] = { manual: 0, auto: 0, play: 0, fs: 0, snd: 0, quote: 0, more: 0, secs: 0, end: 0, cl: /* @__PURE__ */ new Map(), au: /* @__PURE__ */ new Map(), lg: /* @__PURE__ */ new Map(), inter: /* @__PURE__ */ new Set() };
  for (const r of rows) {
    const o = sv[r.svc];
    if (!o) continue;
    const c = r.country || "XX";
    if (r.type === "vplay") {
      if (r.label === "manual") {
        o.manual++;
        o.inter.add(r.sid);
        o.cl.set(r.sid, c);
        o.lg.set(r.sid, r.lang || "?");
      } else {
        o.auto++;
        o.au.set(r.sid, c);
      }
    } else if (r.type === "vclick") {
      o[r.label === "play" ? "play" : r.label === "fullscreen" ? "fs" : "snd"]++;
      o.inter.add(r.sid);
      o.cl.set(r.sid, c);
      o.lg.set(r.sid, r.lang || "?");
    } else if (r.type === "click" && (r.label === "quote" || r.label === "more")) {
      o[r.label]++;
      o.inter.add(r.sid);
      o.cl.set(r.sid, c);
      o.lg.set(r.sid, r.lang || "?");
    } else if (r.type === "vsec") o.secs += r.n || 0;
    else if (r.type === "vend") o.end++;
  }
  const cnt = /* @__PURE__ */ __name((m2) => {
    const t = /* @__PURE__ */ new Map();
    for (const c of m2.values()) tally(t, c);
    return t;
  }, "cnt");
  const svRows = SERVICES.map(([id, name]) => {
    const o = sv[id];
    return { id, name, clicks: o.play + o.fs + o.snd, manual: o.manual, auto: o.auto, quote: o.quote, more: o.more, secs: o.secs, end: o.end, people: o.inter.size, countries: cnt(o.cl), autoCountries: cnt(o.au), langs: cnt(o.lg) };
  });
  const svSorted = [...svRows].sort((a, b) => b.people + b.manual + b.quote - (a.people + a.manual + a.quote));
  const act = /* @__PURE__ */ new Map(), actC = /* @__PURE__ */ new Map();
  for (const r of rows) {
    if (r.type !== "click" || r.label === "quote" || r.label === "more") continue;
    const name = ACTIONS[r.label] || (r.label.startsWith("go:") ? `Bot\xF3n hacia \xAB${r.label.slice(3)}\xBB` : r.label);
    tally(act, name);
    const m2 = actC.get(name) || /* @__PURE__ */ new Map();
    tally(m2, r.country || "XX");
    actC.set(name, m2);
  }
  const introPv = rows.filter((r) => r.type === "pv" && (r.path === "/v2/" || r.path === "/v2/index.html")).length;
  const introSkip = rows.filter((r) => r.type === "click" && r.label === "intro_skip").length;
  const tmap = new Map(trend.map((t) => [t.day, t]));
  const prev = tmap.get(shiftDay(day, -1));
  const prior = [-1, -2, -3, -4, -5, -6].map((n) => tmap.get(shiftDay(day, n))).filter(Boolean);
  const avg7 = /* @__PURE__ */ __name((k) => prior.length ? avg(prior.map((p) => p[k] || 0)) : null, "avg7");
  const avgTime = avg(times);
  const totClicks = svRows.reduce((a, s) => a + s.people, 0);
  const best = svSorted[0] && svSorted[0].people + svSorted[0].manual + svSorted[0].quote > 0 ? svSorted[0] : null;
  const topC = countries[0];
  const peak = hours.indexOf(Math.max(...hours));
  const hl = [];
  if (!pvTotal && !nS) hl.push("No se registraron visitas este d\xEDa.");
  else {
    hl.push(`${pvTotal} vistas de p\xE1gina, ${visitors} ${visitors === 1 ? "visitante" : "visitantes"} y ${nS} ${nS === 1 ? "sesi\xF3n" : "sesiones"}; tiempo medio por sesi\xF3n: ${fmtT(avgTime)}.`);
    if (topC) hl.push(`Pa\xEDs con m\xE1s visitas: ${countryName(topC[0])} (${topC[1].ses} ${topC[1].ses === 1 ? "sesi\xF3n" : "sesiones"}).`);
    if (best) hl.push(`Servicio con m\xE1s interacci\xF3n: ${best.name} (${best.people} ${best.people === 1 ? "visitante hizo" : "visitantes hicieron"} clic${best.quote ? `, ${best.quote} pidieron cotizaci\xF3n` : ""}).`);
    else hl.push("Ning\xFAn visitante hizo clic en los videos o servicios.");
    if (hours[peak] > 0) hl.push(`Hora pico: ${String(peak).padStart(2, "0")}:00 a ${String(peak).padStart(2, "0")}:59 (hora de Argentina).`);
    const contact = (act.get("Formulario de contacto (Enviar)") || 0) + (act.get("Clic en el mail") || 0) + (act.get("Clic en el tel\xE9fono") || 0);
    if (contact) hl.push(`Intentos de contacto: ${contact}.`);
  }
  const M = [];
  const m = /* @__PURE__ */ __name((metrica, dim1, dim2, valor) => {
    if (Number.isFinite(valor)) M.push([day, metrica, dim1 == null ? "" : String(dim1), dim2 == null ? "" : String(dim2), Math.round(valor * 100) / 100]);
  }, "m");
  m("vistas", "", "", pvTotal);
  m("visitantes", "", "", visitors);
  m("sesiones", "", "", nS);
  m("tiempo_medio_s", "", "", avgTime);
  m("tiempo_mediano_s", "", "", median(times));
  m("rebote_sesiones", "", "", bounce);
  for (const [c, o] of countries) {
    m("pais_sesiones", c, "", o.ses);
    m("pais_vistas", c, "", pvByCountry.get(c) || 0);
    m("pais_tiempo_medio_s", c, "", avg(o.eng));
  }
  for (const s of svRows) {
    m("servicio_visitantes_clic", s.id, "", s.people);
    m("servicio_repro_clic", s.id, "", s.manual);
    m("servicio_repro_auto", s.id, "", s.auto);
    m("servicio_segundos_vistos", s.id, "", s.secs);
    m("servicio_completados", s.id, "", s.end);
    m("servicio_cotizaciones", s.id, "", s.quote);
    m("servicio_ver_mas", s.id, "", s.more);
    for (const [c, v] of s.countries) m("servicio_visitantes_clic_pais", s.id, c, v);
    for (const [l, v] of s.langs) m("servicio_visitantes_clic_idioma", s.id, l === "?" ? "sin_dato" : l, v);
    for (const [c, v] of s.autoCountries) m("servicio_repro_auto_pais", s.id, c, v);
  }
  const rawAct = /* @__PURE__ */ new Map(), rawActC = /* @__PURE__ */ new Map(), rawPages = /* @__PURE__ */ new Map(), rawSecs = /* @__PURE__ */ new Map(), refSes = /* @__PURE__ */ new Map();
  for (const r of rows) {
    if (r.type === "click" && r.label !== "quote" && r.label !== "more") {
      tally(rawAct, r.label);
      tally(rawActC, `${r.label}	${r.country || "XX"}`);
    } else if (r.type === "pv") {
      tally(rawPages, r.path);
      if (r.ref && !refSes.has(r.sid)) refSes.set(r.sid, r.ref);
    } else if (r.type === "sec") tally(rawSecs, r.label);
  }
  const originS = /* @__PURE__ */ new Map();
  for (const h of refSes.values()) tally(originS, h);
  const directoS = sessions.filter((s) => s.pv > 0 && !refSes.has(s.sid)).length;
  if (directoS) originS.set("Directo / sin origen", directoS);
  for (const [k, v] of rawAct) m("accion_veces", k, "", v);
  for (const [k, v] of rawActC) {
    const [a, c] = k.split("	");
    m("accion_pais", a, c, v);
  }
  hours.forEach((v, h) => {
    if (v) m("hora_vistas", h, "", v);
  });
  for (const [k, v] of langs) m("idioma_sesiones", k === "?" ? "sin_dato" : k, "", v);
  for (const [k, v] of devs) m("dispositivo_sesiones", k === "?" ? "sin_dato" : k, "", v);
  for (const [k, v] of originS) m("origen_sesiones", k === "Directo / sin origen" ? "directo" : k, "", v);
  for (const [k, v] of rawPages) m("pagina_vistas", k, "", v);
  for (const [k, v] of rawSecs) m("seccion_vistas", k, "", v);
  [["lt10", 0, 10], ["10-30", 10, 30], ["30-60", 30, 60], ["60-180", 60, 180], ["gt180", 180, Infinity]].forEach(([k, a, b]) => m("tiempo_sesiones_rango", k, "", times.filter((t) => t >= a && t < b).length));
  const csvCell = /* @__PURE__ */ __name((v) => /[",\n\r]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v), "csvCell");
  const csv = ["fecha,metrica,dim1,dim2,valor", ...M.map((r) => r.map(csvCell).join(","))].join("\n") + "\n";
  const C = { navy: "#0B2545", ink: "#1B2A41", mute: "#6B7A90", track: "#E8EDF4", bg: "#F5F7FB", teal: "#12B5A6", blue: "#3D7BFF", coral: "#FF6B57", amber: "#FFB020", violet: "#8B5CF6" };
  const PAL = [C.blue, C.teal, C.coral, C.amber, C.violet, "#94A3B8"];
  const nf = /* @__PURE__ */ __name((n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, "."), "nf");
  const none = `<p style="margin:6px 0;font-size:13px;color:${C.mute}">Sin datos todav\xEDa.</p>`;
  const h2 = /* @__PURE__ */ __name((t, sub) => `<div style="margin:34px 0 12px"><div style="font-size:21px;line-height:1.25;font-weight:800;color:${C.navy}">${t}</div>${sub ? `<div style="font-size:13px;line-height:1.4;color:${C.mute};margin-top:3px">${sub}</div>` : ""}</div>`, "h2");
  const note = /* @__PURE__ */ __name((t) => `<p style="margin:8px 0 0;font-size:12px;line-height:1.45;color:${C.mute}">${t}</p>`, "note");
  const hbars = /* @__PURE__ */ __name((items) => {
    if (!items.length) return none;
    const max = Math.max(1, ...items.map((i) => i.v));
    return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${items.map((i, k) => {
      const w = i.v ? Math.max(3, Math.round(i.v / max * 100)) : 0;
      return `<tr><td width="36%" valign="middle" style="padding:6px 10px 6px 0;font-size:13px;line-height:1.3;color:${C.ink};font-weight:600">${i.label}${i.sub ? `<div style="font-size:11px;font-weight:400;color:${C.mute}">${i.sub}</div>` : ""}</td>
      <td valign="middle" style="padding:6px 0"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
        <td style="background:${C.track};border-radius:7px"><div style="width:${w}%;background:${i.color || PAL[k % PAL.length]};border-radius:7px;height:22px;line-height:22px;font-size:1px">&nbsp;</div></td>
        <td width="70" style="padding-left:9px;font-size:14px;font-weight:800;color:${C.navy};white-space:nowrap">${i.fmt || nf(i.v)}</td></tr></table></td></tr>`;
    }).join("")}</table>`;
  }, "hbars");
  const colbars = /* @__PURE__ */ __name((items, o = {}) => {
    const H = o.h || 120, max = Math.max(1, ...items.map((i) => i.v));
    return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="table-layout:fixed"><tr>${items.map((i) => {
      const bh = i.v ? Math.max(4, Math.round(i.v / max * H)) : 2;
      return `<td valign="bottom" align="center" style="padding:0 ${o.gap == null ? 4 : o.gap}px;height:${H + 20}px"><div style="font-size:${o.vs || 12}px;font-weight:800;color:${C.navy};line-height:18px">${i.v || o.zero === false ? i.v ? nf(i.v) : "" : nf(i.v)}</div><div style="height:${bh}px;line-height:${bh}px;font-size:1px;background:${i.hl ? o.hl || C.coral : o.color || C.blue};border-radius:5px 5px 0 0">&nbsp;</div></td>`;
    }).join("")}</tr><tr>${items.map((i) => `<td align="center" style="padding-top:6px;font-size:${o.ls || 11}px;color:${i.hl ? C.navy : C.mute};font-weight:${i.hl ? 800 : 400}">${i.label}</td>`).join("")}</tr></table>`;
  }, "colbars");
  const stack = /* @__PURE__ */ __name((items) => {
    const tot = items.reduce((a, i) => a + i.v, 0);
    if (!tot) return none;
    const parts = items.filter((i) => i.v > 0);
    const bar = `<div style="border-radius:8px;overflow:hidden"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>${parts.map((i, k) => {
      const p = Math.round(i.v / tot * 100);
      return `<td width="${Math.max(p, 1)}%" align="center" style="background:${i.color || PAL[k % PAL.length]};height:30px;font-size:12px;font-weight:800;color:#fff">${p >= 10 ? p + " %" : "&nbsp;"}</td>`;
    }).join("")}</tr></table></div>`;
    const legend = `<div style="margin-top:7px;font-size:12px;line-height:1.7;color:${C.ink}">${parts.map((i, k) => `<span style="white-space:nowrap;margin-right:12px"><span style="color:${i.color || PAL[k % PAL.length]};font-size:14px">\u25CF</span> ${i.label} <b>${nf(i.v)}</b></span>`).join(" ")}</div>`;
    return bar + legend;
  }, "stack");
  const kpi = /* @__PURE__ */ __name((label, val, sub, color) => `<td width="25%" valign="top" style="padding:0 4px"><div style="background:${C.bg};border-radius:12px;border-top:4px solid ${color};padding:12px 10px 10px;text-align:left"><div style="font-size:11px;font-weight:700;letter-spacing:.6px;text-transform:uppercase;color:${C.mute}">${label}</div><div style="font-size:28px;line-height:1.15;font-weight:800;color:${C.navy};margin-top:4px">${val}</div><div style="font-size:11px;color:${C.mute};margin-top:3px">${sub || "&nbsp;"}</div></div></td>`, "kpi");
  const kpis = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:18px -4px 0;width:calc(100% + 8px)"><tr>
    ${kpi("Vistas", nf(pvTotal), prev ? `ayer ${prev.pv || 0}${delta(pvTotal, prev.pv || 0)}` : "", C.blue)}
    ${kpi("Visitantes", nf(visitors), prev ? `ayer ${prev.vis || 0}${delta(visitors, prev.vis || 0)}` : "", C.teal)}
    ${kpi("Sesiones", nf(nS), prev ? `ayer ${prev.ses || 0}${delta(nS, prev.ses || 0)}` : "", C.coral)}
    ${kpi("Tiempo medio", fmtT(avgTime).replace(" min ", "m ").replace(" s", "s").replace(" h ", "h "), `mediana ${fmtT(median(times))}`, C.amber)}
  </tr></table>`;
  const lead = !pvTotal && !nS ? "No se registraron visitas este d\xEDa." : `${nf(pvTotal)} ${pvTotal === 1 ? "vista" : "vistas"} de ${nf(visitors)} ${visitors === 1 ? "visitante" : "visitantes"}${topC ? `, con ${countryName(topC[0])} a la cabeza` : ""}.`;
  const hlHtml = `<div style="font-size:19px;line-height:1.35;font-weight:800;color:${C.navy};margin-top:20px">${esc(lead)}</div>
    <ul style="margin:10px 0 0;padding-left:18px;font-size:14px;line-height:1.55;color:${C.ink}">${hl.slice(1).map((x) => `<li>${esc(x)}</li>`).join("")}</ul>`;
  const days7 = [];
  for (let i = 6; i >= 0; i--) {
    const d = shiftDay(day, -i);
    days7.push([d, tmap.get(d)]);
  }
  const sumPv = days7.reduce((a, [, t]) => a + (t ? t.pv : 0), 0);
  const trendChart = colbars(days7.map(([d, t]) => ({ label: `${esc(weekday(d).slice(0, 3))}<br>${dmy(d).slice(0, 5)}`, v: t ? t.pv : 0, hl: d === day })), { h: 120, gap: 6, vs: 13, ls: 11 });
  const histNote = hist && hist.pv ? ` Desde el ${dmy(hist.first)} hay ${nf(hist.pv)} vistas registradas (se conservan 90 d\xEDas).` : "";
  const countryChart = hbars(countries.slice(0, 8).map(([c, o], k) => ({
    label: esc(countryLabel(c)),
    v: o.ses,
    color: k === 0 ? C.coral : C.blue,
    sub: `${pvByCountry.get(c) || 0} ${(pvByCountry.get(c) || 0) === 1 ? "vista" : "vistas"} \xB7 ${fmtT(avg(o.eng))}`,
    fmt: `${o.ses} ses.`
  })));
  const svcChart = hbars(svSorted.map((s, k) => ({
    label: esc(s.name),
    v: s.people,
    color: s.people ? k === 0 ? C.coral : C.teal : C.track,
    sub: s.people ? `${listStr(s.countries, 3)}${s.langs.size ? ` \xB7 ${top(s.langs).map(([l, v]) => `${esc(LANG_NAME[l] || l)} ${v}`).join(", ")}` : ""}` : "sin clics",
    fmt: `${s.people} ${s.people === 1 ? "visitante" : "visitantes"}`
  })));
  const watchChart = svRows.some((s) => s.secs) ? hbars([...svRows].filter((s) => s.secs).sort((a, b) => b.secs - a.secs).map((s) => ({
    label: esc(s.name),
    v: s.secs,
    color: C.violet,
    fmt: fmtT(s.secs),
    sub: `${s.manual} por clic \xB7 ${s.auto} autom\xE1ticas \xB7 ${s.end} completaron`
  }))) : none;
  const quotes = svRows.filter((s) => s.quote || s.more);
  const quoteLine = quotes.length ? note(`<b>Cotizaciones y \u201CVer m\xE1s\u201D:</b> ${quotes.map((s) => `${esc(s.name)} (${s.quote} cotiz., ${s.more} ver m\xE1s)`).join(" \xB7 ")}`) : "";
  const autoTotal = svRows.reduce((a, s) => a + s.auto, 0);
  const buckets = [["Menos de 10 s", 0, 10], ["10 \u2013 30 s", 10, 30], ["30 s \u2013 1 min", 30, 60], ["1 \u2013 3 min", 60, 180], ["M\xE1s de 3 min", 180, Infinity]].map(([l, a, b]) => [l, times.filter((t) => t >= a && t < b).length]);
  const timeChart = nS ? hbars(buckets.map(([l, n], k) => ({ label: l, v: n, color: ["#9DB8FF", "#6F98FF", C.blue, "#2A5FD6", C.navy][k], fmt: `${n} (${pct(n, nS)})` }))) : none;
  const hmax = Math.max(...hours);
  const hoursChart = pvTotal ? colbars(hours.map((h, i) => ({ label: i % 3 === 0 ? String(i) : "", v: h, hl: h > 0 && h === hmax })), { h: 90, gap: 1, vs: 10, ls: 10, zero: false, color: C.teal, hl: C.coral }) : none;
  const origin = originS;
  const langStack = stack(top(langs).map(([k, v], i) => ({ label: esc(LANG_NAME[k] || "Sin dato"), v, color: PAL[i % PAL.length] })));
  const devStack = stack(top(devs).map(([k, v], i) => ({ label: esc(DEV_NAME[k] || "Sin dato"), v, color: PAL[(i + 1) % PAL.length] })));
  const originStack = stack(top(origin, 6).map(([k, v], i) => ({ label: esc(k), v, color: PAL[(i + 2) % PAL.length] })));
  const sub3 = /* @__PURE__ */ __name((t) => `<div style="font-size:12px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;color:${C.mute};margin:16px 0 6px">${t}</div>`, "sub3");
  const actChart = act.size ? hbars(top(act).map(([n, v]) => ({ label: esc(n), v, color: C.amber, sub: listStr(actC.get(n), 3) }))) : none;
  const introNote = introPv ? note(`Intro de la portada: ${introSkip} de ${introPv} visitas la omitieron (${pct(introSkip, introPv)}).`) : "";
  const pagesChart = hbars(top(pages, 6).map(([k, v]) => ({ label: esc(k), v, color: C.blue })));
  const secsChart = secs.size ? hbars(top(secs, 6).map(([k, v]) => ({ label: esc(k), v, color: C.violet }))) : none;
  const title = `${weekday(day)} ${dmy(day)}`;
  const banner = opts.banner ? `<tr><td style="background:${C.amber};padding:9px 24px;font-size:13px;font-weight:800;color:#3B2A00">${esc(opts.banner)}</td></tr>` : "";
  const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"></head>
<body style="margin:0;padding:0;background:#EAEFF6;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;-webkit-text-size-adjust:100%">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#EAEFF6"><tr><td align="center" style="padding:18px 8px">
<table role="presentation" width="680" cellpadding="0" cellspacing="0" style="max-width:680px;width:100%;background:#FFFFFF;border-radius:14px;overflow:hidden">
<tr><td style="background:${C.navy};padding:22px 24px 20px"><div style="font-size:22px;font-weight:800;color:#fff;letter-spacing:1.5px">H<span style="color:#2DD4BF">3</span>L <span style="font-weight:400;font-size:13px;letter-spacing:0;color:#9FB3C8">Global Energy</span></div>
<div style="font-size:15px;font-weight:700;color:#fff;margin-top:12px">Reporte diario del sitio</div><div style="font-size:13px;color:#BCD0E3;margin-top:2px">${esc(title)}</div></td></tr>
${banner}
<tr><td style="padding:6px 24px 26px">
${hlHtml}
${kpis}
${h2("Vistas de los \xFAltimos 7 d\xEDas", `Hoy: ${nf(pvTotal)} \xB7 total de la semana: ${nf(sumPv)}.${histNote}`)}${trendChart}
${h2(topC ? `${esc(countryName(topC[0]))} lidera las visitas` : "Visitas por pa\xEDs", "Sesiones por pa\xEDs (con vistas y tiempo medio)")}${countryChart}
${h2(best ? `${esc(best.name)} es el servicio que m\xE1s interesa` : "Videos y servicios", "Visitantes que hicieron clic (play, pantalla completa, sonido, cotizar o \u201CVer m\xE1s\u201D), con su pa\xEDs e idioma")}${svcChart}${quoteLine}
${h2("Tiempo visto de video", "Segundos reproducidos por servicio")}${watchChart}${note(`${nf(autoTotal)} reproducciones arrancaron solas al llegar con el scroll; no cuentan como clic. Cada cifra cuenta una vez por visita de p\xE1gina.`)}
${h2("Tiempo navegando", `Tiempo activo por sesi\xF3n. Rebote: ${bounce} sesiones (${pct(bounce, nS)}) con una sola p\xE1gina, sin clics y menos de 10 s.`)}${timeChart}
${h2(pvTotal ? `Hora pico: ${String(hours.indexOf(hmax)).padStart(2, "0")}:00` : "Visitas por hora", "Vistas por hora del d\xEDa, hora de Argentina")}${hoursChart}
${h2("Contacto y otras acciones")}${actChart}${introNote}
${h2("Qui\xE9n nos visita")}${sub3("Idioma")}${langStack}${sub3("Dispositivo")}${devStack}${sub3("Origen")}${originStack}
${h2("P\xE1ginas y secciones del sitio")}${sub3("P\xE1ginas")}${pagesChart}${sub3("Secciones del sitio principal")}${secsChart}
<p style="margin:30px 0 0;font-size:11px;color:#9AA7B8;line-height:1.5">Medici\xF3n propia de www.h3lglobalenergy.com, sin cookies ni datos personales (no se guarda la IP; el pa\xEDs lo informa Cloudflare). Los visitantes se estiman por d\xEDa y no incluyen bots ni navegadores con \u201CNo rastrear\u201D. D\xEDa calculado en hora de Argentina (00:00 a 23:59).</p>
</td></tr></table></td></tr></table></body></html>`;
  const L = [];
  L.push(`H3L Global Energy \xB7 Reporte diario del sitio \xB7 ${title}`, "", ...hl.map((x) => `- ${x}`), "");
  L.push(`Vistas ${pvTotal} | Visitantes ${visitors} | Sesiones ${nS} | Tiempo medio ${fmtT(avgTime)}`, "");
  if (countries.length) {
    L.push("PA\xCDSES");
    countries.slice(0, 12).forEach(([c, o]) => L.push(`  ${countryName(c)}: ${o.ses} sesiones, ${pvByCountry.get(c) || 0} vistas, ${fmtT(avg(o.eng))}`));
    L.push("");
  }
  L.push("VIDEOS Y SERVICIOS (clic = play, pantalla completa, sonido, cotizaci\xF3n o ver m\xE1s)");
  svSorted.forEach((s) => L.push(`  ${s.name}: ${s.people} visitantes con clic, ${s.manual} reprod. por clic, ${s.auto} auto, tiempo visto ${s.secs ? fmtT(s.secs) : "\u2014"}, ${s.quote} cotizaciones | ${[...s.countries.entries()].map(([c, v]) => `${countryName(c)} ${v}`).join(", ") || "\u2014"}`));
  if (act.size) {
    L.push("", "ACCIONES");
    top(act).forEach(([n, v]) => L.push(`  ${n}: ${v}`));
  }
  L.push("", "\xDALTIMOS 7 D\xCDAS");
  days7.forEach(([d, t]) => L.push(`  ${dmy(d)}: ${t ? t.pv : 0} vistas, ${t ? t.vis : 0} visitantes`));
  const text = L.join("\n");
  const subject = `H3L \xB7 Reporte diario ${weekday(day)} ${dmy(day)}: ${pvTotal} ${pvTotal === 1 ? "vista" : "vistas"}, ${visitors} ${visitors === 1 ? "visitante" : "visitantes"}`;
  return { subject, html, text, csv, metrics: M, csvName: `h3l_metricas_${day}.csv` };
}
__name(buildReport, "buildReport");

// src/worker.js
var TYPES = /* @__PURE__ */ new Set(["pv", "eng", "sec", "vclick", "vplay", "vsec", "vend", "click"]);
var SERVICES2 = /* @__PURE__ */ new Set(["reservas", "auditoria", "emisiones", "datos", "transicion", "plataformas", "geociencias", "capacitacion"]);
var LANGS = /* @__PURE__ */ new Set(["es", "en", "fr", "pt"]);
var DEVS = /* @__PURE__ */ new Set(["movil", "tablet", "escritorio"]);
var BOT_RE = /bot|crawl|spider|slurp|headless|lighthouse|pagespeed|preview|monitor|uptime|curl|wget|python|node-fetch|axios|java\/|go-http|facebookexternalhit|whatsapp|telegram/i;
var MAX_BODY = 8e3;
var MAX_EVENTS = 12;
var MAX_PER_VISITOR_DAY = 400;
var RETENTION_DAYS = 90;
var SCHEMA = [
  `CREATE TABLE IF NOT EXISTS events (id INTEGER PRIMARY KEY AUTOINCREMENT, ts INTEGER NOT NULL, day TEXT NOT NULL, host TEXT NOT NULL, type TEXT NOT NULL, path TEXT, sid TEXT, pvid TEXT, vid TEXT, country TEXT, lang TEXT, dev TEXT, label TEXT, svc TEXT, n REAL, ref TEXT, ukey TEXT UNIQUE)`,
  `CREATE INDEX IF NOT EXISTS events_day ON events (day, type)`,
  `CREATE INDEX IF NOT EXISTS events_vid ON events (day, vid)`,
  `CREATE TABLE IF NOT EXISTS meta (k TEXT PRIMARY KEY, v TEXT)`,
  `CREATE TABLE IF NOT EXISTS reports (day TEXT PRIMARY KEY, sent_at INTEGER, error TEXT)`,
  `CREATE TABLE IF NOT EXISTS metrics (day TEXT NOT NULL, metric TEXT NOT NULL, dim1 TEXT NOT NULL DEFAULT '', dim2 TEXT NOT NULL DEFAULT '', value REAL NOT NULL, PRIMARY KEY (day, metric, dim1, dim2))`
];
var schemaReady = null;
function ensureSchema(env) {
  if (!schemaReady) {
    schemaReady = env.DB.batch(SCHEMA.map((s) => env.DB.prepare(s))).catch((e) => {
      schemaReady = null;
      throw e;
    });
  }
  return schemaReady;
}
__name(ensureSchema, "ensureSchema");
var hex = /* @__PURE__ */ __name((buf) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join(""), "hex");
async function sha(text) {
  return hex(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text)));
}
__name(sha, "sha");
async function getSalt(env) {
  const row = await env.DB.prepare(`SELECT v FROM meta WHERE k='salt'`).first();
  if (row) return row.v;
  const salt = hex(crypto.getRandomValues(new Uint8Array(16)));
  await env.DB.prepare(`INSERT OR IGNORE INTO meta (k, v) VALUES ('salt', ?)`).bind(salt).run();
  return (await env.DB.prepare(`SELECT v FROM meta WHERE k='salt'`).first()).v;
}
__name(getSalt, "getSalt");
var clean = /* @__PURE__ */ __name((s, re, max) => typeof s === "string" && s.length <= max && re.test(s) ? s : "", "clean");
var ID_RE = /^[a-z0-9]{8,16}$/;
function sanitize(ev, ownHost) {
  if (!ev || typeof ev !== "object" || !TYPES.has(ev.t)) return null;
  const out = {
    type: ev.t,
    sid: clean(ev.sid, ID_RE, 16),
    pvid: clean(ev.pv, ID_RE, 16),
    path: clean(ev.p, /^\/[A-Za-z0-9/._~-]*$/, 120) || "/",
    lang: LANGS.has(ev.l) ? ev.l : "",
    dev: DEVS.has(ev.dev) ? ev.dev : "",
    label: clean(ev.k, /^[a-z0-9:_-]{1,30}$/, 30),
    svc: SERVICES2.has(ev.s) ? ev.s : "",
    n: Math.min(86400, Math.max(0, Number.isFinite(+ev.n) ? Math.round(+ev.n) : 0)),
    ref: clean(ev.ref, /^[a-z0-9.-]{3,80}$/i, 80).toLowerCase()
  };
  if (!out.sid || !out.pvid) return null;
  if (out.ref === ownHost || out.ref === ownHost.replace(/^www\./, "")) out.ref = "";
  return out;
}
__name(sanitize, "sanitize");
function keyOf(e) {
  const base = `${e.type}|${e.pvid}`;
  if (e.type === "pv") return base;
  if (e.type === "eng") return base;
  return `${base}|${e.label}|${e.svc}`;
}
__name(keyOf, "keyOf");
async function collect(request, env, ctx) {
  const url = new URL(request.url);
  const origin = request.headers.get("Origin");
  const sameOrigin = origin ? safeHost(origin) === url.host : request.headers.get("Sec-Fetch-Site") === "same-origin";
  if (!sameOrigin) return new Response(null, { status: 204 });
  const ua = request.headers.get("User-Agent") || "";
  if (!ua || BOT_RE.test(ua) || request.cf && request.cf.verifiedBotCategory) return new Response(null, { status: 204 });
  const text = await request.text();
  if (text.length > MAX_BODY) return new Response(null, { status: 204 });
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    return new Response(null, { status: 204 });
  }
  const list = Array.isArray(data && data.events) ? data.events.slice(0, MAX_EVENTS) : [];
  const events = list.map((e) => sanitize(e, url.host)).filter(Boolean);
  if (!events.length) return new Response(null, { status: 204 });
  ctx.waitUntil(store(request, env, url.host, events).catch((e) => console.error("collect", e && e.message)));
  return new Response(null, { status: 204 });
}
__name(collect, "collect");
function safeHost(u) {
  try {
    return new URL(u).host;
  } catch {
    return "";
  }
}
__name(safeHost, "safeHost");
async function store(request, env, host, events) {
  await ensureSchema(env);
  const now = Math.floor(Date.now() / 1e3);
  const day = dayOf(now, env);
  const ip = request.headers.get("CF-Connecting-IP") || "";
  const ua = request.headers.get("User-Agent") || "";
  const vid = (await sha(`${await getSalt(env)}|${day}|${ip}|${ua}`)).slice(0, 16);
  const country = (request.cf && request.cf.country || "XX").toUpperCase().slice(0, 2);
  const used = await env.DB.prepare(`SELECT COUNT(*) c FROM events WHERE day=? AND vid=?`).bind(day, vid).first();
  if (used && used.c >= MAX_PER_VISITOR_DAY) return;
  const upsert = `INSERT INTO events (ts, day, host, type, path, sid, pvid, vid, country, lang, dev, label, svc, n, ref, ukey)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    ON CONFLICT(ukey) DO UPDATE SET n = MAX(COALESCE(events.n,0), COALESCE(excluded.n,0)), ts = excluded.ts`;
  await env.DB.batch(events.map((e) => env.DB.prepare(upsert).bind(
    now,
    day,
    host,
    e.type,
    e.path,
    e.sid,
    e.pvid,
    vid,
    country,
    e.lang,
    e.dev,
    e.label,
    e.svc,
    e.n,
    e.ref,
    keyOf(e)
  )));
}
__name(store, "store");
function hostsOf(env) {
  return String(env.REPORT_HOSTS || "www.h3lglobalenergy.com,h3lglobalenergy.com").split(",").map((s) => s.trim()).filter(Boolean);
}
__name(hostsOf, "hostsOf");
async function saveMetrics(env, day, rows) {
  const db = env.DB;
  await db.prepare(`DELETE FROM metrics WHERE day=?`).bind(day).run();
  const ins = `INSERT OR REPLACE INTO metrics (day, metric, dim1, dim2, value) VALUES (?,?,?,?,?)`;
  for (let k = 0; k < rows.length; k += 50) {
    await db.batch(rows.slice(k, k + 50).map((r) => db.prepare(ins).bind(...r)));
  }
}
__name(saveMetrics, "saveMetrics");
async function sendReport(env, day, { test = false, banner = "" } = {}) {
  await ensureSchema(env);
  const rep = await buildReport(env.DB, day, hostsOf(env), env, { banner: test ? banner || "Env\xEDo de prueba" : "" });
  await saveMetrics(env, day, rep.metrics);
  const subject = `${test ? "[PRUEBA] " : ""}${rep.subject}`;
  await env.EMAIL.send({
    to: env.REPORT_TO,
    from: { email: env.REPORT_FROM, name: "H3L Global Energy \xB7 Reportes" },
    subject,
    html: rep.html,
    text: rep.text,
    attachments: [{
      filename: rep.csvName,
      content: new TextEncoder().encode("\uFEFF" + rep.csv).buffer,
      type: "text/csv",
      disposition: "attachment"
    }]
  });
  return rep;
}
__name(sendReport, "sendReport");
async function runDaily(env) {
  await ensureSchema(env);
  const today = dayOf(Math.floor(Date.now() / 1e3), env);
  const yesterday = shiftDay(today, -1);
  const failed = await env.DB.prepare(`SELECT day FROM reports WHERE sent_at IS NULL AND day >= ? AND day < ? ORDER BY day`).bind(shiftDay(today, -4), yesterday).all();
  const days = [...(failed.results || []).map((r) => r.day), yesterday];
  for (const day of days) {
    const done = await env.DB.prepare(`SELECT sent_at FROM reports WHERE day=?`).bind(day).first();
    if (done && done.sent_at) continue;
    try {
      await sendReport(env, day);
      await env.DB.prepare(`INSERT INTO reports (day, sent_at, error) VALUES (?, ?, NULL) ON CONFLICT(day) DO UPDATE SET sent_at=excluded.sent_at, error=NULL`).bind(day, Math.floor(Date.now() / 1e3)).run();
    } catch (e) {
      console.error("report", day, e && (e.code || e.message));
      await env.DB.prepare(`INSERT INTO reports (day, sent_at, error) VALUES (?, NULL, ?) ON CONFLICT(day) DO UPDATE SET error=excluded.error`).bind(day, String(e && (e.code || e.message) || e).slice(0, 200)).run();
    }
  }
  await env.DB.prepare(`DELETE FROM events WHERE day < ?`).bind(shiftDay(today, -RETENTION_DAYS)).run();
}
__name(runDaily, "runDaily");
function timingSafeEqual(a, b) {
  const x = new TextEncoder().encode(a), y = new TextEncoder().encode(b);
  if (x.length !== y.length) return false;
  let r = 0;
  for (let i = 0; i < x.length; i++) r |= x[i] ^ y[i];
  return r === 0;
}
__name(timingSafeEqual, "timingSafeEqual");
async function reportTest(request, env) {
  if (!env.REPORT_KEY) return new Response("Not found", { status: 404 });
  if (!timingSafeEqual(request.headers.get("x-report-key") || "", env.REPORT_KEY)) return new Response("Unauthorized", { status: 401 });
  const url = new URL(request.url);
  const today = dayOf(Math.floor(Date.now() / 1e3), env);
  const day = /^\d{4}-\d{2}-\d{2}$/.test(url.searchParams.get("day") || "") ? url.searchParams.get("day") : shiftDay(today, -1);
  if (url.searchParams.get("format") === "csv") {
    await ensureSchema(env);
    const rep = await buildReport(env.DB, day, hostsOf(env), env);
    return new Response(rep.csv, { headers: { "content-type": "text/csv; charset=utf-8", "content-disposition": `attachment; filename="${rep.csvName}"`, "cache-control": "no-store" } });
  }
  if (url.searchParams.get("preview") === "1") {
    await ensureSchema(env);
    const rep = await buildReport(env.DB, day, hostsOf(env), env, { banner: (url.searchParams.get("banner") || "").slice(0, 160) });
    return new Response(rep.html, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" } });
  }
  try {
    const rep = await sendReport(env, day, { test: true, banner: (url.searchParams.get("banner") || "").slice(0, 160) });
    return Response.json({ ok: true, day, subject: rep.subject, to: env.REPORT_TO });
  } catch (e) {
    return Response.json({ ok: false, day, error: String(e && (e.code || e.message) || e) }, { status: 500 });
  }
}
__name(reportTest, "reportTest");
async function exportMetrics(request, env) {
  if (!env.REPORT_KEY) return new Response("Not found", { status: 404 });
  if (!timingSafeEqual(request.headers.get("x-report-key") || "", env.REPORT_KEY)) return new Response("Unauthorized", { status: 401 });
  await ensureSchema(env);
  const url = new URL(request.url);
  const ok = /* @__PURE__ */ __name((v) => /^\d{4}-\d{2}-\d{2}$/.test(v || ""), "ok");
  const from = ok(url.searchParams.get("from")) ? url.searchParams.get("from") : "2000-01-01";
  const to = ok(url.searchParams.get("to")) ? url.searchParams.get("to") : "2999-12-31";
  const rows = (await env.DB.prepare(`SELECT day, metric, dim1, dim2, value FROM metrics WHERE day BETWEEN ? AND ? ORDER BY day, metric, dim1, dim2`).bind(from, to).all()).results || [];
  const cell = /* @__PURE__ */ __name((v) => /[",\n\r]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v), "cell");
  const csv = ["fecha,metrica,dim1,dim2,valor", ...rows.map((r) => [r.day, r.metric, r.dim1, r.dim2, r.value].map(cell).join(","))].join("\n") + "\n";
  return new Response(csv, { headers: { "content-type": "text/csv; charset=utf-8", "cache-control": "no-store" } });
}
__name(exportMetrics, "exportMetrics");
var worker_default = {
  async fetch(request, env, ctx) {
    const { pathname } = new URL(request.url);
    if (pathname === "/api/collect" && request.method === "POST") return collect(request, env, ctx);
    if (pathname === "/api/report-test" && request.method === "POST") return reportTest(request, env);
    if (pathname === "/api/export" && request.method === "GET") return exportMetrics(request, env);
    if (pathname.startsWith("/api/")) return new Response("Not found", { status: 404 });
    return env.ASSETS.fetch(request);
  },
  async scheduled(event, env, ctx) {
    ctx.waitUntil(runDaily(env));
  }
};

// ../.npm/_npx/d77349f55c2be1c0/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// ../.npm/_npx/d77349f55c2be1c0/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    const body = JSON.stringify(error);
    const headers = {
      "Content-Type": "application/json",
      "MF-Experimental-Error-Stack": "true"
    };
    const encoded = encodeURIComponent(body);
    if (encoded.length <= 8192) {
      headers["MF-Experimental-Error-Stack-Payload"] = encoded;
    }
    return new Response(body, { status: 500, headers });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-woCybl/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = worker_default;

// ../.npm/_npx/d77349f55c2be1c0/node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-woCybl/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  scheduledTime;
  cron;
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=worker.js.map
