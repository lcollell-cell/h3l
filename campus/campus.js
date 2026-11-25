"use strict";
/* Campus Virtual H3L · v0.2.0 (develop) · datos de ejemplo, sin backend (localStorage) */
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const KEY="h3l_campus_v2", PASS=6, ME="s1";
const TODAY=new Date().toISOString().slice(0,10);
function toast(m){const d=document.createElement("div");d.textContent=m;$("#toast").appendChild(d);setTimeout(()=>d.remove(),3500)}
const num=v=>{const n=parseFloat(String(v).replace(",","."));return isFinite(n)?Math.min(10,Math.max(0,n)):null};
const f1=n=>n==null?"—":(Math.round(n*10)/10).toFixed(1).replace(".",",");
const size=kb=>kb>=1024?(kb/1024).toFixed(1).replace(".",",")+" MB":kb+" KB";

/* ---------- datos de ejemplo ---------- */
const STUDENTS=[
 {id:"s1",n:"Alumno/a de ejemplo",leg:"H3L-0001",mail:"alumno.ejemplo@h3l.example",ing:"2025-03-10"},
 {id:"s2",n:"María Pérez (ej.)",leg:"H3L-0002"},{id:"s3",n:"Juan Gómez (ej.)",leg:"H3L-0003"},
 {id:"s4",n:"Lucía Fernández (ej.)",leg:"H3L-0004"},{id:"s5",n:"Martín Rossi (ej.)",leg:"H3L-0005"}];
const blank=()=>({enr:[],per:"2026 · 2.º cuatrimestre",mat:[],cls:[],tps:["TP1","TP2"],g:{},wTP:50,foro:[],nid:1});
function g(tp,ex,fin){return{tp,ex,fin}}
function seed(){
 const C={};
 C.res=Object.assign(blank(),{per:"2026 · 2.º cuatrimestre",enr:["s1","s2","s3","s4","s5"],tps:["TP1","TP2","TP3"],nid:20,
  mat:[
   {id:1,mod:"Módulo 1 · Marco PRMS",t:"Clasificación PRMS · apunte",ext:"PDF",file:"M1_clasificacion_PRMS.pdf",kb:2400,vis:true,desde:"",dl:true},
   {id:2,mod:"Módulo 1 · Marco PRMS",t:"Declinación de Arps y economía",ext:"XLS",file:"M1_declinacion_economia.xlsx",kb:310,vis:true,desde:"",dl:true},
   {id:3,mod:"Módulo 2 · Incertidumbre",t:"Agregación de reservas · presentación",ext:"PPT",file:"M2_agregacion.pptx",kb:5200,vis:false,desde:TODAY<"2026-12-02"?"2026-12-02":TODAY,dl:true},
   {id:4,mod:"Módulo 2 · Incertidumbre",t:"Resolución de ejercicios",ext:"PDF",file:"M2_resolucion.pdf",kb:900,vis:false,desde:"",dl:false}],
  cls:[{id:1,f:"2026-11-12",t:"Clase 1 · Marco PRMS",mod:"Virtual",video:true,vis:true,asis:{s1:"P",s2:"P",s3:"A",s4:"P",s5:"P"}},
       {id:2,f:"2026-11-19",t:"Clase 2 · Incertidumbre 1P/2P/3P",mod:"Presencial",video:false,vis:false,asis:{s1:"P",s2:"P",s3:"P",s4:"J",s5:"P"}},
       {id:3,f:"2026-11-26",t:"Clase 3 · Agregación",mod:"Virtual",video:true,vis:false,asis:{}}],
  g:{s1:g({TP1:8,TP2:7,TP3:null},null,null),s2:g({TP1:9,TP2:9,TP3:8},7,null),s3:g({TP1:6,TP2:5,TP3:null},null,null),s4:g({TP1:8,TP2:8,TP3:9},8,null),s5:g({TP1:7,TP2:null,TP3:null},null,null)},
  foro:[{a:"Docente",t:"Bienvenidos. Las consultas sobre PRMS se responden en este foro.",d:"2026-11-12"}]});
 C.pvt=Object.assign(blank(),{per:"2026 · 1.er cuatrimestre",enr:["s1","s2","s3"],tps:["TP1","TP2"],
  mat:[{id:1,mod:"Módulo 1 · Fluidos",t:"Ensayo PVT · guía de ejercicios",ext:"XLS",file:"PVT_ejercicios.xlsx",kb:280,vis:true,desde:"",dl:true}],
  g:{s1:g({TP1:8,TP2:8},8,8),s2:g({TP1:9,TP2:7},8,8),s3:g({TP1:5,TP2:4},5,5)}});
 C.geo=Object.assign(blank(),{per:"2025 · 2.º cuatrimestre",enr:["s1","s2"],tps:["TP1","TP2","TP3"],
  g:{s1:g({TP1:9,TP2:9,TP3:10},9,9),s2:g({TP1:7,TP2:8,TP3:7},7,7)}});
 C.wf=Object.assign(blank(),{per:"2025 · 1.er cuatrimestre",enr:["s1"],tps:["TP1","TP2"],g:{s1:g({TP1:7,TP2:8},7,7)}});
 C.eor=eorSeed();
 return{v:2,c:C};
}
function eorSeed(){
 return Object.assign(blank(),{per:"2026 · 2.º cuatrimestre",enr:["s1","s2","s3","s4"],tps:["TP1","TP2"],nid:10,
  mat:[{id:1,mod:"Módulo 3 · Térmicos, screening y piloto",t:"Barrido en capas y screening EOR (Excel)",ext:"XLS",file:"H3L_EOR_Barrido_en_Capas_y_Screening.xlsx",kb:106,vis:true,desde:"",dl:true}],
  cls:[{id:1,f:"2026-11-20",t:"Clase 1 · Por qué queda petróleo",mod:"Virtual",video:true,vis:true,link:"",asis:{s1:"P",s2:"P",s3:"P",s4:"A"}},
       {id:2,f:"2026-11-27",t:"Clase 2 · Métodos químicos y de gas",mod:"Presencial",video:false,vis:false,link:"",asis:{}}],
  g:{s1:g({TP1:8,TP2:null},null,null),s2:g({TP1:7,TP2:8},null,null),s3:g({TP1:9,TP2:null},null,null),s4:g({TP1:6,TP2:null},null,null)}});
}
let DB; try{DB=JSON.parse(localStorage.getItem(KEY));}catch(e){DB=null}
if(!DB||DB.v!==2||!DB.c)DB=seed();
if(!DB.sub)DB.sub={free:["geo"]};
if(!DB.c.eor){DB.c.eor=eorSeed();try{localStorage.setItem(KEY,JSON.stringify(DB))}catch(e){}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(DB))}catch(e){}}
const CD=id=>(DB.c[id]=Object.assign(blank(),DB.c[id]||{}));

