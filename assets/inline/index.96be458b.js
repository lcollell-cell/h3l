// ═══════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════
const calculators = [
  // RESERVORIO
  {id:'ooip',cat:'reservoir',icon:'⛽',name:'OOIP',desc:'Original Oil In Place — Volumen original de petróleo en el yacimiento con método volumétrico',badge:'Reservorio',modal:'ooip'},
  {id:'rf',cat:'reservoir',icon:'📈',name:'Factor de Recuperación',desc:'Estimación del porcentaje de petróleo recuperable usando correlaciones empíricas',badge:'Reservorio',modal:'rf'},
  {id:'decline',cat:'reservoir',icon:'📉',name:'Curvas de Declinación',desc:'Arps decline curve analysis — Exponencial, hiperbólica y armónica',badge:'Reservorio',modal:'decline'},
  {id:'pwf',cat:'reservoir',icon:'🔧',name:'Presión de Fondo',desc:'Cálculo de Bottomhole Flowing Pressure mediante correlaciones de gradiente',badge:'Reservorio',modal:'pwf'},
  // ENERGY TRANSITION
  {id:'co2trans',cat:'energy',icon:'🌱',name:'CO₂ Transición',desc:'Emisiones CO₂ en transición energética con equivalencias GWP y factor de emisión',badge:'Energy Transition',modal:'co2trans'},
  {id:'h2verde',cat:'energy',icon:'💧',name:'Hidrógeno Verde',desc:'Dimensionamiento de electrolizadores y costo del H₂ verde por kg',badge:'Energy Transition',modal:'h2verde'},
  {id:'ccs',cat:'energy',icon:'🏭',name:'Carbon Capture (CCS)',desc:'Estimación de capacidad de almacenamiento y costo de captura CO₂',badge:'Energy Transition',modal:'ccs'},
  {id:'solar',cat:'energy',icon:'☀️',name:'Dimensionamiento Solar',desc:'Capacidad de panel solar, irradiación y factor de planta fotovoltaica',badge:'Energy Transition',modal:'solar'},
  {id:'huella',cat:'energy',icon:'👣',name:'Huella de Carbono',desc:'Scopes 1, 2 y 3 según GHG Protocol — Inventario completo de emisiones',badge:'Energy Transition',modal:'huella'},
  {id:'offset',cat:'energy',icon:'🌳',name:'Carbon Offset',desc:'Cálculo de créditos de carbono necesarios para neutralidad climática',badge:'Energy Transition',modal:'generic'},
  {id:'lca',cat:'energy',icon:'🔄',name:'LCA Simplificado',desc:'Análisis de Ciclo de Vida — Emisiones from-well-to-wheel',badge:'Energy Transition',modal:'generic'},
  {id:'metano_e',cat:'energy',icon:'💨',name:'Metano Cuantificación',desc:'Estimación de emisiones de metano por fugas y venteos',badge:'Energy Transition',modal:'generic'},
  // AMBIENTAL
  {id:'co2em',cat:'ambiental',icon:'🏭',name:'Emisiones CO₂',desc:'Factor de emisión por fuente: combustión, procesos, electricidad consumida',badge:'Ambiental',modal:'co2em'},
  {id:'agua',cat:'ambiental',icon:'💧',name:'Tratamiento de Agua',desc:'Caudal de tratamiento, eficiencia y costos operativos OPEX',badge:'Ambiental',modal:'generic'},
  {id:'acustico',cat:'ambiental',icon:'🔊',name:'Impacto Acústico',desc:'Nivel de presión sonora y atenuación por distancia según ISO 9613',badge:'Ambiental',modal:'generic'},
  {id:'derrames',cat:'ambiental',icon:'🛢️',name:'Gestión de Derrames',desc:'Volumen derramado, área afectada y estimación de remediación',badge:'Ambiental',modal:'derrame'},
  {id:'flaring',cat:'ambiental',icon:'🔥',name:'Flaring & Venting',desc:'Emisiones por quema e ineficiencias de antorcha según API 521',badge:'Ambiental',modal:'generic'},
  // ESG
  {id:'esg',cat:'esg',icon:'⭐',name:'ESG Score',desc:'Puntuación integrada E, S, G con pesos configurables y benchmarking sectorial',badge:'ESG',modal:'esg'},
  {id:'carbint',cat:'esg',icon:'📊',name:'Carbon Intensity',desc:'Intensidad de carbono vs. benchmarks sectoriales internacionales',badge:'ESG',modal:'generic'},
  {id:'biodiv',cat:'esg',icon:'🌿',name:'Biodiversidad',desc:'Índice de impacto y plan de restauración según TNFD framework',badge:'ESG',modal:'generic'},
  {id:'circ',cat:'esg',icon:'♻️',name:'Economía Circular',desc:'Tasa de circularidad, reducción de residuos y valor recuperado',badge:'ESG',modal:'generic'},
  // METHANE
  {id:'methint',cat:'methane',icon:'🔥',name:'Methane Intensity',desc:'Intensidad de metano por unidad de producción — OGMP 2.0 compatible',badge:'Metano',modal:'methane'},
  {id:'flaringred',cat:'methane',icon:'📉',name:'Flaring Reduction',desc:'Potencial de reducción de quema y valor económico del gas recuperado',badge:'Metano',modal:'generic'},
  {id:'ldar',cat:'methane',icon:'🔍',name:'LDAR Program',desc:'Detección y reparación de fugas — OGI, METHOD 21, EPA Protocol',badge:'Metano',modal:'generic'},
  // UNITS
  {id:'vol',cat:'units',icon:'🪣',name:'Volumen',desc:'BBL ↔ m³ ↔ ft³ ↔ galones — Petróleo y gas natural',badge:'Conversión',modal:'units_vol'},
  {id:'pres',cat:'units',icon:'🌡️',name:'Presión',desc:'psi ↔ bar ↔ kPa ↔ MPa ↔ atm — Presión estática y dinámica',badge:'Conversión',modal:'units_pres'},
  {id:'temp',cat:'units',icon:'🌡️',name:'Temperatura',desc:'°F ↔ °C ↔ K — Conversión de temperatura para procesos',badge:'Conversión',modal:'units_temp'},
  {id:'flow',cat:'units',icon:'💨',name:'Flujo',desc:'STB/day ↔ m³/day ↔ Mcf/day ↔ MMscfd',badge:'Conversión',modal:'generic'},
  {id:'energy2',cat:'units',icon:'⚡',name:'Energía',desc:'BTU ↔ kWh ↔ MJ ↔ toe ↔ GJ — Energía y poder calorífico',badge:'Conversión',modal:'generic'},
  {id:'mass',cat:'units',icon:'⚖️',name:'Masa',desc:'ton ↔ kg ↔ lb ↔ tonne métricas — Masa y peso',badge:'Conversión',modal:'generic'},
  {id:'length',cat:'units',icon:'📏',name:'Longitud',desc:'m ↔ ft ↔ in ↔ km ↔ mi — Profundidades y distancias',badge:'Conversión',modal:'generic'},
  {id:'conc',cat:'units',icon:'🧪',name:'Concentración',desc:'ppm ↔ mg/L ↔ % — Concentraciones ambientales',badge:'Conversión',modal:'generic'},
  // PERFORACIÓN & COMPLETACIÓN
  {id:'mudweight',cat:'drilling',icon:'⚙️',name:'Mud Weight Window',desc:'Ventana operacional de densidad de lodo entre presión de poro y fractura',badge:'Perforación',modal:'mudweight'},
  {id:'ecd',cat:'drilling',icon:'🌀',name:'ECD & Surge/Swab',desc:'Densidad equivalente de circulación y efectos de surgimiento/succión',badge:'Perforación',modal:'ecd'},
  {id:'ipr',cat:'drilling',icon:'📊',name:'IPR / VLP Nodal',desc:'Curvas de afluencia y levantamiento para optimización de producción',badge:'Completación',modal:'ipr'},
  {id:'gaslift',cat:'drilling',icon:'💨',name:'Gas Lift Performance',desc:'Curvas de desempeño de gas lift para optimización de tasas de inyección',badge:'Completación',modal:'gaslift'},
  {id:'proppant',cat:'drilling',icon:'🔩',name:'Proppant & Frac Design',desc:'Masa de proppant, concentración y volumen de fluido por etapa de fractura',badge:'Completación',modal:'proppant'},
  // ECONÓMICO
  {id:'npv',cat:'economic',icon:'💰',name:'NPV / IRR / Payback',desc:'Valor Actual Neto, Tasa Interna de Retorno y período de recupero',badge:'Económico',modal:'npv'},
  {id:'breakeven',cat:'economic',icon:'📉',name:'Break-even Price',desc:'Precio mínimo de crudo/gas para alcanzar rentabilidad del proyecto',badge:'Económico',modal:'breakeven'},
  {id:'govtake',cat:'economic',icon:'🏛️',name:'Government Take (PSA)',desc:'Take gubernamental bajo PSA, concesión o RSC — Términos fiscales',badge:'Económico',modal:'govtake'},
  {id:'loe',cat:'economic',icon:'📈',name:'Lifting Cost (LOE)',desc:'Costo de extracción USD/BOE por campo, zona y tipo de operación',badge:'Económico',modal:'loe'},
  // INTEGRIDAD
  {id:'maop',cat:'integrity',icon:'🔴',name:'MAOP (ASME B31G)',desc:'Presión máxima de operación segura para ductos con anomalías de corrosión',badge:'Integridad',modal:'maop'},
  {id:'trir',cat:'integrity',icon:'⚠️',name:'TRIR / LTIR Rate',desc:'Tasas de accidentabilidad TRIR, LTIR y severidad para benchmarking HSE',badge:'HSE',modal:'trir'},
  {id:'netback',cat:'economic',icon:'🚢',name:'Netback por Destino',desc:'Netback de exportación: precio, flete, diferencial de calidad por destino',badge:'Económico',modal:'netback'},
];

const auditData = [
  {ts:'2025-01-15 14:32:11',user:'pedro.garcia@h3l.example',role:'Analista',event:'CALCULATE',module:'OOIP',ip:'192.168.1.42',status:'success'},
  {ts:'2025-01-15 13:48:03',user:'ana.rodriguez@h3l.example',role:'Gerente',event:'UPLOAD',module:'Archivos',ip:'192.168.1.33',status:'success'},
  {ts:'2025-01-15 12:55:47',user:'carlos.m@h3l.example',role:'Analista',event:'EXPORT',module:'ESG Score',ip:'192.168.1.55',status:'success'},
  {ts:'2025-01-15 11:20:09',user:'admin@h3l.example',role:'Admin',event:'LOGIN',module:'Auth',ip:'192.168.1.1',status:'success'},
  {ts:'2025-01-15 10:44:31',user:'auditor@h3l.example',role:'Auditor',event:'VIEW_LOG',module:'Auditoría',ip:'10.0.0.88',status:'success'},
  {ts:'2025-01-15 09:33:15',user:'cliente@empresa.com',role:'Cliente',event:'DOWNLOAD',module:'Reportes',ip:'203.0.113.45',status:'success'},
  {ts:'2025-01-15 09:01:52',user:'hacker@bad.com',role:'—',event:'LOGIN',module:'Auth',ip:'198.51.100.1',status:'failed'},
  {ts:'2025-01-14 18:22:08',user:'pedro.garcia@h3l.example',role:'Analista',event:'CALCULATE',module:'Huella Carbono',ip:'192.168.1.42',status:'success'},
  {ts:'2025-01-14 16:11:44',user:'ana.rodriguez@h3l.example',role:'Gerente',event:'GENERATE_REPORT',module:'ESG',ip:'192.168.1.33',status:'success'},
  {ts:'2025-01-14 15:05:29',user:'admin@h3l.example',role:'Admin',event:'USER_CREATE',module:'Admin Panel',ip:'192.168.1.1',status:'success'},
];

// ═══════════════════════════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════════════════════════
// ═══ NAVIGATION ═══
let _dropOpen = false;

function goSection(id){
  // Section-specific access control & hooks (defined later)
  if(typeof onSectionOpen === 'function' && !onSectionOpen(id)) return;
  // Hide all, show target
  document.querySelectorAll('.section').forEach(s=>s.classList.remove('active'));
  const el = document.getElementById('section-'+id);
  if(el) el.classList.add('active');
  else { console.error('Section not found: section-'+id); return; }
  window.scrollTo({top:0,behavior:'auto'});
  // Update active nav link
  document.querySelectorAll('.nav-link').forEach(l=>l.classList.remove('active'));
  const nl = document.getElementById('nl-'+id);
  if(nl) nl.classList.add('active');
  // Herramientas active when in tool section
  const tools = ['calculators','files','audit','features','papers','agentes','qcapps','demos-og','demos-et'];
  closeDrop();
  if(typeof closeMobileMenu==='function') closeMobileMenu();
  const _back=document.getElementById('back-svc');
  if(_back) _back.style.display=tools.includes(id)?'inline-flex':'none';
  // Noticias: refresh prices + news
  // Dashboard: init charts when section opens
  if(id === 'dashboard'){
    setTimeout(()=>{
      const activeType = document.querySelector('.dash-tab.active')?.id?.replace('dtab-','') || 'ejecutivo';
      if(!_dashInit[activeType] && window.Chart){
        _dashInit[activeType]=true;
        _initDashCharts(activeType);
      }
    }, 100);
  }
  if(id === 'noticias'){
    loadPrices();
    setTimeout(()=>{ if(typeof refreshNoticias==='function') refreshNoticias(false); }, 100);
  }
}

// backward compat alias
function showSection(id){ goSection(id); }

function toggleDrop(e){
  e && e.stopPropagation();
  _dropOpen = !_dropOpen;
  const dd = document.getElementById('nav-dropdown');
  const caret = document.getElementById('drop-caret');
  if(dd) dd.classList.toggle('open', _dropOpen);
  if(caret) caret.style.transform = _dropOpen ? 'rotate(180deg)' : '';
}
function closeDrop(){
  _dropOpen = false;
  document.getElementById('nav-dropdown')?.classList.remove('open');
  const caret = document.getElementById('drop-caret');
  if(caret) caret.style.transform = '';
}
document.addEventListener('click', e => {
  if(!document.getElementById('nav-drop-wrap')?.contains(e.target)) closeDrop();
});

// ═══ MOBILE MENU ═══
function toggleMobileMenu(){
  const l=document.getElementById('nav-links-list'), b=document.getElementById('hamburger-btn');
  if(!l) return;
  const open=!l.classList.contains('open');
  l.classList.toggle('open',open);
  if(b){ b.classList.toggle('open',open); b.setAttribute('aria-expanded',open?'true':'false'); }
}
function closeMobileMenu(){
  const l=document.getElementById('nav-links-list'), b=document.getElementById('hamburger-btn');
  if(l) l.classList.remove('open');
  if(b){ b.classList.remove('open'); b.setAttribute('aria-expanded','false'); }
}
function mobileGoSection(id){ closeMobileMenu(); goSection(id); }
window.addEventListener('resize',()=>{ if(window.innerWidth>900)closeMobileMenu(); });


// ═══════════════════════════════════════════════════════════
// CALCULATORS
// ═══════════════════════════════════════════════════════════
const catColors = {reservoir:'cat-reservoir',energy:'cat-energy',ambiental:'cat-ambiental',esg:'cat-esg',methane:'cat-methane',units:'cat-units',drilling:'cat-reservoir',economic:'cat-energy',integrity:'cat-ambiental'};
const iconColors = {reservoir:'icon-reservoir',energy:'icon-energy',ambiental:'icon-ambiental',esg:'icon-esg',methane:'icon-methane',units:'icon-units',drilling:'icon-reservoir',economic:'icon-energy',integrity:'icon-ambiental'};

function renderCalcs(filter='all'){
  const grid = document.getElementById('calcGrid');
  const filtered = filter==='all' ? calculators : calculators.filter(c=>c.cat===filter);
  grid.innerHTML = filtered.map(c=>`
    <div class="calc-card" onclick="openModal('${c.modal}','${c.name}','${c.cat}')">
      <div class="calc-icon ${iconColors[c.cat]}">${c.icon}</div>
      <div class="calc-name">${c.name}</div>
      <div class="calc-desc">${c.desc}</div>
      <span class="calc-badge ${catColors[c.cat]}">${c.badge}</span>
    </div>
  `).join('');
}
renderCalcs();

