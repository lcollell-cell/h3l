/* H3L Global Energy · Calculadora CBAM (calculadoras clasicas). Autor: Leandro Collell.
   Estimacion orientativa con el calendario de la norma vigente. Los textos estan en espanol;
   las traducciones estan en assets/calc-i18n.js. */
(function(){
'use strict';
if(typeof calculators==='undefined'||typeof modalTemplates==='undefined')return;
var FACTOR={2026:.975,2027:.95,2028:.9,2029:.775,2030:.515,2031:.39,2032:.265,2033:.14,2034:0};
function campo(id,label,val,step){return '<div class="form-group"><label class="form-label" for="'+id+'">'+label+'</label><input class="form-input" type="number" min="0" step="'+step+'" id="'+id+'" value="'+val+'"></div>'}
var anios=Object.keys(FACTOR).map(function(y){return '<option value="'+y+'">'+y+'</option>'}).join('');
modalTemplates.cbam=
 '<p style="color:var(--text-secondary);font-size:13px;margin-bottom:20px"><strong style="color:var(--accent)">Certificados por t = Emisiones implícitas − Factor del año × Referencia</strong></p>'+
 '<div class="form-row">'+campo('cbam_see','Emisiones implícitas (t CO₂e/t)','2.00','0.01')+campo('cbam_ref','Referencia (t CO₂e/t)','1.40','0.01')+'</div>'+
 '<div class="form-row">'+campo('cbam_px','Precio del certificado (EUR/t CO₂e)','82.32','0.01')+campo('cbam_ton','Toneladas anuales a la UE','1000','1')+'</div>'+
 '<div class="form-group"><label class="form-label" for="cbam_year">Año</label><select class="form-input" id="cbam_year">'+anios+'</select></div>'+
 '<button class="btn-calc" onclick="calcCBAM()">Calcular costo CBAM</button>'+
 '<div class="calc-result" id="cbam_result" aria-live="polite">'+
   '<div class="result-label">Costo estimado por tonelada</div><div class="result-value" id="cbam_val">—</div>'+
   '<div class="result-unit">EUR por tonelada de producto</div>'+
   '<div class="result-unit"><span>Certificados por tonelada:</span> <strong id="cbam_cert"></strong></div>'+
   '<div class="result-unit"><span>Costo anual (EUR):</span> <strong id="cbam_anual"></strong></div>'+
   '<div class="result-unit"><span>Costo por tonelada en 2030 y 2034 (EUR):</span> <strong id="cbam_fut"></strong></div>'+
 '</div>'+
 '<p style="color:var(--text-secondary);font-size:12px;margin-top:14px">Valores de ejemplo. Estimación orientativa sin deducción por carbono pagado en origen; no reemplaza la verificación acreditada.</p>'+
 '<p style="color:var(--text-secondary);font-size:12px;margin-top:6px">Precio publicado del tercer trimestre de 2026. La extensión del calendario a 2038 es una propuesta sin aprobar.</p>';

function idioma(){try{return (window.H3LSite&&H3LSite.lang&&H3LSite.lang())||'es'}catch(e){return 'es'}}
window.calcCBAM=function(){
  var v=function(i){var x=parseFloat(document.getElementById(i).value);return isFinite(x)&&x>0?x:0};
  var see=v('cbam_see'),ref=v('cbam_ref'),px=v('cbam_px'),ton=v('cbam_ton'),y=document.getElementById('cbam_year').value;
  var loc={es:'es-AR',en:'en-US',fr:'fr-FR',pt:'pt-BR'}[idioma()]||'es-AR';
  var n=function(x,d){return x.toLocaleString(loc,{minimumFractionDigits:d,maximumFractionDigits:d})};
  var cert=function(a){return Math.max(0,see-FACTOR[a]*ref)};
  var c=cert(y);
  document.getElementById('cbam_val').textContent=n(c*px,2);
  document.getElementById('cbam_cert').textContent=n(c,3);
  document.getElementById('cbam_anual').textContent=n(c*px*ton,0);
  document.getElementById('cbam_fut').textContent=n(cert(2030)*px,2)+' · '+n(cert(2034)*px,2);
  document.getElementById('cbam_result').classList.add('show');
  if(typeof toast==='function')toast('success',{es:'Costo CBAM estimado',en:'CBAM cost estimated',fr:'Coût CBAM estimé',pt:'Custo CBAM estimado'}[idioma()]||'Costo CBAM estimado');
};

var pos=calculators.map(function(c){return c.id}).indexOf('huella');
calculators.splice(pos<0?calculators.length:pos+1,0,{id:'cbam',cat:'energy',icon:'⚖️',name:'CBAM · Costo estimado',desc:'Certificados y costo por tonelada exportada a la Unión Europea, calendario 2026–2034',badge:'Energy Transition',modal:'cbam'});
if(typeof renderCalcs==='function'){var act=document.querySelector('.calc-cat-btn.active');renderCalcs();
  if(act&&act!==document.querySelector('.calc-cat-btn'))act.click();
  if(window.H3LCalcI18n)H3LCalcI18n.all();}

/* Boton "Probar la herramienta" del servicio CBAM: abre la calculadora */
document.addEventListener('click',function(e){
  if(!e.target.closest||!e.target.closest('#svc-cbam [data-go]'))return;
  setTimeout(function(){if(typeof calcTab==='function')calcTab('clasicas');openModal('cbam','CBAM · Costo estimado','energy')},60);
});
})();
