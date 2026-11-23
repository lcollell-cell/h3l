/* H3L · Cursos · motor de diagramas didácticos (SVG) que se dibujan por pasos, sincronizados con la narración.
   Cada diagrama se registra con HD.def(id,{n:pasos,draw:function(p){return svg}}). Dentro del dibujo, HD.S(k,html) crea una capa que aparece
   cuando el paso activo es >= k (y se resalta cuando es igual a k). El reproductor llama HD.set(nodo,paso) en cada pista. */
(function(){'use strict';
var HD=window.HD={defs:{},W:960,H:360};
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
/* texto: "|" = salto de línea, _{x} subíndice, ^{x} superíndice */
function fmt(s){return esc(s).replace(/_\{([^}]*)\}/g,'<tspan class="sb">$1</tspan>').replace(/\^\{([^}]*)\}/g,'<tspan class="sp">$1</tspan>')}
function n1(v){return Math.round(v*10)/10}
HD.fmt=fmt;
/* T(x,y,texto,clase,ancla) */
HD.T=function(x,y,s,c,a){var l=String(s).split('|'),o='<text x="'+n1(x)+'" y="'+n1(y)+'" class="'+(c||'t2')+'"'+(a?' text-anchor="'+a+'"':'')+'>';l.forEach(function(q,i){o+='<tspan x="'+n1(x)+'" dy="'+(i?'1.3em':0)+'">'+fmt(q)+'</tspan>'});return o+'</text>'};
/* R(x,y,w,h,clase,texto,clasetexto) rectángulo con texto centrado opcional */
HD.R=function(x,y,w,h,c,s,tc){var o='<rect x="'+n1(x)+'" y="'+n1(y)+'" width="'+n1(w)+'" height="'+n1(h)+'" rx="7" class="'+(c||'bx')+'"/>';if(s){var k=String(s).split('|').length;o+=HD.T(x+w/2,y+h/2+5.5-(k-1)*10.5,s,tc||'t2',"middle")}return o};
HD.L=function(x1,y1,x2,y2,c){return '<line x1="'+n1(x1)+'" y1="'+n1(y1)+'" x2="'+n1(x2)+'" y2="'+n1(y2)+'" class="ln '+(c||'s-w')+'"/>'};
/* flecha (col: g, am, bl, w) */
HD.A=function(x1,y1,x2,y2,col){col=col||'g';return '<path d="M'+n1(x1)+' '+n1(y1)+' L'+n1(x2)+' '+n1(y2)+'" class="ar s-'+col+'" marker-end="url(#dgah-'+col+')"/>'};
HD.AP=function(d,col){col=col||'g';return '<path d="'+d+'" class="ar s-'+col+'" marker-end="url(#dgah-'+col+')"/>'};
HD.P=function(d,c){return '<path d="'+d+'" class="'+(c||'ln s-w')+'"/>'};
HD.C=function(cx,cy,r,c){return '<circle cx="'+n1(cx)+'" cy="'+n1(cy)+'" r="'+r+'" class="'+(c||'bx')+'"/>'};
/* polilínea desde una función y(x) */
HD.fn=function(f,x0,x1,n,c){var d='',i,x;n=n||40;for(i=0;i<=n;i++){x=x0+(x1-x0)*i/n;d+=(i?'L':'M')+n1(x)+' '+n1(f(x))}return '<path d="'+d+'" class="'+(c||'ln s-g')+'"/>'};
/* capa por pasos; hasta: paso desde el cual la capa desaparece */
HD.S=function(k,inner,hasta){return '<g class="st" data-s="'+k+'"'+(hasta!==undefined?' data-u="'+hasta+'"':'')+'>'+inner+'</g>'};
HD.fnv=function(f,y0,y1,n,c){var d='',i,y;n=n||40;for(i=0;i<=n;i++){y=y0+(y1-y0)*i/n;d+=(i?'L':'M')+n1(f(y))+' '+n1(y)}return '<path d="'+d+'" class="'+(c||'ln s-g')+'"/>'};
/* capa fantasma: se ve tenue antes de su paso, como esqueleto del esquema */
HD.G=function(k,inner,hasta){return HD.S(k,inner,hasta).replace('class="st"','class="st gh"')};
/* leyenda en columna: items [{s:paso,c:clase de relleno,t:texto,n:numero}] */
HD.legend=function(x,y,items,dy,w){dy=dy||34;w=w||290;return items.map(function(it,i){var yy=y+i*dy,ic=it.n!==undefined?'<circle cx="'+(x+13)+'" cy="'+(yy+12)+'" r="13" class="f-g"/>'+HD.T(x+13,yy+17.5,String(it.n),'t3 w','middle'):'<rect x="'+x+'" y="'+(yy-1)+'" width="26" height="26" rx="5" class="'+it.c+'"/>';
  return HD.G(it.s,ic+HD.T(x+38,yy+18,it.t,'t2'))}).join('')};
