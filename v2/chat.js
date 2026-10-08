/* H3L Copilot · asistente de la v2. Respuestas guiadas, sin servidor. Desarrollado por Leandro Collell. */
(function(){'use strict';
var NAME='H3L Copilot';
var L={calc:['Ver las calculadoras','../index.html?go=calculators'],ag:['Ver los agentes de IA','../index.html?go=agentes'],tab:['Ver los tableros','dashboards.html'],con:['Solicitar una demostración','../index.html?go=contacto'],nos:['Conocer a H3L','../index.html?go=somos']};
var KB=[
 {k:['hola','buenas','buen dia','buen día','buenos'],t:'Hola, soy '+NAME+'. Puedo orientarte sobre las calculadoras, los agentes de IA y los tableros de decisión de H3L. ¿Por dónde querés empezar?',l:[]},
 {k:['calculadora','ooip','reserv','prms','hidrogeno','hidrógeno','h2','co2','co₂','esg','emision','emisión','carbono'],t:'H3L reúne calculadoras de ingeniería para petróleo y gas y transición energética: volumen original in situ (OOIP), reservas con criterio SPE-PRMS, declinación, hidrógeno verde, emisiones de CO₂ y puntaje ESG. Cada cálculo muestra sus supuestos.',l:['calc']},
 {k:['agente','agent','ia ','inteligencia','automat'],t:'Los agentes de IA de H3L trabajan en cuatro roles: el Vigía revisa los datos, el Analista corre los cálculos, el Auditor comprueba reglas y fuentes, y el Redactor arma la recomendación. Ninguno decide por su cuenta: la aprobación es de una persona y queda registrada.',l:['ag','tab']},
 {k:['tablero','dashboard','decision','decisión','kpi','indicador'],t:'Los tableros de demostración muestran cinco tipos de decisión: estratégica, operativa, táctica, de reservas y de transición. Cada uno tiene una lectura integrada que relaciona los gráficos y una decisión sugerida con su resultado. Las cifras son ilustrativas.',l:['tab']},
 {k:['precio','costo','cuanto','cuánto','cotiz','tarifa','plan','pagar'],t:'No hay un precio fijo: se cotiza según la decisión que quieras resolver, los datos disponibles y los agentes que se necesiten. Lo más rápido es pedir una demostración con una pregunta y una muestra de datos.',l:['con']},
 {k:['contact','demostr','demo','reunion','reunión','hablar','mail','correo','escribir'],t:'Podés solicitar una demostración desde el formulario de contacto. Traé una pregunta concreta y una muestra de datos, y te mostramos cómo quedaría tu tablero.',l:['con']},
 {k:['quien','quién','nosotros','h3l','empresa','somos','leandro'],t:'H3L Global Energy desarrolla herramientas técnicas y de IA para petróleo y gas y transición energética. El sitio y las herramientas son desarrollo de Leandro Collell, ingeniero industrial con más de 20 años de experiencia en upstream.',l:['nos']},
 {k:['dato','segur','audit','trazab','registro','confiden'],t:'Cada decisión aprobada deja un registro con la fecha, los datos y fuentes usados, la versión del cálculo y quién aprobó. Para tus datos reales, las condiciones de seguridad se acuerdan en el proyecto.',l:['con']},
 {k:['gracias','chau','adios','adiós'],t:'De nada. Si más adelante querés ver tu caso en un tablero, pedí una demostración.',l:['con']}];
var DEF={t:'Todavía no tengo una respuesta guiada para eso. Puedo contarte sobre las calculadoras, los agentes de IA, los tableros o cómo solicitar una demostración.',l:['calc','ag','tab','con']};
var CHIPS=[['Calculadoras','calculadoras'],['Agentes de IA','agentes'],['Tableros de decisión','tableros'],['Solicitar demostración','demostración']];
function norm(s){return s.toLowerCase().normalize?s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,''):s.toLowerCase()}
function answer(q){var n=' '+norm(q)+' ';for(var i=0;i<KB.length;i++)for(var j=0;j<KB[i].k.length;j++)if(n.indexOf(norm(KB[i].k[j]))>=0)return KB[i];return DEF}

var css='#h3c-btn{position:fixed;right:max(18px,env(safe-area-inset-right));bottom:max(18px,env(safe-area-inset-bottom));z-index:40;width:56px;height:56px;border-radius:50%;border:0;background:#2A78D6;color:#fff;cursor:pointer;display:none;align-items:center;justify-content:center;box-shadow:0 8px 24px rgba(10,20,38,.35);transition:background .2s,transform .2s}'
+'#h3c-btn.on{display:flex}#h3c-btn:hover{background:#3a86e4}#h3c-btn:focus-visible,#h3c-p button:focus-visible,#h3c-p input:focus-visible,#h3c-p a:focus-visible{outline:3px solid #9CC3F5;outline-offset:2px}'
+'#h3c-btn svg{width:26px;height:26px}'
+'#h3c-p{position:fixed;right:max(18px,env(safe-area-inset-right));bottom:calc(max(18px,env(safe-area-inset-bottom)) + 70px);z-index:41;width:380px;max-width:calc(100vw - 24px);height:min(560px,calc(100vh - 120px));height:min(560px,calc(100dvh - 120px));background:#fff;color:#0E1A2B;border-radius:14px;box-shadow:0 18px 50px rgba(5,13,22,.45);display:none;flex-direction:column;overflow:hidden;font-family:"Montserrat",system-ui,-apple-system,"Segoe UI",sans-serif}'
+'#h3c-p.open{display:flex}'
+'#h3c-p .hd{background:#0A1426;color:#fff;padding:14px 16px;display:flex;align-items:center;gap:12px}'
+'#h3c-p .lg{font-weight:700;font-size:15px;letter-spacing:.01em}#h3c-p .lg b{color:#4FB27C}#h3c-p .sb{font-size:12px;color:#9FB0CC;margin-top:1px}'
+'#h3c-p .x{margin-left:auto;width:36px;height:36px;border-radius:8px;border:0;background:rgba(255,255,255,.1);color:#fff;font-size:20px;line-height:1;cursor:pointer}#h3c-p .x:hover{background:rgba(255,255,255,.2)}'
+'#h3c-p .log{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:12px;background:#F3F5F8;-webkit-overflow-scrolling:touch}'
+'#h3c-p .m{max-width:88%;padding:10px 13px;border-radius:12px;font-size:14px;line-height:1.5}'
+'#h3c-p .bot{align-self:flex-start;background:#fff;border:1px solid #DCE1E9;border-bottom-left-radius:4px}'
+'#h3c-p .me{align-self:flex-end;background:#0A1426;color:#fff;border-bottom-right-radius:4px}'
+'#h3c-p .lk{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}#h3c-p .lk a{font-size:13px;font-weight:600;color:#1F66BD;text-decoration:none;border:1px solid #BCD3F0;border-radius:8px;padding:7px 10px;background:#F4F8FE}#h3c-p .lk a:hover{background:#E6F0FC}'
+'#h3c-p .ch{display:flex;flex-wrap:wrap;gap:8px;padding:0 16px 12px;background:#F3F5F8}#h3c-p .ch button{font-size:13px;font-weight:600;font-family:inherit;color:#0E1A2B;background:#fff;border:1px solid #DCE1E9;border-radius:999px;padding:8px 12px;cursor:pointer;min-height:36px}#h3c-p .ch button:hover{background:#E9EEF5}'
+'#h3c-p form{display:flex;gap:8px;padding:12px;border-top:1px solid #DCE1E9;background:#fff}'
+'#h3c-p input{flex:1;min-width:0;font-size:16px;font-weight:400;font-family:inherit;border:1px solid #C5CCD8;border-radius:8px;padding:0 12px;min-height:44px;color:#0E1A2B}'
+'#h3c-p form button{min-height:44px;padding:0 16px;border:0;border-radius:8px;background:#2A78D6;color:#fff;font-size:14px;font-weight:600;font-family:inherit;cursor:pointer}#h3c-p form button:hover{background:#3a86e4}'
+'#h3c-p .ft{font-size:11.5px;color:#66717F;padding:0 14px 10px;background:#fff;line-height:1.4}'
+'@media (max-width:480px){#h3c-p{right:8px;left:8px;width:auto;max-width:none;bottom:calc(max(12px,env(safe-area-inset-bottom)) + 66px)}}'
+'@media (prefers-reduced-motion:reduce){#h3c-btn{transition:none}}@media print{#h3c-btn,#h3c-p{display:none!important}}';
var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);

