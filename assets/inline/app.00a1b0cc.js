/* H3L Global Energy — motor de cálculo (funciones puras, sin acceso a pantalla).
   Desarrollo: equipo H3L. Estado: borrador pendiente de revisión técnica. */
(function (root) {
  'use strict';
  var C = {};

  /* ---------- utilidades ---------- */
  function num(x) {
    var v = typeof x === 'string' ? parseFloat(String(x).replace(',', '.')) : x;
    return (typeof v === 'number' && isFinite(v)) ? v : NaN;
  }
  function clamp(x, a, b) { return Math.min(b, Math.max(a, x)); }
  function rows(arr) { return Array.isArray(arr) ? arr : []; }
  function interp(pts, x, kx, ky) { // pts ordenados por kx ascendente
    if (!pts.length) return NaN;
    if (x <= pts[0][kx]) return pts[0][ky];
    for (var i = 1; i < pts.length; i++) {
      if (x <= pts[i][kx]) {
        var x0 = pts[i - 1][kx], x1 = pts[i][kx], y0 = pts[i - 1][ky], y1 = pts[i][ky];
        return x1 === x0 ? y1 : y0 + (y1 - y0) * (x - x0) / (x1 - x0);
      }
    }
    return pts[pts.length - 1][ky];
  }
  function mulberry32(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      var t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  function quantile(sorted, q) {
    var pos = (sorted.length - 1) * q, lo = Math.floor(pos), hi = Math.ceil(pos);
    return sorted[lo] + (sorted[hi] - sorted[lo]) * (pos - lo);
  }
  C._util = { num: num, clamp: clamp, interp: interp, quantile: quantile };

  /* =====================================================
     1. CONVERSIÓN TIEMPO-PROFUNDIDAD
     Z = Σ V_int,i · Δt_i / 2   (Δt doble tiempo de viaje)
     Dix (1955): V_int² = (V2²·t2 − V1²·t1)/(t2 − t1), con V_rms
     ===================================================== */
  C.tiempoProfundidad = function (p) {
    var err = [], av = [];
    var f = rows(p.filas).map(function (r) { return { t: num(r.t), v: num(r.v) }; });
    if (!f.length) err.push('Cargá al menos una capa.');
    f.forEach(function (r, i) {
      if (!(r.t > 0) || !(r.v > 0)) err.push('Capa ' + (i + 1) + ': tiempo y velocidad deben ser positivos.');
      if (i > 0 && !(r.t > f[i - 1].t)) err.push('Capa ' + (i + 1) + ': el tiempo debe ser mayor al de la capa anterior.');
    });
    if (err.length) return { errores: err };
    var capas = [], tPrev = 0, vPrev = 0, z = 0;
    for (var i = 0; i < f.length; i++) {
      var vint = f[i].v;
      if (p.modo === 'rms' && i > 0) {
        var q = (f[i].v * f[i].v * f[i].t - vPrev * vPrev * tPrev) / (f[i].t - tPrev);
        if (!(q > 0)) { err.push('Capa ' + (i + 1) + ': Dix da una velocidad imaginaria; revisá las V_rms.'); continue; }
        vint = Math.sqrt(q);
      }
      var esp = vint * ((f[i].t - tPrev) / 1000) / 2;
      z += esp;
      capas.push({ n: i + 1, tTope: tPrev, tBase: f[i].t, vint: vint, espesor: esp, zBase: z, vprom: z / (f[i].t / 2000) });
      tPrev = f[i].t; vPrev = f[i].v;
    }
    if (err.length) return { errores: err };
    var consulta = null, tq = num(p.twtConsulta);
    if (tq > 0) {
      var zq = null;
      for (var k = 0; k < capas.length; k++) {
        if (tq <= capas[k].tBase) { zq = capas[k].zBase - capas[k].vint * ((capas[k].tBase - tq) / 1000) / 2; break; }
      }
      if (zq === null) {
        var L = capas[capas.length - 1];
        zq = L.zBase + L.vint * ((tq - L.tBase) / 1000) / 2;
        av.push('El tiempo consultado supera el modelo de velocidades; se extrapoló con la velocidad de la última capa.');
      }
      consulta = { twt: tq, z: zq, vprom: zq / (tq / 2000) };
    }
    return { errores: [], avisos: av, capas: capas, zTotal: z, vpromTotal: capas[capas.length - 1].vprom, consulta: consulta };
  };

  /* =====================================================
     2. MADUREZ DE ROCA MADRE
     Easy%Ro — Sweeney & Burnham (1990), AAPG Bull. 74(10)
     20 reacciones paralelas, A = 1e13 1/s, Ea 34–72 kcal/mol
     %Ro = exp(−1.6 + 3.7·F),  F = Σ w_i (1 − f_i)
     ===================================================== */
  var EA = [34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60, 62, 64, 66, 68, 70, 72];
  var WF = [0.03, 0.03, 0.04, 0.04, 0.05, 0.05, 0.06, 0.04, 0.04, 0.07, 0.06, 0.06, 0.06, 0.05, 0.05, 0.04, 0.03, 0.02, 0.02, 0.01];
  var A_FACTOR = 1e13, R_KCAL = 0.001987, SEG_POR_MA = 3.15576e13;
  C.ventanaRo = function (ro) {
    if (ro < 0.6) return 'Inmaduro (sin generación significativa)';
    if (ro < 0.65) return 'Madurez temprana (inicio de la ventana de petróleo)';
    if (ro < 0.9) return 'Pico de generación de petróleo';
    if (ro < 1.35) return 'Madurez tardía (petróleo liviano y condensado)';
    if (ro < 2.0) return 'Postmaduro: gas húmedo';
    return 'Postmaduro: gas seco';
  };
  C.easyRo = function (p) {
    var err = [], av = [];
    var pts = rows(p.filas).map(function (r) { return { a: num(r.edad), v: num(r.v) }; });
    if (pts.length < 2) err.push('Cargá al menos dos puntos de la historia (edad y ' + (p.modo === 'Z' ? 'profundidad' : 'temperatura') + ').');
    pts.forEach(function (r, i) {
      if (!(r.a >= 0) || !isFinite(r.v)) err.push('Punto ' + (i + 1) + ': edad y valor deben ser numéricos (edad ≥ 0).');
      if (i > 0 && !(r.a < pts[i - 1].a)) err.push('Punto ' + (i + 1) + ': las edades deben decrecer (del pasado al presente).');
    });
    var ts = num(p.ts), grad = num(p.grad);
    if (p.modo === 'Z' && (!isFinite(ts) || !(grad > 0))) err.push('Ingresá temperatura superficial y gradiente geotérmico (> 0).');
    if (err.length) return { errores: err };
    var T = pts.map(function (r) { return p.modo === 'Z' ? ts + grad * r.v / 1000 : r.v; });
    T.forEach(function (t) { if (t < 0 || t > 400) av.push('Hay temperaturas fuera de 0–400 °C; revisá los datos.'); });
    if (pts[pts.length - 1].a > 0) av.push('La historia termina a ' + pts[pts.length - 1].a + ' Ma, no en el presente; la madurez corresponde a esa edad.');
    var f = EA.map(function () { return 1; }), curva = [{ edad: pts[0].a, T: T[0], ro: 0.2 }];
    for (var s = 0; s < pts.length - 1; s++) {
      var span = pts[s].a - pts[s + 1].a, m = Math.max(20, Math.ceil(span / 0.05)), dtS = (span / m) * SEG_POR_MA;
      for (var j = 0; j < m; j++) {
        var Tm = T[s] + (T[s + 1] - T[s]) * ((j + 0.5) / m) + 273.15;
        for (var i = 0; i < EA.length; i++) f[i] *= Math.exp(-A_FACTOR * Math.exp(-EA[i] / (R_KCAL * Tm)) * dtS);
      }
      var Fp = 0; for (var i2 = 0; i2 < EA.length; i2++) Fp += WF[i2] * (1 - f[i2]);
      curva.push({ edad: pts[s + 1].a, T: T[s + 1], ro: Math.exp(-1.6 + 3.7 * Fp) });
    }
    var F = 0; for (var i3 = 0; i3 < EA.length; i3++) F += WF[i3] * (1 - f[i3]);
    var ro = Math.exp(-1.6 + 3.7 * F);
    return { errores: [], avisos: av.filter(function (x, i, a) { return a.indexOf(x) === i; }), ro: ro, F: F, avance: F / 0.85 * 100, ventana: C.ventanaRo(ro), curva: curva, tMax: Math.max.apply(null, T) };
  };

  /* Rock-Eval — clases de Peters & Cassa (1994), AAPG Memoir 60 */
  C.rockEval = function (p) {
    var toc = num(p.toc), s2 = num(p.s2), tmax = num(p.tmax), err = [];
    if (!(toc > 0)) err.push('El COT debe ser mayor a 0.');
    if (err.length) return { errores: err };
    var res = { errores: [], avisos: [] };
    res.calidad = toc < 0.5 ? 'Pobre' : toc < 1 ? 'Regular' : toc < 2 ? 'Buena' : toc < 4 ? 'Muy buena' : 'Excelente';
    if (isFinite(s2) && s2 >= 0) {
      res.hi = s2 / toc * 100;
      res.querogeno = res.hi > 600 ? 'Tipo I (petróleo)' : res.hi > 300 ? 'Tipo II (petróleo)' : res.hi > 200 ? 'Tipo II/III (petróleo y gas)' : res.hi > 50 ? 'Tipo III (gas)' : 'Tipo IV (inerte)';
    }
    if (isFinite(tmax) && tmax > 0) {
      res.madurezTmax = tmax < 435 ? 'Inmaduro' : tmax < 445 ? 'Madurez temprana' : tmax < 450 ? 'Pico de generación' : tmax <= 470 ? 'Madurez tardía' : 'Postmaduro';
      if (res.hi !== undefined && res.hi < 50) res.avisos.push('Con HI < 50 el Tmax pierde confiabilidad como indicador de madurez.');
    }
    return res;
  };

  /* =====================================================
     3. RIESGO GEOLÓGICO — MÉTODO DE ROSE
     Pg = P(reservorio) × P(estructura) × P(carga) × P(trampa sellada)
     Chance comercial = Pg × proporción de análogos ≥ tamaño mínimo
     VME = Pcom·VP_éxito − (1 − Pcom)·costo_fallo
     Rose, P.R. (2001), AAPG Methods in Exploration 12
     ===================================================== */
  var ROSE_FACTORES = [['reservorio', 'Reservorio'], ['estructura', 'Estructura'], ['carga', 'Carga de hidrocarburos'], ['trampa', 'Trampa sellada']];
  C.roseFactores = ROSE_FACTORES;
  C.rose = function (p) {
    var err = [], av = [], fac = [], pg = 1, lim = null;
    ROSE_FACTORES.forEach(function (d) {
      var v = num(p[d[0]]);
      if (!(v > 0 && v <= 1)) { err.push(d[1] + ': la probabilidad debe estar entre 0 y 1.'); return; }
      fac.push({ id: d[0], nombre: d[1], p: v });
      pg *= v;
      if (!lim || v < lim.p) lim = { id: d[0], nombre: d[1], p: v };
      if (v > 0.95) av.push(d[1] + ' = ' + v + ': Rose recomienda no asignar 1.0 en exploración; el límite práctico es 0.90–0.95.');
      if (v < 0.05) av.push(d[1] + ' = ' + v + ': una probabilidad tan baja necesita una justificación documentada.');
    });
    if (err.length) return { errores: err };
    var res = { errores: [], avisos: av, factores: fac, pg: pg, limitante: lim, pec: null, pcom: null, emv: null };
    var an = rows(p.analogos).map(function (r) { return num(r.tam); }).filter(function (x) { return isFinite(x) && x > 0; });
    var tmin = num(p.tamMin);
    if (an.length) {
      if (!(tmin > 0)) { res.errores.push('Ingresá el tamaño mínimo comercial para usar los campos análogos.'); return res; }
      var ok = an.filter(function (x) { return x >= tmin; }).length;
      res.pec = ok / an.length; res.nAn = an.length; res.nOk = ok; res.pcom = pg * res.pec;
    }
    var pgh = num(p.pgHist);
    if (pgh > 0) {
      res.ratioHist = pg / pgh;
      if (pg > pgh) av.push('El Pg del prospecto (' + (pg * 100).toFixed(1) + '%) supera la tasa histórica de éxito del play (' + (pgh * 100).toFixed(1) + '%); documentá la evidencia que lo respalda.');
    }
    var vp = num(p.vpExito), cf = num(p.costoFallo);
    if (isFinite(vp) && isFinite(cf) && cf >= 0) {
      var pc = res.pcom !== null ? res.pcom : pg;
      res.baseVme = res.pcom !== null ? 'Pcom' : 'Pg';
      res.emv = pc * vp - (1 - pc) * cf;
    }
    return res;
  };

  /* Actualización bayesiana de un factor compartido tras perforar */
  C.actualizarPg = function (p) {
    var err = [], av = [];
    var dr = {}, nx = {};
    ROSE_FACTORES.forEach(function (d) {
      dr[d[0]] = num(p['a_' + d[0]]); nx[d[0]] = num(p['b_' + d[0]]);
      if (!(dr[d[0]] > 0 && dr[d[0]] <= 1)) err.push('Pozo perforado, ' + d[1] + ': probabilidad entre 0 y 1.');
      if (!(nx[d[0]] > 0 && nx[d[0]] <= 1)) err.push('Próximo prospecto, ' + d[1] + ': probabilidad entre 0 y 1.');
    });
    var comp = p.compartido;
    if (!dr.hasOwnProperty(comp)) err.push('Elegí el factor compartido entre ambos prospectos.');
    if (p.resultado !== 'seco' && p.resultado !== 'descubrimiento') err.push('Elegí el resultado del pozo.');
    if (err.length) return { errores: err };
    var prior = dr[comp], q = 1;
    ROSE_FACTORES.forEach(function (d) { if (d[0] !== comp) q *= dr[d[0]]; });
    var post = p.resultado === 'descubrimiento' ? 1 : prior * (1 - q) / (1 - prior * q);
    if (Math.abs(nx[comp] - prior) > 1e-9) av.push('El factor compartido tiene valores distintos en ambos prospectos; se usó el del pozo perforado como probabilidad previa del evento.');
    var otrosNext = 1;
    ROSE_FACTORES.forEach(function (d) { if (d[0] !== comp) otrosNext *= nx[d[0]]; });
    var pgAntes = prior * otrosNext, pgDespues = post * otrosNext;
    var rec = num(p.recursoMedio), res = { errores: [], avisos: av, prior: prior, qOtros: q, posterior: post, pgAntes: pgAntes, pgDespues: pgDespues };
    if (rec > 0) { res.recAntes = rec * pgAntes; res.recDespues = rec * pgDespues; }
    return res;
  };

  /* =====================================================
     4. PETROFÍSICA BÁSICA
     φ_D = (ρma − ρb)/(ρma − ρf)
     IGR = (GR − GRmín)/(GRmáx − GRmín); Vsh: lineal, Larionov (1969)
     Archie (1942): Sw = [a·Rw/(φ^m·Rt)]^(1/n)
     Simandoux (1963), n = 2:
       Sw = (a·Rw/(2φ^m))·[√((Vsh/Rsh)² + 4φ^m/(a·Rw·Rt)) − Vsh/Rsh]
     ===================================================== */
  C.petrofisica = function (p) {
    var err = [], av = [];
    var g = {};
    ['rhoMa', 'rhoF', 'grMin', 'grMax', 'rw', 'a', 'm', 'n', 'rsh', 'phiC', 'vshC', 'swC'].forEach(function (k) { g[k] = num(p[k]); });
    if (!(g.rhoMa > g.rhoF && g.rhoF > 0)) err.push('La densidad de matriz debe ser mayor que la del fluido (> 0).');
    if (!(g.grMax > g.grMin)) err.push('GR máximo (arcilla) debe ser mayor que GR mínimo (limpio).');
    if (!(g.rw > 0)) err.push('Rw debe ser mayor a 0.');
    if (!(g.a > 0 && g.m > 0 && g.n > 0)) err.push('a, m y n deben ser positivos.');
    var met = p.metodoSw, vtipo = p.vshTipo;
    if (met === 'simandoux' && !(g.rsh > 0)) err.push('Simandoux necesita la resistividad de la arcilla (Rsh).');
    var f = rows(p.filas).map(function (r) { return { z: num(r.z), gr: num(r.gr), rhob: num(r.rhob), rt: num(r.rt) }; });
    if (f.length < 2) err.push('Cargá al menos dos puntos de perfil.');
    f.forEach(function (r, i) {
      if (!isFinite(r.z) || !isFinite(r.gr) || !(r.rhob > 0) || !(r.rt > 0)) err.push('Fila ' + (i + 1) + ': profundidad, GR, RHOB y Rt deben ser numéricos (RHOB y Rt > 0).');
      if (i > 0 && !(r.z > f[i - 1].z)) err.push('Fila ' + (i + 1) + ': la profundidad debe ser creciente.');
    });
    if (err.length) return { errores: err };
    if (met === 'simandoux' && Math.abs(g.n - 2) > 1e-9) av.push('Simandoux está formulada con n = 2; se aplicó n = 2.');
    var out = [], hBruto = 0, hNeto = 0, sPhi = 0, sSw = 0, sVsh = 0;
    for (var i = 0; i < f.length; i++) {
      var dz = i === 0 ? f[1].z - f[0].z : i === f.length - 1 ? f[i].z - f[i - 1].z : (f[i + 1].z - f[i - 1].z) / 2;
      var phi = clamp((g.rhoMa - f[i].rhob) / (g.rhoMa - g.rhoF), 0, 0.5);
      var igr = clamp((f[i].gr - g.grMin) / (g.grMax - g.grMin), 0, 1);
      var vsh = vtipo === 'larionov_t' ? 0.083 * (Math.pow(2, 3.7 * igr) - 1) : vtipo === 'larionov_o' ? 0.33 * (Math.pow(2, 2 * igr) - 1) : igr;
      vsh = clamp(vsh, 0, 1);
      var sw;
      if (phi <= 0) sw = 1;
      else if (met === 'simandoux') {
        var b = vsh / g.rsh, pm = Math.pow(phi, g.m);
        sw = (g.a * g.rw / (2 * pm)) * (Math.sqrt(b * b + 4 * pm / (g.a * g.rw * f[i].rt)) - b);
      } else sw = Math.pow(g.a * g.rw / (Math.pow(phi, g.m) * f[i].rt), 1 / g.n);
      sw = clamp(sw, 0, 1);
      var pay = phi >= g.phiC && vsh <= g.vshC && sw <= g.swC;
      hBruto += dz; if (pay) { hNeto += dz; sPhi += phi * dz; sSw += sw * dz; sVsh += vsh * dz; }
      out.push({ z: f[i].z, dz: dz, phi: phi, vsh: vsh, sw: sw, pay: pay });
    }
    return { errores: [], avisos: av, filas: out, hBruto: hBruto, hNeto: hNeto, ng: hBruto > 0 ? hNeto / hBruto : 0,
      phiProm: hNeto > 0 ? sPhi / hNeto : null, swProm: hNeto > 0 ? sSw / hNeto : null, vshProm: hNeto > 0 ? sVsh / hNeto : null };
  };

  /* =====================================================
     5. VOLUMETRÍA PROBABILÍSTICA (Monte Carlo)
     Petróleo: N = 7758·A·h·φ·(1 − Sw)/Bo         [STB]
     Gas:      G = 43560·A·h·φ·(1 − Sw)/Bg         [scf]
               Bg = 0.02827·z·T(°R)/p              [rcf/scf]
     Variables independientes; P90 = valor superado con 90 % de probabilidad.
     ===================================================== */
  function muestrear(spec, rnd) {
    if (spec.d === 'fija') return spec.a;
    if (spec.d === 'tri') {
      var a = spec.a, b = spec.b, c = spec.c, u = rnd();
      if (c === a) return a;
      var fc = (b - a) / (c - a);
      return u < fc ? a + Math.sqrt(u * (c - a) * (b - a)) : c - Math.sqrt((1 - u) * (c - a) * (c - b));
    }
    // lognormal con P90 = a y P10 = c
    var z = 1.2815515655446004, sg = (Math.log(spec.c) - Math.log(spec.a)) / (2 * z), mu = (Math.log(spec.c) + Math.log(spec.a)) / 2;
    var u1 = Math.max(rnd(), 1e-12), u2 = rnd();
    return Math.exp(mu + sg * Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2));
  }
  C.volumetriaMC = function (p) {
    var err = [], av = [];
    var nombres = p.tipo === 'gas' ? ['area', 'h', 'phi', 'sw', 'rf'] : ['area', 'h', 'phi', 'sw', 'bo', 'rf'];
    var etq = { area: 'Área', h: 'Espesor neto', phi: 'Porosidad', sw: 'Sw', bo: 'Bo', rf: 'Factor de recuperación' };
    var vars = {};
    nombres.forEach(function (k) {
      var s = p.vars && p.vars[k];
      if (!s) { err.push(etq[k] + ': falta la distribución.'); return; }
      var sp = { d: s.d, a: num(s.a), b: num(s.b), c: num(s.c) };
      if (sp.d === 'fija') { if (!isFinite(sp.a)) err.push(etq[k] + ': valor fijo inválido.'); }
      else if (sp.d === 'tri') { if (!(isFinite(sp.a) && isFinite(sp.b) && isFinite(sp.c) && sp.a <= sp.b && sp.b <= sp.c)) err.push(etq[k] + ': triangular requiere mínimo ≤ más probable ≤ máximo.'); }
      else if (sp.d === 'logn') { if (!(sp.a > 0 && sp.c > sp.a)) err.push(etq[k] + ': lognormal requiere P90 > 0 y P10 > P90.'); }
      else err.push(etq[k] + ': distribución desconocida.');
      if (['phi', 'sw', 'rf'].indexOf(k) >= 0) { var mx = sp.d === 'fija' ? sp.a : sp.d === 'tri' ? sp.c : sp.c; if (mx > 1 || (sp.d !== 'logn' && sp.a < 0)) err.push(etq[k] + ': debe expresarse como fracción (0 a 1).'); }
      vars[k] = sp;
    });
    var bg = null;
    if (p.tipo === 'gas') {
      var pr = num(p.presion), tf = num(p.temp), z = num(p.z);
      if (!(pr > 0 && isFinite(tf) && z > 0)) err.push('Gas: presión, temperatura y z deben ser válidos.');
      else bg = 0.02827 * z * (tf + 459.67) / pr;
    }
    var N = Math.round(num(p.n) || 10000);
    if (N < 1000 || N > 100000) err.push('El número de iteraciones debe estar entre 1000 y 100000.');
    if (err.length) return { errores: err };
    var rnd = mulberry32(Math.round(num(p.semilla) || 12345));
    var inPlace = new Array(N), recup = new Array(N);
    for (var i = 0; i < N; i++) {
      var A = muestrear(vars.area, rnd), h = muestrear(vars.h, rnd);
      var phi = clamp(muestrear(vars.phi, rnd), 0, 1), sw = clamp(muestrear(vars.sw, rnd), 0, 1), rf = clamp(muestrear(vars.rf, rnd), 0, 1);
      var vol;
      if (p.tipo === 'gas') vol = 43560 * A * h * phi * (1 - sw) / bg / 1e9;
      else vol = 7758 * A * h * phi * (1 - sw) / muestrear(vars.bo, rnd) / 1e6;
      inPlace[i] = vol; recup[i] = vol * rf;
    }
    function resumen(arr) {
      var s = arr.slice().sort(function (a, b) { return a - b; }), sum = 0, sq = 0;
      for (var j = 0; j < arr.length; j++) { sum += arr[j]; }
      var media = sum / arr.length; for (var j2 = 0; j2 < arr.length; j2++) sq += (arr[j2] - media) * (arr[j2] - media);
      return { p90: quantile(s, 0.10), p50: quantile(s, 0.50), p10: quantile(s, 0.90), media: media, desvio: Math.sqrt(sq / arr.length), min: s[0], max: s[s.length - 1], orden: s };
    }
    var rr = resumen(recup), ri = resumen(inPlace);
    var bins = 24, w = (rr.max - rr.min) / bins || 1, hist = [];
    for (var b2 = 0; b2 < bins; b2++) hist.push({ x0: rr.min + b2 * w, x1: rr.min + (b2 + 1) * w, c: 0 });
    for (var k = 0; k < N; k++) { var ix = Math.min(bins - 1, Math.floor((recup[k] - rr.min) / w)); hist[ix].c++; }
    var out = { errores: [], avisos: av, unidad: p.tipo === 'gas' ? 'Bcf' : 'MMSTB', tipo: p.tipo, n: N, bg: bg,
      recup: { p90: rr.p90, p50: rr.p50, p10: rr.p10, media: rr.media, desvio: rr.desvio }, inplace: { p90: ri.p90, p50: ri.p50, p10: ri.p10, media: ri.media }, hist: hist };
    var pg = num(p.pg);
    if (pg > 0 && pg <= 1) { out.pg = pg; out.mediaRiesgeada = rr.media * pg; }
    av.push('Las variables se muestrean de forma independiente; la correlación entre porosidad y Sw, por ejemplo, no está considerada.');
    return out;
  };

  /* =====================================================
     6. ESPACIAMIENTO Y RECUPERACIÓN POR POZO
     OOIP/acre = 7758·h·φ·(1 − Sw)/Bo ; r_eq = √(A·43560/π)
     ===================================================== */
  C.espaciamiento = function (p) {
    var err = [];
    var g = {}; ['area', 'h', 'phi', 'sw', 'bo', 'rf', 'costoPozo', 'margen', 'lateral'].forEach(function (k) { g[k] = num(p[k]); });
    if (!(g.area > 0 && g.h > 0 && g.bo > 0)) err.push('Área, espesor y Bo deben ser positivos.');
    if (!(g.phi > 0 && g.phi < 1 && g.sw >= 0 && g.sw < 1 && g.rf > 0 && g.rf <= 1)) err.push('Porosidad, Sw y RF deben ser fracciones válidas.');
    if (p.modo === 'hz' && !(g.lateral > 0)) err.push('Ingresá el largo de rama lateral.');
    var lista = rows(p.lista).map(function (r) { return num(r.val); }).filter(function (x) { return x > 0; });
    if (!lista.length) err.push('Cargá al menos un espaciamiento a evaluar.');
    if (err.length) return { errores: err };
    var ooipAc = 7758 * g.h * g.phi * (1 - g.sw) / g.bo, recAc = ooipAc * g.rf;
    var eurMin = (g.costoPozo > 0 && g.margen > 0) ? g.costoPozo * 1e6 / g.margen : null;
    var filas = lista.map(function (v) {
      var ac = p.modo === 'hz' ? g.lateral * v / 43560 : v;
      var pozos = Math.floor(g.area / ac), eur = recAc * ac;
      return { valor: v, acresPozo: ac, pozos: pozos, eurPozo: eur, recTotal: eur * pozos, radio: Math.sqrt(ac * 43560 / Math.PI), economico: eurMin === null ? null : eur >= eurMin };
    });
    return { errores: [], avisos: ['Se asume drenaje completo del área asignada a cada pozo y sin interferencia; es un cálculo de referencia, no reemplaza la simulación.'], ooipAc: ooipAc, recAc: recAc, eurMin: eurMin, filas: filas };
  };

  /* =====================================================
     7. NPT Y CURVA TIEMPO-PROFUNDIDAD
     ===================================================== */
  C.analisisNPT = function (p) {
    var err = [], av = [];
    function pts(arr, nombre) {
      var r = rows(arr).map(function (x) { return { d: num(x.dia), z: num(x.prof) }; }).filter(function (x) { return isFinite(x.d) && isFinite(x.z); });
      r.sort(function (a, b) { return a.d - b.d; });
      if (r.length < 2) err.push('Cargá al menos dos puntos de la curva ' + nombre + '.');
      return r;
    }
    var plan = pts(p.plan, 'planificada'), real = pts(p.real, 'real');
    var ev = rows(p.eventos).map(function (x) { return { c: String(x.cat || 'Sin categoría').trim() || 'Sin categoría', h: num(x.h) }; }).filter(function (x) { return isFinite(x.h) && x.h >= 0; });
    var costoDia = num(p.costoDia);
    if (err.length) return { errores: err };
    var diasReal = real[real.length - 1].d - real[0].d, zFin = real[real.length - 1].z;
    if (zFin > plan[plan.length - 1].z) av.push('La profundidad real final supera el plan; el plan se tomó constante después de su último punto.');
    var diasPlanAlTD = interp(plan.map(function (x) { return { z: x.z, d: x.d }; }).sort(function (a, b) { return a.z - b.z; }), zFin, 'z', 'd');
    var nptH = ev.reduce(function (s, x) { return s + x.h; }, 0);
    var nptD = nptH / 24, prodReal = diasReal - nptD;
    var cat = {}; ev.forEach(function (x) { cat[x.c] = (cat[x.c] || 0) + x.h; });
    var cats = Object.keys(cat).map(function (k) { return { cat: k, h: cat[k] }; }).sort(function (a, b) { return b.h - a.h; });
    var acum = 0; cats.forEach(function (x) { x.pct = nptH > 0 ? x.h / nptH * 100 : 0; acum += x.pct; x.acum = acum; });
    var hitos = real.map(function (x) {
      var dp = interp(plan.map(function (q) { return { z: q.z, d: q.d }; }).sort(function (a, b) { return a.z - b.z; }), x.z, 'z', 'd');
      return { z: x.z, real: x.d - real[0].d, plan: dp - plan[0].d, delta: (x.d - real[0].d) - (dp - plan[0].d) };
    });
    var res = { errores: [], avisos: av, diasReal: diasReal, diasPlan: diasPlanAlTD - plan[0].d, desvio: diasReal - (diasPlanAlTD - plan[0].d),
      rop: zFin / diasReal, nptH: nptH, nptDias: nptD, nptPct: diasReal > 0 ? nptH / (diasReal * 24) * 100 : 0,
      ilt: prodReal - (diasPlanAlTD - plan[0].d), cats: cats, hitos: hitos, zFin: zFin, serieReal: real, seriePlan: plan };
    if (costoDia > 0) { res.costoNPT = nptD * costoDia; res.costoDesvio = res.desvio * costoDia; }
    return res;
  };

  /* =====================================================
     8. CORROSIÓN Y VIDA REMANENTE (criterio API 570 / 510)
     CR_LT = (t_ini − t_act)/años ; CR_ST = (t_prev − t_act)/Δaños
     Vida remanente = (t_act − t_min)/CR ; inspección ≤ ½ vida remanente
     t_min (B31.3) = P·D / (2(S·E·W + P·Y))
     ===================================================== */
  C.tMinB313 = function (p) {
    var P = num(p.P), D = num(p.D), S = num(p.S), E = num(p.E), Y = num(p.Y), W = isFinite(num(p.W)) ? num(p.W) : 1, ca = num(p.ca) || 0;
    if (!(P > 0 && D > 0 && S > 0 && E > 0 && E <= 1 && Y >= 0)) return { errores: ['Revisá P, D, S, E e Y: deben ser positivos (E ≤ 1).'] };
    var t = P * D / (2 * (S * E * W + P * Y));
    return { errores: [], t: t, tConCA: t + ca };
  };
  C.corrosion = function (p) {
    var err = [], av = [];
    var ti = num(p.tIni), tp = num(p.tPrev), ta = num(p.tAct), tm = num(p.tMin), aT = num(p.anosTotal), aI = num(p.anosInt), imax = num(p.intMax);
    if (!(ti > 0 && ta > 0 && tm >= 0 && aT > 0)) err.push('Espesor inicial, actual, mínimo y años de servicio deben ser válidos.');
    if (isFinite(tp) && !(aI > 0)) err.push('Con espesor previo, indicá los años entre mediciones.');
    if (!(imax > 0)) err.push('Indicá el intervalo máximo permitido (años).');
    if (err.length) return { errores: err };
    if (ta <= tm) av.push('El espesor actual ya es igual o menor al mínimo requerido: el equipo requiere evaluación inmediata (fitness-for-service).');
    var crLT = Math.max(0, (ti - ta) / aT), crST = isFinite(tp) ? Math.max(0, (tp - ta) / aI) : null;
    var cr, base;
    if (p.criterio === 'LT' || crST === null) { cr = crLT; base = 'largo plazo'; }
    else if (p.criterio === 'ST') { cr = crST; base = 'corto plazo'; }
    else { cr = Math.max(crLT, crST); base = 'el mayor de ambos (conservador)'; }
    var vr = cr > 0 ? Math.max(0, (ta - tm) / cr) : Infinity;
    var half = cr > 0 ? vr / 2 : Infinity, prox = Math.min(half, imax);
    if (cr === 0) av.push('Velocidad de corrosión nula en el período medido; la inspección se limita al intervalo máximo permitido.');
    return { errores: [], avisos: av, crLT: crLT, crST: crST, cr: cr, base: base, mpy: cr * 39.3701, vr: vr, mitad: half, proxima: prox, margen: ta - tm };
  };

  /* =====================================================
     9. INTERVALOS DE INSPECCIÓN — matriz de riesgo cualitativa (API 580)
     Riesgo = PoF × CoF (escala 1–5). Intervalos por nivel: editables.
     ===================================================== */
  C.rbi = function (p) {
    var err = [];
    var iv = { bajo: num(p.ivBajo), medio: num(p.ivMedio), medioAlto: num(p.ivMA), alto: num(p.ivAlto) };
    Object.keys(iv).forEach(function (k) { if (!(iv[k] > 0)) err.push('El intervalo del nivel ' + k + ' debe ser positivo.'); });
    var f = rows(p.filas).map(function (r) { return { nombre: String(r.nombre || '').trim(), pof: num(r.pof), cof: num(r.cof), vr: num(r.vr) }; });
    if (!f.length) err.push('Cargá al menos un componente.');
    f.forEach(function (r, i) {
      if (!(r.pof >= 1 && r.pof <= 5 && r.cof >= 1 && r.cof <= 5) || Math.floor(r.pof) !== r.pof || Math.floor(r.cof) !== r.cof) err.push('Componente ' + (i + 1) + ': PoF y CoF son enteros de 1 a 5.');
    });
    if (err.length) return { errores: err };
    var out = f.map(function (r) {
      var sc = r.pof * r.cof, niv = sc >= 16 ? 'Alto' : sc >= 10 ? 'Medio-alto' : sc >= 5 ? 'Medio' : 'Bajo';
      var base = niv === 'Alto' ? iv.alto : niv === 'Medio-alto' ? iv.medioAlto : niv === 'Medio' ? iv.medio : iv.bajo;
      var lim = isFinite(r.vr) && r.vr >= 0 ? r.vr / 2 : Infinity;
      return { nombre: r.nombre || 'Componente', pof: r.pof, cof: r.cof, score: sc, nivel: niv, intervaloBase: base, mitadVR: lim === Infinity ? null : lim, intervalo: Math.min(base, lim), limitaPor: lim < base ? 'media vida remanente' : 'nivel de riesgo' };
    }).sort(function (a, b) { return b.score - a.score; });
    return { errores: [], avisos: ['Matriz cualitativa de apoyo (API 580). No reemplaza un RBI cuantitativo (API 581) ni el criterio de la organización; los intervalos por nivel son valores de ejemplo editables.'], filas: out };
  };

  /* =====================================================
     10. SEPARADOR VERTICAL BIFÁSICO Y TANQUES
     Souders-Brown: Vt = K·√((ρL − ρg)/ρg) ; ρg = 2.7·γg·P/(Z·T)
     ===================================================== */
  var DIAMETROS_STD = [24, 30, 36, 42, 48, 54, 60, 72, 84, 96, 120];
  C.separadorVertical = function (p) {
    var err = [], av = [];
    var g = {}; ['qg', 'sg', 'P', 'T', 'Z', 'rhoL', 'K', 'qo', 'qw', 'tret', 'hGas'].forEach(function (k) { g[k] = num(p[k]); });
    if (!(g.qg > 0 && g.sg > 0 && g.P > 0 && g.Z > 0 && g.rhoL > 0 && g.K > 0)) err.push('Gas, densidad relativa, presión, Z, densidad del líquido y K deben ser positivos.');
    if (!isFinite(g.T)) err.push('Ingresá la temperatura.');
    if (!(g.qo >= 0 && g.qw >= 0 && g.qo + g.qw > 0)) err.push('Ingresá el caudal de líquido (petróleo y/o agua).');
    if (!(g.tret > 0)) err.push('Ingresá el tiempo de retención.');
    if (!(g.hGas > 0)) err.push('Ingresá la altura de la sección de gas.');
    if (err.length) return { errores: err };
    var TR = g.T + 459.67;
    var rhoG = 2.7 * g.sg * g.P / (g.Z * TR);
    if (!(g.rhoL > rhoG)) return { errores: ['La densidad del líquido debe ser mayor que la del gas.'] };
    var vt = g.K * Math.sqrt((g.rhoL - rhoG) / rhoG);
    var qAct = g.qg * 1e6 / 86400 * (14.7 / g.P) * (TR / 519.67) * g.Z;
    var area = qAct / vt, dMin = Math.sqrt(4 * area / Math.PI) * 12;
    var dStd = DIAMETROS_STD.filter(function (d) { return d >= dMin; })[0];
    if (!dStd) { av.push('El diámetro mínimo excede los tamaños estándar considerados; evaluá un separador horizontal o varias unidades.'); dStd = Math.ceil(dMin / 6) * 6; }
    var volLiq = (g.qo + g.qw) * 5.615 / 1440 * g.tret;
    var areaStd = Math.PI * Math.pow(dStd / 12, 2) / 4, hLiq = volLiq / areaStd, hTot = hLiq + g.hGas, esb = hTot / (dStd / 12);
    if (esb < 3 || esb > 5) av.push('Relación altura/diámetro = ' + esb.toFixed(1) + ': fuera del rango usual de 3 a 5. Ajustá el diámetro o la altura de la sección de gas.');
    return { errores: [], avisos: av, rhoG: rhoG, vt: vt, qAct: qAct, area: area, dMin: dMin, dStd: dStd, volLiq: volLiq, hLiq: hLiq, hTot: hTot, esbeltez: esb };
  };
  C.tanque = function (p) {
    var q = num(p.q), dias = num(p.dias), ff = num(p.ff), alturas = rows(p.alturas).map(function (r) { return num(r.h); }).filter(function (x) { return x > 0; });
    if (!(q > 0 && dias > 0 && ff > 0 && ff <= 1)) return { errores: ['Caudal, días de almacenamiento y factor de llenado (0–1) deben ser válidos.'] };
    if (!alturas.length) return { errores: ['Cargá al menos una altura de tanque.'] };
    var vNom = q * dias / ff;
    var filas = alturas.map(function (h) {
      var d = Math.sqrt(4 * vNom * 5.6146 / (Math.PI * h));
      return { h: h, d: d, vol: vNom, m3: vNom * 0.158987 };
    });
    return { errores: [], avisos: ['Dimensiones geométricas de referencia; el diseño de tanques (API 650) define espesores, techos y tamaños comerciales.'], vNom: vNom, vNomM3: vNom * 0.158987, filas: filas };
  };

  /* =====================================================
     11. HIDRÁULICA DE LÍNEA — líquido monofásico
     Re = 1488·ρ·v·D/μ ; f (Swamee-Jain) ; ΔP = f·(L/D)·ρ·v²/(2·gc)
     Velocidad erosional (API RP 14E): Ve = C/√ρ
     ===================================================== */
  var ID_SCH40 = [[2, 2.067], [3, 3.068], [4, 4.026], [6, 6.065], [8, 7.981], [10, 10.02], [12, 11.938]];
  function dpLinea(qbpd, rho, mu, idIn, L, eps, dz) {
    var qft = qbpd * 5.615 / 86400, A = Math.PI * idIn * idIn / 4 / 144, v = qft / A, D = idIn / 12;
    var Re = 1488 * rho * v * D / mu, f;
    if (Re < 2100) f = 64 / Re;
    else f = 0.25 / Math.pow(Math.log10(eps / idIn / 3.7 + 5.74 / Math.pow(Re, 0.9)), 2);
    var dpf = f * (L / D) * rho * v * v / (2 * 32.174) / 144;
    return { v: v, Re: Re, f: f, dpFric: dpf, dpElev: rho * dz / 144, regimen: Re < 2100 ? 'laminar' : Re < 4000 ? 'transición' : 'turbulento' };
  }
  C.lineaLiquido = function (p) {
    var g = {}; ['q', 'rho', 'mu', 'id', 'L', 'eps', 'dz', 'Pin', 'Ccoef'].forEach(function (k) { g[k] = num(p[k]); });
    var err = [];
    if (!(g.q > 0 && g.rho > 0 && g.mu > 0 && g.id > 0 && g.L > 0 && g.eps >= 0)) err.push('Caudal, densidad, viscosidad, diámetro interno, longitud y rugosidad deben ser válidos.');
    if (!isFinite(g.dz)) g.dz = 0;
    if (!(g.Ccoef > 0)) err.push('Ingresá el coeficiente C de velocidad erosional (por ejemplo 100).');
    if (err.length) return { errores: err };
    var r = dpLinea(g.q, g.rho, g.mu, g.id, g.L, g.eps, g.dz);
    var ve = g.Ccoef / Math.sqrt(g.rho), av = [];
    if (r.v > ve) av.push('La velocidad (' + r.v.toFixed(1) + ' ft/s) supera la erosional (' + ve.toFixed(1) + ' ft/s).');
    if (r.regimen === 'transición') av.push('Régimen de transición (Re entre 2100 y 4000): el factor de fricción es incierto.');
    var cand = ID_SCH40.map(function (c) {
      var x = dpLinea(g.q, g.rho, g.mu, c[1], g.L, g.eps, g.dz);
      return { nps: c[0], id: c[1], v: x.v, dpFric: x.dpFric, dpTotal: x.dpFric + x.dpElev, ok: x.v <= ve };
    });
    var res = { errores: [], avisos: av, v: r.v, Re: r.Re, f: r.f, regimen: r.regimen, dpFric: r.dpFric, dpElev: r.dpElev, dpTotal: r.dpFric + r.dpElev, ve: ve, candidatos: cand };
    if (g.Pin > 0) res.pOut = g.Pin - res.dpTotal;
    return res;
  };

  /* =====================================================
     12. ECONOMÍA UPSTREAM — flujo simplificado y tornado
     Volumen anual (declinación exponencial, qi en bbl/d):
       V_t = qi·365·(1 − e^−D)/D · e^−D(t−1)
     ===================================================== */
  function npvDe(flujos, r) { var s = 0; for (var t = 0; t < flujos.length; t++) s += flujos[t] / Math.pow(1 + r, t); return s; }
  function tirDe(flujos) {
    var lo = -0.9, hi = 10;
    if (npvDe(flujos, lo) * npvDe(flujos, hi) > 0) return null;
    for (var i = 0; i < 200; i++) { var mid = (lo + hi) / 2; if (npvDe(flujos, lo) * npvDe(flujos, mid) <= 0) hi = mid; else lo = mid; }
    return (lo + hi) / 2;
  }
  function flujoUpstream(q) {
    var F = [-q.capex], vols = [], D = q.D, dep = q.capex / q.anios;
    for (var t = 1; t <= q.anios; t++) {
      var v = D < 1e-9 ? q.qi * 365 : q.qi * 365 * (1 - Math.exp(-D)) / D * Math.exp(-D * (t - 1));
      var ing = v * q.precio / 1e6, reg = ing * q.regalia, opex = v * q.opexVar / 1e6 + q.opexFijo;
      var base = ing - reg - opex - dep, imp = Math.max(0, base) * q.tasaImp;
      F.push(ing - reg - opex - imp); vols.push(v);
    }
    return { flujos: F, vols: vols, npv: npvDe(F, q.tasaDesc) };
  }
  function validarUpstream(p) {
    var q = {}, err = [];
    ['capex', 'qi', 'D', 'anios', 'precio', 'regalia', 'opexVar', 'opexFijo', 'tasaImp', 'tasaDesc'].forEach(function (k) { q[k] = num(p[k]); });
    if (!(q.capex >= 0 && q.qi > 0 && q.D >= 0 && q.anios >= 1 && q.precio > 0)) err.push('CAPEX, caudal inicial, declinación, años y precio deben ser válidos.');
    ['regalia', 'tasaImp', 'tasaDesc'].forEach(function (k) { if (!(q[k] >= 0 && q[k] < 1)) err.push(k + ' debe ser una fracción entre 0 y 1.'); });
    if (!(q.opexVar >= 0 && q.opexFijo >= 0)) err.push('Los costos operativos no pueden ser negativos.');
    q.anios = Math.round(q.anios);
    return { q: q, err: err };
  }
  function tornadoGenerico(base, vars, delta, fn) {
    var b = fn(base), filas = vars.map(function (v) {
      var lo = Object.assign({}, base), hi = Object.assign({}, base);
      v.set(lo, 1 - delta); v.set(hi, 1 + delta);
      var a = fn(lo), c = fn(hi);
      return { id: v.id, etiqueta: v.etq, bajo: Math.min(a, c), alto: Math.max(a, c), swing: Math.abs(c - a) };
    }).sort(function (x, y) { return y.swing - x.swing; });
    return { base: b, filas: filas };
  }
  C.tornadoUpstream = function (p) {
    var v = validarUpstream(p), delta = num(p.delta);
    if (!(delta > 0 && delta < 1)) v.err.push('La variación debe ser una fracción entre 0 y 1 (por ejemplo 0.2).');
    if (v.err.length) return { errores: v.err };
    var q = v.q, r = flujoUpstream(q);
    var vars = ['precio', 'qi', 'D', 'opexVar', 'capex', 'regalia', 'tasaDesc'].map(function (k) {
      var etq = { precio: 'Precio', qi: 'Caudal inicial', D: 'Declinación', opexVar: 'OPEX variable', capex: 'CAPEX', regalia: 'Regalías', tasaDesc: 'Tasa de descuento' }[k];
      return { id: k, etq: etq, set: function (o, f) { o[k] = q[k] * f; } };
    });
    var tor = tornadoGenerico(q, vars, delta, function (o) { return flujoUpstream(o).npv; });
    var lo = 1, hi = 2000, be = null;
    function f(pr) { var o = Object.assign({}, q); o.precio = pr; return flujoUpstream(o).npv; }
    if (f(lo) < 0 && f(hi) > 0) { for (var i = 0; i < 100; i++) { var mid = (lo + hi) / 2; if (f(mid) > 0) hi = mid; else lo = mid; } be = (lo + hi) / 2; }
    var acum = 0, pb = null;
    for (var t = 0; t < r.flujos.length; t++) { var prev = acum; acum += r.flujos[t]; if (pb === null && acum >= 0 && t > 0) pb = t - 1 + (-prev) / r.flujos[t]; }
    return { errores: [], avisos: ['Modelo simplificado: declinación exponencial, flujos de fin de año, depreciación lineal del CAPEX, sin arrastre de pérdidas fiscales.'],
      npv: r.npv, tir: tirDe(r.flujos), payback: pb, breakeven: be, flujos: r.flujos, vols: r.vols, volTotal: r.vols.reduce(function (a, b) { return a + b; }, 0), tornado: tor, delta: delta };
  };

  /* =====================================================
     13. MARGEN DE REFINACIÓN — crack spread y margen con rendimientos
     Crack n-g-d = (g·Pg·42 + d·Pd·42 − n·Pcrudo)/n   [USD/bbl de crudo]
     ===================================================== */
  C.crackSpread = function (p) {
    var cr = num(p.crudo), pg = num(p.gasolina), pd = num(p.diesel);
    if (!(cr > 0 && pg > 0 && pd > 0)) return { errores: ['Crudo (USD/bbl), gasolina y diésel (USD/gal) deben ser positivos.'] };
    var esq = [['3-2-1', 3, 2, 1], ['5-3-2', 5, 3, 2], ['2-1-1', 2, 1, 1]].map(function (e) {
      return { nombre: e[0], n: e[1], g: e[2], d: e[3], crack: (e[2] * pg * 42 + e[3] * pd * 42 - e[1] * cr) / e[1] };
    });
    var res = { errores: [], avisos: [], esquemas: esq, gasolinaBbl: pg * 42, dieselBbl: pd * 42 };
    var yg = num(p.yG), yd = num(p.yD), yo = num(p.yO), po = num(p.pO), ox = num(p.opex);
    if (isFinite(yg) && isFinite(yd) && isFinite(yo)) {
      var sum = yg + yd + yo;
      if (sum < 95 || sum > 105) res.avisos.push('Los rendimientos suman ' + sum.toFixed(1) + ' %; deberían estar entre 95 y 105 % (la ganancia volumétrica de refinación existe, pero es limitada).');
      res.rendBruto = (yg / 100 * pg * 42 + yd / 100 * pd * 42 + (isFinite(po) ? yo / 100 * po : 0)) - cr;
      if (isFinite(ox) && ox >= 0) res.margenNeto = res.rendBruto - ox;
      res.sumaRend = sum;
    }
    return res;
  };

  /* =====================================================
     14. SENSIBILIDAD DE PRECIOS — DOWNSTREAM
     Margen unitario = Σ y_i·P_i − P_crudo − OPEX   [USD/bbl]
     ===================================================== */
  function margenDown(q) {
    var mu = q.yG * q.pG * 42 + q.yD * q.pD * 42 + q.yO * q.pO - q.crudo - q.opex;
    var ebitda = q.thr * q.util * q.dias * mu / 1e6, dep = q.capex / q.anios, F = [-q.capex];
    for (var t = 1; t <= q.anios; t++) F.push(ebitda - Math.max(0, ebitda - dep) * q.tasaImp);
    return { mu: mu, ebitda: ebitda, flujos: F, npv: npvDe(F, q.tasaDesc) };
  }
  C.tornadoDownstream = function (p) {
    var q = {}, err = [];
    ['thr', 'util', 'dias', 'crudo', 'pG', 'pD', 'pO', 'yG', 'yD', 'yO', 'opex', 'capex', 'anios', 'tasaImp', 'tasaDesc', 'delta'].forEach(function (k) { q[k] = num(p[k]); });
    if (!(q.thr > 0 && q.util > 0 && q.util <= 1 && q.dias > 0 && q.dias <= 366)) err.push('Capacidad, utilización (0–1) y días de operación deben ser válidos.');
    if (!(q.crudo > 0 && q.pG > 0 && q.pD > 0 && q.pO >= 0)) err.push('Los precios deben ser positivos.');
    if (!(q.yG >= 0 && q.yD >= 0 && q.yO >= 0)) err.push('Los rendimientos no pueden ser negativos (fracción 0–1).');
    if (!(q.opex >= 0 && q.capex >= 0 && q.anios >= 1)) err.push('OPEX, inversión y años deben ser válidos.');
    ['tasaImp', 'tasaDesc'].forEach(function (k) { if (!(q[k] >= 0 && q[k] < 1)) err.push(k + ' debe ser una fracción entre 0 y 1.'); });
    if (!(q.delta > 0 && q.delta < 1)) err.push('La variación debe ser una fracción entre 0 y 1.');
    if (err.length) return { errores: err };
    q.anios = Math.round(q.anios);
    var av = [], sum = q.yG + q.yD + q.yO;
    if (sum < 0.95 || sum > 1.05) av.push('Los rendimientos suman ' + (sum * 100).toFixed(1) + ' %; deberían estar entre 95 y 105 %.');
    var b = margenDown(q);
    var def = [['crudo', 'Precio del crudo'], ['pG', 'Precio de gasolina'], ['pD', 'Precio de diésel'], ['opex', 'OPEX'], ['util', 'Utilización'], ['capex', 'Inversión']];
    var vars = def.map(function (d) { return { id: d[0], etq: d[1], set: function (o, f) { o[d[0]] = q[d[0]] * f; if (d[0] === 'util') o.util = Math.min(1, o.util); } }; });
    var tor = tornadoGenerico(q, vars, q.delta, function (o) { return margenDown(o).npv; });
    return { errores: [], avisos: av.concat(['Modelo simplificado: margen constante, flujos de fin de año, depreciación lineal de la inversión.']), margenUnit: b.mu, ebitda: b.ebitda, npv: b.npv, tir: tirDe(b.flujos), flujos: b.flujos, tornado: tor, delta: q.delta };
  };


  /* =====================================================
     15. PVT POR CORRELACIONES
     Petróleo — Standing (1947): Pb = 18.2[(Rs/γg)^0.83·10^(0.00091T − 0.0125API) − 1.4]
       Rs(P) = γg[(P/18.2 + 1.4)·10^(0.0125API − 0.00091T)]^1.2048
       Bo = 0.9759 + 0.000120[Rs(γg/γo)^0.5 + 1.25T]^1.2
     Gas — pseudocríticas de Sutton (1985), z de Papay (1968), Bg = 0.02827·z·T/p
     ===================================================== */
  C.pvt = function (p) {
    var err = [], av = [];
    var sg = num(p.sg), T = num(p.T), pmax = num(p.pmax), paso = num(p.paso);
    if (!(sg > 0.55 && sg < 1.5)) err.push('La densidad relativa del gas debe estar entre 0,55 y 1,5.');
    if (!(T > 50 && T < 400)) err.push('La temperatura de reservorio debe estar entre 50 y 400 °F.');
    if (!(pmax > 0 && paso > 0 && pmax / paso <= 60)) err.push('Presión máxima y paso deben ser positivos (hasta 60 puntos).');
    var P = []; for (var x = paso; x <= pmax + 1e-9; x += paso) P.push(x);
    if (p.fluido === 'gas') {
      if (err.length) return { errores: err };
      var tpc = 169.2 + 349.5 * sg - 74 * sg * sg, ppc = 756.8 - 131 * sg - 3.6 * sg * sg, tpr = (T + 459.67) / tpc;
      if (tpr < 1.05 || tpr > 3) av.push('Tpr = ' + tpr.toFixed(2) + ': fuera del rango de validez de Papay (1,05–3).');
      var filas = P.map(function (pp) {
        var ppr = pp / ppc, z = 1 - 3.52 * ppr / Math.pow(10, 0.9813 * tpr) + 0.274 * ppr * ppr / Math.pow(10, 0.8157 * tpr);
        if (ppr > 15) av.push('Ppr > 15 en algún punto: fuera de rango.');
        return { P: pp, z: z, Bg: 0.02827 * z * (T + 459.67) / pp };
      });
      return { errores: [], avisos: av.filter(function (a, i, r) { return r.indexOf(a) === i; }), fluido: 'gas', tpc: tpc, ppc: ppc, tpr: tpr, filas: filas };
    }
    var api = num(p.api), rsb = num(p.rsb), co = num(p.co);
    if (!(api > 10 && api < 60)) err.push('La gravedad API debe estar entre 10 y 60.');
    if (!(rsb > 0)) err.push('La RGP en el punto de burbuja (Rs) debe ser positiva.');
    if (!(co > 0)) err.push('Ingresá la compresibilidad del petróleo sobre Pb (por ejemplo 1e-5 1/psi).');
    if (err.length) return { errores: err };
    var go = 141.5 / (131.5 + api), a10 = Math.pow(10, 0.00091 * T - 0.0125 * api);
    var pb = 18.2 * (Math.pow(rsb / sg, 0.83) * a10 - 1.4);
    function rs(pp) { return sg * Math.pow((pp / 18.2 + 1.4) / a10, 1.2048); }
    function bo(r) { return 0.9759 + 0.00012 * Math.pow(r * Math.sqrt(sg / go) + 1.25 * T, 1.2); }
    var bob = bo(rsb);
    if (rsb > 1425 || api > 48 || pb > 7000) av.push('Algún valor queda fuera del rango de datos de Standing (Rs ≤ 1425, API ≤ 48, Pb ≤ 7000 psia); tomá el resultado con cautela.');
    var filas2 = P.map(function (pp) {
      var r = pp < pb ? rs(pp) : rsb, b = pp < pb ? bo(r) : bob * Math.exp(-co * (pp - pb));
      return { P: pp, Rs: r, Bo: b, rho: (62.4 * go + 0.0136 * sg * r) / b };
    });
    return { errores: [], avisos: av, fluido: 'oil', go: go, pb: pb, bob: bob, filas: filas2 };
  };

  /* =====================================================
     16. BALANCE DE MATERIALES DE GAS (p/z)
     p/z = a + b·Gp ;  G = −a/b ;  Gp(abandono) = (p/z_ab − a)/b
     ===================================================== */
  C.balanceGas = function (p) {
    var err = [], av = [];
    var sg = num(p.sg), T = num(p.T), pab = num(p.pab);
    var f = rows(p.filas).map(function (r) { return { p: num(r.p), z: num(r.z), gp: num(r.gp) }; });
    if (f.length < 3) err.push('Cargá al menos 3 puntos de presión y producción acumulada.');
    var necesitaZ = f.some(function (r) { return !(r.z > 0); });
    if (necesitaZ && !(sg > 0 && isFinite(T))) err.push('Hay puntos sin z: ingresá densidad relativa y temperatura para estimarlo (Papay).');
    f.forEach(function (r, i) { if (!(r.p > 0) || !(r.gp >= 0)) err.push('Punto ' + (i + 1) + ': presión > 0 y Gp ≥ 0.'); });
    if (!(pab > 0)) err.push('Ingresá la presión de abandono.');
    if (err.length) return { errores: err };
    function zP(pp) { var tpc = 169.2 + 349.5 * sg - 74 * sg * sg, ppc = 756.8 - 131 * sg - 3.6 * sg * sg, tpr = (T + 459.67) / tpc, ppr = pp / ppc; return 1 - 3.52 * ppr / Math.pow(10, 0.9813 * tpr) + 0.274 * ppr * ppr / Math.pow(10, 0.8157 * tpr); }
    var pts = f.map(function (r) { var z = r.z > 0 ? r.z : zP(r.p); return { gp: r.gp, pz: r.p / z, z: z, p: r.p, calcZ: !(r.z > 0) }; }), n = pts.length;
    var sx = 0, sy = 0, sxx = 0, sxy = 0, i;
    for (i = 0; i < n; i++) { sx += pts[i].gp; sy += pts[i].pz; sxx += pts[i].gp * pts[i].gp; sxy += pts[i].gp * pts[i].pz; }
    var den = n * sxx - sx * sx; if (Math.abs(den) < 1e-12) return { errores: ['Los puntos no tienen variación de producción acumulada.'] };
    var b = (n * sxy - sx * sy) / den, a = (sy - b * sx) / n;
    if (!(b < 0)) return { errores: ['La pendiente de p/z vs Gp no es negativa: revisá los datos (la presión debe caer al producir).'] };
    var ym = sy / n, sst = 0, sse = 0; for (i = 0; i < n; i++) { sst += Math.pow(pts[i].pz - ym, 2); sse += Math.pow(pts[i].pz - (a + b * pts[i].gp), 2); }
    var r2 = sst > 0 ? 1 - sse / sst : 1, G = -a / b;
    var zab = (sg > 0 && isFinite(T)) ? zP(pab) : 1, gpab = (pab / zab - a) / b;
    if (!(sg > 0 && isFinite(T))) av.push('Sin sg y T no se pudo estimar z a la presión de abandono; se usó z = 1.');
    if (r2 < 0.98) av.push('R² = ' + r2.toFixed(3) + ': los datos se alejan de una recta; puede haber empuje de agua, compactación o datos de presión poco confiables.');
    if (pts[n - 1].gp / G < 0.1) av.push('Solo se produjo ' + (pts[n - 1].gp / G * 100).toFixed(0) + ' % del G estimado: la extrapolación es muy incierta.');
    return { errores: [], avisos: av, pts: pts, a: a, b: b, r2: r2, G: G, zab: zab, gpAb: gpab, rf: gpab / G, rfActual: pts[n - 1].gp / G, pzAb: pab / zab };
  };

  /* =====================================================
     17. DECLINACIÓN DE ARPS — ajuste, EUR e incertidumbre (bootstrap de residuos)
     q = qi / (1 + b·Di·t)^(1/b)   (b = 0: exponencial). t en meses, q por día.
     ===================================================== */
  function arpsQ(qi, di, b, t) { return b < 1e-9 ? qi * Math.exp(-di * t) : qi / Math.pow(1 + b * di * t, 1 / b); }
  function arpsNp(qi, di, b, q) { // acumulada (en unidades de q·mes) hasta que el caudal baja a q
    if (b < 1e-9) return (qi - q) / di;
    if (Math.abs(b - 1) < 1e-9) return qi / di * Math.log(qi / q);
    return Math.pow(qi, b) / ((1 - b) * di) * (Math.pow(qi, 1 - b) - Math.pow(q, 1 - b));
  }
  function arpsEUR(qi, di, b, qlim, tmax) {
    var tl = b < 1e-9 ? Math.log(qi / qlim) / di : (Math.pow(qi / qlim, b) - 1) / (b * di);
    var t = Math.min(tl, tmax), q = arpsQ(qi, di, b, t);
    return { t: t, q: q, np: arpsNp(qi, di, b, q) * 30.4375 };
  }
  function ajusteArps(ts, lq, b, diGrid) {
    var best = null, n = ts.length;
    diGrid.forEach(function (di) {
      var m = 0, k, u = [];
      for (k = 0; k < n; k++) { var base = b < 1e-9 ? di * ts[k] : Math.log(1 + b * di * ts[k]) / b; u.push(base); m += lq[k] + base; }
      m /= n; var sse = 0; for (k = 0; k < n; k++) sse += Math.pow(lq[k] - (m - u[k]), 2);
      if (!best || sse < best.sse) best = { di: di, qi: Math.exp(m), sse: sse, b: b };
    });
    return best;
  }
  C.declinacion = function (p) {
    var err = [], av = [];
    var f = rows(p.filas).map(function (r) { return { t: num(r.t), q: num(r.q) }; });
    var qlim = num(p.qlim), tmax = num(p.tmax), bfix = num(p.bfijo);
    if (f.length < 6) err.push('Cargá al menos 6 puntos de caudal (mes y caudal).');
    f.forEach(function (r, i) { if (!(r.t >= 0) || !(r.q > 0)) err.push('Punto ' + (i + 1) + ': mes ≥ 0 y caudal > 0.'); if (i > 0 && !(r.t > f[i - 1].t)) err.push('Punto ' + (i + 1) + ': los meses deben ser crecientes.'); });
    if (!(qlim > 0)) err.push('Ingresá el caudal límite económico.');
    if (!(tmax > 0)) err.push('Ingresá el horizonte máximo en meses.');
    if (p.modoB === 'fijo' && !(bfix >= 0 && bfix <= 2)) err.push('El exponente b fijo debe estar entre 0 y 2.');
    if (err.length) return { errores: err };
    var ts = f.map(function (r) { return r.t; }), lq = f.map(function (r) { return Math.log(r.q); });
    var dig = []; for (var i = 0; i < 240; i++) dig.push(Math.exp(Math.log(0.001) + (Math.log(2) - Math.log(0.001)) * i / 239));
    var bs = p.modoB === 'fijo' ? [bfix] : []; if (!bs.length) for (var j = 0; j <= 20; j++) bs.push(j * 0.1);
    var best = null; bs.forEach(function (b) { var a = ajusteArps(ts, lq, b, dig); if (!best || a.sse < best.sse) best = a; });
    var n = f.length, ym = lq.reduce(function (s, x) { return s + x; }, 0) / n, sst = lq.reduce(function (s, x) { return s + Math.pow(x - ym, 2); }, 0);
    var r2 = sst > 0 ? 1 - best.sse / sst : 1, res = lq.map(function (x, k) { return x - Math.log(arpsQ(best.qi, best.di, best.b, ts[k])); });
    if (best.b > 1) av.push('b > 1: el ajuste es típico de flujo transitorio en no convencionales; el EUR depende fuertemente del horizonte y del límite económico.');
    if (best.b >= 1.99 || (best.di <= 0.00101)) av.push('El ajuste llegó al borde del rango de búsqueda; los datos no definen bien la declinación.');
    var eur = arpsEUR(best.qi, best.di, best.b, qlim, tmax);
    if (eur.t >= tmax) av.push('El caudal límite no se alcanza en el horizonte: el EUR está limitado por el horizonte de ' + tmax + ' meses.');
    var rnd = mulberry32(Math.round(num(p.semilla) || 2024)), euros = [], dig2 = dig.filter(function (x, k) { return k % 4 === 0; });
    for (var it = 0; it < 150; it++) {
      var lqb = ts.map(function (t, k) { return Math.log(arpsQ(best.qi, best.di, best.b, t)) + res[Math.floor(rnd() * n)]; });
      var a2 = ajusteArps(ts, lqb, best.b, dig2), e = arpsEUR(a2.qi, a2.di, a2.b, qlim, tmax).np; if (isFinite(e)) euros.push(e);
    }
    euros.sort(function (x, y) { return x - y; });
    var tf = Math.min(eur.t * 1.05, tmax), curva = []; for (var k2 = 0; k2 <= 60; k2++) { var t2 = tf * k2 / 60; curva.push([t2, arpsQ(best.qi, best.di, best.b, t2)]); }
    av.push('El rango P90/P50/P10 se obtiene remuestreando los residuos del ajuste (150 réplicas): refleja el ruido de los datos, no la incertidumbre del modelo (b y régimen de flujo).');
    return { errores: [], avisos: av, qi: best.qi, di: best.di, b: best.b, r2: r2, eur: eur, p90: quantile(euros, 0.1), p50: quantile(euros, 0.5), p10: quantile(euros, 0.9), datos: f, curva: curva, nBoot: euros.length };
  };

  /* =====================================================
     18. CALIBRACIÓN CORE–PERFIL Y CUT-OFFS
     log10(k) = a + b·φ ;  φ_corte = (log10(k_corte) − a)/b
     ===================================================== */
  C.coreLog = function (p) {
    var err = [], av = [];
    var f = rows(p.filas).map(function (r) { return { phi: num(r.phi), k: num(r.k), pl: num(r.phiLog) }; }), kc = num(p.kcorte);
    if (f.length < 5) err.push('Cargá al menos 5 muestras de core (porosidad y permeabilidad).');
    f.forEach(function (r, i) { if (!(r.phi > 0 && r.phi < 0.6) || !(r.k > 0)) err.push('Muestra ' + (i + 1) + ': porosidad como fracción (0–0,6) y permeabilidad > 0.'); });
    if (!(kc > 0)) err.push('Ingresá la permeabilidad de corte.');
    if (err.length) return { errores: err };
    var n = f.length, x = f.map(function (r) { return r.phi; }), y = f.map(function (r) { return Math.log10(r.k); });
    var mx = x.reduce(function (s, v) { return s + v; }, 0) / n, my = y.reduce(function (s, v) { return s + v; }, 0) / n, sxx = 0, sxy = 0, syy = 0;
    for (var i = 0; i < n; i++) { sxx += Math.pow(x[i] - mx, 2); sxy += (x[i] - mx) * (y[i] - my); syy += Math.pow(y[i] - my, 2); }
    if (sxx < 1e-12) return { errores: ['Las porosidades son todas iguales; no se puede ajustar la relación.'] };
    var b = sxy / sxx, a = my - b * mx, r2 = syy > 0 ? sxy * sxy / (sxx * syy) : 1;
    if (!(b > 0)) av.push('La pendiente es negativa o nula: la permeabilidad no crece con la porosidad en estos datos.');
    if (r2 < 0.6) av.push('R² = ' + r2.toFixed(2) + ': relación φ–k débil; el cut-off de porosidad derivado es poco confiable (considerá separar por facies).');
    var phiC = b > 0 ? (Math.log10(kc) - a) / b : null;
    var out = { errores: [], avisos: av, n: n, a: a, b: b, r2: r2, kcorte: kc, phiCorte: phiC, pts: f.map(function (r) { return [r.phi, Math.log10(r.k)]; }), phiRango: [Math.min.apply(null, x), Math.max.apply(null, x)] };
    var pr = f.filter(function (r) { return r.pl > 0; });
    if (pr.length >= 3) {
      var d = pr.map(function (r) { return r.pl - r.phi; }), bias = d.reduce(function (s, v) { return s + v; }, 0) / d.length, rmse = Math.sqrt(d.reduce(function (s, v) { return s + v * v; }, 0) / d.length);
      var mp = pr.reduce(function (s, r) { return s + r.phi; }, 0) / pr.length, ml = pr.reduce(function (s, r) { return s + r.pl; }, 0) / pr.length, sp = 0, sl = 0, spl = 0;
      pr.forEach(function (r) { sp += Math.pow(r.phi - mp, 2); sl += Math.pow(r.pl - ml, 2); spl += (r.phi - mp) * (r.pl - ml); });
      out.perfil = { n: pr.length, bias: bias, rmse: rmse, r2: sp > 0 && sl > 0 ? spl * spl / (sp * sl) : null, pts: pr.map(function (r) { return [r.phi, r.pl]; }) };
      if (Math.abs(bias) > 0.01) av.push('El perfil difiere del core en promedio ' + (bias * 100).toFixed(1) + ' puntos de porosidad (sesgo > 1 punto): revisá densidad de matriz, correcciones y profundidad core vs log.');
    }
    return out;
  };

  /* =====================================================
     19. ANÁLISIS DE RESTAURACIÓN DE PRESIÓN (HORNER)
     p_ws = p* − m·log10((tp + Δt)/Δt)
     kh = 162.6·q·B·μ/m ;  s = 1.151[(p1h − p_wf)/m − log10(k/(φ·μ·ct·rw²)) + 3.23]
     ===================================================== */
  C.horner = function (p) {
    var err = [], av = [];
    var g = {}; ['q', 'B', 'mu', 'h', 'phi', 'ct', 'rw', 'tp', 'pwf'].forEach(function (k) { g[k] = num(p[k]); });
    ['q', 'B', 'mu', 'h', 'phi', 'ct', 'rw', 'tp'].forEach(function (k) { if (!(g[k] > 0)) err.push('El dato «' + k + '» debe ser positivo.'); });
    if (!isFinite(g.pwf)) err.push('Ingresá la presión fluyente de cierre p_wf.');
    var f = rows(p.filas).map(function (r) { return { dt: num(r.dt), p: num(r.p) }; });
    f.forEach(function (r, i) { if (!(r.dt > 0) || !isFinite(r.p)) err.push('Punto ' + (i + 1) + ': Δt > 0 y presión numérica.'); });
    var desde = num(p.desde), hasta = num(p.hasta);
    if (err.length) return { errores: err };
    f.forEach(function (r) { r.x = Math.log10((g.tp + r.dt) / r.dt); });
    var sel = f.filter(function (r) { return (!(desde > 0) || r.dt >= desde) && (!(hasta > 0) || r.dt <= hasta); });
    if (sel.length < 3) return { errores: ['El tramo recto elegido tiene menos de 3 puntos: ampliá el rango de Δt.'] };
    var n = sel.length, mx = 0, my = 0, i; sel.forEach(function (r) { mx += r.x / n; my += r.p / n; });
    var sxx = 0, sxy = 0, syy = 0; sel.forEach(function (r) { sxx += Math.pow(r.x - mx, 2); sxy += (r.x - mx) * (r.p - my); syy += Math.pow(r.p - my, 2); });
    if (sxx < 1e-12) return { errores: ['Los puntos del tramo no varían en tiempo.'] };
    var slope = sxy / sxx, m = -slope, pstar = my - slope * mx, r2 = syy > 0 ? sxy * sxy / (sxx * syy) : 1;
    if (!(m > 0)) return { errores: ['La pendiente no es positiva (la presión debe subir al cerrar el pozo): revisá los datos.'] };
    var kh = 162.6 * g.q * g.B * g.mu / m, k = kh / g.h;
    var p1h = pstar - m * Math.log10(g.tp + 1);
    var skin = 1.151 * ((p1h - g.pwf) / m - Math.log10(k / (g.phi * g.mu * g.ct * g.rw * g.rw)) + 3.23), dpSkin = 0.87 * m * skin;
    var fe = (pstar - g.pwf - dpSkin) / (pstar - g.pwf);
    if (r2 < 0.99) av.push('R² = ' + r2.toFixed(3) + ' en el tramo recto: puede no ser el período de flujo radial; probá otro rango de Δt.');
    if (f.length && f[f.length - 1].dt < 10) av.push('El cierre es corto (último Δt < 10 h): confirmá que se alcanzó flujo radial antes de usar kh y skin.');
    if (g.tp < 0) av.push('');
    return { errores: [], avisos: av.filter(Boolean), m: m, pstar: pstar, r2: r2, kh: kh, k: k, p1h: p1h, skin: skin, dpSkin: dpSkin, eficiencia: fe, n: n,
      datos: f.map(function (r) { return [r.x, r.p, r.dt >= (desde > 0 ? desde : 0) && (!(hasta > 0) || r.dt <= hasta)]; }), tramo: sel.map(function (r) { return r.x; }) };
  };

  /* =====================================================
     20. BALANCE DE MATERIALES DE PETRÓLEO — Havlena & Odeh (1963)
     F = Np[Bo + (Rp − Rs)Bg] + Wp·Bw ;  Eo = (Bo − Boi) + (Rsi − Rs)Bg ;  Eg = Boi(Bg/Bgi − 1)
     F − We = N(Eo + m·Eg)   → N por regresión por el origen
     ===================================================== */
  C.balancePetroleo = function (p) {
    var err = [], av = [];
    var boi = num(p.boi), rsi = num(p.rsi), bgi = num(p.bgi), m = isFinite(num(p.m)) ? num(p.m) : 0, bw = isFinite(num(p.bw)) ? num(p.bw) : 1;
    if (!(boi > 0 && rsi >= 0 && bgi > 0)) err.push('Boi, Rsi y Bgi deben ser válidos (Boi y Bgi > 0).');
    if (!(m >= 0)) err.push('La relación de casquete de gas m no puede ser negativa.');
    var f = rows(p.filas).map(function (r) { return { p: num(r.p), np: num(r.np), rp: num(r.rp), bo: num(r.bo), rs: num(r.rs), bg: num(r.bg), wp: isFinite(num(r.wp)) ? num(r.wp) : 0, we: isFinite(num(r.we)) ? num(r.we) : 0 }; });
    if (f.length < 3) err.push('Cargá al menos 3 puntos de presión con producción acumulada.');
    f.forEach(function (r, i) { if (!(r.p > 0 && r.np > 0 && r.rp >= 0 && r.bo > 0 && r.rs >= 0 && r.bg > 0)) err.push('Punto ' + (i + 1) + ': presión, Np, Rp, Bo, Rs y Bg deben ser válidos (Np > 0).'); });
    if (err.length) return { errores: err };
    var pts = f.map(function (r) {
      var F = r.np * (r.bo + (r.rp - r.rs) * r.bg) + r.wp * bw, Eo = (r.bo - boi) + (rsi - r.rs) * r.bg, Eg = boi * (r.bg / bgi - 1), E = Eo + m * Eg;
      return { p: r.p, np: r.np, F: F, Eo: Eo, Eg: Eg, E: E, Fn: F - r.we, we: r.we };
    });
    var sFE = 0, sEE = 0; pts.forEach(function (q) { sFE += q.Fn * q.E; sEE += q.E * q.E; });
    if (sEE < 1e-12) return { errores: ['La expansión E es nula en todos los puntos: la presión no cayó o falta Bg/Rs de cada nivel de presión.'] };
    var N = sFE / sEE, ym = pts.reduce(function (s, q) { return s + q.Fn; }, 0) / pts.length, sst = 0, sse = 0;
    pts.forEach(function (q) { sst += Math.pow(q.Fn - ym, 2); sse += Math.pow(q.Fn - N * q.E, 2); });
    var r2 = sst > 0 ? 1 - sse / sst : 1, npMax = pts[pts.length - 1].np;
    if (!(N > 0)) return { errores: ['El N resultante no es positivo: revisá las propiedades PVT y la producción acumulada.'] };
    if (r2 < 0.95) av.push('R² = ' + r2.toFixed(3) + ': el modelo no explica bien la historia; puede haber empuje de agua no considerado, casquete de gas distinto del supuesto o datos PVT inconsistentes.');
    if (pts.some(function (q) { return q.Eo <= 0; })) av.push('Hay puntos con Eo ≤ 0 (presión por encima de la inicial o PVT inconsistente): esos puntos distorsionan el ajuste.');
    av.push('Modelo sin compresibilidad de agua y roca; válido bajo el punto de burbuja. Por encima de Pb usá la expansión de petróleo, agua y roca.');
    return { errores: [], avisos: av, pts: pts, N: N, r2: r2, rf: npMax / N, m: m };
  };

  /* =====================================================
     21. ALTURA DE COLUMNA Y CAPACIDAD DE SELLO
     h = (Pd_sello − Pd_reservorio)/(ρw − ρh) × 0,433   [ft; P en psi, ρ en g/cc]
     Pd_res = Pd_lab × (σ·cosθ)_res/(σ·cosθ)_lab
     ===================================================== */
  C.sello = function (p) {
    var err = [], av = [];
    var pd = num(p.pd), pdr = isFinite(num(p.pdRes)) ? num(p.pdRes) : 0, rw = num(p.rhoW), rh = num(p.rhoH), cierre = num(p.cierre);
    if (!(pd > 0)) err.push('Ingresá la presión de desplazamiento del sello (> 0).');
    if (!(rw > rh && rh > 0)) err.push('La densidad del agua debe ser mayor que la del hidrocarburo (> 0).');
    if (!(pdr >= 0)) err.push('La presión de desplazamiento del reservorio no puede ser negativa.');
    var pdSello = pd, factor = 1;
    if (p.base === 'lab') {
      var sl = num(p.sigmaLab), tl = num(p.thetaLab), sr = num(p.sigmaRes), tr = num(p.thetaRes);
      if (!(sl > 0 && sr > 0 && isFinite(tl) && isFinite(tr))) err.push('Completá tensión interfacial y ángulo de contacto de laboratorio y de reservorio.');
      else { factor = Math.abs(sr * Math.cos(tr * Math.PI / 180)) / Math.abs(sl * Math.cos(tl * Math.PI / 180)); pdSello = pd * factor; }
    }
    if (err.length) return { errores: err };
    var dif = pdSello - pdr;
    if (!(dif > 0)) return { errores: ['La presión de desplazamiento del reservorio es igual o mayor que la del sello: no hay columna sostenible.'] };
    var h = dif / (rw - rh) * 0.433;
    var res = { errores: [], avisos: av, pdSello: pdSello, factor: factor, hSello: h, hSelloM: h * 0.3048 };
    if (cierre > 0) {
      res.cierre = cierre; res.limita = h < cierre ? 'sello' : 'cierre estructural'; res.hEfectiva = Math.min(h, cierre);
      if (h < cierre) av.push('El sello limita la columna a ' + h.toFixed(0) + ' ft, por debajo del cierre estructural de ' + cierre + ' ft: la trampa no se llenaría hasta el punto de derrame.');
    }
    av.push('La presión de desplazamiento medida en laboratorio (p. ej. mercurio–aire) tiene incertidumbre por heterogeneidad del sello: usá un rango de muestras y no un solo valor.');
    return res;
  };

  /* =====================================================
     22. AGREGACIÓN DE RECURSOS / RESERVAS (aritmética vs. estadística)
     Marginales lognormales desde P90 y P10; dependencia con un factor común (cópula gaussiana, ρ).
     PRMS: entre campos o propiedades se suma aritméticamente por categoría; la suma estadística
     solo dentro de un campo o proyecto, con su dependencia.
     ===================================================== */
  C.agregacion = function (p) {
    var err = [], av = [];
    var f = rows(p.filas).map(function (r) { return { n: String(r.nombre || '').trim(), p90: num(r.p90), p50: num(r.p50), p10: num(r.p10) }; });
    var rho = num(p.rho), N = Math.round(num(p.n) || 20000);
    if (f.length < 2) err.push('Cargá al menos 2 elementos para agregar.');
    f.forEach(function (r, i) {
      if (!(r.p90 > 0 && r.p50 > r.p90 && r.p10 > r.p50)) err.push('Elemento ' + (i + 1) + ': se requiere 0 < P90 < P50 < P10.');
      else { var med = Math.sqrt(r.p90 * r.p10); if (Math.abs(med - r.p50) / r.p50 > 0.2) av.push('Elemento ' + (i + 1) + ': el P50 informado (' + r.p50 + ') difiere más de 20 % del implícito en una lognormal con ese P90 y P10 (' + med.toFixed(2) + '); la distribución no es lognormal y el ajuste usa solo P90 y P10.'); }
    });
    if (!(rho >= 0 && rho <= 1)) err.push('La correlación debe estar entre 0 y 1.');
    if (!(N >= 1000 && N <= 100000)) err.push('Las iteraciones deben estar entre 1000 y 100000.');
    if (err.length) return { errores: err };
    var z = 1.2815515655446004, par = f.map(function (r) { var sg = (Math.log(r.p10) - Math.log(r.p90)) / (2 * z); return { mu: (Math.log(r.p10) + Math.log(r.p90)) / 2, sg: sg }; });
    var rnd = mulberry32(Math.round(num(p.semilla) || 777));
    function gauss() { var u1 = Math.max(rnd(), 1e-12), u2 = rnd(); return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2); }
    var tot = new Array(N), k, i, sumMed = 0;
    for (k = 0; k < N; k++) {
      var z0 = gauss(), s = 0;
      for (i = 0; i < par.length; i++) s += Math.exp(par[i].mu + par[i].sg * (Math.sqrt(rho) * z0 + Math.sqrt(1 - rho) * gauss()));
      tot[k] = s;
    }
    tot.sort(function (a, b) { return a - b; });
    var mean = tot.reduce(function (a, b) { return a + b; }, 0) / N;
    var arit = { p90: 0, p50: 0, p10: 0, media: 0 };
    f.forEach(function (r, j) { arit.p90 += r.p90; arit.p50 += r.p50; arit.p10 += r.p10; arit.media += Math.exp(par[j].mu + par[j].sg * par[j].sg / 2); });
    var est = { p90: quantile(tot, 0.10), p50: quantile(tot, 0.50), p10: quantile(tot, 0.90), media: mean };
    av.push('PRMS: entre campos o propiedades distintas se suma aritméticamente por categoría; la suma estadística solo se justifica dentro de un mismo campo o proyecto y con su dependencia.');
    return { errores: [], avisos: av, arit: arit, est: est, rho: rho, n: N, partes: f, difP90: est.p90 / arit.p90 - 1, difP10: est.p10 / arit.p10 - 1 };
  };

  /* =====================================================
     23. LÍMITE ECONÓMICO Y RESERVAS REMANENTES
     q_EL = OPEX_fijo / (365·(P(1 − r) − OPEX_var)) ;  Np = ∫ q dt (Arps) de q_actual a q_EL
     ===================================================== */
  C.limiteEconomico = function (p) {
    var err = [], av = [];
    var g = {}; ['precio', 'regalia', 'opexVar', 'opexFijo', 'qi', 'di', 'b', 'contrato'].forEach(function (k) { g[k] = num(p[k]); });
    if (!(g.precio > 0)) err.push('El precio debe ser positivo.');
    if (!(g.regalia >= 0 && g.regalia < 1)) err.push('Las regalías deben ser una fracción entre 0 y 1.');
    if (!(g.opexVar >= 0 && g.opexFijo >= 0)) err.push('Los costos operativos no pueden ser negativos.');
    if (!(g.qi > 0 && g.di > 0)) err.push('Caudal actual y declinación nominal anual deben ser positivos.');
    if (!(g.b >= 0 && g.b <= 2)) err.push('El exponente b debe estar entre 0 y 2.');
    if (err.length) return { errores: err };
    function una(precio) {
      var mg = precio * (1 - g.regalia) - g.opexVar;
      if (!(mg > 0)) return { margen: mg, qel: null, np: 0, vida: 0, nota: 'sin margen positivo' };
      var qel = g.opexFijo * 1000 / (365 * mg);
      if (qel >= g.qi) return { margen: mg, qel: qel, np: 0, vida: 0, nota: 'el caudal actual ya está en o bajo el límite' };
      var t = g.b < 1e-9 ? Math.log(g.qi / qel) / g.di : (Math.pow(g.qi / qel, g.b) - 1) / (g.b * g.di);
      var lim = false; if (g.contrato > 0 && t > g.contrato) { t = g.contrato; lim = true; }
      var q = arpsQ(g.qi, g.di, g.b, t), np = arpsNp(g.qi, g.di, g.b, q) * 365;
      return { margen: mg, qel: qel, np: np, vida: t, q: q, porContrato: lim, nota: lim ? 'limitado por el vencimiento del contrato' : '' };
    }
    var base = una(g.precio);
    if (base.qel === null) return { errores: ['Con este precio, regalías y OPEX variable el margen por barril no es positivo: no hay producción económica.'] };
    var sens = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3].map(function (d) { var r = una(g.precio * (1 + d)); r.precio = g.precio * (1 + d); r.d = d; return r; });
    if (base.np === 0) av.push(base.nota + ': las reservas remanentes son cero con este precio.');
    av.push('Sin impuestos, capital de mantenimiento ni abandono; el límite económico real del proyecto surge de su flujo de caja completo. SEC exige precios promedio de 12 meses; PRMS usa los precios del pronóstico del evaluador.');
    return { errores: [], avisos: av, base: base, sens: sens, g: g };
  };

  /* =====================================================
     24. CONCILIACIÓN DE RESERVAS E INDICADORES
     Fin = Inicio + Revisiones + Recup. mejorada + Extensiones/descubrimientos + Compras − Ventas − Producción
     RRR orgánico = (Rev + RM + E&D)/Prod ; R/P = Fin/Prod ; F&D = Costo / (Rev + RM + E&D)
     ===================================================== */
  C.conciliacion = function (p) {
    var err = [], av = [];
    var g = {}; ['ini', 'rev', 'rm', 'ext', 'compras', 'ventas', 'prod', 'finRep', 'costoOrg', 'costoAcq'].forEach(function (k) { g[k] = num(p[k]); });
    ['rev', 'rm', 'ext', 'compras', 'ventas', 'costoOrg', 'costoAcq'].forEach(function (k) { if (!isFinite(g[k])) g[k] = 0; });
    if (!(g.ini >= 0)) err.push('Las reservas iniciales deben ser ≥ 0.');
    if (!(g.prod > 0)) err.push('La producción del período debe ser positiva.');
    if (g.compras < 0 || g.ventas < 0 || g.ext < 0 || g.rm < 0) err.push('Extensiones, recuperación mejorada, compras y ventas se ingresan como valores positivos (las revisiones pueden ser negativas).');
    if (err.length) return { errores: err };
    var fin = g.ini + g.rev + g.rm + g.ext + g.compras - g.ventas - g.prod;
    if (fin < 0) err.push('Las reservas finales resultan negativas: revisá las cifras.');
    if (err.length) return { errores: err };
    var org = g.rev + g.rm + g.ext, adds = org + g.compras - g.ventas;
    var res = { errores: [], avisos: av, fin: fin, orgAdds: org, adds: adds, rrrOrg: org / g.prod, rrrTot: adds / g.prod, rp: fin / g.prod,
      filas: [['Reservas iniciales', g.ini], ['Revisiones de estimaciones previas', g.rev], ['Recuperación mejorada', g.rm], ['Extensiones y descubrimientos', g.ext], ['Compras de reservas', g.compras], ['Ventas de reservas', -g.ventas], ['Producción', -g.prod], ['Reservas finales (calculadas)', fin]] };
    if (org > 0 && g.costoOrg > 0) res.fd = g.costoOrg / org;
    if ((org + g.compras) > 0 && (g.costoOrg + g.costoAcq) > 0) res.fda = (g.costoOrg + g.costoAcq) / (org + g.compras);
    if (isFinite(g.finRep)) { res.finRep = g.finRep; res.dif = fin - g.finRep; if (Math.abs(res.dif) > Math.max(1e-9, 0.005 * Math.abs(g.finRep))) av.push('Las reservas finales calculadas difieren de las informadas en ' + res.dif.toFixed(2) + ': la conciliación no cierra.'); }
    if (g.rev < 0 && Math.abs(g.rev) > 0.1 * g.ini) av.push('Revisiones negativas mayores al 10 % de las reservas iniciales: documentá la causa (precio, desempeño, reclasificación).');
    av.push('Convención usada: RRR y F&D orgánicos excluyen compras y ventas; la definición exacta de los indicadores varía entre compañías, por lo que la comparación externa requiere confirmar la base.');
    return res;
  };

  /* =====================================================
     25. PLANILLA DE CONTROL DE POZO (método del perforador / espera y densifica)
     Fuente: fórmulas IADC WellSharp (campo): KMW = SIDPP/(0,052·TVD) + MW ; ICP = SCRP + SIDPP ;
     FCP = SCRP·KMW/MW ; MAASP = (MWmáx − MW)·0,052·TVD_zapato ; capacidad = ID²/1029,4
     ===================================================== */
  C.killSheet = function (p) {
    var err = [], av = [];
    var g = {}; ['omw', 'tvd', 'md', 'sidpp', 'sicp', 'scrp', 'bomba', 'ganancia', 'zapato', 'lot', 'lotMw', 'hoyo', 'dcOD', 'dcID', 'dcLen', 'dpOD', 'dpID'].forEach(function (k) { g[k] = num(p[k]); });
    ['omw', 'tvd', 'md', 'scrp', 'bomba', 'zapato', 'lot', 'lotMw', 'hoyo', 'dcOD', 'dcID', 'dcLen', 'dpOD', 'dpID'].forEach(function (k) { if (!(g[k] > 0)) err.push('El dato «' + k + '» debe ser positivo.'); });
    if (!(g.sidpp >= 0 && g.sicp >= 0)) err.push('SIDPP y SICP no pueden ser negativos.');
    if (!(g.ganancia > 0)) err.push('Ingresá la ganancia en piletas (bbl).');
    if (g.md < g.tvd) err.push('La profundidad medida no puede ser menor que la vertical.');
    if (g.dcLen >= g.md) err.push('El largo de portamechas debe ser menor que la profundidad medida.');
    if (g.hoyo <= g.dcOD || g.hoyo <= g.dpOD) err.push('El diámetro del pozo debe ser mayor que los diámetros exteriores de la sarta.');
    if (err.length) return { errores: err };
    if (g.sicp < g.sidpp) av.push('SICP menor que SIDPP: inusual (puede haber flotador en la sarta o presión atrapada); verificá las lecturas antes de usar la planilla.');
    var kmwExacto = g.sidpp / (0.052 * g.tvd) + g.omw, kmw = Math.ceil(kmwExacto * 10 - 1e-9) / 10;
    var icp = g.scrp + g.sidpp, fcp = g.scrp * kmw / g.omw, pForm = g.omw * 0.052 * g.tvd + g.sidpp;
    var mwMax = Math.floor((g.lot / (0.052 * g.zapato) + g.lotMw) * 10 + 1e-9) / 10;
    var maasp = (mwMax - g.omw) * 0.052 * g.zapato, maaspNuevo = (mwMax - kmw) * 0.052 * g.zapato;
    var capDP = g.dpID * g.dpID / 1029.4, capDC = g.dcID * g.dcID / 1029.4, dpLen = g.md - g.dcLen;
    var volSarta = capDP * dpLen + capDC * g.dcLen, strokes = volSarta / g.bomba;
    var anDC = (g.hoyo * g.hoyo - g.dcOD * g.dcOD) / 1029.4, anDP = (g.hoyo * g.hoyo - g.dpOD * g.dpOD) / 1029.4;
    var hk = g.ganancia <= anDC * g.dcLen ? g.ganancia / anDC : g.dcLen + (g.ganancia - anDC * g.dcLen) / anDP;
    var grInflujo = g.omw * 0.052 - (g.sicp - g.sidpp) / hk;
    var tipo = grInflujo < 0.25 ? 'gas' : grInflujo < 0.4 ? 'petróleo o mezcla' : 'agua salada o fluido pesado';
    if (g.sicp > maasp) av.push('SICP (' + g.sicp + ' psi) supera el MAASP (' + maasp.toFixed(0) + ' psi): riesgo de fracturar la formación en el zapato; consultá el procedimiento de control antes de circular.');
    if (icp > maasp * 1.5) av.push('La ICP es alta frente al MAASP: verificá la presión reducida de bombeo.');
    var pasos = []; for (var i = 0; i <= 10; i++) pasos.push({ strokes: strokes * i / 10, psi: Math.floor(icp - (icp - fcp) * i / 10) });
    av.push('Planilla de referencia: el procedimiento de control lo define el programa del pozo y el personal certificado (IWCF/IADC). El tipo de influjo es indicativo (gas < 0,25 psi/ft; petróleo 0,25–0,4; agua > 0,4).');
    return { errores: [], avisos: av, kmwExacto: kmwExacto, kmw: kmw, icp: icp, fcp: fcp, pFormacion: pForm, emw: pForm / (0.052 * g.tvd), mwMax: mwMax, maasp: maasp, maaspNuevo: maaspNuevo, volSarta: volSarta, strokes: strokes, hk: hk, grInflujo: grInflujo, tipo: tipo, pasos: pasos, capDP: capDP, capDC: capDC, anDC: anDC, anDP: anDP };
  };

  /* =====================================================
     26. VOLÚMENES DEL POZO, CIRCULACIÓN Y CEMENTACIÓN
     Capacidad (bbl/ft) = ID²/1029,4 ; anular = (D² − d²)/1029,4 ; sacos = V(ft³)/rendimiento
     ===================================================== */
  C.volumenesPozo = function (p) {
    var err = [], av = [];
    var bomba = num(p.bomba), spm = num(p.spm);
    var sarta = rows(p.sarta).map(function (r) { return { n: String(r.nombre || ''), id: num(r.id), L: num(r.L) }; });
    var anu = rows(p.anular).map(function (r) { return { n: String(r.nombre || ''), D: num(r.D), d: num(r.d), L: num(r.L), exc: isFinite(num(r.exc)) ? num(r.exc) : 0 }; });
    if (!(bomba > 0 && spm > 0)) err.push('Producción de la bomba y emboladas por minuto deben ser positivas.');
    if (!sarta.length || !anu.length) err.push('Cargá al menos un tramo de sarta y uno anular.');
    sarta.forEach(function (r, i) { if (!(r.id > 0 && r.L > 0)) err.push('Sarta, tramo ' + (i + 1) + ': diámetro interno y largo positivos.'); });
    anu.forEach(function (r, i) { if (!(r.D > r.d && r.d >= 0 && r.L > 0)) err.push('Anular, tramo ' + (i + 1) + ': el diámetro mayor debe superar al menor y el largo ser positivo.'); if (r.exc < 0) err.push('Anular, tramo ' + (i + 1) + ': el exceso no puede ser negativo.'); });
    if (err.length) return { errores: err };
    var vs = 0, va = 0, vc = 0;
    var fs = sarta.map(function (r) { var cap = r.id * r.id / 1029.4, v = cap * r.L; vs += v; return { n: r.n, cap: cap, L: r.L, v: v }; });
    var fa = anu.map(function (r) { var cap = (r.D * r.D - r.d * r.d) / 1029.4, v = cap * r.L; va += v; vc += v * (1 + r.exc / 100); return { n: r.n, cap: cap, L: r.L, v: v, vExc: v * (1 + r.exc / 100) }; });
    var out = { errores: [], avisos: av, sarta: fs, anular: fa, volSarta: vs, volAnular: va, strokesSarta: vs / bomba, strokesAnular: va / bomba, strokesTotal: (vs + va) / bomba, tSarta: vs / bomba / spm, tAnular: va / bomba / spm, tTotal: (vs + va) / bomba / spm, caudal: bomba * spm };
    var rend = num(p.rendimiento), agua = num(p.agua), zapato = num(p.zapatoVol);
    if (rend > 0) {
      var bbl = vc + (zapato > 0 ? zapato : 0), ft3 = bbl * 5.615;
      out.cemento = { vAnularExc: vc, zapato: zapato > 0 ? zapato : 0, vTotal: bbl, ft3: ft3, sacos: ft3 / rend, agua: agua > 0 ? ft3 / rend * agua / 42 : null };
    }
    return out;
  };

  /* =====================================================
     27. PRESIÓN DE POROS Y GRADIENTE DE FRACTURA — EATON
     Pp = Sv − (Sv − Ph)(Δtn/Δto)^x ;  FG = ν/(1−ν)·(Sv − Pp)/D + Pp/D
     ===================================================== */
  C.eaton = function (p) {
    var err = [], av = [];
    var obg = num(p.obg), gh = num(p.gh), x = num(p.exp), nu = num(p.nu);
    var f = rows(p.filas).map(function (r) { return { z: num(r.z), dto: num(r.dto), dtn: num(r.dtn) }; });
    if (!(obg > 0 && gh > 0 && obg > gh)) err.push('El gradiente de sobrecarga debe ser mayor que el hidrostático (ambos > 0).');
    if (!(x > 0)) err.push('El exponente de Eaton debe ser positivo (3 para sónico).');
    if (!(nu > 0 && nu < 0.5)) err.push('La relación de Poisson debe estar entre 0 y 0,5.');
    if (!f.length) err.push('Cargá al menos un punto.');
    f.forEach(function (r, i) { if (!(r.z > 0 && r.dto > 0 && r.dtn > 0)) err.push('Punto ' + (i + 1) + ': profundidad y tiempos de tránsito positivos.'); });
    if (err.length) return { errores: err };
    var out = f.map(function (r) {
      var sv = obg * r.z, ph = gh * r.z, ratio = r.dtn / r.dto, pp = sv - (sv - ph) * Math.pow(ratio, x);
      var fg = nu / (1 - nu) * (sv - pp) / r.z + pp / r.z;
      return { z: r.z, sv: sv, ph: ph, pp: pp, ppg: pp / (0.052 * r.z), fg: fg, fgPpg: fg / 0.052, ratio: ratio, sobrepresion: pp - ph, ok: fg > pp / r.z };
    });
    if (out.some(function (o) { return o.ratio > 1; })) av.push('Hay puntos con Δt observado menor que el de la tendencia normal (presión subnormal): revisá la línea de tendencia normal.');
    if (out.some(function (o) { return o.pp > o.sv; })) av.push('Hay presión de poros mayor que la sobrecarga: físicamente inconsistente; revisá la tendencia y el exponente.');
    av.push('Método empírico: la línea de tendencia normal debe ajustarse a lutitas limpias de cada cuenca, y el resultado debe calibrarse con LOT/FIT y mediciones directas (RFT/MDT).');
    return { errores: [], avisos: av, filas: out };
  };

  /* =====================================================
     28. DELIVERABILIDAD DE POZO DE GAS (back-pressure y LIT)
     q = C(pr² − pwf²)^n  (Rawlins & Schellhardt, 1936) ; pr² − pwf² = a·q + b·q²  (Houpeurt / LIT)
     ===================================================== */
  C.gasDeliverability = function (p) {
    var err = [], av = [];
    var pr = num(p.pr), pa = isFinite(num(p.pa)) ? num(p.pa) : 14.7;
    var f = rows(p.filas).map(function (r) { return { q: num(r.q), pwf: num(r.pwf) }; });
    if (!(pr > 0)) err.push('Ingresá la presión estática del reservorio.');
    if (f.length < 3) err.push('Cargá al menos 3 puntos de caudal y presión fluyente.');
    f.forEach(function (r, i) { if (!(r.q > 0) || !(r.pwf > 0 && r.pwf < pr)) err.push('Punto ' + (i + 1) + ': caudal > 0 y presión fluyente entre 0 y la estática.'); });
    if (err.length) return { errores: err };
    var pts = f.map(function (r) { return { q: r.q, pwf: r.pwf, dp2: pr * pr - r.pwf * r.pwf }; });
    function reg(xs, ys) { var n = xs.length, mx = 0, my = 0, i; for (i = 0; i < n; i++) { mx += xs[i] / n; my += ys[i] / n; } var sxx = 0, sxy = 0, syy = 0; for (i = 0; i < n; i++) { sxx += Math.pow(xs[i] - mx, 2); sxy += (xs[i] - mx) * (ys[i] - my); syy += Math.pow(ys[i] - my, 2); } if (sxx < 1e-15) return null; var b = sxy / sxx; return { b: b, a: my - b * mx, r2: syy > 0 ? sxy * sxy / (sxx * syy) : 1 }; }
    var l1 = reg(pts.map(function (r) { return Math.log10(r.dp2); }), pts.map(function (r) { return Math.log10(r.q); }));
    var l2 = reg(pts.map(function (r) { return r.q; }), pts.map(function (r) { return r.dp2 / r.q; }));
    if (!l1 || !l2) return { errores: ['Los puntos no permiten ajustar (caudales o presiones idénticos).'] };
    var n = l1.b, Cc = Math.pow(10, l1.a), dpa = pr * pr - pa * pa;
    var res = { errores: [], avisos: av, pts: pts, n: n, C: Cc, r2bp: l1.r2, aofBP: Cc * Math.pow(dpa, n), a: l2.a, b: l2.b, r2lit: l2.r2 };
    if (!(n >= 0.5 && n <= 1.0)) av.push('El exponente n = ' + n.toFixed(2) + ' está fuera del rango físico 0,5–1,0: revisá los datos (puntos no estabilizados o presión estática incorrecta).');
    if (l2.a > 0 && l2.b > 0) res.aofLIT = (-l2.a + Math.sqrt(l2.a * l2.a + 4 * l2.b * dpa)) / (2 * l2.b);
    else av.push('Los coeficientes a y b de LIT no son positivos: la forma cuadrática no es física con estos datos.');
    var qmax = res.aofBP * 1.0, curva = []; for (var k = 0; k <= 20; k++) { var q = qmax * k / 20; if (q > 0 || k === 0) { var dp2 = Math.pow(q / Cc, 1 / n); curva.push({ q: q, pwf: Math.sqrt(Math.max(0, pr * pr - dp2)) }); } }
    res.curva = curva;
    if (res.aofLIT && Math.abs(res.aofLIT - res.aofBP) / res.aofBP > 0.15) av.push('El AOF por back-pressure y por LIT difieren más de 15 %: los datos están lejos del punto de caudal máximo; extrapolar es riesgoso.');
    av.push('Usa presión al cuadrado (válido a baja presión, ~< 2000 psi); a alta presión conviene pseudopresión. El AOF es una extrapolación a pwf = ' + pa + ' psia y no un caudal operable.');
    return res;
  };

  /* =====================================================
     29. PERMEABILIDAD RELATIVA (COREY) Y DESPLAZAMIENTO BUCKLEY–LEVERETT (WELGE)
     fw = 1/(1 + (kro·μw)/(krw·μo)) ; tangente de Welge desde (Swi, 0): fw′(Swf) = fw(Swf)/(Swf − Swi)
     Sw promedio = Sw2 + (1 − fw2)/fw2′ ; PVI = 1/fw2′
     ===================================================== */
  C.buckleyLeverett = function (p) {
    var err = [], av = [];
    var g = {}; ['swc', 'sor', 'krwMax', 'kroMax', 'nw', 'no', 'muw', 'muo'].forEach(function (k) { g[k] = num(p[k]); });
    if (!(g.swc >= 0 && g.sor >= 0 && g.swc + g.sor < 1)) err.push('Swc y Sor deben ser ≥ 0 y sumar menos que 1.');
    if (!(g.krwMax > 0 && g.krwMax <= 1 && g.kroMax > 0 && g.kroMax <= 1)) err.push('Los extremos de permeabilidad relativa deben estar entre 0 y 1.');
    if (!(g.nw > 0 && g.no > 0)) err.push('Los exponentes de Corey deben ser positivos.');
    if (!(g.muw > 0 && g.muo > 0)) err.push('Las viscosidades deben ser positivas.');
    if (err.length) return { errores: err };
    var rng = 1 - g.swc - g.sor;
    function krw(s) { var x = (s - g.swc) / rng; return x <= 0 ? 0 : x >= 1 ? g.krwMax : g.krwMax * Math.pow(x, g.nw); }
    function kro(s) { var x = (1 - g.sor - s) / rng; return x <= 0 ? 0 : x >= 1 ? g.kroMax : g.kroMax * Math.pow(x, g.no); }
    function fw(s) { var a = krw(s) / g.muw, b = kro(s) / g.muo; return a + b > 0 ? a / (a + b) : 0; }
    function dfw(s) { var h = 1e-5, lo = Math.max(g.swc, s - h), hi = Math.min(1 - g.sor, s + h); return (fw(hi) - fw(lo)) / (hi - lo); }
    var best = -1, sf = null, N = 4000;
    for (var i = 1; i <= N; i++) { var s = g.swc + (1 - g.sor - g.swc) * i / N; if (s <= g.swc + 1e-6 || s > 1 - g.sor - 1e-6) continue; var m = fw(s) / (s - g.swc); if (m > best) { best = m; sf = s; } }
    if (sf === null) return { errores: ['No se pudo hallar el punto de tangencia de Welge con estos parámetros.'] };
    var dff = dfw(sf), swBt = sf + (1 - fw(sf)) / dff, pviBt = 1 / dff;
    var Mshock = (krw(swBt) / g.muw) / (kro(g.swc) / g.muo);
    var post = []; var K = 24;
    for (var k = 0; k <= K; k++) {
      var s2 = sf + (1 - g.sor - sf) * k / K; if (k === K) s2 = 1 - g.sor - 1e-4;
      var f2 = fw(s2), d2 = dfw(s2); if (!(d2 > 0)) continue;
      var sav = s2 + (1 - f2) / d2, np = sav - g.swc;
      post.push({ sw2: s2, fw: f2, pvi: 1 / d2, swProm: sav, rec: np, recFrac: np / (1 - g.swc), wor: f2 < 1 ? f2 / (1 - f2) : Infinity });
    }
    var curvas = []; for (var j = 0; j <= 40; j++) { var sw = g.swc + (1 - g.swc) * j / 40; curvas.push({ sw: sw, krw: krw(sw), kro: kro(sw), fw: fw(sw) }); }
    var M = (g.krwMax / g.muw) / (g.kroMax / g.muo);
    if (M > 1) av.push('Razón de movilidad de punto final M = ' + M.toFixed(2) + ' > 1: desplazamiento desfavorable (digitación); el modelo 1D sobrestima el barrido real.');
    av.push('Modelo 1D, incompresible, sin gravedad ni capilaridad, sin heterogeneidad vertical ni areal. Es un cálculo de eficiencia de desplazamiento, no de barrido volumétrico total.');
    return { errores: [], avisos: av, swf: sf, fwf: fw(sf), dfwf: dff, swBt: swBt, pviBt: pviBt, recBt: swBt - g.swc, recBtFrac: (swBt - g.swc) / (1 - g.swc), M: M, Mshock: Mshock, post: post, curvas: curvas, g: g };
  };

  /* =====================================================
     30. GRÁFICO DE HALL (monitoreo de pozos inyectores)
     H = Σ (p_wi − p_prom)·Δt  [psi·día]  contra  Wi = Σ inyección acumulada [bbl]
     La pendiente es proporcional a 1/(capacidad de inyección): sube con daño, baja con fractura/estimulación.
     ===================================================== */
  C.hall = function (p) {
    var err = [], av = [];
    var pavgG = num(p.pavg);
    var f = rows(p.filas).map(function (r) { return { d: num(r.dias), v: num(r.vol), pwi: num(r.pwi), pav: isFinite(num(r.pavg)) ? num(r.pavg) : pavgG }; });
    if (f.length < 4) err.push('Cargá al menos 4 períodos.');
    f.forEach(function (r, i) { if (!(r.d > 0) || !(r.v > 0) || !isFinite(r.pwi) || !isFinite(r.pav)) err.push('Período ' + (i + 1) + ': días, volumen, presión de inyección y presión media deben ser válidos (volumen > 0).'); else if (!(r.pwi > r.pav)) err.push('Período ' + (i + 1) + ': la presión de inyección debe superar la presión media del reservorio.'); });
    if (err.length) return { errores: err };
    var W = 0, H = 0, pts = [{ w: 0, h: 0 }], per = [];
    f.forEach(function (r) { var dh = (r.pwi - r.pav) * r.d; W += r.v; H += dh; var q = r.v / r.d; pts.push({ w: W, h: H }); per.push({ q: q, dp: r.pwi - r.pav, ii: q / (r.pwi - r.pav), pend: dh / r.v }); });
    var n = f.length, m = Math.floor(n / 2), p1 = pts[m], p0 = pts[0], pn = pts[n];
    var s1 = (p1.h - p0.h) / (p1.w - p0.w), s2 = (pn.h - p1.h) / (pn.w - p1.w), cambio = s2 / s1 - 1;
    var diag = Math.abs(cambio) < 0.1 ? 'pendiente estable: sin cambio apreciable en el daño ni en la conductividad' : cambio > 0 ? 'la pendiente aumenta: indica mayor daño (taponamiento, hinchamiento de arcillas) o menor capacidad de inyección' : 'la pendiente disminuye: indica menor daño o fracturamiento por inyección sobre la presión de fractura';
    if (n < 6) av.push('Con menos de 6 períodos la tendencia es poco confiable: Hall recomienda varios meses de historia.');
    av.push('Si la presión media del reservorio no se conoce, se puede usar un valor constante: desplaza el gráfico pero no cambia la pendiente cuando es realmente constante.');
    return { errores: [], avisos: av, pts: pts, per: per, s1: s1, s2: s2, sTot: pn.h / pn.w, cambio: cambio, diag: diag, iiProm: n ? per.reduce(function (s, r) { return s + r.ii; }, 0) / n : null, wTot: W };
  };

  /* =====================================================
     31. RELACIÓN DE REPOSICIÓN DE VACÍOS (VRR)
     VRR = (Wi·Bw + Gi·Bg) / (Np·Bo + Wp·Bw + (Gp − Np·Rs)·Bg)
     ===================================================== */
  C.vrr = function (p) {
    var err = [], av = [];
    var f = rows(p.filas).map(function (r) { var o = {}; ['winj', 'ginj', 'np', 'wp', 'gp', 'bo', 'bw', 'bg', 'rs'].forEach(function (k) { o[k] = num(r[k]); }); o.per = String(r.per || ''); return o; });
    if (!f.length) err.push('Cargá al menos un período.');
    f.forEach(function (r, i) {
      if (!isFinite(r.ginj)) r.ginj = 0; if (!isFinite(r.gp)) r.gp = 0; if (!isFinite(r.wp)) r.wp = 0; if (!isFinite(r.rs)) r.rs = 0; if (!isFinite(r.bg)) r.bg = 0; if (!isFinite(r.winj)) r.winj = 0;
      if (!(r.np > 0 && r.bo > 0 && r.bw > 0)) err.push('Período ' + (i + 1) + ': Np, Bo y Bw deben ser positivos.');
      if (r.winj < 0 || r.ginj < 0 || r.wp < 0 || r.gp < 0) err.push('Período ' + (i + 1) + ': volúmenes no negativos.');
      if ((r.ginj > 0 || r.gp - r.np * r.rs / 1000 !== 0) && !(r.bg > 0)) err.push('Período ' + (i + 1) + ': con gas en el balance se requiere Bg > 0.');
    });
    if (err.length) return { errores: err };
    var acI = 0, acP = 0;
    var out = f.map(function (r) {
      var iny = r.winj * r.bw + r.ginj * r.bg, gl = r.gp - r.np * r.rs / 1000, prod = r.np * r.bo + r.wp * r.bw + gl * r.bg;
      acI += iny; acP += prod;
      return { per: r.per, iny: iny, prod: prod, vrr: iny / prod, acum: acI / acP, gasLibre: gl };
    });
    var u = out[out.length - 1];
    if (out.some(function (o) { return o.prod <= 0; })) return { errores: ['El volumen producido a condiciones de reservorio resulta no positivo: revisá Rs, Gp y Bg.'] };
    var diag = u.acum < 0.9 ? 'reposición insuficiente: el reservorio se despresuriza' : u.acum > 1.1 ? 'reposición excedida: el reservorio se represuriza (revisá fuga o fractura)' : 'reposición balanceada: presión aproximadamente estable';
    av.push('Un VRR cercano a 1 no garantiza presión estable si hay influjo o pérdidas de inyección (fuera de zona); confirmá con presiones medidas.');
    return { errores: [], avisos: av, filas: out, vrrAcum: u.acum, vrrUlt: u.vrr, diag: diag };
  };

  /* =====================================================
     32. CORROSIÓN POR CO₂ — de Waard & Milliams (1991) con factor de incrustación
     log10(CR) = 5,8 − 1710/T + 0,67·log10(fCO2) [mm/año] ;  fCO2 = φ·pCO2 ; φ = 10^(P(0,0031 − 1,4/T))
     Factor de incrustación: Fs = 10^(2400/T − 0,6·log10(fCO2) − 6,7) cuando T ≥ 2400/(6,7 + 0,6·log10 fCO2)
     ===================================================== */
  C.co2corr = function (p) {
    var err = [], av = [];
    var Tc = num(p.T), P = num(p.P), y = num(p.yCO2), pp = num(p.pCO2);
    if (!(Tc > 5 && Tc < 150)) err.push('La temperatura debe estar entre 5 y 150 °C.');
    if (!(P > 0)) err.push('La presión total debe ser positiva (bar).');
    var pco2 = pp > 0 ? pp : (y > 0 && y <= 1 ? y * P : NaN);
    if (!(pco2 > 0)) err.push('Ingresá la presión parcial de CO₂ o la fracción molar.');
    if (pco2 > P * 1.0001) err.push('La presión parcial de CO₂ no puede superar la presión total.');
    if (err.length) return { errores: err };
    var T = Tc + 273.15, phi = Math.pow(10, Math.min(P, 250) * (0.0031 - 1.4 / T)), f = phi * pco2, lf = Math.log10(f);
    var crSin = Math.pow(10, 5.8 - 1710 / T + 0.67 * lf), tUmbral = 2400 / (6.7 + 0.6 * lf), fs = 1;
    if (T >= tUmbral) fs = Math.min(1, Math.pow(10, 2400 / T - 0.6 * lf - 6.7));
    var cr = crSin * fs;
    if (pco2 < 0.1) av.push('pCO₂ < 0,1 bar: la corrosión por CO₂ es normalmente baja y la correlación pierde representatividad.');
    if (pco2 > 10) av.push('pCO₂ > 10 bar: fuera del rango habitual de la correlación original.');
    if (fs < 1) av.push('Se aplicó el factor de incrustación (' + fs.toFixed(2) + '): la capa de FeCO₃ puede reducir la velocidad, pero depende de pH, hierro disuelto y flujo.');
    av.push('Screening conservador sin pH, inhibidor, flujo multifásico ni condensado de agua. Para diseño usá modelos más completos (NORSOK M-506, ECE, Cassandra) y validación con datos de campo.');
    return { errores: [], avisos: av, T: T, phi: phi, f: f, crSin: crSin, fs: fs, cr: cr, mpy: cr * 39.3701, tUmbral: tUmbral - 273.15 };
  };

  /* =====================================================
     33. ESPESOR DE RECIPIENTES Y DUCTOS + PRUEBA HIDROSTÁTICA
     ASME VIII-1 UG-27: t = PR/(SE − 0,6P) ; t = PR/(2SE + 0,4P) ; esfera t = PR/(2SE − 0,2P) ;
     elipsoidal 2:1 (UG-32) t = PD/(2SE − 0,2P) ; prueba UG-99(b): 1,3·MAWP·(S_amb/S_dis)
     Ducto (B31.8, Barlow): t = P·D/(2·S·F·E·T) ; B31.3 prueba: 1,5·P·(S_T/S)
     ===================================================== */
  C.recipiente = function (p) {
    var err = [], av = [];
    var P = num(p.P), S = num(p.S), E = num(p.E), CA = isFinite(num(p.CA)) ? num(p.CA) : 0, D = num(p.D), tipo = p.tipo;
    if (!(P > 0 && D > 0)) err.push('Presión de diseño y diámetro deben ser positivos.');
    if (!(S > 0)) err.push('El esfuerzo admisible debe ser positivo.');
    if (!(CA >= 0)) err.push('El sobreespesor no puede ser negativo.');
    var res = { errores: [], avisos: av, tipo: tipo };
    if (tipo === 'ducto') {
      var F = num(p.F), T = isFinite(num(p.Tf)) ? num(p.Tf) : 1, Ej = isFinite(E) ? E : 1;
      if (!(F > 0 && F <= 1)) err.push('El factor de diseño debe estar entre 0 y 1.');
      if (!(Ej > 0 && Ej <= 1)) err.push('El factor de junta debe estar entre 0 y 1.');
      if (!(T > 0 && T <= 1)) err.push('El factor de temperatura debe estar entre 0 y 1.');
      if (err.length) return { errores: err };
      var t = P * D / (2 * S * F * Ej * T);
      res.t = t; res.tNom = t + CA; res.formulas = [['Barlow (B31.8)', 't = P·D/(2·S·F·E·T) = ' + t.toFixed(4)]];
      var tn = num(p.tNom); if (tn > 0) res.mawp = 2 * S * F * Ej * T * (tn - CA) / D;
      res.pruebaB313 = null;
    } else {
      if (!(E > 0 && E <= 1)) err.push('La eficiencia de junta debe estar entre 0 y 1.');
      if (err.length) return { errores: err };
      var R = D / 2, lista = [];
      if (tipo === 'cil') {
        if (P > 0.385 * S * E) av.push('P supera 0,385·S·E: las fórmulas de pared delgada de UG-27 pierden validez (se requiere el apéndice 1-2).');
        var th = P * R / (S * E - 0.6 * P), tl = P * R / (2 * S * E + 0.4 * P);
        lista = [['Circunferencial (UG-27c1)', th], ['Longitudinal (UG-27c2)', tl]]; res.t = Math.max(th, tl);
      } else if (tipo === 'esf') { var te = P * R / (2 * S * E - 0.2 * P); lista = [['Esfera / hemisférico (UG-27d)', te]]; res.t = te; }
      else if (tipo === 'elip') { var tel = P * D / (2 * S * E - 0.2 * P); lista = [['Cabezal elipsoidal 2:1 (UG-32d)', tel]]; res.t = tel; }
      else err.push('Tipo de equipo desconocido.');
      if (err.length) return { errores: err };
      res.formulas = lista.map(function (x) { return [x[0], 't = ' + x[1].toFixed(4)]; }); res.tNom = res.t + CA;
      var tn2 = num(p.tNom);
      if (tn2 > 0) { var tc = tn2 - CA; if (!(tc > 0)) return { errores: ['El espesor nominal no supera el sobreespesor.'] }; res.mawp = tipo === 'cil' ? Math.min(S * E * tc / (R + 0.6 * tc), 2 * S * E * tc / (R - 0.4 * tc)) : tipo === 'esf' ? 2 * S * E * tc / (R + 0.2 * tc) : 2 * S * E * tc / (D + 0.2 * tc); }
    }
    var Sa = num(p.Samb), Sd = num(p.S);
    var base = res.mawp > 0 ? res.mawp : P;
    if (Sa > 0) { res.pruebaVIII = 1.3 * base * Sa / Sd; res.pruebaB313 = 1.5 * base * Sa / Sd; res.baseMawp = res.mawp > 0; }
    av.push('Cálculo de espesor mínimo requerido sin cargas de viento, sismo, peso ni boquillas; el diseño mecánico completo lo hace el código aplicable y el ingeniero responsable.');
    av.push('Prueba hidrostática: 1,3 × MAWP × (S_amb/S_dis) en ASME VIII-1 (ediciones modernas); 1,5 × P × (S_T/S) en B31.3; ediciones anteriores de VIII-1 usaban 1,5. Confirmá la edición vigente.');
    return res;
  };

  /* =====================================================
     34. FLUJO DE GAS EN GASODUCTOS — Weymouth y Panhandle B
     Weymouth: Q = 433,5·E·(Tb/Pb)·[(P1² − P2²)/(G·T·L·Z)]^0,5·D^2,667
     Panhandle B: Q = 737·E·(Tb/Pb)^1,02·[(P1² − P2²)/(G^0,961·T·L·Z)]^0,51·D^2,53
     Q en scfd; P en psia; T en °R; L en millas; D en pulgadas
     ===================================================== */
  C.gasoducto = function (p) {
    var err = [], av = [];
    var g = {}; ['P1', 'P2', 'G', 'T', 'L', 'Z', 'D', 'E', 'Tb', 'Pb'].forEach(function (k) { g[k] = num(p[k]); });
    if (!(g.P1 > g.P2 && g.P2 > 0)) err.push('P1 debe ser mayor que P2 y ambas positivas.');
    ['G', 'L', 'Z', 'D', 'E', 'Pb'].forEach(function (k) { if (!(g[k] > 0)) err.push('El dato «' + k + '» debe ser positivo.'); });
    if (!(g.E <= 1.2)) err.push('La eficiencia no debería superar 1,2.');
    if (!isFinite(g.T) || !isFinite(g.Tb)) err.push('Ingresá temperaturas de flujo y base (°F).');
    if (err.length) return { errores: err };
    var Tr = g.T + 459.67, Tbr = g.Tb + 459.67, d2 = g.P1 * g.P1 - g.P2 * g.P2;
    var qW = 433.5 * g.E * (Tbr / g.Pb) * Math.pow(d2 / (g.G * Tr * g.L * g.Z), 0.5) * Math.pow(g.D, 2.667);
    var qP = 737 * g.E * Math.pow(Tbr / g.Pb, 1.02) * Math.pow(d2 / (Math.pow(g.G, 0.961) * Tr * g.L * g.Z), 0.51) * Math.pow(g.D, 2.53);
    function p2de(q, tipo) { var x = tipo === 'W' ? Math.pow(q / (433.5 * g.E * (Tbr / g.Pb) * Math.pow(g.D, 2.667)), 2) * g.G * Tr * g.L * g.Z : Math.pow(q / (737 * g.E * Math.pow(Tbr / g.Pb, 1.02) * Math.pow(g.D, 2.53)), 1 / 0.51) * Math.pow(g.G, 0.961) * Tr * g.L * g.Z; return Math.sqrt(Math.max(0, g.P1 * g.P1 - x)); }
    var area = Math.PI * g.D * g.D / 4 / 144;
    var vel = function (q) { var qAct = q / 86400 * (g.Pb / ((g.P1 + g.P2) / 2)) * (Tr / Tbr) * g.Z; return qAct / area; };
    if (g.P1 > 1500) av.push('P1 > 1500 psia: ecuaciones empíricas con presión al cuadrado; considerá la ecuación general con z variable.');
    if (vel(Math.max(qW, qP)) > 60) av.push('La velocidad del gas supera 60 ft/s: revisá erosión y ruido (criterio habitual 50–60 ft/s).');
    av.push('Weymouth suele dar menor caudal (conservador, flujo turbulento rugoso); Panhandle B se usa en líneas grandes de alta presión. Ambas asumen horizontal, isotérmico y z constante: ajustá con la eficiencia E.');
    var rango = []; [0.5, 0.75, 1, 1.25, 1.5].forEach(function (m) { var q = qW * m; rango.push({ m: m, q: q, p2W: p2de(q, 'W') }); });
    return { errores: [], avisos: av, qW: qW, qP: qP, vW: vel(qW), vP: vel(qP), ratio: qP / qW, rango: rango };
  };

  /* =====================================================
     35. COMPRESIÓN DE GAS (termodinámica adiabática)
     Cabeza por etapa: H = Z·R·T1·(k/(k−1))·(r^((k−1)/k) − 1)/MW ;  T2 = T1·r^((k−1)/k) ;  P = n·H/η
     ===================================================== */
  C.compresion = function (p) {
    var err = [], av = [];
    var g = {}; ['q', 'p1', 'p2', 't1', 'k', 'z', 'eta', 'rmax', 'tint', 'dpInt'].forEach(function (k) { g[k] = num(p[k]); });
    if (!(g.q > 0 && g.p1 > 0 && g.p2 > g.p1)) err.push('Caudal positivo y presión de descarga mayor que la de succión.');
    if (!(g.k > 1 && g.k < 1.7)) err.push('El exponente k debe estar entre 1 y 1,7 (gas natural ≈ 1,25–1,3).');
    if (!(g.z > 0.5 && g.z <= 1.2)) err.push('El factor z debe estar entre 0,5 y 1,2.');
    if (!(g.eta > 0.3 && g.eta <= 1)) err.push('La eficiencia politrópica/adiabática debe estar entre 0,3 y 1.');
    if (!(g.rmax > 1)) err.push('La relación máxima por etapa debe ser mayor que 1.');
    if (!isFinite(g.t1)) err.push('Ingresá la temperatura de succión.');
    if (!isFinite(g.tint)) g.tint = g.t1;
    if (!(g.dpInt >= 0)) g.dpInt = 0;
    if (err.length) return { errores: err };
    var ns = 1, rt = g.p2 / g.p1;
    while (Math.pow(g.p2 / g.p1, 1 / ns) > g.rmax) ns++;
    var r = Math.pow(g.p2 / g.p1, 1 / ns), exp = (g.k - 1) / g.k, R = 1545.35, lbmolMin = g.q * 1e6 / 379.48 / 1440, t1r = g.t1 + 459.67, tint = g.tint + 459.67;
    var etapas = [], hpTot = 0, rEf = r;
    for (var i = 0; i < ns; i++) {
      var tin = i === 0 ? t1r : tint, h = g.z * R * tin * (g.k / (g.k - 1)) * (Math.pow(rEf, exp) - 1), hp = lbmolMin * h / 33000 / g.eta;
      hpTot += hp; etapas.push({ n: i + 1, r: rEf, tin: tin - 459.67, tout: tin * Math.pow(rEf, exp) - 459.67, hp: hp });
    }
    if (etapas.some(function (e) { return e.tout > 300; })) av.push('Temperatura de descarga mayor que 300 °F en alguna etapa: revisá límites del fabricante (sellos, aceite, aguas de enfriamiento) y considerá más etapas.');
    av.push('Potencia termodinámica al eje del gas; no incluye pérdidas mecánicas, caídas de presión en enfriadores ni diferencias de z entre succión y descarga. Dimensionamiento final con el fabricante (curvas del compresor).');
    return { errores: [], avisos: av, ns: ns, rEtapa: r, rTotal: rt, hpTot: hpTot, kW: hpTot * 0.7457, etapas: etapas, lbmolMin: lbmolMin };
  };

  /* =====================================================
     36. VÁLVULA DE ALIVIO PARA GAS — API 520 parte I (flujo crítico)
     A = W/(C·Kd·P1·Kb·Kc)·√(T·Z/M) ;  C = 520·√(k·(2/(k+1))^((k+1)/(k−1)))
     W lb/h ; P1 psia ; T °R ; A in²
     ===================================================== */
  var ORIF = [['D', 0.110], ['E', 0.196], ['F', 0.307], ['G', 0.503], ['H', 0.785], ['J', 1.287], ['K', 1.838], ['L', 2.853], ['M', 3.60], ['N', 4.34], ['P', 6.38], ['Q', 11.05], ['R', 16.0], ['T', 26.0]];
  C.alivioGas = function (p) {
    var err = [], av = [];
    var g = {}; ['W', 'pset', 'sobre', 'T', 'M', 'Z', 'k', 'Kd', 'Kb', 'Kc'].forEach(function (x) { g[x] = num(p[x]); });
    if (!(g.W > 0 && g.pset > 0 && g.M > 0 && g.Z > 0)) err.push('Caudal, presión de ajuste, peso molecular y z deben ser positivos.');
    if (!(g.sobre >= 0 && g.sobre <= 0.5)) err.push('La sobrepresión debe estar entre 0 y 50 % (10 %, 16 % o 21 % según el caso).');
    if (!(g.k > 1 && g.k < 1.7)) err.push('El exponente k debe estar entre 1 y 1,7.');
    if (!isFinite(g.T)) err.push('Ingresá la temperatura de relevo.');
    if (!(g.Kd > 0 && g.Kd <= 1 && g.Kb > 0 && g.Kb <= 1 && g.Kc > 0 && g.Kc <= 1)) err.push('Kd, Kb y Kc deben estar entre 0 y 1.');
    if (err.length) return { errores: err };
    var P1 = g.pset * (1 + g.sobre) + 14.7, Tr = g.T + 459.67;
    var Cc = 520 * Math.sqrt(g.k * Math.pow(2 / (g.k + 1), (g.k + 1) / (g.k - 1)));
    var A = g.W / (Cc * g.Kd * P1 * g.Kb * g.Kc) * Math.sqrt(Tr * g.Z / g.M);
    var sel = ORIF.filter(function (o) { return o[1] >= A; })[0], extra = null;
    if (!sel) { sel = ORIF[ORIF.length - 1]; extra = Math.ceil(A / sel[1]); av.push('El área requerida excede la mayor válvula estándar (T): se requieren ' + extra + ' válvulas en paralelo o un diseño especial.'); }
    if (g.sobre === 0.1 || g.sobre === 0.16 || g.sobre === 0.21) { /* valores típicos */ } else av.push('La sobrepresión ' + (g.sobre * 100).toFixed(0) + ' % no es un valor típico de API 520/521 (10 %, 16 % para varias válvulas, 21 % para fuego).');
    if (g.Kb < 1) av.push('Kb < 1: confirmá que corresponde a válvula balanceada y que Kb se obtuvo de la curva del fabricante para la contrapresión real.');
    av.push('Se asume flujo crítico (contrapresión ≤ presión crítica). El caudal de relevo W debe provenir del análisis de escenarios (API 521). La selección final requiere la hoja del fabricante; esta herramienta no reemplaza un cálculo certificado.');
    return { errores: [], avisos: av, P1: P1, C: Cc, A: A, orificio: sel[0], areaOrif: sel[1], extra: extra, margen: sel[1] / A - 1 };
  };

  /* =====================================================
     37. COSTO NIVELADO (LCOE / LCOH)
     LCOE = (I0 + Σ (O&M_t + F_t + R_t)/(1+r)^t) / Σ E_t/(1+r)^t ;  E_t = E_1·(1 − d)^(t−1)
     ===================================================== */
  C.costoNivelado = function (p) {
    var err = [], av = [];
    var g = {}; ['capex', 'om', 'comb', 'prod', 'vida', 'r', 'deg', 'repl', 'anioRepl', 'valRes'].forEach(function (k) { g[k] = num(p[k]); });
    ['om', 'comb', 'deg', 'repl', 'valRes'].forEach(function (k) { if (!isFinite(g[k])) g[k] = 0; });
    if (!(g.capex >= 0)) err.push('La inversión no puede ser negativa.');
    if (!(g.prod > 0)) err.push('La producción anual debe ser positiva.');
    if (!(g.vida >= 1 && g.vida <= 60)) err.push('La vida útil debe estar entre 1 y 60 años.');
    if (!(g.r >= 0 && g.r < 1)) err.push('La tasa de descuento debe ser una fracción entre 0 y 1.');
    if (!(g.deg >= 0 && g.deg < 1)) err.push('La degradación anual debe ser una fracción entre 0 y 1.');
    if (g.om < 0 || g.comb < 0 || g.repl < 0) err.push('Los costos no pueden ser negativos.');
    if (g.repl > 0 && !(g.anioRepl >= 1 && g.anioRepl <= g.vida)) err.push('El año de reemplazo debe estar dentro de la vida útil.');
    if (err.length) return { errores: err };
    var N = Math.round(g.vida), vpC = g.capex, vpOM = 0, vpF = 0, vpR = 0, vpE = 0, vpRes = 0;
    for (var t = 1; t <= N; t++) { var d = Math.pow(1 + g.r, t), e = g.prod * Math.pow(1 - g.deg, t - 1); vpE += e / d; vpOM += g.om / d; vpF += g.comb * e / d; if (g.repl > 0 && t === Math.round(g.anioRepl)) vpR += g.repl / d; }
    vpRes = g.valRes / Math.pow(1 + g.r, N);
    var costoTotal = vpC + vpOM + vpF + vpR - vpRes, lc = costoTotal / vpE;
    if (g.r === 0) av.push('Tasa de descuento 0: el resultado es un costo simple sin valor del dinero en el tiempo.');
    av.push('Costo nivelado en moneda constante si las entradas lo están; no incluye impuestos, subsidios, costos de integración a red ni de almacenamiento. Para comparar tecnologías, usá la misma tasa y base de moneda.');
    return { errores: [], avisos: av, lc: lc, vpE: vpE, partes: [['Inversión', vpC], ['O&M', vpOM], ['Combustible / insumos', vpF], ['Reemplazos', vpR], ['Valor residual', -vpRes]], costoTotal: costoTotal };
  };

  /* =====================================================
     38. DECISIÓN CON INFORMACIÓN IMPERFECTA — VALOR DE LA INFORMACIÓN
     VPI (perfecta) = Σ p(x)·máx_a v(a,x) − máx_a E[v] ;  VOI (imperfecta) = Σ_y p(y)·máx_a E[v|y] − máx_a E[v]
     p(x|y) = p(y|x)·p(x)/p(y)
     ===================================================== */
  C.valorInformacion = function (p) {
    var err = [], av = [];
    var pe = num(p.pe), sens = num(p.sens), espec = num(p.espec), costo = isFinite(num(p.costo)) ? num(p.costo) : 0;
    var acc = rows(p.acciones).map(function (r) { return { n: String(r.nombre || 'Acción'), vS: num(r.vExito), vF: num(r.vFallo) }; });
    if (!(pe > 0 && pe < 1)) err.push('La probabilidad a priori de éxito debe estar entre 0 y 1 (sin incluir los extremos).');
    if (!(sens > 0.5 && sens <= 1)) err.push('La sensibilidad (probabilidad de señal positiva si hay éxito) debe estar entre 0,5 y 1.');
    if (!(espec > 0.5 && espec <= 1)) err.push('La especificidad (probabilidad de señal negativa si hay fracaso) debe estar entre 0,5 y 1.');
    if (acc.length < 2) err.push('Cargá al menos 2 acciones (por ejemplo, perforar y no perforar).');
    acc.forEach(function (a, i) { if (!isFinite(a.vS) || !isFinite(a.vF)) err.push('Acción ' + (i + 1) + ': valores numéricos de éxito y fracaso.'); });
    if (costo < 0) err.push('El costo de la información no puede ser negativo.');
    if (err.length) return { errores: err };
    function mejor(ps) { var b = null; acc.forEach(function (a) { var v = ps * a.vS + (1 - ps) * a.vF; if (!b || v > b.v) b = { n: a.n, v: v }; }); return b; }
    var prior = mejor(pe);
    var perf = pe * Math.max.apply(null, acc.map(function (a) { return a.vS; })) + (1 - pe) * Math.max.apply(null, acc.map(function (a) { return a.vF; }));
    var pPos = sens * pe + (1 - espec) * (1 - pe), pNeg = 1 - pPos;
    var postPos = sens * pe / pPos, postNeg = (1 - sens) * pe / pNeg;
    var bPos = mejor(postPos), bNeg = mejor(postNeg), imp = pPos * bPos.v + pNeg * bNeg.v;
    var res = { errores: [], avisos: av, prior: prior, vpi: perf - prior.v, voi: imp - prior.v, neto: imp - prior.v - costo, pPos: pPos, pNeg: pNeg, postPos: postPos, postNeg: postNeg, bPos: bPos, bNeg: bNeg, perf: perf, imp: imp, costo: costo,
      cambia: bPos.n !== prior.n || bNeg.n !== prior.n };
    if (!res.cambia) av.push('La información no cambia la decisión óptima en ninguno de los dos resultados posibles: su valor es cero. No conviene pagarla.');
    if (res.voi > res.vpi + 1e-9) av.push('Inconsistencia numérica: el valor de la información imperfecta no puede superar al de la perfecta.');
    if (res.neto < 0 && res.cambia) av.push('El costo de la información supera su valor esperado: no se justifica comprarla en estas condiciones.');
    av.push('Valor esperado con neutralidad al riesgo; el valor presente de cada acción debe estar neto de costos. La sensibilidad y especificidad deben provenir de experiencia histórica de la herramienta en la cuenca.');
    return res;
  };

  /* =====================================================
     39. CARTERA DE PROSPECTOS Y PRESUPUESTO
     VME_i = Pc_i·VP_i − (1 − Pc_i)·Costo_i ; eficiencia de inversión = VME_i/Costo_i
     Selección: búsqueda exhaustiva (n ≤ 16) del subconjunto que maximiza el VME total bajo presupuesto
     ===================================================== */
  C.cartera = function (p) {
    var err = [], av = [];
    var f = rows(p.filas).map(function (r) { return { n: String(r.nombre || '').trim() || 'Prospecto', pc: num(r.pc), vp: num(r.vp), costo: num(r.costo) }; });
    var bud = num(p.presupuesto);
    if (f.length < 2) err.push('Cargá al menos 2 prospectos.');
    if (f.length > 16) err.push('La búsqueda exhaustiva admite hasta 16 prospectos.');
    f.forEach(function (r, i) { if (!(r.pc > 0 && r.pc < 1) || !(r.vp > 0) || !(r.costo > 0)) err.push('Prospecto ' + (i + 1) + ': probabilidad entre 0 y 1, valor presente en éxito y costo positivos.'); });
    if (!(bud > 0)) err.push('Ingresá el presupuesto de exploración.');
    if (err.length) return { errores: err };
    f.forEach(function (r) { r.vme = r.pc * r.vp - (1 - r.pc) * r.costo; r.ef = r.vme / r.costo; });
    var ord = f.slice().sort(function (a, b) { return b.ef - a.ef; });
    var n = f.length, mejor = { vme: -Infinity, mask: 0, costo: 0 }, tot = 1 << n;
    for (var m = 0; m < tot; m++) {
      var c = 0, v = 0; for (var i = 0; i < n; i++) if (m & (1 << i)) { c += f[i].costo; v += f[i].vme; }
      if (c <= bud + 1e-9 && v > mejor.vme) mejor = { vme: v, mask: m, costo: c };
    }
    var sel = f.filter(function (r, i) { return mejor.mask & (1 << i); });
    var gc = 0, gv = 0, greedy = []; ord.forEach(function (r) { if (r.vme > 0 && gc + r.costo <= bud + 1e-9) { gc += r.costo; gv += r.vme; greedy.push(r.n); } });
    var pAlguno = 1 - sel.reduce(function (s, r) { return s * (1 - r.pc); }, 1);
    if (f.some(function (r) { return r.vme <= 0; })) av.push('Hay prospectos con VME ≤ 0; la selección óptima los excluye.');
    if (mejor.vme < gv - 1e-9) av.push('Inconsistencia: el óptimo exhaustivo no puede ser menor que el voraz.');
    av.push('Se suman VME de prospectos independientes (sin riesgo compartido ni inversión en etapas). Si comparten factores del sistema petrolero, el éxito de uno cambia la probabilidad de otros (ver actualización de Pg).');
    return { errores: [], avisos: av, filas: ord, sel: sel, vmeSel: sel.length ? mejor.vme : 0, costoSel: sel.length ? mejor.costo : 0, greedy: greedy, vmeGreedy: gv, costoGreedy: gc, pAlguno: pAlguno, presupuesto: bud };
  };

  /* =====================================================
     40. MEZCLA DE CRUDOS Y COMBUSTIBLES
     Densidad: por volumen ; azufre: por masa ; viscosidad: Refutas, VBN = 14,534·ln(ln(ν + 0,8)) + 10,975, ponderado por masa
     ===================================================== */
  C.mezcla = function (p) {
    var err = [], av = [];
    var f = rows(p.filas).map(function (r) { return { n: String(r.nombre || '').trim() || 'Componente', v: num(r.vol), api: num(r.api), s: num(r.azufre), nu: num(r.visc) }; });
    if (f.length < 2) err.push('Cargá al menos 2 componentes.');
    f.forEach(function (r, i) { if (!(r.v > 0)) err.push('Componente ' + (i + 1) + ': volumen positivo.'); if (!(r.api > -5 && r.api < 100)) err.push('Componente ' + (i + 1) + ': API entre −5 y 100.'); if (!(r.s >= 0 && r.s < 20)) err.push('Componente ' + (i + 1) + ': azufre entre 0 y 20 % m/m.'); });
    if (err.length) return { errores: err };
    var vt = f.reduce(function (s, r) { return s + r.v; }, 0), masa = 0, mS = 0;
    f.forEach(function (r) { r.sg = 141.5 / (131.5 + r.api); r.x = r.v / vt; r.m = r.v * r.sg; masa += r.m; });
    f.forEach(function (r) { r.w = r.m / masa; mS += r.w * r.s; });
    var sg = masa / vt, api = 141.5 / sg - 131.5;
    var res = { errores: [], avisos: av, vt: vt, sg: sg, api: api, azufre: mS, filas: f.map(function (r) { return { n: r.n, x: r.x, w: r.w, sg: r.sg }; }) };
    var conVisc = f.filter(function (r) { return r.nu > 0; }).length;
    if (conVisc === f.length) { var vbn = 0; f.forEach(function (r) { vbn += r.w * (14.534 * Math.log(Math.log(r.nu + 0.8)) + 10.975); }); res.vbn = vbn; res.visc = Math.exp(Math.exp((vbn - 10.975) / 14.534)) - 0.8; if (f.some(function (r) { return r.nu < 2; })) av.push('Algún componente tiene viscosidad cinemática menor que 2 cSt: la correlación de Refutas es poco confiable en ese rango.'); }
    else if (conVisc > 0) av.push('No se calculó la viscosidad de la mezcla: falta el dato en algunos componentes.');
    av.push('Mezcla ideal por volumen (sin contracción volumétrica). Las propiedades no lineales (RVP, punto de fluidez, octanaje, contenido de asfaltenos) requieren índices de mezcla específicos y ensayos.');
    return res;
  };

  /* =====================================================
     41–47. HERRAMIENTAS POR ESTRATEGIA DE EXPLOTACIÓN
     ===================================================== */
  function normInv(p) { // Acklam (2003), error relativo < 1,15e-9
    var a = [-3.969683028665376e+01, 2.209460984245205e+02, -2.759285104469687e+02, 1.383577518672690e+02, -3.066479806614716e+01, 2.506628277459239e+00],
      b = [-5.447609879822406e+01, 1.615858368580409e+02, -1.556989798598866e+02, 6.680131188771972e+01, -1.328068155288572e+01],
      c = [-7.784894002430293e-03, -3.223964580411365e-01, -2.400758277161838e+00, -2.549732539343734e+00, 4.374664141464968e+00, 2.938163982698783e+00],
      d = [7.784695709041462e-03, 3.224671290700398e-01, 2.445134137142996e+00, 3.754408661907416e+00], pl = 0.02425, q, r;
    if (p <= 0 || p >= 1) return NaN;
    if (p < pl) { q = Math.sqrt(-2 * Math.log(p)); return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1); }
    if (p > 1 - pl) { q = Math.sqrt(-2 * Math.log(1 - p)); return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1); }
    q = p - 0.5; r = q * q;
    return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
  }
  C._util.normInv = normInv;

  /* 41. Eficiencia de barrido y heterogeneidad (Dykstra–Parsons): E_R = E_D · E_A · E_V ; V = (k50 − k84,1)/k50 */
  C.barrido = function (p) {
    var err = [], av = [];
    var N = num(p.N), swc = num(p.swc), sor = num(p.sor), ea = num(p.ea), ev = num(p.ev);
    var ks = rows(p.filas).map(function (r) { return num(r.k); }).filter(function (k) { return isFinite(k); });
    if (!(N > 0)) err.push('Ingresá el petróleo original en sitio (> 0).');
    if (!(swc >= 0 && sor >= 0 && swc + sor < 1)) err.push('Swc y Sor deben ser ≥ 0 y sumar menos que 1.');
    if (!(ea > 0 && ea <= 1 && ev > 0 && ev <= 1)) err.push('Las eficiencias de barrido areal y vertical deben estar entre 0 y 1.');
    if (ks.some(function (k) { return !(k > 0); })) err.push('Las permeabilidades deben ser positivas.');
    if (err.length) return { errores: err };
    var ed = (1 - swc - sor) / (1 - swc), er = ed * ea * ev, res = { errores: [], avisos: av, ed: ed, ea: ea, ev: ev, er: er, np: N * er, restante: N * (1 - er) };
    if (ks.length >= 5) {
      var s = ks.slice().sort(function (a, b) { return b - a; }), n = s.length, xs = [], ys = [], i;
      for (i = 0; i < n; i++) { xs.push(normInv((i + 0.5) / n)); ys.push(Math.log(s[i])); }
      var mx = 0, my = 0; for (i = 0; i < n; i++) { mx += xs[i] / n; my += ys[i] / n; }
      var sxx = 0, sxy = 0, syy = 0; for (i = 0; i < n; i++) { sxx += Math.pow(xs[i] - mx, 2); sxy += (xs[i] - mx) * (ys[i] - my); syy += Math.pow(ys[i] - my, 2); }
      var bb = sxy / sxx, aa = my - bb * mx, k50 = Math.exp(aa), k841 = Math.exp(aa + bb);
      res.k50 = k50; res.k841 = k841; res.V = (k50 - k841) / k50; res.r2k = syy > 0 ? sxy * sxy / (sxx * syy) : 1; res.nK = n;
      res.clase = res.V < 0.5 ? 'heterogeneidad baja a moderada' : res.V <= 0.7 ? 'heterogeneidad moderada a alta' : 'heterogeneidad muy alta (alto riesgo de canalización)';
      if (res.r2k < 0.85) av.push('Las permeabilidades se ajustan poco a una lognormal (R² = ' + res.r2k.toFixed(2) + '): V es poco representativo; revisá si hay poblaciones mezcladas (facies distintas).');
    } else if (ks.length > 0) av.push('Se necesitan al menos 5 permeabilidades para calcular el coeficiente de Dykstra–Parsons.');
    if (ev > 0.9 && res.V > 0.7) av.push('Eficiencia vertical alta con V > 0,7: inconsistente; con alta heterogeneidad el barrido vertical suele ser bajo.');
    av.push('Las eficiencias areal y vertical deben provenir de correlaciones (Craig, Dykstra–Parsons, Stiles) o de simulación y no se calculan aquí; esta herramienta combina los factores y diagnostica la heterogeneidad.');
    return res;
  };

  /* 42. Polímero vs. agua (Buckley–Leverett con viscosidad del agua aumentada) */
  function recAt(bl, pvi) {
    if (pvi <= bl.pviBt) return pvi;
    var P = bl.post; if (!P.length) return bl.recBt;
    for (var i = 1; i < P.length; i++) if (pvi <= P[i].pvi) { var a = P[i - 1], b = P[i]; return a.rec + (b.rec - a.rec) * (pvi - a.pvi) / (b.pvi - a.pvi); }
    return P[P.length - 1].rec;
  }
  C.polimero = function (p) {
    var err = [], av = [], g = {}, mp = num(p.muPol);
    ['swc', 'sor', 'krwMax', 'kroMax', 'nw', 'no', 'muw', 'muo'].forEach(function (k) { g[k] = num(p[k]); });
    if (!(mp >= g.muw)) err.push('La viscosidad efectiva de la solución de polímero debe ser mayor o igual a la del agua.');
    if (err.length) return { errores: err };
    var a = C.buckleyLeverett(g); if (a.errores.length) return a;
    var gp = Object.assign({}, g, { muw: mp }), b = C.buckleyLeverett(gp); if (b.errores.length) return b;
    var pv = [0.25, 0.5, 0.75, 1, 1.5, 2, 3], filas = pv.map(function (x) { var ra = recAt(a, x), rb = recAt(b, x); return { pvi: x, agua: ra, pol: rb, dif: rb - ra, difRel: ra > 0 ? rb / ra - 1 : null }; });
    var curvaA = [[0, 0], [a.pviBt, a.recBt]].concat(a.post.filter(function (q) { return q.pvi <= 3; }).map(function (q) { return [q.pvi, q.rec]; }));
    var curvaB = [[0, 0], [b.pviBt, b.recBt]].concat(b.post.filter(function (q) { return q.pvi <= 3; }).map(function (q) { return [q.pvi, q.rec]; }));
    if (b.M > 1) av.push('Con el polímero la razón de movilidad sigue siendo mayor que 1 (M = ' + b.M.toFixed(2) + '): el control de movilidad es parcial.');
    av.push('La viscosidad de la solución en el reservorio (efectiva, con degradación, adsorción y reducción de permeabilidad) debe provenir de ensayos de laboratorio de la solución, no de la viscosidad en superficie.');
    av.push('No incluye retención de polímero ni volumen de inyección de polímero (se asume inyección continua); es un cálculo de eficiencia de desplazamiento 1D.');
    return { errores: [], avisos: av, agua: a, pol: b, filas: filas, curvaA: curvaA, curvaB: curvaB, mAgua: a.M, mPol: b.M };
  };

  /* 43. Número capilar */
  C.capilar = function (p) {
    var err = [], av = [], q = num(p.q), A = num(p.area), vD = num(p.v), mu = num(p.mu), sg = num(p.sigma), tgt = isFinite(num(p.nObj)) ? num(p.nObj) : 1e-3;
    var v = vD > 0 ? vD : (q > 0 && A > 0 ? q * 5.615 / A : NaN);
    if (!(v > 0)) err.push('Ingresá la velocidad de Darcy, o el caudal y el área transversal.');
    if (!(mu > 0)) err.push('La viscosidad del fluido desplazante debe ser positiva.');
    if (!(sg > 0)) err.push('La tensión interfacial debe ser positiva.');
    if (!(tgt > 0)) err.push('El número capilar objetivo debe ser positivo.');
    if (err.length) return { errores: err };
    var vSI = v * 0.3048 / 86400, nc = vSI * mu * 1e-3 / (sg * 1e-3), sgReq = vSI * mu * 1e-3 / tgt / 1e-3, red = sg / sgReq;
    av.push('Los rangos de referencia (≈ 10⁻⁷ a 10⁻⁶ en inyección de agua; del orden de 10⁻³ o más para movilizar petróleo residual) son órdenes de magnitud de la literatura y dependen de la roca: la curva de desaturación capilar real debe medirse en laboratorio.');
    av.push('Con los valores de campo típicos la velocidad intersticial cerca del pozo es mucho mayor que en el medio del patrón: usá la velocidad del frente o del sector de interés.');
    return { errores: [], avisos: av, v: v, vSI: vSI, nc: nc, objetivo: tgt, sigmaReq: sgReq, reduccion: red, log: Math.log10(nc) };
  };

  /* 44. Arps modificada para no convencionales: hiperbólica con paso a exponencial al llegar a Dmin */
  C.arpsMod = function (p) {
    var err = [], av = [], g = {}; ['qi', 'di', 'b', 'dmin', 'qlim', 'horiz'].forEach(function (k) { g[k] = num(p[k]); });
    if (!(g.qi > 0)) err.push('El caudal inicial debe ser positivo.');
    if (!(g.di > 0)) err.push('La declinación inicial nominal debe ser positiva (1/año).');
    if (!(g.b >= 0 && g.b <= 2.5)) err.push('El exponente b debe estar entre 0 y 2,5.');
    if (!(g.dmin > 0 && g.dmin < 1)) err.push('La declinación mínima efectiva anual debe ser una fracción entre 0 y 1.');
    if (!(g.qlim >= 0)) err.push('El caudal límite no puede ser negativo.');
    if (!(g.horiz >= 1 && g.horiz <= 60)) err.push('El horizonte debe estar entre 1 y 60 años.');
    if (err.length) return { errores: err };
    var dm = -Math.log(1 - g.dmin), exp0 = g.b < 1e-9, tsw = exp0 ? Infinity : (g.di > dm ? (g.di / dm - 1) / (g.b * g.di) : 0);
    function qh(t) { return g.b < 1e-9 ? g.qi * Math.exp(-g.di * t) : g.qi / Math.pow(1 + g.b * g.di * t, 1 / g.b); }
    var qsw = isFinite(tsw) ? qh(tsw) : null;
    function q(t) { return t <= tsw ? qh(t) : qsw * Math.exp(-dm * (t - tsw)); }
    var dt = 1 / 365, cum = 0, cumH = 0, tL = null, curva = [], n = Math.round(g.horiz * 365), i, qq, qa = g.qi;
    for (i = 1; i <= n; i++) {
      var t = i * dt; qq = q(t);
      if (qq < g.qlim && tL === null) { tL = t; break; }
      cum += (qa + qq) / 2 * 365 * dt; qa = qq;
      if (i % 30 === 0) curva.push([t, qq]);
    }
    qa = g.qi; for (i = 1; i <= n; i++) { var th = i * dt, qhh = qh(th); cumH += (qa + qhh) / 2 * 365 * dt; qa = qhh; }
    var dsw = exp0 ? g.di : g.di / (1 + g.b * g.di * tsw);
    if (exp0) av.push('Con b = 0 la declinación es exponencial desde el inicio: no hay paso a declinación terminal.');
    if (g.b > 1) av.push('b > 1 es común en flujo transitorio de no convencionales, pero extrapolado sin límite sobrestima el EUR: por eso se impone el paso a declinación exponencial.');
    if (g.dmin < 0.05) av.push('Declinación terminal menor que 5 %/año: es una cola muy larga; debe respaldarse con datos de pozos maduros de la cuenca.');
    av.push('La declinación terminal (habitualmente 5–10 %/año efectiva en la práctica del sector) es una decisión del evaluador; no surge del ajuste. Documentala y contrastala con analogías.');
    return { errores: [], avisos: av, g: g, dNomMin: dm, tsw: tsw, qsw: qsw, dsw: dsw, eur: cum, eurHip: cumH, vida: tL === null ? g.horiz : tL, porLimite: tL !== null, curva: curva, dif: cumH > 0 ? cum / cumH - 1 : 0 };
  };

  /* 45. Duong: ajuste y EUR  q = q1·t^−m·exp[a/(1−m)·(t^(1−m) − 1)] ; Gp = (q1/a)·exp[...] ; q/Gp = a·t^−m */
  C.duong = function (p) {
    var err = [], av = [];
    var f = rows(p.filas).map(function (r) { return { t: num(r.t), q: num(r.q), gp: num(r.gp) }; });
    var qlim = isFinite(num(p.qlim)) ? num(p.qlim) : 0, horiz = num(p.horiz) || 30;
    if (f.length < 6) err.push('Cargá al menos 6 puntos de caudal en el tiempo.');
    f.forEach(function (r, i) { if (!(r.t > 0 && r.q > 0)) err.push('Punto ' + (i + 1) + ': tiempo y caudal positivos.'); });
    for (var i = 1; i < f.length; i++) if (f[i].t <= f[i - 1].t) { err.push('Los tiempos deben ser crecientes.'); break; }
    if (!(horiz >= 1 && horiz <= 60)) err.push('El horizonte debe estar entre 1 y 60 años.');
    if (err.length) return { errores: err };
    var calcGp = f.some(function (r) { return !(r.gp > 0); });
    if (calcGp) { var acc = 0, tp = 0; f.forEach(function (r) { acc += r.q * (r.t - tp); tp = r.t; r.gp = acc; }); }
    var xs = f.map(function (r) { return Math.log(r.t); }), ys = f.map(function (r) { return Math.log(r.q / r.gp); }), n = f.length, mx = 0, my = 0, k;
    for (k = 0; k < n; k++) { mx += xs[k] / n; my += ys[k] / n; }
    var sxx = 0, sxy = 0, syy = 0; for (k = 0; k < n; k++) { sxx += Math.pow(xs[k] - mx, 2); sxy += (xs[k] - mx) * (ys[k] - my); syy += Math.pow(ys[k] - my, 2); }
    var slope = sxy / sxx, m = -slope, a = Math.exp(my - slope * mx), r2 = syy > 0 ? sxy * sxy / (sxx * syy) : 1;
    if (!(m > 0)) return { errores: ['El ajuste da m ≤ 0: los datos no siguen una declinación de flujo lineal (q/Gp debe decrecer con el tiempo).'] };
    function ta(t) { return Math.abs(1 - m) < 1e-6 ? Math.pow(t, a - 1) : Math.pow(t, -m) * Math.exp(a / (1 - m) * (Math.pow(t, 1 - m) - 1)); }
    var sa = 0, sb = 0; f.forEach(function (r) { var x = ta(r.t); sa += r.q * x; sb += x * x; });
    var q1 = sa / sb;
    function gpF(t) { return Math.abs(1 - m) < 1e-6 ? q1 / a * Math.pow(t, a) : q1 / a * Math.exp(a / (1 - m) * (Math.pow(t, 1 - m) - 1)); }
    function qF(t) { return q1 * ta(t); }
    var T = horiz * 365, tl = null, d;
    if (qlim > 0) for (d = Math.ceil(f[f.length - 1].t); d <= T; d++) if (qF(d) < qlim) { tl = d; break; }
    var Tf = tl === null ? T : tl, curva = [], ptsT = [];
    for (d = 1; d <= T; d = Math.ceil(d * 1.1) + 1) curva.push([d / 365, qF(d)]);
    var eur = gpF(Tf);
    if (r2 < 0.9) av.push('R² de q/Gp contra t = ' + r2.toFixed(2) + ' (log–log): el pozo no muestra una pendiente clara de flujo lineal; no uses Duong sin revisar el régimen de flujo y los cierres.');
    if (m <= 1) av.push('m ≤ 1: la acumulada de Duong no converge a un valor finito dentro del modelo; el EUR depende por completo del horizonte elegido.');
    if (m > 1.3) av.push('m > 1,3: declinación muy rápida; verificá que no haya efectos de choke o cierres.');
    if (calcGp) av.push('La producción acumulada se calculó sumando caudal × Δt de los puntos cargados (t en días, desde 0): si los puntos son esparcidos, cargá la acumulada real (Gp) para no sesgar a y m.');
    av.push('Duong fue desarrollado para flujo lineal en reservorios de muy baja permeabilidad y tiende a ser más conservador que Arps con b > 1. El EUR es de apoyo: la categoría de reservas requiere el procedimiento corporativo (PRMS).');
    return { errores: [], avisos: av, a: a, m: m, q1: q1, r2: r2, eur: eur, horiz: horiz, tL: tl, curva: curva, datos: f, finito: m > 1 };
  };

  /* 46. Gas en sitio en shale/tight: libre + adsorbido (Langmuir) */
  C.shaleGas = function (p) {
    var err = [], av = [], g = {};
    ['area', 'h', 'phi', 'sw', 'p', 'T', 'z', 'rhoB', 'vl', 'pl'].forEach(function (k) { g[k] = num(p[k]); });
    var ton = p.ton === 'met' ? 2204.62 : 2000;
    if (!(g.area > 0 && g.h > 0)) err.push('Área y espesor deben ser positivos.');
    if (!(g.phi > 0 && g.phi < 0.4)) err.push('La porosidad debe estar entre 0 y 0,4 (fracción).');
    if (!(g.sw >= 0 && g.sw < 1)) err.push('La saturación de agua debe estar entre 0 y 1.');
    if (!(g.p > 0 && g.T > 0)) err.push('Presión y temperatura positivas (psia, °F).');
    if (!(g.z > 0.3 && g.z < 2)) err.push('El factor z debe estar entre 0,3 y 2.');
    if (!(g.rhoB > 1 && g.rhoB < 3.5)) err.push('La densidad de la roca (bulk) debe estar entre 1 y 3,5 g/cc.');
    if (!(g.vl >= 0 && g.pl > 0)) err.push('El volumen y la presión de Langmuir deben ser positivos (VL ≥ 0).');
    if (err.length) return { errores: err };
    var bg = 0.02827 * g.z * (g.T + 459.67) / g.p, bulk = 43560 * g.area * g.h;
    var libre = bulk * g.phi * (1 - g.sw) / bg, tons = bulk * g.rhoB * 62.428 / ton, vads = g.vl * g.p / (g.pl + g.p), ads = vads * tons, tot = libre + ads;
    var curva = [], k; for (k = 1; k <= 20; k++) { var pp = g.p * k / 20, bgp = 0.02827 * g.z * (g.T + 459.67) / pp; curva.push({ p: pp, libre: bulk * g.phi * (1 - g.sw) / bgp / 1e9, ads: g.vl * pp / (g.pl + pp) * tons / 1e9 }); }
    var secc = 640 / g.area;
    if (g.p > g.pl * 6) av.push('La presión supera 6 veces la de Langmuir: el adsorbido está casi saturado; un error en VL pesa directamente en el total.');
    av.push('El factor z se toma constante a la presión de reservorio; con p alta o gas con CO₂/N₂ usá un z medido o calculado con la composición.');
    av.push('El gas libre aquí no descuenta el volumen poral ocupado por la fase adsorbida (corrección habitual en shale gas); si se aplica, el libre baja algunos puntos porcentuales.');
    av.push('El volumen de Langmuir debe estar en scf por tonelada ' + (p.ton === 'met' ? 'métrica' : 'corta (2000 lb)') + ' medido a la temperatura de reservorio; mezclar bases de tonelada genera un error de ~10 %.');
    return { errores: [], avisos: av, bg: bg, libre: libre, ads: ads, total: tot, fracAds: ads / tot, vads: vads, tons: tons, porSeccion: tot * secc, curva: curva, g: g };
  };

  /* 47. Offshore: sobrecarga con tirante de agua y margen del riser */
  C.offshore = function (p) {
    var err = [], av = [];
    var ag = num(p.ag), wd = num(p.wd), rsw = num(p.rhoSw), tvd = num(p.tvd), pp = num(p.pp), mw = num(p.mw);
    var f = rows(p.filas).map(function (r) { return { n: String(r.nombre || ''), e: num(r.esp), rho: num(r.rho) }; });
    if (!(ag >= 0)) err.push('El air gap no puede ser negativo.');
    if (!(wd > 0)) err.push('Ingresá el tirante de agua (> 0).');
    if (!(rsw > 7 && rsw < 10)) err.push('La densidad del agua de mar debe estar entre 7 y 10 ppg (típico 8,5–8,6).');
    if (!(tvd > ag + wd)) err.push('La profundidad vertical desde la mesa rotary debe superar air gap + tirante de agua.');
    if (!f.length) err.push('Cargá al menos un intervalo de sedimentos bajo el lecho marino.');
    f.forEach(function (r, i) { if (!(r.e > 0 && r.rho > 8 && r.rho < 25)) err.push('Intervalo ' + (i + 1) + ': espesor positivo y densidad entre 8 y 25 ppg.'); });
    if (err.length) return { errores: err };
    var H = tvd - ag - wd, suma = f.reduce(function (s, r) { return s + r.e; }, 0);
    if (Math.abs(suma - H) > Math.max(2, 0.005 * H)) return { errores: ['Los intervalos suman ' + suma.toFixed(0) + ' ft y deberían cubrir ' + H.toFixed(0) + ' ft (TVD − air gap − tirante de agua).'] };
    var pw = 0.052 * rsw * wd, ps = 0, pf = [], z = wd;
    f.forEach(function (r) { var dp = 0.052 * r.rho * r.e; ps += dp; z += r.e; pf.push({ n: r.n, e: r.e, rho: r.rho, dp: dp, sv: pw + ps, z: z }); });
    var sv = pw + ps, grad = sv / tvd, ppgEq = sv / (0.052 * tvd), res = { errores: [], avisos: av, H: H, pAgua: pw, pSed: ps, sv: sv, grad: grad, ppgEq: ppgEq, filas: pf };
    if (isFinite(pp) && pp > 0) {
      var Pp = 0.052 * pp * tvd, mwRm = (Pp - pw) / (0.052 * H);
      res.Pp = Pp; res.mwRm = mwRm;
      if (isFinite(mw) && mw > 0) { res.mw = mw; res.margen = mwRm - mw; res.necesita = mwRm > mw; }
      if (Pp >= sv) av.push('Presión de poros ≥ sobrecarga: físicamente inconsistente.');
    }
    if (grad > 1.0) av.push('Gradiente de sobrecarga > 1 psi/ft: revisá las densidades.');
    av.push('El gradiente de sobrecarga offshore es menor que el onshore a igual profundidad porque la columna de agua pesa menos que la roca: no uses el 1 psi/ft onshore en aguas profundas (afecta la presión de poros y la fractura).');
    av.push('Margen del riser: densidad con la que el lodo bajo el lecho balancea los poros si se desconecta el riser (solo agua de mar sobre el lecho). Es un cálculo de presión estática: no incluye geles, temperatura ni el margen de maniobra.');
    return res;
  };


  /* ---------- Caracterización: pruebas de pozo, producción, gradientes, petrofísica, roca ---------- */
  function olsFull(xs, ys) {
    var n = xs.length, mx = 0, my = 0, i;
    if (n < 2) return null;
    for (i = 0; i < n; i++) { mx += xs[i] / n; my += ys[i] / n; }
    var sxx = 0, sxy = 0, syy = 0;
    for (i = 0; i < n; i++) { sxx += Math.pow(xs[i] - mx, 2); sxy += (xs[i] - mx) * (ys[i] - my); syy += Math.pow(ys[i] - my, 2); }
    if (sxx < 1e-18) return null;
    var b = sxy / sxx, a = my - b * mx, r2 = syy > 0 ? sxy * sxy / (sxx * syy) : 1, sse = 0;
    for (i = 0; i < n; i++) sse += Math.pow(ys[i] - (a + b * xs[i]), 2);
    var s2 = n > 2 ? sse / (n - 2) : NaN;
    return { n: n, b: b, a: a, r2: r2, mx: mx, sxx: sxx, seb: Math.sqrt(s2 / sxx), sea: Math.sqrt(s2 * (1 / n + mx * mx / sxx)), cov: -mx * s2 / sxx, rmse: Math.sqrt(sse / n) };
  }
  C._util.ols = olsFull;

  /* 49. Pruebas de pozo: derivada de Bourdet, diagnóstico de régimen, k y daño */
  C.ptaDeriv = function (p) {
    var K0 = -(Math.log(0.0002637) + 0.80907);
    var err = [], av = [], g = {};
    ['q', 'B', 'mu', 'h', 'ct', 'phi', 'rw'].forEach(function (k) { g[k] = num(p[k]); });
    var tp = isFinite(num(p.tp)) ? num(p.tp) : 0, L = isFinite(num(p.L)) ? num(p.L) : 0.1, tipo = p.tipo === 'dd' ? 'dd' : 'bu';
    var w1 = num(p.tIni), w2 = num(p.tFin);
    var f = rows(p.filas).map(function (r) { return { t: num(r.t), dp: num(r.dp) }; });
    if (!(g.q > 0 && g.B > 0 && g.mu > 0 && g.h > 0 && g.ct > 0 && g.rw > 0)) err.push('Caudal, B, viscosidad, espesor, compresibilidad y radio del pozo deben ser positivos.');
    if (!(g.phi > 0 && g.phi < 0.6)) err.push('La porosidad debe estar entre 0 y 0,6 (fracción).');
    if (!(L >= 0 && L <= 0.5)) err.push('El suavizado L debe estar entre 0 y 0,5 (ciclos logarítmicos naturales).');
    if (tipo === 'bu' && !(tp > 0)) err.push('En un cierre (build-up) cargá el tiempo de producción previo tp (> 0 h) para usar el tiempo equivalente de Agarwal.');
    if (f.length < 8) err.push('Cargá al menos 8 puntos (Δt, Δp).');
    f.forEach(function (r, i) { if (!(r.t > 0 && r.dp > 0)) err.push('Punto ' + (i + 1) + ': Δt y Δp deben ser positivos.'); });
    for (var i = 1; i < f.length; i++) if (f[i].t <= f[i - 1].t) { err.push('Los tiempos Δt deben ser crecientes.'); break; }
    if (err.length) return { errores: err };
    var n = f.length, k;
    f.forEach(function (r) { r.te = tipo === 'bu' ? r.t * tp / (tp + r.t) : r.t; r.x = Math.log(r.te); });
    for (i = 1; i < n; i++) if (!(f[i].x > f[i - 1].x)) { err.push('El tiempo equivalente no es creciente: revisá tp o los Δt.'); break; }
    if (err.length) return { errores: err };
    /* derivada de Bourdet con suavizado L */
    for (i = 0; i < n; i++) {
      var il = -1, ir = -1, j;
      for (j = i - 1; j >= 0; j--) { if (f[i].x - f[j].x >= L) { il = j; break; } }
      if (il < 0 && i > 0) il = i - 1;
      for (j = i + 1; j < n; j++) { if (f[j].x - f[i].x >= L) { ir = j; break; } }
      if (ir < 0 && i < n - 1) ir = i + 1;
      if (il < 0 || ir < 0) { f[i].der = null; continue; }
      var dx1 = f[i].x - f[il].x, dx2 = f[ir].x - f[i].x, dp1 = f[i].dp - f[il].dp, dp2 = f[ir].dp - f[i].dp;
      f[i].der = (dp1 / dx1 * dx2 + dp2 / dx2 * dx1) / (dx1 + dx2);
    }
    /* pendientes locales (log-log) */
    var pd = f.filter(function (r) { return r.der != null && r.der > 0; });
    for (i = 0; i < n; i++) { f[i].sDp = i > 0 ? Math.log(f[i].dp / f[i - 1].dp) / (f[i].x - f[i - 1].x) : null; }
    for (i = 1; i < n; i++) { f[i].sDer = (f[i].der != null && f[i - 1].der != null && f[i].der > 0 && f[i - 1].der > 0) ? Math.log(f[i].der / f[i - 1].der) / (f[i].x - f[i - 1].x) : null; }
    /* ventana de flujo radial: manual o plateau más largo de la derivada */
    var win = null, ids = [];
    for (i = 0; i < n; i++) if (f[i].der != null && f[i].der > 0) ids.push(i);
    if (isFinite(w1) && isFinite(w2) && w2 > w1) {
      var sel = ids.filter(function (ii) { return f[ii].t >= w1 && f[ii].t <= w2; });
      if (sel.length >= 3) win = sel;
      else av.push('La ventana de flujo radial manual tiene menos de 3 puntos con derivada; se usó la detección automática.');
    }
    if (!win) {
      var best = null, a0, a1, mn, mxv, ok;
      for (a0 = 0; a0 < ids.length; a0++) {
        mn = Infinity; mxv = -Infinity; ok = a0;
        for (a1 = a0; a1 < ids.length; a1++) {
          var dv = f[ids[a1]].der; mn = Math.min(mn, dv); mxv = Math.max(mxv, dv);
          if (mxv / mn <= 1.15) ok = a1; else break;
        }
        if (ok - a0 + 1 >= 4 && (!best || ok - a0 >= best[1] - best[0])) best = [a0, ok];
      }
      if (best) win = ids.slice(best[0], best[1] + 1);
    }
    var out = { errores: [], avisos: av, filas: f, tipo: tipo, tp: tp, L: L, g: g };
    var wsC = [];
    for (i = 0; i < n; i++) if (f[i].sDp != null && f[i].sDp > 0.9 && f[i].sDp < 1.1 && f[i].der != null && f[i].sDer != null && f[i].sDer > 0.8 && f[i].sDer < 1.2) wsC.push(g.q * g.B * f[i].t / (24 * f[i].dp));
    if (wsC.length >= 2) { out.C = wsC.reduce(function (a, b) { return a + b; }, 0) / wsC.length; }
    if (win) {
      var mprime = 0; win.forEach(function (ii) { mprime += f[ii].der / win.length; });
      var kk = 70.6 * g.q * g.B * g.mu / (g.h * mprime);
      var sSum = 0; win.forEach(function (ii) { sSum += 0.5 * (f[ii].dp / f[ii].der - Math.log(kk * f[ii].te / (g.phi * g.mu * g.ct * g.rw * g.rw)) + K0); });
      var skin = sSum / win.length, last = f[n - 1];
      out.win = { t1: f[win[0]].t, t2: f[win[win.length - 1]].t, n: win.length };
      out.mprime = mprime; out.k = kk; out.kh = kk * g.h; out.s = skin;
      out.ri = Math.sqrt(kk * last.te / (948 * g.phi * g.mu * g.ct));
      out.dpSkin = 141.2 * g.q * g.B * g.mu / (kk * g.h) * skin;
      out.winIds = win;
      if (win.length < 5) av.push('La ventana de flujo radial tiene pocos puntos (' + win.length + '): el k es sensible al ruido; ampliá el rango de tiempo o ajustá L.');
      if (f[win[win.length - 1]].der / f[win[0]].der > 1.2 || f[win[win.length - 1]].der / f[win[0]].der < 0.83) av.push('La derivada no es plana dentro de la ventana elegida: revisá que realmente sea flujo radial.');
      if (!isFinite(skin) || Math.abs(skin) > 50) av.push('El daño calculado es extremo (' + (isFinite(skin) ? skin.toFixed(1) : 'no definido') + '): revisá φ, ct, rw y el rango de la ventana.');
      if (tipo === 'bu') av.push('En un cierre el daño calculado con tiempo equivalente es aproximado; para historias de caudal complejas usá superposición o un modelo numérico.');
    } else {
      av.push('No se detectó una meseta de la derivada (flujo radial): la prueba puede ser demasiado corta, estar dominada por almacenamiento o por límites. Indicá el rango de tiempo manualmente solo si el gráfico lo respalda.');
    }
    /* regímenes por pendiente de la derivada */
    var reg = [];
    for (i = 1; i < n; i++) { var s = f[i].sDer; if (s == null) continue; var r;
      if (s > 0.85 && s < 1.15) r = 'almacenamiento'; else if (s > 0.4 && s < 0.6) r = 'lineal (½)'; else if (s > 0.15 && s < 0.35) r = 'bilineal (¼)'; else if (Math.abs(s) < 0.12) r = 'radial (0)'; else r = null;
      if (r) f[i].reg = r; }
    out.regimenes = f.filter(function (r) { return r.reg; }).map(function (r) { return r.reg; }).filter(function (v, i, a) { return a.indexOf(v) === i; });
    av.push('Para cierres, Δt se transforma en tiempo equivalente de Agarwal (Δt·tp/(tp + Δt)); si tp es muy corto respecto de Δt la aproximación pierde exactitud. Esta herramienta diagnostica y estima k y daño; no reemplaza un ajuste con curvas tipo o un modelo.');
    return out;
  };

  /* 50. Análisis de producción (RTA) para petróleo: balance de materia fluyente y flujo lineal */
  C.rta = function (p) {
    var err = [], av = [], g = {};
    ['phi', 'ct', 'mu', 'B', 'h', 'pi', 'sw'].forEach(function (k) { g[k] = num(p[k]); });
    var fb = isFinite(num(p.fBdf)) ? num(p.fBdf) : 0.4, fl = isFinite(num(p.fLin)) ? num(p.fLin) : 0.4;
    var f = rows(p.filas).map(function (r) { return { t: num(r.t), q: num(r.q), pwf: num(r.pwf) }; });
    if (!(g.phi > 0 && g.phi < 0.6 && g.ct > 0 && g.mu > 0 && g.B > 0 && g.h > 0)) err.push('φ (0–0,6), compresibilidad, viscosidad, B y espesor deben ser positivos.');
    if (!(g.sw >= 0 && g.sw < 1)) err.push('La saturación de agua debe estar entre 0 y 1.');
    if (!(g.pi > 0)) err.push('La presión inicial debe ser positiva.');
    if (f.length < 10) err.push('Cargá al menos 10 puntos (t, q, pwf).');
    f.forEach(function (r, i) { if (!(r.t > 0 && r.q > 0 && r.pwf > 0 && r.pwf < g.pi)) err.push('Punto ' + (i + 1) + ': t y q positivos y 0 < pwf < pi.'); });
    for (var i = 1; i < f.length; i++) if (f[i].t <= f[i - 1].t) { err.push('Los tiempos deben ser crecientes.'); break; }
    if (!(fb > 0.1 && fb <= 1) || !(fl > 0.1 && fl <= 1)) err.push('Las fracciones de puntos para los ajustes deben estar entre 0,1 y 1.');
    if (err.length) return { errores: err };
    var n = f.length, np = 0, tprev = 0, k;
    f.forEach(function (r) { np += r.q * (r.t - tprev); tprev = r.t; r.np = np; r.dp = g.pi - r.pwf; r.qdp = r.q / r.dp; r.dpq = r.dp / r.q; r.tmb = r.np / r.q; });
    /* balance de materia fluyente: Δp/q = m·t_mb + b en la cola */
    var nb = Math.max(5, Math.round(n * fb)), tail = f.slice(n - nb), rb = olsFull(tail.map(function (r) { return r.tmb; }), tail.map(function (r) { return r.dpq; }));
    var res = { errores: [], avisos: av, filas: f, g: g, nb: nb };
    if (rb && rb.b > 0) {
      var vp = g.B / (g.ct * rb.b), vpFt3 = vp * 5.615, area = vpFt3 / (g.phi * g.h * 43560), ooip = vp * (1 - g.sw) / g.B;
      res.bdf = { m: rb.b, b: rb.a, r2: rb.r2, vp: vp, area: area, N: ooip, fr: f[n - 1].np / ooip, np: f[n - 1].np };
      if (rb.r2 < 0.95) av.push('R² del ajuste de flujo dominado por los límites = ' + rb.r2.toFixed(3) + ': los últimos puntos no siguen una recta de Δp/q contra t_mb; el volumen no es confiable.');
      if (res.bdf.fr > 1) av.push('La producción acumulada supera el volumen estimado: el pozo aún no entró en flujo dominado por los límites o hay aporte externo.');
      if (rb.a < 0) av.push('La ordenada del ajuste es negativa: no es coherente con un pozo en flujo dominado por los límites (revisá la selección de puntos).');
    } else av.push('La pendiente de Δp/q contra t_mb no es positiva en la cola: no se puede estimar volumen (aún en flujo transitorio o datos con ruido).');
    /* flujo lineal: Δp/q = mL·√t en el comienzo */
    var nl = Math.max(5, Math.round(n * fl)), head = f.slice(0, nl), rl = olsFull(head.map(function (r) { return Math.sqrt(r.t); }), head.map(function (r) { return r.dpq; }));
    if (rl && rl.b > 0) {
      var mu = g.mu * 1e-3, ct = g.ct / 6894.757, mSI = rl.b * 6894.757 * 86400 / 0.158987294928 / Math.sqrt(86400);
      var acSqrtK = 2 * g.B * Math.sqrt(mu / (Math.PI * g.phi * ct)) / mSI;
      acSqrtK = acSqrtK / (0.09290304 * Math.sqrt(9.869233e-16));
      res.lin = { m: rl.b, b: rl.a, r2: rl.r2, acSqrtK: acSqrtK, n: nl };
      var kmd = num(p.k);
      if (kmd > 0) { res.lin.k = kmd; res.lin.ac = acSqrtK / Math.sqrt(kmd); res.lin.xf = res.lin.ac / (4 * g.h); }
      if (rl.r2 < 0.95) av.push('R² del ajuste de flujo lineal = ' + rl.r2.toFixed(3) + ': el comienzo de la historia no es una recta contra √t (puede haber almacenamiento, choke o régimen distinto).');
    } else av.push('No hay pendiente positiva de Δp/q contra √t en el comienzo de la historia: no se estima A_c·√k.');
    av.push('Δp/q contra √t y Δp/q contra t_mb asumen un líquido de compresibilidad baja y constante, caudal razonablemente estable y pwf conocida; para gas hay que usar pseudo-presión y pseudo-tiempo, que esta herramienta no incluye.');
    av.push('El volumen del flujo dominado por los límites (V_p = B/(c_t·m)) es el volumen poral drenado a la fecha: si el pozo aún no sintió los bordes, es un mínimo.');
    res.curva = f.map(function (r) { return { tmb: r.tmb, qdp: r.qdp }; });
    return res;
  };

  /* 51. Gradientes de presión y contactos de fluidos */
  C.gradiente = function (p) {
    var err = [], av = [], f = rows(p.filas).map(function (r) { return { z: num(r.z), p: num(r.p), f: String(r.f || '').trim().toLowerCase().charAt(0) }; });
    var pd = isFinite(num(p.pe)) ? num(p.pe) : 0, ztop = num(p.ztop);
    f.forEach(function (r, i) { if (!(isFinite(r.z) && r.p > 0)) err.push('Punto ' + (i + 1) + ': profundidad y presión válidas (psi > 0).'); if (['o', 'g', 'w'].indexOf(r.f) < 0) err.push('Punto ' + (i + 1) + ': fluido o, g o w.'); });
    if (pd < 0) err.push('La presión de entrada no puede ser negativa.');
    if (err.length) return { errores: err };
    var lines = {}, names = { o: 'Petróleo', g: 'Gas', w: 'Agua' }, fl;
    ['g', 'o', 'w'].forEach(function (c) {
      var pts = f.filter(function (r) { return r.f === c; });
      if (pts.length >= 2) {
        var o = olsFull(pts.map(function (r) { return r.z; }), pts.map(function (r) { return r.p; }));
        if (o) lines[c] = { c: c, n: pts.length, g: o.b, b: o.a, r2: o.r2, seg: o.seb, seb: o.sea, cov: o.cov, rmse: o.rmse, rho: o.b / 0.433, nombre: names[c] };
      }
    });
    if (Object.keys(lines).length < 2) return { errores: ['Se necesitan al menos 2 fluidos con 2 o más puntos cada uno para intersecar gradientes.'] };
    function inter(a, b) {
      var D = b.g - a.g; if (!(Math.abs(D) > 1e-9)) return null;
      var z = (a.b - b.b) / D, v = null;
      if (isFinite(a.seg) && isFinite(b.seg)) {
        var da = [1 / D, z / D], db = [-1 / D, -z / D];
        v = da[0] * da[0] * a.seb * a.seb + da[1] * da[1] * a.seg * a.seg + 2 * da[0] * da[1] * a.cov + db[0] * db[0] * b.seb * b.seb + db[1] * db[1] * b.seg * b.seg + 2 * db[0] * db[1] * b.cov;
      }
      return { z: z, p: a.g * z + a.b, sd: v != null && v >= 0 ? Math.sqrt(v) : null };
    }
    var cont = [], H = lines;
    if (H.g && H.o) { var go = inter(H.g, H.o); if (go) cont.push({ n: 'Contacto gas–petróleo (GOC)', z: go.z, p: go.p, sd: go.sd, tipo: 'goc' }); }
    if (H.o && H.w) { var ow = inter(H.o, H.w); if (ow) { var obs = ow.z - (pd > 0 ? pd / (H.w.g - H.o.g) : 0); cont.push({ n: 'Nivel de agua libre (FWL), petróleo–agua', z: ow.z, p: ow.p, sd: ow.sd, tipo: 'fwl' }); if (pd > 0) cont.push({ n: 'Contacto petróleo–agua observado (OWC)', z: obs, p: null, sd: ow.sd, tipo: 'owc' }); } }
    if (H.g && H.w && !H.o) { var gw = inter(H.g, H.w); if (gw) { var obs2 = gw.z - (pd > 0 ? pd / (H.w.g - H.g.g) : 0); cont.push({ n: 'Nivel de agua libre (FWL), gas–agua', z: gw.z, p: gw.p, sd: gw.sd, tipo: 'fwl' }); if (pd > 0) cont.push({ n: 'Contacto gas–agua observado (GWC)', z: obs2, p: null, sd: gw.sd, tipo: 'owc' }); } }
    var res = { errores: [], avisos: av, lineas: ['g', 'o', 'w'].filter(function (c) { return lines[c]; }).map(function (c) { return lines[c]; }), contactos: cont, puntos: f, pe: pd };
    if (isFinite(ztop)) {
      var fwl = cont.filter(function (c) { return c.tipo === 'fwl'; })[0];
      if (fwl) { res.columna = fwl.z - ztop; if (pd > 0) { var ob = cont.filter(function (c) { return c.tipo === 'owc'; })[0]; res.columnaObs = ob.z - ztop; } }
    }
    ['g', 'o', 'w'].forEach(function (c) {
      var L = lines[c]; if (!L) return;
      var rng = { g: [0.04, 0.2], o: [0.25, 0.41], w: [0.40, 0.52] }[c];
      if (L.g < rng[0] || L.g > rng[1]) av.push('Gradiente de ' + L.nombre.toLowerCase() + ' = ' + L.g.toFixed(3) + ' psi/ft (' + L.rho.toFixed(2) + ' g/cc): fuera del rango habitual (' + rng[0] + '–' + rng[1] + ' psi/ft); revisá las unidades o el fluido asignado.');
      if (L.n < 3) av.push(L.nombre + ': solo ' + L.n + ' puntos; con 2 el gradiente es exacto pero no hay estimación de incertidumbre del contacto. Usá 3 o más.');
      else if (L.rmse > 3) av.push(L.nombre + ': el residuo del ajuste es de ' + L.rmse.toFixed(1) + ' psi (> 3): posible supercarga, deriva del manómetro o puntos de otro compartimento.');
    });
    if (cont.some(function (c) { return c.sd != null && c.sd > 50; })) av.push('La incertidumbre del contacto supera 50 ft: los datos son pocos o están muy cercanos en profundidad; no fijes el contacto con esta intersección sola.');
    if (pd === 0 && H.o && H.w) av.push('Sin presión de entrada, el contacto calculado es el nivel de agua libre (presión capilar = 0), que queda por debajo del contacto observado en los registros. Cargá la presión de entrada de la roca para estimar la diferencia.');
    av.push('La intersección supone el mismo sistema de presión (misma compartimentalización) para todos los puntos; presiones de pozos distintos deben compararse a la misma referencia y ajustarse por depleción si las tomas son de fechas distintas.');
    return res;
  };

  /* 52. Petrofísica de arenas arcillosas y espesor neto */
  C.petro2 = function (p) {
    var err = [], av = [], g = {}, modelo = ['archie', 'sim', 'indo'].indexOf(p.modelo) >= 0 ? p.modelo : 'indo';
    ['rw', 'rsh', 'a', 'm', 'n', 'dz', 'phic', 'vshc', 'swc'].forEach(function (k) { g[k] = num(p[k]); });
    var f = rows(p.filas).map(function (r) { return { z: num(r.z), phi: num(r.phi), vsh: num(r.vsh), rt: num(r.rt) }; });
    if (!(g.rw > 0 && g.rsh > 0 && g.a > 0 && g.m > 0 && g.n > 0)) err.push('Rw, Rsh, a, m y n deben ser positivos.');
    if (!(g.dz > 0)) err.push('El paso de muestreo debe ser positivo (ft).');
    if (!(g.phic >= 0 && g.phic < 0.4 && g.vshc > 0 && g.vshc <= 1 && g.swc > 0 && g.swc <= 1)) err.push('Cortes: φ entre 0 y 0,4, Vsh entre 0 y 1 y Sw entre 0 y 1.');
    if (f.length < 3) err.push('Cargá al menos 3 muestras de perfil.');
    f.forEach(function (r, i) { if (!(r.phi > 0 && r.phi < 0.6 && r.vsh >= 0 && r.vsh <= 1 && r.rt > 0)) err.push('Muestra ' + (i + 1) + ': φ (0–0,6), Vsh (0–1) y Rt (> 0).'); });
    if (err.length) return { errores: err };
    var nm = modelo, i;
    if (modelo === 'sim' && g.n !== 2) { av.push('Simandoux requiere n = 2: se usó n = 2 en ese modelo.'); }
    f.forEach(function (r) {
      var sw;
      if (nm === 'archie') sw = Math.pow(g.a * g.rw / (Math.pow(r.phi, g.m) * r.rt), 1 / g.n);
      else if (nm === 'sim') { var c = r.vsh / g.rsh, d = Math.pow(r.phi, g.m) / (g.a * g.rw); sw = (-c + Math.sqrt(c * c + 4 * d / r.rt)) / (2 * d); }
      else { var den = Math.pow(r.vsh, 1 - r.vsh / 2) / Math.sqrt(g.rsh) + Math.pow(r.phi, g.m / 2) / Math.sqrt(g.a * g.rw); sw = Math.pow((1 / Math.sqrt(r.rt)) / den, 2 / g.n); }
      r.swRaw = sw; r.sw = Math.min(1, Math.max(0, sw));
      r.net = r.phi >= g.phic && r.vsh <= g.vshc && r.sw <= g.swc;
      r.res = r.phi >= g.phic && r.vsh <= g.vshc;
    });
    var gross = f.length * g.dz, hRes = 0, hNet = 0, pa = 0, pw = 0, va = 0, phih = 0, hcpv = 0;
    f.forEach(function (r) {
      if (r.res) hRes += g.dz;
      if (r.net) { hNet += g.dz; pa += r.phi * g.dz; pw += r.phi * r.sw * g.dz; va += r.vsh * g.dz; hcpv += r.phi * (1 - r.sw) * g.dz; }
    });
    var res = { errores: [], avisos: av, modelo: nm, filas: f, gross: gross, hRes: hRes, hNet: hNet, ntg: hNet / gross, ntgRes: hRes / gross, phiAvg: hNet > 0 ? pa / hNet : null, swAvg: pa > 0 ? pw / pa : null, vshAvg: hNet > 0 ? va / hNet : null, hcpv: hcpv, g: g };
    var clip = f.filter(function (r) { return r.swRaw > 1.0001; }).length;
    if (clip) av.push(clip + ' muestra(s) dieron Sw > 1 y se recortaron a 1: revisá Rw, Rsh y el volumen de arcilla.');
    if (hNet === 0) av.push('Ninguna muestra cumple los tres cortes: el espesor neto es cero.');
    if (nm === 'archie' && f.some(function (r) { return r.vsh > 0.15; })) av.push('Archie con Vsh > 15 % sobreestima Sw: usá Indonesia o Simandoux.');
    av.push('Los modelos de arena arcillosa tienen parámetros (Rsh, a, m, n) que deben venir de laboratorio o de la zona de agua; con parámetros genéricos el resultado es solo orientativo.');
    av.push('Los cortes son decisiones del proyecto (permeabilidad mínima de producción, relación con la fractura, economía), no constantes universales: documentá su justificación.');
    return res;
  };

  /* 53. Tipos de roca (FZI) y altura de saturación (función J de Leverett) */
  C.rocas = function (p) {
    var err = [], av = [], plugs = rows(p.plugs).map(function (r) { return { phi: num(r.phi), k: num(r.k) }; }), pcs = rows(p.pcs).map(function (r) { return { sw: num(r.sw), pc: num(r.pc) }; });
    var nc = Math.round(num(p.nclases)) || 3;
    plugs.forEach(function (r, i) { if (!(r.phi > 0 && r.phi < 0.5 && r.k > 0)) err.push('Plug ' + (i + 1) + ': φ (0–0,5) y k (> 0 mD).'); });
    if (plugs.length < 6) err.push('Cargá al menos 6 plugs (φ, k).');
    if (!(nc >= 1 && nc <= 6)) err.push('El número de clases debe estar entre 1 y 6.');
    if (err.length) return { errores: err };
    plugs.forEach(function (r) { r.rqi = 0.0314 * Math.sqrt(r.k / r.phi); r.phiz = r.phi / (1 - r.phi); r.fzi = r.rqi / r.phiz; r.lf = Math.log10(r.fzi); });
    var lo = Math.min.apply(null, plugs.map(function (r) { return r.lf; })), hi = Math.max.apply(null, plugs.map(function (r) { return r.lf; })), w = (hi - lo) / nc || 1;
    plugs.forEach(function (r) { r.cl = Math.min(nc - 1, Math.floor((r.lf - lo) / w)); });
    var clases = [], c;
    for (c = 0; c < nc; c++) {
      var m = plugs.filter(function (r) { return r.cl === c; });
      if (!m.length) { clases.push({ i: c + 1, n: 0 }); continue; }
      var lm = m.reduce(function (a, r) { return a + r.lf / m.length; }, 0), fz = Math.pow(10, lm);
      clases.push({ i: c + 1, n: m.length, fzi: fz, fziMin: Math.pow(10, Math.min.apply(null, m.map(function (r) { return r.lf; }))), fziMax: Math.pow(10, Math.max.apply(null, m.map(function (r) { return r.lf; }))), phi: m.reduce(function (a, r) { return a + r.phi / m.length; }, 0), k: Math.pow(10, m.reduce(function (a, r) { return a + Math.log10(r.k) / m.length; }, 0)) });
    }
    var res = { errores: [], avisos: av, plugs: plugs, clases: clases, nc: nc };
    if (nc > plugs.length / 3) av.push('Hay pocas muestras por clase; usá menos clases.');
    /* Pc → J */
    var sig = num(p.sigmaLab), th = isFinite(num(p.thetaLab)) ? num(p.thetaLab) : 0, kL = num(p.kLab), phL = num(p.phiLab), swi = isFinite(num(p.swirr)) ? num(p.swirr) : 0;
    if (pcs.length >= 4) {
      if (!(sig > 0 && kL > 0 && phL > 0 && phL < 0.5 && th >= 0 && th < 90)) { err.push('Para la curva J: σ, k y φ del plug de Pc (σ > 0, k > 0, φ en 0–0,5) y ángulo entre 0 y 90°.'); }
      pcs.forEach(function (r, i) { if (!(r.sw > swi && r.sw < 1 && r.pc > 0)) err.push('Punto de Pc ' + (i + 1) + ': Sw entre Swirr y 1, Pc > 0.'); });
      if (err.length) return { errores: err };
      var xs = [], ys = [];
      pcs.forEach(function (r) { r.J = 0.2166 * r.pc / (sig * Math.cos(th * Math.PI / 180)) * Math.sqrt(kL / phL); r.sn = (r.sw - swi) / (1 - swi); xs.push(Math.log(r.sn)); ys.push(Math.log(r.J)); });
      var o = olsFull(xs, ys);
      if (o && o.b < 0) {
        res.j = { a: Math.exp(o.a), b: -o.b, r2: o.r2, swi: swi, pts: pcs };
        if (o.r2 < 0.95) av.push('R² del ajuste de J = ' + o.r2.toFixed(3) + ': la curva no sigue bien una ley de potencias; revisá Swirr o usá una función por tramos.');
        /* altura de saturación */
        var kr = num(p.kRes), pr = num(p.phiRes), sr = num(p.sigmaRes), tr = isFinite(num(p.thetaRes)) ? num(p.thetaRes) : 0, dr = num(p.drho), hm = num(p.hmax);
        if (kr > 0 && pr > 0 && pr < 0.5 && sr > 0 && dr > 0 && hm > 0) {
          var curva = [], hh, step = hm / 40;
          for (hh = 0; hh <= hm + 1e-9; hh += step) {
            var pcr = 0.433 * dr * hh, Jr = 0.2166 * pcr / (sr * Math.cos(tr * Math.PI / 180)) * Math.sqrt(kr / pr), sw;
            if (hh === 0) sw = 1; else { var sn = Math.pow(Jr / res.j.a, -1 / res.j.b); sw = Math.min(1, swi + (1 - swi) * sn); }
            curva.push({ h: hh, pc: pcr, sw: sw });
          }
          res.alt = { curva: curva, kRes: kr, phiRes: pr, drho: dr };
          var hSw = num(p.hSw); if (hSw > 0) { var pcq = 0.433 * dr * hSw, Jq = 0.2166 * pcq / (sr * Math.cos(tr * Math.PI / 180)) * Math.sqrt(kr / pr); res.alt.hq = hSw; res.alt.swq = Math.min(1, swi + (1 - swi) * Math.pow(Jq / res.j.a, -1 / res.j.b)); }
          if (tr >= 90) av.push('El ángulo de contacto de reservorio debe ser menor a 90°.');
        }
      } else av.push('El ajuste de J contra Sw no dio pendiente negativa: los datos de Pc no son consistentes con un drenaje (Pc debe subir cuando Sw baja).');
    }
    av.push('FZI agrupa por geometría de poros solo con φ y k de plugs; las clases deben contrastarse con petrografía o curvas de Pc antes de usarlas para propagar propiedades.');
    av.push('La función J de Leverett supone que una sola curva normalizada describe la roca; con varios tipos de roca ajustá una curva por clase.');
    return res;
  };

  root.H3LCalc = C;
  if (typeof module !== 'undefined' && module.exports) module.exports = C;
})(typeof globalThis !== 'undefined' ? globalThis : this);
