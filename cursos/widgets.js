/* H3L · Cursos · laboratorios interactivos y mapas (SVG, sin librerías externas). Datos de ejemplo con fines didácticos. */
(function(){'use strict';
var W=window.HW={},NS='http://www.w3.org/2000/svg';
var TX='rgba(255,255,255,.82)',GR='rgba(255,255,255,.16)',GN='#5fd1a4',AM='#e8a15a',BL='#7aa7ff',RD='#ff7b7b',VI='#b79cff';
function sv(tag,at,par,txt){var e=document.createElementNS(NS,tag);if(at)for(var k in at)e.setAttribute(k,at[k]);if(txt!=null)e.textContent=txt;if(par)par.appendChild(e);return e}
function nf(x,d){d=d==null?0:d;return Number(x).toLocaleString('es-AR',{minimumFractionDigits:d,maximumFractionDigits:d})}
function rng(seed){return function(){seed|=0;seed=seed+0x6D2B79F5|0;var t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function tri(r,a,m,b){var u=r(),c=(m-a)/(b-a);return u<c?a+Math.sqrt(u*(b-a)*(m-a)):b-Math.sqrt((1-u)*(b-a)*(b-m))}
function gauss(r){var u=0,v=0;while(!u)u=r();while(!v)v=r();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v)}
/* estructura común: svg + controles. defs: {k,l,min,max,step,v,f} | {k,l,t:'sel',o:[[v,l]]} | {k,l,t:'chk',v} | {t:'btn',l,fn} */
function mkui(box,defs,on,opt){opt=opt||{};box.innerHTML='';box.className='wd side2';
  var vz=document.createElement('div');vz.className='vz';vz.style.cssText='min-height:0;position:relative;overflow:hidden';var svg=sv('svg',{viewBox:'0 0 '+(opt.w||640)+' '+(opt.h||340),preserveAspectRatio:'xMidYMid meet',role:'img'},vz);box.appendChild(vz);
  var cb=document.createElement('div');cb.className='ctrls';box.appendChild(cb);var V={},outs={};
  var out=document.createElement('div');out.className='out';
  function fire(src){if(on)on(V,src);if(opt.touch)opt.touch()}
  defs.forEach(function(d){
    if(d.t==='btn'){var b=document.createElement('button');b.type='button';b.textContent=d.l;b.addEventListener('click',function(){d.fn(V);fire()});cb.appendChild(b);return}
    var lab=document.createElement('label');
    if(d.t==='sel'){V[d.k]=d.v!=null?d.v:d.o[0][0];lab.innerHTML='<b>'+d.l+'</b>';var s=document.createElement('select');d.o.forEach(function(o){var op=document.createElement('option');op.value=o[0];op.textContent=o[1];s.appendChild(op)});s.value=V[d.k];s.addEventListener('change',function(){V[d.k]=isNaN(+s.value)?s.value:+s.value;fire(d.k)});lab.appendChild(s)}
    else if(d.t==='chk'){V[d.k]=!!d.v;var i=document.createElement('input');i.type='checkbox';i.checked=!!d.v;i.addEventListener('change',function(){V[d.k]=i.checked;fire(d.k)});lab.style.cssText='display:flex;gap:.6cqw;align-items:center';lab.appendChild(i);lab.appendChild(document.createTextNode(d.l))}
    else{V[d.k]=d.v;var f=d.f||function(x){return nf(x,d.step<1?2:0)};lab.innerHTML='<b>'+d.l+'<output>'+f(d.v)+'</output></b>';var r=document.createElement('input');r.type='range';r.min=d.min;r.max=d.max;r.step=d.step;r.value=d.v;r.setAttribute('aria-label',d.l);
      r.addEventListener('input',function(){V[d.k]=+r.value;lab.querySelector('output').textContent=f(+r.value);fire(d.k)});lab.appendChild(r);outs[d.k]={r:r,o:lab.querySelector('output'),f:f}}
    cb.appendChild(lab)});
  cb.appendChild(out);
  return{svg:svg,V:V,out:function(h){out.innerHTML=h},set:function(k,v){V[k]=v;if(outs[k]){outs[k].r.value=v;outs[k].o.textContent=outs[k].f(v)}},fire:function(){fire()},box:box}}
function plot(svg,Wd,Ht,m,xr,yr,o){o=o||{};var g=sv('g',null,svg),w=Wd-m.l-m.r,h=Ht-m.t-m.b;
  var X=function(v){return m.l+(v-xr[0])/(xr[1]-xr[0])*w},Y=function(v){return m.t+h-(v-yr[0])/(yr[1]-yr[0])*h};if(o.yinv)Y=function(v){return m.t+(v-yr[0])/(yr[1]-yr[0])*h};
  var i,n=o.nx==null?5:o.nx,k=o.ny==null?5:o.ny,v;
  for(i=0;k>0&&i<=k;i++){v=yr[0]+(yr[1]-yr[0])*i/k;sv('line',{x1:m.l,x2:m.l+w,y1:Y(v),y2:Y(v),stroke:GR,'stroke-width':.7},g);sv('text',{x:m.l-5,y:Y(v)+3.5,'text-anchor':'end',fill:TX,'font-size':10.5},g,(o.yf||nf)(v,(yr[1]-yr[0])<6?1:0))}
  for(i=0;i<=n;i++){v=xr[0]+(xr[1]-xr[0])*i/n;sv('line',{x1:X(v),x2:X(v),y1:m.t,y2:m.t+h,stroke:GR,'stroke-width':.5},g);sv('text',{x:X(v),y:m.t+h+14,'text-anchor':'middle',fill:TX,'font-size':10.5},g,(o.xf||nf)(v,(xr[1]-xr[0])<6?1:0))}
  sv('rect',{x:m.l,y:m.t,width:w,height:h,fill:'none',stroke:'rgba(255,255,255,.35)'},g);
  if(o.xl)sv('text',{x:m.l+w/2,y:Ht-4,'text-anchor':'middle',fill:TX,'font-size':11,'font-weight':600},g,o.xl);
  if(o.yl)sv('text',{transform:'rotate(-90)',x:-(m.t+h/2),y:12,'text-anchor':'middle',fill:TX,'font-size':11,'font-weight':600},g,o.yl);
  return{X:X,Y:Y,g:g,w:w,h:h,m:m}}
function path(par,pts,X,Y,col,wd,dash){var d=pts.map(function(p,i){return(i?'L':'M')+X(p[0]).toFixed(1)+' '+Y(p[1]).toFixed(1)}).join('');return sv('path',{d:d,fill:'none',stroke:col,'stroke-width':wd||2.2,'stroke-dasharray':dash||'','stroke-linejoin':'round'},par)}
function lbl(par,x,y,t,col,sz,anc){return sv('text',{x:x,y:y,fill:col||TX,'font-size':sz||11,'text-anchor':anc||'start','font-weight':600},par,t)}
function wrap(par,x,y,text,col,sz,maxc,lh){var words=String(text).split(' '),line='',yy=y,t;sz=sz||11;lh=lh||sz*1.3;words.forEach(function(w){if((line+' '+w).length>maxc&&line){lbl(par,x,yy,line,col,sz);yy+=lh;line=w}else line=line?line+' '+w:w});if(line)lbl(par,x,yy,line,col,sz);return yy}

/* ===== mapa conceptual / flujo genérico ===== */
W.concept=function(box,p,api){var h=mkui(box,[],null,{w:760,h:360,touch:api.touch});var svg=h.svg,ns=[],i;
  var defs=sv('defs',null,svg);var mk=sv('marker',{id:'ar',viewBox:'0 0 10 10',refX:9,refY:5,markerWidth:6,markerHeight:6,orient:'auto-start-reverse'},defs);sv('path',{d:'M0 0L10 5L0 10z',fill:GN},mk);
  var gE=sv('g',null,svg),gN=sv('g',null,svg),els=[];
  function pos(n){return{x:n.x/100*760,y:n.y/100*360}}
  var NW=(p.nw||150)*1.12,NH=(p.nh||46)*1.15;
  (p.edges||[]).forEach(function(e){var a=p.nodes[e[0]],b=p.nodes[e[1]],A=pos(a),B=pos(b),dx=B.x-A.x,dy=B.y-A.y,L=Math.hypot(dx,dy)||1;
    var sx=A.x+dx/L*Math.min(NW/2,Math.abs(dx)>Math.abs(dy)*NW/NH?NW/2:NH/2*L/Math.abs(dy||1)),sy=A.y+dy/L*Math.min(NH/2*1.0,Math.abs(dy)>0?NH/2:0);
    var ex=B.x-(Math.abs(dx)>=Math.abs(dy)*1.2?Math.sign(dx)*NW/2:0),ey=B.y-(Math.abs(dx)<Math.abs(dy)*1.2?Math.sign(dy)*NH/2:0);
    var s={x:A.x+(Math.abs(dx)>=Math.abs(dy)*1.2?Math.sign(dx)*NW/2:0),y:A.y+(Math.abs(dx)<Math.abs(dy)*1.2?Math.sign(dy)*NH/2:0)};
    var ln=sv('line',{x1:s.x,y1:s.y,x2:ex,y2:ey,stroke:GN,'stroke-width':1.8,'marker-end':'url(#ar)'},gE);els.push({k:'e',a:e[0],b:e[1],el:ln});
    if(e[2]){var t=sv('text',{x:(s.x+ex)/2,y:(s.y+ey)/2-5,'text-anchor':'middle',fill:AM,'font-size':12,'font-weight':600},gE,e[2]);els.push({k:'t',a:e[0],b:e[1],el:t})}});
  p.nodes.forEach(function(n,i){var P=pos(n),g=sv('g',{tabindex:0,style:'cursor:pointer'},gN),col=n.c||'#17755A';
    sv('rect',{x:P.x-NW/2,y:P.y-NH/2,width:NW,height:NH,rx:9,fill:col,'fill-opacity':.32,stroke:col,'stroke-width':1.6},g);
    var lines=String(n.l).split('|');lines.forEach(function(s,j){sv('text',{x:P.x,y:P.y+5-(lines.length-1)*8+j*16,'text-anchor':'middle',fill:'#fff','font-size':13.5,'font-weight':700},g,s)});
    function sel(){h.out('<strong>'+(n.l.replace('|',' '))+'</strong>: '+(n.n||''))}g.addEventListener('click',sel);g.addEventListener('keydown',function(e){if(e.key==='Enter')sel()});els.push({k:'n',a:i,el:g})});
  function show(k){els.forEach(function(o){var on=k==null||(o.k==='n'?o.a<=k:(o.a<=k&&o.b<=k));o.el.style.opacity=on?1:.12;o.el.style.transition='opacity .4s'})}
  show(null);h.out(p.hint||'Tocá un bloque para ver su descripción.');
  return{onCue:function(c){if(c.hl!=null)show(c.hl)}}};

/* ===== MAPA DE CUENCA (esquemático) con ventanas de madurez ===== */
W.basin=function(box,p,api){var h=mkui(box,[{k:'mat',l:'Madurez térmica (profundidad de enterramiento)',min:0,max:100,step:1,v:55,f:function(v){return v+' %'}},
  {k:'oil',l:'Ventana de petróleo',t:'chk',v:true},{k:'wet',l:'Gas húmedo / condensado',t:'chk',v:true},{k:'dry',l:'Gas seco',t:'chk',v:true},{k:'flt',l:'Fallas y lineamientos',t:'chk',v:false},{k:'pil',l:'Pozos piloto (ilustrativos)',t:'chk',v:true}],draw,{side:true,w:640,h:380,touch:api.touch});
  var svg=h.svg;function draw(V){svg.innerHTML='';var d=sv('defs',null,svg);
    var cp=sv('clipPath',{id:'bc'},d);sv('path',{d:'M90 60 C200 20 380 30 520 70 C600 110 610 220 560 300 C480 360 300 350 190 320 C100 290 40 200 90 60Z'},cp);
    sv('rect',{width:640,height:380,fill:'rgba(10,30,50,.6)'},svg);
    var g=sv('g',{'clip-path':'url(#bc)'},svg);sv('rect',{x:0,y:0,width:640,height:380,fill:'#13354f'},g);
    var m=V.mat/100,e1=470-m*250,e2=e1-70-m*60,e3=e2-60-m*40; /* fronteras W→E: seco | húmedo | petróleo */
    if(V.oil)sv('path',{d:'M'+e2+' 0 L640 0 L640 380 L'+e2+' 380 C'+(e2+30)+' 260 '+(e2-20)+' 130 '+e2+' 0Z',fill:'#17755A','fill-opacity':.75},g);
    if(V.wet)sv('path',{d:'M'+e3+' 0 L'+e2+' 0 C'+(e2-20)+' 130 '+(e2+30)+' 260 '+e2+' 380 L'+e3+' 380 C'+(e3+25)+' 260 '+(e3-15)+' 130 '+e3+' 0Z',fill:AM,'fill-opacity':.8},g);
    if(V.dry)sv('path',{d:'M0 0 L'+e3+' 0 C'+(e3-15)+' 130 '+(e3+25)+' 260 '+e3+' 380 L0 380Z',fill:'#b3414a','fill-opacity':.8},g);
    if(V.flt){[[130,70,330,330],[220,50,380,340],[420,60,500,300]].forEach(function(f){sv('line',{x1:f[0],y1:f[1],x2:f[2],y2:f[3],stroke:'#fff','stroke-dasharray':'5 4','stroke-width':1.2,opacity:.7},g)})}
    if(V.pil){[[470,150],[430,230],[330,180],[290,260],[200,130]].forEach(function(q,i){sv('circle',{cx:q[0],cy:q[1],r:4.5,fill:'#fff',stroke:'#0b1a30'},g);lbl(g,q[0]+7,q[1]+4,'P'+(i+1),'#fff',9.5)})}
    sv('path',{d:'M90 60 C200 20 380 30 520 70 C600 110 610 220 560 300 C480 360 300 350 190 320 C100 290 40 200 90 60Z',fill:'none',stroke:'#fff','stroke-width':2},svg);
    lbl(svg,16,26,'Mapa conceptual de cuenca de antepaís (no a escala)',TX,12);lbl(svg,16,374,'Esquema didáctico: no representa datos reales',AM,10);
    sv('path',{d:'M610 40 l8 -22 l8 22 l-8 -6z',fill:'#fff'},svg);lbl(svg,611,56,'N','#fff',11);
    lbl(svg,12,350,'← borde orogénico (mayor enterramiento)',TX,10);lbl(svg,628,350,'antepaís →',TX,10,'end');
    h.out('A medida que sube la <strong>madurez</strong>, las ventanas <strong>de petróleo → gas húmedo → gas seco</strong> avanzan hacia el antepaís. Hoy: petróleo '+(V.oil?'visible':'oculta')+'. Cambiá el control y observá hacia dónde se desplaza la ventana de petróleo.')}
  draw(h.V)};

/* ===== EVENTOS DEL SISTEMA PETROLERO ===== */
W.syst=function(box,p,api){var h=mkui(box,[{k:'t',l:'Momento geológico (Ma)',min:0,max:160,step:1,v:100,f:function(v){return v+' Ma'}},{k:'late',l:'Escenario: trampa formada DESPUÉS de la migración',t:'chk',v:false}],draw,{w:640,h:340,touch:api.touch});
  var svg=h.svg;function draw(V){svg.innerHTML='';var rows=[['Roca generadora',150,130,GN],['Roca reservorio',140,120,BL],['Roca sello',130,110,VI],['Sobrecarga',130,0,'#8ea2bd'],['Formación de trampa',V.late?50:110,V.late?30:90,AM],['Generación – migración – acumulación',100,40,RD],['Preservación',90,0,'#8ea2bd']];
    var P=plot(svg,640,340,{l:190,r:14,t:26,b:44},[160,0],[0,rows.length],{nx:8,ny:0,xl:'Millones de años antes del presente (Ma)',xf:function(v){return v}});
    rows.forEach(function(r,i){var y=P.Y(i)+10;lbl(svg,8,y+14,r[0],TX,11);sv('rect',{x:P.X(r[1]),y:y,width:Math.max(3,P.X(r[2])-P.X(r[1])),height:20,rx:5,fill:r[3],'fill-opacity':.85},svg)});
    var cx=P.X(V.t);sv('line',{x1:cx,x2:cx,y1:P.m.t-6,y2:P.m.t+P.h,stroke:'#fff','stroke-width':2},svg);lbl(svg,cx,P.m.t-9,V.t+' Ma','#fff',11,'middle');
    var present=rows.filter(function(r){return V.t<=r[1]&&V.t>=r[2]||(r[2]===0&&V.t<=r[1])}).map(function(r){return r[0]});
    var ok=!V.late;h.out('En <strong>'+V.t+' Ma</strong> están activos: '+(present.join(', ')||'ninguno')+'.<br>Sincronía trampa–migración: <strong style="color:'+(ok?GN:RD)+'">'+(ok?'✓ la trampa ya existía cuando migró el hidrocarburo':'✗ la trampa se formó después: el petróleo migró y se perdió')+'</strong>. Un sistema petrolero exige elementos <em>y</em> procesos en el orden correcto.')}
  draw(h.V)};

/* ===== HISTORIA DE ENTERRAMIENTO ===== */
W.burial=function(box,p,api){var h=mkui(box,[{k:'g',l:'Gradiente geotérmico',min:20,max:50,step:1,v:32,f:function(v){return v+' °C/km'}},{k:'z',l:'Factor de enterramiento',min:70,max:130,step:5,v:100,f:function(v){return v+' %'}}],draw,{side:true,w:640,h:360,touch:api.touch});
  var svg=h.svg,base=[[160,0],[130,800],[100,1800],[70,2700],[40,3200],[15,3500],[0,3600]];
  function dep(t,f){for(var i=0;i<base.length-1;i++){if(t<=base[i][0]&&t>=base[i+1][0]){var u=(base[i][0]-t)/(base[i][0]-base[i+1][0]);return(base[i][1]+u*(base[i+1][1]-base[i][1]))*f}}return 0}
  function draw(V){svg.innerHTML='';var f=V.z/100,P=plot(svg,640,360,{l:52,r:90,t:20,b:44},[160,0],[0,5000],{yinv:true,nx:8,xl:'Edad (Ma)',yl:'Profundidad (m)',xf:function(v){return v}});
    var pts=[],t;for(t=160;t>=0;t-=2)pts.push([t,dep(t,f)]);
    var win=function(T){return T<60?['inmadura','#8ea2bd']:T<120?['petróleo',GN]:T<150?['gas húmedo',AM]:['gas seco',RD]};
    var first=null,end=null;for(var i=0;i<pts.length-1;i++){var T=15+V.g*pts[i][1]/1000,w=win(T);if(!first&&T>=60)first=pts[i][0];
      sv('line',{x1:P.X(pts[i][0]),y1:P.Y(pts[i][1]),x2:P.X(pts[i+1][0]),y2:P.Y(pts[i+1][1]),stroke:w[1],'stroke-width':4,'stroke-linecap':'round'},svg)}
    var Tn=15+V.g*dep(0,f)/1000,wn=win(Tn);end=wn[0];
    [[60,'60 °C'],[120,'120 °C'],[150,'150 °C']].forEach(function(l){var z=(l[0]-15)/V.g*1000;if(z<5000){sv('line',{x1:P.m.l,x2:P.m.l+P.w,y1:P.Y(z),y2:P.Y(z),stroke:'#fff','stroke-dasharray':'3 4',opacity:.4},svg);lbl(svg,P.m.l+P.w+4,P.Y(z)+3,l[1],'#fff',10)}});
    [['inmadura','#8ea2bd'],['petróleo',GN],['gas húmedo',AM],['gas seco',RD]].forEach(function(l,i){sv('rect',{x:70,y:246+i*14,width:10,height:8,fill:l[1]},svg);lbl(svg,84,254+i*14,l[0],TX,10)});
    h.out('Temperatura actual de la generadora: <strong>'+nf(Tn)+' °C</strong> → <strong style="color:'+wn[1]+'">'+end+'</strong>.<br>'+(first?'Inicio de generación de petróleo hace <strong>~'+first+' Ma</strong>.':'No alcanzó la ventana de petróleo.')+' Subí el gradiente: la generación se adelanta; bajá el enterramiento: puede no llegar a madurar.')}
  draw(h.V)};

/* ===== CUTOFFS Y VOLUMETRÍA SOBRE UN PERFIL SINTÉTICO ===== */
W.cutoffs=function(box,p,api){var h=mkui(box,[{k:'vsh',l:'Corte Vsh (máx.)',min:.1,max:.6,step:.01,v:.4,f:function(v){return nf(v,2)}},{k:'phi',l:'Corte porosidad (mín.)',min:.02,max:.12,step:.005,v:.06,f:function(v){return nf(v*100,1)+' %'}},{k:'sw',l:'Corte Sw (máx.)',min:.3,max:.8,step:.01,v:.6,f:function(v){return nf(v,2)}}],draw,{w:640,h:380,touch:api.touch});
  var svg=h.svg,r=rng(7),N=96,z=[],gr=[],ph=[],sw=[],i,a=60,b=.12,c=.5;
  for(i=0;i<N;i++){a+=(r()-.5)*28;a=Math.max(20,Math.min(140,a*.985+1));gr.push(a);var vs=Math.max(0,Math.min(1,(a-20)/120));b=Math.max(.02,Math.min(.3,.27*(1-vs)+.02+(r()-.5)*.03));ph.push(b);c=Math.max(.1,Math.min(1,.15+.9*vs+(r()-.5)*.18+(i>60?.25:0)));sw.push(Math.min(1,c));z.push(2400+i*.5)}
  function draw(V){svg.innerHTML='';var tr=[[20,170,'Rayos gamma (API)',[0,150],GN],[190,340,'Porosidad (frac.)',[.3,0],BL],[360,510,'Sw (frac.)',[0,1],AM]];var top=40,H=300,Y=function(i){return top+i/N*H},net=0,pay=0,sph=0,ssw=0;
    var flags=[];for(i=0;i<N;i++){var vsh=(gr[i]-20)/120,rock=vsh<=V.vsh,res=rock&&ph[i]>=V.phi,pa=res&&sw[i]<=V.sw;flags.push([rock,res,pa]);if(rock)net++;if(res){}if(pa){pay++;sph+=ph[i];ssw+=sw[i]}}
    tr.forEach(function(t,k){sv('rect',{x:t[0],y:top,width:t[1]-t[0],height:H,fill:'rgba(255,255,255,.05)',stroke:'rgba(255,255,255,.3)'},svg);lbl(svg,t[0],top-8,t[2],TX,10.5);
      var arr=[gr,ph,sw][k],pts=arr.map(function(v,i){var u=(v-t[3][0])/(t[3][1]-t[3][0]);return[t[0]+u*(t[1]-t[0]),Y(i)]});svg.appendChild(sv('path',{d:pts.map(function(q,i){return(i?'L':'M')+q[0].toFixed(1)+' '+q[1].toFixed(1)}).join(''),fill:'none',stroke:t[4],'stroke-width':1.6}))});
    var cl=[[V.vsh*120+20,0],[V.phi,1],[V.sw,2]];[[V.vsh*120+20,20,170,[0,150]],[V.phi,190,340,[.3,0]],[V.sw,360,510,[0,1]]].forEach(function(l){var u=(l[0]-l[3][0])/(l[3][1]-l[3][0]);sv('line',{x1:l[1]+u*(l[2]-l[1]),x2:l[1]+u*(l[2]-l[1]),y1:top,y2:top+H,stroke:'#fff','stroke-dasharray':'4 3'},svg)});
    sv('rect',{x:524,y:top,width:18,height:H,fill:'rgba(255,255,255,.06)',stroke:'rgba(255,255,255,.3)'},svg);lbl(svg,520,top-8,'Neto',TX,10.5);
    flags.forEach(function(f,i){if(f[2])sv('rect',{x:526,y:Y(i),width:14,height:H/N+.4,fill:GN},svg);else if(f[1])sv('rect',{x:526,y:Y(i),width:14,height:H/N+.4,fill:AM},svg);else if(f[0])sv('rect',{x:526,y:Y(i),width:14,height:H/N+.4,fill:BL,opacity:.6},svg)});
    sv('rect',{x:556,y:top,width:10,height:8,fill:GN},svg);lbl(svg,570,top+8,'net pay',TX,10);sv('rect',{x:556,y:top+16,width:10,height:8,fill:AM},svg);lbl(svg,570,top+24,'roca reservorio',TX,10);sv('rect',{x:556,y:top+32,width:10,height:8,fill:BL,opacity:.6},svg);lbl(svg,570,top+40,'roca neta',TX,10);
    var half=.5,gross=N*half,hn=net*half,hp=pay*half,ntg=hn/gross,aphi=pay?sph/pay:0,asw=pay?ssw/pay:0,Bo=1.3,A=1000,stoiip=7758*A*hp*3.281*aphi*(1-asw)/Bo/1e6;
    h.out('Espesor bruto <strong>'+nf(gross)+' m</strong> · roca neta <strong>'+nf(hn,1)+' m</strong> · net pay <strong>'+nf(hp,1)+' m</strong> · NTG pay/bruto <strong>'+nf(hp/gross,2)+'</strong>'+(pay?' · φ medio '+nf(aphi*100,1)+' % · Sw medio '+nf(asw,2):'')+'.<br>STOIIP de ejemplo (A = 1.000 acres, Bo = 1,3): <strong>'+nf(stoiip,1)+' MMbbl</strong>. Endurecé los cortes y mirá cómo cae el volumen: el corte es una decisión de ingeniería, no un dato.')}
  draw(h.V)};

/* ===== MONTE CARLO: volumetría (stoiip) o suma de pozos (wells) ===== */
W.mc=function(box,p,api){var mode=p.mode||'stoiip';var defs=mode==='stoiip'?[{k:'u',l:'Incertidumbre de los parámetros',min:5,max:60,step:5,v:25,f:function(v){return '±'+v+' %'}},{t:'btn',l:'Re-simular',fn:function(){seed++}}]:
  [{k:'n',l:'Cantidad de pozos en el portafolio',min:1,max:60,step:1,v:10,f:function(v){return v}},{k:'s',l:'Dispersión del EUR por pozo (σ log)',min:.2,max:1.2,step:.05,v:.6,f:function(v){return nf(v,2)}},{t:'btn',l:'Re-simular',fn:function(){seed++}}];
  var seed=11,h=mkui(box,defs,draw,{w:640,h:340,side:true,touch:api.touch}),svg=h.svg;
  function draw(V){svg.innerHTML='';var r=rng(seed*97),N=3000,xs=[],i,j;
    if(mode==='stoiip'){var u=V.u/100;for(i=0;i<N;i++){var A=tri(r,1000*(1-u),1000,1000*(1+u)),hh=tri(r,30*(1-u),30,30*(1+u)),ph=tri(r,.08*(1-u),.08,.08*(1+u)),sw=tri(r,.35*(1-u),.35,.35*(1+u));xs.push(7758*A*hh*3.281*ph*(1-sw)/1.3/1e6)}}
    else{for(i=0;i<N;i++){var s=0;for(j=0;j<V.n;j++)s+=Math.exp(Math.log(100)+V.s*gauss(r));xs.push(s/1000)}}
    xs.sort(function(a,b){return a-b});var pc=function(q){return xs[Math.floor((1-q)*(N-1))]},p90=pc(.9),p50=pc(.5),p10=pc(.1),mean=xs.reduce(function(a,b){return a+b},0)/N;
    var lo=xs[Math.floor(.005*N)],hi=xs[Math.floor(.995*N)],B=36,bins=new Array(B).fill(0);xs.forEach(function(x){var k=Math.floor((x-lo)/(hi-lo)*B);if(k>=0&&k<B)bins[k]++});var mx=Math.max.apply(null,bins);
    var P=plot(svg,640,340,{l:44,r:16,t:30,b:44},[lo,hi],[0,mx/N*100],{xl:mode==='stoiip'?'STOIIP (MMbbl)':'Total del portafolio (MMbbl, 1 pozo ≈ 0,1 MMbbl P50)',yl:'Frecuencia (%)',yf:function(v){return nf(v,0)},xf:function(v){return nf(v,mode==='stoiip'?0:1)}});
    bins.forEach(function(b,k){var x0=lo+k*(hi-lo)/B,x1=x0+(hi-lo)/B,c=x0>=p90?(x0>=p10?RD:GN):'#8ea2bd';sv('rect',{x:P.X(x0)+.5,y:P.Y(b/N*100),width:P.X(x1)-P.X(x0)-1,height:P.Y(0)-P.Y(b/N*100),fill:x0>=p50?(x0>=p10?VI:GN):BL,'fill-opacity':.85},svg)});
    [[p90,'P90','#fff'],[p50,'P50','#fff'],[p10,'P10','#fff']].forEach(function(l){sv('line',{x1:P.X(l[0]),x2:P.X(l[0]),y1:P.m.t,y2:P.m.t+P.h,stroke:l[2],'stroke-width':1.6,'stroke-dasharray':'5 3'},svg);lbl(svg,P.X(l[0]),P.m.t-6,l[1],l[2],11,'middle')});
    if(mode==='stoiip')h.out('<strong>P90 '+nf(p90)+'</strong> · <strong>P50 '+nf(p50)+'</strong> · <strong>P10 '+nf(p10)+'</strong> MMbbl · media '+nf(mean)+'. Rango P10/P90 = <strong>'+nf(p10/p90,2)+'×</strong>. Sin dato nuevo, solo más incertidumbre, el rango se abre.');
    else{var sump90=V.n*Math.exp(Math.log(100)+(-1.2816)*V.s)/1000;h.out('Portafolio de '+V.n+' pozos: P90 <strong>'+nf(p90,2)+'</strong> · P50 <strong>'+nf(p50,2)+'</strong> · P10 <strong>'+nf(p10,2)+'</strong> MMbbl. Cociente P10/P90 = <strong>'+nf(p10/p90,2)+'×</strong>.<br>Sumar aritméticamente los P90 de cada pozo daría '+nf(sump90,2)+' MMbbl: <strong>'+(sump90<p90?'subestima':'sobreestima')+'</strong> el P90 real del conjunto (efecto portafolio). Aumentá los pozos y mirá cómo se cierra el rango.')}}
  draw(h.V)};

/* ===== MARCO PRMS (clasificación) ===== */
W.prms=function(box,p,api){var h=mkui(box,[],null,{w:760,h:380,touch:api.touch}),svg=h.svg;
  var info={
  'tot':'<strong>Petróleo total inicialmente in situ (PIIP):</strong> todo el hidrocarburo estimado en acumulaciones naturales, descubierto o no.',
  'res':'<strong>Reservas:</strong> cantidades comercialmente recuperables, a una fecha, mediante proyectos aplicados a acumulaciones conocidas, bajo condiciones definidas. Deben ser descubiertas, recuperables, comerciales y remanentes.',
  'con':'<strong>Recursos contingentes:</strong> potencialmente recuperables de acumulaciones conocidas, pero el proyecto aún no cumple los criterios de comercialidad (p. ej. mercado, aprobaciones, economía o tecnología).',
  'pro':'<strong>Recursos prospectivos:</strong> potencialmente recuperables de acumulaciones aún no descubiertas. Se evalúan con probabilidad de descubrimiento y de desarrollo.',
  'unr':'<strong>Irrecuperable:</strong> la parte del PIIP que no se estima recuperable con los proyectos considerados; puede pasar a recuperable si cambian la tecnología o las condiciones comerciales.',
  '1P':'<strong>1P / Probadas (estimación baja):</strong> alta confianza de que las cantidades recuperadas igualen o superen la estimación. Con métodos probabilísticos, al menos 90 % de probabilidad (P90).',
  '2P':'<strong>2P = Probadas + Probables (mejor estimación):</strong> igualar o superar con al menos 50 % de probabilidad (P50) en métodos probabilísticos.',
  '3P':'<strong>3P = Probadas + Probables + Posibles (estimación alta):</strong> con al menos 10 % de probabilidad (P10) de ser igualada o superada.',
  'sub':'<strong>Madurez del proyecto:</strong> en producción · aprobado para desarrollo · justificado para desarrollo (reservas); desarrollo pendiente · en espera · sin aclarar · no viable (contingentes); prospecto · lead · play (prospectivos).'};
  function cell(x,y,w,hh,t,fill,k,fs){var g=sv('g',{tabindex:0,style:'cursor:pointer'},svg);sv('rect',{x:x,y:y,width:w,height:hh,rx:6,fill:fill,'fill-opacity':.78,stroke:'rgba(255,255,255,.5)'},g);
    String(t).split('|').forEach(function(s,i,a){sv('text',{x:x+w/2,y:y+hh/2+4-(a.length-1)*6+i*13,'text-anchor':'middle',fill:'#fff','font-size':fs||11,'font-weight':700},g,s)});
    function go(){h.out(info[k]||'')}g.addEventListener('click',go);g.addEventListener('keydown',function(e){if(e.key==='Enter')go()})}
  lbl(svg,8,18,'Clasificación de recursos SPE-PRMS (2018) · tocá cada bloque','#fff',12);
  cell(8,30,744,34,'PETRÓLEO TOTAL INICIALMENTE IN SITU (PIIP)','#1B2944','tot',12.5);
  cell(8,70,172,34,'Producción','#0d5a44','sub');
  cell(190,70,560,34,'DESCUBIERTO · COMERCIAL → RESERVAS','#17755A','res',12);
  var cols=[['1P',210],['2P',410],['3P',590]];
  cell(190,110,170,38,'En producción','#17755A','sub');cell(366,110,170,38,'Aprobado para|desarrollo','#17755A','sub');cell(542,110,208,38,'Justificado para desarrollo','#17755A','sub');
  cell(190,154,170,30,'1P · baja','#0d5a44','1P');cell(366,154,170,30,'2P · mejor','#0d5a44','2P');cell(542,154,208,30,'3P · alta','#0d5a44','3P');
  cell(190,194,560,30,'DESCUBIERTO · NO COMERCIAL → RECURSOS CONTINGENTES','#2b6cb0','con',12);
  cell(190,230,170,38,'Desarrollo pendiente|En espera','#2b6cb0','sub');cell(366,230,170,38,'Sin aclarar|No viable','#2b6cb0','sub');cell(542,230,208,38,'1C · 2C · 3C','#2b6cb0','con');
  cell(190,278,560,30,'NO DESCUBIERTO → RECURSOS PROSPECTIVOS','#b7791f','pro',12);
  cell(190,314,170,34,'Prospecto','#b7791f','sub');cell(366,314,170,34,'Lead','#b7791f','sub');cell(542,314,208,34,'Play · Baja · Mejor · Alta','#b7791f','pro');
  cell(8,278,172,70,'IRRECUPERABLE|(cualquier etapa)','#5b6b86','unr');
  cell(8,110,172,74,'Aumenta la|probabilidad de|comercialidad ↑','#0b1a30','sub');cell(8,194,172,74,'Rango de|incertidumbre →','#0b1a30','sub');
  h.out('Elegí un bloque. La clasificación combina dos ejes: <strong>madurez del proyecto</strong> (¿qué tan comercial es?) e <strong>incertidumbre</strong> (baja / mejor / alta).')};

/* ===== DECLINACIÓN ARPS + ECONOMÍA ===== */
W.decline=function(box,p,api){var econ=!!p.econ;var defs=[{k:'qi',l:'Caudal inicial qi',min:100,max:1500,step:10,v:p.qi||600,f:function(v){return nf(v)+' bbl/d'}},{k:'di',l:'Declinación nominal inicial Di',min:20,max:95,step:1,v:p.di||60,f:function(v){return v+' %/año'}},{k:'b',l:'Exponente b',min:0,max:1.5,step:.05,v:p.b!=null?p.b:.8,f:function(v){return nf(v,2)}}];
  if(econ){defs.push({k:'pr',l:'Precio',min:25,max:110,step:1,v:p.pr||65,f:function(v){return nf(v)+' USD/bbl'}},{k:'ox',l:'Costo fijo por pozo',min:2000,max:25000,step:500,v:p.ox||9000,f:function(v){return nf(v)+' USD/mes'}},{k:'ro',l:'Regalías',min:0,max:25,step:1,v:p.ro||12,f:function(v){return v+' %'}})}
  else defs.push({k:'ql',l:'Límite económico',min:2,max:60,step:1,v:15,f:function(v){return v+' bbl/d'}},{k:'lg',l:'Escala semilog',t:'chk',v:false});
  var h=mkui(box,defs,draw,{side:true,w:640,h:340,touch:api.touch}),svg=h.svg;
  function q(t,qi,di,b){return b<.01?qi*Math.exp(-di*t):qi/Math.pow(1+b*di*t,1/b)}
  function eur(qi,di,b,ql){var cum=0,t=0,dt=1/12;while(t<40){var qq=q(t,qi,di,b);if(qq<ql)break;cum+=qq*30.4;t+=dt}return{cum:cum,t:t}}
  function draw(V){svg.innerHTML='';var di=V.di/100,ql=econ?(V.ox/((V.pr*(1-V.ro/100)-8)*30.4)):V.ql;if(!isFinite(ql)||ql<0)ql=1e9;var T=25,lg=!!V.lg,ymax=Math.max(V.qi*1.05,10);
    var yr=lg?[Math.log10(1),Math.log10(Math.max(ymax,20))]:[0,ymax],yv=lg?function(v){return Math.log10(Math.max(v,1))}:function(v){return v};
    var P=plot(svg,640,340,{l:52,r:16,t:20,b:44},[0,T],[yr[0],yr[1]],{xl:'Tiempo (años)',yl:'Caudal (bbl/d)',yf:lg?function(v){return nf(Math.pow(10,v))}:nf,xf:function(v){return v}});
    var pts=[],pb=[],t;for(t=0;t<=T;t+=.25){pts.push([t,yv(Math.max(q(t,V.qi,di,V.b),.8))])}
    [[0,GN,'b = 0 (exponencial)'],[1,BL,'b = 1 (armónica)']].forEach(function(g,i){var a=[];for(t=0;t<=T;t+=.5)a.push([t,yv(Math.max(q(t,V.qi,di,g[0]),.8))]);path(svg,a,P.X,P.Y,g[1],1.3,'4 4');lbl(svg,P.m.l+8,P.m.t+14+i*13,g[2],g[1],10)});
    path(svg,pts,P.X,P.Y,AM,3);
    if(ql<ymax){sv('line',{x1:P.m.l,x2:P.m.l+P.w,y1:P.Y(yv(ql)),y2:P.Y(yv(ql)),stroke:RD,'stroke-width':1.6,'stroke-dasharray':'6 4'},svg);lbl(svg,P.m.l+P.w-4,P.Y(yv(ql))-5,'límite económico '+nf(ql)+' bbl/d',RD,10.5,'end')}
    var E=eur(V.qi,di,V.b,ql<1e8?ql:1e9),E0=eur(V.qi,di,0,ql<1e8?ql:1e9),E1=eur(V.qi,di,1,ql<1e8?ql:1e9);
    var s='EUR (hasta el límite): <strong>'+nf(E.cum/1000,1)+' Mbbl</strong> en '+nf(E.t,1)+' años. Con b=0: '+nf(E0.cum/1000,1)+' · con b=1: '+nf(E1.cum/1000,1)+' Mbbl.';
    if(econ){var st=ql>=V.qi?'<strong style="color:'+RD+'">NO económico</strong>: el límite económico ('+nf(ql)+' bbl/d) supera el caudal inicial → el volumen pasa a <strong>recurso contingente</strong>.':(E.t>=39?'':'<strong style="color:'+GN+'">Económico</strong>: el volumen remanente califica como <strong>reserva</strong> (si el proyecto cumple los demás criterios).');s+='<br>Límite económico = costo fijo ÷ (precio neto de regalías − costo variable 8 USD/bbl) → <strong>'+nf(ql>1e8?0:ql,1)+' bbl/d</strong>. '+st}
    else s+='<br>El EUR cambia mucho con <strong>b</strong>: es la hipótesis que más se discute en una auditoría.';h.out(s)}
  draw(h.V)};

/* ===== FLUJO FRACCIONAL BUCKLEY-LEVERETT / WELGE ===== */
W.bl=function(box,p,api){var h=mkui(box,[{k:'mu',l:'Viscosidad del petróleo',min:.5,max:50,step:.5,v:p.mu||6,f:function(v){return nf(v,1)+' cP'}},{k:'nw',l:'Exponente Corey del agua (nw)',min:1,max:4,step:.1,v:2,f:function(v){return nf(v,1)}},{k:'td',l:'Volúmenes porales inyectados (PVI)',min:.05,max:1,step:.01,v:.3,f:function(v){return nf(v,2)}}],draw,{w:760,h:340,touch:api.touch}),svg=h.svg;
  var Swc=.2,Sor=.25,krw0=.35,kro0=.9,no=2.5,muw=.5;
  function draw(V){svg.innerHTML='';var S=function(sw){return Math.max(0,Math.min(1,(sw-Swc)/(1-Swc-Sor)))},fw=function(sw){var s=S(sw),kw=krw0*Math.pow(s,V.nw),ko=kro0*Math.pow(1-s,no);return kw+ko===0?0:1/(1+(ko/V.mu)/(kw/muw+1e-12))};
    var best=0,Swf=Swc,sl=0,i;for(i=1;i<=400;i++){var sw=Swc+(1-Sor-Swc)*i/400,sp=fw(sw)/(sw-Swc);if(sp>sl){sl=sp;Swf=sw;best=fw(sw)}}
    var d=function(sw){return(fw(sw+.0008)-fw(sw-.0008))/.0016},Swbar=Swc+1/sl,M=(krw0/muw)/(kro0/V.mu),EDbt=(Swbar-Swc)/(1-Swc),EDmax=(1-Swc-Sor)/(1-Swc);
    var P=plot(svg,380,340,{l:44,r:10,t:26,b:42},[0,1],[0,1],{xl:'Saturación de agua Sw',yl:'Flujo fraccional fw',xf:function(v){return nf(v,1)},yf:function(v){return nf(v,1)}});
    var pts=[];for(i=0;i<=200;i++){var s=Swc+(1-Sor-Swc)*i/200;pts.push([s,fw(s)])}pts.push([1-Sor,fw(1-Sor)]);path(svg,pts,P.X,P.Y,GN,3);
    sv('line',{x1:P.X(Swc),y1:P.Y(0),x2:P.X(Swbar),y2:P.Y(1),stroke:AM,'stroke-width':1.6,'stroke-dasharray':'5 3'},svg);sv('circle',{cx:P.X(Swf),cy:P.Y(best),r:5,fill:AM},svg);lbl(svg,P.X(Swf)+8,P.Y(best)+14,'Swf (frente)',AM,10);lbl(svg,P.m.l+6,P.m.t+14,'Tangente de Welge',AM,10);
    lbl(svg,P.m.l+6,P.m.t+28,'M = '+nf(M,2),M>1?RD:GN,11);
    var P2=plot(svg,760,340,{l:430,r:12,t:26,b:42},[0,1],[Swc-.02,1-Sor+.05],{xl:'Distancia adimensional (inyector → productor)',yl:'Sw',xf:function(v){return nf(v,1)},yf:function(v){return nf(v,1)}});
    var prof=[],xf=V.td*d(Swf),xs=V.td*d(Swf);var arr=[];for(i=0;i<=120;i++){var s=1-Sor-(1-Sor-Swf)*i/120,xd=V.td*d(s);arr.push([Math.min(1,Math.max(0,xd)),s])}
    arr.sort(function(a,b){return a[0]-b[0]});var line=[[0,1-Sor]].concat(arr.filter(function(q){return q[0]>0}));var shock=Math.min(1,xs);line.push([shock,Swf],[shock,Swc],[1,Swc]);
    var fin=line.filter(function(q){return q[0]<=1});path(svg,fin,P2.X,P2.Y,BL,3);
    lbl(svg,P2.m.l+8,P2.m.t+14,V.td>=1/sl?'¡Irrupción de agua!':'Antes de la irrupción',V.td>=1/sl?RD:GN,11);
    h.out('<strong>M = '+nf(M,2)+'</strong> ('+(M>1?'desfavorable: el agua se canaliza':'favorable: desplazamiento estable')+') · Swf = '+nf(Swf,2)+' · irrupción a <strong>'+nf(1/sl,2)+' PVI</strong> · recuperación a la irrupción <strong>'+nf(EDbt*100,0)+' %</strong> del petróleo original (máx. teórico '+nf(EDmax*100,0)+' %). Subí la viscosidad del petróleo y observá cómo se adelanta la irrupción.')}
  draw(h.V)};

/* ===== MAPA DE ARREGLOS DE POZOS ===== */
W.pattern=function(box,p,api){var h=mkui(box,[{k:'ty',l:'Arreglo',t:'sel',o:[['5','Five-spot (5 puntos)'],['d','Línea directa'],['s','Línea escalonada']],v:'5'},{k:'pv',l:'Volumen poral inyectado',min:0,max:100,step:1,v:40,f:function(v){return nf(v/100,2)+' PVI'}},{k:'ch',l:'Canal de alta permeabilidad',t:'chk',v:false}],draw,{side:true,w:600,h:360,touch:api.touch}),svg=h.svg;
  function draw(V){svg.innerHTML='';sv('rect',{width:600,height:360,fill:'rgba(10,30,50,.5)'},svg);var inj=[],pro=[],i,j,cs=56,ox=40,oy=22;
    for(i=0;i<9;i++)for(j=0;j<6;j++){var x=ox+i*cs+(V.ty==='s'&&j%2?cs/2:0),y=oy+j*cs+10,isI=V.ty==='5'?((i+j)%2===0):(j%2===0);(isI?inj:pro).push([x,y])}
    var f=V.pv/100,r=cs*(.3+1.15*f);
    inj.forEach(function(q){sv('circle',{cx:q[0],cy:q[1],r:r,fill:BL,'fill-opacity':.25,stroke:BL,'stroke-width':1.2},svg)});
    if(V.ch){sv('path',{d:'M40 '+(oy+cs*2+10)+' L560 '+(oy+cs*2+10),stroke:RD,'stroke-width':9,opacity:.5,'stroke-linecap':'round'},svg);var L=40+f*520*1.4;sv('path',{d:'M40 '+(oy+cs*2+10)+' L'+Math.min(L,560)+' '+(oy+cs*2+10),stroke:BL,'stroke-width':9,'stroke-linecap':'round',opacity:.9},svg);lbl(svg,48,oy+cs*2-2,'canal de alta k: el agua llega primero',RD,10.5)}
    inj.forEach(function(q){sv('path',{d:'M'+q[0]+' '+(q[1]-8)+' l7 13 h-14z',fill:BL,stroke:'#fff'},svg)});pro.forEach(function(q){sv('circle',{cx:q[0],cy:q[1],r:6,fill:GN,stroke:'#fff'},svg)});
    var minD=1e9;inj.forEach(function(a){pro.forEach(function(b){minD=Math.min(minD,Math.hypot(a[0]-b[0],a[1]-b[1]))})});var bt=r>=minD*.98;
    sv('path',{d:'M10 340 l7 -12 l7 12z',fill:BL,stroke:'#fff'},svg);lbl(svg,30,339,'inyector',TX,10.5);sv('circle',{cx:112,cy:334,r:5,fill:GN,stroke:'#fff'},svg);lbl(svg,122,339,'productor',TX,10.5);
    var txt={5:'Five-spot: 1 inyector por productor; a la irrupción barre ≈ 72 % del área (M = 1, Craig, 1971).',d:'Línea directa: inyectores y productores enfrentados; irrumpe antes por el camino más corto.',s:'Línea escalonada: productores desplazados; reparte mejor el barrido areal.'}[V.ty];
    h.out(txt+'<br>El frente de agua '+(bt?'<strong style="color:'+RD+'">alcanzó a los productores</strong> (irrupción)':'todavía no llega a los productores')+'. '+(V.ch?'Con un canal de alta permeabilidad el agua irrumpe mucho antes: es el origen de la mala conformance.':'Activá el canal y compará.'))}
  draw(h.V)};

/* ===== HALL PLOT + VRR ===== */
W.hall=function(box,p,api){var h=mkui(box,[{k:'sc',l:'Escenario del inyector',t:'sel',o:[['n','Normal'],['d','Daño / taponamiento'],['f','Fractura / canalización']],v:'n'},{k:'m',l:'Mes del cambio',min:10,max:40,step:1,v:24,f:function(v){return 'mes '+v}},{k:'wi',l:'Inyección total',min:500,max:4000,step:50,v:2400,f:function(v){return nf(v)+' m³/d'}},{k:'qo',l:'Producción de petróleo del patrón',min:100,max:2500,step:50,v:900,f:function(v){return nf(v)+' m³/d'}},{k:'wc',l:'Corte de agua',min:0,max:95,step:1,v:60,f:function(v){return v+' %'}}],draw,{side:true,w:640,h:340,touch:api.touch}),svg=h.svg;
  function draw(V){svg.innerHTML='';var pts=[],cumW=0,hall=0,n=48,i,slopes=[];for(i=1;i<=n;i++){var q=100,dp=140,k=1;if(i>V.m){if(V.sc==='d')k=1+.05*(i-V.m);if(V.sc==='f')k=Math.max(.35,1-.045*(i-V.m))}
      cumW+=q*30;hall+=dp*k*30;pts.push([cumW/1000,hall/1000])}
    var P=plot(svg,640,340,{l:52,r:14,t:22,b:44},[0,pts[n-1][0]*1.02],[0,Math.max(pts[n-1][1]*1.1,100)],{xl:'Inyección acumulada Wi (miles m³)',yl:'Σ(Piny − Pres)·Δt (kPa·d × 10³)',xf:function(v){return nf(v,0)},yf:function(v){return nf(v,0)}});
    path(svg,pts,P.X,P.Y,GN,3);var cx=pts[V.m-1];sv('circle',{cx:P.X(cx[0]),cy:P.Y(cx[1]),r:5,fill:AM},svg);lbl(svg,P.X(cx[0])+8,P.Y(cx[1])+14,'cambio',AM,10);
    var dx=V.sc==='n'?'<strong style="color:'+GN+'">pendiente constante → inyectividad estable</strong>':V.sc==='d'?'<strong style="color:'+RD+'">pendiente que aumenta → pérdida de inyectividad (daño de formación, taponamiento)</strong>':'<strong style="color:'+AM+'">pendiente que disminuye → fractura, canalización o inyección fuera de zona</strong>';
    var Bo=1.2,Bw=1,qw=V.qo*V.wc/(100-V.wc||1),vrr=V.wi*Bw/(V.qo*Bo+qw*Bw);
    h.out('Hall plot: '+dx+'.<br>VRR = Winy·Bw ÷ (Qo·Bo + Qw·Bw) = <strong>'+nf(vrr,2)+'</strong> '+(vrr<.8?'(subinyección: la presión cae)':vrr>1.2?'(sobreinyección: riesgo de pérdidas de agua y fractura)':'(razonable, objetivo ≈ 1)')+'. Qw estimado '+nf(qw)+' m³/d. (Bo 1,2; Bw 1,0; datos sintéticos.)')}
  draw(h.V)};

/* ===== VENTANA DE LODO ===== */
W.mudwin=function(box,p,api){var h=mkui(box,[{k:'mw',l:'Densidad del lodo',min:1,max:2.1,step:.01,v:p.mw||1.35,f:function(v){return nf(v,2)+' sg'}},{k:'ecd',l:'Incremento por ECD',min:0,max:.15,step:.01,v:.05,f:function(v){return '+'+nf(v,2)+' sg'}},{k:'td',l:'Profundidad alcanzada',min:500,max:4000,step:50,v:p.td||3000,f:function(v){return nf(v)+' m'}},{k:'mg',l:'Margen de seguridad (viaje/trip)',min:0,max:.1,step:.01,v:.04,f:function(v){return nf(v,2)+' sg'}}],draw,{side:true,w:640,h:380,touch:api.touch}),svg=h.svg;
  var pore=function(d){return d<2200?1.03+.00006*d:(1.162+(d-2200)*.00027)},frac=function(d){return 1.42+.00019*d};
  function draw(V){svg.innerHTML='';var P=plot(svg,640,380,{l:52,r:16,t:22,b:44},[.9,2.3],[0,4000],{yinv:true,nx:7,xl:'Gradiente equivalente (sg)',yl:'Profundidad (m)',xf:function(v){return nf(v,1)}});
    var pp=[],ff=[],d;for(d=0;d<=4000;d+=50){pp.push([pore(d),d]);ff.push([frac(d),d])}
    var a=pp.concat(ff.slice().reverse()).map(function(q,i){return(i?'L':'M')+P.X(q[0])+' '+P.Y(q[1])}).join('');sv('path',{d:a+'Z',fill:GN,'fill-opacity':.14},svg);
    path(svg,pp,P.X,P.Y,BL,2.8);path(svg,ff,P.X,P.Y,RD,2.8);lbl(svg,P.X(1.0),P.Y(3850),'Presión de poro',BL,10.5);lbl(svg,P.X(2.06),P.Y(600),'Fractura',RD,10.5,'end');
    var eff=V.mw+V.ecd,x1=P.X(V.mw),x2=P.X(eff);sv('rect',{x:x1,y:P.m.t,width:Math.max(2,x2-x1),height:P.Y(V.td)-P.m.t,fill:AM,'fill-opacity':.35},svg);sv('line',{x1:x1,x2:x1,y1:P.m.t,y2:P.Y(V.td),stroke:AM,'stroke-width':2.4},svg);sv('line',{x1:P.m.l,x2:P.m.l+P.w,y1:P.Y(V.td),y2:P.Y(V.td),stroke:'#fff','stroke-dasharray':'4 4'},svg);lbl(svg,P.m.l+P.w-4,P.Y(V.td)-4,'TD actual '+nf(V.td)+' m','#fff',10.5,'end');
    var kick=null,loss=null;for(d=100;d<=V.td;d+=50){if(V.mw<pore(d)+V.mg&&kick==null)kick=d;if(eff>frac(d)&&loss==null)loss=d}
    var ok=[];for(d=100;d<=V.td;d+=50){if(V.mw>=pore(d)+V.mg&&eff<=frac(d))ok.push(d)}
    var s='Lodo '+nf(V.mw,2)+' sg (ECD '+nf(eff,2)+' sg). ';
    if(kick!=null)s+='<strong style="color:'+RD+'">Riesgo de influjo (kick) desde ~'+nf(kick)+' m</strong>: el lodo no supera la presión de poro más el margen. ';
    if(loss!=null)s+='<strong style="color:'+RD+'">Riesgo de pérdidas/fractura desde ~'+nf(loss)+' m</strong>: el ECD supera el gradiente de fractura. ';
    if(kick==null&&loss==null)s+='<strong style="color:'+GN+'">Dentro de la ventana hasta '+nf(V.td)+' m.</strong> ';
    else s+='<br>Con un solo peso de lodo no se llega al objetivo: hay que <strong>asentar cañería</strong> antes del punto crítico y cambiar la densidad.';
    h.out(s)}
  draw(h.V)};

/* ===== ESQUEMA DE POZO / BARRERAS ===== */
W.well=function(box,p,api){var h=mkui(box,[{k:'bar',l:'Mostrar barreras de seguridad',t:'chk',v:p.bar!==false}],draw,{side:true,w:600,h:400,touch:api.touch}),svg=h.svg;
  var cs=[['Conductor 30"',0,60,'#8ea2bd','Evita el lavado superficial y soporta el cabezal inicial.'],['Superficial 20"',0,500,'#7aa7ff','Protege acuíferos y da resistencia para el BOP. Cementada hasta superficie.'],['Intermedia 13⅜"',0,2000,GN,'Aísla zonas de pérdidas o de presión anormal. Permite aumentar la densidad del lodo.'],['Producción 9⅝"',0,3500,AM,'Aísla el reservorio y es la barrera de largo plazo del pozo.']];
  var info=null;function draw(V){svg.innerHTML='';sv('rect',{width:600,height:400,fill:'rgba(10,30,50,.5)'},svg);var cx=200,y0=58,sc=320/3600;lbl(svg,10,14,'Arquitectura de pozo (esquema genérico, sin escala exacta)',TX,10);
    sv('rect',{x:0,y:y0,width:600,height:8,fill:'#8b6b3d'},svg);
    cs.forEach(function(c,i){var w=130-i*26,y1=y0+c[2]*sc;sv('rect',{x:cx-w/2,y:y0,width:w,height:y1-y0,fill:'none',stroke:c[3],'stroke-width':3},svg);sv('rect',{x:cx-w/2-5,y:y0+(i?cs[i][2]*sc*.45:0),width:5,height:y1-y0-(i?cs[i][2]*sc*.45:0),fill:'#c9c3b5',opacity:.8},svg);sv('rect',{x:cx+w/2,y:y0+(i?cs[i][2]*sc*.45:0),width:5,height:y1-y0-(i?cs[i][2]*sc*.45:0),fill:'#c9c3b5',opacity:.8},svg);
      var g=sv('g',{tabindex:0,style:'cursor:pointer'},svg);sv('line',{x1:cx+w/2+8,y1:y1,x2:330,y2:y1,stroke:c[3],'stroke-dasharray':'3 3'},g);sv('rect',{x:330,y:y1-14,width:250,height:26,rx:6,fill:c[3],'fill-opacity':.3,stroke:c[3]},g);lbl(g,338,y1+4,c[0]+' · '+nf(c[2])+' m',c[3]==='#8ea2bd'?'#fff':'#fff',11);
      var go=function(){h.out('<strong>'+c[0]+'</strong>: '+c[4])};g.addEventListener('click',go);g.addEventListener('keydown',function(e){if(e.key==='Enter')go()})});
    sv('rect',{x:cx-7,y:y0,width:14,height:3500*sc,fill:'#1a3550',opacity:.9},svg);
    if(V.bar){sv('rect',{x:cx-6,y:y0+(3500-300)*sc,width:12,height:300*sc,fill:RD,opacity:.8},svg);lbl(svg,10,y0+3000*sc,'1.ª barrera:',RD,10.5);lbl(svg,10,y0+3000*sc+13,'columna de lodo',RD,10.5);
      sv('rect',{x:cx-62,y:y0-32,width:124,height:24,rx:4,fill:AM},svg);lbl(svg,cx,y0-16,'BOP (2.ª barrera)','#0b1a30',11,'middle');lbl(svg,10,y0+1500*sc,'+ cemento de cada',VI,10.5);lbl(svg,10,y0+1500*sc+13,'casing: barrera',VI,10.5);lbl(svg,10,y0+1500*sc+26,'independiente',VI,10.5)}
    h.out(V.bar?'Barreras: el <strong>lodo</strong> (presión hidrostática) y el <strong>BOP</strong>; en terminación, además, el <strong>cemento</strong>. El principio: nunca depender de una sola barrera. Tocá cada cañería para ver su función.':'Tocá cada cañería para ver su función. Activá las barreras para ver qué protege al pozo.')}
  draw(h.V)};

/* ===== CURVA DE RENDIMIENTO / LÍMITE TÉCNICO ===== */
W.perfcurve=function(box,p,api){var h=mkui(box,[{k:'npt',l:'NPT eliminado',min:0,max:100,step:5,v:0,f:function(v){return v+' %'}},{k:'ilt',l:'Tiempo perdido invisible recuperado',min:0,max:100,step:5,v:0,f:function(v){return v+' %'}},{k:'rop',l:'Mejora de ROP',min:0,max:40,step:2,v:0,f:function(v){return '+'+v+' %'}},{k:'cd',l:'Costo diario del equipo',min:60,max:400,step:10,v:180,f:function(v){return nf(v)+' kUSD/d'}}],draw,{side:true,w:640,h:360,touch:api.touch}),svg=h.svg;
  var segs=[['d',4,500],['npt',1.5,0],['d',6,1500],['ilt',2,0],['npt',3,0],['d',7,1500],['ilt',3,0],['npt',2.5,0],['d',5,500],['ilt',4,0],['npt',1,0]];
  function build(V){var t=0,dp=0,pts=[[0,0]],T=[[0,0]];segs.forEach(function(s){var dd=s[1];if(s[0]==='npt')dd*=1-V.npt/100;if(s[0]==='ilt')dd*=1-V.ilt/100;if(s[0]==='d'){dd/=1+V.rop/100;dp+=s[2]}if(dd<=0){return}t+=dd;pts.push([t,dp])});return{pts:pts,tot:t}}
  function draw(V){svg.innerHTML='';var base=build({npt:0,ilt:0,rop:0}),sc=build(V),tl=0;segs.forEach(function(s){if(s[0]==='d')tl+=s[1]/1.35});
    var P=plot(svg,640,360,{l:52,r:14,t:20,b:44},[0,Math.max(base.tot,sc.tot)*1.05],[0,3500],{yinv:true,xl:'Días',yl:'Profundidad (m)',xf:function(v){return nf(v,0)},yf:function(v){return nf(v)}});
    path(svg,base.pts,P.X,P.Y,'#8ea2bd',2.4,'5 4');path(svg,sc.pts,P.X,P.Y,GN,3.2);
    var tlp=[[0,0],[tl,3500]];path(svg,tlp,P.X,P.Y,AM,2.4,'2 4');lbl(svg,P.X(tl)+6,P.Y(3500)-6,'límite técnico ≈ '+nf(tl,1)+' d',AM,10.5);
    sv('rect',{x:P.m.l+P.w-250,y:P.m.t+8,width:10,height:3,fill:'#8ea2bd'},svg);lbl(svg,P.m.l+P.w-236,P.m.t+13,'pozo real (con NPT y tiempo invisible)',TX,10);sv('rect',{x:P.m.l+P.w-250,y:P.m.t+22,width:10,height:3,fill:GN},svg);lbl(svg,P.m.l+P.w-236,P.m.t+27,'escenario con mejoras',TX,10);
    var saved=base.tot-sc.tot;h.out('Pozo base: <strong>'+nf(base.tot,1)+' días</strong> → escenario: <strong>'+nf(sc.tot,1)+' días</strong> (ahorro '+nf(saved,1)+' d ≈ <strong>'+nf(saved*V.cd)+' kUSD</strong>). Los tramos horizontales son NPT; la pendiente más suave que la del límite técnico es <strong>tiempo perdido invisible</strong>. (Datos sintéticos.)')}
  draw(h.V)};

/* ===== INVENTARIO GEI ===== */
W.ghg=function(box,p,api){var h=mkui(box,[{k:'gw',l:'GWP del metano',t:'sel',o:[['29.8','AR6 · GWP100 = 29,8'],['82.5','AR6 · GWP20 = 82,5']],v:'29.8'},{k:'fl',l:'Gas quemado en antorcha (MMm³/año)',min:0,max:60,step:1,v:12,f:function(v){return v}},{k:'ef',l:'Metano fugitivo (t CH₄/año)',min:0,max:6000,step:100,v:1800,f:function(v){return nf(v)}},{k:'fu',l:'Gas combustible (MMm³/año)',min:0,max:80,step:1,v:30,f:function(v){return v}},{k:'el',l:'Electricidad comprada (GWh/año)',min:0,max:400,step:10,v:120,f:function(v){return v}},{k:'s3',l:'Incluir alcance 3 (uso del petróleo vendido)',t:'chk',v:false}],draw,{side:true,w:640,h:360,touch:api.touch}),svg=h.svg;
  function draw(V){svg.innerHTML='';var gw=+V.gw,efCO2=2.0;
  var flare=V.fl*efCO2*0.98+V.fl*0.612*0.02*gw,fug=V.ef*gw/1000,comb=V.fu*efCO2,elec=V.el*0.35,s3=V.s3?(9000*365*.43/1000):0;
  var bars=[['Combustión (A1)',comb,GN],['Antorcha / flare (A1)',flare,AM],['Metano fugitivo y venteos (A1)',fug,RD],['Electricidad comprada (A2)',elec,BL]];if(V.s3)bars.push(['Uso del petróleo vendido (A3)',s3,VI]);
  var tot=bars.reduce(function(a,b){return a+b[1]},0),mx=Math.max.apply(null,bars.map(function(b){return b[1]}))*1.1||1;
  var P=plot(svg,640,360,{l:190,r:16,t:20,b:44},[0,mx],[0,bars.length],{nx:4,ny:0,xl:'kt CO₂e por año',xf:function(v){return nf(v)}});
  bars.forEach(function(b,i){var y=P.Y(i)+8,w=P.X(b[1])-P.m.l;lbl(svg,6,y+17,b[0],TX,10.5);sv('rect',{x:P.m.l,y:y,width:Math.max(1,w),height:22,rx:5,fill:b[2],'fill-opacity':.9},svg);lbl(svg,P.m.l+Math.max(1,w)+5,y+16,nf(b[1],1),'#fff',10.5)});
  var s12=comb+flare+fug+elec,sh=fug/(s12||1)*100;
  h.out('Alcances 1+2: <strong>'+nf(s12,1)+' kt CO₂e/año</strong>'+(V.s3?' · con alcance 3: '+nf(tot,0)+' kt':'')+'. El metano representa <strong>'+nf(sh,0)+' %</strong> de 1+2 con GWP '+(gw>50?'a 20 años':'a 100 años')+'. Pasá de GWP100 a GWP20 y mirá cuánto pesa el metano. (Factores y volúmenes de ejemplo, no de un yacimiento real.)')}
  draw(h.V)};

/* ===== CURVA MACC ===== */
W.macc=function(box,p,api){var h=mkui(box,[{k:'cp',l:'Precio del carbono',min:0,max:150,step:5,v:40,f:function(v){return nf(v)+' USD/tCO₂e'}},{k:'gp',l:'Precio del gas recuperado',min:0,max:8,step:.5,v:3,f:function(v){return nf(v,1)+' USD/MMBtu'}}],draw,{side:true,w:640,h:360,touch:api.touch}),svg=h.svg;
  var M=[['Detección y reparación de fugas (LDAR)',1.2,6,.9],['Recuperación de gas de antorcha',2.0,18,.9],['Captura de venteos',1.4,10,.8],['Eficiencia en compresión',1.0,14,.4],['Electrificación de equipos',2.2,45,0],['Energía solar en instalaciones',1.5,60,0],['CCS en planta de gas',3.0,85,0],['Reemplazo de motores ineficientes',.8,28,.3]];
  function draw(V){svg.innerHTML='';var arr=M.map(function(m){return{n:m[0],q:m[1],c:m[2]-m[3]*V.gp*5.2,g:m[3]}}).sort(function(a,b){return a.c-b.c}),tq=arr.reduce(function(a,b){return a+b.q},0);
    var P=plot(svg,640,360,{l:52,r:14,t:22,b:44},[0,tq],[-20,100],{xl:'Abatimiento acumulado (MtCO₂e/año)',yl:'Costo marginal (USD/tCO₂e)',xf:function(v){return nf(v,1)},yf:function(v){return nf(v)}});
    var x=0,done=0,cost=0;arr.forEach(function(m,i){var x1=P.X(x),x2=P.X(x+m.q),y0=P.Y(0),y1=P.Y(m.c),ok=m.c<=V.cp;if(ok){done+=m.q;cost+=m.q*m.c}
      sv('rect',{x:x1+.5,y:Math.min(y0,y1),width:Math.max(1,x2-x1-1),height:Math.abs(y1-y0)||1,fill:ok?GN:'#8ea2bd','fill-opacity':ok?.9:.5},svg);
      if(x2-x1>30)sv('text',{x:(x1+x2)/2,y:Math.min(y0,y1)-4,'text-anchor':'middle',fill:'#fff','font-size':9},svg,String(i+1));x+=m.q});
    sv('line',{x1:P.m.l,x2:P.m.l+P.w,y1:P.Y(V.cp),y2:P.Y(V.cp),stroke:AM,'stroke-width':2,'stroke-dasharray':'6 4'},svg);lbl(svg,P.m.l+P.w-4,P.Y(V.cp)-5,'precio del carbono',AM,10.5,'end');
    var names=arr.map(function(m,i){return(i+1)+'. '+m.n+' ('+nf(m.c)+')'}).join(' · ');
    h.out('Medidas bajo el precio del carbono: <strong>'+nf(done,1)+' de '+nf(tq,1)+' MtCO₂e/año</strong> ('+nf(done/tq*100,0)+' %). Subí el precio del gas y las medidas que recuperan gas se abaratan, algunas con costo negativo. <span style="opacity:.8;font-size:.9em">'+names+'</span> (valores de ejemplo.)')}
  draw(h.V)};

/* ===== CADENA CCS Y ENTRAMPAMIENTO ===== */
W.ccs=function(box,p,api){var h=mkui(box,[{k:'t',l:'Tiempo desde el inicio de la inyección',min:0,max:1000,step:10,v:p.t||100,f:function(v){return nf(v)+' años'}}],draw,{side:true,w:640,h:380,touch:api.touch}),svg=h.svg;
  function draw(V){svg.innerHTML='';sv('rect',{x:0,y:0,width:640,height:380,fill:'rgba(10,30,50,.5)'},svg);var t=V.t,mi=.15*(1-Math.exp(-t/800)),so=.35*(1-Math.exp(-t/300)),re=.3*(1-Math.exp(-t/80)),st=Math.max(0,1-mi-so-re);
    var blocks=[['Emisor|(planta de gas)',20,'#8ea2bd'],['Captura|y separación',112,'#17755A'],['Compresión|y deshidratación',204,'#2b6cb0'],['Transporte|(ducto / buque)',296,'#b7791f'],['Inyección|(pozo)',388,'#b3414a']];
    blocks.forEach(function(b,i){sv('rect',{x:b[1],y:14,width:84,height:40,rx:8,fill:b[2],'fill-opacity':.5,stroke:b[2]},svg);b[0].split('|').forEach(function(s,j){lbl(svg,b[1]+42,31+j*12,s,'#fff',9.5,'middle')});if(i<4)sv('path',{d:'M'+(b[1]+86)+' 34 h6',stroke:GN,'stroke-width':2},svg)});
    sv('rect',{x:20,y:100,width:420,height:46,fill:'#4a3b27'},svg);lbl(svg,26,128,'Roca sello (lutitas / arcillas)',TX,10.5);sv('rect',{x:20,y:146,width:420,height:110,fill:'#1a4a6e'},svg);lbl(svg,26,242,'Acuífero salino profundo (> 800 m): reservorio de almacenamiento',TX,10.5);sv('rect',{x:20,y:256,width:420,height:40,fill:'#33403a'},svg);lbl(svg,26,280,'Basamento',TX,10.5);
    sv('line',{x1:430,y1:54,x2:430,y2:220,stroke:'#fff','stroke-width':3},svg);sv('path',{d:'M424 54 h12',stroke:'#fff','stroke-width':3},svg);
    var rad=18+120*Math.min(1,t/500),pl=sv('ellipse',{cx:430-rad*.35,cy:176,rx:rad,ry:Math.min(26,10+rad*.18),fill:AM,'fill-opacity':.7},svg);lbl(svg,300,174,'pluma de CO₂',AM,10.5,'middle');
    var rows=[['Estructural/estratigráfico',st,'#8ea2bd'],['Residual (capilar)',re,BL],['Disolución',so,GN],['Mineral',mi,VI]],yy=318;lbl(svg,20,yy,'Fracción atrapada por mecanismo (ilustrativa)',TX,10.5);var x=20;
    rows.forEach(function(r){var w=r[1]*420;sv('rect',{x:x,y:yy+6,width:Math.max(0,w),height:20,fill:r[2]},svg);if(w>40)lbl(svg,x+w/2,yy+20,nf(r[1]*100,0)+' %','#0b1a30',10,'middle');x+=w});
    rows.forEach(function(r,i){sv('rect',{x:460,y:110+i*22,width:11,height:11,fill:r[2]},svg);lbl(svg,476,120+i*22,r[0],TX,10.5)});
    h.out('A los <strong>'+nf(t)+' años</strong>: estructural '+nf(st*100,0)+' % · residual '+nf(re*100,0)+' % · disolución '+nf(so*100,0)+' % · mineral '+nf(mi*100,0)+' %. La seguridad <strong>mejora con el tiempo</strong> a medida que el CO₂ pasa de estar "libre" a inmovilizado. Proporciones cualitativas (IPCC, 2005): dependen de cada formación.')}
  draw(h.V)};


/* ===== PRUEBAS DE POZO: solución analítica radial con almacenamiento y daño (Laplace + Stehfest) ===== */
function fact(n){var r=1;for(var i=2;i<=n;i++)r*=i;return r}
var SV=(function(N){var v=[],i,k,s;for(i=1;i<=N;i++){s=0;for(k=Math.floor((i+1)/2);k<=Math.min(i,N/2);k++)s+=Math.pow(k,N/2)*fact(2*k)/(fact(N/2-k)*fact(k)*fact(k-1)*fact(i-k)*fact(2*k-i));v[i]=Math.pow(-1,i+N/2)*s}return v})(12);
function bk(x){var y,t,z,I0,I1,K0,K1;if(x<=2){y=x*x/4;t=x/3.75;t*=t;I0=1+3.5156229*t+3.0899424*t*t+1.2067492*Math.pow(t,3)+.2659732*Math.pow(t,4)+.0360768*Math.pow(t,5)+.0045813*Math.pow(t,6);I1=x*(.5+.87890594*t+.51498869*t*t+.15084934*Math.pow(t,3)+.02658733*Math.pow(t,4)+.00301532*Math.pow(t,5)+.00032411*Math.pow(t,6));
  K0=-Math.log(x/2)*I0+(-.57721566+.4227842*y+.23069756*y*y+.0348859*Math.pow(y,3)+.00262698*Math.pow(y,4)+.0001075*Math.pow(y,5)+.0000074*Math.pow(y,6));
  K1=Math.log(x/2)*I1+(1/x)*(1+.15443144*y-.67278579*y*y-.18156897*Math.pow(y,3)-.01919402*Math.pow(y,4)-.00110404*Math.pow(y,5)-.00004686*Math.pow(y,6))}
 else{z=2/x;var e=Math.exp(-x)/Math.sqrt(x);K0=e*(1.25331414-.07832358*z+.02189568*z*z-.01062446*Math.pow(z,3)+.00587872*Math.pow(z,4)-.0025154*Math.pow(z,5)+.00053208*Math.pow(z,6));
  K1=e*(1.25331414+.23498619*z-.0365562*z*z+.01504268*Math.pow(z,3)-.00780353*Math.pow(z,4)+.00325614*Math.pow(z,5)-.00068245*Math.pow(z,6))}
 return[K0,K1]}
function pD(td,cd,S){var s,r,b,a,n=0,i,ln2=Math.LN2/td;for(i=1;i<=12;i++){s=i*ln2;r=Math.sqrt(s);b=bk(r);a=(b[0]+S*r*b[1])/(s*(r*b[1]+cd*s*(b[0]+S*r*b[1])));n+=SV[i]*a}return n*ln2}
W.pta=function(box,p,api){var h=mkui(box,[{k:'k',l:'Permeabilidad k',min:1,max:200,step:1,v:p.k||20,f:function(v){return nf(v)+' md'}},{k:'s',l:'Daño (skin) S',min:-3,max:15,step:.5,v:p.s!=null?p.s:3,f:function(v){return nf(v,1)}},{k:'c',l:'Almacenamiento C',min:.001,max:.2,step:.001,v:p.c||.02,f:function(v){return nf(v,3)+' bbl/psi'}}],draw,{side:true,w:640,h:360,touch:api.touch}),svg=h.svg;
  var q=500,B=1.2,mu=1,H=50,phi=.15,ct=1e-5,rw=.3;
  function draw(V){svg.innerHTML='';var cd=.8936*V.c/(phi*ct*H*rw*rw),f=141.2*q*B*mu/(V.k*H),a=[],d=[],i,t,td,x=.0002637*V.k/(phi*mu*ct*rw*rw),e=.02,ymin=1e9,ymax=0;
    for(i=0;i<=60;i++){t=Math.pow(10,-2+5*i/60);td=x*t;var p0=pD(td,cd,V.s),dd=(pD(td*Math.exp(e),cd,V.s)-pD(td*Math.exp(-e),cd,V.s))/(2*e);a.push([Math.log10(t),f*p0]);d.push([Math.log10(t),Math.max(f*dd,1e-6)])}
    a.concat(d).forEach(function(z){var y=z[1];if(y>1e-3&&y<ymin)ymin=y;if(y>ymax)ymax=y});
    var lo=Math.floor(Math.log10(Math.max(ymin,1e-2))),hi=Math.ceil(Math.log10(ymax));if(hi-lo<2)hi=lo+2;
    var P=plot(svg,640,360,{l:56,r:16,t:20,b:44},[-2,3],[lo,hi],{nx:5,ny:hi-lo,xl:'Tiempo (h)',yl:'Δp y derivada (psi)',xf:function(v){var z=Math.pow(10,v);return z<1?nf(z,2):nf(z)},yf:function(v){var z=Math.pow(10,v);return z<1?nf(z,2):nf(z)}});
    var Y=function(v){return P.Y(Math.log10(Math.max(v,Math.pow(10,lo))))};
    path(svg,a,P.X,Y,BL,2.4);path(svg,d,P.X,Y,AM,2.4);
    var m=f*.5;sv('line',{x1:P.m.l,x2:P.m.l+P.w,y1:Y(m),y2:Y(m),stroke:GN,'stroke-width':1.2,'stroke-dasharray':'5 4'},svg);lbl(svg,P.m.l+P.w-4,Y(m)-5,'meseta radial = 70,6·q·B·μ/(k·h)',GN,10,'end');
    sv('rect',{x:P.m.l+8,y:P.m.t+6,width:10,height:3,fill:BL},svg);lbl(svg,P.m.l+22,P.m.t+11,'Δp (cambio de presión)',TX,10);sv('rect',{x:P.m.l+8,y:P.m.t+20,width:10,height:3,fill:AM},svg);lbl(svg,P.m.l+22,P.m.t+25,'derivada (dΔp / d ln t)',TX,10);
    var tend=1000,pe=f*pD(x*tend,cd,V.s),de=f*(pD(x*tend*Math.exp(e),cd,V.s)-pD(x*tend*Math.exp(-e),cd,V.s))/(2*e),kest=70.6*q*B*mu/(H*de),ts=(60+3.5*V.s)*cd/x;
    var okr=Math.abs(de/m-1)<.06;
    h.out('Almacenamiento: la pendiente unitaria del inicio dura unas <strong>'+nf(ts<1000?ts:1000,1)+' h</strong> (efecto del almacenamiento del pozo). '+(okr?'La derivada llegó a la <strong>meseta de flujo radial</strong>: k leída = <strong>'+nf(kest,1)+' md</strong> (real '+V.k+').':'<strong style="color:'+RD+'">No se alcanzó el flujo radial</strong> en 1000 h: no se puede leer k de la meseta. Hace falta una prueba más larga o menos almacenamiento.')+' El <strong>daño</strong> separa la curva de Δp de la derivada: a mayor S, más distancia entre ambas. (Modelo homogéneo radial infinito, datos de ejemplo.)')}
  draw(h.V)};

/* ===== ANÁLISIS NODAL: IPR (Vogel) + VLP simplificada ===== */
W.nodal=function(box,p,api){var h=mkui(box,[{k:'pr',l:'Presión de reservorio',min:120,max:350,step:5,v:p.pr||250,f:function(v){return v+' bar'}},{k:'j',l:'Índice de productividad J',min:.3,max:4,step:.1,v:p.j||1.5,f:function(v){return nf(v,1)+' m³/d/bar'}},{k:'wc',l:'Corte de agua',min:0,max:95,step:5,v:p.wc||0,f:function(v){return v+' %'}},{k:'pw',l:'Presión en boca de pozo',min:5,max:40,step:1,v:p.pw||10,f:function(v){return v+' bar'}},{k:'gl',l:'Gas inyectado (gas lift)',min:0,max:400,step:10,v:p.gl||0,f:function(v){return v+' m³/m³'}},{k:'d',l:'Diámetro de tubing',t:'sel',o:[['2.375','2⅜"'],['2.875','2⅞"'],['3.5','3½"'],['4.5','4½"']],v:p.d||'3.5'}],draw,{side:true,w:640,h:360,touch:api.touch}),svg=h.svg;
  var HH=2000;
  function ipr(V,qq){var qm=V.j*V.pr/1.8,r=qq/qm;if(r>=1)return 0;return V.pr*(-.2+Math.sqrt(.04+3.2*(1-r)))/1.6}
  function vlp(V,qq){var rl=800*(1-V.wc/100)+1030*V.wc/100,fg=1-.55*V.gl/(V.gl+150),hs=rl*fg*9.81*HH/1e5,fr=5*Math.pow(qq/200,1.8)*Math.pow(3.5/+V.d,4.8);return V.pw+hs+fr}
  function draw(V){svg.innerHTML='';var qm=V.j*V.pr/1.8,xr=[0,Math.max(100,Math.ceil(qm/50)*50)],P=plot(svg,640,360,{l:52,r:16,t:20,b:44},xr,[0,Math.ceil(V.pr/50)*50],{nx:5,ny:5,xl:'Caudal de líquido (m³/d)',yl:'Presión de fondo fluyente (bar)'}),a=[],b=[],q;
    for(q=0;q<=qm;q+=qm/60)a.push([q,ipr(V,q)]);for(q=0;q<=xr[1];q+=xr[1]/60)b.push([q,Math.min(vlp(V,q),xr[1]>0?Math.ceil(V.pr/50)*50:1)]);
    path(svg,a,P.X,P.Y,GN,2.8);path(svg,b,P.X,P.Y,AM,2.8);lbl(svg,P.X(qm*.2),P.Y(ipr(V,qm*.2))-8,'IPR (Vogel)',GN,10.5);lbl(svg,P.X(xr[1]*.8),P.Y(Math.min(vlp(V,xr[1]*.8),V.pr))-8,'VLP (tubing)',AM,10.5);
    var op=null,prev=null;for(q=0;q<=qm;q+=qm/600){var df=ipr(V,q)-vlp(V,q);if(prev!==null&&prev>=0&&df<0){op=q;break}prev=df}
    if(op!=null){var pf=ipr(V,op);sv('circle',{cx:P.X(op),cy:P.Y(pf),r:6,fill:'#fff',stroke:RD,'stroke-width':2.4},svg);lbl(svg,P.X(op)+9,P.Y(pf)+20,'operación: '+nf(op)+' m³/d',RD,10.5);
      h.out('Punto de operación: <strong>'+nf(op)+' m³/d</strong> con Pwf = <strong>'+nf(pf)+' bar</strong> ('+nf(op*(1-V.wc/100))+' m³/d de petróleo). Más gas baja el gradiente y sube el caudal hasta que domina la fricción; el agua hace lo contrario. (Modelo didáctico, no reemplaza a un simulador multifásico.)')}
    else h.out('<strong style="color:'+RD+'">El pozo no surge</strong>: la presión necesaria en el fondo para levantar la columna supera la que da el reservorio. Hace falta <strong>levantamiento artificial</strong> (gas lift, bombeo mecánico, ESP) o reducir la columna de fluido. Probá inyectar gas o bajar el agua.')}
  draw(h.V)};

/* ===== NO CONVENCIONALES: declinación hiperbólica modificada ===== */
W.shale=function(box,p,api){var h=mkui(box,[{k:'qi',l:'Caudal inicial qi',min:300,max:3000,step:50,v:p.qi||1200,f:function(v){return nf(v)+' bbl/d'}},{k:'di',l:'Declinación inicial Di',min:50,max:95,step:1,v:p.di||75,f:function(v){return v+' %/año'}},{k:'b',l:'Exponente b',min:.6,max:2,step:.05,v:p.b!=null?p.b:1.5,f:function(v){return nf(v,2)}},{k:'dm',l:'Declinación terminal Dmin',min:3,max:15,step:1,v:p.dm||6,f:function(v){return v+' %/año'}}],draw,{side:true,w:640,h:360,touch:api.touch}),svg=h.svg;
  function draw(V){svg.innerHTML='';var di=V.di/100,dm=V.dm/100,b=V.b,ts=Math.max(0,(di/dm-1)/(b*di)),T=30;
    function qh(t){return V.qi/Math.pow(1+b*di*t,1/b)}function qm(t){if(t<=ts)return qh(t);var qs=qh(ts);return qs*Math.exp(-dm*(t-ts))}
    var P=plot(svg,640,360,{l:52,r:16,t:20,b:44},[0,T],[Math.log10(5),Math.log10(Math.max(V.qi*1.2,20))],{nx:6,ny:3,xl:'Tiempo (años)',yl:'Caudal (bbl/d), escala log',yf:function(v){return nf(Math.pow(10,v))},xf:function(v){return v}}),a=[],c=[],t,eh=0,em=0,dt=1/12;
    for(t=0;t<=T;t+=dt){var y1=qh(t),y2=qm(t);a.push([t,Math.log10(Math.max(y1,5))]);c.push([t,Math.log10(Math.max(y2,5))]);eh+=y1*30.4*dt*12/12;em+=y2*30.4*dt*12/12}
    eh=0;em=0;for(t=0;t<T;t+=dt){eh+=qh(t)*30.4;em+=qm(t)*30.4}
    path(svg,a,P.X,P.Y,BL,1.6,'5 4');path(svg,c,P.X,P.Y,AM,3);sv('rect',{x:P.m.l+8,y:P.m.t+6,width:10,height:3,fill:AM},svg);lbl(svg,P.m.l+22,P.m.t+11,'hiperbólica modificada (con Dmin)',TX,10);sv('rect',{x:P.m.l+8,y:P.m.t+20,width:10,height:3,fill:BL},svg);lbl(svg,P.m.l+22,P.m.t+25,'hiperbólica pura (sin Dmin)',TX,10);
    if(ts<T){sv('line',{x1:P.X(ts),x2:P.X(ts),y1:P.m.t,y2:P.m.t+P.h,stroke:GN,'stroke-width':1.2,'stroke-dasharray':'4 4'},svg);lbl(svg,P.X(ts)+4,P.m.t+P.h-8,'pasa a declinación terminal: '+nf(ts,1)+' años',GN,10)}
    h.out('EUR a '+T+' años: <strong>'+nf(em/1000,0)+' Mbbl</strong> con declinación terminal vs. <strong>'+nf(eh/1000,0)+' Mbbl</strong> con la hiperbólica pura ('+nf((eh/em-1)*100,0)+' % más). Con <strong>b &gt; 1</strong> y sin una declinación mínima, el pronóstico sobreestima el volumen: por eso la práctica de reservas usa el modelo modificado. (Ejemplo didáctico, no un pozo real.)')}
  draw(h.V)};

/* ===== ECONOMÍA: tornado de sensibilidades ===== */
W.tornado=function(box,p,api){var h=mkui(box,[{k:'r',l:'Variación de cada variable (±)',min:5,max:40,step:5,v:p.r||20,f:function(v){return '±'+v+' %'}},{k:'pr',l:'Precio base del crudo',min:35,max:110,step:5,v:p.pr||65,f:function(v){return v+' USD/bbl'}}],draw,{side:true,w:640,h:360,touch:api.touch}),svg=h.svg;
  function npv(o){var s=0,m,t,q;for(m=1;m<=120;m++){t=m/12;q=o.qi/(1+o.di*t);var ml=q*30.4*(o.pr*(1-.12)-o.ov)-o.of;s+=ml/Math.pow(1+o.rt,t)}return(s-o.cx)/1e6}
  function draw(V){svg.innerHTML='';var base={qi:900,di:.7,pr:V.pr,ov:8,of:8000,cx:9e6,rt:.1},n0=npv(base),r=V.r/100,items=[['Precio',function(k){var o=Object.assign({},base);o.pr*=1+k;return o}],['Producción inicial (qi)',function(k){var o=Object.assign({},base);o.qi*=1+k;return o}],['CAPEX',function(k){var o=Object.assign({},base);o.cx*=1+k;return o}],['Costos operativos',function(k){var o=Object.assign({},base);o.ov*=1+k;o.of*=1+k;return o}],['Declinación (Di)',function(k){var o=Object.assign({},base);o.di*=1+k;return o}],['Tasa de descuento',function(k){var o=Object.assign({},base);o.rt*=1+k;return o}]],
      rows=items.map(function(it){var a=npv(it[1](-r)),b=npv(it[1](r));return{n:it[0],lo:Math.min(a,b),hi:Math.max(a,b),sw:Math.abs(a-b)}}).sort(function(x,y){return y.sw-x.sw}),mn=Math.min.apply(null,rows.map(function(x){return x.lo}).concat([n0])),mx=Math.max.apply(null,rows.map(function(x){return x.hi}).concat([n0])),pad=(mx-mn)*.08,xr=[mn-pad,mx+pad];
    var P=plot(svg,640,360,{l:150,r:20,t:20,b:44},xr,[0,1],{nx:5,ny:0,xl:'VPN (MUSD)',xf:function(v){return nf(v,0)}}),bh=P.h/rows.length*.62;
    rows.forEach(function(r0,i){var y=P.m.t+i*P.h/rows.length+(P.h/rows.length-bh)/2;sv('rect',{x:P.X(r0.lo),y:y,width:Math.max(1,P.X(r0.hi)-P.X(r0.lo)),height:bh,fill:i===0?AM:BL,'fill-opacity':.85},svg);lbl(svg,P.m.l-8,y+bh/2+4,r0.n,TX,11,'end');lbl(svg,P.X(r0.lo)-3,y+bh/2+4,nf(r0.lo,1),TX,9.5,'end');lbl(svg,P.X(r0.hi)+3,y+bh/2+4,nf(r0.hi,1),TX,9.5)});
    sv('line',{x1:P.X(n0),x2:P.X(n0),y1:P.m.t,y2:P.m.t+P.h,stroke:GN,'stroke-width':1.6},svg);lbl(svg,P.X(n0)+4,P.m.t+12,'caso base '+nf(n0,1),GN,10.5);
    var neg=rows.filter(function(x){return x.lo<0});
    h.out('VPN base (10 %): <strong>'+nf(n0,1)+' MUSD</strong>. La variable que más mueve el resultado es <strong>'+rows[0].n.toLowerCase()+'</strong> (rango de '+nf(rows[0].sw,1)+' MUSD). '+(neg.length?'<strong style="color:'+RD+'">'+neg.map(function(x){return x.n.toLowerCase()}).join(', ')+'</strong>: con esa variación el proyecto deja de ser rentable.':'Con esta variación el proyecto sigue siendo rentable en todos los casos.')+' (Pozo de ejemplo: 120 meses, regalías 12 %.)')}
  draw(h.V)};

/* ===== ECONOMÍA: decisión bajo incertidumbre (VME) y portafolio ===== */
W.emv=function(box,p,api){var h=mkui(box,[{k:'pg',l:'Probabilidad de éxito',min:5,max:80,step:1,v:p.pg||25,f:function(v){return v+' %'}},{k:'v',l:'VPN si hay éxito',min:20,max:300,step:5,v:p.v||120,f:function(v){return v+' MUSD'}},{k:'c',l:'Costo si es seco',min:5,max:60,step:1,v:p.c||20,f:function(v){return v+' MUSD'}},{k:'n',l:'Pozos del portafolio',min:1,max:30,step:1,v:p.n||1,f:function(v){return v}}],draw,{side:true,w:640,h:360,touch:api.touch}),svg=h.svg;
  function binom(n,k){var r=1,i;for(i=1;i<=k;i++)r=r*(n-k+i)/i;return r}
  function draw(V){svg.innerHTML='';var pg=V.pg/100,emv=pg*V.v-(1-pg)*V.c,be=V.c/(V.v+V.c),pl=0,k;
    for(k=0;k<=V.n;k++){if(k*V.v-(V.n-k)*V.c<0)pl+=binom(V.n,k)*Math.pow(pg,k)*Math.pow(1-pg,V.n-k)}
    sv('rect',{x:0,y:0,width:640,height:360,fill:'rgba(10,30,50,.5)'},svg);
    sv('circle',{cx:60,cy:110,r:16,fill:AM},svg);lbl(svg,60,114,'D',' #0b1a30'.trim(),12,'middle');lbl(svg,60,140,'Perforar',TX,10.5,'middle');
    [[0,'Éxito',pg,V.v,GN],[1,'Seco',1-pg,-V.c,RD]].forEach(function(b){var y=60+b[0]*100;sv('line',{x1:76,y1:110,x2:200,y2:y,stroke:b[4],'stroke-width':2},svg);lbl(svg,138,(110+y)/2-6,nf(b[2]*100,0)+' %',b[4],11,'middle');sv('rect',{x:200,y:y-18,width:130,height:36,rx:7,fill:b[4],'fill-opacity':.3,stroke:b[4]},svg);lbl(svg,265,y-2,b[1],'#fff',11,'middle');lbl(svg,265,y+12,(b[3]>0?'+':'')+nf(b[3])+' MUSD','#fff',11,'middle')});
    lbl(svg,20,196,'VME = P·VPN − (1−P)·Costo = '+nf(emv,1)+' MUSD',emv>=0?GN:RD,12);lbl(svg,20,214,'Probabilidad de equilibrio (VME = 0): '+nf(be*100,1)+' %',TX,11);
    var P=plot(svg,640,360,{l:380,r:16,t:30,b:60},[0,80],[-V.c*1.1,Math.max(V.v*.8,10)],{nx:4,ny:4,xl:'Probabilidad de éxito (%)',yl:'VME (MUSD)',xf:function(v){return nf(v)}});
    path(svg,[[0,-V.c],[80,.8*V.v-.2*V.c]],P.X,P.Y,BL,2.4);sv('line',{x1:P.m.l,x2:P.m.l+P.w,y1:P.Y(0),y2:P.Y(0),stroke:'#fff','stroke-opacity':.5},svg);sv('circle',{cx:P.X(V.pg),cy:P.Y(emv),r:6,fill:'#fff',stroke:AM,'stroke-width':2.4},svg);
    h.out('Un pozo: <strong>VME = '+nf(emv,1)+' MUSD</strong>. Pero un solo pozo se gana o se pierde entero: con <strong>'+V.n+'</strong> pozo'+(V.n>1?'s':'')+' independientes la probabilidad de terminar con pérdida es <strong>'+nf(pl*100,0)+' %</strong>. El VME vale como regla para un <strong>portafolio</strong>; para el pozo individual hay que mirar también cuánto se puede perder. (Ejemplo con pozos independientes e igual probabilidad.)')}
  draw(h.V)};

/* ===== DATOS: detección de valores atípicos en series de producción ===== */
W.qcout=function(box,p,api){var h=mkui(box,[{k:'m',l:'Método',t:'sel',o:[['z','Z-score clásico (media y desvío)'],['mad','Mediana y MAD global'],['rol','Mediana móvil de 7 días + MAD']],v:p.m||'z'},{k:'k',l:'Umbral (en desvíos robustos)',min:1.5,max:6,step:.5,v:p.k||3,f:function(v){return nf(v,1)}}],draw,{side:true,w:640,h:360,touch:api.touch}),svg=h.svg;
  var r=rng(11),N=90,x=[],y=[],bad={12:0,27:1650,40:0,55:1700,61:210,70:1500,83:0},i;
  for(i=0;i<N;i++){x.push(i);y.push(850*Math.exp(-.012*i)+gauss(r)*14)}Object.keys(bad).forEach(function(k){y[+k]=bad[k]});
  function med(a){var s=a.slice().sort(function(u,v){return u-v}),m=Math.floor(s.length/2);return s.length%2?s[m]:(s[m-1]+s[m])/2}
  function draw(V){svg.innerHTML='';var fl=[],sc=[],i,res=[];
    if(V.m==='z'){var mu=y.reduce(function(a,b){return a+b},0)/N,sd=Math.sqrt(y.reduce(function(a,b){return a+(b-mu)*(b-mu)},0)/N);y.forEach(function(v,i){sc[i]=Math.abs(v-mu)/sd})}
    else if(V.m==='mad'){var m0=med(y),mad=1.4826*med(y.map(function(v){return Math.abs(v-m0)}));y.forEach(function(v,i){sc[i]=Math.abs(v-m0)/mad})}
    else{for(i=0;i<N;i++){var w=y.slice(Math.max(0,i-3),Math.min(N,i+4));res[i]=y[i]-med(w)}var r0=med(res),sm=1.4826*med(res.map(function(v){return Math.abs(v-r0)}));res.forEach(function(v,i){sc[i]=Math.abs(v-r0)/sm})}
    for(i=0;i<N;i++)fl[i]=sc[i]>V.k;
    var P=plot(svg,640,360,{l:52,r:16,t:20,b:44},[0,N],[0,1900],{nx:6,ny:4,xl:'Día',yl:'Caudal (bbl/d)'}),tp=0,fp=0,fn=0;
    for(i=0;i<N;i++){var isb=bad.hasOwnProperty(i),f=fl[i];if(f&&isb)tp++;else if(f)fp++;else if(isb)fn++;
      sv('circle',{cx:P.X(i),cy:P.Y(y[i]),r:f?5:3,fill:f?RD:BL,'fill-opacity':f?1:.8,stroke:isb?'#fff':'none','stroke-width':1.2},svg)}
    lbl(svg,P.m.l+8,P.m.t+14,'rojo = marcado como atípico · borde blanco = dato erróneo real',TX,10);
    h.out('Detectó <strong>'+tp+' de 7</strong> datos erróneos, con <strong>'+fp+'</strong> falsas alarmas y <strong>'+fn+'</strong> sin detectar. '+(V.m==='z'?'El z-score usa la media y el desvío, que los propios errores inflan: <strong>los enmascaran</strong> y marca la declinación normal.':V.m==='mad'?'La mediana y el MAD resisten a los errores, pero la <strong>tendencia</strong> de declinación sigue sobrando: marca los extremos de la curva.':'Al comparar con la mediana móvil se <strong>descuenta la tendencia</strong> y solo queda el ruido y los errores: es lo que se usa en la práctica.')+' (Serie sintética de ejemplo.)')}
  draw(h.V)};

/* ===== DATOS: sobreajuste (polinomios) ===== */
W.mlfit=function(box,p,api){var h=mkui(box,[{k:'dg',l:'Complejidad del modelo (grado)',min:1,max:10,step:1,v:p.dg||3,f:function(v){return v}},{k:'lm',l:'Regularización (ridge)',min:0,max:.05,step:.001,v:p.lm||0,f:function(v){return nf(v,3)}}],draw,{side:true,w:640,h:360,touch:api.touch}),svg=h.svg;
  var r=rng(5),tr=[],te=[],i,fx=function(x){return .5+.35*Math.sin(2*Math.PI*x*.9)};
  for(i=0;i<14;i++){var x=r();tr.push([x,fx(x)+gauss(r)*.07])}for(i=0;i<40;i++){var x2=r();te.push([x2,fx(x2)+gauss(r)*.07])}
  function fit(d,lm){var n=d+1,A=[],b=[],i,j,k;for(i=0;i<n;i++){A[i]=[];b[i]=0;for(j=0;j<n;j++)A[i][j]=0}
    tr.forEach(function(pt){var u=2*pt[0]-1,pw=[],k2;for(k2=0;k2<n;k2++)pw[k2]=Math.pow(u,k2);for(i=0;i<n;i++){b[i]+=pw[i]*pt[1];for(j=0;j<n;j++)A[i][j]+=pw[i]*pw[j]}});
    for(i=1;i<n;i++)A[i][i]+=lm*tr.length;
    for(i=0;i<n;i++){var mx=i;for(k=i+1;k<n;k++)if(Math.abs(A[k][i])>Math.abs(A[mx][i]))mx=k;var t=A[i];A[i]=A[mx];A[mx]=t;t=b[i];b[i]=b[mx];b[mx]=t;if(Math.abs(A[i][i])<1e-12)A[i][i]=1e-12;for(k=i+1;k<n;k++){var f=A[k][i]/A[i][i];for(j=i;j<n;j++)A[k][j]-=f*A[i][j];b[k]-=f*b[i]}}
    var c=[];for(i=n-1;i>=0;i--){var s=b[i];for(j=i+1;j<n;j++)s-=A[i][j]*c[j];c[i]=s/A[i][i]}return c}
  function ev(c,x){var u=2*x-1,s=0,k;for(k=0;k<c.length;k++)s+=c[k]*Math.pow(u,k);return s}
  function rm(c,set){return Math.sqrt(set.reduce(function(a,p2){var e=ev(c,p2[0])-p2[1];return a+e*e},0)/set.length)}
  function draw(V){svg.innerHTML='';var c=fit(V.dg,V.lm),P=plot(svg,640,360,{l:46,r:16,t:20,b:44},[0,1],[-.2,1.3],{nx:5,ny:5,xl:'Variable de entrada (normalizada)',yl:'Salida'}),a=[],u,bestD=1,bestE=1e9,d;
    for(u=0;u<=1.0001;u+=.01)a.push([u,Math.max(-.2,Math.min(1.3,ev(c,u)))]);path(svg,a.map(function(z){return[z[0],fx(z[0])]}),P.X,P.Y,GN,1.4,'5 4');
    te.forEach(function(q){sv('circle',{cx:P.X(q[0]),cy:P.Y(q[1]),r:2.2,fill:'#fff','fill-opacity':.35},svg)});tr.forEach(function(q){sv('circle',{cx:P.X(q[0]),cy:P.Y(q[1]),r:4.2,fill:AM,stroke:'#0b1a30'},svg)});path(svg,a,P.X,P.Y,BL,2.8);
    for(d=1;d<=10;d++){var e=rm(fit(d,V.lm),te);if(e<bestE){bestE=e;bestD=d}}
    var etr=rm(c,tr),ete=rm(c,te);
    lbl(svg,P.m.l+8,P.m.t+14,'naranja = entrenamiento · blanco = prueba (datos no vistos) · verde = relación real',TX,10);
    h.out('Error de <strong>entrenamiento</strong>: '+nf(etr,3)+' · error en <strong>prueba</strong>: <strong>'+nf(ete,3)+'</strong>. '+(ete>etr*1.8&&V.dg>4?'<strong style="color:'+RD+'">Sobreajuste</strong>: el modelo memoriza el ruido de los 14 puntos y falla con datos nuevos. ':V.dg<3?'<strong style="color:'+RD+'">Subajuste</strong>: el modelo es demasiado simple para la relación. ':'')+'Con esta regularización, el mejor grado en prueba es <strong>'+bestD+'</strong>. Subí el grado y después la regularización: el error de entrenamiento nunca avisa del sobreajuste. (Datos sintéticos.)')}
  draw(h.V)};

/* ===== MAPA DE COMPETENCIAS (curso) se dibuja en player.js ===== */
/* ===== AJUSTE HISTÓRICO: balance de materiales con acuífero (no unicidad) ===== */
W.hm=function(box,p,api){var h=mkui(box,[{k:'N',l:'Petróleo original N',min:100,max:800,step:10,v:p.N||250,f:function(v){return nf(v)+' MMbbl'}},{k:'Ca',l:'Fuerza del acuífero Ca',min:0,max:8,step:.1,v:p.Ca!=null?p.Ca:5,f:function(v){return nf(v,1)+' Mbbl/psi'}},{k:'w',t:'chk',l:'Incluir el agua producida en el ajuste',v:false}],draw,{side:true,w:700,h:340,touch:api.touch}),svg=h.svg;
  var ct=1.2e-5,pi=4500,NT=400,CT=3.2,r=rng(5),yrs=[],i,pob=[],wob=[];/* verdad: N=400 MMbbl, Ca=3,2 Mbbl/psi */
  var neffT=NT*ct*1000+CT;/* Mbbl/psi */
  for(i=0;i<=10;i++){var np=1.2*i;yrs.push(i);pob.push(pi-np*1000/neffT+25*gauss(r));wob.push(Math.max(0,CT*(np*1000/neffT)/1000+.12*gauss(r)))}
  function mod(N,Ca,t){var np=1.2*t,ne=N*ct*1000+Ca,dp=np*1000/ne;return{p:pi-dp,w:Ca*dp/1000}}
  function mis(N,Ca,uw){var s=0,i,m;for(i=0;i<=10;i++){m=mod(N,Ca,i);s+=Math.pow((m.p-pob[i])/25,2);if(uw)s+=Math.pow((m.w-wob[i])/.12,2)}return Math.sqrt(s/(uw?22:11))}
  function draw(V){svg.innerHTML='';var uw=V.w,Ng=[],Cg=[],gi,gj,ok=[],cur=mis(V.N,V.Ca,uw);
    var P=plot(svg,700,340,{l:50,r:360,t:22,b:42},[0,20],[2000,4600],{nx:4,ny:4,xl:'Tiempo (años)',yl:'Presión (psi)',xf:function(v){return nf(v)},yf:function(v){return nf(v)}});
    for(gi=0;gi<=10;gi++){sv('rect',{x:P.X(gi)-3,y:P.Y(pob[gi])-3,width:6,height:6,fill:'#fff'},svg)}
    var a=[],b=[],t;for(t=0;t<=20;t+=.5){var m=mod(V.N,V.Ca,t);m.p=Math.max(2000,m.p);(t<=10?a:b).push([t,m.p]);if(t===10)b.push([10,m.p])}path(svg,a,P.X,P.Y,AM,3);path(svg,b,P.X,P.Y,AM,2.4,'6 4');lbl(svg,P.X(10)+6,P.m.t+14,'pronóstico →',TX,10);
    sv('rect',{x:P.m.l+8,y:P.m.t+8,width:6,height:6,fill:'#fff'},svg);lbl(svg,P.m.l+20,P.m.t+14,'datos',TX,10);
    var HX=400,HY=22,HW=280,HH=276,gx=24,gy=20,cw=HW/gx,chh=HH/gy,w20=[];
    for(gi=0;gi<gx;gi++)for(gj=0;gj<gy;gj++){var N=100+(gi+.5)*700/gx,Ca=8*(gj+.5)/gy,e=mis(N,Ca,uw),acc=e<1.5,c;if(acc){var m2=mod(N,Ca,20);w20.push(m2.w)}
      c=acc?'rgba(95,209,164,'+(.9-e/1.8*.5)+')':'rgba(255,255,255,'+Math.max(.04,.28-e*.03)+')';sv('rect',{x:HX+gi*cw,y:HY+HH-(gj+1)*chh,width:cw-.6,height:chh-.6,fill:c},svg)}
    sv('rect',{x:HX,y:HY,width:HW,height:HH,fill:'none',stroke:'rgba(255,255,255,.35)'},svg);
    sv('circle',{cx:HX+(V.N-100)/700*HW,cy:HY+HH-V.Ca/8*HH,r:6,fill:'#fff',stroke:RD,'stroke-width':2.4},svg);
    sv('circle',{cx:HX+(NT-100)/700*HW,cy:HY+HH-CT/8*HH,r:5,fill:'none',stroke:AM,'stroke-width':2,'stroke-dasharray':'3 2'},svg);
    lbl(svg,HX+HW/2,HY+HH+16,'Petróleo original N (MMbbl)',TX,10.5,'middle');lbl(svg,HX,HY-6,'Verde = ajusta · ◌ = valor real del ejemplo',TX,10);
    sv('text',{transform:'rotate(-90)',x:-(HY+HH/2),y:HX-8,'text-anchor':'middle',fill:TX,'font-size':10.5,'font-weight':600},svg,'Fuerza del acuífero Ca');
    var mn=w20.length?Math.min.apply(null,w20):0,mx=w20.length?Math.max.apply(null,w20):0,cm=mod(V.N,V.Ca,20);
    h.out('Error de ajuste (σ): <strong>'+nf(cur,2)+'</strong>'+(cur<1.5?' — este modelo ajusta.':' — no ajusta todavía.')+' Con solo presión, los modelos buenos forman un <strong>valle diagonal</strong>: N y acuífero se compensan, y el agua acumulada pronosticada a 20 años va de <strong>'+nf(mn,1)+'</strong> a <strong>'+nf(mx,1)+' MMbbl</strong> entre modelos que "ajustan igual". '+(uw?'Con el agua producida el valle se cierra.':'Marcá la casilla del agua producida y mirá cómo se cierra.')+' (Datos sintéticos de ejemplo.)')}
  draw(h.V)};

/* ===== EOR: barrido vertical en capas (Dykstra-Parsons, sin flujo cruzado) y eficiencia de desplazamiento ===== */
function zinv(p){var q=p<.5?p:1-p,t=Math.sqrt(-2*Math.log(q)),x=t-(2.515517+.802853*t+.010328*t*t)/(1+1.432788*t+.189269*t*t+.001308*t*t*t);return p<.5?-x:x}
W.eor=function(box,p,api){var h=mkui(box,[{k:'V',l:'Heterogeneidad (Dykstra-Parsons V)',min:0,max:.9,step:.05,v:p.V!=null?p.V:.7,f:function(v){return nf(v,2)}},{k:'mu',l:'Viscosidad del agua inyectada',min:.5,max:30,step:.5,v:p.mu||.5,f:function(v){return nf(v,1)+' cP'}},{k:'sor',l:'Saturación de petróleo residual Sor',min:.05,max:.35,step:.01,v:p.sor||.3,f:function(v){return nf(v*100,0)+' %'}}],draw,{side:true,w:700,h:340,touch:api.touch}),svg=h.svg;
  var N=20,swc=.2,muo=6;
  function draw(V){svg.innerHTML='';var M=.389*muo/V.mu,sg=V.V>0?-Math.log(1-V.V):0,k=[],i;for(i=0;i<N;i++)k.push(Math.exp(sg*zinv((i+.5)/N)));
    function xs(t,ki,m){var tb=(m+1)/(2*ki);if(t>=tb)return 1;var x=Math.abs(m-1)<1e-6?ki*t:(-1+Math.sqrt(1+2*(m-1)*ki*t))/(m-1);return Math.min(1,Math.max(0,x))}
    function wc(t,m){var a=0,b=0,j,x;for(j=0;j<N;j++){x=xs(t,k[j],m);if(x>=1)a+=k[j]/m;else b+=k[j]/(m*x+1-x)}return a/(a+b+1e-12)}
    var lo=0,hi=1e4,mid;for(i=0;i<60;i++){mid=(lo+hi)/2;if(wc(mid,M)<.95)lo=mid;else hi=mid}var t95=hi,x95=k.map(function(ki){return xs(t95,ki,M)}),Ev=x95.reduce(function(a,b){return a+b},0)/N,Ed=(1-swc-V.sor)/(1-swc),RF=Ev*Ed;
    var P=plot(svg,700,340,{l:56,r:330,t:22,b:42},[0,1],[0,N],{nx:2,ny:0,xl:'Posición del frente (inyector → productor)',xf:function(v){return nf(v,1)}});
    for(i=0;i<N;i++){var y=P.Y(i+1),hh=P.h/N-1.5;sv('rect',{x:P.X(0),y:y,width:P.w,height:hh,fill:'rgba(255,255,255,.06)'},svg);sv('rect',{x:P.X(0),y:y,width:Math.max(1,P.w*x95[i]),height:hh,fill:x95[i]>=1?BL:GN,'fill-opacity':.85},svg)}
    lbl(svg,P.m.l,P.m.t-6,'Capas (arriba: la más permeable)',TX,10);lbl(svg,P.m.l+P.w,P.m.t-6,'Al 95 % de corte de agua',TX,10,'end');
    var bx=400,by=60,bw=270;lbl(svg,bx,by-22,'Recuperación del petróleo original',TX,11);
    function bar(y,l,v,c){lbl(svg,bx,y-6,l,TX,10.5);sv('rect',{x:bx,y:y,width:bw,height:14,fill:'rgba(255,255,255,.1)'},svg);sv('rect',{x:bx,y:y,width:bw*v,height:14,fill:c},svg);lbl(svg,bx+bw*v-4,y+11,nf(v*100,0)+' %','#0b1a30',10.5,'end')}
    bar(by+10,'Barrido vertical (capas)',Ev,GN);bar(by+52,'Desplazamiento en la roca barrida',Ed,BL);bar(by+94,'Recuperación = barrido × desplazamiento',RF,AM);
    lbl(svg,bx,by+142,'Razón de movilidad M = '+nf(M,2)+(M>1?'  (desfavorable)':'  (favorable)'),M>1?RD:GN,11);
    h.out('Con <strong>V = '+nf(V.V,2)+'</strong> y <strong>M = '+nf(M,2)+'</strong>: barrido vertical <strong>'+nf(Ev*100,0)+' %</strong>, desplazamiento <strong>'+nf(Ed*100,0)+' %</strong> (Sor '+nf(V.sor*100,0)+' %). El polímero sube la viscosidad del agua y mejora el barrido; un tensioactivo o un gas miscible bajan Sor. (Capas con pistón, sin flujo cruzado: ejemplo.)')}
  draw(h.V)};

/* ===== RTA: gráfico de raíz de tiempo (flujo lineal) y ventana de ajuste ===== */
W.rta=function(box,p,api){var h=mkui(box,[{k:'m',l:'Pendiente real m (∝ 1/(A√k))',min:1,max:8,step:.5,v:p.m||3,f:function(v){return nf(v,1)+' ×10⁻⁵'}},{k:'b',l:'Ordenada b (daño / conductividad)',min:0,max:40,step:2,v:p.b!=null?p.b:16,f:function(v){return nf(v)+' ×10⁻⁵'}},{k:'te',l:'Fin del flujo lineal',min:150,max:1200,step:25,v:p.te||500,f:function(v){return nf(v)+' d'}},{k:'t1',l:'Ventana de ajuste: desde',min:20,max:1000,step:10,v:60,f:function(v){return nf(v)+' d'}},{k:'t2',l:'Ventana de ajuste: hasta',min:100,max:1800,step:10,v:400,f:function(v){return nf(v)+' d'}}],draw,{side:true,w:700,h:340,touch:api.touch}),svg=h.svg;
  var r0=rng(9),ns=[],i;for(i=0;i<80;i++)ns.push(1+.03*gauss(r0));
  function qm(t,m,b,te){var ir=function(x){return b*1e-5+m*1e-5*Math.sqrt(x)};if(t<=te)return 1/ir(t);var D=m*1e-5/(2*Math.sqrt(te))/ir(te);return(1/ir(te))*Math.exp(-D*(t-te))}
  function draw(V){svg.innerHTML='';var d=[],i,T=1800,t;for(i=0;i<80;i++){t=10+(T-10)*i/79;d.push([t,qm(t,V.m,V.b,V.te)*ns[i]])}
    var P=plot(svg,700,340,{l:56,r:370,t:22,b:42},[0,Math.sqrt(T)],[0,Math.max.apply(null,d.map(function(q){return 1/q[1]}))*1e5*1.05],{nx:4,ny:4,xl:'Raíz del tiempo (√d)',yl:'1/q (×10⁻⁵ d/bbl)',xf:function(v){return nf(v)},yf:function(v){return nf(v)}});
    d.forEach(function(q){var inw=q[0]>=V.t1&&q[0]<=V.t2;sv('circle',{cx:P.X(Math.sqrt(q[0])),cy:P.Y(1e5/q[1]),r:3,fill:inw?AM:'rgba(255,255,255,.55)'},svg)});
    var sx=0,sy=0,sxx=0,sxy=0,n=0;d.forEach(function(q){if(q[0]>=V.t1&&q[0]<=V.t2){var x=Math.sqrt(q[0]),y=1e5/q[1];sx+=x;sy+=y;sxx+=x*x;sxy+=x*y;n++}});
    var mf=null,bf=0;if(n>=3){mf=(n*sxy-sx*sy)/(n*sxx-sx*sx);bf=(sy-mf*sx)/n}
    if(mf!=null){path(svg,[[0,bf],[Math.sqrt(T),bf+mf*Math.sqrt(T)]].map(function(a){return[a[0],a[1]]}),P.X,P.Y,AM,2,'6 4')}
    sv('line',{x1:P.X(Math.sqrt(V.te)),x2:P.X(Math.sqrt(V.te)),y1:P.m.t,y2:P.m.t+P.h,stroke:GN,'stroke-width':1.2,'stroke-dasharray':'4 4'},svg);lbl(svg,P.X(Math.sqrt(V.te))+4,P.m.t+14,'fin del flujo lineal',GN,10);
    var Q=plot(svg,700,340,{l:392,r:14,t:22,b:42},[0,T],[0,Math.max.apply(null,d.map(function(q){return q[1]}))*1.05],{nx:3,ny:4,xl:'Tiempo (d)',xf:function(v){return nf(v)},yf:function(v){return nf(v)}});sv('text',{transform:'rotate(-90)',x:-(Q.m.t+Q.h/2),y:Q.m.l-44,'text-anchor':'middle',fill:TX,'font-size':11,'font-weight':600},svg,'Caudal q (bbl/d)');
    d.forEach(function(q){sv('circle',{cx:Q.X(q[0]),cy:Q.Y(q[1]),r:2.6,fill:'rgba(255,255,255,.6)'},svg)});
    if(mf!=null&&mf>0){var f=[];for(t=10;t<=T;t+=20)f.push([t,1e5/(bf+mf*Math.sqrt(t))]);path(svg,f,Q.X,Q.Y,AM,2.4,'6 4');lbl(svg,Q.m.l+Q.w-4,Q.m.t+14,'pronóstico lineal (naranja)',AM,10,'end')}
    var inc=V.t2>V.te,est=mf?V.m/mf*100:null;
    h.out(mf==null?'Ampliá la ventana de ajuste.':'Pendiente ajustada <strong>'+nf(mf,2)+'</strong> vs. real '+nf(V.m,1)+'. El producto A·√k estimado es <strong>'+nf(est,0)+' %</strong> del real. '+(inc?'La ventana <strong>incluye flujo límite</strong>: la pendiente sube y A·√k se subestima.':'La ventana está dentro del flujo lineal: el ajuste es confiable.')+' El pronóstico lineal sobreestima el caudal una vez que termina el flujo lineal. (Datos sintéticos con ruido de ejemplo.)')}
  draw(h.V)};

/* ===== SIMULACIÓN: dispersión numérica de Buckley-Leverett ===== */
W.sim=function(box,p,api){var h=mkui(box,[{k:'n',l:'Celdas de la malla',min:10,max:300,step:10,v:p.n||40,f:function(v){return nf(v)}},{k:'c',l:'Número de Courant (paso de tiempo)',min:.1,max:1.3,step:.05,v:p.c||.8,f:function(v){return nf(v,2)}},{k:'M',l:'Razón de movilidad M',min:.3,max:10,step:.1,v:p.M||2,f:function(v){return nf(v,1)}},{k:'td',l:'Volúmenes porales inyectados',min:.1,max:1,step:.05,v:.4,f:function(v){return nf(v,2)}}],draw,{side:true,w:700,h:340,touch:api.touch}),svg=h.svg;
  function draw(V){svg.innerHTML='';var M=V.M,f=function(s){s=Math.max(0,Math.min(1,s));return s*s/(s*s+(1-s)*(1-s)/M)},df=function(s){return(f(Math.min(1,s+.0005))-f(Math.max(0,s-.0005)))/(Math.min(1,s+.0005)-Math.max(0,s-.0005))},i,sf=.01,sl=0,fmax=0;
    for(i=1;i<=1000;i++){var s=i/1000,q=f(s)/s;if(q>sl){sl=q;sf=s}fmax=Math.max(fmax,df(s))}
    var N=V.n,dx=1/N,dt=V.c*dx/fmax,S=[],j,t=0;for(j=0;j<N;j++)S.push(0);
    var steps=Math.ceil(V.td/dt),ok=true;dt=V.td/steps;
    for(i=0;i<steps;i++){var nw=S.slice();for(j=0;j<N;j++){var up=j===0?1:S[j-1];nw[j]=S[j]-dt/dx*(f(S[j])-f(up))}S=nw;if(S.some(function(x){return!isFinite(x)||Math.abs(x)>1e3})){ok=false;break}}
    var P=plot(svg,700,340,{l:50,r:300,t:22,b:42},[0,1],[-.2,1.2],{nx:5,ny:7,xl:'Posición (inyector → productor)',yl:'Saturación de agua normalizada',xf:function(v){return nf(v,1)},yf:function(v){return nf(v,1)}});
    var an=[[0,1]],xf=V.td*sl;for(i=0;i<=400;i++){var s2=1-(1-sf)*i/400,x=V.td*df(s2);if(x<xf&&x>0)an.push([x,s2])}an.push([Math.min(1,xf),sf],[Math.min(1,xf),0],[1,0]);
    path(svg,an.filter(function(a){return a[0]<=1}),P.X,P.Y,'#fff',2.6);
    if(ok){var pts=[];S.forEach(function(v,k){pts.push([(k+.5)*dx,Math.max(-.2,Math.min(1.2,v))])});path(svg,pts,P.X,P.Y,AM,2.8);S.forEach(function(v,k){sv('circle',{cx:P.X((k+.5)*dx),cy:P.Y(Math.max(-.2,Math.min(1.2,v))),r:N<=80?2.6:1.4,fill:AM},svg)})}
    sv('rect',{x:P.m.l+10,y:P.m.t+8,width:14,height:3,fill:'#fff'},svg);lbl(svg,P.m.l+30,P.m.t+13,'solución analítica',TX,10);sv('rect',{x:P.m.l+10,y:P.m.t+22,width:14,height:3,fill:AM},svg);lbl(svg,P.m.l+30,P.m.t+27,'simulación (upwind explícito)',TX,10);
    var xh=-1,xa=Math.min(1,xf);if(ok){for(i=0;i<N;i++)if(S[i]<.5*sf){xh=(i+.5)*dx;break}}
    var width=0;if(ok){var a1=-1,a2=-1;for(i=0;i<N;i++){if(a1<0&&S[i]<.9*sf)a1=i;if(a2<0&&S[i]<.1*sf)a2=i}width=a1>=0&&a2>=0?(a2-a1)*dx:0}
    h.out(ok?'Frente analítico en <strong>'+nf(xa,2)+'</strong>; el simulado (S = Sf/2) en <strong>'+nf(xh<0?1:xh,2)+'</strong>. Ancho del frente numérico: <strong>'+nf(width*100,0)+' %</strong> del largo (en la realidad es un choque casi abrupto). Refiná la malla y el frente se afila; con Courant &gt; 1 el esquema explícito se vuelve inestable. (Flujo fraccional de Corey cuadrático, ejemplo didáctico.)':'<strong>Inestable</strong>: con Courant &gt; 1 el esquema explícito diverge. Bajá el número de Courant o el paso de tiempo.')}
  draw(h.V)};

/* ===== CCS: capacidad volumétrica de almacenamiento ===== */
W.ccsc=function(box,p,api){var h=mkui(box,[{k:'A',l:'Área del acuífero',min:10,max:500,step:10,v:p.A||100,f:function(v){return nf(v)+' km²'}},{k:'h',l:'Espesor neto',min:10,max:200,step:5,v:p.h||50,f:function(v){return nf(v)+' m'}},{k:'phi',l:'Porosidad',min:.05,max:.3,step:.01,v:p.phi||.2,f:function(v){return nf(v*100,0)+' %'}},{k:'rho',l:'Densidad del CO₂ en reservorio',min:400,max:800,step:10,v:p.rho||700,f:function(v){return nf(v)+' kg/m³'}},{k:'E',l:'Factor de eficiencia de almacenamiento E',min:.5,max:6,step:.5,v:p.E||2,f:function(v){return nf(v,1)+' %'}},{k:'q',l:'Emisión a inyectar',min:.5,max:10,step:.5,v:p.q||1,f:function(v){return nf(v,1)+' Mt/año'}}],draw,{side:true,w:700,h:340,touch:api.touch}),svg=h.svg;
  function draw(V){svg.innerHTML='';var pv=V.A*1e6*V.h*V.phi,mpv=pv*V.rho/1e9,M=mpv*V.E/100,yrs=M/V.q;
    sv('rect',{x:20,y:40,width:300,height:70,fill:'#4a3b27'},svg);lbl(svg,28,60,'Sello',TX,10.5);sv('rect',{x:20,y:110,width:300,height:110,fill:'#1a4a6e'},svg);lbl(svg,28,130,'Acuífero salino: A × h × φ',TX,10.5);
    var fill=Math.min(1,Math.sqrt(V.E/6));sv('ellipse',{cx:170,cy:165,rx:20+120*fill,ry:12+34*fill,fill:AM,'fill-opacity':.7},svg);lbl(svg,170,169,'CO₂ almacenado',  '#0b1a30',10.5,'middle');
    lbl(svg,20,252,'M = A · h · φ · ρ · E',GN,12);lbl(svg,20,272,'Volumen poral: '+nf(pv/1e9,1)+' mil millones de m³',TX,10.5);lbl(svg,20,288,'CO₂ que cabría si se llenara todo el poro: '+nf(mpv,0)+' Mt',TX,10.5);
    var X0=360,W0=300,mx=Math.max(40,yrs*1.1);
    lbl(svg,X0,48,'Años de inyección que alcanza',TX,11);sv('rect',{x:X0,y:58,width:W0,height:22,fill:'rgba(255,255,255,.1)'},svg);sv('rect',{x:X0,y:58,width:W0*Math.min(1,yrs/mx),height:22,fill:yrs>=30?GN:AM},svg);lbl(svg,X0+W0*Math.min(1,yrs/mx)-6,74,nf(yrs,0)+' años','#0b1a30',11,'end');
    sv('line',{x1:X0+W0*30/mx,x2:X0+W0*30/mx,y1:52,y2:86,stroke:'#fff','stroke-width':1.4,'stroke-dasharray':'4 3'},svg);lbl(svg,X0+W0*30/mx,100,'30 años',TX,10,'middle');
    lbl(svg,X0,140,'Capacidad efectiva',TX,11);lbl(svg,X0,162,nf(M,0)+' Mt de CO₂',GN,18);lbl(svg,X0,184,'= '+nf(V.E,1)+' % del CO₂ que cabría en el poro',TX,10.5);
    h.out('Capacidad <strong>'+nf(M,0)+' Mt</strong>: alcanza <strong>'+nf(yrs,0)+' años</strong> a '+nf(V.q,1)+' Mt/año'+(yrs<30?' (no cubre 30 años).':'.')+' E es la variable más incierta: resume cuánto del poro se puede ocupar de verdad. (Valores de ejemplo.)')}
  draw(h.V)};

/* ===== RESERVAS: conciliación (movimiento) y tasa de reposición ===== */
W.rrp=function(box,p,api){var h=mkui(box,[{k:'prod',l:'Producción del año',min:10,max:80,step:1,v:p.prod||35,f:function(v){return nf(v)+' MMboe'}},{k:'rev',l:'Revisiones (precio, comportamiento)',min:-40,max:40,step:1,v:p.rev!=null?p.rev:6,f:function(v){return(v>0?'+':'')+nf(v)+' MMboe'}},{k:'ext',l:'Extensiones y descubrimientos',min:0,max:60,step:1,v:p.ext!=null?p.ext:18,f:function(v){return nf(v)+' MMboe'}},{k:'acq',l:'Compras',min:0,max:40,step:1,v:0,f:function(v){return nf(v)+' MMboe'}},{k:'dev',l:'Ventas',min:0,max:40,step:1,v:0,f:function(v){return nf(v)+' MMboe'}}],draw,{side:true,w:700,h:340,touch:api.touch}),svg=h.svg,R0=400;
  function draw(V){svg.innerHTML='';var st=[['Inicio',R0,0,'#8ea2bd'],['Prod.',-V.prod,0,RD],['Rev.',V.rev,0,V.rev>=0?GN:RD],['Ext.',V.ext,0,GN],['Comp.',V.acq,0,BL],['Vtas.',-V.dev,0,AM]],run=0,i,rows=[],end;
    st.forEach(function(s,k){if(k===0){rows.push([s[0],0,s[1],s[3]]);run=s[1]}else{rows.push([s[0],run,run+s[1],s[3]]);run+=s[1]}});end=run;rows.push(['Cierre',0,end,'#8ea2bd']);
    var mnv=Math.min.apply(null,rows.map(function(r){return Math.min(r[1],r[2])}).filter(function(v,k){return k>0&&k<rows.length-1}).concat([R0,end])),lo=Math.floor(mnv*.8/10)*10,hi=Math.max(R0,end,R0+V.ext+V.acq+V.rev)*1.06,P=plot(svg,700,340,{l:56,r:330,t:22,b:46},[0,rows.length],[lo,hi],{nx:1,ny:4,xf:function(){return ''},yl:'Reservas (MMboe, eje truncado)',yf:function(v){return nf(v)}});
    rows.forEach(function(r,k){var a=Math.min(r[1],r[2]),b=Math.max(r[1],r[2]),w=P.w/rows.length*.7,x=P.X(k)+(P.w/rows.length-w)/2;sv('rect',{x:x,y:P.Y(b),width:w,height:Math.max(1.5,P.Y(Math.max(a,lo))-P.Y(b)),fill:r[3],'fill-opacity':.85},svg);lbl(svg,x+w/2,P.m.t+P.h+14,r[0],TX,9.5,'middle')});
    var add=V.rev+V.ext+V.acq-V.dev,rr=add/V.prod,rp=end/V.prod;
    var bx=400,by=60;lbl(svg,bx,by-24,'Indicadores',TX,11);
    lbl(svg,bx,by+6,'Reservas de cierre',TX,10.5);lbl(svg,bx,by+28,nf(end)+' MMboe',GN,18);
    lbl(svg,bx,by+58,'Tasa de reposición',TX,10.5);lbl(svg,bx,by+80,nf(rr*100,0)+' %',rr>=1?GN:RD,18);
    lbl(svg,bx,by+110,'Relación reservas / producción',TX,10.5);lbl(svg,bx,by+132,nf(rp,1)+' años',AM,18);
    h.out('<strong>Tasa de reposición '+nf(rr*100,0)+' %</strong> (adiciones netas / producción; cada empresa define su versión). Por debajo de 100 % se consumen reservas. Una revisión negativa por precio bajo puede borrar una buena campaña de extensiones. (Cifras de ejemplo.)')}
  draw(h.V)};

/* ===== PVT: petróleo negro (correlaciones de Standing) ===== */
function pvtOil(API,gg,T,Rsb){var go=141.5/(131.5+API),pb=18.2*(Math.pow(Rsb/gg,.83)*Math.pow(10,.00091*T-.0125*API)-1.4);pb=Math.max(pb,15);
  function Rs(p){if(p>=pb)return Rsb;return gg*Math.pow((p/18.2+1.4)*Math.pow(10,.0125*API-.00091*T),1/.83)}
  function Bo(p){var r=Rs(p),b=.9759+.00012*Math.pow(r*Math.sqrt(gg/go)+1.25*T,1.2);if(p>pb){var bob=.9759+.00012*Math.pow(Rsb*Math.sqrt(gg/go)+1.25*T,1.2);return bob*Math.exp(-1e-5*(p-pb))}return b}
  return{pb:pb,Rs:Rs,Bo:Bo}}
W.pvt=function(box,p,api){var h=mkui(box,[{k:'API',l:'Densidad API',min:15,max:45,step:1,v:p.API||32,f:function(v){return nf(v)+' °API'}},{k:'gg',l:'Densidad relativa del gas disuelto',min:.55,max:1.1,step:.01,v:p.gg||.75,f:function(v){return nf(v,2)}},{k:'T',l:'Temperatura del reservorio',min:100,max:300,step:5,v:p.T||200,f:function(v){return nf(v)+' °F'}},{k:'Rsb',l:'Relación gas-petróleo de burbuja Rsb',min:100,max:1500,step:25,v:p.Rsb||600,f:function(v){return nf(v)+' scf/STB'}}],draw,{side:true,w:700,h:340,touch:api.touch}),svg=h.svg;
  function draw(V){svg.innerHTML='';var o=pvtOil(V.API,V.gg,V.T,V.Rsb),pm=Math.max(1000,Math.ceil(o.pb*1.6/500)*500),i,a=[],b=[];
    for(i=0;i<=60;i++){var P=pm*i/60;a.push([P,o.Rs(P)]);b.push([P,o.Bo(P)])}
    var g1=sv('g',null,svg),g2=sv('g',{transform:'translate(350,0)'},svg);
    var p1=plot(g1,340,280,{l:46,r:10,t:26,b:40},[0,pm],[0,Math.ceil(V.Rsb*1.1/100)*100],{xl:'Presión (psi)',nx:4,ny:4}),bys=b.map(function(x){return x[1]}),bmax=Math.max.apply(null,bys),bmin=Math.min.apply(null,bys);
    var by0=Math.min(1,bmin*.98),by1=bmax*1.04,p2=plot(g2,340,280,{l:46,r:10,t:26,b:40},[0,pm],[by0,by1],{xl:'Presión (psi)',nx:4,ny:4,yf:function(v){return nf(v,2)}});
    lbl(g1,46,16,'Rs: gas disuelto (scf/STB)',TX,11);lbl(g2,46,16,'Bo: factor volumétrico (bbl/STB)',TX,11);
    path(g1,a,p1.X,p1.Y,GN,2.4);path(g2,b,p2.X,p2.Y,AM,2.4);
    [[g1,p1],[g2,p2]].forEach(function(z){sv('line',{x1:z[1].X(o.pb),x2:z[1].X(o.pb),y1:z[1].m.t,y2:z[1].m.t+z[1].h,stroke:'#fff','stroke-width':1.3,'stroke-dasharray':'4 3'},z[0]);lbl(z[0],z[1].X(o.pb)+4,z[1].m.t+12,'Pb ≈ '+nf(o.pb,0)+' psi',TX,10.5)});
    h.out('Presión de burbuja <strong>≈ '+nf(o.pb,0)+' psi</strong> (correlación de Standing). Por debajo, el gas sale de solución: baja Rs y baja Bo. Por encima, solo se comprime el líquido y Bo cae muy poco. Correlaciones: estimación de partida; el dato de laboratorio manda. (Valores de ejemplo.)')}
  draw(h.V)};

/* ===== PVT: factor Z (Papay) y factor volumétrico del gas ===== */
function gasZ(p,T,gg){var ppc=756.8-131*gg-3.6*gg*gg,tpc=169.2+349.5*gg-74*gg*gg,pr=p/ppc,tr=(T+459.67)/tpc;return 1-3.52*pr/Math.pow(10,.9813*tr)+.274*pr*pr/Math.pow(10,.8157*tr)}
W.zf=function(box,p,api){var h=mkui(box,[{k:'gg',l:'Densidad relativa del gas',min:.55,max:.9,step:.01,v:p.gg||.65,f:function(v){return nf(v,2)}},{k:'T',l:'Temperatura',min:80,max:300,step:5,v:p.T||200,f:function(v){return nf(v)+' °F'}},{k:'P',l:'Presión de trabajo',min:200,max:8000,step:100,v:p.P||3000,f:function(v){return nf(v)+' psi'}}],draw,{side:true,w:700,h:340,touch:api.touch}),svg=h.svg;
  function draw(V){svg.innerHTML='';var i,a=[],b=[],Tr=V.T+459.67;for(i=1;i<=60;i++){var P=8000*i/60;a.push([P,gasZ(P,V.T,V.gg)]);b.push([P,.02827*gasZ(P,V.T,V.gg)*Tr/P])}
    var zmin=Math.min.apply(null,a.map(function(x){return x[1]})),z0=Math.floor(Math.min(.7,zmin)*20)/20,g1=sv('g',null,svg),g2=sv('g',{transform:'translate(350,0)'},svg);
    var p1=plot(g1,340,280,{l:46,r:10,t:26,b:40},[0,8000],[z0,1.1],{xl:'Presión (psi)',nx:4,ny:4,yf:function(v){return nf(v,2)}}),bmax=b[0][1];
    var p2=plot(g2,340,280,{l:52,r:10,t:26,b:40},[0,8000],[0,Math.ceil(bmax*1.05*100)/100],{xl:'Presión (psi)',nx:4,ny:4,yf:function(v){return nf(v,2)}});
    lbl(g1,46,16,'Factor de compresibilidad Z',TX,11);lbl(g2,52,16,'Bg (ft³/scf)',TX,11);path(g1,a,p1.X,p1.Y,GN,2.4);path(g2,b,p2.X,p2.Y,AM,2.4);
    var z=gasZ(V.P,V.T,V.gg),bg=.02827*z*Tr/V.P;sv('circle',{cx:p1.X(V.P),cy:p1.Y(z),r:5,fill:'#fff'},g1);sv('circle',{cx:p2.X(V.P),cy:p2.Y(bg),r:5,fill:'#fff'},g2);
    h.out('A '+nf(V.P)+' psi y '+nf(V.T)+' °F: <strong>Z = '+nf(z,3)+'</strong>, <strong>Bg = '+nf(bg,5)+' ft³/scf</strong> (≈ '+nf(1/bg,0)+' scf por ft³ en reservorio). Z viene de la aproximación de Papay con propiedades pseudocríticas de Sutton; para diseño se usan correlaciones más completas o datos de laboratorio. (Valores de ejemplo.)')}
  draw(h.V)};

/* ===== GAS: balance de materiales p/z ===== */
W.pz=function(box,p,api){var h=mkui(box,[{k:'G',l:'Gas original en sitio G',min:50,max:1000,step:10,v:p.G||300,f:function(v){return nf(v)+' Bscf'}},{k:'e',l:'Reposición por acuífero (fracción del vaciamiento)',min:0,max:.6,step:.05,v:p.e!=null?p.e:0,f:function(v){return nf(v*100)+' %'}},{k:'Gp',l:'Producción acumulada Gp',min:0,max:.9,step:.01,v:p.Gp||.4,f:function(v){return nf(v*100)+' % de G'}}],draw,{side:true,w:700,h:340,touch:api.touch}),svg=h.svg;
  function draw(V){svg.innerHTML='';var pz0=4500/gasZ(4500,200,.65),pl=plot(svg,700,300,{l:60,r:20,t:24,b:44},[0,V.G],[0,pz0*1.05],{xl:'Producción acumulada Gp (Bscf)',yl:'p/z (psi)',nx:5,ny:5});
    path(svg,[[0,pz0],[V.G,0]],pl.X,pl.Y,GN,2,'6 4');lbl(svg,pl.X(V.G*.55),pl.Y(pz0*.5)-8,'volumétrico: p/z = (pi/zi)(1 − Gp/G)',GN,10.5);
    var pts=[],gp=V.Gp*V.G,i;for(i=0;i<=20;i++){var x=gp*i/20;pts.push([x,pz0*(1-(1-V.e)*x/V.G)])}path(svg,pts,pl.X,pl.Y,AM,2.8);
    var yEnd=pts[pts.length-1][1];sv('circle',{cx:pl.X(gp),cy:pl.Y(yEnd),r:5,fill:'#fff'},svg);
    var Ga=V.G/(1-V.e);if(V.e>0){path(svg,[[0,pz0],[Math.min(Ga,V.G*2),pz0*(1-Math.min(Ga,V.G*2)/Ga)]],pl.X,pl.Y,RD,1.6,'3 3');}
    lbl(svg,pl.X(0)+8,pl.Y(pz0)-8,'pi / zi = '+nf(pz0,0)+' psi',TX,10.5);
    h.out('Con Gp = <strong>'+nf(gp,0)+' Bscf</strong>, p/z ≈ <strong>'+nf(yEnd,0)+' psi</strong>.'+(V.e>0?' Con reposición de agua del '+nf(V.e*100)+' %, extrapolar la recta daría <strong>G aparente = '+nf(Ga,0)+' Bscf</strong> frente a G = '+nf(V.G,0)+': el acuífero hace parecer más grande al reservorio.':' Sin acuífero, la recta p/z vs Gp corta el eje en G.')+' (Modelo simplificado, valores de ejemplo.)')}
  draw(h.V)};

/* ===== GAS: curva de entrega (retropresión) ===== */
W.dlv=function(box,p,api){var h=mkui(box,[{k:'pr',l:'Presión de reservorio',min:500,max:6000,step:100,v:p.pr||3000,f:function(v){return nf(v)+' psi'}},{k:'aof',l:'Caudal a pozo abierto (AOF)',min:5,max:100,step:5,v:p.aof||40,f:function(v){return nf(v)+' MMscfd'}},{k:'n',l:'Exponente n (1 = laminar, 0,5 = turbulento)',min:.5,max:1,step:.05,v:p.n||.85,f:function(v){return nf(v,2)}},{k:'pw',l:'Presión de fondo fluyente',min:100,max:3000,step:50,v:p.pw||1500,f:function(v){return nf(v)+' psi'}}],draw,{side:true,w:700,h:340,touch:api.touch}),svg=h.svg;
  function draw(V){svg.innerHTML='';var C=V.aof/Math.pow(V.pr*V.pr,V.n),pw=Math.min(V.pw,V.pr),q=C*Math.pow(V.pr*V.pr-pw*pw,V.n),pts=[],i,pl=plot(svg,700,300,{l:60,r:20,t:24,b:44},[0,V.aof*1.05],[0,V.pr*1.05],{xl:'Caudal q (MMscfd)',yl:'Presión de fondo fluyente (psi)',nx:5,ny:5});
    for(i=0;i<=60;i++){var P=V.pr*(1-i/60);pts.push([C*Math.pow(Math.max(0,V.pr*V.pr-P*P),V.n),P])}path(svg,pts,pl.X,pl.Y,GN,2.8);
    sv('circle',{cx:pl.X(q),cy:pl.Y(pw),r:5.5,fill:'#fff'},svg);lbl(svg,pl.X(V.aof)-4,pl.Y(0)-8,'AOF '+nf(V.aof)+' MMscfd',AM,10.5,'end');lbl(svg,pl.X(0)+8,pl.Y(V.pr)+14,'pr = '+nf(V.pr)+' psi',TX,10.5);
    h.out('Con pwf = '+nf(pw)+' psi el pozo entrega <strong>'+nf(q,1)+' MMscfd</strong> ('+nf(q/V.aof*100,0)+' % del AOF). Ecuación de retropresión q = C (pr² − pwf²)ⁿ: n cerca de 0,5 indica flujo turbulento y una curva con más caída. El AOF es una referencia, no un caudal operable. (Valores de ejemplo.)')}
  draw(h.V)};

/* ===== FACILITIES: dimensionamiento de un separador (Souders-Brown) ===== */
W.sep=function(box,p,api){var h=mkui(box,[{k:'Q',l:'Caudal de gas',min:1,max:100,step:1,v:p.Q||20,f:function(v){return nf(v)+' MMscfd'}},{k:'P',l:'Presión de operación',min:5,max:100,step:1,v:p.P||30,f:function(v){return nf(v)+' bar'}},{k:'K',l:'Factor K de Souders-Brown',min:.04,max:.2,step:.01,v:p.K||.1,f:function(v){return nf(v,2)+' m/s'}},{k:'rl',l:'Densidad del líquido',min:600,max:1000,step:10,v:p.rl||800,f:function(v){return nf(v)+' kg/m³'}}],draw,{side:true,w:700,h:340,touch:api.touch}),svg=h.svg;
  function dia(Qm,P,K,rl){var T=313.15,z=.9,gg=.7,rg=P*1e5*28.97*gg/(z*8314*T),qa=Qm*28316.85/86400*(1.01325/P)*(T/288.71)*z,v=K*Math.sqrt((rl-rg)/rg),A=qa/v;return{rg:rg,qa:qa,v:v,A:A,D:Math.sqrt(4*A/Math.PI)}}
  function draw(V){svg.innerHTML='';var r=dia(V.Q,V.P,V.K,V.rl),pts=[],i;for(i=0;i<=40;i++){var P=5+95*i/40;pts.push([P,dia(V.Q,P,V.K,V.rl).D])}
    var Dm=Math.ceil(pts[0][1]*1.05*10)/10,pl=plot(svg,700,300,{l:60,r:20,t:24,b:44},[0,100],[0,Dm],{xl:'Presión de operación (bar)',yl:'Diámetro mínimo (m)',nx:5,ny:5,yf:function(v){return nf(v,1)}});
    path(svg,pts,pl.X,pl.Y,GN,2.8);sv('circle',{cx:pl.X(V.P),cy:pl.Y(r.D),r:5.5,fill:'#fff'},svg);
    lbl(svg,pl.X(100)-6,pl.Y(Dm)+14,'Gas a '+nf(V.Q)+' MMscfd, T = 40 °C, Z = 0,9, γg = 0,7',TX,10.5,'end');
    h.out('A '+nf(V.P)+' bar el gas pesa <strong>'+nf(r.rg,1)+' kg/m³</strong>; la velocidad máxima admisible es <strong>'+nf(r.v,2)+' m/s</strong> y el diámetro mínimo del separador vertical es <strong>'+nf(r.D,2)+' m</strong>. A mayor presión el gas es más denso, el caudal real baja y el recipiente se achica. K depende del diseño interno (extractor de niebla) y se toma de una norma o del fabricante. (Valores de ejemplo.)')}
  draw(h.V)};

/* ===== FACILITIES: compresión ===== */
W.comp=function(box,p,api){var h=mkui(box,[{k:'P1',l:'Presión de succión',min:1,max:40,step:.5,v:p.P1||5,f:function(v){return nf(v,1)+' bar'}},{k:'P2',l:'Presión de descarga',min:10,max:150,step:1,v:p.P2||40,f:function(v){return nf(v)+' bar'}},{k:'T1',l:'Temperatura de succión',min:10,max:60,step:1,v:p.T1||35,f:function(v){return nf(v)+' °C'}},{k:'Q',l:'Caudal de gas',min:1,max:60,step:1,v:p.Q||15,f:function(v){return nf(v)+' MMscfd'}},{k:'eta',l:'Eficiencia politrópica/adiabática',min:.6,max:.9,step:.01,v:p.eta||.75,f:function(v){return nf(v*100)+' %'}}],draw,{side:true,w:700,h:340,touch:api.touch}),svg=h.svg;
  var k=1.28,gg=.7,M=28.97*gg;
  function calc(V,r){var a=Math.pow(r,(k-1)/k),T1=V.T1+273.15,T2=T1*(1+(a-1)/V.eta),m=V.Q*28316.85/86400*M/23.64,w=m*(8314.46/M)*T1*(k/(k-1))*(a-1)/V.eta/1000;return{T2:T2-273.15,kW:w}}
  function draw(V){svg.innerHTML='';var r=Math.max(1.01,V.P2/V.P1),c=calc(V,r),pts=[],i;for(i=0;i<=40;i++){var rr=1.2+10.8*i/40;pts.push([rr,calc(V,rr).kW])}
    var kmx=Math.ceil(pts[pts.length-1][1]*1.05/100)*100,pl=plot(svg,700,300,{l:60,r:20,t:24,b:44},[1,12],[0,kmx],{xl:'Relación de compresión r = P2/P1',yl:'Potencia (kW)',nx:5,ny:5});
    path(svg,pts,pl.X,pl.Y,GN,2.8);var rx=Math.min(12,r);sv('circle',{cx:pl.X(rx),cy:pl.Y(c.kW),r:5.5,fill:'#fff'},svg);
    var ns=Math.ceil(Math.log(r)/Math.log(4));h.out('Relación <strong>'+nf(r,1)+'</strong>: temperatura de descarga <strong>≈ '+nf(c.T2,0)+' °C</strong>, potencia al gas <strong>≈ '+nf(c.kW,0)+' kW</strong>. Con relaciones altas la temperatura sube y conviene dividir en etapas con enfriamiento intermedio (como orientación, '+ns+' etapa'+(ns>1?'s':'')+' con relación ≤ 4 cada una). Modelo de gas ideal con k = 1,28 y Z = 1: sirve para dimensionar, no para comprar. (Valores de ejemplo.)')}
  draw(h.V)};

/* ===== MIDSTREAM: pérdida de carga en un ducto de líquido ===== */
W.pipe=function(box,p,api){var h=mkui(box,[{k:'Q',l:'Caudal',min:50,max:1500,step:10,v:p.Q||500,f:function(v){return nf(v)+' m³/h'}},{k:'D',l:'Diámetro interno',min:150,max:600,step:10,v:p.D||350,f:function(v){return nf(v)+' mm'}},{k:'L',l:'Longitud',min:10,max:300,step:5,v:p.L||100,f:function(v){return nf(v)+' km'}},{k:'mu',l:'Viscosidad',min:1,max:100,step:1,v:p.mu||8,f:function(v){return nf(v)+' cP'}},{k:'rho',l:'Densidad',min:700,max:950,step:10,v:p.rho||840,f:function(v){return nf(v)+' kg/m³'}}],draw,{side:true,w:700,h:340,touch:api.touch}),svg=h.svg;
  function dp(Q,D,L,mu,rho){var d=D/1000,A=Math.PI*d*d/4,v=Q/3600/A,Re=rho*v*d/(mu/1000),e=4.6e-5,f=Re<2300?64/Re:.25/Math.pow(Math.log10(e/(3.7*d)+5.74/Math.pow(Re,.9)),2);return{v:v,Re:Re,f:f,dP:f*(L*1000/d)*rho*v*v/2/1e5}}
  function draw(V){svg.innerHTML='';var r=dp(V.Q,V.D,V.L,V.mu,V.rho),ds=[V.D*.8,V.D,V.D*1.2],cols=[RD,GN,BL],pm=Math.max(5,Math.ceil(dp(1500,V.D*.8,V.L,V.mu,V.rho).dP/10)*10),pl=plot(svg,700,300,{l:60,r:20,t:24,b:44},[0,1500],[0,pm],{xl:'Caudal (m³/h)',yl:'Caída de presión (bar)',nx:5,ny:5});
    ds.forEach(function(d,i){var pts=[],j;for(j=1;j<=40;j++){var q=1500*j/40;pts.push([q,Math.min(pm,dp(q,d,V.L,V.mu,V.rho).dP)])}path(svg,pts,pl.X,pl.Y,cols[i],i===1?2.8:1.6);lbl(svg,pl.X(1500)-4,pl.Y(Math.min(pm,dp(1500,d,V.L,V.mu,V.rho).dP))-6,nf(d)+' mm',cols[i],10.5,'end')});
    sv('circle',{cx:pl.X(V.Q),cy:pl.Y(Math.min(pm,r.dP)),r:5.5,fill:'#fff'},svg);var kw=V.Q/3600*r.dP*1e5/1000;
    h.out('Velocidad <strong>'+nf(r.v,2)+' m/s</strong>, Reynolds <strong>'+nf(r.Re,0)+'</strong> ('+(r.Re<2300?'laminar':'turbulento')+'), caída de presión <strong>'+nf(r.dP,1)+' bar</strong> en '+nf(V.L)+' km; potencia hidráulica <strong>≈ '+nf(kw,0)+' kW</strong>. La pérdida crece casi con el cuadrado del caudal y cae fuerte al aumentar el diámetro. Darcy-Weisbach con factor de Swamee-Jain; sin desniveles. (Valores de ejemplo.)')}
  draw(h.V)};

/* ===== MIDSTREAM: incertidumbre de la medición fiscal ===== */
W.meas=function(box,p,api){var h=mkui(box,[{k:'um',l:'Incertidumbre del medidor (caudal)',min:.05,max:1,step:.05,v:p.um||.25,f:function(v){return nf(v,2)+' %'}},{k:'ut',l:'Incertidumbre de temperatura (efecto en volumen)',min:.02,max:.5,step:.01,v:p.ut||.1,f:function(v){return nf(v,2)+' %'}},{k:'ud',l:'Incertidumbre de densidad',min:.02,max:.5,step:.01,v:p.ud||.1,f:function(v){return nf(v,2)+' %'}},{k:'us',l:'Incertidumbre de muestreo y agua/sedimento',min:.02,max:.5,step:.01,v:p.us||.15,f:function(v){return nf(v,2)+' %'}},{k:'vol',l:'Volumen anual transferido',min:.5,max:20,step:.5,v:p.vol||5,f:function(v){return nf(v,1)+' MMbbl'}},{k:'pr',l:'Precio de ejemplo',min:30,max:120,step:5,v:p.pr||70,f:function(v){return nf(v)+' USD/bbl'}}],draw,{side:true,w:700,h:340,touch:api.touch}),svg=h.svg;
  function draw(V){svg.innerHTML='';var xs=[['Medidor',V.um],['Temperatura',V.ut],['Densidad',V.ud],['Muestreo / BSW',V.us]],u=Math.sqrt(xs.reduce(function(a,x){return a+x[1]*x[1]},0)),mx=Math.max(1,u*1.2),i;
    lbl(svg,30,30,'Contribución de cada fuente (incertidumbre estándar)',TX,12);
    xs.forEach(function(x,i){var y=52+i*42;lbl(svg,30,y+14,x[0],TX,11);sv('rect',{x:190,y:y,width:300,height:20,fill:'rgba(255,255,255,.1)'},svg);sv('rect',{x:190,y:y,width:300*x[1]/mx,height:20,fill:BL},svg);lbl(svg,196+300*x[1]/mx,y+14,nf(x[1],2)+' %',TX,10.5)});
    var y=52+4*42+6;lbl(svg,30,y+14,'Combinada (raíz de suma de cuadrados)',GN,11);sv('rect',{x:190,y:y,width:300,height:22,fill:'rgba(255,255,255,.1)'},svg);sv('rect',{x:190,y:y,width:300*u/mx,height:22,fill:GN},svg);lbl(svg,196+300*u/mx,y+15,nf(u,2)+' %',GN,11);
    var U=2*u,risk=V.vol*1e6*V.pr*U/100;lbl(svg,30,y+60,'Expandida (k = 2, ≈ 95 %): ±'+nf(U,2)+' %  →  ± '+nf(risk/1e6,2)+' millones de USD por año',AM,12);
    h.out('Incertidumbre combinada <strong>'+nf(u,2)+' %</strong>; expandida (k = 2) <strong>±'+nf(U,2)+' %</strong>. Sobre '+nf(V.vol,1)+' MMbbl, equivale a unos <strong>±'+nf(risk/1e6,2)+' millones de USD por año</strong>. La mejor inversión es reducir la fuente que más pesa. Las magnitudes son de ejemplo, no de un medidor real.')}
  draw(h.V)};

/* ===== COMERCIALIZACIÓN: cobertura con put, collar y swap ===== */
W.hdg=function(box,p,api){var h=mkui(box,[{k:'ty',t:'sel',l:'Estrategia',o:[['none','Sin cobertura'],['put','Put (piso)'],['collar','Collar (piso y techo)'],['swap','Swap (precio fijo)']],v:p.ty||'put'},{k:'K1',l:'Precio piso (strike del put) / precio fijo del swap',min:40,max:100,step:1,v:p.K1||60,f:function(v){return nf(v)+' USD/bbl'}},{k:'K2',l:'Precio techo (strike del call vendido)',min:60,max:130,step:1,v:p.K2||85,f:function(v){return nf(v)+' USD/bbl'}},{k:'pm',l:'Prima neta pagada',min:0,max:10,step:.5,v:p.pm!=null?p.pm:3,f:function(v){return nf(v,1)+' USD/bbl'}},{k:'S',l:'Precio de mercado al vencimiento',min:20,max:130,step:1,v:p.S||55,f:function(v){return nf(v)+' USD/bbl'}}],draw,{side:true,w:700,h:340,touch:api.touch}),svg=h.svg;
  function inc(V,s){var K1=V.K1,K2=Math.max(V.K2,V.K1+1);if(V.ty==='none')return s;if(V.ty==='put')return Math.max(s,K1)-V.pm;if(V.ty==='collar')return Math.min(Math.max(s,K1),K2)-V.pm*.0;return K1}
  function draw(V){svg.innerHTML='';var pl=plot(svg,700,300,{l:60,r:20,t:24,b:44},[20,130],[0,130],{xl:'Precio de mercado al vencimiento (USD/bbl)',yl:'Ingreso neto por barril (USD)',nx:5,ny:5}),pts=[],base=[],s;
    for(s=20;s<=130;s+=2){base.push([s,s]);pts.push([s,inc(V,s)])}path(svg,base,pl.X,pl.Y,'rgba(255,255,255,.45)',1.6,'5 4');path(svg,pts,pl.X,pl.Y,GN,2.8);
    var r=inc(V,V.S);sv('circle',{cx:pl.X(V.S),cy:pl.Y(r),r:5.5,fill:'#fff'},svg);lbl(svg,pl.X(130)-4,pl.Y(130)+12,'Sin cobertura (línea punteada)',TX,10.5,'end');
    h.out('Con el mercado en <strong>'+nf(V.S)+'</strong>, el ingreso por barril es <strong>'+nf(r,1)+'</strong> USD con esta estrategia frente a <strong>'+nf(V.S)+'</strong> sin cobertura'+(V.ty==='put'?' (la prima de '+nf(V.pm,1)+' USD es el costo del seguro)':V.ty==='collar'?' (el techo resigna ganancia a cambio de bajar el costo; aquí se supone un collar sin prima)':V.ty==='swap'?' (el swap fija el precio: elimina riesgo y también ganancia)':'')+'. Las primas son datos de entrada, no un cálculo de valuación. Ejemplo didáctico.')}
  draw(h.V)};

/* ===== COMERCIALIZACIÓN: netback y paridad de exportación ===== */
W.nbk=function(box,p,api){var h=mkui(box,[{k:'ref',l:'Precio de referencia (crudo marcador)',min:40,max:120,step:1,v:p.ref||75,f:function(v){return nf(v)+' USD/bbl'}},{k:'dq',l:'Diferencial de calidad y ubicación',min:-15,max:5,step:.5,v:p.dq!=null?p.dq:-6,f:function(v){return nf(v,1)+' USD/bbl'}},{k:'fl',l:'Flete, seguro y gastos de puerto',min:0,max:15,step:.5,v:p.fl||4,f:function(v){return nf(v,1)+' USD/bbl'}},{k:'du',l:'Derechos de exportación (ejemplo)',min:0,max:30,step:1,v:p.du!=null?p.du:8,f:function(v){return nf(v)+' %'}},{k:'tr',l:'Transporte hasta el puerto',min:0,max:10,step:.5,v:p.tr||3,f:function(v){return nf(v,1)+' USD/bbl'}}],draw,{side:true,w:700,h:340,touch:api.touch}),svg=h.svg;
  function draw(V){svg.innerHTML='';var fob=V.ref+V.dq-V.fl,duty=Math.max(0,fob*V.du/100),nb=fob-duty-V.tr,steps=[['Referencia',V.ref,V.ref,BL],['Diferencial',V.dq,V.ref+V.dq,V.dq<0?RD:GN],['Flete y puerto',-V.fl,fob,RD],['Derechos',-duty,fob-duty,RD],['Transporte',-V.tr,nb,RD],['Netback en boca de pozo',nb,nb,GN]];
    var mx=Math.max(V.ref*1.1,10),pl=plot(svg,700,300,{l:60,r:20,t:24,b:60},[0,6],[0,mx],{nx:6,ny:5,yl:'USD por barril',xf:function(){return ''}}),i,run=0;
    steps.forEach(function(s,i){var x=pl.X(i)+8,w=pl.X(1)-pl.X(0)-16,y0,y1;if(i===0||i===5){y0=0;y1=s[1]}else{y0=s[2];y1=s[2]-s[1]}var top=Math.max(y0,y1),bot=Math.min(y0,y1);sv('rect',{x:x,y:pl.Y(top),width:w,height:Math.max(1,pl.Y(bot)-pl.Y(top)),fill:s[3],'fill-opacity':.85},svg);lbl(svg,x+w/2,pl.Y(top)-5,nf(s[1],1),'#fff',10.5,'middle');lbl(svg,x+w/2,300-34,s[0],TX,10,'middle')});
    h.out('Netback ≈ <strong>'+nf(nb,1)+' USD/bbl</strong> en boca de pozo: lo que queda del precio de referencia después de calidad, flete, derechos y transporte. Comparar el netback de exportar con el precio local es la lógica de la paridad de exportación. Los valores, incluidos los derechos, son de ejemplo y cambian por normativa.')}
  draw(h.V)};

/* ===== SEGURIDAD DE PROCESOS: LOPA ===== */
W.lopa=function(box,p,api){var h=mkui(box,[{k:'fi',l:'Frecuencia del evento iniciador (10^x por año)',min:-3,max:0,step:.5,v:p.fi!=null?p.fi:-1,f:function(v){return '10^'+nf(v,1)}},{k:'p1',l:'PFD del control básico del proceso (10^x)',min:-2,max:0,step:.5,v:p.p1!=null?p.p1:-1,f:function(v){return '10^'+nf(v,1)}},{k:'p2',l:'PFD de alarma y respuesta del operador (10^x)',min:-2,max:0,step:.5,v:p.p2!=null?p.p2:-1,f:function(v){return '10^'+nf(v,1)}},{k:'p3',l:'PFD de la válvula de alivio u otra barrera (10^x)',min:-3,max:0,step:.5,v:p.p3!=null?p.p3:-2,f:function(v){return '10^'+nf(v,1)}},{k:'tg',l:'Frecuencia tolerable (10^x por año)',min:-7,max:-3,step:.5,v:p.tg!=null?p.tg:-5,f:function(v){return '10^'+nf(v,1)}}],draw,{side:true,w:700,h:340,touch:api.touch}),svg=h.svg;
  function draw(V){svg.innerHTML='';var fm=V.fi+V.p1+V.p2+V.p3,gap=fm-V.tg,need=Math.max(0,gap),sil=need<=0?'No hace falta una función instrumentada adicional':need<=1?'SIL 1 (PFD entre 0,1 y 0,01)':need<=2?'SIL 2 (PFD entre 0,01 y 0,001)':need<=3?'SIL 3 (PFD entre 0,001 y 0,0001)':'Más de SIL 3: rediseñar el proceso';
    var X0=40,W0=620,lo=-9,hi=1,sx=function(e){return X0+(e-lo)/(hi-lo)*W0};lbl(svg,X0,28,'Frecuencia del escenario (escala logarítmica, por año)',TX,12);
    var rows=[['Iniciador',V.fi,BL],['Con control básico',V.fi+V.p1,VI],['Con alarma y operador',V.fi+V.p1+V.p2,AM],['Con alivio / barrera',fm,GN]];
    rows.forEach(function(r,i){var y=50+i*44;lbl(svg,X0,y+13,r[0],TX,11);sv('rect',{x:sx(lo),y:y+18,width:Math.max(2,sx(r[1])-sx(lo)),height:16,fill:r[2],'fill-opacity':.85},svg);lbl(svg,sx(r[1])+6,y+31,'10^'+nf(r[1],1),TX,10.5)});
    sv('line',{x1:sx(V.tg),x2:sx(V.tg),y1:44,y2:232,stroke:RD,'stroke-width':1.6,'stroke-dasharray':'5 4'},svg);lbl(svg,sx(V.tg)+5,246,'Tolerable 10^'+nf(V.tg,1),RD,11);
    h.out('Frecuencia mitigada <strong>10^'+nf(fm,1)+'</strong> por año frente a una meta de <strong>10^'+nf(V.tg,1)+'</strong>. '+(need<=0?'Cumple con las capas actuales.':'Falta reducir en un factor 10^'+nf(need,1)+': <strong>'+sil+'</strong>.')+' LOPA es una verificación de orden de magnitud: cada capa debe ser independiente y su PFD estar justificado. Valores de ejemplo.')}
  draw(h.V)};

/* ===== SEGURIDAD DE PROCESOS: matriz de riesgo 5x5 ===== */
W.rmx=function(box,p,api){var h=mkui(box,[{k:'s',l:'Severidad de la consecuencia (1 a 5)',min:1,max:5,step:1,v:p.s||4,f:function(v){return nf(v)}},{k:'l',l:'Probabilidad inicial (1 a 5)',min:1,max:5,step:1,v:p.l||4,f:function(v){return nf(v)}},{k:'b',l:'Niveles que bajan las barreras independientes',min:0,max:4,step:1,v:p.b!=null?p.b:2,f:function(v){return nf(v)}}],draw,{side:true,w:700,h:340,touch:api.touch}),svg=h.svg;
  function col(r){return r<=4?'#2f8f5b':r<=9?'#c9a227':r<=15?'#d9822b':'#c0392b'}
  function draw(V){svg.innerHTML='';var cw=54,x0=120,y0=30,i,j,l2=Math.max(1,V.l-V.b);
    for(i=1;i<=5;i++)for(j=1;j<=5;j++){sv('rect',{x:x0+(j-1)*cw,y:y0+(5-i)*cw*.9,width:cw-2,height:cw*.9-2,fill:col(i*j),'fill-opacity':.8},svg);lbl(svg,x0+(j-1)*cw+cw/2-1,y0+(5-i)*cw*.9+cw*.45+3,i*j,'#fff',10.5,'middle')}
    lbl(svg,x0+cw*2.5,y0+5*cw*.9+22,'Severidad →',TX,11,'middle');sv('text',{transform:'rotate(-90)',x:-(y0+cw*.9*2.5),y:x0-34,'text-anchor':'middle',fill:TX,'font-size':11,'font-weight':600},svg,'Probabilidad →');
    function mk(l,s,c,t){var cx=x0+(s-1)*cw+cw/2-1,cy=y0+(5-l)*cw*.9+cw*.45;sv('circle',{cx:cx,cy:cy,r:11,fill:c,stroke:'#fff','stroke-width':2},svg);lbl(svg,cx,cy+4,t,'#0b1a30',11,'middle')}
    mk(l2,V.s,GN,'B');mk(V.l,V.s,'#fff','A');var r0=V.s*V.l,r1=V.s*l2;
    lbl(svg,420,60,'A: riesgo inicial = '+r0,'#fff',12);lbl(svg,420,84,'B: con barreras = '+r1,GN,12);
    h.out('Riesgo inicial <strong>'+r0+'</strong> → con barreras <strong>'+r1+'</strong>. La matriz ordena prioridades, no mide el riesgo: cada organización define sus categorías y qué nivel es tolerable, y las barreras deben ser independientes, estar vigentes y verificarse. Ejemplo didáctico.')}
  draw(h.V)};

W.build=function(name,box,p,api){if(!W[name]){box.innerHTML='<div class="out">Laboratorio no disponible: '+name+'</div>';return{}}return W[name](box,p||{},api||{touch:function(){}})||{}};
})();
