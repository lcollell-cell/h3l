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

/* ===== MAPA DE COMPETENCIAS (curso) se dibuja en player.js ===== */
W.build=function(name,box,p,api){if(!W[name]){box.innerHTML='<div class="out">Laboratorio no disponible: '+name+'</div>';return{}}return W[name](box,p||{},api||{touch:function(){}})||{}};
})();
