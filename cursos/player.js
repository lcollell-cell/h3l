/* H3L · Cursos · reproductor de lecciones narradas (voz del navegador, subtítulos, transcripción, retroceso, notas, evaluaciones, certificado) */
(function(){'use strict';var HC=window.HC,HW=window.HW,$=HC.$,$$=HC.$$,esc=HC.esc,el=HC.el;
var params=new URLSearchParams(location.search),cid=params.get('c')||'geo';
var C,META,flat,CS,li=0,ci=0,elapsed=0,playing=false,waiting=false,speed=1,ttsOn=true,ccOn=true,voices=[],voice=null,tok=0,timer=null,wd=null,starts=[],total=0,answered={},lastSceneKey='',saveT=null;
var stage=$('#stage'),SS=window.speechSynthesis,hasTTS=!!(SS&&window.SpeechSynthesisUtterance);
function ls(k,v){try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){}return null}
/* ---------- carga ---------- */
HC.langSelect($('#lang'));
Promise.all([HC.loadCatalog(),HC.loadCourse(cid)]).then(function(r){META=r[0].courses.filter(function(x){return x.id===cid})[0]||{title:r[1].title,color:'#17755A'};C=r[1];CS=HC.cs(cid);flat=HC.flat(C);
  document.title=(META.title||C.title)+' — Cursos Online H3L';$('#ctitle').textContent=META.title||C.title;$('#csub').textContent=C.subtitle||META.short||'';
  var want=params.get('l'),i=flat.findIndex(function(l){return l.id===want});if(i<0&&CS.last&&CS.last.li<flat.length)i=CS.last.li;if(i<0)i=0;
  initVoices();buildTabs();buildSide();bindControls();HC.apply();loadLesson(i,i===(CS.last&&CS.last.li)?CS.last.ci:0,false)}).catch(function(e){$('#ctitle').textContent='No se pudo cargar el curso';console.error(e)});
HC.onlang=function(){HC.apply();buildTabs();buildSide();updateUI()};
/* ---------- voces ---------- */
function initVoices(){if(!hasTTS){ttsOn=false;return}
  function load(){voices=SS.getVoices().filter(function(v){return /^es/i.test(v.lang)});var sel=$('#sVoice');sel.innerHTML='';
    voices.sort(function(a,b){var o=['es-AR','es-MX','es-US','es-ES'];var x=o.indexOf(a.lang),y=o.indexOf(b.lang);return(x<0?9:x)-(y<0?9:y)});
    voices.forEach(function(v,i){var o=el('option',{value:i},v.name+' ('+v.lang+')');sel.appendChild(o)});
    var saved=ls('h3l-cursos-voice'),ix=voices.findIndex(function(v){return v.name===saved});if(ix<0)ix=0;if(voices.length){sel.value=ix;voice=voices[ix]}else{voice=null;ttsOn=false}
    sel.style.display=voices.length?'':'none';updateUI()}
  load();if(SS.onvoiceschanged!==undefined)SS.onvoiceschanged=load}
/* ---------- tiempos ---------- */
function calc(){var L=flat[li];starts=[];total=0;L.cues.forEach(function(c){starts.push(total);total+=HC.cueDur(c)})}
function absT(){return starts[ci]+Math.min(elapsed,HC.cueDur(flat[li].cues[ci]))}
function cueAt(t){var i,n=starts.length;for(i=n-1;i>=0;i--)if(t>=starts[i])return i;return 0}
/* ---------- lección ---------- */
function loadLesson(i,c0,autoplay){stopSpeech();li=i;ci=0;elapsed=0;waiting=false;playing=false;answered={};lastSceneKey='';calc();
  var L=flat[li],r=CS.l[L.id]||(CS.l[L.id]={});if(r.cp)Object.keys(r.cp).forEach(function(k){answered[k]=1});
  try{var u=new URL(location.href);u.searchParams.set('l',L.id);history.replaceState(null,'',u.toString())}catch(e){}
  buildTranscript();drawMarkers();c0=Math.min(c0||0,L.cues.length-1);setCue(c0,false);showBig(true);updateUI();highlightSide();if(autoplay)play()}
function setCue(i,speak){ci=i;elapsed=0;waiting=false;var L=flat[li],c=L.cues[i];renderScene(c);
  var r=CS.l[L.id]||(CS.l[L.id]={});r.pos=i;CS.last={li:li,ci:i};scheduleSave();
  $('#cc').innerHTML=ccOn?'<span>'+esc(c.say)+'</span>':'';markTranscript();updateUI();
  if(c.q&&!answered[i])showCheckpoint(c,i);else hideCheckpoint();
  if(speak)speakCue()}
function scheduleSave(){clearTimeout(saveT);saveT=setTimeout(HC.save,400)}
/* ---------- escenas ---------- */
function mount(html){stage.querySelectorAll('.scene,.cp').forEach(function(n){if(n.id!=='cc')n.remove()});if(wd){wd=null}var d=el('div','');d.innerHTML=html;var s=d.firstElementChild;stage.insertBefore(s,stage.firstChild);return s}
function ensureCC(){if(!$('#cc',stage)){var d=el('div',{class:'cc',id:'cc','aria-hidden':'true'});stage.appendChild(d)}}
function renderScene(c){ensureCC();var L=flat[li],j=ci,s;while(j>=0&&!L.cues[j].scene)j--;s=j>=0?L.cues[j].scene:null;var key=li+':'+j,fresh=false;
  if(s&&key!==lastSceneKey){lastSceneKey=key;fresh=true;var node=null,t=s.t;
    if(t==='bin')node=mount('<div class="scene bump-in"><div class="logo"><img src="../LOGO_H3L.png" alt="H3L"></div><span class="pill" style="align-self:flex-start">CURSO H3L</span><h4>'+esc(C.title)+'</h4><div class="qs"><div class="qt">Preguntas que respondemos</div><ul id="qs">'+C.intro.questions.map(function(q,i){return '<li data-i="'+i+'"><i>'+(i+1)+'</i>'+esc(q)+'</li>'}).join('')+'</ul></div></div>');
    else if(t==='star')node=mount('<div class="scene"><div class="kick">Metodología STAR · '+esc(C.intro.star.caso)+'</div><h4>Aplicación a un caso real</h4><div class="star" id="star">'+[['S','Situación',C.intro.star.S],['T','Tarea',C.intro.star.T],['A','Acción',C.intro.star.A],['R','Resultado',C.intro.star.R]].map(function(x,i){return '<div data-i="'+i+'"><b>'+x[0]+' · '+x[1].toUpperCase()+'</b>'+esc(x[2])+'</div>'}).join('')+'</div></div>');
    else if(t==='bout')node=mount('<div class="scene bump-out"><div class="l"><img src="../LOGO_H3L.png" alt="H3L Global Energy"></div><div class="r"><span class="pill" style="align-self:flex-start">H3L Global Energy</span><h4>'+esc(C.outro.phrase)+'</h4><p>Consultoría en Oil &amp; Gas y transición energética.</p><div class="ct">info@h3lglobalenergy.com<br>www.h3lglobalenergy.com</div></div></div>');
    else if(t==='can')node=mount('<div class="scene"><div class="kick">'+esc(s.k||'')+'</div><h4>'+esc(s.h||'')+'…</h4><ul id="bl">'+s.items.map(function(x,i){return '<li data-i="'+i+'"><i>✓</i>'+esc(x)+'</li>'}).join('')+'</ul></div>');
    else if(t==='seen'){var cs=HC.cs(C.id);node=mount('<div class="scene"><div class="kick">Resumen del curso</div><h4>Ítems vistos</h4><div class="seen">'+C.modules.map(function(m){return '<div><b>'+esc(m.title)+'</b><ul>'+m.lessons.map(function(l){var d=cs.l[l.id]&&cs.l[l.id].d,q=cs.q[m.id]&&cs.q[m.id].best>=70;return '<li class="'+(d?'ok':'')+'">'+esc(l.title)+'</li>'}).join('')+'<li class="'+((cs.q[m.id]&&cs.q[m.id].best>=70)?'ok':'')+'">Quiz del módulo</li></ul></div>'}).join('')+'</div></div>')}
    else if(t==='bul')node=mount('<div class="scene"><div class="kick">'+esc(s.k||C.title)+'</div><h4>'+esc(s.h||'')+'</h4><ul id="bl">'+s.items.map(function(x,i){return '<li data-i="'+i+'"><i>'+(i+1)+'</i>'+esc(x)+'</li>'}).join('')+'</ul></div>');
    else if(t==='fm')node=mount('<div class="scene"><div class="kick">'+esc(s.k||'Concepto clave')+'</div><h4>'+esc(s.h||'')+'</h4><div class="fm">'+esc(s.f).replace(/\n/g,'<br>')+'</div>'+(s.n?'<div class="nt">'+esc(s.n)+'</div>':'')+'</div>');
    else if(t==='tbl')node=mount('<div class="scene"><div class="kick">'+esc(s.k||'Comparativo')+'</div><h4>'+esc(s.h||'')+'</h4><table><thead><tr>'+s.cols.map(function(x){return '<th>'+esc(x)+'</th>'}).join('')+'</tr></thead><tbody>'+s.rows.map(function(r){return '<tr>'+r.map(function(x){return '<td>'+esc(x)+'</td>'}).join('')+'</tr>'}).join('')+'</tbody></table>'+(s.n?'<div class="nt">'+esc(s.n)+'</div>':'')+'</div>');
    else if(t==='case')node=mount('<div class="scene"><div class="kick">Caso real · '+esc(s.src||'')+'</div><h4>'+esc(s.h||'')+'</h4><div class="star" id="star">'+[['S','Situación',s.S],['T','Tarea',s.T],['A','Acción',s.A],['R','Resultado',s.R]].map(function(x,i){return '<div data-i="'+i+'"><b>'+x[0]+' · '+x[1].toUpperCase()+'</b>'+esc(x[2])+'</div>'}).join('')+'</div></div>');
    else if(t==='viz'){node=mount('<div class="scene"><div class="kick">'+esc(s.k||'Laboratorio interactivo')+'</div><h4>'+esc(s.h||'')+'</h4><div id="wdbox" style="flex:1;min-height:0;display:flex;flex-direction:column"></div></div>');
      var box=$('#wdbox',node);var h=el('div','');h.style.cssText='flex:1;min-height:0;display:grid';box.appendChild(h);wd=HW.build(s.w,h,s.p,{touch:function(){var r=CS.l[flat[li].id];if(r&&!r.lab){r.lab=1;scheduleSave()}}})}
    /* cada escena de bullets etc. entra con animación; el título del curso persiste */
    stage.dataset.k=t}
  applyHl(c,fresh)}
function applyHl(c,fresh){if(c.hl===undefined&&!fresh)return;var hl=c.hl;
  ['qs','bl','star'].forEach(function(id){var u=$('#'+id,stage);if(!u)return;$$('[data-i]',u).forEach(function(li_){var i=+li_.getAttribute('data-i');if(hl==null){li_.style.visibility='visible';li_.classList.remove('hl')}else{li_.style.visibility=i<=hl?'visible':'hidden';li_.classList.toggle('hl',i===hl)}})});
  if(wd&&wd.onCue&&(c.hl!=null||fresh))wd.onCue(c.hl!=null?c:{hl:null})}
/* ---------- checkpoint ---------- */
function showCheckpoint(c,i){hideCheckpoint();var q=c.q,d=el('div',{class:'cp',id:'cpbox'});var h='<h4>'+HC.t('cp_t')+'</h4><div class="q"><p class="t">'+esc(q.q)+'</p>'+q.o.map(function(o,k){return '<label><input type="radio" name="cp" value="'+k+'"><span>'+esc(o)+'</span></label>'}).join('')+'<div class="ex" hidden></div></div><div class="tools"><button class="btn g s" id="cpGo" hidden>'+HC.t('cp_go')+' ▶</button></div>';d.innerHTML=h;stage.appendChild(d);
  $$('input',d).forEach(function(inp){inp.addEventListener('change',function(){var k=+inp.value,ex=$('.ex',d),qq=$('.q',d),lab=inp.parentNode;ex.hidden=false;
    if(k===q.a){qq.className='q ok';lab.classList.add('sel');ex.textContent=HC.t('cp_ok')+'. '+q.e;$$('input',d).forEach(function(x){x.disabled=true});answered[i]=1;var r=CS.l[flat[li].id];(r.cp||(r.cp={}))[i]=1;scheduleSave();$('#cpGo').hidden=false;$('#cpGo').focus()}
    else{qq.className='q no';lab.classList.add('sel');ex.textContent=HC.t('cp_no')+q.e;inp.disabled=true}})});
  $('#cpGo',d).addEventListener('click',function(){hideCheckpoint();if(waiting||playing){waiting=false;next()}})}
function hideCheckpoint(){var d=$('#cpbox');if(d)d.remove()}
/* ---------- reproducción ---------- */
function stopSpeech(){tok++;if(hasTTS)try{SS.cancel()}catch(e){}clearInterval(timer);timer=null}
function speakCue(){stopSpeech();var L=flat[li],c=L.cues[ci],my=tok;
  timer=setInterval(function(){if(!playing||waiting)return;elapsed+=.2*speed;if(elapsed>HC.cueDur(c)*(ttsOn&&voice?1.5:1)&&!(ttsOn&&voice)){cueEnd(my)}tickUI()},200);
  if(ttsOn&&voice){var u=new SpeechSynthesisUtterance(c.tts||c.say);u.voice=voice;u.lang=voice.lang;u.rate=Math.min(2,speed);u.onend=function(){if(tok===my)cueEnd(my)};u.onerror=function(e){if(tok===my&&e.error!=='interrupted'&&e.error!=='canceled'){ttsOn=false;updateUI()}};
    try{SS.speak(u)}catch(e){ttsOn=false}
    /* respaldo por si el navegador no dispara onend */
    setTimeout(function(){if(tok===my&&playing&&!waiting&&elapsed>HC.cueDur(c)*1.4)cueEnd(my)},HC.cueDur(c)*1500/speed+4000)}}
function cueEnd(my){if(my!==tok||!playing)return;var c=flat[li].cues[ci];clearInterval(timer);timer=null;
  if(c.q&&!answered[ci]){waiting=true;updateUI();return}
  if(c.lab){waiting=true;updateUI();return}
  next()}
function next(){if(ci<flat[li].cues.length-1)setCue(ci+1,true);else lessonEnd()}
function lessonEnd(){var L=flat[li],cues=L.cues,i;for(i=0;i<cues.length;i++)if(cues[i].q&&!answered[i]){playing=true;setCue(i,true);return}
  stopSpeech();playing=false;waiting=false;var r=CS.l[L.id]||(CS.l[L.id]={});r.d=1;r.pos=0;HC.save();updateUI();buildSide();showEnd();if(li<flat.length)buildTabsRefresh()}
function play(){if(!flat)return;hideBig();playing=true;var c=flat[li].cues[ci];if(waiting){updateUI();return}if(c.q&&!answered[ci]&&!$('#cpbox'))showCheckpoint(c,ci);speakCue();updateUI()}
function pause(){playing=false;stopSpeech();updateUI()}
function toggle(){playing?pause():play()}
function seek(t,keep){t=Math.max(0,Math.min(total-.1,t));var i=cueAt(t),was=playing;stopSpeech();playing=was;setCue(i,false);elapsed=t-starts[i];if(was&&!waiting)speakCue();else updateUI();tickUI()}
function go(n){if(n<0||n>=flat.length)return;loadLesson(n,0,true)}
/* ---------- UI del reproductor ---------- */
function bindControls(){
  $('#bPlay').addEventListener('click',toggle);$('#bB').addEventListener('click',function(){seek(absT()-10)});$('#bF').addEventListener('click',function(){seek(absT()+10)});
  $('#bPrev').addEventListener('click',function(){if(ci>0&&elapsed>2||ci>0)seek(starts[Math.max(0,ci-(elapsed>3?0:1))]);else go(li-1)});$('#bNext').addEventListener('click',function(){if(ci<flat[li].cues.length-1)seek(starts[ci+1]);else{var L=flat[li];lessonEnd()}});
  $('#sSpeed').addEventListener('change',function(e){speed=+e.target.value;ls('h3l-cursos-speed',speed);if(playing&&!waiting)speakCue()});var sp=ls('h3l-cursos-speed');if(sp){speed=+sp;$('#sSpeed').value=sp}
  $('#sVoice').addEventListener('change',function(e){voice=voices[+e.target.value];if(voice)ls('h3l-cursos-voice',voice.name);ttsOn=true;if(playing&&!waiting)speakCue()});
  $('#bSnd').addEventListener('click',function(){ttsOn=!ttsOn&&!!voice;if(playing&&!waiting)speakCue();else stopSpeech();updateUI()});
  $('#bCc').addEventListener('click',function(){ccOn=!ccOn;$('#cc').innerHTML=ccOn?'<span>'+esc(flat[li].cues[ci].say)+'</span>':'';updateUI()});
  var tl=$('#tl');function pos(e){var r=tl.getBoundingClientRect();return Math.max(0,Math.min(1,((e.touches?e.touches[0].clientX:e.clientX)-r.left)/r.width))}
  var drag=false;tl.addEventListener('pointerdown',function(e){drag=true;tl.setPointerCapture&&tl.setPointerCapture(e.pointerId);seek(pos(e)*total)});tl.addEventListener('pointermove',function(e){if(drag)seek(pos(e)*total)});tl.addEventListener('pointerup',function(){drag=false});
  tl.addEventListener('keydown',function(e){if(e.key==='ArrowRight'){seek(absT()+10);e.preventDefault()}if(e.key==='ArrowLeft'){seek(absT()-10);e.preventDefault()}});
  document.addEventListener('keydown',function(e){var t=e.target.tagName;if(t==='INPUT'||t==='TEXTAREA'||t==='SELECT'||t==='BUTTON'&&e.key===' ')return;
    if(e.key===' '){toggle();e.preventDefault()}else if(e.key==='ArrowLeft'){seek(absT()-10)}else if(e.key==='ArrowRight'){seek(absT()+10)}else if(e.key==='c'||e.key==='C'){$('#bCc').click()}else if(e.key==='Escape'){var m=$('#modal');if(!m.hidden)closeModal()}});
  document.addEventListener('visibilitychange',function(){if(document.hidden&&playing)pause()});window.addEventListener('pagehide',function(){stopSpeech();HC.save()})}
function showBig(first){hideBig();var b=el('div',{class:'big',id:'big'},'<button aria-label="'+HC.t('play')+'">'+HC.ico.play+'</button>');b.addEventListener('click',function(){play()});stage.appendChild(b)}
function hideBig(){var b=$('#big');if(b)b.remove();var e=$('#endbox');if(e)e.remove()}
function showEnd(){hideBig();var L=flat[li],nx=flat[li+1],d=el('div',{class:'big',id:'endbox'});var done=CS.l[L.id]&&CS.l[L.id].d;
  d.innerHTML='<div style="text-align:center;color:#fff;padding:20px"><div class="pill" style="margin-bottom:12px">'+HC.t('lesson_done')+' ✓</div>'+(nx?'<div style="font:700 16px var(--font);margin-bottom:14px">'+HC.t('up_next')+': '+esc(nx.title)+'</div><button class="btn g" id="eNext">'+HC.t('next')+' ▶</button> ':'<div style="margin-bottom:14px">'+HC.t('tab_ce')+'</div><button class="btn g" id="eCert">'+HC.t('tab_ce')+'</button> ')+'<button class="btn o" id="eRe">↺ '+HC.t('review')+'</button></div>';
  stage.appendChild(d);var n=$('#eNext');if(n)n.addEventListener('click',function(){go(li+1)});var c=$('#eCert');if(c)c.addEventListener('click',function(){selectTab('ce');$('#tabs').scrollIntoView({behavior:'smooth'})});$('#eRe').addEventListener('click',function(){loadLesson(li,0,true)})}
function updateUI(){if(!flat)return;var b=$('#bPlay');b.innerHTML=playing&&!waiting?HC.ico.pause:HC.ico.play;b.title=HC.t(playing&&!waiting?'pause':'play');
  $('#bSnd').innerHTML=(ttsOn&&voice)?HC.ico.snd:HC.ico.mute;$('#bSnd').classList.toggle('on',!!(ttsOn&&voice));$('#bSnd').title=(ttsOn&&voice)?HC.t('voice'):HC.t('nosound');$('#bCc').classList.toggle('on',ccOn);$('#bB').innerHTML=HC.ico.b10;$('#bF').innerHTML=HC.ico.f10;$('#bPrev').innerHTML=HC.ico.prev;$('#bNext').innerHTML=HC.ico.next;
  var c=flat[li].cues[ci],pl=$('#plab');if(pl)pl.remove();
  if(waiting&&c.lab){var d=el('div',{class:'pause-lab',id:'plab'},'<button class="btn g s">'+HC.t('cont')+'</button>');d.firstChild.addEventListener('click',function(){waiting=false;d.remove();next()});stage.appendChild(d);d.title=HC.t('lab')}
  tickUI()}
function tickUI(){if(!flat)return;var t=absT(),pc=total?t/total*100:0;$('#tlf').style.width=pc+'%';$('#tlt').style.left=pc+'%';$('#tl').setAttribute('aria-valuenow',Math.round(pc));$('#tm').textContent=HC.fmt(t)+' / '+HC.fmt(total);markTranscript(true)}
function drawMarkers(){var m=$('#tlm');m.innerHTML='';starts.forEach(function(s,i){if(i){var d=el('div',{class:'mk'});d.style.left=(s/total*100)+'%';m.appendChild(d)}})}
/* ---------- transcripción ---------- */
function buildTranscript(){var box=$('#txList');if(!box)return;var L=flat[li];box.innerHTML='';L.cues.forEach(function(c,i){var b=el('button',{type:'button','data-i':i},'<b>'+HC.fmt(starts[i])+'</b><span>'+esc(c.say)+'</span>');b.addEventListener('click',function(){seek(starts[i]);if(!playing)showBig()});box.appendChild(b)});$('#txTitle').textContent=L.title;markTranscript()}
function markTranscript(soft){var box=$('#txList');if(!box)return;$$('button',box).forEach(function(b){b.classList.toggle('cur',+b.getAttribute('data-i')===ci)});if(!soft){var cur=$('button.cur',box);if(cur&&box.offsetParent&&!$('#txQ').value)box.scrollTop=cur.offsetTop-box.offsetTop-60}}
function txtOf(L,withTime){return L.title+'\n'+L.cues.map(function(c,i){var t=0;for(var k=0;k<i;k++)t+=HC.cueDur(L.cues[k]);return(withTime?'['+HC.fmt(t)+'] ':'')+c.say}).join('\n')}
function dl(name,text,type){var a=el('a');a.href=URL.createObjectURL(new Blob([text],{type:type||'text/plain;charset=utf-8'}));a.download=name;document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},500)}
/* ---------- pestañas ---------- */
var TABS=['ov','tr','nt','fl','rf','cm','ce'],curTab='ov';
function buildTabs(){var t=$('#tabs');t.innerHTML='';TABS.forEach(function(k){var b=el('button',{role:'tab','aria-selected':k===curTab,'data-k':k},HC.t('tab_'+k));b.addEventListener('click',function(){selectTab(k)});t.appendChild(b)});
  var p=$('#panes');p.innerHTML='';TABS.forEach(function(k){var d=el('div',{class:'pane',id:'p_'+k,role:'tabpanel'});d.hidden=k!==curTab;p.appendChild(d)});
  paneOv();paneTr();paneNt();paneFl();paneRf();paneCm();paneCe();if(flat&&starts.length){buildTranscript()}}
