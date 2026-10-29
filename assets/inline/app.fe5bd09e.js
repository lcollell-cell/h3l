/* H3L — guía por estrategia de explotación. Es un criterio editorial de H3L (no una norma): debe validarlo el revisor técnico. */
window.H3L_ESTR = {
  orden: ['primaria', 'secundaria', 'terciaria', 'tight', 'shale', 'offshore'],
  estrategias: {
    primaria: { n: 'Primaria', desc: 'Producción con la energía natural del reservorio: gas en solución, casquete de gas, acuífero y expansión de roca y fluidos. La presión cae y el pozo declina; no hay inyección.', cambia: ['El dato central es la historia de presión y producción: balance de materiales y declinación mandan.', 'El PVT define cuánta energía hay (Rs, Bo, z).', 'El factor de recuperación depende del mecanismo de empuje dominante.'], evitar: ['Herramientas de inyección (barrido, Hall, VRR) y de EOR no corresponden.'] },
    secundaria: { n: 'Secundaria', desc: 'Inyección de agua (o de gas inmiscible) para mantener presión y desplazar petróleo. Se agrega un patrón de pozos inyectores y un seguimiento continuo.', cambia: ['Clave: eficiencia de barrido (areal, vertical, de desplazamiento), ruptura de agua y heterogeneidad.', 'Seguimiento con VRR e inyectividad (Hall).', 'La declinación del productor cambia al llegar el frente: ajustá solo períodos estables.'], evitar: ['Declinación de Arps sin separar los cambios por inyección o cambios de patrón.'] },
    terciaria: { n: 'Terciaria (EOR)', desc: 'Recuperación mejorada tras la inyección de agua: polímeros, surfactantes, gas miscible, CO₂ o térmicos. Ataca el petróleo residual y la relación de movilidad.', cambia: ['Se trabaja sobre el petróleo móvil remanente, no sobre el original.', 'Control de movilidad (polímero) y número capilar (surfactante) definen la eficiencia.', 'Retención, degradación y corrosión (CO₂) son riesgos propios del método.', 'El cribado numérico de criterios (tabla de Taber et al., 1997) todavía no está en estas herramientas: se difiere hasta verificar la tabla contra la fuente.'], evitar: ['Usar el petróleo original (OOIP) como base de volumen.'] },
    tight: { n: 'Tight', desc: 'Reservorios de muy baja permeabilidad que requieren fracturamiento para producir. Flujo lineal transitorio durante largo tiempo; declinación pronunciada al inicio.', cambia: ['Los cut-offs de porosidad y permeabilidad son críticos: calibrá con núcleo.', 'En pruebas de presión el flujo radial puede tardar mucho o no aparecer.', 'El EUR se pronostica con declinación modificada (límite terminal) o Duong, no con b ilimitado.', 'El espaciamiento entre pozos y la interferencia importan.'], evitar: ['Extrapolar b > 1 sin declinación terminal.', 'Interpretar skin de forma convencional en pozos fracturados.'] },
    shale: { n: 'Shale', desc: 'La roca madre es también el reservorio. Se explota con pozos horizontales y fracturamiento por etapas. Hay porosidad orgánica y gas adsorbido.', cambia: ['La madurez y el COT definen la ventana de fluido y el sweet spot.', 'Gas en sitio = libre + adsorbido (Langmuir).', 'El riesgo es de productividad por pozo, no de presencia: Pg del play solo como riesgo de la zona.', 'EUR con declinación modificada y Duong; el espaciamiento y los pozos padre-hijo condicionan.', 'Archie/Simandoux son de uso limitado con materia orgánica y arcillas.'], evitar: ['Balance de materiales volumétrico clásico y p/z.', 'Extrapolar el transitorio como si fuera la declinación final.'] },
    offshore: { n: 'Offshore', desc: 'Ambiente marino: pocos pozos, costo por día de equipo muy alto, instalaciones de superficie sobre plataforma o submarinas y, en aguas profundas, ventana de lodo estrecha.', cambia: ['La sobrecarga baja con el tirante de agua: no uses 1 psi/ft onshore.', 'Riser margin y volumen del riser entran en el diseño de lodo y control de pozo.', 'La decisión es de alto CAPEX con pocos pozos: valor de la información y cartera pesan.', 'Instalaciones: gasoductos, compresión y alivio con restricciones de peso y espacio.'], evitar: ['Planillas de control de pozo terrestres sin ajustar la línea de estrangulamiento y el riser.'] }
  },
  /* orden: primaria, secundaria, terciaria, tight, shale, offshore · n = núcleo, o = aplica con ajustes, - = no aplica. Sin entrada = transversal. */
  mat: { ro: 'o--ono', rose: 'o--oon', bayes: 'o--oon', sello: 'noo--n', petro: 'nnnnon', vol: 'nnonnn', espac: 'onnnno', core: 'nnnnnn', pvt: 'nnnnnn', pz: 'n--o-n', dca: 'noonnn', horner: 'nnonon', mbe: 'nno--n', delgas: 'n--non', bl: '-nn--o', hall: '-nn--o', vrr: '-nn--o', barrido: '-nn--o', polim: '-on--o', capil: '-on---', arpsmod: 'o--nno', duong: '---on-', shalegas: '---on-', offshore: '-----n', eaton: 'noooon', kill: 'nnnnnn', volpozo: 'nnnnnn', co2: 'nnnoon', gasod: 'o--nnn', comp: 'ooonnn', limeco: 'nnnooo', cartera: 'ooonnn', voi: 'ooooon', ptaderiv: 'nnonon', rta: 'oo-nno', gradiente: 'nno--n', petro2: 'nnonon', rocas: 'nnnnon' },
  notas: {
    ptaderiv: { tight: 'El flujo radial puede tardar meses o no aparecer: usá la derivada para reconocer flujo lineal (½) y bilineal (¼) antes de interpretar k.', shale: 'Con multifracturas domina el flujo lineal; no se interpreta el daño de forma convencional y la ventana radial rara vez existe.', terciaria: 'Con inyección activa separá la prueba en períodos de caudal estable; la movilidad cambia con el frente de desplazamiento.', offshore: 'Las pruebas son pocas y caras: planificá la duración con el radio de investigación esperado.' },
    rta: { tight: 'El flujo lineal transitorio puede durar años: A_c·√k es el resultado robusto; el volumen de los límites es un mínimo hasta que se vea el borde.', shale: 'Usalo como diagnóstico: el volumen de los límites sale del tramo final y suele ser un mínimo. Para gas hace falta pseudo-presión (no incluida).', secundaria: 'Bajo inyección el balance de materia fluyente se altera: ajustá solo períodos con inyección estable.', offshore: 'Con pocos pozos y producción mezclada, asegurá que pwf y q sean del mismo pozo y fecha.' },
    gradiente: { terciaria: 'Un barrido previo (inyección de agua) altera las presiones: usá tomas previas al desarrollo o corregí por depleción.', offshore: 'Pocas tomas y de alto costo: priorizalas en los contactos y evitá datos con supercarga.' },
    petro2: { shale: 'Los modelos de arena arcillosa no representan bien la porosidad orgánica ni la pirita: calibrá con núcleo y tomá el resultado como indicativo.', tight: 'Con arcilla dispersa y poca porosidad, los cortes mandan el espesor neto: justificalos con permeabilidad de núcleo.', terciaria: 'El corte de Sw define el petróleo móvil que se desplaza: usá Sor del agente.' },
    rocas: { shale: 'Aplicalo por facies del intervalo objetivo; el FZI con plugs de roca madre es orientativo.', tight: 'Con k muy baja las mediciones de plug tienen error alto: usá permeabilidad bajo confinamiento.', offshore: 'Con pocos núcleos, cada plug pesa: no ajustes más de 2–3 clases.' },
    ro: { shale: 'Define la ventana (petróleo, condensado o gas seco) y con ello el fluido y el tipo de pozo; madurez y COT son criterios para elegir el sweet spot.', tight: 'Confirmá la generación si el reservorio es alimentado por una roca madre cercana.' },
    rose: { shale: 'En recursos continuos el riesgo es de productividad y no de presencia: usá Pg solo como riesgo de la zona (play), no del pozo individual.', offshore: 'Con pocos pozos y costo alto, Pg y VME dominan la decisión: documentá cada factor.' },
    sello: { terciaria: 'Con CO₂ o gas, la integridad del sello y de pozos viejos define el riesgo de fuga.', offshore: 'Usá un rango de muestras y no un valor único; en aguas profundas los datos de sello suelen ser escasos.' },
    petro: { shale: 'Archie y Simandoux se comportan mal con porosidad orgánica y arcillas conductivas: calibrá con núcleo y pirólisis y tomá el resultado como indicativo.', tight: 'Los cut-offs de porosidad y Sw son críticos: verificalos contra la permeabilidad de núcleo.' },
    vol: { shale: 'Trabajá por sección o por pozo sobre la zona objetivo e incluí el gas adsorbido (herramienta Gas en sitio en shale).', tight: 'Usá el espesor de la zona objetivo y no el total de la formación.', terciaria: 'Se aplica al petróleo móvil remanente (Soi − Sor) y no al original.' },
    espac: { secundaria: 'Define el patrón de inyección: el área por pozo controla el barrido y la ruptura.', terciaria: 'El patrón y el espaciamiento definen el tiempo de respuesta y el volumen de químico.', tight: 'El espaciamiento y la interferencia entre fracturas condicionan el EUR: usá EUR de pozos con espaciamiento comparable.', shale: 'El espaciamiento entre laterales y los pozos padre-hijo condicionan el EUR: usá EUR de pozos con espaciamiento comparable.' },
    dca: { shale: 'b > 1 es común en el transitorio: usá Arps modificada o Duong en vez de extrapolar b.', secundaria: 'Bajo inyección la declinación se altera: ajustá solo períodos con inyección estable.', terciaria: 'La respuesta al método puede romper la tendencia: separá antes y después.' },
    horner: { tight: 'El flujo radial puede tardar mucho o no aparecer: verificá el tramo recto antes de interpretar k y skin.', shale: 'Con multifracturas el flujo radial rara vez se alcanza: no interpretes el skin de forma convencional.' },
    mbe: { terciaria: 'Con inyección incluí los volúmenes inyectados; sin un balance confiable la recuperación incremental no puede atribuirse al método.' },
    pz: { tight: 'Con permeabilidades muy bajas la presión promedio no equilibra: p/z puede subestimar el gas original si se usa una presión no estabilizada.' },
    delgas: { tight: 'Presión al cuadrado es válida a baja presión; en tight gas a alta presión conviene pseudopresión (fuera de esta herramienta).', shale: 'Úsalo solo con datos estabilizados; el transitorio sesga n y C.' },
    bl: { secundaria: 'Con petróleo viscoso M es alto: el modelo 1D sobrestima el barrido real.', terciaria: 'Para polímero usá la herramienta Polímero vs agua.', offshore: 'Con pocos inyectores y espaciamiento grande, el barrido real suele ser menor que el del modelo 1D.' },
    hall: { secundaria: 'Cargá presión de fondo y no de cabeza si es posible: un cambio de pendiente indica daño o fractura.', terciaria: 'Con polímero la viscosidad cambia la presión de inyección: separá el efecto de la solución del daño.', offshore: 'Con pocos inyectores, el seguimiento de cada uno es crítico.' },
    vrr: { terciaria: 'Con gas o WAG cargá Gi con su Bg y verificá cada fase por separado.' },
    barrido: { terciaria: 'En EOR cambia E_D: usá el Sor medido para el agente y no el de la inyección de agua.' },
    polim: { terciaria: 'La viscosidad efectiva, la retención y la degradación a condiciones de reservorio deben venir de laboratorio.' },
    capil: { terciaria: 'Úsalo para estimar cuánta reducción de tensión interfacial requiere el surfactante.' },
    arpsmod: { shale: 'Fijá la declinación terminal con analogías de la cuenca y documentala.', tight: 'Útil cuando el pozo sale del transitorio hacia la frontera.', primaria: 'Con b alto la cola larga sobrestima: la declinación terminal la limita.' },
    duong: { shale: 'Requiere una pendiente clara de flujo lineal en q/Gp contra t (log–log).', tight: 'Sirve si el pozo mantiene flujo lineal; revisá R².' },
    shalegas: { shale: 'La isoterma de Langmuir debe medirse a la temperatura de reservorio; sin ella el resultado es de orden de magnitud.', tight: 'En tight gas el adsorbido suele ser pequeño: puede dejarse en cero.' },
    eaton: { offshore: 'Usá la sobrecarga calculada con el tirante de agua (herramienta Offshore) en lugar de 1 psi/ft.', shale: 'En shales sobrepresionados el sónico puede no seguir la tendencia por causas distintas a la subcompactación: verificá con mediciones directas.' },
    kill: { offshore: 'En pozos submarinos la línea de estrangulamiento (choke line) agrega pérdidas de fricción y cambia el procedimiento: esta planilla no las incluye.' },
    volpozo: { offshore: 'Sumá el volumen del riser y de las líneas de choke y kill al volumen anular y de sarta.' },
    co2: { terciaria: 'La inyección de CO₂ sube la pCO₂ y la corrosión en inyectores y productores: evaluá con agua presente.', offshore: 'En instalaciones sobre plataforma, cualquier cambio de composición del gas requiere recalcular.' },
    gasod: { shale: 'Líneas de recolección con caudal inicial alto y declinación rápida: dimensioná para el pico y verificá velocidad.' },
    comp: { terciaria: 'La compresión de gas de reinyección suele ser un costo relevante.', shale: 'Al caer la presión de cabeza, la compresión de baja presión gana peso en la vida del pozo.' },
    limeco: { shale: 'Aplicalo por pozo: vida corta y declinación alta hacen sensible el resultado al OPEX fijo.', tight: 'Aplicalo por pozo: el OPEX fijo define cuándo cerrar o intervenir.' },
    cartera: { shale: 'Programas de múltiples pozos con riesgo geológico bajo: el VME es un cálculo de portafolio de locaciones.', tight: 'Programas de múltiples pozos con riesgo geológico bajo: el VME es un cálculo de portafolio de locaciones.', offshore: 'El costo del pozo es alto: el presupuesto es la restricción principal.' },
    voi: { offshore: 'Con pozos costosos, pagar sísmica o un pozo de apreciación suele evaluarse con este cálculo.' }
  },
  /* ruta de trabajo en orden de uso: ids de estas herramientas o «c:» = calculadora de la plataforma H3L */
  rutas: {
    primaria: ['pvt', 'core', 'rocas', 'petro', 'petro2', 'gradiente', 'vol', 'c:OOIP', 'mbe', 'pz', 'dca', 'rta', 'horner', 'ptaderiv', 'c:IPR / VLP Nodal', 'limeco', 'agreg', 'concil'],
    secundaria: ['pvt', 'petro', 'petro2', 'rocas', 'gradiente', 'vol', 'mbe', 'barrido', 'bl', 'espac', 'vrr', 'hall', 'dca', 'rta', 'ptaderiv', 'limeco', 'concil'],
    terciaria: ['core', 'rocas', 'gradiente', 'vol', 'barrido', 'bl', 'polim', 'capil', 'vrr', 'hall', 'co2', 'tornU', 'limeco', 'cartera'],
    tight: ['core', 'rocas', 'petro', 'petro2', 'vol', 'delgas', 'horner', 'ptaderiv', 'arpsmod', 'duong', 'rta', 'espac', 'c:Proppant & Frac Design', 'limeco', 'agreg', 'cartera'],
    shale: ['ro', 'core', 'rocas', 'petro', 'petro2', 'shalegas', 'vol', 'arpsmod', 'duong', 'rta', 'espac', 'c:Proppant & Frac Design', 'gasod', 'limeco', 'agreg', 'tornU', 'cartera'],
    offshore: ['rose', 'sello', 'gradiente', 'vol', 'offshore', 'eaton', 'volpozo', 'kill', 'sep', 'gasod', 'comp', 'alivio', 'recip', 'co2', 'tornU', 'voi', 'cartera']
  }
};