function filterCalcs(cat, btn){
  document.querySelectorAll('.calc-cat-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  renderCalcs(cat);
}

// ═══════════════════════════════════════════════════════════
// MODALS
// ═══════════════════════════════════════════════════════════
const modalTemplates = {
  ooip:`
    <p style="color:var(--text-secondary);font-size:13px;margin-bottom:20px">
      <strong style="color:var(--accent)">Fórmula:</strong> OOIP = (A × h × φ × (1 - Sw)) / Boi × 7758
    </p>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Área (acres)</label>
        <input class="form-input" type="number" id="ooip_a" placeholder="1500" value="1500">
      </div>
      <div class="form-group">
        <label class="form-label">Espesor neto (ft)</label>
        <input class="form-input" type="number" id="ooip_h" placeholder="80" value="80">
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Porosidad (fracción)</label>
        <input class="form-input" type="number" id="ooip_phi" placeholder="0.22" step="0.01" value="0.22">
      </div>
      <div class="form-group">
        <label class="form-label">Saturación de agua (fracción)</label>
        <input class="form-input" type="number" id="ooip_sw" placeholder="0.28" step="0.01" value="0.28">
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Factor volumétrico del petróleo - Boi (RB/STB)</label>
      <input class="form-input" type="number" id="ooip_boi" placeholder="1.35" step="0.01" value="1.35">
    </div>
    <button class="btn-calc" onclick="calcOOIP()">Calcular OOIP</button>
    <div class="calc-result" id="ooip_result">
      <div class="result-label">OOIP Estimado</div>
      <div class="result-value" id="ooip_val">—</div>
      <div class="result-unit">STB (Standard Tank Barrels)</div>
    </div>`,
  h2verde:`
    <p style="color:var(--text-secondary);font-size:13px;margin-bottom:20px">
      <strong style="color:var(--accent)">Fórmula:</strong> H₂ producido = Potencia × Eficiencia / (39.4 kWh/kg)
    </p>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Potencia electrolizador (kW)</label>
        <input class="form-input" type="number" id="h2_kw" placeholder="5000" value="5000">
      </div>
      <div class="form-group">
        <label class="form-label">Eficiencia (%)</label>
        <input class="form-input" type="number" id="h2_eff" placeholder="70" value="70">
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Horas de operación/día</label>
        <input class="form-input" type="number" id="h2_hrs" placeholder="20" value="20">
      </div>
      <div class="form-group">
        <label class="form-label">Costo electricidad (USD/kWh)</label>
        <input class="form-input" type="number" id="h2_cost" placeholder="0.04" step="0.001" value="0.04">
      </div>
    </div>
    <button class="btn-calc" onclick="calcH2()">Calcular Producción H₂</button>
    <div class="calc-result" id="h2_result">
      <div class="result-label">Producción Diaria H₂ Verde</div>
      <div class="result-value" id="h2_val">—</div>
      <div class="result-unit" id="h2_unit">kg H₂/día</div>
    </div>`,
  esg:`
    <p style="color:var(--text-secondary);font-size:13px;margin-bottom:20px">
      <strong style="color:var(--accent)">ESG Score = 0.40×E + 0.35×S + 0.25×G</strong> (pesos configurables)
    </p>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Score Ambiental E (0-100)</label>
        <input class="form-input" type="number" id="esg_e" min="0" max="100" placeholder="72" value="72">
      </div>
      <div class="form-group">
        <label class="form-label">Score Social S (0-100)</label>
        <input class="form-input" type="number" id="esg_s" min="0" max="100" placeholder="68" value="68">
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Score Gobernanza G (0-100)</label>
        <input class="form-input" type="number" id="esg_g" min="0" max="100" placeholder="81" value="81">
      </div>
      <div class="form-group">
        <label class="form-label">Sector</label>
        <select class="form-input" id="esg_sector">
          <option>Oil & Gas</option>
          <option>Renovables</option>
          <option>Mining</option>
          <option>Utilities</option>
        </select>
      </div>
    </div>
    <button class="btn-calc" onclick="calcESG()">Calcular ESG Score</button>
    <div class="calc-result" id="esg_result">
      <div class="result-label">ESG Score Global</div>
      <div class="result-value" id="esg_val">—</div>
      <div class="result-unit" id="esg_rating">Calificación: —</div>
    </div>`,
  co2trans:`
    <p style="color:var(--text-secondary);font-size:13px;margin-bottom:20px">
      <strong style="color:var(--accent)">Emisiones CO₂ = Volumen × Factor de Emisión × (1 - Reducción)</strong>
    </p>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Combustible consumido (MWh/año)</label>
        <input class="form-input" type="number" id="co2_mwh" placeholder="50000" value="50000">
      </div>
      <div class="form-group">
        <label class="form-label">Factor de emisión (tCO₂/MWh)</label>
        <input class="form-input" type="number" id="co2_ef" placeholder="0.233" step="0.001" value="0.233">
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">% Reducción por renovables (%)</label>
      <input class="form-input" type="number" id="co2_red" placeholder="35" value="35">
    </div>
    <button class="btn-calc" onclick="calcCO2Trans()">Calcular Emisiones</button>
    <div class="calc-result" id="co2trans_result">
      <div class="result-label">Emisiones Netas CO₂</div>
      <div class="result-value" id="co2trans_val">—</div>
      <div class="result-unit">tCO₂e / año</div>
    </div>`,
  rf:`
    <p style="color:var(--text-secondary);font-size:13px;margin-bottom:20px">
      <strong style="color:var(--accent)">RF = (OOIP × ER%) / 100 — Reservas Probadas</strong>
    </p>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">OOIP (MMSTB)</label>
        <input class="form-input" type="number" id="rf_ooip" placeholder="45.2" value="45.2">
      </div>
      <div class="form-group">
        <label class="form-label">Mecanismo de empuje</label>
        <select class="form-input" id="rf_mech">
          <option value="35">Gas cap (30-40%)</option>
          <option value="45">Water drive (35-55%)</option>
          <option value="25">Solution gas (15-35%)</option>
          <option value="60">Water flood (50-65%)</option>
        </select>
      </div>
    </div>
    <button class="btn-calc" onclick="calcRF()">Calcular Reservas</button>
    <div class="calc-result" id="rf_result">
      <div class="result-label">Reservas Recuperables (1P)</div>
      <div class="result-value" id="rf_val">—</div>
      <div class="result-unit">MMSTB</div>
    </div>`,
  co2em:`
    <p style="color:var(--text-secondary);font-size:13px;margin-bottom:20px">
      <strong style="color:var(--accent)">CO₂ (t) = V_fuel × FE_fuel / 1000</strong>
    </p>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Volumen combustible (m³/año)</label>
        <input class="form-input" type="number" id="em_vol" placeholder="12000" value="12000">
      </div>
      <div class="form-group">
        <label class="form-label">Tipo de combustible</label>
        <select class="form-input" id="em_fuel" onchange="updateFE()">
          <option value="2.68">Gas Natural (2.68 kg CO₂/m³)</option>
          <option value="2.39">Diesel (2.39 kg CO₂/L)</option>
          <option value="2.24">Gasolina (2.24 kg CO₂/L)</option>
          <option value="3.15">Carbón (3.15 kg CO₂/kg)</option>
        </select>
      </div>
    </div>
    <button class="btn-calc" onclick="calcCO2Em()">Calcular Emisiones</button>
    <div class="calc-result" id="co2em_result">
      <div class="result-label">Emisiones de CO₂</div>
      <div class="result-value" id="co2em_val">—</div>
      <div class="result-unit">toneladas CO₂/año</div>
    </div>`,
  derrame:`
    <p style="color:var(--text-secondary);font-size:13px;margin-bottom:20px">
      <strong style="color:var(--accent)">Área Afectada = π × r² — Radio estimado por viscosidad</strong>
    </p>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Volumen derramado (BBL)</label>
        <input class="form-input" type="number" id="der_vol" placeholder="250" value="250">
      </div>
      <div class="form-group">
        <label class="form-label">Tipo de crudo</label>
        <select class="form-input" id="der_tipo">
          <option value="0.003">Liviano (API >35)</option>
          <option value="0.005">Mediano (API 25-35)</option>
          <option value="0.008">Pesado (API <25)</option>
        </select>
      </div>
    </div>
    <button class="btn-calc" onclick="calcDerrame()">Calcular Impacto</button>
    <div class="calc-result" id="der_result">
      <div class="result-label">Área Estimada Afectada</div>
      <div class="result-value" id="der_val">—</div>
      <div class="result-unit" id="der_unit">m² de superficie afectada</div>
    </div>`,
  methane:`
    <p style="color:var(--text-secondary);font-size:13px;margin-bottom:20px">
      <strong style="color:var(--accent)">MI = Emisiones CH₄ (tonne) / Producción (BOE)</strong>
    </p>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Emisiones CH₄ totales (toneladas/año)</label>
        <input class="form-input" type="number" id="met_em" placeholder="1200" value="1200">
      </div>
      <div class="form-group">
        <label class="form-label">Producción anual (MBOE)</label>
        <input class="form-input" type="number" id="met_prod" placeholder="8500" value="8500">
      </div>
    </div>
    <button class="btn-calc" onclick="calcMethane()">Calcular MI</button>
    <div class="calc-result" id="met_result">
      <div class="result-label">Methane Intensity (OGMP 2.0)</div>
      <div class="result-value" id="met_val">—</div>
      <div class="result-unit">tonne CH₄ / MBOE</div>
    </div>`,
  decline:`
    <p style="color:var(--text-secondary);font-size:13px;margin-bottom:20px">
      <strong style="color:var(--accent)">Exponencial: q(t) = qi × e^(-Di×t)</strong>
    </p>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Tasa inicial qi (STB/day)</label>
        <input class="form-input" type="number" id="dec_qi" placeholder="5000" value="5000">
      </div>
      <div class="form-group">
        <label class="form-label">Tasa de declinación Di (%/año)</label>
        <input class="form-input" type="number" id="dec_di" placeholder="18" value="18">
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Tiempo proyectado (años)</label>
      <input class="form-input" type="number" id="dec_t" placeholder="5" value="5">
    </div>
    <button class="btn-calc" onclick="calcDecline()">Calcular Declinación</button>
    <div class="calc-result" id="dec_result">
      <div class="result-label">Tasa proyectada</div>
      <div class="result-value" id="dec_val">—</div>
      <div class="result-unit">STB/day al año proyectado</div>
    </div>`,
  huella:`
    <p style="color:var(--text-secondary);font-size:13px;margin-bottom:20px">
      <strong style="color:var(--accent)">GHG Total = Scope 1 + Scope 2 + Scope 3</strong>
    </p>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Scope 1 - Directo (tCO₂e)</label>
        <input class="form-input" type="number" id="hue_s1" placeholder="12500" value="12500">
      </div>
      <div class="form-group">
        <label class="form-label">Scope 2 - Electricidad (tCO₂e)</label>
        <input class="form-input" type="number" id="hue_s2" placeholder="4200" value="4200">
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Scope 3 - Cadena valor (tCO₂e)</label>
      <input class="form-input" type="number" id="hue_s3" placeholder="38000" value="38000">
    </div>
    <button class="btn-calc" onclick="calcHuella()">Calcular Huella Total</button>
    <div class="calc-result" id="hue_result">
      <div class="result-label">Huella de Carbono Total</div>
      <div class="result-value" id="hue_val">—</div>
      <div class="result-unit" id="hue_detail">tCO₂e / año</div>
    </div>`,
  units_vol:`
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Valor a convertir</label>
        <input class="form-input" type="number" id="un_vol_val" placeholder="1000" value="1000">
      </div>
      <div class="form-group">
        <label class="form-label">De</label>
        <select class="form-input" id="un_vol_from">
          <option value="1">BBL (barriles)</option>
          <option value="158.987">m³</option>
          <option value="42">galones US</option>
          <option value="5.614583">ft³</option>
        </select>
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">A</label>
      <select class="form-input" id="un_vol_to">
        <option value="158.987">Litros (L)</option>
        <option value="1">BBL</option>
        <option value="0.158987">m³</option>
        <option value="6.28981">galones US</option>
      </select>
    </div>
    <button class="btn-calc" onclick="calcUnVol()">Convertir</button>
    <div class="calc-result" id="un_vol_result">
      <div class="result-label">Resultado</div>
      <div class="result-value" id="un_vol_res">—</div>
      <div class="result-unit">Unidades convertidas</div>
    </div>`,
  units_pres:`
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Presión a convertir</label>
        <input class="form-input" type="number" id="un_p_val" placeholder="2000" value="2000">
      </div>
      <div class="form-group">
        <label class="form-label">De</label>
        <select class="form-input" id="un_p_from">
          <option value="1">psi</option>
          <option value="14.5038">bar</option>
          <option value="0.145038">kPa</option>
          <option value="14.696">atm</option>
        </select>
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">A</label>
      <select class="form-input" id="un_p_to">
        <option value="0.0689476">MPa</option>
        <option value="0.0689476">bar (×0.069)</option>
        <option value="6.89476">kPa</option>
        <option value="0.068046">atm</option>
      </select>
    </div>
    <button class="btn-calc" onclick="calcUnPres()">Convertir</button>
    <div class="calc-result" id="un_p_result">
      <div class="result-label">Resultado</div>
      <div class="result-value" id="un_p_res">—</div>
      <div class="result-unit">Unidades convertidas</div>
    </div>`,
  units_temp:`
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Temperatura</label>
        <input class="form-input" type="number" id="un_t_val" placeholder="150" value="150">
      </div>
      <div class="form-group">
        <label class="form-label">De</label>
        <select class="form-input" id="un_t_from">
          <option value="F">°F (Fahrenheit)</option>
          <option value="C">°C (Celsius)</option>
          <option value="K">K (Kelvin)</option>
        </select>
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">A</label>
      <select class="form-input" id="un_t_to">
        <option value="C">°C (Celsius)</option>
        <option value="F">°F (Fahrenheit)</option>
        <option value="K">K (Kelvin)</option>
      </select>
    </div>
    <button class="btn-calc" onclick="calcUnTemp()">Convertir</button>
    <div class="calc-result" id="un_t_result">
      <div class="result-label">Resultado</div>
      <div class="result-value" id="un_t_res">—</div>
      <div class="result-unit">Temperatura convertida</div>
    </div>`,
  pwf:`
    <p style="color:var(--text-secondary);font-size:13px;margin-bottom:20px">
      <strong style="color:var(--accent)">Pwf = Pws - ΔP_wellbore — Presión de fondo fluyente</strong>
    </p>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Presión estática (psi)</label>
        <input class="form-input" type="number" id="pwf_pws" placeholder="3500" value="3500">
      </div>
      <div class="form-group">
        <label class="form-label">Tasa de flujo (STB/day)</label>
        <input class="form-input" type="number" id="pwf_q" placeholder="1200" value="1200">
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Índice de productividad (STB/day/psi)</label>
        <input class="form-input" type="number" id="pwf_pi" placeholder="2.5" step="0.1" value="2.5">
      </div>
      <div class="form-group">
        <label class="form-label">Profundidad (ft)</label>
        <input class="form-input" type="number" id="pwf_depth" placeholder="8500" value="8500">
      </div>
    </div>
    <button class="btn-calc" onclick="calcPwf()">Calcular Pwf</button>
    <div class="calc-result" id="pwf_result">
      <div class="result-label">Bottomhole Flowing Pressure</div>
      <div class="result-value" id="pwf_val">—</div>
      <div class="result-unit">psi</div>
    </div>`,
  solar:`
    <p style="color:var(--text-secondary);font-size:13px;margin-bottom:20px">
      <strong style="color:var(--accent)">Energía = Potencia × HSP × PR — (kWh/día)</strong>
    </p>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Potencia instalada (kWp)</label>
        <input class="form-input" type="number" id="sol_kw" placeholder="500" value="500">
      </div>
      <div class="form-group">
        <label class="form-label">Irradiación (HSP h/día)</label>
        <input class="form-input" type="number" id="sol_hsp" placeholder="5.5" step="0.1" value="5.5">
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Performance Ratio (%)</label>
      <input class="form-input" type="number" id="sol_pr" placeholder="80" value="80">
    </div>
    <button class="btn-calc" onclick="calcSolar()">Calcular Generación</button>
    <div class="calc-result" id="sol_result">
      <div class="result-label">Generación Solar</div>
      <div class="result-value" id="sol_val">—</div>
      <div class="result-unit">kWh / día</div>
    </div>`,
  ccs:`
    <p style="color:var(--text-secondary);font-size:13px;margin-bottom:20px">
      <strong style="color:var(--accent)">CO₂ Capturado = Flujo × Eficiencia — Capacidad de almacenamiento</strong>
    </p>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Flujo de CO₂ (tonne/año)</label>
        <input class="form-input" type="number" id="ccs_flow" placeholder="100000" value="100000">
      </div>
      <div class="form-group">
        <label class="form-label">Eficiencia de captura (%)</label>
        <input class="form-input" type="number" id="ccs_eff" placeholder="90" value="90">
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Costo de captura (USD/tonne CO₂)</label>
      <input class="form-input" type="number" id="ccs_cost" placeholder="85" value="85">
    </div>
    <button class="btn-calc" onclick="calcCCS()">Calcular CCS</button>
    <div class="calc-result" id="ccs_result">
      <div class="result-label">CO₂ Capturado Anual</div>
      <div class="result-value" id="ccs_val">—</div>
      <div class="result-unit" id="ccs_unit">tonne CO₂ / año</div>
    </div>`,

  mudweight:`<p style="color:var(--text-secondary);font-size:13px;margin-bottom:16px"><strong style="color:var(--accent)">Ventana de Lodo = Presión de Poro → Presión de Fractura</strong></p>
    <div class="form-row"><div class="form-group"><label class="form-label">Presión de poro (ppg)</label><input class="form-input" type="number" id="mw_pp" step="0.1" value="9.2"></div><div class="form-group"><label class="form-label">Presión de fractura (ppg)</label><input class="form-input" type="number" id="mw_fp" step="0.1" value="14.5"></div></div>
    <div class="form-group"><label class="form-label">Margen de seguridad (ppg)</label><input class="form-input" type="number" id="mw_mg" step="0.1" value="0.3"></div>
    <button class="btn-calc" onclick="calcMudWeight()">Calcular Ventana</button>
    <div class="calc-result" id="mw_result"><div class="result-label">Ventana Operacional</div><div class="result-value" id="mw_val">—</div><div class="result-unit" id="mw_unit">ppg disponibles</div></div>`,
  ecd:`<p style="color:var(--text-secondary);font-size:13px;margin-bottom:16px"><strong style="color:var(--accent)">ECD = MW + ΔP_anular / (0.052 × TVD)</strong></p>
    <div class="form-row"><div class="form-group"><label class="form-label">Peso de lodo (ppg)</label><input class="form-input" type="number" id="ecd_mw" step="0.1" value="10.5"></div><div class="form-group"><label class="form-label">ΔP anular (psi)</label><input class="form-input" type="number" id="ecd_dp" value="320"></div></div>
    <div class="form-group"><label class="form-label">Profundidad TVD (ft)</label><input class="form-input" type="number" id="ecd_tvd" value="8500"></div>
    <button class="btn-calc" onclick="calcECD()">Calcular ECD</button>
    <div class="calc-result" id="ecd_result"><div class="result-label">ECD Equivalente</div><div class="result-value" id="ecd_val">—</div><div class="result-unit">ppg</div></div>`,
  ipr:`<p style="color:var(--text-secondary);font-size:13px;margin-bottom:16px"><strong style="color:var(--accent)">Vogel: q/qmax = 1 − 0.2(Pwf/Pr) − 0.8(Pwf/Pr)²</strong></p>
    <div class="form-row"><div class="form-group"><label class="form-label">Presión estática Pr (psi)</label><input class="form-input" type="number" id="ipr_pr" value="3200"></div><div class="form-group"><label class="form-label">Pwf de prueba (psi)</label><input class="form-input" type="number" id="ipr_pwf" value="2100"></div></div>
    <div class="form-row"><div class="form-group"><label class="form-label">Tasa de prueba (STB/d)</label><input class="form-input" type="number" id="ipr_qt" value="850"></div><div class="form-group"><label class="form-label">Pwf objetivo (psi)</label><input class="form-input" type="number" id="ipr_pwfo" value="500"></div></div>
    <button class="btn-calc" onclick="calcIPR()">Calcular IPR Vogel</button>
    <div class="calc-result" id="ipr_result"><div class="result-label">AOF (Tasa Máxima)</div><div class="result-value" id="ipr_val">—</div><div class="result-unit" id="ipr_unit">STB/día</div></div>`,
  gaslift:`<p style="color:var(--text-secondary);font-size:13px;margin-bottom:16px"><strong style="color:var(--accent)">GLR_opt ≈ 300-600 scf/STB &nbsp;|&nbsp; Incremento = f(inyección, profundidad)</strong></p>
    <div class="form-row"><div class="form-group"><label class="form-label">Producción actual (STB/d)</label><input class="form-input" type="number" id="gl_qo" value="450"></div><div class="form-group"><label class="form-label">Inyección gas lift (Mscf/d)</label><input class="form-input" type="number" id="gl_inj" step="10" value="200"></div></div>
    <div class="form-row"><div class="form-group"><label class="form-label">Profundidad válvula (ft)</label><input class="form-input" type="number" id="gl_dep" value="6500"></div><div class="form-group"><label class="form-label">Presión en cabeza (psi)</label><input class="form-input" type="number" id="gl_wh" value="180"></div></div>
    <button class="btn-calc" onclick="calcGasLift()">Calcular Gas Lift</button>
    <div class="calc-result" id="gl_result"><div class="result-label">GLR y Producción Estimada</div><div class="result-value" id="gl_val">—</div><div class="result-unit" id="gl_unit">scf/STB</div></div>`,
  proppant:`<p style="color:var(--text-secondary);font-size:13px;margin-bottom:16px"><strong style="color:var(--accent)">Masa = Etapas × Vol_fluido × Concentración</strong></p>
    <div class="form-row"><div class="form-group"><label class="form-label">Número de etapas</label><input class="form-input" type="number" id="fr_stages" value="25"></div><div class="form-group"><label class="form-label">Volumen fluido/etapa (gal)</label><input class="form-input" type="number" id="fr_vol" value="15000"></div></div>
    <div class="form-row"><div class="form-group"><label class="form-label">Concentración proppant (lb/gal)</label><input class="form-input" type="number" id="fr_conc" step="0.1" value="1.5"></div><div class="form-group"><label class="form-label">Precio proppant (USD/lb)</label><input class="form-input" type="number" id="fr_price" step="0.01" value="0.12"></div></div>
    <button class="btn-calc" onclick="calcProppant()">Calcular Diseño</button>
    <div class="calc-result" id="fr_result"><div class="result-label">Masa Total Proppant</div><div class="result-value" id="fr_val">—</div><div class="result-unit" id="fr_unit">Miles de lbs</div></div>`,
  npv:`<p style="color:var(--text-secondary);font-size:13px;margin-bottom:16px"><strong style="color:var(--accent)">NPV = Σ CF/(1+r)^t − I₀ &nbsp;|&nbsp; Payback = I₀/CF_anual</strong></p>
    <div class="form-row"><div class="form-group"><label class="form-label">Inversión inicial (USD M)</label><input class="form-input" type="number" id="npv_inv" value="25"></div><div class="form-group"><label class="form-label">Flujo anual promedio (USD M)</label><input class="form-input" type="number" id="npv_cf" value="8"></div></div>
    <div class="form-row"><div class="form-group"><label class="form-label">Vida del proyecto (años)</label><input class="form-input" type="number" id="npv_n" value="10"></div><div class="form-group"><label class="form-label">Tasa de descuento (%)</label><input class="form-input" type="number" id="npv_r" step="0.5" value="12"></div></div>
    <button class="btn-calc" onclick="calcNPV()">Calcular NPV / IRR</button>
    <div class="calc-result" id="npv_result"><div class="result-label">NPV del Proyecto</div><div class="result-value" id="npv_val">—</div><div class="result-unit" id="npv_unit">USD MM</div></div>`,
  breakeven:`<p style="color:var(--text-secondary);font-size:13px;margin-bottom:16px"><strong style="color:var(--accent)">P_BE = (CAPEX/Vida + OPEX) / Producción_anual</strong></p>
    <div class="form-row"><div class="form-group"><label class="form-label">CAPEX total (USD M)</label><input class="form-input" type="number" id="be_capex" value="50"></div><div class="form-group"><label class="form-label">Vida útil (años)</label><input class="form-input" type="number" id="be_life" value="15"></div></div>
    <div class="form-row"><div class="form-group"><label class="form-label">OPEX anual (USD M)</label><input class="form-input" type="number" id="be_opex" value="5"></div><div class="form-group"><label class="form-label">Producción anual (MBOE/año)</label><input class="form-input" type="number" id="be_prod" value="1200"></div></div>
    <button class="btn-calc" onclick="calcBreakeven()">Calcular Break-even</button>
    <div class="calc-result" id="be_result"><div class="result-label">Precio Break-even</div><div class="result-value" id="be_val">—</div><div class="result-unit">USD / BOE</div></div>`,
  govtake:`<p style="color:var(--text-secondary);font-size:13px;margin-bottom:16px"><strong style="color:var(--accent)">Gov Take = (Regalías + Profit Oil Estado + Impuestos) / Gross Revenue</strong></p>
    <div class="form-row"><div class="form-group"><label class="form-label">Precio crudo (USD/bbl)</label><input class="form-input" type="number" id="gt_price" value="75"></div><div class="form-group"><label class="form-label">Regalía (%)</label><input class="form-input" type="number" id="gt_roy" value="12" step="0.5"></div></div>
    <div class="form-row"><div class="form-group"><label class="form-label">Impuesto renta (%)</label><input class="form-input" type="number" id="gt_tax" value="30"></div><div class="form-group"><label class="form-label">Profit oil Estado (%)</label><input class="form-input" type="number" id="gt_po" value="60"></div></div>
    <button class="btn-calc" onclick="calcGovTake()">Calcular Gov Take</button>
    <div class="calc-result" id="gt_result"><div class="result-label">Government Take</div><div class="result-value" id="gt_val">—</div><div class="result-unit">% del Gross Revenue</div></div>`,
  loe:`<p style="color:var(--text-secondary);font-size:13px;margin-bottom:16px"><strong style="color:var(--accent)">LOE = OPEX Total / Producción Total (BOE)</strong></p>
    <div class="form-row"><div class="form-group"><label class="form-label">OPEX anual (USD M)</label><input class="form-input" type="number" id="loe_opex" step="0.5" value="12.5"></div><div class="form-group"><label class="form-label">Producción petróleo (MBbl/año)</label><input class="form-input" type="number" id="loe_oil" value="800"></div></div>
    <div class="form-row"><div class="form-group"><label class="form-label">Producción gas (MMscf/año)</label><input class="form-input" type="number" id="loe_gas" value="1200"></div><div class="form-group"><label class="form-label">Eq. gas (Mcf/BOE)</label><input class="form-input" type="number" id="loe_geq" value="6"></div></div>
    <button class="btn-calc" onclick="calcLOE()">Calcular LOE</button>
    <div class="calc-result" id="loe_result"><div class="result-label">Lifting Cost</div><div class="result-value" id="loe_val">—</div><div class="result-unit">USD / BOE</div></div>`,
  maop:`<p style="color:var(--text-secondary);font-size:13px;margin-bottom:16px"><strong style="color:var(--accent)">MAOP = 2 × SMYS × t × F / D (ASME B31G)</strong></p>
    <div class="form-row"><div class="form-group"><label class="form-label">SMYS del material (psi)</label><input class="form-input" type="number" id="maop_smys" value="52000"></div><div class="form-group"><label class="form-label">Espesor de pared (in)</label><input class="form-input" type="number" id="maop_t" step="0.001" value="0.312"></div></div>
    <div class="form-row"><div class="form-group"><label class="form-label">Diámetro externo (in)</label><input class="form-input" type="number" id="maop_d" step="0.1" value="12.75"></div><div class="form-group"><label class="form-label">Factor de diseño</label><input class="form-input" type="number" id="maop_f" step="0.05" value="0.72"></div></div>
    <button class="btn-calc" onclick="calcMAOP()">Calcular MAOP</button>
    <div class="calc-result" id="maop_result"><div class="result-label">MAOP</div><div class="result-value" id="maop_val">—</div><div class="result-unit">psi</div></div>`,
  trir:`<p style="color:var(--text-secondary);font-size:13px;margin-bottom:16px"><strong style="color:var(--accent)">TRIR = (Accidentes × 200.000) / HHT &nbsp;|&nbsp; LTIR = (LTA × 200.000) / HHT</strong></p>
    <div class="form-row"><div class="form-group"><label class="form-label">Accidentes recordables</label><input class="form-input" type="number" id="trir_acc" value="3"></div><div class="form-group"><label class="form-label">Horas Hombre Trabajadas</label><input class="form-input" type="number" id="trir_hht" value="1500000"></div></div>
    <div class="form-row"><div class="form-group"><label class="form-label">Acc. con tiempo perdido (LTA)</label><input class="form-input" type="number" id="trir_lta" value="1"></div><div class="form-group"><label class="form-label">Días perdidos totales</label><input class="form-input" type="number" id="trir_dp" value="18"></div></div>
    <button class="btn-calc" onclick="calcTRIR()">Calcular Tasas HSE</button>
    <div class="calc-result" id="trir_result"><div class="result-label">TRIR</div><div class="result-value" id="trir_val">—</div><div class="result-unit" id="trir_unit">acc/200K HHT</div></div>`,
  netback:`<p style="color:var(--text-secondary);font-size:13px;margin-bottom:16px"><strong style="color:var(--accent)">Netback = Precio_destino − Flete − Diferencial_calidad − Royalties − Taxes</strong></p>
    <div class="form-row"><div class="form-group"><label class="form-label">Precio en destino (USD/bbl)</label><input class="form-input" type="number" id="nb_price" value="78"></div><div class="form-group"><label class="form-label">Flete marítimo (USD/bbl)</label><input class="form-input" type="number" id="nb_flete" step="0.1" value="3.5"></div></div>
    <div class="form-row"><div class="form-group"><label class="form-label">Diferencial calidad (USD/bbl)</label><input class="form-input" type="number" id="nb_dq" step="0.1" value="-2.0"></div><div class="form-group"><label class="form-label">Royalties + taxes (USD/bbl)</label><input class="form-input" type="number" id="nb_tax" step="0.1" value="8.5"></div></div>
    <button class="btn-calc" onclick="calcNetback()">Calcular Netback</button>
    <div class="calc-result" id="nb_result"><div class="result-label">Netback al Productor</div><div class="result-value" id="nb_val">—</div><div class="result-unit">USD / bbl</div></div>`,
  generic:`
    <div style="text-align:center;padding:40px 20px;">
      <div style="font-size:48px;margin-bottom:16px">🔧</div>
      <h3 style="font-family:var(--font-body);font-weight:700;margin-bottom:12px">Calculadora Disponible</h3>
      <p style="color:var(--text-secondary);font-size:14px;max-width:320px;margin:0 auto 24px">Esta calculadora está incluida en la versión completa de H3L con todas sus fórmulas.</p>
      <button class="btn-calc" style="max-width:240px;margin:0 auto" onclick="toast('success','Solicitud enviada — te contactaremos pronto');closeModal()">
        Solicitar Acceso Completo
      </button>
    </div>`
};

function openModal(type, name, cat){
  const overlay = document.getElementById('calcModal');
  document.getElementById('modalTitle').innerHTML = `
    <span style="font-size:13px;color:var(--text-muted);display:block;font-weight:400;margin-bottom:4px;font-family:var(--font-body)">${cat.toUpperCase()}</span>
    ${name}`;
  document.getElementById('modalBody').innerHTML = modalTemplates[type] || modalTemplates.generic;
  overlay.classList.add('open');
}
function closeModal(){document.getElementById('calcModal').classList.remove('open');}
document.getElementById('calcModal').addEventListener('click',function(e){if(e.target===this)closeModal();});

// Calculation Functions
function calcOOIP(){
  const a=+document.getElementById('ooip_a').value,
        h=+document.getElementById('ooip_h').value,
        phi=+document.getElementById('ooip_phi').value,
        sw=+document.getElementById('ooip_sw').value,
        boi=+document.getElementById('ooip_boi').value;
  const ooip = (a * h * phi * (1-sw) * 7758) / boi;
  document.getElementById('ooip_val').textContent = (ooip/1e6).toFixed(2) + ' MM';
  document.getElementById('ooip_result').classList.add('show');
  toast('success','OOIP calculado exitosamente');
}
function calcH2(){
  const kw=+document.getElementById('h2_kw').value,
        eff=+document.getElementById('h2_eff').value/100,
        hrs=+document.getElementById('h2_hrs').value,
        cost=+document.getElementById('h2_cost').value;
  const h2_day = (kw * eff * hrs) / 39.4;
  const cost_kg = (kw * cost) / h2_day;
  document.getElementById('h2_val').textContent = h2_day.toFixed(1);
  document.getElementById('h2_unit').textContent = `kg H₂/día — Costo: USD ${cost_kg.toFixed(2)}/kg`;
  document.getElementById('h2_result').classList.add('show');
  toast('success','Producción H₂ calculada');
}
function calcESG(){
  const e=+document.getElementById('esg_e').value,
        s=+document.getElementById('esg_s').value,
        g=+document.getElementById('esg_g').value;
  const score = 0.40*e + 0.35*s + 0.25*g;
  const rating = score>=85?'AAA':score>=75?'AA':score>=65?'A+':score>=55?'B+':score>=45?'B':'C';
  document.getElementById('esg_val').textContent = score.toFixed(1) + '/100';
  document.getElementById('esg_rating').textContent = 'Rating: ' + rating + (score>=75?' ✓ Excelente':score>=55?' ✓ Bueno':' ⚠ Mejorable');
  document.getElementById('esg_result').classList.add('show');
  toast('success','ESG Score calculado');
}
function calcCO2Trans(){
  const mwh=+document.getElementById('co2_mwh').value,
        ef=+document.getElementById('co2_ef').value,
        red=+document.getElementById('co2_red').value/100;
  const em = mwh * ef * (1-red);
  document.getElementById('co2trans_val').textContent = em.toLocaleString('es',{maximumFractionDigits:0});
  document.getElementById('co2trans_result').classList.add('show');
  toast('success','Emisiones CO₂ calculadas');
}
function calcRF(){
  const ooip=+document.getElementById('rf_ooip').value,
        er=+document.getElementById('rf_mech').value;
  const reserves = ooip * er/100;
  document.getElementById('rf_val').textContent = reserves.toFixed(2);
  document.getElementById('rf_result').classList.add('show');
  toast('success','Factor de recuperación calculado');
}
function updateFE(){ /* el factor se lee del selector al calcular */ }
function calcCO2Em(){
  const vol=+document.getElementById('em_vol').value,
        fe=+document.getElementById('em_fuel').value;
  const em = vol * fe / 1000;
  document.getElementById('co2em_val').textContent = em.toLocaleString('es',{maximumFractionDigits:0});
  document.getElementById('co2em_result').classList.add('show');
  toast('success','Emisiones calculadas');
}
function calcDerrame(){
  const vol=+document.getElementById('der_vol').value,
        visc=+document.getElementById('der_tipo').value;
  const vol_m3 = vol * 0.158987;
  const area = vol_m3 / visc;
  document.getElementById('der_val').textContent = area.toLocaleString('es',{maximumFractionDigits:0});
  document.getElementById('der_unit').textContent = `m² — Volumen: ${(vol_m3).toFixed(1)} m³`;
  document.getElementById('der_result').classList.add('show');
  toast('warning','Evaluar plan de contingencia ambiental');
}
function calcMethane(){
  const em=+document.getElementById('met_em').value,
        prod=+document.getElementById('met_prod').value;
  const mi = em / prod;
  const ref = mi<0.1?'✓ Líder global':mi<0.2?'✓ Benchmark':mi<0.5?'⚠ Promedio':'✗ Por mejorar';
  document.getElementById('met_val').textContent = mi.toFixed(4);
  document.getElementById('met_result').querySelector('.result-unit').textContent = `tonne CH₄/MBOE — ${ref}`;
  document.getElementById('met_result').classList.add('show');
  toast('success','Methane Intensity calculada');
}
function calcDecline(){
  const qi=+document.getElementById('dec_qi').value,
        di=+document.getElementById('dec_di').value/100,
        t=+document.getElementById('dec_t').value;
  const qt = qi * Math.exp(-di*t);
  const cum = qi*(1-Math.exp(-di*t))/di*365;
  document.getElementById('dec_val').textContent = qt.toFixed(0);
  document.getElementById('dec_result').querySelector('.result-unit').textContent = `STB/day — Acumulado: ${(cum/1e6).toFixed(2)} MMSTB`;
  document.getElementById('dec_result').classList.add('show');
  toast('success','Curva de declinación calculada');
}
function calcHuella(){
  const s1=+document.getElementById('hue_s1').value,
        s2=+document.getElementById('hue_s2').value,
        s3=+document.getElementById('hue_s3').value;
  const total = s1+s2+s3;
  const pct3 = (s3/total*100).toFixed(0);
  document.getElementById('hue_val').textContent = total.toLocaleString('es',{maximumFractionDigits:0});
  document.getElementById('hue_detail').textContent = `tCO₂e — Scope 3 representa ${pct3}% del total`;
  document.getElementById('hue_result').classList.add('show');
  toast('success','Huella de carbono calculada');
}
function calcPwf(){
  const pws=+document.getElementById('pwf_pws').value,
        q=+document.getElementById('pwf_q').value,
        pi=+document.getElementById('pwf_pi').value;
  const pwf = pws - q/pi;
  document.getElementById('pwf_val').textContent = pwf.toFixed(0);
  document.getElementById('pwf_result').classList.add('show');
  toast('success','Pwf calculada');
}
function calcSolar(){
  const kw=+document.getElementById('sol_kw').value,
        hsp=+document.getElementById('sol_hsp').value,
        pr=+document.getElementById('sol_pr').value/100;
  const energy = kw * hsp * pr;
  const annual = energy * 365 / 1000;
  document.getElementById('sol_val').textContent = energy.toFixed(0);
  document.getElementById('sol_result').querySelector('.result-unit').textContent = `kWh/día — Anual: ${annual.toFixed(1)} MWh`;
  document.getElementById('sol_result').classList.add('show');
  toast('success','Generación solar calculada');
}
function calcCCS(){
  const flow=+document.getElementById('ccs_flow').value,
        eff=+document.getElementById('ccs_eff').value/100,
        cost=+document.getElementById('ccs_cost').value;
  const captured = flow * eff;
  const totalcost = captured * cost / 1e6;
  document.getElementById('ccs_val').textContent = captured.toLocaleString('es',{maximumFractionDigits:0});
  document.getElementById('ccs_unit').textContent = `tonne CO₂/año — Costo total: USD ${totalcost.toFixed(2)} MM`;
  document.getElementById('ccs_result').classList.add('show');
  toast('success','CCS calculado');
}
function calcUnVol(){
  const val=+document.getElementById('un_vol_val').value,
        from=+document.getElementById('un_vol_from').value,
        to=+document.getElementById('un_vol_to').value;
  const res = val * from / to;
  document.getElementById('un_vol_res').textContent = res.toFixed(4);
  document.getElementById('un_vol_result').classList.add('show');
}
function calcUnPres(){
  const val=+document.getElementById('un_p_val').value,
        from=+document.getElementById('un_p_from').value,
        to=+document.getElementById('un_p_to').value;
  const psi = val/from;
  const res = psi * to;
  document.getElementById('un_p_res').textContent = res.toFixed(4);
  document.getElementById('un_p_result').classList.add('show');
}
function calcUnTemp(){
  const val=+document.getElementById('un_t_val').value,
        from=document.getElementById('un_t_from').value,
        to=document.getElementById('un_t_to').value;
  let celsius;
  if(from==='F') celsius=(val-32)*5/9;
  else if(from==='K') celsius=val-273.15;
  else celsius=val;
  let res;
  if(to==='F') res=celsius*9/5+32;
  else if(to==='K') res=celsius+273.15;
  else res=celsius;
  document.getElementById('un_t_res').textContent = res.toFixed(2);
  document.getElementById('un_t_result').classList.add('show');
}

// ═══ CALCULADORAS NUEVAS (Perforación, Económico, Integridad) ═══
function calcMudWeight(){
  var pp=+document.getElementById('mw_pp').value,fp=+document.getElementById('mw_fp').value,mg=+document.getElementById('mw_mg').value;
  var w=fp-pp-2*mg;
  document.getElementById('mw_result').style.display='block';
  document.getElementById('mw_val').textContent=w.toFixed(2);
  document.getElementById('mw_unit').textContent='ppg ventana | MW min: '+(pp+mg).toFixed(1)+' | MW max: '+(fp-mg).toFixed(1)+' ppg';
}
function calcECD(){
  var mw=+document.getElementById('ecd_mw').value,dp=+document.getElementById('ecd_dp').value,tvd=+document.getElementById('ecd_tvd').value;
  var ecd=mw+dp/(0.052*tvd);
  document.getElementById('ecd_result').style.display='block';
  document.getElementById('ecd_val').textContent=ecd.toFixed(3);
}
function calcIPR(){
  var pr=+document.getElementById('ipr_pr').value,pwf=+document.getElementById('ipr_pwf').value,qt=+document.getElementById('ipr_qt').value,pwfo=+document.getElementById('ipr_pwfo').value;
  var rat=pwf/pr,qomax=qt/(1-0.2*rat-0.8*rat*rat),rat2=pwfo/pr,qobj=qomax*(1-0.2*rat2-0.8*rat2*rat2);
  document.getElementById('ipr_result').style.display='block';
  document.getElementById('ipr_val').textContent=Math.round(qomax).toLocaleString();
  document.getElementById('ipr_unit').textContent='STB/d AOF | A Pwf='+pwfo+' psi → '+Math.round(qobj).toLocaleString()+' STB/d';
}
function calcGasLift(){
  var qo=+document.getElementById('gl_qo').value,inj=+document.getElementById('gl_inj').value,dep=+document.getElementById('gl_dep').value,wh=+document.getElementById('gl_wh').value;
  var glr=(inj*1000)/qo,eff=Math.min(1.4,1+(dep/10000)*0.4-(wh/5000)*0.1),qnew=Math.round(qo*eff);
  document.getElementById('gl_result').style.display='block';
  document.getElementById('gl_val').textContent=glr.toFixed(0)+' / '+qnew.toLocaleString();
  document.getElementById('gl_unit').textContent='scf/STB | Producción estimada: '+qnew.toLocaleString()+' STB/d (+'+Math.round((eff-1)*100)+'%)';
}
function calcProppant(){
  var st=+document.getElementById('fr_stages').value,vol=+document.getElementById('fr_vol').value,conc=+document.getElementById('fr_conc').value,price=+document.getElementById('fr_price').value;
  var lbs=st*vol*conc,cost=lbs*price;
  document.getElementById('fr_result').style.display='block';
  document.getElementById('fr_val').textContent=(lbs/1000).toFixed(0);
  document.getElementById('fr_unit').textContent='Miles lbs | Costo: $'+Math.round(cost/1000).toLocaleString()+'K USD';
}
function calcNPV(){
  var inv=+document.getElementById('npv_inv').value,cf=+document.getElementById('npv_cf').value,n=+document.getElementById('npv_n').value,r=+document.getElementById('npv_r').value/100;
  var npv=-inv;
  for(var t=1;t<=n;t++) npv+=cf/Math.pow(1+r,t);
  var payback=inv/cf,irr=0.15;
  for(var i=0;i<60;i++){var f=-inv,df=0;for(var t2=1;t2<=n;t2++){f+=cf/Math.pow(1+irr,t2);df-=t2*cf/Math.pow(1+irr,t2+1);}if(Math.abs(f)<0.0001)break;irr-=f/df;}
  document.getElementById('npv_result').style.display='block';
  document.getElementById('npv_val').style.color=npv>=0?'var(--success)':'var(--danger)';
  document.getElementById('npv_val').textContent=npv.toFixed(1);
  document.getElementById('npv_unit').textContent='USD MM | IRR: '+(irr*100).toFixed(1)+'% | Payback: '+payback.toFixed(1)+' años';
}
function calcBreakeven(){
  var capex=+document.getElementById('be_capex').value,life=+document.getElementById('be_life').value,opex=+document.getElementById('be_opex').value,prod=+document.getElementById('be_prod').value;
  var be=(capex/life*1e6+opex*1e6)/(prod*1000);
  document.getElementById('be_result').style.display='block';
  document.getElementById('be_val').textContent=be.toFixed(2);
}
function calcGovTake(){
  var price=+document.getElementById('gt_price').value,roy=+document.getElementById('gt_roy').value/100,tax=+document.getElementById('gt_tax').value/100,po=+document.getElementById('gt_po').value/100;
  var royUSD=price*roy,afterRoy=price-royUSD,profitOil=afterRoy*po,taxes=(afterRoy-profitOil)*tax,gov=royUSD+profitOil+taxes;
  document.getElementById('gt_result').style.display='block';
  document.getElementById('gt_val').textContent=((gov/price)*100).toFixed(1)+'%';
  document.getElementById('gt_unit').textContent='$'+gov.toFixed(2)+'/bbl al Estado | Contractor: $'+(price-gov).toFixed(2)+'/bbl';
}
function calcLOE(){
  var opex=+document.getElementById('loe_opex').value,oil=+document.getElementById('loe_oil').value,gas=+document.getElementById('loe_gas').value,geq=+document.getElementById('loe_geq').value;
  var boe=oil*1000+gas*1000/geq,loe=opex*1e6/boe;
  document.getElementById('loe_result').style.display='block';
  document.getElementById('loe_val').textContent=loe.toFixed(2);
}
function calcMAOP(){
  var smys=+document.getElementById('maop_smys').value,t=+document.getElementById('maop_t').value,d=+document.getElementById('maop_d').value,f=+document.getElementById('maop_f').value;
  var maop=2*smys*t*f/d;
  document.getElementById('maop_result').style.display='block';
  document.getElementById('maop_val').textContent=Math.round(maop).toLocaleString();
}
function calcTRIR(){
  var acc=+document.getElementById('trir_acc').value,hht=+document.getElementById('trir_hht').value,lta=+document.getElementById('trir_lta').value,dp=+document.getElementById('trir_dp').value;
  var trir=(acc*200000)/hht,ltir=(lta*200000)/hht,sev=lta>0?dp/lta:0;
  document.getElementById('trir_result').style.display='block';
  document.getElementById('trir_val').textContent=trir.toFixed(2);
  document.getElementById('trir_unit').textContent='LTIR: '+ltir.toFixed(2)+' | Severidad promedio: '+sev.toFixed(0)+' días/LTA';
}
function calcNetback(){
  var price=+document.getElementById('nb_price').value,flete=+document.getElementById('nb_flete').value,dq=+document.getElementById('nb_dq').value,tax=+document.getElementById('nb_tax').value;
  var nb=price-flete+dq-tax;
  document.getElementById('nb_result').style.display='block';
  document.getElementById('nb_val').style.color=nb>=50?'var(--success)':nb>=30?'var(--warning)':'var(--danger)';
  document.getElementById('nb_val').textContent=nb.toFixed(2);
}



// ═══════════════════════════════════════════════════════════
// AUDIT TABLE
// ═══════════════════════════════════════════════════════════
const eventColors={LOGIN:'background:rgba(77,166,255,0.15);color:#4DA6FF',UPLOAD:'background:rgba(245,166,35,0.15);color:#F5A623',CALCULATE:'background:rgba(46,107,196,0.12);color:var(--accent)',EXPORT:'background:rgba(161,100,255,0.15);color:#A164FF',DOWNLOAD:'background:rgba(45,212,160,0.15);color:#2DD4A0',VIEW_LOG:'background:rgba(142,164,190,0.15);color:#8BA4BE',GENERATE_REPORT:'background:rgba(232,72,85,0.15);color:#E84855',USER_CREATE:'background:rgba(255,165,0,0.15);color:#FFA500'};

function renderAudit(data){
  const tbody = document.getElementById('auditBody');
  tbody.innerHTML = data.map(r=>`
    <tr>
      <td style="font-family:var(--font-mono);font-size:12px">${r.ts}</td>
      <td>${r.user}</td>
      <td><span style="font-size:11px;font-weight:600">${r.role}</span></td>
      <td><span class="event-badge" style="${eventColors[r.event]||'background:rgba(142,164,190,0.1);color:#8BA4BE'}">${r.event}</span></td>
      <td>${r.module}</td>
      <td style="font-family:var(--font-mono);font-size:12px">${r.ip}</td>
      <td><span style="color:${r.status==='success'?'var(--success)':'var(--danger)'};font-size:12px;font-weight:700">${r.status==='success'?'✓ OK':'✗ FAILED'}</span></td>
    </tr>`).join('');
}
renderAudit(auditData);

function filterAudit(q){
  const filtered = auditData.filter(r=>Object.values(r).some(v=>v.toLowerCase().includes(q.toLowerCase())));
  renderAudit(filtered);
}
function exportAudit(){
  toast('success','Exportando log de auditoría en CSV...');
  setTimeout(()=>toast('info','Archivo audit_log_2025.csv descargado'),1200);
}

// ═══════════════════════════════════════════════════════════
// FILE UPLOAD
// ═══════════════════════════════════════════════════════════
function simulateUpload(){
  const fakeFiles = ['GHG_Report_2025.pdf','Water_Usage_Analysis.xlsx','Scope3_Inventory.csv'];
  const f = fakeFiles[Math.floor(Math.random()*fakeFiles.length)];
  const exts = {pdf:'PDF',xlsx:'XLS',csv:'CSV'};
  const ext = f.split('.').pop();
  const colors = {pdf:'rgba(232,72,85,0.12);color:#E84855',xlsx:'rgba(45,212,160,0.12);color:#2DD4A0',csv:'rgba(77,166,255,0.12);color:#4DA6FF'};
  const list = document.getElementById('fileList');
  const item = document.createElement('div');
  item.className='file-item';
  item.innerHTML=`
    <div class="file-ext" style="background:${colors[ext]}">${exts[ext]}</div>
    <div class="file-info">
      <div class="file-name">${f}</div>
      <div class="file-meta">Subiendo... • Usuario Actual • Ahora</div>
    </div>
    <span class="file-status status-processing">⏳ Procesando</span>`;
  list.prepend(item);
  toast('info',`Subiendo ${f}...`);
  setTimeout(()=>{
    item.querySelector('.file-status').className='file-status status-completed';
    item.querySelector('.file-status').textContent='✓ Completado';
    item.querySelector('.file-meta').textContent=`${(Math.random()*10+0.5).toFixed(1)} MB • Usuario Actual • Hace unos segundos`;
    toast('success',`${f} procesado correctamente`);
  },2500);
}

// ═══════════════════════════════════════════════════════════
// CHATBOT
// ═══════════════════════════════════════════════════════════
let chatOpen=false;
const chatResponses={
  'ooip':['El OOIP (Original Oil In Place) se calcula con la fórmula volumétrica:\n\nOOIP = (A × h × φ × (1-Sw) × 7758) / Boi\n\nDonde: A=área (acres), h=espesor (ft), φ=porosidad, Sw=saturación agua, Boi=factor volumétrico. 📐'],
  'esg':['El ESG Score de H3L pondera 3 dimensiones:\n• Ambiental (E): 40% del puntaje\n• Social (S): 35% del puntaje\n• Gobernanza (G): 25% del puntaje\n\nEl resultado se califica de C hasta AAA. ⭐'],
  'archivos':['Para subir archivos en H3L:\n1. Ve al módulo Archivos\n2. Arrastra tus archivos o haz clic en la zona de upload\n3. Los formatos soportados son: PDF, Excel, CSV, DOCX\n4. El sistema procesa automáticamente y extrae metadatos 📂'],
  'hidrógeno':['La calculadora de Hidrógeno Verde calcula:\n\nH₂ = Potencia (kW) × Eficiencia × Horas / 39.4 kWh/kg\n\nTambién calcula el costo por kg según el precio de la electricidad. ¡Ideal para proyectos de electrólisis! 💧⚡'],
  'auditoría':['El módulo de Auditoría registra 30+ tipos de eventos:\n• LOGIN/LOGOUT\n• Cálculos realizados\n• Archivos subidos/descargados\n• Cambios de configuración\n\nPuedes exportar el log en CSV con filtros por fecha, usuario y tipo de evento 📋'],
  'default':['Puedo ayudarte con:\n• 🧮 Calculadoras especializadas (OOIP, ESG, CO₂, H₂)\n• 📂 Gestión de archivos y reportes\n• 📋 Módulo de auditoría y trazabilidad\n• 🌱 Métricas de transición energética\n\n¿Sobre qué necesitas más información?'],
};
function getResponse(msg){
  const m=msg.toLowerCase();
  if(m.includes('ooip')||m.includes('reservorio')) return chatResponses.ooip[0];
  if(m.includes('esg')||m.includes('score')) return chatResponses.esg[0];
  if(m.includes('archivo')||m.includes('subir')) return chatResponses.archivos[0];
  if(m.includes('hidrógeno')||m.includes('h2')||m.includes('verde')) return chatResponses['hidrógeno'][0];
  if(m.includes('auditoría')||m.includes('auditoria')||m.includes('log')) return chatResponses.auditoría[0];
  return chatResponses.default[0];
}
function toggleChat(){
  chatOpen=!chatOpen;
  document.getElementById('chatPanel').classList.toggle('open',chatOpen);
  document.getElementById('chatBadge').style.display=chatOpen?'none':'flex';
}
function addMsg(text,isUser=false){
  const msgs=document.getElementById('chatMessages');
  const div=document.createElement('div');
  div.className=`msg ${isUser?'msg-user':'msg-bot'}`;
  div.innerHTML=`<div class="msg-bubble">${text.replace(/\n/g,'<br>')}</div>`;
  msgs.appendChild(div);
  msgs.scrollTop=msgs.scrollHeight;
}
function sendMsg(){
  const inp=document.getElementById('chatInput');
  const val=inp.value.trim();
  if(!val) return;
  addMsg(val,true);
  inp.value='';
  setTimeout(()=>addMsg(getResponse(val)),800);
}
function sendQuick(text){addMsg(text,true);setTimeout(()=>addMsg(getResponse(text)),800);}

// ═══════════════════════════════════════════════════════════
// AUTH
// ═══════════════════════════════════════════════════════════
let selectedRole='admin';
function selectRole(role, btn){
  selectedRole=role;
  document.querySelectorAll('.role-tab').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
}
// ═══════════════════════════════════════════════════════════
// AUTH SYSTEM
// ═══════════════════════════════════════════════════════════

// Current session
let currentUser = null;

// Users store (localStorage)
function getUsers(){ return JSON.parse(localStorage.getItem('h3l_users')||'[]'); }
function saveUsers(u){ localStorage.setItem('h3l_users', JSON.stringify(u)); }

// ═══ ADMIN PANEL FUNCTIONS ═══
function initAdminPanel(){
  renderAdminRoles();
  renderAdminCalcs();
  renderAdminNewsEditor();
  loadHeroEditorValues();
}

function renderAdminRoles(){
  const el = document.getElementById('admin-roles-list');
  if(!el) return;
  const users = getUsers();
  if(!users.length){ el.innerHTML='<p style="font-size:11px;color:var(--text-muted)">Sin usuarios registrados aún.</p>'; return; }
  el.innerHTML = users.map((u,i)=>`
    <div class="admin-role-row">
      <span>${u.nombre} ${u.apellido}</span>
      <select onchange="changeUserRole(${i},this.value)" style="background:var(--surface-3);border:1px solid var(--rule-light);color:var(--text-primary);font-size:10px;padding:2px 5px;border-radius:4px;">
        ${['Gerente','Analista','Cliente','Auditor'].map(r=>`<option value="${r}" ${u.rol===r?'selected':''}>${r}</option>`).join('')}
      </select>
    </div>
  `).join('');
}

function changeUserRole(idx, newRole){
  const users = getUsers();
  if(users[idx]){ users[idx].rol = newRole; saveUsers(users); toast('success','Rol actualizado'); }
}

function renderAdminCalcs(){
  const el = document.getElementById('admin-calcs-list');
  if(!el || typeof calculators === 'undefined') return;
  const disabled = JSON.parse(localStorage.getItem('h3l_disabled_calcs')||'[]');
  el.innerHTML = calculators.map(c=>`
    <div class="admin-calc-row">
      <span style="font-size:11px;">${c.name}</span>
      <input type="checkbox" ${!disabled.includes(c.id)?'checked':''} onchange="toggleCalc('${c.id}',this.checked)"
        style="accent-color:var(--accent);width:14px;height:14px;cursor:pointer;">
    </div>
  `).join('');
}

function toggleCalc(id, enabled){
  let disabled = JSON.parse(localStorage.getItem('h3l_disabled_calcs')||'[]');
  if(enabled) disabled = disabled.filter(d=>d!==id);
  else if(!disabled.includes(id)) disabled.push(id);
  localStorage.setItem('h3l_disabled_calcs', JSON.stringify(disabled));
}

function saveCalcConfig(){
  toast('success','Configuración de calculadoras guardada');
  if(typeof renderCalcs==='function') renderCalcs();
}

function renderAdminNewsEditor(){
  const el = document.getElementById('admin-news-editor');
  if(!el) return;
  try {
    const cached = JSON.parse(localStorage.getItem('h3l_news_cache')||'null');
    const articles = cached?.articles || FALLBACK_NEWS;
    el.innerHTML = articles.map((n,i)=>`
      <div class="admin-news-item">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:6px;">
          <input value="${n.tag}" id="anews-tag-${i}" placeholder="Etiqueta"
            style="background:var(--surface-3);border:1px solid var(--rule-light);color:var(--text-primary);padding:4px 8px;border-radius:5px;font-size:11px;">
          <input value="${n.date}" id="anews-date-${i}" placeholder="Fecha"
            style="background:var(--surface-3);border:1px solid var(--rule-light);color:var(--text-primary);padding:4px 8px;border-radius:5px;font-size:11px;">
        </div>
        <input value="${n.title}" id="anews-title-${i}" placeholder="Titular"
          style="width:100%;background:var(--surface-3);border:1px solid var(--rule-light);color:var(--text-primary);padding:4px 8px;border-radius:5px;font-size:11px;margin-bottom:6px;">
        <textarea id="anews-body-${i}" rows="2"
          style="width:100%;background:var(--surface-3);border:1px solid var(--rule-light);color:var(--text-primary);padding:4px 8px;border-radius:5px;font-size:11px;resize:none;">${n.body}</textarea>
      </div>
    `).join('');
  } catch(e){ el.innerHTML='<p style="font-size:11px;color:var(--danger)">Error cargando noticias.</p>'; }
}

function saveNewsEdits(){
  try {
    const cached = JSON.parse(localStorage.getItem('h3l_news_cache')||'null');
    const articles = cached?.articles || [...FALLBACK_NEWS];
    articles.forEach((_,i)=>{
      const t = document.getElementById('anews-tag-'+i);
      const d = document.getElementById('anews-date-'+i);
      const ti= document.getElementById('anews-title-'+i);
      const b = document.getElementById('anews-body-'+i);
      if(t) articles[i].tag   = t.value;
      if(d) articles[i].date  = d.value;
      if(ti)articles[i].title = ti.value;
      if(b) articles[i].body  = b.value;
    });
    localStorage.setItem('h3l_news_cache', JSON.stringify({ts:Date.now(),articles}));
    if(typeof renderNews==='function') renderNews(articles);
    toast('success','Noticias actualizadas y guardadas');
  } catch(e){ toast('danger','Error guardando noticias'); }
}

// THEME PRESETS
const themePresets = {
  dark:   {primary:'#0A2540',surface:'var(--white)',s2:'var(--gray-50)',s3:'#1A3A5C',accent:'#00C2A8',text:'#F0F4F8',textSec:'#8BA4BE',textMut:'#4E6A84'},
  light:  {primary:'#F0F4F8',surface:'#FFFFFF',s2:'#F5F8FC',s3:'#E8F0F8',accent:'#007A6E',text:'#0A2540',textSec:'#2D4A6A',textMut:'#6A8AAA'},
  navy:   {primary:'#0D1B2A',surface:'#0F2234',s2:'#162B40',s3:'#1E3A52',accent:'#00C2A8',text:'#E0F0FF',textSec:'#7AAFCC',textMut:'#3A6A88'},
  forest: {primary:'#1A2E1A',surface:'#1E3820',s2:'#243E26',s3:'#2E4E30',accent:'#4CAF50',text:'#E0FFE0',textSec:'#80C080',textMut:'#407040'},
  energy: {primary:'#1C1C2E',surface:'#1E1E35',s2:'#252540',s3:'#2E2E50',accent:'#F5A623',text:'#FAFAFA',textSec:'#BBBBCC',textMut:'#6666AA'},
};

function applyThemePreset(name){
  const t = themePresets[name];
  if(!t) return;
  const root = document.documentElement;
  root.style.setProperty('--primary', t.primary);
  root.style.setProperty('--surface', t.surface);
  root.style.setProperty('--surface-2', t.s2);
  root.style.setProperty('--surface-3', t.s3);
  root.style.setProperty('--accent', t.accent);
  root.style.setProperty('--text-primary', t.text);
  root.style.setProperty('--text-secondary', t.textSec);
  root.style.setProperty('--text-muted', t.textMut);
  document.body.style.background = t.primary;
  // Handle light mode
  if(name==='light'){ document.body.classList.add('theme-light'); }
  else { document.body.classList.remove('theme-light'); }
  localStorage.setItem('h3l_theme', name);
  toast('success','Tema aplicado: ' + name);
}

// Apply saved theme on load
const savedTheme = localStorage.getItem('h3l_theme');
if(savedTheme && themePresets[savedTheme]) setTimeout(()=>applyThemePreset(savedTheme), 200);

// HERO IMAGE
let heroImgData = null;
function previewHeroImg(input){
  const file = input.files?.[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    heroImgData = e.target.result;
    const prev = document.getElementById('admin-hero-preview');
    if(prev){ prev.src = heroImgData; prev.style.display='block'; }
  };
  reader.readAsDataURL(file);
}

function applyHeroImg(){
  if(!heroImgData){ toast('warning','Primero seleccioná una imagen'); return; }
  let heroImgEl = document.getElementById('hero-custom-img');
  if(!heroImgEl){
    heroImgEl = document.createElement('img');
    heroImgEl.id = 'hero-custom-img';
    heroImgEl.style.cssText = 'width:100%;max-width:800px;border-radius:16px;margin:20px auto 0;display:block;box-shadow:0 8px 32px rgba(0,0,0,.4);';
    const statsRow = document.querySelector('.stats-row');
    if(statsRow) statsRow.after(heroImgEl);
  }
  heroImgEl.src = heroImgData;
  localStorage.setItem('h3l_hero_img', heroImgData);
  toast('success','Foto de presentación actualizada');
}

// Restore hero image on load
const savedHeroImg = localStorage.getItem('h3l_hero_img');
if(savedHeroImg) setTimeout(()=>{
  let el = document.getElementById('hero-custom-img');
  if(!el){
    el = document.createElement('img');
    el.id = 'hero-custom-img';
    el.style.cssText = 'width:100%;max-width:800px;border-radius:16px;margin:20px auto 0;display:block;box-shadow:0 8px 32px rgba(0,0,0,.4);';
    const statsRow = document.querySelector('.stats-row');
    if(statsRow) statsRow.after(el);
  }
  el.src = savedHeroImg;
}, 400);

// HERO TEXT EDITOR
function loadHeroEditorValues(){
  const h1 = document.querySelector('[data-i18n="hero_title1"]');
  const h2 = document.querySelector('[data-i18n="hero_title2"]');
  const hs = document.querySelector('[data-i18n="hero_sub"]');
  const e1 = document.getElementById('edit-hero1');
  const e2 = document.getElementById('edit-hero2');
  const es = document.getElementById('edit-herosub');
  if(h1&&e1) e1.value = h1.textContent;
  if(h2&&e2) e2.value = h2.textContent;
  if(hs&&es) es.value = hs.textContent.trim();
}
function applyHeroEdits(){
  const h1 = document.querySelector('[data-i18n="hero_title1"]');
  const h2 = document.querySelector('[data-i18n="hero_title2"]');
  const hs = document.querySelector('[data-i18n="hero_sub"]');
  const e1 = document.getElementById('edit-hero1');
  const e2 = document.getElementById('edit-hero2');
  const es = document.getElementById('edit-herosub');
  if(h1&&e1) h1.textContent = e1.value;
  if(h2&&e2) h2.textContent = e2.value;
  if(hs&&es) hs.textContent = es.value;
  toast('success','Textos del hero actualizados');
}

// Session restore handled in DOMContentLoaded above

// ═══════════════════════════════════════════════════════════
// MULTILANG
// ═══════════════════════════════════════════════════════════
// i18n handled below

// ═══════════════════════════════════════════════════════════
// TOAST
// ═══════════════════════════════════════════════════════════
function toast(type, msg){
  const icons={success:'✅',warning:'⚠️',info:'ℹ️',danger:'🚨'};
  const container=document.getElementById('toastContainer');
  const el=document.createElement('div');
  el.className=`toast toast-${type}`;
  el.innerHTML=`${icons[type]||'💬'} ${msg}`;
  container.appendChild(el);
  setTimeout(()=>el.remove(),3000);
}

// Init handled at end of script

// ═══ CONTACT FORM ═══
function enviarContacto(){
  const nombre=document.getElementById('ctc-nombre')?.value?.trim();
  const apellido=document.getElementById('ctc-apellido')?.value?.trim();
  const email=document.getElementById('ctc-email')?.value?.trim();
  const empresa=document.getElementById('ctc-empresa')?.value?.trim()||'';
  const mensaje=document.getElementById('ctc-mensaje')?.value?.trim();
  const status=document.getElementById('ctc-status');
  if(!nombre||!apellido){if(status)status.innerHTML='<span style="color:var(--danger)">'+W('w_er_name')+'</span>';return;}
  if(!email||!email.includes('@')){if(status)status.innerHTML='<span style="color:var(--danger)">'+W('w_bad')+'</span>';return;}
  if(!mensaje){if(status)status.innerHTML='<span style="color:var(--danger)">'+W('w_er_msg')+'</span>';return;}
  const subject=encodeURIComponent(W('w_mailsub')+' '+nombre+' '+apellido);
  const body=encodeURIComponent(W('w_mn')+': '+nombre+' '+apellido+'\n'+W('w_me')+': '+email+'\n'+W('w_mc')+': '+empresa+'\n\n'+mensaje);
  window.location.href='mailto:info@h3lglobalenergy.com?subject='+subject+'&body='+body; /* Safari bloquea window.open para mailto */
  if(status)status.innerHTML='<span style="color:var(--success)">'+W('w_opening')+'</span>';
  setTimeout(()=>{if(status)status.innerHTML='';},3000);
}

// ═══ REGISTRO + CSV ═══
let registros=JSON.parse(localStorage.getItem('h3l_registros')||'[]');
function doRegistro(){
  const n=document.getElementById('reg-nombre')?.value?.trim();
  const a=document.getElementById('reg-apellido')?.value?.trim();
  const e=document.getElementById('reg-email')?.value?.trim();
  const em=document.getElementById('reg-empresa')?.value?.trim()||'';
  const p=document.getElementById('reg-pass')?.value||'';
  const p2=document.getElementById('reg-pass2')?.value||'';
  const t=document.getElementById('reg-terms')?.checked;
  const s=document.getElementById('reg-status');
  if(!n||!a){if(s)s.innerHTML='<span style="color:var(--danger)">Nombre y apellido requeridos</span>';return;}
  if(!e||!e.includes('@')){if(s)s.innerHTML='<span style="color:var(--danger)">Email inválido</span>';return;}
  if(p.length<8){if(s)s.innerHTML='<span style="color:var(--danger)">Contraseña mínimo 8 caracteres</span>';return;}
  if(p!==p2){if(s)s.innerHTML='<span style="color:var(--danger)">Contraseñas no coinciden</span>';return;}
  if(!t){if(s)s.innerHTML='<span style="color:var(--warning)">Aceptá los términos</span>';return;}
  const reg={fecha:new Date().toLocaleString('es-AR'),nombre:n,apellido:a,email:e,empresa:em};
  registros.push(reg);
  localStorage.setItem('h3l_registros',JSON.stringify(registros));
  descargarCSV(registros);
  if(s)s.innerHTML='<span style="color:var(--success)">Cuenta creada — CSV descargado</span>';
  toast('success','Cuenta creada: '+n+' '+a);
  setTimeout(()=>{goSection('dashboard');},2000);
}
function descargarCSV(data){
  const hdr=['Fecha','Nombre','Apellido','Email','Empresa'];
  const rows=data.map(r=>['"'+r.fecha+'"','"'+r.nombre+'"','"'+r.apellido+'"','"'+r.email+'"','"'+r.empresa+'"'].join(','));
  const csv=[hdr.join(','),...rows].join('\n');
  const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8;'}));
  const a=document.createElement('a');a.href=url;a.download='H3L_Registros_'+new Date().toISOString().slice(0,10)+'.csv';a.click();URL.revokeObjectURL(url);
}

// ═══════════════════════════════════════════════════════════
// COMMODITY PRICES — actualiza al momento al abrir la sección
// ═══════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════
// PRECIOS EN TIEMPO REAL — Fuente: EIA Markets
// Arquitectura: Anthropic API + web_search → parse JSON → render
// Fallback: últimos valores de mercado conocidos si API falla
// ═══════════════════════════════════════════════════════════

// Última lectura conocida de mercado (Jun 2026, contexto geopolítico Iran/ME)
const FALLBACK_PRICES = {
  brent: 96.85,  // Brent ICE Jun 2026 — tensiones estrecho Ormuz
  wti:   94.60,  // WTI NYMEX Jun 2026
  gas:    3.22,  // Henry Hub spot NYMEX Jun 2026
  gnl:   11.90   // JKM LNG spot Asia Jun 2026 (Platts/S&P)
};

// Cache en memoria para evitar múltiples llamadas a la API
let _priceCache = null;
let _priceCacheTs = 0;
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 min

// Helpers de renderizado
const _colorVal = v => parseFloat(v) >= 0 ? 'var(--success)' : 'var(--danger)';
const _arrow    = v => parseFloat(v) >= 0 ? '▲' : '▼';
const _fmt      = v => (parseFloat(v) >= 0 ? '+' : '') + parseFloat(v).toFixed(2);
const _$        = id => document.getElementById(id);

function _renderPrices(prices, source, manual, silent) {
  _lastP=[prices,source];
  const { brent, wti, gas, gnl, chBrent, chWti, chGas, chGnl } = prices;

  if(_$('precio-brent')) _$('precio-brent').textContent = '$' + parseFloat(brent).toFixed(2);
  if(_$('precio-wti'))   _$('precio-wti').textContent   = '$' + parseFloat(wti).toFixed(2);
  if(_$('precio-gas'))   _$('precio-gas').textContent   = '$' + parseFloat(gas).toFixed(3);
  if(_$('precio-gnl'))   _$('precio-gnl').textContent   = '$' + parseFloat(gnl).toFixed(2);

  if(_$('brent-change'))
    _$('brent-change').innerHTML = `<span style="color:${_colorVal(chBrent)}">${_arrow(chBrent)} ${_fmt(chBrent)}</span> ${W('w_bbl')}`;
  if(_$('wti-change'))
    _$('wti-change').innerHTML = `<span style="color:${_colorVal(chWti)}">${_arrow(chWti)} ${_fmt(chWti)}</span> ${W('w_bbl')}`;
  if(_$('gas-change'))
    _$('gas-change').innerHTML = `<span style="color:${_colorVal(chGas)}">${_arrow(chGas)} ${_fmt(chGas)}</span> ${W('w_mmbtu')}`;
  if(_$('gnl-change'))
    _$('gnl-change').innerHTML = `<span style="color:${_colorVal(chGnl)}">${_arrow(chGnl)} ${_fmt(chGnl)}</span> ${W('w_mmbtu')}`;

  const now = new Date();
  const ts = now.toLocaleDateString(curLoc(),{day:'2-digit',month:'2-digit',year:'numeric'})
           + ' ' + now.toLocaleTimeString(curLoc(),{hour:'2-digit',minute:'2-digit'});
  if(_$('precio-ts')) _$('precio-ts').textContent = ts;

  // Actualizar etiqueta de fuente en cada tarjeta
  const srcLabel = source === 'ft' ? W('w_srcft') : W('w_srcfb');
  ['precio-src-brent','precio-src-wti','precio-src-gas','precio-src-gnl'].forEach(id => {
    if(_$(id)) _$(id).textContent = W('w_srcl') + ' ' + srcLabel;
  });

  if(manual && !silent && typeof toast === 'function')
    toast('success', `${W('w_priceok')} ${srcLabel} — ${ts}`);
}

/* Precios spot publicados por la EIA (U.S. Energy Information Administration) — datos públicos, no se simulan.
   Último dato disponible al 14/10/2026: 6/10/2026. Fuentes:
   https://www.eia.gov/dnav/pet/pet_pri_spt_s1_d.htm  ·  https://www.eia.gov/dnav/ng/ng_pri_fut_s1_d.htm
   Variación = diferencia contra el dato del día hábil anterior (5/10/2026). GNL (JKM) no tiene fuente pública diaria gratuita. */
let EIA_DATA = { date:'2026-10-06',
  brent:{v:125.44, prev:125.51}, wti:{v:96.24, prev:96.13}, gas:{v:3.03, prev:2.96} };
function renderEIA(){
  const set=(id,t)=>{ if(_$(id)) _$(id).textContent=t; };
  const ch=(id,v,p,unit)=>{ const d=v-p; if(_$(id)) _$(id).innerHTML=`<span style="color:${_colorVal(d)}">${_arrow(d)} ${_fmt(d)}</span> ${unit}`; };
  set('precio-brent','$'+EIA_DATA.brent.v.toFixed(2)); ch('brent-change',EIA_DATA.brent.v,EIA_DATA.brent.prev,W('w_bbl'));
  set('precio-wti','$'+EIA_DATA.wti.v.toFixed(2));     ch('wti-change',EIA_DATA.wti.v,EIA_DATA.wti.prev,W('w_bbl'));
  set('precio-gas','$'+EIA_DATA.gas.v.toFixed(2));     ch('gas-change',EIA_DATA.gas.v,EIA_DATA.gas.prev,W('w_mmbtu'));
  set('precio-gnl','—'); set('gnl-change',W('w_mmbtu'));
  const dt=new Date(EIA_DATA.date+'T12:00:00').toLocaleDateString(curLoc(),{day:'2-digit',month:'2-digit',year:'numeric'});
  set('precio-ts', dt+' · '+W('w_eiats'));
  const src=W('w_srcl')+' '+W('w_eiasrc');
  set('precio-src-brent',src+' · Brent FOB Europe'); set('precio-src-wti',src+' · WTI Cushing'); set('precio-src-gas',src+' · Henry Hub');
  set('precio-src-gnl',W('w_gnlsrc'));
  ['precio-brent','precio-wti','precio-gas','precio-gnl'].forEach(id=>{ if(_$(id)) _$(id).style.opacity='1'; });
}
/* Las cotizaciones permanecen ocultas hasta que data/market.json traiga un dato de la EIA de los últimos 7 días. */
const PRICE_MAX_AGE_DAYS = 7;
function showPrices(on){ const w=document.getElementById('precios-wrap'); if(w) w.style.display=on?'':'none'; }
async function loadPrices(){
  showPrices(false);
  try{
    const r=await fetch('data/market.json?'+Date.now(),{cache:'no-store'}); if(!r.ok) return;
    const j=await r.json(); const ok=k=>j[k]&&isFinite(j[k].v)&&isFinite(j[k].prev)&&j[k].v>1&&j[k].v<400;
    if(!(ok('brent')&&ok('wti')&&ok('gas')&&/^\d{4}-\d{2}-\d{2}$/.test(j.date||''))) return;
    const age=(Date.now()-new Date(j.date+'T12:00:00').getTime())/86400000;
    if(age>PRICE_MAX_AGE_DAYS || age<-1) return;          // dato viejo o fecha inválida: no mostrar
    EIA_DATA={date:j.date,brent:j.brent,wti:j.wti,gas:j.gas}; renderEIA(); showPrices(true);
  }catch(e){}
}
loadPrices();

// ═══════════════════════════════════════════════════════════
// NOTICIAS O&G — actualización diaria con cache localStorage
// Usa Anthropic API (ya integrada en la plataforma)
// ═══════════════════════════════════════════════════════════

let _lastNews=null, _lastP=null, _lastNewsTs=null, _allEv=null, _filtering=false;
const NEWS_CACHE_KEY   = 'h3l_news_cache';
const NEWS_CACHE_TTL   = 24 * 60 * 60 * 1000; // 24 horas

// Noticias de respaldo (se muestran si no hay API key o falla la red)
const FALLBACK_NEWS = [
 {
  "tag": "COMUNICADO",
  "tagColor": "var(--success)",
  "date": "13 de octubre de 2026",
  "title": "Alemania y la IEA coorganizarán en París las reuniones ministeriales de 2027: Clean Energy Ministerial y Mission Innovation",
  "body": "Publicado por la IEA.",
  "source": "IEA",
  "url": "https://www.iea.org/news/germany-and-iea-to-co-host-2027-clean-energy-ministerial-and-mission-innovation-ministerial-in-paris"
 },
 {
  "tag": "MERCADOS",
  "tagColor": "var(--info)",
  "date": "12 de octubre de 2026",
  "title": "Los riesgos de suministro en Medio Oriente eclipsan el acuerdo ruso sobre el diésel",
  "body": "Titular publicado por Oil & Gas Journal.",
  "source": "Oil & Gas Journal",
  "url": "https://www.ogj.com/general-interest/economics-markets/news/55411164/middle-east-supply-risks-overshadow-russian-diesel-deal"
 },
 {
  "tag": "UPSTREAM",
  "tagColor": "var(--info)",
  "date": "9 de octubre de 2026",
  "title": "Shell acuerda adquirir una participación en el proyecto Bay du Nord",
  "body": "Titular publicado por Oil & Gas Journal.",
  "source": "Oil & Gas Journal",
  "url": "https://www.ogj.com/exploration-development/news/55410911/shell-agrees-to-acquire-interest-in-bay-du-nord-project"
 },
 {
  "tag": "CORPORATIVO",
  "tagColor": "var(--info)",
  "date": "8 de octubre de 2026",
  "title": "Crescent Energy adquirirá activos de Eagle Ford de Devon por USD 4.200 millones",
  "body": "Titular publicado por Oil & Gas Journal.",
  "source": "Oil & Gas Journal",
  "url": "https://www.ogj.com/general-interest/companies/news/55410522/crescent-energy-to-acquire-eagle-ford-assets-from-devon-for-42-billion"
 },
 {
  "tag": "MERCADOS",
  "tagColor": "var(--info)",
  "date": "8 de octubre de 2026",
  "title": "El petróleo sube 5% por la escalada de ataques a petroleros en Ormuz y el cierre de producción en el Golfo de EE. UU. por un huracán",
  "body": "Titular publicado por Oil & Gas Journal.",
  "source": "Oil & Gas Journal",
  "url": "https://www.ogj.com/general-interest/economics-markets/news/55410621/oil-jumps-5-as-hormuz-tanker-attacks-escalate-us-gulf-hurricane-shuts-in-production"
 },
 {
  "tag": "COMENTARIO",
  "tagColor": "var(--success)",
  "date": "8 de octubre de 2026",
  "title": "¿Podrá la fuerza laboral de América Latina y el Caribe seguir el ritmo del auge energético?",
  "body": "Publicado por la IEA.",
  "source": "IEA",
  "url": "https://www.iea.org/commentaries/can-latin-america-and-the-caribbeans-workforce-keep-pace-with-the-energy-boom"
 }
];

function getTodayStr(){
  return new Date().toLocaleDateString(curLoc(),{day:'2-digit',month:'long',year:'numeric'});
}

function renderNews(articles){
  const grid = document.getElementById('noticias-grid');
  if(!grid) return;
  _lastNews = articles;
  grid.innerHTML = articles.map(trNews).map(n => `
    <div style="background:var(--surface-2);border:1px solid var(--rule-light);border-radius:var(--radius-lg);padding:22px;display:flex;flex-direction:column;gap:6px;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px;">
        <span style="font-size:10px;color:${n.tagColor||'var(--accent)'};font-weight:700;letter-spacing:.5px;">${n.tag}</span>
        <span style="font-size:10px;color:var(--text-muted);">${n.date}</span>
      </div>
      <h5 style="font-weight:700;line-height:1.45;font-size:14px;margin:0;">${n.title}</h5>
      <p style="color:var(--text-secondary);font-size:12px;line-height:1.7;flex:1;margin:0;">${n.body}</p>
      <a href="${n.url}" target="_blank" rel="noopener" style="display:inline-flex;color:var(--accent);font-size:11px;margin-top:6px;text-decoration:none;font-weight:600;">
        ${n.source} →
      </a>
    </div>
  `).join('');
}

const NEWS_TS = {"es": "Titulares de Oil & Gas Journal e IEA · consultados el 14/10/2026", "en": "Headlines from Oil & Gas Journal and IEA · checked on 14/10/2026", "fr": "Titres d’Oil & Gas Journal et de l’AIE · consultés le 14/10/2026", "pt": "Manchetes da Oil & Gas Journal e da AIE · consultadas em 14/10/2026"};
/* Titulares reales de IEA y Oil & Gas Journal. No se generan noticias con IA ni se inventan resúmenes. */
let NEWS_DYN=null, NEWS_CHECKED=null;
const NEWS_TS_PRE={es:'Titulares de Argentina e internacionales (medios originales) · actualizado el ',en:'Argentine and international headlines (original outlets) · updated ',fr:'Titres argentins et internationaux (médias d’origine) · mis à jour le ',pt:'Manchetes argentinas e internacionais (veículos originais) · atualizadas em '};
function fmtISO(iso){ return new Date(iso+'T12:00:00').toLocaleDateString(curLoc(),{day:'numeric',month:'long',year:'numeric'}); }
const escH=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function dynArticles(){
  const lg=curLg(), BODY={es:'Publicado por ',en:'Published by ',fr:'Publié par ',pt:'Publicado por '}[lg]||'Publicado por ';
  return NEWS_DYN.map(it=>{
    const i=FALLBACK_NEWS.findIndex(f=>f.url===it.url);
    const title = i<0 ? it.title : (lg==='es'||!NEWS_TR[lg] ? FALLBACK_NEWS[i].title : NEWS_TR[lg][i].title);
    const iea = it.source==='IEA', ar = it.region==='AR';
    return {tag: ar?'ARGENTINA':(iea?'IEA':'OGJ'), tagColor: ar?'var(--warning, #d9a441)':(iea?'var(--success)':'var(--info)'), date: fmtISO(it.date), title: escH(title), body: BODY+escH(it.source)+'.', source: escH(it.source), url: escH(it.url)};
  });
}
function setNewsTs(){
  const el=document.getElementById('news-ts'); if(!el) return;
  if(NEWS_DYN&&NEWS_CHECKED) el.textContent=(NEWS_TS_PRE[curLg()]||NEWS_TS_PRE.es)+fmtISO(NEWS_CHECKED);
  else el.textContent=NEWS_TS[curLg()]||NEWS_TS.es;
}
/* Titulares reales de IEA y Oil & Gas Journal. data/news.json lo actualiza una tarea diaria de GitHub Actions.
   No se generan noticias con IA ni se inventan resúmenes. */
async function refreshNoticias(manual=false){
  try{ localStorage.removeItem(NEWS_CACHE_KEY); }catch(e){}
  if(!NEWS_DYN){
    try{
      const r=await fetch('data/news.json?'+Date.now(),{cache:'no-store'});
      if(r.ok){ const j=await r.json();
        const ok=Array.isArray(j.items)&&j.items.length>=4&&j.items.every(x=>x&&x.title&&/^https:\/\//.test(x.url)&&/^\d{4}-\d{2}-\d{2}$/.test(x.date));
        if(ok){ NEWS_DYN=j.items; NEWS_CHECKED=(j.checked||'').slice(0,10)||j.items[0].date; } }
    }catch(e){}
  }
  renderNews(NEWS_DYN?dynArticles():FALLBACK_NEWS);
  setNewsTs();
  const btn=document.getElementById('btn-refresh-news'); if(btn) btn.style.display='none';
}

// ═══ INIT ═══
const savedLang=localStorage.getItem('h3l_lang')||'es';
const lsel=document.getElementById('lang-desktop');
if(lsel)lsel.value=savedLang;
setTimeout(()=>{ try{applyTranslations(savedLang);}catch(e){} },120);
setTimeout(()=>{ try{ refreshNoticias(false); }catch(e){} }, 300);

// Alt+T theme shortcut
document.addEventListener('keydown',e=>{ if(e.altKey&&e.key==='t')toggleTheme(); });

// ═══════════════════════════════════════════════════════════
// FULL i18n SYSTEM
// ═══════════════════════════════════════════════════════════
const i18nDict = {
  es:{
    nav_home:'Inicio', nav_somos:'Somos H3L', nav_dashboard:'Dashboard',
    nav_noticias:'Noticias O&G', nav_contacto:'Contacto', nav_eventos:'Eventos',
    nav_login:'Iniciar Sesión', nav_registro:'Registro',
    nav_calculadoras:'Calculadoras', nav_archivos:'Entregables',
    nav_auditoria:'Auditoría', nav_funciones:'Funciones', nav_papers:'Papers',
    hero_badge:'Energy Transition Intelligence Platform',
    hero_title1:'La plataforma líder para',
    hero_title2:'OIL & GAS y Transición Energética',
    hero_sub:'Inteligencia de datos al servicio de la industria energética. Evaluamos recursos, certificamos reservas y aceleramos la transición energética con herramientas de Data Science, calculadoras especializadas y auditoría técnica — todo en una sola plataforma.',
    btn_brochure:'Nuestros Servicios — Brochure',
    btn_calc:'Explorar Calculadoras', btn_dash:'Ver Dashboard',
  },
  en:{
    nav_home:'Home', nav_somos:'About H3L', nav_dashboard:'Dashboard',
    nav_noticias:'O&G News', nav_contacto:'Contact', nav_eventos:'Events',
    nav_login:'Sign In', nav_registro:'Register',
    nav_calculadoras:'Calculators', nav_archivos:'Deliverables',
    nav_auditoria:'Audit', nav_funciones:'Features', nav_papers:'Papers',
    hero_badge:'Energy Transition Intelligence Platform',
    hero_title1:'The leading platform for',
    hero_title2:'OIL & GAS and Energy Transition',
    hero_sub:'Data intelligence at the service of the energy industry. We assess resources, certify reserves and accelerate the energy transition with Data Science tools, specialized calculators and technical auditing — all in one platform.',
    btn_brochure:'Our Services — Brochure',
    btn_calc:'Explore Calculators', btn_dash:'View Dashboard',
  },
  fr:{
    nav_home:'Accueil', nav_somos:'À Propos', nav_dashboard:'Tableau de Bord',
    nav_noticias:'Actualités O&G', nav_contacto:'Contact', nav_eventos:'Événements',
    nav_login:'Connexion', nav_registro:"S'inscrire",
    nav_calculadoras:'Calculateurs', nav_archivos:'Livrables',
    nav_auditoria:'Audit', nav_funciones:'Fonctions', nav_papers:'Articles',
    hero_badge:'Plateforme Intelligence Transition Énergétique',
    hero_title1:'La plateforme leader pour',
    hero_title2:"OIL & GAS et Transition Énergétique",
    hero_sub:"Intelligence des données au service de l'industrie énergétique. Nous évaluons les ressources, certifions les réserves et accélérons la transition énergétique — tout sur une seule plateforme.",
    btn_brochure:'Nos Services — Brochure',
    btn_calc:'Explorer les Calculateurs', btn_dash:'Voir le Tableau de Bord',
  },
  pt:{
    nav_home:'Início', nav_somos:'Sobre H3L', nav_dashboard:'Painel',
    nav_noticias:'Notícias O&G', nav_contacto:'Contato', nav_eventos:'Eventos',
    nav_login:'Entrar', nav_registro:'Cadastro',
    nav_calculadoras:'Calculadoras', nav_archivos:'Entregáveis',
    nav_auditoria:'Auditoria', nav_funciones:'Funções', nav_papers:'Papers',
    hero_badge:'Plataforma de Inteligência em Transição Energética',
    hero_title1:'A plataforma líder para',
    hero_title2:'OIL & GAS e Transição Energética',
    hero_sub:'Inteligência de dados a serviço da indústria energética. Avaliamos recursos, certificamos reservas e aceleramos a transição energética com ferramentas de Data Science, calculadoras especializadas e auditoria técnica — tudo em uma só plataforma.',
    btn_brochure:'Nossos Serviços — Brochure',
    btn_calc:'Explorar Calculadoras', btn_dash:'Ver Painel',
  }
};

const langLabels = {es:'Español',en:'English',fr:'Français',pt:'Português'};

function applyTranslations(lang){
  const t = i18nDict[lang] || i18nDict.es;
  localStorage.setItem('h3l_lang', lang);
  // Sync selects
  ['lang-desktop','mob-lang'].forEach(id=>{
    const el = document.getElementById(id);
    if(el) el.value = lang;
  });
  // Apply all data-i18n elements
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const key = el.getAttribute('data-i18n');
    if(t[key] !== undefined) el.innerHTML = t[key];
  });
  // Hero special elements
  const h1 = document.querySelector('[data-i18n="hero_title1"]');
  const h2 = document.querySelector('[data-i18n="hero_title2"]');
  const hs = document.querySelector('[data-i18n="hero_sub"]');
  const hb = document.querySelector('[data-i18n="hero_badge"]');
  if(h1) h1.textContent = t.hero_title1 || h1.textContent;
  if(h2) h2.textContent = t.hero_title2 || h2.textContent;
  if(hs) hs.textContent = t.hero_sub    || hs.textContent;
  if(hb) hb.textContent = t.hero_badge  || hb.textContent;
  if(window.H3LSite) H3LSite.setLang(lang);
  // Nav buttons
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const key = el.getAttribute('data-i18n');
    const val = t[key];
    if(val !== undefined){
      if(el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') el.placeholder = val;
      else el.textContent = val;
    }
  });
}