function buildTabsRefresh(){paneCm();paneCe();paneFl()}
function selectTab(k){curTab=k;$$('#tabs button').forEach(function(b){b.setAttribute('aria-selected',b.getAttribute('data-k')===k)});TABS.forEach(function(x){$('#p_'+x).hidden=x!==k});if(k==='cm')paneCm();if(k==='ce')paneCe();if(k==='nt')paneNt()}
function paneOv(){var p=$('#p_ov'),nl=HC.lessonsOnly(C).length;p.innerHTML='<h3>'+esc(C.title)+'</h3><p>'+esc(C.desc||'')+'</p><h3 style="margin-top:16px">Objetivos de aprendizaje</h3><ul>'+(C.objectives||[]).map(function(o){return '<li>'+esc(o)+'</li>'}).join('')+'</ul><h3 style="margin-top:16px">Qué incluye</h3><ul><li>'+nl+' lecciones narradas + presentación y cierre (≈ '+Math.round(C.totalSec/60)+' min de narración)</li><li>Laboratorios interactivos y mapas: '+esc((C.labs||[]).join(' · '))+'</li><li>'+(C.downloads||[]).length+' planilla(s) Excel de práctica con fórmulas vivas</li><li>'+C.modules.length+' quizzes de módulo, preguntas rápidas en las lecciones y examen final</li><li>Certificado H3L verificable y publicable en LinkedIn</li></ul><h3 style="margin-top:16px">Herramientas de estudio</h3><ul><li>Pausa, retroceso/avance de 10 s, línea de tiempo con capítulos y velocidad de 0,75× a 2×</li><li>Subtítulos y transcripción sincronizada con búsqueda, copia, impresión y descarga</li><li>Notas con marca de tiempo; teclado: espacio = pausa, ← → = ±10 s, C = subtítulos</li></ul><p class="note-s" style="margin-top:12px">'+esc(HC.t('demo'))+'</p>'}
function paneTr(){var p=$('#p_tr');p.innerHTML='<h3 id="txTitle"></h3><div class="tools"><input type="search" id="txQ" placeholder="'+esc(HC.t('srch'))+'" aria-label="'+esc(HC.t('srch'))+'"><button class="btn o s" id="txCopy">'+HC.t('copy')+'</button><button class="btn o s" id="txDl">'+HC.t('dl_tx')+' (lección)</button><button class="btn o s" id="txDlAll">'+HC.t('dl_tx')+' (curso)</button><button class="btn o s" id="txPr">'+HC.t('print')+'</button></div><div class="tx" id="txList" role="list"></div>';
  $('#txQ').addEventListener('input',function(){var q=this.value.trim().toLowerCase();$$('#txList button').forEach(function(b){var s=$('span',b),raw=flat[li].cues[+b.getAttribute('data-i')].say;if(!q){b.style.display='';s.innerHTML=esc(raw);return}var ok=raw.toLowerCase().indexOf(q)>=0;b.style.display=ok?'':'none';if(ok){var i=raw.toLowerCase().indexOf(q);s.innerHTML=esc(raw.slice(0,i))+'<mark>'+esc(raw.slice(i,i+q.length))+'</mark>'+esc(raw.slice(i+q.length))}})});
  $('#txCopy').addEventListener('click',function(){var t=txtOf(flat[li],true);if(navigator.clipboard)navigator.clipboard.writeText(t).then(function(){$('#txCopy').textContent=HC.t('copied')});setTimeout(function(){$('#txCopy').textContent=HC.t('copy')},1500)});
  $('#txDl').addEventListener('click',function(){dl(cid+'_'+flat[li].id+'_transcripcion.txt',txtOf(flat[li],true))});
  $('#txDlAll').addEventListener('click',function(){dl(cid+'_transcripcion_curso.txt',C.title+'\nH3L Global Energy · Cursos Online\n\n'+flat.map(function(L){return txtOf(L,true)}).join('\n\n'))});
  $('#txPr').addEventListener('click',function(){window.print()})}
