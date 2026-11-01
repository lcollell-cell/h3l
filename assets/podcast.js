/* Resumen en audio de las noticias (podcast). Lee data/news.json (las mismas notas reales del apartado Noticias)
   y las lee en voz alta con la voz del navegador (speechSynthesis). No es un archivo de audio grabado ni inventa texto:
   solo dice fuente, fecha y titular de cada nota. Titulares en su idioma original (es/en). Sin scripts en linea (CSP). */
(function(){
'use strict';
var TX={
 es:{btn:'Escuchar resumen',pause:'Pausar',resume:'Seguir',stop:'Detener',intro:'Resumen de noticias de petróleo y gas de H3L, al {d}. Son {n} notas.',note:'Nota {i}. {s}, {d}.',end:'Fin del resumen. Los enlaces a cada nota están en la lista de noticias.',unsup:'Tu navegador no permite audio de voz.',lbl:'Resumen en audio: lectura de los titulares reales de las noticias, con la voz del navegador.',playing:'Reproduciendo: nota {i} de {n}',err:'No se pudieron cargar las noticias.'},
 en:{btn:'Listen to summary',pause:'Pause',resume:'Resume',stop:'Stop',intro:'H3L oil and gas news summary, as of {d}. {n} stories.',note:'Story {i}. {s}, {d}.',end:'End of the summary. Links to each story are in the news list.',unsup:'Your browser does not support speech audio.',lbl:'Audio summary: reads the real headlines of the news items aloud, using the browser voice.',playing:'Playing: story {i} of {n}',err:'The news could not be loaded.'},
 fr:{btn:'Écouter le résumé',pause:'Pause',resume:'Reprendre',stop:'Arrêter',intro:'Résumé des actualités pétrole et gaz de H3L, au {d}. {n} articles.',note:'Article {i}. {s}, {d}.',end:'Fin du résumé. Les liens vers chaque article figurent dans la liste des actualités.',unsup:'Votre navigateur ne prend pas en charge la synthèse vocale.',lbl:'Résumé audio : lecture des vrais titres des actualités, avec la voix du navigateur.',playing:'Lecture : article {i} sur {n}',err:'Impossible de charger les actualités.'},
 pt:{btn:'Ouvir resumo',pause:'Pausar',resume:'Continuar',stop:'Parar',intro:'Resumo de notícias de petróleo e gás da H3L, em {d}. São {n} notas.',note:'Nota {i}. {s}, {d}.',end:'Fim do resumo. Os links de cada nota estão na lista de notícias.',unsup:'Seu navegador não suporta áudio de voz.',lbl:'Resumo em áudio: leitura dos títulos reais das notícias, com a voz do navegador.',playing:'Reproduzindo: nota {i} de {n}',err:'Não foi possível carregar as notícias.'}
};
var LOC={es:'es-AR',en:'en-US',fr:'fr-FR',pt:'pt-BR'};
var MON={es:['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'],en:['January','February','March','April','May','June','July','August','September','October','November','December'],fr:['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'],pt:['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro']};
var ES_SRC=/lmneuquen|infobae|cronista|r[ií]o negro|cuyo|mejor energ|clar[ií]n|p[aá]gina|ámbito|ambito|econom|energ[ií]a/i;
var EN_SRC=/journal|reuters|bloomberg|offshore|world oil|rigzone|upstream/i;
var items=null,idx=0,state='idle',lang='es';
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
function voice(l){var vs=window.speechSynthesis.getVoices()||[],pre=l;
  for(var i=0;i<vs.length;i++)if(vs[i].lang&&vs[i].lang.toLowerCase()===LOC[l].toLowerCase())return vs[i];
  for(var j=0;j<vs.length;j++)if(vs[j].lang&&vs[j].lang.toLowerCase().indexOf(pre)===0)return vs[j];return null}
function say(txt,l,done){var u=new SpeechSynthesisUtterance(txt);u.lang=LOC[l];var v=voice(l);if(v)u.voice=v;u.rate=1;
  u.onend=done;u.onerror=function(e){if(state!=='idle')done()};window.speechSynthesis.speak(u)}
function step(n){
  if(state==='idle')return;
  if(n===-1){say(t('intro',{d:dstr(items[0]&&items[0].date,lang),n:items.length}),lang,function(){step(0)});return}
  if(n>=items.length){say(t('end'),lang,function(){stop()});return}
  idx=n+1;ui();var it=items[n];
  say(t('note',{i:n+1,s:it.source||'',d:dstr(it.date,lang)}),lang,function(){
    if(state==='idle')return;say(it.title,tlang(it),function(){step(n+1)})})}
function stop(){state='idle';idx=0;try{window.speechSynthesis.cancel()}catch(e){}ui()}
function start(){
  if(!('speechSynthesis' in window)){$('pod-note').textContent=t('unsup');return}
  fetch('data/news.json',{cache:'no-cache'}).then(function(r){if(!r.ok)throw 0;return r.json()}).then(function(d){
    items=(d.items||[]).slice(0,10);if(!items.length)throw 0;state='playing';idx=0;window.speechSynthesis.cancel();ui();step(-1)
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