/* ---------- catálogo (mismo de Cursos H3L) ---------- */
let CAT=null; const PROG={};
const ST={role:"alumno",page:"inicio",cid:null,tab:"prog",menu:false,q:"",hq:"",modal:false};
const meta=id=>CAT.courses.find(c=>c.id===id);
const secOf=id=>CAT.sections.find(s=>s.courses.includes(id));
const norm=s=>String(s||"").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"");
const hasData=id=>DB.c[id]&&DB.c[id].enr&&DB.c[id].enr.length>0;

/* ---------- cálculo de notas ---------- */
function tpVals(cid,sid){const d=CD(cid),r=(d.g[sid]||{tp:{}}).tp||{};return d.tps.map(t=>r[t]==null?null:r[t])}
function tpAvg(cid,sid){const v=tpVals(cid,sid).filter(x=>x!=null);return v.length?v.reduce((a,b)=>a+b,0)/v.length:null}
function suggested(cid,sid){const d=CD(cid),a=tpAvg(cid,sid),e=(d.g[sid]||{}).ex;if(a==null||e==null)return null;const w=d.wTP/100;return Math.round((a*w+e*(1-w))*10)/10}
function cond(cid,sid){const f=(CD(cid).g[sid]||{}).fin;return f==null?["En curso","p-i"]:f>=PASS?["Aprobado","p-ok"]:["Desaprobado","p-off"]}
function attPct(cid,sid){let t=0,p=0;CD(cid).cls.forEach(c=>{const v=c.asis[sid];if(!v||v==="J")return;t++;if(v==="P")p++});return t?Math.round(p/t*100):null}
function setG(cid,sid,fn){const d=CD(cid);d.g[sid]=d.g[sid]||{tp:{},ex:null,fin:null};d.g[sid].tp=d.g[sid].tp||{};fn(d.g[sid]);save()}

/* ---------- render ---------- */
function render(){
  const root=$("#app");
  root.innerHTML=`<div class="demo">Versión de prueba en Desarrollo · alumnos, notas y archivos son <b>datos de ejemplo</b> y se guardan solo en este navegador.</div>
  <header class="top"><div class="in"><img src="../LOGO_H3L.png" alt="H3L Global Energy"><div class="ttl"><b>Campus Virtual</b><small>Oil &amp; Gas · Transición energética · Ciencia de datos</small></div><div class="sp"></div>
   <div class="seg" role="group" aria-label="Perfil de uso"><button data-act="role" data-v="alumno" aria-pressed="${ST.role==="alumno"}">Alumno</button><button data-act="role" data-v="docente" aria-pressed="${ST.role==="docente"}">Docente</button></div>
   <div class="who"><b>${ST.role==="docente"?"Prof. Leandro Collell":"Alumno/a de ejemplo"}</b>${ST.role==="docente"?"Docente":"Legajo H3L-0001"}</div></div></header>
  ${nav()}<main id="pg">${CAT?page():`<div class="empty">Cargando cursos…</div>`}</main>${ST.modal&&CAT?treeModal():""}
  <footer>Campus Virtual H3L · desarrollado por H3L Global Energy (autor: Leandro Collell) · © 2026 H3L Global Energy S.R.L. · Escala de calificaciones 0–10, aprobación desde ${PASS}.</footer>`;
}
function nav(){
  const p=ST.page,items=ST.role==="alumno"?[["inicio","Inicio"],["perfil","Mi perfil y analítico"]]:[["inicio","Inicio"],["calif","Calificaciones"]];
  return `<nav class="nav" aria-label="Principal"><div class="in">
   <button data-act="go" data-v="inicio" ${p==="inicio"&&!ST.menu?'aria-current="page"':""}>Inicio</button>
   <div class="menuwrap"><button data-act="menu" aria-expanded="${ST.menu}" aria-haspopup="true">Cursos ▾</button>${ST.menu?`<div class="menu" role="menu"><input type="search" id="mq" placeholder="Buscar curso…" value="${esc(ST.q)}" autocomplete="off"><div id="ml">${menuList()}</div></div>`:""}</div>
   ${items.slice(1).map(([k,l])=>`<button data-act="go" data-v="${k}" ${p===k&&!ST.menu?'aria-current="page"':""}>${l}</button>`).join("")}
  </div></nav>`;
}
const LV={b:"Básico",i:"Intermedio",a:"Avanzado"};
const lvTxt=m=>(m.levels||[]).map(l=>LV[l]).filter(Boolean).join(" – ");
function menuList(){
  const q=norm(ST.q.trim());
  const out=CAT.sections.map(s=>{const l=s.courses.map(meta).filter(m=>m&&(!q||norm(m.title+" "+m.tag).includes(q)));
    if(!l.length)return"";
    return `<div class="mh">${esc(s.title)}</div>${l.map(m=>`<button class="cl" role="menuitem" data-act="curso" data-v="${m.id}"><i class="dot" style="background:${esc(m.color)}"></i><span class="ct">${esc(m.title)}</span><span class="lv">${esc(lvTxt(m))}</span></button>`).join("")}`}).join("");
  return out||`<p class="mu sm" style="padding:8px">Sin resultados.</p>`;
}
function page(){
  if(ST.page==="curso")return curso();
  if(ST.page==="perfil")return perfil();
  if(ST.page==="cert")return certPage();
  if(ST.page==="calif")return califIndex();
  return inicio();
}
function myCourses(){
  const ids=Object.keys(DB.c).filter(id=>meta(id)&&(ST.role==="docente"?hasData(id):(DB.c[id].enr||[]).includes(ME)));
  return ids;
}
function courseCard(id){
  const m=meta(id),d=CD(id);let sub;
  if(ST.role==="alumno"){const [c,k]=cond(id,ME);sub=`<span class="pill ${k}">${c}</span> <small>${esc(d.per)}</small>`}
  else sub=`<small>${d.enr.length} alumnos · ${esc(d.per)}</small>`;
  return `<button class="cc" style="--c:${esc(m.color)}" data-act="curso" data-v="${id}"><b>${esc(m.title)}</b>${sub}</button>`;
}
/* agrupación del árbol "Ver cursos" (editable) */
const TREE=[
 {g:"Upstream",sub:[
  {s:"Geociencias",c:["geo"]},
  {s:"Reservas",c:["res","rpx","pr2","frr"]},
  {s:"Reservorios",c:["pvt","gas","pta","sim","wf","eor"]},
  {s:"Perforación y producción",c:["per","nod","frac","rta","fac"]},
  {s:"Economía y comercialización",c:["eco","com"]},
  {s:"Midstream",c:["mid"]},
  {s:"Gestión de proyectos (Jira y Primavera P6)",c:["jkb","jsc","jbg","jcl","p6p","p6r","p6c","p6k"]}]},
 {g:"Transición energética",sub:[{s:"Emisiones y metano",c:["gei"]},{s:"Captura y almacenamiento de CO₂",c:["alm"]}]},
 {g:"Ciencia de datos",sub:[{s:"Ciencia de datos e IA",c:["dat"]}]},
 {g:"HSE",sub:[{s:"Seguridad de procesos y control de pozos",c:["hse","spc"]}]}];