/* H3L Global Energy — interfaz de las calculadoras paso a paso. Borrador pendiente de revisión técnica. */
(function () {
  'use strict';
  var C = window.H3LCalc;
  function $(s, r) { return (r || document).querySelector(s); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function fmt(x, d) {
    if (x === Infinity) return 'sin límite';
    if (x == null || typeof x !== 'number' || !isFinite(x)) return '—';
    return x.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: d == null ? 2 : d });
  }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  var num = C._util.num;

  /* ---------------- gráficos SVG ---------------- */
  function nice(min, max, n) {
    n = n || 5;
    if (!isFinite(min) || !isFinite(max)) { min = 0; max = 1; }
    if (min === max) { min -= 0.5; max += 0.5; }
    var raw = (max - min) / n, mag = Math.pow(10, Math.floor(Math.log10(raw))), m = raw / mag;
    var step = (m < 1.5 ? 1 : m < 3 ? 2 : m < 7 ? 5 : 10) * mag;
    var a = Math.floor(min / step + 1e-9) * step, b = Math.ceil(max / step - 1e-9) * step, t = [];
    for (var x = a; x <= b + step * 1e-6; x += step) t.push(+x.toPrecision(12));
    return { min: a, max: b, ticks: t };
  }
  function lineChart(o) {
    var W = o.w || 600, H = o.h || 300, m = { l: 58, r: 16, t: 14, b: 44 }, xs = [], ys = [];
    o.series.forEach(function (s) { s.pts.forEach(function (p) { xs.push(p[0]); ys.push(p[1]); }); });
    (o.hlines || []).forEach(function (l) { ys.push(l.y); });
    var X = nice(Math.min.apply(null, xs), Math.max.apply(null, xs)), Y = nice(Math.min.apply(null, ys), Math.max.apply(null, ys));
    function sx(x) { return m.l + ((o.invertX ? X.max - x : x - X.min) / (X.max - X.min)) * (W - m.l - m.r); }
    function sy(y) { return m.t + ((o.invertY ? y - Y.min : Y.max - y) / (Y.max - Y.min)) * (H - m.t - m.b); }
    var g = '';
    Y.ticks.forEach(function (t) { g += '<line class="grid" x1="' + m.l + '" x2="' + (W - m.r) + '" y1="' + sy(t) + '" y2="' + sy(t) + '"/><text class="tick" x="' + (m.l - 6) + '" y="' + (sy(t) + 4) + '" text-anchor="end">' + fmt(t, 4) + '</text>'; });
    X.ticks.forEach(function (t) { g += '<line class="grid" y1="' + m.t + '" y2="' + (H - m.b) + '" x1="' + sx(t) + '" x2="' + sx(t) + '"/><text class="tick" y="' + (H - m.b + 16) + '" x="' + sx(t) + '" text-anchor="middle">' + fmt(t, 4) + '</text>'; });
    (o.hlines || []).forEach(function (l) { g += '<line class="ref ' + (l.cls || '') + '" x1="' + m.l + '" x2="' + (W - m.r) + '" y1="' + sy(l.y) + '" y2="' + sy(l.y) + '"/><text class="tick ref-t" x="' + (W - m.r - 4) + '" y="' + (sy(l.y) - 4) + '" text-anchor="end">' + esc(l.label) + '</text>'; });
    o.series.forEach(function (s, i) {
      if (!s.nl) g += '<polyline class="ln s' + (s.c != null ? s.c : i) + '" fill="none" points="' + s.pts.map(function (p) { return sx(p[0]).toFixed(1) + ',' + sy(p[1]).toFixed(1); }).join(' ') + '"/>';
      if (s.pt) s.pts.forEach(function (p) { g += '<circle class="pt s' + (s.c != null ? s.c : i) + '" r="3" cx="' + sx(p[0]).toFixed(1) + '" cy="' + sy(p[1]).toFixed(1) + '"/>'; });
    });
    g += '<text class="axl" x="' + (m.l + (W - m.l - m.r) / 2) + '" y="' + (H - 6) + '" text-anchor="middle">' + esc(o.xl || '') + '</text>';
    g += '<text class="axl" transform="rotate(-90)" x="' + (-(m.t + (H - m.t - m.b) / 2)) + '" y="13" text-anchor="middle">' + esc(o.yl || '') + '</text>';
    var leg = o.series.length > 1 ? '<div class="leg">' + o.series.map(function (s, i) { return '<span><i class="sw s' + (s.c != null ? s.c : i) + '"></i>' + esc(s.nombre) + '</span>'; }).join('') + '</div>' : '';
    return '<figure class="chart"><svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + esc(o.alt || o.yl || 'gráfico') + '">' + g + '</svg>' + leg + '</figure>';
  }
  function histChart(hist, marks, xl) {
    var W = 600, H = 280, m = { l: 60, r: 16, t: 14, b: 44 }, x0 = hist[0].x0, x1 = hist[hist.length - 1].x1, cm = Math.max.apply(null, hist.map(function (h) { return h.c; }));
    var X = nice(x0, x1), Y = nice(0, cm, 4);
    function sx(x) { return m.l + (x - X.min) / (X.max - X.min) * (W - m.l - m.r); }
    function sy(y) { return m.t + (Y.max - y) / (Y.max - Y.min) * (H - m.t - m.b); }
    var g = '';
    Y.ticks.forEach(function (t) { g += '<line class="grid" x1="' + m.l + '" x2="' + (W - m.r) + '" y1="' + sy(t) + '" y2="' + sy(t) + '"/><text class="tick" x="' + (m.l - 6) + '" y="' + (sy(t) + 4) + '" text-anchor="end">' + fmt(t, 0) + '</text>'; });
    hist.forEach(function (h) { g += '<rect class="bar" x="' + (sx(h.x0) + 0.5) + '" y="' + sy(h.c) + '" width="' + Math.max(1, sx(h.x1) - sx(h.x0) - 1) + '" height="' + (sy(0) - sy(h.c)) + '"/>'; });
    X.ticks.forEach(function (t) { g += '<text class="tick" x="' + sx(t) + '" y="' + (H - m.b + 16) + '" text-anchor="middle">' + fmt(t, 3) + '</text>'; });
    marks.forEach(function (k, i) { g += '<line class="mk mk' + i + '" x1="' + sx(k.x) + '" x2="' + sx(k.x) + '" y1="' + m.t + '" y2="' + (H - m.b) + '"/><text class="mkt mk' + i + '" x="' + sx(k.x) + '" y="' + (m.t + 10 + (i % 2) * 12) + '" text-anchor="' + (i === 0 ? 'end' : 'start') + '" dx="' + (i === 0 ? -4 : 4) + '">' + esc(k.label) + '</text>'; });
    g += '<text class="axl" x="' + (m.l + (W - m.l - m.r) / 2) + '" y="' + (H - 6) + '" text-anchor="middle">' + esc(xl) + '</text><text class="axl" transform="rotate(-90)" x="' + (-(m.t + (H - m.t - m.b) / 2)) + '" y="12" text-anchor="middle">Iteraciones</text>';
    return '<figure class="chart"><svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Histograma de la distribución">' + g + '</svg></figure>';
  }
  function tornado(tor, unidad) {
    var f = tor.filas, W = 640, rowH = 30, m = { l: 140, r: 36, t: 26, b: 34 }, H = m.t + m.b + rowH * f.length;
    var lo = Math.min.apply(null, f.map(function (x) { return x.bajo; }).concat(tor.base)), hi = Math.max.apply(null, f.map(function (x) { return x.alto; }).concat(tor.base));
    var X = nice(lo, hi, 4);
    function sx(x) { return m.l + (x - X.min) / (X.max - X.min) * (W - m.l - m.r); }
    var g = '';
    X.ticks.forEach(function (t) { g += '<line class="grid" y1="' + m.t + '" y2="' + (H - m.b) + '" x1="' + sx(t) + '" x2="' + sx(t) + '"/><text class="tick" y="' + (H - m.b + 16) + '" x="' + sx(t) + '" text-anchor="middle">' + fmt(t, 1) + '</text>'; });
    f.forEach(function (r, i) {
      var y = m.t + i * rowH + 5;
      g += '<text class="tlab" x="' + (m.l - 8) + '" y="' + (y + 14) + '" text-anchor="end">' + esc(r.etiqueta) + '</text>';
      g += '<rect class="tneg" x="' + sx(r.bajo) + '" y="' + y + '" width="' + Math.max(0, sx(tor.base) - sx(r.bajo)) + '" height="20"/><rect class="tpos" x="' + sx(tor.base) + '" y="' + y + '" width="' + Math.max(0, sx(r.alto) - sx(tor.base)) + '" height="20"/>';
      g += '<text class="tick" x="' + (sx(r.bajo) - 4) + '" y="' + (y + 14) + '" text-anchor="end">' + fmt(r.bajo, 1) + '</text><text class="tick" x="' + (sx(r.alto) + 4) + '" y="' + (y + 14) + '">' + fmt(r.alto, 1) + '</text>';
    });
    g += '<line class="base" x1="' + sx(tor.base) + '" x2="' + sx(tor.base) + '" y1="' + (m.t - 4) + '" y2="' + (H - m.b) + '"/><text class="tick" x="' + sx(tor.base) + '" y="' + (m.t - 10) + '" text-anchor="middle">Base ' + fmt(tor.base, 1) + '</text>';
    g += '<text class="axl" x="' + (m.l + (W - m.l - m.r) / 2) + '" y="' + (H - 4) + '" text-anchor="middle">' + esc(unidad) + '</text>';
    return '<figure class="chart"><svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Diagrama tornado">' + g + '</svg><div class="leg"><span><i class="sw sneg"></i>Valor menor del indicador</span><span><i class="sw spos"></i>Valor mayor del indicador</span></div></figure>';
  }
  function hbars(items, max) {
    max = max || Math.max.apply(null, items.map(function (i) { return i.val; })) || 1;
    return '<div class="hb">' + items.map(function (i) { return '<div class="hbr"><span class="hbl">' + esc(i.label) + '</span><span class="hbt"><b class="' + (i.cls || '') + '" style="width:' + Math.max(0, Math.min(100, i.val / max * 100)).toFixed(1) + '%"></b></span><span class="hbv">' + esc(i.txt) + '</span></div>'; }).join('') + '</div>';
  }

  /* ---------------- bloques de resultado ---------------- */
  function kpi(l, v, u, cls) { return '<div class="kpi ' + (cls || '') + '"><span class="kl">' + esc(l) + '</span><span class="kv">' + v + (u ? ' <small>' + esc(u) + '</small>' : '') + '</span></div>'; }
  function kpis(arr) { return '<div class="kpis">' + arr.join('') + '</div>'; }
  function tabla(head, rows, cls) {
    return '<div class="tw"><table class="' + (cls || '') + '"><thead><tr>' + head.map(function (h) { return '<th>' + h + '</th>'; }).join('') + '</tr></thead><tbody>' + rows.map(function (r) { return '<tr>' + r.map(function (c) { return '<td>' + c + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>';
  }
  function calcBlock(items) {
    return '<details class="calc" open><summary>Cálculo paso a paso</summary><ol>' + items.map(function (i) { return '<li><b>' + esc(i[0]) + '</b><code>' + esc(i[1]) + '</code></li>'; }).join('') + '</ol></details>';
  }
  function nota(t) { return '<p class="nota">' + t + '</p>'; }
  function badge(t, c) { return '<span class="bd ' + c + '">' + esc(t) + '</span>'; }
  function h3(t) { return '<h3>' + esc(t) + '</h3>'; }
  function go(label, accion) { return '<button class="btn sec" data-act="' + accion + '">' + esc(label) + '</button>'; }

  /* ---------------- guías del método de Rose ---------------- */
  var BANDAS = [[0.9, 'Evidencia directa; riesgo residual mínimo (tope práctico 0,90–0,95)'], [0.7, 'Evidencia sólida con incertidumbre moderada'], [0.4, 'Evidencia parcial o apoyada en análogos'], [0.1, 'Poca evidencia; riesgo alto'], [0, 'Casi sin evidencia; requiere justificación sólida']];
  function banda(p) { for (var i = 0; i < BANDAS.length; i++) if (p >= BANDAS[i][0]) return BANDAS[i][1]; return ''; }
  var GUIA = {
    reservorio: { def: 'Probabilidad de que exista roca reservorio con porosidad y permeabilidad efectivas suficientes para almacenar y producir fluidos en el prospecto.', q: ['¿Hay pozos, afloramientos o facies sísmicas que muestren reservorio en este ambiente depositacional?', '¿La porosidad y la permeabilidad esperadas superan los valores mínimos para producir (cortes de la petrofísica)?', '¿Qué evidencia hay de que el reservorio no se acuña, no está cementado ni cambia de facies hacia el prospecto?'], herr: 'Petrofísica básica' },
    estructura: { def: 'Probabilidad de que la estructura o trampa mapeada exista con cierre real, considerando la calidad de los datos y la incertidumbre en profundidad.', q: ['¿Qué calidad tiene la sísmica (2D/3D, cobertura, migración) sobre el prospecto?', '¿La incertidumbre de la conversión tiempo-profundidad es menor que el cierre mapeado?', '¿Hay interpretaciones estructurales alternativas que eliminen el cierre?'], herr: 'Conversión tiempo-profundidad' },
    carga: { def: 'Probabilidad de que el sistema petrolero entregue hidrocarburos a la trampa: roca madre efectiva, madura, con migración conectada y en el momento oportuno.', q: ['¿Hay roca madre con COT e índice de hidrógeno suficientes y volumen efectivo?', '¿Alcanzó la madurez adecuada y generó antes de la formación de la trampa?', '¿Existe un camino de migración conectado (falla, discordancia, carrier) hasta el prospecto?', '¿Hay evidencias de hidrocarburos en la cuenca (manifestaciones, campos vecinos, DHI)?'], herr: 'Madurez de roca madre' },
    trampa: { def: 'Probabilidad de que la trampa tenga un sello efectivo y retenga los hidrocarburos hasta hoy (sello lateral y vertical, preservación).', q: ['¿El sello tiene espesor, continuidad y capacidad de sello demostrados (litología, presión capilar)?', '¿Las fallas son selladoras o conductivas para la columna esperada?', '¿Hubo reactivación, levantamiento, biodegradación o fuga posterior que comprometa la preservación?'], herr: null }
  };
  function pasoFactor(id, titulo) {
    var g = GUIA[id];
    return { titulo: titulo, intro: g.def, extra: function () { return '<div class="guia"><b>Preguntas para sustentar la probabilidad</b><ul>' + g.q.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' + (g.herr ? '<p>Herramienta de apoyo: <button class="lnk" data-act="goTool:' + (id === 'carga' ? 'ro' : id === 'estructura' ? 'tz' : 'petro') + '">' + esc(g.herr) + '</button></p>' : '') + '</div>'; },
      campos: [{ id: id, tipo: 'prob', label: 'Probabilidad de ' + titulo.toLowerCase(), def: { reservorio: '0.9', estructura: '0.8', carga: '0.9', trampa: '0.5' }[id], ayuda: 'Valor entre 0 y 1. Rose recomienda no superar 0,90–0,95 y documentar el razonamiento.' }, { id: 'just_' + id, tipo: 'texto', label: 'Justificación (qué evidencia sustenta este valor)', def: '', ayuda: 'Queda incluida en el resumen que se copia al final.' }] };
  }

  /* ---------------- herramientas ---------------- */
  var T = [];
  function tool(o) { T.push(o); }
  var num_ = function (id, label, unit, def, ayuda, extra) { var f = { id: id, tipo: 'num', label: label, unit: unit, def: String(def), ayuda: ayuda }; if (extra) for (var k in extra) f[k] = extra[k]; return f; };
  var sel_ = function (id, label, opts, def, ayuda) { return { id: id, tipo: 'sel', label: label, opts: opts, def: def, ayuda: ayuda }; };

  /* 1. Tiempo-profundidad */
  tool({
    id: 'tz', grupo: 'Exploración', nombre: 'Conversión tiempo-profundidad', etapas: 'V C', pregunta: '¿A qué profundidad está un horizonte sísmico mapeado en tiempo?',
    ficha: { metodo: 'Suma de espesores Δz = V_int · Δt / 2 (Δt es tiempo doble de viaje). Con V_rms se obtiene la velocidad intervalar con la ecuación de Dix: V_int² = (V₂²·t₂ − V₁²·t₁)/(t₂ − t₁).', fuente: 'Dix, C.H. (1955), Seismic velocities from surface measurements, Geophysics 20(1).', limites: ['Capas planas y horizontales, velocidad constante dentro de cada capa.', 'Dix pierde precisión con buzamientos fuertes o heterogeneidad lateral.', 'No reemplaza el modelo de velocidades de un proyecto de interpretación.'], unidades: 'Tiempo en ms (doble viaje), velocidad en m/s, profundidad en m.' },
    pasos: [
      { titulo: 'Modelo de velocidades', intro: 'Cargá las capas desde la superficie hacia abajo. Cada fila es la base de una capa, con su tiempo doble de viaje acumulado.', campos: [sel_('modo', 'Tipo de velocidad que tenés', [['int', 'Velocidad intervalar de cada capa'], ['rms', 'Velocidad RMS desde la superficie (se aplica Dix)']], 'int'), { id: 'filas', tipo: 'tabla', label: 'Capas', cols: [{ id: 't', label: 'TWT base', unit: 'ms' }, { id: 'v', label: 'Velocidad', unit: 'm/s' }], def: [{ t: 800, v: 2100 }, { t: 1400, v: 2800 }, { t: 1900, v: 3300 }] }] },
      { titulo: 'Horizonte a convertir', intro: 'Indicá el tiempo del horizonte. Si queda vacío, solo se calcula el perfil de capas.', campos: [num_('twtConsulta', 'Tiempo doble de viaje del horizonte', 'ms', 1650)] }
    ],
    calc: function (v) { return C.tiempoProfundidad(v); },
    render: function (r, v) {
      var out = kpis([kpi('Profundidad total del modelo', fmt(r.zTotal, 0), 'm'), kpi('Velocidad promedio', fmt(r.vpromTotal, 0), 'm/s')].concat(r.consulta ? [kpi('Profundidad del horizonte', fmt(r.consulta.z, 1), 'm', 'main'), kpi('Velocidad promedio al horizonte', fmt(r.consulta.vprom, 0), 'm/s')] : []));
      out += h3('Perfil por capa') + tabla(['Capa', 'TWT tope (ms)', 'TWT base (ms)', 'V intervalar (m/s)', 'Espesor (m)', 'Z base (m)'], r.capas.map(function (c) { return [c.n, fmt(c.tTope, 0), fmt(c.tBase, 0), fmt(c.vint, 0), fmt(c.espesor, 1), fmt(c.zBase, 1)]; }));
      var pts = [[0, 0]].concat(r.capas.map(function (c) { return [c.tBase, c.zBase]; }));
      out += lineChart({ series: [{ pts: pts, nombre: 'Curva t-z', pt: true }], xl: 'TWT (ms)', yl: 'Profundidad (m)', invertY: true });
      var c0 = r.capas[0], pasos = [['Espesor de la capa 1', 'Δz = V·Δt/2 = ' + fmt(c0.vint, 0) + ' × ' + fmt(c0.tBase / 1000, 3) + ' s / 2 = ' + fmt(c0.espesor, 1) + ' m']];
      if (v.modo === 'rms' && r.capas[1]) pasos.push(['Dix para la capa 2', 'V_int = √((V₂²·t₂ − V₁²·t₁)/(t₂ − t₁)) = ' + fmt(r.capas[1].vint, 1) + ' m/s']);
      if (r.consulta) pasos.push(['Horizonte a ' + fmt(r.consulta.twt, 0) + ' ms', 'Z = Z_base_capa − V_int · (t_base − t)/2 = ' + fmt(r.consulta.z, 1) + ' m']);
      return out + calcBlock(pasos);
    }
  });

  /* 2. Madurez de roca madre */
  tool({
    id: 'ro', grupo: 'Exploración', nombre: 'Madurez de roca madre', etapas: 'V C', pregunta: '¿Alcanzó la roca madre la madurez para generar hidrocarburos?',
    ficha: { metodo: 'Easy%Ro: cinética de 20 reacciones paralelas de primer orden (A = 10¹³ s⁻¹, Ea 34–72 kcal/mol). %Ro = exp(−1,6 + 3,7·F), donde F es la conversión acumulada. Rock-Eval: clasificación por COT, índice de hidrógeno (S2/COT) y Tmax.', fuente: 'Sweeney & Burnham (1990), AAPG Bulletin 74(10); Peters & Cassa (1994), AAPG Memoir 60.', limites: ['Historia térmica con gradiente constante y sin variaciones de flujo calórico.', 'Interpolación lineal de temperatura entre puntos; sin erosión explícita.', 'Debe calibrarse con Ro medido (vitrinita) cuando exista.', 'Con HI bajo (< 50) el Tmax no es confiable.'], unidades: 'Edad en Ma, temperatura en °C, profundidad en m, gradiente en °C/km.' },
    pasos: [
      { titulo: 'Datos Rock-Eval (opcional)', intro: 'Si tenés pirólisis de la roca madre, cargala. Si no, dejá vacío y pasá a la historia térmica.', campos: [num_('toc', 'Carbono orgánico total (COT)', '%', 3), num_('s2', 'S2', 'mg HC/g roca', 12), num_('tmax', 'Tmax', '°C', 438)] },
      { titulo: 'Historia térmica', intro: 'Cargá la historia de enterramiento del pasado hacia el presente (edades decrecientes).', campos: [sel_('modo', 'Dato de la historia', [['Z', 'Profundidad de la roca madre + gradiente'], ['T', 'Temperatura directa']], 'Z'), num_('ts', 'Temperatura en superficie', '°C', 15, null, { si: function (v) { return v.modo === 'Z'; } }), num_('grad', 'Gradiente geotérmico', '°C/km', 30, null, { si: function (v) { return v.modo === 'Z'; } }), { id: 'filas', tipo: 'tabla', label: 'Historia', cols: [{ id: 'edad', label: 'Edad', unit: 'Ma' }, { id: 'v', label: 'Profundidad o temperatura', unit: 'm / °C' }], def: [{ edad: 120, v: 0 }, { edad: 100, v: 1000 }, { edad: 60, v: 2200 }, { edad: 20, v: 3000 }, { edad: 0, v: 3200 }] }] }
    ],
    calc: function (v) { var r = C.easyRo(v); if (r.errores.length) return r; if (num(v.toc) > 0) { r.re = C.rockEval(v); if (r.re.errores && r.re.errores.length) { r.avisos.push(r.re.errores[0]); r.re = null; } } return r; },
    render: function (r) {
      var out = kpis([kpi('%Ro calculado', fmt(r.ro, 2), '%', 'main'), kpi('Ventana', esc(r.ventana)), kpi('Conversión del querógeno', fmt(r.avance, 0), '%'), kpi('Temperatura máxima', fmt(r.tMax, 0), '°C')]);
      if (r.re) out += h3('Rock-Eval') + kpis([kpi('Calidad (COT)', esc(r.re.calidad))].concat(r.re.hi != null ? [kpi('Índice de hidrógeno', fmt(r.re.hi, 0), 'mg HC/g COT'), kpi('Tipo de querógeno', esc(r.re.querogeno))] : []).concat(r.re.madurezTmax ? [kpi('Madurez por Tmax', esc(r.re.madurezTmax))] : []));
      out += h3('Evolución de la madurez') + lineChart({ series: [{ pts: r.curva.map(function (c) { return [c.edad, c.ro]; }), nombre: '%Ro', pt: true }], xl: 'Edad (Ma)', yl: '%Ro', invertX: true, hlines: [{ y: 0.6, label: 'inicio ventana de petróleo' }, { y: 1.35, label: 'fin de petróleo líquido' }] });
      out += tabla(['Edad (Ma)', 'T (°C)', '%Ro'], r.curva.map(function (c) { return [fmt(c.edad, 1), fmt(c.T, 0), fmt(c.ro, 2)]; }));
      out += nota('Referencia: &lt; 0,6 inmaduro · 0,6–0,9 petróleo · 0,9–1,35 petróleo liviano/condensado · &gt; 1,35 gas. Contrastá con %Ro medido si existe.');
      out += go('Usar como evidencia del factor Carga en Rose', 'goTool:rose:3');
      return out + calcBlock([['Cinética', 'f_i(t+Δt) = f_i(t) · exp(−A · exp(−Ea_i/(R·T)) · Δt), 20 reacciones'], ['Conversión', 'F = Σ w_i (1 − f_i) = ' + fmt(r.F, 3) + ' (máximo 0,85)'], ['Reflectancia', '%Ro = exp(−1,6 + 3,7 · ' + fmt(r.F, 3) + ') = ' + fmt(r.ro, 2)]]);
    }
  });

  /* 3. Rose */
  tool({
    id: 'rose', destacado: true, grupo: 'Exploración', nombre: 'Riesgo geológico del play (Pg) — método de Rose', etapas: 'V C D', pregunta: '¿Cuál es la probabilidad de éxito geológico y comercial del prospecto?',
    ficha: { metodo: 'Pg = P(reservorio) × P(estructura) × P(carga) × P(trampa sellada). Cada factor se asigna con evidencia documentada y se calibra con la tasa histórica de éxito. Chance comercial: Pcom = Pg × proporción de campos análogos con tamaño ≥ el mínimo comercial. Valor monetario esperado: VME = Pcom · VP_éxito − (1 − Pcom) · costo_de_fallo.', fuente: 'Rose, P.R. (2001), Risk Analysis in Petroleum Exploration, AAPG Methods in Exploration Series 12.', limites: ['Los factores se asumen independientes; en un play real suelen compartir riesgo (ver Actualización de Pg).', 'La proporción de análogos depende de que el conjunto de campos sea representativo y completo.', 'Las bandas de confianza de la guía son orientativas de H3L, no una tabla de Rose; deben calibrarse con la cuenca.', 'Rose recomienda no asignar 1,0 en exploración (tope práctico 0,90–0,95) y revisar sesgos sistemáticos de optimismo.'], unidades: 'Probabilidades en fracción (0–1). Tamaños en la misma unidad (p. ej. MMboe). Valores económicos en MM USD.' },
    pasos: [
      { titulo: 'Prospecto y contexto', intro: 'Identificá el prospecto y, si la conocés, la tasa histórica de éxito geológico del play: sirve para calibrar el Pg.', campos: [{ id: 'nombre', tipo: 'texto1', label: 'Prospecto / play', def: 'Prospecto A' }, num_('pgHist', 'Tasa histórica de éxito geológico del play (opcional)', 'fracción', 0.25, 'Por ejemplo, descubrimientos / pozos exploratorios del play.')] },
      pasoFactor('reservorio', 'Reservorio'), pasoFactor('estructura', 'Estructura'), pasoFactor('carga', 'Carga'), pasoFactor('trampa', 'Trampa sellada'),
      { titulo: 'Tamaño comercial y economía', intro: 'El tamaño mínimo comercial y los campos análogos convierten Pg en chance comercial; con los valores económicos se obtiene el VME.', campos: [num_('tamMin', 'Tamaño mínimo comercial', 'MMboe', 10), { id: 'analogos', tipo: 'tabla', label: 'Campos análogos (descubiertos en el play)', cols: [{ id: 'nombre', label: 'Campo', texto: true }, { id: 'tam', label: 'Reservas', unit: 'MMboe' }], def: [{ nombre: 'Campo 1', tam: 6 }, { nombre: 'Campo 2', tam: 14 }, { nombre: 'Campo 3', tam: 32 }, { nombre: 'Campo 4', tam: 95 }] }, num_('vpExito', 'Valor presente en caso de éxito', 'MM USD', 120), num_('costoFallo', 'Costo del pozo seco', 'MM USD', 25)] }
    ],
    calc: function (v) { return C.rose(v); },
    render: function (r, v) {
      var cum = 1, items = r.factores.map(function (f) { cum *= f.p; return { label: f.nombre, val: f.p * 100, txt: 'P = ' + fmt(f.p, 2) + ' → acumulado ' + fmt(cum, 3), cls: f.id === r.limitante.id ? 'warn' : '' }; });
      var out = kpis([kpi('Pg (éxito geológico)', fmt(r.pg, 3), '', 'main'), kpi('Factor limitante', esc(r.limitante.nombre) + ' (' + fmt(r.limitante.p, 2) + ')')].concat(r.pcom != null ? [kpi('Proporción de análogos ≥ mínimo', fmt(r.pec * 100, 0), '% (' + r.nOk + ' de ' + r.nAn + ')'), kpi('Chance comercial (Pcom)', fmt(r.pcom, 3), '', 'main')] : []).concat(r.emv != null ? [kpi('VME (' + r.baseVme + ')', fmt(r.emv, 1), 'MM USD', r.emv >= 0 ? 'ok' : 'bad')] : []));
      out += h3('Probabilidad de cada factor') + hbars(items, 100);
      out += h3('Factores y justificación') + tabla(['Factor', 'Probabilidad', 'Orientación de la banda', 'Justificación documentada'], r.factores.map(function (f) { var j = String(v['just_' + f.id] || '').trim(); return [esc(f.nombre), fmt(f.p, 2), esc(banda(f.p)), j ? esc(j) : badge('Sin justificar', 'bad')]; }));
      var sinJ = r.factores.filter(function (f) { return !String(v['just_' + f.id] || '').trim(); }).length;
      if (sinJ) out += nota('<b>Pendiente de documentar:</b> ' + sinJ + ' factor(es) sin justificación. Rose insiste en dejar por escrito el razonamiento de cada probabilidad antes de revisar el prospecto.');
      if (r.ratioHist != null) out += nota('<b>Calibración:</b> Pg del prospecto ' + fmt(r.pg * 100, 1) + ' % frente a una tasa histórica de ' + fmt(num(v.pgHist) * 100, 1) + ' % (relación ' + fmt(r.ratioHist, 2) + '×). Una relación muy superior a 1 requiere evidencia específica.');
      var lim = r.limitante, mejora = Math.min(0.95, lim.p + 0.1), pg2 = r.pg / lim.p * mejora;
      out += nota('<b>Sensibilidad:</b> si la evidencia permitiera subir «' + esc(lim.nombre) + '» de ' + fmt(lim.p, 2) + ' a ' + fmt(mejora, 2) + ', el Pg pasaría de ' + fmt(r.pg, 3) + ' a ' + fmt(pg2, 3) + '. Es el lugar donde más rinde reducir incertidumbre (más datos o más estudio).');
      out += '<div class="acts">' + go('Actualizar tras un pozo (Bayes)', 'rose2bayes') + go('Usar Pg en volumetría probabilística', 'usePg') + '</div>';
      var cs = [['Pg', r.factores.map(function (f) { return fmt(f.p, 2); }).join(' × ') + ' = ' + fmt(r.pg, 4)]];
      if (r.pcom != null) cs.push(['Pcom', 'Pg × (análogos ≥ ' + fmt(num(v.tamMin), 1) + ' / total) = ' + fmt(r.pg, 3) + ' × ' + r.nOk + '/' + r.nAn + ' = ' + fmt(r.pcom, 4)]);
      if (r.emv != null) { var pc = r.pcom != null ? r.pcom : r.pg; cs.push(['VME', fmt(pc, 3) + ' × ' + fmt(num(v.vpExito), 1) + ' − ' + fmt(1 - pc, 3) + ' × ' + fmt(num(v.costoFallo), 1) + ' = ' + fmt(r.emv, 2) + ' MM USD']); }
      return out + calcBlock(cs);
    }
  });

  /* 4. Bayes */
  function probs(prefix, defs) { return ['reservorio', 'estructura', 'carga', 'trampa'].map(function (k, i) { return { id: prefix + k, tipo: 'prob', label: C.roseFactores[i][1], def: String(defs[i]) }; }); }
  tool({
    id: 'bayes', grupo: 'Exploración', nombre: 'Actualización de Pg y recurso', etapas: 'C D', pregunta: '¿Cómo cambia la probabilidad del próximo prospecto después del resultado de un pozo?',
    ficha: { metodo: 'Cuando dos prospectos comparten un factor (por ejemplo la roca madre), el resultado del primer pozo actualiza ese factor. Si el pozo resulta seco: p′ = p·(1 − q)/(1 − p·q), con q = producto de los demás factores del pozo. Si descubre, el factor compartido pasa a 1.', fuente: 'Rose, P.R. (2001), AAPG Methods in Exploration 12 (riesgo dependiente entre prospectos); regla de Bayes.', limites: ['Solo se actualiza un factor compartido a la vez.', 'Se asume que el factor es exactamente el mismo evento en ambos prospectos.', 'Un descubrimiento lleva el factor a 1: en la práctica conviene limitarlo a 0,90–0,95.'], unidades: 'Probabilidades en fracción (0–1).' },
    pasos: [
      { titulo: 'Pozo perforado', intro: 'Probabilidades asignadas antes de perforar el primer pozo.', campos: probs('a_', [0.7, 0.8, 0.6, 0.7]) },
      { titulo: 'Próximo prospecto', intro: 'Probabilidades del prospecto que se evalúa a continuación. El factor compartido debe tener el mismo valor.', campos: probs('b_', [0.7, 0.7, 0.6, 0.6]) },
      { titulo: 'Resultado y factor compartido', intro: 'Elegí qué factor comparten y qué pasó en el pozo.', campos: [sel_('compartido', 'Factor compartido', [['carga', 'Carga'], ['reservorio', 'Reservorio'], ['estructura', 'Estructura'], ['trampa', 'Trampa sellada']], 'carga'), sel_('resultado', 'Resultado del pozo', [['seco', 'Seco'], ['descubrimiento', 'Descubrimiento']], 'seco'), num_('recursoMedio', 'Recurso medio del próximo prospecto (opcional)', 'MMboe', 40)] }
    ],
    calc: function (v) { return C.actualizarPg(v); },
    render: function (r, v) {
      var out = kpis([kpi('Factor compartido antes', fmt(r.prior, 3)), kpi('Factor compartido después', fmt(r.posterior, 3), '', 'main'), kpi('Pg del próximo prospecto antes', fmt(r.pgAntes, 3)), kpi('Pg del próximo prospecto después', fmt(r.pgDespues, 3), '', 'main')].concat(r.recAntes != null ? [kpi('Recurso riesgeado antes', fmt(r.recAntes, 2), 'MMboe'), kpi('Recurso riesgeado después', fmt(r.recDespues, 2), 'MMboe')] : []));
      out += hbars([{ label: 'Pg antes', val: r.pgAntes * 100, txt: fmt(r.pgAntes, 3) }, { label: 'Pg después', val: r.pgDespues * 100, txt: fmt(r.pgDespues, 3), cls: r.pgDespues >= r.pgAntes ? 'ok' : 'warn' }], 100);
      if (r.posterior > 0.95) out += nota('El factor quedó en ' + fmt(r.posterior, 2) + '. Considerá limitarlo a 0,90–0,95 si la evidencia no es concluyente.');
      return out + calcBlock([['q (otros factores del pozo)', 'q = ' + fmt(r.qOtros, 4)], ['Factor actualizado', v.resultado === 'seco' ? "p′ = p(1 − q)/(1 − p·q) = " + fmt(r.prior, 3) + ' × ' + fmt(1 - r.qOtros, 3) + ' / ' + fmt(1 - r.prior * r.qOtros, 3) + ' = ' + fmt(r.posterior, 4) : 'Descubrimiento: p′ = 1'], ['Pg del próximo', 'Pg′ = p′ × producto de los demás factores = ' + fmt(r.pgDespues, 4)]]);
    }
  });

  /* 5. Petrofísica */
  tool({
    id: 'petro', grupo: 'Desarrollo', nombre: 'Petrofísica básica', etapas: 'C D', pregunta: '¿Cuánto espesor útil tiene el reservorio y con qué porosidad y saturación?',
    ficha: { metodo: 'Porosidad por densidad φ = (ρma − ρb)/(ρma − ρf). Volumen de arcilla por GR (lineal o Larionov). Saturación de agua por Archie, Sw = [a·Rw/(φᵐ·Rt)]^(1/n), o Simandoux (n = 2). Se aplican cortes de φ, Vsh y Sw para el espesor neto.', fuente: 'Archie (1942); Simandoux (1963); Larionov (1969).', limites: ['Una sola curva de porosidad (densidad), sin corrección por arcilla ni gas.', 'Rw, a, m y n deben venir de agua de formación o de análisis especiales.', 'Los cortes dependen del campo y del criterio económico.', 'Es un cálculo de apoyo, no reemplaza una evaluación petrofísica completa.'], unidades: 'Profundidad en m, densidad en g/cc, GR en API, resistividad en ohm·m.' },
    pasos: [
      { titulo: 'Matriz y fluido', intro: 'Densidades para calcular porosidad. Referencias: arenisca 2,65 · caliza 2,71 · dolomía 2,87 g/cc.', campos: [num_('rhoMa', 'Densidad de matriz', 'g/cc', 2.65), num_('rhoF', 'Densidad del fluido', 'g/cc', 1.0)] },
      { titulo: 'Arcillosidad', intro: 'Líneas base del GR para estimar el volumen de arcilla.', campos: [num_('grMin', 'GR de arena limpia', 'API', 30), num_('grMax', 'GR de arcilla', 'API', 120), sel_('vshTipo', 'Relación Vsh', [['lineal', 'Lineal (IGR)'], ['larionov_t', 'Larionov, rocas terciarias'], ['larionov_o', 'Larionov, rocas antiguas']], 'lineal'), num_('rsh', 'Resistividad de la arcilla (Simandoux)', 'ohm·m', 4)] },
      { titulo: 'Saturación de agua', intro: 'Parámetros de Archie.', campos: [sel_('metodoSw', 'Modelo', [['archie', 'Archie'], ['simandoux', 'Simandoux (arenas arcillosas)']], 'archie'), num_('rw', 'Rw a temperatura de formación', 'ohm·m', 0.06), num_('a', 'a', '', 1), num_('m', 'm', '', 2), num_('n', 'n', '', 2)] },
      { titulo: 'Cortes', intro: 'Criterios para contar espesor neto productivo.', campos: [num_('phiC', 'Porosidad mínima', 'fracción', 0.08), num_('vshC', 'Vsh máximo', 'fracción', 0.4), num_('swC', 'Sw máxima', 'fracción', 0.6)] },
      { titulo: 'Perfil', intro: 'Cargá los puntos del perfil, de menor a mayor profundidad.', campos: [{ id: 'filas', tipo: 'tabla', label: 'Perfil', cols: [{ id: 'z', label: 'Prof.', unit: 'm' }, { id: 'gr', label: 'GR', unit: 'API' }, { id: 'rhob', label: 'RHOB', unit: 'g/cc' }, { id: 'rt', label: 'Rt', unit: 'ohm·m' }], def: [[2500, 95, 2.55, 3], [2501, 85, 2.5, 4], [2502, 45, 2.35, 18], [2503, 38, 2.3, 35], [2504, 35, 2.28, 42], [2505, 40, 2.31, 30], [2506, 55, 2.38, 12], [2507, 48, 2.4, 4], [2508, 40, 2.36, 2.5], [2509, 100, 2.6, 3]].map(function (a) { return { z: a[0], gr: a[1], rhob: a[2], rt: a[3] }; }) }] }
    ],
    calc: function (v) { return C.petrofisica(v); },
    render: function (r, v) {
      var out = kpis([kpi('Espesor bruto', fmt(r.hBruto, 1), 'm'), kpi('Espesor neto', fmt(r.hNeto, 1), 'm', 'main'), kpi('Neto/bruto', fmt(r.ng * 100, 0), '%'), kpi('Porosidad promedio', r.phiProm == null ? '—' : fmt(r.phiProm, 3)), kpi('Sw promedio', r.swProm == null ? '—' : fmt(r.swProm, 3)), kpi('Vsh promedio', r.vshProm == null ? '—' : fmt(r.vshProm, 3))]);
      if (r.hNeto === 0) out += nota('Ningún punto cumple los tres cortes. Revisá los cortes o los datos de entrada.');
      var tr = function (k, c, nombre, xl) { return lineChart({ w: 300, h: 260, series: [{ pts: r.filas.map(function (f) { return [f[k], f.z]; }), nombre: nombre, c: c }], xl: xl, yl: 'Profundidad (m)', invertY: true, alt: nombre }); };
      out += h3('Curvas calculadas') + '<div class="tracks">' + tr('phi', 0, 'Porosidad', 'φ') + tr('vsh', 1, 'Vsh', 'Vsh') + tr('sw', 2, 'Sw', 'Sw') + '</div>';
      out += tabla(['Prof. (m)', 'φ', 'Vsh', 'Sw', 'Neto'], r.filas.map(function (f) { return [fmt(f.z, 1), fmt(f.phi, 3), fmt(f.vsh, 3), fmt(f.sw, 3), f.pay ? badge('Sí', 'ok') : badge('No', 'mute')]; }));
      out += '<div class="acts">' + go('Llevar espesor, φ y Sw a volumetría', 'usePetro') + '</div>';
      var f0 = r.filas.filter(function (f) { return f.pay; })[0] || r.filas[0];
      return out + calcBlock([['Porosidad (punto ' + fmt(f0.z, 1) + ' m)', 'φ = (' + fmt(num(v.rhoMa), 2) + ' − ρb)/(' + fmt(num(v.rhoMa), 2) + ' − ' + fmt(num(v.rhoF), 2) + ') = ' + fmt(f0.phi, 3)], ['Arcilla', 'IGR = (GR − ' + fmt(num(v.grMin), 0) + ')/(' + fmt(num(v.grMax), 0) + ' − ' + fmt(num(v.grMin), 0) + ');  Vsh = ' + fmt(f0.vsh, 3)], ['Saturación', (v.metodoSw === 'simandoux' ? 'Simandoux' : 'Archie') + ' → Sw = ' + fmt(f0.sw, 3)], ['Espesor neto', 'Σ Δz donde φ ≥ ' + v.phiC + ', Vsh ≤ ' + v.vshC + ', Sw ≤ ' + v.swC + ' = ' + fmt(r.hNeto, 1) + ' m']]);
    }
  });

  /* 6. Volumetría */
  function distCampo(id, label, unit, d, a, b, c) { return { id: id, grupo: 'vars', tipo: 'dist', label: label, unit: unit, def: { d: d, a: String(a), b: String(b == null ? '' : b), c: String(c == null ? '' : c) } }; }
  tool({
    id: 'vol', grupo: 'Desarrollo', nombre: 'Volumetría probabilística', etapas: 'V C D', pregunta: '¿Cuánto hidrocarburo contiene y recuperará el reservorio, con su rango de incertidumbre?',
    ficha: { metodo: 'Petróleo: N = 7758·A·h·φ·(1 − Sw)/Bo. Gas: G = 43560·A·h·φ·(1 − Sw)/Bg, con Bg = 0,02827·z·T/p. Monte Carlo con variables independientes (fija, triangular o lognormal). P90, P50 y P10 son valores superados con 90, 50 y 10 % de probabilidad.', fuente: 'Ecuación volumétrica estándar de la industria; convención de recursos SPE-PRMS (P90/P50/P10).', limites: ['Variables independientes: no se considera la correlación (por ejemplo φ y Sw).', 'La suma de P50 de varios prospectos no es el P50 de la suma.', 'El resultado depende de las distribuciones de entrada: documentalas.', 'Para reservas certificadas se requiere el procedimiento corporativo (ver módulo de reservas).'], unidades: 'Área en acres, espesor en ft, Bo en rb/STB, presión en psia, temperatura en °F.' },
    pasos: [
      { titulo: 'Fluido', intro: 'Elegí el tipo de hidrocarburo.', campos: [sel_('tipo', 'Fluido', [['oil', 'Petróleo'], ['gas', 'Gas']], 'oil'), num_('presion', 'Presión de reservorio', 'psia', 3000, null, { si: function (v) { return v.tipo === 'gas'; } }), num_('temp', 'Temperatura de reservorio', '°F', 200, null, { si: function (v) { return v.tipo === 'gas'; } }), num_('z', 'Factor z', '', 0.9, null, { si: function (v) { return v.tipo === 'gas'; } })] },
      { titulo: 'Variables', intro: 'Para cada variable elegí fija, triangular (mínimo, más probable, máximo) o lognormal (P90 y P10).', campos: [distCampo('area', 'Área', 'acres', 'tri', 200, 400, 800), distCampo('h', 'Espesor neto', 'ft', 'tri', 20, 40, 70), distCampo('phi', 'Porosidad', 'fracción', 'tri', 0.1, 0.16, 0.22), distCampo('sw', 'Saturación de agua', 'fracción', 'tri', 0.2, 0.35, 0.5), Object.assign(distCampo('bo', 'Bo', 'rb/STB', 'fija', 1.25), { si: function (v) { return v.tipo !== 'gas'; } }), distCampo('rf', 'Factor de recuperación', 'fracción', 'tri', 0.15, 0.25, 0.35)] },
      { titulo: 'Simulación', intro: 'La semilla fija el resultado para poder reproducirlo en la revisión.', campos: [num_('n', 'Iteraciones', '', 10000), num_('semilla', 'Semilla', '', 12345), num_('pg', 'Pg del prospecto (opcional)', 'fracción', '', 'Si lo cargás, se calcula también la media riesgeada. Podés traerlo desde la herramienta de Rose.')] }
    ],
    calc: function (v) { return C.volumetriaMC(v); },
    render: function (r, v) {
      var u = r.unidad;
      var out = kpis([kpi('P90 recuperable', fmt(r.recup.p90, 2), u), kpi('P50', fmt(r.recup.p50, 2), u, 'main'), kpi('P10', fmt(r.recup.p10, 2), u), kpi('Media', fmt(r.recup.media, 2), u)].concat(r.mediaRiesgeada != null ? [kpi('Media riesgeada (× Pg ' + fmt(r.pg, 2) + ')', fmt(r.mediaRiesgeada, 2), u, 'main')] : []));
      out += h3('Distribución del recurso recuperable') + histChart(r.hist, [{ x: r.recup.p90, label: 'P90' }, { x: r.recup.p50, label: 'P50' }, { x: r.recup.p10, label: 'P10' }], 'Recuperable (' + u + ')');
      out += tabla(['', 'P90', 'P50', 'P10', 'Media'], [['In situ (' + (r.tipo === 'gas' ? 'Bcf' : 'MMSTB') + ')', fmt(r.inplace.p90, 2), fmt(r.inplace.p50, 2), fmt(r.inplace.p10, 2), fmt(r.inplace.media, 2)], ['Recuperable (' + u + ')', fmt(r.recup.p90, 2), fmt(r.recup.p50, 2), fmt(r.recup.p10, 2), fmt(r.recup.media, 2)]]);
      return out + calcBlock([['Ecuación', r.tipo === 'gas' ? 'G = 43560·A·h·φ·(1 − Sw)/Bg ;  Bg = 0,02827·z·T/p = ' + fmt(r.bg, 5) + ' rcf/scf' : 'N = 7758·A·h·φ·(1 − Sw)/Bo'], ['Simulación', fmt(r.n, 0) + ' iteraciones, semilla ' + v.semilla + '; variables independientes'], ['Percentiles', 'P90 = percentil 10 de la muestra; P10 = percentil 90']]);
    }
  });

  /* 7. Espaciamiento */
  tool({
    id: 'espac', grupo: 'Desarrollo', nombre: 'Espaciamiento y recuperación por pozo', etapas: 'D', pregunta: '¿Cuántos pozos entran en el área y cuánto debe recuperar cada uno para pagar?',
    ficha: { metodo: 'Petróleo original por acre = 7758·h·φ·(1 − Sw)/Bo. EUR por pozo = OOIP/acre × FR × acres por pozo. Radio equivalente r = √(A·43560/π). EUR mínimo = costo del pozo / margen por barril.', fuente: 'Balance volumétrico estándar; criterio de EUR mínimo de pago simple.', limites: ['Drenaje completo y sin interferencia entre pozos.', 'EUR mínimo sin descuento ni costos operativos fijos.', 'No sustituye simulación ni análisis de declinación.'], unidades: 'Área en acres, espesor en ft, costo en MM USD, margen en USD/bbl, largo lateral en ft.' },
    pasos: [
      { titulo: 'Reservorio', intro: 'Propiedades promedio del área a desarrollar.', campos: [num_('area', 'Área a desarrollar', 'acres', 640), num_('h', 'Espesor neto', 'ft', 50), num_('phi', 'Porosidad', 'fracción', 0.2), num_('sw', 'Sw', 'fracción', 0.3), num_('bo', 'Bo', 'rb/STB', 1.2), num_('rf', 'Factor de recuperación', 'fracción', 0.25)] },
      { titulo: 'Espaciamientos a evaluar', intro: 'Probá varias opciones para comparar.', campos: [sel_('modo', 'Tipo de pozo', [['ac', 'Vertical (acres por pozo)'], ['hz', 'Horizontal (separación entre laterales, ft)']], 'ac'), num_('lateral', 'Largo de rama lateral', 'ft', 5000, null, { si: function (v) { return v.modo === 'hz'; } }), { id: 'lista', tipo: 'tabla', label: 'Opciones', cols: [{ id: 'val', label: 'Valor', unit: 'acres/pozo o ft' }], def: [{ val: 40 }, { val: 80 }, { val: 160 }] }] },
      { titulo: 'Economía mínima', intro: 'Con estos dos datos se calcula el EUR que cada pozo necesita para pagarse.', campos: [num_('costoPozo', 'Costo del pozo', 'MM USD', 5), num_('margen', 'Margen por barril', 'USD/bbl', 20)] }
    ],
    calc: function (v) { return C.espaciamiento(v); },
    render: function (r) {
      var out = kpis([kpi('OOIP por acre', fmt(r.ooipAc, 0), 'STB/acre'), kpi('Recuperable por acre', fmt(r.recAc, 0), 'STB/acre')].concat(r.eurMin != null ? [kpi('EUR mínimo para pagar', fmt(r.eurMin, 0), 'STB', 'main')] : []));
      out += tabla(['Opción', 'Acres/pozo', 'Radio eq. (ft)', 'Pozos', 'EUR/pozo (STB)', 'Recup. total (MMSTB)', 'Paga'], r.filas.map(function (f) { return [fmt(f.valor, 0), fmt(f.acresPozo, 1), fmt(f.radio, 0), f.pozos, fmt(f.eurPozo, 0), fmt(f.recTotal / 1e6, 2), f.economico == null ? '—' : f.economico ? badge('Sí', 'ok') : badge('No', 'bad')]; }));
      out += hbars(r.filas.map(function (f) { return { label: fmt(f.acresPozo, 0) + ' ac/pozo', val: f.eurPozo, txt: fmt(f.eurPozo / 1000, 0) + ' MSTB', cls: f.economico === false ? 'bad' : 'ok' }; }), Math.max(r.eurMin || 0, Math.max.apply(null, r.filas.map(function (f) { return f.eurPozo; }))));
      return out + calcBlock([['OOIP/acre', '7758 × h × φ × (1 − Sw)/Bo = ' + fmt(r.ooipAc, 0) + ' STB/acre'], ['EUR por pozo', 'OOIP/acre × FR × acres por pozo'], ['EUR mínimo', r.eurMin != null ? 'costo / margen = ' + fmt(r.eurMin, 0) + ' STB' : 'no calculado']]);
    }
  });

  /* 8. NPT */
  tool({
    id: 'npt', grupo: 'Perforación', nombre: 'Análisis de NPT y curva tiempo-profundidad', etapas: 'D E', pregunta: '¿Cuánto tiempo perdimos frente al plan y por qué causas?',
    ficha: { metodo: 'Compara la curva real contra la planificada a igual profundidad. NPT % = horas de NPT / horas totales. Tiempo perdido invisible (ILT) = (días reales − NPT) − días planificados. Pareto de causas de NPT.', fuente: 'Prácticas de análisis de desempeño de perforación (IADC / operadoras).', limites: ['La categorización de eventos la define el usuario; deben ser mutuamente excluyentes.', 'El plan se interpola linealmente entre puntos.', 'No separa conexiones, viajes o tiempos de rotación.'], unidades: 'Días y profundidad (m). Horas de NPT por evento.' },
    pasos: [
      { titulo: 'Curva planificada', intro: 'Puntos (día, profundidad) del programa de perforación.', campos: [{ id: 'plan', tipo: 'tabla', label: 'Plan', cols: [{ id: 'dia', label: 'Día' }, { id: 'prof', label: 'Profundidad', unit: 'm' }], def: [[0, 0], [3, 300], [8, 1500], [14, 2800], [20, 3500]].map(function (a) { return { dia: a[0], prof: a[1] }; }) }] },
      { titulo: 'Curva real', intro: 'Puntos reales del reporte diario.', campos: [{ id: 'real', tipo: 'tabla', label: 'Real', cols: [{ id: 'dia', label: 'Día' }, { id: 'prof', label: 'Profundidad', unit: 'm' }], def: [[0, 0], [3.5, 300], [10, 1500], [19, 2800], [27, 3500]].map(function (a) { return { dia: a[0], prof: a[1] }; }) }] },
      { titulo: 'Eventos de NPT', intro: 'Una fila por evento, con su categoría y horas.', campos: [{ id: 'eventos', tipo: 'tabla', label: 'Eventos', cols: [{ id: 'cat', label: 'Categoría', texto: true }, { id: 'h', label: 'Horas', unit: 'h' }], def: [['Falla de equipo', 36], ['Pérdida de circulación', 52], ['Aprisionamiento', 30], ['Esperas por clima', 12], ['Falla de equipo', 20]].map(function (a) { return { cat: a[0], h: a[1] }; }) }, num_('costoDia', 'Costo diario del equipo (opcional)', 'miles USD/día', 120)] }
    ],
    calc: function (v) { return C.analisisNPT(v); },
    render: function (r, v) {
      var out = kpis([kpi('Días reales', fmt(r.diasReal, 1), 'd'), kpi('Días planificados a igual profundidad', fmt(r.diasPlan, 1), 'd'), kpi('Desvío', fmt(r.desvio, 1), 'd', r.desvio > 0 ? 'bad' : 'ok'), kpi('NPT', fmt(r.nptH, 0) + ' h (' + fmt(r.nptPct, 1) + ' %)', '', 'main'), kpi('Tiempo perdido invisible', fmt(r.ilt, 1), 'd'), kpi('Velocidad media', fmt(r.rop, 0), 'm/d')].concat(r.costoNPT != null ? [kpi('Costo del NPT', fmt(r.costoNPT, 0), 'miles USD')] : []));
      out += lineChart({ series: [{ pts: r.seriePlan.map(function (p) { return [p.d, p.z]; }), nombre: 'Plan' }, { pts: r.serieReal.map(function (p) { return [p.d, p.z]; }), nombre: 'Real', pt: true }], xl: 'Días', yl: 'Profundidad (m)', invertY: true });
      out += h3('Pareto de NPT por causa') + hbars(r.cats.map(function (c) { return { label: c.cat, val: c.h, txt: fmt(c.h, 0) + ' h · ' + fmt(c.pct, 0) + ' % (acum. ' + fmt(c.acum, 0) + ' %)' }; }));
      out += h3('Desvío por hito de profundidad') + tabla(['Profundidad (m)', 'Día real', 'Día plan', 'Desvío (d)'], r.hitos.map(function (h) { return [fmt(h.z, 0), fmt(h.real, 1), fmt(h.plan, 1), fmt(h.delta, 1)]; }));
      return out + calcBlock([['NPT %', fmt(r.nptH, 1) + ' h / (' + fmt(r.diasReal, 1) + ' d × 24) = ' + fmt(r.nptPct, 1) + ' %'], ['ILT', '(días reales − NPT) − días plan = (' + fmt(r.diasReal, 1) + ' − ' + fmt(r.nptDias, 1) + ') − ' + fmt(r.diasPlan, 1) + ' = ' + fmt(r.ilt, 1) + ' d']]);
    }
  });

  /* 9. Corrosión */
  tool({
    id: 'corr', grupo: 'Integridad', nombre: 'Velocidad de corrosión y vida remanente', etapas: 'E', pregunta: '¿Cuánta vida le queda al equipo o cañería y cuándo hay que inspeccionarlo?',
    ficha: { metodo: 'CR largo plazo = (t_inicial − t_actual)/años de servicio; CR corto plazo = (t_previo − t_actual)/años entre mediciones. Vida remanente = (t_actual − t_mínimo)/CR. Próxima inspección ≤ ½ vida remanente y ≤ el intervalo máximo. t_mín de cañería (B31.3): PD/(2(SEW + PY)) + sobreespesor.', fuente: 'API 570 / API 510 (cálculo de vida remanente); ASME B31.3 ec. 3a.', limites: ['Corrosión uniforme; no cubre picaduras, fisuración ni degradación localizada.', 'Una sola medición o un mínimo representativo de la zona crítica.', 'Presión y esfuerzo admisible deben estar en la misma unidad (MPa).', 'Si el espesor actual ≤ mínimo, requiere evaluación de aptitud para el servicio.'], unidades: 'Espesores en mm, velocidad en mm/año, presión y esfuerzo en MPa, diámetro en mm.' },
    pasos: [
      { titulo: 'Espesores medidos', intro: 'Mediciones con ultrasonido en el punto más crítico.', campos: [num_('tIni', 'Espesor inicial (nominal o de construcción)', 'mm', 12.7), num_('anosTotal', 'Años en servicio', 'años', 10), num_('tPrev', 'Espesor de la medición previa (opcional)', 'mm', 10), num_('anosInt', 'Años entre la medición previa y la actual', 'años', 4), num_('tAct', 'Espesor actual', 'mm', 8.5)] },
      { titulo: 'Espesor mínimo requerido', intro: 'Ingresalo si lo tenés o calculalo con la ecuación de B31.3.', campos: [sel_('tminModo', 'Espesor mínimo', [['dato', 'Lo ingreso directamente'], ['calc', 'Calcular con B31.3 (cañería)']], 'dato'), num_('tMin', 'Espesor mínimo', 'mm', 6, null, { si: function (v) { return v.tminModo !== 'calc'; } }), num_('P', 'Presión de diseño', 'MPa', 4.1, null, { si: function (v) { return v.tminModo === 'calc'; } }), num_('D', 'Diámetro exterior', 'mm', 168.3, null, { si: function (v) { return v.tminModo === 'calc'; } }), num_('S', 'Esfuerzo admisible', 'MPa', 138, null, { si: function (v) { return v.tminModo === 'calc'; } }), num_('E', 'Factor de calidad de junta', '', 1, null, { si: function (v) { return v.tminModo === 'calc'; } }), num_('W', 'Factor de resistencia de soldadura', '', 1, null, { si: function (v) { return v.tminModo === 'calc'; } }), num_('Y', 'Coeficiente Y', '', 0.4, null, { si: function (v) { return v.tminModo === 'calc'; } }), num_('ca', 'Sobreespesor por corrosión', 'mm', 1.5, null, { si: function (v) { return v.tminModo === 'calc'; } })] },
      { titulo: 'Criterio', intro: 'Qué velocidad de corrosión usar y el máximo intervalo permitido por la norma o la política de la empresa.', campos: [sel_('criterio', 'Velocidad de corrosión', [['max', 'La mayor entre largo y corto plazo (conservador)'], ['LT', 'Largo plazo'], ['ST', 'Corto plazo']], 'max'), num_('intMax', 'Intervalo máximo de inspección', 'años', 5)] }
    ],
    calc: function (v) {
      var w = Object.assign({}, v), tm = null;
      if (v.tminModo === 'calc') { tm = C.tMinB313(v); if (tm.errores.length) return tm; w.tMin = String(tm.tConCA); }
      var r = C.corrosion(w); if (r.errores && r.errores.length) return r; r.tm = tm; r.tMinUsado = num(w.tMin); r.tAct = num(v.tAct); return r;
    },
    render: function (r) {
      var out = kpis([kpi('Velocidad largo plazo', fmt(r.crLT, 3), 'mm/año'), kpi('Velocidad corto plazo', r.crST == null ? '—' : fmt(r.crST, 3), 'mm/año'), kpi('Velocidad adoptada', fmt(r.cr, 3), 'mm/año (' + fmt(r.mpy, 1) + ' mpy)'), kpi('Vida remanente', fmt(r.vr, 1), 'años', 'main'), kpi('Próxima inspección', fmt(r.proxima, 1), 'años', 'main'), kpi('Margen sobre el mínimo', fmt(r.margen, 2), 'mm')]);
      if (r.cr > 0 && isFinite(r.vr)) { var yrs = Math.ceil(r.vr * 1.2), pts = []; for (var y = 0; y <= yrs; y += Math.max(0.1, yrs / 30)) pts.push([y, Math.max(0, r.tAct - r.cr * y)]); out += lineChart({ series: [{ pts: pts, nombre: 'Espesor proyectado' }], hlines: [{ y: r.tMinUsado, label: 't mínimo', cls: 'bad' }], xl: 'Años desde hoy', yl: 'Espesor (mm)' }); }
      var pasos = []; if (r.tm) pasos.push(['Espesor mínimo (B31.3)', 't = P·D/(2(S·E·W + P·Y)) = ' + fmt(r.tm.t, 2) + ' mm; con sobreespesor ' + fmt(r.tm.tConCA, 2) + ' mm']);
      pasos.push(['Velocidad de corrosión', 'CR = (t_ini − t_act)/años = ' + fmt(r.crLT, 3) + ' mm/año' + (r.crST != null ? ' ; corto plazo ' + fmt(r.crST, 3) : '') + ' → se usa ' + r.base], ['Vida remanente', 'VR = (t_act − t_mín)/CR = ' + fmt(r.margen, 2) + ' / ' + fmt(r.cr, 3) + ' = ' + fmt(r.vr, 1) + ' años'], ['Próxima inspección', 'mín(½ × VR, intervalo máximo) = ' + fmt(r.proxima, 1) + ' años']);
      return out + calcBlock(pasos);
    }
  });

  /* 10. RBI */
  tool({
    id: 'rbi', grupo: 'Integridad', nombre: 'Intervalos de inspección (RBI cualitativo)', etapas: 'E', pregunta: '¿Qué componentes inspeccionar primero y cada cuánto?',
    ficha: { metodo: 'Riesgo = probabilidad de falla (PoF) × consecuencia (CoF), ambas en escala 1–5. Niveles: Bajo ≤ 4, Medio 5–9, Medio-alto 10–15, Alto ≥ 16. Cada nivel tiene un intervalo base editable; si se conoce la vida remanente, el intervalo no supera su mitad.', fuente: 'API RP 580 (RBI cualitativo); API 570/510 para el límite de ½ vida remanente.', limites: ['Matriz cualitativa de apoyo; no reemplaza RBI cuantitativo (API 581).', 'Los intervalos por nivel son valores de ejemplo: definilos con la política de integridad de la empresa.', 'PoF y CoF requieren criterio documentado (mecanismos de daño, inventario, entorno).'], unidades: 'PoF y CoF enteros de 1 a 5. Intervalos en años.' },
    pasos: [
      { titulo: 'Componentes', intro: 'PoF y CoF de 1 (muy baja) a 5 (muy alta). La vida remanente es opcional.', campos: [{ id: 'filas', tipo: 'tabla', label: 'Componentes', cols: [{ id: 'nombre', label: 'Componente', texto: true }, { id: 'pof', label: 'PoF (1–5)' }, { id: 'cof', label: 'CoF (1–5)' }, { id: 'vr', label: 'Vida remanente', unit: 'años' }], def: [['Línea de producción 6"', 4, 4, 6], ['Separador de prueba', 3, 5, 12], ['Tanque de agua', 2, 3, ''], ['Línea de gas 4"', 3, 4, 3], ['Bomba de transferencia', 2, 2, '']].map(function (a) { return { nombre: a[0], pof: a[1], cof: a[2], vr: a[3] }; }) }] },
      { titulo: 'Intervalos por nivel', intro: 'Valores de ejemplo; ajustalos a la política de la empresa.', campos: [num_('ivBajo', 'Riesgo bajo', 'años', 10), num_('ivMedio', 'Riesgo medio', 'años', 5), num_('ivMA', 'Riesgo medio-alto', 'años', 3), num_('ivAlto', 'Riesgo alto', 'años', 1)] }
    ],
    calc: function (v) { return C.rbi(v); },
    render: function (r) {
      var cls = { 'Bajo': 'ok', 'Medio': 'warnb', 'Medio-alto': 'warn2', 'Alto': 'bad' };
      var out = tabla(['Componente', 'PoF', 'CoF', 'Riesgo', 'Nivel', 'Intervalo (años)', 'Limitado por'], r.filas.map(function (f) { return [esc(f.nombre), f.pof, f.cof, f.score, badge(f.nivel, cls[f.nivel]), '<b>' + fmt(f.intervalo, 1) + '</b>', esc(f.limitaPor)]; }));
      var m = '<div class="mx"><span></span>'; for (var c = 1; c <= 5; c++) m += '<span class="mh">CoF ' + c + '</span>';
      for (var p = 5; p >= 1; p--) { m += '<span class="mh">PoF ' + p + '</span>'; for (var c2 = 1; c2 <= 5; c2++) { var s = p * c2, n = s >= 16 ? 'Alto' : s >= 10 ? 'Medio-alto' : s >= 5 ? 'Medio' : 'Bajo'; var here = r.filas.filter(function (f) { return f.pof === p && f.cof === c2; }).map(function (f) { return '<i title="' + esc(f.nombre) + '">' + (r.filas.indexOf(f) + 1) + '</i>'; }).join(''); m += '<span class="mc ' + cls[n] + '">' + here + '</span>'; } }
      m += '</div>';
      return out + h3('Matriz de riesgo') + m + nota('Los números en la matriz indican la posición de cada componente, en el orden de la tabla.') + calcBlock([['Riesgo', 'PoF × CoF'], ['Nivel', 'Bajo ≤ 4 · Medio 5–9 · Medio-alto 10–15 · Alto ≥ 16'], ['Intervalo', 'mín(intervalo del nivel, ½ vida remanente)']]);
    }
  });

  /* 11. Separador y tanque */
  tool({
    id: 'sep', grupo: 'Superficie', nombre: 'Dimensionamiento de separadores y tanques', etapas: 'C D', pregunta: '¿Qué tamaño de separador vertical y de tanque necesito?',
    ficha: { metodo: 'Separador vertical bifásico: velocidad terminal de Souders-Brown V_t = K·√((ρL − ρg)/ρg); diámetro por capacidad de gas; altura de líquido por tiempo de retención. Densidad del gas ρg = 2,7·γg·P/(Z·T). Tanque: volumen nominal = caudal × días / factor de llenado; diámetro para una altura dada.', fuente: 'Souders & Brown (1934); GPSA Engineering Data Book, sección de separación; API 650 para el diseño mecánico del tanque.', limites: ['Dimensionamiento preliminar de capacidad de gas y retención de líquido; no cubre coalescencia, espuma ni arrastre de sólidos.', 'K depende del tipo de extractor de niebla: tomalo del estándar de la empresa.', 'Los diámetros estándar considerados son de 24 a 120 in.', 'No reemplaza la especificación del proveedor ni el diseño mecánico.'], unidades: 'Gas en MMscf/d, P en psia, T en °F, densidad en lb/ft³, K en ft/s, caudales en bbl/d.' },
    pasos: [
      { titulo: 'Gas', intro: 'Condiciones de operación del separador.', campos: [num_('qg', 'Caudal de gas', 'MMscf/d', 10), num_('sg', 'Densidad relativa del gas', '(aire = 1)', 0.65), num_('P', 'Presión de operación', 'psia', 500), num_('T', 'Temperatura de operación', '°F', 100), num_('Z', 'Factor z', '', 0.9)] },
      { titulo: 'Líquido y diseño', intro: 'Caudales de líquido, retención y sección de gas.', campos: [num_('rhoL', 'Densidad del líquido', 'lb/ft³', 50), num_('K', 'Constante K de Souders-Brown', 'ft/s', 0.12, 'Típico 0,12–0,35 ft/s según extractor de niebla.'), num_('qo', 'Caudal de petróleo', 'bbl/d', 3000), num_('qw', 'Caudal de agua', 'bbl/d', 0), num_('tret', 'Tiempo de retención', 'min', 3), num_('hGas', 'Altura de la sección de gas', 'ft', 5)] },
      { titulo: 'Tanque de almacenamiento (opcional)', intro: 'Dejá el caudal vacío si no necesitás el tanque.', campos: [num_('q', 'Caudal a almacenar', 'bbl/d', 1000), num_('dias', 'Días de almacenamiento', 'días', 3), num_('ff', 'Factor de llenado útil', 'fracción', 0.8), { id: 'alturas', tipo: 'tabla', label: 'Alturas a evaluar', cols: [{ id: 'h', label: 'Altura de pared', unit: 'ft' }], def: [{ h: 24 }, { h: 32 }, { h: 40 }] }] }
    ],
    calc: function (v) { var s = C.separadorVertical(v); if (s.errores.length) return s; if (num(v.q) > 0) s.tk = C.tanque(v); return s; },
    render: function (r) {
      var out = kpis([kpi('Densidad del gas', fmt(r.rhoG, 2), 'lb/ft³'), kpi('Velocidad terminal', fmt(r.vt, 2), 'ft/s'), kpi('Diámetro mínimo', fmt(r.dMin, 1), 'in'), kpi('Diámetro estándar', fmt(r.dStd, 0), 'in', 'main'), kpi('Altura de líquido', fmt(r.hLiq, 1), 'ft'), kpi('Altura total costura a costura', fmt(r.hTot, 1), 'ft', 'main'), kpi('Relación altura/diámetro', fmt(r.esbeltez, 1), '')]);
      var D = r.dStd / 12, sc = 150 / Math.max(r.hTot, D * 1.2), w = D * sc, hh = r.hTot * sc, hl = r.hLiq * sc;
      out += '<figure class="chart"><svg viewBox="0 0 400 ' + (hh + 40) + '" role="img" aria-label="Esquema del separador"><rect class="vg" x="' + (200 - w / 2) + '" y="20" width="' + w + '" height="' + (hh - hl) + '"/><rect class="vl" x="' + (200 - w / 2) + '" y="' + (20 + hh - hl) + '" width="' + w + '" height="' + hl + '"/><rect class="vs" x="' + (200 - w / 2) + '" y="20" width="' + w + '" height="' + hh + '" fill="none"/><text class="tick" x="' + (200 + w / 2 + 8) + '" y="' + (20 + (hh - hl) / 2) + '">Gas ' + fmt(num(r.hTot - r.hLiq), 1) + ' ft</text><text class="tick" x="' + (200 + w / 2 + 8) + '" y="' + (20 + hh - hl / 2) + '">Líquido ' + fmt(r.hLiq, 1) + ' ft</text><text class="tick" x="200" y="' + (hh + 36) + '" text-anchor="middle">Ø ' + fmt(r.dStd, 0) + ' in</text></svg></figure>';
      if (r.tk) { out += h3('Tanque de almacenamiento') + kpis([kpi('Volumen nominal', fmt(r.tk.vNom, 0), 'bbl (' + fmt(r.tk.vNomM3, 0) + ' m³)', 'main')]) + tabla(['Altura (ft)', 'Diámetro (ft)', 'Volumen (bbl)'], r.tk.filas.map(function (f) { return [fmt(f.h, 0), fmt(f.d, 1), fmt(f.vol, 0)]; })); }
      return out + calcBlock([['ρg', '2,7 · γg · P/(Z·T) = ' + fmt(r.rhoG, 3) + ' lb/ft³'], ['V_t', 'K·√((ρL − ρg)/ρg) = ' + fmt(r.vt, 3) + ' ft/s'], ['Caudal real de gas', fmt(r.qAct, 3) + ' ft³/s → área = Q/V_t = ' + fmt(r.area, 2) + ' ft² → D mín = ' + fmt(r.dMin, 1) + ' in'], ['Volumen de líquido', 'Q·t_ret = ' + fmt(r.volLiq, 1) + ' ft³ → h = V/A = ' + fmt(r.hLiq, 2) + ' ft']]);
    }
  });

  /* 12. Hidráulica */
  tool({
    id: 'linea', grupo: 'Superficie', nombre: 'Hidráulica de líneas de flujo', etapas: 'C D', pregunta: '¿Qué pérdida de presión y velocidad tendrá una línea de líquido y qué diámetro conviene?',
    ficha: { metodo: 'Re = 1488·ρ·v·D/μ. Factor de fricción de Swamee-Jain (turbulento) o 64/Re (laminar). ΔP_fricción = f·(L/D)·ρ·v²/(2·gc). Velocidad erosional según API RP 14E: Ve = C/√ρ. Se comparan diámetros de tubería sch 40.', fuente: 'Swamee & Jain (1976); API RP 14E; ecuación de Darcy-Weisbach.', limites: ['Solo líquido monofásico incompresible; no usar para gas ni flujo multifásico.', 'Sin accesorios ni longitudes equivalentes (sumalas a la longitud).', 'API 14E es una guía conservadora; el valor de C lo define la empresa.'], unidades: 'Caudal en bbl/d, densidad en lb/ft³, viscosidad en cP, diámetro interno en in, longitud en ft, presión en psi.' },
    pasos: [
      { titulo: 'Fluido', intro: 'Propiedades a condiciones de operación.', campos: [num_('q', 'Caudal', 'bbl/d', 10000), num_('rho', 'Densidad', 'lb/ft³', 62.4), num_('mu', 'Viscosidad', 'cP', 1)] },
      { titulo: 'Línea', intro: 'Tubería existente o la que querés verificar.', campos: [num_('id', 'Diámetro interno', 'in', 4.026), num_('L', 'Longitud', 'ft', 5000), num_('eps', 'Rugosidad absoluta', 'in', 0.0018), num_('dz', 'Diferencia de cota (subida +)', 'ft', 0), num_('Pin', 'Presión de entrada (opcional)', 'psi', 150)] },
      { titulo: 'Criterio de velocidad', intro: 'Coeficiente C de la velocidad erosional.', campos: [num_('Ccoef', 'C de API RP 14E', '', 100, 'Para servicio continuo suele usarse 100; el estándar de la empresa manda.')] }
    ],
    calc: function (v) { return C.lineaLiquido(v); },
    render: function (r) {
      var out = kpis([kpi('Velocidad', fmt(r.v, 2), 'ft/s'), kpi('Velocidad erosional', fmt(r.ve, 1), 'ft/s'), kpi('Reynolds', fmt(r.Re, 0), r.regimen), kpi('Factor de fricción', fmt(r.f, 4), ''), kpi('ΔP por fricción', fmt(r.dpFric, 1), 'psi'), kpi('ΔP total', fmt(r.dpTotal, 1), 'psi', 'main')].concat(r.pOut != null ? [kpi('Presión de salida', fmt(r.pOut, 1), 'psi', r.pOut > 0 ? '' : 'bad')] : []));
      out += h3('Diámetros sch 40 comparados') + tabla(['NPS (in)', 'ID (in)', 'Velocidad (ft/s)', 'ΔP total (psi)', 'Cumple velocidad'], r.candidatos.map(function (c) { return [c.nps, c.id, fmt(c.v, 1), fmt(c.dpTotal, 1), c.ok ? badge('Sí', 'ok') : badge('No', 'bad')]; }));
      return out + calcBlock([['Velocidad', 'v = Q/A = ' + fmt(r.v, 2) + ' ft/s'], ['Reynolds', 'Re = 1488·ρ·v·D/μ = ' + fmt(r.Re, 0)], ['Fricción', 'f (Swamee-Jain) = ' + fmt(r.f, 4)], ['Pérdida', 'ΔP = f·(L/D)·ρ·v²/(2gc) = ' + fmt(r.dpFric, 1) + ' psi; hidrostática ' + fmt(r.dpElev, 1) + ' psi']]);
    }
  });

  /* 13. Tornado upstream */
  function economiaCampos() {
    return [
      { titulo: 'Producción', intro: 'Perfil simple con declinación exponencial.', campos: [num_('qi', 'Caudal inicial', 'bbl/d', 1500), num_('D', 'Declinación nominal anual', '1/año', 0.35), num_('anios', 'Vida económica', 'años', 10)] },
      { titulo: 'Precio y costos', intro: 'Valores en USD constantes.', campos: [num_('precio', 'Precio realizado', 'USD/bbl', 70), num_('regalia', 'Regalías', '%', 12, null, { pct: true }), num_('opexVar', 'OPEX variable', 'USD/bbl', 12), num_('opexFijo', 'OPEX fijo', 'MM USD/año', 1.5)] },
      { titulo: 'Inversión y fiscal', intro: 'CAPEX al año 0, depreciación lineal.', campos: [num_('capex', 'CAPEX', 'MM USD', 40), num_('tasaImp', 'Impuesto a las ganancias', '%', 30, null, { pct: true }), num_('tasaDesc', 'Tasa de descuento', '%', 10, null, { pct: true })] },
      { titulo: 'Sensibilidad', intro: 'Cada variable se mueve hacia arriba y hacia abajo en este porcentaje.', campos: [num_('delta', 'Variación', '%', 20, null, { pct: true })] }
    ];
  }
  tool({
    id: 'tornU', grupo: 'Evaluación de proyectos', nombre: 'Sensibilidad tornado económica (upstream)', etapas: 'V C D', pregunta: '¿Qué variable mueve más el valor del proyecto y cuál es el precio de equilibrio?',
    ficha: { metodo: 'Flujo de caja simplificado: declinación exponencial anual, regalías, OPEX, depreciación lineal e impuesto. VAN, TIR, payback y precio de equilibrio (VAN = 0). Tornado: cada variable ±Δ% manteniendo las demás.', fuente: 'Evaluación económica estándar (VAN/TIR); análisis de sensibilidad tipo tornado.', limites: ['Modelo simplificado: flujos de fin de año, sin arrastre de pérdidas fiscales.', 'Sin escalamiento de costos ni capital de trabajo.', 'Un proyecto real requiere el modelo económico corporativo; esto sirve para priorizar.'], unidades: 'USD constantes; volúmenes en bbl; resultados en MM USD.' },
    pasos: economiaCampos(),
    calc: function (v) { return C.tornadoUpstream(v); },
    render: function (r) {
      var out = kpis([kpi('VAN', fmt(r.npv, 1), 'MM USD', r.npv >= 0 ? 'ok' : 'bad'), kpi('TIR', r.tir == null ? '—' : fmt(r.tir * 100, 1), '%'), kpi('Payback', r.payback == null ? 'no recupera' : fmt(r.payback, 1), r.payback == null ? '' : 'años'), kpi('Precio de equilibrio', r.breakeven == null ? '—' : fmt(r.breakeven, 1), 'USD/bbl', 'main'), kpi('Producción total', fmt(r.volTotal / 1e6, 2), 'MMbbl')]);
      out += h3('Tornado del VAN (±' + fmt(r.delta * 100, 0) + ' %)') + tornado(r.tornado, 'VAN (MM USD)');
      out += tabla(['Variable', 'VAN bajo', 'VAN alto', 'Oscilación'], r.tornado.filas.map(function (f) { return [esc(f.etiqueta), fmt(f.bajo, 1), fmt(f.alto, 1), fmt(f.swing, 1)]; }));
      out += lineChart({ series: [{ pts: r.flujos.map(function (x, i) { return [i, x]; }), nombre: 'Flujo de caja', pt: true }], xl: 'Año', yl: 'MM USD' });
      return out + calcBlock([['Volumen anual', 'V_t = qi·365·(1 − e^−D)/D · e^−D(t−1)'], ['Flujo', 'F_t = ingresos − regalías − OPEX − impuesto; impuesto = tasa × máx(0, ingresos − regalías − OPEX − depreciación)'], ['VAN', 'Σ F_t/(1 + r)^t = ' + fmt(r.npv, 2) + ' MM USD'], ['Equilibrio', 'precio que anula el VAN (bisección) = ' + (r.breakeven == null ? 'fuera de rango' : fmt(r.breakeven, 2) + ' USD/bbl')]]);
    }
  });

  /* 14. Crack spread */
  tool({
    id: 'crack', grupo: 'Evaluación de proyectos', nombre: 'Margen de refinación (crack spread)', etapas: 'V C', pregunta: '¿Qué margen de refinación dan hoy los precios de crudo y productos?',
    ficha: { metodo: 'Crack n-g-d = (g·P_gasolina·42 + d·P_diésel·42 − n·P_crudo)/n, en USD por barril de crudo (esquemas 3-2-1, 5-3-2, 2-1-1). Margen con rendimientos: Σ y_i·P_i − P_crudo, menos OPEX.', fuente: 'Definición estándar de crack spread (CME/NYMEX); margen de refinación por rendimientos.', limites: ['Los esquemas son referencias de mercado, no el margen real de una refinería.', 'No incluye diferenciales de calidad de crudo ni costos de combustible y catalizadores.', 'Los rendimientos deben corresponder al esquema de la planta.'], unidades: 'Crudo en USD/bbl; gasolina y diésel en USD/gal; rendimientos en %.' },
    pasos: [
      { titulo: 'Precios', intro: 'Precios de referencia de la misma fecha.', campos: [num_('crudo', 'Crudo', 'USD/bbl', 80), num_('gasolina', 'Gasolina', 'USD/gal', 2.45), num_('diesel', 'Diésel', 'USD/gal', 2.65)] },
      { titulo: 'Rendimientos y costos (opcional)', intro: 'Con los rendimientos de la planta se calcula el margen bruto y neto.', campos: [num_('yG', 'Rendimiento de gasolina', '%', 45), num_('yD', 'Rendimiento de diésel', '%', 35), num_('yO', 'Rendimiento de otros productos', '%', 20), num_('pO', 'Precio de otros productos', 'USD/bbl', 55), num_('opex', 'OPEX de refinación', 'USD/bbl', 4)] }
    ],
    calc: function (v) { return C.crackSpread(v); },
    render: function (r) {
      var out = kpis([kpi('Gasolina', fmt(r.gasolinaBbl, 1), 'USD/bbl'), kpi('Diésel', fmt(r.dieselBbl, 1), 'USD/bbl')].concat(r.rendBruto != null ? [kpi('Margen bruto por rendimientos', fmt(r.rendBruto, 2), 'USD/bbl', 'main')] : []).concat(r.margenNeto != null ? [kpi('Margen neto', fmt(r.margenNeto, 2), 'USD/bbl', r.margenNeto >= 0 ? 'ok' : 'bad')] : []));
      out += tabla(['Esquema', 'Crudo : gasolina : diésel', 'Crack (USD/bbl de crudo)'], r.esquemas.map(function (e) { return [e.nombre, e.n + ' : ' + e.g + ' : ' + e.d, '<b>' + fmt(e.crack, 2) + '</b>']; }));
      out += hbars(r.esquemas.map(function (e) { return { label: e.nombre, val: Math.max(0, e.crack), txt: fmt(e.crack, 2) + ' USD/bbl', cls: e.crack >= 0 ? 'ok' : 'bad' }; }));
      var e0 = r.esquemas[0];
      return out + calcBlock([['Conversión a USD/bbl', 'gasolina × 42 = ' + fmt(r.gasolinaBbl, 2) + ' ; diésel × 42 = ' + fmt(r.dieselBbl, 2)], ['Crack 3-2-1', '(2 × ' + fmt(r.gasolinaBbl, 2) + ' + 1 × ' + fmt(r.dieselBbl, 2) + ' − 3 × crudo)/3 = ' + fmt(e0.crack, 2)]].concat(r.rendBruto != null ? [['Margen por rendimientos', 'Σ y·P − P_crudo = ' + fmt(r.rendBruto, 2) + ' USD/bbl']] : []));
    }
  });

  /* 15. Tornado downstream */
  tool({
    id: 'tornD', grupo: 'Evaluación de proyectos', nombre: 'Sensibilidad de precios (downstream)', etapas: 'V C D', pregunta: '¿Cómo cambia el VAN de la planta si se mueven crudo, productos, OPEX o utilización?',
    ficha: { metodo: 'Margen unitario = Σ y_i·P_i − P_crudo − OPEX. EBITDA anual = capacidad × utilización × días × margen. Flujo con depreciación lineal e impuesto; VAN y TIR. Tornado: cada variable ±Δ%.', fuente: 'Evaluación económica estándar; margen de refinación por rendimientos.', limites: ['Margen constante en el horizonte: no modela ciclos de precio.', 'Rendimientos y OPEX fijos por barril; sin paradas programadas explícitas.', 'Sin capital de trabajo ni valor terminal.'], unidades: 'Capacidad en bbl/d; precios de gasolina y diésel en USD/gal; otros en USD/bbl; inversión en MM USD.' },
    pasos: [
      { titulo: 'Planta', intro: 'Capacidad y operación.', campos: [num_('thr', 'Capacidad de procesamiento', 'bbl/d', 100000), num_('util', 'Utilización', '%', 90, null, { pct: true }), num_('dias', 'Días de operación por año', 'días', 350)] },
      { titulo: 'Precios y rendimientos', intro: 'Rendimientos como porcentaje del crudo procesado.', campos: [num_('crudo', 'Crudo', 'USD/bbl', 80), num_('pG', 'Gasolina', 'USD/gal', 2.45), num_('pD', 'Diésel', 'USD/gal', 2.65), num_('pO', 'Otros productos', 'USD/bbl', 55), num_('yG', 'Rendimiento de gasolina', '%', 45, null, { pct: true }), num_('yD', 'Rendimiento de diésel', '%', 35, null, { pct: true }), num_('yO', 'Rendimiento de otros', '%', 20, null, { pct: true })] },
      { titulo: 'Costos e inversión', intro: 'Inversión al año 0.', campos: [num_('opex', 'OPEX', 'USD/bbl', 4), num_('capex', 'Inversión', 'MM USD', 800), num_('anios', 'Horizonte', 'años', 10), num_('tasaImp', 'Impuesto a las ganancias', '%', 30, null, { pct: true }), num_('tasaDesc', 'Tasa de descuento', '%', 10, null, { pct: true })] },
      { titulo: 'Sensibilidad', intro: 'Variación aplicada a cada variable.', campos: [num_('delta', 'Variación', '%', 20, null, { pct: true })] }
    ],
    calc: function (v) { return C.tornadoDownstream(v); },
    render: function (r) {
      var out = kpis([kpi('Margen unitario', fmt(r.margenUnit, 2), 'USD/bbl'), kpi('EBITDA anual', fmt(r.ebitda, 1), 'MM USD'), kpi('VAN', fmt(r.npv, 1), 'MM USD', r.npv >= 0 ? 'ok' : 'bad'), kpi('TIR', r.tir == null ? '—' : fmt(r.tir * 100, 1), '%')]);
      out += h3('Tornado del VAN (±' + fmt(r.delta * 100, 0) + ' %)') + tornado(r.tornado, 'VAN (MM USD)');
      out += tabla(['Variable', 'VAN bajo', 'VAN alto', 'Oscilación'], r.tornado.filas.map(function (f) { return [esc(f.etiqueta), fmt(f.bajo, 1), fmt(f.alto, 1), fmt(f.swing, 1)]; }));
      return out + calcBlock([['Margen unitario', 'Σ y·P − P_crudo − OPEX = ' + fmt(r.margenUnit, 2) + ' USD/bbl'], ['EBITDA', 'capacidad × utilización × días × margen = ' + fmt(r.ebitda, 1) + ' MM USD/año'], ['VAN', 'Σ F_t/(1 + r)^t − inversión = ' + fmt(r.npv, 1) + ' MM USD']]);
    }
  });

  /* ===== Grupo de Estudios ===== */
  tool({
    id: 'core', grupo: 'Grupo de Estudios', nombre: 'Calibración core–perfil y cut-offs', etapas: 'C D', pregunta: '¿Qué porosidad de corte corresponde a la permeabilidad mínima y cuánto se parece el perfil al core?',
    ficha: { metodo: 'Regresión lineal de log₁₀(k) contra φ del core: log₁₀k = a + b·φ. Porosidad de corte φ_c = (log₁₀k_c − a)/b. Si se carga la porosidad del perfil en las mismas profundidades se calculan sesgo, error cuadrático medio y R² contra el core.', fuente: 'Práctica estándar de calibración core–perfil y definición de cut-offs (SPE/SPWLA).', limites: ['Una sola relación φ–k para toda la muestra: con varias facies conviene separar.', 'Se asume que las mediciones de core están a condiciones de reservorio o corregidas.', 'La permeabilidad de corte es una decisión del estudio (económica o de movilidad), no sale del método.', 'Las profundidades del core deben estar corregidas al perfil antes de comparar.'], unidades: 'Porosidad en fracción, permeabilidad en mD.' },
    pasos: [
      { titulo: 'Datos de core', intro: 'Una fila por muestra (tapón). La porosidad del perfil es opcional, a la misma profundidad.', campos: [{ id: 'filas', tipo: 'tabla', label: 'Muestras', cols: [{ id: 'phi', label: 'φ core', unit: 'fracción' }, { id: 'k', label: 'k core', unit: 'mD' }, { id: 'phiLog', label: 'φ perfil', unit: 'fracción' }], def: [[0.06, 0.012, 0.075], [0.09, 0.06, 0.1], [0.11, 0.17, 0.12], [0.13, 0.45, 0.13], [0.15, 0.9, 0.17], [0.17, 2.6, 0.18], [0.19, 5.5, 0.21], [0.21, 14, 0.22], [0.24, 40, 0.25]].map(function (a) { return { phi: a[0], k: a[1], phiLog: a[2] }; }) }] },
      { titulo: 'Criterio de corte', intro: 'Permeabilidad mínima para considerar roca productiva.', campos: [num_('kcorte', 'Permeabilidad de corte', 'mD', 0.1)] }
    ],
    calc: function (v) { return C.coreLog(v); },
    render: function (r) {
      var xs = [r.phiRango[0] * 0.9, r.phiRango[1] * 1.05], out = kpis([kpi('log₁₀k = a + b·φ', fmt(r.a, 2) + ' + ' + fmt(r.b, 1) + '·φ'), kpi('R²', fmt(r.r2, 3)), kpi('Porosidad de corte', r.phiCorte == null ? '—' : fmt(r.phiCorte, 3), 'para k = ' + fmt(r.kcorte, 2) + ' mD', 'main')].concat(r.perfil ? [kpi('Sesgo perfil − core', fmt(r.perfil.bias, 3), 'fracción'), kpi('Error cuadrático medio', fmt(r.perfil.rmse, 3)), kpi('R² perfil vs core', fmt(r.perfil.r2, 3))] : []));
      out += lineChart({ series: [{ pts: r.pts, nombre: 'Core', nl: true, pt: true }, { pts: xs.map(function (x) { return [x, r.a + r.b * x]; }), nombre: 'Ajuste', c: 1 }], hlines: [{ y: Math.log10(r.kcorte), label: 'k de corte', cls: 'bad' }], xl: 'Porosidad (fracción)', yl: 'log₁₀ k (mD)' });
      if (r.perfil) out += lineChart({ series: [{ pts: r.perfil.pts, nombre: 'Muestras', nl: true, pt: true }, { pts: [[r.phiRango[0] * 0.8, r.phiRango[0] * 0.8], [r.phiRango[1] * 1.1, r.phiRango[1] * 1.1]], nombre: 'Línea 1:1', c: 1 }], xl: 'φ core', yl: 'φ perfil' });
      return out + calcBlock([['Regresión', 'log₁₀k = ' + fmt(r.a, 3) + ' + ' + fmt(r.b, 2) + ' · φ (n = ' + r.n + ', R² = ' + fmt(r.r2, 3) + ')'], ['Porosidad de corte', 'φ_c = (log₁₀(' + fmt(r.kcorte, 2) + ') − a)/b = ' + (r.phiCorte == null ? '—' : fmt(r.phiCorte, 4))]]);
    }
  });

  tool({
    id: 'pvt', grupo: 'Grupo de Estudios', nombre: 'PVT por correlaciones (petróleo y gas)', etapas: 'C D', pregunta: '¿Qué Rs, Bo, densidad, z y Bg usar cuando no hay análisis PVT de laboratorio?',
    ficha: { metodo: 'Petróleo (Standing, 1947): presión de burbuja Pb = 18,2·[(Rs/γg)^0,83·10^(0,00091·T − 0,0125·API) − 1,4]; Rs(P) bajo Pb; Bo = 0,9759 + 0,000120·[Rs·(γg/γo)^0,5 + 1,25·T]^1,2; sobre Pb, Bo = Bob·exp(−co·(P − Pb)). Gas: pseudocríticas de Sutton (1985), z de Papay (1968), Bg = 0,02827·z·T/P.', fuente: 'Standing, M.B. (1947); Sutton (1985), SPE 14265; Papay (1968).', limites: ['Las correlaciones son empíricas; reemplazalas por PVT de laboratorio apenas haya.', 'Standing: Rs ≤ 1425 scf/STB, API 16,5–63,8, Pb hasta 7000 psia.', 'Papay es una aproximación sencilla de z; no usar con Ppr > 15 ni Tpr < 1,05.', 'Sin contaminantes (CO₂, H₂S, N₂) en el gas.'], unidades: 'P en psia, T en °F, Rs en scf/STB, Bo en rb/STB, Bg en rcf/scf.' },
    pasos: [
      { titulo: 'Fluido', intro: 'Elegí el tipo de fluido y las condiciones de reservorio.', campos: [sel_('fluido', 'Fluido', [['oil', 'Petróleo'], ['gas', 'Gas']], 'oil'), num_('sg', 'Densidad relativa del gas (aire = 1)', '', 0.7), num_('T', 'Temperatura de reservorio', '°F', 180), num_('api', 'Gravedad API', '°API', 35, null, { si: function (v) { return v.fluido === 'oil'; } }), num_('rsb', 'Rs en el punto de burbuja', 'scf/STB', 500, null, { si: function (v) { return v.fluido === 'oil'; } }), num_('co', 'Compresibilidad del petróleo sobre Pb', '1/psi', 0.00001, null, { si: function (v) { return v.fluido === 'oil'; } })] },
      { titulo: 'Rango de presiones', intro: 'Hasta 60 puntos.', campos: [num_('pmax', 'Presión máxima', 'psia', 4000), num_('paso', 'Paso', 'psia', 250)] }
    ],
    calc: function (v) { return C.pvt(v); },
    render: function (r) {
      var out;
      if (r.fluido === 'gas') {
        out = kpis([kpi('T pseudocrítica', fmt(r.tpc, 0), '°R'), kpi('P pseudocrítica', fmt(r.ppc, 0), 'psia'), kpi('T pseudoreducida', fmt(r.tpr, 2))]);
        out += lineChart({ series: [{ pts: r.filas.map(function (f) { return [f.P, f.z]; }), nombre: 'z' }], xl: 'Presión (psia)', yl: 'Factor z' }) + lineChart({ series: [{ pts: r.filas.map(function (f) { return [f.P, f.Bg]; }), nombre: 'Bg', c: 1 }], xl: 'Presión (psia)', yl: 'Bg (rcf/scf)' });
        out += tabla(['P (psia)', 'z', 'Bg (rcf/scf)'], r.filas.map(function (f) { return [fmt(f.P, 0), fmt(f.z, 4), fmt(f.Bg, 6)]; }));
        return out + calcBlock([['Pseudocríticas (Sutton)', 'Tpc = 169,2 + 349,5γg − 74γg² = ' + fmt(r.tpc, 1) + ' °R ; Ppc = 756,8 − 131γg − 3,6γg² = ' + fmt(r.ppc, 1) + ' psia'], ['z (Papay)', 'z = 1 − 3,52·Ppr/10^(0,9813·Tpr) + 0,274·Ppr²/10^(0,8157·Tpr)'], ['Bg', '0,02827 · z · T(°R) / P']]);
      }
      out = kpis([kpi('Presión de burbuja', fmt(r.pb, 0), 'psia', 'main'), kpi('Bo en burbuja', fmt(r.bob, 4), 'rb/STB'), kpi('Densidad relativa del petróleo', fmt(r.go, 4))]);
      out += lineChart({ series: [{ pts: r.filas.map(function (f) { return [f.P, f.Bo]; }), nombre: 'Bo' }], hlines: [], xl: 'Presión (psia)', yl: 'Bo (rb/STB)' }) + lineChart({ series: [{ pts: r.filas.map(function (f) { return [f.P, f.Rs]; }), nombre: 'Rs', c: 1 }], xl: 'Presión (psia)', yl: 'Rs (scf/STB)' });
      out += tabla(['P (psia)', 'Rs (scf/STB)', 'Bo (rb/STB)', 'ρo (lb/ft³)'], r.filas.map(function (f) { return [fmt(f.P, 0), fmt(f.Rs, 0), fmt(f.Bo, 4), fmt(f.rho, 2)]; }));
      return out + calcBlock([['Pb (Standing)', '18,2·[(Rs/γg)^0,83 · 10^(0,00091·T − 0,0125·API) − 1,4] = ' + fmt(r.pb, 0) + ' psia'], ['Rs bajo Pb', 'γg·[(P/18,2 + 1,4)·10^(0,0125·API − 0,00091·T)]^1,2048'], ['Bo', '0,9759 + 0,000120·[Rs·√(γg/γo) + 1,25·T]^1,2'], ['Sobre Pb', 'Bo = Bob·exp(−co·(P − Pb))']]);
    }
  });

  tool({
    id: 'pz', grupo: 'Grupo de Estudios', nombre: 'Balance de materiales de gas (p/z)', etapas: 'D E', pregunta: '¿Cuánto gas original hay y cuánto se recupera hasta la presión de abandono?',
    ficha: { metodo: 'Para un reservorio de gas volumétrico, p/z es lineal con la producción acumulada: p/z = a + b·Gp. El gas original es el corte con el eje Gp (G = −a/b) y la recuperación al abandono sale de la presión de abandono: Gp_ab = (p_ab/z_ab − a)/b.', fuente: 'Balance de materiales de gas (Havlena & Odeh, 1963; Craft & Hawkins).', limites: ['Reservorio volumétrico, sin acuífero activo ni compactación; con empuje de agua la recta se curva y G queda subestimado o sobreestimado según el caso.', 'Requiere presiones estáticas medidas (no fluyentes) y z confiable.', 'La extrapolación es muy incierta cuando se produjo menos del 10–20 % del gas original.', 'Gas seco o húmedo con z del gas total; no corrige condensación retrógrada.'], unidades: 'Presión en psia, Gp y G en la misma unidad (por ejemplo MMscf).' },
    pasos: [
      { titulo: 'Historia de presión', intro: 'Presión estática y producción acumulada de gas. Si no tenés z, dejalo vacío y se estima con la densidad del gas y la temperatura.', campos: [{ id: 'filas', tipo: 'tabla', label: 'Puntos', cols: [{ id: 'p', label: 'Presión', unit: 'psia' }, { id: 'z', label: 'z (opcional)' }, { id: 'gp', label: 'Gp', unit: 'MMscf' }], def: [[4200, '', 0], [3900, '', 1800], [3600, '', 3700], [3300, '', 5500], [3050, '', 7200], [2800, '', 9100]].map(function (a) { return { p: a[0], z: a[1], gp: a[2] }; }) }, num_('sg', 'Densidad relativa del gas (para estimar z)', '', 0.65), num_('T', 'Temperatura de reservorio', '°F', 210)] },
      { titulo: 'Abandono', intro: 'Presión a la que el pozo o el campo ya no es económico.', campos: [num_('pab', 'Presión de abandono', 'psia', 500)] }
    ],
    calc: function (v) { return C.balanceGas(v); },
    render: function (r) {
      var out = kpis([kpi('Gas original (G)', fmt(r.G, 0), 'MMscf', 'main'), kpi('Recuperable al abandono', fmt(r.gpAb, 0), 'MMscf', 'main'), kpi('Factor de recuperación final', fmt(r.rf * 100, 1), '%'), kpi('Recuperado hasta hoy', fmt(r.rfActual * 100, 1), '% de G'), kpi('R² de la recta', fmt(r.r2, 4))]);
      out += lineChart({ series: [{ pts: r.pts.map(function (p) { return [p.gp, p.pz]; }), nombre: 'p/z medido', nl: true, pt: true }, { pts: [[0, r.a], [r.G, 0]], nombre: 'Extrapolación', c: 1 }], hlines: [{ y: r.pzAb, label: 'abandono', cls: 'bad' }], xl: 'Gp (MMscf)', yl: 'p/z (psia)' });
      out += tabla(['P (psia)', 'z', 'p/z', 'Gp (MMscf)'], r.pts.map(function (p) { return [fmt(p.p, 0), fmt(p.z, 4) + (p.calcZ ? ' *' : ''), fmt(p.pz, 0), fmt(p.gp, 0)]; })) + nota('* z estimado con la correlación de Papay.');
      return out + calcBlock([['Recta', 'p/z = ' + fmt(r.a, 1) + ' + (' + fmt(r.b, 4) + ')·Gp (mínimos cuadrados)'], ['Gas original', 'G = −a/b = ' + fmt(r.G, 0) + ' MMscf'], ['Al abandono', 'Gp = (p_ab/z_ab − a)/b = (' + fmt(r.pzAb, 0) + ' − ' + fmt(r.a, 0) + ')/' + fmt(r.b, 4) + ' = ' + fmt(r.gpAb, 0) + ' MMscf']]);
    }
  });

  tool({
    id: 'dca', grupo: 'Grupo de Estudios', nombre: 'Declinación de Arps: ajuste y EUR con incertidumbre', etapas: 'C D E', pregunta: '¿Qué EUR se espera de un pozo y con qué rango (P90/P50/P10)?',
    ficha: { metodo: 'Ajuste de Arps, q = qi/(1 + b·Di·t)^(1/b) (b = 0 exponencial), por mínimos cuadrados sobre ln q: búsqueda de Di y b (b de 0 a 2 en pasos de 0,1) con qi óptimo. EUR = acumulada hasta que el caudal baja al límite económico o se alcanza el horizonte. Rango: 150 remuestreos (bootstrap) de los residuos del ajuste.', fuente: 'Arps, J.J. (1945), Trans. AIME 160; práctica de análisis de curvas de declinación (SPE-PRMS).', limites: ['El rango P90/P50/P10 solo refleja el ruido de los datos, no la incertidumbre del modelo ni del régimen de flujo.', 'En no convencionales b > 1 es común en flujo transitorio y puede sobrestimar el EUR: limitá con el horizonte o con un modelo de declinación terminal.', 'Requiere datos sin cierres ni restricciones operativas; sacá esos meses antes de ajustar.', 'Para reservas SPE-PRMS se necesita el procedimiento corporativo; esto es un análisis de apoyo.'], unidades: 'Tiempo en meses desde el inicio de producción, caudal en unidades/día (bbl/d o Mscf/d), EUR en las mismas unidades de volumen.' },
    pasos: [
      { titulo: 'Historia de producción', intro: 'Caudal promedio mensual (sin meses con cierres). El mes es el tiempo desde el inicio.', campos: [{ id: 'filas', tipo: 'tabla', label: 'Producción', cols: [{ id: 't', label: 'Mes' }, { id: 'q', label: 'Caudal', unit: '/día' }], def: [[1, 668], [2, 623], [3, 564], [4, 492], [5, 463], [6, 407], [8, 356], [10, 317], [12, 283], [15, 250], [18, 223], [21, 194], [24, 169], [30, 142]].map(function (a) { return { t: a[0], q: a[1] }; }) }] },
      { titulo: 'Ajuste y límites', intro: 'Elegí si el exponente b se busca o se fija, y el límite económico.', campos: [sel_('modoB', 'Exponente b', [['auto', 'Buscar el mejor ajuste (0 a 2)'], ['fijo', 'Fijar un valor']], 'auto'), num_('bfijo', 'b fijo', '', 1, null, { si: function (v) { return v.modoB === 'fijo'; } }), num_('qlim', 'Caudal límite económico', '/día', 15), num_('tmax', 'Horizonte máximo', 'meses', 360), num_('semilla', 'Semilla del remuestreo', '', 2024)] }
    ],
    calc: function (v) { return C.declinacion(v); },
    render: function (r) {
      var out = kpis([kpi('qi', fmt(r.qi, 0), '/día'), kpi('Di', fmt(r.di, 4), '1/mes'), kpi('b', fmt(r.b, 1)), kpi('R² (en ln q)', fmt(r.r2, 4)), kpi('EUR (mejor ajuste)', fmt(r.eur.np / 1000, 1), 'miles', 'main'), kpi('P90 / P50 / P10', fmt(r.p90 / 1000, 0) + ' / ' + fmt(r.p50 / 1000, 0) + ' / ' + fmt(r.p10 / 1000, 0), 'miles', 'main'), kpi('Vida hasta el límite', fmt(r.eur.t / 12, 1), 'años')]);
      out += lineChart({ series: [{ pts: r.datos.map(function (d) { return [d.t, d.q]; }), nombre: 'Datos', nl: true, pt: true }, { pts: r.curva, nombre: 'Ajuste de Arps', c: 1 }], hlines: [{ y: num(r.eur.q) || 0, label: 'límite económico', cls: 'bad' }], xl: 'Meses', yl: 'Caudal (/día)' });
      return out + calcBlock([['Modelo', 'q = qi/(1 + b·Di·t)^(1/b) con qi = ' + fmt(r.qi, 1) + ', Di = ' + fmt(r.di, 4) + ' 1/mes, b = ' + fmt(r.b, 1)], ['Tiempo al límite', 't = ((qi/q_lim)^b − 1)/(b·Di) = ' + fmt(r.eur.t, 1) + ' meses'], ['EUR', 'Np = qi^b/((1 − b)·Di)·(qi^(1−b) − q^(1−b)) × 30,4375 d/mes = ' + fmt(r.eur.np, 0)], ['Rango', r.nBoot + ' remuestreos de residuos; P90 = percentil 10 del EUR, P10 = percentil 90']]);
    }
  });

  tool({
    id: 'horner', grupo: 'Grupo de Estudios', nombre: 'Restauración de presión (Horner)', etapas: 'D E', pregunta: '¿Cuál es la permeabilidad, el daño (skin) y la presión inicial extrapolada del reservorio?',
    ficha: { metodo: 'Gráfico de Horner: p_ws = p* − m·log₁₀((tp + Δt)/Δt). Con la pendiente m del tramo recto (flujo radial): kh = 162,6·q·B·μ/m. Skin: s = 1,151·[(p₁h − p_wf)/m − log₁₀(k/(φ·μ·ct·rw²)) + 3,23]. Caída de presión por daño ΔP_s = 0,87·m·s.', fuente: 'Horner (1951); Earlougher, R.C. (1977), Advances in Well Test Analysis, SPE Monograph 5.', limites: ['Petróleo monofásico, flujo radial infinito en el tramo elegido.', 'Almacenamiento de pozo y efectos de borde distorsionan el inicio y el final: elegí bien el rango de Δt.', 'Pozo vertical y sin interferencias; con fracturas hidráulicas o horizontales el flujo radial puede no aparecer.', 'La presión extrapolada p* no es la presión media del reservorio sin la corrección de Matthews-Brons-Hazebroek.'], unidades: 'Campo (oilfield): q en STB/d, B en rb/STB, μ en cP, h en ft, ct en 1/psi, rw en ft, tp y Δt en horas, p en psi.' },
    pasos: [
      { titulo: 'Pozo y fluido', intro: 'Datos del pozo antes del cierre y del reservorio.', campos: [num_('q', 'Caudal antes del cierre', 'STB/d', 500), num_('B', 'Bo', 'rb/STB', 1.2), num_('mu', 'Viscosidad', 'cP', 0.8), num_('h', 'Espesor neto', 'ft', 40), num_('phi', 'Porosidad', 'fracción', 0.18), num_('ct', 'Compresibilidad total', '1/psi', 0.000015), num_('rw', 'Radio del pozo', 'ft', 0.35), num_('tp', 'Tiempo de producción antes del cierre', 'h', 720), num_('pwf', 'Presión fluyente al cerrar', 'psi', 2200)] },
      { titulo: 'Datos del cierre', intro: 'Presión de fondo en función del tiempo de cierre.', campos: [{ id: 'filas', tipo: 'tabla', label: 'Restauración', cols: [{ id: 'dt', label: 'Δt', unit: 'h' }, { id: 'p', label: 'Presión', unit: 'psi' }], def: [[1, 2854], [2, 2874], [4, 2886], [8, 2903], [16, 2917], [32, 2930], [64, 2948], [120, 2958]].map(function (a) { return { dt: a[0], p: a[1] }; }) }] },
      { titulo: 'Tramo recto', intro: 'Rango de Δt que usarás para la pendiente (flujo radial). Dejalos vacíos para usar todos los puntos.', campos: [num_('desde', 'Δt mínimo del tramo', 'h', 2), num_('hasta', 'Δt máximo del tramo', 'h', '')] }
    ],
    calc: function (v) { return C.horner(v); },
    render: function (r) {
      var xs = r.datos.map(function (d) { return d[0]; }), xmax = Math.max.apply(null, xs) * 1.05;
      var out = kpis([kpi('Pendiente m', fmt(r.m, 1), 'psi/ciclo'), kpi('Presión extrapolada p*', fmt(r.pstar, 0), 'psi', 'main'), kpi('kh', fmt(r.kh, 0), 'mD·ft'), kpi('Permeabilidad k', fmt(r.k, 1), 'mD', 'main'), kpi('Skin', fmt(r.skin, 2), '', r.skin > 0 ? '' : 'ok'), kpi('Caída por daño', fmt(r.dpSkin, 0), 'psi'), kpi('Eficiencia de flujo', fmt(r.eficiencia, 2)), kpi('R² del tramo', fmt(r.r2, 4))]);
      out += lineChart({ series: [{ pts: r.datos.map(function (d) { return [d[0], d[1]]; }), nombre: 'Datos', nl: true, pt: true }, { pts: [[xmax, r.pstar - r.m * xmax], [0, r.pstar]], nombre: 'Recta de Horner', c: 1 }], xl: 'log₁₀((tp + Δt)/Δt)  (el tiempo de cierre crece hacia la izquierda)', yl: 'Presión (psi)', invertX: true });
      return out + calcBlock([['Recta', 'p_ws = ' + fmt(r.pstar, 0) + ' − ' + fmt(r.m, 1) + ' · log₁₀((tp + Δt)/Δt) (mínimos cuadrados, ' + r.n + ' puntos)'], ['kh y k', 'kh = 162,6·q·B·μ/m = ' + fmt(r.kh, 0) + ' mD·ft ; k = kh/h = ' + fmt(r.k, 1) + ' mD'], ['Presión a 1 h', 'p₁h = p* − m·log₁₀(tp + 1) = ' + fmt(r.p1h, 0) + ' psi'], ['Skin', 's = 1,151[(p₁h − p_wf)/m − log₁₀(k/(φ·μ·ct·rw²)) + 3,23] = ' + fmt(r.skin, 2)]]);
    }
  });

  tool({
    id: 'mbe', grupo: 'Grupo de Estudios', nombre: 'Balance de materiales de petróleo (Havlena–Odeh)', etapas: 'D E', pregunta: '¿Cuál es el petróleo original y cuánto aportan el casquete de gas y el acuífero?',
    ficha: { metodo: 'Ecuación de Havlena–Odeh: F = N·(Eo + m·Eg) + We, con F = Np·[Bo + (Rp − Rs)·Bg] + Wp·Bw, Eo = (Bo − Boi) + (Rsi − Rs)·Bg y Eg = Boi·(Bg/Bgi − 1). N se obtiene por regresión por el origen de (F − We) contra (Eo + m·Eg).', fuente: 'Havlena, D. & Odeh, A.S. (1963), J. Pet. Tech. 15(8); Craft & Hawkins, Applied Petroleum Reservoir Engineering.', limites: ['Modelo de tanque (cero dimensiones), sin compresibilidad de agua y roca.', 'Válido por debajo del punto de burbuja; por encima usá la expansión del petróleo.', 'La relación de casquete m y la intrusión We las debés conocer o estimar con otra fuente; esta herramienta no las ajusta.', 'Requiere presión promedio del reservorio y PVT a cada presión (podés calcularlo con PVT por correlaciones).'], unidades: 'Np y Wp en MSTB; Bo en rb/STB; Rs y Rp en scf/STB; Bg en rb/scf; We en MRB; N resultante en MSTB.' },
    pasos: [
      { titulo: 'Condiciones iniciales', intro: 'Propiedades a la presión inicial y parámetros del modelo.', campos: [num_('boi', 'Boi', 'rb/STB', 1.3), num_('rsi', 'Rsi', 'scf/STB', 600), num_('bgi', 'Bgi', 'rb/scf', 0.0012), num_('m', 'Relación del casquete de gas (m)', '', 0, 'Cero si no hay casquete.'), num_('bw', 'Bw', 'rb/STB', 1)] },
      { titulo: 'Historia de presión y producción', intro: 'Una fila por medición de presión promedio. Wp y We son opcionales.', campos: [{ id: 'filas', tipo: 'tabla', label: 'Historia', cols: [{ id: 'p', label: 'Presión', unit: 'psi' }, { id: 'np', label: 'Np', unit: 'MSTB' }, { id: 'rp', label: 'Rp', unit: 'scf/STB' }, { id: 'bo', label: 'Bo', unit: 'rb/STB' }, { id: 'rs', label: 'Rs', unit: 'scf/STB' }, { id: 'bg', label: 'Bg', unit: 'rb/scf' }, { id: 'wp', label: 'Wp', unit: 'MSTB' }, { id: 'we', label: 'We', unit: 'MRB' }], def: [[3000, 312, 700, 1.27, 540, 0.00125], [2500, 711, 700, 1.23, 470, 0.0014], [2000, 1366, 700, 1.19, 400, 0.0017], [1500, 2330, 700, 1.15, 330, 0.0023]].map(function (a) { return { p: a[0], np: a[1], rp: a[2], bo: a[3], rs: a[4], bg: a[5], wp: '', we: '' }; }) }] }
    ],
    calc: function (v) { return C.balancePetroleo(v); },
    render: function (r) {
      var out = kpis([kpi('Petróleo original (N)', fmt(r.N / 1000, 2), 'MMSTB', 'main'), kpi('Recuperado hasta hoy', fmt(r.rf * 100, 1), '% de N'), kpi('R²', fmt(r.r2, 4))]);
      var emax = Math.max.apply(null, r.pts.map(function (q) { return q.E; })) * 1.05;
      out += lineChart({ series: [{ pts: r.pts.map(function (q) { return [q.E, q.Fn]; }), nombre: 'F − We', nl: true, pt: true }, { pts: [[0, 0], [emax, r.N * emax]], nombre: 'F = N·E', c: 1 }], xl: 'Eo + m·Eg (rb/STB)', yl: 'F − We (MRB)' });
      out += tabla(['P (psi)', 'Np (MSTB)', 'F (MRB)', 'Eo', 'Eg', 'E = Eo + m·Eg'], r.pts.map(function (q) { return [fmt(q.p, 0), fmt(q.np, 0), fmt(q.F, 0), fmt(q.Eo, 4), fmt(q.Eg, 4), fmt(q.E, 4)]; }));
      return out + calcBlock([['Extracción', 'F = Np·[Bo + (Rp − Rs)·Bg] + Wp·Bw'], ['Expansión', 'Eo = (Bo − Boi) + (Rsi − Rs)·Bg ; Eg = Boi·(Bg/Bgi − 1) ; E = Eo + ' + fmt(r.m, 2) + '·Eg'], ['N', 'Σ[(F − We)·E] / Σ[E²] = ' + fmt(r.N, 0) + ' MSTB']]);
    }
  });

  /* ====== Herramientas agregadas en la auditoría de cobertura (borrador pendiente de revisión técnica) ====== */
  function tb(rows, keys) { return rows.map(function (a) { var o = {}; keys.forEach(function (k, i) { o[k] = a[i]; }); return o; }); }

  /* Sello */
  tool({
    id: 'sello', grupo: 'Exploración', nombre: 'Capacidad de sello y altura de columna', etapas: 'C D', pregunta: '¿Qué columna de hidrocarburos puede sostener el sello y limita el cierre estructural o el sello?',
    ficha: { metodo: 'Altura de columna que retiene el sello: h = (Pd_sello − Pd_reservorio)/(ρw − ρh) × 0,433 (ft; presiones en psi, densidades en g/cc). Si el dato es de laboratorio (mercurio–aire), se lleva a condiciones de reservorio con la relación de σ·cosθ: Pd_res-cond = Pd_lab × (σ·cosθ)_reservorio/(σ·cosθ)_lab.', fuente: 'Berg, R.R. (1975), AAPG Bulletin 59(6); Schowalter, T.T. (1979), AAPG Bulletin 63(5); Rose (2001) para el factor «trampa sellada».', limites: ['Sello homogéneo: la heterogeneidad real exige un rango de muestras y no un valor único.', 'No incluye fugas por fallas ni fracturamiento hidráulico del sello.', 'Tensión interfacial y ángulo de contacto de reservorio deben provenir de datos o análogos del fluido real.', 'Es una capacidad de sello capilar; no reemplaza el análisis de geomecánica ni de juntura de fallas.'], unidades: 'Presiones en psi, densidades en g/cc, tensión interfacial en dina/cm, ángulos en grados, alturas en ft (y m).' },
    pasos: [
      { titulo: 'Presión de desplazamiento', intro: 'Presión de entrada del sello y, si existe, la del reservorio (columna que ya soporta el propio reservorio).', campos: [sel_('base', 'Base del dato del sello', [['lab', 'Laboratorio (hay que convertir a reservorio)'], ['res', 'Ya está en condiciones de reservorio']], 'lab'), num_('pd', 'Presión de desplazamiento del sello', 'psi', 2500), num_('pdRes', 'Presión de desplazamiento del reservorio', 'psi', 3, 'Condiciones de reservorio; 0 si es despreciable.'), num_('sigmaLab', 'Tensión interfacial de laboratorio', 'dina/cm', 480, 'Mercurio–aire ≈ 480.', { si: function (v) { return v.base === 'lab'; } }), num_('thetaLab', 'Ángulo de contacto de laboratorio', '°', 140, null, { si: function (v) { return v.base === 'lab'; } }), num_('sigmaRes', 'Tensión interfacial en reservorio', 'dina/cm', 30, null, { si: function (v) { return v.base === 'lab'; } }), num_('thetaRes', 'Ángulo de contacto en reservorio', '°', 0, null, { si: function (v) { return v.base === 'lab'; } })] },
      { titulo: 'Fluidos y cierre', intro: 'Densidades de agua e hidrocarburo en reservorio y el cierre estructural mapeado (opcional).', campos: [num_('rhoW', 'Densidad del agua de formación', 'g/cc', 1.05), num_('rhoH', 'Densidad del hidrocarburo', 'g/cc', 0.8), num_('cierre', 'Cierre estructural (vertical)', 'ft', 300, 'Vacío para omitir la comparación.')] }
    ],
    calc: function (v) { return C.sello(v); },
    render: function (r) {
      var out = kpis([kpi('Columna sostenible por el sello', fmt(r.hSello, 0), 'ft', 'main'), kpi('Columna en metros', fmt(r.hSelloM, 0), 'm'), kpi('Pd del sello a reservorio', fmt(r.pdSello, 1), 'psi'), kpi('Factor de conversión', fmt(r.factor, 4))].concat(r.cierre ? [kpi('Limita', esc(r.limita)), kpi('Columna efectiva', fmt(r.hEfectiva, 0), 'ft', 'main')] : []));
      if (r.cierre) out += hbars([{ label: 'Sello', val: r.hSello, txt: fmt(r.hSello, 0) + ' ft' }, { label: 'Cierre', val: r.cierre, txt: fmt(r.cierre, 0) + ' ft', cls: 'warn' }]);
      return out + calcBlock([['Conversión', 'Pd_sello = Pd_lab × (σ·cosθ)_res/(σ·cosθ)_lab = ' + fmt(r.pdSello, 2) + ' psi (factor ' + fmt(r.factor, 4) + ')'], ['Columna', 'h = (Pd_sello − Pd_res)/(ρw − ρh) × 0,433 = ' + fmt(r.hSello, 1) + ' ft']]);
    }
  });

  /* Agregación */
  tool({
    id: 'agreg', grupo: 'Reservas', nombre: 'Agregación de reservas y recursos', etapas: 'D E', pregunta: '¿Cómo se suman volúmenes P90/P50/P10 de varios campos o yacimientos?',
    ficha: { metodo: 'Cada elemento se ajusta a una lognormal con su P90 y P10. La suma estadística usa una cópula gaussiana con un factor común de correlación ρ (Monte Carlo). La suma aritmética por categoría es la que PRMS prescribe entre campos o propiedades; la suma estadística se justifica solo dentro de un mismo campo o proyecto.', fuente: 'SPE/WPC/AAPG/SPEE/SEG/SPWLA/EAGE (2018), Petroleum Resources Management System, y Guidelines for Application of PRMS (2011), sección de agregación.', limites: ['Los elementos deben ser lognormales o aproximarse a ellas; el ajuste usa solo P90 y P10.', 'La correlación única entre todos los elementos simplifica la dependencia real.', 'Con ρ = 1 la suma estadística se aproxima a la aritmética de P50 pero no a la de P90 y P10 del mismo percentil.', 'Para reportar reservas, seguir el procedimiento corporativo y la categoría 1P/2P/3P.'], unidades: 'Cualquier unidad de volumen coherente (MMboe, Bcf); P90 es el valor con 90 % de probabilidad de ser superado.' },
    pasos: [
      { titulo: 'Elementos a agregar', intro: 'Una fila por campo, yacimiento o proyecto, con P90 < P50 < P10.', campos: [{ id: 'filas', tipo: 'tabla', label: 'Elementos', cols: [{ id: 'nombre', label: 'Nombre', texto: true }, { id: 'p90', label: 'P90' }, { id: 'p50', label: 'P50' }, { id: 'p10', label: 'P10' }], def: tb([['Campo A', 10, 20, 40], ['Campo B', 5, 10, 20], ['Campo C', 20, 40, 80]], ['nombre', 'p90', 'p50', 'p10']) }] },
      { titulo: 'Dependencia', intro: 'Correlación entre elementos (0 independientes, 1 totalmente dependientes). Debe justificarse; entre campos distintos PRMS usa suma aritmética.', campos: [num_('rho', 'Correlación entre elementos (ρ)', '', 0.3), num_('n', 'Iteraciones', '', 20000), num_('semilla', 'Semilla', '', 777)] }
    ],
    calc: function (v) { return C.agregacion(v); },
    render: function (r) {
      var out = kpis([kpi('P90 aritmético', fmt(r.arit.p90, 1)), kpi('P90 estadístico', fmt(r.est.p90, 1), '', 'main'), kpi('Diferencia P90', fmt(r.difP90 * 100, 1), '%'), kpi('P10 estadístico', fmt(r.est.p10, 1)), kpi('Diferencia P10', fmt(r.difP10 * 100, 1), '%')]);
      out += tabla(['Suma', 'P90', 'P50', 'P10', 'Media'], [['Aritmética (por categoría)', fmt(r.arit.p90, 1), fmt(r.arit.p50, 1), fmt(r.arit.p10, 1), fmt(r.arit.media, 1)], ['Estadística (ρ = ' + fmt(r.rho, 2) + ')', fmt(r.est.p90, 1), fmt(r.est.p50, 1), fmt(r.est.p10, 1), fmt(r.est.media, 1)]]);
      out += hbars([{ label: 'P90 aritmético', val: r.arit.p90, txt: fmt(r.arit.p90, 1) }, { label: 'P90 estadístico', val: r.est.p90, txt: fmt(r.est.p90, 1), cls: 'warn' }, { label: 'P10 aritmético', val: r.arit.p10, txt: fmt(r.arit.p10, 1) }, { label: 'P10 estadístico', val: r.est.p10, txt: fmt(r.est.p10, 1), cls: 'warn' }], Math.max(r.arit.p10, r.est.p10));
      return out + calcBlock([['Lognormal por elemento', 'σ = ln(P10/P90)/(2·1,2816) ; μ = (ln P10 + ln P90)/2'], ['Dependencia', 'X_i = exp(μ_i + σ_i·(√ρ·Z₀ + √(1−ρ)·Z_i)), ' + r.n + ' iteraciones'], ['Percentiles', 'P90 = percentil 10 de la suma ; P10 = percentil 90']]);
    }
  });

  /* Límite económico */
  tool({
    id: 'limeco', grupo: 'Reservas', nombre: 'Límite económico y reservas remanentes', etapas: 'D E', pregunta: '¿A qué caudal deja de ser rentable el pozo y cuánto queda por recuperar?',
    ficha: { metodo: 'Caudal de límite económico: q_EL = OPEX_fijo/(365·[P·(1 − r) − OPEX_var]). Reservas remanentes: acumulada de Arps desde el caudal actual hasta q_EL (o hasta el vencimiento del contrato). Sensibilidad al precio de −30 % a +30 %.', fuente: 'SPE/WPC/AAPG/SPEE/SEG/SPWLA/EAGE (2018), PRMS (criterio de viabilidad económica de reservas); Arps (1945). SEC Regulation S-X 4-10(a) para precios de 12 meses.', limites: ['Sin impuestos, capital de mantenimiento ni costos de abandono.', 'El límite real surge del flujo de caja del proyecto completo, no solo del margen operativo.', 'El precio debe ser el del criterio de reporte aplicable (PRMS o SEC).', 'Arps con b > 1 puede extender demasiado la vida; limitá con el contrato.'], unidades: 'Precio en USD/bbl, OPEX variable en USD/bbl, OPEX fijo en miles de USD/año, caudal en bbl/d, declinación nominal en 1/año.' },
    pasos: [
      { titulo: 'Economía unitaria', intro: 'Precio neto de regalías y costos operativos.', campos: [num_('precio', 'Precio', 'USD/bbl', 60), num_('regalia', 'Regalías', 'fracción', 0.12), num_('opexVar', 'OPEX variable', 'USD/bbl', 12), num_('opexFijo', 'OPEX fijo', 'miles USD/año', 600)] },
      { titulo: 'Declinación', intro: 'Caudal actual y declinación nominal.', campos: [num_('qi', 'Caudal actual', 'bbl/d', 180), num_('di', 'Declinación nominal', '1/año', 0.25), num_('b', 'Exponente b (0 a 2)', '', 0.5), num_('contrato', 'Años restantes de contrato (0 = sin límite)', 'años', 0)] }
    ],
    calc: function (v) { return C.limiteEconomico(v); },
    render: function (r) {
      var b = r.base, out = kpis([kpi('Margen por barril', fmt(b.margen, 2), 'USD/bbl'), kpi('Límite económico', fmt(b.qel, 1), 'bbl/d', 'main'), kpi('Reservas remanentes', fmt(b.np / 1000, 1), 'Mbbl', 'main'), kpi('Vida remanente', fmt(b.vida, 1), 'años')]);
      out += lineChart({ series: [{ pts: r.sens.filter(function (s) { return s.qel != null; }).map(function (s) { return [s.precio, s.np / 1000]; }), nombre: 'Reservas', pt: true }], xl: 'Precio (USD/bbl)', yl: 'Reservas remanentes (Mbbl)' });
      out += tabla(['Δ precio', 'Precio', 'Límite (bbl/d)', 'Reservas (Mbbl)', 'Vida (años)'], r.sens.map(function (s) { return [fmt(s.d * 100, 0) + ' %', fmt(s.precio, 1), s.qel == null ? '—' : fmt(s.qel, 1), fmt(s.np / 1000, 1), fmt(s.vida, 1)]; }));
      return out + calcBlock([['Margen', 'P·(1 − r) − OPEX_var = ' + fmt(b.margen, 2) + ' USD/bbl'], ['Límite económico', 'q_EL = OPEX_fijo/(365·margen) = ' + fmt(b.qel, 2) + ' bbl/d'], ['Reservas', 'Np = ∫ q dt de ' + fmt(r.g.qi, 0) + ' a ' + fmt(b.qel, 1) + ' bbl/d (Arps) = ' + fmt(b.np, 0) + ' bbl']]);
    }
  });

  /* Conciliación */
  tool({
    id: 'concil', grupo: 'Reservas', nombre: 'Conciliación de reservas y RRR', etapas: 'E', pregunta: '¿Cómo cierra el balance anual de reservas y cuáles son los indicadores?',
    ficha: { metodo: 'Reservas finales = iniciales + revisiones + recuperación mejorada + extensiones y descubrimientos + compras − ventas − producción. Indicadores: RRR (tasa de reemplazo) = adiciones/producción, R/P = reservas/producción, F&D = costo/adiciones orgánicas.', fuente: 'FASB ASC 932-235-50 (tabla de cambios de reservas); SEC Regulation S-X 4-10 y S-K 1200; PRMS (2018) para clasificación.', limites: ['La definición exacta de RRR y F&D varía entre compañías; confirmar la base antes de comparar.', 'No distingue categorías (probadas, desarrolladas) ni petróleo/gas: usá una conciliación por categoría.', 'No valida la clasificación de reservas; solo la aritmética y los indicadores.'], unidades: 'Cualquier unidad coherente (MMboe); costos en MM USD.' },
    pasos: [
      { titulo: 'Movimientos del período', intro: 'Revisiones pueden ser negativas; el resto se ingresa positivo.', campos: [num_('ini', 'Reservas iniciales', '', 100), num_('rev', 'Revisiones de estimaciones previas', '', 5), num_('rm', 'Recuperación mejorada', '', 2), num_('ext', 'Extensiones y descubrimientos', '', 10), num_('compras', 'Compras de reservas', '', 3), num_('ventas', 'Ventas de reservas', '', 1), num_('prod', 'Producción del período', '', 12)] },
      { titulo: 'Control y costos', intro: 'Opcional: reservas finales informadas y costos de adición para F&D.', campos: [num_('finRep', 'Reservas finales informadas', '', 107), num_('costoOrg', 'Costos de exploración y desarrollo', 'MM USD', 400), num_('costoAcq', 'Costos de adquisición', 'MM USD', 60)] }
    ],
    calc: function (v) { return C.conciliacion(v); },
    render: function (r) {
      var out = kpis([kpi('Reservas finales', fmt(r.fin, 1), '', 'main'), kpi('RRR orgánico', fmt(r.rrrOrg * 100, 0), '%'), kpi('RRR total', fmt(r.rrrTot * 100, 0), '%'), kpi('R/P', fmt(r.rp, 1), 'años')].concat(r.fd ? [kpi('F&D orgánico', fmt(r.fd, 2), 'USD/unidad')] : []).concat(r.fda ? [kpi('F&D con adquisiciones', fmt(r.fda, 2), 'USD/unidad')] : []));
      out += tabla(['Concepto', 'Volumen'], r.filas.map(function (f) { return [esc(f[0]), fmt(f[1], 2)]; }));
      return out + calcBlock([['Balance', 'Fin = Ini + Rev + RM + Ext + Compras − Ventas − Prod = ' + fmt(r.fin, 2)], ['RRR', 'orgánico = (Rev + RM + Ext)/Prod = ' + fmt(r.rrrOrg, 3) + ' ; total = ' + fmt(r.rrrTot, 3)], ['R/P', 'Fin/Prod = ' + fmt(r.rp, 2)]]);
    }
  });

  /* Control de pozo */
  tool({
    id: 'kill', grupo: 'Perforación', nombre: 'Planilla de control de pozo', etapas: 'E', pregunta: '¿Qué densidad de control y qué presiones de circulación necesito ante un influjo?',
    ficha: { metodo: 'Densidad de control KMW = SIDPP/(0,052·TVD) + MW (redondeada hacia arriba 0,1 ppg). Presión inicial de circulación ICP = SCRP + SIDPP; final FCP = SCRP·KMW/MW. MAASP = (MWmáx − MW)·0,052·TVD_zapato, con MWmáx redondeada hacia abajo 0,1 ppg desde el LOT. Capacidad (bbl/ft) = ID²/1029,4. El tipo de influjo se estima por el gradiente.', fuente: 'Fórmulas de campo IADC WellSharp y práctica API RP 59; IWCF.', limites: ['Planilla de apoyo: el procedimiento lo fija el programa del pozo y personal certificado (IWCF/IADC).', 'Pozo vertical o con TVD ≈ MD; en desviados usá TVD para presiones y MD para volúmenes.', 'Sin migración de gas ni efectos de temperatura sobre el lodo.', 'El tipo de influjo es indicativo.'], unidades: 'Campo: ppg, ft, psi, bbl, pulgadas; bomba en bbl/stk.' },
    pasos: [
      { titulo: 'Pozo y sarta', intro: 'Densidad actual, profundidades y geometría.', campos: [num_('omw', 'Densidad del lodo', 'ppg', 10), num_('tvd', 'Profundidad vertical (TVD)', 'ft', 10000), num_('md', 'Profundidad medida (MD)', 'ft', 10000), num_('hoyo', 'Diámetro del pozo', 'pulg', 8.5), num_('dcOD', 'OD portamechas', 'pulg', 6.5), num_('dcID', 'ID portamechas', 'pulg', 2.8125), num_('dcLen', 'Largo de portamechas', 'ft', 600), num_('dpOD', 'OD barras', 'pulg', 5), num_('dpID', 'ID barras', 'pulg', 4.276), num_('bomba', 'Desplazamiento de la bomba', 'bbl/stk', 0.1)] },
      { titulo: 'Zapato y prueba de integridad', intro: 'Datos del último zapato y su LOT/FIT.', campos: [num_('zapato', 'Profundidad vertical del zapato', 'ft', 5000), num_('lot', 'Presión del LOT/FIT en superficie', 'psi', 1500), num_('lotMw', 'Densidad del lodo en la prueba', 'ppg', 9.5)] },
      { titulo: 'Datos del influjo', intro: 'Presiones estabilizadas con el pozo cerrado y la presión reducida de bombeo.', campos: [num_('sidpp', 'SIDPP', 'psi', 500), num_('sicp', 'SICP', 'psi', 700), num_('scrp', 'Presión reducida de circulación (SCRP)', 'psi', 800), num_('ganancia', 'Ganancia en piletas', 'bbl', 20)] }
    ],
    calc: function (v) { return C.killSheet(v); },
    render: function (r) {
      var out = kpis([kpi('Densidad de control (KMW)', fmt(r.kmw, 1), 'ppg', 'main'), kpi('ICP', fmt(r.icp, 0), 'psi', 'main'), kpi('FCP', fmt(r.fcp, 0), 'psi', 'main'), kpi('MAASP actual', fmt(r.maasp, 0), 'psi'), kpi('MAASP con KMW', fmt(r.maaspNuevo, 0), 'psi'), kpi('Emboladas a la mecha', fmt(r.strokes, 0)), kpi('Altura del influjo', fmt(r.hk, 0), 'ft'), kpi('Tipo probable', esc(r.tipo))]);
      out += lineChart({ series: [{ pts: r.pasos.map(function (p) { return [p.strokes, p.psi]; }), nombre: 'Presión en la sarta', pt: true }], xl: 'Emboladas', yl: 'Presión de la sarta (psi)' });
      out += tabla(['Emboladas', 'Presión en la sarta (psi)'], r.pasos.map(function (p) { return [fmt(p.strokes, 0), fmt(p.psi, 0)]; }));
      return out + calcBlock([['KMW', 'SIDPP/(0,052·TVD) + MW = ' + fmt(r.kmwExacto, 3) + ' → ' + fmt(r.kmw, 1) + ' ppg'], ['ICP / FCP', 'ICP = SCRP + SIDPP = ' + fmt(r.icp, 0) + ' psi ; FCP = SCRP·KMW/MW = ' + fmt(r.fcp, 0) + ' psi'], ['MAASP', '(MWmáx − MW)·0,052·TVD_zapato = (' + fmt(r.mwMax, 1) + ' − MW)·0,052·TVD = ' + fmt(r.maasp, 0) + ' psi'], ['Influjo', 'gradiente = MW·0,052 − (SICP − SIDPP)/h = ' + fmt(r.grInflujo, 3) + ' psi/ft']]);
    }
  });

  /* Volúmenes de pozo y cementación */
  tool({
    id: 'volpozo', grupo: 'Perforación', nombre: 'Volúmenes de pozo, circulación y cementación', etapas: 'D E', pregunta: '¿Cuántas emboladas y cuántos sacos de cemento necesito?',
    ficha: { metodo: 'Capacidad (bbl/ft) = ID²/1029,4; capacidad anular = (D² − d²)/1029,4. Emboladas = volumen/desplazamiento de la bomba. Cemento: volumen anular con exceso + volumen del zapato; sacos = pies cúbicos/rendimiento; agua de mezcla = sacos × gal/saco/42.', fuente: 'Fórmulas de campo (IADC Drilling Manual; Halliburton Cementing Tables); constante 1029,4 = 1 bbl en pulg² por ft.', limites: ['Geometría cilíndrica: no incluye ensanchamientos ni derrumbes salvo el exceso informado.', 'El exceso debe calibrarse con un registro caliper.', 'No diseña la lechada ni verifica densidades, presiones ni tiempos de bombeabilidad.'], unidades: 'Diámetros en pulgadas, largos en ft, volúmenes en bbl, rendimiento en ft³/saco, agua en gal/saco.' },
    pasos: [
      { titulo: 'Bomba', intro: 'Desplazamiento y velocidad.', campos: [num_('bomba', 'Desplazamiento de la bomba', 'bbl/stk', 0.1), num_('spm', 'Emboladas por minuto', 'spm', 60)] },
      { titulo: 'Interior de la sarta', intro: 'Tramos de la sarta de arriba hacia abajo.', campos: [{ id: 'sarta', tipo: 'tabla', label: 'Sarta', cols: [{ id: 'nombre', label: 'Tramo', texto: true }, { id: 'id', label: 'ID', unit: 'pulg' }, { id: 'L', label: 'Largo', unit: 'ft' }], def: tb([['Barras', 4.276, 9400], ['Portamechas', 2.8125, 600]], ['nombre', 'id', 'L']) }] },
      { titulo: 'Espacio anular', intro: 'Pozo contra sarta (o contra cañería si se cementa). El exceso cubre el ensanchamiento.', campos: [{ id: 'anular', tipo: 'tabla', label: 'Anular', cols: [{ id: 'nombre', label: 'Tramo', texto: true }, { id: 'D', label: 'Diámetro mayor', unit: 'pulg' }, { id: 'd', label: 'Diámetro menor', unit: 'pulg' }, { id: 'L', label: 'Largo', unit: 'ft' }, { id: 'exc', label: 'Exceso', unit: '%' }], def: tb([['Pozo – barras', 8.5, 5, 9400, 20], ['Pozo – portamechas', 8.5, 6.5, 600, 20]], ['nombre', 'D', 'd', 'L', 'exc']) }] },
      { titulo: 'Cemento (opcional)', intro: 'Rendimiento de la lechada, agua de mezcla y volumen dentro del zapato. Vacío para omitir.', campos: [num_('rendimiento', 'Rendimiento', 'ft³/saco', 1.2), num_('agua', 'Agua de mezcla', 'gal/saco', 5.2), num_('zapatoVol', 'Volumen en el zapato', 'bbl', 0)] }
    ],
    calc: function (v) { return C.volumenesPozo(v); },
    render: function (r) {
      var out = kpis([kpi('Volumen de la sarta', fmt(r.volSarta, 1), 'bbl'), kpi('Volumen anular', fmt(r.volAnular, 1), 'bbl'), kpi('Emboladas fondo–superficie', fmt(r.strokesTotal, 0), '', 'main'), kpi('Tiempo de circulación completa', fmt(r.tTotal, 1), 'min', 'main'), kpi('Caudal', fmt(r.caudal, 1), 'bbl/min')]);
      out += tabla(['Tramo', 'Capacidad (bbl/ft)', 'Largo (ft)', 'Volumen (bbl)'], r.sarta.map(function (s) { return [esc(s.n || 'Sarta'), fmt(s.cap, 5), fmt(s.L, 0), fmt(s.v, 1)]; }).concat(r.anular.map(function (s) { return [esc(s.n || 'Anular'), fmt(s.cap, 5), fmt(s.L, 0), fmt(s.v, 1)]; })));
      if (r.cemento) out += h3('Cementación') + kpis([kpi('Volumen anular con exceso', fmt(r.cemento.vAnularExc, 1), 'bbl'), kpi('Volumen total de lechada', fmt(r.cemento.vTotal, 1), 'bbl'), kpi('Sacos de cemento', fmt(r.cemento.sacos, 0), '', 'main')].concat(r.cemento.agua != null ? [kpi('Agua de mezcla', fmt(r.cemento.agua, 0), 'bbl')] : []));
      return out + calcBlock([['Capacidad', 'ID²/1029,4 (bbl/ft) ; anular = (D² − d²)/1029,4'], ['Emboladas', '(V_sarta + V_anular)/bbl por embolada = ' + fmt(r.strokesTotal, 0)], ['Sacos', r.cemento ? 'V(bbl)·5,615/rendimiento = ' + fmt(r.cemento.sacos, 0) : 'no calculado']]);
    }
  });

  /* Eaton */
  tool({
    id: 'eaton', grupo: 'Perforación', nombre: 'Presión de poros y gradiente de fractura (Eaton)', etapas: 'C D', pregunta: '¿Cuál es la ventana de densidades de lodo entre la presión de poros y la fractura?',
    ficha: { metodo: 'Eaton sónico: Pp = Sv − (Sv − Ph)·(Δt_normal/Δt_observado)^x, con x = 3. Gradiente de fractura: FG = ν/(1 − ν)·(Sv − Pp)/D + Pp/D. Equivalentes en ppg = gradiente/0,052.', fuente: 'Eaton, B.A. (1975), SPE 5544; Eaton, B.A. (1969), J. Pet. Tech. 21(10).', limites: ['Método empírico: la tendencia normal debe ajustarse a lutitas limpias de la cuenca.', 'Debe calibrarse con LOT/FIT y mediciones directas (RFT/MDT).', 'La relación de Poisson es una aproximación; en tectónica activa el esfuerzo horizontal puede diferir.', 'Mecanismos distintos a subcompactación (expansión de fluidos, transferencia lateral) no están contemplados.'], unidades: 'Profundidad en ft, tiempo de tránsito en µs/ft, gradientes en psi/ft, equivalentes en ppg.' },
    pasos: [
      { titulo: 'Parámetros', intro: 'Gradientes de sobrecarga e hidrostático, exponente y Poisson.', campos: [num_('obg', 'Gradiente de sobrecarga', 'psi/ft', 1), num_('gh', 'Gradiente hidrostático', 'psi/ft', 0.465), num_('exp', 'Exponente de Eaton', '', 3, 'Sónico: 3.'), num_('nu', 'Relación de Poisson', '', 0.4)] },
      { titulo: 'Perfil sónico', intro: 'Por profundidad: tiempo de tránsito observado y el de la tendencia normal.', campos: [{ id: 'filas', tipo: 'tabla', label: 'Puntos', cols: [{ id: 'z', label: 'Profundidad', unit: 'ft' }, { id: 'dto', label: 'Δt observado', unit: 'µs/ft' }, { id: 'dtn', label: 'Δt normal', unit: 'µs/ft' }], def: tb([[4000, 110, 110], [6000, 105, 100], [8000, 110, 92], [10000, 115, 85]], ['z', 'dto', 'dtn']) }] }
    ],
    calc: function (v) { return C.eaton(v); },
    render: function (r) {
      var f = r.filas, out = lineChart({ series: [{ pts: f.map(function (x) { return [x.ppg, x.z]; }), nombre: 'Presión de poros', pt: true }, { pts: f.map(function (x) { return [x.fgPpg, x.z]; }), nombre: 'Fractura', c: 1, pt: true }], xl: 'Densidad equivalente (ppg)', yl: 'Profundidad (ft)', invertY: true });
      out += tabla(['Profundidad (ft)', 'Δt obs/normal', 'Pp (psi)', 'Pp (ppg)', 'Fractura (psi/ft)', 'Fractura (ppg)', 'Sobrepresión (psi)'], f.map(function (x) { return [fmt(x.z, 0), fmt(x.ratio, 3), fmt(x.pp, 0), fmt(x.ppg, 2), fmt(x.fg, 3), fmt(x.fgPpg, 2), fmt(x.sobrepresion, 0)]; }));
      var u = f[f.length - 1];
      return out + calcBlock([['Presión de poros', 'Pp = Sv − (Sv − Ph)·(Δtn/Δto)^x, a ' + fmt(u.z, 0) + ' ft = ' + fmt(u.pp, 0) + ' psi'], ['Fractura', 'FG = ν/(1 − ν)·(Sv − Pp)/D + Pp/D = ' + fmt(u.fg, 4) + ' psi/ft (' + fmt(u.fgPpg, 2) + ' ppg)']]);
    }
  });

  /* Deliverabilidad de gas */
  tool({
    id: 'delgas', grupo: 'Grupo de Estudios', nombre: 'Deliverabilidad de pozo de gas (back-pressure y LIT)', etapas: 'D E', pregunta: '¿Cuánto gas entrega el pozo y cuál es su caudal máximo teórico (AOF)?',
    ficha: { metodo: 'Back-pressure (Rawlins y Schellhardt): q = C·(pr² − pwf²)^n con n entre 0,5 y 1. LIT (Houpeurt): pr² − pwf² = a·q + b·q², con AOF = [−a + √(a² + 4b·(pr² − pa²))]/(2b). Ajuste por mínimos cuadrados.', fuente: 'Rawlins, E.L. & Schellhardt, M.A. (1936), USBM Monograph 7; Cullender, M.H. (1955), Trans. AIME 204; Houpeurt (1959).', limites: ['Usa presión al cuadrado: válido a presiones bajas (aprox. < 2000 psi); a alta presión conviene pseudopresión.', 'Datos de caudal estabilizados: los puntos transitorios dan n y C sesgados.', 'El AOF es una extrapolación y no un caudal operable.', 'No incluye pérdidas en tubing ni en superficie (ver gasoducto y compresión).'], unidades: 'Presión en psia, caudal en Mscf/d.' },
    pasos: [{ titulo: 'Datos de prueba', intro: 'Presión estática y al menos 3 puntos estabilizados.', campos: [num_('pr', 'Presión estática', 'psia', 3360), num_('pa', 'Presión atmosférica', 'psia', 14.7), { id: 'filas', tipo: 'tabla', label: 'Puntos', cols: [{ id: 'q', label: 'Caudal', unit: 'Mscf/d' }, { id: 'pwf', label: 'Presión fluyente', unit: 'psia' }], def: tb([[1500, 3283], [3000, 3138], [4500, 2914], [6000, 2592]], ['q', 'pwf']) }] }],
    calc: function (v) { return C.gasDeliverability(v); },
    render: function (r, v) {
      var out = kpis([kpi('Exponente n', fmt(r.n, 3)), kpi('Coeficiente C', fmt(r.C, 4)), kpi('AOF back-pressure', fmt(r.aofBP, 0), 'Mscf/d', 'main')].concat(r.aofLIT ? [kpi('AOF LIT', fmt(r.aofLIT, 0), 'Mscf/d', 'main'), kpi('a', fmt(r.a, 2)), kpi('b', fmt(r.b, 5))] : []).concat([kpi('R² back-pressure', fmt(r.r2bp, 4)), kpi('R² LIT', fmt(r.r2lit, 4))]));
      out += lineChart({ series: [{ pts: r.curva.map(function (c) { return [c.q, c.pwf]; }), nombre: 'Curva ajustada' }, { pts: r.pts.map(function (p) { return [p.q, p.pwf]; }), nombre: 'Puntos de prueba', nl: true, pt: true, c: 1 }], xl: 'Caudal (Mscf/d)', yl: 'Presión fluyente (psia)' });
      return out + calcBlock([['Back-pressure', 'log q = log C + n·log(pr² − pwf²): n = ' + fmt(r.n, 3) + ' ; C = ' + fmt(r.C, 4)], ['LIT', '(pr² − pwf²)/q = a + b·q: a = ' + fmt(r.a, 2) + ' ; b = ' + fmt(r.b, 5)], ['AOF', 'q a pwf = ' + fmt(num(v.pa), 1) + ' psia: ' + fmt(r.aofBP, 0) + ' (BP)' + (r.aofLIT ? ' · ' + fmt(r.aofLIT, 0) + ' (LIT)' : '') + ' Mscf/d']]);
    }
  });

  /* Buckley-Leverett */
  tool({
    id: 'bl', grupo: 'Grupo de Estudios', nombre: 'Desplazamiento Buckley–Leverett y permeabilidad relativa', etapas: 'C D', pregunta: '¿Qué recuperación se alcanza al desplazar petróleo con agua y cuándo irrumpe el agua?',
    ficha: { metodo: 'Permeabilidades relativas de Corey: krw = krw_max·Sn^nw ; kro = kro_max·(1 − Sn)^no con saturación normalizada. fw = 1/(1 + kro·μw/(krw·μo)). Welge: tangente a fw desde (Swc, 0) en Swf, con fw′(Swf) = fw(Swf)/(Swf − Swc); PVI a la ruptura = 1/fw′(Swf); Sw promedio = Sw + (1 − fw)/fw′.', fuente: 'Buckley, S.E. & Leverett, M.C. (1942), Trans. AIME 146; Welge, H.J. (1952), J. Pet. Tech. 4(4); Corey, A.T. (1954), Producers Monthly 19(1).', limites: ['1D, incompresible, sin gravedad, capilaridad ni heterogeneidad: es eficiencia de desplazamiento, no barrido total.', 'La forma de Corey debe ajustarse a curvas medidas (SCAL).', 'Razón de movilidad M > 1 implica digitación que el modelo no captura.', 'No hay histéresis ni mojabilidad mixta.'], unidades: 'Saturaciones en fracción, viscosidades en cP, volúmenes en volúmenes porales (PV).' },
    pasos: [{ titulo: 'Curvas y fluidos', intro: 'Puntos extremos y exponentes de Corey, y viscosidades.', campos: [num_('swc', 'Saturación de agua connata (Swc)', '', 0.2), num_('sor', 'Petróleo residual (Sor)', '', 0.2), num_('krwMax', 'krw en Sor', '', 0.4), num_('kroMax', 'kro en Swc', '', 0.9), num_('nw', 'Exponente del agua', '', 2), num_('no', 'Exponente del petróleo', '', 2), num_('muw', 'Viscosidad del agua', 'cP', 1), num_('muo', 'Viscosidad del petróleo', 'cP', 5)] }],
    calc: function (v) { return C.buckleyLeverett(v); },
    render: function (r) {
      var cv = r.curvas;
      var out = kpis([kpi('Sw del frente (Swf)', fmt(r.swf, 3)), kpi('Sw promedio a la ruptura', fmt(r.swBt, 3)), kpi('Recuperación a la ruptura', fmt(r.recBtFrac * 100, 1), '% del petróleo móvil inicial', 'main'), kpi('PVI a la ruptura', fmt(r.pviBt, 3), 'PV'), kpi('Razón de movilidad', fmt(r.M, 2), r.M > 1 ? 'desfavorable' : 'favorable')]);
      out += lineChart({ series: [{ pts: cv.map(function (c) { return [c.sw, c.krw]; }), nombre: 'krw' }, { pts: cv.map(function (c) { return [c.sw, c.kro]; }), nombre: 'kro', c: 1 }], xl: 'Saturación de agua', yl: 'Permeabilidad relativa' });
      out += lineChart({ series: [{ pts: cv.map(function (c) { return [c.sw, c.fw]; }), nombre: 'fw' }, { pts: [[r.g.swc, 0], [r.swf, r.fwf], [r.swBt, 1]], nombre: 'Tangente de Welge', c: 1 }], xl: 'Saturación de agua', yl: 'Flujo fraccional de agua' });
      out += lineChart({ series: [{ pts: [[0, 0], [r.pviBt, r.recBt]].concat(r.post.filter(function (p) { return p.pvi <= 8; }).map(function (p) { return [p.pvi, p.rec]; })), nombre: 'Recuperación', pt: false }], xl: 'Volúmenes porales inyectados (PVI)', yl: 'Petróleo recuperado (PV)' });
      out += tabla(['Sw salida', 'fw', 'PVI', 'Recuperación (PV)', 'Recuperación (% del móvil)', 'WOR'], r.post.map(function (p) { return [fmt(p.sw2, 3), fmt(p.fw, 3), fmt(p.pvi, 2), fmt(p.rec, 3), fmt(p.recFrac * 100, 1), isFinite(p.wor) ? fmt(p.wor, 1) : '∞']; }));
      return out + calcBlock([['Corey', 'krw = krw_max·Sn^nw ; kro = kro_max·(1 − Sn)^no'], ['Frente', 'fw′(Swf) = fw(Swf)/(Swf − Swc): Swf = ' + fmt(r.swf, 3) + ' ; fw(Swf) = ' + fmt(r.fwf, 3)], ['Ruptura', 'PVI = 1/fw′(Swf) = ' + fmt(r.pviBt, 3) + ' ; Sw prom = Swf + (1 − fw)/fw′ = ' + fmt(r.swBt, 3)]]);
    }
  });

  /* Hall */
  tool({
    id: 'hall', grupo: 'Monitoreo', nombre: 'Gráfico de Hall de inyectores', etapas: 'E', pregunta: '¿Está mejorando o empeorando la inyectividad del pozo inyector?',
    ficha: { metodo: 'H = Σ (p_wi − p_prom)·Δt (psi·día) contra la inyección acumulada W (bbl). La pendiente es proporcional a la inversa de la capacidad de inyección: sube con daño y baja con estimulación o fractura. Se compara la primera con la segunda mitad.', fuente: 'Hall, H.N. (1963), How to analyze waterflood injection well performance, World Oil.', limites: ['Supone flujo estabilizado (pseudo-estacionario) en cada período.', 'La presión media del reservorio constante es una aproximación: usá la medida si existe.', 'El cambio de pendiente indica síntoma, no causa: confirmar con perfil de inyección y análisis de fall-off.', 'Con menos de 6 períodos la tendencia es poco confiable.'], unidades: 'Días, bbl, psi.' },
    pasos: [{ titulo: 'Historia del inyector', intro: 'Un período por fila: días, volumen inyectado y presión de fondo (o de cabeza más hidrostática).', campos: [num_('pavg', 'Presión media del reservorio (si no la carga por fila)', 'psi', 2000), { id: 'filas', tipo: 'tabla', label: 'Períodos', cols: [{ id: 'dias', label: 'Días' }, { id: 'vol', label: 'Volumen', unit: 'bbl' }, { id: 'pwi', label: 'Presión de inyección', unit: 'psi' }, { id: 'pavg', label: 'P media (opc.)', unit: 'psi' }], def: tb([[30, 30000, 2500, ''], [30, 30000, 2510, ''], [30, 30000, 2520, ''], [30, 30000, 2540, ''], [30, 30000, 2580, ''], [30, 30000, 2640, ''], [30, 30000, 2720, ''], [30, 30000, 2820, '']], ['dias', 'vol', 'pwi', 'pavg']) }] }],
    calc: function (v) { return C.hall(v); },
    render: function (r) {
      var out = kpis([kpi('Pendiente 1.ª mitad', fmt(r.s1, 3), 'psi·d/bbl'), kpi('Pendiente 2.ª mitad', fmt(r.s2, 3), 'psi·d/bbl'), kpi('Cambio', fmt(r.cambio * 100, 0), '%', 'main'), kpi('Inyectividad media', fmt(r.iiProm, 2), 'bbl/d/psi')]);
      out += '<p class="nota"><b>Lectura:</b> ' + esc(r.diag) + '.</p>';
      out += lineChart({ series: [{ pts: r.pts.map(function (p) { return [p.w / 1000, p.h]; }), nombre: 'Hall', pt: true }], xl: 'Inyección acumulada (Mbbl)', yl: 'Σ Δp·Δt (psi·día)' });
      out += tabla(['Período', 'Caudal (bbl/d)', 'Δp (psi)', 'Inyectividad (bbl/d/psi)', 'Pendiente (psi·d/bbl)'], r.per.map(function (p, i) { return [i + 1, fmt(p.q, 0), fmt(p.dp, 0), fmt(p.ii, 2), fmt(p.pend, 3)]; }));
      return out + calcBlock([['Hall', 'H = Σ (p_wi − p_prom)·Δt ; W = Σ volumen'], ['Pendientes', 'primera mitad = ' + fmt(r.s1, 3) + ' ; segunda = ' + fmt(r.s2, 3) + ' ; cambio = ' + fmt(r.cambio * 100, 0) + ' %']]);
    }
  });

  /* VRR */
  tool({
    id: 'vrr', grupo: 'Monitoreo', nombre: 'Reposición de vacíos (VRR)', etapas: 'E', pregunta: '¿La inyección repone los vacíos creados por la producción?',
    ficha: { metodo: 'VRR = (Wi·Bw + Gi·Bg)/(Np·Bo + Wp·Bw + (Gp − Np·Rs)·Bg). Se calcula por período y acumulado. VRR ≈ 1 mantiene la presión; < 0,9 despresuriza, > 1,1 represuriza.', fuente: 'Craft & Hawkins, Applied Petroleum Reservoir Engineering; práctica de gestión de recuperación secundaria (Dake, Fundamentals of Reservoir Engineering).', limites: ['No considera influjo de acuífero ni pérdidas de inyección fuera de zona.', 'Un VRR cercano a 1 no garantiza presión estable: confirmar con presiones medidas.', 'Los factores volumétricos deben corresponder a la presión de cada período.'], unidades: 'Volúmenes en bbl (agua y petróleo) y Mscf (gas); Bg en rb/Mscf; Rs en scf/STB.' },
    pasos: [{ titulo: 'Volúmenes por período', intro: 'Inyección y producción a condiciones de superficie y sus factores de volumen.', campos: [{ id: 'filas', tipo: 'tabla', label: 'Períodos', cols: [{ id: 'per', label: 'Período', texto: true }, { id: 'winj', label: 'Agua iny.', unit: 'bbl' }, { id: 'np', label: 'Np', unit: 'STB' }, { id: 'wp', label: 'Wp', unit: 'bbl' }, { id: 'gp', label: 'Gp', unit: 'Mscf' }, { id: 'bo', label: 'Bo' }, { id: 'bw', label: 'Bw' }, { id: 'bg', label: 'Bg', unit: 'rb/Mscf' }, { id: 'rs', label: 'Rs', unit: 'scf/STB' }], def: tb([['2024-T1', 280000, 150000, 90000, 60000, 1.25, 1.02, 1.1, 300], ['2024-T2', 300000, 145000, 105000, 58000, 1.25, 1.02, 1.1, 300], ['2024-T3', 290000, 140000, 120000, 56000, 1.25, 1.02, 1.1, 300], ['2024-T4', 280000, 135000, 130000, 54000, 1.25, 1.02, 1.1, 300]], ['per', 'winj', 'np', 'wp', 'gp', 'bo', 'bw', 'bg', 'rs']) }] }],
    calc: function (v) { return C.vrr(v); },
    render: function (r) {
      var out = kpis([kpi('VRR acumulado', fmt(r.vrrAcum, 2), '', 'main'), kpi('VRR último período', fmt(r.vrrUlt, 2))]) + '<p class="nota"><b>Lectura:</b> ' + esc(r.diag) + '.</p>';
      out += lineChart({ series: [{ pts: r.filas.map(function (f, i) { return [i + 1, f.vrr]; }), nombre: 'VRR del período', pt: true }, { pts: r.filas.map(function (f, i) { return [i + 1, f.acum]; }), nombre: 'VRR acumulado', c: 1 }], hlines: [{ y: 1, label: 'VRR = 1' }], xl: 'Período', yl: 'VRR' });
      out += tabla(['Período', 'Inyección (rb)', 'Producción (rb)', 'VRR', 'VRR acum.'], r.filas.map(function (f) { return [esc(f.per), fmt(f.iny, 0), fmt(f.prod, 0), fmt(f.vrr, 2), fmt(f.acum, 2)]; }));
      return out + calcBlock([['VRR', '(Wi·Bw + Gi·Bg)/(Np·Bo + Wp·Bw + (Gp − Np·Rs/1000)·Bg)'], ['Acumulado', 'Σ inyección/Σ producción en condiciones de reservorio = ' + fmt(r.vrrAcum, 3)]]);
    }
  });

  /* CO2 */
  tool({
    id: 'co2', grupo: 'Integridad', nombre: 'Corrosión por CO₂ (de Waard–Milliams)', etapas: 'C D E', pregunta: '¿Qué velocidad de corrosión por CO₂ esperar en acero al carbono?',
    ficha: { metodo: 'log₁₀(CR) = 5,8 − 1710/T + 0,67·log₁₀(fCO₂), con CR en mm/año, T en K y fCO₂ = φ·pCO₂ (fugacidad, φ = 10^(P·(0,0031 − 1,4/T)), P en bar). Con incrustación de FeCO₃ se multiplica por Fs = 10^(2400/T − 0,6·log₁₀ fCO₂ − 6,7) cuando T supera el umbral.', fuente: 'de Waard, C. & Milliams, D.E. (1975), Corrosion 31(5); de Waard, C., Lotz, U. & Milliams, D.E. (1991), Corrosion 47(12).', limites: ['Screening conservador: no considera pH, inhibidor, régimen de flujo ni condensado de agua.', 'Rango habitual de pCO₂ 0,1–10 bar y T 5–150 °C.', 'Para diseño usá NORSOK M-506, ECE o Cassandra y validá con datos de campo.', 'Presencia de H₂S requiere análisis de agriado (NACE MR0175 / ISO 15156).'], unidades: 'T en °C, presiones en bar, velocidad en mm/año (y mpy).' },
    pasos: [{ titulo: 'Condiciones de servicio', intro: 'Ingresá la presión parcial de CO₂, o la fracción molar para calcularla.', campos: [num_('T', 'Temperatura', '°C', 60), num_('P', 'Presión total', 'bar', 50), num_('pCO2', 'Presión parcial de CO₂ (si la conocés)', 'bar', 2), num_('yCO2', 'Fracción molar de CO₂ (si no cargó la presión parcial)', '', '')] }],
    calc: function (v) { return C.co2corr(v); },
    render: function (r, v) {
      var pts = [], t, T0 = num(v.T), pp = num(v.pCO2) > 0 ? num(v.pCO2) : num(v.yCO2) * num(v.P);
      for (t = 20; t <= 140; t += 5) { var x = C.co2corr({ T: t, P: num(v.P), pCO2: pp }); if (!x.errores.length) pts.push([t, x.cr]); }
      var sev = r.cr < 0.1 ? 'baja' : r.cr < 0.5 ? 'moderada' : r.cr < 1 ? 'alta' : 'muy alta';
      var out = kpis([kpi('Velocidad de corrosión', fmt(r.cr, 2), 'mm/año', 'main'), kpi('En milésimas de pulgada', fmt(r.mpy, 1), 'mpy'), kpi('Sin incrustación', fmt(r.crSin, 2), 'mm/año'), kpi('Factor de incrustación', fmt(r.fs, 2)), kpi('Fugacidad de CO₂', fmt(r.f, 2), 'bar'), kpi('Lectura orientativa', sev)]);
      out += lineChart({ series: [{ pts: pts, nombre: 'Velocidad de corrosión' }], xl: 'Temperatura (°C)', yl: 'mm/año', hlines: [{ y: r.cr, label: 'caso actual' }] });
      return out + nota('Clasificación orientativa de H3L (&lt; 0,1 baja · 0,1–0,5 moderada · 0,5–1 alta · &gt; 1 muy alta); no es una tabla de NACE.') + calcBlock([['Fugacidad', 'fCO₂ = φ·pCO₂ = ' + fmt(r.phi, 3) + ' × ' + fmt(pp, 3) + ' = ' + fmt(r.f, 3) + ' bar'], ['Velocidad sin capa', 'log₁₀ CR = 5,8 − 1710/T + 0,67·log₁₀ fCO₂ → ' + fmt(r.crSin, 3) + ' mm/año'], ['Incrustación', 'Fs = ' + fmt(r.fs, 3) + ' (umbral ' + fmt(r.tUmbral, 0) + ' °C) → CR = ' + fmt(r.cr, 3) + ' mm/año']]);
    }
  });

  /* Recipientes y ductos */
  tool({
    id: 'recip', grupo: 'Integridad', nombre: 'Espesor de recipientes y ductos, y prueba hidrostática', etapas: 'D E', pregunta: '¿Qué espesor mínimo requiere el equipo y a qué presión probarlo?',
    ficha: { metodo: 'ASME VIII-1: cilindro t = P·R/(S·E − 0,6P) y longitudinal t = P·R/(2S·E + 0,4P); esfera t = P·R/(2S·E − 0,2P); cabezal elipsoidal 2:1 t = P·D/(2S·E − 0,2P). Ducto (Barlow, B31.8): t = P·D/(2·S·F·E·T). Prueba hidrostática: 1,3·MAWP·(S_amb/S_dis) en VIII-1 y 1,5·P·(S_T/S) en B31.3.', fuente: 'ASME Boiler and Pressure Vessel Code, Sección VIII División 1 (UG-27, UG-32, UG-99); ASME B31.8; ASME B31.3.', limites: ['Espesor mínimo requerido por presión interna; sin viento, sismo, peso, boquillas ni fatiga.', 'Cilindros con P > 0,385·S·E salen del alcance de las fórmulas de pared delgada.', 'Ediciones anteriores de VIII-1 usaban 1,5 para la prueba: verificá la edición vigente.', 'El diseño final lo hace el ingeniero responsable según el código aplicable.'], unidades: 'Presiones en psi, esfuerzos en psi, dimensiones en pulgadas.' },
    pasos: [
      { titulo: 'Equipo y material', intro: 'Tipo de equipo, presión de diseño y esfuerzo admisible del material a la temperatura de diseño.', campos: [sel_('tipo', 'Tipo', [['cil', 'Recipiente cilíndrico (casco)'], ['esf', 'Esfera / cabezal hemisférico'], ['elip', 'Cabezal elipsoidal 2:1'], ['ducto', 'Ducto (B31.8)']], 'cil'), num_('P', 'Presión de diseño', 'psi', 300), num_('D', 'Diámetro interior (ductos: exterior)', 'pulg', 60), num_('S', 'Esfuerzo admisible (ductos: SMYS)', 'psi', 20000), num_('E', 'Eficiencia de junta', '', 0.85), num_('CA', 'Sobreespesor por corrosión', 'pulg', 0.0625)] },
      { titulo: 'Factores de ducto y verificación', intro: 'F y T solo aplican a ductos. El espesor nominal sirve para calcular la MAWP real.', campos: [num_('F', 'Factor de diseño (B31.8)', '', 0.72, null, { si: function (v) { return v.tipo === 'ducto'; } }), num_('Tf', 'Factor de temperatura', '', 1, null, { si: function (v) { return v.tipo === 'ducto'; } }), num_('tNom', 'Espesor nominal disponible (opcional)', 'pulg', 0.75), num_('Samb', 'Esfuerzo admisible a temperatura ambiente (para la prueba)', 'psi', 20000)] }
    ],
    calc: function (v) { return C.recipiente(v); },
    render: function (r) {
      var out = kpis([kpi('Espesor mínimo requerido', fmt(r.t, 4), 'pulg', 'main'), kpi('Con sobreespesor', fmt(r.tNom, 4), 'pulg', 'main')].concat(r.mawp ? [kpi('MAWP con el espesor nominal', fmt(r.mawp, 0), 'psi')] : []).concat(r.pruebaVIII ? [kpi('Prueba hidrostática VIII-1 (1,3)', fmt(r.pruebaVIII, 0), 'psi'), kpi('Prueba B31.3 (1,5)', fmt(r.pruebaB313, 0), 'psi')] : []));
      out += tabla(['Fórmula', 'Resultado'], r.formulas.map(function (f) { return [esc(f[0]), esc(f[1])]; }));
      return out + (r.pruebaVIII ? nota('Las pruebas se calculan sobre ' + (r.baseMawp ? 'la MAWP del espesor nominal' : 'la presión de diseño') + '. Usá la que corresponda al código aplicable de tu equipo.') : '') + calcBlock(r.formulas.map(function (f) { return [f[0], f[1] + ' pulg']; }));
    }
  });

  /* Gasoducto */
  tool({
    id: 'gasod', grupo: 'Superficie', nombre: 'Flujo de gas en gasoductos (Weymouth y Panhandle B)', etapas: 'C D', pregunta: '¿Qué caudal transporta el gasoducto con la caída de presión disponible?',
    ficha: { metodo: 'Weymouth: Q = 433,5·E·(Tb/Pb)·[(P1² − P2²)/(G·T·L·Z)]^0,5·D^2,667. Panhandle B: Q = 737·E·(Tb/Pb)^1,02·[(P1² − P2²)/(G^0,961·T·L·Z)]^0,51·D^2,53. Q en scfd, P en psia, T en °R, L en millas, D en pulgadas.', fuente: 'Weymouth, T.R. (1912), Trans. ASME 34; GPSA Engineering Data Book (sección de flujo en tuberías); ecuación Panhandle B (Menon).', limites: ['Horizontal, isotérmico, z constante y flujo estacionario.', 'Por encima de ~1500 psia usar la ecuación general con z variable.', 'La eficiencia E agrupa la rugosidad y el ensuciamiento; debe calibrarse con operación real.', 'No incluye accesorios ni líneas con elevación importante.'], unidades: 'P en psia, T en °F, L en millas, D en pulgadas, Q en scfd.' },
    pasos: [{ titulo: 'Línea y gas', intro: 'Geometría, presiones y propiedades del gas.', campos: [num_('P1', 'Presión de entrada', 'psia', 1000), num_('P2', 'Presión de salida', 'psia', 800), num_('D', 'Diámetro interior', 'pulg', 12.09), num_('L', 'Longitud', 'millas', 50), num_('G', 'Densidad relativa del gas', '', 0.6), num_('T', 'Temperatura media de flujo', '°F', 60), num_('Z', 'Factor z medio', '', 0.9), num_('E', 'Eficiencia', '', 0.92), num_('Tb', 'Temperatura base', '°F', 60), num_('Pb', 'Presión base', 'psia', 14.73)] }],
    calc: function (v) { return C.gasoducto(v); },
    render: function (r) {
      var out = kpis([kpi('Caudal Weymouth', fmt(r.qW / 1e6, 2), 'MMscfd', 'main'), kpi('Caudal Panhandle B', fmt(r.qP / 1e6, 2), 'MMscfd', 'main'), kpi('Panhandle/Weymouth', fmt(r.ratio, 2)), kpi('Velocidad (Weymouth)', fmt(r.vW, 1), 'ft/s'), kpi('Velocidad (Panhandle B)', fmt(r.vP, 1), 'ft/s')]);
      out += lineChart({ series: [{ pts: r.rango.map(function (x) { return [x.q / 1e6, x.p2W]; }), nombre: 'P2 (Weymouth)', pt: true }], xl: 'Caudal (MMscfd)', yl: 'Presión de salida (psia)' });
      out += tabla(['Fracción del caudal Weymouth', 'Caudal (MMscfd)', 'P2 (psia)'], r.rango.map(function (x) { return [fmt(x.m, 2), fmt(x.q / 1e6, 2), fmt(x.p2W, 0)]; }));
      return out + calcBlock([['Weymouth', 'Q = 433,5·E·(Tb/Pb)·[(P1² − P2²)/(G·T·L·Z)]^0,5·D^2,667 = ' + fmt(r.qW, 0) + ' scfd'], ['Panhandle B', 'Q = 737·E·(Tb/Pb)^1,02·[(P1² − P2²)/(G^0,961·T·L·Z)]^0,51·D^2,53 = ' + fmt(r.qP, 0) + ' scfd']]);
    }
  });

  /* Compresión */
  tool({
    id: 'comp', grupo: 'Superficie', nombre: 'Compresión de gas: etapas y potencia', etapas: 'C D', pregunta: '¿Cuántas etapas y qué potencia requiere comprimir el gas?',
    ficha: { metodo: 'Etapas n = menor entero con (P2/P1)^(1/n) ≤ razón máxima. Cabeza adiabática por etapa H = z·R·T1·k/(k−1)·(r^((k−1)/k) − 1); T2 = T1·r^((k−1)/k); potencia = flujo molar·H/(33000·η).', fuente: 'GPSA Engineering Data Book, sección de compresores; Ludwig, Applied Process Design for Chemical and Petrochemical Plants.', limites: ['Termodinámica ideal: no incluye pérdidas mecánicas, caídas en enfriadores ni cambio de z.', 'Mismo z y k en todas las etapas.', 'El dimensionamiento final debe hacerlo el fabricante con las curvas del compresor.', 'Temperatura de descarga > 300 °F requiere más etapas o revisión de límites.'], unidades: 'q en MMscfd, P en psia, T en °F, potencia en hp (y kW).' },
    pasos: [{ titulo: 'Servicio', intro: 'Caudal, presiones, gas y eficiencia.', campos: [num_('q', 'Caudal', 'MMscfd', 10), num_('p1', 'Presión de succión', 'psia', 100), num_('p2', 'Presión de descarga', 'psia', 800), num_('t1', 'Temperatura de succión', '°F', 80), num_('tint', 'Temperatura tras enfriamiento intermedio', '°F', 100), num_('k', 'Exponente adiabático k', '', 1.28), num_('z', 'Factor z', '', 0.95), num_('eta', 'Eficiencia adiabática', '', 0.75), num_('rmax', 'Razón máxima por etapa', '', 4)] }],
    calc: function (v) { return C.compresion(v); },
    render: function (r) {
      var out = kpis([kpi('Etapas', r.ns, '', 'main'), kpi('Razón por etapa', fmt(r.rEtapa, 2)), kpi('Razón total', fmt(r.rTotal, 2)), kpi('Potencia total', fmt(r.hpTot, 0), 'hp', 'main'), kpi('Potencia total', fmt(r.kW, 0), 'kW')]);
      out += tabla(['Etapa', 'Razón', 'T succión (°F)', 'T descarga (°F)', 'Potencia (hp)'], r.etapas.map(function (e) { return [e.n, fmt(e.r, 2), fmt(e.tin, 0), fmt(e.tout, 0), fmt(e.hp, 0)]; }));
      return out + calcBlock([['Etapas', 'n = ' + r.ns + ' (razón total ' + fmt(r.rTotal, 2) + ' ; máx. por etapa)'], ['Temperatura', 'T2 = T1·r^((k−1)/k)'], ['Potencia', 'hp = flujo molar [lbmol/min]·H/(33000·η)']]);
    }
  });

  /* Alivio de gas */
  tool({
    id: 'alivio', grupo: 'Superficie', nombre: 'Válvula de alivio para gas (API 520)', etapas: 'D', pregunta: '¿Qué área de orificio necesita la válvula de seguridad para el caudal de relevo de gas?',
    ficha: { metodo: 'Flujo crítico: A = W/(C·Kd·P1·Kb·Kc)·√(T·Z/M), con C = 520·√(k·(2/(k+1))^((k+1)/(k−1))), P1 = presión de ajuste·(1 + sobrepresión) + 14,7 psia. Selección del orificio estándar API (D a T).', fuente: 'API Standard 520 Parte I (dimensionado); API 521 (caudales de relevo).', limites: ['Supone flujo crítico (contrapresión ≤ presión crítica).', 'El caudal de relevo debe salir del análisis de escenarios API 521.', 'Fases líquida o bifásica requieren otros métodos.', 'No reemplaza el cálculo certificado del fabricante.'], unidades: 'W en lb/h, presiones en psig, T en °F, M en lb/lbmol, A en pulg².' },
    pasos: [{ titulo: 'Escenario de relevo', intro: 'Caudal, condiciones de ajuste y propiedades del gas.', campos: [num_('W', 'Caudal de relevo', 'lb/h', 20000), num_('pset', 'Presión de ajuste', 'psig', 100), num_('sobre', 'Sobrepresión admisible', 'fracción', 0.1, '10 %, 16 % o 21 % según el caso.'), num_('T', 'Temperatura de relevo', '°F', 100), num_('M', 'Peso molecular', 'lb/lbmol', 20), num_('Z', 'Factor z', '', 1), num_('k', 'Exponente k', '', 1.4), num_('Kd', 'Coeficiente de descarga Kd', '', 0.975), num_('Kb', 'Factor de contrapresión Kb', '', 1), num_('Kc', 'Factor de disco de ruptura Kc', '', 1)] }],
    calc: function (v) { return C.alivioGas(v); },
    render: function (r) {
      var out = kpis([kpi('Área requerida', fmt(r.A, 3), 'pulg²', 'main'), kpi('Orificio API', esc(r.orificio), '', 'main'), kpi('Área del orificio', fmt(r.areaOrif, 3), 'pulg²'), kpi('Margen', fmt(r.margen * 100, 0), '%'), kpi('Coeficiente C', fmt(r.C, 1)), kpi('P1 de relevo', fmt(r.P1, 1), 'psia')].concat(r.extra ? [kpi('Válvulas en paralelo', r.extra)] : []));
      return out + calcBlock([['Presión de relevo', 'P1 = pset·(1 + sobrepresión) + 14,7 = ' + fmt(r.P1, 1) + ' psia'], ['Coeficiente', 'C = 520·√(k·(2/(k+1))^((k+1)/(k−1))) = ' + fmt(r.C, 1)], ['Área', 'A = W/(C·Kd·P1·Kb·Kc)·√(T·Z/M) = ' + fmt(r.A, 3) + ' pulg²']]);
    }
  });

  /* Costo nivelado */
  tool({
    id: 'lcoe', grupo: 'Transición energética', nombre: 'Costo nivelado de energía (LCOE / LCOH)', etapas: 'V C D', pregunta: '¿Cuánto cuesta producir una unidad de energía o hidrógeno durante la vida del proyecto?',
    ficha: { metodo: 'LCOE = [I₀ + Σ (O&M_t + combustible_t + reemplazos_t)/(1 + r)^t − valor residual/(1 + r)^N] / Σ E_t/(1 + r)^t, con E_t = E₁·(1 − d)^(t−1). Sirve igual para LCOH con producción en kg de H₂.', fuente: 'IEA/NEA, Projected Costs of Generating Electricity; NREL, Annual Technology Baseline (metodología de LCOE).', limites: ['No incluye impuestos, subsidios, costos de red ni de almacenamiento.', 'Moneda constante si todas las entradas lo están.', 'Para comparar tecnologías usá la misma tasa y base de moneda.', 'El LCOE ignora el perfil horario de valor (no distingue energía firme de intermitente).'], unidades: 'Inversión en USD, costos anuales en USD/año, producción en MWh/año o kg/año.' },
    pasos: [{ titulo: 'Proyecto', intro: 'Inversión, costos anuales y producción.', campos: [num_('capex', 'Inversión inicial', 'USD', 100000000), num_('om', 'O&M fijo anual', 'USD/año', 2000000), num_('comb', 'Costo variable por unidad producida', 'USD/unidad', 0), num_('prod', 'Producción del primer año', 'unidades/año', 350000), num_('vida', 'Vida útil', 'años', 25), num_('r', 'Tasa de descuento', 'fracción', 0.08), num_('deg', 'Degradación anual', 'fracción', 0.005), num_('repl', 'Costo de reemplazo (opcional)', 'USD', 0), num_('anioRepl', 'Año del reemplazo', '', 12), num_('valRes', 'Valor residual', 'USD', 0)] }],
    calc: function (v) { return C.costoNivelado(v); },
    render: function (r) {
      var tot = r.partes.reduce(function (s, p) { return s + Math.abs(p[1]); }, 0) || 1;
      var out = kpis([kpi('Costo nivelado', fmt(r.lc, 2), 'USD/unidad', 'main'), kpi('Costo total (VP)', fmt(r.costoTotal / 1e6, 1), 'MM USD'), kpi('Producción descontada', fmt(r.vpE, 0), 'unidades')]);
      out += hbars(r.partes.filter(function (p) { return p[1] !== 0; }).map(function (p) { return { label: p[0], val: Math.abs(p[1]), txt: fmt(p[1] / 1e6, 1) + ' MM USD · ' + fmt(p[1] / r.vpE, 2) + ' USD/u', cls: p[1] < 0 ? 'ok' : '' }; }), tot);
      return out + calcBlock([['Costo VP', 'I₀ + Σ costos/(1 + r)^t − residual = ' + fmt(r.costoTotal, 0) + ' USD'], ['Producción VP', 'Σ E₁(1 − d)^(t−1)/(1 + r)^t = ' + fmt(r.vpE, 0)], ['LCOE', 'costo VP/producción VP = ' + fmt(r.lc, 3) + ' USD/unidad']]);
    }
  });

  /* Valor de la información */
  tool({
    id: 'voi', grupo: 'Evaluación de proyectos', nombre: 'Valor de la información (VPI y VOI)', etapas: 'C D', pregunta: '¿Conviene pagar por un estudio o prueba antes de decidir?',
    ficha: { metodo: 'Valor de la información perfecta VPI = Σ p(x)·máx_a v(a,x) − máx_a E[v]. Información imperfecta: VOI = Σ_y p(y)·máx_a E[v|y] − máx_a E[v], con p(x|y) por Bayes, a partir de sensibilidad y especificidad de la señal.', fuente: 'Newendorp, P.D. & Schuyler, J.R. (2000), Decision Analysis for Petroleum Exploration, 2.ª ed.; Raiffa, H. & Schlaifer, R. (1961), Applied Statistical Decision Theory.', limites: ['Valor esperado con neutralidad al riesgo.', 'Los valores presentes de cada acción deben estar netos de costos.', 'La sensibilidad y especificidad deben salir de experiencia en la cuenca.', 'Resultado binario (éxito/fracaso) y señal binaria.'], unidades: 'Valores en MM USD (o la misma unidad económica); probabilidades en fracción.' },
    pasos: [
      { titulo: 'Incertidumbre y herramienta', intro: 'Probabilidad a priori y confiabilidad de la señal.', campos: [num_('pe', 'Probabilidad a priori de éxito', 'fracción', 0.3), num_('sens', 'Sensibilidad: P(señal + | éxito)', 'fracción', 0.95), num_('espec', 'Especificidad: P(señal − | fracaso)', 'fracción', 0.9), num_('costo', 'Costo de obtener la información', 'MM USD', 0.5)] },
      { titulo: 'Acciones y valores', intro: 'Valor presente de cada acción según el resultado.', campos: [{ id: 'acciones', tipo: 'tabla', label: 'Acciones', cols: [{ id: 'nombre', label: 'Acción', texto: true }, { id: 'vExito', label: 'Valor si hay éxito', unit: 'MM USD' }, { id: 'vFallo', label: 'Valor si hay fracaso', unit: 'MM USD' }], def: tb([['Perforar', 100, -40], ['No perforar', 0, 0]], ['nombre', 'vExito', 'vFallo']) }] }
    ],
    calc: function (v) { return C.valorInformacion(v); },
    render: function (r) {
      var out = kpis([kpi('VME sin información', fmt(r.prior.v, 2), 'MM USD'), kpi('Decisión sin información', esc(r.prior.n)), kpi('VPI (perfecta)', fmt(r.vpi, 2), 'MM USD'), kpi('VOI (imperfecta)', fmt(r.voi, 2), 'MM USD', 'main'), kpi('VOI neto del costo', fmt(r.neto, 2), 'MM USD', r.neto > 0 ? 'ok' : '')]);
      out += tabla(['Señal', 'Probabilidad', 'P(éxito | señal)', 'Mejor acción', 'VME'], [['Positiva', fmt(r.pPos, 3), fmt(r.postPos, 3), esc(r.bPos.n), fmt(r.bPos.v, 2)], ['Negativa', fmt(r.pNeg, 3), fmt(r.postNeg, 3), esc(r.bNeg.n), fmt(r.bNeg.v, 2)]]);
      out += '<p class="nota"><b>Lectura:</b> ' + (r.neto > 0 ? 'conviene pagar por la información: su valor esperado supera el costo.' : 'no conviene pagarla en estas condiciones.') + '</p>';
      return out + calcBlock([['Bayes', 'P(éxito | +) = sens·P/(sens·P + (1 − espec)(1 − P)) = ' + fmt(r.postPos, 4)], ['VOI', 'Σ p(y)·máx E[v|y] − máx E[v] = ' + fmt(r.imp, 3) + ' − ' + fmt(r.prior.v, 3) + ' = ' + fmt(r.voi, 3)], ['VPI', 'p·máx v(éxito) + (1 − p)·máx v(fracaso) − máx E[v] = ' + fmt(r.vpi, 3)]]);
    }
  });

  /* Cartera */
  tool({
    id: 'cartera', grupo: 'Evaluación de proyectos', nombre: 'Cartera de prospectos y presupuesto', etapas: 'C D', pregunta: '¿Qué prospectos perforar con el presupuesto disponible para maximizar el valor esperado?',
    ficha: { metodo: 'VME_i = Pc_i·VP_i − (1 − Pc_i)·Costo_i ; eficiencia de inversión = VME_i/Costo_i. Selección por búsqueda exhaustiva (hasta 16 prospectos) del subconjunto que maximiza el VME total sin superar el presupuesto, y comparación con la selección voraz por eficiencia.', fuente: 'Rose, P.R. (2001), Risk Analysis in Petroleum Exploration, AAPG; Newendorp & Schuyler (2000), Decision Analysis for Petroleum Exploration.', limites: ['Prospectos independientes: no modela riesgo compartido ni inversión en etapas.', 'Neutralidad al riesgo: carteras reales pueden requerir aversión al riesgo o diversificación.', 'Pc debe ser la probabilidad comercial (ver método de Rose).', 'El presupuesto se trata como restricción dura de un único período.'], unidades: 'Pc en fracción; VP y costo en MM USD.' },
    pasos: [{ titulo: 'Prospectos', intro: 'Probabilidad comercial, valor presente en caso de éxito y costo del pozo.', campos: [num_('presupuesto', 'Presupuesto de exploración', 'MM USD', 30), { id: 'filas', tipo: 'tabla', label: 'Prospectos', cols: [{ id: 'nombre', label: 'Prospecto', texto: true }, { id: 'pc', label: 'Pc' }, { id: 'vp', label: 'VP en éxito', unit: 'MM USD' }, { id: 'costo', label: 'Costo', unit: 'MM USD' }], def: tb([['A', 0.3, 200, 20], ['B', 0.25, 150, 15], ['C', 0.4, 80, 15], ['D', 0.15, 400, 25]], ['nombre', 'pc', 'vp', 'costo']) }] }],
    calc: function (v) { return C.cartera(v); },
    render: function (r) {
      var out = kpis([kpi('VME de la cartera óptima', fmt(r.vmeSel, 2), 'MM USD', 'main'), kpi('Costo de la cartera', fmt(r.costoSel, 1), 'MM USD'), kpi('Prospectos elegidos', r.sel.map(function (s) { return esc(s.n); }).join(', ') || 'ninguno'), kpi('P(al menos un éxito)', fmt(r.pAlguno * 100, 0), '%'), kpi('VME voraz', fmt(r.vmeGreedy, 2), 'MM USD')]);
      out += hbars(r.filas.map(function (f) { return { label: f.n, val: Math.max(0, f.vme), txt: 'VME ' + fmt(f.vme, 1) + ' · ef. ' + fmt(f.ef, 2), cls: r.sel.indexOf(f) >= 0 ? '' : 'warn' }; }));
      out += tabla(['Prospecto', 'Pc', 'VP en éxito', 'Costo', 'VME', 'Eficiencia'], r.filas.map(function (f) { return [esc(f.n), fmt(f.pc, 2), fmt(f.vp, 1), fmt(f.costo, 1), fmt(f.vme, 2), fmt(f.ef, 2)]; }));
      return out + calcBlock([['VME', 'Pc·VP − (1 − Pc)·Costo'], ['Selección', 'Se evalúan los ' + Math.pow(2, r.filas.length) + ' subconjuntos y se elige el de mayor VME con costo ≤ ' + fmt(r.presupuesto, 1)]]);
    }
  });

  /* Mezcla */
  tool({
    id: 'mezcla', grupo: 'Evaluación de proyectos', nombre: 'Mezcla de crudos y combustibles', etapas: 'C D', pregunta: '¿Qué gravedad API, azufre y viscosidad tendrá la mezcla?',
    ficha: { metodo: 'Densidad relativa por volumen (mezcla ideal), SG = 141,5/(131,5 + API). Azufre ponderado por masa. Viscosidad por el índice Refutas: VBN = 14,534·ln(ln(ν + 0,8)) + 10,975, ponderado por fracción másica; ν = exp(exp((VBN_mezcla − 10,975)/14,534)) − 0,8.', fuente: 'Índice de mezcla de viscosidad Refutas (Maples, Petroleum Refinery Process Economics); definición API del Instituto Americano del Petróleo.', limites: ['Sin contracción volumétrica.', 'Propiedades no lineales (RVP, punto de fluidez, octanaje, asfaltenos) requieren índices específicos y ensayos.', 'Refutas es poco confiable con viscosidades < 2 cSt.', 'Incompatibilidad de crudos (precipitación de asfaltenos) no se evalúa.'], unidades: 'Volúmenes en cualquier unidad común, API en grados, azufre en % m/m, viscosidad cinemática en cSt a la misma temperatura.' },
    pasos: [{ titulo: 'Componentes', intro: 'Volumen, gravedad API, azufre y viscosidad cinemática (opcional) de cada corriente.', campos: [{ id: 'filas', tipo: 'tabla', label: 'Corrientes', cols: [{ id: 'nombre', label: 'Componente', texto: true }, { id: 'vol', label: 'Volumen' }, { id: 'api', label: 'API', unit: '°API' }, { id: 'azufre', label: 'Azufre', unit: '% m/m' }, { id: 'visc', label: 'Viscosidad', unit: 'cSt' }], def: tb([['Crudo liviano', 60000, 38, 0.3, 5], ['Crudo pesado', 40000, 18, 2.8, 150]], ['nombre', 'vol', 'api', 'azufre', 'visc']) }] }],
    calc: function (v) { return C.mezcla(v); },
    render: function (r) {
      var out = kpis([kpi('Volumen total', fmt(r.vt, 0)), kpi('Gravedad API', fmt(r.api, 1), '°API', 'main'), kpi('Densidad relativa', fmt(r.sg, 4)), kpi('Azufre', fmt(r.azufre, 2), '% m/m', 'main')].concat(r.visc != null ? [kpi('Viscosidad', fmt(r.visc, 1), 'cSt', 'main')] : []));
      out += tabla(['Componente', 'Fracción volumétrica', 'Fracción másica', 'Densidad relativa'], r.filas.map(function (f) { return [esc(f.n), fmt(f.x * 100, 1) + ' %', fmt(f.w * 100, 1) + ' %', fmt(f.sg, 4)]; }));
      return out + calcBlock([['Densidad', 'SG = Σ x_vol·SG_i = ' + fmt(r.sg, 4) + ' → API = 141,5/SG − 131,5 = ' + fmt(r.api, 1)], ['Azufre', 'S = Σ w_i·S_i = ' + fmt(r.azufre, 3) + ' % m/m'], ['Viscosidad', r.visc != null ? 'VBN = Σ w_i·VBN_i = ' + fmt(r.vbn, 2) + ' → ν = ' + fmt(r.visc, 2) + ' cSt' : 'sin dato de viscosidad en todos los componentes']]);
    }
  });

  /* ====== Herramientas por estrategia de explotación (borrador pendiente de revisión técnica) ====== */
  tool({
    id: 'barrido', grupo: 'Desarrollo', nombre: 'Eficiencia de barrido y heterogeneidad (Dykstra–Parsons)', etapas: 'C D', pregunta: '¿Qué fracción del petróleo recupera la inyección y qué tan heterogéneo es el reservorio?',
    ficha: { metodo: 'Recuperación E_R = E_D · E_A · E_V, con E_D = (1 − Swc − Sor)/(1 − Swc). Coeficiente de Dykstra–Parsons V = (k50 − k84,1)/k50, con las permeabilidades ordenadas de mayor a menor, ubicadas en papel log–probabilidad y ajustadas por regresión (percentil de excedencia). V entre 0,5 y 0,9 es lo habitual.', fuente: 'Craig, F.F. (1971), The Reservoir Engineering Aspects of Waterflooding, SPE Monograph 3; Dykstra, H. & Parsons, R.L. (1950), The prediction of oil recovery by waterflood, API.', limites: ['E_A y E_V no se calculan: deben venir de correlaciones o simulación.', 'La regresión lognormal supone una sola población de permeabilidades.', 'E_D ignora el cambio de Bo entre condiciones inicial y de abandono.', 'V mide heterogeneidad de permeabilidad; no incluye barreras, fracturas ni gravedad.'], unidades: 'Permeabilidad en mD; saturaciones y eficiencias en fracción; N y Np en la misma unidad de volumen.' },
    pasos: [
      { titulo: 'Volumen y eficiencias', intro: 'Petróleo en sitio a barrer y las eficiencias areal y vertical.', campos: [num_('N', 'Petróleo original a barrer', 'MMSTB', 100), num_('swc', 'Saturación de agua connata (Swc)', '', 0.2), num_('sor', 'Petróleo residual (Sor)', '', 0.3), num_('ea', 'Eficiencia de barrido areal (E_A)', '', 0.7), num_('ev', 'Eficiencia de barrido vertical (E_V)', '', 0.8)] },
      { titulo: 'Permeabilidades de núcleo (opcional)', intro: 'Al menos 5 valores de la zona de pago para calcular el coeficiente de Dykstra–Parsons.', campos: [{ id: 'filas', tipo: 'tabla', label: 'Permeabilidades', cols: [{ id: 'k', label: 'Permeabilidad', unit: 'mD' }], def: [350, 220, 180, 140, 110, 90, 70, 55, 40, 25, 15, 8].map(function (k) { return { k: k }; }) }] }
    ],
    calc: function (v) { return C.barrido(v); },
    render: function (r) {
      var out = kpis([kpi('Eficiencia de desplazamiento E_D', fmt(r.ed, 3)), kpi('Recuperación total E_R', fmt(r.er * 100, 1), '%', 'main'), kpi('Petróleo recuperado', fmt(r.np, 1)), kpi('Petróleo remanente', fmt(r.restante, 1))].concat(r.V != null ? [kpi('Dykstra–Parsons V', fmt(r.V, 2), '', 'main'), kpi('k50', fmt(r.k50, 1), 'mD'), kpi('k84,1', fmt(r.k841, 1), 'mD'), kpi('Lectura', esc(r.clase))] : []));
      out += hbars([{ label: 'E_D', val: r.ed, txt: fmt(r.ed * 100, 0) + ' %' }, { label: 'E_A', val: r.ea, txt: fmt(r.ea * 100, 0) + ' %' }, { label: 'E_V', val: r.ev, txt: fmt(r.ev * 100, 0) + ' %' }, { label: 'E_R', val: r.er, txt: fmt(r.er * 100, 1) + ' %', cls: 'warn' }], 1);
      return out + calcBlock([['Desplazamiento', 'E_D = (1 − Swc − Sor)/(1 − Swc) = ' + fmt(r.ed, 4)], ['Recuperación', 'E_R = E_D·E_A·E_V = ' + fmt(r.ed, 3) + '·' + fmt(r.ea, 2) + '·' + fmt(r.ev, 2) + ' = ' + fmt(r.er, 4)]].concat(r.V != null ? [['Dykstra–Parsons', 'ln k = a + b·z (z = Φ⁻¹ del percentil de excedencia): V = (k50 − k84,1)/k50 = ' + fmt(r.V, 3) + ' (' + r.nK + ' valores, R² = ' + fmt(r.r2k, 2) + ')']] : []));
    }
  });

  tool({
    id: 'polim', grupo: 'Desarrollo', nombre: 'Polímero vs. agua: control de movilidad', etapas: 'C D', pregunta: '¿Cuánto mejora el desplazamiento al inyectar polímero en lugar de agua?',
    ficha: { metodo: 'Buckley–Leverett con permeabilidades de Corey y viscosidad del agua reemplazada por la efectiva de la solución de polímero. Se comparan la razón de movilidad, la ruptura y la recuperación a distintos volúmenes porales inyectados (PVI). Antes de la ruptura el petróleo producido iguala el volumen inyectado.', fuente: 'Buckley & Leverett (1942), Trans. AIME 146; Welge (1952), J. Pet. Tech. 4(4); Corey (1954); Sorbie, K.S. (1991), Polymer-Improved Oil Recovery.', limites: ['Viscosidad efectiva de la solución constante: no modela adsorción, degradación ni reducción de permeabilidad.', 'Inyección continua de solución: no representa un bache de polímero seguido de agua.', '1D, sin gravedad, capilaridad ni heterogeneidad vertical.', 'No sustituye el diseño de laboratorio (reología en medio poroso, retención).'], unidades: 'Viscosidades en cP, saturaciones en fracción, recuperación en volumen poral (PV).' },
    pasos: [{ titulo: 'Curvas, fluidos y polímero', intro: 'Mismas curvas y fluidos que la inyección de agua; agregá la viscosidad efectiva de la solución en reservorio.', campos: [num_('swc', 'Saturación de agua connata (Swc)', '', 0.2), num_('sor', 'Petróleo residual (Sor)', '', 0.2), num_('krwMax', 'krw en Sor', '', 0.4), num_('kroMax', 'kro en Swc', '', 0.9), num_('nw', 'Exponente del agua', '', 2), num_('no', 'Exponente del petróleo', '', 2), num_('muw', 'Viscosidad del agua', 'cP', 1), num_('muo', 'Viscosidad del petróleo', 'cP', 20), num_('muPol', 'Viscosidad efectiva de la solución de polímero', 'cP', 15)] }],
    calc: function (v) { return C.polimero(v); },
    render: function (r) {
      var out = kpis([kpi('Razón de movilidad con agua', fmt(r.mAgua, 2)), kpi('Razón de movilidad con polímero', fmt(r.mPol, 2), '', 'main'), kpi('PVI a la ruptura (agua)', fmt(r.agua.pviBt, 2), 'PV'), kpi('PVI a la ruptura (polímero)', fmt(r.pol.pviBt, 2), 'PV'), kpi('Recuperación a 1 PVI: agua', fmt(r.filas[3].agua, 3), 'PV'), kpi('Recuperación a 1 PVI: polímero', fmt(r.filas[3].pol, 3), 'PV', 'main')]);
      out += lineChart({ series: [{ pts: r.curvaA, nombre: 'Agua' }, { pts: r.curvaB, nombre: 'Polímero', c: 1 }], xl: 'Volúmenes porales inyectados (PVI)', yl: 'Petróleo recuperado (PV)' });
      out += tabla(['PVI', 'Agua (PV)', 'Polímero (PV)', 'Ganancia (PV)', 'Ganancia relativa'], r.filas.map(function (f) { return [fmt(f.pvi, 2), fmt(f.agua, 3), fmt(f.pol, 3), fmt(f.dif, 3), f.difRel == null ? '—' : fmt(f.difRel * 100, 1) + ' %']; }));
      return out + calcBlock([['Movilidad', 'M = (krw_max/μ)/(kro_max/μo): agua ' + fmt(r.mAgua, 2) + ' → polímero ' + fmt(r.mPol, 2)], ['Ruptura', 'PVI = 1/fw′(Swf): ' + fmt(r.agua.pviBt, 3) + ' → ' + fmt(r.pol.pviBt, 3)]]);
    }
  });

  tool({
    id: 'capil', grupo: 'Desarrollo', nombre: 'Número capilar y reducción de tensión interfacial', etapas: 'C D', pregunta: '¿Qué tensión interfacial hace falta para movilizar el petróleo residual?',
    ficha: { metodo: 'Número capilar N_c = v·μ/σ (adimensional; v velocidad de Darcy del fluido desplazante, μ su viscosidad, σ la tensión interfacial). La tensión interfacial requerida para alcanzar un N_c objetivo es σ = v·μ/N_c.', fuente: 'Lake, L.W. (1989), Enhanced Oil Recovery, Prentice Hall; Green & Willhite (1998), Enhanced Oil Recovery, SPE Textbook 6.', limites: ['El N_c crítico y la curva de desaturación dependen de la roca y se miden en laboratorio.', 'La velocidad cerca del pozo y la del frente difieren mucho: usá la del sector de interés.', 'No incluye mojabilidad ni retención del surfactante.', 'Los umbrales citados son órdenes de magnitud, no valores de diseño.'], unidades: 'v en ft/d; μ en cP; σ en mN/m (dina/cm); q en bbl/d; área en ft².' },
    pasos: [{ titulo: 'Condiciones de inyección', intro: 'Ingresá la velocidad directamente o calculala con caudal y área transversal.', campos: [num_('v', 'Velocidad de Darcy (si la conocés)', 'ft/d', ''), num_('q', 'Caudal de inyección', 'bbl/d', 500), num_('area', 'Área transversal al flujo', 'ft²', 5000), num_('mu', 'Viscosidad del fluido desplazante', 'cP', 1), num_('sigma', 'Tensión interfacial actual', 'mN/m', 30), num_('nObj', 'Número capilar objetivo', '', 0.001)] }],
    calc: function (v) { return C.capilar(v); },
    render: function (r) {
      return kpis([kpi('Velocidad de Darcy', fmt(r.v, 3), 'ft/d'), kpi('Número capilar actual', r.nc.toExponential(2).replace('.', ','), '', 'main'), kpi('Objetivo', r.objetivo.toExponential(1).replace('.', ',')), kpi('σ requerida', fmt(r.sigmaReq, 5), 'mN/m', 'main'), kpi('Reducción de σ necesaria', fmt(r.reduccion, 0), '× (actual/requerida)')]) +
        nota('Ordenes de magnitud de la literatura: inyección de agua ≈ 10⁻⁷ a 10⁻⁶; movilizar petróleo residual requiere del orden de 10⁻³ o más. Confirmá con la curva de desaturación medida.') + calcBlock([['Velocidad', 'v = q·5,615/A = ' + fmt(r.v, 3) + ' ft/d = ' + r.vSI.toExponential(2).replace('.', ',') + ' m/s'], ['Número capilar', 'N_c = v·μ/σ = ' + r.nc.toExponential(2).replace('.', ',')], ['σ requerida', 'σ = v·μ/N_c,obj = ' + fmt(r.sigmaReq, 5) + ' mN/m']]);
    }
  });

  tool({
    id: 'arpsmod', grupo: 'Grupo de Estudios', nombre: 'Declinación modificada para no convencionales (Arps con límite terminal)', etapas: 'C D E', pregunta: '¿Qué EUR tiene un pozo no convencional si la declinación hiperbólica pasa a una tasa terminal?',
    ficha: { metodo: 'Hiperbólica q = qi/(1 + b·Di·t)^(1/b) hasta que la declinación instantánea D(t) = Di/(1 + b·Di·t) cae a la nominal mínima Dmin = −ln(1 − De_min); después exponencial q = q_sw·exp(−Dmin·(t − t_sw)). t_sw = (Di/Dmin − 1)/(b·Di). EUR por integración diaria hasta el límite o el horizonte.', fuente: 'Arps, J.J. (1945), Trans. AIME 160; práctica de declinación modificada con límite terminal (p. ej. Robertson, S. (1988), USGS Open-File Report 88-0640).', limites: ['La declinación terminal es una decisión del evaluador: se contrasta con analogías, no sale del ajuste.', 'qi, Di y b deben ajustarse a la historia del pozo (herramienta de ajuste de Arps) o a analogías.', 'No modela interferencia entre pozos ni cambios operativos.', 'El EUR es de apoyo: reservas PRMS requieren el procedimiento corporativo.'], unidades: 'q en unidades/día (bbl/d o Mscf/d), Di en 1/año nominal, Dmin en fracción efectiva anual, tiempo en años; EUR en las mismas unidades de volumen.' },
    pasos: [{ titulo: 'Parámetros del pozo', intro: 'Caudal inicial y declinación hiperbólica; después la tasa terminal y el límite económico.', campos: [num_('qi', 'Caudal inicial', '/día', 1000), num_('di', 'Declinación inicial nominal (Di)', '1/año', 1.5), num_('b', 'Exponente b', '', 1.2), num_('dmin', 'Declinación terminal efectiva anual', 'fracción', 0.07), num_('qlim', 'Caudal límite económico', '/día', 20), num_('horiz', 'Horizonte máximo', 'años', 30)] }],
    calc: function (v) { return C.arpsMod(v); },
    render: function (r) {
      var out = kpis([kpi('EUR con declinación terminal', fmt(r.eur / 1000, 1), 'miles', 'main'), kpi('EUR hiperbólica pura', fmt(r.eurHip / 1000, 1), 'miles'), kpi('Diferencia', fmt(r.dif * 100, 1), '%'), kpi('Paso a terminal', isFinite(r.tsw) ? fmt(r.tsw, 1) : 'sin paso', isFinite(r.tsw) ? 'años' : ''), kpi('Caudal en el paso', r.qsw == null ? '—' : fmt(r.qsw, 1), '/día'), kpi('Vida hasta el límite', fmt(r.vida, 1), 'años')]);
      out += lineChart({ series: [{ pts: r.curva, nombre: 'Caudal', pt: false }], hlines: r.g.qlim > 0 ? [{ y: r.g.qlim, label: 'límite económico', cls: 'bad' }] : [], xl: 'Años', yl: 'Caudal (/día)' });
      return out + calcBlock([['Declinación nominal mínima', 'Dmin = −ln(1 − ' + fmt(r.g.dmin, 3) + ') = ' + fmt(r.dNomMin, 4) + ' 1/año'], ['Tiempo de paso', isFinite(r.tsw) ? 't_sw = (Di/Dmin − 1)/(b·Di) = ' + fmt(r.tsw, 2) + ' años ; q_sw = ' + fmt(r.qsw, 1) : 'b = 0: declinación exponencial desde el inicio'], ['EUR', 'integral diaria de q(t) = ' + fmt(r.eur, 0)]]);
    }
  });

  tool({
    id: 'duong', grupo: 'Grupo de Estudios', nombre: 'Declinación de Duong: ajuste y EUR', etapas: 'C D E', pregunta: '¿Qué parámetros y EUR da el modelo de Duong para un pozo en flujo lineal?',
    ficha: { metodo: 'q = q₁·t^(−m)·exp[a/(1 − m)·(t^(1−m) − 1)] ; Gp = (q₁/a)·exp[a/(1 − m)·(t^(1−m) − 1)] ; q/Gp = a·t^(−m). Se ajusta ln(q/Gp) contra ln t (pendiente −m, ordenada ln a) y luego q₁ por mínimos cuadrados sobre q = q₁·t_a. Con m > 1 la acumulada converge.', fuente: 'Duong, A.N. (2011), Rate-decline analysis for fracture-dominated shale reservoirs, SPE Reservoir Evaluation & Engineering 14(3), SPE 137748.', limites: ['Fórmulas contrastadas con una referencia secundaria y por consistencia matemática; el revisor debe confirmarlas contra SPE 137748.', 'Requiere flujo lineal dominado por fracturas y datos sin cierres.', 'Si no cargás la acumulada Gp se estima sumando q·Δt de los puntos.', 'El EUR depende del horizonte cuando m ≤ 1.'], unidades: 't en días desde el inicio, q en unidades/día, Gp en las mismas unidades de volumen.' },
    pasos: [
      { titulo: 'Historia de producción', intro: 'Tiempo en días desde el inicio, caudal y (opcional) acumulada real.', campos: [{ id: 'filas', tipo: 'tabla', label: 'Producción', cols: [{ id: 't', label: 'Tiempo', unit: 'd' }, { id: 'q', label: 'Caudal', unit: '/d' }, { id: 'gp', label: 'Acumulada (opc.)' }], def: [[10, 900], [20, 760], [30, 680], [45, 590], [60, 530], [90, 450], [120, 400], [180, 335], [240, 295], [300, 265], [365, 240], [450, 215], [540, 195], [730, 165]].map(function (a) { return { t: a[0], q: a[1], gp: '' }; }) }] },
      { titulo: 'Límite y horizonte', intro: 'Caudal mínimo económico y años de pronóstico.', campos: [num_('qlim', 'Caudal límite económico', '/día', 15), num_('horiz', 'Horizonte', 'años', 30)] }
    ],
    calc: function (v) { return C.duong(v); },
    render: function (r) {
      var out = kpis([kpi('a', fmt(r.a, 3)), kpi('m', fmt(r.m, 3)), kpi('q₁ (a 1 día)', fmt(r.q1, 0), '/día'), kpi('R² de q/Gp', fmt(r.r2, 3)), kpi('EUR', fmt(r.eur / 1000, 1), 'miles', 'main'), kpi('Vida', r.tL ? fmt(r.tL / 365, 1) : fmt(r.horiz, 0), 'años')]);
      out += lineChart({ series: [{ pts: r.datos.map(function (d) { return [d.t / 365, d.q]; }), nombre: 'Datos', nl: true, pt: true }, { pts: r.curva, nombre: 'Duong', c: 1 }], xl: 'Años', yl: 'Caudal (/día)' });
      return out + calcBlock([['Diagnóstico', 'q/Gp = a·t^(−m): m = ' + fmt(r.m, 3) + ' ; a = ' + fmt(r.a, 3) + ' (R² = ' + fmt(r.r2, 3) + ')'], ['q₁', 'q = q₁·t_a: q₁ = ' + fmt(r.q1, 1) + ' /día'], ['EUR', 'Gp = (q₁/a)·exp[a/(1 − m)·(T^(1−m) − 1)] = ' + fmt(r.eur, 0)]]);
    }
  });

  tool({
    id: 'shalegas', grupo: 'Grupo de Estudios', nombre: 'Gas en sitio en shale y tight: libre + adsorbido', etapas: 'V C D', pregunta: '¿Cuánto gas hay en sitio entre libre en poros y adsorbido en la materia orgánica?',
    ficha: { metodo: 'Gas libre G_f = 43.560·A·h·φ·(1 − Sw)/Bg, con Bg = 0,02827·z·T/p (rcf/scf; T en °R). Adsorbido con isoterma de Langmuir: V(p) = V_L·p/(p_L + p) (scf/ton), por la masa de roca = 43.560·A·h·ρ_b·62,428/2000 (toneladas cortas; opción métrica 2204,62). Total = libre + adsorbido.', fuente: 'Langmuir, I. (1918), J. Am. Chem. Soc. 40; Curtis, J.B. (2002), Fractured shale-gas systems, AAPG Bulletin 86(11); Ambrose et al. (2010), SPE 131772 (corrección por volumen de fase adsorbida).', limites: ['Isoterma de Langmuir a temperatura de reservorio y base de tonelada coherente con la medición.', 'No corrige el volumen poral ocupado por la fase adsorbida.', 'z constante y gas sin contaminantes.', 'No incluye gas disuelto en el petróleo ni en el agua.'], unidades: 'Área en acres, espesor en ft, p en psia, T en °F, ρ_b en g/cc, V_L en scf/ton, resultados en scf (y Bcf).' },
    pasos: [
      { titulo: 'Roca y fluidos', intro: 'Volumen de roca y propiedades del espacio poral.', campos: [num_('area', 'Área', 'acres', 640), num_('h', 'Espesor neto', 'ft', 100), num_('phi', 'Porosidad', 'fracción', 0.06), num_('sw', 'Saturación de agua', 'fracción', 0.25), num_('p', 'Presión de reservorio', 'psia', 4000), num_('T', 'Temperatura de reservorio', '°F', 200), num_('z', 'Factor z', '', 0.95), num_('rhoB', 'Densidad de la roca (bulk)', 'g/cc', 2.5)] },
      { titulo: 'Adsorción', intro: 'Parámetros de la isoterma de Langmuir medidos en laboratorio.', campos: [num_('vl', 'Volumen de Langmuir (V_L)', 'scf/ton', 100), num_('pl', 'Presión de Langmuir (p_L)', 'psia', 650), sel_('ton', 'Base de tonelada del V_L', [['sh', 'Tonelada corta (2000 lb)'], ['met', 'Tonelada métrica (2204,62 lb)']], 'sh')] }
    ],
    calc: function (v) { return C.shaleGas(v); },
    render: function (r) {
      var out = kpis([kpi('Gas libre', fmt(r.libre / 1e9, 1), 'Bcf'), kpi('Gas adsorbido', fmt(r.ads / 1e9, 1), 'Bcf'), kpi('Gas en sitio total', fmt(r.total / 1e9, 1), 'Bcf', 'main'), kpi('Adsorbido / total', fmt(r.fracAds * 100, 0), '%'), kpi('Bg', fmt(r.bg, 5), 'rcf/scf'), kpi('Por sección (640 ac)', fmt(r.porSeccion / 1e9, 1), 'Bcf')]);
      out += lineChart({ series: [{ pts: r.curva.map(function (c) { return [c.p, c.libre]; }), nombre: 'Libre' }, { pts: r.curva.map(function (c) { return [c.p, c.ads]; }), nombre: 'Adsorbido', c: 1 }], xl: 'Presión (psia)', yl: 'Gas (Bcf)' });
      return out + calcBlock([['Bg', '0,02827·z·T/p = ' + fmt(r.bg, 6) + ' rcf/scf'], ['Libre', '43.560·A·h·φ·(1 − Sw)/Bg = ' + fmt(r.libre / 1e9, 2) + ' Bcf'], ['Adsorbido', 'V_L·p/(p_L + p) = ' + fmt(r.vads, 1) + ' scf/ton × ' + fmt(r.tons / 1e6, 2) + ' MM ton = ' + fmt(r.ads / 1e9, 2) + ' Bcf']]);
    }
  });

  tool({
    id: 'offshore', grupo: 'Perforación', nombre: 'Sobrecarga offshore y margen del riser', etapas: 'C D', pregunta: '¿Cuál es la sobrecarga con tirante de agua y qué densidad necesita el lodo si se desconecta el riser?',
    ficha: { metodo: 'Sobrecarga Sv = 0,052·(ρ_agua·WD + Σ ρ_i·Δz_i), con densidades en ppg y profundidades en ft; el air gap no aporta. Margen del riser: densidad que balancea los poros con solo agua de mar sobre el lecho: MW_rm = (Pp − 0,052·ρ_agua·WD)/(0,052·H), H = TVD − air gap − WD; margen = MW_rm − MW actual.', fuente: 'Derivación hidrostática estándar (Bourgoyne et al., Applied Drilling Engineering, SPE Textbook 2; Rabia, Oilwell Drilling Engineering).', limites: ['Presión estática: no incluye geles, temperatura ni presión de maniobra.', 'La profundidad y la presión de poros equivalente se refieren a la mesa rotary (convención habitual).', 'Densidades de sedimentos de perfil de densidad o extrapolación: son la mayor fuente de incertidumbre.', 'No reemplaza el diseño de pozo de aguas profundas ni el análisis de flujo de agua somero.'], unidades: 'Profundidades en ft, densidades en ppg, presiones en psi.' },
    pasos: [
      { titulo: 'Geometría y agua', intro: 'Todas las profundidades desde la mesa rotary.', campos: [num_('ag', 'Air gap', 'ft', 80), num_('wd', 'Tirante de agua', 'ft', 3000), num_('rhoSw', 'Densidad del agua de mar', 'ppg', 8.55), num_('tvd', 'Profundidad objetivo (TVD desde la mesa rotary)', 'ft', 12000)] },
      { titulo: 'Sedimentos bajo el lecho', intro: 'Intervalos desde el lecho marino hasta el objetivo; deben sumar TVD − air gap − tirante de agua.', campos: [{ id: 'filas', tipo: 'tabla', label: 'Intervalos', cols: [{ id: 'nombre', label: 'Intervalo', texto: true }, { id: 'esp', label: 'Espesor', unit: 'ft' }, { id: 'rho', label: 'Densidad', unit: 'ppg' }], def: tb([['Sedimentos someros', 2000, 16.2], ['Intermedio', 6920, 19.2]], ['nombre', 'esp', 'rho']) }] },
      { titulo: 'Poros y lodo (opcional)', intro: 'Para calcular el margen del riser.', campos: [num_('pp', 'Presión de poros equivalente a TVD', 'ppg', 10.5), num_('mw', 'Densidad actual del lodo', 'ppg', 11)] }
    ],
    calc: function (v) { return C.offshore(v); },
    render: function (r) {
      var out = kpis([kpi('Sobrecarga a TVD', fmt(r.sv, 0), 'psi', 'main'), kpi('Gradiente de sobrecarga', fmt(r.grad, 3), 'psi/ft', 'main'), kpi('Equivalente', fmt(r.ppgEq, 2), 'ppg'), kpi('Presión de la columna de agua', fmt(r.pAgua, 0), 'psi'), kpi('Columna bajo el lecho', fmt(r.H, 0), 'ft')].concat(r.mwRm != null ? [kpi('Densidad de margen del riser', fmt(r.mwRm, 2), 'ppg', 'main')] : []).concat(r.margen != null ? [kpi('Margen del riser', fmt(r.margen, 2), 'ppg', r.necesita ? '' : 'ok')] : []));
      out += tabla(['Intervalo', 'Espesor (ft)', 'Densidad (ppg)', 'Δp (psi)', 'Sv acumulada (psi)', 'Profundidad bajo el nivel del mar (ft)'], r.filas.map(function (f) { return [esc(f.n), fmt(f.e, 0), fmt(f.rho, 1), fmt(f.dp, 0), fmt(f.sv, 0), fmt(f.z, 0)]; }));
      if (r.margen != null) out += nota(r.necesita ? '<b>Lectura:</b> con el riser desconectado el lodo actual no balancea los poros; faltan ' + fmt(r.margen, 2) + ' ppg (o hay que tener otra barrera/plan de desconexión).' : '<b>Lectura:</b> el lodo actual balancea los poros con el riser desconectado.');
      out += go('Usar este gradiente de sobrecarga en Eaton', 'useObg');
      return out + calcBlock([['Sobrecarga', 'Sv = 0,052·(ρ_agua·WD + Σρ·Δz) = ' + fmt(r.sv, 0) + ' psi → ' + fmt(r.grad, 3) + ' psi/ft'], ['Margen del riser', r.mwRm != null ? 'MW_rm = (Pp − 0,052·ρ_agua·WD)/(0,052·H) = (' + fmt(r.Pp, 0) + ' − ' + fmt(r.pAgua, 0) + ')/(0,052·' + fmt(r.H, 0) + ') = ' + fmt(r.mwRm, 2) + ' ppg' : 'sin presión de poros cargada']]);
    }
  });


  /* ---------------- estrategia de explotación ---------------- */
  var ED = window.H3L_ESTR, EST = [];
  function nivelTool(t, e) { var m = ED.mat[t.id]; if (!m) return 't'; var c = m.charAt(ED.orden.indexOf(e)); return c === 'n' || c === 'o' ? c : '-'; }
  function nivelSel(t) {
    if (!EST.length) return 'a'; if (!ED.mat[t.id]) return 't';
    var best = '-'; EST.forEach(function (e) { var c = nivelTool(t, e); if (c === 'n') best = 'n'; else if (c === 'o' && best !== 'n') best = 'o'; }); return best;
  }
  function visibleT(t) { return nivelSel(t) !== '-'; }
  function lvlBadge(n) { return n === 'n' ? '<span class="lv n">Núcleo</span>' : n === 'o' ? '<span class="lv o">Con ajustes</span>' : n === 't' ? '<span class="lv t">Transversal</span>' : ''; }
  function estHash() { return EST.length ? '.' + EST.join('-') : ''; }
  function estNombres() { return EST.map(function (e) { return ED.estrategias[e].n; }).join(', '); }
  function estBar(comp) {
    var h = '<div class="estbar' + (comp ? ' comp' : '') + '" role="group" aria-label="Estrategia de explotación"><span class="estl">Estrategia</span><button class="chip' + (!EST.length ? ' on' : '') + '" data-act="est:todas" aria-pressed="' + (!EST.length) + '">Todas</button>';
    ED.orden.forEach(function (e) { h += '<button class="chip' + (EST.indexOf(e) >= 0 ? ' on' : '') + '" data-act="est:' + e + '" aria-pressed="' + (EST.indexOf(e) >= 0) + '">' + esc(ED.estrategias[e].n) + '</button>'; });
    if (!comp) h += '<p class="esth">Elegí una o más estrategias para ver solo las herramientas que aplican, con su ruta de trabajo en orden de uso. Es una guía de H3L pendiente de validación técnica.</p>';
    return h + '</div>';
  }
  function estPaneles() {
    var h = '';
    EST.forEach(function (e) {
      var d = ED.estrategias[e];
      h += '<section class="estp"><h3>' + esc(d.n) + '</h3><p>' + esc(d.desc) + '</p><div class="estcols"><div><b>Qué cambia</b><ul>' + d.cambia.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></div><div><b>Evitar</b><ul>' + d.evitar.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></div></div><h4>Ruta de trabajo en orden de uso</h4><ol class="ruta">';
      ED.rutas[e].forEach(function (id) {
        if (id.indexOf('c:') === 0) { h += '<li><span class="plat">Plataforma H3L</span> <a href="../index.html?go=calculators&tab=clasicas" target="_top">' + esc(id.slice(2)) + '</a></li>'; return; }
        var t = tByid(id); if (!t) return;
        h += '<li><button class="lnk" data-act="goTool:' + id + '">' + esc(t.nombre.replace(' — método de Rose', '')) + '</button> ' + lvlBadge(nivelTool(t, e)) + '<span class="rq">' + esc(t.pregunta) + '</span></li>';
      });
      h += '</ol></section>';
    });
    return h;
  }
  function aplicaRow(t) {
    var m = ED.mat[t.id]; if (!m) return '<p class="aplica"><span class="lv t">Transversal</span> Aplica a todas las estrategias; revisá las notas al elegir una.</p>';
    var h = '<p class="aplica"><span class="estl">Aplica a</span>'; ED.orden.forEach(function (e) { var n = nivelTool(t, e); if (n !== '-') h += '<span class="lv ' + n + '">' + esc(ED.estrategias[e].n) + (n === 'o' ? ' (con ajustes)' : '') + '</span>'; });
    return h + '</p>';
  }
  function notaEstr(t) {
    if (!EST.length) return ''; var m = ED.mat[t.id], nt = ED.notas[t.id] || {};
    var h = '<div class="guia"><b>Cómo aplicar esta herramienta según la estrategia elegida</b><ul>';
    EST.forEach(function (e) {
      var n = nivelTool(t, e), nm = esc(ED.estrategias[e].n), txt = nt[e] ? ' ' + esc(nt[e]) : '';
      if (!m) h += '<li><b>' + nm + ':</b> herramienta transversal.' + txt + '</li>';
      else if (n === '-') h += '<li><b>' + nm + ':</b> esta herramienta no suele aplicarse a esta estrategia.' + txt + '</li>';
      else h += '<li><b>' + nm + ' (' + (n === 'n' ? 'núcleo' : 'con ajustes') + '):</b>' + (txt || ' aplica sin cambios de método.') + '</li>';
    });
    return h + '</ul><p class="ay">Guía de H3L; debe validarla el revisor técnico.</p></div>';
  }
  function aplicarHash(hh) {
    var parts = (hh || '').replace('#', '').split('.'), id = parts[0];
    if (parts.length > 1) EST = parts[1].split('-').filter(function (x) { return ED.orden.indexOf(x) >= 0; });
    return id;
  }

  /* ---------------- caracterización: gráfico log-log ---------------- */
  function logChart(o) {
    var W = 600, H = 320, m = { l: 58, r: 16, t: 14, b: 44 }, xs = [], ys = [];
    o.series.forEach(function (s) { s.pts.forEach(function (p) { if (p[0] > 0 && p[1] > 0) { xs.push(p[0]); ys.push(p[1]); } }); });
    if (!xs.length) return '';
    function dec(a, b) { var lo = Math.floor(Math.log10(a) + 1e-9), hi = Math.ceil(Math.log10(b) - 1e-9); if (hi <= lo) hi = lo + 1; return { lo: lo, hi: hi }; }
    var X = dec(Math.min.apply(null, xs), Math.max.apply(null, xs)), Y = dec(Math.min.apply(null, ys), Math.max.apply(null, ys));
    function sx(x) { return m.l + (Math.log10(x) - X.lo) / (X.hi - X.lo) * (W - m.l - m.r); }
    function sy(y) { return m.t + (Y.hi - Math.log10(y)) / (Y.hi - Y.lo) * (H - m.t - m.b); }
    var g = '', e;
    for (e = Y.lo; e <= Y.hi; e++) g += '<line class="grid" x1="' + m.l + '" x2="' + (W - m.r) + '" y1="' + sy(Math.pow(10, e)) + '" y2="' + sy(Math.pow(10, e)) + '"/><text class="tick" x="' + (m.l - 6) + '" y="' + (sy(Math.pow(10, e)) + 4) + '" text-anchor="end">' + fmt(Math.pow(10, e), 4) + '</text>';
    for (e = X.lo; e <= X.hi; e++) g += '<line class="grid" y1="' + m.t + '" y2="' + (H - m.b) + '" x1="' + sx(Math.pow(10, e)) + '" x2="' + sx(Math.pow(10, e)) + '"/><text class="tick" y="' + (H - m.b + 16) + '" x="' + sx(Math.pow(10, e)) + '" text-anchor="middle">' + fmt(Math.pow(10, e), 4) + '</text>';
    o.series.forEach(function (s, i) {
      var pts = s.pts.filter(function (p) { return p[0] > 0 && p[1] > 0; }), c = s.c != null ? s.c : i;
      if (!s.nl) g += '<polyline class="ln s' + c + '" fill="none" points="' + pts.map(function (p) { return sx(p[0]).toFixed(1) + ',' + sy(p[1]).toFixed(1); }).join(' ') + '"/>';
      if (s.pt) pts.forEach(function (p) { g += '<circle class="pt s' + c + '" r="3" cx="' + sx(p[0]).toFixed(1) + '" cy="' + sy(p[1]).toFixed(1) + '"/>'; });
    });
    g += '<text class="axl" x="' + (m.l + (W - m.l - m.r) / 2) + '" y="' + (H - 6) + '" text-anchor="middle">' + esc(o.xl) + '</text><text class="axl" transform="rotate(-90)" x="' + (-(m.t + (H - m.t - m.b) / 2)) + '" y="12" text-anchor="middle">' + esc(o.yl) + '</text>';
    var leg = '<div class="leg">' + o.series.map(function (s, i) { return '<span><i class="sw s' + (s.c != null ? s.c : i) + '"></i>' + esc(s.nombre) + '</span>'; }).join('') + '</div>';
    return '<figure class="chart"><svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + esc(o.alt || o.yl) + '">' + g + '</svg>' + leg + '</figure>';
  }
  function avisosHTML(r) { return (r.avisos && r.avisos.length) ? nota('<b>Avisos:</b> ' + r.avisos.map(esc).join(' · ')) : ''; }

  /* 49. Pruebas de pozo: derivada de Bourdet */
  tool({
    id: 'ptaderiv', grupo: 'Grupo de Estudios', nombre: 'Pruebas de pozo: derivada y diagnóstico', etapas: 'D E', pregunta: '¿Qué régimen de flujo muestra la prueba y cuáles son k, daño y radio de investigación?',
    ficha: { metodo: 'Derivada de presión de Bourdet (3 puntos con suavizado L en ln t) contra el tiempo, en ejes log-log. Almacenamiento: pendiente 1 (C = q·B·Δt/(24·Δp)); flujo radial: derivada plana, k = 70,6·q·B·μ/(h·m′) con m′ = Δt·dΔp/dΔt; daño s = ½[Δp/Δp′ − ln(k·t/(φ·μ·ct·rw²)) + 7,43]. En cierres se usa el tiempo equivalente de Agarwal te = Δt·tp/(tp + Δt). Radio de investigación ri = √(k·t/(948·φ·μ·ct)).', fuente: 'Bourdet, Ayoub & Pirard (1989), SPE Formation Evaluation 4(2), SPE 12777; Agarwal (1980), SPE 9289; Earlougher (1977), SPE Monograph 5; Lee, Rollins & Spivey (2003), SPE Textbook 9. Constantes (7,43 y 948) a confirmar por el revisor.', limites: ['Un solo fluido, pozo vertical, yacimiento homogéneo de acción infinita en la ventana radial.', 'Con historias de caudal complejas el tiempo equivalente es aproximado: usá superposición o un modelo.', 'Diagnostica y estima; no reemplaza el ajuste con curvas tipo o un simulador de pruebas.', 'La derivada amplifica el ruido: el suavizado L distorsiona si es muy grande.'], unidades: 'Campo (oilfield): q en STB/d, B en rb/STB, μ en cP, h en ft, ct en 1/psi, rw en ft, Δt en h, Δp en psi, k en mD, C en bbl/psi.' },
    pasos: [
      { titulo: 'Pozo, fluido y tipo de prueba', intro: 'Los datos de ejemplo son ilustrativos (un caso con almacenamiento, daño y flujo radial). Reemplazalos por los tuyos.', campos: [sel_('tipo', 'Tipo de prueba', [['dd', 'Producción a caudal constante (drawdown)'], ['bu', 'Cierre (build-up)']], 'dd'), num_('q', 'Caudal', 'STB/d', 800), num_('B', 'Bo', 'rb/STB', 1.2), num_('mu', 'Viscosidad', 'cP', 0.8), num_('h', 'Espesor neto', 'ft', 40), num_('phi', 'Porosidad', 'fracción', 0.18), num_('ct', 'Compresibilidad total', '1/psi', 0.000012), num_('rw', 'Radio del pozo', 'ft', 0.3), num_('tp', 'Tiempo de producción antes del cierre (solo cierre)', 'h', 100, null, { si: function (v) { return v.tipo === 'bu'; } })] },
      { titulo: 'Datos de presión', intro: 'Δt desde el inicio de la prueba y Δp = |p − p al inicio|. Mínimo 8 puntos, con tiempos crecientes y repartidos en escala logarítmica.', campos: [{ id: 'filas', tipo: 'tabla', label: 'Δt y Δp', cols: [{ id: 't', label: 'Δt', unit: 'h' }, { id: 'dp', label: 'Δp', unit: 'psi' }], def: [{"t":0.05,"dp":80.43},{"t":0.073,"dp":108.41},{"t":0.107,"dp":142.64},{"t":0.156,"dp":182.53},{"t":0.227,"dp":226.51},{"t":0.331,"dp":272.33},{"t":0.484,"dp":317.47},{"t":0.706,"dp":359.79},{"t":1.031,"dp":397.89},{"t":1.504,"dp":431.19},{"t":2.196,"dp":459.8},{"t":3.206,"dp":484.26},{"t":4.679,"dp":505.24},{"t":6.83,"dp":523.47},{"t":9.97,"dp":539.58},{"t":14.554,"dp":554.09},{"t":21.245,"dp":567.41},{"t":31.011,"dp":579.87},{"t":45.267,"dp":591.71},{"t":66.077,"dp":603.09},{"t":96.454,"dp":614.15},{"t":140.795,"dp":624.97},{"t":205.52,"dp":635.63},{"t":300,"dp":646.18}] }] },
      { titulo: 'Suavizado y ventana radial', intro: 'L = 0,1 es un valor habitual. Si dejás el rango vacío, la herramienta busca sola la meseta de la derivada; indicalo a mano solo si el gráfico lo respalda.', campos: [num_('L', 'Suavizado L', 'ciclos ln t', 0.1), num_('tIni', 'Inicio de la ventana radial (opcional)', 'h', ''), num_('tFin', 'Fin de la ventana radial (opcional)', 'h', '')] }
    ],
    calc: function (v) { return C.ptaDeriv(v); },
    render: function (r, v) {
      var k = [];
      if (r.k != null) k = [kpi('Permeabilidad k', fmt(r.k, 1), 'mD', 'main'), kpi('kh', fmt(r.kh, 0), 'mD·ft'), kpi('Daño (skin)', fmt(r.s, 2), '', r.s > 0 ? '' : 'ok'), kpi('Caída por daño', fmt(r.dpSkin, 0), 'psi'), kpi('Radio de investigación', fmt(r.ri, 0), 'ft')];
      if (r.C != null) k.push(kpi('Almacenamiento C', fmt(r.C, 4), 'bbl/psi'));
      var out = k.length ? kpis(k) : nota('<b>No se identificó flujo radial.</b> Mirá el gráfico y los avisos.');
      out += h3('Diagnóstico log-log') + logChart({ xl: 'Tiempo equivalente (h)', yl: 'Δp y derivada (psi)', alt: 'Diagnóstico log-log de la prueba de pozo', series: [{ nombre: 'Δp', pts: r.filas.map(function (x) { return [x.te, x.dp]; }), nl: true, pt: true }, { nombre: 'Derivada de Bourdet', c: 1, pts: r.filas.filter(function (x) { return x.der != null && x.der > 0; }).map(function (x) { return [x.te, x.der]; }), nl: true, pt: true }] });
      if (r.win) out += nota('Ventana radial detectada: ' + fmt(r.win.t1, 2) + ' a ' + fmt(r.win.t2, 2) + ' h (' + r.win.n + ' puntos), m′ = ' + fmt(r.mprime, 2) + ' psi.');
      out += nota('Regímenes con pendiente reconocible: ' + (r.regimenes.length ? r.regimenes.map(esc).join(', ') : 'ninguno') + '. Referencia: almacenamiento pendiente 1 · lineal ½ · bilineal ¼ · radial 0.');
      out += tabla(['Δt (h)', 'te (h)', 'Δp (psi)', 'Derivada (psi)', 'Pendiente der.', 'Régimen'], r.filas.map(function (x) { return [fmt(x.t, 3), fmt(x.te, 3), fmt(x.dp, 1), fmt(x.der, 1), fmt(x.sDer, 2), x.reg ? esc(x.reg) : '—']; }));
      out += avisosHTML(r);
      var cs = [['Derivada', 'Δp′ = [Δ₁·δ₂/δ₁ + Δ₂·δ₁/δ₂]/(δ₁ + δ₂) en ln t, con suavizado L = ' + fmt(r.L, 2)]];
      if (r.k != null) { cs.push(['k', 'k = 70,6·q·B·μ/(h·m′) = ' + fmt(r.k, 2) + ' mD']); cs.push(['Daño', 's = ½[Δp/Δp′ − ln(k·te/(φ·μ·ct·rw²)) + 7,43] = ' + fmt(r.s, 2)]); cs.push(['Radio', 'ri = √(k·te/(948·φ·μ·ct)) = ' + fmt(r.ri, 0) + ' ft']); }
      return out + calcBlock(cs);
    }
  });

  /* 50. Análisis de producción (RTA) */
  tool({
    id: 'rta', grupo: 'Grupo de Estudios', nombre: 'Análisis de producción (RTA) del petróleo', etapas: 'D E', pregunta: '¿Qué volumen poral y qué petróleo original drena el pozo, según su historia de producción?',
    ficha: { metodo: 'Balance de materia fluyente (flujo dominado por los límites): Δp/q = m·t_mb + b, con t_mb = Np/q y m = B/(ct·Vp), de donde Vp = B/(ct·m), N = Vp·(1 − Sw)/B y área = Vp·5,615/(φ·h·43560). Flujo lineal transitorio: Δp/q = mL·√t, que entrega A_c·√k; con k conocida se obtiene A_c y la semilongitud de fractura xf = A_c/(4h).', fuente: 'Blasingame & Lee (1986), SPE 15019; Palacio & Blasingame (1993), SPE 25909; Wattenbarger et al. (1998), SPE 39931; Mattar & Anderson (2005), CIPC 2005-113. Fórmulas a confirmar por el revisor.', limites: ['Líquido de compresibilidad baja y constante, un solo pozo y caudal razonablemente estable. Para gas hace falta pseudo-presión y pseudo-tiempo (no incluidos).', 'Vp es el volumen drenado a la fecha: si el pozo no sintió los bordes, es un mínimo.', 'No reemplaza curvas tipo (Blasingame, NPI) ni un simulador; es un diagnóstico de primer orden.', 'Requiere pwf medida o calculada con confianza.'], unidades: 'Campo (oilfield): t en días, q en STB/d, pwf y pi en psi, ct en 1/psi, h en ft, k en mD; Vp en rb; área en acres.' },
    pasos: [
      { titulo: 'Roca y fluido', intro: 'Propiedades del yacimiento en el área de drenaje.', campos: [num_('phi', 'Porosidad', 'fracción', 0.08), num_('ct', 'Compresibilidad total', '1/psi', 0.000015), num_('mu', 'Viscosidad', 'cP', 0.8), num_('B', 'Bo', 'rb/STB', 1.3), num_('h', 'Espesor neto', 'ft', 100), num_('pi', 'Presión inicial', 'psi', 4000), num_('sw', 'Saturación de agua', 'fracción', 0.3)] },
      { titulo: 'Historia de producción', intro: 'Los datos de ejemplo son sintéticos e ilustrativos. Mínimo 10 puntos con tiempo creciente (días desde el inicio), caudal y presión fluyente.', campos: [{ id: 'filas', tipo: 'tabla', label: 'Producción', cols: [{ id: 't', label: 't', unit: 'd' }, { id: 'q', label: 'q', unit: 'STB/d' }, { id: 'pwf', label: 'pwf', unit: 'psi' }], def: [{"t":2,"q":580.6,"pwf":3690},{"t":2.5,"q":576.5,"pwf":3687},{"t":3,"q":571.4,"pwf":3684},{"t":3.7,"q":565.4,"pwf":3681},{"t":4.5,"q":558.1,"pwf":3676},{"t":5.5,"q":549.5,"pwf":3671},{"t":6.8,"q":539.2,"pwf":3664},{"t":8.3,"q":527.2,"pwf":3657},{"t":10.1,"q":513.2,"pwf":3647},{"t":12.4,"q":497.1,"pwf":3635},{"t":15.2,"q":478.6,"pwf":3621},{"t":18.6,"q":457.7,"pwf":3605},{"t":22.8,"q":434.5,"pwf":3585},{"t":28,"q":409.2,"pwf":3561},{"t":34.3,"q":381.8,"pwf":3533},{"t":42,"q":352.9,"pwf":3500},{"t":51.5,"q":323,"pwf":3462},{"t":63,"q":292.6,"pwf":3419},{"t":77.2,"q":262.4,"pwf":3369},{"t":94.6,"q":232.9,"pwf":3314},{"t":115.9,"q":204.7,"pwf":3252},{"t":142,"q":178.3,"pwf":3185},{"t":173.9,"q":153.9,"pwf":3112},{"t":213,"q":131.9,"pwf":3034},{"t":261,"q":112.2,"pwf":2950},{"t":319.7,"q":94.8,"pwf":2862},{"t":391.6,"q":79.7,"pwf":2771},{"t":479.8,"q":66.7,"pwf":2675},{"t":587.7,"q":55.6,"pwf":2577},{"t":720,"q":46.2,"pwf":2476}] }] },
      { titulo: 'Tramos de ajuste', intro: 'Fracción de los puntos finales (flujo dominado por los límites) y de los iniciales (flujo lineal) que se usan en los ajustes. La permeabilidad es opcional y solo sirve para estimar A_c y xf.', campos: [num_('fBdf', 'Fracción final para límites', 'fracción', 0.4), num_('fLin', 'Fracción inicial para flujo lineal', 'fracción', 0.4), num_('k', 'Permeabilidad de matriz (opcional)', 'mD', '')] }
    ],
    calc: function (v) { return C.rta(v); },
    render: function (r, v) {
      var k = [];
      if (r.bdf) k = [kpi('Volumen poral drenado Vp', fmt(r.bdf.vp / 1e6, 2), 'MMrb', 'main'), kpi('Petróleo original en el área drenada', fmt(r.bdf.N / 1e6, 2), 'MMSTB', 'main'), kpi('Área de drenaje', fmt(r.bdf.area, 1), 'acres'), kpi('Producción acumulada', fmt(r.bdf.np / 1e6, 3), 'MMSTB'), kpi('Factor de recuperación a la fecha', fmt(r.bdf.fr * 100, 1), '%'), kpi('R² (límites)', fmt(r.bdf.r2, 4))];
      if (r.lin) { k.push(kpi('A_c·√k', fmt(r.lin.acSqrtK, 0), 'ft²·√mD')); if (r.lin.ac != null) { k.push(kpi('Área de flujo A_c', fmt(r.lin.ac, 0), 'ft²')); k.push(kpi('Semilongitud xf', fmt(r.lin.xf, 1), 'ft')); } k.push(kpi('R² (lineal)', fmt(r.lin.r2, 4))); }
      var out = k.length ? kpis(k) : nota('<b>No se pudo estimar ni el volumen ni el flujo lineal.</b> Revisá los avisos.');
      if (r.bdf) {
        var tail = r.filas.slice(r.filas.length - r.nb);
        out += h3('Balance de materia fluyente') + lineChart({ xl: 't_mb = Np/q (d)', yl: 'Δp/q (psi/(STB/d))', alt: 'Δp/q contra tiempo de balance de materia', series: [{ nombre: 'Datos', pts: r.filas.map(function (x) { return [x.tmb, x.dpq]; }), nl: true, pt: true }, { nombre: 'Ajuste de la cola', c: 1, pts: [[tail[0].tmb, r.bdf.b + r.bdf.m * tail[0].tmb], [tail[tail.length - 1].tmb, r.bdf.b + r.bdf.m * tail[tail.length - 1].tmb]] }] });
      }
      if (r.lin) out += h3('Flujo lineal') + lineChart({ xl: '√t (d^½)', yl: 'Δp/q (psi/(STB/d))', alt: 'Δp/q contra raíz del tiempo', series: [{ nombre: 'Datos', pts: r.filas.map(function (x) { return [Math.sqrt(x.t), x.dpq]; }), nl: true, pt: true }, { nombre: 'Ajuste inicial', c: 1, pts: [[Math.sqrt(r.filas[0].t), r.lin.b + r.lin.m * Math.sqrt(r.filas[0].t)], [Math.sqrt(r.filas[r.lin.n - 1].t), r.lin.b + r.lin.m * Math.sqrt(r.filas[r.lin.n - 1].t)]] }] });
      out += h3('Datos procesados') + tabla(['t (d)', 'q (STB/d)', 'Δp (psi)', 'Np (STB)', 't_mb (d)', 'Δp/q'], r.filas.map(function (x) { return [fmt(x.t, 1), fmt(x.q, 1), fmt(x.dp, 0), fmt(x.np, 0), fmt(x.tmb, 1), fmt(x.dpq, 3)]; }));
      out += avisosHTML(r);
      var cs = [['Np y t_mb', 'Np = Σ q·Δt ; t_mb = Np/q ; Δp = pi − pwf']];
      if (r.bdf) { cs.push(['Pendiente', 'm = ' + fmt(r.bdf.m, 6) + ' psi/(STB/d)/d  →  Vp = B/(ct·m) = ' + fmt(r.bdf.vp, 0) + ' rb']); cs.push(['Petróleo original', 'N = Vp·(1 − Sw)/B = ' + fmt(r.bdf.N, 0) + ' STB']); cs.push(['Área', 'A = Vp·5,615/(φ·h·43560) = ' + fmt(r.bdf.area, 2) + ' acres']); }
      if (r.lin) cs.push(['Flujo lineal', 'mL = ' + fmt(r.lin.m, 5) + ' → A_c·√k = ' + fmt(r.lin.acSqrtK, 0)]);
      return out + calcBlock(cs);
    }
  });

  /* 51. Gradientes de presión y contactos */
  tool({
    id: 'gradiente', grupo: 'Grupo de Estudios', nombre: 'Gradientes de presión y contactos de fluidos', etapas: 'C D', pregunta: '¿Dónde están los contactos y qué densidad tienen los fluidos, según las presiones medidas con probador de formación?',
    ficha: { metodo: 'Para cada fluido se ajusta por mínimos cuadrados p = g·z + b contra la profundidad. El contacto (nivel de agua libre) es la intersección de dos rectas: z = (b₁ − b₂)/(g₂ − g₁), con incertidumbre por propagación de errores. Densidad ρ = g/0,433 (g/cm³). Si se carga la presión de entrada Pe de la roca, el contacto observado es z_FWL − Pe/(γw − γo).', fuente: 'Procedimiento estándar de interpretación de presiones de formación (p. ej. Dake, Fundamentals of Reservoir Engineering, 1978; Bradley, Petroleum Engineering Handbook, 1987). Fuente a confirmar por el revisor.', limites: ['Mismo sistema de presión (sin compartimentos) para todos los puntos.', 'Las presiones de pozos o fechas distintas deben llevarse a la misma referencia y ajustarse por depleción.', 'La supercarga, la deriva del manómetro y la mala asignación de fluido distorsionan el gradiente.', 'La intersección es el nivel de agua libre, no el contacto que se ve en los perfiles, salvo que se cargue Pe.'], unidades: 'Profundidad en ft (TVDSS positiva hacia abajo), presión en psi, gradientes en psi/ft, Pe en psi.' },
    pasos: [
      { titulo: 'Presiones medidas', intro: 'Una fila por toma: profundidad, presión y fluido (o = petróleo, g = gas, w = agua). Necesitás al menos dos fluidos con dos puntos cada uno.', campos: [{ id: 'filas', tipo: 'tabla', label: 'Tomas de presión', cols: [{ id: 'z', label: 'Profundidad', unit: 'ft' }, { id: 'p', label: 'Presión', unit: 'psi' }, { id: 'f', label: 'Fluido (o/g/w)', texto: true }], def: [[8500, 3925, 'o'], [8600, 3960, 'o'], [8700, 3995, 'o'], [8800, 4030, 'o'], [9100, 4145, 'w'], [9200, 4190, 'w'], [9300, 4235, 'w'], [8100, 3835, 'g'], [8150, 3840, 'g'], [8200, 3845, 'g']].map(function (a) { return { z: a[0], p: a[1], f: a[2] }; }) }] },
      { titulo: 'Referencias opcionales', intro: 'La presión de entrada convierte el nivel de agua libre en el contacto observado; el tope de la estructura permite calcular la columna.', campos: [num_('pe', 'Presión de entrada de la roca (opcional)', 'psi', 0), num_('ztop', 'Profundidad del tope de la estructura (opcional)', 'ft', 8100)] }
    ],
    calc: function (v) { return C.gradiente(v); },
    render: function (r) {
      var out = kpis(r.contactos.map(function (c) { return kpi(c.n, fmt(c.z, 1), 'ft' + (c.sd != null ? ' ± ' + fmt(c.sd, 1) : ''), c.tipo === 'owc' || c.tipo === 'fwl' ? 'main' : ''); }).concat(r.columna != null ? [kpi('Columna hasta el nivel de agua libre', fmt(r.columna, 0), 'ft')] : []).concat(r.columnaObs != null ? [kpi('Columna hasta el contacto observado', fmt(r.columnaObs, 0), 'ft')] : []));
      out += h3('Fluidos') + tabla(['Fluido', 'Puntos', 'Gradiente (psi/ft)', 'Densidad (g/cm³)', 'Residuo (psi)', 'R²'], r.lineas.map(function (l) { return [esc(l.nombre), l.n, fmt(l.g, 4), fmt(l.rho, 3), fmt(l.rmse, 2), fmt(l.r2, 5)]; }));
      var col = ['', 's0', 's1', 's2'], zs = r.puntos.map(function (x) { return x.z; }), z0 = Math.min.apply(null, zs) - 100, z1 = Math.max.apply(null, zs) + 100;
      out += lineChart({ xl: 'Presión (psi)', yl: 'Profundidad (ft)', invertY: true, alt: 'Presión contra profundidad con rectas de gradiente', series: r.lineas.map(function (l, i) { return { nombre: l.nombre, c: i, pts: [[l.g * z0 + l.b, z0], [l.g * z1 + l.b, z1]], nl: false }; }).concat([{ nombre: 'Tomas', c: 3, pts: r.puntos.map(function (x) { return [x.p, x.z]; }), nl: true, pt: true }]) });
      out += avisosHTML(r);
      return out + calcBlock([['Ajuste por fluido', 'p = g·z + b (mínimos cuadrados)'], ['Contacto', 'z = (b₁ − b₂)/(g₂ − g₁)'], ['Densidad', 'ρ = g/0,433']].concat(r.contactos.map(function (c) { return [c.n, 'z = ' + fmt(c.z, 1) + ' ft ; p = ' + fmt(c.p, 0) + ' psi']; })));
    }
  });

  /* 52. Petrofísica de arenas arcillosas */
  tool({
    id: 'petro2', grupo: 'Desarrollo', nombre: 'Petrofísica de arenas arcillosas y espesor neto', etapas: 'C D', pregunta: '¿Cuánto espesor neto productivo hay cuando la arcilla distorsiona la resistividad?',
    ficha: { metodo: 'Saturación de agua por tres modelos: Archie (Sw = (a·Rw/(φ^m·Rt))^(1/n)), Simandoux (cuadrática 1/Rt = φ^m·Sw²/(a·Rw) + Vsh·Sw/Rsh, con n = 2) e Indonesia (1/√Rt = [Vsh^(1−Vsh/2)/√Rsh + φ^(m/2)/√(a·Rw)]·Sw^(n/2)). Con cortes de φ, Vsh y Sw se obtienen espesor neto, relación neto/bruto, φ y Sw promedio ponderados y HCPV = Σ φ(1 − Sw)·Δz.', fuente: 'Archie (1942), Trans. AIME 146; Simandoux (1963), Rev. Inst. Fr. Pétrole; Poupon & Leveaux (1971), The Log Analyst 12(4). Cortes y parámetros: decisión del proyecto.', limites: ['Rw, Rsh, a, m y n deben venir de agua de formación y laboratorio; los valores genéricos son orientativos.', 'Los cortes no son universales: documentá su justificación.', 'Con Vsh alto (> 0,5) ningún modelo empírico es confiable sin calibración con núcleo.', 'Perfil muestreado a paso constante.'], unidades: 'Rw, Rsh y Rt en ohm·m; φ y Vsh en fracción; paso en ft; espesores en ft.' },
    pasos: [
      { titulo: 'Parámetros y modelo', intro: 'Elegí el modelo y cargá los parámetros petrofísicos.', campos: [sel_('modelo', 'Modelo de saturación', [['indo', 'Indonesia (Poupon–Leveaux)'], ['sim', 'Simandoux'], ['archie', 'Archie (arena limpia)']], 'indo'), num_('rw', 'Resistividad del agua Rw', 'ohm·m', 0.05), num_('rsh', 'Resistividad de la arcilla Rsh', 'ohm·m', 4), num_('a', 'a (tortuosidad)', '', 1), num_('m', 'm (cementación)', '', 2), num_('n', 'n (saturación)', '', 2), num_('dz', 'Paso de muestreo', 'ft', 0.5)] },
      { titulo: 'Perfil', intro: 'Una fila por muestra: profundidad, porosidad efectiva, volumen de arcilla y resistividad verdadera. Mínimo 3.', campos: [{ id: 'filas', tipo: 'tabla', label: 'Perfil', cols: [{ id: 'z', label: 'Profundidad', unit: 'ft' }, { id: 'phi', label: 'φ', unit: 'frac.' }, { id: 'vsh', label: 'Vsh', unit: 'frac.' }, { id: 'rt', label: 'Rt', unit: 'ohm·m' }], def: [[8000, 0.22, 0.05, 40], [8000.5, 0.2, 0.12, 28], [8001, 0.18, 0.2, 18], [8001.5, 0.16, 0.28, 12], [8002, 0.12, 0.35, 9], [8002.5, 0.06, 0.1, 30], [8003, 0.2, 0.55, 6], [8003.5, 0.21, 0.08, 35], [8004, 0.19, 0.15, 3], [8004.5, 0.17, 0.12, 2.5]].map(function (a) { return { z: a[0], phi: a[1], vsh: a[2], rt: a[3] }; }) }] },
      { titulo: 'Cortes', intro: 'Una muestra es neta si cumple los tres cortes.', campos: [num_('phic', 'Corte de porosidad (≥)', 'fracción', 0.08), num_('vshc', 'Corte de arcilla (≤)', 'fracción', 0.4), num_('swc', 'Corte de saturación de agua (≤)', 'fracción', 0.6)] }
    ],
    calc: function (v) { return C.petro2(v); },
    render: function (r) {
      var g = r.g, out = kpis([kpi('Espesor bruto', fmt(r.gross, 1), 'ft'), kpi('Espesor neto productivo', fmt(r.hNet, 1), 'ft', 'main'), kpi('Neto/bruto', fmt(r.ntg, 3), '', 'main'), kpi('φ promedio (neto)', fmt(r.phiAvg, 3)), kpi('Sw promedio (neto)', fmt(r.swAvg, 3)), kpi('Vsh promedio (neto)', fmt(r.vshAvg, 3)), kpi('HCPV', fmt(r.hcpv, 3), 'ft')]);
      out += h3('Saturación de agua por muestra') + hbars(r.filas.map(function (x) { return { label: fmt(x.z, 1) + ' ft', val: x.sw * 100, txt: 'Sw ' + fmt(x.sw, 2) + (x.net ? ' · neta' : ''), cls: x.net ? 'ok' : '' }; }), 100);
      out += tabla(['Prof. (ft)', 'φ', 'Vsh', 'Rt', 'Sw', 'Neta'], r.filas.map(function (x) { return [fmt(x.z, 1), fmt(x.phi, 3), fmt(x.vsh, 2), fmt(x.rt, 1), fmt(x.sw, 3), x.net ? badge('Sí', 'ok') : '—']; }));
      out += avisosHTML(r);
      var nom = { archie: 'Archie', sim: 'Simandoux', indo: 'Indonesia' }[r.modelo];
      return out + calcBlock([['Modelo', nom + ' (a = ' + g.a + ', m = ' + g.m + ', n = ' + g.n + ', Rw = ' + g.rw + ', Rsh = ' + g.rsh + ')'], ['Muestra neta', 'φ ≥ ' + g.phic + ' y Vsh ≤ ' + g.vshc + ' y Sw ≤ ' + g.swc], ['Espesor neto', 'h_neto = (n.º de muestras netas) × Δz = ' + fmt(r.hNet, 2) + ' ft'], ['HCPV', 'Σ φ·(1 − Sw)·Δz (muestras netas) = ' + fmt(r.hcpv, 4) + ' ft']]);
    }
  });

  /* 53. Tipos de roca y altura de saturación */
  tool({
    id: 'rocas', grupo: 'Grupo de Estudios', nombre: 'Tipos de roca (FZI) y altura de saturación', etapas: 'C D', pregunta: '¿Cuántos tipos de roca hay y cómo varía la saturación de agua con la altura sobre el agua libre?',
    ficha: { metodo: 'RQI = 0,0314·√(k/φ), φz = φ/(1 − φ), FZI = RQI/φz; las muestras se agrupan por log FZI (k = 1014,2·FZI²·φ³/(1 − φ)²). Función J de Leverett: J = 0,2166·Pc/(σ·cosθ)·√(k/φ), ajustada como J = a·S*^(−b) con S* = (Sw − Swirr)/(1 − Swirr). Altura de saturación: Pc = 0,433·Δρ·h (psi, ft, g/cm³) y Sw a partir de J.', fuente: 'Amaefule et al. (1993), SPE 26436; Leverett (1941), Trans. AIME 142; Guo, Tao & Wheeler (2005), SPE 96768. Constantes a confirmar por el revisor.', limites: ['FZI agrupa por geometría de poros solo con φ y k de plug; contrastá con petrografía o Pc.', 'Una sola curva J supone una sola familia de roca: ajustá una por clase.', 'Se asume que el tipo de roca controla Pc; con fracturas o vúgulos no aplica.', 'La conversión de laboratorio a reservorio depende de σ y θ medidos o asumidos.'], unidades: 'k en mD, φ en fracción, Pc en psi, σ en dina/cm, θ en grados, Δρ en g/cm³, alturas en ft.' },
    pasos: [
      { titulo: 'Plugs de núcleo', intro: 'Porosidad y permeabilidad de al menos 6 plugs. Los de ejemplo son ilustrativos.', campos: [{ id: 'plugs', tipo: 'tabla', label: 'Plugs', cols: [{ id: 'phi', label: 'φ', unit: 'frac.' }, { id: 'k', label: 'k', unit: 'mD' }], def: [[0.08, 0.7], [0.12, 3.2], [0.16, 9], [0.1, 18], [0.14, 52], [0.2, 190]].map(function (a) { return { phi: a[0], k: a[1] }; }) }, num_('nclases', 'Número de clases', '', 2)] },
      { titulo: 'Presión capilar de laboratorio (opcional)', intro: 'Con 4 o más puntos de drenaje se ajusta la función J. Dejá la tabla vacía para solo clasificar.', campos: [{ id: 'pcs', tipo: 'tabla', label: 'Curva de Pc (drenaje)', cols: [{ id: 'sw', label: 'Sw', unit: 'frac.' }, { id: 'pc', label: 'Pc', unit: 'psi' }], def: [[0.3, 60], [0.4, 18], [0.5, 10], [0.65, 6], [0.8, 3.8], [0.9, 2.8]].map(function (a) { return { sw: a[0], pc: a[1] }; }) }, num_('sigmaLab', 'Tensión interfacial de laboratorio', 'dina/cm', 48), num_('thetaLab', 'Ángulo de contacto de laboratorio', '°', 0), num_('kLab', 'k del plug de Pc', 'mD', 100), num_('phiLab', 'φ del plug de Pc', 'fracción', 0.2), num_('swirr', 'Saturación irreductible Swirr', 'fracción', 0.15)] },
      { titulo: 'Reservorio y altura (opcional)', intro: 'Con el ajuste de J se obtiene Sw contra la altura sobre el agua libre en la roca del reservorio.', campos: [num_('kRes', 'k del reservorio', 'mD', 100), num_('phiRes', 'φ del reservorio', 'fracción', 0.2), num_('sigmaRes', 'Tensión interfacial en reservorio', 'dina/cm', 26), num_('thetaRes', 'Ángulo de contacto en reservorio', '°', 30), num_('drho', 'Diferencia de densidades agua − HC', 'g/cm³', 0.25), num_('hmax', 'Altura máxima a graficar', 'ft', 200), num_('hSw', 'Altura donde querés la Sw (opcional)', 'ft', 80)] }
    ],
    calc: function (v) { return C.rocas(v); },
    render: function (r) {
      var out = kpis(r.clases.filter(function (c) { return c.n; }).map(function (c) { return kpi('Clase ' + c.i + ' · FZI', fmt(c.fzi, 2), c.n + ' plugs'); }));
      out += h3('Clases') + tabla(['Clase', 'Plugs', 'FZI medio', 'Rango FZI', 'φ medio', 'k medio (mD)'], r.clases.filter(function (c) { return c.n; }).map(function (c) { return [c.i, c.n, fmt(c.fzi, 2), fmt(c.fziMin, 2) + ' – ' + fmt(c.fziMax, 2), fmt(c.phi, 3), fmt(c.k, 1)]; }));
      out += lineChart({ xl: 'Porosidad (fracción)', yl: 'Permeabilidad k (mD)', alt: 'Plugs por clase', series: r.clases.filter(function (c) { return c.n; }).map(function (c, i) { return { nombre: 'Clase ' + c.i, c: i, nl: true, pt: true, pts: r.plugs.filter(function (p) { return p.cl === c.i - 1; }).map(function (p) { return [p.phi, p.k]; }) }; }) });
      if (r.j) {
        out += h3('Función J de Leverett') + kpis([kpi('a', fmt(r.j.a, 3)), kpi('b', fmt(r.j.b, 3)), kpi('R²', fmt(r.j.r2, 4))]);
        out += logChart({ xl: 'S* = (Sw − Swirr)/(1 − Swirr)', yl: 'J', alt: 'Función J contra saturación normalizada', series: [{ nombre: 'Datos', nl: true, pt: true, pts: r.j.pts.map(function (p) { return [p.sn, p.J]; }) }, { nombre: 'J = a·S*^(−b)', c: 1, pts: [0.05, 0.1, 0.2, 0.4, 0.7, 1].map(function (s) { return [s, r.j.a * Math.pow(s, -r.j.b)]; }) }] });
      }
      if (r.alt) {
        out += h3('Saturación contra altura sobre el agua libre') + lineChart({ xl: 'Saturación de agua Sw', yl: 'Altura sobre el agua libre (ft)', alt: 'Altura de saturación', series: [{ nombre: 'Sw(h)', pts: r.alt.curva.map(function (c) { return [c.sw, c.h]; }) }] });
        if (r.alt.swq != null) out += kpis([kpi('Sw a ' + fmt(r.alt.hq, 0) + ' ft', fmt(r.alt.swq, 3), '', 'main')]);
      }
      out += avisosHTML(r);
      var cs = [['RQI y FZI', 'RQI = 0,0314·√(k/φ) ; φz = φ/(1 − φ) ; FZI = RQI/φz']];
      if (r.j) { cs.push(['Función J', 'J = 0,2166·Pc/(σ·cosθ)·√(k/φ) ; J = ' + fmt(r.j.a, 3) + '·S*^(−' + fmt(r.j.b, 3) + ')']); if (r.alt) cs.push(['Altura', 'Pc = 0,433·Δρ·h ; Sw = Swirr + (1 − Swirr)·(J/a)^(−1/b)']); }
      return out + calcBlock(cs);
    }
  });

  /* ---------------- estado y renderizado ---------------- */
  var ST = {}, cur = null, paso = 0, tab = 'calc';
  function campos(t) { var a = []; t.pasos.forEach(function (p) { p.campos.forEach(function (f) { a.push(f); }); }); return a; }
  function initVals(t) {
    var v = {}; campos(t).forEach(function (f) { var d = clone(f.def === undefined ? '' : f.def); if (f.grupo) { v[f.grupo] = v[f.grupo] || {}; v[f.grupo][f.id] = d; } else v[f.id] = d; });
    return v;
  }
  function vals(t) { if (!ST[t.id]) ST[t.id] = initVals(t); return ST[t.id]; }
  function paraCalc(t) {
    var v = clone(vals(t));
    campos(t).forEach(function (f) { if (f.tipo === 'num' && f.pct && String(v[f.id]).trim() !== '') v[f.id] = String(num(v[f.id]) / 100); });
    // ocultar campos no visibles evita que datos de otro modo contaminen el cálculo
    return v;
  }
  function getVal(f, v) { return f.grupo ? v[f.grupo][f.id] : v[f.id]; }

  var DESC_DIST = { fija: ['Valor'], tri: ['Mínimo', 'Más probable', 'Máximo'], logn: ['P90 (bajo)', '', 'P10 (alto)'] };
  function campoHTML(f, v) {
    if (f.si && !f.si(v)) return '';
    var val = getVal(f, v), h = '', ay = f.ayuda ? '<small class="ay">' + esc(f.ayuda) + '</small>' : '';
    if (f.tipo === 'num') return '<label class="f"><span class="fl">' + esc(f.label) + (f.unit ? ' <em>' + esc(f.unit) + '</em>' : '') + '</span><input inputmode="decimal" data-k="' + f.id + '" value="' + esc(val) + '" autocomplete="off">' + ay + '</label>';
    if (f.tipo === 'texto1') return '<label class="f"><span class="fl">' + esc(f.label) + '</span><input data-k="' + f.id + '" value="' + esc(val) + '">' + ay + '</label>';
    if (f.tipo === 'texto') return '<label class="f wide"><span class="fl">' + esc(f.label) + '</span><textarea rows="3" data-k="' + f.id + '">' + esc(val) + '</textarea>' + ay + '</label>';
    if (f.tipo === 'sel') return '<label class="f"><span class="fl">' + esc(f.label) + '</span><select data-k="' + f.id + '" data-resel="1">' + f.opts.map(function (o) { return '<option value="' + o[0] + '"' + (o[0] === val ? ' selected' : '') + '>' + esc(o[1]) + '</option>'; }).join('') + '</select>' + ay + '</label>';
    if (f.tipo === 'prob') { var p = num(val); return '<div class="f wide prob"><span class="fl">' + esc(f.label) + '</span><div class="pr"><input type="range" min="0" max="1" step="0.01" value="' + (isFinite(p) ? p : 0) + '" data-k="' + f.id + '" data-rng="1" aria-label="' + esc(f.label) + '"><input class="pv" inputmode="decimal" data-k="' + f.id + '" value="' + esc(val) + '" aria-label="Valor"></div><small class="band" data-band="' + f.id + '">' + esc(isFinite(p) ? banda(p) : '') + '</small>' + ay + '<small class="ay">Referencia orientativa de H3L, a calibrar con el historial de la cuenca; no es una tabla de Rose.</small></div>'; }
    if (f.tipo === 'dist') {
      var d = val, lab = DESC_DIST[d.d] || [], nm = ['a', 'b', 'c'];
      h = '<div class="f wide dist"><span class="fl">' + esc(f.label) + (f.unit ? ' <em>' + esc(f.unit) + '</em>' : '') + '</span><div class="dr"><select data-d="' + f.id + '" data-p="d" data-resel="1">' + [['fija', 'Fija'], ['tri', 'Triangular'], ['logn', 'Lognormal']].map(function (o) { return '<option value="' + o[0] + '"' + (o[0] === d.d ? ' selected' : '') + '>' + o[1] + '</option>'; }).join('') + '</select>';
      nm.forEach(function (k, i) { if (lab[i]) h += '<label class="mini"><span>' + lab[i] + '</span><input inputmode="decimal" data-d="' + f.id + '" data-p="' + k + '" value="' + esc(d[k]) + '"></label>'; });
      return h + '</div></div>';
    }
    if (f.tipo === 'tabla') {
      h = '<div class="f wide"><span class="fl">' + esc(f.label) + '</span><div class="tw"><table class="edit"><thead><tr>' + f.cols.map(function (c) { return '<th>' + esc(c.label) + (c.unit ? ' <em>' + esc(c.unit) + '</em>' : '') + '</th>'; }).join('') + '<th></th></tr></thead><tbody>';
      val.forEach(function (row, i) { h += '<tr>' + f.cols.map(function (c) { return '<td><input ' + (c.texto ? '' : 'inputmode="decimal" ') + 'data-t="' + f.id + '" data-r="' + i + '" data-c="' + c.id + '" value="' + esc(row[c.id] == null ? '' : row[c.id]) + '"></td>'; }).join('') + '<td><button class="x" data-act="delrow:' + f.id + ':' + i + '" aria-label="Quitar fila">×</button></td></tr>'; });
      return h + '</tbody></table></div><button class="btn sec sm" data-act="addrow:' + f.id + '">+ Agregar fila</button>' + ay + '</div>';
    }
    return '';
  }

  function stepperHTML(t) {
    var n = t.pasos.length, h = '<ol class="stepper">';
    t.pasos.forEach(function (p, i) { h += '<li class="' + (i === paso ? 'on' : i < paso ? 'done' : '') + '"><button data-act="step:' + i + '"><b>' + (i + 1) + '</b><span>' + esc(p.titulo) + '</span></button></li>'; });
    h += '<li class="res ' + (paso === n ? 'on' : '') + '"><button data-act="step:' + n + '"><b>★</b><span>Resultado</span></button></li></ol>';
    return h;
  }
  function entradaTxt(t, v) {
    var L = [];
    campos(t).forEach(function (f) {
      var x = getVal(f, v);
      if (f.si && !f.si(v)) return;
      if (f.tipo === 'tabla') L.push(f.label + ': ' + x.map(function (r) { return f.cols.map(function (c) { return r[c.id]; }).join('/'); }).join('; '));
      else if (f.tipo === 'dist') L.push(f.label + ': ' + x.d + ' ' + [x.a, x.b, x.c].filter(function (z) { return z !== ''; }).join(' / '));
      else if (f.tipo === 'sel') { var o = f.opts.filter(function (o) { return o[0] === x; })[0]; L.push(f.label + ': ' + (o ? o[1] : x)); }
      else L.push(f.label + ': ' + x + (f.unit ? ' ' + f.unit : ''));
    });
    return L.join('\n');
  }

  function renderMain() {
    var el = $('#main');
    if (!cur) { el.innerHTML = inicioHTML(); return; }
    var t = cur, v = vals(t), n = t.pasos.length, h = '';
    h += '<div class="thead"><div><p class="eyebrow">' + esc(t.grupo) + ' · etapas ' + etapasHTML(t.etapas) + '</p><h2>' + esc(t.nombre) + '</h2><p class="preg">' + esc(t.pregunta) + '</p></div><div class="stat">' + badge('Borrador — pendiente de revisión técnica', 'warn') + '</div></div>';
    h += estBar(true) + aplicaRow(t);
    h += '<div class="tabs" role="tablist"><button class="' + (tab === 'calc' ? 'on' : '') + '" data-act="tab:calc">Calculadora</button><button class="' + (tab === 'ficha' ? 'on' : '') + '" data-act="tab:ficha">Ficha técnica y revisión</button></div>';
    if (tab === 'ficha') { el.innerHTML = h + fichaHTML(t); return; }
    h += notaEstr(t) + stepperHTML(t);
    if (paso < n) {
      var p = t.pasos[paso];
      h += '<section class="panel"><h3 class="ph">Paso ' + (paso + 1) + ' de ' + n + ' · ' + esc(p.titulo) + '</h3><p class="intro">' + esc(p.intro) + '</p>' + (p.extra ? p.extra(v) : '') + '<div class="fg">' + p.campos.map(function (f) { return campoHTML(f, v); }).join('') + '</div></section>';
      h += '<div class="nav">' + (paso > 0 ? '<button class="btn sec" data-act="step:' + (paso - 1) + '">← Anterior</button>' : '<button class="btn sec" data-act="reset">Restablecer ejemplo</button>') + '<button class="btn" data-act="step:' + (paso + 1) + '">' + (paso === n - 1 ? 'Calcular →' : 'Siguiente →') + '</button></div>';
    } else {
      var r; try { r = t.calc(paraCalc(t)); } catch (e) { r = { errores: ['Error inesperado en el cálculo: ' + e.message] }; }
      h += '<section class="panel res"><div class="rh"><h3 class="ph">Resultado</h3><button class="btn sec sm" data-act="copy">Copiar resumen</button></div>';
      h += '<div id="resbody"><p class="rtitle">' + esc(t.nombre) + ' — H3L Global Energy (borrador pendiente de revisión técnica)' + (EST.length ? ' · Estrategia: ' + esc(estNombres()) : '') + '</p>';
      if (r.errores && r.errores.length) h += '<div class="err"><b>Revisá estos datos:</b><ul>' + r.errores.map(function (e) { return '<li>' + esc(e) + '</li>'; }).join('') + '</ul></div>';
      else {
        if (r.avisos && r.avisos.length) h += '<div class="warnbox"><b>Avisos</b><ul>' + r.avisos.map(function (e) { return '<li>' + esc(e) + '</li>'; }).join('') + '</ul></div>';
        try { h += t.render(r, vals(t)); } catch (e) { h += '<div class="err">No se pudo mostrar el resultado: ' + esc(e.message) + '</div>'; }
      }
      h += '<details class="inp"><summary>Datos de entrada</summary><pre>' + esc(entradaTxt(t, vals(t))) + '</pre></details>';
      h += '<p class="lim"><b>Límites del método:</b> ' + esc(t.ficha.limites.join(' · ')) + '</p></div></section>';
      h += '<div class="nav"><button class="btn sec" data-act="step:' + (n - 1) + '">← Ajustar datos</button><button class="btn sec" data-act="tab:ficha">Ver ficha técnica</button></div>';
    }
    el.innerHTML = h;
  }
  function etapasHTML(e) { return e.split(' ').map(function (x) { return '<span class="et et' + x + '">' + x + '</span>'; }).join(''); }
  function fichaHTML(t) {
    var f = t.ficha, ch = ['Fórmulas verificadas contra la fuente citada', 'Pruebas numéricas reproducidas a mano o con otra herramienta', 'Unidades y conversiones revisadas', 'Límites de aplicación documentados y razonables', 'Revisor distinto del autor', 'Resultado contrastado con un caso real o publicado'];
    return '<section class="panel ficha"><dl><dt>Método</dt><dd>' + esc(f.metodo) + '</dd><dt>Fuente</dt><dd>' + esc(f.fuente) + '</dd><dt>Unidades</dt><dd>' + esc(f.unidades) + '</dd><dt>Límites de uso</dt><dd><ul>' + f.limites.map(function (l) { return '<li>' + esc(l) + '</li>'; }).join('') + '</ul></dd></dl><h3>Lista de revisión técnica</h3><p class="intro">Para marcar durante la revisión previa a publicar en H3L (la casilla no se guarda).</p><ul class="chk">' + ch.map(function (c) { return '<li><label><input type="checkbox"> ' + esc(c) + '</label></li>'; }).join('') + '</ul><p class="nota">Estado: <b>borrador</b>. Autor: equipo H3L. Revisor: pendiente. Las pruebas numéricas de esta herramienta se ejecutan desde el botón «Pruebas» del encabezado.</p></section>';
  }
  function inicioHTML() {
    var rose = T.filter(function (t) { return t.destacado; })[0];
    var h = '<div class="hero"><p class="eyebrow">H3L Global Energy · Calculadoras paso a paso</p><h2>' + T.length + ' herramientas nuevas para el flujo VCDE' + (EST.length ? ' · ' + T.filter(function (t) { return ED.mat[t.id] && visibleT(t); }).length + ' específicas de ' + esc(estNombres()) : '') + '</h2><p class="intro">Cada herramienta guía al geocientista desde los datos hasta el entregable, muestra el cálculo intermedio y declara su método, fuente y límites. Todas están en estado borrador hasta que un revisor técnico las valide.</p></div>';
    h += estBar() + estPaneles();
    h += '<div class="rosecard"><div><span class="bd warn">Método de Peter Rose</span><h3>' + esc(rose.nombre) + '</h3><p>' + esc(rose.pregunta) + ' Asegura el sistema petrolero con cuatro factores (reservorio, estructura, carga y trampa sellada), exige justificar cada probabilidad, calibra contra la tasa histórica del play y llega a chance comercial y valor monetario esperado.</p><div class="acts"><button class="btn" data-act="goTool:rose">Abrir la herramienta</button></div></div><div class="rosefl" aria-hidden="true"><span>Reservorio</span><i>×</i><span>Estructura</span><i>×</i><span>Carga</span><i>×</i><span>Trampa</span><i>=</i><b>Pg</b></div></div>';
    function bloque(lista, tit) {
      var gr = []; lista.forEach(function (t) { if (gr.indexOf(t.grupo) < 0) gr.push(t.grupo); });
      var o = ''; gr.forEach(function (g) { o += '<h3 class="gh">' + esc(g) + '</h3><div class="cards">' + lista.filter(function (t) { return t.grupo === g; }).map(function (t) { return '<button class="card" data-act="goTool:' + t.id + '"><span class="et-row">' + etapasHTML(t.etapas) + lvlBadge(nivelSel(t)) + '</span><b>' + esc(t.nombre) + '</b><span>' + esc(t.pregunta) + '</span></button>'; }).join('') + '</div>'; });
      return o;
    }
    if (!EST.length) h += bloque(T);
    else {
      var esp = T.filter(function (t) { return ED.mat[t.id] && visibleT(t); }), tr = T.filter(function (t) { return !ED.mat[t.id]; });
      h += '<h3 class="gh2">Herramientas específicas de ' + esc(estNombres()) + ' (' + esp.length + ')</h3>' + bloque(esp);
      h += '<details class="transv"><summary>Herramientas transversales (' + tr.length + '): aplican a cualquier estrategia</summary>' + bloque(tr) + '</details>';
    }
    return h;
  }
  function renderNav() {
    var grupos = []; T.forEach(function (t) { if (visibleT(t) && grupos.indexOf(t.grupo) < 0) grupos.push(t.grupo); });
    var h = '<button class="navhome ' + (!cur ? 'on' : '') + '" data-act="goTool:">Inicio</button>';
    grupos.forEach(function (g) { h += '<p class="ng">' + esc(g) + '</p>' + T.filter(function (t) { return t.grupo === g && visibleT(t); }).map(function (t) { return '<button class="ni ' + (cur === t ? 'on' : '') + (t.destacado ? ' star' : '') + '" data-act="goTool:' + t.id + '">' + esc(t.nombre.replace(' — método de Rose', '')) + '</button>'; }).join(''); });
    $('#nav').innerHTML = h;
  }

  function abrir(id, p) {
    cur = T.filter(function (t) { return t.id === id; })[0] || null; paso = p || 0; tab = 'calc';
    if (cur) { try { history.replaceState(null, '', '#' + cur.id + estHash()); } catch (e) { } } else { try { history.replaceState(null, '', '#inicio' + estHash()); } catch (e) { } }
    $('#shell').classList.remove('navopen'); renderNav(); renderMain(); window.scrollTo(0, 0);
  }
  function tByid(id) { return T.filter(function (t) { return t.id === id; })[0]; }

  /* eventos */
  document.addEventListener('input', function (e) {
    var el = e.target; if (!cur || !el.closest('#main')) return; var v = vals(cur);
    if (el.dataset.t) { var f = campos(cur).filter(function (x) { return x.id === el.dataset.t; })[0]; v[f.id][+el.dataset.r][el.dataset.c] = el.value; return; }
    if (el.dataset.d) { v.vars[el.dataset.d][el.dataset.p] = el.value; if (el.dataset.resel) renderMain(); return; }
    if (el.dataset.k) {
      v[el.dataset.k] = el.value;
      if (el.dataset.rng || el.classList.contains('pv')) { var panel = el.closest('.prob'); var other = panel.querySelector(el.dataset.rng ? '.pv' : '[data-rng]'); if (other) other.value = el.value; var b = panel.querySelector('[data-band]'); var p = num(el.value); if (b) b.textContent = isFinite(p) ? banda(p) : ''; }
      if (el.dataset.resel) renderMain();
    }
  });
  document.addEventListener('change', function (e) { var el = e.target; if (el.dataset && el.dataset.resel && cur && el.closest('#main') && el.tagName === 'SELECT') { /* ya manejado en input */ } });
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-act]'); if (!b) return; var a = b.dataset.act.split(':');
    var act = a[0];
    if (act === 'goTool') { abrir(a[1] || null, a[2] ? +a[2] : 0); }
    else if (act === 'step') { paso = +a[1]; renderMain(); window.scrollTo(0, 0); }
    else if (act === 'tab') { tab = a[1]; renderMain(); }
    else if (act === 'reset') { delete ST[cur.id]; renderMain(); }
    else if (act === 'addrow' || act === 'delrow') { var f = campos(cur).filter(function (x) { return x.id === a[1]; })[0], arr = vals(cur)[f.id]; if (act === 'addrow') { var nr = {}; f.cols.forEach(function (c) { nr[c.id] = ''; }); arr.push(nr); } else if (arr.length > 1) arr.splice(+a[2], 1); renderMain(); }
    else if (act === 'copy') copiar(b);
    else if (act === 'usePg') { var r = C.rose(vals(tByid('rose'))); if (!r.errores.length) { vals(tByid('vol')).pg = String(+r.pg.toPrecision(4)); abrir('vol', 2); } }
    else if (act === 'rose2bayes') {
      var rv = vals(tByid('rose')), bv = vals(tByid('bayes'));
      ['reservorio', 'estructura', 'carga', 'trampa'].forEach(function (k) { bv['a_' + k] = rv[k]; bv['b_' + k] = rv[k]; }); abrir('bayes', 2);
    }
    else if (act === 'usePetro') {
      var pr = C.petrofisica(paraCalc(cur)), vv = vals(tByid('vol')); if (!pr.errores.length && pr.hNeto > 0) { vv.vars.h = { d: 'fija', a: String(+(pr.hNeto * 3.28084).toPrecision(4)), b: '', c: '' }; vv.vars.phi = { d: 'fija', a: String(+pr.phiProm.toPrecision(3)), b: '', c: '' }; vv.vars.sw = { d: 'fija', a: String(+pr.swProm.toPrecision(3)), b: '', c: '' }; abrir('vol', 1); }
    }
    else if (act === 'est') {
      if (a[1] === 'todas') EST = []; else { var ix = EST.indexOf(a[1]); if (ix >= 0) EST.splice(ix, 1); else EST.push(a[1]); }
      EST.sort(function (x, y) { return ED.orden.indexOf(x) - ED.orden.indexOf(y); });
      try { history.replaceState(null, '', '#' + (cur ? cur.id : 'inicio') + estHash()); } catch (e) { }
      renderNav(); renderMain();
    }
    else if (act === 'useObg') { var ro = C.offshore(paraCalc(cur)); if (!ro.errores.length) { vals(tByid('eaton')).obg = String(+ro.grad.toPrecision(4)); abrir('eaton', 0); } }
    else if (act === 'pruebas') mostrarPruebas();
    else if (act === 'navtoggle') $('#shell').classList.toggle('navopen');
    else if (act === 'cerrar') $('#modal').hidden = true;
  });
  function copiar(btn) {
    var txt = $('#resbody').innerText, ok = function () { btn.textContent = 'Copiado'; setTimeout(function () { btn.textContent = 'Copiar resumen'; }, 1800); };
    function sel() { var r = document.createRange(); r.selectNodeContents($('#resbody')); var s = getSelection(); s.removeAllRanges(); s.addRange(r); btn.textContent = 'Seleccionado: copiá con Ctrl+C'; }
    try { navigator.clipboard.writeText(txt).then(ok, sel); } catch (e) { sel(); }
  }
  function mostrarPruebas() {
    var res = window.H3LPruebas.correr(C), mal = res.filter(function (x) { return !x.ok; }).length;
    $('#modalbody').innerHTML = '<h3>Pruebas numéricas del motor de cálculo</h3><p class="' + (mal ? 'bad' : 'okt') + '"><b>' + (res.length - mal) + ' de ' + res.length + ' superadas</b>' + (mal ? ' — ' + mal + ' con falla' : '') + '. Los valores esperados provienen de cálculo manual o de ejemplos publicados; el revisor puede reproducirlos.</p>' + tabla(['', 'Prueba', 'Detalle'], res.map(function (x) { return [x.ok ? badge('OK', 'ok') : badge('Falla', 'bad'), esc(x.nombre), '<small>' + esc(x.detalle) + '</small>']; }));
    $('#modal').hidden = false;
  }
  window.addEventListener('hashchange', function () { var id = aplicarHash(location.hash); if (id && id !== 'inicio' && tByid(id) && tByid(id) !== cur) abrir(id); else { renderNav(); renderMain(); } });
  window.H3LApp = { herramientas: T, abrir: abrir, vals: vals, paraCalc: paraCalc };
  var h0 = aplicarHash(location.hash);
  renderNav(); if (h0 && tByid(h0)) abrir(h0); else renderMain();
})();