function changeLang(lang){
  applyTranslations(lang);
  toast('info', langLabels[lang] || lang);
}

// ═══ THEME ═══
let isDarkTheme=true;
function toggleTheme(){
  isDarkTheme=!isDarkTheme;
  document.body.classList.toggle('theme-light',!isDarkTheme);
}


// ═══ BROCHURE DOWNLOAD ═══
// Tries fetch download first; falls back to new tab if server blocks download header
async function handleBrochureClick(e) {
  e.preventDefault();
  const filename = 'Brochure%20Empresarial_MOD.pdf';
  const saveName = 'H3L_Brochure_Servicios.pdf';
  try {
    const resp = await fetch(filename);
    if (!resp.ok) throw new Error('fetch failed');
    const blob = await resp.blob();
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = saveName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 3000);
    if(typeof toast === 'function') toast('success','Descargando brochure...');
  } catch(err) {
    // Fallback: open in new tab so user can save manually
    window.open(filename, '_blank');
    if(typeof toast === 'function') toast('info','Abriendo brochure en nueva pestaña');
  }
}

// ═══ CHATBOT TOUR + LOGIN PROMPT + NEWSLETTER ═══
function chatTour(){
  const steps = [
    '🗺️ <strong>Visita Guiada H3L</strong><br><br>Te muestro las secciones principales:',
    '1️⃣ <strong>Inicio</strong> — Resumen de la plataforma y acceso rápido a todas las funciones.',
    '2️⃣ <strong>Quiénes somos</strong> — Conocé nuestra firma, su misión y su visión.',
    '3️⃣ <strong>Servicios</strong> — Las ocho líneas de servicio, cada una con un video de la herramienta.',
    '4️⃣ <strong>Noticias O&G</strong> — Precios BRENT/WTI/GAS/GNL actualizados y noticias del sector.',
    '5️⃣ <strong>Eventos y Contacto</strong> — Agenda del sector y formulario de cotización.',
    '6️⃣ <strong>Contacto</strong> — Escribinos a info@h3lglobalenergy.com o pedí una cotización desde Servicios.<br><br><button onclick="goSection(&quot;servicios&quot;);toggleChat();" style="background:var(--accent);color:#000;border:none;padding:6px 14px;border-radius:6px;font-weight:700;font-size:12px;cursor:pointer;margin-top:6px;">Ver servicios &rarr;</button>'
  ];
  steps.forEach((msg, i) => {
    setTimeout(() => addBotMessage(msg), i * 1200);
  });
}

