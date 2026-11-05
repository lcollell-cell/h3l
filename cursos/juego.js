(function(){'use strict';var HC=window.HC,$=HC.$,esc=HC.esc;
/* Juego de campo H3L: ruleta + preguntas + casos STAR. Contenido en data/juego.json (español); interfaz en 4 idiomas. */
var CATS=['geo','res','rsv','per','prod','mon','eco','hse','sup','pmi'],COL={sup:'#5f7a2e',pmi:'#5b6778',geo:'#7c5a3a',res:'#3f5f9c',rsv:'#2f6b57',per:'#5d5486',prod:'#a0522d',mon:'#2f7d8f',eco:'#9a7b2f',hse:'#9b3a34',caso:'#1B2944'};
var NEED=2,SECS=45,LIVES=3,KEY='h3l-juego';
var TX={
es:{h:'Juego de campo H3L',p:'Lanza la aguja del manómetro, responde y resuelve casos de campo. Reúne la medalla de las 10 especialidades sin quedarte sin vidas.',how:'Cómo se juega',how1:'Cada especialidad pide {n} respuestas correctas para ganar su medalla.',how2:'Tienes 3 vidas y {s} segundos por pregunta. Las teclas 1 a 4 eligen la respuesta.',how3:'En «Caso de campo» eliges una acción con la metodología STAR (Situación, Tarea, Acción, Resultado) y el juego te muestra el resultado.',lv:'Nivel',lvb:'Básico',lvi:'Intermedio',lvm:'Mixto',go:'Jugar',l2go:'Pasar al nivel 2',l2h:'Nivel 2: experto',l2p:'Preguntas de nivel intermedio-difícil con opciones muy parecidas. Conservas tu puntaje y vuelves a tener 3 vidas.',win2:'¡Dominaste el nivel 2!',l2tag:'Nivel 2',l3go:'Pasar al nivel Principal',l3h:'Nivel Principal: máxima exigencia',l3p:'Casos de decisión con varias respuestas casi correctas, cifras y excepciones. Conservas tu puntaje y vuelves a tener 3 vidas.',win3:'¡Dominaste el nivel Principal!',l3tag:'Principal',launch:'Lanzar la aguja',mode:'Modo de juego',mg:'Manómetro',mc:'Cartas',nocourse:'Aún no hay un curso de esta especialidad en el catálogo.',spin:'Mezclar las cartas',spinning:'Mezclando…',pickc:'Elige una carta',deckh:'Estas son las cartas en juego ({n}). Mézclalas y elige una sin ver.',lives:'Vidas',score:'Puntos',streak:'Racha',medals:'Medallas',pw:'Comodines',p50:'50/50',pt:'+15 s',ps:'Saltar',time:'Tiempo',ok:'¡Correcto!',bad:'Incorrecto',late:'Se acabó el tiempo',next:'Siguiente',case_:'Caso de campo',S:'Situación',T:'Tarea',A:'Acción',R:'Resultado',pick:'Elige tu acción',best:'Mejor decisión',fair:'Aceptable',poor:'Mala decisión',eff:'Efecto estimado',e_p:'Producción',e_c:'Costo',e_k:'Riesgo',rule:'Regla del oficio',others:'¿Qué habría pasado con las otras acciones?',hide:'Ocultar',win:'¡Completaste las 10 medallas!',over:'Fin del juego',sum:'Resumen',acc:'Aciertos por especialidad',rein:'Para reforzar',rein0:'¡Sin áreas débiles! Buen trabajo.',again:'Jugar de nuevo',best_s:'Mejor puntaje',games:'Partidas',ex:'Los casos y las cifras son ejemplos didácticos, no datos de campos reales, y no nombran empresas. Las reglas del oficio son criterios generales: en un campo real siempre se validan con los datos propios.',lang:'Contenido del juego en español; interfaz en 4 idiomas.',err:'No se pudo cargar el juego. Prueba de nuevo.',cat:{geo:'Geociencias',res:'Yacimientos',rsv:'Reservas',per:'Perforación',prod:'Producción',mon:'Monitoreo y curvas',eco:'Economía',hse:'Seguridad y transición',sup:'Instalaciones de superficie',pmi:'Proyectos (PMI)',caso:'Caso de campo'},up:'ptos',lvl:{1:'Básico',2:'Intermedio',3:'Nivel 2',4:'Principal'},ans:'Respuesta correcta',lost:'−1 vida',gain:'+1 vida',pts:'puntos'},
en:{h:'H3L Field Game',p:'Launch the gauge needle, answer and solve field cases. Collect the medal of all 10 specialties without running out of lives.',how:'How to play',how1:'Each specialty needs {n} correct answers to earn its medal.',how2:'You have 3 lives and {s} seconds per question. Keys 1 to 4 pick the answer.',how3:'In "Field case" you choose an action using the STAR method (Situation, Task, Action, Result) and the game shows the result.',lv:'Level',lvb:'Basic',lvi:'Intermediate',lvm:'Mixed',go:'Play',l2go:'Go to level 2',l2h:'Level 2: expert',l2p:'Intermediate-to-hard questions with very similar options. You keep your score and get 3 lives again.',win2:'You mastered level 2!',l2tag:'Level 2',l3go:'Go to Principal level',l3h:'Principal level: maximum difficulty',l3p:'Decision questions with several nearly correct answers, figures and exceptions. You keep your score and get 3 lives again.',win3:'You mastered the Principal level!',l3tag:'Principal',launch:'Launch the needle',mode:'Game mode',mg:'Pressure gauge',mc:'Cards',nocourse:'There is no course on this specialty in the catalog yet.',spin:'Shuffle the cards',spinning:'Shuffling…',pickc:'Pick a card',deckh:'These are the cards in play ({n}). Shuffle them and pick one blind.',lives:'Lives',score:'Score',streak:'Streak',medals:'Medals',pw:'Lifelines',p50:'50/50',pt:'+15 s',ps:'Skip',time:'Time',ok:'Correct!',bad:'Incorrect',late:'Time is up',next:'Next',case_:'Field case',S:'Situation',T:'Task',A:'Action',R:'Result',pick:'Choose your action',best:'Best decision',fair:'Acceptable',poor:'Poor decision',eff:'Estimated effect',e_p:'Production',e_c:'Cost',e_k:'Risk',rule:'Rule of thumb',others:'What would have happened with the other actions?',hide:'Hide',win:'You completed all 10 medals!',over:'Game over',sum:'Summary',acc:'Accuracy by specialty',rein:'To review',rein0:'No weak areas! Well done.',again:'Play again',best_s:'Best score',games:'Games',ex:'Cases and figures are teaching examples, not data from real fields, and name no companies. Rules of thumb are general criteria: in a real field they are always checked against your own data.',lang:'Game content is in Spanish; interface in 4 languages.',err:'The game could not be loaded. Please try again.',cat:{geo:'Geoscience',res:'Reservoirs',rsv:'Reserves',per:'Drilling',prod:'Production',mon:'Monitoring and curves',eco:'Economics',hse:'Safety and transition',sup:'Surface facilities',pmi:'Projects (PMI)',caso:'Field case'},up:'pts',lvl:{1:'Basic',2:'Intermediate',3:'Level 2',4:'Principal'},ans:'Correct answer',lost:'−1 life',gain:'+1 life',pts:'points'},
fr:{h:'Jeu de terrain H3L',p:'Lancez l\'aiguille du manomètre, répondez et résolvez des cas de terrain. Réunissez la médaille des 10 spécialités sans perdre toutes vos vies.',how:'Comment jouer',how1:'Chaque spécialité demande {n} bonnes réponses pour gagner sa médaille.',how2:'Vous avez 3 vies et {s} secondes par question. Les touches 1 à 4 choisissent la réponse.',how3:'Dans « Cas de terrain », vous choisissez une action avec la méthode STAR (Situation, Tâche, Action, Résultat) et le jeu montre le résultat.',lv:'Niveau',lvb:'Basique',lvi:'Intermédiaire',lvm:'Mixte',go:'Jouer',l2go:'Passer au niveau 2',l2h:'Niveau 2 : expert',l2p:'Questions de niveau intermédiaire à difficile aux options très proches. Vous gardez votre score et retrouvez 3 vies.',win2:'Vous avez maîtrisé le niveau 2 !',l2tag:'Niveau 2',l3go:'Passer au niveau Principal',l3h:'Niveau Principal : exigence maximale',l3p:'Questions de décision avec plusieurs réponses presque correctes, chiffres et exceptions. Vous gardez votre score et retrouvez 3 vies.',win3:'Vous avez maîtrisé le niveau Principal !',l3tag:'Principal',launch:'Lancer l\'aiguille',mode:'Mode de jeu',mg:'Manomètre',mc:'Cartes',nocourse:'Pas encore de cours sur cette spécialité dans le catalogue.',spin:'Mélanger les cartes',spinning:'Mélange…',pickc:'Choisissez une carte',deckh:'Voici les cartes en jeu ({n}). Mélangez-les et choisissez-en une sans voir.',lives:'Vies',score:'Points',streak:'Série',medals:'Médailles',pw:'Jokers',p50:'50/50',pt:'+15 s',ps:'Passer',time:'Temps',ok:'Correct !',bad:'Incorrect',late:'Temps écoulé',next:'Suivant',case_:'Cas de terrain',S:'Situation',T:'Tâche',A:'Action',R:'Résultat',pick:'Choisissez votre action',best:'Meilleure décision',fair:'Acceptable',poor:'Mauvaise décision',eff:'Effet estimé',e_p:'Production',e_c:'Coût',e_k:'Risque',rule:'Règle du métier',others:'Que se serait-il passé avec les autres actions ?',hide:'Masquer',win:'Vous avez les 10 médailles !',over:'Fin de la partie',sum:'Résumé',acc:'Réussite par spécialité',rein:'À revoir',rein0:'Aucun point faible ! Bravo.',again:'Rejouer',best_s:'Meilleur score',games:'Parties',ex:'Les cas et les chiffres sont des exemples pédagogiques, pas des données de champs réels, et ne citent aucune entreprise. Les règles du métier sont des critères généraux : sur un champ réel, on les vérifie toujours avec ses propres données.',lang:'Contenu du jeu en espagnol ; interface en 4 langues.',err:'Impossible de charger le jeu. Réessayez.',cat:{geo:'Géosciences',res:'Réservoirs',rsv:'Réserves',per:'Forage',prod:'Production',mon:'Suivi et courbes',eco:'Économie',hse:'Sécurité et transition',sup:'Installations de surface',pmi:'Projets (PMI)',caso:'Cas de terrain'},up:'pts',lvl:{1:'Basique',2:'Intermédiaire',3:'Niveau 2',4:'Principal'},ans:'Bonne réponse',lost:'−1 vie',gain:'+1 vie',pts:'points'},
pt:{h:'Jogo de campo H3L',p:'Lance a agulha do manômetro, responda e resolva casos de campo. Reúna a medalha das 10 especialidades sem ficar sem vidas.',how:'Como jogar',how1:'Cada especialidade exige {n} respostas corretas para ganhar sua medalha.',how2:'Você tem 3 vidas e {s} segundos por pergunta. As teclas 1 a 4 escolhem a resposta.',how3:'Em «Caso de campo» você escolhe uma ação com a metodologia STAR (Situação, Tarefa, Ação, Resultado) e o jogo mostra o resultado.',lv:'Nível',lvb:'Básico',lvi:'Intermediário',lvm:'Misto',go:'Jogar',l2go:'Passar para o nível 2',l2h:'Nível 2: especialista',l2p:'Perguntas de nível intermediário a difícil com opções muito parecidas. Você mantém sua pontuação e volta a ter 3 vidas.',win2:'Você dominou o nível 2!',l2tag:'Nível 2',l3go:'Passar ao nível Principal',l3h:'Nível Principal: máxima exigência',l3p:'Questões de decisão com várias respostas quase corretas, números e exceções. Você mantém a pontuação e volta a ter 3 vidas.',win3:'Você dominou o nível Principal!',l3tag:'Principal',launch:'Lançar a agulha',mode:'Modo de jogo',mg:'Manômetro',mc:'Cartas',nocourse:'Ainda não há curso desta especialidade no catálogo.',spin:'Embaralhar as cartas',spinning:'Embaralhando…',pickc:'Escolha uma carta',deckh:'Estas são as cartas em jogo ({n}). Embaralhe e escolha uma sem ver.',lives:'Vidas',score:'Pontos',streak:'Sequência',medals:'Medalhas',pw:'Coringas',p50:'50/50',pt:'+15 s',ps:'Pular',time:'Tempo',ok:'Correto!',bad:'Incorreto',late:'Tempo esgotado',next:'Próxima',case_:'Caso de campo',S:'Situação',T:'Tarefa',A:'Ação',R:'Resultado',pick:'Escolha sua ação',best:'Melhor decisão',fair:'Aceitável',poor:'Decisão ruim',eff:'Efeito estimado',e_p:'Produção',e_c:'Custo',e_k:'Risco',rule:'Regra do ofício',others:'O que teria acontecido com as outras ações?',hide:'Ocultar',win:'Você completou as 10 medalhas!',over:'Fim de jogo',sum:'Resumo',acc:'Acertos por especialidade',rein:'Para reforçar',rein0:'Sem áreas fracas! Bom trabalho.',again:'Jogar de novo',best_s:'Melhor pontuação',games:'Partidas',ex:'Os casos e os números são exemplos didáticos, não dados de campos reais, e não citam empresas. As regras do ofício são critérios gerais: em um campo real são sempre validadas com os dados próprios.',lang:'Conteúdo do jogo em espanhol; interface em 4 idiomas.',err:'Não foi possível carregar o jogo. Tente novamente.',cat:{geo:'Geociências',res:'Reservatórios',rsv:'Reservas',per:'Perfuração',prod:'Produção',mon:'Monitoramento e curvas',eco:'Economia',hse:'Segurança e transição',sup:'Instalações de superfície',pmi:'Projetos (PMI)',caso:'Caso de campo'},up:'pts',lvl:{1:'Básico',2:'Intermediário',3:'Nível 2',4:'Principal'},ans:'Resposta correta',lost:'−1 vida',gain:'+1 vida',pts:'pontos'}};
function L(k){var d=TX[HC.lang]||TX.es;var v=d[k];return v==null?TX.es[k]:v}
function CN(c){var d=(TX[HC.lang]||TX.es).cat;return d[c]||TX.es.cat[c]}
function fmt(s,o){return s.replace(/\{(\w+)\}/g,function(m,n){return o[n]!=null?o[n]:m})}
var DATA=null,TITLES={},G=null,tm=null,store={best:0,games:0},app=$('#app'),reduce=false;
try{reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches}catch(e){}
try{var sv=JSON.parse(localStorage.getItem(KEY)||'null');if(sv&&typeof sv.best==='number')store={best:sv.best|0,games:sv.games|0}}catch(e){}
function save(){try{localStorage.setItem(KEY,JSON.stringify(store))}catch(e){}}
function shuf(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}return a}
function rnd(a){return a[Math.floor(Math.random()*a.length)]}

/* ---------- pantallas ---------- */
function startScreen(){stopT();G=null;var lv=(app.getAttribute('data-lv')||'0');
  app.innerHTML='<h1 class="gm-h">'+esc(L('h'))+'</h1><p class="gm-p">'+esc(L('p'))+'</p>'+
  '<details class="gm-card gm-how"><summary>'+esc(L('how'))+'</summary><ul><li>'+esc(fmt(L('how1'),{n:NEED}))+'</li><li>'+esc(fmt(L('how2'),{s:'45–90'}))+'</li><li>'+esc(L('how3'))+'</li></ul></details>'+
  '<div class="gm-card"><h2>'+esc(L('lv'))+'</h2><div class="gm-lv" role="radiogroup" aria-label="'+esc(L('lv'))+'">'+
  [['1','lvb'],['2','lvi'],['0','lvm']].map(function(x){return '<button type="button" role="radio" class="btn o" data-lv="'+x[0]+'" aria-checked="'+(x[0]===lv?'true':'false')+'">'+esc(L(x[1]))+'</button>'}).join('')+'</div></div>'+
  '<p><button type="button" class="btn g" id="gGo">'+esc(L('go'))+'</button></p>'+
  (store.games?'<p class="note-s">'+esc(L('best_s'))+': <b>'+store.best+'</b> · '+esc(L('games'))+': '+store.games+'</p>':'')+
  '<p class="note-s">'+esc(L('ex'))+'</p><p class="note-s">'+esc(L('lang'))+'</p>';
  var btns=app.querySelectorAll('[data-lv]');
  function mark(v){app.setAttribute('data-lv',v);for(var i=0;i<btns.length;i++){var on=btns[i].getAttribute('data-lv')===v;btns[i].setAttribute('aria-checked',on?'true':'false');btns[i].className='btn '+(on?'':'o')}}
  for(var i=0;i<btns.length;i++)btns[i].onclick=function(){mark(this.getAttribute('data-lv'))};
  mark(lv);
  $('#gGo').onclick=function(){newGame(+app.getAttribute('data-lv'))}}

function newGame(level,carry){var med={},st={},used={},i;CATS.forEach(function(c){med[c]=0;st[c]=[0,0]});
  G={level:level,lives:LIVES,score:carry||0,streak:0,med:med,st:st,used:used,usedCase:{},pw:{f:2,t:1,s:1},cur:null,rot:0,spinning:false,best:0};
  board()}

function hud(){var h='',i;for(i=0;i<LIVES;i++)h+='<span class="gm-hrt'+(i<G.lives?'':' off')+'" aria-hidden="true">♥</span>';
  var l2=G.level>=3?' <span class="gm-l2">'+esc(L(G.level===4?'l3tag':'l2tag'))+'</span>':'';var m=CATS.map(function(c){var pips='',k;for(k=0;k<NEED;k++)pips+='<i class="'+(k<G.med[c]?'on':'')+'"></i>';return '<li class="'+(G.med[c]>=NEED?'done':'')+'" style="--cc:'+COL[c]+'"><span>'+esc(CN(c))+'</span><em>'+pips+'</em></li>'}).join('');
  return '<div class="gm-hud"><div><b>'+esc(L('lives'))+'</b> '+h+l2+'<span class="sr">'+G.lives+'</span></div><div><b>'+esc(L('score'))+'</b> <span id="gSc">'+G.score+'</span></div><div><b>'+esc(L('streak'))+'</b> <span>'+G.streak+'</span></div></div><ul class="gm-med" aria-label="'+esc(L('medals'))+'">'+m+'</ul>'}

function pending(){return CATS.filter(function(c){return G.med[c]<NEED})}
function casesLeft(){return DATA.cases.filter(function(c){return !G.usedCase[c.id]})}

function board(){stopT();G.cur=null;try{window.scrollTo(0,0)}catch(e){}
  if(!pending().length||G.lives<=0){return end()}
  var opts=pending();if(casesLeft().length)opts=opts.concat(['caso']);gauge(opts)}

/* Ruleta alternativa: manómetro con aguja (no es una rueda giratoria) */
function gaugeSvg(opts){var n=opts.length,a=270/n,cx=150,cy=140,R=130,r0=60,sv='',i;
  function pt(t,r){var rad=t*Math.PI/180;return [cx+r*Math.sin(rad),cy-r*Math.cos(rad)]}
  function f(p){return p[0].toFixed(1)+' '+p[1].toFixed(1)}
  for(i=0;i<n;i++){var t0=-135+i*a,t1=t0+a,tm=t0+a/2,c=opts[i],lab=CN(c).split(' ')[0],pl=pt(tm,95),rot=(tm>90||tm<-90)?tm+90:tm-90;
    sv+='<path d="M'+f(pt(t0,R))+'A'+R+' '+R+' 0 0 1 '+f(pt(t1,R))+'L'+f(pt(t1,r0))+'A'+r0+' '+r0+' 0 0 0 '+f(pt(t0,r0))+'Z" fill="'+COL[c]+'" stroke="#fff" stroke-width="2.5"/>'+
    '<text x="'+pl[0].toFixed(1)+'" y="'+pl[1].toFixed(1)+'" transform="rotate('+rot.toFixed(1)+' '+pl[0].toFixed(1)+' '+pl[1].toFixed(1)+')" text-anchor="middle" dominant-baseline="middle" fill="#fff" font-size="10.5" font-weight="600" letter-spacing=".3"'+(lab.length>8?' textLength="52" lengthAdjust="spacingAndGlyphs"':'')+'>'+esc(lab)+'</text>'}
  for(i=0;i<=27;i++){var tt=-135+i*10,p1=pt(tt,R+4),p2=pt(tt,R+(i%3?8:13));sv+='<line x1="'+p1[0].toFixed(1)+'" y1="'+p1[1].toFixed(1)+'" x2="'+p2[0].toFixed(1)+'" y2="'+p2[1].toFixed(1)+'" stroke="#1B2944" stroke-width="'+(i%3?1.2:2.2)+'"/>'}
  return '<svg viewBox="0 -8 300 296" role="img" aria-label="'+esc(L('mg'))+'"><circle cx="150" cy="140" r="146" fill="#fff" stroke="#1B2944" stroke-width="3"/>'+sv+
   '<g id="gNd" style="transform:rotate(-135deg)"><polygon points="146,150 154,150 150,26" fill="#1B2944"/></g><circle cx="150" cy="140" r="14" fill="#1B2944"/><circle cx="150" cy="140" r="5" fill="#fff"/></svg>'}

function gauge(opts){G.mode='show';
  app.innerHTML=hud()+'<div class="gm-stage"><div class="gm-gauge" id="gGg">'+gaugeSvg(opts)+'</div><p><button type="button" class="btn g" id="gSp">'+esc(L('launch'))+'</button></p></div>';
  $('#gSp').onclick=function(){launch(opts)}}

function launch(opts){if(G.mode!=='show')return;G.mode='busy';var b=$('#gSp');b.disabled=true;b.textContent=L('spinning');
  var n=opts.length,a=270/n,i=Math.floor(Math.random()*n),pick=opts[i],tg=-135+i*a+a/2+(Math.random()-.5)*a*.5,nd=$('#gNd');
  function go(){if(!G||G.mode!=='flip')return;G.mode='';pick==='caso'?caseScreen():qScreen(pick)}
  function put(t){nd.style.transition='none';nd.style.transform='rotate('+t+'deg)'}
  if(reduce){put(tg);G.mode='flip';return setTimeout(go,300)}
  /* Aguja con inercia: resorte amortiguado (subamortiguado), topes en los extremos y temblor que se apaga */
  var th=-135,w=0,t=0,dt=1/120,last=null,acc=0,set=0,phase=0,K=48,ZE=.2,hit=0;set=Math.min(134,tg+34);if(set<-60)set=70;
  function step(){var k=phase?K:140,c=2*(phase?ZE:.85)*Math.sqrt(k),f=k*(set-th)-c*w;
    w+=f*dt;th+=w*dt;t+=dt;
    if(th>138){th=138;w=-Math.abs(w)*.4}else if(th<-138){th=-138;w=Math.abs(w)*.4}
    if(!phase&&(t>.8||th>set-4)){phase=1;set=tg;hit=t}
    return th+(phase?Math.sin(t*70)*Math.max(0,.35-(t-hit)*.12)*Math.min(1,Math.abs(w)/25):0)}
  function frame(ts){if(!G||!$('#gNd'))return;if(last==null)last=ts;acc+=Math.min(.05,(ts-last)/1000);last=ts;var v=th;
    while(acc>=dt){v=step();acc-=dt}
    put(v);
    if(phase&&Math.abs(th-tg)<.25&&Math.abs(w)<1.5||t>7){put(tg);G.mode='flip';return setTimeout(go,650)}
    requestAnimationFrame(frame)}
  requestAnimationFrame(frame)}

function pickQ(cat){function okl(x){return G.level>=3?x.l===G.level:(G.level===0?x.l<3:x.l===G.level)}var pool=DATA.q.filter(function(x){return x.c===cat&&okl(x)});if(!pool.length)pool=DATA.q.filter(function(x){return x.c===cat&&(G.level>=3?x.l===G.level:x.l<3)});
  var u=G.used[cat]||(G.used[cat]={}),free=pool.filter(function(x){return !u[x.q]});if(!free.length){G.used[cat]={};free=pool}var x=rnd(free);G.used[cat][x.q]=1;return x}

/* ---------- pregunta ---------- */
function qScreen(cat,q0){var q=q0||pickQ(cat),ord=shuf([0,1,2,3]),ln=q.q.length+q.o.reduce(function(a,b){return a+b.length},0),t0=Math.min(90,SECS+Math.round(ln/12));
  G.cur={type:'q',cat:cat,q:q,ord:ord,left:t0,max:t0,done:false};
  var html='<div class="gm-q" style="--cc:'+COL[cat]+'"><div class="gm-tag"><b>'+esc(CN(cat))+'</b> · '+esc((TX[HC.lang]||TX.es).lvl[q.l])+'</div>'+
  '<div class="gm-bar" role="timer" aria-label="'+esc(L('time'))+'"><i id="gTb"></i><span id="gTs">'+t0+'</span></div>'+
  '<h2 class="gm-qt">'+esc(q.q)+'</h2><div class="gm-opts" id="gOp">'+ord.map(function(k,i){return '<button type="button" class="gm-opt" data-k="'+k+'"><kbd>'+(i+1)+'</kbd><span>'+esc(q.o[k])+'</span></button>'}).join('')+'</div>'+
  '<div class="gm-pw"><b>'+esc(L('pw'))+'</b> <button type="button" class="btn o s" id="gP1">'+esc(L('p50'))+' ×'+G.pw.f+'</button> <button type="button" class="btn o s" id="gP2">'+esc(L('pt'))+' ×'+G.pw.t+'</button> <button type="button" class="btn o s" id="gP3">'+esc(L('ps'))+' ×'+G.pw.s+'</button></div><div id="gFb" aria-live="polite"></div></div>';
  app.innerHTML=hud()+html;
  var opts=app.querySelectorAll('.gm-opt');for(var i=0;i<opts.length;i++)opts[i].onclick=function(){answer(+this.getAttribute('data-k'))};
  function pw(id,key,fn){var b=$(id);if(!G.pw[key])b.disabled=true;b.onclick=function(){if(G.cur.done||!G.pw[key])return;G.pw[key]--;fn();b.textContent=b.textContent.replace(/×\d+/,'×'+G.pw[key]);if(!G.pw[key])b.disabled=true}}
  pw('#gP1','f',function(){var w=[],i;for(i=0;i<opts.length;i++){if(+opts[i].getAttribute('data-k')!==0&&!opts[i].disabled)w.push(opts[i])}w=shuf(w).slice(0,2);w.forEach(function(o){o.disabled=true;o.className+=' x'})});
  pw('#gP2','t',function(){G.cur.left=Math.min(G.cur.left+15,G.cur.max+15)});
  pw('#gP3','s',function(){stopT();G.cur.done=true;board()});
  tick()}

function stopT(){if(tm){clearInterval(tm);tm=null}}
function tick(){stopT();var c=G.cur,t=Date.now(),last=SECS;tm=setInterval(function(){if(!G||G.cur!==c||c.done){stopT();return}
  var now=Date.now();c.left-=(now-t)/1000;t=now;var tb=$('#gTb'),ts=$('#gTs');if(tb)tb.style.width=Math.max(0,Math.min(100,c.left/c.max*100))+'%';if(ts)ts.textContent=Math.max(0,Math.ceil(c.left));
  if(c.left<=0){stopT();answer(-1)}},100)}

function answer(k){var c=G.cur;if(!c||c.done)return;c.done=true;stopT();var q=c.q,ok=k===0,tl=Math.max(0,Math.ceil(c.left)),st=G.st[c.cat],gain=0,fb;
  st[1]++;
  if(ok){st[0]++;G.med[c.cat]++;G.streak++;gain=100+Math.min(G.streak-1,5)*20+Math.min(tl,45)*2;G.score+=gain}
  else{G.lives--;G.streak=0}
  var opts=app.querySelectorAll('.gm-opt'),i;for(i=0;i<opts.length;i++){var kk=+opts[i].getAttribute('data-k');opts[i].disabled=true;if(kk===0)opts[i].className+=' good';else if(kk===k)opts[i].className+=' bad'}
  var b=$('#gP1'),b2=$('#gP2'),b3=$('#gP3');b.disabled=b2.disabled=b3.disabled=true;
  var head=ok?L('ok'):(k<0?L('late'):L('bad'));
  fb='<div class="gm-fb '+(ok?'p':'f')+'"><b>'+esc(head)+'</b>'+(ok?' +'+gain+' '+esc(L('pts')):' '+esc(L('lost')))+(ok&&G.med[c.cat]===NEED?' 🏅 '+esc(CN(c.cat)):'')+'<p>'+(ok?'':'<strong>'+esc(L('ans'))+':</strong> '+esc(q.o[0])+'. ')+esc(q.e)+'</p><p><button type="button" class="btn" id="gNx" autofocus>'+esc(L('next'))+'</button></p></div>';
  $('#gFb').innerHTML=fb;$('#gSc').textContent=G.score;$('#gNx').focus();$('#gNx').onclick=function(){board()}}

/* ---------- caso STAR ---------- */
function caseScreen(c0){var left=casesLeft(),cs=c0||(left.length?rnd(left):rnd(DATA.cases));G.usedCase[cs.id]=1;var ord=shuf(cs.a.map(function(_,i){return i}));
  G.cur={type:'c',cs:cs,ord:ord,done:false};
  app.innerHTML=hud()+'<div class="gm-q gm-case" style="--cc:'+COL.caso+'"><div class="gm-tag"><b>'+esc(L('case_'))+'</b> · '+esc(CN(cs.c))+'</div><h2 class="gm-qt">'+esc(cs.t)+'</h2>'+
  '<div class="gm-star"><div><i>S</i><b>'+esc(L('S'))+'</b><p>'+esc(cs.s)+'</p></div><div><i>T</i><b>'+esc(L('T'))+'</b><p>'+esc(cs.k)+'</p></div></div>'+
  '<h3 class="gm-a"><i>A</i> '+esc(L('pick'))+'</h3><div class="gm-opts" id="gOp">'+ord.map(function(k,i){return '<button type="button" class="gm-opt" data-k="'+k+'"><kbd>'+(i+1)+'</kbd><span>'+esc(cs.a[k].t)+'</span></button>'}).join('')+'</div><div id="gFb" aria-live="polite"></div></div>';
  var o=app.querySelectorAll('.gm-opt'),i;for(i=0;i<o.length;i++)o[i].onclick=function(){choose(+this.getAttribute('data-k'))}}

var ARW={'-2':'▼▼','-1':'▼','0':'●','1':'▲','2':'▲▲'};
function chips(a){function ch(k,v,goodUp){var cls=v===0?'n':((v>0)===goodUp?'g':'r');return '<span class="gm-ch '+cls+'">'+esc(L(k))+' '+ARW[v]+'</span>'}return '<div class="gm-chs" aria-label="'+esc(L('eff'))+'">'+ch('e_p',a.p,true)+ch('e_c',a.c,false)+ch('e_k',a.k,false)+'</div>'}
function rate(sc){return sc===2?['best','p']:(sc===1?['fair','m']:['poor','f'])}
function choose(k){var c=G.cur;if(!c||c.done)return;c.done=true;var cs=c.cs,a=cs.a[k],r=rate(a.sc),gain=a.sc===2?200:(a.sc===1?60:0),life='';
  G.score+=gain;if(a.sc===2&&G.lives<LIVES){G.lives++;life=' · '+L('gain')}else if(a.sc===0){G.lives--;G.streak=0;life=' · '+L('lost')}
  var o=app.querySelectorAll('.gm-opt'),i;for(i=0;i<o.length;i++){var kk=+o[i].getAttribute('data-k');o[i].disabled=true;if(kk===k)o[i].className+=' sel '+(a.sc===2?'good':(a.sc===0?'bad':''));else if(cs.a[kk].sc===2)o[i].className+=' good'}
  var oth=c.ord.filter(function(x){return x!==k}).map(function(x){var y=cs.a[x],rr=rate(y.sc);return '<div class="gm-oth '+rr[1]+'"><b>'+esc(y.t)+' — '+esc(L(rr[0]))+'</b><p>'+esc(y.r)+'</p>'+chips(y)+'</div>'}).join('');
  $('#gFb').innerHTML='<div class="gm-fb '+r[1]+'"><h3 class="gm-a"><i>R</i> '+esc(L('R'))+' — '+esc(L(r[0]))+'</h3><p>'+esc(a.r)+'</p>'+chips(a)+'<p class="gm-rule"><b>'+esc(L('rule'))+':</b> '+esc(cs.rule)+'</p><p class="note-s">+'+gain+' '+esc(L('pts'))+esc(life)+'</p>'+
  '<p><button type="button" class="btn o s" id="gOt" aria-expanded="false">'+esc(L('others'))+'</button></p><div id="gOb" hidden>'+oth+'</div><p><button type="button" class="btn" id="gNx">'+esc(L('next'))+'</button></p></div>';
  $('#gSc').textContent=G.score;$('#gNx').focus();$('#gNx').onclick=function(){board()};
  $('#gOt').onclick=function(){var b=$('#gOb'),h=b.hasAttribute('hidden');if(h)b.removeAttribute('hidden');else b.setAttribute('hidden','');this.setAttribute('aria-expanded',h?'true':'false')}}

/* ---------- fin ---------- */
function end(){stopT();var won=!pending().length,tot=0,okc=0,weak=[];
  CATS.forEach(function(c){var s=G.st[c];tot+=s[1];okc+=s[0];if(s[1]&&s[0]/s[1]<0.7||G.med[c]<NEED)weak.push(c)});
  if(G.score>store.best)store.best=G.score;store.games++;save();
  var bars=CATS.map(function(c){var s=G.st[c],p=s[1]?Math.round(s[0]/s[1]*100):0;return '<li style="--cc:'+COL[c]+'"><span>'+esc(CN(c))+'</span><div class="gm-ab"><i style="width:'+p+'%"></i></div><em>'+(s[1]?s[0]+'/'+s[1]:'—')+'</em></li>'}).join('');
  var rein='';if(weak.length){rein='<ul class="gm-rein">'+weak.map(function(c){var m=DATA.cats.filter(function(x){return x.id===c})[0];return '<li><b>'+esc(CN(c))+'</b>'+(m.courses.length?m.courses.map(function(id){return ' <a href="curso.html?c='+encodeURIComponent(id)+'">'+esc(TITLES[id]||id)+'</a>'}).join(' · '):' <span class="note-s">'+esc(L('nocourse'))+'</span>')+'</li>'}).join('')+'</ul>'}else rein='<p>'+esc(L('rein0'))+'</p>';
  app.innerHTML='<div class="gm-end '+(won?'win':'')+'"><h1 class="gm-h">'+esc(won?'🏅 '+L(G.level===4?'win3':G.level===3?'win2':'win'):L('over'))+'</h1><p class="gm-big">'+G.score+' <small>'+esc(L('pts'))+'</small></p><p class="note-s">'+esc(L('best_s'))+': <b>'+store.best+'</b> · '+(tot?Math.round(okc/tot*100):0)+' %</p></div>'+
  '<div class="gm-card"><h2>'+esc(L('acc'))+'</h2><ul class="gm-acc">'+bars+'</ul></div><div class="gm-card"><h2>'+esc(L('rein'))+'</h2>'+rein+'</div>'+(won&&G.level!==4?'<div class="gm-card gm-l2c"><h2>'+esc(L(G.level===3?'l3h':'l2h'))+'</h2><p>'+esc(L(G.level===3?'l3p':'l2p'))+'</p><button type="button" class="btn" id="gL2">'+esc(L(G.level===3?'l3go':'l2go'))+'</button></div>':'')+'<p><button type="button" class="btn g" id="gAg">'+esc(L('again'))+'</button></p><p class="note-s">'+esc(L('ex'))+'</p>';
  $('#gAg').onclick=startScreen;var l2b=$('#gL2');if(l2b){var sc0=G.score;var nl=G.level===3?4:3;l2b.onclick=function(){newGame(nl,sc0)}}G.over=true}

document.addEventListener('keydown',function(e){if(!G||!G.cur||G.cur.done||e.ctrlKey||e.metaKey||e.altKey)return;var n=parseInt(e.key,10);if(n>=1&&n<=4){var o=app.querySelectorAll('.gm-opt');if(o[n-1]&&!o[n-1].disabled)o[n-1].click()}});

function render(){HC.langSelect($('#lang'));HC.apply();document.title=L('h')+' · H3L'}
function redraw(){HC.apply();document.title=L('h')+' · H3L';if(!G)return startScreen();
  if(G.over)return end();if(G.cur&&!G.cur.done){var c=G.cur;if(c.type==='q'){stopT();G.cur=null;return qScreen(c.cat,c.q)}G.cur=null;return caseScreen(c.cs)}board()}
HC.onlang=function(){if(!DATA)return;if(!G)startScreen();else redraw()};
render();
Promise.all([fetch('data/juego.json').then(function(r){if(!r.ok)throw 0;return r.json()}),HC.loadCatalog().catch(function(){return null})]).then(function(r){DATA=r[0];if(r[1])r[1].courses.forEach(function(m){TITLES[m.id]=m.title});startScreen()}).catch(function(){app.innerHTML='<p class="res f">'+esc(L('err'))+'</p>'});
})();