function paneNt(){var p=$('#p_nt'),notes=CS.n||(CS.n=[]);p.innerHTML='<h3>'+HC.t('tab_nt')+'</h3><div class="field"><textarea id="ntT" rows="3" placeholder="'+esc(HC.t('note_ph'))+'" style="font:500 13.5px var(--font);padding:10px;border:1px solid var(--line);border-radius:8px"></textarea></div><div class="tools"><button class="btn g s" id="ntAdd">'+HC.t('add_note')+'</button><button class="btn o s" id="ntDl">'+HC.t('dl_nt')+'</button></div><div id="ntL"></div>';
  function list(){var box=$('#ntL');box.innerHTML=notes.length?'':'<p class="note-s" style="margin-top:10px">'+HC.t('nonotes')+'</p>';notes.forEach(function(n,i){var L=flat&&flat.filter(function(x){return x.id===n.l})[0],d=el('div',{class:'note'},'<div><b data-i="'+i+'">'+esc(L?L.title:n.l)+' · '+HC.fmt(n.t)+'</b>'+esc(n.x)+'</div><button class="btn o s" data-d="'+i+'">'+HC.t('del')+'</button>');box.appendChild(d)});
    $$('b[data-i]',box).forEach(function(b){b.addEventListener('click',function(){var n=notes[+b.getAttribute('data-i')],k=flat.findIndex(function(x){return x.id===n.l});if(k>=0){loadLesson(k,0,false);seek(n.t);showBig()}})});
    $$('button[data-d]',box).forEach(function(b){b.addEventListener('click',function(){notes.splice(+b.getAttribute('data-d'),1);HC.save();list()})})}
  $('#ntAdd').addEventListener('click',function(){var v=$('#ntT').value.trim();if(!v)return;notes.push({l:flat[li].id,t:Math.round(absT()),x:v});HC.save();$('#ntT').value='';list()});
  $('#ntDl').addEventListener('click',function(){dl(cid+'_notas.md','# Notas · '+C.title+'\n\n'+notes.map(function(n){var L=flat.filter(function(x){return x.id===n.l})[0];return '- **'+(L?L.title:n.l)+' ['+HC.fmt(n.t)+']** '+n.x}).join('\n'),'text/markdown;charset=utf-8')});list()}