function el(t,a,p,x){var e=document.createElement(t);if(a)for(var k in a)e.setAttribute(k,a[k]);if(x!=null)e.textContent=x;if(p)p.appendChild(e);return e}
var btn=el('button',{id:'h3c-btn',type:'button','aria-label':'Abrir chat con '+NAME,'aria-expanded':'false','aria-controls':'h3c-p'},document.body);
btn.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/></svg>';
var p=el('div',{id:'h3c-p',role:'dialog','aria-label':'Chat con '+NAME},document.body);
var hd=el('div',{'class':'hd'},p),hb=el('div',null,hd),lg=el('div',{'class':'lg'},hb);lg.innerHTML='H<b>3</b>L Copilot';
el('div',{'class':'sb'},hb,'Asistente de demostración');
var x=el('button',{'class':'x',type:'button','aria-label':'Cerrar el chat'},hd,'×');
var log=el('div',{'class':'log',role:'log','aria-live':'polite'},p);
var chips=el('div',{'class':'ch'},p);
var form=el('form',null,p),inp=el('input',{type:'text',placeholder:'Escribí tu consulta','aria-label':'Tu consulta',autocomplete:'off',maxlength:'200'},form);el('button',{type:'submit'},form,'Enviar');
el('div',{'class':'ft'},p,'Respuestas guiadas con datos de demostración. Para una consulta técnica, solicitá una demostración.');

