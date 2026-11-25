"use strict";
/* ============ utilidades ============ */
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const mmss=s=>String(Math.floor(s/60)).padStart(2,"0")+":"+String(Math.floor(s%60)).padStart(2,"0");
const now=()=>new Date().toLocaleString("es-AR",{dateStyle:"short",timeStyle:"short"});
const num=v=>{const n=parseFloat(String(v).replace(",","."));return isFinite(n)?n:null};
const pct=n=>n==null?"—":Math.round(n)+" %";
const KEY="h3l_campus_demo_v1";
function toast(m){const d=document.createElement("div");d.textContent=m;$("#toast").appendChild(d);setTimeout(()=>d.remove(),4200)}

/* ============ datos de ejemplo (ficticios) ============ */
const ME="s1", REF_N=85, TOL=5; // N de referencia (MMSTB) y tolerancia (%) del problema didáctico
const DATASET=[[0.020,1.72],[0.035,2.95],[0.050,4.30],[0.065,5.50],[0.080,6.85]]; // [Et rb/STB, F MMrb] — datos didácticos sintéticos
const CRIT=[["Datos y unidades",20],["Ajuste y cálculo de N",40],["Mecanismo de empuje",20],["Justificación técnica",20]];
const WEIGHTS={act:40,eval:50,foro:10}, APRUEBA=60, ASIST_MIN=75;
const CHAPTERS=[
 {t:0,  title:"Idea central: el reservorio como tanque", sec:"ap1"},
 {t:150,title:"Ecuación general y términos Eo, Eg, Efw",  sec:"ap2"},
 {t:420,title:"Método de Havlena-Odeh: F vs Et",          sec:"ap3"},
 {t:660,title:"Cómo identificar el mecanismo de empuje",  sec:"ap4"},
 {t:840,title:"Ejemplo guiado y cierre → Actividad",      sec:"ap5"}];
const PL={welcome:{dur:95,title:"Capacitación H3L: presentación del campus y de la metodología"},
          clase:{dur:960,title:"Clase 1 · Balance de materiales (video del curso)"}};
const SEC={
 ap1:["1. Idea central",`<p>El balance de materiales aplica la conservación de masa al reservorio, tratado como un <b>tanque</b>: lo que se extrae (vaciamiento) debe igualarse con la expansión de los fluidos y de la roca más la entrada de agua.</p><div class="note"><b>Nota aclaratoria.</b> «Tanque» significa modelo de parámetros concentrados: sin geometría ni heterogeneidad espacial.</div>`],
 ap2:["2. Ecuación general (Havlena–Odeh)",`<div class="f">F = N·(Eo + m·Eg + Efw) + We</div><div class="f">F = Np·[Bo + (Rp − Rs)·Bg] + Wp·Bw<br>Eo = (Bo − Boi) + (Rsi − Rs)·Bg<br>Eg = Boi·(Bg/Bgi − 1)<br>Efw = (1+m)·Boi·[(cw·Swc + cf)/(1 − Swc)]·Δp</div><p class="sm mu">N: petróleo original in situ · m: relación casquete de gas / zona de petróleo · We: entrada de agua. Bo, Rs y Bg provienen del análisis PVT.</p>`],
 ap3:["3. Método de la línea recta",`<p>En un reservorio subsaturado sin acuífero, <b>F = N·Et</b> con Et = Eo + Efw: al graficar F vs Et se obtiene una recta por el origen cuya <b>pendiente es N</b>.</p><div class="note"><b>Nota aclaratoria.</b> Al graficar F/Et vs Np, una línea horizontal indica reservorio volumétrico; una tendencia creciente sugiere entrada de agua (We).</div>`],
 ap4:["4. Mecanismos de empuje",`<ul><li>Expansión de petróleo, agua connata y roca (por encima de la presión de burbuja).</li><li>Gas en solución (por debajo de la presión de burbuja).</li><li>Casquete de gas (m &gt; 0).</li><li>Empuje por agua (We &gt; 0).</li><li>Combinado: se separa cada aporte con los términos del balance.</li></ul>`],
 ap5:["5. Ejemplo guiado → Actividad",`<p>Con los datos de la pestaña <b>Actividad</b> (Et y F), ajuste la recta por el origen, estime N, identifique el mecanismo y justifique. La estimación se carga en el sitio para que la evalúe el docente.</p>`]};
const MATERIAL=[
 {id:"mt1",t:"Apunte de la clase 1 (en el sitio)",k:"Apunte",ch:"Cap. 1–5 (00:00–16:00)",vis:true,inline:true},
 {id:"mt2",t:"Presentación de la clase 1 (PDF)",k:"Presentación",ch:"Cap. 1–3 (00:00–11:00)",vis:true},
 {id:"mt3",t:"Datos de la actividad (CSV)",k:"Datos",ch:"Cap. 5 (14:00)",vis:true,csv:true},
 {id:"mt4",t:"Guía de problemas resueltos (PDF)",k:"Guía",ch:"Cap. 3–4 (07:00–14:00)",vis:false},
 {id:"mt5",t:"Bibliografía sugerida",k:"Lectura",ch:"Complementaria",vis:true,bib:true}];
const BIB=["Havlena, D. y Odeh, A.S. (1963). The Material Balance as an Equation of a Straight Line. Journal of Petroleum Technology.","Dake, L.P. (1978). Fundamentals of Reservoir Engineering. Elsevier.","Craft, B.C. y Hawkins, M.F. Applied Petroleum Reservoir Engineering.","Ahmed, T. Reservoir Engineering Handbook. Gulf Professional Publishing."];
const QUIZ=[
 {q:"En F = N·(Eo + m·Eg + Efw) + We, ¿qué representa F?",o:["El vaciamiento total: producción acumulada expresada en condiciones de reservorio","La expansión del casquete de gas","La entrada de agua acumulada"],a:0,e:"F = Np·[Bo + (Rp − Rs)·Bg] + Wp·Bw reúne todo lo extraído, a condiciones de reservorio."},
 {q:"Reservorio subsaturado, sin acuífero ni casquete: ¿qué se obtiene al graficar F vs Et?",o:["Una curva decreciente","Una recta por el origen cuya pendiente es N","Una recta horizontal igual a We"],a:1,e:"Con m = 0 y We = 0, F = N·Et."},
 {q:"Al graficar F/Et vs Np, una línea horizontal indica…",o:["Reservorio volumétrico; su valor es N","Entrada de agua intensa","Casquete de gas dominante"],a:0,e:"Sin We el cociente F/Et se mantiene constante e igual a N."}];

