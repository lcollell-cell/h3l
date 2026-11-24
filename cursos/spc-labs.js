/* H3L · Cursos · laboratorios del curso "Seguridad de procesos y control de pozos" (spc).
   Usan los modelos de spc-model.js (verificados con tools/verificar_spc.py) y los helpers de widgets.js (HW._u).
   Todos los valores son de EJEMPLO con fines didácticos: no reemplazan los procedimientos del operador ni una certificación de control de pozo. */
(function(){'use strict';
var W=window.HW,U=W&&W._u,M=window.SPM;if(!W||!U||!M)return;
var sv=U.sv,nf=U.nf,mkui=U.mkui,plot=U.plot,path=U.path,lbl=U.lbl,wrap=U.wrap,src=U.src,TX=U.TX,GR=U.GR,GN=U.GN,AM=U.AM,BL=U.BL,RD=U.RD,VI=U.VI,G=M.G;
function psi(v){return nf(v)+' psi'}
function ok(t){return '<strong style="color:'+GN+'">'+t+'</strong>'}
function bad(t){return '<strong style="color:'+RD+'">'+t+'</strong>'}
function box_(par,x,y,w,hh,fill,stroke,r){return sv('rect',{x:x,y:y,width:w,height:hh,rx:r==null?5:r,fill:fill,stroke:stroke||'none','stroke-width':1.4},par)}

/* ===== 1 · hoja de control y circulación del influjo (burbuja de gas, presión de fondo constante) ===== */
W.spc_kill=function(box,p,api){
  var B={mw:10,tvd:10000,scr:700,ca:.0459,dpVol:150,pump:.1,gg:.1};
  var h=mkui(box,[
    {k:'m',l:'Método de control',t:'sel',v:p.m||'driller1',o:[['driller1','Perforador · 1.ª circulación'],['ww','Esperar y densificar'],['driller2','Perforador · 2.ª circulación']]},
    {k:'sid',l:'SIDPP',min:100,max:1200,step:20,v:p.sid||520,f:psi},
    {k:'gain',l:'Ganancia en piletas',min:5,max:60,step:1,v:p.gain||20,f:function(v){return nf(v)+' bbl'}},
    {k:'shoe',l:'Profundidad del zapato',min:3000,max:9000,step:250,v:p.shoe||6000,f:function(v){return nf(v)+' ft'}},
    {k:'fg',l:'Gradiente de fractura en el zapato',min:11.5,max:16,step:.1,v:p.fg||14.5,f:function(v){return nf(v,1)+' ppg'}}
  ],draw,{side:true,w:640,h:380,touch:api.touch}),svg=h.svg;
  function draw(V){svg.innerHTML='';
    var a={mw:B.mw,tvd:B.tvd,sidpp:V.sid,scr:B.scr,gain:V.gain,ca:B.ca,dpVol:B.dpVol,annVol:B.ca*B.tvd,pump:B.pump,shoeTvd:V.shoe,fg:V.fg,gg:B.gg};
    a.sicp=V.sid+(V.gain/B.ca)*(G*B.mw-B.gg);
    var r=M.circ(a,V.m),k=r.kill,xmax=r.pts[r.pts.length-1].st,ymax=Math.ceil(Math.max(r.frac,r.maxPc,k.icp)*1.08/500)*500;
    var P=plot(svg,640,380,{l:58,r:16,t:26,b:46},[0,xmax],[0,ymax],{nx:5,ny:5,xl:'Emboladas bombeadas desde el inicio',yl:'Presión (psi)',xf:function(v){return nf(v)},yf:function(v){return nf(v)}});
    var dpp=[],pc=[],ps=[];r.pts.forEach(function(q){dpp.push([q.st,q.dpp]);pc.push([q.st,q.pc]);ps.push([q.st,q.psh])});
    sv('line',{x1:P.m.l,x2:P.m.l+P.w,y1:P.Y(r.frac),y2:P.Y(r.frac),stroke:RD,'stroke-width':1.6,'stroke-dasharray':'6 4'},svg);lbl(svg,P.m.l+P.w-4,P.Y(r.frac)-5,'Fractura en el zapato '+nf(r.frac)+' psi',RD,10.5,'end');
    path(svg,dpp,P.X,P.Y,AM,2.2,'5 4');path(svg,ps,P.X,P.Y,BL,2.4);path(svg,pc,P.X,P.Y,GN,2.8);
    var mp=r.pts.reduce(function(m,q){return q.pc>m.pc?q:m},r.pts[0]);sv('circle',{cx:P.X(mp.st),cy:P.Y(mp.pc),r:5,fill:'#fff'},svg);
    lbl(svg,P.m.l+8,P.m.t+12,'— Presión de bombeo (DPP)',AM,10.5);lbl(svg,P.m.l+8,P.m.t+26,'— Presión en el casing (choke)',GN,10.5);lbl(svg,P.m.l+8,P.m.t+40,'— Presión en el zapato',BL,10.5);
    var gmax=k.maasp>V.sid?(k.maasp-V.sid)*B.ca/(G*B.mw-B.gg):0,s='Peso de control <strong>'+nf(k.kmw,2)+' ppg</strong>; ICP <strong>'+psi(k.icp)+'</strong>; FCP <strong>'+psi(k.fcp)+'</strong>. Influjo: gradiente estimado '+nf(k.grad,2)+' psi/ft, <strong>'+k.type+'</strong>. ';
    s+='Pico en el casing <strong>'+psi(r.maxPc)+'</strong> (a las '+nf(r.maxPcStrokes)+' emboladas); pico en el zapato <strong>'+psi(r.maxPsh)+'</strong>. Tolerancia de la surgencia con esta SIDPP: ≈ <strong>'+nf(gmax)+' bbl</strong>.<br>';
    if(r.lost)s+=bad('El pico en el zapato supera la fractura: riesgo de pérdidas y de reventón subterráneo.')+' Contingencia: con el mismo influjo, Esperar y densificar da menos presión en el casing que la 1.ª circulación del perforador; además se puede reducir el caudal y consultar al supervisor por alternativas (método volumétrico o dejar el pozo cerrado) antes de superar la fractura. ';
    else s+=ok('El pico queda por debajo de la fractura en el zapato.')+' Mantené la DPP según la hoja y ajustá el choke de a poco. ';
    if(V.m==='driller2')s+='En la 2.ª circulación se bombea el lodo de control: la presión del casing se mantiene en la SIDPP hasta que el lodo pesado llena el anular.';
    h.out(s+src(h,'Grace, R. D., Blowout and Well Control Handbook (Gulf Professional), modelo didáctico de burbuja única de gas ideal a presión de fondo constante, sin disolución en el lodo ni deslizamiento. Ejemplo didáctico, no reemplaza una certificación IWCF o IADC WellSharp.'))}
  draw(h.V)};

/* ===== 2 · BOP: selección, presión de prueba y cierre ===== */
W.spc_bop=function(box,p,api){
  var h=mkui(box,[
    {k:'sc',l:'Situación',t:'sel',v:p.sc||'pipe',o:[['pipe','Cuerpo de tubo frente a los arietes'],['joint','Junta de herramienta frente al ariete'],['nopipe','Sin tubería en el pozo'],['shear','Emergencia: cortar la sarta']]},
    {k:'pf',l:'Presión de formación',min:3000,max:14000,step:250,v:p.pf||9000,f:psi},
    {k:'tvd',l:'Profundidad vertical',min:6000,max:18000,step:500,v:p.tvd||12000,f:function(v){return nf(v)+' ft'}},
    {k:'rwp',l:'Presión de trabajo nominal del BOP (RWP)',t:'sel',v:p.rwp||10000,o:[[3000,'3.000 psi'],[5000,'5.000 psi'],[10000,'10.000 psi'],[15000,'15.000 psi']]},
    {k:'an',l:'Diámetro del anular',t:'sel',v:'s',o:[['s','menor de 18¾ in'],['l','18¾ in o mayor']]},
    {k:'tc',l:'Tiempo de cierre medido (arietes y anular)',min:10,max:60,step:1,v:p.tc||25,f:function(v){return nf(v)+' s'}}
  ],draw,{side:true,w:640,h:400,touch:api.touch}),svg=h.svg;
  var T={pipe:{hl:[0,1],c:GN,t:'Con el cuerpo del tubo frente a los arietes se cierra el anular o el ariete de tubería. El anular sella sobre distintas formas y permite maniobrar la sarta; el ariete sella sobre un diámetro definido y se traba.'},
    joint:{hl:[1],c:RD,t:'No se cierra un ariete sobre una junta de herramienta: no sella y se daña. Se reespacia la sarta para que quede el cuerpo del tubo frente al ariete; mientras tanto se puede cerrar el anular.'},
    nopipe:{hl:[2],c:GN,t:'Sin tubería se cierra el ariete ciego: sella el pozo vacío. No se cierra sobre la sarta.'},
    shear:{hl:[2],c:AM,t:'El ariete ciego-cortante corta la sarta y sella. Es el último recurso: corta solo dentro de sus límites de diseño y con la junta fuera de las cuchillas; después se pierde la sarta.'}};
  function draw(V){svg.innerHTML='';sv('rect',{width:640,height:400,fill:'rgba(10,30,50,.5)'},svg);var cx=170,t=T[V.sc];
    var els=[['Anular',40,52,150],['Ariete de tubería',100,40,150],['Ariete ciego-cortante (BSR)',150,40,150],['Ariete de tubería inferior',200,40,150]];
    lbl(svg,10,16,'Conjunto de BOP de superficie (esquema genérico)',TX,10);
    box_(svg,cx-14,246,28,110,'#1a3550','#8ea2bd',3);box_(svg,cx-55,246,110,28,'rgba(255,255,255,.1)','#8ea2bd',3);
    lbl(svg,cx+60,264,'Línea del choke',BL,10);sv('line',{x1:cx+55,y1:260,x2:cx+130,y2:260,stroke:BL,'stroke-width':3},svg);lbl(svg,cx-60,264,'Línea de kill',VI,10,'end');sv('line',{x1:cx-55,y1:260,x2:cx-130,y2:260,stroke:VI,'stroke-width':3},svg);
    els.forEach(function(e,i){var on=t.hl.indexOf(i)>=0,wd=i===0?120:130;box_(svg,cx-wd/2,e[1],wd,e[2],on?t.c:'rgba(255,255,255,.08)',on?'#fff':'#8ea2bd',8);lbl(svg,cx+wd/2+10,e[1]+e[2]/2+4,e[0],on?'#fff':TX,11)});
    if(V.sc!=='nopipe'){sv('rect',{x:cx-5,y:6,width:10,height:350,fill:'#c9c3b5',opacity:.85},svg);if(V.sc==='joint')sv('rect',{x:cx-10,y:112,width:20,height:16,fill:'#e8a15a'},svg)}
    var masp=V.pf-.1*V.tvd,okR=V.rwp>=masp,lim=V.an==='l'?45:30,okT=V.tc<=30,okA=V.tc<=lim;
    wrap(svg,330,300,t.t,TX,10.5,48,13);
    var s='Presión máxima esperada en superficie (MASP) ≈ <strong>'+psi(masp)+'</strong> (formación menos un gradiente de gas de 0,1 psi/ft). '+(okR?ok('El BOP de '+nf(V.rwp)+' psi cubre la MASP.'):bad('El BOP de '+nf(V.rwp)+' psi NO cubre la MASP: se necesita una clase mayor.'))+'<br>';
    s+='Pruebas: baja 250 a 350 psi; alta en arietes a su RWP (<strong>'+psi(V.rwp)+'</strong>) y en el anular al 70 % de su RWP (<strong>'+psi(.7*V.rwp)+'</strong>). Frecuencia: no más de 21 días según API Std 53; en aguas federales de EE. UU., 14 días (30 CFR 250.737).<br>';
    s+='Cierre medido '+nf(V.tc)+' s: arietes '+(okT?ok('cumple (≤ 30 s)'):bad('no cumple (límite 30 s)'))+'; anular '+(okA?ok('cumple (≤ '+lim+' s)'):bad('no cumple (límite '+lim+' s)'))+'. Si no cumple: no se continúa; se corrige el acumulador o el sistema de control y se repite la prueba.';
    h.out(s+src(h,'API Standard 53 (sistemas de BOP) y 30 CFR 250.737. Cifras de ejemplo; en cada país rige la norma aplicable.'))}
  draw(h.V)};

/* ===== 3 · cementación: hidrostática, ventana, volumen y U-tube ===== */
W.spc_cem=function(box,p,api){
  var h=mkui(box,[
    {k:'lr',l:'Densidad de la lechada guía',min:11,max:14.5,step:.1,v:p.lr||13.5,f:function(v){return nf(v,1)+' ppg'}},
    {k:'tr',l:'Densidad de la lechada de cola',min:14.5,max:17,step:.1,v:p.tr||15.8,f:function(v){return nf(v,1)+' ppg'}},
    {k:'tl',l:'Largo de la lechada de cola',min:500,max:3000,step:100,v:p.tl||1500,f:function(v){return nf(v)+' ft'}},
    {k:'ex',l:'Exceso de volumen',min:0,max:100,step:5,v:p.ex!=null?p.ex:30,f:function(v){return nf(v)+' %'}},
    {k:'fr',l:'Fricción en el anular durante el bombeo',min:0,max:800,step:25,v:p.fr!=null?p.fr:250,f:psi},
    {k:'po',l:'Presión de poro del tramo (ppg eq.)',min:8.5,max:13,step:.1,v:p.po||9,f:function(v){return nf(v,1)+' ppg'}},
    {k:'fg',l:'Fractura del tramo (ppg eq.)',min:12,max:17,step:.1,v:p.fg||15,f:function(v){return nf(v,1)+' ppg'}}
  ],draw,{side:true,w:640,h:400,touch:api.touch}),svg=h.svg;
  function col(r){var t=Math.max(0,Math.min(1,(r-9)/8));return 'hsl('+(210-t*170)+',55%,'+(52-t*8)+'%)'}
  function draw(V){svg.innerHTML='';sv('rect',{width:640,height:400,fill:'rgba(10,30,50,.5)'},svg);
    var a={tvd:10000,dh:8.5,dpo:7,dpi:6.276,mw:10.5,sp:{rho:11.5,len:500},lead:{rho:V.lr,len:1500},tail:{rho:V.tr,len:V.tl},excess:V.ex/100,st:80,dispRho:10.5,pore:V.po,frac:V.fg,fric:V.fr,pump:.1,yield:1.2};
    var r=M.cement(a),y0=34,H=320,sc=H/a.tvd,y=y0;lbl(svg,10,16,'Columna anular al terminar el desplazamiento (TVD 10.000 ft)',TX,10);
    r.cols.slice().reverse().forEach(function(c){var hh=c.len*sc;if(hh<=0)return;box_(svg,50,y,110,hh,col(c.rho),'rgba(255,255,255,.4)',2);if(hh>16)lbl(svg,105,y+hh/2+4,nf(c.rho,1)+' ppg','#fff',10.5,'middle');lbl(svg,168,y+Math.min(hh/2+4,hh-2),c.n+' · '+nf(c.len)+' ft',TX,10);y+=hh});
    var X0=330,X1=620,sx=function(v){return X0+(v-8)/(18-8)*(X1-X0)};
    lbl(svg,X0,22,'Ventana de presión (ppg equivalentes)',TX,10.5);
    sv('rect',{x:sx(8),y:50,width:sx(V.po)-sx(8),height:40,fill:BL,'fill-opacity':.35},svg);lbl(svg,sx(8)+4,74,'poro '+nf(V.po,1),'#fff',10.5);
    sv('rect',{x:sx(V.fg),y:50,width:sx(18)-sx(V.fg),height:40,fill:RD,'fill-opacity':.35},svg);lbl(svg,sx(18)-4,74,'fractura '+nf(V.fg,1),'#fff',10.5,'end');
    sv('rect',{x:sx(V.po),y:50,width:sx(V.fg)-sx(V.po),height:40,fill:GN,'fill-opacity':.14},svg);
    [[r.rhoEq,'estática',GN],[r.ecd,'durante el bombeo',AM]].forEach(function(q,i){var x=sx(Math.min(18,Math.max(8,q[0])));sv('line',{x1:x,x2:x,y1:46,y2:96,stroke:q[2],'stroke-width':3},svg);lbl(svg,x,112+i*15,nf(q[0],2)+' ppg · '+q[1],q[2],10.5,'middle')});
    for(var v=8;v<=18;v+=2){sv('line',{x1:sx(v),x2:sx(v),y1:90,y2:95,stroke:TX},svg);lbl(svg,sx(v),104,nf(v),TX,9.5,'middle')}
    var okH=r.okHigh,okL=r.okLow,s='Equivalente estático <strong>'+nf(r.rhoEq,2)+' ppg</strong>; con fricción <strong>'+nf(r.ecd,2)+' ppg</strong>. '+(okH&&okL?ok('Dentro de la ventana con margen.'):'');
    if(!okH)s+=bad('El equivalente dinámico se acerca o supera la fractura: riesgo de pérdidas y de cemento sin subir.')+' Contingencia: bajar la densidad de la lechada guía, reducir el caudal de desplazamiento, cementar por etapas o usar lechada liviana (la espumada exige controlar su estabilidad). ';
    if(!okL)s+=bad('La hidrostática queda cerca de la presión de poro: riesgo de influjo mientras fragua.')+' Contingencia: subir la densidad o el largo de la columna pesada. ';
    s+='<br>Volumen de cemento (guía + cola, con exceso): <strong>'+nf(r.volCem,0)+' bbl</strong> (≈ '+nf(r.sacks,0)+' sacos); volumen del shoe track: '+nf(r.volST,1)+' bbl; desplazamiento hasta el collar: '+nf(r.volDisp,0)+' bbl (<strong>'+nf(r.stkDisp,0)+' emboladas</strong>). ';
    s+='Al terminar, la columna del anular pesa '+(r.dpU>0?'<strong>'+psi(r.dpU)+' más</strong> que la de la cañería (efecto U-tube): el equipo de flotación debe sostenerla y hay que verificar que no retorne.':'menos que la de la cañería.');
    h.out(s+src(h,'API RP 65-2 (aislamiento de zonas) y fórmulas estándar de cementación (p. ej., Nelson y Guillot, Well Cementing, Schlumberger). Geometría y fluidos de ejemplo; no es un diseño de cementación.'))}
  draw(h.V)};

/* ===== 4 · prueba de presión negativa: interpretar y decidir ===== */
W.spc_neg=function(box,p,api){
  var verdict='';
  var h=mkui(box,[
    {k:'leak',l:'Comunicación de la barrera con la formación',min:0,max:100,step:5,v:p.leak!=null?p.leak:0,f:function(v){return nf(v)+' %'}},
    {k:'kl',l:'Estado de la línea de kill',t:'sel',v:p.kl||'ok',o:[['ok','Despejada'],['plug','Con obstrucción o tapón']]},
    {k:'len',l:'Fluido liviano en el pozo',min:4000,max:12000,step:500,v:p.len||8000,f:function(v){return nf(v)+' ft'}},
    {k:'tmin',l:'Tiempo de observación',min:5,max:60,step:5,v:p.tmin||30,f:function(v){return nf(v)+' min'}},
    {t:'btn',l:'Aprobar la prueba y seguir',fn:function(V){verdict=decide(V,true)}},
    {t:'btn',l:'Rechazar: investigar y restablecer la barrera',fn:function(V){verdict=decide(V,false)}}
  ],draw,{side:true,w:640,h:400,touch:api.touch}),svg=h.svg;
  var base={pf:12636,tvd:18000,mw:14,dispRho:8.6};
  function state(V){var n=M.negTest({pf:base.pf,tvd:base.tvd,mw:base.mw,dispRho:base.dispRho,dispLen:V.len,leak:V.leak/100}),flow=V.leak>5,dp=flow?n.pBuild:0,kl=V.kl==='plug'?0:dp;
    return{n:n,dp:dp,kl:kl,flow:flow,pass:dp<=5&&kl<=5&&!flow&&V.tmin>=30}}
  function decide(V,approve){var s=state(V);
    if(approve&&s.pass)return ok('Decisión correcta: sin flujo, presión cero en ambas líneas y observación suficiente.');
    if(approve&&!s.pass){var why=!s.flow&&V.tmin<30?'la observación fue menor a 30 minutos.':'hay presión o flujo, o las lecturas no coinciden.';return bad('Decisión incorrecta: aprobar una prueba no concluyente es el error que contribuyó al accidente de Macondo ('+why+')')}
    if(!approve&&s.pass)return 'La prueba era válida: rechazarla cuesta tiempo pero no riesgo. Revisá si el criterio de aceptación estaba claro antes de empezar.';
    return ok('Decisión correcta: la prueba no es concluyente. No se continúa; se investiga, se restablece la barrera (p. ej., circular y reacondicionar, cemento correctivo) y se repite.')}
  function gauge(x,y,t,v,col){sv('circle',{cx:x,cy:y,r:34,fill:'rgba(255,255,255,.07)',stroke:col,'stroke-width':3},svg);lbl(svg,x,y+4,nf(v),'#fff',15,'middle');lbl(svg,x,y+52,t,TX,10.5,'middle');lbl(svg,x,y-42,'psi',TX,9.5,'middle')}
  function draw(V,srcK){if(srcK)verdict='';svg.innerHTML='';sv('rect',{width:640,height:400,fill:'rgba(10,30,50,.5)'},svg);var s=state(V);
    lbl(svg,10,16,'Prueba de presión negativa (esquema de ejemplo)',TX,10);
    var col=s.pass?GN:(s.dp>5||s.kl>5?RD:AM);
    box_(svg,80,50,22,300,'#1a3550','#8ea2bd',3);box_(svg,30,50,16,300,'#1a3550','#8ea2bd',3);lbl(svg,38,368,'Kill',TX,10,'middle');lbl(svg,91,368,'Sarta',TX,10,'middle');
    var hl=V.len/base.tvd*300;box_(svg,82,52,18,hl,'#7fa6f0','none',0);lbl(svg,112,60+hl/2,'fluido liviano '+nf(V.len)+' ft',BL,10);
    gauge(250,95,'Sarta (SIDPP)',s.dp,s.dp>5?RD:GN);gauge(250,225,'Línea de kill',s.kl,s.kl>5?RD:GN);
    lbl(svg,340,70,'Subbalance aplicado a la barrera:',TX,11);lbl(svg,340,88,nf(s.n.underbalance)+' psi',AM,16);
    lbl(svg,340,125,'Flujo al tanque: '+(s.flow?'SÍ':'no'),s.flow?RD:GN,12);
    lbl(svg,340,150,'Lecturas coherentes: '+(Math.abs(s.dp-s.kl)<=5?'sí':'NO'),Math.abs(s.dp-s.kl)<=5?GN:RD,12);
    lbl(svg,340,175,'Observación: '+nf(V.tmin)+' min',V.tmin>=30?GN:AM,12);
    wrap(svg,340,215,'Criterio de aceptación: sin flujo y presión estable en cero, después de sangrar, en todas las líneas y durante el tiempo definido (≥ 30 min es un valor usual). Una presión que reaparece o lecturas distintas entre la sarta y la línea no se explican con efectos curiosos: se investigan.',TX,10.5,44,13);
    var txt='Con la barrera comunicada al <strong>'+nf(V.leak)+' %</strong> se espera una presión de <strong>'+psi(s.dp)+'</strong> en la sarta. '+(s.pass?ok('La prueba es válida.'):bad('La prueba NO es concluyente.'))+(s.dp>5&&s.kl<=5?' <strong>Lecturas incoherentes:</strong> la sarta muestra presión y la línea de kill no.':'');
    h.out(txt+(verdict?'<br>'+verdict:'<br>Elegí si aprobás o rechazás la prueba.')+src(h,'CSB (2016), informe del accidente de Macondo (aceptó una prueba con lecturas inconsistentes entre la sarta y la línea de kill). Ejemplo didáctico.'))}
  draw(h.V,'x')};

/* ===== 5 · pérdida de contención: caudal, masa liberada y efecto del aislamiento ===== */
W.spc_loc=function(box,p,api){
  var FL={gas:{fluid:'gas',p:4,T:310,gamma:1.3,mw:.0187,z:.9,rho:0,cd:.9,n:'Gas natural a 4 MPa (manométrica)'},oil:{fluid:'liquid',p:1.5,T:310,gamma:0,mw:0,z:1,rho:820,cd:.61,n:'Petróleo (820 kg/m³) a 1,5 MPa'}};
  var h=mkui(box,[
    {k:'f',l:'Fluido',t:'sel',v:p.f||'gas',o:[['gas',FL.gas.n],['oil',FL.oil.n]]},
    {k:'d',l:'Tamaño del agujero',t:'sel',v:p.d||25,o:[[6.4,'¼ in (6,4 mm) · pequeño'],[25,'1 in (25 mm) · mediano'],[102,'4 in (102 mm) · grande'],[300,'Rotura de línea (≈ 300 mm)']]},
    {k:'inv',l:'Inventario aislable',min:500,max:50000,step:500,v:p.inv||8000,f:function(v){return nf(v)+' kg'}},
    {k:'det',l:'Tiempo hasta detectar',min:5,max:600,step:5,v:p.det||60,f:function(v){return nf(v)+' s'}},
    {k:'iso',l:'Tiempo hasta aislar',min:10,max:1800,step:10,v:p.iso||120,f:function(v){return nf(v)+' s'}}
  ],draw,{side:true,w:640,h:380,touch:api.touch}),svg=h.svg;
  function calc(V,det,iso){var f=FL[V.f];return M.release({fluid:f.fluid,p:f.p,T:f.T,dHole:V.d,cd:f.cd,rho:f.rho,gamma:f.gamma,mw:f.mw,z:f.z,inv:V.inv,tDet:det,tIso:iso})}
  function draw(V){svg.innerHTML='';var r=calc(V,V.det,V.iso),fast=calc(V,30,60),f=FL[V.f],tmax=Math.max(600,Math.min(1800,(V.det+V.iso)*1.4)),ymax=Math.max(500,Math.ceil(Math.max(r.mass,fast.mass,r.W*tmax>V.inv?V.inv:r.W*tmax)*1.1/500)*500);
    var P=plot(svg,640,380,{l:62,r:16,t:22,b:44},[0,tmax],[0,ymax],{nx:6,ny:5,xl:'Tiempo desde el inicio de la fuga (s)',yl:'Masa liberada acumulada (kg)',xf:function(v){return nf(v)},yf:function(v){return nf(v)}});
    function curve(det,iso,col,dash){var pts=[],t,tt=det+iso;for(t=0;t<=tmax;t+=tmax/90){pts.push([t,Math.min(V.inv,r.W*Math.min(t,tt))])}path(svg,pts,P.X,P.Y,col,2.6,dash)}
    curve(30,60,GN,'6 4');curve(V.det,V.iso,AM);
    sv('line',{x1:P.X(Math.min(tmax,V.det+V.iso)),x2:P.X(Math.min(tmax,V.det+V.iso)),y1:P.m.t,y2:P.m.t+P.h,stroke:AM,'stroke-dasharray':'3 4'},svg);lbl(svg,P.X(Math.min(tmax,V.det+V.iso))+4,P.m.t+14,'aislado',AM,10.5);
    if(f.fluid==='gas'){sv('line',{x1:P.m.l,x2:P.m.l+P.w,y1:P.Y(500),y2:P.Y(500),stroke:RD,'stroke-dasharray':'6 4'},svg);lbl(svg,P.m.l+P.w-4,P.Y(500)-5,'500 kg (Tier 1, API RP 754)',RD,10.5,'end')}
    lbl(svg,P.m.l+8,P.m.t+14,'— Con la detección y el aislamiento elegidos',AM,10.5);lbl(svg,P.m.l+8,P.m.t+28,'- - ESD rápido (30 s + 60 s)',GN,10.5);
    var s='Caudal inicial <strong>'+nf(r.W,r.W<10?2:1)+' kg/s</strong>'+(f.fluid==='gas'?(r.choked?' (flujo bloqueado o sónico)':' (flujo subcrítico)'):'')+'. Masa liberada hasta aislar <strong>'+nf(r.mass)+' kg</strong>'+(r.limited?' (se agota el inventario aislable)':'')+'; con ESD rápido, '+nf(fast.mass)+' kg. ';
    if(f.fluid==='gas')s+=(r.mass>=500?bad('Supera los 500 kg en una hora: evento Tier 1 de seguridad de procesos (API RP 754).'):ok('Queda por debajo de 500 kg.'))+' ';
    else s+='Volumen liberado ≈ <strong>'+nf(r.mass/f.rho,1)+' m³</strong>: la contención secundaria (dique) debe retenerlo. ';
    s+='Cada 60 s de demora en aislar suma ≈ '+nf(Math.min(r.W*60,V.inv))+' kg. Contingencia: parada de emergencia (ESD), aislar el inventario, despresurizar al sistema de alivio, eliminar fuentes de ignición, evacuar a favor del viento.';
    h.out(s+src(h,'Ecuaciones de orificio (líquido: Bernoulli; gas: flujo bloqueado) con Cd de ejemplo; CCPS, Guidelines for Consequence Analysis; umbral de API RP 754. Modelo de caudal constante (conservador). Ejemplo didáctico.'))}
  draw(h.V)};

/* ===== 6 · corrosión: resistencia remanente (B31G modificado) y vida remanente ===== */
W.spc_b31g=function(box,p,api){
  var PIPES={a:{D:508,t:7.9,n:'Línea de 20 in × 7,9 mm'},b:{D:323.9,t:6.4,n:'Línea de 12¾ in × 6,4 mm'},c:{D:219.1,t:8.2,n:'Línea de 8⅝ in × 8,2 mm'}};
  var h=mkui(box,[
    {k:'pp',l:'Cañería',t:'sel',v:p.pp||'a',o:[['a',PIPES.a.n],['b',PIPES.b.n],['c',PIPES.c.n]]},
    {k:'gr',l:'Grado (SMYS)',t:'sel',v:p.gr||359,o:[[290,'X42 · 290 MPa'],[359,'X52 · 359 MPa'],[414,'X60 · 414 MPa'],[448,'X65 · 448 MPa']]},
    {k:'dt',l:'Profundidad del defecto (d/t)',min:5,max:85,step:1,v:p.dt||40,f:function(v){return nf(v)+' %'}},
    {k:'L',l:'Largo axial del defecto',min:10,max:600,step:10,v:p.L||100,f:function(v){return nf(v)+' mm'}},
    {k:'mp',l:'Presión máxima de operación (MAOP)',min:2,max:12,step:.5,v:p.mp||6,f:function(v){return nf(v,1)+' MPa'}},
    {k:'cr',l:'Velocidad de corrosión',min:0,max:1,step:.05,v:p.cr!=null?p.cr:.2,f:function(v){return nf(v,2)+' mm/año'}}
  ],draw,{side:true,w:640,h:380,touch:api.touch}),svg=h.svg;
  function mk(V,dt){var pp=PIPES[V.pp];return M.b31g({D:pp.D,t:pp.t,smys:V.gr,d:dt/100*pp.t,L:V.L,F:.72,maop:V.mp,cr:V.cr})}
  function draw(V){svg.innerHTML='';var r=mk(V,V.dt),pts=[],pts2=[],x;
    for(x=5;x<=85;x+=2){pts.push([x,Math.min(3,mk(V,x).erf)]);var v2={pp:V.pp,gr:V.gr,L:V.L*2,mp:V.mp,cr:V.cr};pts2.push([x,Math.min(3,mk(v2,x).erf)])}
    var P=plot(svg,640,380,{l:56,r:16,t:22,b:44},[0,90],[0,3],{nx:6,ny:6,xl:'Profundidad del defecto d/t (%)',yl:'Factor de reparación estimado (ERF)',xf:function(v){return nf(v)},yf:function(v){return nf(v,1)}});
    sv('line',{x1:P.m.l,x2:P.m.l+P.w,y1:P.Y(1),y2:P.Y(1),stroke:RD,'stroke-width':1.6,'stroke-dasharray':'6 4'},svg);lbl(svg,P.m.l+P.w-4,P.Y(1)-5,'ERF = 1: reparar o bajar presión',RD,10.5,'end');
    path(svg,pts2,P.X,P.Y,VI,2,'5 4');path(svg,pts,P.X,P.Y,GN,2.8);sv('circle',{cx:P.X(V.dt),cy:P.Y(Math.min(3,r.erf)),r:6,fill:r.pass?GN:RD,stroke:'#fff','stroke-width':2},svg);
    lbl(svg,P.m.l+8,P.m.t+14,'— largo '+nf(V.L)+' mm',GN,10.5);lbl(svg,P.m.l+8,P.m.t+28,'- - largo '+nf(V.L*2)+' mm (el doble)',VI,10.5);
    var pp=PIPES[V.pp],s='Presión de falla estimada <strong>'+nf(r.Pf,1)+' MPa</strong>; presión segura (× 0,72) <strong>'+nf(r.Ps,1)+' MPa</strong>; ERF = MAOP / presión segura = <strong>'+nf(r.erf,2)+'</strong>. ';
    if(V.dt>80)s+=bad('Más del 80 % del espesor: fuera del alcance del método. Reparar o reemplazar.')+' ';
    else if(r.erf>=1)s+=bad('No aceptable a esta presión.')+' Contingencia: bajar la presión de operación por debajo de '+nf(r.Ps,1)+' MPa de inmediato, programar la reparación (camisa o reemplazo de tramo) y verificar con inspección en línea. ';
    else s+=ok('Aceptable hoy.')+' '+(V.cr>0?'Con '+nf(V.cr,2)+' mm/año de corrosión el ERF llega a 1 en ≈ <strong>'+nf(r.yearsToLimit,1)+' años</strong>; la próxima inspección no debería pasar de la mitad de ese plazo (≈ <strong>'+nf(r.pint,1)+' años</strong>).':'Sin corrosión activa, el defecto se vigila.')+' ';
    h.out(s+src(h,'ASME B31G (método modificado, 0,85 dL, tensión de flujo SMYS + 10 ksi) y el criterio de la mitad de la vida remanente para el intervalo de inspección (API 570). Solo pérdida de metal; no cubre fisuras ni fatiga. Ejemplo didáctico.'))}
  draw(h.V)};

/* ===== 7 · tapones de abandono: barreras, longitud y verificación ===== */
W.spc_abd=function(box,p,api){
  var h=mkui(box,[
    {k:'z',l:'Zona a aislar',t:'sel',v:p.z||'hc',o:[['hc','Con hidrocarburos o presión: flujo posible a superficie'],['cf','Sin hidrocarburos, con riesgo de flujo cruzado']]},
    {k:'len',l:'Largo del tapón de cemento',min:20,max:200,step:5,v:p.len||60,f:function(v){return nf(v)+' m'}},
    {k:'base',l:'Base del tapón',t:'sel',v:p.base||'no',o:[['no','Sin base mecánica'],['si','Con base mecánica o tapón de apoyo']]},
    {k:'env',l:'Envolventes de barrera',t:'sel',v:p.env||1,o:[[1,'Una'],[2,'Dos (primaria y secundaria)']]},
    {k:'ver',l:'Verificado con tag y prueba de presión',t:'chk',v:!!p.ver}
  ],draw,{side:true,w:640,h:400,touch:api.touch}),svg=h.svg;
  function draw(V){svg.innerHTML='';sv('rect',{width:640,height:400,fill:'rgba(10,30,50,.5)'},svg);lbl(svg,10,16,'Pozo con tapones de abandono (esquema genérico)',TX,10);
    var cx=150;box_(svg,cx-36,30,6,340,'#8ea2bd','none',0);box_(svg,cx+30,30,6,340,'#8ea2bd','none',0);
    box_(svg,cx-30,300,60,50,V.z==='hc'?AM:BL,'none',0);lbl(svg,cx+44,328,V.z==='hc'?'Zona con hidrocarburos':'Zona con riesgo de flujo cruzado',TX,10.5);
    var req=V.z==='hc'?2:1,minL=V.base==='si'?50:100,okE=V.env>=req,okL=V.len>=minL,sc=1.1,n=V.env;
    for(var i=0;i<n;i++){var y=285-i*(V.len*sc+22)-V.len*sc;box_(svg,cx-30,y,60,V.len*sc,'#c9c3b5','#fff',2);lbl(svg,cx+44,y+V.len*sc/2+4,(i?'Secundario':'Primario')+' · '+nf(V.len)+' m',TX,10.5)}
    if(V.base==='si')box_(svg,cx-30,288,60,8,VI,'none',1);
    var s='Para esta zona se requieren <strong>'+req+'</strong> envolvente'+(req>1?'s':'')+' de barrera y un tapón de al menos <strong>'+minL+' m</strong> '+(V.base==='si'?'(con base mecánica)':'(sin base mecánica)')+'. ';
    s+=(okE?ok('✓ Envolventes suficientes. '):bad('✗ Faltan envolventes: con flujo posible a superficie se exigen dos. '))+(okL?ok('✓ Largo suficiente. '):bad('✗ Tapón corto. '))+(V.ver?ok('✓ Verificado. '):bad('✗ Sin verificar: un tapón no probado no cuenta como barrera. '));
    var all=okE&&okL&&V.ver;s+='<br>'+(all?ok('El abandono cumple el criterio de este ejemplo.'):bad('No cumple: no se da por abandonado el pozo.')+' Contingencia: agregar el tapón que falta, alargarlo o asentarlo sobre una base, y repetir la verificación.');
    h.out(s+src(h,'NORSOK D-010 (Well integrity in drilling and well operations): una envolvente donde hay riesgo de flujo cruzado y dos donde puede haber flujo a superficie; largos mínimos de ejemplo (100 m, o 50 m sobre base mecánica). En Argentina rige la Res. SE 5/96 y las normas provinciales: aplicá la edición vigente.'))}
  draw(h.V)};

/* ===== 0 · motor de decisiones: situación, opciones, consecuencia y mejor práctica ===== */
W.spc_case=function(box,p,api){
  var steps=p.steps||[],i=0,score=0,done=[],ans;box.innerHTML='';box.className='wd';
  var wrapEl=document.createElement('div');wrapEl.style.cssText='padding:2.2cqw 2.6cqw;font-size:max(14px,1.55cqw);line-height:1.5';box.appendChild(wrapEl);
  function esc(t){return String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
  function status(st){if(!st)return '';return '<div style="display:flex;flex-wrap:wrap;gap:.8cqw 1.6cqw;margin:.8cqw 0;padding:.9cqw 1.2cqw;border-radius:8px;background:rgba(255,255,255,.07)">'+Object.keys(st).map(function(k){return '<span><span style="opacity:.7">'+esc(k)+':</span> <strong>'+esc(st[k])+'</strong></span>'}).join('')+'</div>'}
  function render(){var s=steps[i];ans=null;
    if(!s){var pct=Math.round(score/(steps.length*2)*100);wrapEl.innerHTML='<h4 style="margin:0 0 .6cqw">Resultado del escenario</h4><p>Puntaje: <strong>'+score+' de '+steps.length*2+'</strong> ('+pct+' %). '+(pct>=80?ok('Decisiones alineadas con la mejor práctica.'):'Repasá las decisiones donde no elegiste la mejor práctica y volvé a intentarlo.')+'</p>'+(p.close?'<p>'+esc(p.close)+'</p>':'')+'<button type="button" class="btn" id="spc-rs">Reiniciar</button>'+src({box:box},p.src||'Escenario de ejemplo con fines didácticos.');
      wrapEl.querySelector('#spc-rs').onclick=function(){i=0;score=0;done=[];render()};if(api.touch)api.touch();return}
    var h='<div style="opacity:.75;font-size:.85em">'+esc(p.title||'Escenario')+' · decisión '+(i+1)+' de '+steps.length+' · ejemplo didáctico</div>';
    if(i===0&&p.intro)h+='<p style="margin:.5cqw 0">'+esc(p.intro)+'</p>';
    h+='<p style="margin:.6cqw 0"><strong>'+esc(s.s)+'</strong></p>'+status(s.st)+'<div id="spc-o" style="display:grid;gap:.7cqw">';
    s.o.forEach(function(o,k){h+='<button type="button" class="btn" data-k="'+k+'" style="text-align:left;white-space:normal">'+esc(o.t)+'</button>'});
    h+='</div><div id="spc-f" aria-live="polite" style="margin-top:1cqw"></div>';wrapEl.innerHTML=h;
    [].forEach.call(wrapEl.querySelectorAll('#spc-o button'),function(b){b.onclick=function(){if(ans!=null)return;var k=+b.getAttribute('data-k'),o=s.o[k];ans=k;score+=o.ok;
      [].forEach.call(wrapEl.querySelectorAll('#spc-o button'),function(x){x.disabled=true;var oo=s.o[+x.getAttribute('data-k')];x.style.outline=oo.ok===2?'2px solid '+GN:(x===b?'2px solid '+(oo.ok?AM:RD):'none')});
      var best=s.o.filter(function(z){return z.ok===2})[0],lab=o.ok===2?ok('Mejor práctica.'):(o.ok===1?'<strong style="color:'+AM+'">Aceptable, pero no es lo mejor.</strong>':bad('No es una buena decisión.'));
      wrapEl.querySelector('#spc-f').innerHTML='<p>'+lab+' '+esc(o.fb)+'</p>'+(o.ok<2&&best?'<p><strong>Mejor práctica:</strong> '+esc(best.t)+' — '+esc(best.fb)+'</p>':'')+(s.dt?'<p style="opacity:.85"><strong>Qué sigue:</strong> '+esc(s.dt)+'</p>':'')+'<button type="button" class="btn" id="spc-n">'+(i+1<steps.length?'Siguiente decisión':'Ver resultado')+'</button>';
      wrapEl.querySelector('#spc-n').onclick=function(){i++;render()};if(api.touch)api.touch()}})}
  function src(_,t){return '<div style="margin-top:1cqw;font-size:.8em;opacity:.7">Fuente: '+esc(t)+'</div>'}
  render()};
})();
