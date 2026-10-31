/* H3L · Cursos · editor para tutores. Edita una copia en el navegador y genera un archivo de propuesta; no publica nada.
   La revisión y la aprobación para producción son del administrador (panel de administración). */
(function(){'use strict';var HC=window.HC,HV=window.HV,$=HC.$,esc=HC.esc;HC.adminMode=true;
/* ---------- textos de la interfaz (es|en|fr|pt) ---------- */
var T={
h:'Editor de cursos para tutores|Course editor for tutors|Éditeur de cours pour tuteurs|Editor de cursos para tutores',
p:'Editá el contenido de un curso en tu navegador, validalo y descargá una propuesta. La propuesta no cambia el sitio: la revisa y la aprueba el administrador antes de pasar a producción.|Edit a course in your browser, validate it and download a proposal. The proposal does not change the site: the administrator reviews and approves it before it goes to production.|Modifiez un cours dans votre navigateur, validez-le et téléchargez une proposition. Elle ne modifie pas le site : l’administrateur la révise et l’approuve avant la mise en production.|Edite um curso no navegador, valide e baixe uma proposta. Ela não altera o site: o administrador revisa e aprova antes da produção.',
course:'Curso|Course|Cours|Curso',tname:'Tu nombre|Your name|Votre nom|Seu nome',tmail:'Tu correo|Your email|Votre e-mail|Seu e-mail',
save:'Borrador guardado en este navegador|Draft saved in this browser|Brouillon enregistré dans ce navigateur|Rascunho salvo neste navegador',
discard:'Descartar cambios|Discard changes|Annuler les modifications|Descartar alterações',discard_q:'¿Descartar todos los cambios de este curso?|Discard all changes to this course?|Annuler toutes les modifications de ce cours ?|Descartar todas as alterações deste curso?',
loaded:'Se restauró un borrador guardado.|A saved draft was restored.|Un brouillon enregistré a été restauré.|Um rascunho salvo foi restaurado.',
n_meta:'Datos generales|General data|Données générales|Dados gerais',n_intro:'Presentación|Introduction|Présentation|Apresentação',n_comp:'Competencias|Competencies|Compétences|Competências',n_exam:'Examen final|Final exam|Examen final|Exame final',n_outro:'Cierre|Closing|Clôture|Encerramento',n_dl:'Descargas (Excel)|Downloads (Excel)|Téléchargements (Excel)|Downloads (Excel)',n_cases:'Casos reales|Real cases|Cas réels|Casos reais',n_refs:'Referencias|References|Références|Referências',n_rev:'Revisión y envío|Review and submit|Révision et envoi|Revisão e envio',
module:'Módulo|Module|Module|Módulo',lesson:'Lección|Lesson|Leçon|Lição',
title:'Título|Title|Titre|Título',subtitle:'Subtítulo|Subtitle|Sous-titre|Subtítulo',desc:'Descripción|Description|Description|Descrição',obj:'Objetivos (uno por línea)|Objectives (one per line)|Objectifs (un par ligne)|Objetivos (um por linha)',labs:'Laboratorios (uno por línea)|Labs (one per line)|Laboratoires (un par ligne)|Laboratórios (um por linha)',pm:'Minutos de práctica|Practice minutes|Minutes de pratique|Minutos de prática',
hook:'Frase de apertura|Opening line|Phrase d’ouverture|Frase de abertura',q3:'Tres preguntas del curso (una por línea)|Three course questions (one per line)|Trois questions du cours (une par ligne)|Três perguntas do curso (uma por linha)',star:'Caso STAR|STAR case|Cas STAR|Caso STAR',
st_caso:'Título del caso|Case title|Titre du cas|Título do caso',st_S:'Situación|Situation|Situation|Situação',st_T:'Tarea|Task|Tâche|Tarefa',st_A:'Acción|Action|Action|Ação',st_R:'Resultado|Result|Résultat|Resultado',
cname:'Competencia|Competency|Compétence|Competência',clessons:'Lecciones (ids separados por coma)|Lessons (comma-separated ids)|Leçons (ids séparés par des virgules)|Lições (ids separados por vírgula)',
lid:'Identificador (no se cambia)|Identifier (fixed)|Identifiant (fixe)|Identificador (fixo)',lcomp:'Competencia|Competency|Compétence|Competência',
cues:'Bloques de narración|Narration blocks|Blocs de narration|Blocos de narração',cue:'Bloque|Block|Bloc|Bloco',say:'Narración (lo que se escucha)|Narration (spoken text)|Narration (texte lu)|Narração (texto falado)',words:'palabras|words|mots|palavras',
scene:'Pantalla|Screen|Écran|Tela',s_none:'Sin pantalla nueva|No new screen|Pas de nouvel écran|Sem nova tela',s_bul:'Viñetas|Bullets|Puces|Tópicos',s_tbl:'Tabla|Table|Tableau|Tabela',s_fm:'Fórmula|Formula|Formule|Fórmula',s_viz:'Laboratorio / diagrama|Lab / diagram|Laboratoire / schéma|Laboratório / diagrama',s_case:'Caso real|Real case|Cas réel|Caso real',
k:'Etiqueta superior|Top label|Étiquette|Rótulo',hh:'Título de la pantalla|Screen title|Titre de l’écran|Título da tela',items:'Viñetas (una por línea)|Bullets (one per line)|Puces (une par ligne)|Tópicos (um por linha)',
f:'Fórmula (texto)|Formula (text)|Formule (texte)|Fórmula (texto)',n:'Nota|Note|Note|Nota',w:'Laboratorio|Lab|Laboratoire|Laboratório',vp:'Parámetros (JSON)|Parameters (JSON)|Paramètres (JSON)|Parâmetros (JSON)',
prev:'Vista previa|Preview|Aperçu|Pré-visualização',src:'Fuente verificable|Verifiable source|Source vérifiable|Fonte verificável',
hl:'Punto resaltado (número, 0 = primero)|Highlighted item (0 = first)|Élément surligné (0 = premier)|Item destacado (0 = primeiro)',lab:'Es un laboratorio (se pide práctica)|It is a lab (practice)|C’est un laboratoire (pratique)|É um laboratório (prática)',
cp:'Pregunta rápida al final del bloque|Quick question after this block|Question rapide après ce bloc|Pergunta rápida após este bloco',
qq:'Pregunta|Question|Question|Pergunta',opt:'Opción|Option|Option|Opção',ans:'Respuesta correcta|Correct answer|Bonne réponse|Resposta correta',exp:'Explicación|Explanation|Explication|Explicação',
quiz:'Quiz del módulo (3 preguntas)|Module quiz (3 questions)|Quiz du module (3 questions)|Quiz do módulo (3 perguntas)',exam6:'Examen final (6 preguntas)|Final exam (6 questions)|Examen final (6 questions)|Exame final (6 perguntas)',
phrase:'Frase de cierre|Closing phrase|Phrase de clôture|Frase de encerramento',recap:'Ideas clave (una por línea)|Key ideas (one per line)|Idées clés (une par ligne)|Ideias-chave (uma por linha)',
dfile:'Archivo (xlsx/…)|File (xlsx/…)|Fichier (xlsx/…)|Arquivo (xlsx/…)',dtitle:'Título|Title|Titre|Título',ddesc:'Descripción|Description|Description|Descrição',dtask:'Tarea propuesta|Suggested task|Tâche proposée|Tarefa sugerida',
ctitle:'Título del caso|Case title|Titre du cas|Título do caso',ctext:'Texto|Text|Texte|Texto',rtag:'Tipo (Libro, Paper, Estándar…)|Type (Book, Paper, Standard…)|Type (Livre, Article, Norme…)|Tipo (Livro, Artigo, Norma…)',rcite:'Cita completa|Full citation|Citation complète|Citação completa',rwhy:'Para qué se usa|What it supports|À quoi elle sert|Para que serve',
add:'Agregar|Add|Ajouter|Adicionar',del:'Eliminar|Delete|Supprimer|Excluir',up:'Subir|Move up|Monter|Subir',dn:'Bajar|Move down|Descendre|Descer',addcue:'Agregar bloque|Add block|Ajouter un bloc|Adicionar bloco',addles:'Agregar lección|Add lesson|Ajouter une leçon|Adicionar lição',addmod:'Agregar módulo|Add module|Ajouter un module|Adicionar módulo',
delc:'¿Eliminar este elemento?|Delete this item?|Supprimer cet élément ?|Excluir este item?',
v_run:'Validar|Validate|Valider|Validar',v_ok:'Sin errores: la propuesta se puede descargar.|No errors: the proposal can be downloaded.|Aucune erreur : la proposition peut être téléchargée.|Sem erros: a proposta pode ser baixada.',v_err:'errores|errors|erreurs|erros',v_warn:'avisos|warnings|avertissements|avisos',
changes:'Cambios respecto del curso publicado|Changes from the published course|Modifications par rapport au cours publié|Alterações em relação ao curso publicado',nochg:'Todavía no hay cambios.|No changes yet.|Aucune modification.|Ainda não há alterações.',
note:'Nota para el administrador (qué cambiaste y por qué)|Note for the administrator (what and why)|Note pour l’administrateur (quoi et pourquoi)|Nota para o administrador (o quê e por quê)',
decl:'Declaro que el contenido es real y verificado, que los ejemplos están rotulados como ejemplo y que no incluye nombres de socios.|I declare the content is real and verified, examples are labeled as examples and no partner names are included.|Je déclare que le contenu est réel et vérifié, que les exemples sont signalés comme tels et qu’aucun nom d’associé n’est inclus.|Declaro que o conteúdo é real e verificado, que os exemplos estão rotulados como exemplo e que não inclui nomes de sócios.',
dl:'Descargar propuesta|Download proposal|Télécharger la proposition|Baixar proposta',need:'Completá tu nombre, tu correo y la declaración, y corregí los errores.|Fill in your name, email and the declaration, and fix the errors.|Renseignez nom, e-mail et déclaration, et corrigez les erreurs.|Preencha nome, e-mail e declaração, e corrija os erros.',
after:'Enviá el archivo descargado al administrador (correo o chat). Él lo carga en el panel de administración, revisa las diferencias y decide si pasa a producción.|Send the downloaded file to the administrator (email or chat). They load it in the admin panel, review the differences and decide whether it goes to production.|Envoyez le fichier à l’administrateur (e-mail ou chat). Il le charge dans le panneau d’administration, révise les différences et décide de la mise en production.|Envie o arquivo ao administrador (e-mail ou chat). Ele o carrega no painel, revisa as diferenças e decide se vai para produção.',
e_req:'Falta completar este campo|This field is required|Ce champ est requis|Este campo é obrigatório',e_id:'El identificador del curso no puede cambiar|The course id cannot change|L’identifiant du cours ne peut pas changer|O id do curso não pode mudar',e_num:'Debe ser un número mayor que 0|Must be a number greater than 0|Doit être un nombre supérieur à 0|Deve ser um número maior que 0',e_three:'Deben ser exactamente 3|Exactly 3 required|Exactement 3 requis|Exatamente 3 necessários',e_quiz3:'El quiz debe tener exactamente 3 preguntas|The quiz needs exactly 3 questions|Le quiz doit avoir 3 questions|O quiz deve ter 3 perguntas',e_exam6:'El examen debe tener exactamente 6 preguntas|The exam needs exactly 6 questions|L’examen doit avoir 6 questions|O exame deve ter 6 perguntas',e_dup:'Identificador repetido|Duplicate id|Identifiant en double|Id duplicado',e_hl:'Número entero desde 0 (o −1)|Integer from 0 (or −1)|Entier à partir de 0 (ou −1)|Inteiro a partir de 0 (ou −1)',e_type:'Tipo de pantalla inválido|Invalid screen type|Type d’écran invalide|Tipo de tela inválido',e_rows:'Cada fila debe tener tantas celdas como columnas|Each row needs as many cells as columns|Chaque ligne doit avoir autant de cellules que de colonnes|Cada linha precisa ter tantas células quanto colunas',e_widget:'Laboratorio inexistente|Unknown lab|Laboratoire inconnu|Laboratório inexistente',e_json:'Parámetros inválidos|Invalid parameters|Paramètres invalides|Parâmetros inválidos',e_four:'Deben ser 4 opciones completas|Four complete options required|Quatre options complètes requises|Quatro opções completas',e_ans:'Elegí la respuesta correcta|Choose the correct answer|Choisissez la bonne réponse|Escolha a resposta correta',e_comp:'Hay un id de lección que no existe|A lesson id does not exist|Un id de leçon n’existe pas|Há um id de lição inexistente',e_file:'Debe empezar con xlsx/|Must start with xlsx/|Doit commencer par xlsx/|Deve começar com xlsx/',
w_long:'Bloque muy largo (más de 70 palabras)|Very long block (over 70 words)|Bloc très long (plus de 70 mots)|Bloco muito longo (mais de 70 palavras)',w_short:'Lección corta (menos de 60 palabras)|Short lesson (under 60 words)|Leçon courte (moins de 60 mots)|Lição curta (menos de 60 palavras)',w_longl:'Lección muy larga (más de 260 palabras)|Very long lesson (over 260 words)|Leçon très longue (plus de 260 mots)|Lição muito longa (mais de 260 palavras)',w_norefs:'No hay referencias|No references|Aucune référence|Sem referências',w_labviz:'«Laboratorio» sin pantalla de laboratorio|"Lab" without a lab screen|« Laboratoire » sans écran de laboratoire|"Laboratório" sem tela de laboratório',
imp:'Importar borrador (.json)|Import draft (.json)|Importer un brouillon (.json)|Importar rascunho (.json)',exp:'Guardar borrador en un archivo|Save draft to a file|Enregistrer le brouillon|Salvar rascunho em arquivo',
cnt:'Los datos numéricos de los laboratorios son ejemplos didácticos y deben decirlo.|Numeric lab data are teaching examples and must say so.|Les données des laboratoires sont des exemples pédagogiques et doivent le préciser.|Os dados dos laboratórios são exemplos didáticos e devem dizê-lo.'};
T.cols=['Columnas (separadas por |)','Columns (separated by |)','Colonnes (séparées par |)','Colunas (separadas por |)'];
T.rows=['Filas (una por línea, celdas separadas por |)','Rows (one per line, cells separated by |)','Lignes (une par ligne, cellules séparées par |)','Linhas (uma por linha, células separadas por |)'];
var LI={es:0,en:1,fr:2,pt:3};
function tt(k){var s=T[k];if(!s)return k;var i=LI[HC.lang]||0;return Array.isArray(s)?s[i]:s.split('|')[i]}
/* ---------- estado ---------- */
var S={cat:null,id:null,orig:null,w:null,nav:'meta',open:{},tut:{name:'',email:'',note:'',decl:false},msg:'',prev:null};
var DK='h3l-tutor-draft-',TK='h3l-tutor-id';
function clone(x){return JSON.parse(JSON.stringify(x))}
function get(o,p){return p.split('.').reduce(function(a,k){return a==null?a:a[k]},o)}
function set(o,p,v){var ks=p.split('.'),l=ks.pop(),t=ks.reduce(function(a,k){return a[k]},o);t[l]=v}
function lsget(k){try{return localStorage.getItem(k)}catch(e){return null}}
function lsset(k,v){try{localStorage.setItem(k,v)}catch(e){}}
var tm=null;function persist(){clearTimeout(tm);tm=setTimeout(function(){if(!S.id)return;lsset(DK+S.id,JSON.stringify({w:S.w,tut:S.tut,saved:new Date().toISOString()}));var s=$('#sv');if(s)s.textContent=tt('save')+' · '+new Date().toLocaleTimeString()},250)}
/* ---------- helpers de formulario ---------- */
function fld(lbl,p,o){o=o||{};var v=get(S.w,p),k=o.k||'str',val=v;
  if(k==='lines')val=(v||[]).join('\n');if(k==='ids')val=(v||[]).join(', ');if(k==='cols')val=(v||[]).join(' | ');if(k==='rows')val=(v||[]).map(function(r){return r.join(' | ')}).join('\n');if(k==='json')val=JSON.stringify(v==null?{}:v,null,1);
  var ml=o.rows||(k==='lines'||k==='rows'||k==='json'?4:0),a=' data-p="'+p+'" data-k="'+k+'"'+(o.ro?' readonly':'');
  var inp=ml?'<textarea rows="'+ml+'"'+a+'>'+esc(val)+'</textarea>':'<input type="'+(k==='num'?'number':'text')+'" value="'+esc(val==null?'':val)+'"'+a+'>';
  return '<label class="fl"><span>'+lbl+'</span>'+inp+(o.after||'')+'</label>'}
function btn(a,p,i,lbl,cls){return '<button type="button" class="btn o s '+(cls||'')+'" data-a="'+a+'" data-p="'+p+'"'+(i!=null?' data-i="'+i+'"':'')+'>'+lbl+'</button>'}
function sel(lbl,p,opts,val,k){return '<label class="fl"><span>'+lbl+'</span><select data-p="'+p+'" data-k="'+(k||'sel')+'">'+opts.map(function(o){return '<option value="'+esc(o[0])+'"'+(String(o[0])===String(val)?' selected':'')+'>'+esc(o[1])+'</option>'}).join('')+'</select></label>'}
function qform(p,pre){var q=get(S.w,p);return '<div class="qb">'+fld(tt('qq'),p+'.q')+[0,1,2,3].map(function(i){return fld(tt('opt')+' '+'ABCD'[i],p+'.o.'+i)}).join('')+
  sel(tt('ans'),p+'.a',[0,1,2,3].map(function(i){return [i,'ABCD'[i]+' · '+HV.short(q.o[i],40)]}),q.a,'int')+fld(tt('exp'),p+'.e',{rows:2})+'</div>'}
/* ---------- escenas ---------- */
function defScene(t){var W=HV.widgets();return{bul:{t:'bul',k:'',h:'',items:['']},tbl:{t:'tbl',k:'',h:'',cols:['A','B'],rows:[['','']]},fm:{t:'fm',k:'',h:'',f:'',n:''},viz:{t:'viz',w:W[0]||'concept',h:'',p:{}},'case':{t:'case',h:'',src:'',S:'',T:'',A:'',R:''}}[t]}
function sceneForm(p){var s=get(S.w,p);if(!s)return '';var h='';
  if(s.t==='bul')h=fld(tt('k'),p+'.k')+fld(tt('hh'),p+'.h')+fld(tt('items'),p+'.items',{k:'lines',rows:5});
  if(s.t==='tbl')h=fld(tt('k'),p+'.k')+fld(tt('hh'),p+'.h')+fld(tt('cols'),p+'.cols',{k:'cols'})+fld(tt('rows'),p+'.rows',{k:'rows',rows:6})+fld(tt('n'),p+'.n');
  if(s.t==='fm')h=fld(tt('k'),p+'.k')+fld(tt('hh'),p+'.h')+fld(tt('f'),p+'.f',{rows:5})+fld(tt('n'),p+'.n',{rows:2});
  if(s.t==='viz')h=sel(tt('w'),p+'.w',HV.widgets().map(function(x){return [x,x]}),s.w)+fld(tt('hh'),p+'.h')+fld(tt('vp'),p+'.p',{k:'json',rows:5})+'<div>'+btn('prev',p,null,tt('prev'))+'</div><div class="tu-prev" data-prev="'+p+'"></div>';
  if(s.t==='case')h=fld(tt('hh'),p+'.h')+fld(tt('src'),p+'.src')+['S','T','A','R'].map(function(k){return fld(tt('st_'+k),p+'.'+k,{rows:2})}).join('');
  return '<div class="sc">'+h+'</div>'}
function cueForm(lp,ci){var p=lp+'.cues.'+ci,c=get(S.w,p),n=HV.words(c.say),st=c.scene?c.scene.t:'';
  var opts=[['',tt('s_none')]].concat(HV.SCENES.map(function(t){return [t,tt('s_'+t)]}));
  var key=p;return '<details class="cue" data-key="'+key+'"'+(S.open[key]?' open':'')+'><summary><b>'+tt('cue')+' '+(ci+1)+'</b> · '+esc(HV.short(c.say,70))+(st?' <em>['+tt('s_'+st)+']</em>':'')+(c.q?' <em>[?]</em>':'')+'</summary>'+
   '<div class="tools">'+btn('up',lp+'.cues',ci,'▲')+btn('dn',lp+'.cues',ci,'▼')+btn('del',lp+'.cues',ci,tt('del'),'dg')+'</div>'+
   fld(tt('say')+' ('+n+' '+tt('words')+', ≈'+Math.round(Math.max(3.2,n/2.4+.8))+' s)',p+'.say',{rows:4})+
   sel(tt('scene'),p+'.scene',opts,st,'scenetype')+(c.scene?sceneForm(p+'.scene'):'')+
   (c.scene&&c.scene.t==='bul'?fld(tt('hl'),p+'.hl',{k:'int'}):'')+
   '<label class="fl ck"><input type="checkbox" data-p="'+p+'.lab" data-k="bool"'+(c.lab?' checked':'')+'> <span>'+tt('lab')+'</span></label>'+
   '<label class="fl ck"><input type="checkbox" data-p="'+p+'.q" data-k="cp"'+(c.q?' checked':'')+'> <span>'+tt('cp')+'</span></label>'+(c.q?qform(p+'.q'):'')+'</details>'}
/* ---------- vistas ---------- */
function navItems(){var c=S.w,a=[['meta',tt('n_meta')],['intro',tt('n_intro')],['comp',tt('n_comp')]];
  c.modules.forEach(function(m,mi){a.push(['m:'+mi,tt('module')+' '+(mi+1)+' · '+HV.short(m.title.replace(/^Módulo \d+ · /,''),34),0]);m.lessons.forEach(function(l,li){a.push(['l:'+mi+':'+li,l.id+' · '+HV.short(l.title,34),1])})});
  return a.concat([['exam',tt('n_exam')],['outro',tt('n_outro')],['dl',tt('n_dl')],['cases',tt('n_cases')],['refs',tt('n_refs')],['rev',tt('n_rev')]])}
function renderNav(){$('#tnav').innerHTML=navItems().map(function(x){return '<button type="button" class="'+(x[2]===1?'sub ':'')+(S.nav===x[0]?'on':'')+'" data-nav="'+x[0]+'">'+esc(x[1])+'</button>'}).join('')}
function listEd(arr,p,fields,addLbl,mk){return arr.map(function(it,i){return '<div class="qb"><div class="tools">'+btn('up',p,i,'▲')+btn('dn',p,i,'▼')+btn('del',p,i,tt('del'),'dg')+'</div>'+fields(i)+'</div>'}).join('')+'<div class="tools">'+btn('add',p,null,addLbl)+'</div>'}
function view(){var c=S.w,n=S.nav,h='';
  if(n==='meta')h=fld(tt('title'),'title')+fld(tt('subtitle'),'subtitle')+fld(tt('desc'),'desc',{rows:4})+fld(tt('obj'),'objectives',{k:'lines',rows:5})+fld(tt('labs'),'labs',{k:'lines',rows:4})+fld(tt('pm'),'practiceMin',{k:'num'});
  else if(n==='intro')h=fld(tt('hook'),'intro.hook',{rows:3})+fld(tt('q3'),'intro.questions',{k:'lines',rows:4})+'<h4>'+tt('star')+'</h4>'+['caso','S','T','A','R'].map(function(k){return fld(tt('st_'+k),'intro.star.'+k,{rows:k==='caso'?1:3})}).join('');
  else if(n==='comp')h=c.competencies.map(function(k,i){return '<div class="qb">'+fld(tt('cname'),'competencies.'+i+'.name')+fld(tt('clessons'),'competencies.'+i+'.lessons',{k:'ids'})+'</div>'}).join('');
  else if(n.indexOf('m:')===0){var mi=+n.slice(2),m=c.modules[mi],p='modules.'+mi;
    h='<div class="tools">'+btn('up','modules',mi,'▲')+btn('dn','modules',mi,'▼')+btn('del','modules',mi,tt('del'),'dg')+'</div>'+fld(tt('title'),p+'.title')+'<h4>'+tt('lesson')+'s</h4>'+m.lessons.map(function(l,li){return '<div class="qb"><div class="tools">'+btn('up',p+'.lessons',li,'▲')+btn('dn',p+'.lessons',li,'▼')+btn('del',p+'.lessons',li,tt('del'),'dg')+'<button type="button" class="btn o s" data-nav="l:'+mi+':'+li+'">'+esc(l.id+' · '+l.title)+'</button></div></div>'}).join('')+'<div class="tools">'+btn('addles',p+'.lessons',null,tt('addles'))+'</div>'+'<h4>'+tt('quiz')+'</h4>'+m.quiz.map(function(q,i){return qform(p+'.quiz.'+i)}).join('')}
  else if(n.indexOf('l:')===0){var a=n.split(':'),mi2=+a[1],li2=+a[2],lp='modules.'+mi2+'.lessons.'+li2,l=c.modules[mi2].lessons[li2];
    h=fld(tt('lid'),lp+'.id',{ro:1})+fld(tt('title'),lp+'.title')+fld(tt('lcomp'),lp+'.comp')+'<h4>'+tt('cues')+' ('+l.cues.reduce(function(s,q){return s+HV.words(q.say)},0)+' '+tt('words')+')</h4>'+l.cues.map(function(q,ci){return cueForm(lp,ci)}).join('')+'<div class="tools">'+btn('addcue',lp+'.cues',null,tt('addcue'))+'</div>'}
  else if(n==='exam')h='<h4>'+tt('exam6')+'</h4>'+c.exam.map(function(q,i){return qform('exam.'+i)}).join('');
  else if(n==='outro')h=fld(tt('phrase'),'outro.phrase',{rows:2})+fld(tt('recap'),'outro.recap',{k:'lines',rows:5});
  else if(n==='dl')h=listEd(c.downloads||[],'downloads',function(i){var p='downloads.'+i;return fld(tt('dfile'),p+'.file')+fld(tt('dtitle'),p+'.title')+fld(tt('ddesc'),p+'.desc',{rows:3})+fld(tt('dtask'),p+'.task',{rows:2})},tt('add'));
  else if(n==='cases')h=listEd(c.cases||[],'cases',function(i){var p='cases.'+i;return fld(tt('ctitle'),p+'.title')+fld(tt('ctext'),p+'.text',{rows:4})+fld(tt('src'),p+'.src')},tt('add'));
  else if(n==='refs')h=listEd(c.refs||[],'refs',function(i){var p='refs.'+i;return fld(tt('rtag'),p+'.tag')+fld(tt('rcite'),p+'.cite',{rows:3})+fld(tt('rwhy'),p+'.why')},tt('add'));
  else h='<div id="rv"></div>';
  $('#ted').innerHTML=h+(n==='rev'?'':'<p class="note-s">'+tt('cnt')+'</p>');if(n==='rev')review();renderNav()}
/* ---------- revisión y envío ---------- */
function msgOf(code){return tt('e_'+code)||code}
function review(){var r=HV.validate(S.w,S.orig),d=HV.diff(S.orig,S.w),ok=!r.errors.length,t=S.tut;
  var h='<h4>'+tt('changes')+' ('+d.length+')</h4>'+(d.length?'<div class="df">'+d.slice(0,60).map(function(x){return '<div class="'+x.k+'"><code>'+esc(x.p)+'</code>'+(x.k!=='add'?'<del>'+esc(HV.short(x.a,140))+'</del>':'')+(x.k!=='del'?'<ins>'+esc(HV.short(x.b,140))+'</ins>':'')+'</div>'}).join('')+(d.length>60?'<p class="note-s">…</p>':'')+'</div>':'<p class="note-s">'+tt('nochg')+'</p>');
  h+='<h4>'+tt('v_run')+': '+r.errors.length+' '+tt('v_err')+', '+r.warnings.length+' '+tt('v_warn')+'</h4>';
  if(ok)h+='<p class="okm">'+tt('v_ok')+'</p>';
  h+='<ul class="vl">'+r.errors.map(function(x){return '<li class="er"><code>'+esc(x.p)+'</code> '+msgOf(x.m)+'</li>'}).join('')+r.warnings.map(function(x){return '<li class="wr"><code>'+esc(x.p)+'</code> '+(tt('w_'+x.m))+'</li>'}).join('')+'</ul>';
  h+='<h4>'+tt('note')+'</h4><textarea rows="4" data-tp="note" id="tnote">'+esc(t.note)+'</textarea>'+
   '<label class="fl ck"><input type="checkbox" id="tdecl"'+(t.decl?' checked':'')+'> <span>'+tt('decl')+'</span></label>'+
   '<div class="tools"><button type="button" class="btn" id="tdl">'+tt('dl')+'</button><button type="button" class="btn o" id="tdraft">'+tt('exp')+'</button><label class="btn o" for="timp">'+tt('imp')+'</label><input type="file" id="timp" accept=".json,application/json" hidden></div><p class="note-s" id="tneed"></p><p class="note-s">'+tt('after')+'</p>';
  $('#rv').innerHTML=h;
  $('#tnote').addEventListener('input',function(e){S.tut.note=e.target.value;persist()});$('#tdecl').addEventListener('change',function(e){S.tut.decl=e.target.checked;persist()});
  $('#tdl').addEventListener('click',download);$('#tdraft').addEventListener('click',function(){save('h3l_borrador_'+S.id+'.json',{format:'h3l-borrador',course:S.id,w:S.w,tut:S.tut})});
  $('#timp').addEventListener('change',function(e){var f=e.target.files[0];if(!f)return;f.text().then(function(x){try{var j=JSON.parse(x);if(j.course!==S.id||!j.w)throw 0;S.w=j.w;S.tut=Object.assign(S.tut,j.tut||{});persist();view()}catch(er){alert('JSON')}})})}
function save(name,obj){var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(obj,null,1)],{type:'application/json'}));a.download=name;document.body.appendChild(a);a.click();a.remove()}
function download(){var r=HV.validate(S.w,S.orig),t=S.tut;if(r.errors.length||!t.name.trim()||!/^\S+@\S+\.\S+$/.test(t.email)||!t.decl){$('#tneed').textContent=tt('need');return}
  Promise.all([HV.hash(S.orig),HV.hash(S.w)]).then(function(h){var d=new Date().toISOString();
    save('propuesta_'+S.id+'_'+d.slice(0,10)+'.json',{format:'h3l-propuesta',version:1,course:S.id,created:d,tutor:{name:t.name.trim(),email:t.email.trim()},note:t.note,declaration:true,base:h[0],hash:h[1],data:S.w});$('#tneed').textContent=''})}