function seed(){
 const st=(n,i,e,m,ul)=>({id:i,nombre:n,rol:"alumno",email:e,estado:"activo",mfa:m,ult:ul});
 const U=[{id:"a0",nombre:"Administrador/a H3L",rol:"admin",email:"admin@demo.example",estado:"activo",mfa:true,ult:"21/11/26 16:10"},
  {id:"d1",nombre:"Docente titular",rol:"profesor",email:"docente.titular@demo.example",estado:"activo",mfa:true,ult:"21/11/26 16:02"},
  {id:"d2",nombre:"Docente auxiliar",rol:"profesor",email:"docente.aux@demo.example",estado:"activo",mfa:true,ult:"20/11/26 09:40"},
  st("Camila Ríos","s1","camila@demo.example",false,"21/11/26 15:50"),st("Tomás Benítez","s2","tomas@demo.example",false,"20/11/26 21:12"),
  st("Lucía Ferreyra","s3","lucia@demo.example",true,"21/11/26 10:05"),st("Mateo Salinas","s4","mateo@demo.example",false,"14/11/26 19:30"),
  st("Valentina Paz","s5","valentina@demo.example",false,"19/11/26 08:15"),{...st("Joaquín Molina","s6","joaquin@demo.example",false,"—"),estado:"pendiente"}];
 const sub=(id,pts,mech,just,grade)=>({pts,mech,just,file:"",ts:"19/11/26 20:05",grade});
 return {users:U,
  sessions:[{id:"c1",fecha:"2026-11-07",tema:"Introducción al balance de materiales",mod:"Presencial",rec:false,dl:false},
   {id:"c2",fecha:"2026-11-14",tema:"Ecuación general y Havlena-Odeh",mod:"Virtual",rec:true,dl:true,recName:"Clase_2_Reservorios.mp4"},
   {id:"c3",fecha:"2026-11-21",tema:"Mecanismos de empuje",mod:"Híbrida",rec:true,dl:false,recName:"Clase_3_Reservorios.mp4"},
   {id:"c4",fecha:"2026-11-28",tema:"Taller con datos de producción",mod:"Virtual",rec:false,dl:false}],
  att:{c1:{s1:"P",s2:"P",s3:"A",s4:"P",s5:"P",s6:"J"},c2:{s1:"V",s2:"V",s3:"V",s4:"A",s5:"V",s6:"V"},c3:{},c4:{}},
  subs:{s2:sub("s2",DATASET.map(r=>r.slice()),"Empuje por agua","La recta no pasa exactamente por el origen y F/Et crece con Np.",{scores:[18,30,12,14],fb:"Buen ajuste. Revise por qué descarta el casquete de gas.",total:74,date:"20/11/26"}),
         s3:sub("s3",DATASET.map(r=>r.slice()),"Volumétrico (expansión de fluidos y roca)","F/Et se mantiene aproximadamente constante.",{scores:[20,38,18,18],fb:"Excelente.",total:94,date:"20/11/26"}),
         s4:sub("s4",DATASET.map(r=>r.slice()),"Casquete de gas","",null)},
  grades:{eval:{s2:78,s3:90,s5:66},foro:{s1:80,s2:70,s3:95}},
  prog:{s1:{welcome:true,clase:false,material:false,actividad:false,eval:false}},
  evalCfg:{url:"",abre:"2026-12-05",cierra:"2026-12-12",intentos:1,min:45},
  mat:{mt1:true,mt2:true,mt3:true,mt4:false,mt5:true},
  msgs:{curso:[{u:"d1",t:"Bienvenidos/as al curso piloto. La clase del sábado es híbrida; la grabación quedará disponible solo si se dicta en modalidad virtual.",ts:"20/11/26 18:00"},{u:"s3",t:"¿Los datos de la actividad ya están cargados?",ts:"20/11/26 18:20"},{u:"d2",t:"Sí, están en Material → Datos de la actividad.",ts:"20/11/26 18:41"}],
   docentes:[{u:"d1",t:"Revisemos la rúbrica antes de corregir las entregas.",ts:"19/11/26 10:00"},{u:"d2",t:"Perfecto, propongo ponderar el cálculo de N con 40 puntos.",ts:"19/11/26 10:12"}],
   "dm-s1":[{u:"s1",t:"Profe, ¿puedo entregar con unidades en m³?",ts:"18/11/26 12:30"},{u:"d1",t:"Sí, aclare la conversión utilizada.",ts:"18/11/26 14:02"}]},
  forum:[{id:1,t:"¿Cómo estimo Efw si no tengo cf?",c:"Dudas de teoría",u:"s4",b:"En el ejercicio no aparece la compresibilidad de la formación.",ts:"18/11/26",pin:false,solved:false,r:[{u:"d2",t:"Puede adoptar una correlación y declarar el supuesto; en la clase 3 se revisa la sensibilidad.",ts:"18/11/26"}]},
   {id:2,t:"Aplicación de campo: ¿cuándo aparece We en la práctica?",c:"Aplicaciones de campo",u:"s3",b:"¿Qué señales operativas acompañan el ascenso de F/Et?",ts:"17/11/26",pin:false,solved:true,r:[]},
   {id:3,t:"Reglas del foro y de entrega",c:"Dudas de teoría",u:"d1",b:"Cite sus fuentes y no publique datos confidenciales de operadoras o activos reales.",ts:"07/11/26",pin:true,solved:false,r:[]}],
  course:{dev:{ver:"0.1.0-piloto",fecha:"21/11/26"},main:null,check:{backup:false,rev:false,pvt:false,names:false,qa:false,apr:false}},
  backups:[],cert:{},desist:{},
  audit:[{ts:"21/11/26 16:02",who:"Docente titular",msg:"Inicio de sesión (MFA verificado)"},{ts:"21/11/26 15:50",who:"Camila Ríos",msg:"Inicio de sesión"}]};
}
function load(){try{const d=JSON.parse(localStorage.getItem(KEY));return d&&d.users?d:null}catch(e){return null}}
let DB=load()||seed();
function save(){try{localStorage.setItem(KEY,JSON.stringify(DB))}catch(e){}}
const UI={role:"alumno",view:"home",tab:"inicio",env:"develop",mode:"standalone",ch:"curso",dm:"s1",sess:"c3",open:null,
  pl:{welcome:{t:0,play:false,src:null},clase:{t:0,play:false,src:null}},rt:{}};
const U=id=>DB.users.find(u=>u.id===id)||{nombre:id};
const user=()=>U(UI.role==="alumno"?ME:UI.role==="profesor"?"d1":"a0");
const students=()=>DB.users.filter(u=>u.rol==="alumno");
function audit(m){DB.audit.unshift({ts:now(),who:user().nombre,msg:m});DB.audit=DB.audit.slice(0,60);save()}