function paneFl(){var p=$('#p_fl'),x=CS.x||(CS.x={});p.innerHTML='<h3>'+HC.t('files')+'</h3><p class="note-s" style="margin-bottom:8px">'+esc(HC.t('demo'))+'</p>'+(C.downloads||[]).map(function(d,i){return '<div class="dl" style="padding:12px 0">'+HC.ico.file+'<div><b>'+esc(d.title)+'</b><span>'+esc(d.desc)+'</span>'+(d.task?'<span style="display:block;margin-top:4px"><strong>Ejercicio:</strong> '+esc(d.task)+'</span>':'')+'</div><a class="btn g s" href="'+esc(d.file)+'" download>'+HC.t('xl_get')+'</a><button class="btn o s" data-x="'+i+'">'+HC.t(x[d.file]?'xl_dn':'xl_done')+'</button></div>'}).join('');
  $$('button[data-x]',p).forEach(function(b){b.addEventListener('click',function(){var d=C.downloads[+b.getAttribute('data-x')];x[d.file]=x[d.file]?0:1;HC.save();paneFl();paneCm();buildSide()})})}
function paneRf(){var p=$('#p_rf');p.innerHTML='<h3>'+HC.t('tab_rf')+'</h3><p class="note-s" style="margin-bottom:10px">'+esc(HC.t('refs_p'))+'</p><h3 style="margin-top:6px">Casos reales</h3><ul class="refs">'+(C.cases||[]).map(function(c){return '<li><span class="tg">Caso</span><strong>'+esc(c.title)+'</strong> — '+esc(c.text)+' <em>('+esc(c.src)+')</em></li>'}).join('')+'</ul><h3 style="margin-top:14px">Bibliografía y estándares</h3><ul class="refs">'+(C.refs||[]).map(function(r){return '<li><span class="tg">'+esc(r.tag)+'</span>'+esc(r.cite)+(r.why?' — <em>'+esc(r.why)+'</em>':'')+'</li>'}).join('')+'</ul>'}
function levels(comp){var lessons=comp.lessons,cs=CS,all=lessons.every(function(id){return cs.l[id]&&cs.l[id].d});var cpOk=lessons.every(function(id){var L=flat.filter(function(x){return x.id===id})[0];if(!L)return true;return L.cues.every(function(c,i){return !c.q||(cs.l[id]&&cs.l[id].cp&&cs.l[id].cp[i])})});
  var lab=lessons.some(function(id){return cs.l[id]&&cs.l[id].lab})||lessons.every(function(id){var L=flat.filter(function(x){return x.id===id})[0];return L&&!L.cues.some(function(c){return c.scene&&c.scene.t==='viz'})}),xl=Object.keys(cs.x||{}).some(function(k){return cs.x[k]});
  var mods=C.modules.filter(function(m){return m.lessons.some(function(l){return lessons.indexOf(l.id)>=0})}),q=mods.every(function(m){return cs.q[m.id]&&cs.q[m.id].best>=70}),ex=cs.e&&cs.e.best>=85;
  var lv=0;if(all)lv=1;if(lv===1&&cpOk)lv=2;if(lv===2&&lab&&xl)lv=3;if(lv===3&&q)lv=4;if(lv===4&&ex)lv=5;return lv}