/* ---------- eventos ---------- */
function applyField(el){var p=el.getAttribute('data-p'),k=el.getAttribute('data-k'),v=el.value;if(!p)return;
  if(k==='num')v=v===''?0:parseFloat(v);else if(k==='int'){v=v===''?null:parseInt(v,10);if(v==null||isNaN(v)){set(S.w,p,undefined);persist();return}}
  else if(k==='lines')v=v.split('\n').map(function(x){return x.trim()}).filter(Boolean);
  else if(k==='cols')v=v.split('|').map(function(x){return x.trim()});
  else if(k==='rows')v=v.split('\n').filter(function(x){return x.trim()}).map(function(r){return r.split('|').map(function(x){return x.trim()})});
  else if(k==='ids')v=v.split(',').map(function(x){return x.trim()}).filter(Boolean);
  else if(k==='bool')v=el.checked;
  else if(k==='json'){try{v=JSON.parse(v||'{}');el.classList.remove('bad')}catch(e){el.classList.add('bad');return}}
  set(S.w,p,v);persist()}
function arr(p){return get(S.w,p)}
function onAct(b){var a=b.getAttribute('data-a'),p=b.getAttribute('data-p'),i=+b.getAttribute('data-i'),A=a==='addcue'||a==='add'||a==='addles'||a==='addmod'||a==='prev'?null:arr(p);
  if(a==='up'&&i>0){var t=A[i];A[i]=A[i-1];A[i-1]=t}
  else if(a==='dn'&&i<A.length-1){var t2=A[i];A[i]=A[i+1];A[i+1]=t2}
  else if(a==='del'){if(!confirm(tt('delc')))return;var rem=A[i];A.splice(i,1);if(p.slice(-7)==='lessons'&&rem.id)S.w.competencies.forEach(function(k){k.lessons=(k.lessons||[]).filter(function(x){return x!==rem.id})});if(p==='modules'&&rem.lessons){rem.lessons.forEach(function(l){S.w.competencies.forEach(function(k){k.lessons=(k.lessons||[]).filter(function(x){return x!==l.id})})});S.nav='meta'}if(/lessons$/.test(p)&&S.nav.indexOf('l:')===0)S.nav='meta'}
  else if(a==='addcue')arr(p).push({say:''});
  else if(a==='add'){var proto={downloads:{file:'xlsx/',title:'',desc:'',task:''},cases:{title:'',text:'',src:''},refs:{tag:'Paper',cite:'',why:''}};if(!arr(p))set(S.w,p,[]);arr(p).push(clone(proto[p]))}
  else if(a==='addles'){var mi=+p.split('.')[1],ids={};S.w.modules.forEach(function(m){m.lessons.forEach(function(l){ids[l.id]=1})});var n=1,id;do{id='t'+(n++)}while(ids[id]);
    var comp=(S.w.modules[mi].lessons[0]||{}).comp||(S.w.competencies[0]||{}).name||'General';S.w.modules[mi].lessons.push({id:id,title:'Nueva lección',comp:comp,cues:[{say:''}]});
    var k=S.w.competencies.filter(function(x){return x.name===comp})[0];if(k)k.lessons.push(id);else S.w.competencies.push({name:comp,lessons:[id]})}
  else if(a==='prev'){var s=get(S.w,p),box=document.querySelector('[data-prev="'+p+'"]');if(box&&window.HW){box.innerHTML='';var st=HC.el('div',{'class':'stage'});box.appendChild(st);try{window.HW.build(s.w,st,s.p,{touch:function(){}})}catch(e){box.textContent=String(e)}}return}
  persist();view()}
