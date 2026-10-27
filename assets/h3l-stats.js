/* H3L Global Energy: medición propia, sin cookies y sin servicios de terceros.
   Envía eventos anónimos a /api/collect (Worker propio). No guarda IP, ni datos personales, ni identificadores persistentes:
   el identificador de visita vive en sessionStorage (se borra al cerrar la pestaña).
   No mide si el navegador envía Do Not Track / Global Privacy Control, ni en la copia de prueba de GitHub Pages.
   Para excluir tu propio navegador: abrir una vez cualquier página del sitio con ?h3l-notrack=1 (y ?h3l-notrack=0 para volver a medir).
   Para marcar un navegador del equipo: abrir una vez con ?h3l-equipo=1 (y ?h3l-equipo=0 para quitar la marca). Sus visitas se miden aparte
   y el reporte las muestra en una sección propia, sin mezclarlas con las del público. */
(function(){
'use strict';
if(window.top!==window.self)return;                       /* no medir marcos incrustados (evita contar dos veces) */
if(window.__h3lStats)return;window.__h3lStats=1;
var EP='/api/collect';
try{
  var q=/[?&]h3l-notrack=([01])/.exec(location.search);
  if(q){if(q[1]==='1')localStorage.setItem('h3l_notrack','1');else localStorage.removeItem('h3l_notrack')}
  if(localStorage.getItem('h3l_notrack')==='1')return;
}catch(e){}
var team=false;
try{
  var qe=/[?&]h3l-equipo=([01])/.exec(location.search);
  if(qe){if(qe[1]==='1')localStorage.setItem('h3l_team','1');else localStorage.removeItem('h3l_team')}
  team=localStorage.getItem('h3l_team')==='1';
}catch(e){}
if(navigator.doNotTrack==='1'||window.doNotTrack==='1'||navigator.globalPrivacyControl)return;
if(/\.github\.io$/.test(location.hostname))return;        /* la copia de prueba no mide */

var LANGS=['es','en','fr','pt'];
function rnd(){var a='',s='abcdefghijklmnopqrstuvwxyz0123456789';
  try{var u=new Uint8Array(12);crypto.getRandomValues(u);for(var i=0;i<12;i++)a+=s[u[i]%36]}
  catch(e){for(var j=0;j<12;j++)a+=s[Math.floor(Math.random()*36)]}
  return a}
var sid;try{sid=sessionStorage.getItem('h3l_sid');if(!sid){sid=rnd();sessionStorage.setItem('h3l_sid',sid)}}catch(e){sid=rnd()}
var pvid=rnd();
function lang(){var l='';try{l=localStorage.getItem('h3l_lang')||''}catch(e){}
  if(LANGS.indexOf(l)<0)l=(document.documentElement.lang||'').slice(0,2);
  return LANGS.indexOf(l)>=0?l:'es'}
function dev(){var w=Math.min(screen.width||innerWidth,innerWidth||9999);return w<600?'movil':(w<1024?'tablet':'escritorio')}
function refHost(){try{if(!document.referrer)return '';var h=new URL(document.referrer).hostname.replace(/^www\./,'');
  return h===location.hostname.replace(/^www\./,'')?'':h.slice(0,80)}catch(e){return ''}}

var queue=[],seen={},timer=null;
function add(ev,once){
  if(once){var k=ev.t+'|'+(ev.k||'')+'|'+(ev.s||'');if(seen[k])return;seen[k]=1}
  if(team)ev.i=1;
  ev.sid=sid;ev.pv=pvid;ev.l=lang();ev.p=location.pathname.slice(0,120);
  queue.push(ev);
  if(!timer)timer=setTimeout(flush,1500);
}
function send(body){
  try{if(navigator.sendBeacon&&navigator.sendBeacon(EP,new Blob([body],{type:'application/json'})))return}catch(e){}
  try{fetch(EP,{method:'POST',body:body,headers:{'Content-Type':'application/json'},keepalive:true,credentials:'omit'}).catch(function(){})}catch(e){}
}
function flush(){
  if(timer){clearTimeout(timer);timer=null}
  while(queue.length){var chunk=queue.splice(0,10);send(JSON.stringify({events:chunk}))}
}

/* ---- tiempo activo: segundos con la pestaña visible y con actividad (o con un video reproduciéndose) ---- */
var active=0,lastAct=Date.now(),lastSent=-1,vsecs={},vsent={};
['mousemove','scroll','keydown','touchstart','click','pointerdown','wheel'].forEach(function(n){
  window.addEventListener(n,function(){lastAct=Date.now()},{passive:true,capture:true})});
function svcOf(v){var a=v.closest&&v.closest('article.svc');return a&&a.id?a.id.replace(/^svc-/,''):''}
setInterval(function(){
  if(document.visibilityState!=='visible')return;
  var vids=document.querySelectorAll('.svc-video'),playing=false;
  for(var i=0;i<vids.length;i++){var v=vids[i];
    if(!v.paused&&!v.ended&&v.readyState>2){playing=true;var s=svcOf(v);if(s)vsecs[s]=(vsecs[s]||0)+1}}
  if(playing)lastAct=Date.now();
  if(Date.now()-lastAct<30000)active++;
},1000);
function pushTimes(){
  if(active>0&&active!==lastSent){lastSent=active;add({t:'eng',n:active})}
  for(var s in vsecs){if(vsecs[s]!==vsent[s]){vsent[s]=vsecs[s];add({t:'vsec',s:s,n:vsecs[s]})}}
}
setInterval(function(){if(document.visibilityState==='visible'){pushTimes();flush()}},30000);
document.addEventListener('visibilitychange',function(){if(document.visibilityState==='hidden'){pushTimes();flush()}});
window.addEventListener('pagehide',function(){pushTimes();flush()});

/* ---- vista de página ---- */
function pageview(){add({t:'pv',ref:refHost(),dev:dev()})}
if(document.readyState==='complete')setTimeout(pageview,300);
else window.addEventListener('load',function(){setTimeout(pageview,300)});

/* ---- secciones del sitio principal (cambian con la clase "active" sin recargar la página) ---- */
function watchSections(){
  var secs=document.querySelectorAll('.section');if(!secs.length||!window.MutationObserver)return;
  function rep(el){if(el.classList.contains('active')&&el.id)add({t:'sec',k:el.id.replace(/^section-/,'').slice(0,30)},true)}
  var mo=new MutationObserver(function(ms){ms.forEach(function(m){rep(m.target)})});
  secs.forEach(function(el){mo.observe(el,{attributes:true,attributeFilter:['class']});rep(el)});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(watchSections,50)});
else setTimeout(watchSections,50);

/* ---- videos de servicios: reproducción (por clic o automática al hacer scroll), finalización ---- */
var lastManual={s:'',t:0};
document.addEventListener('play',function(e){
  var v=e.target;if(!v.classList||!v.classList.contains('svc-video'))return;
  var s=svcOf(v);if(!s)return;
  var manual=lastManual.s===s&&Date.now()-lastManual.t<2000;
  add({t:'vplay',s:s,k:manual?'manual':'auto'},true);
},true);
document.addEventListener('ended',function(e){
  var v=e.target;if(!v.classList||!v.classList.contains('svc-video'))return;
  var s=svcOf(v);if(s)add({t:'vend',s:s},true);
},true);

/* ---- clics ---- */
document.addEventListener('click',function(e){
  var t=e.target;if(!t||!t.closest)return;
  var el,s;
  if((el=t.closest('.svc-play'))){s=el.getAttribute('data-svc')||svcOf(el);lastManual={s:s,t:Date.now()};add({t:'vclick',k:'play',s:s},true);return}
  if((el=t.closest('.svc-fs'))){s=svcOf(el);lastManual={s:s,t:Date.now()};add({t:'vclick',k:'fullscreen',s:s},true);return}
  if((el=t.closest('.svc-snd'))){s=svcOf(el);lastManual={s:s,t:Date.now()};add({t:'vclick',k:'sound',s:s},true);return}
  if((el=t.closest('[data-quote]'))){add({t:'click',k:'quote',s:svcOf(el)},true);return}
  if((el=t.closest('[data-go]'))){add({t:'click',k:'more',s:svcOf(el)},true);return}
  if((el=t.closest('a[href]'))){
    var h=el.getAttribute('href')||'';
    if(/Brochure_/i.test(h))add({t:'click',k:'brochure'},true);
    else if(/^mailto:/i.test(h))add({t:'click',k:'mailto'},true);
    else if(/^tel:/i.test(h))add({t:'click',k:'tel'},true);
    else if(/linkedin\.com/i.test(h))add({t:'click',k:'linkedin'},true);
    else{var g=/[?&]go=([a-z0-9-]+)/i.exec(h);if(g)add({t:'click',k:'go:'+g[1].toLowerCase().slice(0,24)},true)}
    return}
  if(t.closest('#h3c-btn'))add({t:'click',k:'chat_open'},true);
  else if(t.closest('#btnSkip'))add({t:'click',k:'intro_skip'},true);
  else if((el=t.closest('button[onclick]'))&&/enviarContacto/.test(el.getAttribute('onclick')||''))add({t:'click',k:'contact_send'},true);
},true);
})();
