/* H3L · biblioteca de gráficos SVG (compartida). Desarrollado por Leandro Collell. Requiere #tip, H3L (i18n.js) y las claves v.* */
(function(){'use strict';
/* ====================== utilidades ====================== */
var NS='http://www.w3.org/2000/svg';
var $=function(id){return document.getElementById(id)};
function S(tag,attrs,parent){var e=document.createElementNS(NS,tag);if(attrs)for(var k in attrs)e.setAttribute(k,attrs[k]);if(parent)parent.appendChild(e);return e}
function T(parent,x,y,s,cls,anchor){var e=S('text',{x:x,y:y,'class':cls||'t-lbl'},parent);if(anchor)e.setAttribute('text-anchor',anchor);e.textContent=s;return e}
function H(tag,props,parent,text){var e=document.createElement(tag);if(props)for(var k in props){if(k==='class')e.className=props[k];else e.setAttribute(k,props[k])}if(text!=null)e.textContent=text;if(parent)parent.appendChild(e);return e}
var reduce=false;try{reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches}catch(e){}
/* números según el idioma: separador de miles y de decimales (H3L.nf), signo menos tipográfico */
function TH(){var t=H3L.nf.th;return t===' '?'\u00a0':t}
function fmt(n,d){d=d||0;var neg=n<0&&Math.abs(n)>=Math.pow(10,-d)/2;var s=Math.abs(n).toFixed(d).split('.');var i=s[0].replace(/\B(?=(\d{3})+(?!\d))/g,TH());return (neg?'−':'')+i+(s[1]?H3L.nf.dec+s[1]:'')}
function sgn(n,d){var f=fmt(Math.abs(n),d);return (n>0?'+':(n<0&&parseFloat(Math.abs(n).toFixed(d||0))>0?'−':''))+f}
function I(k,v){return H3L.t(k,v)}
function nice(min,max,n){n=n||4;var span=(max-min)||1,s0=span/n,mag=Math.pow(10,Math.floor(Math.log10(s0))),r=s0/mag,step=(r<1.5?1:r<3?2:r<7?5:10)*mag;var lo=Math.floor(min/step+1e-9)*step,hi=Math.ceil(max/step-1e-9)*step,t=[];for(var v=lo;v<=hi+step/2;v+=step)t.push(+v.toFixed(10));return {lo:lo,hi:hi,ticks:t,step:step}}
function wrap(s,n){var w=s.split(' '),L=[],c='';w.forEach(function(x){if((c+' '+x).trim().length>n&&c){L.push(c);c=x}else c=(c+' '+x).trim()});if(c)L.push(c);return L}

/* ====================== información al pasar el cursor ====================== */
var tip=$('tip');
function posTip(ev){var pad=14,x=ev.clientX+pad,y=ev.clientY+pad,w=tip.offsetWidth,h=tip.offsetHeight;if(x+w>innerWidth-8)x=ev.clientX-w-pad;if(y+h>innerHeight-8)y=ev.clientY-h-pad;tip.style.left=Math.max(8,x)+'px';tip.style.top=Math.max(8,y)+'px'}
function showTip(ev,title,rows){tip.textContent='';if(title)H('div',{'class':'tt'},tip,title);rows.forEach(function(r){var d=H('div',{'class':'tr'},tip),a=H('span',null,d);if(r.c){var k=H('i',{'class':'k'},a);k.style.background=r.c}H('span',null,a,r.k);H('b',null,d,r.v)});tip.classList.add('on');posTip(ev)}
function hideTip(){tip.classList.remove('on')}
function bindTip(node,title,rows){
  node.addEventListener('pointerenter',function(e){showTip(e,title,rows)});
  node.addEventListener('pointermove',posTip);
  node.addEventListener('pointerleave',hideTip);
  node.addEventListener('focus',function(){var r=node.getBoundingClientRect();showTip({clientX:r.left+r.width/2,clientY:r.top},title,rows)});
  node.addEventListener('blur',hideTip);
  node.setAttribute('tabindex','0');
  node.setAttribute('aria-label',[title].concat(rows.map(function(r){return r.k+': '+r.v})).join('. '));
  node.setAttribute('class',(node.getAttribute('class')||'')+' mk');
}
document.addEventListener('pointerdown',function(e){if(!e.target.closest||!e.target.closest('svg'))hideTip()});
window.addEventListener('scroll',hideTip,{passive:true});

/* ====================== marcos y primitivas ====================== */
function frame(host,h,m,label){host.textContent='';var W=Math.max(240,Math.floor(host.clientWidth||320));var svg=S('svg',{width:W,height:h,viewBox:'0 0 '+W+' '+h,role:'img','aria-label':label||''},host);return {svg:svg,W:W,H:h,m:m,iw:W-m.l-m.r,ih:h-m.t-m.b}}
/* barra horizontal: base cuadrada, extremo de datos redondeado 4px */
function hbar(p,x,y,w,h,col,r){r=Math.min(r==null?4:r,Math.max(w,0),h/2);var e=S('path',{fill:col},p);if(w<=0.5)return e;e.setAttribute('d','M'+x+' '+y+'h'+Math.max(0,w-r)+'a'+r+' '+r+' 0 0 1 '+r+' '+r+'v'+(h-2*r)+'a'+r+' '+r+' 0 0 1 '+(-r)+' '+r+'h'+(-Math.max(0,w-r))+'z');return e}
function hbarL(p,x,y,w,h,col,r){r=Math.min(r==null?4:r,Math.max(w,0),h/2);var e=S('path',{fill:col},p);if(w<=0.5)return e;e.setAttribute('d','M'+(x+w)+' '+y+'h'+(-Math.max(0,w-r))+'a'+r+' '+r+' 0 0 0 '+(-r)+' '+r+'v'+(h-2*r)+'a'+r+' '+r+' 0 0 0 '+r+' '+r+'h'+Math.max(0,w-r)+'z');return e}
/* columna vertical: base cuadrada en y0, extremo de datos redondeado en y1 */
function vbar(p,x,y0,y1,w,col,r){r=r==null?4:r;var up=y1<y0,h=Math.abs(y1-y0),e=S('path',{fill:col},p);if(h<0.5)return e;r=Math.min(r,h,w/2);
  if(up)e.setAttribute('d','M'+x+' '+y0+'V'+(y1+r)+'a'+r+' '+r+' 0 0 1 '+r+' '+(-r)+'h'+(w-2*r)+'a'+r+' '+r+' 0 0 1 '+r+' '+r+'V'+y0+'z');
  else e.setAttribute('d','M'+x+' '+y0+'V'+(y1-r)+'a'+r+' '+r+' 0 0 0 '+r+' '+r+'h'+(w-2*r)+'a'+r+' '+r+' 0 0 0 '+r+' '+(-r)+'V'+y0+'z');return e}
function yAxis(f,sc,y,tf,gridTo){var g=S('g',{'class':'ax'},f.svg);sc.ticks.forEach(function(t){S('line',{x1:f.m.l,x2:gridTo==null?f.W-f.m.r:gridTo,y1:y(t),y2:y(t)},g);T(g,f.m.l-8,y(t)+4,(tf||fmt)(t),'','end')});return g}

/* ====================== barras horizontales ====================== */
function barsH(host,sp){
  var rows=sp.rows,rh=sp.rh||30,bh=sp.bh||16,W0=Math.max(240,host.clientWidth||320),lw=Math.min(sp.lw||132,Math.round(W0*.4));
  var top=sp.ref?24:6,h=top+rows.length*rh+24;
  var f=frame(host,h,{t:top,r:sp.r||46,b:24,l:lw},sp.label),svg=f.svg,m=f.m;
  var max=sp.max||Math.max.apply(null,rows.map(function(r){return r.value})),sc=nice(0,max*(sp.pad||1),4),x=function(v){return m.l+v/sc.hi*f.iw};
  var g=S('g',{'class':'ax'},svg);
  sc.ticks.forEach(function(t){S('line',{x1:x(t),x2:x(t),y1:m.t,y2:m.t+rows.length*rh},g);T(g,x(t),m.t+rows.length*rh+16,(sp.tickFmt||fmt)(t),'','middle')});
  rows.forEach(function(r,i){var y=m.t+i*rh,by=y+(rh-bh)/2,w=r.value/sc.hi*f.iw;
    var gr=S('g',{},svg);
    hbar(gr,m.l,by,w,bh,r.color||'var(--blue)',4);
    var lab=r.label;if(lab.length*6.4>lw-10){var L=wrap(lab,Math.floor((lw-10)/6.4));T(gr,m.l-10,y+rh/2+(L.length>1?-2:4),L[0],'t-lbl','end');if(L[1])T(gr,m.l-10,y+rh/2+11,L[1],'t-lbl','end')}else T(gr,m.l-10,y+rh/2+4,lab,'t-lbl','end');
    T(gr,m.l+w+7,y+rh/2+4,r.text||fmt(r.value,sp.d||0),'t-val','start');
    var hit=S('rect',{x:0,y:y,width:f.W,height:rh,fill:'transparent'},gr);bindTip(hit,r.label,r.tip||[{k:sp.unit||I('v.value'),v:r.text||fmt(r.value,sp.d||0)}]);
  });
  S('line',{x1:m.l,x2:m.l,y1:m.t,y2:m.t+rows.length*rh,stroke:'var(--gray-dark)','stroke-width':1},svg);
  if(sp.ref){var rx=x(sp.ref.value);S('line',{x1:rx,x2:rx,y1:m.t-4,y2:m.t+rows.length*rh,stroke:'var(--ink-2)','stroke-width':1.5,opacity:.75},svg);T(svg,rx,m.t-9,sp.ref.label,'t-note','middle')}
}

/* ====================== cascada (puente desde cero) ====================== */
function waterfall(host,sp){
  var n=sp.steps.length,run=0,cols=sp.steps.map(function(s){var c;if(s.kind==='total'){c={y0:0,y1:s.value,s:s};run=s.value}else{c={y0:run,y1:run+s.value,s:s};run+=s.value}return c});
  var lo=Math.min.apply(null,[0].concat(cols.map(function(c){return Math.min(c.y0,c.y1)}))),hi=Math.max.apply(null,[0].concat(cols.map(function(c){return Math.max(c.y0,c.y1)})));
  var sc=nice(lo,hi,4),f=frame(host,sp.h||250,{t:20,r:8,b:46,l:42},sp.label),svg=f.svg,m=f.m;
  var y=function(v){return m.t+(1-(v-sc.lo)/(sc.hi-sc.lo))*f.ih};
  yAxis(f,sc,y,sp.tickFmt);
  S('line',{x1:m.l,x2:f.W-m.r,y1:y(0),y2:y(0),stroke:'var(--gray-dark)','stroke-width':1},svg);
  var band=f.iw/n,cw=Math.min(44,band*.56);
  cols.forEach(function(c,i){var cx=m.l+band*i+(band-cw)/2,pos=c.s.value>=0,col=c.s.color||(c.s.kind==='total'?'var(--ink-2)':(pos?'var(--blue)':'var(--red)'));
    var g=S('g',{},svg),p=vbar(g,cx,y(c.y0),y(c.y1),cw,col,4);
    var topY=Math.min(y(c.y0),y(c.y1)),botY=Math.max(y(c.y0),y(c.y1));
    var lblY=(c.s.kind==='total'?pos:pos)?topY-6:botY+15;
    T(g,cx+cw/2,lblY,c.s.text,'t-val','middle');
    var L=wrap((band<54&&c.s.short)?c.s.short:c.s.label,Math.max(8,Math.floor(band/6.2)));L.slice(0,3).forEach(function(l,k){T(g,cx+cw/2,f.H-m.b+16+k*13,l,'t-lbl','middle')});
    if(i<n-1){var nx=m.l+band*(i+1)+(band-cw)/2;S('line',{x1:cx+cw,x2:nx,y1:y(c.y1),y2:y(c.y1),stroke:'var(--gray-dark)','stroke-width':1,opacity:.6},svg)}
    var hit=S('rect',{x:m.l+band*i,y:m.t-10,width:band,height:f.ih+10,fill:'transparent'},g);bindTip(hit,c.s.label,c.s.tip||[{k:sp.unit||I('v.value'),v:c.s.text}]);
  });
}

/* ====================== tornado ====================== */
function tornado(host,sp){
  var rows=sp.rows.slice().sort(function(a,b){return (b.high-b.low)-(a.high-a.low)}),rh=44,bh=14,
      mx=Math.max.apply(null,rows.map(function(r){return Math.max(Math.abs(r.low),Math.abs(r.high))})),sc=nice(0,mx,3),
      f=frame(host,rows.length*rh+34,{t:6,r:34,b:26,l:34},sp.label),svg=f.svg,m=f.m,cx=m.l+f.iw/2,x=function(v){return cx+v/sc.hi*(f.iw/2)};
  var g=S('g',{'class':'ax'},svg),ts=[];sc.ticks.forEach(function(t){ts.push(t);if(t>0)ts.push(-t)});
  ts.forEach(function(t){S('line',{x1:x(t),x2:x(t),y1:m.t,y2:m.t+rows.length*rh},g);T(g,x(t),m.t+rows.length*rh+16,(t>0?'+':t<0?'−':'')+fmt(Math.abs(t),sp.d||0),'','middle')});
  rows.forEach(function(r,i){var y=m.t+i*rh,by=y+20,gr=S('g',{},svg);
    T(gr,m.l,y+13,r.label,'t-lbl','start').setAttribute('style','paint-order:stroke;stroke:#fff;stroke-width:4px;stroke-linejoin:round');
    hbarL(gr,x(r.low),by-bh/2+4,cx-x(r.low),bh,'var(--red)',4);
    hbar(gr,cx,by-bh/2+4,x(r.high)-cx,bh,'var(--blue)',4);
    T(gr,x(r.low)-5,by+8,sgn(r.low,(sp.d==null?1:sp.d)),'t-val','end');T(gr,x(r.high)+5,by+8,sgn(r.high,(sp.d==null?1:sp.d)),'t-val','start');
    var hit=S('rect',{x:0,y:y,width:f.W,height:rh,fill:'transparent'},gr);bindTip(hit,r.label,[{k:I('v.low'),v:sgn(r.low,(sp.d==null?1:sp.d))+' '+sp.unit,c:'var(--red)'},{k:I('v.high'),v:sgn(r.high,(sp.d==null?1:sp.d))+' '+sp.unit,c:'var(--blue)'}]);
  });
  S('line',{x1:cx,x2:cx,y1:m.t,y2:m.t+rows.length*rh,stroke:'var(--ink-2)','stroke-width':1.5},svg);
}

/* ====================== barras apiladas horizontales ====================== */
function stackH(host,sp){
  var rows=sp.rows,rh=sp.rh||52,bh=sp.bh||24,W0=Math.max(240,host.clientWidth||320),lw=Math.min(sp.lw||92,Math.round(W0*.28)),top=sp.ref?24:6;
  var f=frame(host,top+rows.length*rh+24,{t:top,r:sp.r||44,b:24,l:lw},sp.label),svg=f.svg,m=f.m;
  var sc=nice(0,sp.max,4),x=function(v){return m.l+v/sc.hi*f.iw};
  var g=S('g',{'class':'ax'},svg);sc.ticks.forEach(function(t){S('line',{x1:x(t),x2:x(t),y1:m.t,y2:m.t+rows.length*rh},g);T(g,x(t),m.t+rows.length*rh+16,(sp.tickFmt||fmt)(t),'','middle')});
  rows.forEach(function(r,i){var y=m.t+i*rh,by=y+(rh-bh)/2,acc=0,tot=r.segs.reduce(function(a,s){return a+s.v},0),gr=S('g',{},svg);
    var L=wrap(r.label,Math.floor((lw-8)/6.4));L.forEach(function(l,k){T(gr,m.l-10,y+rh/2+4+(k-(L.length-1)/2)*13,l,'t-lbl','end')});
    r.segs.forEach(function(s,k){var x0=x(acc),w=x(acc+s.v)-x0-(k<r.segs.length-1?2:0),last=k===r.segs.length-1;
      var el=last?hbar(gr,x0,by,w,bh,s.c,4):S('rect',{x:x0,y:by,width:Math.max(0,w),height:bh,fill:s.c},gr);
      if(s.text&&w>s.text.length*6.8+10)T(gr,x0+w/2,by+bh/2+4,s.text,'t-lbl','middle').setAttribute('style','fill:'+(s.tc||'#fff'));
      bindTip(el,r.label,s.tip||[{k:s.k,v:fmt(s.v,sp.d||0),c:s.c}]);acc+=s.v});
    T(gr,x(tot)+7,by+bh/2+4,sp.totalFmt?sp.totalFmt(tot):fmt(tot),'t-val','start');
  });
  S('line',{x1:m.l,x2:m.l,y1:m.t,y2:m.t+rows.length*rh,stroke:'var(--gray-dark)'},svg);
  if(sp.ref){var rx=x(sp.ref.value);S('line',{x1:rx,x2:rx,y1:m.t-4,y2:m.t+rows.length*rh,stroke:'var(--ink-2)','stroke-width':1.5,opacity:.75},svg);T(svg,rx,m.t-9,sp.ref.label,'t-note','middle')}
}

/* ====================== curva de costo marginal de abatimiento ====================== */
function macc(host,sp){
  var ms=sp.items.slice().sort(function(a,b){return a.cost-b.cost}),tot=ms.reduce(function(a,b){return a+b.abate},0),
      cmin=Math.min(0,Math.min.apply(null,ms.map(function(d){return d.cost}))),cmax=Math.max(sp.price,Math.max.apply(null,ms.map(function(d){return d.cost})));
  var sc=nice(cmin-4,cmax+4,4),f=frame(host,sp.h||270,{t:14,r:10,b:48,l:42},sp.label),svg=f.svg,m=f.m,
      y=function(v){return m.t+(1-(v-sc.lo)/(sc.hi-sc.lo))*f.ih},xs=nice(0,tot,4),x=function(v){return m.l+v/xs.hi*f.iw};
  yAxis(f,sc,y);
  var ax=S('g',{'class':'ax'},svg);xs.ticks.forEach(function(t){T(ax,x(t),f.H-m.b+16,fmt(t),'','middle')});T(ax,m.l+f.iw/2,f.H-6,I('v.axis'),'','middle');
  S('line',{x1:m.l,x2:f.W-m.r,y1:y(0),y2:y(0),stroke:'var(--gray-dark)'},svg);
  var acc=0;
  ms.forEach(function(d){var x0=x(acc),w=x(acc+d.abate)-x0-2,col=(d.sel!=null?d.sel:d.cost<sp.price)?'var(--blue)':'var(--gray-mark)',g=S('g',{},svg);
    vbar(g,x0,y(0),y(d.cost),Math.max(2,w),col,4);
    T(g,x0+w/2,d.cost>=0?y(d.cost)-6:y(d.cost)+15,d.id,'t-val','middle');
    var hit=S('rect',{x:x0,y:m.t,width:Math.max(2,w)+2,height:f.ih,fill:'transparent'},g);
    bindTip(hit,d.id.toUpperCase()+' · '+d.label,[{k:I('v.cost'),v:sgn(d.cost,0)+' USD/t'},{k:I('v.avoid'),v:fmt(d.abate,1)+' '+I('v.ktyr')},{k:I('v.annual'),v:sgn(-d.cost*d.abate,0)+' '+I('v.kusd')}]);acc+=d.abate});
  S('line',{x1:m.l,x2:f.W-m.r,y1:y(sp.price),y2:y(sp.price),stroke:'var(--ink-2)','stroke-width':1.5,opacity:.75},svg);
  T(svg,m.l+6,y(sp.price)-6,sp.priceLabel,'t-note','start');
}

/* ====================== líneas, bandas y puntos ====================== */
function line(host,sp){
  var n=sp.x.length,all=[];sp.series.forEach(function(s){s.pts.forEach(function(v){if(v!=null)all.push(v)})});(sp.bands||[]).forEach(function(b){b.lo.concat(b.hi).forEach(function(v){if(v!=null)all.push(v)})});(sp.dots||[]).forEach(function(s){s.pts.forEach(function(v){if(v!=null)all.push(v)})});
  var lo=sp.yMin!=null?sp.yMin:Math.min.apply(null,all),hi=sp.yMax!=null?sp.yMax:Math.max.apply(null,all),sc=nice(lo,hi,4);
  var f=frame(host,sp.h||260,{t:16,r:sp.r||14,b:sp.xTitle?46:30,l:sp.l||46},sp.label),svg=f.svg,m=f.m;
  var x=function(i){return m.l+i/(n-1)*f.iw},y=function(v){return m.t+(1-(v-sc.lo)/(sc.hi-sc.lo))*f.ih};
  yAxis(f,sc,y,sp.yFmt);
  var ax=S('g',{'class':'ax'},svg);(sp.xTicks||[]).forEach(function(i){T(ax,x(i),f.H-m.b+17,sp.x[i],'','middle')});
  if(sp.xTitle)T(ax,m.l+f.iw/2,f.H-4,sp.xTitle,'','middle');
  if(sc.lo<0)S('line',{x1:m.l,x2:f.W-m.r,y1:y(0),y2:y(0),stroke:'var(--gray-dark)'},svg);
  (sp.vlines||[]).forEach(function(v){S('line',{x1:x(v.i),x2:x(v.i),y1:m.t-4,y2:m.t+f.ih,stroke:'var(--ink-2)','stroke-width':1,opacity:.6},svg);T(svg,x(v.i)+(v.dx||5),m.t+6,v.label,'t-note',v.anchor||'start')});
  (sp.bands||[]).forEach(function(b){var p='',i;for(i=0;i<n;i++)if(b.hi[i]!=null)p+=(p?'L':'M')+x(i)+' '+y(b.hi[i]);for(i=n-1;i>=0;i--)if(b.lo[i]!=null)p+='L'+x(i)+' '+y(b.lo[i]);S('path',{d:p+'Z',fill:b.c,opacity:b.op||.1},svg)});
  function path(s){var d='',pen=false;s.pts.forEach(function(v,i){if(v==null){pen=false;return}d+=(pen?'L':'M')+x(i).toFixed(1)+' '+y(v).toFixed(1);pen=true});return d}
  sp.series.forEach(function(s){var d=path(s);if(s.area){S('path',{d:d+'L'+x(n-1)+' '+y(sc.lo)+'L'+x(0)+' '+y(sc.lo)+'Z',fill:s.c,opacity:.08},svg)}
    var pl=S('path',{d:d,fill:'none',stroke:s.c,'stroke-width':s.w||2,'stroke-linecap':'round','stroke-linejoin':'round',opacity:s.op==null?1:s.op},svg);if(s.dash)pl.setAttribute('stroke-dasharray',s.dash);
    if(!reduce&&sp.draw){try{var L=pl.getTotalLength();pl.style.strokeDasharray=L;pl.style.strokeDashoffset=L;pl.getBoundingClientRect();pl.style.transition='stroke-dashoffset .8s ease';requestAnimationFrame(function(){pl.style.strokeDashoffset=0;setTimeout(function(){pl.style.strokeDasharray=s.dash||'';pl.style.transition=''},900)})}catch(e){}}
    if(s.end){var li=-1;s.pts.forEach(function(v,i){if(v!=null)li=i});var ex=x(li),ey=y(s.pts[li]);S('circle',{cx:ex,cy:ey,r:4,fill:s.c,stroke:'var(--surface)','stroke-width':2},svg);T(svg,ex,ey+(s.endDy==null?-10:s.endDy),s.end,'t-val',s.endAnchor||'end')}
  });
  (sp.dots||[]).forEach(function(s){s.pts.forEach(function(v,i){if(v!=null)S('circle',{cx:x(i),cy:y(v),r:s.r||3.2,fill:s.c,stroke:'var(--surface)','stroke-width':1.5,opacity:.95},svg)})});
  /* cursor vertical + lectura de todas las series */
  var cur=S('line',{y1:m.t,y2:m.t+f.ih,stroke:'var(--ink-2)','stroke-width':1,opacity:0},svg),dotsG=S('g',{},svg);
  var ov=S('rect',{x:m.l,y:m.t,width:f.iw,height:f.ih,fill:'transparent',tabindex:0,'class':'mk',role:'group','aria-label':(sp.label||I('v.chart'))+'. '+I('v.arrows')},svg);
  var cursorI=Math.floor(n/2);
  function at(i,ev){i=Math.max(0,Math.min(n-1,i));cursorI=i;cur.setAttribute('x1',x(i));cur.setAttribute('x2',x(i));cur.setAttribute('opacity',1);dotsG.textContent='';
    var rows=[];sp.series.concat(sp.dots||[]).forEach(function(s){var v=s.pts[i];if(v!=null&&s.tip!==false){rows.push({k:s.name,v:(sp.tipFmt||fmt)(v),c:s.c});S('circle',{cx:x(i),cy:y(v),r:4,fill:s.c,stroke:'var(--surface)','stroke-width':2},dotsG)}});
    (sp.bands||[]).forEach(function(b){if(b.lo[i]!=null&&b.name)rows.push({k:b.name,v:(sp.tipFmt||fmt)(b.lo[i])+' '+I('v.to')+' '+(sp.tipFmt||fmt)(b.hi[i]),c:b.c})});
    showTip(ev,sp.x[i],rows)}
  ov.addEventListener('pointermove',function(e){var r=ov.getBoundingClientRect();at(Math.round((e.clientX-r.left)/r.width*(n-1)),e)});
  ov.addEventListener('pointerleave',function(){cur.setAttribute('opacity',0);dotsG.textContent='';hideTip()});
  ov.addEventListener('focus',function(){var r=ov.getBoundingClientRect();at(cursorI,{clientX:r.left+(cursorI/(n-1))*r.width,clientY:r.top+10})});
  ov.addEventListener('keydown',function(e){if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();var r=ov.getBoundingClientRect();cursorI+=e.key==='ArrowRight'?1:-1;at(cursorI,{clientX:r.left+(Math.max(0,Math.min(n-1,cursorI))/(n-1))*r.width,clientY:r.top+10})}});
  ov.addEventListener('blur',function(){cur.setAttribute('opacity',0);dotsG.textContent='';hideTip()});
}

window.VZ={frame:frame,hbar:hbar,hbarL:hbarL,vbar:vbar,yAxis:yAxis,T:T,nice:nice,wrap:wrap,bindTip:bindTip,showTip:showTip,$:$,H:H,S:S,fmt:fmt,sgn:sgn,reduce:reduce,barsH:barsH,waterfall:waterfall,tornado:tornado,stackH:stackH,macc:macc,line:line,hideTip:hideTip};
})();