const FREE_MAX=2, SUB_URL="../cursos/suscripcion.html";
function treeOf(){const out=TREE.map(g=>({g:g.g,sub:g.sub.map(x=>({s:x.s,c:x.c.filter(id=>meta(id))}))}));
  const seen=new Set(TREE.flatMap(g=>g.sub.flatMap(x=>x.c)));const rest=CAT.courses.map(c=>c.id).filter(id=>!seen.has(id));
  if(rest.length)out.push({g:"Otros",sub:[{s:"Otros cursos",c:rest}]});return out}
function groupOf(id){for(const g of treeOf())for(const x of g.sub)if(x.c.includes(id))return g.g+" "+x.s;return""}
const enrolled=id=>!!(DB.c[id]&&(DB.c[id].enr||[]).includes(ME));
const freeLeft=()=>Math.max(0,FREE_MAX-DB.sub.free.length);
function addBtn(m){
  if(ST.role==="docente")return `<button class="btn g" data-act="curso" data-v="${m.id}">Ver curso</button>`;
  if(enrolled(m.id))return `<span class="pill p-ok">Inscripto/a</span> <button class="btn g" data-act="curso" data-v="${m.id}">Ver curso</button>`;
  if(freeLeft()>0)return `<button class="btn" data-act="addfree" data-v="${m.id}"><span class="al">Añadir curso</span> · Free</button>`;
  return `<a class="btn" style="text-decoration:none;display:inline-block" href="${SUB_URL}" target="_blank" rel="noopener noreferrer"><span class="al">Añadir curso</span> · Acceda con suscripción</a>`;
}
function results(){
  const q=norm(ST.hq.trim());
  if(!q)return"";
  const l=CAT.courses.filter(m=>norm(m.title+" "+m.short+" "+m.tag+" "+groupOf(m.id)).includes(q));
  if(!l.length)return `<div class="empty">Ningún curso coincide con “${esc(ST.hq.trim())}”.</div>`;
  return `<p class="mu sm" style="margin:8px 0">${l.length} ${l.length===1?"resultado":"resultados"}</p>`+l.map(m=>`<div class="row res" style="border-left:4px solid ${esc(m.color)}"><div class="m"><b>${esc(m.title)}</b><small>${esc(m.tag)} · ${esc(lvTxt(m))}</small><small class="sh2">${esc(m.short)}</small></div><div class="ctl">${addBtn(m)}</div></div>`).join("");
}
function treeModal(){
  return `<div class="ov" data-act="closemodal"><div class="dlg" role="dialog" aria-modal="true" aria-labelledby="dt" data-stop="1">
   <div class="dh"><div><b id="dt">Cursos H3L</b><small class="mu">Agrupados por área y especialidad</small></div><div class="ctl"><button class="btn g" data-act="treeall" data-v="1">Expandir todo</button><button class="btn g" data-act="treeall" data-v="0">Contraer todo</button><button class="btn g" data-act="closemodal" aria-label="Cerrar">✕</button></div></div>
   <div class="db tree2">${treeOf().map((g,i)=>`<details ${i===0?"open":""}><summary class="g1">${esc(g.g)} <span class="cnt">${(n=>n+" "+(n===1?"curso":"cursos"))(g.sub.reduce((a,x)=>a+x.c.length,0))}</span></summary>${g.sub.map(x=>`<details class="sb"><summary class="g2">${esc(x.s)} <span class="cnt">${x.c.length}</span></summary>${x.c.map(id=>{const m=meta(id);return `<div class="lf"><i class="dot" style="background:${esc(m.color)}"></i><span class="ct">${esc(m.title)}<small>${esc(lvTxt(m))}</small></span><button class="btn g" data-act="curso" data-v="${id}">Ver curso</button></div>`}).join("")}</details>`).join("")}</details>`).join("")}</div></div></div>`;
}
function inicio(){
  const mine=myCourses();
  return `<h1>${ST.role==="alumno"?"Mis cursos":"Cursos a mi cargo"}</h1>
  <p class="mu">${ST.role==="alumno"?"Cursos en los que está inscripto/a.":"Cursos con alumnos inscriptos."}</p>
  ${mine.length?`<div class="grid">${mine.map(courseCard).join("")}</div>`:`<div class="empty">Todavía no hay cursos para mostrar.</div>`}
  <h2>Suscríbase a cursos H3L</h2>
  <p class="mu sm" style="margin-top:-6px">${ST.role==="alumno"?`Tiene <b>${freeLeft()}</b> de ${FREE_MAX} cursos gratis disponibles; los demás se habilitan con suscripción. `:""}Busque por nombre o tema, o explore todos los cursos.</p>
  <div class="bar"><input type="search" id="hq" placeholder="Buscar curso por palabra…" value="${esc(ST.hq)}" autocomplete="off"> <button class="btn g" data-act="openmodal">Ver cursos</button></div>
  <div id="cg">${results()}</div>
  <h2>Clase piloto</h2><div class="card"><b>Ingeniería de Reservorios · Balance de materiales</b><p class="mu sm" style="margin:4px 0 10px">Modelo piloto con video de la clase, actividad guiada, evaluación y asistencia.</p><a class="btn g" style="text-decoration:none;display:inline-block" href="piloto-reservorios/">Abrir clase piloto</a></div>`;
}