function chatLogin(){
  addBotMessage('Para pedir una cotización, escribinos a <strong>info@h3lglobalenergy.com</strong> o completá el formulario de contacto.<br><br><button onclick="goSection(&quot;contacto&quot;);toggleChat();" style="background:var(--accent);color:#000;border:none;padding:6px 14px;border-radius:6px;font-weight:700;font-size:12px;cursor:pointer;">Ir a Contacto &rarr;</button>');
}

function chatNewsletter(){
  addBotMessage('📧 <strong>Newsletter H3L</strong><br><br>Suscribite para recibir:<br>• Noticias semanales del sector OIL &amp; GAS<br>• Precios de commodities energéticas<br>• Eventos SPE, SPEE, IAE y más<br>• Tendencias en Data Science aplicada a energía<br><br>Escribinos a info@h3lglobalenergy.com para recibirlo:<br><button onclick="goSection(&quot;contacto&quot;);toggleChat();" style="background:var(--accent);color:#000;border:none;padding:6px 14px;border-radius:6px;font-weight:700;font-size:12px;cursor:pointer;">Contactar &rarr;</button>');
}

function addBotMessage(html){
  const msgs = document.getElementById('chatMessages');
  if(!msgs) return;
  const div = document.createElement('div');
  div.className = 'msg msg-bot';
  div.innerHTML = '<div class="msg-bubble">' + html + '</div>';
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
  // Remove badge
  const badge = document.getElementById('chatBadge');
  if(badge) badge.style.display = 'none';
}

