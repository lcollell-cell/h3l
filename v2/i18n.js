/* H3L · motor de idiomas (es, en, fr, pt). Compartido por portada, tableros, consultas y chat.
   El idioma se guarda en localStorage ('h3l_lang', la misma clave del sitio anterior) y puede forzarse con ?lang=xx.
   Desarrollado por Leandro Collell. */
(function(){'use strict';
var L=['es','en','fr','pt'],NAMES={es:'Español',en:'English',fr:'Français',pt:'Português'},LOC={es:'es-AR',en:'en-US',fr:'fr-FR',pt:'pt-BR'};
var NF={es:{th:'.',dec:',',pct:' %'},en:{th:',',dec:'.',pct:'%'},fr:{th:' ',dec:',',pct:' %'},pt:{th:'.',dec:',',pct:'%'}};
var D={es:{},en:{},fr:{},pt:{}},cbs=[],warned={};
function store(k,v){try{if(v==null)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){return null}}
function detect(){
  var q=null;try{q=(new URLSearchParams(location.search)).get('lang')}catch(e){}
  if(q&&L.indexOf(q.slice(0,2))>=0){var l0=q.slice(0,2);store('h3l_lang',l0);return l0}
  var s=store('h3l_lang');if(L.indexOf(s)>=0)return s;
  var n=(navigator.languages&&navigator.languages[0])||navigator.language||'es';n=String(n).slice(0,2).toLowerCase();return L.indexOf(n)>=0?n:'es'}
var H3L={lang:detect(),L:L,names:NAMES,loc:LOC[detect()],nf:NF[detect()]};
H3L.add=function(lang,obj){var d=D[lang];for(var k in obj)d[k]=obj[k]};
H3L.has=function(k){return D.es[k]!=null};
H3L.keys=function(l){return Object.keys(D[l])};
H3L.t=function(k,v){var s=D[H3L.lang][k];if(s==null){s=D.es[k];if(s==null){if(!warned[k]){warned[k]=1;if(window.console)console.warn('[i18n] falta la clave',k)}return k}else if(H3L.lang!=='es'&&!warned[H3L.lang+k]){warned[H3L.lang+k]=1;if(window.console)console.warn('[i18n] sin traducción a '+H3L.lang+':',k)}}
  if(v)s=s.replace(/\{(\w+)\}/g,function(m,n){return v[n]!=null?v[n]:m});return s};
H3L.on=function(f){cbs.push(f)};
H3L.apply=function(root){root=root||document;var i,el,a,n,p;
  var q=root.querySelectorAll('[data-i18n]');for(i=0;i<q.length;i++){el=q[i];el.textContent=H3L.t(el.getAttribute('data-i18n'))}
  q=root.querySelectorAll('[data-i18n-html]');for(i=0;i<q.length;i++){el=q[i];el.innerHTML=H3L.t(el.getAttribute('data-i18n-html'))}
  q=root.querySelectorAll('[data-i18n-attr]');for(i=0;i<q.length;i++){el=q[i];a=el.getAttribute('data-i18n-attr').split(';');for(n=0;n<a.length;n++){p=a[n].split(':');if(p.length===2)el.setAttribute(p[0].trim(),H3L.t(p[1].trim()))}}
  document.documentElement.lang=H3L.lang;
  var sel=document.querySelectorAll('select.h3lang-sel');for(i=0;i<sel.length;i++)sel[i].value=H3L.lang};
H3L.set=function(l,silent){if(L.indexOf(l)<0||l===H3L.lang)return;H3L.lang=l;H3L.loc=LOC[l];H3L.nf=NF[l];store('h3l_lang',l);
  try{var u=new URL(location.href);if(u.searchParams.has('lang')){u.searchParams.set('lang',l);history.replaceState(null,'',u.toString())}}catch(e){}
  H3L.apply();if(!silent)cbs.forEach(function(f){try{f(l)}catch(e){if(window.console)console.error(e)}})};
/* selector de idioma: un <select> nativo, el más compatible en todos los sistemas y teléfonos */
H3L.select=function(opts){opts=opts||{};
  var w=document.createElement('label');w.className='h3lang'+(opts.dark?' dk':'')+(opts.cls?' '+opts.cls:'');
  w.innerHTML='<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.6 2.7 4 5.7 4 9s-1.4 6.3-4 9c-2.6-2.7-4-5.7-4-9s1.4-6.3 4-9z"/></svg>';
  var s=document.createElement('select');s.className='h3lang-sel';s.setAttribute('data-i18n-attr','aria-label:c.lang');
  L.forEach(function(l){var o=document.createElement('option');o.value=l;o.textContent=opts.full?NAMES[l]:l.toUpperCase();o.setAttribute('lang',l);if(!opts.full)o.title=NAMES[l];s.appendChild(o)});
  s.value=H3L.lang;s.setAttribute('aria-label',H3L.t('c.lang'));
  s.addEventListener('change',function(){H3L.set(s.value);if(opts.onchange)opts.onchange(s.value)});
  w.appendChild(s);return w};
var css='.h3lang{display:inline-flex;align-items:center;gap:6px;color:#0E1A2B;position:relative;flex:none}'
+'.h3lang svg{pointer-events:none;flex:none}'
+'.h3lang select{-webkit-appearance:none;-moz-appearance:none;appearance:none;font-family:inherit;font-size:13px;font-weight:600;color:inherit;background:#fff url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'10\' height=\'6\' viewBox=\'0 0 10 6\'%3E%3Cpath d=\'M1 1l4 4 4-4\' fill=\'none\' stroke=\'%23455063\' stroke-width=\'1.6\' stroke-linecap=\'round\' stroke-linejoin=\'round\'/%3E%3C/svg%3E") no-repeat right 9px center;border:1px solid #CBD3DF;border-radius:8px;min-height:36px;padding:0 26px 0 10px;cursor:pointer;line-height:1.2}'
+'.h3lang select:hover{border-color:#8FA3C8}.h3lang select:focus-visible{outline:2px solid #2A78D6;outline-offset:2px}'
+'.h3lang.dk{color:#C9D3E6}.h3lang.dk select{background-color:rgba(10,20,38,.75);border-color:rgba(255,255,255,.28);color:#E4EBF6;background-image:url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'10\' height=\'6\' viewBox=\'0 0 10 6\'%3E%3Cpath d=\'M1 1l4 4 4-4\' fill=\'none\' stroke=\'%23C9D3E6\' stroke-width=\'1.6\' stroke-linecap=\'round\' stroke-linejoin=\'round\'/%3E%3C/svg%3E")}'
+'.h3lang.dk select option{color:#0E1A2B;background:#fff}';
var st=document.createElement('style');st.textContent=css;(document.head||document.documentElement).appendChild(st);
/* textos comunes */
H3L.add('es',{'c.lang':'Idioma','c.calc':'Calculadoras','c.agents':'Agentes IA','c.qc':'Apps QC','c.trans':'Transición','c.transFull':'Transición energética','c.dash':'Dashboard','c.about':'Nosotros','c.login':'Iniciar sesión','c.register':'Registro','c.menu':'Abrir menú','c.home':'H3L Global Energy — inicio','c.main':'Principal','c.res':'Reservas PD'});
H3L.add('en',{'c.lang':'Language','c.calc':'Calculators','c.agents':'AI Agents','c.qc':'QC Apps','c.trans':'Transition','c.transFull':'Energy transition','c.dash':'Dashboards','c.about':'About us','c.login':'Log in','c.register':'Sign up','c.menu':'Open menu','c.home':'H3L Global Energy — home','c.main':'Main','c.res':'PD reserves'});
H3L.add('fr',{'c.lang':'Langue','c.calc':'Calculateurs','c.agents':'Agents IA','c.qc':'Apps QC','c.trans':'Transition','c.transFull':'Transition énergétique','c.dash':'Tableaux','c.about':'À propos','c.login':'Connexion','c.register':'Inscription','c.menu':'Ouvrir le menu','c.home':'H3L Global Energy — accueil','c.main':'Principal','c.res':'Réserves PD'});
H3L.add('pt',{'c.lang':'Idioma','c.calc':'Calculadoras','c.agents':'Agentes de IA','c.qc':'Apps QC','c.trans':'Transição','c.transFull':'Transição energética','c.dash':'Painéis','c.about':'Sobre nós','c.login':'Entrar','c.register':'Cadastro','c.menu':'Abrir menu','c.home':'H3L Global Energy — início','c.main':'Principal','c.res':'Reservas PD'});
window.H3L=H3L;
})();