/* ---------- curso ---------- */
const TABS=[["prog","Programa"],["mat","Materiales"],["asis","Asistencia"],["cal","Calificaciones"],["foro","Foro"]];
function curso(){
  const id=ST.cid,m=meta(id),s=secOf(id),d=CD(id);
  return `<div class="crumb"><button data-act="go" data-v="inicio">Inicio</button> › ${esc(s?s.title:"")}</div>
  <h1>${esc(m.title)}</h1><p class="mu" style="margin:0">${esc(m.short)}</p>
  <p class="sm mu" style="margin:6px 0 0"><span class="pill p-i">${esc(m.tag)}</span> &nbsp;${esc(d.per)} · ${d.enr.length} alumnos</p>
  <div class="tabs" role="tablist">${TABS.map(([k,l])=>`<button role="tab" data-act="tab" data-v="${k}" aria-selected="${ST.tab===k}">${l}</button>`).join("")}</div>
  ${({prog:tProg,mat:tMat,asis:tAsis,cal:tCal,foro:tForo})[ST.tab]()}`;
}
function tProg(){
  const id=ST.cid,p=PROG[id];
  if(p===undefined){loadProg(id);return `<div class="empty">Cargando programa…</div>`}
  if(p===null)return `<div class="empty">Cargando programa…</div>`;
  if(!p)return `<div class="empty">No se pudo cargar el programa.</div>`;
  const nl=p.modules.reduce((a,x)=>a+x.lessons.length,0);
  return `<div class="card"><p style="margin:0 0 8px">${esc(p.desc||p.subtitle||"")}</p><p class="mu sm" style="margin:0">${p.modules.length} módulos · ${nl} lecciones${(p.downloads||[]).length?` · ${(p.downloads||[]).length} planillas de práctica`:""}</p>
   <p style="margin:12px 0 0"><a class="btn" style="text-decoration:none;display:inline-block" href="../cursos/curso.html?c=${encodeURIComponent(id)}">Cursar en Cursos H3L</a></p></div>
   <div class="tree">${p.modules.map(md=>`<details><summary>${esc(md.title)} <span class="cnt">${md.lessons.length} lecciones</span></summary>${md.lessons.map(l=>`<div class="cl" style="cursor:default"><i class="dot" style="background:#b8c3d6"></i>${esc(l.title)}</div>`).join("")}</details>`).join("")}</div>`;
}
function loadProg(id){PROG[id]=null;
  fetch("../cursos/data/"+encodeURIComponent(id)+".json").then(r=>r.json()).then(j=>{PROG[id]=j}).catch(()=>{PROG[id]=false}).then(()=>{if(ST.page==="curso"&&ST.cid===id&&ST.tab==="prog")render()})}

/* materiales con visibilidad */
const vis=m=>m.vis||(m.desde&&m.desde<=TODAY);
function estado(m){if(m.vis)return["Visible para alumnos","p-ok"];if(m.desde)return m.desde<=TODAY?["Visible (programado)","p-ok"]:["Programado: "+m.desde,"p-sch"];return["Oculto","p-off"]}
function tMat(){
  const d=CD(ST.cid),doc=ST.role==="docente",list=doc?d.mat:d.mat.filter(vis);
  let h="";
  if(doc){const v=d.mat.filter(vis).length;
    h+=`<div class="kpis"><div class="kpi"><b>${d.mat.length}</b><small>archivos</small></div><div class="kpi"><b>${v}</b><small>visibles para alumnos</small></div><div class="kpi"><b>${d.mat.length-v}</b><small>ocultos o programados</small></div></div>
    <div class="drop" id="drop">Arrastre archivos aquí o <label class="btn g" style="cursor:pointer">Elegir archivo<input type="file" id="file" multiple hidden></label>
    <div class="mu sm" style="margin-top:8px">Los archivos nuevos quedan <b>ocultos</b> hasta que usted los habilite. En esta versión de prueba solo se guarda nombre y tamaño.</div></div>`}
  if(!list.length)return h+`<div class="empty">${doc?"Todavía no hay materiales cargados.":"El docente aún no habilitó materiales."}</div>`;
  [...new Set(list.map(m=>m.mod))].forEach(mod=>{
    h+=`<div class="mod"><h4>${esc(mod)}</h4>`;
    list.filter(m=>m.mod===mod).forEach(m=>{const [et,ek]=estado(m);
      h+=`<div class="row ${doc&&!vis(m)?"off":""}"><div class="ext">${esc(m.ext)}</div><div class="m"><b>${esc(m.t)}</b><small>${esc(m.file)} · ${size(m.kb)}</small></div>`;
      if(doc)h+=`<div class="ctl"><span class="pill ${ek}">${et}</span>
        <label class="t">Visible <button class="sw" role="switch" aria-checked="${m.vis}" data-act="mvis" data-v="${m.id}"></button></label>
        <label class="t">Desde <input type="date" value="${esc(m.desde)}" data-f="mdesde" data-v="${m.id}" ${m.vis?"disabled":""}></label>
        <label class="t"><input type="checkbox" ${m.dl?"checked":""} data-f="mdl" data-v="${m.id}"> Descargable</label>
        <button class="btn g" data-act="mdel" data-v="${m.id}">Quitar</button></div>`;
      else h+=`<div class="ctl"><button class="btn g" data-act="mopen">Ver</button><button class="btn" data-act="mdown" ${m.dl?"":'disabled title="El docente no habilitó la descarga"'}>Descargar</button></div>`;
      h+=`</div>`});
    h+=`</div>`});
  return h;
}
function addFiles(files){
  const d=CD(ST.cid);
  [...files].forEach(f=>{const e=(f.name.split(".").pop()||"").toLowerCase();
    d.mat.push({id:d.nid++,mod:"Material nuevo (sin clasificar)",t:f.name.replace(/\.[^.]+$/,""),ext:({pdf:"PDF",mp4:"VID",mov:"VID",xlsx:"XLS",xls:"XLS",csv:"XLS",pptx:"PPT",ppt:"PPT",docx:"DOC"})[e]||"ARC",file:f.name,kb:Math.max(1,Math.round(f.size/1024)),vis:false,desde:"",dl:false})});
  save();render();toast("Archivo agregado como oculto");
}