function bind(){var ed=$('#ted');
  ed.addEventListener('input',function(e){var el=e.target;if(el.matches&&el.matches('[data-p]')&&!/select|checkbox/.test(el.type)&&el.tagName!=='SELECT')applyField(el)});
  ed.addEventListener('change',function(e){var el=e.target,k=el.getAttribute&&el.getAttribute('data-k');if(!k)return;
    if(k==='scenetype'){var p=el.getAttribute('data-p'),cp=p.slice(0,-6);if(el.value){set(S.w,p,defScene(el.value))}else{var c=get(S.w,cp);delete c.scene;delete c.hl}persist();view();return}
    if(k==='cp'){var q=el.getAttribute('data-p'),cp2=q.slice(0,-2),cu=get(S.w,cp2);if(el.checked)cu.q={q:'',o:['','','',''],a:0,e:''};else delete cu.q;persist();view();return}
    if(k==='sel'){var pp=el.getAttribute('data-p');set(S.w,pp,el.value);if(/\.w$/.test(pp)){var sc=get(S.w,pp.slice(0,-2));sc.p={}}persist();view();return}
    if(k==='int'&&el.tagName==='SELECT'){set(S.w,el.getAttribute('data-p'),parseInt(el.value,10));persist();return}
    if(k==='bool'){set(S.w,el.getAttribute('data-p'),el.checked);persist();return}
    if(k==='json'){applyField(el);return}
    if(k==='lines'||k==='rows'||k==='cols'||k==='ids')view()});
  ed.addEventListener('click',function(e){var b=e.target.closest('[data-a]');if(b)onAct(b);var nv=e.target.closest('[data-nav]');if(nv){S.nav=nv.getAttribute('data-nav');view();window.scrollTo(0,0)}});
  ed.addEventListener('toggle',function(e){var d=e.target;if(d.matches&&d.matches('details.cue'))S.open[d.getAttribute('data-key')]=d.open},true);
  $('#tnav').addEventListener('click',function(e){var b=e.target.closest('[data-nav]');if(b){S.nav=b.getAttribute('data-nav');view();window.scrollTo(0,0)}})}
