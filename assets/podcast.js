/* Resumen en audio de las noticias (podcast). Lee data/news.json (las mismas notas reales del apartado Noticias)
   y las lee en voz alta con la voz del navegador (speechSynthesis). No es un archivo de audio grabado ni inventa texto:
   solo dice fuente, fecha y titular de cada nota. Titulares en su idioma original (es/en). Sin scripts en linea (CSP). */
(function(){
'use strict';
var TX={
 es:{btn:'Escuchar resumen',pause:'Pausar',resume:'Seguir',stop:'Detener',intro:'Resumen de noticias de petróleo y gas de H3L, al {d}. Son {n} notas.',note:'Nota {i}. {s}, {d}.',end:'Fin del resumen. Los enlaces a cada nota están en la lista de noticias.',skip:'{k} notas más están en otro idioma y todavía no tienen traducción; las encontrás en la lista.',unsup:'Tu navegador no permite audio de voz.',lbl:'Resumen en audio: lectura de los titulares reales de las noticias, con la voz del navegador.',playing:'Reproduciendo: nota {i} de {n}',err:'No se pudieron cargar las noticias.'},
 en:{btn:'Listen to summary',pause:'Pause',resume:'Resume',stop:'Stop',intro:'H3L oil and gas news summary, as of {d}. {n} stories.',note:'Story {i}. {s}, {d}.',end:'End of the summary. Links to each story are in the news list.',skip:'{k} more stories are in another language and have no translation yet; you can find them in the list.',unsup:'Your browser does not support speech audio.',lbl:'Audio summary: reads the real headlines of the news items aloud, using the browser voice.',playing:'Playing: story {i} of {n}',err:'The news could not be loaded.'},
 fr:{btn:'Écouter le résumé',pause:'Pause',resume:'Reprendre',stop:'Arrêter',intro:'Résumé des actualités pétrole et gaz de H3L, au {d}. {n} articles.',note:'Article {i}. {s}, {d}.',end:'Fin du résumé. Les liens vers chaque article figurent dans la liste des actualités.',skip:'{k} autres articles sont dans une autre langue et ne sont pas encore traduits ; ils figurent dans la liste.',unsup:'Votre navigateur ne prend pas en charge la synthèse vocale.',lbl:'Résumé audio : lecture des vrais titres des actualités, avec la voix du navigateur.',playing:'Lecture : article {i} sur {n}',err:'Impossible de charger les actualités.'},
 pt:{btn:'Ouvir resumo',pause:'Pausar',resume:'Continuar',stop:'Parar',intro:'Resumo de notícias de petróleo e gás da H3L, em {d}. São {n} notas.',note:'Nota {i}. {s}, {d}.',end:'Fim do resumo. Os links de cada nota estão na lista de notícias.',skip:'{k} outras notas estão em outro idioma e ainda não têm tradução; elas estão na lista.',unsup:'Seu navegador não suporta áudio de voz.',lbl:'Resumo em áudio: leitura dos títulos reais das notícias, com a voz do navegador.',playing:'Reproduzindo: nota {i} de {n}',err:'Não foi possível carregar as notícias.'}
};
var LOC={es:'es-AR',en:'en-US',fr:'fr-FR',pt:'pt-BR'};
var MON={es:['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'],en:['January','February','March','April','May','June','July','August','September','October','November','December'],fr:['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'],pt:['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro']};
/* cifras con punto de miles a palabras (40.000 = cuarenta mil) para que la voz las diga bien */
var numEs=(function(){var U=['cero','uno','dos','tres','cuatro','cinco','seis','siete','ocho','nueve','diez','once','doce','trece','catorce','quince','dieciséis','diecisiete','dieciocho','diecinueve','veinte','veintiuno','veintidós','veintitrés','veinticuatro','veinticinco','veintiséis','veintisiete','veintiocho','veintinueve'],T=['','','','treinta','cuarenta','cincuenta','sesenta','setenta','ochenta','noventa'],H=['','ciento','doscientos','trescientos','cuatrocientos','quinientos','seiscientos','setecientos','ochocientos','novecientos'];
function ap(x){return x.replace(/veintiuno$/,'veintiún').replace(/uno$/,'un')}
function w(n){if(n<30)return U[n];if(n<100)return T[Math.floor(n/10)]+(n%10?' y '+U[n%10]:'');if(n<1000)return n===100?'cien':H[Math.floor(n/100)]+(n%100?' '+w(n%100):'');if(n<1e6){var m=Math.floor(n/1e3),r=n%1e3;return(m===1?'mil':ap(w(m))+' mil')+(r?' '+w(r):'')}var M=Math.floor(n/1e6),q=n%1e6;return(M===1?'un millón':ap(w(M))+' millones')+(q?' '+w(q):'')}
return function(t){return String(t).replace(/(?<![\d.,])\d{1,3}(?:\.\d{3})+(?!\d|,\d)/g,function(m){return w(parseInt(m.replace(/\./g,''),10))})}})();
/* dicción: cómo se dicen siglas y símbolos en cada idioma (YPF en español se dice "i pe efe", no "i griega") */
var PRON={es:[[/\bYPF\b/g,'i pe efe'],[/u\$s\s*([\d.,]+)\s*millones/gi,'$1 millones de dólares'],[/U\$S|US\$/g,'dólares'],[/\bGNL\b/g,'gas natural licuado'],[/\bUSD\b/g,'dólares'],[/(?<![\d.,])\d{1,3}(?:\.\d{3})+(?!\d|,\d)/g,numEs]],
 en:[[/\bYPFs\b/g,'Y P Fs'],[/\bYPF\b/g,'Y P F']],fr:[[/\bYPF\b/g,'i grec pé èf']],pt:[[/\bYPF\b/g,'i pê éfe']]};
function pron(x,l){var r=PRON[l]||[];for(var i=0;i<r.length;i++)x=x.replace(r[i][0],r[i][1]);return x.replace(/\.com\b/gi,'')}
var ES_SRC=/lmneuquen|infobae|cronista|r[ií]o negro|cuyo|mejor energ|clar[ií]n|p[aá]gina|ámbito|ambito|econom|energ[ií]a/i;
var EN_SRC=/journal|reuters|bloomberg|offshore|world oil|rigzone|upstream/i;
var items=null,idx=0,state='idle',lang='es',skipped=0;
function $(i){return document.getElementById(i)}
function t(k,o){var s=(TX[lang]||TX.es)[k]||TX.es[k];if(o)for(var x in o)s=s.replace('{'+x+'}',o[x]);return s}
function dstr(iso,l){var p=String(iso||'').split('-');if(p.length<3)return iso||'';var m=(MON[l]||MON.es)[+p[1]-1],d=+p[2];
  if(l==='en')return m+' '+d;if(l==='pt')return d+' de '+m;if(l==='fr')return d+(d===1?'er ':' ')+m;return d+' de '+m}
function tlang(it){var s=it.source||'';if(ES_SRC.test(s)&&!EN_SRC.test(s))return 'es';if(EN_SRC.test(s))return 'en';
  return /\b(the|to|of|and|for|in|on|at|with)\b/i.test(it.title)?'en':'es'}
function ui(){var c=$('pod-ctl');if(!c)return;
  $('pod-play').textContent=state==='playing'?t('pause'):(state==='paused'?t('resume'):t('btn'));
  $('pod-stop').hidden=state==='idle';$('pod-stop').textContent=t('stop');
  $('pod-note').textContent=state==='idle'?t('lbl'):t('playing',{i:Math.min(idx,items?items.length:0),n:items?items.length:0})}
/* voz: se prefiere una voz natural/neuronal/mejorada del dispositivo y la variante regional; se evitan las voces robóticas */
function vscore(v,l){var n=(v.name||'')+' '+(v.voiceURI||''),sc=0,lc=(v.lang||'').toLowerCase().replace('_','-');
  if(lc===LOC[l].toLowerCase())sc+=30;else if(lc.indexOf(l)===0)sc+=15;else return -1;
  if(/natural|neural|online|premium|enhanced|mejorada|siri|google|wavenet|studio/i.test(n))sc+=40;
  if(/compact|espeak|robot|novelty|zarvox|trinoids|whisper|bells|bad news|good news|cellos|organ|boing|bubbles|albert|jester|superstar|wobble/i.test(n))sc-=60;
  if(v.localService===false&&/google|online|natural/i.test(n))sc+=5;return sc}
function voice(l){var vs=window.speechSynthesis.getVoices()||[],best=null,bs=-1;
  vs.forEach(function(v){var x=vscore(v,l);if(x>bs){bs=x;best=v}});return best}
/* ritmo: algo más lento que lo normal y con pausas para poder retener cada noticia */
var RATE=0.9,PAUSE_NOTE=1100,PAUSE_HEAD=450,PAUSE_PART=350;
function pieces(txt){var m=String(txt).match(/(?:[^,;:.]|[.,](?=\d))+[,;:.]?\s*/g)||[txt],out=[],cur='';m.forEach(function(x){if(cur&&(cur+x).length>90){out.push(cur);cur=x}else cur+=x});if(cur)out.push(cur);return out.map(function(x){return x.trim()}).filter(Boolean)}
function say(txt,l,done,gap){var parts=pieces(pron(txt,l)),k=0;
  (function next(){if(state==='idle')return;if(k>=parts.length){setTimeout(function(){if(state!=='idle')done()},gap==null?0:gap);return}
    var u=new SpeechSynthesisUtterance(parts[k++]);u.lang=LOC[l];var v=voice(l);if(v)u.voice=v;u.rate=RATE;u.pitch=1;
    u.onend=function(){if(k<parts.length&&state!=='idle')setTimeout(next,PAUSE_PART);else next()};
    u.onerror=function(){if(state!=='idle')next()};window.speechSynthesis.speak(u)})()}
function step(n){
  if(state==='idle')return;
  if(n===-1){say(t('intro',{d:dstr(items[0]&&items[0].date,lang),n:items.length}),lang,function(){step(0)},PAUSE_NOTE);return}
  if(n>=items.length){say(t('end'),lang,function(){if(skipped>0)say(t('skip',{k:skipped}),lang,stop);else stop()},500);return}
  idx=n+1;ui();var it=items[n];
  say(t('note',{i:n+1,s:it.source||'',d:dstr(it.date,lang)}),lang,function(){
    if(state==='idle')return;say(it.say,lang,function(){step(n+1)},PAUSE_NOTE)},PAUSE_HEAD)}
function stop(){state='idle';idx=0;try{window.speechSynthesis.cancel()}catch(e){}ui()}
function get(u){return fetch(u,{cache:'no-cache'}).then(function(r){if(!r.ok)throw 0;return r.json()})}
/* todo se dice en el idioma de la interfaz: se usa la traducción de data/news-i18n.json; sin traducción y en otro idioma, la nota no se lee */
function prep(list,tr){var out=[];skipped=0;list.forEach(function(it){var m=(tr&&tr[it.title])||{},x=m[lang]||(tlang(it)===lang?it.title:null);
  if(x)out.push({source:it.source,date:it.date,say:x});else skipped++});return out}
function start(){
  if(!('speechSynthesis' in window)){$('pod-note').textContent=t('unsup');return}
  var L=lang;
  Promise.all([get('data/news.json'),get('data/news-i18n.json').catch(function(){return {items:{}}})]).then(function(r){
    if(L!==lang)return;items=prep((r[0].items||[]).slice(0,10),r[1].items);if(!items.length)throw 0;state='playing';idx=0;window.speechSynthesis.cancel();ui();step(-1)
  }).catch(function(){$('pod-note').textContent=t('err')})}
function click(){
  if(state==='idle')return start();
  if(state==='playing'){state='paused';window.speechSynthesis.pause()}else{state='playing';window.speechSynthesis.resume()}ui()}
function init(){
  var b=$('pod-play');if(!b)return;
  b.addEventListener('click',click);$('pod-stop').addEventListener('click',stop);
  window.addEventListener('pagehide',stop);
  var cur=(window.H3LSite&&H3LSite.lang&&H3LSite.lang())||'es';lang=TX[cur]?cur:'es';ui();
  if(window.H3LSite&&H3LSite.onLang)H3LSite.onLang(function(l){var was=state!=='idle';if(was)stop();lang=TX[l]?l:'es';ui()});
  if('speechSynthesis' in window&&speechSynthesis.addEventListener)speechSynthesis.addEventListener('voiceschanged',function(){});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