/* asistencia */
function tAsis(){
  const d=CD(ST.cid),doc=ST.role==="docente";
  if(!d.cls.length&&!doc)return `<div class="empty">Todavía no hay clases registradas.</div>`;
  let h=`<p class="mu sm">Cada clase es <b>Virtual</b> o <b>Presencial</b>. El video de la clase del docente existe solo en las virtuales y lo habilita el docente.</p>`;
  if(doc&&!d.enr.length)return h+`<div class="empty">Sin alumnos inscriptos.</div>`;
  d.cls.forEach(c=>{
    h+=`<div class="row"><div class="ext">${esc(c.f.slice(8))}/${esc(c.f.slice(5,7))}</div><div class="m"><b>${esc(c.t)}</b><small>${esc(c.f)} · ${c.mod}${c.mod==="Virtual"?" · puede ser grabada por el docente":""}</small></div>`;
    if(doc)h+=`<div class="ctl"><select data-f="cmod" data-v="${c.id}"><option ${c.mod==="Virtual"?"selected":""}>Virtual</option><option ${c.mod==="Presencial"?"selected":""}>Presencial</option></select><span class="vcol">${c.mod==="Virtual"?`<label class="t">Video visible <button class="sw" role="switch" aria-checked="${c.vis}" data-act="cvis" data-v="${c.id}"></button></label>`:`<span class="mu sm">Sin video</span>`}</span></div>`;
    else{const v=c.asis[ME];h+=`<div class="ctl"><span class="pill ${v==="P"?"p-ok":v==="A"?"p-off":v==="J"?"p-i":"p-sch"}">${v==="P"?"Presente":v==="A"?"Ausente":v==="J"?"Justificada":"Sin registrar"}</span>${c.mod==="Virtual"?(c.link?`<a class="btn" style="text-decoration:none" href="${esc(c.link)}" target="_blank" rel="noopener noreferrer">Unirse a la clase virtual</a>`:`<span class="mu sm">Enlace a confirmar</span>`):""}${c.mod==="Virtual"&&c.vis?`<button class="btn g" data-act="cdown">Descargar video de la clase</button>`:""}</div>`}
    if(doc&&c.mod==="Virtual")h+=virtualPanel(c);
    h+=`</div>`});
  if(doc&&d.cls.length)h+=`<h3>Registro de asistencia</h3><div class="tw"><table><tr><th>Alumno</th>${d.cls.map(c=>`<th class="n">${esc(c.f.slice(5))}</th>`).join("")}<th class="n">%</th></tr>`+
    d.enr.map(s=>`<tr><td>${esc(stName(s))}</td>${d.cls.map(c=>`<td class="n"><select data-f="att" data-c="${c.id}" data-s="${s}"><option value="">—</option>${["P","A","J"].map(o=>`<option ${c.asis[s]===o?"selected":""}>${o}</option>`).join("")}</select></td>`).join("")}<td class="n">${attPct(ST.cid,s)??"—"}${attPct(ST.cid,s)!=null?" %":""}</td></tr>`).join("")+`</table></div><p class="mu sm">P = presente · A = ausente · J = justificada (no cuenta).</p>`;
  if(!doc){const a=attPct(ST.cid,ME);h+=`<p class="mu sm">Asistencia acumulada: <b>${a==null?"—":a+" %"}</b></p>`}
  return h;
}
const BLOBS={}, REC={on:null,t0:0,timer:null,mr:null,chunks:[],streams:[],ac:null}, PV={};
const bkey=(cid,id)=>cid+":"+id;
function virtualPanel(c){
  const k=bkey(ST.cid,c.id),rec=REC.on===k,b=BLOBS[k];
  return `<div class="sub"><div class="subr"><label class="t" style="flex:1;min-width:260px">Enlace a la clase online <input type="url" placeholder="https://… (Meet, Zoom, Teams)" value="${esc(c.link||"")}" data-f="clink" data-v="${c.id}" style="flex:1"></label>${c.link?`<a class="btn g" style="text-decoration:none" href="${esc(c.link)}" target="_blank" rel="noopener noreferrer">Abrir enlace</a>`:""}</div>
   <div class="subr">${rec?`<span class="pill p-off">● Grabando <span id="rt">${mmss((Date.now()-REC.t0)/1000)}</span></span><button class="btn" data-act="recstop">Detener grabación</button>`:`<button class="btn g" data-act="rec" data-v="${c.id}" ${REC.on?"disabled":""}>● Grabar clase</button>`}
    ${b?`<span class="pill p-ok">Grabación lista · ${size(Math.round(b.blob.size/1024))}</span><button class="btn g" data-act="recview" data-v="${c.id}">${PV[k]?"Ocultar":"Ver"}</button><button class="btn" data-act="recdl" data-v="${c.id}">Descargar (.webm)</button>`:""}</div>
   ${b&&PV[k]?`<video controls src="${b.url}" style="width:100%;max-width:560px;border-radius:8px;margin-top:8px"></video>`:""}
   <p class="mu sm" style="margin:6px 0 0">Al grabar, el navegador pide elegir la pestaña o ventana de la clase (marque “compartir audio”) y el micrófono. Avise a los alumnos antes de grabar. En esta versión de prueba la grabación queda solo en esta sesión: descárguela; en la versión definitiva se guarda en el servidor.</p></div>`;
}
const mmss=s=>String(Math.floor(s/60)).padStart(2,"0")+":"+String(Math.floor(s%60)).padStart(2,"0");
async function startRec(id){
  const k=bkey(ST.cid,id);
  if(!navigator.mediaDevices||!navigator.mediaDevices.getDisplayMedia||!window.MediaRecorder){toast("Este navegador no permite grabar. Use Chrome, Edge o Firefox de escritorio.");return}
  try{
    const disp=await navigator.mediaDevices.getDisplayMedia({video:true,audio:true});
    let mic=null;try{mic=await navigator.mediaDevices.getUserMedia({audio:true})}catch(e){toast("Sin micrófono: se grabará solo el audio compartido.")}
    const ac=new (window.AudioContext||window.webkitAudioContext)(),dest=ac.createMediaStreamDestination();let na=0;
    [disp,mic].forEach(st=>{if(st&&st.getAudioTracks().length){ac.createMediaStreamSource(new MediaStream(st.getAudioTracks())).connect(dest);na++}});
    const out=new MediaStream([...disp.getVideoTracks(),...(na?dest.stream.getAudioTracks():[])]);
    const mt=["video/webm;codecs=vp9,opus","video/webm;codecs=vp8,opus","video/webm"].find(t=>MediaRecorder.isTypeSupported(t))||"";
    const mr=new MediaRecorder(out,mt?{mimeType:mt}:undefined);
    REC.chunks=[];REC.mr=mr;REC.ac=ac;REC.streams=[disp,mic].filter(Boolean);REC.on=k;REC.t0=Date.now();
    mr.ondataavailable=e=>{if(e.data&&e.data.size)REC.chunks.push(e.data)};
    mr.onstop=()=>{
      const blob=new Blob(REC.chunks,{type:"video/webm"});
      if(BLOBS[k])try{URL.revokeObjectURL(BLOBS[k].url)}catch(e){}
      BLOBS[k]={blob,url:URL.createObjectURL(blob)};
      REC.streams.forEach(st=>st.getTracks().forEach(t=>t.stop()));try{ac.close()}catch(e){}
      clearInterval(REC.timer);REC.on=null;
      const [cid,cl]=k.split(":");const c=CD(cid).cls.find(x=>x.id==cl);if(c){c.video=true;save()}
      toast("Grabación finalizada. Descárguela para conservarla.");render();
    };
    disp.getVideoTracks()[0].addEventListener("ended",()=>{if(REC.mr&&REC.mr.state!=="inactive")REC.mr.stop()});
    mr.start(1000);
    REC.timer=setInterval(()=>{const e=$("#rt");if(e)e.textContent=mmss((Date.now()-REC.t0)/1000)},1000);
    toast("Grabando la clase");render();
  }catch(e){REC.on=null;toast(e&&e.name==="NotAllowedError"?"Grabación cancelada o sin permiso.":"No se pudo iniciar la grabación.");render()}
}
const stName=id=>(STUDENTS.find(s=>s.id===id)||{n:id}).n;