/* ---------- barra superior y carga ---------- */
function bar(){var cs=S.cat.courses;$('#tbar').innerHTML='<label class="fl"><span>'+tt('course')+'</span><select id="csel">'+cs.map(function(c){return '<option value="'+c.id+'"'+(c.id===S.id?' selected':'')+'>'+esc(c.title)+'</option>'}).join('')+'</select></label>'+
  '<label class="fl"><span>'+tt('tname')+'</span><input type="text" id="tn" value="'+esc(S.tut.name)+'" autocomplete="name"></label><label class="fl"><span>'+tt('tmail')+'</span><input type="email" id="tm" value="'+esc(S.tut.email)+'" autocomplete="email"></label>'+
  '<div class="tools"><button type="button" class="btn o" id="tdis">'+tt('discard')+'</button><span class="note-s" id="sv"></span></div>';
  $('#csel').addEventListener('change',function(e){load(e.target.value)});
  $('#tn').addEventListener('input',function(e){S.tut.name=e.target.value;persist();ident()});$('#tm').addEventListener('input',function(e){S.tut.email=e.target.value;persist();ident()});
  $('#tdis').addEventListener('click',function(){if(!confirm(tt('discard_q')))return;try{localStorage.removeItem(DK+S.id)}catch(e){}load(S.id,true)})}