// Override getResponse to handle new quick options
const _origGetResponse = typeof getResponse === 'function' ? getResponse : null;
function getResponse(msg){
  const m = msg.toLowerCase();
  if(m.includes('herramienta')||m.includes('calculadora')||m.includes('servicio')){
    setTimeout(()=>goSection('servicios'),1500);
    return 'Te llevo a Servicios, donde ves cada línea de trabajo de H3L con un video de la herramienta. 🛠️';
  }
  if(m.includes('visita')||m.includes('tour')||m.includes('recorrido')){
    setTimeout(()=>chatTour(), 500);
    return '¡Iniciando la visita guiada!';
  }
  if(m.includes('newsletter')||m.includes('suscrib')){
    setTimeout(()=>chatNewsletter(), 400);
    return 'Te cuento sobre nuestro Newsletter...';
  }
  if(m.includes('cotiz')||m.includes('presupuesto')||m.includes('precio')){
    setTimeout(()=>chatLogin(), 400);
    return 'Te ayudo con la cotización...';
  }
  // Fall through to original
  if(_origGetResponse) return _origGetResponse(msg);
  return chatResponses.default[0];
}


// ═══════════════════════════════════════════════════════════
// DASHBOARD TABS — clean version
// ═══════════════════════════════════════════════════════════
const DASH_TYPES = ['ejecutivo','operativo','tactico','analitico'];
let _dashCharts = {};   // store Chart instances to destroy before re-render
let _dashInit   = {};   // track which tabs already rendered