function paneCm(){var p=$('#p_cm'),h='<h3>'+HC.t('tab_cm')+'</h3><p class="note-s" style="margin-bottom:10px">'+esc(HC.t('cm_p'))+'</p><div class="cm"><table><thead><tr><th>'+HC.t('cm_c')+'</th>'+[1,2,3,4,5].map(function(i){return '<th>'+i+' · '+HC.t('lv'+i)+'</th>'}).join('')+'</tr></thead><tbody>';
  (C.competencies||[]).forEach(function(c){var lv=flat?levels(c):0;h+='<tr><td>'+esc(c.name)+'</td>'+[1,2,3,4,5].map(function(i){return '<td><i class="'+(i<=lv?'f':'')+'"></i></td>'}).join('')+'</tr>'});
  p.innerHTML=h+'</tbody></table></div><p class="note-s" style="margin-top:10px">Esquema de 5 niveles de dominio: conocer → aprender → aplicar → transferir → transformar. Las competencias del curso se basan en un mapa de competencias técnicas de exploración y producción (geología, reservorios, producción, perforación).</p>'}
/* ---------- lateral ---------- */
function buildSide(){if(!flat)return;var s=$('#side'),pg=HC.progress(C),i0=0;var h='<div class="ph"><b>'+HC.t('content')+'</b><div class="bar" style="margin:10px 0 4px"><i style="width:'+pg.pct+'%"></i></div><span class="note-s">'+HC.t('prog')+': '+pg.pct+' % · '+HC.t('lbl_ls')+' '+pg.lessons+'/'+pg.lessonsTotal+' · '+HC.t('lbl_qz')+' '+pg.quizzes+'/'+pg.quizzesTotal+' · '+HC.t('lbl_ex')+' '+(pg.exam?'✓':'–')+'</span></div>';
  function les(L,i,mn){var d=CS.l[L.id]&&CS.l[L.id].d;return '<button class="les'+(d?' done':'')+(i===li?' act':'')+'" data-li="'+i+'"><span class="ic">'+(d?'✓':'')+'</span><span>'+esc(L.title)+'<span class="mn">'+Math.max(1,Math.round(L.dur/60))+' '+HC.t('min')+'</span></span></button>'}
  h+='<div class="mod"><h3>'+esc(C.intro.title||'Presentación')+'</h3>'+les(flat[0],0)+'</div>';i0=1;
  C.modules.forEach(function(m){var qs=CS.q[m.id],all=m.lessons.every(function(l){return CS.l[l.id]&&CS.l[l.id].d});h+='<div class="mod"><h3>'+esc(m.title)+'<small>'+m.lessons.length+' '+HC.t('lessons')+'</small></h3>';m.lessons.forEach(function(l){h+=les(l,flat.findIndex(function(x){return x.id===l.id}))});
    h+='<div class="qz"><span>'+HC.t('quiz_m')+' · '+m.quiz.length+' preg.</span>'+(qs?'<em>'+qs.best+' %'+(qs.best>=70?' ✓':'')+'</em>':'')+'<button class="btn o s" data-q="'+m.id+'"'+(all?'':' disabled title="'+esc(HC.t('q_lock'))+'"')+'>'+HC.t('q_start')+'</button></div></div>'});
  var ready=pg.allLessons&&pg.allQuizzes;h+='<div class="mod"><h3>'+HC.t('exam')+'</h3><div class="qz"><span>'+C.exam.length+' preg. · 70 %</span>'+(CS.e?'<em>'+CS.e.best+' %'+(CS.e.best>=70?' ✓':'')+'</em>':'')+'<button class="btn o s" data-q="exam"'+(ready?'':' disabled title="'+esc(HC.t('exam_lock'))+'"')+'>'+HC.t('q_start')+'</button></div></div>';
  h+='<div class="mod"><h3>'+esc(C.outro.title||'Cierre')+'</h3>'+les(flat[flat.length-1],flat.length-1)+'</div>';
  h+='<div class="mod"><h3>'+HC.t('files')+'</h3>'+(C.downloads||[]).map(function(d){return '<div class="dl">'+HC.ico.file+'<div><b>'+esc(d.title)+'</b><span>'+esc(d.desc)+'</span></div><a class="btn o s" href="'+esc(d.file)+'" download>↓</a></div>'}).join('')+'</div>';
  s.innerHTML=h;$$('.les',s).forEach(function(b){b.addEventListener('click',function(){go(+b.getAttribute('data-li'))})});$$('[data-q]',s).forEach(function(b){b.addEventListener('click',function(){openQuiz(b.getAttribute('data-q'))})})}
