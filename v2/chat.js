/* H3L Copilot · asistente de la v2. Respuestas guiadas, sin servidor. Desarrollado por Leandro Collell. */
(function(){'use strict';
var NAME='H3L Copilot';
var LK={calc:'../index.html?go=calculators',ag:'../index.html?go=agentes',tab:'dashboards.html',con:'../index.html?go=contacto',nos:'../index.html?go=somos'};
/* textos por idioma: ui, enlaces, base de respuestas (k = palabras clave sin acentos), respuesta por defecto y botones */
var T={
es:{ui:{open:'Abrir chat con H3L Copilot',dlg:'Chat con H3L Copilot',sub:'Asistente de demostración',close:'Cerrar el chat',ph:'Escribí tu consulta',ql:'Tu consulta',send:'Enviar',ft:'Respuestas guiadas con datos de demostración. Para una consulta técnica, solicitá una demostración.',hi:'Hola, soy H3L Copilot. Puedo orientarte sobre las calculadoras, los agentes de IA y los tableros de H3L.'},
 lk:{calc:'Ver las calculadoras',ag:'Ver los agentes de IA',tab:'Ver los tableros',con:'Solicitar una demostración',nos:'Conocer a H3L'},
 kb:[
 {k:['hola','buenas','buen dia','buenos'],t:'Hola, soy H3L Copilot. Puedo orientarte sobre las calculadoras, los agentes de IA y los tableros de decisión de H3L. ¿Por dónde querés empezar?',l:[]},
 {k:['calculadora','ooip','reserv','prms','hidrogeno','h2','co2','esg','emision','carbono'],t:'H3L reúne calculadoras de ingeniería para petróleo y gas y transición energética: volumen original in situ (OOIP), reservas con criterio SPE-PRMS, declinación, hidrógeno verde, emisiones de CO₂ y puntaje ESG. Cada cálculo muestra sus supuestos.',l:['calc']},
 {k:['agente','agent','ia ','inteligencia','automat'],t:'Los agentes de IA de H3L trabajan en cuatro roles: el Vigía revisa los datos, el Analista corre los cálculos, el Auditor comprueba reglas y fuentes, y el Redactor arma la recomendación. Ninguno decide por su cuenta: la aprobación es de una persona y queda registrada.',l:['ag','tab']},
 {k:['tablero','dashboard','decision','kpi','indicador'],t:'Los tableros de demostración muestran cinco tipos de decisión: estratégica, operativa, táctica, de reservas y de transición. Cada uno tiene una lectura integrada que relaciona los gráficos y una decisión sugerida con su resultado. Las cifras son ilustrativas.',l:['tab']},
 {k:['precio','costo','cuanto','cotiz','tarifa','plan','pagar'],t:'No hay un precio fijo: se cotiza según la decisión que quieras resolver, los datos disponibles y los agentes que se necesiten. Lo más rápido es pedir una demostración con una pregunta y una muestra de datos.',l:['con']},
 {k:['contact','demostr','demo','reunion','hablar','mail','correo','escribir'],t:'Podés solicitar una demostración desde el formulario de contacto. Traé una pregunta concreta y una muestra de datos, y te mostramos cómo quedaría tu tablero.',l:['con']},
 {k:['quien','nosotros','h3l','empresa','somos','leandro'],t:'H3L Global Energy desarrolla herramientas técnicas y de IA para petróleo y gas y transición energética. El sitio y las herramientas son desarrollo de Leandro Collell, ingeniero industrial con más de 20 años de experiencia en upstream.',l:['nos']},
 {k:['dato','segur','audit','trazab','registro','confiden'],t:'Cada decisión aprobada deja un registro con la fecha, los datos y fuentes usados, la versión del cálculo y quién aprobó. Para tus datos reales, las condiciones de seguridad se acuerdan en el proyecto.',l:['con']},
 {k:['gracias','chau','adios'],t:'De nada. Si más adelante querés ver tu caso en un tablero, pedí una demostración.',l:['con']}],
 def:{t:'Todavía no tengo una respuesta guiada para eso. Puedo contarte sobre las calculadoras, los agentes de IA, los tableros o cómo solicitar una demostración.',l:['calc','ag','tab','con']},
 chips:[['Calculadoras','calculadoras'],['Agentes de IA','agentes'],['Tableros de decisión','tableros'],['Solicitar demostración','demostración']]},
en:{ui:{open:'Open chat with H3L Copilot',dlg:'Chat with H3L Copilot',sub:'Demo assistant',close:'Close chat',ph:'Type your question',ql:'Your question',send:'Send',ft:'Guided answers with demo data. For a technical question, request a demo.',hi:"Hi, I'm H3L Copilot. I can guide you through H3L's calculators, AI agents and decision boards."},
 lk:{calc:'See the calculators',ag:'See the AI agents',tab:'See the boards',con:'Request a demo',nos:'About H3L'},
 kb:[
 {k:['hello','hi ','hey','good morning','good afternoon'],t:"Hi, I'm H3L Copilot. I can guide you through H3L's calculators, AI agents and decision boards. Where would you like to start?",l:[]},
 {k:['calculator','ooip','reserve','prms','hydrogen','h2','co2','esg','emission','carbon'],t:'H3L brings together engineering calculators for oil and gas and the energy transition: original oil in place (OOIP), reserves under SPE-PRMS criteria, decline, green hydrogen, CO₂ emissions and ESG score. Every calculation shows its assumptions.',l:['calc']},
 {k:['agent','ai ','artificial','automat'],t:'H3L AI agents work in four roles: the Watcher reviews the data, the Analyst runs the calculations, the Auditor checks rules and sources, and the Writer drafts the recommendation. None decides on its own: a person approves, and the approval is logged.',l:['ag','tab']},
 {k:['board','dashboard','decision','kpi','indicator'],t:'The demo boards show five kinds of decision: strategic, operational, tactical, reserves and transition. Each has an integrated reading that ties the charts together and a suggested decision with its outcome. Figures are illustrative.',l:['tab']},
 {k:['price','cost','how much','quote','pricing','plan','pay'],t:'There is no fixed price: it is quoted by the decision you want to settle, the data available and the agents needed. The quickest route is to request a demo with one question and a data sample.',l:['con']},
 {k:['contact','demo','meeting','talk','mail','email','write'],t:'You can request a demo from the contact form. Bring one concrete question and a data sample, and we will show you what your board would look like.',l:['con']},
 {k:['who','about','h3l','company','leandro'],t:'H3L Global Energy builds technical and AI tools for oil and gas and the energy transition. The site and tools were developed by Leandro Collell, an industrial engineer with over 20 years of upstream experience.',l:['nos']},
 {k:['data','secur','audit','trace','record','confiden'],t:'Every approved decision leaves a record with the date, the data and sources used, the calculation version and who approved it. For your real data, security terms are agreed in the project.',l:['con']},
 {k:['thanks','thank you','bye'],t:'You are welcome. If you want to see your case on a board later, request a demo.',l:['con']}],
 def:{t:"I don't have a guided answer for that yet. I can tell you about the calculators, the AI agents, the boards, or how to request a demo.",l:['calc','ag','tab','con']},
 chips:[['Calculators','calculators'],['AI agents','agents'],['Decision boards','boards'],['Request a demo','demo']]},
fr:{ui:{open:'Ouvrir le chat avec H3L Copilot',dlg:'Chat avec H3L Copilot',sub:'Assistant de démonstration',close:'Fermer le chat',ph:'Écrivez votre question',ql:'Votre question',send:'Envoyer',ft:"Réponses guidées avec des données de démonstration. Pour une question technique, demandez une démonstration.",hi:"Bonjour, je suis H3L Copilot. Je peux vous orienter parmi les calculateurs, les agents IA et les tableaux de H3L."},
 lk:{calc:'Voir les calculateurs',ag:"Voir les agents IA",tab:'Voir les tableaux',con:'Demander une démonstration',nos:'Découvrir H3L'},
 kb:[
 {k:['bonjour','salut','bonsoir','coucou'],t:"Bonjour, je suis H3L Copilot. Je peux vous orienter parmi les calculateurs, les agents IA et les tableaux de décision de H3L. Par où voulez-vous commencer ?",l:[]},
 {k:['calculateur','ooip','reserve','prms','hydrogene','h2','co2','esg','emission','carbone'],t:"H3L réunit des calculateurs d'ingénierie pour le pétrole et le gaz et la transition énergétique : volume original en place (OOIP), réserves selon les critères SPE-PRMS, déclin, hydrogène vert, émissions de CO₂ et score ESG. Chaque calcul affiche ses hypothèses.",l:['calc']},
 {k:['agent','ia ','intelligence','automat'],t:"Les agents IA de H3L travaillent en quatre rôles : la Vigie examine les données, l'Analyste exécute les calculs, l'Auditeur vérifie les règles et les sources, et le Rédacteur prépare la recommandation. Aucun ne décide seul : l'approbation revient à une personne et elle est consignée.",l:['ag','tab']},
 {k:['tableau','dashboard','decision','kpi','indicateur'],t:"Les tableaux de démonstration présentent cinq types de décision : stratégique, opérationnelle, tactique, de réserves et de transition. Chacun comporte une lecture intégrée qui relie les graphiques et une décision suggérée avec son résultat. Les chiffres sont illustratifs.",l:['tab']},
 {k:['prix','cout','combien','devis','tarif','forfait','payer'],t:"Il n'y a pas de prix fixe : le devis dépend de la décision à résoudre, des données disponibles et des agents nécessaires. Le plus rapide est de demander une démonstration avec une question et un échantillon de données.",l:['con']},
 {k:['contact','demo','reunion','parler','mail','courriel','ecrire'],t:"Vous pouvez demander une démonstration depuis le formulaire de contact. Apportez une question concrète et un échantillon de données, et nous vous montrons à quoi ressemblerait votre tableau.",l:['con']},
 {k:['qui','propos','h3l','entreprise','societe','leandro'],t:"H3L Global Energy développe des outils techniques et d'IA pour le pétrole et le gaz et la transition énergétique. Le site et les outils sont l'œuvre de Leandro Collell, ingénieur industriel avec plus de 20 ans d'expérience en amont.",l:['nos']},
 {k:['donnee','securite','audit','tracab','registre','confiden'],t:"Chaque décision approuvée laisse une trace avec la date, les données et sources utilisées, la version du calcul et la personne qui l'a approuvée. Pour vos données réelles, les conditions de sécurité sont convenues dans le projet.",l:['con']},
 {k:['merci','au revoir','salut'],t:"Avec plaisir. Si vous souhaitez voir votre cas dans un tableau, demandez une démonstration.",l:['con']}],
 def:{t:"Je n'ai pas encore de réponse guidée pour cela. Je peux vous parler des calculateurs, des agents IA, des tableaux ou de la façon de demander une démonstration.",l:['calc','ag','tab','con']},
 chips:[['Calculateurs','calculateurs'],['Agents IA','agents'],['Tableaux de décision','tableaux'],['Demander une démonstration','démonstration']]},
pt:{ui:{open:'Abrir chat com o H3L Copilot',dlg:'Chat com o H3L Copilot',sub:'Assistente de demonstração',close:'Fechar o chat',ph:'Escreva sua pergunta',ql:'Sua pergunta',send:'Enviar',ft:'Respostas guiadas com dados de demonstração. Para uma consulta técnica, solicite uma demonstração.',hi:'Olá, sou o H3L Copilot. Posso orientar você sobre as calculadoras, os agentes de IA e os painéis da H3L.'},
 lk:{calc:'Ver as calculadoras',ag:'Ver os agentes de IA',tab:'Ver os painéis',con:'Solicitar uma demonstração',nos:'Conhecer a H3L'},
 kb:[
 {k:['ola','oi ','bom dia','boa tarde','boa noite'],t:'Olá, sou o H3L Copilot. Posso orientar você sobre as calculadoras, os agentes de IA e os painéis de decisão da H3L. Por onde quer começar?',l:[]},
 {k:['calculadora','ooip','reserv','prms','hidrogenio','h2','co2','esg','emissao','carbono'],t:'A H3L reúne calculadoras de engenharia para petróleo e gás e transição energética: volume original in situ (OOIP), reservas pelo critério SPE-PRMS, declínio, hidrogênio verde, emissões de CO₂ e pontuação ESG. Cada cálculo mostra suas premissas.',l:['calc']},
 {k:['agente','agent','ia ','inteligencia','automat'],t:'Os agentes de IA da H3L trabalham em quatro papéis: o Vigia revisa os dados, o Analista roda os cálculos, o Auditor confere regras e fontes, e o Redator monta a recomendação. Nenhum decide sozinho: a aprovação é de uma pessoa e fica registrada.',l:['ag','tab']},
 {k:['painel','paineis','dashboard','decisao','kpi','indicador'],t:'Os painéis de demonstração mostram cinco tipos de decisão: estratégica, operacional, tática, de reservas e de transição. Cada um tem uma leitura integrada que relaciona os gráficos e uma decisão sugerida com seu resultado. Os números são ilustrativos.',l:['tab']},
 {k:['preco','custo','quanto','cotacao','tarifa','plano','pagar'],t:'Não há preço fixo: a cotação depende da decisão que você quer resolver, dos dados disponíveis e dos agentes necessários. O mais rápido é pedir uma demonstração com uma pergunta e uma amostra de dados.',l:['con']},
 {k:['contato','demonstr','demo','reuniao','falar','mail','email','escrever'],t:'Você pode solicitar uma demonstração pelo formulário de contato. Traga uma pergunta concreta e uma amostra de dados, e mostramos como ficaria o seu painel.',l:['con']},
 {k:['quem','nos','h3l','empresa','somos','leandro'],t:'A H3L Global Energy desenvolve ferramentas técnicas e de IA para petróleo e gás e transição energética. O site e as ferramentas são desenvolvimento de Leandro Collell, engenheiro industrial com mais de 20 anos de experiência em upstream.',l:['nos']},
 {k:['dado','seguran','audit','rastre','registro','confiden'],t:'Cada decisão aprovada deixa um registro com a data, os dados e fontes usados, a versão do cálculo e quem aprovou. Para seus dados reais, as condições de segurança são combinadas no projeto.',l:['con']},
 {k:['obrigado','obrigada','tchau','valeu'],t:'De nada. Se depois quiser ver o seu caso em um painel, peça uma demonstração.',l:['con']}],
 def:{t:'Ainda não tenho uma resposta guiada para isso. Posso falar sobre as calculadoras, os agentes de IA, os painéis ou como solicitar uma demonstração.',l:['calc','ag','tab','con']},
 chips:[['Calculadoras','calculadoras'],['Agentes de IA','agentes'],['Painéis de decisão','painéis'],['Solicitar demonstração','demonstração']]}
};
function cl(){var l=(window.H3L&&H3L.lang)||'es';return T[l]||T.es}
function norm(s){s=String(s).toLowerCase();return s.normalize?s.normalize('NFD').replace(/[̀-ͯ]/g,''):s}
function answer(q){var c=cl(),n=' '+norm(q)+' ';for(var i=0;i<c.kb.length;i++)for(var j=0;j<c.kb[i].k.length;j++)if(n.indexOf(norm(c.kb[i].k[j]))>=0)return c.kb[i];return c.def}

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
var btn=el('button',{id:'h3c-btn',type:'button','aria-expanded':'false','aria-controls':'h3c-p'},document.body);
btn.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/></svg>';
var p=el('div',{id:'h3c-p',role:'dialog'},document.body);
var hd=el('div',{'class':'hd'},p),hb=el('div',null,hd),lg=el('div',{'class':'lg'},hb);lg.innerHTML='H<b>3</b>L Copilot';
var sb=el('div',{'class':'sb'},hb);
var x=el('button',{'class':'x',type:'button'},hd,'×');
var log=el('div',{'class':'log',role:'log','aria-live':'polite'},p);
var chips=el('div',{'class':'ch'},p);
var form=el('form',null,p),inp=el('input',{type:'text',autocomplete:'off',maxlength:'200'},form),sendB=el('button',{type:'submit'},form);
var ft=el('div',{'class':'ft'},p);

function add(txt,me,links){var m=el('div',{'class':'m '+(me?'me':'bot')},log,txt);
  if(links&&links.length){var d=el('div',{'class':'lk'},m);links.forEach(function(k){el('a',{href:LK[k]},d,cl().lk[k])})}
  log.scrollTop=log.scrollHeight}
function ask(q){q=q.trim();if(!q)return;add(q,true);var r=answer(q);setTimeout(function(){add(r.t,false,r.l)},reduce()?0:450)}
function reduce(){try{return matchMedia('(prefers-reduced-motion: reduce)').matches}catch(e){return false}}
/* textos de la interfaz: se vuelven a escribir al cambiar de idioma */
function paint(){var c=cl(),u=c.ui;
  btn.setAttribute('aria-label',u.open);p.setAttribute('aria-label',u.dlg);sb.textContent=u.sub;x.setAttribute('aria-label',u.close);
  inp.setAttribute('placeholder',u.ph);inp.setAttribute('aria-label',u.ql);sendB.textContent=u.send;ft.textContent=u.ft;
  chips.innerHTML='';c.chips.forEach(function(ch){var b=el('button',{type:'button'},chips,ch[0]);b.addEventListener('click',function(){ask(ch[1])})});
  log.innerHTML='';add(u.hi,false)}
paint();
if(window.H3L)H3L.on(paint);

var open=false;
function set(o){open=o;p.classList.toggle('open',o);btn.setAttribute('aria-expanded',o?'true':'false');if(o){setTimeout(function(){try{inp.focus({preventScroll:true})}catch(e){}},30)}else{try{btn.focus({preventScroll:true})}catch(e){}}}
btn.addEventListener('click',function(){set(!open)});x.addEventListener('click',function(){set(false)});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&open)set(false)});
form.addEventListener('submit',function(e){e.preventDefault();var v=inp.value;inp.value='';ask(v)});

/* en la portada, el botón aparece cuando termina la introducción */
function ready(){var ld=document.getElementById('loader'),g=document.getElementById('gate');if(!ld)return true;return getComputedStyle(ld).display==='none'&&(!g||g.hidden)}
(function wait(){if(ready())btn.classList.add('on');else setTimeout(wait,300)})();
})();