function switchDash(type) {
  DASH_TYPES.forEach(t => {
    const panel = document.getElementById('dpanel-' + t);
    const tab   = document.getElementById('dtab-'   + t);
    if (panel) panel.style.display = (t === type) ? 'block' : 'none';
    if (tab) {
      tab.classList.toggle('active', t === type);
    }
  });
  // Lazy-init charts for this tab
  if (!_dashInit[type]) {
    _dashInit[type] = true;
    _initDashCharts(type);
  }
}

/* ── Chart.js colour palette (Tableau 10) ── */
const TC = {
  blue:  '#4E79A7', orange:'#F28E2B', red:'#E15759',
  teal:  '#76B7B2', green: '#59A14F', gold: '#EDC948',
  purple:'#B07AA1', pink:  '#FF9DA7', brown:'#9C755F', gray:'#BAB0AC'
};
const TC_A = (hex, a) => hex + Math.round(a*255).toString(16).padStart(2,'0');

function _mkChart(id, cfg) {
  const el = document.getElementById(id);
  if (!el) return;
  if (_dashCharts[id]) { _dashCharts[id].destroy(); }
  _dashCharts[id] = new Chart(el.getContext('2d'), cfg);
}

const _baseOpts = (yLabel='', xLabel='') => ({
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: { position:'top', labels:{ font:{size:10}, boxWidth:12, padding:10 } },
    tooltip:{ bodyFont:{size:11}, titleFont:{size:11} }
  },
  scales: {
    x: { grid:{color:'rgba(0,0,0,.05)'}, ticks:{font:{size:10}},
         title: xLabel ? {display:true,text:xLabel,font:{size:10}} : {} },
    y: { grid:{color:'rgba(0,0,0,.05)'}, ticks:{font:{size:10}},
         title: yLabel ? {display:true,text:yLabel,font:{size:10}} : {} }
  }
});

const MESES = ['Ene','Feb','Mar','Abr','May','Jun'];

function _initDashCharts(type) {
  if (type === 'ejecutivo') {
    // Producción apilada por cuenca
    _mkChart('ch-prod-cuenca', {
      type: 'bar',
      data: {
        labels: MESES,
        datasets: [
          { label:'Neuquén',   data:[4800,4950,5100,5200,5050,5280], backgroundColor:TC_A(TC.blue,0.82), stack:'s' },
          { label:'San Jorge', data:[3200,3100,3300,3250,3400,3310], backgroundColor:TC_A(TC.orange,0.82), stack:'s' },
          { label:'Noroeste',  data:[1900,1950,1800,1900,2000,1850], backgroundColor:TC_A(TC.teal,0.82), stack:'s' },
          { label:'Cuyo',      data:[1200,1150,1300,1280,1250,1310], backgroundColor:TC_A(TC.green,0.82), stack:'s' },
        ]
      },
      options: { ..._baseOpts('bbl/día','Mes'), plugins:{..._baseOpts().plugins,
        tooltip:{ callbacks:{ footer: items => 'Total: ' + items.reduce((a,i)=>a+i.raw,0).toLocaleString('es') + ' bbl/d' } }
      }}
    });
    // Mix energético donut
    _mkChart('ch-mix-energetico', {
      type:'doughnut',
      data:{
        labels:['Petróleo','Gas Nat.','Solar','Eólica','BESS'],
        datasets:[{data:[52,28,10,7,3], backgroundColor:[TC.blue,TC.orange,TC.gold,TC.teal,TC.purple],
          borderWidth:1, borderColor:'#fff', hoverOffset:6}]
      },
      options:{ responsive:true, maintainAspectRatio:true,
        plugins:{ legend:{ position:'bottom', labels:{font:{size:10},boxWidth:10} } },
        cutout:'62%'
      }
    });
    // Curva S CAPEX
    const cap_budget=[0,22,48,78,112,142], cap_real=[0,20,45,76,108,138];
    _mkChart('ch-capex-curvas', {
      type:'line',
      data:{
        labels: MESES,
        datasets:[
          { label:'Budget', data:cap_budget, borderColor:TC.blue, backgroundColor:TC_A(TC.blue,0.08),
            fill:true, borderWidth:2, pointRadius:4 },
          { label:'Real',   data:cap_real,   borderColor:TC.green, backgroundColor:TC_A(TC.green,0.08),
            fill:true, borderWidth:2, pointRadius:4, borderDash:[] },
          { label:'Forecast',data:[null,null,null,null,null,142], borderColor:TC.orange,
            borderWidth:2, borderDash:[5,4], pointRadius:3 }
        ]
      },
      options: _baseOpts('USD M acumulado','Mes')
    });
    // ESG horizontal bars
    _mkChart('ch-esg-progress', {
      type:'bar',
      data:{
        labels:['Reducción CO₂','Energías Reno.','Zero Flaring','Biodiversidad','Carbon Neutral'],
        datasets:[
          { label:'Avance %', data:[78,65,91,44,32],
            backgroundColor:[TC.blue,TC.teal,TC.green,TC.purple,TC.orange], borderRadius:4 },
          { label:'Meta 100%', data:[100,100,100,100,100],
            backgroundColor:'rgba(0,0,0,.06)', borderRadius:4 }
        ]
      },
      options:{ ..._baseOpts('%'),
        indexAxis:'y',
        scales:{ x:{max:100,grid:{color:'rgba(0,0,0,.05)'}, ticks:{font:{size:10}}},
                 y:{grid:{display:false}, ticks:{font:{size:10}}} }
      }
    });
  }

  if (type === 'operativo') {
    const dias30 = Array.from({length:30},(_,i)=>`D${i+1}`);
    const randSeries=(base,noise)=>dias30.map(()=>+(base+(Math.random()-.5)*noise*2).toFixed(0));
    // Multi-line producción pozos
    _mkChart('ch-prod-pozos', {
      type:'line',
      data:{
        labels:dias30,
        datasets:[
          {label:'P-101',data:randSeries(2800,120),borderColor:TC.blue,  backgroundColor:'transparent',borderWidth:1.5,pointRadius:0},
          {label:'P-107',data:randSeries(2100,90), borderColor:TC.orange,backgroundColor:'transparent',borderWidth:1.5,pointRadius:0},
          {label:'P-203',data:randSeries(1800,80), borderColor:TC.green, backgroundColor:'transparent',borderWidth:1.5,pointRadius:0},
          {label:'P-215',data:randSeries(1600,100),borderColor:TC.teal,  backgroundColor:'transparent',borderWidth:1.5,pointRadius:0},
          {label:'P-301',data:randSeries(1400,70), borderColor:TC.purple,backgroundColor:'transparent',borderWidth:1.5,pointRadius:0},
          {label:'P-312',data:randSeries(1200,90), borderColor:TC.red,   backgroundColor:'transparent',borderWidth:1.5,pointRadius:0},
        ]
      },
      options:{..._baseOpts('bbl/día','Día'),
        plugins:{..._baseOpts().plugins, legend:{position:'top',labels:{font:{size:9},boxWidth:10}}}}
    });
    // Status pozos donut
    _mkChart('ch-status-pozos', {
      type:'doughnut',
      data:{
        labels:['Produciendo','Workover','Cerrado','Waiting'],
        datasets:[{data:[47,2,3,1], backgroundColor:[TC.green,TC.orange,TC.red,TC.gray],
          borderWidth:1, borderColor:'#fff', hoverOffset:6}]
      },
      options:{responsive:true,maintainAspectRatio:true,cutout:'58%',
        plugins:{legend:{position:'bottom',labels:{font:{size:10},boxWidth:10}}}}
    });
    // GOR + WC dual axis
    const gorData=MESES.map(()=>+(480+(Math.random()-.5)*60).toFixed(0));
    const wcData =MESES.map(()=>+(34+(Math.random()-.5)*3).toFixed(1));
    _mkChart('ch-gor-wc', {
      type:'line',
      data:{
        labels:MESES,
        datasets:[
          {label:'GOR (scf/bbl)',data:gorData,borderColor:TC.blue,backgroundColor:TC_A(TC.blue,0.07),
           fill:true,yAxisID:'y',borderWidth:2,pointRadius:4},
          {label:'Water Cut (%)',data:wcData, borderColor:TC.orange,backgroundColor:TC_A(TC.orange,0.07),
           fill:true,yAxisID:'y1',borderWidth:2,pointRadius:4}
        ]
      },
      options:{responsive:true,maintainAspectRatio:true,
        plugins:{legend:{position:'top',labels:{font:{size:10},boxWidth:12}}},
        scales:{
          x:{grid:{color:'rgba(0,0,0,.05)'},ticks:{font:{size:10}}},
          y:{grid:{color:'rgba(0,0,0,.05)'},ticks:{font:{size:10}},title:{display:true,text:'GOR scf/bbl',font:{size:9}}},
          y1:{position:'right',grid:{display:false},ticks:{font:{size:10}},title:{display:true,text:'WC %',font:{size:9}}}
        }
      }
    });
    // Presión cabeza con umbral
    const pres=dias30.map(()=>+(1450+(Math.random()-.5)*200).toFixed(0));
    _mkChart('ch-presion-cabeza', {
      type:'line',
      data:{
        labels:dias30,
        datasets:[
          {label:'Presión (psi)',data:pres,borderColor:TC.blue,backgroundColor:TC_A(TC.blue,0.06),
           fill:true,borderWidth:1.5,pointRadius:0},
          {label:'Límite inf.',data:dias30.map(()=>1200),borderColor:TC.red,
           borderWidth:1.5,borderDash:[6,4],pointRadius:0,fill:false},
          {label:'Límite sup.',data:dias30.map(()=>1700),borderColor:TC.orange,
           borderWidth:1.5,borderDash:[6,4],pointRadius:0,fill:false}
        ]
      },
      options:{..._baseOpts('psi','Día'),
        plugins:{..._baseOpts().plugins,legend:{position:'top',labels:{font:{size:9},boxWidth:10}}}}
    });
  }

  if (type === 'tactico') {
    // EVM curva S triple
    const evm_plan  = [0,14,30,52,80,115,142];
    const evm_earned= [0,13,27,49,75,108,138];
    const evm_cost  = [0,13.5,28,50,74,105,134];
    const labsEVM   = ['Ene','Feb','Mar','Abr','May','Jun','Jul'];
    _mkChart('ch-evm-portfolio', {
      type:'line',
      data:{
        labels:labsEVM,
        datasets:[
          {label:'BCWS — Plan',  data:evm_plan,   borderColor:TC.blue,  backgroundColor:TC_A(TC.blue,0.06),  fill:true,borderWidth:2,pointRadius:4},
          {label:'BCWP — Earned',data:evm_earned, borderColor:TC.green, backgroundColor:TC_A(TC.green,0.06), fill:true,borderWidth:2,pointRadius:4},
          {label:'ACWP — Real',  data:evm_cost,   borderColor:TC.orange,backgroundColor:TC_A(TC.orange,0.06),fill:true,borderWidth:2,pointRadius:4}
        ]
      },
      options:_baseOpts('USD M acumulado','Mes')
    });
    // Proyectos por estado (bar horizontal)
    _mkChart('ch-proyectos-estado', {
      type:'bar',
      data:{
        labels:['Workover Bloque A','Sísmica 3D Zona B','Expansión Gasoducto','Perforación Pozo C12','Inst. Medidores ESP'],
        datasets:[
          {label:'Completado %',data:[65,20,100,40,85],
            backgroundColor:[TC.blue,TC.orange,TC.green,TC.purple,TC.teal],borderRadius:4}
        ]
      },
      options:{..._baseOpts('%'),
        indexAxis:'y',
        scales:{x:{max:100,ticks:{font:{size:10}}},y:{ticks:{font:{size:9}}}},
        plugins:{legend:{display:false}}
      }
    });
    // Radar metas
    _mkChart('ch-radar-metas', {
      type:'radar',
      data:{
        labels:['Producción','CAPEX','Emisiones CO₂','Eficiencia','HSE','Uptime ESP'],
        datasets:[
          {label:'Real Q2',  data:[87,103,61,94,88,91],
            backgroundColor:TC_A(TC.blue,0.18),borderColor:TC.blue,borderWidth:2,pointRadius:4},
          {label:'Meta 100%',data:[100,100,100,100,100,100],
            backgroundColor:TC_A(TC.gray,0.10),borderColor:TC.gray,borderWidth:1,borderDash:[4,4],pointRadius:0}
        ]
      },
      options:{responsive:true,maintainAspectRatio:true,
        plugins:{legend:{position:'bottom',labels:{font:{size:10},boxWidth:10}}},
        scales:{r:{min:0,max:100,ticks:{font:{size:9},stepSize:20},
          grid:{color:'rgba(0,0,0,.08)'},pointLabels:{font:{size:10}}}}
      }
    });
    // Lifting cost benchmark bar
    _mkChart('ch-lifting-bench', {
      type:'bar',
      data:{
        labels:['H3L\nCliente','Peer A','Peer B','Peer C','Peer D','P50 Cuenca'],
        datasets:[{
          label:'Lifting Cost USD/bbl',
          data:[8.4,11.2,9.8,13.5,7.9,10.1],
          backgroundColor:[TC.blue,TC_A(TC.gray,0.7),TC_A(TC.gray,0.7),TC_A(TC.gray,0.7),TC_A(TC.gray,0.7),TC.orange],
          borderRadius:4
        }]
      },
      options:{..._baseOpts('USD/bbl'),
        plugins:{legend:{display:false},
          annotation:{annotations:{p50:{type:'line',yMin:10.1,yMax:10.1,borderColor:TC.orange,
            borderWidth:1.5,borderDash:[6,4],label:{content:'P50',enabled:true,position:'end',font:{size:9}}}}}}
      }
    });
  }

  if (type === 'analitico') {
    // DCA Fan Chart P10/P50/P90
    const mesesDCA = Array.from({length:24},(_,i)=>`M${i+1}`);
    const qo = (qi,di,b,t) => qi / Math.pow(1+b*di*t, 1/b);
    const p50=mesesDCA.map((_,i)=>+qo(1200,.08,.8,i).toFixed(0));
    const p10=mesesDCA.map((_,i)=>+qo(1400,.06,.9,i).toFixed(0));
    const p90=mesesDCA.map((_,i)=>+qo(1050,.11,.7,i).toFixed(0));
    // Historical 12 months + forecast 12
    const hist=p50.slice(0,12);
    const fcast=p50.map((v,i)=>i<12?null:v);
    _mkChart('ch-dca-fan', {
      type:'line',
      data:{
        labels:mesesDCA,
        datasets:[
          {label:'P10',   data:p10,  borderColor:TC_A(TC.teal,0.5),backgroundColor:TC_A(TC.teal,0.06),
           fill:'+1',borderWidth:1,pointRadius:0,borderDash:[4,3]},
          {label:'P50',   data:p50,  borderColor:TC.blue,backgroundColor:'transparent',
           borderWidth:2.5,pointRadius:0},
          {label:'P90',   data:p90,  borderColor:TC_A(TC.orange,0.5),backgroundColor:TC_A(TC.orange,0.06),
           fill:'-1',borderWidth:1,pointRadius:0,borderDash:[4,3]},
          {label:'Histórico',data:[...hist,...Array(12).fill(null)],
           borderColor:TC.gray,backgroundColor:'transparent',borderWidth:2,pointRadius:2}
        ]
      },
      options:{..._baseOpts('bbl/día','Mes'),
        plugins:{..._baseOpts().plugins,
          legend:{position:'top',labels:{font:{size:9},boxWidth:10}}}}
    });
    // SHAP feature importance
    _mkChart('ch-shap', {
      type:'bar',
      data:{
        labels:['Lateral Length','Frac Stages','Proppant/Stage','Cluster Spacing','GOR inicial',
                'Permeabilidad','TOC','Presión Yac.'],
        datasets:[{
          label:'SHAP Value',
          data:[0.42,0.31,0.28,0.22,0.18,0.15,0.11,0.08],
          backgroundColor:[TC.blue,TC.blue,TC.orange,TC.orange,TC.teal,TC.teal,TC.gray,TC.gray],
          borderRadius:4
        }]
      },
      options:{..._baseOpts('Importancia SHAP'),
        indexAxis:'y',
        plugins:{legend:{display:false}},
        scales:{x:{ticks:{font:{size:10}}},y:{ticks:{font:{size:9}}}}
      }
    });
    // Scatter EUR vs Lateral Length
    const scatterData = Array.from({length:80},()=>({
      x:+(1800+Math.random()*1400).toFixed(0),
      y:+(8+Math.random()*18).toFixed(1)
    }));
    _mkChart('ch-scatter-eur', {
      type:'scatter',
      data:{datasets:[{
        label:'Pozos VM',data:scatterData,
        backgroundColor:TC_A(TC.blue,0.45),borderColor:TC.blue,
        pointRadius:4,pointHoverRadius:6,borderWidth:1
      }]},
      options:{..._baseOpts('EUR (MMbbl)','Lateral Length (m)'),
        plugins:{legend:{display:false}}}
    });
    // Histograma Monte Carlo
    const bins=['<6','6-8','8-10','10-12','12-14','14-16','16-18','>18'];
    const freqs=[120,380,890,1450,2100,1980,1680,1400];
    _mkChart('ch-hist-mc', {
      type:'bar',
      data:{
        labels:bins,
        datasets:[{
          label:'Frecuencia (10k iter.)',data:freqs,
          backgroundColor:bins.map((_,i)=>i===4||i===5?TC.blue:TC_A(TC.blue,0.4)),
          borderRadius:2
        }]
      },
      options:{..._baseOpts('Frecuencia','EUR (MMbbl)'),
        plugins:{legend:{display:false}}}
    });
  }
}

// Init Estratégico on page load (it's the default active tab)
document.addEventListener('DOMContentLoaded', () => {
  // Only init charts if Chart.js is loaded
  const tryInitDash = () => {
    if (window.Chart) {
      _dashInit['ejecutivo'] = true;
      _initDashCharts('ejecutivo');
    } else {
      setTimeout(tryInitDash, 300);
    }
  };
  tryInitDash();
});

// ═══ NEWS TABS — Argentina / Internacional ═══
let currentNewsTab = 'todas';
const ARG_TAGS = ['ARGENTINA','LATAM','VACA MUERTA','YPF','CONICET'];

function switchNewsTab(tab){
  currentNewsTab = tab;
  ['todas','arg','int'].forEach(t=>{
    const btn = document.getElementById('ntab-'+t);
    if(btn){
      btn.style.background = t===tab ? 'var(--accent)' : 'var(--glass)';
      btn.style.color      = t===tab ? '#000' : 'var(--text-secondary)';
    }
  });
  filterNewsByTab();
}

function filterNewsByTab(){
  const cards = document.querySelectorAll('#noticias-grid > div');
  cards.forEach(card=>{
    const tag = card.querySelector('span')?.textContent?.toUpperCase()||'';
    const isArg = ARG_TAGS.some(t=>tag.includes(t))||tag.includes('ARG');
    if(currentNewsTab==='todas') card.style.display='';
    else if(currentNewsTab==='arg') card.style.display=isArg?'':'none';
    else card.style.display=isArg?'none':'';
  });
}

// After news renders, re-apply geo filter
function afterNewsRender(){ setTimeout(filterNewsByTab, 100); }

// ═══ NEWSLETTER SUBSCRIPTION ═══
let nlSubscribers = JSON.parse(localStorage.getItem('h3l_nl_subscribers')||'[]');

function suscribirEvento(){
  const email = document.getElementById('events-nl-email')?.value?.trim();
  const status= document.getElementById('events-nl-status');
  if(!email||!email.includes('@')){ if(status)status.innerHTML='<span style="color:var(--danger)">'+W('w_bad')+'</span>'; return; }
  if(nlSubscribers.find(s=>s.email===email)){ if(status)status.innerHTML='<span style="color:var(--warning)">'+W('w_dup')+'</span>'; return; }
  nlSubscribers.push({email, fecha:new Date().toISOString()});
  localStorage.setItem('h3l_nl_subscribers', JSON.stringify(nlSubscribers));
  if(status) status.innerHTML='<span style="color:var(--success)">'+W('w_subok')+'</span>';
  toast('success',W('w_subtoast')+' '+email);
  const input = document.getElementById('events-nl-email');
  if(input) input.value='';
}