function ident(){lsset('h3l-tutor-who',JSON.stringify({name:S.tut.name,email:S.tut.email}))}
function load(id,fresh){S.id=id;lsset(TK,id);fetch('data/'+id+'.json').then(function(r){return r.json()}).then(function(c){S.orig=c;S.w=clone(c);S.nav='meta';S.open={};
  var who={};try{who=JSON.parse(lsget('h3l-tutor-who')||'{}')}catch(e){}S.tut={name:who.name||'',email:who.email||'',note:'',decl:false};
  var d=!fresh&&lsget(DK+id);if(d){try{var j=JSON.parse(d);if(j.w){S.w=j.w;S.tut=Object.assign(S.tut,j.tut||{});S.msg=tt('loaded')}}catch(e){}}
  bar();view();if(S.msg){var s=$('#sv');if(s)s.textContent=S.msg;S.msg=''}})}
function head(){$('#tt-h').textContent=tt('h');$('#tt-p').textContent=tt('p')}
HC.langSelect($('#lang'));HC.apply();head();bind();
HC.onlang=function(){HC.apply();head();if(S.cat){bar();view()}};
HC.loadCatalog().then(function(c){S.cat=c;var id=new URLSearchParams(location.search).get('c')||lsget(TK)||c.courses[0].id;if(!c.courses.some(function(x){return x.id===id}))id=c.courses[0].id;load(id)});
})();