function add(txt,me,links){var m=el('div',{'class':'m '+(me?'me':'bot')},log,txt);
  if(links&&links.length){var d=el('div',{'class':'lk'},m);links.forEach(function(k){el('a',{href:L[k][1]},d,L[k][0])})}
  log.scrollTop=log.scrollHeight}
function ask(q){q=q.trim();if(!q)return;add(q,true);var r=answer(q);setTimeout(function(){add(r.t,false,r.l)},reduce()?0:450)}
function reduce(){try{return matchMedia('(prefers-reduced-motion: reduce)').matches}catch(e){return false}}
CHIPS.forEach(function(c){var b=el('button',{type:'button'},chips,c[0]);b.addEventListener('click',function(){ask(c[1])})});
add('Hola, soy '+NAME+'. Puedo orientarte sobre las calculadoras, los agentes de IA y los tableros de H3L.',false);

var open=false;
function set(o){open=o;p.classList.toggle('open',o);btn.setAttribute('aria-expanded',o?'true':'false');if(o){setTimeout(function(){try{inp.focus({preventScroll:true})}catch(e){}},30)}else{try{btn.focus({preventScroll:true})}catch(e){}}}
btn.addEventListener('click',function(){set(!open)});x.addEventListener('click',function(){set(false)});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&open)set(false)});
form.addEventListener('submit',function(e){e.preventDefault();var v=inp.value;inp.value='';ask(v)});

/* en la portada, el botón aparece cuando termina la introducción */
function ready(){var ld=document.getElementById('loader'),g=document.getElementById('gate');if(!ld)return true;return getComputedStyle(ld).display==='none'&&(!g||g.hidden)}
(function wait(){if(ready())btn.classList.add('on');else setTimeout(wait,300)})();
})();