function highlightSide(){$$('#side .les').forEach(function(b){b.classList.toggle('act',+b.getAttribute('data-li')===li)})}
/* ---------- evaluaciones ---------- */
function closeModal(){$('#modal').hidden=true;document.body.style.overflow=''}
function openQuiz(id){var isEx=id==='exam',m=isEx?null:C.modules.filter(function(x){return x.id===id})[0],qs=isEx?C.exam:m.quiz,title=isEx?HC.t('exam'):HC.t('quiz_m')+': '+m.title;pause();
  var box=$('#mbox'),modal=$('#modal');modal.hidden=false;document.body.style.overflow='hidden';
  function paint(done){box.innerHTML='<h3>'+esc(title)+'</h3><div class="sub">'+qs.length+' preguntas · mínimo 70 %</div><div id="qbody"></div><div class="tools" style="margin-top:10px"><button class="btn g" id="qSend">'+HC.t('q_send')+'</button><button class="btn o" id="qClose">'+HC.t('q_close')+'</button></div>';
    $('#qbody').innerHTML=qs.map(function(q,i){return '<div class="q" data-i="'+i+'"><p class="t">'+(i+1)+'. '+esc(q.q)+'</p>'+q.o.map(function(o,k){return '<label data-k="'+k+'"><input type="radio" name="q'+i+'" value="'+k+'"><span>'+esc(o)+'</span></label>'}).join('')+'<div class="ex" hidden></div></div>'}).join('');
    $('#qClose').addEventListener('click',closeModal);$('#qSend').addEventListener('click',function(){var n=0,sc=0,ans=[];qs.forEach(function(q,i){var v=$('input[name=q'+i+']:checked',box);ans.push(v?+v.value:-1)});if(ans.some(function(a){return a<0})){alert(HC.t('answer_all'));return}
      qs.forEach(function(q,i){var qq=$('.q[data-i="'+i+'"]',box),ok=ans[i]===q.a;if(ok)sc++;qq.className='q '+(ok?'ok':'no');$$('label',qq).forEach(function(l){var k=+l.getAttribute('data-k');l.querySelector('input').disabled=true;if(k===ans[i])l.classList.add('sel');if(k===q.a)l.classList.add('cor')});var ex=$('.ex',qq);ex.hidden=false;ex.textContent=q.e});
      var pct=Math.round(sc/qs.length*100),pass=pct>=70;var res=el('div',{class:'res '+(pass?'p':'f')},HC.t('score')+': '+pct+' % ('+sc+'/'+qs.length+') — '+(pass?HC.t('q_pass')+' ✓':HC.t('q_fail')));box.insertBefore(res,$('#qbody'));res.scrollIntoView({block:'center'});
      if(isEx){var e=CS.e||(CS.e={best:0,att:0});e.att++;if(pct>e.best){e.best=pct;e.at=new Date().toISOString().slice(0,10)}}else{var q=CS.q[id]||(CS.q[id]={best:0,att:0});q.att++;if(pct>q.best)q.best=pct}HC.save();buildSide();paneCm();paneCe();
      $('#qSend').textContent=HC.t('q_retry');$('#qSend').replaceWith($('#qSend').cloneNode(true));$('#qSend').addEventListener('click',function(){paint()})})}
  paint()}