/* ============ cálculos ============ */
function regress(pts){let sxy=0,sxx=0;pts.forEach(([x,y])=>{sxy+=x*y;sxx+=x*x});const N=sxx?sxy/sxx:0,yb=pts.reduce((a,p)=>a+p[1],0)/(pts.length||1);let ssr=0,sst=0;pts.forEach(([x,y])=>{ssr+=(y-N*x)**2;sst+=(y-yb)**2});return{N,r2:sst?1-ssr/sst:0}}
function chart(pts,N){const W=330,H=210,m=38;if(!pts.length)return"";const xm=Math.max(...pts.map(p=>p[0]))*1.12,ym=Math.max(...pts.map(p=>p[1]),N*xm)*1.08;
 const X=x=>m+x/xm*(W-m-12),Y=y=>H-m-y/ym*(H-m-12),x2=Math.min(xm,ym/(N||1));
 return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Gráfico F vs Et con recta ajustada" style="width:100%;max-width:420px"><rect width="${W}" height="${H}" rx="10" fill="#0b2034"/><line x1="${m}" y1="${H-m}" x2="${W-8}" y2="${H-m}" stroke="#a3b8c8"/><line x1="${m}" y1="${H-m}" x2="${m}" y2="10" stroke="#a3b8c8"/>
 <line x1="${X(0)}" y1="${Y(0)}" x2="${X(x2)}" y2="${Y(N*x2)}" stroke="#f1a23a" stroke-width="2"/>${pts.map(p=>`<circle cx="${X(p[0])}" cy="${Y(p[1])}" r="4.5" fill="#1fb8a6"/>`).join("")}
 <text x="${W/2}" y="${H-8}" fill="#a3b8c8" font-size="11" text-anchor="middle">Et (rb/STB)</text><text x="12" y="${H/2}" fill="#a3b8c8" font-size="11" transform="rotate(-90 12 ${H/2})" text-anchor="middle">F (MMrb)</text>
 <text x="${m}" y="${H-m+13}" fill="#a3b8c8" font-size="10">0</text><text x="${W-30}" y="${H-m+13}" fill="#a3b8c8" font-size="10">${xm.toFixed(3)}</text><text x="${m-4}" y="14" fill="#a3b8c8" font-size="10" text-anchor="end">${ym.toFixed(1)}</text></svg>`}
function attPct(uid){let t=0,p=0;DB.sessions.forEach(s=>{const v=(DB.att[s.id]||{})[uid];if(!v||v==="J")return;t++;if(v==="P"||v==="V")p++});return t?p/t*100:null}
function gradeOf(uid){const items={act:DB.subs[uid]?.grade?.total??null,eval:DB.grades.eval[uid]??null,foro:DB.grades.foro[uid]??null};let w=0,s=0;for(const k in items)if(items[k]!=null){w+=WEIGHTS[k];s+=items[k]*WEIGHTS[k]}return{items,avg:w?s/w:null,cov:w}}
function statusOf(uid){const g=gradeOf(uid),a=attPct(uid);if(g.cov<100)return["En curso ("+g.cov+" % evaluado)","b-i"];if(a!=null&&a<ASIST_MIN)return["Libre por asistencia","b-bad"];return g.avg>=APRUEBA?["Aprobado","b-ok"]:["No aprobado","b-bad"]}
const myProg=()=>{const p=DB.prog[ME]||{};const k=["welcome","clase","material","actividad","eval"];return{p,pct:k.filter(x=>p[x]).length/k.length*100}};
const visible=()=>UI.env==="develop"||!!DB.course.main;
function dl(name,text,type="text/csv"){try{const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([text],{type}));a.download=name;document.body.appendChild(a);a.click();a.remove()}catch(e){}toast("Descarga solicitada: "+name+" (si el visor bloquea descargas, funciona en el sitio develop).")}

/* ============ vistas ============ */
const TABS={alumno:[["inicio","Inicio"],["clase","Clase"],["material","Material"],["actividad","Actividad"],["evaluacion","Evaluación"],["asistencia","Asistencia"],["notas","Calificaciones"],["mensajes","Mensajes"],["foro","Foro"]],
 profesor:[["panel","Panel"],["inicio","Bienvenida"],["clase","Clase"],["material","Material"],["entregas","Entregas"],["evaluacion","Evaluación"],["asistencia","Asistencia"],["notas","Calificaciones"],["mensajes","Mensajes"],["foro","Foro"]],
 admin:[["usuarios","Usuarios y accesos"],["publicar","Publicación"],["despliegue","Despliegue"],["auditoria","Auditoría"]]};

function render(){
 const ext=UI.mode==="extension";
 $("#app").innerHTML=`<div class="demo"><b>Modelo piloto · datos ficticios · sin backend</b>
  <span>Rol <span class="seg">${["alumno","profesor","admin"].map(r=>`<button data-act="role" data-v="${r}" aria-pressed="${UI.role===r}">${r[0].toUpperCase()+r.slice(1)}</button>`).join("")}</span></span>
  <span>Entorno <span class="seg">${["develop","main"].map(r=>`<button data-act="env" data-v="${r}" aria-pressed="${UI.env===r}">${r}</button>`).join("")}</span></span>
  <span>Instalación <span class="seg">${[["standalone","Sistema individual"],["extension","Extensión del sitio"]].map(r=>`<button data-act="mode" data-v="${r[0]}" aria-pressed="${UI.mode===r[0]}">${r[1]}</button>`).join("")}</span></span></div>
  ${ext?`<div class="host"><b>H3L Global Energy</b><span>Quiénes somos</span><span>Servicios</span><span><u>Cursos online H3L</u></span><span>Noticias OIL &amp; GAS</span><span>Eventos</span><span>Contactos</span><em>Barra del sitio anfitrión · el campus se monta debajo con SSO</em></div>`:""}
  <header class="hdr"><img class="logo" src="../../LOGO_H3L.png" alt="H3L Global Energy"><div class="t"><b>Campus Virtual H3L</b><small>Oil &amp; Gas · Transición Energética · Ciencia de Datos</small></div><div class="sp"></div>
   <span class="chip ${UI.env==="develop"?"dev":"prod"}">${UI.env==="develop"?"DEVELOP · en evaluación":"MAIN · producción"}</span>
   <span class="chip">👤 ${esc(user().nombre)} · ${UI.role}</span></header>
  <main class="wrap">${body()}</main>
  <footer class="ft">Campus Virtual H3L · <b>Desarrollado por H3L Global Energy</b> — consultoría en Oil &amp; Gas y Transición Energética con ciencia de datos · v${DB.course.dev.ver} (develop)</footer>`;
 afterRender();
}
function body(){
 if(UI.role==="admin"){if(!TABS.admin.some(t=>t[0]===UI.tab))UI.tab="usuarios";return tabsBar()+admin()}
 if(UI.view==="home")return home();
 if(!TABS[UI.role].some(t=>t[0]===UI.tab))UI.tab=UI.role==="profesor"?"panel":"inicio";
 return courseHead()+tabsBar()+(VIEWS[UI.tab]?VIEWS[UI.tab]():"");
}
function tabsBar(){return `<nav class="tabs" role="tablist">${TABS[UI.role].map(t=>`<button role="tab" data-act="tab" data-v="${t[0]}" aria-selected="${UI.tab===t[0]}">${t[1]}</button>`).join("")}</nav>`}
function home(){
 const soon=[["Python para Oil & Gas","Automatización y análisis de datos de pozo"],["Power BI para Oil & Gas","Tableros para toma de decisiones"],["Transición energética: fundamentos","Emisiones, captura y nuevas energías"]];
 return `<div class="hero"><h1 style="font-size:1.6rem">Bienvenido/a, ${esc(user().nombre)}</h1><p class="mu">${UI.role==="profesor"?"Gestione sus cursos, entregas, asistencia y calificaciones.":"Acceda a sus cursos, clases, material y evaluaciones."}</p></div>
 <h2 style="margin-top:20px">${UI.role==="profesor"?"Mis cursos a cargo":"Mis cursos"}</h2>
 <div class="grid g3">${visible()?`<article class="card course-card"><span class="badge ${DB.course.main?"b-ok":"b-w"}">${DB.course.main?"Publicado en main":"Solo en develop · piloto"}</span><h3>Ingeniería de Reservorios: Balance de Materiales</h3><p class="mu sm">H3L-RES-101 · Videos, material de cátedra, actividad con carga de datos, evaluación y asistencia híbrida.</p>
  ${UI.role==="alumno"?`<div class="bar"><i style="width:${myProg().pct}%"></i></div><span class="sm mu">Avance ${pct(myProg().pct)}</span>`:`<span class="sm mu">${students().length} inscriptos · ${Object.values(DB.subs).filter(s=>!s.grade).length} entregas por corregir</span>`}
  <button class="btn" data-act="open">Entrar al curso</button></article>`:`<div class="card" style="grid-column:1/-1"><h3>Sin cursos publicados en producción</h3><p class="mu">Decisión vigente: los cursos permanecen en develop hasta su aprobación. Cambie el entorno a develop (o promueva el curso desde el rol Administrador).</p></div>`}
 ${visible()?soon.map(s=>`<article class="card course-card off"><span class="badge">En preparación</span><h3>${s[0]}</h3><p class="mu sm">${s[1]}</p><button class="btn sec" disabled>Próximamente</button></article>`).join(""):""}</div>`}
function courseHead(){
 const a=UI.role==="alumno",mp=myProg();
 return `<div class="row"><button class="btn sec sm" data-act="home">← Mis cursos</button><div class="grow"><h2 style="margin:0">Ingeniería de Reservorios: Balance de Materiales <span class="badge ${DB.course.main?"b-ok":"b-w"}">${DB.course.main?"main":"develop"}</span></h2><span class="mu sm">H3L-RES-101 · Piloto · ${UI.role==="profesor"?"Vista del profesor":"Vista del alumno"}</span></div>
 ${a?`<div style="min-width:200px"><div class="bar"><i style="width:${mp.pct}%"></i></div><span class="sm mu">Avance ${pct(mp.pct)}</span></div>
 <button class="btn sec sm" data-act="desist" ${mp.pct>=50||DB.desist[ME]?"disabled":""} title="Disponible solo mientras el avance sea menor al 50 %">${DB.desist[ME]?"Desistimiento enviado":"Botón de arrepentimiento"}</button>
 <button class="btn warn sm" data-act="cert" ${mp.pct<100&&!DB.cert[ME]?"disabled":""}>${DB.cert[ME]?"Código: "+DB.cert[ME]:"Certificado"}</button>`:""}</div>`}

/* ---- reproductor ---- */
function player(id){const d=PL[id],p=UI.pl[id];
 return `<div class="player"><div class="screen">${p.src?`<video id="v-${id}" src="${p.src}" controlslist="nodownload noplaybackrate" disablepictureinpicture></video>`:`<div class="poster"><b>${esc(d.title)}</b><span>Video pendiente de carga · se sirve por streaming desde almacenamiento propio, sin descarga</span></div>`}<div class="wm">${esc(user().nombre)} · Campus H3L</div></div>
 <div class="ctl"><button class="btn sm" id="pp-${id}" data-act="pp" data-id="${id}">${p.play?"❚❚ Pausa":"▶ Reproducir"}</button><input type="range" min="0" max="${Math.floor(d.dur)}" value="${Math.floor(p.t)}" id="pr-${id}" data-inp="seek" data-id="${id}" aria-label="Posición del video"><span class="mono sm" id="pt-${id}">${mmss(p.t)} / ${mmss(d.dur)}</span></div></div>
 ${UI.role==="profesor"?`<label>Cargar video en este espacio (vista previa local)</label><input type="file" accept="video/*" data-chg="loadvid" data-id="${id}">`:""}`}
function curChapter(){const t=UI.pl.clase.t;let i=0;CHAPTERS.forEach((c,k)=>{if(t>=c.t)i=k});return i}
function setT(id,t){const p=UI.pl[id];p.t=Math.max(0,Math.min(PL[id].dur,t));const r=$("#pr-"+id),l=$("#pt-"+id);if(r)r.value=Math.floor(p.t);if(l)l.textContent=mmss(p.t)+" / "+mmss(PL[id].dur);if(id==="clase")syncCh()}
function syncCh(){const i=curChapter();$$("[data-ch]").forEach(e=>e.classList.toggle("on",+e.dataset.ch===i));$$("[data-sec]").forEach(e=>e.classList.toggle("on",e.dataset.sec===CHAPTERS[i].sec))}

const VIEWS={
 panel(){const subs=Object.entries(DB.subs),pend=subs.filter(s=>!s[1].grade).length,np=students().filter(s=>gradeOf(s.id).avg!=null);
  return `<div class="grid g3"><div class="card"><h4>Inscriptos</h4><h2>${students().length}</h2><span class="mu sm">${students().filter(s=>s.estado==="pendiente").length} invitación pendiente</span></div>
  <div class="card"><h4>Entregas por corregir</h4><h2>${pend}</h2><button class="btn sm" data-act="tab" data-v="entregas">Ir a Entregas</button></div>
  <div class="card"><h4>Promedio parcial</h4><h2>${pct(np.length?np.reduce((a,s)=>a+gradeOf(s.id).avg,0)/np.length:null)}</h2><span class="mu sm">Ponderado con lo ya calificado</span></div></div>
  <div class="card" style="margin-top:16px"><h3>Estado de publicación</h3><p>Develop: v${DB.course.dev.ver} · Main: ${DB.course.main?"v"+DB.course.main.ver:"no publicado"}. Los cambios se evalúan en develop; el Administrador los promueve a main tras backup y revisión.</p></div>`},
 inicio(){const mp=myProg(),done=[["Principios del balance de materiales (clase 1)",mp.p.clase],["Ecuación de Havlena–Odeh y método F vs Et",mp.p.clase],["Estimación de N con datos de producción y PVT",mp.p.actividad],["Criterios para identificar el mecanismo de empuje",mp.p.eval]].filter(x=>UI.role==="profesor"||x[1]);
  return `<div class="hero"><h2>Bienvenida al curso</h2><p>Este piloto integra <b>video</b> y <b>material de cátedra</b> de forma complementaria: cada capítulo del video está enlazado con la sección del apunte que lo desarrolla, y viceversa.</p></div>
  <div class="split" style="margin-top:16px"><div>${player("welcome")}${UI.role==="alumno"?`<p><button class="btn sec sm" data-act="mark" data-v="welcome">${mp.p.welcome?"✓ Bienvenida vista":"Marcar como vista"}</button></p>`:""}</div>
  <div class="card"><h3>Ruta de aprendizaje</h3><ol class="sm"><li>Bienvenida y Capacitación H3L</li><li>Clase 1: video + apunte integrados</li><li>Material de cátedra</li><li>Actividad: cargar sus datos en el sitio</li><li>Evaluación (enlace del docente y autoevaluación)</li></ol>
  <div class="note"><b>Nota aclaratoria.</b> «PVT» refiere al ensayo de presión, volumen y temperatura del fluido de reservorio.</div></div></div>
  <div class="card" style="margin-top:16px"><h3>Al finalizar</h3>${done.length?`<p><b>Usted ahora puede analizar y validar:</b></p><ul>${done.map(x=>`<li>${x[0]}</li>`).join("")}</ul>`:`<p class="mu">Complete las etapas para ver los contenidos que ya puede analizar y validar.</p>`}</div>`},
 clase(){const i=curChapter(),a=UI.role==="alumno";
  return `<div class="split"><div>${player("clase")}<div class="chs">${CHAPTERS.map((c,k)=>`<button class="ch ${k===i?"on":""}" data-ch="${k}" data-act="ch" data-t="${c.t}"><span class="badge mono">${mmss(c.t)}</span><span>${esc(c.title)}</span></button>`).join("")}</div>
  <p class="sm mu">🔒 El video del curso se ve solo por streaming (marca de agua y URL firmada). La grabación de la clase del docente, si fue virtual, se descarga desde Asistencia.</p>
  ${a?`<button class="btn sec sm" data-act="mark" data-v="clase">${myProg().p.clase?"✓ Clase completada":"Marcar clase como completada"}</button>`:""}</div>
  <div><h3>Apunte sincronizado</h3>${CHAPTERS.map(c=>`<div class="sec ${CHAPTERS[i].sec===c.sec?"on":""}" data-sec="${c.sec}"><div class="row"><b class="grow">${SEC[c.sec][0]}</b><button class="btn sec sm" data-act="ch" data-t="${c.t}">▶ Ver en el video ${mmss(c.t)}</button></div>${SEC[c.sec][1]}</div>`).join("")}</div></div>`},
 material(){const p=UI.role==="profesor";
  return `<div class="card"><h3>Material de cátedra</h3><div class="tw"><table><thead><tr><th>Recurso</th><th>Tipo</th><th>Se complementa con el video</th><th>Visible</th><th></th></tr></thead><tbody>${MATERIAL.filter(m=>p||DB.mat[m.id]).map(m=>`<tr><td>${esc(m.t)}</td><td><span class="badge">${m.k}</span></td><td class="sm">${m.ch}</td>
   <td>${p?`<label style="display:inline"><input type="checkbox" style="width:auto" data-chg="matvis" data-id="${m.id}" ${DB.mat[m.id]?"checked":""}> alumnos</label>`:"✓"}</td>
   <td>${m.inline?`<button class="btn sm" data-act="tab" data-v="clase">Abrir</button>`:m.csv?`<button class="btn sm" data-act="csv">Descargar CSV</button>`:m.bib?`<button class="btn sm" data-act="bib">Ver</button>`:(UI.rt[m.id]?`<a class="btn sm" href="${UI.rt[m.id]}" download>Descargar</a>`:`<span class="badge">Pendiente de carga</span>`)}${p&&!m.inline&&!m.csv&&!m.bib?` <input type="file" data-chg="matfile" data-id="${m.id}" style="width:170px">`:""}</td></tr>`).join("")}</tbody></table></div>
   ${UI.open==="bib"?`<div class="sec" style="margin-top:12px"><b>Bibliografía sugerida</b><ul>${BIB.map(b=>`<li>${esc(b)}</li>`).join("")}</ul></div>`:""}</div>`},
 actividad(){const s=DB.subs[ME],pts=(UI.rt.pts||DATASET).map(r=>r.slice());
  if(s)return `<div class="card"><h3>Su entrega</h3><p>Enviada el ${s.ts}. Mecanismo: <b>${esc(s.mech)}</b>.</p>${s.grade?`<div class="warnbox"><b>Calificación: ${s.grade.total}/100</b> · ${esc(s.grade.fb)}</div>`:`<span class="badge b-w">Pendiente de corrección</span>`}</div>`;
  return `<div class="split"><div class="card"><h3>Actividad: estimar N por Havlena–Odeh</h3><p class="sm mu">Cargue sus datos (Et en rb/STB y F en MMrb). El sitio ajusta la recta por el origen y calcula N en MMSTB. Datos didácticos sintéticos.</p>
  <table><thead><tr><th>Et</th><th>F</th></tr></thead><tbody>${pts.map((r,i)=>`<tr><td><input data-inp="pt" data-i="${i}" data-j="0" value="${r[0]}" inputmode="decimal"></td><td><input data-inp="pt" data-i="${i}" data-j="1" value="${r[1]}" inputmode="decimal"></td></tr>`).join("")}</tbody></table>
  <label>Mecanismo de empuje identificado</label><select id="mech"><option>Volumétrico (expansión de fluidos y roca)</option><option>Empuje por agua</option><option>Casquete de gas</option><option>Gas en solución</option></select>
  <label>Justificación técnica</label><textarea id="just" placeholder="Explique su criterio y los supuestos adoptados"></textarea>
  <label>Archivo adjunto (opcional, p. ej. su planilla)</label><input type="file" id="afile"><p><button class="btn" data-act="submitAct">Enviar al docente</button></p></div>
  <div class="card"><h3>Resultado en vivo</h3><div id="calc"></div></div></div>`},
 entregas(){const list=Object.entries(DB.subs);
  return `<div class="grid g2">${list.map(([uid,s])=>{const r=regress(s.pts.map(x=>[+x[0],+x[1]])),dev=Math.abs(r.N-REF_N)/REF_N*100,g=s.grade;
   return `<div class="card"><div class="row"><b class="grow">${esc(U(uid).nombre)}</b><span class="badge ${g?"b-ok":"b-w"}">${g?g.total+"/100":"Por corregir"}</span></div>
   <p class="sm">N estimado <b>${r.N.toFixed(1)} MMSTB</b> (R² ${r.r2.toFixed(3)}) · referencia ${REF_N} ± ${TOL} % → <span class="badge ${dev<=TOL?"b-ok":"b-bad"}">${dev<=TOL?"dentro de tolerancia":"desvío "+dev.toFixed(1)+" %"}</span><br>Mecanismo: ${esc(s.mech)}<br>Justificación: ${esc(s.just||"—")}</p>${chart(s.pts.map(x=>[+x[0],+x[1]]),r.N)}
   <h4 style="margin-top:10px">Rúbrica</h4>${CRIT.map((c,k)=>`<div class="row sm"><span class="grow">${c[0]} (máx. ${c[1]})</span><input type="number" min="0" max="${c[1]}" style="width:80px" id="sc-${uid}-${k}" value="${g?g.scores[k]:""}"></div>`).join("")}
   <label>Devolución</label><textarea id="fb-${uid}">${esc(g?g.fb:"")}</textarea><p><button class="btn" data-act="grade" data-u="${uid}">Guardar calificación</button></p></div>`}).join("")||"<p class='mu'>Sin entregas.</p>"}</div>`},
 evaluacion(){const c=DB.evalCfg,p=UI.role==="profesor",ok=/^https:\/\//.test(c.url);
  return `<div class="grid g2"><div class="card"><h3>Evaluación final</h3>${p?`<label>Enlace de la evaluación (https://)</label><input id="ev-url" value="${esc(c.url)}" placeholder="https://…"><div class="row"><div class="grow"><label>Abre</label><input type="date" id="ev-a" value="${c.abre}"></div><div class="grow"><label>Cierra</label><input type="date" id="ev-c" value="${c.cierra}"></div></div><div class="row"><div class="grow"><label>Intentos</label><input type="number" id="ev-i" value="${c.intentos}"></div><div class="grow"><label>Minutos</label><input type="number" id="ev-m" value="${c.min}"></div></div><p><button class="btn" data-act="saveEval">Guardar configuración</button></p><p class="sm mu">La nota se vuelca en Calificaciones (manualmente o por importación CSV) [API].</p>`
   :`<p>Disponible del <b>${c.abre}</b> al <b>${c.cierra}</b> · ${c.intentos} intento(s) · ${c.min} min.</p>${ok?`<a class="btn" href="${esc(c.url)}" target="_blank" rel="noopener noreferrer">Abrir evaluación</a>`:`<span class="badge b-w">El docente aún no publicó el enlace</span>`}`}</div>
  <div class="card"><h3>Autoevaluación (no puntúa)</h3>${QUIZ.map((q,i)=>`<div class="sec"><b>${i+1}. ${esc(q.q)}</b>${q.o.map((o,j)=>`<label style="display:block;color:var(--tx)"><input type="radio" style="width:auto" name="q${i}" value="${j}"> ${esc(o)}</label>`).join("")}<div id="qf${i}" class="sm"></div></div>`).join("")}<button class="btn sec" data-act="quiz">Verificar respuestas</button></div></div>`},
 asistencia(){const p=UI.role==="profesor";
  if(!p){const a=attPct(ME),lab={P:"Presente presencial",V:"Presente virtual",A:"Ausente",J:"Justificada"};
   return `<div class="grid g3"><div class="card"><h4>Mi asistencia</h4><h2>${pct(a)}</h2><span class="sm mu">Mínimo exigido ${ASIST_MIN} % · ${a==null||a>=ASIST_MIN?"en regla":"en riesgo"}</span></div></div><div class="card tw" style="margin-top:16px"><table><thead><tr><th>Fecha</th><th>Tema</th><th>Modalidad</th><th>Mi asistencia</th><th>Grabación de la clase</th></tr></thead><tbody>${DB.sessions.map(s=>{const v=(DB.att[s.id]||{})[ME];return `<tr><td>${s.fecha}</td><td>${esc(s.tema)}</td><td><span class="badge">${s.mod}</span></td><td>${v?`<span class="badge ${v==="A"?"b-bad":"b-ok"}">${lab[v]}</span>`:`<span class="badge">Sin registrar</span>`}</td><td>${s.mod!=="Presencial"&&s.rec&&s.dl?`<button class="btn sm" data-act="dlrec" data-id="${s.id}">Descargar clase</button>`:s.mod==="Presencial"?`<span class="sm mu">No aplica (presencial)</span>`:`<span class="sm mu">No habilitada</span>`}</td></tr>`}).join("")}</tbody></table></div><p class="sm mu">Solo se ofrece descarga de la <b>grabación de la clase del docente</b> cuando la sesión fue virtual o híbrida y el docente la habilitó. Los videos del curso no se descargan.</p>`}
  const s=DB.sessions.find(x=>x.id===UI.sess),at=DB.att[s.id]||(DB.att[s.id]={});
  return `<div class="card"><div class="row"><label style="margin:0">Sesión</label><select style="width:auto" data-chg="sess">${DB.sessions.map(x=>`<option value="${x.id}" ${x.id===s.id?"selected":""}>${x.fecha} · ${esc(x.tema)}</option>`).join("")}</select>
   <label style="margin:0">Modalidad</label><select style="width:auto" data-chg="smod">${["Presencial","Virtual","Híbrida"].map(m=>`<option ${m===s.mod?"selected":""}>${m}</option>`).join("")}</select></div>
   <div class="row" style="margin:10px 0"><label style="display:inline;margin:0"><input type="checkbox" style="width:auto" data-chg="srec" ${s.rec?"checked":""} ${s.mod==="Presencial"?"disabled":""}> Hay grabación de la clase</label><label style="display:inline;margin:0"><input type="checkbox" style="width:auto" data-chg="sdl" ${s.dl?"checked":""} ${!s.rec||s.mod==="Presencial"?"disabled":""}> Habilitar descarga a alumnos</label></div>
   <div class="tw"><table><thead><tr><th>Alumno/a</th><th>Registro</th><th>%</th></tr></thead><tbody>${students().map(u=>{const v=at[u.id];return `<tr><td>${esc(u.nombre)}</td><td class="st">${[["P","Presencial"],["V","Virtual"],["A","Ausente"],["J","Justif."]].filter(x=>!(x[0]==="P"&&s.mod==="Virtual")&&!(x[0]==="V"&&s.mod==="Presencial")).map(x=>`<button data-act="att" data-u="${u.id}" data-v="${x[0]}" aria-pressed="${v===x[0]}" class="${x[0]==="A"?"a":x[0]==="J"?"j":""}">${x[1]}</button>`).join("")}</td><td>${pct(attPct(u.id))}</td></tr>`}).join("")}</tbody></table></div>
   <p class="sm mu">Asistencia virtual: se propone validar por conexión ≥ 80 % de la duración (registro de la plataforma de clases) [API]; el docente puede corregir manualmente.</p></div>`},
 notas(){const p=UI.role==="profesor";
  if(!p){const g=gradeOf(ME),st=statusOf(ME);return `<div class="grid g3"><div class="card"><h4>Promedio ponderado</h4><h2>${pct(g.avg)}</h2><span class="badge ${st[1]}">${st[0]}</span></div><div class="card"><h4>Asistencia</h4><h2>${pct(attPct(ME))}</h2></div></div>
   <div class="card tw" style="margin-top:16px"><table><thead><tr><th>Instancia</th><th>Peso</th><th>Nota</th><th>Devolución</th></tr></thead><tbody><tr><td>Actividad práctica</td><td>${WEIGHTS.act} %</td><td>${g.items.act??"—"}</td><td class="sm">${esc(DB.subs[ME]?.grade?.fb||"—")}</td></tr><tr><td>Evaluación final</td><td>${WEIGHTS.eval} %</td><td>${g.items.eval??"—"}</td><td class="sm">—</td></tr><tr><td>Participación en foro</td><td>${WEIGHTS.foro} %</td><td>${g.items.foro??"—"}</td><td class="sm">—</td></tr></tbody></table></div><p class="sm mu">Aprobación: ponderado ≥ ${APRUEBA} % y asistencia ≥ ${ASIST_MIN} %.</p>`}
  return `<div class="card"><div class="row"><h3 class="grow">Libro de calificaciones</h3><button class="btn sec sm" data-act="csvnotas">Copiar CSV</button></div><div class="tw"><table><thead><tr><th>Alumno/a</th><th>Actividad (${WEIGHTS.act} %)</th><th>Evaluación (${WEIGHTS.eval} %)</th><th>Foro (${WEIGHTS.foro} %)</th><th>Ponderado</th><th>Asist.</th><th>Estado</th></tr></thead><tbody>${students().map(u=>{const g=gradeOf(u.id),st=statusOf(u.id);return `<tr><td>${esc(u.nombre)}</td><td>${g.items.act??"—"}</td><td><input type="number" min="0" max="100" style="width:76px" data-chg="gr" data-k="eval" data-u="${u.id}" value="${g.items.eval??""}"></td><td><input type="number" min="0" max="100" style="width:76px" data-chg="gr" data-k="foro" data-u="${u.id}" value="${g.items.foro??""}"></td><td><b>${pct(g.avg)}</b></td><td>${pct(attPct(u.id))}</td><td><span class="badge ${st[1]}">${st[0]}</span></td></tr>`}).join("")}</tbody></table></div></div>`},
 mensajes(){const p=UI.role==="profesor",chs=p?[["curso","📢 Mensajes del curso"],["docentes","🔒 Sala docente"],...students().map(u=>["dm-"+u.id,"✉ "+u.nombre])]:[["curso","📢 Mensajes del curso"],["dm-"+ME,"✉ Consulta privada al docente"]];
  if(!chs.some(c=>c[0]===UI.ch))UI.ch="curso";const th=DB.msgs[UI.ch]||[];
  return `<div class="msgs"><div class="chl">${chs.map(c=>`<button data-act="ch2" data-v="${c[0]}" aria-current="${UI.ch===c[0]}">${esc(c[1])}</button>`).join("")}</div><div class="card"><div class="thread">${th.map(m=>`<div class="m ${m.u===user().id?"me":""}"><small>${esc(U(m.u).nombre)} · ${m.ts}</small>${esc(m.t)}</div>`).join("")||`<p class="mu">Sin mensajes.</p>`}</div>
   ${UI.ch==="docentes"&&!p?"":`<div class="row"><input class="grow" id="msg" placeholder="Escribir mensaje…" aria-label="Mensaje"><button class="btn" data-act="send">Enviar</button></div>`}<p class="sm mu">${UI.ch==="docentes"?"Solo visible para docentes.":UI.ch==="curso"?"Visible para todo el curso. Los alumnos pueden responder o limitar a consultas según configuración del docente.":"Mensaje privado entre alumno/a y docentes."} Notificaciones por email [API].</p></div></div>`},
 foro(){const cats=["Dudas de teoría","Ejercicios","Aplicaciones de campo","Ciencia de datos y transición"],p=UI.role==="profesor",F=[...DB.forum].sort((a,b)=>b.pin-a.pin||b.id-a.id);
  return `<div class="split"><div>${F.map(f=>`<div class="sec"><div class="row"><b class="grow">${f.pin?"📌 ":""}${esc(f.t)}</b><span class="badge">${esc(f.c)}</span>${f.solved?`<span class="badge b-ok">Resuelto</span>`:""}</div><p class="sm mu">${esc(U(f.u).nombre)} · ${f.ts}</p><p>${esc(f.b)}</p>${f.r.map(r=>`<div class="m" style="margin:6px 0"><small>${esc(U(r.u).nombre)} · ${r.ts}</small>${esc(r.t)}</div>`).join("")}
   <div class="row"><input class="grow" id="rp-${f.id}" placeholder="Responder…" aria-label="Respuesta"><button class="btn sm" data-act="reply" data-id="${f.id}">Responder</button>${p?`<button class="btn sec sm" data-act="pin" data-id="${f.id}">${f.pin?"Desfijar":"Fijar"}</button><button class="btn sec sm" data-act="solve" data-id="${f.id}">${f.solved?"Reabrir":"Resuelto"}</button>`:""}</div></div>`).join("")}</div>
  <div class="card"><h3>Nuevo tema</h3><label>Categoría</label><select id="fc">${cats.map(c=>`<option>${c}</option>`).join("")}</select><label>Título</label><input id="ft"><label>Mensaje</label><textarea id="fb"></textarea><p><button class="btn" data-act="newthread">Publicar</button></p><div class="note">Cite fuentes y no publique datos confidenciales de activos u operadoras reales.</div></div></div>`}
};
function admin(){
 const t=UI.tab;
 if(t==="usuarios")return `<div class="card"><h3>Base de usuarios (alumnos y profesores)</h3><div class="tw"><table><thead><tr><th>Nombre</th><th>Email</th><th>Rol</th><th>Estado</th><th>MFA</th><th>Último acceso</th></tr></thead><tbody>${DB.users.map(u=>`<tr><td>${esc(u.nombre)}</td><td class="sm">${esc(u.email)}</td><td><select style="width:auto" data-chg="urole" data-u="${u.id}">${["alumno","profesor","admin"].map(r=>`<option ${r===u.rol?"selected":""}>${r}</option>`).join("")}</select></td><td><button class="btn sec sm" data-act="ustate" data-u="${u.id}">${u.estado}</button></td><td>${u.mfa?"✓":(u.rol!=="alumno"?`<span class="badge b-bad">Obligatorio</span>`:"—")}</td><td class="sm">${u.ult}</td></tr>`).join("")}</tbody></table></div>
  <h4 style="margin-top:14px">Invitar usuario</h4><div class="row"><input class="grow" id="in-n" placeholder="Nombre y apellido"><input class="grow" id="in-e" placeholder="Email"><select id="in-r" style="width:auto"><option>alumno</option><option>profesor</option></select><button class="btn" data-act="invite">Enviar invitación</button></div></div>
 <div class="card" style="margin-top:16px"><h3>Permisos por rol (RBAC)</h3><div class="tw"><table><thead><tr><th>Capacidad</th><th>Alumno</th><th>Profesor</th><th>Admin</th></tr></thead><tbody>${[["Ver cursos y contenidos habilitados","✓","✓","✓"],["Entregar actividades / foro / mensajes","✓","✓","—"],["Editar contenido y configurar evaluación","—","✓ (sus cursos)","✓"],["Calificar y tomar asistencia","—","✓ (sus cursos)","—"],["Descargar grabación de la clase","si lo habilita el docente","✓","✓"],["Ver sala docente","—","✓","✓"],["Gestionar usuarios y roles","—","—","✓"],["Promover develop → main / rollback","—","solicita","✓"]].map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table></div></div>
 <div class="card" style="margin-top:16px"><h3>Seguridad aplicada</h3><ul class="sm"><li>Autenticación con MFA obligatoria para docentes y administradores; SSO (OIDC) cuando se instala como extensión.</li><li>Sesiones con expiración, rotación de tokens y bloqueo por intentos fallidos.</li><li>Autorización por curso y rol (mínimo privilegio) con verificación en el servidor, no solo en la interfaz.</li><li>Datos personales minimizados y protegidos conforme a la Ley 25.326; auditoría de accesos y cambios de notas.</li><li>Videos del curso por URL firmada y con vencimiento; sin descarga. Contenido de usuarios siempre escapado (anti-XSS).</li></ul></div>`;
 if(t==="publicar"){const c=DB.course,L=[["backup","Backup generado antes de aplicar el cambio"],["rev","Revisión técnica del contenido (revisores)"],["pvt","Textos «PVT» y cifras verificados (sin transcribir como letras)"],["names","Sin nombres de operadoras, activos reales ni socios"],["qa","QA de accesibilidad y móvil"],["apr","Aprobación del administrador"]],all=L.every(x=>c.check[x[0]]);
  return `<div class="warnbox"><b>Decisión vigente:</b> los cursos se mantienen solo en develop por el momento. Este circuito permite evaluarlos y, cuando corresponda, promoverlos a main.</div><div class="grid g2"><div class="card"><h3>Curso piloto · H3L-RES-101</h3><p>Develop: <b>v${c.dev.ver}</b> (${c.dev.fecha})<br>Main: <b>${c.main?"v"+c.main.ver+" ("+c.main.fecha+")":"no publicado"}</b></p>${L.map(x=>`<label style="display:block;color:var(--tx)"><input type="checkbox" style="width:auto" data-chg="chk" data-k="${x[0]}" ${c.check[x[0]]?"checked":""}> ${x[1]}</label>`).join("")}
   <div class="row" style="margin-top:12px"><button class="btn sec" data-act="backup">Generar backup</button><button class="btn warn" data-act="promote" ${all&&!c.main?"":"disabled"}>Promover a main</button><button class="btn bad" data-act="rollback" ${c.main?"":"disabled"}>Rollback de main</button></div></div>
   <div class="card"><h3>Backups</h3>${DB.backups.map(b=>`<p class="sm">💾 ${b.id} · ${b.ts} · v${b.ver}</p>`).join("")||`<p class="mu sm">Aún sin backups.</p>`}<p class="sm mu">Cada promoción genera un backup automático (tag/rama) que permite volver atrás.</p></div></div>`}
 if(t==="despliegue")return `<div class="grid g2"><div class="card"><h3>Modo individual (standalone)</h3><p class="sm">Subdominio propio (p. ej. campus.<i>dominio</i>), usuarios propios, tema H3L, correo y base de datos propios. Ideal para vender el campus a terceros o separar la carga del sitio público.</p></div><div class="card"><h3>Modo extensión</h3><p class="sm">Se monta en un sistema existente (sitio o plataforma de la consultora/cliente) por ruta <span class="mono">/campus</span> o como componente embebido. Usa el SSO del anfitrión y hereda su barra de navegación.</p></div></div>
  <div class="card" style="margin-top:16px"><h3>Contrato de integración (extensión)</h3><pre class="snip">&lt;div id="h3l-campus"
     data-api="https://api.campus.ejemplo/v1"
     data-auth="oidc"            &lt;!-- SSO del anfitrión --&gt;
     data-theme="h3l"            &lt;!-- tokens CSS --&gt;
     data-lang="es"&gt;&lt;/div&gt;
&lt;script type="module" src="/campus/campus.js"&gt;&lt;/script&gt;</pre><p class="sm mu">Pruebe el cambio con el selector «Instalación» de la barra superior: en modo extensión el campus hereda la barra del sitio anfitrión.</p></div>`;
 return `<div class="card"><h3>Registro de auditoría</h3><div class="tw"><table><thead><tr><th>Fecha</th><th>Usuario</th><th>Evento</th></tr></thead><tbody>${DB.audit.map(a=>`<tr><td class="sm">${a.ts}</td><td>${esc(a.who)}</td><td>${esc(a.msg)}</td></tr>`).join("")}</tbody></table></div></div>`;
}

/* ============ eventos ============ */
function calcLive(){const el=$("#calc");if(!el)return;const pts=(UI.rt.pts||DATASET).map(r=>[num(r[0]),num(r[1])]).filter(r=>r[0]!=null&&r[1]!=null&&r[0]>0);if(pts.length<2){el.innerHTML="<p class='mu'>Cargue al menos dos puntos válidos.</p>";return}const r=regress(pts);el.innerHTML=`<p style="font-size:1.4rem;margin:0"><b>N = ${r.N.toFixed(1)} MMSTB</b></p><p class="sm mu">R² = ${r.r2.toFixed(3)} · ${pts.length} puntos</p>${chart(pts,r.N)}`}
function afterRender(){calcLive();$$("video").forEach(v=>{const id=v.id.slice(2),p=UI.pl[id];v.addEventListener("loadedmetadata",()=>{PL[id].dur=v.duration;const r=$("#pr-"+id);if(r)r.max=Math.floor(v.duration);v.currentTime=p.t});v.addEventListener("timeupdate",()=>{setT(id,v.currentTime)});v.addEventListener("play",()=>{p.play=true;$("#pp-"+id).textContent="❚❚ Pausa"});v.addEventListener("pause",()=>{p.play=false;$("#pp-"+id).textContent="▶ Reproducir"})});$$("video").forEach(v=>v.addEventListener("contextmenu",e=>e.preventDefault()));if(UI.tab==="clase")syncCh()}
const ACT={
 role:d=>{UI.role=d.v;UI.view="home";UI.tab=d.v==="admin"?"usuarios":"inicio";audit("Cambio de vista de demostración a "+d.v);render()},
 env:d=>{UI.env=d.v;render()},mode:d=>{UI.mode=d.v;render()},
 tab:d=>{UI.tab=d.v;UI.open=null;render()},open:()=>{UI.view="course";UI.tab=UI.role==="profesor"?"panel":"inicio";render()},home:()=>{UI.view="home";render()},
 pp:d=>{const p=UI.pl[d.id],v=$("#v-"+d.id);if(v){v.paused?v.play().catch(()=>{}):v.pause();return}p.play=!p.play;$("#pp-"+d.id).textContent=p.play?"❚❚ Pausa":"▶ Reproducir"},
 ch:d=>{if(UI.tab!=="clase")return;const v=$("#v-clase");UI.pl.clase.t=+d.t;if(v)v.currentTime=+d.t;setT("clase",+d.t);UI.pl.clase.play=true;if(v)v.play().catch(()=>{});else $("#pp-clase").textContent="❚❚ Pausa"},
 mark:d=>{(DB.prog[ME]||(DB.prog[ME]={}))[d.v]=!(DB.prog[ME]||{})[d.v];save();render()},
 desist:()=>{DB.desist[ME]=now();audit("Solicitud de desistimiento (avance < 50 %). Formulario enviado por email [API]");save();toast("Formulario de desistimiento enviado por email (simulado).");render()},
 cert:()=>{if(!DB.cert[ME]){DB.cert[ME]="H3L-RES101-"+Math.random().toString(36).slice(2,8).toUpperCase();audit("Certificado emitido");save()}toast("Código de verificación (uno por curso) enviado por email: "+DB.cert[ME]);render()},
 csv:()=>dl("datos_actividad_reservorios.csv","Et_rb_STB,F_MMrb\n"+DATASET.map(r=>r.join(",")).join("\n")),
 bib:()=>{UI.open=UI.open==="bib"?null:"bib";render()},
 dlrec:d=>{const s=DB.sessions.find(x=>x.id===d.id);if(UI.rt["rec-"+s.id])return dl(s.recName,"");toast("La grabación «"+s.recName+"» se sirve desde el almacenamiento en producción; en el modelo no hay archivo cargado.")},
 submitAct:()=>{const pts=(UI.rt.pts||DATASET).map(r=>[num(r[0]),num(r[1])]).filter(r=>r[0]!=null&&r[1]!=null&&r[0]>0);if(pts.length<2)return toast("Cargue al menos dos puntos válidos.");DB.subs[ME]={pts,mech:$("#mech").value,just:$("#just").value.trim(),file:($("#afile").files[0]||{}).name||"",ts:now(),grade:null};(DB.prog[ME]||(DB.prog[ME]={})).actividad=true;audit("Entrega de actividad");save();toast("Entrega enviada al docente.");render()},
 grade:d=>{const u=d.u,sc=CRIT.map((c,k)=>Math.max(0,Math.min(c[1],num($("#sc-"+u+"-"+k).value)||0))),tot=sc.reduce((a,b)=>a+b,0);DB.subs[u].grade={scores:sc,fb:$("#fb-"+u).value.trim(),total:tot,date:now()};audit("Calificó actividad de "+U(u).nombre+": "+tot+"/100");save();toast("Calificación guardada: "+tot+"/100");render()},
 saveEval:()=>{DB.evalCfg={url:$("#ev-url").value.trim(),abre:$("#ev-a").value,cierra:$("#ev-c").value,intentos:+$("#ev-i").value||1,min:+$("#ev-m").value||45};audit("Configuró la evaluación final");save();toast(/^https:\/\//.test(DB.evalCfg.url)||!DB.evalCfg.url?"Configuración guardada.":"Guardado, pero el enlace debe comenzar con https://")},
 quiz:()=>{let ok=0;QUIZ.forEach((q,i)=>{const s=document.querySelector(`input[name=q${i}]:checked`),f=$("#qf"+i);if(!s){f.textContent="Sin responder.";return}const good=+s.value===q.a;if(good)ok++;f.innerHTML=(good?"✅ Correcto. ":"❌ Revise. ")+esc(q.e)});toast("Autoevaluación: "+ok+" de "+QUIZ.length);if(UI.role==="alumno"&&ok===QUIZ.length){(DB.prog[ME]||(DB.prog[ME]={})).eval=true;save()}},
 att:d=>{const s=UI.sess,at=DB.att[s]||(DB.att[s]={});at[d.u]=at[d.u]===d.v?undefined:d.v;audit("Asistencia "+s+" · "+U(d.u).nombre+" → "+(at[d.u]||"sin registro"));save();render()},
 csvnotas:()=>{const t="Alumno,Actividad,Evaluacion,Foro,Ponderado,Asistencia\n"+students().map(u=>{const g=gradeOf(u.id);return [u.nombre,g.items.act??"",g.items.eval??"",g.items.foro??"",g.avg==null?"":g.avg.toFixed(1),attPct(u.id)==null?"":attPct(u.id).toFixed(0)].join(",")}).join("\n");try{navigator.clipboard.writeText(t).then(()=>toast("CSV copiado al portapapeles."),()=>dl("calificaciones.csv",t))}catch(e){dl("calificaciones.csv",t)}},
 ch2:d=>{UI.ch=d.v;render()},
 send:()=>{const i=$("#msg"),t=i.value.trim();if(!t)return;(DB.msgs[UI.ch]||(DB.msgs[UI.ch]=[])).push({u:user().id,t,ts:now()});save();render()},
 newthread:()=>{const t=$("#ft").value.trim(),b=$("#fb").value.trim();if(!t)return toast("Ingrese un título.");DB.forum.push({id:Date.now(),t,c:$("#fc").value,u:user().id,b,ts:now().slice(0,8),pin:false,solved:false,r:[]});save();render()},
 reply:d=>{const i=$("#rp-"+d.id),t=i.value.trim();if(!t)return;DB.forum.find(f=>f.id==d.id).r.push({u:user().id,t,ts:now().slice(0,8)});save();render()},
 pin:d=>{const f=DB.forum.find(f=>f.id==d.id);f.pin=!f.pin;save();render()},solve:d=>{const f=DB.forum.find(f=>f.id==d.id);f.solved=!f.solved;save();render()},
 ustate:d=>{const u=U(d.u);u.estado=u.estado==="activo"?"suspendido":"activo";audit((u.estado==="activo"?"Reactivó":"Suspendió")+" a "+u.nombre);save();render()},
 invite:()=>{const n=$("#in-n").value.trim(),e=$("#in-e").value.trim();if(!n||!/^\S+@\S+\.\S+$/.test(e))return toast("Complete nombre y un email válido.");DB.users.push({id:"u"+Date.now(),nombre:n,rol:$("#in-r").value,email:e,estado:"pendiente",mfa:false,ult:"—"});audit("Invitó a "+n);save();render()},
 backup:()=>{DB.backups.unshift({id:"bk-"+String(DB.backups.length+1).padStart(3,"0"),ts:now(),ver:DB.course.dev.ver});DB.course.check.backup=true;audit("Backup generado");save();toast("Backup generado.");render()},
 promote:()=>{DB.backups.unshift({id:"bk-"+String(DB.backups.length+1).padStart(3,"0")+"-pre-main",ts:now(),ver:DB.course.dev.ver});DB.course.main={ver:DB.course.dev.ver,fecha:now()};audit("Promovió el curso H3L-RES-101 a main");save();toast("Curso promovido a main (backup previo creado).");render()},
 rollback:()=>{DB.course.main=null;audit("Rollback de main");save();toast("Main restaurado al estado previo.");render()}};
document.addEventListener("click",e=>{const b=e.target.closest("[data-act]");if(b&&ACT[b.dataset.act])ACT[b.dataset.act](b.dataset,b)});
document.addEventListener("input",e=>{const t=e.target,k=t.dataset.inp;if(k==="seek"){const id=t.dataset.id,v=$("#v-"+id);if(v)v.currentTime=+t.value;setT(id,+t.value)}
 if(k==="pt"){UI.rt.pts=UI.rt.pts||DATASET.map(r=>r.slice());UI.rt.pts[+t.dataset.i][+t.dataset.j]=t.value;calcLive()}});
document.addEventListener("change",e=>{const t=e.target,k=t.dataset.chg;if(!k)return;const d=t.dataset;
 if(k==="loadvid"&&t.files[0]){UI.pl[d.id].src=URL.createObjectURL(t.files[0]);UI.pl[d.id].t=0;UI.pl[d.id].play=false;toast("Video cargado para vista previa local.");render()}
 if(k==="matfile"&&t.files[0]){UI.rt[d.id]=URL.createObjectURL(t.files[0]);toast("Archivo adjuntado (solo esta sesión).");render()}
 if(k==="matvis"){DB.mat[d.id]=t.checked;save();render()}
 if(k==="sess"){UI.sess=t.value;render()}
 if(k==="smod"){const s=DB.sessions.find(x=>x.id===UI.sess);s.mod=t.value;if(t.value==="Presencial"){s.rec=false;s.dl=false}save();render()}
 if(k==="srec"){const s=DB.sessions.find(x=>x.id===UI.sess);s.rec=t.checked;if(!t.checked)s.dl=false;save();render()}
 if(k==="sdl"){DB.sessions.find(x=>x.id===UI.sess).dl=t.checked;save();render()}
 if(k==="gr"){const v=num(t.value);DB.grades[d.k][d.u]=v==null?undefined:Math.max(0,Math.min(100,v));audit("Nota "+d.k+" de "+U(d.u).nombre+": "+(v??"—"));save();render()}
 if(k==="urole"){U(d.u).rol=t.value;audit("Cambió rol de "+U(d.u).nombre+" a "+t.value);save();render()}
 if(k==="chk"){DB.course.check[d.k]=t.checked;save();render()}});
setInterval(()=>{for(const id in UI.pl){const p=UI.pl[id];if(p.play&&!p.src){setT(id,p.t+0.25);if(p.t>=PL[id].dur){p.play=false;const b=$("#pp-"+id);if(b)b.textContent="▶ Reproducir"}}}},250);
render();
