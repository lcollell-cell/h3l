/* Aula del curso dentro de Capacitacion Interna H3L. Autor: Leandro Collell.
   Recibe el curso ya descifrado. No guarda nada en el navegador. */
(function(){
'use strict';
var F={2026:.975,2027:.95,2028:.9,2029:.775,2030:.515,2031:.39,2032:.265,2033:.14,2034:0};
var T=['Presentación','Lecciones','Laboratorio','Evaluaciones','Cierre'];
function el(tag,txt,cls){var e=document.createElement(tag);if(txt!=null)e.textContent=txt;if(cls)e.className=cls;return e}
function add(p){for(var i=1;i<arguments.length;i++)if(arguments[i])p.appendChild(arguments[i]);return p}
function btn(txt,fn,cls){var b=el('button',txt,cls);b.type='button';b.onclick=fn;return b}
function list(a,h){var u=el('ul');a.forEach(function(x,i){add(u,el('li',x,i===h?'hl':null))});return u}
function card(){var c=el('div',null,'card');for(var i=0;i<arguments.length;i++)add(c,arguments[i]);return c}
function table(cols,rows){var w=el('div',null,'tw'),t=el('table'),h=el('tr');cols.forEach(function(c){add(h,el('th',c))});add(t,h);
  rows.forEach(function(r){var tr=el('tr');r.forEach(function(c){add(tr,el('td',c))});add(t,tr)});return add(w,t)}
function stop(){if(window.speechSynthesis)window.speechSynthesis.cancel()}
function scene(s,h){if(!s)return el('div');var c=card(s.k?el('div',s.k,'k'):null,el('h3',s.h));
  if(s.t==='bul')add(c,list(s.items,h));
  if(s.t==='tbl')add(c,table(s.cols,s.rows));
  if(s.t==='fm')add(c,el('div',s.f,'fm'));
  if(s.t==='case'){add(c,el('p',s.src,'note'));[['S','Situación'],['T','Tarea'],['A','Acción'],['R','Resultado']].forEach(function(k){add(c,add(el('p'),el('b',k[1]+': '),document.createTextNode(s[k[0]])))})}
  if(s.n)add(c,el('p',s.n,'note'));return c}
function quiz(q,onans){var c=card(el('b',q.q)),f=el('p',null,'note');f.setAttribute('role','status');
  q.o.forEach(function(o,i){var b=btn(o,function(){c.querySelectorAll('button').forEach(function(x){x.classList.remove('ok','no')});
    b.classList.add(i===q.a?'ok':'no');f.textContent=i===q.a?'Correcto. '+q.e:'Intentá otra vez.';if(onans)onans(c,i===q.a)},'opt');add(c,b)});
  return add(c,f)}

function mount(root,D,files){
  var L=[];D.modules.forEach(function(m){m.lessons.forEach(function(l){L.push([m,l])})});
  var tab=0,li=0,ci=0,nav=el('div',null,'tabs'),view=el('div');
  root.className='curso';root.textContent='';add(root,nav,view);
  function go(t){stop();tab=t;draw(true)}
  function downloads(){return (files||[]).map(function(f){
    return card(el('h3',f.titulo),el('p',f.desc),f.tarea?el('p','Ejercicio: '+f.tarea,'note'):null,btn('Descargar Excel',function(){
      var bin=Uint8Array.from(atob(f.b64),function(c){return c.charCodeAt(0)});
      var u=URL.createObjectURL(new Blob([bin],{type:f.tipo})),a=el('a');a.href=u;a.download=f.nombre;document.body.appendChild(a);a.click();a.remove();
      setTimeout(function(){URL.revokeObjectURL(u)},4000)},'pri'))})}
  var views=[
  function(){var s=D.intro.star;
    add(view,el('h3',D.title),el('p',D.subtitle),card(el('b',D.intro.hook),list(D.intro.questions)),
      scene({t:'case',h:s.caso,src:'Metodología STAR',S:s.S,T:s.T,A:s.A,R:s.R}),
      card(el('h3','Objetivos'),list(D.objectives),el('p',D.desc,'note')),btn('Empezar',function(){go(1)},'pri'))},
  function(){var m=L[li][0],l=L[li][1],c=l.cues[ci];
    var lab=el('label','Lección'),sel=el('select');L.forEach(function(x,i){add(sel,new Option((i+1)+'. '+x[1].title,i))});sel.value=li;
    sel.onchange=function(){stop();li=+sel.value;ci=0;draw()};add(lab,sel);
    var sc=scene(c.scene,c.hl),row=el('div',null,'row');
    var pr=btn('Anterior',function(){stop();if(ci)ci--;else{li--;ci=L[li][1].cues.length-1}draw()});
    var au=btn('Escuchar',function(){if(!window.speechSynthesis)return;stop();var u=new SpeechSynthesisUtterance(c.q?c.q.q:c.say);u.lang='es-AR';u.rate=.95;window.speechSynthesis.speak(u)});
    var nx=btn('Siguiente',function(){stop();if(ci<l.cues.length-1)ci++;else{li++;ci=0}draw()},'pri');
    pr.disabled=!li&&!ci;nx.disabled=li===L.length-1&&ci===l.cues.length-1;
    add(view,lab,el('p',m.title+' · pantalla '+(ci+1)+' de '+l.cues.length,'note'),c.scene?sc:null,c.q?quiz(c.q):el('p',c.say,'say'),add(row,pr,au,nx))},
  function(){
    var P=[['e','Emisiones implícitas (t CO₂e/t)',0,5,.05,2],['r','Referencia (t CO₂e/t)',0,3,.05,1.4],['p','Precio del certificado (€)',40,150,.01,82.32],['q','Toneladas anuales',100,20000,100,1000],['y','Año',2026,2034,1,2026]];
    var box=card(),I={},V={},kp=el('div',null,'kp'),O=['Certificados por t','Costo por t','Costo anual'].map(function(t){var b=el('div',null,'big');add(kp,card(el('span',t),b));return b}),tb=card();
    var n=function(x,d){return x.toLocaleString('es-AR',{maximumFractionDigits:d,minimumFractionDigits:d})};
    function up(){var x={};P.forEach(function(p){x[p[0]]=+I[p[0]].value;V[p[0]].textContent=p[0]==='y'?x[p[0]]:n(x[p[0]],p[4]<1?2:0)});
      var c=Math.max(0,x.e-F[x.y]*x.r);O[0].textContent=n(c,3);O[1].textContent=n(c*x.p,2)+' €';O[2].textContent=n(c*x.p*x.q,0)+' €';
      tb.textContent='';add(tb,table(['Año','Factor','€/t'],Object.keys(F).map(function(y){return [y,n(F[y]*100,1)+' %',n(Math.max(0,x.e-F[y]*x.r)*x.p,2)]})))}
    P.forEach(function(p){var w=el('label',p[1]+': '),b=el('b'),i=el('input');i.type='range';i.min=p[2];i.max=p[3];i.step=p[4];i.value=p[5];i.oninput=up;I[p[0]]=i;V[p[0]]=b;add(box,add(w,b,i))});
    add(view,el('h3','Laboratorio: costo por tonelada'),el('p','Valores de ejemplo. Reemplazá la referencia por la oficial del código NC. Cálculo simplificado con datos reales, sin deducción por carbono en origen. Calendario de la norma vigente (la extensión a 2038 es una propuesta).','note'),box,kp,tb);
    downloads().forEach(function(d){add(view,d)});up()},
  function(){var row=el('div',null,'row'),qs=el('div');
    D.modules.map(function(m){return [m.title,m.quiz]}).concat([['Examen final',D.exam]]).forEach(function(b){
      add(row,btn(b[0],function(){qs.textContent='';var sc=el('p',null,'big'),first=[];add(qs,sc);
        b[1].forEach(function(z){add(qs,quiz(z,function(c,ok){if(c.dataset.done)return;c.dataset.done=1;first.push(ok);sc.textContent=first.filter(Boolean).length+' / '+b[1].length+' al primer intento'}))})}))});
    add(view,el('h3','Evaluaciones'),el('p','Elegí un bloque. El resultado no se guarda.','note'),row,qs)},
  function(){var o=D.outro;add(view,el('h3','Ahora podés analizar y validar'),card(list(o.can)),card(el('h3','Temas vistos'),list(o.recap),el('b',o.phrase)));
    downloads().forEach(function(d){add(view,d)});add(view,card(el('h3','Fuentes'),list(D.refs.map(function(r){return r.cite}))))}];
  function draw(scroll){nav.textContent='';T.forEach(function(t,i){var b=btn(t,function(){go(i)},i===tab?'on':null);b.setAttribute('aria-pressed',i===tab);add(nav,b)});
    view.textContent='';views[tab]();if(scroll&&root.getBoundingClientRect().top<0)root.scrollIntoView()}
  draw();
}
window.H3LCurso={mount:mount,stop:stop};
})();
