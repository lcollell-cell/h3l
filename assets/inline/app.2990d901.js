/* H3L — pruebas numéricas del motor de cálculo. Valores esperados calculados a mano o tomados de ejemplos publicados. */
(function (root) {
  'use strict';
  function correr(C) {
    var out = [];
    function cerca(nombre, real, esp, tol) {
      var ok = typeof real === 'number' && isFinite(real) && Math.abs(real - esp) <= tol;
      out.push({ nombre: nombre, ok: ok, detalle: 'obtenido ' + (typeof real === 'number' ? +real.toPrecision(6) : real) + ' · esperado ' + esp + ' ± ' + tol });
    }
    function cond(nombre, ok, detalle) { out.push({ nombre: nombre, ok: !!ok, detalle: detalle || '' }); }
    var r;
    // Rose
    r = C.rose({ reservorio: 0.9, estructura: 0.8, carga: 0.9, trampa: 0.5, analogos: [{ tam: 5 }, { tam: 20 }, { tam: 50 }, { tam: 120 }], tamMin: 10 });
    cerca('Rose: Pg = 0.9×0.8×0.9×0.5', r.pg, 0.324, 1e-9);
    cerca('Rose: Pec = 3 de 4 análogos', r.pec, 0.75, 1e-9);
    cerca('Rose: Pcom = Pg × Pec', r.pcom, 0.243, 1e-9);
    cond('Rose: factor limitante = trampa', r.limitante && r.limitante.id === 'trampa');
    r = C.rose({ reservorio: 0.5, estructura: 0.5, carga: 0.5, trampa: 0.5, vpExito: 100, costoFallo: 10 });
    cerca('Rose: VME con Pg = 0.0625', r.emv, 0.0625 * 100 - 0.9375 * 10, 1e-9);
    cond('Rose: rechaza probabilidad 0', C.rose({ reservorio: 0, estructura: 1, carga: 1, trampa: 1 }).errores.length > 0);
    cond('Rose: avisa si supera 0.95', C.rose({ reservorio: 0.99, estructura: 0.5, carga: 0.5, trampa: 0.5 }).avisos.length > 0);
    // Bayes
    r = C.actualizarPg({ a_reservorio: 0.6, a_estructura: 0.5, a_carga: 1, a_trampa: 1, b_reservorio: 0.6, b_estructura: 0.5, b_carga: 1, b_trampa: 1, compartido: 'reservorio', resultado: 'seco' });
    cerca('Bayes: p=0.6, q=0.5, pozo seco → 0.4286', r.posterior, 0.3 / 0.7, 1e-4);
    r = C.actualizarPg({ a_reservorio: 0.6, a_estructura: 0.5, a_carga: 1, a_trampa: 1, b_reservorio: 0.6, b_estructura: 0.5, b_carga: 1, b_trampa: 1, compartido: 'reservorio', resultado: 'descubrimiento' });
    cerca('Bayes: descubrimiento → 1', r.posterior, 1, 1e-12);
    // Tiempo-profundidad
    r = C.tiempoProfundidad({ modo: 'int', filas: [{ t: 1000, v: 2000 }, { t: 2000, v: 3000 }], twtConsulta: 1500 });
    cerca('T-Z: espesor capa 1', r.capas[0].espesor, 1000, 1e-9);
    cerca('T-Z: profundidad total', r.zTotal, 2500, 1e-9);
    cerca('T-Z: profundidad a 1500 ms', r.consulta.z, 1750, 1e-9);
    r = C.tiempoProfundidad({ modo: 'rms', filas: [{ t: 1000, v: 2000 }, { t: 2000, v: 2500 }] });
    cerca('Dix: Vint', r.capas[1].vint, Math.sqrt((2500 * 2500 * 2000 - 2000 * 2000 * 1000) / 1000), 1e-6);
    cerca('Dix: Vint = 2915.5 m/s', r.capas[1].vint, 2915.5, 0.1);
    // Petrofísica
    r = C.petrofisica({ rhoMa: 2.65, rhoF: 1.0, grMin: 30, grMax: 120, rw: 0.05, a: 1, m: 2, n: 2, rsh: 5, phiC: 0.08, vshC: 0.4, swC: 0.6, metodoSw: 'archie', vshTipo: 'lineal',
      filas: [{ z: 1000, gr: 30, rhob: 2.32, rt: 20 }, { z: 1001, gr: 30, rhob: 2.32, rt: 20 }] });
    cerca('Petrofísica: φ densidad = 0.2', r.filas[0].phi, 0.2, 1e-9);
    cerca('Petrofísica: Archie Sw = 0.25', r.filas[0].sw, 0.25, 1e-9);
    cerca('Petrofísica: Vsh en arena limpia = 0', r.filas[0].vsh, 0, 1e-12);
    r = C.petrofisica({ rhoMa: 2.65, rhoF: 1.0, grMin: 30, grMax: 120, rw: 0.05, a: 1, m: 2, n: 2, rsh: 5, phiC: 0.08, vshC: 0.4, swC: 0.6, metodoSw: 'simandoux', vshTipo: 'lineal',
      filas: [{ z: 1000, gr: 30, rhob: 2.32, rt: 20 }, { z: 1001, gr: 30, rhob: 2.32, rt: 20 }] });
    cerca('Simandoux sin arcilla = Archie', r.filas[0].sw, 0.25, 1e-9);
    // Volumetría
    var fx = function (v) { return { d: 'fija', a: v }; };
    r = C.volumetriaMC({ tipo: 'oil', n: 1000, vars: { area: fx(640), h: fx(50), phi: fx(0.2), sw: fx(0.3), bo: fx(1.2), rf: fx(0.25) } });
    cerca('Volumetría: in situ 28.9632 MMSTB', r.inplace.media, 28.9632, 1e-4);
    cerca('Volumetría: recuperable 7.2408 MMSTB', r.recup.media, 7.2408, 1e-4);
    r = C.volumetriaMC({ tipo: 'oil', n: 20000, semilla: 7, vars: { area: { d: 'tri', a: 200, b: 400, c: 800 }, h: { d: 'tri', a: 20, b: 40, c: 70 }, phi: { d: 'tri', a: 0.1, b: 0.16, c: 0.22 }, sw: { d: 'tri', a: 0.2, b: 0.35, c: 0.5 }, bo: fx(1.25), rf: { d: 'tri', a: 0.15, b: 0.25, c: 0.35 } } });
    cond('Volumetría: P90 < P50 < P10', r.recup.p90 < r.recup.p50 && r.recup.p50 < r.recup.p10, r.recup.p90.toFixed(2) + ' / ' + r.recup.p50.toFixed(2) + ' / ' + r.recup.p10.toFixed(2));
    var r2 = C.volumetriaMC({ tipo: 'oil', n: 20000, semilla: 7, vars: { area: { d: 'tri', a: 200, b: 400, c: 800 }, h: { d: 'tri', a: 20, b: 40, c: 70 }, phi: { d: 'tri', a: 0.1, b: 0.16, c: 0.22 }, sw: { d: 'tri', a: 0.2, b: 0.35, c: 0.5 }, bo: fx(1.25), rf: { d: 'tri', a: 0.15, b: 0.25, c: 0.35 } } });
    cond('Volumetría: misma semilla, mismo resultado', r.recup.p50 === r2.recup.p50);
    r = C.volumetriaMC({ tipo: 'gas', n: 1000, presion: 3000, temp: 200, z: 0.9, vars: { area: fx(640), h: fx(50), phi: fx(0.2), sw: fx(0.3), rf: fx(0.7) } });
    cerca('Volumetría gas: Bg = 0.02827·0.9·659.67/3000', r.bg, 0.02827 * 0.9 * 659.67 / 3000, 1e-9);
    // Espaciamiento
    r = C.espaciamiento({ modo: 'ac', area: 640, h: 50, phi: 0.2, sw: 0.3, bo: 1.2, rf: 0.25, lista: [{ val: 80 }], costoPozo: 5, margen: 20 });
    cerca('Espaciamiento: EUR por pozo a 80 ac', r.filas[0].eurPozo, 905100, 1);
    cerca('Espaciamiento: pozos a 80 ac', r.filas[0].pozos, 8, 0);
    cerca('Espaciamiento: radio equivalente (ft)', r.filas[0].radio, 1053, 1);
    cerca('Espaciamiento: EUR mínimo = 250 000 STB', r.eurMin, 250000, 1e-6);
    // NPT
    r = C.analisisNPT({ plan: [{ dia: 0, prof: 0 }, { dia: 20, prof: 3000 }], real: [{ dia: 0, prof: 0 }, { dia: 24, prof: 3000 }], eventos: [{ cat: 'Equipo', h: 40 }, { cat: 'Pozo', h: 56.2 }] });
    cerca('NPT: % sobre tiempo total', r.nptPct, 96.2 / (24 * 24) * 100, 1e-6);
    cerca('NPT: desvío de días', r.desvio, 4, 1e-9);
    // Corrosión
    r = C.corrosion({ tIni: 12.7, tPrev: 10, tAct: 8.5, tMin: 6, anosTotal: 10, anosInt: 4, intMax: 5, criterio: 'LT' });
    cerca('Corrosión: CR largo plazo', r.crLT, 0.42, 1e-9);
    cerca('Corrosión: CR corto plazo', r.crST, 0.375, 1e-9);
    cerca('Corrosión: vida remanente (LT)', r.vr, 2.5 / 0.42, 1e-9);
    cerca('Corrosión: próxima inspección = ½ vida', r.proxima, 2.5 / 0.42 / 2, 1e-9);
    r = C.tMinB313({ P: 600, D: 6.625, S: 20000, E: 1, Y: 0.4, W: 1 });
    cerca('B31.3: t_min = PD/(2(SEW+PY))', r.t, 600 * 6.625 / (2 * (20000 + 240)), 1e-9);
    // RBI
    r = C.rbi({ ivBajo: 10, ivMedio: 5, ivMA: 3, ivAlto: 1, filas: [{ nombre: 'A', pof: 4, cof: 5 }, { nombre: 'B', pof: 2, cof: 2 }, { nombre: 'C', pof: 3, cof: 4, vr: 4 }] });
    cond('RBI: orden por riesgo', r.filas[0].nombre === 'A' && r.filas[0].nivel === 'Alto');
    cond('RBI: bajo = 10 años', r.filas[2].intervalo === 10 && r.filas[2].nivel === 'Bajo');
    cond('RBI: limitado por ½ vida remanente', r.filas[1].intervalo === 2 && r.filas[1].nivel === 'Medio-alto');
    // Separador
    r = C.separadorVertical({ qg: 10, sg: 0.65, P: 500, T: 100, Z: 0.9, rhoL: 50, K: 0.12, qo: 1000, qw: 0, tret: 3, hGas: 4 });
    cerca('Separador: ρg = 2.7·γ·P/(Z·T)', r.rhoG, 2.7 * 0.65 * 500 / (0.9 * 559.67), 1e-9);
    cond('Separador: diámetro estándar ≥ mínimo', r.dStd >= r.dMin, 'mín ' + r.dMin.toFixed(1) + ' in → ' + r.dStd + ' in');
    r = C.tanque({ q: 1000, dias: 3, ff: 0.8, alturas: [{ h: 24 }] });
    cerca('Tanque: volumen nominal 3750 bbl', r.vNom, 3750, 1e-9);
    cerca('Tanque: volumen geométrico = V', Math.PI * r.filas[0].d * r.filas[0].d / 4 * 24 / 5.6146, 3750, 1e-6);
    // Línea
    r = C.lineaLiquido({ q: 10000, rho: 62.4, mu: 1, id: 4.026, L: 1000, eps: 0.0018, dz: 0, Ccoef: 100 });
    cerca('Línea: velocidad ≈ 7.35 ft/s', r.v, 7.35, 0.05);
    cerca('Línea: Re ≈ 229 000', r.Re, 229000, 5000);
    cerca('Línea: ΔP por 1000 ft ≈ 20 psi', r.dpFric, 20, 4);
    // Crack
    r = C.crackSpread({ crudo: 80, gasolina: 2.5, diesel: 2.7 });
    cerca('Crack 3-2-1 = 27.8 USD/bbl', r.esquemas[0].crack, (2 * 2.5 * 42 + 2.7 * 42 - 240) / 3, 1e-9);
    cerca('Crack 3-2-1 (valor)', r.esquemas[0].crack, 27.8, 1e-9);
    // Easy%Ro
    r = C.easyRo({ modo: 'T', filas: [{ edad: 100, v: 20 }, { edad: 0, v: 20 }] });
    cond('Easy%Ro: historia fría ≈ inmaduro (< 0.30 %Ro)', r.ro < 0.3, r.ro.toFixed(3));
    var a = C.easyRo({ modo: 'T', filas: [{ edad: 100, v: 80 }, { edad: 0, v: 80 }] }).ro, b = C.easyRo({ modo: 'T', filas: [{ edad: 100, v: 120 }, { edad: 0, v: 120 }] }).ro, c = C.easyRo({ modo: 'T', filas: [{ edad: 100, v: 160 }, { edad: 0, v: 160 }] }).ro;
    cond('Easy%Ro: crece con la temperatura', a < b && b < c, a.toFixed(2) + ' < ' + b.toFixed(2) + ' < ' + c.toFixed(2));
    cond('Easy%Ro: 100 Ma a 120 °C ≈ ventana de petróleo/gas (0.7–2.0)', b > 0.7 && b < 2.0, b.toFixed(2));
    cond('Easy%Ro: tope teórico ≈ 4.7', C.easyRo({ modo: 'T', filas: [{ edad: 500, v: 300 }, { edad: 0, v: 300 }] }).ro < 4.8);
    // Rock-Eval
    r = C.rockEval({ toc: 3, s2: 12, tmax: 440 });
    cerca('Rock-Eval: HI = 400', r.hi, 400, 1e-9);
    cond('Rock-Eval: Tipo II, calidad muy buena', r.querogeno.indexOf('Tipo II') === 0 && r.calidad === 'Muy buena');
    // Upstream
    var base = { capex: 50, qi: 1000, D: 0.3, anios: 10, precio: 70, regalia: 0.12, opexVar: 10, opexFijo: 1, tasaImp: 0.3, tasaDesc: 0.1, delta: 0.2 };
    r = C.tornadoUpstream(base);
    cond('Tornado upstream: VAN finito y precio entre las variables principales', isFinite(r.npv) && r.tornado.filas.slice(0, 3).some(function (x) { return x.id === 'precio'; }), 'VAN ' + r.npv.toFixed(2));
    cond('Tornado upstream: VAN crece con el precio', r.tornado.filas.filter(function (x) { return x.id === 'precio'; })[0].alto > r.npv);
    cond('Breakeven: VAN ≈ 0 en el precio de equilibrio', (function () { var o = Object.assign({}, base); o.precio = r.breakeven; var v = C.tornadoUpstream(Object.assign({}, o)); return Math.abs(v.npv) < 0.01; })(), 'P* = ' + (r.breakeven || NaN).toFixed(2));
    // Downstream
    r = C.tornadoDownstream({ thr: 100000, util: 0.9, dias: 350, crudo: 80, pG: 2.5, pD: 2.7, pO: 40, yG: 0.45, yD: 0.35, yO: 0.2, opex: 4, capex: 200, anios: 10, tasaImp: 0.3, tasaDesc: 0.1, delta: 0.2 });
    cond('Tornado downstream: margen unitario coherente', Math.abs(r.margenUnit - (0.45 * 2.5 * 42 + 0.35 * 2.7 * 42 + 0.2 * 40 - 80 - 4)) < 1e-9, r.margenUnit.toFixed(2));
    cond('Tornado downstream: crudo y productos dominan', ['crudo', 'pG', 'pD'].indexOf(r.tornado.filas[0].id) >= 0);

    // PVT
    r = C.pvt({ fluido: 'oil', api: 35, sg: 0.7, T: 180, rsb: 500, co: 1e-5, pmax: 4000, paso: 500 });
    cerca('PVT Standing: Pb (Rs 500, API 35, γg 0,7, 180 °F) ≈ 2240 psia', r.pb, 2240, 5);
    cerca('PVT Standing: Bo en Pb ≈ 1,276', r.bob, 1.276, 0.003);
    cond('PVT: Rs y Bo coinciden con los de burbuja en Pb', Math.abs(C.pvt({ fluido: 'oil', api: 35, sg: 0.7, T: 180, rsb: 500, co: 1e-5, pmax: 2240, paso: 2240 }).filas[0].Rs - 500) < 2);
    cond('PVT: Bo decrece al subir P sobre Pb', r.filas[r.filas.length - 1].Bo < r.filas[r.filas.length - 2].Bo || r.filas[r.filas.length - 1].P < r.pb);
    r = C.pvt({ fluido: 'gas', sg: 0.65, T: 200, pmax: 3000, paso: 1000 });
    cerca('PVT gas: Bg = 0,02827·z·T/p a 3000 psia', r.filas[2].Bg, 0.02827 * r.filas[2].z * 659.67 / 3000, 1e-9);
    cond('PVT gas: z entre 0,8 y 1,1', r.filas.every(function (f) { return f.z > 0.8 && f.z < 1.1; }));
    // p/z
    r = C.balanceGas({ pab: 500, filas: [{ p: 4000, z: 1, gp: 0 }, { p: 3600, z: 1, gp: 10 }, { p: 3200, z: 1, gp: 20 }, { p: 2800, z: 1, gp: 30 }] });
    cerca('p/z: G = 100 (recta exacta)', r.G, 100, 1e-9);
    cerca('p/z: Gp al abandono (500 psia, z = 1) = 87,5', r.gpAb, 87.5, 1e-9);
    cerca('p/z: factor de recuperación = 0,875', r.rf, 0.875, 1e-9);
    cond('p/z: rechaza pendiente positiva', C.balanceGas({ pab: 500, filas: [{ p: 2000, z: 1, gp: 0 }, { p: 3000, z: 1, gp: 10 }, { p: 3500, z: 1, gp: 20 }] }).errores.length > 0);
    // Declinación
    var ex = [1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 18, 21, 24, 30].map(function (t) { return { t: t, q: 800 * Math.exp(-0.1 * t) }; });
    r = C.declinacion({ filas: ex, qlim: 20, tmax: 600, modoB: 'auto' });
    cerca('Arps: recupera Di = 0,10 /mes (datos exponenciales exactos)', r.di, 0.1, 0.002);
    cerca('Arps: recupera b = 0', r.b, 0, 1e-9);
    cerca('Arps: EUR exponencial = (qi − q_lim)/Di × 30,4375', r.eur.np, (800 - 20) / 0.1 * 30.4375, 2500);
    var hy = [1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 18, 21, 24, 30].map(function (t) { return { t: t, q: 800 / (1 + 0.15 * t) }; });
    r = C.declinacion({ filas: hy, qlim: 15, tmax: 360, modoB: 'auto' });
    cerca('Arps hiperbólica (b = 1): EUR = qi/Di·ln(qi/q)·30,4375', r.eur.np, 800 / 0.15 * Math.log(800 / 15) * 30.4375, 5000);
    cond('Arps: P90 ≤ P50 ≤ P10', r.p90 <= r.p50 && r.p50 <= r.p10);
    // Core
    r = C.coreLog({ kcorte: 0.1, filas: [0.1, 0.15, 0.2, 0.25, 0.3].map(function (p) { return { phi: p, k: Math.pow(10, -2 + 15 * p), phiLog: p + 0.02 }; }) });
    cerca('Core: pendiente b = 15', r.b, 15, 1e-9);
    cerca('Core: φ de corte para k = 0,1 mD = 0,0667', r.phiCorte, 1 / 15, 1e-9);
    cerca('Core: sesgo del perfil = +0,02', r.perfil.bias, 0.02, 1e-9);

    // Horner
    var pst = 3000, mm = 50, tp = 720, dts = [1, 2, 4, 8, 16, 32, 64, 120];
    var hb = { q: 500, B: 1.2, mu: 0.8, h: 40, phi: 0.18, ct: 1.5e-5, rw: 0.35, tp: tp, pwf: 2200, filas: dts.map(function (d) { return { dt: d, p: pst - mm * Math.log10((tp + d) / d) }; }) };
    r = C.horner(hb);
    cerca('Horner: pendiente m = 50 psi/ciclo', r.m, 50, 1e-6);
    cerca('Horner: p* = 3000 psi', r.pstar, 3000, 1e-6);
    cerca('Horner: kh = 162,6·q·B·μ/m', r.kh, 162.6 * 500 * 1.2 * 0.8 / 50, 1e-6);
    var kk = r.kh / 40, p1 = 3000 - 50 * Math.log10(721), sk = 1.151 * ((p1 - 2200) / 50 - Math.log10(kk / (0.18 * 0.8 * 1.5e-5 * 0.35 * 0.35)) + 3.23);
    cerca('Horner: skin según la fórmula', r.skin, sk, 1e-6);
    cond('Horner: rechaza pendiente negativa', C.horner(Object.assign({}, hb, { filas: dts.map(function (d) { return { dt: d, p: 3000 - d }; }) })).errores.length > 0);
    // Balance de petróleo
    var boi = 1.3, rsi = 600, bgi = 0.0012, Nv = 10000, pv = [[3000, 1.27, 540, 0.00125], [2500, 1.23, 470, 0.0014], [2000, 1.19, 400, 0.0017], [1500, 1.15, 330, 0.0023]];
    var mb = pv.map(function (a) { var Eo = (a[1] - boi) + (rsi - a[2]) * a[3], F = Nv * Eo, rpv = 700, np = F / (a[1] + (rpv - a[2]) * a[3]); return { p: a[0], np: np, rp: rpv, bo: a[1], rs: a[2], bg: a[3] }; });
    r = C.balancePetroleo({ boi: boi, rsi: rsi, bgi: bgi, m: 0, bw: 1, filas: mb });
    cerca('Balance petróleo: recupera N = 10 000 MSTB', r.N, 10000, 1e-6);
    cerca('Balance petróleo: R² = 1', r.r2, 1, 1e-9);
    // ===== Herramientas agregadas en la auditoría de cobertura =====
    // Sello
    r = C.sello({ pd: 100, pdRes: 0, rhoW: 1.05, rhoH: 0.8, base: 'res' });
    cerca('Sello: h = 100/(1,05−0,8)·0,433 = 173,2 ft', r.hSello, 100 / 0.25 * 0.433, 1e-9);
    r = C.sello({ pd: 480, pdRes: 0, rhoW: 1.05, rhoH: 0.8, base: 'lab', sigmaLab: 480, thetaLab: 140, sigmaRes: 30, thetaRes: 0 });
    cerca('Sello: factor lab→reservorio = 30/(480·|cos140°|)', r.factor, 30 / Math.abs(480 * Math.cos(140 * Math.PI / 180)), 1e-9);
    cond('Sello: reservorio con Pd ≥ sello → error', C.sello({ pd: 10, pdRes: 20, rhoW: 1.05, rhoH: 0.8, base: 'res' }).errores.length > 0);
    r = C.sello({ pd: 20, pdRes: 0, rhoW: 1.05, rhoH: 0.8, base: 'res', cierre: 500 });
    cond('Sello: limita el sello si h < cierre', r.limita === 'sello' && r.hEfectiva === r.hSello);
    // Agregación
    var ag = [{ nombre: 'A', p90: 10, p50: 20, p10: 40 }, { nombre: 'B', p90: 5, p50: 10, p10: 20 }, { nombre: 'C', p90: 20, p50: 40, p10: 80 }];
    r = C.agregacion({ filas: ag, rho: 1, n: 40000, semilla: 5 });
    cerca('Agregación: ρ = 1 → P50 estadístico ≈ ΣP50 (70)', r.est.p50, 70, 0.7);
    r = C.agregacion({ filas: ag, rho: 0, n: 40000, semilla: 5 });
    cond('Agregación: ρ = 0 → P90 estadístico > ΣP90 aritmético', r.est.p90 > r.arit.p90, r.est.p90.toFixed(2) + ' vs ' + r.arit.p90);
    var mediaT = ag.reduce(function (s, a) { var sg = Math.log(a.p10 / a.p90) / (2 * 1.2815515655446004); return s + Math.sqrt(a.p10 * a.p90) * Math.exp(sg * sg / 2); }, 0);
    cerca('Agregación: media estadística ≈ suma de medias', r.est.media, mediaT, mediaT * 0.015);
    cond('Agregación: rechaza P90 ≥ P50', C.agregacion({ filas: [{ p90: 10, p50: 5, p10: 40 }, ag[1]], rho: 0.5 }).errores.length > 0);
    // Límite económico
    r = C.limiteEconomico({ precio: 60, regalia: 0, opexVar: 10, opexFijo: 1000, qi: 200, di: 0.2, b: 0, contrato: 0 });
    cerca('Límite económico: qEL = 1.000.000/(365·50) = 54,79 bbl/d', r.base.qel, 1e6 / (365 * 50), 1e-6);
    cerca('Límite económico: reservas (b = 0) = (qi − qEL)/Di·365', r.base.np, (200 - 1e6 / (365 * 50)) / 0.2 * 365, 1);
    cond('Límite económico: más precio → más reservas', r.sens[6].np > r.sens[0].np);
    cond('Límite económico: margen no positivo → error', C.limiteEconomico({ precio: 8, regalia: 0, opexVar: 10, opexFijo: 100, qi: 100, di: 0.2, b: 0 }).errores.length > 0);
    // Conciliación
    r = C.conciliacion({ ini: 100, rev: 5, rm: 2, ext: 10, compras: 3, ventas: 1, prod: 12 });
    cerca('Conciliación: final = 107', r.fin, 107, 1e-9);
    cerca('Conciliación: RRR orgánico = 17/12', r.rrrOrg, 17 / 12, 1e-9);
    cerca('Conciliación: RRR total = 19/12', r.rrrTot, 19 / 12, 1e-9);
    cerca('Conciliación: R/P = 107/12', r.rp, 107 / 12, 1e-9);
    cond('Conciliación: avisa si no cierra con lo informado', C.conciliacion({ ini: 100, rev: 5, rm: 2, ext: 10, compras: 3, ventas: 1, prod: 12, finRep: 120 }).avisos.some(function (a) { return /no cierra/.test(a); }));
    // Control de pozo
    var ks = { omw: 10, tvd: 10000, md: 10000, sidpp: 500, sicp: 700, scrp: 800, bomba: 0.1, ganancia: 20, zapato: 5000, lot: 1500, lotMw: 9.5, hoyo: 8.5, dcOD: 6.5, dcID: 2.8125, dcLen: 600, dpOD: 5, dpID: 4.276 };
    r = C.killSheet(ks);
    cerca('Control de pozo: KMW exacto = 500/(0,052·10000)+10', r.kmwExacto, 500 / 520 + 10, 1e-9);
    cerca('Control de pozo: KMW redondeado hacia arriba = 11,0', r.kmw, 11.0, 1e-9);
    cerca('Control de pozo: ICP = SCRP + SIDPP', r.icp, 1300, 1e-9);
    cerca('Control de pozo: FCP = SCRP·KMW/MW', r.fcp, 880, 1e-9);
    cerca('Control de pozo: MWmáx del LOT = 15,2', r.mwMax, 15.2, 1e-9);
    cerca('Control de pozo: MAASP = (15,2 − 10)·0,052·5000', r.maasp, 5.2 * 0.052 * 5000, 1e-6);
    cerca('Control de pozo: capacidad DP = ID²/1029,4', r.capDP, 4.276 * 4.276 / 1029.4, 1e-12);
    cond('Control de pozo: SICP > MAASP → aviso', C.killSheet(Object.assign({}, ks, { sicp: 1500 })).avisos.some(function (a) { return /MAASP/.test(a); }));
    // Volúmenes y cementación
    r = C.volumenesPozo({ bomba: 0.1, spm: 60, sarta: [{ nombre: 'DP', id: 4.276, L: 5000 }], anular: [{ nombre: 'Pozo-DP', D: 8.5, d: 5, L: 5000, exc: 20 }], rendimiento: 1.2, agua: 5.2 });
    cerca('Volúmenes: capacidad anular = (8,5²−5²)/1029,4', r.anular[0].cap, (72.25 - 25) / 1029.4, 1e-12);
    cerca('Volúmenes: strokes totales', r.strokesTotal, (4.276 * 4.276 / 1029.4 * 5000 + (72.25 - 25) / 1029.4 * 5000) / 0.1, 1e-6);
    cerca('Cementación: sacos = bbl·5,615/rendimiento', r.cemento.sacos, r.cemento.vAnularExc * 5.615 / 1.2, 1e-9);
    // Eaton
    r = C.eaton({ obg: 1.0, gh: 0.465, exp: 3, nu: 0.4, filas: [{ z: 10000, dto: 100, dtn: 80 }] });
    var ppT = 10000 - (10000 - 4650) * Math.pow(0.8, 3);
    cerca('Eaton: Pp = Sv − (Sv−Ph)(Δtn/Δto)³', r.filas[0].pp, ppT, 1e-6);
    cerca('Eaton: gradiente de fractura (ν = 0,4)', r.filas[0].fg, 0.4 / 0.6 * (10000 - ppT) / 10000 + ppT / 10000, 1e-9);
    cerca('Eaton: tendencia normal → Pp = hidrostática', C.eaton({ obg: 1, gh: 0.465, exp: 3, nu: 0.4, filas: [{ z: 8000, dto: 90, dtn: 90 }] }).filas[0].pp, 0.465 * 8000, 1e-6);
    // Deliverabilidad de gas
    var pr0 = 3360, a0 = 200, b0 = 0.0936, qs = [2000, 3500, 5000, 6500], dg = qs.map(function (q) { return { q: q, pwf: Math.sqrt(pr0 * pr0 - a0 * q - b0 * q * q) }; });
    r = C.gasDeliverability({ pr: pr0, filas: dg });
    var aofT = (-a0 + Math.sqrt(a0 * a0 + 4 * b0 * (pr0 * pr0 - 14.7 * 14.7))) / (2 * b0);
    cerca('Deliverabilidad: a (LIT) recuperado', r.a, a0, 1e-6);
    cerca('Deliverabilidad: b (LIT) recuperado', r.b, b0, 1e-9);
    cerca('Deliverabilidad: AOF LIT analítico', r.aofLIT, aofT, 1e-3);
    cond('Deliverabilidad: AOF back-pressure cercano al de LIT (±8 %)', Math.abs(r.aofBP / r.aofLIT - 1) < 0.08, r.aofBP.toFixed(0) + ' vs ' + r.aofLIT.toFixed(0));
    // Buckley–Leverett
    var bl = { swc: 0.2, sor: 0.2, krwMax: 0.4, kroMax: 0.9, nw: 2, no: 2, muw: 1, muo: 5 };
    r = C.buckleyLeverett(bl);
    cerca('Welge: fw′(Swf) = fw(Swf)/(Swf − Swc)', r.dfwf, r.fwf / (r.swf - 0.2), r.dfwf * 2e-3);
    cerca('Welge: PVI a la ruptura = 1/fw′(Swf)', r.pviBt, 1 / r.dfwf, 1e-9);
    cerca('Welge: recuperación a la ruptura (PV) = PVI de ruptura', r.recBt, r.pviBt, 2e-3);
    cond('Buckley–Leverett: movilidad desfavorable (M>1) con μo = 5·μw y estos extremos', r.M > 1, 'M = ' + r.M.toFixed(2));
    cond('Buckley–Leverett: recuperación final < 1 − Swc − Sor', r.post[r.post.length - 1].rec < 0.6 + 1e-9);
    // Hall
    var hf = []; for (var hh = 0; hh < 8; hh++) hf.push({ dias: 30, vol: 30000, pwi: 2500, pavg: 2000 });
    r = C.hall({ filas: hf });
    cerca('Hall: pendiente = Δp·Δt/volumen = 0,5 psi·d/bbl', r.s1, 0.5, 1e-9);
    cerca('Hall: índice de inyectividad = 2 bbl/d/psi', r.iiProm, 2, 1e-9);
    hf = hf.map(function (x, i) { return i < 4 ? x : { dias: 30, vol: 30000, pwi: 3000, pavg: 2000 }; });
    cerca('Hall: pendiente se duplica con el doble de Δp', C.hall({ filas: hf }).s2 / C.hall({ filas: hf }).s1, 2, 1e-9);
    // VRR
    r = C.vrr({ filas: [{ per: '1', winj: 10000, np: 5000, wp: 2000, bo: 1.2, bw: 1 }] });
    cerca('VRR = 10000/(5000·1,2 + 2000) = 1,25', r.vrrAcum, 1.25, 1e-9);
    // Corrosión por CO2
    r = C.co2corr({ T: 60, P: 1, pCO2: 1 });
    var T60 = 333.15, phi1 = Math.pow(10, 1 * (0.0031 - 1.4 / T60));
    cerca('CO₂: log CR sin incrustación (de Waard–Milliams 1991)', Math.log10(r.crSin), 5.8 - 1710 / T60 + 0.67 * Math.log10(phi1), 1e-9);
    cond('CO₂: más temperatura hasta ~60 °C aumenta la velocidad (sin incrustación)', C.co2corr({ T: 80, P: 10, pCO2: 1 }).crSin > C.co2corr({ T: 40, P: 10, pCO2: 1 }).crSin);
    cond('CO₂: incrustación reduce la velocidad a 120 °C', C.co2corr({ T: 120, P: 20, pCO2: 2 }).cr < C.co2corr({ T: 120, P: 20, pCO2: 2 }).crSin);
    // Recipientes
    r = C.recipiente({ tipo: 'cil', P: 300, S: 20000, E: 0.85, CA: 0.0625, D: 60 });
    cerca('ASME VIII-1: cilindro circunferencial t = PR/(SE−0,6P)', r.formulas[0][1].replace('t = ', '') * 1, 300 * 30 / (20000 * 0.85 - 0.6 * 300), 6e-5);
    r = C.recipiente({ tipo: 'elip', P: 300, S: 20000, E: 0.85, CA: 0, D: 60 });
    cerca('ASME VIII-1: cabezal 2:1 t = PD/(2SE−0,2P)', r.t, 300 * 60 / (2 * 20000 * 0.85 - 60), 1e-9);
    r = C.recipiente({ tipo: 'ducto', P: 1000, D: 12.75, S: 52000, E: 1, F: 0.72, Tf: 1, CA: 0 });
    cerca('B31.8 (Barlow): t = P·D/(2·S·F·E·T)', r.t, 1000 * 12.75 / (2 * 52000 * 0.72), 1e-9);
    r = C.recipiente({ tipo: 'cil', P: 300, S: 20000, E: 0.85, CA: 0, D: 60, tNom: 0.75, Samb: 20000 });
    cerca('Hidrotest VIII-1 = 1,3·MAWP (S_amb = S_dis)', r.pruebaVIII, 1.3 * r.mawp, 1e-9);
    // Gasoducto
    var gd = { P1: 1000, P2: 800, G: 0.6, T: 60, L: 50, Z: 0.9, D: 12.09, E: 1, Tb: 60, Pb: 14.73 };
    r = C.gasoducto(gd);
    var qWT = 433.5 * (519.67 / 14.73) * Math.sqrt((1000 * 1000 - 800 * 800) / (0.6 * 519.67 * 50 * 0.9)) * Math.pow(12.09, 2.667);
    cerca('Weymouth: Q según la fórmula', r.qW, qWT, qWT * 1e-9);
    cond('Panhandle B vs Weymouth: razón plausible (0,8–1,6)', r.ratio > 0.8 && r.ratio < 1.6, 'razón = ' + r.ratio.toFixed(3));
    cerca('Weymouth: ida y vuelta de P2 con Q calculado', r.rango[2].p2W, 800, 1e-6);
    cond('Gasoducto: P2 ≥ P1 → error', C.gasoducto(Object.assign({}, gd, { P2: 1200 })).errores.length > 0);
    // Compresión
    r = C.compresion({ q: 10, p1: 100, p2: 800, t1: 80, k: 1.28, z: 0.95, eta: 0.75, rmax: 4, tint: 100 });
    cerca('Compresión: razón total 8 con máx. 4 → 2 etapas', r.ns, 2, 0);
    cerca('Compresión: razón por etapa = √8', r.rEtapa, Math.sqrt(8), 1e-9);
    cerca('Compresión: T de descarga etapa 1', r.etapas[0].tout, (80 + 459.67) * Math.pow(Math.sqrt(8), 0.28 / 1.28) - 459.67, 1e-9);
    var hp1 = (10e6 / 379.48 / 1440) * 0.95 * 1545.35 * 539.67 * (1.28 / 0.28) * (Math.pow(Math.sqrt(8), 0.28 / 1.28) - 1) / 33000 / 0.75;
    cerca('Compresión: potencia etapa 1 (hp)', r.etapas[0].hp, hp1, 1e-6);
    // Alivio de gas
    r = C.alivioGas({ W: 20000, pset: 100, sobre: 0.1, T: 100, M: 20, Z: 1, k: 1.4, Kd: 0.975, Kb: 1, Kc: 1 });
    cerca('API 520: C(k = 1,4) = 356', r.C, 356, 1);
    cerca('API 520: área requerida', r.A, 20000 / (r.C * 0.975 * (110 + 14.7)) * Math.sqrt(559.67 / 20), 1e-9);
    cond('API 520: el orificio elegido cubre el área', r.areaOrif >= r.A);
    // Costo nivelado
    r = C.costoNivelado({ capex: 1000, om: 10, comb: 0, prod: 100, vida: 2, r: 0.1, deg: 0, repl: 0, anioRepl: 0, valRes: 0 });
    cerca('LCOE: (1000 + 10/1,1 + 10/1,21)/(100/1,1 + 100/1,21)', r.lc, (1000 + 10 / 1.1 + 10 / 1.21) / (100 / 1.1 + 100 / 1.21), 1e-9);
    cerca('LCOE con r = 0 es el costo simple', C.costoNivelado({ capex: 1000, om: 0, comb: 0, prod: 100, vida: 10, r: 0, deg: 0 }).lc, 1, 1e-12);
    // Valor de la información
    r = C.valorInformacion({ pe: 0.3, sens: 0.95, espec: 0.9, costo: 0, acciones: [{ nombre: 'Perforar', vExito: 100, vFallo: -40 }, { nombre: 'No perforar', vExito: 0, vFallo: 0 }] });
    cerca('VOI: a priori VME(perforar) = 30 − 28 = 2', r.prior.v, 2, 1e-9);
    cerca('VOI: VPI = 0,3·100 − 2 = 28', r.vpi, 28, 1e-9);
    var pp1 = 0.95 * 0.3 + 0.1 * 0.7, po1 = 0.95 * 0.3 / pp1;
    cerca('VOI: valor de la información imperfecta (Bayes)', r.voi, pp1 * (po1 * 100 - (1 - po1) * 40) - 2, 1e-9);
    cond('VOI ≤ VPI', r.voi <= r.vpi + 1e-9);
    // Cartera
    r = C.cartera({ presupuesto: 30, filas: [{ nombre: 'A', pc: 0.3, vp: 200, costo: 20 }, { nombre: 'B', pc: 0.25, vp: 150, costo: 15 }, { nombre: 'C', pc: 0.4, vp: 80, costo: 15 }] });
    // VME: A=60−14=46, B=37,5−11,25=26,25, C=32−9=23 ; presupuesto 30: B+C=49,25 (costo 30) > A=46
    cerca('Cartera: óptimo B + C = 49,25', r.vmeSel, 49.25, 1e-9);
    cond('Cartera: el óptimo exhaustivo ≥ el voraz', r.vmeSel >= r.vmeGreedy - 1e-9);
    // Mezcla
    r = C.mezcla({ filas: [{ nombre: 'A', vol: 100, api: 30, azufre: 1, visc: 10 }, { nombre: 'B', vol: 100, api: 20, azufre: 3, visc: 100 }] });
    var sgA = 141.5 / 161.5, sgB = 141.5 / 151.5, wA = sgA / (sgA + sgB);
    cerca('Mezcla: SG por volumen', r.sg, (sgA + sgB) / 2, 1e-12);
    cerca('Mezcla: azufre por masa', r.azufre, wA * 1 + (1 - wA) * 3, 1e-9);
    var vb = function (n) { return 14.534 * Math.log(Math.log(n + 0.8)) + 10.975; };
    cerca('Mezcla: viscosidad Refutas', r.visc, Math.exp(Math.exp((wA * vb(10) + (1 - wA) * vb(100) - 10.975) / 14.534)) - 0.8, 1e-9);
    // ===== Herramientas por estrategia de explotación =====
    cerca('Normal inversa: Φ⁻¹(0,975) = 1,959964', C._util.normInv(0.975), 1.959964, 1e-6);
    cerca('Normal inversa: Φ⁻¹(0,841345) = 1', C._util.normInv(0.8413447), 1, 1e-6);
    cerca('Normal inversa: simetría Φ⁻¹(0,1) = −Φ⁻¹(0,9)', C._util.normInv(0.1), -C._util.normInv(0.9), 1e-9);
    // Barrido y Dykstra–Parsons
    var sg = 0.6, kk = []; for (var q0 = 0; q0 < 40; q0++) { kk.push({ k: Math.exp(Math.log(100) - sg * C._util.normInv((q0 + 0.5) / 40)) }); }
    r = C.barrido({ N: 100, swc: 0.2, sor: 0.3, ea: 0.7, ev: 0.8, filas: kk });
    cerca('Dykstra–Parsons: V = 1 − exp(−σ) con k lognormal exacto', r.V, 1 - Math.exp(-sg), 1e-9);
    cerca('Dykstra–Parsons: k50 recuperado = 100 mD', r.k50, 100, 1e-6);
    cerca('Barrido: E_D = (1 − Swc − Sor)/(1 − Swc) = 0,625', r.ed, 0.625, 1e-12);
    cerca('Barrido: E_R = E_D·E_A·E_V', r.er, 0.625 * 0.7 * 0.8, 1e-12);
    cerca('Barrido: Np = N·E_R', r.np, 100 * 0.35, 1e-9);
    cond('Barrido: Swc + Sor ≥ 1 → error', C.barrido({ N: 1, swc: 0.6, sor: 0.4, ea: 1, ev: 1 }).errores.length > 0);
    // Polímero
    var plb = { swc: 0.2, sor: 0.2, krwMax: 0.4, kroMax: 0.9, nw: 2, no: 2, muw: 1, muo: 20, muPol: 1 };
    var pa = C.polimero(plb), pb = C.polimero(Object.assign({}, plb, { muPol: 20 }));
    cerca('Polímero: con μ_pol = μ_w no hay ganancia (PVI = 1)', pa.filas[3].dif, 0, 1e-12);
    cond('Polímero: más viscosidad → más recuperación a 1 PVI', pb.filas[3].pol > pb.filas[3].agua, pb.filas[3].pol.toFixed(3) + ' vs ' + pb.filas[3].agua.toFixed(3));
    cerca('Polímero: M se reduce en el factor de viscosidad (×20)', pb.mAgua / pb.mPol, 20, 1e-9);
    cond('Polímero: μ_pol < μ_w → error', C.polimero(Object.assign({}, plb, { muPol: 0.5 })).errores.length > 0);
    // Número capilar
    r = C.capilar({ v: 1, mu: 1, sigma: 30, nObj: 1e-3 });
    cerca('Número capilar = v·μ/σ (1 ft/d, 1 cP, 30 mN/m)', r.nc, (0.3048 / 86400) * 1e-3 / 30e-3, 1e-15);
    cerca('Número capilar: σ requerida = v·μ/Nc_objetivo', r.sigmaReq, (0.3048 / 86400) * 1e-3 / 1e-3 / 1e-3, 1e-9);
    r = C.capilar({ q: 500, area: 5000, mu: 1, sigma: 30 });
    cerca('Número capilar: v = q·5,615/A (ft/d)', r.v, 500 * 5.615 / 5000, 1e-12);
    // Arps modificada
    r = C.arpsMod({ qi: 1000, di: 1.2, b: 0.8, dmin: 0.0000001, qlim: 0, horiz: 20 });
    var qf = 1000 / Math.pow(1 + 0.8 * 1.2 * 20, 1 / 0.8), anal = Math.pow(1000, 0.8) / ((1 - 0.8) * 1.2) * (Math.pow(1000, 0.2) - Math.pow(qf, 0.2)) * 365;
    cerca('Arps modificada: sin paso, EUR = hiperbólica analítica', r.eur, anal, anal * 2e-3);
    r = C.arpsMod({ qi: 1000, di: 1.2, b: 1.5, dmin: 0.07, qlim: 0, horiz: 30 });
    var dmn = -Math.log(1 - 0.07);
    cerca('Arps modificada: tiempo de paso = (Di/Dmin − 1)/(b·Di)', r.tsw, (1.2 / dmn - 1) / (1.5 * 1.2), 1e-9);
    cerca('Arps modificada: la declinación en el paso iguala Dmin', r.dsw, dmn, 1e-9);
    cond('Arps modificada: EUR con límite terminal < hiperbólica pura (b > 1)', r.eur < r.eurHip, r.eur.toFixed(0) + ' < ' + r.eurHip.toFixed(0));
    cond('Arps modificada: b = 0 → sin paso', !isFinite(C.arpsMod({ qi: 500, di: 0.5, b: 0, dmin: 0.07, qlim: 0, horiz: 10 }).tsw));
    // Duong
    var q1d = 1000, ad = 1.1, md = 1.15, dg = [];
    [1, 2, 4, 7, 10, 15, 20, 30, 45, 60, 90, 120, 180, 270, 365].forEach(function (t) { var G = q1d / ad * Math.exp(ad / (1 - md) * (Math.pow(t, 1 - md) - 1)), qq = q1d * Math.pow(t, -md) * Math.exp(ad / (1 - md) * (Math.pow(t, 1 - md) - 1)); dg.push({ t: t, q: qq, gp: G }); });
    r = C.duong({ filas: dg, qlim: 0, horiz: 30 });
    cerca('Duong: a recuperado', r.a, ad, 1e-6);
    cerca('Duong: m recuperado', r.m, md, 1e-6);
    cerca('Duong: q1 recuperado', r.q1, q1d, 1e-3);
    var T30 = 30 * 365; cerca('Duong: EUR a 30 años = (q1/a)·exp[a/(1−m)·(T^(1−m) − 1)]', r.eur, q1d / ad * Math.exp(ad / (1 - md) * (Math.pow(T30, 1 - md) - 1)), 1);
    cond('Duong: m > 1 → acumulada finita', r.finito === true);
    cond('Duong: rechaza tiempos no crecientes', C.duong({ filas: [1, 2, 3, 3, 5, 6, 7].map(function (t) { return { t: t, q: 100 / t }; }) }).errores.length > 0);
    // Gas en sitio shale
    var sgs = { area: 640, h: 100, phi: 0.06, sw: 0.25, p: 4000, T: 200, z: 0.95, rhoB: 2.5, vl: 100, pl: 650, ton: 'sh' };
    r = C.shaleGas(sgs);
    var bgT = 0.02827 * 0.95 * 659.67 / 4000, bulkT = 43560 * 640 * 100;
    cerca('Shale gas: Bg = 0,02827·z·T/p', r.bg, bgT, 1e-12);
    cerca('Shale gas: gas libre = 43560·A·h·φ(1−Sw)/Bg', r.libre, bulkT * 0.06 * 0.75 / bgT, r.libre * 1e-9);
    cerca('Shale gas: masa de roca (ton cortas)', r.tons, bulkT * 2.5 * 62.428 / 2000, r.tons * 1e-9);
    cerca('Shale gas: adsorbido = VL·p/(pL + p)·toneladas', r.ads, 100 * 4000 / 4650 * bulkT * 2.5 * 62.428 / 2000, r.ads * 1e-9);
    cerca('Shale gas: total por sección de 640 ac = total', r.porSeccion, r.total, r.total * 1e-9);
    cerca('Shale gas: tonelada métrica reduce el adsorbido en 2000/2204,62', C.shaleGas(Object.assign({}, sgs, { ton: 'met' })).ads / r.ads, 2000 / 2204.62, 1e-9);
    cond('Shale gas: VL = 0 → sin adsorbido', C.shaleGas(Object.assign({}, sgs, { vl: 0 })).ads === 0);
    // Offshore
    var of = { ag: 80, wd: 3000, rhoSw: 8.55, tvd: 12000, pp: 10.5, mw: 11, filas: [{ nombre: 'Sedimentos someros', esp: 2000, rho: 16.2 }, { nombre: 'Intermedio', esp: 6920, rho: 19.2 }] };
    r = C.offshore(of);
    var svT = 0.052 * (8.55 * 3000 + 16.2 * 2000 + 19.2 * 6920);
    cerca('Offshore: Sv = 0,052·(ρw·WD + Σρ·Δz)', r.sv, svT, 1e-6);
    cerca('Offshore: gradiente = Sv/TVD', r.grad, svT / 12000, 1e-9);
    var Ht = 12000 - 80 - 3000, mwRmT = (0.052 * 10.5 * 12000 - 0.052 * 8.55 * 3000) / (0.052 * Ht);
    cerca('Offshore: densidad de margen del riser', r.mwRm, mwRmT, 1e-9);
    cerca('Offshore: margen del riser = MWrm − MW', r.margen, mwRmT - 11, 1e-9);
    cond('Offshore: intervalos que no cubren la profundidad → error', C.offshore(Object.assign({}, of, { filas: [{ nombre: 'x', esp: 1000, rho: 16 }] })).errores.length > 0);
    cond('Offshore: el gradiente es menor que el onshore equivalente (1 psi/ft)', r.grad < 1);
    // ===== Caracterización: pruebas de pozo, RTA, gradientes, petrofísica, tipos de roca =====
    var K0t = -(Math.log(0.0002637) + 0.80907), pt = { q: 800, B: 1.2, mu: 0.8, h: 40, ct: 1.2e-5, phi: 0.18, rw: 0.3 }, k0 = 50, s0 = 3;
    var mp0 = 70.6 * pt.q * pt.B * pt.mu / (k0 * pt.h);
    function dpR(te) { return mp0 * (Math.log(te) + Math.log(k0 / (pt.phi * pt.mu * pt.ct * pt.rw * pt.rw)) - K0t + 2 * s0); }
    function geo(n, a, b) { var o = [], i; for (i = 0; i < n; i++) o.push(a * Math.pow(b / a, i / (n - 1))); return o; }
    var fdd = geo(25, 0.5, 500).map(function (t) { return { t: t, dp: dpR(t) }; });
    r = C.ptaDeriv(Object.assign({}, pt, { tipo: 'dd', filas: fdd }));
    cerca('Derivada de Bourdet: m′ = 70,6·q·B·μ/(k·h) en flujo radial', r.mprime, mp0, 1e-6);
    cerca('Pruebas de pozo (drawdown): k recuperado = 50 mD', r.k, 50, 1e-6);
    cerca('Pruebas de pozo (drawdown): daño recuperado s = 3', r.s, 3, 1e-6);
    cerca('Pruebas de pozo: kh = k·h', r.kh, 50 * 40, 1e-4);
    cerca('Radio de investigación = √(k·t/(948·φ·μ·ct))', r.ri, Math.sqrt(50 * 500 / (948 * pt.phi * pt.mu * pt.ct)), 1e-6);
    cerca('Caída de presión por daño = 141,2·q·B·μ/(k·h)·s', r.dpSkin, 141.2 * pt.q * pt.B * pt.mu / (50 * 40) * 3, 1e-6);
    var tpT = 100, fbu = geo(25, 0.1, 200).map(function (t) { return { t: t, dp: dpR(t * tpT / (tpT + t)) }; });
    r = C.ptaDeriv(Object.assign({}, pt, { tipo: 'bu', tp: tpT, filas: fbu }));
    cerca('Pruebas de pozo (cierre, tiempo equivalente de Agarwal): k = 50 mD', r.k, 50, 1e-6);
    cerca('Pruebas de pozo (cierre): s = 3', r.s, 3, 1e-6);
    var fws = geo(10, 0.01, 0.5).map(function (t) { return { t: t, dp: pt.q * pt.B * t / (24 * 0.01) }; });
    r = C.ptaDeriv(Object.assign({}, pt, { tipo: 'dd', filas: fws }));
    cerca('Almacenamiento: C = q·B·Δt/(24·Δp) = 0,01 bbl/psi sobre la pendiente unitaria', r.C, 0.01, 1e-6);
    cond('Pruebas de pozo: sin meseta de derivada no se inventa k', r.k === undefined);
    cond('Pruebas de pozo: tiempos no crecientes → error', C.ptaDeriv(Object.assign({}, pt, { tipo: 'dd', filas: [1, 2, 2, 3, 4, 5, 6, 7].map(function (t) { return { t: t, dp: 10 + t }; }) })).errores.length > 0);
    cond('Pruebas de pozo: cierre sin tp → error', C.ptaDeriv(Object.assign({}, pt, { tipo: 'bu', filas: fbu })).errores.length > 0);
    // RTA
    var rt = { phi: 0.08, ct: 1.5e-5, mu: 0.8, B: 1.3, h: 100, pi: 4000, sw: 0.3 }, mT = 1.3 / (1.5e-5 * 5e6), bT = 0.5, ft = [], npT = 0, tpr = 0;
    geo(40, 1, 400).forEach(function (t) { var q = 500 / (1 + t / 50); npT += q * (t - tpr); tpr = t; ft.push({ t: t, q: q, pwf: 4000 - mT * npT - q * bT }); });
    r = C.rta(Object.assign({}, rt, { filas: ft }));
    cerca('RTA: pendiente de Δp/q contra t_mb = B/(ct·Vp)', r.bdf.m, mT, 1e-9);
    cerca('RTA: ordenada del ajuste de flujo dominado por límites', r.bdf.b, bT, 1e-7);
    cerca('RTA: volumen poral drenado Vp = 5·10⁶ rb', r.bdf.vp, 5e6, 1e-2);
    cerca('RTA: OOIP = Vp·(1 − Sw)/B', r.bdf.N, 5e6 * 0.7 / 1.3, 1e-2);
    cerca('RTA: área = Vp·5,615/(φ·h·43560)', r.bdf.area, 5e6 * 5.615 / (0.08 * 100 * 43560), 1e-6);
    var kT = 0.0006, AcT = 8e6, muS = 0.8e-3, ctS = 1.5e-5 / 6894.757, qS = 1000 * 0.158987294928 / 86400, fl = [];
    geo(30, 1, 100).forEach(function (t) { var tS = t * 86400, dpP = 2 * (qS * 1.3 / (AcT * 0.09290304)) * Math.sqrt(muS * tS / (Math.PI * kT * 9.869233e-16 * 0.08 * ctS)); fl.push({ t: t, q: 1000, pwf: 5000 - dpP / 6894.757 }); });
    r = C.rta(Object.assign({}, rt, { pi: 5000, filas: fl, k: kT }));
    cerca('RTA flujo lineal: A_c·√k recuperado desde la fórmula en unidades SI', r.lin.acSqrtK, AcT * Math.sqrt(kT), AcT * Math.sqrt(kT) * 1e-6);
    cerca('RTA flujo lineal: A_c = (A_c·√k)/√k', r.lin.ac, AcT, AcT * 1e-6);
    cerca('RTA: Δp/q contra √t con R² = 1 en datos sintéticos lineales', r.lin.r2, 1, 1e-9);
    cond('RTA: pwf mayor a la presión inicial → error', C.rta(Object.assign({}, rt, { filas: ft.map(function (x) { return { t: x.t, q: x.q, pwf: 4500 }; }) })).errores.length > 0);
    // Gradientes y contactos
    var gz = { filas: [], pe: 0 };
    [8500, 8600, 8700, 8800].forEach(function (z) { gz.filas.push({ z: z, p: 0.35 * z + 950, f: 'o' }); });
    [9100, 9200, 9300].forEach(function (z) { gz.filas.push({ z: z, p: 0.45 * z + 50, f: 'w' }); });
    [8100, 8150, 8200].forEach(function (z) { gz.filas.push({ z: z, p: 0.10 * z + 3025, f: 'g' }); });
    r = C.gradiente(gz);
    var cFw = r.contactos.filter(function (c) { return c.tipo === 'fwl'; })[0], cGo = r.contactos.filter(function (c) { return c.tipo === 'goc'; })[0];
    cerca('Gradientes: nivel de agua libre = 9000 ft', cFw.z, 9000, 1e-6);
    cerca('Gradientes: presión en el FWL = 0,45·9000 + 50', cFw.p, 4100, 1e-6);
    cerca('Gradientes: contacto gas–petróleo = 8300 ft', cGo.z, 8300, 1e-6);
    cerca('Gradientes: densidad del petróleo = 0,35/0,433', r.lineas.filter(function (l) { return l.c === 'o'; })[0].rho, 0.35 / 0.433, 1e-9);
    cond('Gradientes: con 3 o más puntos hay incertidumbre del contacto (≈ 0 en datos exactos)', cFw.sd != null && cFw.sd < 1e-3);
    r = C.gradiente(Object.assign({}, gz, { pe: 5, ztop: 8100 }));
    cerca('Gradientes: contacto observado = FWL − Pe/(γw − γo) = 8950 ft', r.contactos.filter(function (c) { return c.tipo === 'owc'; })[0].z, 8950, 1e-6);
    cerca('Gradientes: columna sobre el FWL = 900 ft', r.columna, 900, 1e-6);
    cerca('Gradientes: columna observada = 850 ft', r.columnaObs, 850, 1e-6);
    r = C.gradiente({ filas: [{ z: 8500, p: 0.35 * 8500 + 950, f: 'o' }, { z: 8800, p: 0.35 * 8800 + 950, f: 'o' }, { z: 9100, p: 0.45 * 9100 + 50, f: 'w' }, { z: 9300, p: 0.45 * 9300 + 50, f: 'w' }] });
    cerca('Gradientes con 2 puntos por fluido: el contacto sigue siendo exacto', r.contactos[0].z, 9000, 1e-6);
    cond('Gradientes con 2 puntos por fluido: no se inventa incertidumbre', r.contactos[0].sd === null);
    cond('Gradientes: un solo fluido → error', C.gradiente({ filas: gz.filas.filter(function (x) { return x.f === 'o'; }) }).errores.length > 0);
    // Petrofísica avanzada
    var pp = { rw: 0.05, rsh: 4, a: 1, m: 2, n: 2, dz: 0.5, phic: 0.08, vshc: 0.4, swc: 0.6 }, base = [{ z: 1, phi: 0.22, vsh: 0.05, sw: 0.25 }, { z: 2, phi: 0.18, vsh: 0.20, sw: 0.40 }, { z: 3, phi: 0.12, vsh: 0.35, sw: 0.55 }, { z: 4, phi: 0.06, vsh: 0.10, sw: 0.30 }, { z: 5, phi: 0.20, vsh: 0.55, sw: 0.45 }, { z: 6, phi: 0.25, vsh: 0.08, sw: 0.80 }];
    function rtOf(b, mod) {
      return base.map(function (x) {
        var sw = x.sw, rtv;
        if (mod === 'indo') { var den = Math.pow(x.vsh, 1 - x.vsh / 2) / Math.sqrt(pp.rsh) + Math.pow(x.phi, pp.m / 2) / Math.sqrt(pp.a * pp.rw); rtv = 1 / Math.pow(den * Math.pow(sw, pp.n / 2), 2); }
        else if (mod === 'sim') rtv = 1 / (Math.pow(x.phi, pp.m) * sw * sw / (pp.a * pp.rw) + x.vsh * sw / pp.rsh);
        else rtv = pp.a * pp.rw / (Math.pow(x.phi, pp.m) * Math.pow(sw, pp.n));
        return { z: x.z, phi: x.phi, vsh: x.vsh, rt: rtv };
      });
    }
    ['indo', 'sim', 'archie'].forEach(function (mod) {
      var rr = C.petro2(Object.assign({}, pp, { modelo: mod, filas: rtOf(base, mod) })), maxe = 0;
      rr.filas.forEach(function (x, i) { maxe = Math.max(maxe, Math.abs(x.sw - base[i].sw)); });
      cerca('Petrofísica ' + { indo: 'Indonesia', sim: 'Simandoux', archie: 'Archie' }[mod] + ': Sw recuperada desde Rt (ida y vuelta)', maxe, 0, 1e-9);
    });
    var rn = C.petro2(Object.assign({}, pp, { modelo: 'indo', filas: rtOf(base, 'indo') })), netT = base.filter(function (x) { return x.phi >= 0.08 && x.vsh <= 0.4 && x.sw <= 0.6; });
    cerca('Espesor neto = nº de muestras que cumplen los tres cortes × paso', rn.hNet, netT.length * 0.5, 1e-9);
    cerca('Neto/bruto = espesor neto / (nº de muestras × paso)', rn.ntg, netT.length / 6, 1e-9);
    var sphi = netT.reduce(function (a, x) { return a + x.phi; }, 0), sphisw = netT.reduce(function (a, x) { return a + x.phi * x.sw; }, 0);
    cerca('Sw promedio ponderada por porosidad', rn.swAvg, sphisw / sphi, 1e-9);
    cerca('Espesor poral de hidrocarburo Σφ(1 − Sw)·Δz', rn.hcpv, netT.reduce(function (a, x) { return a + x.phi * (1 - x.sw) * 0.5; }, 0), 1e-9);
    var zeroV = [{ z: 1, phi: 0.2, vsh: 0, sw: 0.4 }, { z: 2, phi: 0.15, vsh: 0, sw: 0.6 }, { z: 3, phi: 0.1, vsh: 0, sw: 0.9 }].map(function (x) { return { z: x.z, phi: x.phi, vsh: 0, rt: pp.a * pp.rw / (Math.pow(x.phi, pp.m) * Math.pow(x.sw, pp.n)) }; });
    var ra = C.petro2(Object.assign({}, pp, { modelo: 'archie', filas: zeroV })), ri2 = C.petro2(Object.assign({}, pp, { modelo: 'indo', filas: zeroV })), rs2 = C.petro2(Object.assign({}, pp, { modelo: 'sim', filas: zeroV }));
    cerca('Con Vsh = 0, Indonesia coincide con Archie', Math.abs(ri2.filas[1].sw - ra.filas[1].sw), 0, 1e-12);
    cerca('Con Vsh = 0, Simandoux coincide con Archie (n = 2)', Math.abs(rs2.filas[1].sw - ra.filas[1].sw), 0, 1e-12);
    cond('Petrofísica: φ fuera de rango → error', C.petro2(Object.assign({}, pp, { filas: [{ phi: 0.9, vsh: 0.1, rt: 10 }, { phi: 0.1, vsh: 0.1, rt: 10 }, { phi: 0.1, vsh: 0.1, rt: 10 }] })).errores.length > 0);
    // Tipos de roca y altura de saturación
    function kFromFzi(f, phi) { var phz = phi / (1 - phi); return phi * Math.pow(f * phz / 0.0314, 2); }
    var plugs = [[1, 0.08], [1, 0.12], [1, 0.16], [4, 0.10], [4, 0.14], [4, 0.20]].map(function (a) { return { phi: a[1], k: kFromFzi(a[0], a[1]) }; });
    var ro = C.rocas({ plugs: plugs, nclases: 2 });
    cerca('FZI de las muestras: RQI/φz recupera el FZI de generación', Math.abs(ro.plugs[0].fzi - 1) + Math.abs(ro.plugs[3].fzi - 4), 0, 1e-9);
    cerca('Tipos de roca: clase 1 con FZI = 1', ro.clases[0].fzi, 1, 1e-9);
    cerca('Tipos de roca: clase 2 con FZI = 4', ro.clases[1].fzi, 4, 1e-9);
    cerca('Tipos de roca: 3 muestras por clase', ro.clases[0].n + ro.clases[1].n, 6, 0);
    cerca('RQI = 0,0314·√(k/φ)', ro.plugs[0].rqi, 0.0314 * Math.sqrt(plugs[0].k / plugs[0].phi), 1e-12);
    var aJ = 0.4, bJ = 2, swiJ = 0.15, kLt = 100, phLt = 0.2, sgL = 48, pcT = [0.1, 0.2, 0.35, 0.5, 0.7, 0.9].map(function (sn) { var J = aJ * Math.pow(sn, -bJ); return { sw: swiJ + (1 - swiJ) * sn, pc: J * sgL / (0.2166 * Math.sqrt(kLt / phLt)) }; });
    var rj = C.rocas({ plugs: plugs, nclases: 2, pcs: pcT, sigmaLab: sgL, thetaLab: 0, kLab: kLt, phiLab: phLt, swirr: swiJ, kRes: 100, phiRes: 0.2, sigmaRes: 26, thetaRes: 30, drho: 0.25, hmax: 200, hSw: 80 });
    cerca('Función J: coeficiente a recuperado', rj.j.a, aJ, 1e-9);
    cerca('Función J: exponente b recuperado', rj.j.b, bJ, 1e-9);
    var Jh = 0.2166 * (0.433 * 0.25 * 80) / (26 * Math.cos(30 * Math.PI / 180)) * Math.sqrt(100 / 0.2), swh = Math.min(1, swiJ + (1 - swiJ) * Math.pow(Jh / aJ, -1 / bJ));
    cerca('Altura de saturación: Sw a 80 ft sobre el FWL', rj.alt.swq, swh, 1e-9);
    cond('Altura de saturación: Sw decrece con la altura', rj.alt.curva.every(function (c, i, a) { return i === 0 || c.sw <= a[i - 1].sw + 1e-12; }));
    cond('Altura de saturación: Sw = 1 en el FWL', rj.alt.curva[0].sw === 1);
    cond('Tipos de roca: menos de 6 plugs → error', C.rocas({ plugs: plugs.slice(0, 4), nclases: 2 }).errores.length > 0);
    return out;
  }
  var P = { correr: correr };
  root.H3LPruebas = P;
  if (typeof module !== 'undefined' && module.exports) module.exports = P;
})(typeof globalThis !== 'undefined' ? globalThis : this);