/* eje con etiquetas: ejes simples */
HD.axes=function(x0,y0,x1,y1,xl,yl){return HD.L(x0,y0,x1,y0,'s-m')+HD.L(x0,y0,x0,y1,'s-m')+(xl?HD.T((x0+x1)/2,y0+30,xl,'t3 mut','middle'):'')+(yl?'<text transform="translate('+(x0-30)+' '+((y0+y1)/2)+') rotate(-90)" class="t3 mut" text-anchor="middle">'+fmt(yl)+'</text>':'')};
HD.def=function(id,d){HD.defs[id]=d};
var MK=['g:#5fd1a4','am:#e8a15a','bl:#7fa6f0','w:#e9eff9','r:#ff8f7a'].map(function(x){var a=x.split(':');return '<marker id="dgah-'+a[0]+'" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="'+a[1]+'"/></marker>'}).join('');
/* monta el diagrama en host; devuelve el nodo */
HD.mount=function(host,id,p){var d=HD.defs[id],n=el('div','dg');
  if(!d){n.innerHTML='<p class="dgerr">Diagrama no disponible: '+esc(id)+'</p>';host.appendChild(n);return n}
  var vb=d.vb||[HD.W,HD.H];
  n.innerHTML='<svg viewBox="0 0 '+vb[0]+' '+vb[1]+'" preserveAspectRatio="xMidYMid meet" role="img" aria-label="'+esc(d.alt||d.t||id)+'"><defs>'+MK+'</defs>'+d.draw(p||{})+'</svg>';
  n._st=[].slice.call(n.querySelectorAll('.st'));n._n=d.n;host.appendChild(n);HD.set(n,-1,true);return n};
function el(t,c){var e=document.createElement(t);if(c)e.className=c;return e}
/* paso: -1 = solo la base; null = todo visible; k = capas con s<=k */
HD.set=function(n,hl,quick){if(!n||!n._st)return;if(n._hl===hl&&!quick)return;n._hl=hl;
  n._st.forEach(function(g){var s=+g.getAttribute('data-s'),u=g.getAttribute('data-u'),on,cur;
    if(hl===null||hl===undefined){on=true;cur=false}else{on=s<=hl&&(u===null||hl<+u);cur=s===hl}
    g.classList.toggle('on',on);g.classList.toggle('cur',cur&&on)})};
})();
/* flujo genérico: p.items = [{t:'título|2da línea', s:'detalle|línea'}], pasos 0..n-1; p.note = texto base */
(function(){var HD=window.HD;
HD.def('flow',{n:8,alt:'Secuencia de pasos',draw:function(p){var it=p.items||[],n=it.length,gap=34,w=(920-(n-1)*gap)/n,o='',h=p.h||190,y=p.y||64;
  it.forEach(function(q,i){var x=20+i*(w+gap);
    o+=HD.G(i,HD.R(x,y,w,h,i===n-1&&p.last?'bx-g':'bx')+HD.C(x+22,y+24,15,'f-g')+HD.T(x+22,y+30,String(i+1),'t3 w','middle')+HD.T(x+16,y+66,q.t,'t2')+(q.s?HD.T(x+16,y+66+(String(q.t).split('|').length)*26+8,q.s,'t5 mut'):''));
    if(i<n-1)o+=HD.G(i+1,HD.A(x+w+4,y+h/2,x+w+gap-4,y+h/2,'g'))});
  if(p.note)o+=HD.S(n-1,HD.T(480,y+h+46,p.note,'t2 am','middle'));return o}});
})();
/* genéricos: tarjetas, línea de tiempo y barras horizontales */
(function(){var HD=window.HD,T=HD.T;
HD.def('cards',{n:8,alt:'Tarjetas con conceptos',draw:function(p){var it=p.items||[],n=it.length,cols=p.cols||(n<=2?n:(n===3?3:(n===6?3:2))),rows=Math.ceil(n/cols),gap=24,w=(920-(cols-1)*gap)/cols,h=Math.min(150,(316-(rows-1)*gap)/rows),o='',y0=p.y||(rows===1?80:30);
  it.forEach(function(q,i){var c=i%cols,r=Math.floor(i/cols),x=20+c*(w+gap),y=y0+r*(h+gap);o+=HD.G(i,HD.R(x,y,w,h,q.c||'bx')+T(x+18,y+38,q.t,'t2'+(q.k?' '+q.k:''))+(q.s?T(x+18,y+38+(String(q.t).split('|').length)*26,q.s,'t3 mut'):''))});return o}});
HD.def('timeline',{n:8,alt:'Línea de tiempo',draw:function(p){var it=p.items||[],n=it.length,o=HD.L(40,150,920,150,'s-m'),w=880/Math.max(1,n);
  it.forEach(function(q,i){var x=40+w*i+w/2;o+=HD.G(i,C(x,150,10,'f-g')+T(x,118,q.y,'t1 g','middle')+T(x,190,q.t,'t2','middle')+(q.s?T(x,190+(String(q.t).split('|').length)*26+6,q.s,'t4 mut','middle'):''))});function C(x,y,r,c){return HD.C(x,y,r,c)}return o}});
HD.def('bars',{n:8,alt:'Barras comparativas',draw:function(p){var rs=p.rows||[],o=p.title?T(20,32,p.title,'t2 g'):'',L=p.lw||300,W=p.w||520;
  rs.forEach(function(r,i){var y=60+i*(p.dy||58),w=Math.max(4,W*r.v/(p.max||100));o+=HD.G(i,T(20,y+27,r.l,'t2')+'<rect x="'+(20+L)+'" y="'+y+'" width="'+w+'" height="38" rx="6" class="f-'+(r.c||'bl')+'"/>'+T(20+L+w+12,y+28,r.t||(r.v+(p.u||'')),'t2'+(r.k?' '+r.k:'')))});
  if(p.note)o+=HD.S(rs.length,HD.R(20,300,920,48,p.nc||'bx-am',p.note,'t3'));return o}});
})();