$('#modal').addEventListener('click',function(e){if(e.target===this)closeModal()});
/* ---------- certificado ---------- */
function paneCe(){var p=$('#p_ce'),pg=HC.progress(C);if(!pg.cert){p.innerHTML='<h3>'+HC.t('cert_h')+'</h3><p>'+esc(HC.t('cert_lock'))+'</p><ul><li>'+HC.t('lbl_ls')+': '+pg.lessons+'/'+pg.lessonsTotal+'</li><li>'+HC.t('lbl_qz')+': '+pg.quizzes+'/'+pg.quizzesTotal+'</li><li>'+HC.t('lbl_ex')+': '+(pg.exam?'✓':'–')+'</li></ul>';return}
  var keep=p.querySelector('canvas');if(keep&&p.dataset.done==='1')return;
  p.innerHTML='<h3>'+HC.t('cert_h')+'</h3><p>'+esc(HC.t('cert_p'))+'</p><div class="field"><label for="cName">'+HC.t('cert_name')+'</label><input id="cName" type="text" maxlength="70" value="'+esc(HC.getName())+'" autocomplete="name"></div><div class="tools"><button class="btn g" id="cGen">'+HC.t('cert_gen')+'</button></div><div class="certbox" id="cBox" hidden><canvas id="cCan" aria-label="Certificado"></canvas><div class="tools"><button class="btn" id="cPng">'+HC.t('cert_png')+'</button><a class="btn g" id="cLi" target="_blank" rel="noopener noreferrer">'+HC.t('cert_li')+'</a><a class="btn o" id="cSh" target="_blank" rel="noopener noreferrer">'+HC.t('cert_sh')+'</a></div><div class="field"><label>'+HC.t('cert_url')+'</label><input id="cUrl" type="text" readonly></div><p class="note-s">'+esc(HC.t('cert_note'))+'</p></div>';
  $('#cGen').addEventListener('click',function(){var n=HC.cert.norm($('#cName').value);if(n.length<3){$('#cName').focus();return}HC.setName(n);var e=CS.e,d={n:n,c:cid,d:(CS.certDate=CS.certDate||new Date().toISOString().slice(0,10)),s:e.best,h:HC.hrs(C)};HC.save();
    HC.cert.code(d).then(function(code){return HC.cert.draw($('#cCan'),d,META.title||C.title,code,C.modules.map(function(m){return m.title})).then(function(){$('#cBox').hidden=false;$('#cLi').href=HC.cert.linkedin(d,META.title||C.title,code);$('#cSh').href=HC.cert.share(d,META.title||C.title,code);$('#cUrl').value=HC.cert.verifyUrl(d,code);
      $('#cPng').onclick=function(){$('#cCan').toBlob(function(b){var a=el('a');a.href=URL.createObjectURL(b);a.download='Certificado_H3L_'+cid+'.png';document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},500)})};p.dataset.done='1'})})})}
HC.player={load:function(i,c){loadLesson(i,c||0,false)},cue:function(i){setCue(i,false)},flat:function(){return flat},seek:seek,play:play,pause:pause};
})();
