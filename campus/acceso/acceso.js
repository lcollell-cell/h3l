/* Acceso al Campus Virtual H3L. Autor: Leandro Collell.
   El contenido y el video estan cifrados (AES-GCM 256). La clave de cada rol solo se abre con
   usuario + contrasena (PBKDF2-SHA256). No se guarda nada en el navegador.
   Modo abierto: si existe datos/abierto.json, Capacitacion Interna se muestra sin usuario ni contrasena
   (ese archivo es publico). Para volver a pedir clave, borrar datos/abierto.json y el video abierto. */
(function(){
'use strict';
var T={
es:{title:'Acceso al Campus',sub:'Elegí tu perfil e ingresá con tu usuario y contraseña.',alumno:'Alumno',alumno_d:'Mis cursos',profesor:'Profesor',profesor_d:'Cursos y gestión',interna:'Capacitación Interna H3L',interna_d:'Socios estratégicos',user:'Usuario',pass:'Contraseña',enter:'Ingresar',wait:'Verificando…',bad:'Usuario o contraseña incorrectos para este perfil.',nocfg:'El acceso todavía no está configurado.',err:'No se pudo abrir el contenido. Probá de nuevo.',nosec:'Este navegador necesita una conexión segura (https).',back:'Volver al Campus',out:'Salir',video:'Video',loading:'Cargando video…',note:'Contenido en español.'},
en:{title:'Campus sign-in',sub:'Choose your profile and sign in with your username and password.',alumno:'Student',alumno_d:'My courses',profesor:'Teacher',profesor_d:'Courses and management',interna:'H3L Internal Training',interna_d:'Strategic partners',user:'Username',pass:'Password',enter:'Sign in',wait:'Checking…',bad:'Wrong username or password for this profile.',nocfg:'Access is not configured yet.',err:'The content could not be opened. Please try again.',nosec:'This browser needs a secure (https) connection.',back:'Back to Campus',out:'Sign out',video:'Video',loading:'Loading video…',note:'Content in Spanish.'},
fr:{title:'Accès au Campus',sub:'Choisissez votre profil et connectez-vous avec votre identifiant et mot de passe.',alumno:'Étudiant',alumno_d:'Mes cours',profesor:'Enseignant',profesor_d:'Cours et gestion',interna:'Formation interne H3L',interna_d:'Partenaires stratégiques',user:'Identifiant',pass:'Mot de passe',enter:'Se connecter',wait:'Vérification…',bad:'Identifiant ou mot de passe incorrect pour ce profil.',nocfg:'L’accès n’est pas encore configuré.',err:'Impossible d’ouvrir le contenu. Réessayez.',nosec:'Ce navigateur exige une connexion sécurisée (https).',back:'Retour au Campus',out:'Se déconnecter',video:'Vidéo',loading:'Chargement de la vidéo…',note:'Contenu en espagnol.'},
pt:{title:'Acesso ao Campus',sub:'Escolha seu perfil e entre com usuário e senha.',alumno:'Aluno',alumno_d:'Meus cursos',profesor:'Professor',profesor_d:'Cursos e gestão',interna:'Capacitação Interna H3L',interna_d:'Parceiros estratégicos',user:'Usuário',pass:'Senha',enter:'Entrar',wait:'Verificando…',bad:'Usuário ou senha incorretos para este perfil.',nocfg:'O acesso ainda não está configurado.',err:'Não foi possível abrir o conteúdo. Tente novamente.',nosec:'Este navegador precisa de uma conexão segura (https).',back:'Voltar ao Campus',out:'Sair',video:'Vídeo',loading:'Carregando vídeo…',note:'Conteúdo em espanhol.'}};
var $=function(i){return document.getElementById(i)},enc=new TextEncoder(),lang='es',rol=null,blobUrl=null,msgKey='';
function say(k){msgKey=k;$('msg').textContent=k?T[lang][k]:''}
function setLang(l){lang=T[l]?l:'es';document.documentElement.lang=lang;$('lang').value=lang;
  document.querySelectorAll('[data-k]').forEach(function(e){e.textContent=T[lang][e.getAttribute('data-k')]});say(msgKey)}
function setRol(r){rol=r;say('');document.querySelectorAll('[data-rol]').forEach(function(b){b.setAttribute('aria-checked',b.getAttribute('data-rol')===r)})}
function b64(s){return Uint8Array.from(atob(s),function(c){return c.charCodeAt(0)})}
function open_(key,iv,data){return crypto.subtle.decrypt({name:'AES-GCM',iv:iv},key,data)}
function aes(raw){return crypto.subtle.importKey('raw',raw,'AES-GCM',false,['decrypt'])}
async function userId(u){var h=await crypto.subtle.digest('SHA-256',enc.encode('h3l-campus|'+u.trim().toLowerCase()));
  return Array.from(new Uint8Array(h),function(x){return x.toString(16).padStart(2,'0')}).join('')}
async function login(u,p){
  var res=await fetch('datos/acceso.json',{cache:'no-store'});
  if(!res.ok) throw 'nocfg';
  var cfg=await res.json(),id=await userId(u);
  var list=cfg.users.filter(function(x){return x.id===id&&x.rol===rol});
  var rec=list[0]||{salt:'AAAAAAAAAAAAAAAAAAAAAA==',iv:'AAAAAAAAAAAAAAAA',key:'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'};
  var base=await crypto.subtle.importKey('raw',enc.encode(p),'PBKDF2',false,['deriveKey']);
  var kek=await crypto.subtle.deriveKey({name:'PBKDF2',hash:'SHA-256',salt:b64(rec.salt),iterations:cfg.iter},base,{name:'AES-GCM',length:256},false,['decrypt']);
  var raw;try{raw=await open_(kek,b64(rec.iv),b64(rec.key))}catch(e){throw 'bad'}
  if(!list[0]) throw 'bad';
  var key=await aes(raw),r=cfg.roles[rol];
  var data=JSON.parse(new TextDecoder().decode(await open_(key,b64(r.iv),b64(r.data))));
  return {data:data,key:key};
}
function el(tag,txt,cls){var e=document.createElement(tag);if(txt!=null)e.textContent=txt;if(cls)e.className=cls;return e}
function safeUrl(u){return /^(https:\/\/|\.\.\/)/.test(u)?u:'#'}
function show(s){
  var d=s.data,a=$('area');a.textContent='';
  var top=el('div',null,'top'),h=el('div');h.appendChild(el('h1',d.titulo));h.appendChild(el('p',d.bienvenida,'sub'));
  var out=el('button',s.open?T[lang].back:T[lang].out,'btn');out.onclick=s.open?function(){location.href='../index.html'}:logout;top.appendChild(h);top.appendChild(out);a.appendChild(top);
  if(d.video){
    a.appendChild(el('h2',d.video.titulo));
    var v=document.createElement('video');v.controls=true;v.playsInline=true;v.setAttribute('controlsList','nodownload');v.disablePictureInPicture=true;
    v.addEventListener('contextmenu',function(e){e.preventDefault()});
    var st=el('p',T[lang].loading,'sub');a.appendChild(v);a.appendChild(st);
    if(s.open){v.src='datos/'+d.video.archivo;st.textContent='';v.onerror=function(){st.textContent=T[lang].err}}else loadVideo(s.key,d.video,v,st);
  }
  if(d.curso&&window.H3LCurso){
    a.appendChild(el('h2',d.curso_titulo||'Curso'));
    var aula=el('div');a.appendChild(aula);window.H3LCurso.mount(aula,d.curso,d.archivos);
  }
  (d.secciones||[]).forEach(function(sec){
    a.appendChild(el('h2',sec.titulo));
    sec.items.forEach(function(it){
      var c=el('details',null,'card');c.appendChild(el('summary',it.t));
      if(it.p)c.appendChild(el('p',it.p,'pre'));
      if(it.l){var ul=el('ul');it.l.forEach(function(x){ul.appendChild(el('li',x))});c.appendChild(ul)}
      if(it.u){var pp=el('p'),k=el('a','Fuente');k.href=safeUrl(it.u);k.target='_blank';k.rel='noopener noreferrer';pp.appendChild(k);c.appendChild(pp)}
      a.appendChild(c);
    });
  });
  var ls=el('div',null,'links');(d.enlaces||[]).forEach(function(x){var k=el('a',x.t,'btn');k.href=safeUrl(x.u);ls.appendChild(k)});a.appendChild(ls);
  a.appendChild(el('p',lang==='es'?'':T[lang].note,'sub'));
  $('login').hidden=true;a.hidden=false;window.scrollTo(0,0);
}
async function loadVideo(key,info,v,st){
  try{
    var res=await fetch('datos/'+info.archivo,{cache:'no-store'});if(!res.ok)throw 0;
    var plain=await open_(key,b64(info.iv),await res.arrayBuffer());
    if(!v.isConnected)return;
    blobUrl=URL.createObjectURL(new Blob([plain],{type:'video/mp4'}));v.src=blobUrl;st.textContent='';
  }catch(e){st.textContent=T[lang].err}
}
function logout(){if(window.H3LCurso)window.H3LCurso.stop();if(blobUrl){URL.revokeObjectURL(blobUrl);blobUrl=null}$('area').textContent='';$('area').hidden=true;$('login').hidden=false;$('f').reset();say('')}
$('lang').onchange=function(){setLang(this.value)};
document.querySelectorAll('[data-rol]').forEach(function(b){b.onclick=function(){setRol(b.getAttribute('data-rol'))}});
$('f').onsubmit=async function(e){
  e.preventDefault();
  if(!window.crypto||!crypto.subtle){say('nosec');return}
  var go=$('go');go.disabled=true;say('wait');
  try{var s=await login($('u').value,$('p').value);$('p').value='';say('');show(s)}
  catch(err){say(err==='bad'||err==='nocfg'?err:'err')}
  go.disabled=false;
};
async function abierto(){
  try{var r=await fetch('datos/abierto.json',{cache:'no-store'});if(!r.ok)return false;show({data:await r.json(),open:true});return true}
  catch(e){return false}
}
var q=new URLSearchParams(location.search);
setRol(['alumno','profesor','interna'].indexOf(q.get('rol'))>=0?q.get('rol'):'alumno');
setLang(q.get('lang')||(navigator.language||'es').slice(0,2));
if(rol==='interna'){$('login').hidden=true;abierto().then(function(ok){if(!ok)$('login').hidden=false})}
document.querySelector('[data-rol=interna]').addEventListener('click',abierto);
})();