/* calificaciones */
function tCal(){
  const id=ST.cid,d=CD(id);
  if(ST.role==="alumno"){
    if(!d.enr.includes(ME))return `<div class="empty">No está inscripto/a en este curso.</div>`;
    const gr=d.g[ME]||{tp:{}},[c,k]=cond(id,ME);
    return `<div class="card"><div class="tw" style="border:0"><table><tr><th>Concepto</th><th class="n">Nota</th></tr>
      ${d.tps.map(t=>`<tr><td>${esc(t)}</td><td class="n">${f1((gr.tp||{})[t])}</td></tr>`).join("")}
      <tr><td><b>Promedio de TPs</b></td><td class="n"><b>${f1(tpAvg(id,ME))}</b></td></tr>
      <tr><td>Examen</td><td class="n">${f1(gr.ex)}</td></tr>
      <tr><td><b>Nota final</b></td><td class="n"><b>${f1(gr.fin)}</b></td></tr></table></div>
      <p style="margin:10px 0 0">Condición: <span class="pill ${k}">${c}</span> ${c==="Aprobado"?`<button class="btn g" data-act="cert" data-v="${id}" style="margin-left:8px;padding:4px 12px;font-size:13px">Ver certificado de aprobación</button>`:""}</p></div>
      <p class="mu sm">Todas sus calificaciones figuran en <button class="btn g" data-act="go" data-v="perfil" style="padding:3px 10px;font-size:13px">Mi perfil y analítico</button></p>`;
  }
  if(!d.enr.length)return `<div class="empty">Este curso no tiene alumnos inscriptos en la versión de prueba.<p><button class="btn" data-act="enroll">Inscribir alumnos de ejemplo</button></p></div>`;
  return `<div class="noprint" style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:10px">
    <button class="btn g" data-act="addtp">+ Agregar TP</button>
    <label class="t">Peso de TPs en la nota final <input type="number" min="0" max="100" value="${d.wTP}" data-f="wtp" style="width:64px"> %</label>
    <button class="btn" data-act="calcfin">Calcular notas finales</button><div class="sp" style="flex:1"></div>
    <button class="btn g" data-act="csv">Exportar CSV</button></div>
  <div class="tw"><table><tr><th>Alumno</th>${d.tps.map(t=>`<th class="n">${esc(t)}<button class="x" title="Quitar ${esc(t)}" data-act="deltp" data-v="${esc(t)}">×</button></th>`).join("")}<th class="n">Prom. TPs</th><th class="n">Examen</th><th class="n">Nota final</th><th>Condición</th></tr>`+
   d.enr.map(s=>{const gr=d.g[s]||{tp:{}},[c,k]=cond(id,s),sg=suggested(id,s);
    return `<tr><td>${esc(stName(s))}</td>${d.tps.map(t=>`<td class="n"><input type="number" min="0" max="10" step="0.5" value="${(gr.tp||{})[t]??""}" data-f="tp" data-s="${s}" data-t="${esc(t)}"></td>`).join("")}
     <td class="n">${f1(tpAvg(id,s))}</td><td class="n"><input type="number" min="0" max="10" step="0.5" value="${gr.ex??""}" data-f="ex" data-s="${s}"></td>
     <td class="n fin"><input type="number" min="0" max="10" step="0.5" value="${gr.fin??""}" data-f="fin" data-s="${s}">${sg!=null&&gr.fin==null?`<div class="sug">sugerida ${f1(sg)}</div>`:""}</td><td><span class="pill ${k}">${c}</span></td></tr>`}).join("")+`</table></div>
  <p class="mu sm">Cada TP admite una nota de 0 a 10; puede agregar o quitar TPs. La nota final se puede cargar a mano o calcular (promedio de TPs × peso + examen × resto). Aprobación desde ${PASS}.</p>`;
}
function califIndex(){
  const ids=myCourses();
  return `<h1>Calificaciones</h1><p class="mu">Elija un curso para cargar TPs, examen y nota final.</p>${ids.length?`<div class="grid">${ids.map(id=>`<button class="cc" style="--c:${esc(meta(id).color)}" data-act="curso" data-v="${id}" data-tab="cal"><b>${esc(meta(id).title)}</b><small>${CD(id).enr.length} alumnos · ${esc(CD(id).per)}</small></button>`).join("")}</div>`:`<div class="empty">Sin cursos con alumnos. Abra un curso y use “Inscribir alumnos de ejemplo”.</div>`}`;
}

/* foro */
function tForo(){
  const d=CD(ST.cid);
  return (d.foro.length?d.foro.map(m=>`<div class="msg"><b>${esc(m.a)}</b> <small>· ${esc(m.d)}</small><div>${esc(m.t)}</div></div>`).join(""):`<div class="empty">Sin mensajes todavía.</div>`)+
   `<div class="card" style="margin-top:12px"><textarea id="ft" rows="2" style="width:100%" placeholder="Escribir en el foro del curso…"></textarea><p style="margin:8px 0 0"><button class="btn" data-act="post">Publicar</button></p></div>`;
}