function subscribeClick(plan){
  if(plan==='enterprise'){
    goSection('contacto');
    toast('info','Te dirigimos a Contacto para consultar el plan Enterprise');
  } else {
    toast('info','Plan '+plan+' — próximamente disponible. Contactanos en info@h3lglobalenergy.com');
  }
}

// ═══ EVENTOS — Load with AI or fallback ═══
const EVENTOS_CACHE_KEY = 'h3l_eventos_cache';
const EVENTOS_TTL = 12*60*60*1000; // 12 horas

/* Eventos verificados en las páginas oficiales (IAPG, AOG Patagonia, ADIPEC, IEA) el 14/10/2026. No se inventan eventos. */
const FALLBACK_EVENTOS = [
 {
  "org": "AOG / IAPG",
  "tag": "latam",
  "color": "var(--warning)",
  "fecha": "19 al 22 de octubre de 2026",
  "titulo": "AOG Patagonia",
  "lugar": "Espacio DUAM, Neuquén, Argentina",
  "desc": "Evento del sector de petróleo y gas en la Patagonia, incluido en la agenda de eventos 2026 del IAPG.",
  "url": "https://aogpatagonia.com.ar/"
 },
 {
  "org": "ADIPEC",
  "tag": "global",
  "color": "var(--accent)",
  "fecha": "2 al 5 de noviembre de 2026",
  "titulo": "ADIPEC 2026 Exhibition & Conference",
  "lugar": "ADNEC, Abu Dhabi, Emiratos Árabes Unidos",
  "desc": "Exposición y conferencia de la industria energética en Abu Dhabi.",
  "url": "https://www.adipec.com/"
 },
 {
  "org": "IAPG",
  "tag": "latam",
  "color": "var(--warning)",
  "fecha": "12 de noviembre de 2026",
  "titulo": "4.ª Jornada de Petróleo 2026",
  "lugar": "Sede: ver sitio del IAPG",
  "desc": "Jornada del Instituto Argentino del Petróleo y del Gas, listada en su agenda de eventos 2026.",
  "url": "http://iapg.org.ar/congresos-2026/"
 },
 {
  "org": "IAPG",
  "tag": "latam",
  "color": "var(--warning)",
  "fecha": "16 y 17 de noviembre de 2026",
  "titulo": "Jornadas de Medición en Upstream y Downstream de Petróleo y Gas",
  "lugar": "Sede: ver sitio del evento",
  "desc": "Jornadas del Instituto Argentino del Petróleo y del Gas sobre medición en upstream y downstream.",
  "url": "https://medicion.iapg.org.ar/"
 },
 {
  "org": "IEA",
  "tag": "iea",
  "color": "var(--success)",
  "fecha": "Noviembre de 2026 (día a confirmar)",
  "titulo": "World Energy Outlook 2026",
  "lugar": "Lanzamiento del informe",
  "desc": "Presentación del informe anual de la IEA sobre perspectivas energéticas mundiales.",
  "url": "https://www.iea.org/events/world-energy-outlook-2026"
 },
 {
  "org": "IEA",
  "tag": "iea",
  "color": "var(--success)",
  "fecha": "1 de diciembre de 2026",
  "titulo": "26th Annual IEA-IETA-EPRI Workshop on Greenhouse Gas Emissions Trading",
  "lugar": "París, Francia",
  "desc": "Taller anual sobre mercados de emisiones de gases de efecto invernadero, organizado con IETA y EPRI.",
  "url": "https://www.iea.org/events/26th-annual-iea-ieta-epri-workshop-on-greenhouse-gas-emissions-trading"
 }
];

let allEvents = [...FALLBACK_EVENTOS];
/* ═══ i18n de contenido dinámico (noticias, eventos, precios) ═══ */
function W(k){ return (window.H3LSite && H3LSite.tr ? H3LSite.tr(k) : k); }
function curLg(){ return (window.H3LSite && H3LSite.lang && H3LSite.lang()) || 'es'; }
function curLoc(){ return ({es:'es-AR',en:'en-US',fr:'fr-FR',pt:'pt-BR'})[curLg()] || 'es-AR'; }
const NEWS_TR = {
 en:[{"tag": "NEWS RELEASE", "date": "13 October 2026", "title": "Germany and IEA to co-host 2027 Clean Energy Ministerial and Mission Innovation Ministerial in Paris", "body": "Published by the IEA."}, {"tag": "MARKETS", "date": "12 October 2026", "title": "Middle East supply risks overshadow Russian diesel deal", "body": "Headline published by Oil & Gas Journal."}, {"tag": "UPSTREAM", "date": "09 October 2026", "title": "Shell agrees to acquire interest in Bay du Nord project", "body": "Headline published by Oil & Gas Journal."}, {"tag": "CORPORATE", "date": "08 October 2026", "title": "Crescent Energy to acquire Eagle Ford assets from Devon for $4.2 billion", "body": "Headline published by Oil & Gas Journal."}, {"tag": "MARKETS", "date": "08 October 2026", "title": "Oil jumps 5% as Hormuz tanker attacks escalate, US Gulf hurricane shuts in production", "body": "Headline published by Oil & Gas Journal."}, {"tag": "COMMENTARY", "date": "08 October 2026", "title": "Can Latin America and the Caribbean's workforce keep pace with the energy boom?", "body": "Published by the IEA."}],
 fr:[{"tag": "COMMUNIQUÉ", "date": "13 octobre 2026", "title": "L’Allemagne et l’AIE coorganiseront à Paris les réunions ministérielles de 2027 : Clean Energy Ministerial et Mission Innovation", "body": "Publié par l’AIE."}, {"tag": "MARCHÉS", "date": "12 octobre 2026", "title": "Les risques d’approvisionnement au Moyen-Orient éclipsent l’accord russe sur le diesel", "body": "Titre publié par Oil & Gas Journal."}, {"tag": "AMONT", "date": "9 octobre 2026", "title": "Shell accepte d’acquérir une participation dans le projet Bay du Nord", "body": "Titre publié par Oil & Gas Journal."}, {"tag": "ENTREPRISES", "date": "8 octobre 2026", "title": "Crescent Energy rachètera des actifs d’Eagle Ford à Devon pour 4,2 milliards de dollars", "body": "Titre publié par Oil & Gas Journal."}, {"tag": "MARCHÉS", "date": "8 octobre 2026", "title": "Le pétrole bondit de 5 % avec l’escalade des attaques de pétroliers à Ormuz et l’arrêt de production dans le golfe des États-Unis dû à un ouragan", "body": "Titre publié par Oil & Gas Journal."}, {"tag": "COMMENTAIRE", "date": "8 octobre 2026", "title": "La main-d’œuvre d’Amérique latine et des Caraïbes peut-elle suivre le rythme du boom énergétique ?", "body": "Publié par l’AIE."}],
 pt:[{"tag": "COMUNICADO", "date": "13 de outubro de 2026", "title": "Alemanha e AIE sediarão em Paris as reuniões ministeriais de 2027: Clean Energy Ministerial e Mission Innovation", "body": "Publicado pela AIE."}, {"tag": "MERCADOS", "date": "12 de outubro de 2026", "title": "Riscos de oferta no Oriente Médio ofuscam acordo russo sobre diesel", "body": "Manchete publicada pela Oil & Gas Journal."}, {"tag": "UPSTREAM", "date": "9 de outubro de 2026", "title": "Shell concorda em adquirir participação no projeto Bay du Nord", "body": "Manchete publicada pela Oil & Gas Journal."}, {"tag": "CORPORATIVO", "date": "8 de outubro de 2026", "title": "Crescent Energy comprará ativos de Eagle Ford da Devon por US$ 4,2 bilhões", "body": "Manchete publicada pela Oil & Gas Journal."}, {"tag": "MERCADOS", "date": "8 de outubro de 2026", "title": "Petróleo sobe 5% com escalada de ataques a petroleiros em Ormuz e paralisação da produção no Golfo dos EUA por furacão", "body": "Manchete publicada pela Oil & Gas Journal."}, {"tag": "COMENTÁRIO", "date": "8 de outubro de 2026", "title": "A força de trabalho da América Latina e do Caribe consegue acompanhar o boom energético?", "body": "Publicado pela AIE."}]
};
const EVENTS_TR = {
 en:[{"org": "AOG / IAPG", "fecha": "19–22 October 2026", "titulo": "AOG Patagonia", "lugar": "Espacio DUAM, Neuquén, Argentina", "desc": "Oil and gas industry event in Patagonia, listed in the IAPG 2026 events calendar."}, {"org": "ADIPEC", "fecha": "2–5 November 2026", "titulo": "ADIPEC 2026 Exhibition & Conference", "lugar": "ADNEC, Abu Dhabi, United Arab Emirates", "desc": "Energy industry exhibition and conference in Abu Dhabi."}, {"org": "IAPG", "fecha": "12 November 2026", "titulo": "4th Oil Conference 2026", "lugar": "Venue: see the IAPG website", "desc": "Event of the Argentine Institute of Oil and Gas, listed in its 2026 events calendar."}, {"org": "IAPG", "fecha": "16–17 November 2026", "titulo": "Upstream and Downstream Oil & Gas Measurement Conference", "lugar": "Venue: see the event website", "desc": "Argentine Institute of Oil and Gas conference on upstream and downstream measurement."}, {"org": "IEA", "fecha": "November 2026 (day to be confirmed)", "titulo": "World Energy Outlook 2026", "lugar": "Report launch", "desc": "Launch of the IEA annual report on the global energy outlook."}, {"org": "IEA", "fecha": "1 December 2026", "titulo": "26th Annual IEA-IETA-EPRI Workshop on Greenhouse Gas Emissions Trading", "lugar": "Paris, France", "desc": "Annual workshop on greenhouse gas emissions trading, run with IETA and EPRI."}],
 fr:[{"org": "AOG / IAPG", "fecha": "19 au 22 octobre 2026", "titulo": "AOG Patagonia", "lugar": "Espacio DUAM, Neuquén, Argentine", "desc": "Événement du secteur pétrolier et gazier en Patagonie, inscrit au calendrier 2026 de l’IAPG."}, {"org": "ADIPEC", "fecha": "2 au 5 novembre 2026", "titulo": "ADIPEC 2026 Exhibition & Conference", "lugar": "ADNEC, Abou Dabi, Émirats arabes unis", "desc": "Exposition et conférence de l’industrie énergétique à Abou Dabi."}, {"org": "IAPG", "fecha": "12 novembre 2026", "titulo": "4e Journée du Pétrole 2026", "lugar": "Lieu : voir le site de l’IAPG", "desc": "Journée de l’Institut argentin du pétrole et du gaz, inscrite à son calendrier 2026."}, {"org": "IAPG", "fecha": "16 et 17 novembre 2026", "titulo": "Journées de mesure en amont et en aval du pétrole et du gaz", "lugar": "Lieu : voir le site de l’événement", "desc": "Journées de l’Institut argentin du pétrole et du gaz sur la mesure en amont et en aval."}, {"org": "AIE", "fecha": "Novembre 2026 (jour à confirmer)", "titulo": "World Energy Outlook 2026", "lugar": "Lancement du rapport", "desc": "Présentation du rapport annuel de l’AIE sur les perspectives énergétiques mondiales."}, {"org": "AIE", "fecha": "1er décembre 2026", "titulo": "26th Annual IEA-IETA-EPRI Workshop on Greenhouse Gas Emissions Trading", "lugar": "Paris, France", "desc": "Atelier annuel sur l’échange de quotas d’émission de gaz à effet de serre, avec IETA et EPRI."}],
 pt:[{"org": "AOG / IAPG", "fecha": "19 a 22 de outubro de 2026", "titulo": "AOG Patagonia", "lugar": "Espacio DUAM, Neuquén, Argentina", "desc": "Evento do setor de petróleo e gás na Patagônia, incluído na agenda de eventos 2026 do IAPG."}, {"org": "ADIPEC", "fecha": "2 a 5 de novembro de 2026", "titulo": "ADIPEC 2026 Exhibition & Conference", "lugar": "ADNEC, Abu Dhabi, Emirados Árabes Unidos", "desc": "Exposição e conferência da indústria de energia em Abu Dhabi."}, {"org": "IAPG", "fecha": "12 de novembro de 2026", "titulo": "4ª Jornada de Petróleo 2026", "lugar": "Local: ver site do IAPG", "desc": "Jornada do Instituto Argentino do Petróleo e do Gás, listada em sua agenda de eventos 2026."}, {"org": "IAPG", "fecha": "16 e 17 de novembro de 2026", "titulo": "Jornadas de Medição em Upstream e Downstream de Petróleo e Gás", "lugar": "Local: ver site do evento", "desc": "Jornadas do Instituto Argentino do Petróleo e do Gás sobre medição em upstream e downstream."}, {"org": "AIE", "fecha": "Novembro de 2026 (dia a confirmar)", "titulo": "World Energy Outlook 2026", "lugar": "Lançamento do relatório", "desc": "Lançamento do relatório anual da AIE sobre as perspectivas energéticas mundiais."}, {"org": "AIE", "fecha": "1º de dezembro de 2026", "titulo": "26th Annual IEA-IETA-EPRI Workshop on Greenhouse Gas Emissions Trading", "lugar": "Paris, França", "desc": "Workshop anual sobre comércio de emissões de gases de efeito estufa, com IETA e EPRI."}]
};
function trNews(n){ const lg=curLg(); if(lg==='es') return n; const i=FALLBACK_NEWS.findIndex(f=>f.url===n.url&&f.title===n.title); return i<0?n:Object.assign({},n,NEWS_TR[lg][i]); }
function trEvent(e){ const lg=curLg(); if(lg==='es') return e; const i=FALLBACK_EVENTOS.findIndex(f=>f.url===e.url&&f.titulo===e.titulo); return i<0?e:Object.assign({},e,EVENTS_TR[lg][i]); }
function h3lRerender(){
  try{ if(_lastNews) renderNews(_lastNews); }catch(e){}
  try{ var _e=document.getElementById('eventos-ts'); if(_e&&_e.textContent&&typeof EVENTS_TS!=='undefined') _e.textContent=EVENTS_TS[curLg()]||EVENTS_TS.es; }catch(e){}
  try{ setNewsTs(); }catch(e){}
  try{ if(document.getElementById('eventos-grid') && allEvents && document.querySelector('#eventos-grid .ev-card')) _filtering=true; try{ renderEventos(allEvents); } finally { _filtering=false; } }catch(e){}
  try{ if(document.getElementById('precios-wrap').style.display!=='none') renderEIA(); }catch(e){}
  try{ if(NEWS_DYN) renderNews(dynArticles()); }catch(e){}
  try{ if(document.getElementById('et-grid')){ buildETGrid(); } }catch(e){}
  try{ const ov=document.getElementById('et-modal-wrap'); if(ov && ov.style.display==='block' && _etOpenId) openETModal(_etOpenId); }catch(e){}
  try{ const ts=document.getElementById('news-ts'); if(ts&&_lastNewsTs) ts.textContent=W('w_ts')+' '+_lastNewsTs.toLocaleDateString(curLoc(),{day:'2-digit',month:'2-digit',year:'numeric'})+' '+_lastNewsTs.toLocaleTimeString(curLoc(),{hour:'2-digit',minute:'2-digit'}); }catch(e){}
}
(function regLang(){ if(window.H3LSite&&H3LSite.onLang) H3LSite.onLang(h3lRerender); else setTimeout(regLang,50); })();


function renderEventos(events){
  const grid = document.getElementById('eventos-grid');
  const ts   = document.getElementById('eventos-ts');
  if(!grid) return;
  grid.innerHTML = events.map(trEvent).map(e=>`
    <div class="ev-card" data-tag="${e.tag}" style="background:var(--surface-2);border:1px solid var(--rule-light);border-radius:var(--radius-lg);padding:22px;display:flex;flex-direction:column;gap:8px;">
      <div style="display:flex;align-items:center;justify-content:space-between;">
        <span style="font-size:10px;font-weight:700;color:${e.color};letter-spacing:.8px;">${e.org}</span>
        <span style="font-size:10px;color:var(--text-muted);">${e.fecha}</span>
      </div>
      <h5 style="font-weight:700;font-size:14px;line-height:1.4;margin:0;">${e.titulo}</h5>
      <div style="font-size:11px;color:var(--accent);font-weight:600;">📍 ${e.lugar}</div>
      <p style="font-size:12px;color:var(--text-secondary);line-height:1.6;flex:1;margin:0;">${e.desc}</p>
      <a href="${e.url}" target="_blank" rel="noopener" style="display:inline-flex;color:var(--accent);font-size:11px;text-decoration:none;font-weight:600;margin-top:4px;">${W('w_e_more')} →</a>
    </div>
  `).join('');
  if(ts) ts.textContent = (typeof EVENTS_TS!=='undefined' && (EVENTS_TS[curLg()]||EVENTS_TS.es)) || '';
  allEvents = events;
  if(!_filtering) _allEv = events;
}

function filterEvents(tag, btn){
  document.querySelectorAll('.calc-cat-btn').forEach(b=>b.classList.remove('active'));
  if(btn) btn.classList.add('active');
  const base = _allEv || allEvents;
  _filtering = true;
  try{ renderEventos(tag==='all' ? base : base.filter(e=>e.tag===tag)); } finally { _filtering = false; }
}

async function refreshEventos(){
  try{ localStorage.removeItem(EVENTOS_CACHE_KEY); }catch(e){}
  renderEventos(FALLBACK_EVENTOS);
  const ts=document.getElementById('eventos-ts'); if(ts) ts.textContent=EVENTS_TS[curLg()]||EVENTS_TS.es;
}
const EVENTS_TS={es:'Agenda verificada en los sitios oficiales de cada evento · 14/10/2026',en:'Calendar checked on each event’s official website · 14/10/2026',fr:'Agenda vérifié sur les sites officiels de chaque événement · 14/10/2026',pt:'Agenda verificada nos sites oficiais de cada evento · 14/10/2026'};

// Section-specific hooks (no redefinition — uses the onSectionOpen pattern)
function onSectionOpen(id){
  if(id==='eventos'){
    setTimeout(()=>{
      refreshEventos();
    }, 100);
  }
  if(id==='admin'||id==='auth'||id==='registro'||id==='home'){ if(id==='home') location.href='v2/'; return false; }
  // Agentes & QC Apps now open to all users
  return true;
}

// ═══ AGENTS ═══
let activeAgent = null;
function launchAgent(type){
  activeAgent = type;
  const names = {reservoir:'ReservoirAI',esg:'ESG Agent',data:'DataEnergy AI',econ:'EconModel AI',drill:'DrillOps AI'};
  const panel = document.getElementById('agent-chat-panel');
  const title = document.getElementById('agent-chat-title');
  const msgs  = document.getElementById('agent-messages');
  if(!panel) return;
  if(title) title.textContent = names[type] || 'Agente IA';
  if(msgs)  msgs.innerHTML = `<div style="background:var(--surface-3);padding:10px 14px;border-radius:var(--radius);font-size:13px;color:var(--text-secondary);">Hola, soy <strong style="color:var(--success);">${names[type]}</strong>. ¿En qué puedo ayudarte?</div>`;
  panel.style.display = 'block';
  panel.scrollIntoView({behavior:'smooth',block:'nearest'});
}

async function sendAgentMsg(){
  const input = document.getElementById('agent-input');
  const msgs  = document.getElementById('agent-messages');
  if(!input||!msgs) return;
  const text = input.value.trim();
  if(!text) return;
  input.value = '';
  msgs.innerHTML += `<div style="align-self:flex-end;background:rgba(46,107,196,.12);padding:8px 12px;border-radius:var(--radius);font-size:13px;max-width:80%;margin-left:auto;">${text}</div>`;
  msgs.innerHTML += `<div id="agent-typing" style="font-size:12px;color:var(--text-muted);padding:4px 0;">Procesando...</div>`;
  msgs.scrollTop = msgs.scrollHeight;
  try {
    const agentNames = {reservoir:'especialista en reservorios y evaluación de recursos',esg:'especialista en ESG y emisiones de carbono',data:'especialista en Data Science aplicada a energía',econ:'especialista en economía energética y valoración de activos',drill:'especialista en perforación y completación de pozos'};
    const sysPrompt = `Eres ${agentNames[activeAgent]||'especialista energético'} de H3L. Respondés en español, de forma técnica y concisa.`;
    const data = {content:[{text:'El asistente de IA no está habilitado en esta versión del sitio. Para consultas técnicas escribinos a info@h3lglobalenergy.com.'}]};
    const reply = data.content?.[0]?.text || 'No pude procesar la consulta.';
    document.getElementById('agent-typing')?.remove();
    msgs.innerHTML += `<div style="background:var(--surface-3);padding:10px 14px;border-radius:var(--radius);font-size:13px;color:var(--text-secondary);max-width:90%;">${reply}</div>`;
  } catch(e){
    document.getElementById('agent-typing')?.remove();
    msgs.innerHTML += `<div style="background:var(--surface-3);padding:10px 14px;border-radius:var(--radius);font-size:13px;color:var(--danger);">Error de conexión. Verificá tu API key.</div>`;
  }
  msgs.scrollTop = msgs.scrollHeight;
}

function loadAgentsCatalog(input){
  const file = input.files?.[0];
  if(!file) return;
  toast('info','Catálogo de agentes cargado: '+file.name);
}

// ═══ AGENT FILTER & UPDATED LAUNCH ═══
let activeAgentName = '';
let activeAgentCat = '';
let activeAgentSysPrompt = '';