/* perfil y analítico */
function perfil(){
  const me=STUDENTS[0];
  const rows=Object.keys(DB.c).filter(id=>meta(id)&&(DB.c[id].enr||[]).includes(ME)).map(id=>({id,d:CD(id),m:meta(id)})).sort((a,b)=>b.d.per.localeCompare(a.d.per));
  const fins=rows.map(r=>(r.d.g[ME]||{}).fin).filter(x=>x!=null),ap=fins.filter(x=>x>=PASS).length,enc=rows.length-fins.length;
  const prom=fins.length?fins.reduce((a,b)=>a+b,0)/fins.length:null;
  return `<h1>Mi perfil</h1>
  <div class="card prof"><div class="av">${esc(me.n[0])}</div><div><b style="font:600 20px var(--serif)">${esc(me.n)}</b>
   <div class="dl"><div><span>Legajo</span>${me.leg}</div><div><span>Correo (ejemplo)</span>${me.mail}</div><div><span>Ingreso</span>${me.ing}</div><div><span>Programa</span>Capacitación H3L</div></div></div></div>
  <div class="kpis"><div class="kpi"><b>${ap}</b><small>cursos aprobados</small></div><div class="kpi"><b>${enc}</b><small>en curso</small></div><div class="kpi"><b>${f1(prom)}</b><small>promedio general</small></div></div>
  <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap"><h2 style="margin:10px 0">Analítico de calificaciones</h2><div class="sp" style="flex:1"></div><span class="noprint"><button class="btn g" data-act="csvp">Descargar CSV</button> <button class="btn g" data-act="print">Imprimir</button></span></div>
  <div class="tw"><table><tr><th>Curso</th><th>Período</th><th>TPs</th><th class="n">Prom. TPs</th><th class="n">Examen</th><th class="n">Nota final</th><th>Condición</th><th class="noprint">Certificado</th></tr>`+
  rows.map(r=>{const gr=r.d.g[ME]||{tp:{}},[c,k]=cond(r.id,ME);
   return `<tr><td style="white-space:normal;min-width:220px"><b>${esc(r.m.title)}</b></td><td>${esc(r.d.per)}</td><td>${r.d.tps.map(t=>esc(t)+": "+f1((gr.tp||{})[t])).join(" · ")}</td><td class="n">${f1(tpAvg(r.id,ME))}</td><td class="n">${f1(gr.ex)}</td><td class="n"><b>${f1(gr.fin)}</b></td><td><span class="pill ${k}">${c}</span></td><td class="noprint">${c==="Aprobado"?`<button class="btn g" data-act="cert" data-v="${r.id}" style="padding:4px 12px;font-size:13px">Ver certificado</button>`:"—"}</td></tr>`}).join("")+`</table></div>
  <p class="mu sm">Escala 0–10; aprobación desde ${PASS}. Documento de ejemplo: no tiene validez académica ni certifica estudios.</p>`;
}

/* certificado de aprobación */
function certCode(id){let h=0;const t="H3L-0001|"+id;for(let i=0;i<t.length;i++)h=(h*31+t.charCodeAt(i))>>>0;return"H3L-EJ-"+h.toString(36).toUpperCase().padStart(7,"0")}
function fecha(iso){const[a,m,d]=iso.split("-");const M=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];return +d+" de "+M[+m-1]+" de "+a}
function certPage(){
  const id=ST.cid,m=meta(id),d=CD(id),gr=d.g[ME]||{},me=STUDENTS[0];
  if(!m||gr.fin==null||gr.fin<PASS)return `<div class="empty">El certificado se emite solo para cursos aprobados.<p><button class="btn g" data-act="go" data-v="perfil">Volver al perfil</button></p></div>`;
  return `<div class="noprint" style="display:flex;gap:8px;margin-bottom:14px;flex-wrap:wrap"><button class="btn g" data-act="go" data-v="perfil">← Volver al analítico</button><button class="btn" data-act="print">Imprimir / Guardar como PDF</button></div>
  <section class="cert" aria-label="Certificado de aprobación"><div class="cin">
   <img src="../LOGO_H3L.png" alt="H3L Global Energy" class="clogo">
   <div class="ck">Campus Virtual H3L</div>
   <h1>Certificado de aprobación</h1>
   <p class="cl1">H3L Global Energy certifica que</p>
   <p class="cn">${esc(me.n)}</p><p class="cs">Legajo ${esc(me.leg)}</p>
   <p class="cl1">aprobó el curso</p>
   <p class="cc2">${esc(m.title)}</p>
   <p class="cs">${esc(m.tag)} · Período ${esc(d.per)} · Nota final ${f1(gr.fin)} (escala 0–10, aprobación desde ${PASS})</p>
   <div class="cf"><div><div class="line"></div>Dirección académica<br>H3L Global Energy</div><div class="cq"><span>Código</span><b>${certCode(id)}</b><span>Emitido el ${fecha(TODAY)}</span></div></div>
   <p class="cx">Documento de ejemplo emitido por la versión de prueba del campus. No tiene validez académica ni certifica estudios.</p>
  </div></section>`;
}
/* exportar */
function dl(name,text){try{const a=document.createElement("a");a.href=URL.createObjectURL(new Blob(["﻿"+text],{type:"text/csv;charset=utf-8"}));a.download=name;document.body.appendChild(a);a.click();a.remove()}catch(e){}toast("Descarga solicitada: "+name)}
const csvq=v=>'"'+String(v??"").replace(/"/g,'""')+'"';

/* ---------- eventos ---------- */
document.addEventListener("click",e=>{
  const b=e.target.closest("[data-act]");
  if(!b){if(ST.menu&&!e.target.closest(".menuwrap")){ST.menu=false;render()}return}
  const a=b.dataset.act,v=b.dataset.v,d=ST.cid?CD(ST.cid):null;
  switch(a){
   case"role":ST.role=v;ST.page=ST.page==="perfil"&&v==="docente"?"inicio":ST.page==="calif"&&v==="alumno"?"inicio":ST.page;ST.menu=false;break;
   case"go":ST.page=v;ST.menu=false;break;
   case"menu":ST.menu=!ST.menu;break;
   case"curso":ST.modal=false;ST.cid=v;ST.page="curso";ST.tab=b.dataset.tab||"prog";ST.menu=false;ST.q="";window.scrollTo(0,0);break;
   case"tab":ST.tab=v;break;
   case"openmodal":ST.modal=true;break;
   case"closemodal":if(e.target.closest("[data-stop]")&&b.classList.contains("ov"))return;ST.modal=false;break;
   case"treeall":$$(".tree2 details").forEach(x=>{x.open=v==="1"});return;
   case"addfree":{if(freeLeft()<1){render();return}const dd=CD(v);if(!dd.enr.includes(ME))dd.enr.push(ME);DB.sub.free.push(v);save();toast("Curso añadido a Mis cursos");break}
   case"mvis":{const m=d.mat.find(x=>x.id==v);m.vis=!m.vis;if(m.vis)m.desde="";save();break}
   case"mdel":d.mat=d.mat.filter(x=>x.id!=v);save();break;
   case"mopen":toast("En la versión definitiva se abre el visor del archivo.");return;
   case"mdown":toast("Descarga autorizada por el docente (versión definitiva).");return;
   case"cvis":{const c=d.cls.find(x=>x.id==v);c.vis=!c.vis;save();break}
   case"rec":startRec(v);return;
   case"recstop":if(REC.mr&&REC.mr.state!=="inactive")REC.mr.stop();return;
   case"recview":{const k=bkey(ST.cid,v);PV[k]=!PV[k];break}
   case"recdl":{const k=bkey(ST.cid,v),bb=BLOBS[k];if(bb){const a=document.createElement("a");a.href=bb.url;a.download="clase_"+ST.cid+"_"+v+"_"+TODAY+".webm";document.body.appendChild(a);a.click();a.remove();toast("Descarga solicitada")}return}
   case"cdown":toast("Descarga del video de la clase del docente (versión definitiva).");return;
   case"addtp":d.tps.push("TP"+(d.tps.length+1));save();break;
   case"deltp":if(d.tps.length<2){toast("Debe quedar al menos un TP");return}d.tps=d.tps.filter(t=>t!==v);save();break;
   case"calcfin":{let n=0;d.enr.forEach(s=>{const x=suggested(ST.cid,s);if(x!=null){setG(ST.cid,s,r=>{r.fin=x});n++}});toast(n?"Notas finales calculadas para "+n+" alumno/s":"Faltan TPs o examen para calcular");break}
   case"enroll":d.enr=STUDENTS.map(s=>s.id);save();break;
   case"post":{const t=$("#ft").value.trim();if(!t)return;d.foro.push({a:ST.role==="docente"?"Docente":"Alumno/a de ejemplo",t,d:TODAY});save();break}
   case"csv":{const h=["Alumno",...d.tps,"Prom. TPs","Examen","Nota final","Condición"];const r=d.enr.map(s=>{const gr=d.g[s]||{tp:{}};return [stName(s),...tpVals(ST.cid,s).map(x=>x??""),tpAvg(ST.cid,s)==null?"":f1(tpAvg(ST.cid,s)),gr.ex??"",gr.fin??"",cond(ST.cid,s)[0]]});dl("calificaciones_"+ST.cid+".csv",[h,...r].map(x=>x.map(csvq).join(";")).join("\n"));return}
   case"csvp":{const h=["Curso","Período","TPs","Prom. TPs","Examen","Nota final","Condición"];const r=Object.keys(DB.c).filter(id=>meta(id)&&DB.c[id].enr.includes(ME)).map(id=>{const gr=CD(id).g[ME]||{tp:{}};return [meta(id).title,CD(id).per,CD(id).tps.map(t=>t+": "+f1((gr.tp||{})[t])).join(" | "),f1(tpAvg(id,ME)),f1(gr.ex),f1(gr.fin),cond(id,ME)[0]]});dl("analitico_H3L-0001.csv",[h,...r].map(x=>x.map(csvq).join(";")).join("\n"));return}
   case"print":window.print();return;
   case"cert":ST.cid=v;ST.page="cert";window.scrollTo(0,0);break;
  }
  render();
});
document.addEventListener("change",e=>{
  const t=e.target,f=t.dataset.f;if(!f)return;const d=ST.cid?CD(ST.cid):null;
  if(t.id==="file"){addFiles(t.files);return}
  switch(f){
   case"mdesde":d.mat.find(x=>x.id==t.dataset.v).desde=t.value;save();break;
   case"mdl":d.mat.find(x=>x.id==t.dataset.v).dl=t.checked;save();return;
   case"clink":{const c=d.cls.find(x=>x.id==t.dataset.v);const u=t.value.trim();if(u&&!/^https:\/\/[^\s]+$/i.test(u)){toast("El enlace debe comenzar con https://");t.value=c.link||"";return}c.link=u;save();toast(u?"Enlace guardado":"Enlace quitado");break}
   case"cmod":{const c=d.cls.find(x=>x.id==t.dataset.v);c.mod=t.value;if(c.mod==="Presencial")c.vis=false;save();break}
   case"att":{const c=d.cls.find(x=>x.id==t.dataset.c);if(t.value)c.asis[t.dataset.s]=t.value;else delete c.asis[t.dataset.s];save();break}
   case"wtp":d.wTP=Math.min(100,Math.max(0,parseInt(t.value)||0));save();break;
   case"tp":setG(ST.cid,t.dataset.s,r=>{r.tp[t.dataset.t]=num(t.value)});break;
   case"ex":setG(ST.cid,t.dataset.s,r=>{r.ex=num(t.value)});break;
   case"fin":setG(ST.cid,t.dataset.s,r=>{r.fin=num(t.value)});break;
  }
  render();
});
document.addEventListener("input",e=>{if(e.target.id==="mq"){ST.q=e.target.value;$("#ml").innerHTML=menuList()}
  if(e.target.id==="hq"){ST.hq=e.target.value;$("#cg").innerHTML=results()}});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&(ST.menu||ST.modal)){ST.menu=false;ST.modal=false;render()}});
["dragover","dragenter"].forEach(ev=>document.addEventListener(ev,e=>{const z=e.target.closest&&e.target.closest("#drop");if(z){e.preventDefault();z.classList.add("over")}}));
document.addEventListener("dragleave",e=>{const z=e.target.closest&&e.target.closest("#drop");if(z)z.classList.remove("over")});
document.addEventListener("drop",e=>{const z=e.target.closest&&e.target.closest("#drop");if(z){e.preventDefault();addFiles(e.dataTransfer.files)}});

/* ---------- arranque ---------- */
render();
fetch("../cursos/data/catalog.json").then(r=>r.json()).then(j=>{CAT=j;render()}).catch(()=>{$("#pg").innerHTML='<div class="empty">No se pudo cargar el catálogo de Cursos H3L.</div>'});