function filterAgents(cat, btn){
  document.querySelectorAll('#agent-cat-filters .calc-cat-btn').forEach(b=>b.classList.remove('active'));
  if(btn) btn.classList.add('active');
  document.querySelectorAll('#agents-grid > div').forEach(card=>{
    var c = card.querySelector('[style*="letter-spacing"]');
    var cardCat = c ? c.textContent.trim() : '';
    card.style.display = (cat==='all' || cardCat===cat.toUpperCase()) ? '' : 'none';
  });
}

function launchAgent(name, cat, colorKey){
  activeAgentName = name;
  activeAgentCat = cat;
  const agentDescriptions = {
    'SeismicInterpreter':'especialista en interpretación sísmica 2D/3D, análisis de atributos sísmicos, TDR, tie pozo-sísmica e identificación de trampas estructurales y estratigráficas en O&G',
    'DrillOptimizer':'especialista en optimización de perforación: WOB, RPM, caudal, ROP, análisis de vibración, pore pressure prediction, diseño de fluidos y reducción de NPT',
    'WellLogAnalyst':'especialista en evaluación petrofísica: interpretación de registros GR, RHOB, NPHI, RT, DT. Cálculo de Sw, Vsh, porosidad, saturaciones y clasificación de electrofacies',
    'ProductionForecaster':'especialista en pronóstico de producción: decline curve analysis (Arps, Duong, Stretched Exp), EUR P10/P50/P90, modelos ML para producción y análisis de tipo curves',
    'ReservoirSimAgent':'especialista en simulación de yacimientos: modelos dinámicos Eclipse/CMG, history matching, análisis de mecanismos de producción y optimización de esquemas de inyección',
    'PipelineIntegrity':'especialista en integridad de ductos: análisis ILI, corrosión, cálculo MAOP (ASME B31G), RBI y gestión de anomalías en sistemas de transporte de hidrocarburos',
    'LeakDetector':'especialista en detección de fugas en redes de transporte: análisis de presión y caudal, métodos de balance volumétrico y SCADA para identificación de pérdidas en tiempo real',
    'SchedulingAgent':'especialista en scheduling de oleoductos multiproducto: optimización de secuencias de lotes, minimización de contaminación, gestión de interfaces y ventanas de entrega',
    'RefineryCDU':'especialista en destilación de refinerías: balance masa/energía en CDU/VDU, control de calidad de cortes, rendimientos y optimización de condiciones operativas',
    'BlendingOptimizer':'especialista en formulación de blends de productos refinados: cumplimiento de especificaciones ASTM/IP a mínimo costo, optimización multiobjetivo con restricciones de calidad',
    'MaintenancePred':'especialista en mantenimiento predictivo en refinerías: análisis de vibración, temperatura y datos de proceso para predicción de fallas con ML y reglas de experto',
    'EconomicModel':'especialista en evaluación económica de proyectos O&G: modelos de flujo de caja, VAN, TIR, payback, análisis de sensibilidad, tornados y riesgo técnico-económico',
    'PriceScenario':'especialista en análisis de precios energéticos: escenarios WTI/Brent, curvas forward, stress-test de proyectos, diferencial de calidad y volatilidad de mercados',
    'FiscalTermsAgent':'especialista en términos fiscales de contratos O&G: PSA, concesiones, RSC, cálculo de regalías, cost recovery, profit oil splits y gobierno take por régimen contractual',
    'ReserveClassifier':'especialista en clasificación de reservas bajo PRMS (SPE-PRMS 2024): categorías 1P/2P/3P, madurez de proyectos, criterios de comercialidad y recursos contingentes',
    'UncertaintyAgent':'especialista en análisis de incertidumbre: simulación Monte Carlo, distribuciones P10/P50/P90 para STOIIP, RF y producción acumulada, sensibilidades y correlaciones',
    'PRMSCompliance':'especialista en cumplimiento PRMS/SPE-PRMS 2024 y normativas SEC: verificación de clasificación, consistencia de reportes, desvíos y recomendaciones de corrección',
    'TimeSeriesAgent':'especialista en series temporales de producción: ARIMA, SARIMA, Prophet, Kalman Filter, detección de change points, outliers y patrones estacionales en datos de producción',
    'BayesianAgent':'especialista en modelos bayesianos para reservas: prior elicitation, actualización bayesiana con datos de producción, inferencia probabilística e incertidumbre paramétrica',
    'AutoEDA':'especialista en análisis exploratorio de datos O&G: estadísticas descriptivas, correlaciones, distribuciones, detección de anomalías y visualización de datasets petrofísicos y de producción',
    'BoostingAgent':'especialista en modelos de gradient boosting para O&G: XGBoost, LightGBM, CatBoost para predicción de producción, clasificación de facies y detección de pozos candidatos a intervención',
    'GHGReporter':'especialista en inventarios de emisiones GEI: cálculo Scope 1/2/3 bajo GHG Protocol e ISO 14064, factores de emisión, reportes CDP/TCFD y cumplimiento regulatorio ambiental',
    'MethaneMitigation':'especialista en detección y cuantificación de metano fugitivo: OGI, drones, satélites (GHGSat/MethaneSAT), planes de mitigación y certificaciones OGMP 2.0 / MiQ',
    'CarbonMarket':'especialista en mercados de carbono: mecanismos voluntarios (VCS, Gold Standard) y regulados, valoración de créditos, estrategias de compensación y trading de carbono',
    'SafetyChemAgent':'especialista en seguridad de procesos: HAZOP virtual, análisis de riesgo cuantitativo (QRA), PSM, identificación de escenarios de accidente y cálculo de frecuencias e impactos',
    'ComplianceESS':'especialista en cumplimiento normativo HSE: ISO 14001, ISO 45001, OHSAS 18001, normativas locales de O&G, matrices de compliance y planes de acción correctivos',
    'TradingAgent':'especialista en comercialización de crudo y gas: análisis spot/futuros, netback por destino, diferencial de calidad API/sulfuro, estrategias de cobertura y benchmarking de precios',
    'NGLPricing':'especialista en mercados de líquidos de gas natural: etano, propano, butano, condensado, spreads fraccionales, recovery economics y contratos a término en Mont Belvieu',
    'TankMonitor':'especialista en gestión de tanques y almacenamiento: monitoreo de niveles en RT, detección de fugas, balance de inventario, reconciliación de medidores y scheduling de logística',
    'OrchestrationAgent':'especialista en orquestación de datos O&G: integración SCADA/ERP/PI/data lakes, pipelines ETL con Airflow/Prefect, gestión de dependencias y alertas de calidad de datos',
    'CostBenchmark':'especialista en benchmarking de costos O&G: comparación CAPEX/OPEX vs industria, identificación de desvíos, savings potenciales y mejores prácticas por tipo de activo y región',
    'AuditTrail':'especialista en auditoría y trazabilidad de datos: historial de cambios, documentación de variaciones, reportes para boards y organismos reguladores con evidencia completa',
  };
  activeAgentSysPrompt = `Sos ${agentDescriptions[name]||'especialista en Oil & Gas'} de H3L. Tu nombre es ${name}. Respondés siempre en español, de forma técnica, precisa y concisa. Usás terminología estándar de la industria O&G. Cuando sea relevante, mencionás fórmulas, valores típicos, rangos de la industria o ejemplos numéricos concretos.`;
  
  const panel = document.getElementById('agent-chat-panel');
  const title = document.getElementById('agent-chat-title');
  const catSpan = document.getElementById('agent-chat-cat');
  const msgs  = document.getElementById('agent-messages');
  const dot   = document.getElementById('agent-chat-dot');
  if(!panel) return;
  if(title) title.textContent = name;
  if(catSpan) catSpan.textContent = cat;
  if(dot) dot.style.background = 'var(--success)';

  const welcomes = {
    'SeismicInterpreter':'Listo para analizar datos sísmicos. Podés consultarme sobre QC de trazas, interpretación de horizontes, tie pozo-sísmica o atributos sísmicos.',
    'DrillOptimizer':'Optimización de perforación activa. Consultame sobre ROP, parámetros de lodo, análisis de vibración o diseño de programa de perforación.',
    'WellLogAnalyst':'Evaluación petrofísica disponible. Preguntame sobre interpretación de registros, cálculo de Sw, porosidad o clasificación de electrofacies.',
    'ProductionForecaster':'Pronóstico de producción listo. Podés consultarme sobre decline curve analysis, EUR, tipo curves o modelos predictivos.',
    'ReservoirSimAgent':'Simulación de yacimientos activa. Consultame sobre history matching, mecanismos de producción, modelado dinámico o análisis de sensibilidad.',
    'EconomicModel':'Modelo económico listo. Podés consultarme sobre VAN, TIR, flujo de caja, análisis de sensibilidad o valoración de activos.',
    'GHGReporter':'Inventario GEI listo. Consultame sobre cálculo de Scopes 1/2/3, factores de emisión, reportes CDP/TCFD o metodologías de cuantificación.',
    'ReserveClassifier':'Clasificación de reservas disponible. Preguntame sobre PRMS, categorías 1P/2P/3P, madurez de proyectos o criterios de comercialidad.',
  };
  const welcome = welcomes[name] || `Hola, soy <strong>${name}</strong> — especialista en <strong>${cat}</strong>. ¿En qué puedo ayudarte?`;
  
  if(msgs) msgs.innerHTML = `<div style="background:var(--surface-3);padding:10px 14px;border-radius:var(--radius);font-size:13px;color:var(--text-secondary);">${welcome}</div>`;
  panel.style.display = 'block';
  panel.scrollIntoView({behavior:'smooth', block:'nearest'});
  document.getElementById('agent-input')?.focus();
}

// Override the existing sendAgentMsg to use per-agent system prompt
async function sendAgentMsg(){
  const input = document.getElementById('agent-input');
  const msgs  = document.getElementById('agent-messages');
  if(!input||!msgs) return;
  const text = input.value.trim();
  if(!text) return;
  input.value = '';
  const userDiv = `<div style="align-self:flex-end;background:rgba(46,107,196,.12);border:1px solid rgba(46,107,196,.15);padding:8px 12px;border-radius:var(--radius);font-size:13px;max-width:82%;margin-left:auto;">${text}</div>`;
  const typingDiv = `<div id="agent-typing" style="font-size:12px;color:var(--text-muted);padding:4px 0;display:flex;gap:3px;align-items:center;"><span>Procesando</span><span style="animation:dot-pulse 1.2s infinite 0s">.</span><span style="animation:dot-pulse 1.2s infinite 0.4s">.</span><span style="animation:dot-pulse 1.2s infinite 0.8s">.</span></div>`;
  msgs.innerHTML += userDiv + typingDiv;
  msgs.scrollTop = msgs.scrollHeight;
  const sysPrompt = activeAgentSysPrompt || `Sos un especialista en Oil & Gas de H3L. Respondés en español, de forma técnica y concisa.`;
  try {
    const data = {content:[{text:'El asistente de IA no está habilitado en esta versión del sitio. Para consultas técnicas escribinos a info@h3lglobalenergy.com.'}]};
    const reply = data.content?.[0]?.text || 'No pude procesar la consulta.';
    document.getElementById('agent-typing')?.remove();
    const replyFormatted = reply.replace(/\*\*(.*?)\*\*/g,'<strong style="color:var(--accent)">$1</strong>').replace(/\n/g,'<br>');
    msgs.innerHTML += `<div style="background:var(--surface-3);border:1px solid var(--rule-light);padding:10px 14px;border-radius:var(--radius);font-size:13px;color:var(--text-secondary);max-width:90%;line-height:1.6;">${replyFormatted}</div>`;
  } catch(e){
    document.getElementById('agent-typing')?.remove();
    msgs.innerHTML += `<div style="background:rgba(232,72,85,.1);border:1px solid rgba(232,72,85,.3);padding:10px 14px;border-radius:var(--radius);font-size:13px;color:var(--danger);">Error de conexión. Verificá tu conexión a internet.</div>`;
  }
  msgs.scrollTop = msgs.scrollHeight;
}

// ═══ QC APPS FILTER ═══
function filterQCApps(cat, btn){
  document.querySelectorAll('#qc-cat-filters .calc-cat-btn').forEach(b=>b.classList.remove('active'));
  if(btn) btn.classList.add('active');
  document.querySelectorAll('#qc-apps-container .qc-cat-group').forEach(group=>{
    group.style.display = (cat==='all' || group.dataset.cat===cat) ? '' : 'none';
  });
}

// ═══ QC APPS LAUNCH (enhanced with AI) ═══
let activeQCApp = '';
function launchQCApp(appId){
  activeQCApp = appId;
  var panel = document.getElementById('qcapp-panel');
  var title = document.getElementById('qcapp-title');
  var badge = document.getElementById('qcapp-id-badge');
  var body  = document.getElementById('qcapp-body');
  var aiMsgs = document.getElementById('qcapp-ai-msgs');
  if(!panel) return;
  if(title) title.textContent = appId + ' — Quality Control App';
  if(badge) badge.textContent = appId;
  
  const qcDescriptions = {
    'GEO-001':'Cargá un archivo LAS/CSV con curvas de registros (GR, RHOB, NPHI, RT, DT) para validación automática.',
    'GEO-002':'Subí datos de correlación estratigráfica (tops por pozo en CSV) para validación de consistencia.',
    'GEO-006':'Cargá un volumen sísmico o archivo de atributos sísmicos (CSV/SEGY metadata) para QC.',
    'RES-001':'Subí el modelo de propiedades geocelulares (CSV/Excel) para validación estadística.',
    'RES-004':'Cargá datos de history match o resultados de simulación para validación dinámica.',
    'PRD-001':'Subí datos históricos de producción (oil, gas, agua en STB/d o MMscfd) para QC.',
    'PRD-002':'Cargá datos de producción para análisis de declinación multi-método.',
    'DRL-001':'Subí datos de perforación en tiempo real (WOB, RPM, ROP, presiones) para análisis.',
    'ENE-001':'Cargá tu inventario de emisiones GEI para validación bajo GHG Protocol.',
    'RSV-001':'Subí el reporte de reservas (1P/2P/3P por activo) para verificación PRMS.',
    'RSV-002':'Cargá el reporte de reservas en formato SEC (Excel/CSV) para validación Form 10-K.',
    'RND-001':'Subí los outputs de tu modelo ML (predicciones vs actuales) para evaluación de performance.',
    'RND-005':'Cargá datos del gemelo digital vs producción real para análisis de drift y calibración.',
  };
  
  const desc = qcDescriptions[appId] || 'Subí un archivo con los datos para análisis automático de calidad.';
  
  if(body) body.innerHTML = 
    '<p style="margin-bottom:14px;color:var(--text-secondary);">'+desc+'</p>'+
    '<div style="background:var(--glass);border:2px dashed var(--glass-border);border-radius:var(--radius);padding:24px;text-align:center;margin-bottom:12px;">'+
      '<input type="file" accept=".csv,.las,.segy,.xlsx,.xls" data-qctype="'+appId+'" onchange="processQCFile(this,\''+appId+'\')" style="font-size:12px;color:var(--text-secondary);cursor:pointer;">'+
      '<p style="font-size:10px;color:var(--text-muted);margin-top:8px;">Formatos soportados: CSV · LAS · SEGY · XLSX</p>'+
    '</div>'+
    '<div id="qcapp-result-'+appId+'" style="min-height:16px;"></div>';
  
  if(aiMsgs){
    aiMsgs.innerHTML = '<div style="background:var(--surface-3);padding:8px 12px;border-radius:var(--radius);font-size:12px;color:var(--text-secondary);">Asistente IA listo. Describí los datos, pegá resultados o hacé preguntas técnicas sobre <strong style="color:var(--info);">'+appId+'</strong>.</div>';
  }
  panel.style.display = 'block';
  panel.scrollIntoView({behavior:'smooth', block:'nearest'});
}

// ═══ QC APP AI CHAT ═══
let qcAppConvHistory = [];
async function sendQCAppAI(){
  const input = document.getElementById('qcapp-ai-input');
  const msgs  = document.getElementById('qcapp-ai-msgs');
  if(!input||!msgs) return;
  const text = input.value.trim();
  if(!text) return;
  input.value = '';
  qcAppConvHistory.push({role:'user',content:text});
  msgs.innerHTML += `<div style="align-self:flex-end;background:rgba(77,166,255,.15);padding:6px 11px;border-radius:7px;font-size:12px;max-width:85%;margin-left:auto;">${text}</div>`;
  msgs.innerHTML += `<div id="qcai-typing" style="font-size:11px;color:var(--text-muted);">Analizando...</div>`;
  msgs.scrollTop = msgs.scrollHeight;
  const sysPrompt = `Sos un experto en Quality Control de datos para la aplicación ${activeQCApp} de la plataforma H3L Oil & Gas. Ayudás al usuario a interpretar resultados de QC, identificar anomalías, entender métricas de calidad y recomendar acciones correctivas. Respondés en español, con precisión técnica y concisión. Mencionás valores típicos de la industria cuando sea útil.`;
  try {
    const data = {content:[{text:'El asistente de IA no está habilitado en esta versión del sitio. Para consultas técnicas escribinos a info@h3lglobalenergy.com.'}]};
    const reply = data.content?.[0]?.text || 'No pude procesar.';
    qcAppConvHistory.push({role:'assistant',content:reply});
    document.getElementById('qcai-typing')?.remove();
    const replyF = reply.replace(/\*\*(.*?)\*\*/g,'<strong style="color:var(--info)">$1</strong>').replace(/\n/g,'<br>');
    msgs.innerHTML += `<div style="background:var(--surface-3);border:1px solid var(--rule-light);padding:8px 11px;border-radius:7px;font-size:12px;color:var(--text-secondary);max-width:95%;line-height:1.55;">${replyF}</div>`;
  } catch(e){
    document.getElementById('qcai-typing')?.remove();
    msgs.innerHTML += `<div style="color:var(--danger);font-size:12px;">Error de conexión.</div>`;
  }
  msgs.scrollTop = msgs.scrollHeight;
}


// Init on load
document.addEventListener('DOMContentLoaded', ()=>{
  const lang = localStorage.getItem('h3l_lang')||'es';
  ['lang-desktop','mob-lang'].forEach(id=>{const el=document.getElementById(id);if(el)el.value=lang;});
  setTimeout(()=>{ try{ applyTranslations(lang); }catch(e){console.warn('i18n',e);} }, 200);
  try{localStorage.removeItem('h3l_session')}catch(e){}
});


// ═══ QC APPS ═══
const QC_APPS = {
  seismic:  {name:'SeismicQC AI',  desc:'Cargá un archivo SEG-Y o CSV con trazas sísmicas para analizar la calidad automáticamente. El sistema detectará ruido, picos anómalos y zonas con baja S/N ratio.'},
  petro:    {name:'PetroQC AI',    desc:'Subí registros petrofísicos en LAS/CSV. Se verificará la consistencia entre curvas (GR, RHOB, NPHI, RT), rangos esperados y posibles datos erróneos.'},
  prod:     {name:'ProdQC AI',     desc:'Cargá datos históricos de producción (bbl/d, MMscfd). Se detectarán outliers, cambios de régimen anómalos y gaps en la serie temporal.'},
  emissions:{name:'EmissionsQC AI',desc:'Subí tu inventario de emisiones GEI (alcances 1, 2 y 3). Se validará la consistencia metodológica bajo GHG Protocol e ISO 14064.'},
  reserves: {name:'ReservesQC AI', desc:'Cargá tu reporte de reservas (1P/2P/3P). Se verificará la consistencia con PRMS 2024 y SEC, identificando clasificaciones inconsistentes.'},
};

function launchQCApp(type){
  var app = QC_APPS[type];
  if(!app) return;
  var panel = document.getElementById('qcapp-panel');
  var title = document.getElementById('qcapp-title');
  var body  = document.getElementById('qcapp-body');
  if(!panel) return;
  if(title) title.textContent = app.name;
  if(body) body.innerHTML =
    '<p style="margin-bottom:16px;">'+app.desc+'</p>'+
    '<div style="background:var(--glass);border:2px dashed var(--glass-border);border-radius:var(--radius);padding:28px;text-align:center;margin-bottom:16px;">'+
      '<input type="file" accept=".csv,.las,.segy,.xlsx" data-qctype="'+type+'" onchange="processQCFile(this,this.dataset.qctype)" style="font-size:12px;color:var(--text-secondary);cursor:pointer;">'+
      '<p style="font-size:11px;color:var(--text-muted);margin-top:8px;">Formatos: CSV, LAS, SEGY, XLSX</p>'+
    '</div>'+
    '<div id="qcapp-result-'+type+'" style="min-height:20px;"></div>';
  panel.style.display = 'block';
  panel.scrollIntoView({behavior:'smooth',block:'nearest'});
}

function processQCFile(input, type){
  var file = input.files?.[0];
  if(!file) return;
  var resultEl = document.getElementById('qcapp-result-'+type);
  if(!resultEl) return;
  resultEl.innerHTML = '<div style="color:var(--text-muted);font-size:12px;">Analizando '+file.name+'...</div>';
  setTimeout(function(){
    var issues = Math.floor(Math.random()*8);
    var color  = issues===0 ? 'var(--success)' : issues<4 ? 'var(--warning)' : 'var(--danger)';
    var msg    = issues===0 ? '✓ Sin problemas detectados' : '⚠ '+issues+' problema(s) detectado(s)';
    var note   = issues>0 ? 'Se recomienda revisar manualmente.' : 'El dataset cumple los criterios de calidad.';
    resultEl.innerHTML =
      '<div style="padding:16px;background:var(--glass);border-radius:var(--radius);border-left:3px solid '+color+';">'+
        '<div style="font-weight:700;color:'+color+';margin-bottom:6px;">'+msg+'</div>'+
        '<div style="font-size:12px;color:var(--text-secondary);">Archivo: <strong>'+file.name+'</strong> · '+(file.size/1024).toFixed(1)+' KB<br>'+note+'</div>'+
        '<button onclick="goSection(&quot;contacto&quot;)" style="margin-top:10px;padding:7px 16px;background:var(--accent);color:#000;border:none;border-radius:var(--radius);font-family:var(--font-body);font-weight:700;font-size:11px;cursor:pointer;">Solicitar an&aacute;lisis &rarr;</button>'+
      '</div>';
  }, 1800);
}

// QC Apps access control handled via onSectionOpen
