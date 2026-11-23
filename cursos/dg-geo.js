/* H3L · Cursos · diagramas del curso de Geociencias (sistema petrolero y caracterización estática) */
(function(){'use strict';var HD=window.HD;if(!HD)return;var T=HD.T,S=HD.S,A=HD.A,AP=HD.AP,P=HD.P,L=HD.L,R=HD.R,C=HD.C;
function ar(f,x0,x1,dy0,dy1,cls,n){var i,x,a='';n=n||32;for(i=0;i<=n;i++){x=x0+(x1-x0)*i/n;a+=(i?'L':'M')+x.toFixed(1)+' '+(f(x)+dy0).toFixed(1)}for(i=n;i>=0;i--){x=x0+(x1-x0)*i/n;a+='L'+x.toFixed(1)+' '+(f(x)+dy1).toFixed(1)}return '<path d="'+a+'Z" class="'+cls+'"/>'}
function badge(x,y,n){return C(x,y,11.5,'f-g')+T(x,y+5,String(n),'t3 w','middle')}
/* ---------- g1 · elementos y procesos del sistema petrolero ---------- */
function top(x){var t=(x-20)/600;return 250-240*t*(1-t)}
HD.def('sp',{n:9,alt:'Sección con roca generadora, reservorio, sello, sobrecarga y los procesos de trampa, generación, migración y acumulación',draw:function(){
  var o='<rect x="20" y="18" width="600" height="332" rx="8" class="f-nv"/>';
  o+=HD.G(0,'<rect x="20" y="300" width="600" height="50" class="f-src"/>'+[[60,318],[120,333],[190,312],[250,327],[330,316],[410,334],[470,314],[540,328],[590,315]].map(function(q){return '<circle cx="'+q[0]+'" cy="'+q[1]+'" r="2.4" fill="#3a2a1a"/>'}).join('')+T(36,342,'Generadora (materia orgánica)','t4 w'));
  o+=HD.G(1,ar(top,20,620,0,50,'f-res')+T(320,235,'Reservorio','t4 dk','middle'));
  o+=HD.G(2,ar(top,20,620,-36,0,'f-seal')+T(170,186,'Sello','t4 w','middle'));
  o+=HD.G(3,'<path d="M20 18 L620 18 L620 214 '+(function(){var s='',i,x;for(i=30;i>=0;i--){x=20+600*i/30;s+='L'+x.toFixed(1)+' '+(top(x)-36).toFixed(1)}return s})()+' Z" class="f-ov"/>'+[0,1,2].map(function(k){return HD.fn(function(x){return top(x)-36-34-k*36},20,620,30,'ln s-gr thin')}).join('')+T(36,48,'Sobrecarga (columna de roca que entierra a la generadora)','t4 w'));
  /* 4 trampa */
  o+=S(4,'<path d="'+(function(){var s='',i,x,x0=112.8,x1=527;for(i=0;i<=24;i++){x=x0+(x1-x0)*i/24;s+=(i?'L':'M')+x.toFixed(1)+' '+top(x).toFixed(1)}return s+'L'+x1+' 218 L'+x0+' 218 Z'})()+'" class="nf ln s-am dash"/>'+badge(320,170,1)+T(320,128,'Trampa','t3 am','middle'));
  /* 5 generación */
  o+=S(5,[[95,322],[160,338],[225,322],[300,336],[365,322],[445,338],[520,322],[580,336]].map(function(q){return C(q[0],q[1],4.2,'f-am')}).join('')+badge(34,318,2));
  /* 6 migración */
  var mid=function(x){return top(x)+25};
  o+=S(6,AP('M520 312 L 566 286','am')+AP('M596 292 '+(function(){var s='',i,x;for(i=1;i<=12;i++){x=596-(596-420)*i/12;s+='L'+x.toFixed(1)+' '+mid(x).toFixed(1)}return s})(),'am')+AP('M120 312 L 74 286','am')+AP('M44 292 '+(function(){var s='',i,x;for(i=1;i<=12;i++){x=44+(220-44)*i/12;s+='L'+x.toFixed(1)+' '+mid(x).toFixed(1)}return s})(),'am')+badge(520,268,3));
  /* 7 acumulación */
  o+=S(7,'<path d="'+(function(){var s='',i,x,x0=112.8,x1=527;for(i=0;i<=24;i++){x=x0+(x1-x0)*i/24;s+=(i?'L':'M')+x.toFixed(1)+' '+top(x).toFixed(1)}return s+'L'+x1+' 218 L'+x0+' 218 Z'})()+'" class="f-oil"/>'+badge(320,204,4));
  o+=HD.legend(655,16,[{s:0,c:'f-src',t:'Roca generadora'},{s:1,c:'f-res',t:'Roca reservorio'},{s:2,c:'f-seal',t:'Roca sello'},{s:3,c:'f-ov',t:'Sobrecarga'},{s:4,n:1,t:'Formación de la trampa'},{s:5,n:2,t:'Generación'},{s:6,n:3,t:'Migración'},{s:7,n:4,t:'Acumulación'}],30);
  o+=S(8,R(650,262,300,84,'bx-am')+T(800,285,'El orden en el tiempo manda','t2 am','middle')+T(800,308,'La trampa y el sello deben existir|antes de que migre el hidrocarburo','t3','middle'));
  return o}});
/* ---------- g1 · diagrama de eventos (events chart) ---------- */
HD.def('ev',{n:3,alt:'Diagrama de eventos del sistema petrolero con el momento crítico',draw:function(){
  var X0=280,X1=940,rows=[['Roca generadora',280,560,'f-src',0],['Roca reservorio',320,940,'f-res',0],['Roca sello',350,940,'f-seal',0],['Sobrecarga',400,940,'f-ov',0],
   ['Formación de la trampa',360,470,'f-g',1],['Generación',500,760,'f-g',1],['Migración',560,800,'f-g',1],['Acumulación',590,830,'f-g',1],['Preservación',830,940,'f-g',1]],o='',y;
  o+=HD.L(X0,338,X1,338,'s-m')+HD.A(X1-30,338,X1,338,'w')+T0(X0,358,'Pasado')+T0(X1,358,'Hoy','end')+HD.T((X0+X1)/2,358,'Tiempo geológico','t3 mut','middle');
  rows.forEach(function(r,i){y=44+i*30+(i>3?24:0);o+=HD.G(r[4],HD.T(20,y+16,r[0],'t2')+'<rect x="'+r[1]+'" y="'+y+'" width="'+(r[2]-r[1])+'" height="22" rx="5" class="'+r[3]+'"'+(r[3]==='f-ov'?' stroke="rgba(255,255,255,.25)"':'')+'/>')});
  o+=S(1,HD.T(20,34,'ELEMENTOS','t4 mut')+HD.T(20,172,'PROCESOS','t4 mut'));
  o+=S(2,'<line x1="690" y1="40" x2="690" y2="332" class="ln s-am dash"/>'+R(618,6,144,26,'bx-am','Momento crítico','t3 am'));
  return o}});
function T0(x,y,t,a){return HD.T(x,y,t,'t4 mut',a||'start')}
/* ---------- g1 · riesgo geológico ---------- */
HD.def('risk',{n:5,alt:'Probabilidad de éxito geológico como producto de carga, reservorio, sello y trampa',draw:function(){
  var o=HD.T(480,30,'P(éxito geológico) ≈ P(carga) × P(reservorio) × P(sello) × P(trampa)','t2 g','middle'),X=330,W=400;
  [['Carga|generación y migración',80],['Reservorio',70],['Sello',90],['Trampa',60]].forEach(function(r,i){var y=62+i*50;
    o+=HD.G(i,(r[0].indexOf('|')>0?HD.T(30,y+17,r[0].split('|')[0],'t2')+HD.T(30,y+38,r[0].split('|')[1],'t4 mut'):HD.T(30,y+25,r[0],'t2'))+'<rect x="'+X+'" y="'+y+'" width="'+W+'" height="30" rx="6" class="bx"/><rect x="'+X+'" y="'+y+'" width="'+W*r[1]/100+'" height="30" rx="6" class="f-bl"/>'+HD.T(X+W*r[1]/100+10,y+22,r[1]+' %','t2'))});
  o+=S(4,HD.L(30,272,930,272,'s-m')+HD.T(30,314,'Probabilidad conjunta','t2 am')+'<rect x="'+X+'" y="290" width="'+W+'" height="34" rx="6" class="bx"/><rect x="'+X+'" y="290" width="'+W*.3024+'" height="34" rx="6" class="f-am"/>'+HD.T(X+W*.3024+10,314,'≈ 30 %','t1 am')+HD.T(X,350,'Cuatro componentes buenos dan un resultado modesto','t3 mut'));
  return o}});
/* ---------- g1 · cuenca Neuquina: convencional vs no convencional ---------- */
HD.def('neu',{n:4,alt:'Columna de la cuenca Neuquina con generadoras, reservorios convencionales y el sistema no convencional de Vaca Muerta',draw:function(){
  var U=[['Mulichinco','res',1],['Quintuco','res',1],['Vaca Muerta','vm',0],['Tordillo','res',1],['Los Molles','gen',0]],o='',y;
  U.forEach(function(u,i){y=26+i*64;var base=R(30,y,300,54,'bx');
    var s=u[1]==='gen'||u[1]==='vm'?0:1;
    o+=S(-0.5,base)+HD.T(46,y+25,u[0],'t2');});
  /* roles */
  o+=S(0,R(30,26+2*64,300,54,'bx-am')+HD.T(46,26+2*64+25,'Vaca Muerta','t2')+HD.T(46,26+2*64+45,'Generadora principal','t4 am')+R(30,26+4*64,300,54,'bx-am')+HD.T(46,26+4*64+25,'Los Molles','t2')+HD.T(46,26+4*64+45,'Generadora','t4 am'));
  o+=S(1,[0,1,3].map(function(i){return R(30,26+i*64,300,54,'bx-bl')+HD.T(46,26+i*64+25,U[i][0],'t2')+HD.T(46,26+i*64+45,'Reservorio convencional','t4 bl')}).join('')+HD.T(30,356,'Sellos: lutitas y evaporitas','t4 mut'));
  o+=HD.G(2,R(380,26,560,150,'bx')+HD.T(400,54,'Sistema convencional','t2 bl')+'<rect x="400" y="140" width="520" height="26" rx="5" class="f-src"/><rect x="560" y="92" width="200" height="30" rx="5" class="f-res"/><rect x="560" y="72" width="200" height="16" rx="3" class="f-seal"/>'+HD.AP('M470 138 C 520 126, 560 118, 600 108','am')+HD.T(410,159,'generadora','t4 w')+HD.T(660,112,'trampa','t4 dk','middle')
   +R(380,190,560,150,'bx-am')+HD.T(400,218,'Vaca Muerta: generadora y reservorio a la vez','t2 am')+'<rect x="400" y="236" width="520" height="62" rx="6" class="f-src"/>'+[[440,256],[500,276],[560,252],[640,282],[700,258],[770,278],[840,254],[890,280]].map(function(q){return C(q[0],q[1],4.5,'f-am')}).join('')+HD.T(660,326,'el petróleo casi no migró: quedó retenido','t3','middle'));
  o+=S(3,'<circle cx="590" cy="270" r="26" class="nf ln s-g"/><circle cx="780" cy="262" r="22" class="nf ln s-g"/>'+HD.T(590,236,'sweet spot','t4 g','middle')+HD.T(780,232,'sweet spot','t4 g','middle'));
  return o}});
/* ---------- g2 · querógeno (Van Krevelen simplificado) ---------- */
HD.def('kg',{n:3,alt:'Materia orgánica dividida en bitumen y querógeno, y tipos de querógeno en el diagrama de Van Krevelen',draw:function(){
  var X=function(oc){return 430+oc/.32*480},Y=function(hc){return 300-(hc-.4)/1.4*260},o='';
  o+=S(0,HD.T(30,34,'Materia orgánica preservada','t2 g')+'<rect x="30" y="52" width="110" height="240" rx="7" class="f-sd"/><rect x="30" y="52" width="110" height="64" rx="7" class="f-g"/>'+HD.T(155,90,'Bitumen','t2')+HD.T(155,110,'soluble en solventes','t4 mut')+HD.T(155,196,'Querógeno','t2 am')+HD.T(155,216,'insoluble: fuente de la|mayor parte de los|hidrocarburos generados','t4 mut'));
  o+=HD.axes(430,300,930,40,'Oxígeno / carbono (O/C)','Hidrógeno / carbono (H/C)')+HD.T(430,318,'0','t4 mut','middle')+HD.T(910,318,'0,3','t4 mut','middle');
  o+=S(1,HD.P('M'+X(.05)+' '+Y(1.5)+' C '+X(.04)+' '+Y(1.2)+','+X(.02)+' '+Y(.8)+','+X(.01)+' '+Y(.55),'ln s-g')+HD.T(X(.05)+10,Y(1.5)+4,'Tipo I · algas lacustres → petróleo','t3 g')+HD.P('M'+X(.12)+' '+Y(1.25)+' C '+X(.1)+' '+Y(1)+','+X(.05)+' '+Y(.75)+','+X(.025)+' '+Y(.52),'ln s-bl')+HD.T(X(.12)+10,Y(1.28),'Tipo II · marino → petróleo (y gas)','t3 bl'));
  o+=S(2,HD.P('M'+X(.27)+' '+Y(.95)+' C '+X(.22)+' '+Y(.8)+','+X(.12)+' '+Y(.62)+','+X(.07)+' '+Y(.5),'ln s-am')+HD.T(X(.27)-10,Y(.95)-10,'Tipo III · plantas terrestres → gas','t3 am','end')+HD.P('M'+X(.22)+' '+Y(.5)+' L '+X(.08)+' '+Y(.44),'ln s-m')+HD.T(X(.22)+8,Y(.5)+16,'Tipo IV · inerte','t3 mut'));
  return o}});
/* ---------- g2 · riqueza (TOC) y pirólisis Rock-Eval ---------- */
HD.def('toc',{n:5,alt:'Escala de riqueza orgánica TOC y señales S1, S2, S3 y Tmax de la pirólisis Rock-Eval',draw:function(){
  var cl=[['Pobre','< 0,5','#5a6b87'],['Regular','0,5–1','#46806f'],['Buena','1–2','#2f8f6c'],['Muy buena','2–4','#1f9c70'],['Excelente','> 4','#5fd1a4']],o='',i;
  o+=HD.G(0,HD.T(30,26,'TOC (% en peso) · Peters y Cassa, 1994','t2 g')+cl.map(function(c,i){return '<rect x="'+(30+i*180)+'" y="40" width="174" height="44" rx="6" fill="'+c[2]+'"/>'+HD.T(30+i*180+87,59,c[0],'t2 w','middle')+HD.T(30+i*180+87,77,c[1],'t3 w','middle')}).join(''));
  o+=S(1,'<path d="M'+(30+2*180)+' 100 L'+(30+2*180)+' 108 L'+(30+5*180-6)+' 108 L'+(30+5*180-6)+' 100" class="nf ln s-am"/>'+HD.T(30+3.5*180,126,'Vaca Muerta: promedios publicados de ~1 a 8 %','t3 am','middle'));
  var X=function(t){return 130+(t-100)/550*780},Y=function(v){return 340-v*140};
  o+=S(2,HD.axes(130,340,920,160,'Temperatura de pirólisis (°C)','Señal')+HD.fn(function(x){return Y(.35*Math.exp(-Math.pow((x-X(300))/28,2)))},X(150),X(400),40,'ln s-bl')+HD.T(930,176,'S1 · hidrocarburos libres','t3 bl','end'));
  o+=S(3,HD.fn(function(x){return Y(1.2*Math.exp(-Math.pow((x-X(440))/30,2))+.35*Math.exp(-Math.pow((x-X(300))/28,2)))},X(150),X(620),80,'ln s-am')+HD.T(930,202,'S2 · potencial remanente','t3 am','end'));
  o+=S(4,HD.fn(function(x){return Y(.45*Math.exp(-Math.pow((x-X(380))/45,2)))+8},X(150),X(520),50,'ln s-g thin dash')+HD.T(930,228,'S3 · CO₂ (línea de trazos)','t3 g','end')+'<line x1="'+X(440)+'" y1="'+(Y(1.2)-8)+'" x2="'+X(440)+'" y2="340" class="ln s-w thin dash"/>'+HD.T(X(440),Y(1.2)-14,'Tmax','t3','middle'));
  return o}});
/* ---------- g2 · índice de hidrógeno ---------- */
HD.def('hi',{n:4,alt:'Clasificación del querógeno según el índice de hidrógeno',draw:function(){
  var cl=[['> 600','Tipo I','petróleo','#2f8f6c'],['300–600','Tipo II','petróleo y gas','#3A6BD0'],['200–300','Tipo II/III','mezcla','#6a7fb8'],['50–200','Tipo III','gas','#b9803f']],o=HD.T(30,36,'Índice de hidrógeno  HI = S2 / TOC × 100  (mg HC / g TOC)','t2 g');
  cl.forEach(function(c,i){var y=64+i*66;o+=HD.G(i,'<rect x="30" y="'+y+'" width="'+(250+(3-i)*160)+'" height="50" rx="7" fill="'+c[3]+'"/>'+HD.T(46,y+31,c[0],'t1 w')+HD.T(200,y+31,c[1]+' · '+c[2],'t2 w'))});
  o+=HD.T(930,348,'Referencia orientativa','t4 mut','end');return o}});
/* ---------- g2 · madurez (Tmax y Ro) ---------- */
HD.def('mat',{n:4,alt:'Ventanas de madurez térmica según Tmax y reflectancia de vitrinita',draw:function(){
  var W=[['Inmadura',150,'#5a6b87'],['Petróleo',230,'#2f8f6c'],['Gas húmedo y condensado',260,'#b9803f'],['Gas seco',200,'#8a5a8f']],x=50,o='',xs=[50];
  o+=HD.T(50,30,'Ventanas de madurez','t2 g');
  W.forEach(function(w,i){o+='<rect x="'+x+'" y="60" width="'+w[1]+'" height="62" '+(i===0?'rx="7"':'')+' fill="'+w[2]+'"/>'+HD.T(x+w[1]/2,96,w[0],'t3 w','middle');x+=w[1];xs.push(x)});
  /* Tmax: fronteras 435 y 470 entre inmadura|petróleo y petróleo|gas */
  o+=S(0,HD.T(50,160,'Tmax (°C)','t2 bl')+[[xs[1],'435'],[xs[2]+0,'470']].map(function(q){return HD.L(q[0],122,q[0],150,'s-bl')+HD.T(q[0],170,q[1],'t3 bl','middle')}).join('')+HD.T(xs[2]+60,170,'→ gas','t4 mut'));
  o+=S(1,HD.T(50,262,'Reflectancia de vitrinita, Ro (%)','t2 am')+[[xs[1],'0,6'],[xs[2],'1,0'],[xs[3],'1,3']].map(function(q){return HD.L(q[0],122,q[0],206,'s-am thin dash')+HD.T(q[0],228,q[1],'t3 am','middle')}).join(''));
  o+=S(2,R(50,278,900,34,'bx','Buena práctica: combinar Ro, Tmax e índices; ningún indicador alcanza por sí solo','t3'));
  o+=S(3,HD.AP('M'+(xs[1]+20)+' 346 L'+(xs[4]-30)+' 346','g')+HD.T(xs[1]+20,338,'Vaca Muerta: del este (petróleo temprano)','t3 g')+HD.T(xs[4]-30,338,'al oeste (gas seco)','t3 g','end'));
  return o}});
/* ---------- g2 · perfil de TOC y retención en Vaca Muerta ---------- */
HD.def('vmtoc',{n:3,alt:'Índice de saturación de petróleo y perfil vertical de TOC con máximo en la sección basal',draw:function(){
  var o='';
  o+=S(0,HD.T(30,34,'Retención: OSI = S1 / TOC × 100','t2 g')+'<rect x="30" y="60" width="440" height="30" rx="6" class="bx"/><rect x="30" y="60" width="300" height="30" rx="6" class="f-bl"/><line x1="330" y1="52" x2="330" y2="98" class="ln s-am"/>'+HD.T(330,118,'100 mg/g TOC','t3 am','middle')+HD.T(30,150,'Umbral de interés: regla empírica,|no garantiza producción','t3 mut'));
  var Y=function(d){return 50+d*270};
  o+=S(1,HD.T(700,34,'Perfil de TOC','t2 g','middle')+'<rect x="560" y="50" width="280" height="270" rx="6" class="bx"/>'+HD.fnv(function(y){var d=(y-50)/270;return 560+36+d*d*d*200},50,320,40,'ln s-am')+HD.T(556,60,'techo','t4 mut','end')+HD.T(556,336,'base','t4 mut','end'));
  o+=S(2,'<rect x="560" y="262" width="280" height="58" rx="6" fill="rgba(95,209,164,.22)" stroke="#5fd1a4"/>'+HD.T(548,288,'sección basal condensada','t3 g','end')+HD.T(548,312,'máximo TOC · objetivo','t4 mut','end'));
  return o}});
/* ---------- g3 · historia de enterramiento ---------- */
HD.def('bur',{n:6,alt:'Curva de enterramiento con temperatura, tiempo-temperatura y ventanas de generación',draw:function(){
  var X=function(t){return 90+(200-t)/200*540},Y=function(z){return 40+z*56},z=function(t){if(t>=50){var s=(200-t)/150;return 3.95*Math.pow(s,1.25)}var u=(50-t)/50;return 3.95-.65*u*u},o='';
  o+=HD.axes(90,320,640,34,'Tiempo geológico (de pasado a hoy)','Profundidad (km)')+[0,1,2,3,4,5].map(function(k){return HD.T(80,Y(k)+5,String(k),'t4 mut','end')+HD.L(90,Y(k),640,Y(k),'s-gr thin')}).join('');
  o+=HD.G(4,'<rect x="90" y="'+Y(1.5)+'" width="550" height="'+(Y(3.5)-Y(1.5))+'" fill="rgba(95,209,164,.2)"/>'+HD.T(104,Y(1.5)+24,'Ventana de petróleo (~60–120 °C)','t3 g')+'<rect x="90" y="'+Y(3.5)+'" width="550" height="'+(Y(5)-Y(3.5))+'" fill="rgba(232,161,90,.14)"/>'+HD.T(104,Y(3.5)+24,'Gas húmedo y seco','t3 am'));
  o+=S(0,HD.fn(function(x){return Y(z(200-(x-90)/540*200))},90,630,90,'ln s-w')+HD.T(100,Y(0)-8,'Roca generadora','t3'));
  o+=S(1,HD.fn(function(x){return Y(z(200-(x-90)/540*200))},X(50),630,40,'ln s-am')+HD.T(480,Y(4.38),'levantamiento y erosión: restaurar el espesor perdido','t4 am','middle'));
  o+=S(2,[0,1,2,3,4,5].map(function(k){return HD.T(648,Y(k)+5,(15+30*k)+' °C','t4 bl')}).join('')+R(696,34,244,78,'bx-bl')+HD.T(708,60,'T = T_{sup} + g × z','t2')+HD.T(708,90,'15 + 30 × 3,5 = 120 °C','t3 bl'));
  o+=S(3,R(696,122,244,128,'bx-am')+HD.T(708,148,'La reacción se acelera|×2 por cada +10 °C','t3')+HD.T(708,196,'TTI (Lopatin) · Waples:|15 inicio · 75 pico · 160 fin','t4 am')+HD.T(708,232,'de la ventana de petróleo','t4 mut'));
  o+=S(5,R(696,262,244,66,'bx-g')+HD.T(708,288,'Calibrar con Ro medido,|Tmax y T de fondo','t3')+[1.2,2,2.9].map(function(k){return C(600,Y(k),5,'f-g')}).join(''));
  return o}});
/* ---------- g3 · madurez regional en la cuenca Neuquina ---------- */
HD.def('neum',{n:4,alt:'Etapas de la cuenca Neuquina y gradiente de madurez de este a oeste',draw:function(){
  var yt=function(x){return 150+(x-40)*.12+Math.pow((x-40)/880,2)*60},o='',pl=function(x0,x1,dy){var s='',i,x;for(i=0;i<=30;i++){x=x0+(x1-x0)*i/30;s+=(i?'L':'M')+x.toFixed(1)+' '+(yt(x)+dy).toFixed(1)}return s};
  o+=HD.G(0,[['Rift','Triásico – Jurásico temprano'],['Retroarco','Subsidencia térmica · Vaca Muerta'],['Antepaís andino','Cretácico tardío · carga al oeste']].map(function(q,i){var x=20+i*312;return R(x,12,300,66,i===1?'bx-g':'bx')+HD.T(x+14,38,q[0],'t2')+HD.T(x+14,62,q[1],'t4 mut')}).join(''));
  o+=HD.G(1,'<path d="'+pl(40,920,36)+' L920 350 L40 350Z" class="f-nv"/>'+ar2(yt,40,920,0,36,'f-sh')+HD.T(40,yt(40)-12,'Este · borde de cuenca','t3 mut')+HD.T(920,yt(920)-70,'Oeste · faja plegada','t3 mut','end')+HD.T(480,yt(480)+60,'Vaca Muerta','t3 w','middle')+HD.AP('M890 150 L890 196','w')+HD.T(880,140,'más enterramiento','t4 mut','end'));
  var seg=[[40,250,'#6b7f9e','Petróleo temprano'],[250,480,'#2f8f6c','Petróleo'],[480,720,'#b9803f','Gas húmedo y condensado'],[720,920,'#8a5a8f','Gas seco']];
  o+=S(2,seg.map(function(s){return ar2(yt,s[0],s[1],0,36,'').replace('class=""','fill="'+s[2]+'"')}).join('')+seg.map(function(s){return HD.T((s[0]+s[1])/2,yt((s[0]+s[1])/2)+23,s[3],'t4 w','middle')}).join(''));
  o+=S(3,R(20,292,430,52,'bx-am')+HD.T(34,314,'Sobrepresión por generación en roca sellada','t3 am')+HD.T(34,336,'madurez, presión y porosidad varían juntas','t4 mut'));
  return o}});
function ar2(f,x0,x1,dy0,dy1,cls){var i,x,a='',n=30;for(i=0;i<=n;i++){x=x0+(x1-x0)*i/n;a+=(i?'L':'M')+x.toFixed(1)+' '+(f(x)+dy0).toFixed(1)}for(i=n;i>=0;i--){x=x0+(x1-x0)*i/n;a+='L'+x.toFixed(1)+' '+(f(x)+dy1).toFixed(1)}return '<path d="'+a+'Z" class="'+cls+'"/>'}
/* ---------- g4 · acomodación y aporte ---------- */
HD.def('acom',{n:2,alt:'Espacio de acomodación y patrones de apilamiento: progradación, agradación y retrogradación',draw:function(){
  var o='';
  o+=HD.G(0,'<path d="M40 100 L440 150 L440 175 L40 175Z" class="f-sd"/><path d="M40 100 C 200 98, 300 118, 440 150 L440 160 L40 118Z" class="f-sh"/><rect x="40" y="52" width="400" height="48" class="f-wat" fill-opacity=".25"/><line x1="40" y1="52" x2="440" y2="52" class="ln s-bl dash"/>'+HD.A(300,56,300,120,'am')+HD.A(300,120,300,56,'am')+HD.T(312,94,'Acomodación','t3 am')+HD.T(44,44,'Nivel relativo del mar','t4 bl')+HD.T(520,70,'Lo controlan el nivel relativo del mar','t3')+HD.T(520,98,'y la subsidencia; el aporte sedimentario','t3')+HD.T(520,126,'determina cómo se llena','t3'));
  var P=[['Aporte > acomodación','progradación','M40 300 L40 266 L150 266 L240 300Z','M120 252 L210 252'],['Aporte ≈ acomodación','agradación','M60 300 L60 266 L220 266 L220 300Z','M140 256 L140 220'],['Aporte < acomodación','retrogradación','M40 300 L40 266 L130 266 L240 300Z','M200 252 L110 252']];
  o+=P.map(function(q,i){var x=i*312+20;return HD.S(1,R(x,196,290,148,'bx')+'<g transform="translate('+x+' 0)">'+'<path d="'+q[2]+'" class="f-sd"/>'+HD.AP(q[3],'g')+'</g>'+HD.T(x+145,226,q[0],'t3 am','middle')+HD.T(x+145,330,q[1],'t2 g','middle'))}).join('');
  return o}});
/* ---------- g4 · tractos de sistemas y superficies clave ---------- */
HD.def('tract',{n:3,alt:'Curva del nivel relativo del mar con tractos de sistemas y superficies',draw:function(){
  var Y=function(x){return 190-70*(-Math.cos(2*Math.PI*(x-150)/820))},o='';
  o+=HD.axes(60,330,930,40,'Tiempo','Nivel relativo del mar')+HD.fn(Y,60,930,90,'ln s-bl');
  var tr=[[150,300,'Nivel bajo','#4a5f86'],[300,560,'Transgresivo','#2f8f6c'],[560,760,'Nivel alto','#b9803f']];
  o+=S(1,tr.map(function(t){return '<rect x="'+t[0]+'" y="296" width="'+(t[1]-t[0])+'" height="30" fill="'+t[3]+'" rx="5"/>'+HD.T((t[0]+t[1])/2,317,t[2],'t3 w','middle')}).join(''));
  o+=S(2,[[110,'Límite de secuencia'],[300,'Superficie transgresiva'],[560,'Máxima inundación'],[880,'Límite de secuencia']].map(function(s,i){return '<line x1="'+s[0]+'" y1="'+(i%2?56:40)+'" x2="'+s[0]+'" y2="296" class="ln s-am thin dash"/>'+HD.T(s[0],(i%2?50:34),s[1],'t4 am','middle')}).join(''));
  return o}});
/* ---------- g4 · correlación por litología o por tiempo ---------- */
HD.def('corr',{n:2,alt:'Correlación por litología frente a correlación por superficies de tiempo entre dos pozos',draw:function(){
  var wA=250,wB=590,W=110,o='';
  function well(x,sd,nm){var s='<rect x="'+x+'" y="40" width="'+W+'" height="260" class="f-sh"/>';sd.forEach(function(q){s+='<rect x="'+x+'" y="'+q[0]+'" width="'+W+'" height="'+q[1]+'" class="f-sd"/>'});return s+'<rect x="'+x+'" y="40" width="'+W+'" height="260" fill="none" stroke="rgba(255,255,255,.5)"/>'+HD.T(x+W/2,324,nm,'t2','middle')}
  o+=well(wA,[[100,36],[210,44]],'Pozo A')+well(wB,[[150,36],[240,40]],'Pozo B');
  o+=S(0,HD.L(wA+W,118,wB,168,'s-r')+HD.L(wA+W,232,wB,260,'s-r')+HD.T(480,344,'Por litología: continuidad y barreras que no existen','t3 r','middle'),1);
  o+=S(1,[[78,60],[190,206],[286,284]].map(function(q){return HD.L(wA+W,q[0],wB,q[1],'s-g dash')+HD.T(wA+W+12,q[0]-6,'','t4')}).join('')+HD.T(480,344,'Por superficies de tiempo: la arenisca cruza líneas de tiempo','t3 g','middle'));
  o+=HD.G(1,HD.T(100,172,'se parecen,|pero tienen|edades distintas','t4 mut','middle'));
  return o}});
/* ---------- g4 · clinoformas, Vaca Muerta y Quintuco ---------- */
HD.def('clino',{n:3,alt:'Clinoformas con sección basal condensada y límite diacrónico entre Vaca Muerta y Quintuco',draw:function(){
  var o='',cl=function(c,top){return function(x){return top+160/(1+Math.exp(-(x-c)/42))}};
  o+=HD.G(0,'<rect x="40" y="296" width="880" height="30" fill="rgba(95,209,164,.28)" stroke="#5fd1a4"/>'+HD.T(480,317,'Sección basal condensada · máximo TOC · superficie de máxima inundación','t3 g','middle')+'<rect x="40" y="326" width="880" height="14" class="f-sh"/>');
  o+=S(1,[200,340,480,620,760].map(function(c,i){return HD.fn(cl(c,100+i*4),40,920,60,'ln s-bl')}).join('')+HD.L(250,120,860,262,'s-am')+HD.T(560,176,'límite Vaca Muerta – Quintuco:|diacrónico, cruza las superficies de tiempo','t3 am','middle'));
  o+=S(2,R(40,40,330,44,'bx-g','Zonas entre superficies de tiempo','t3')+HD.T(920,60,'Las capas del modelo siguen esas superficies','t3 g','end'));
  return o}});
/* ---------- g5 · de la curva de registro a la propiedad ---------- */
HD.def('logs',{n:5,alt:'Cuatro pistas de registro: rayos gamma, densidad, resistividad y método de Passey',draw:function(){
  var o='',xs=[20,250,480,710],W=220,y0=64,y1=232;
  function track(i,tit,f,cls){var x=xs[i];return '<rect x="'+x+'" y="'+y0+'" width="'+W+'" height="'+(y1-y0)+'" rx="5" class="bx"/>'+HD.T(x+W/2,50,tit,'t3','middle')+HD.fnv(function(y){return x+14+(W-28)*f(y)},y0+4,y1-4,90,cls)}
  var gr=function(y){return .5+.28*Math.sin(y/9)+.16*Math.sin(y/3.1)+.1*Math.sin(y/21)},rho=function(y){return .5-.22*Math.sin(y/11)+.12*Math.sin(y/4.2)},rt=function(y){var v=.2+.35*Math.max(0,Math.sin(y/23))+.1*Math.sin(y/5);return Math.min(.95,v)},sn=function(y){return .55-.2*Math.sin(y/15)+.08*Math.sin(y/4)};
  o+=S(0,track(0,'Rayos gamma',gr,'ln s-am')+HD.T(xs[0],262,'IGR = (GR − GR_{mín}) /|(GR_{máx} − GR_{mín}) → V_{sh}','t4'));
  o+=S(1,track(1,'Densidad',rho,'ln s-bl')+HD.T(xs[1],262,'φ = (ρ_{ma} − ρ_{b}) /|(ρ_{ma} − ρ_{f})','t4'));
  o+=S(2,'<rect x="'+xs[1]+'" y="'+(y0+50)+'" width="'+W+'" height="64" fill="rgba(232,161,90,.22)"/>'+HD.T(xs[1],318,'Querógeno ρ ≈ 1,2–1,4 g/cm³|sobrestima φ: modelo multimineral','t4 am'));
  o+=S(3,track(2,'Resistividad',rt,'ln s-g')+HD.T(xs[2],262,'S_{w} = [ a·R_{w} / (φ^{m}·R_{t}) ]^{1/n}','t4')+HD.T(xs[2],318,'Calibrar a, m, n con núcleo:|nunca valores por defecto','t4 am'));
  o+=S(4,track(3,'Passey (ΔlogR)',rt,'ln s-g')+HD.fnv(function(y){return xs[3]+14+(W-28)*sn(y)},y0+4,y1-4,90,'ln s-bl')+HD.T(xs[3],262,'ΔlogR = log(R/R_{base})|+ 0,02·(Δt − Δt_{base}) → TOC','t4')+HD.T(xs[3],318,'LOM calibrado con|el TOC medido','t4 am'));
  return o}});
/* ---------- g6 · de bruto a neto y net pay ---------- */
HD.def('cut',{n:5,alt:'Del espesor bruto al neto, la roca reservorio y el net pay con cortes sucesivos',draw:function(){
  var o='',rows=[['Espesor bruto','todo el intervalo',660,'#5a6b87'],['Roca neta','corte de arcillosidad (V_{sh})',500,'#3A6BD0'],['Roca reservorio','+ corte de porosidad (φ)',350,'#2f8f6c'],['Net pay','+ corte de S_{w}',230,'#e8a15a']];
  rows.forEach(function(r,i){var y=40+i*62;o+=HD.G(i,HD.T(20,y+22,r[0],'t2')+HD.T(20,y+44,r[1],'t4 mut')+'<rect x="260" y="'+y+'" width="'+r[2]+'" height="46" rx="6" fill="'+r[3]+'"/>')});
  o+=S(4,R(20,296,920,48,'bx-g','NTG = espesor neto / espesor bruto · los cortes son decisiones: dejar escrito el criterio','t3'));
  return o}});
/* ---------- g6 · calibración núcleo-registro ---------- */
HD.def('calib',{n:3,alt:'Calibración núcleo-registro en tres pasos: profundidad, propiedades y validación ciega',draw:function(){
  var o='',pan=function(x,t){return R(x,24,290,320,'bx')+HD.T(x+145,54,t,'t2 g','middle')};
  o+=HD.G(0,pan(20,'1 · Profundidad')+'<path d="M80 100 C110 130, 60 170, 100 210 S 90 280, 120 300" class="ln s-am"/><path d="M200 120 C230 150, 180 190, 220 230 S 210 290, 240 310" class="ln s-bl"/>'+HD.AP('M120 190 L196 190','g')+HD.T(80,330,'núcleo','t4 am')+HD.T(200,336,'registro','t4 bl'));
  o+=HD.G(1,pan(335,'2 · Propiedades')+HD.axes(375,300,610,90,'φ de registro','φ de núcleo')+HD.L(375,300,610,100,'s-m dash')+[[400,270],[430,236],[455,214],[490,190],[520,176],[550,150],[585,132],[470,230]].map(function(q){return C(q[0]+(q[0]%3)*3,q[1]+(q[1]%5)*2,5,'f-bl')}).join(''));
  o+=HD.G(2,pan(650,'3 · Validación')+'<rect x="690" y="90" width="210" height="170" rx="8" class="bx-g"/>'+HD.T(795,130,'Pozo no usado|en el ajuste','t2','middle')+HD.T(795,196,'si funciona ahí,|el modelo es|transferible','t4 g','middle')+HD.T(795,300,'✓','t1 g','middle'));
  return o}});
/* ---------- g6 · escenarios de cortes ---------- */
HD.def('scen',{n:3,alt:'Net pay y petróleo en sitio para cortes conservadores, base y optimistas',draw:function(){
  var o='',rows=[['Conservador',27.5,378,1,40],['Base',39,464,0,120],['Optimista',47,496,2,200]];
  o+=HD.T(280,34,'Net pay (m)','t2 bl')+HD.T(640,34,'Petróleo en sitio (MMbbl)','t2 am');
  rows.forEach(function(r){var y=r[4];o+=HD.G(r[3],HD.T(20,y+30,r[0],'t2')+'<rect x="200" y="'+y+'" width="'+r[1]/50*300+'" height="40" rx="6" class="f-bl"/>'+HD.T(200+r[1]/50*300+10,y+27,String(r[1]).replace('.',',')+' m','t2')+'<rect x="590" y="'+y+'" width="'+r[2]/500*290+'" height="40" rx="6" class="f-am"/>'+HD.T(590+r[2]/500*290+10,y+27,r[2],'t2'))});
  o+=S(1,HD.T(940,104,'−30 % de espesor → −18 % de volumen','t4 am','end'));
  o+=S(2,HD.T(940,264,'+20 % de espesor → solo +7 % de volumen','t4 am','end')+R(20,296,920,48,'bx-am','El espesor sube mucho más que el volumen: la roca que se agrega es pobre (menor φ, mayor S_{w})','t3'));
  return o}});
/* ---------- g7 · sísmica: reflexión y sismograma sintético ---------- */
HD.def('seis',{n:3,alt:'Onda sísmica reflejada en una interfaz, coeficiente de reflexión y sismograma sintético',draw:function(){
  var o='<rect x="30" y="30" width="360" height="300" rx="6" class="f-nv"/><rect x="30" y="170" width="360" height="160" class="f-sh"/><line x1="30" y1="170" x2="390" y2="170" class="ln s-w thin"/>';
  o+=HD.T(40,196,'Z_{2} = ρ_{2}·v_{2}','t3 w')+HD.T(40,70,'Z_{1} = ρ_{1}·v_{1}','t3 w')+'<circle cx="120" cy="30" r="8" class="f-am"/><rect x="262" y="22" width="16" height="16" class="f-g"/>'+HD.T(120,16,'fuente','t4 mut','middle')+HD.T(270,16,'receptor','t4 mut','middle');
  o+=S(0,HD.AP('M120 38 L195 168','am')+HD.AP('M195 168 L268 42','am')+HD.T(206,120,'ida y vuelta','t4 am'));
  o+=S(1,R(430,30,500,92,'bx-bl')+HD.T(450,66,'R = (Z_{2} − Z_{1}) / (Z_{2} + Z_{1})','t2')+HD.T(450,100,'el contraste de impedancias manda la amplitud','t3 mut'));
  o+=S(2,R(430,140,500,190,'bx-g')+HD.T(450,172,'Sismograma sintético → atar al pozo','t2 g')+[0,1,2,3].map(function(i){return HD.L(470+i*40,290,470+i*40,290-[40,-30,60,-20][i],'s-bl')}).join('')+HD.T(520,320,'reflectividad','t4 mut','middle')+HD.fn(function(x){return 270-30*Math.sin((x-640)/10)*Math.exp(-Math.pow((x-690)/45,2))},640,780,50,'ln s-am')+HD.T(700,320,'× ondícula','t4 mut','middle')+HD.fn(function(x){return 240-20*Math.sin((x-800)/12)*Math.exp(-Math.pow((x-860)/40,2))*2},800,920,50,'ln s-g')+HD.T(860,320,'= traza','t4 mut','middle'));
  return o}});
/* ---------- g7 · resolución vertical ---------- */
HD.def('res',{n:3,alt:'Resolución vertical sísmica de un cuarto de la longitud de onda y efecto de capas delgadas',draw:function(){
  var o=HD.fn(function(x){return 130-60*Math.sin((x-40)/28)},40,420,90,'ln s-am')+HD.A(40,200,418,200,'w')+HD.T(230,222,'λ = v / f','t1','middle')+HD.T(230,250,'resolución vertical ≈ λ / 4','t2 am','middle');
  o+=S(1,R(40,270,380,62,'bx-bl')+HD.T(230,296,'v = 4 000 m/s · f = 30 Hz','t3','middle')+HD.T(230,320,'λ ≈ 133 m → λ/4 ≈ 33 m','t2 bl','middle'));
  o+=S(2,R(470,30,470,300,'bx')+'<rect x="510" y="70" width="80" height="60" class="f-sd"/><rect x="510" y="180" width="80" height="14" class="f-sd"/>'+HD.T(550,160,'capa gruesa','t4 mut','middle')+HD.T(550,230,'capa fina','t4 mut','middle')+HD.T(560,70,'','t4')+HD.L(640,70,690,70,'s-bl')+HD.L(640,130,690,130,'s-bl')+HD.T(700,104,'dos eventos','t3 g')+HD.L(640,187,700,187,'s-am')+HD.T(710,184,'un solo evento:|amplitud según espesor','t3 am')+'<rect x="500" y="262" width="430" height="0"/>');
  return o}});
/* ---------- g7 · tiempo a profundidad y su incertidumbre ---------- */
HD.def('tdr',{n:3,alt:'Conversión de tiempo a profundidad y propagación del error al espesor',draw:function(){
  var o=R(30,30,440,120,'bx-bl')+HD.T(50,70,'Z = v̄ × t_{2v} / 2','t1')+HD.T(50,110,'3 500 m/s × 0,9 s / 2 = 1 575 m','t2 bl')+HD.T(50,138,'la sísmica mide tiempo, no profundidad','t4 mut');
  o+=S(1,R(500,30,440,120,'bx-g')+HD.T(520,64,'La velocidad sale de:','t2 g')+HD.T(520,94,'registros sónicos · tiros de verificación|perfil sísmico vertical (VSP) · velocidades sísmicas','t3'));
  o+=S(2,R(30,180,910,150,'bx-am')+HD.T(50,214,'Error de picado: ± 4 ms con v = 4 000 m/s','t2')+HD.T(50,246,'→ ± 8 m por horizonte; con dos horizontes independientes, ± 11 m de espesor','t2 am')+HD.T(50,290,'En un intervalo de 60 m, eso es casi 20 %: el espesor pesa en el volumen tanto como el área','t3'));
  return o}});
/* ---------- g8 · variograma ---------- */
HD.def('vario',{n:5,alt:'Variograma con efecto pepita, meseta, alcance y anisotropía',draw:function(){
  var X=function(h){return 90+h*500},Y=function(g){return 310-g*230},sph=function(c0,a){return function(x){var h=(x-90)/500,v=h>=a?1:c0+(1-c0)*(1.5*h/a-.5*Math.pow(h/a,3));return Y(v)}};
  var o=HD.axes(90,310,600,60,'Distancia entre puntos (h)','Semivariograma γ(h)')+HD.fn(sph(.18,.55),90,600,60,'ln s-bl');
  o+=S(1,C(90,Y(.18),6,'f-am')+HD.L(90,Y(.18),150,Y(.18),'s-am dash')+R(640,30,300,56,'bx-am')+HD.T(654,54,'Efecto pepita','t2 am')+HD.T(654,76,'variabilidad a distancia casi cero','t4 mut'));
  o+=S(2,HD.L(90,Y(1),600,Y(1),'s-g dash')+R(640,96,300,56,'bx-g')+HD.T(654,120,'Meseta (sill)','t2 g')+HD.T(654,142,'varianza total de los datos','t4 mut'));
  o+=S(3,HD.L(X(.55),Y(1),X(.55),310,'s-w dash')+HD.T(X(.55)+8,298,'alcance','t3')+R(640,162,300,56,'bx')+HD.T(654,186,'Alcance (range)','t2')+HD.T(654,208,'distancia de correlación','t4 mut'));
  o+=S(4,HD.fn(sph(.18,.12),90,600,60,'ln s-am')+HD.T(X(.12)+8,Y(.5),'vertical','t3 am')+HD.T(X(.62),Y(.9)+22,'horizontal','t3 bl')+R(640,228,300,92,'bx-bl')+HD.T(654,254,'Anisotropía','t2 bl')+HD.T(654,280,'alcance vertical: metros|alcance horizontal: cientos de metros','t4 mut'));
  return o}});
/* ---------- g8 · escalado (upscaling) y promedios ---------- */
HD.def('ups',{n:3,alt:'Escalado de permeabilidad: promedios aritmético, geométrico y armónico según la dirección del flujo',draw:function(){
  var K=[['k = 100 mD','#5f8ff0'],['k = 10 mD','#3A6BD0'],['k = 1 mD','#1f3d7a']],o='';
  o+=K.map(function(k,i){return '<rect x="40" y="'+(60+i*60)+'" width="260" height="52" fill="'+k[1]+'"/>'+HD.T(52,'86'.length+60+i*60+30,k[0],'t3 w')}).join('')+HD.T(170,40,'Tres capas de igual espesor','t3 mut','middle');
  o+=S(0,HD.A(310,150,372,150,'g')+'<rect x="380" y="60" width="130" height="172" rx="6" class="bx-g"/>'+HD.T(445,118,'una celda|gruesa','t2','middle')+HD.T(445,176,'k_{equiv}','t2 g','middle')+HD.T(445,40,'Escalado','t3 mut','middle'));
  o+=S(1,HD.A(50,250,290,250,'am')+HD.T(170,276,'flujo paralelo a las capas','t3 am','middle')+HD.T(170,300,'→ media aritmética','t2 am','middle')+HD.A(545,60,545,150,'bl')+HD.A(545,150,545,236,'bl')+HD.T(562,100,'flujo|perpendicular','t3 bl')+HD.T(562,190,'→ media|armónica','t2 bl'));
  o+=S(2,R(730,40,210,284,'bx')+HD.T(835,72,'Ejemplo: 100, 10 y 1','t3 mut','middle')+[['Aritmética','37','am'],['Geométrica','10','g'],['Armónica','2,7','bl']].map(function(q,i){return HD.T(744,126+i*62,q[0],'t2')+HD.T(926,128+i*62,q[1],'t1 '+q[2],'end')}).join('')+HD.T(835,312,'37 vs 2,7: un orden|de magnitud','t4 am','middle'));
  return o}});
/* ---------- g9 · de la fórmula del STOIIP al número ---------- */
HD.def('stoiip',{n:5,alt:'Cálculo del petróleo original en sitio paso a paso con el ejemplo de la planilla',draw:function(){
  var o=HD.T(480,32,'STOIIP = A × h_{neto} × φ × (1 − S_{w}) / B_{o}','t1 g','middle'),B=[['Roca','1 560 Mm³','40 km² × 39 m'],['Poros','143 Mm³','× φ 9,2 %'],['Hidrocarburo','99,5 Mm³','× (1 − S_{w}) · S_{w} = 30,6 %'],['En superficie','464 MMbbl','÷ B_{o} 1,35 → 74 Mm³'],['Recuperable','37 MMbbl','× FR 8 % (didáctico)']];
  B.forEach(function(b,i){var x=20+i*186,w=160;o+=HD.G(i,HD.R(x,70,w,150,i===4?'bx-am':'bx')+HD.T(x+w/2,106,b[0],'t2','middle')+HD.T(x+w/2,156,b[1],'t1 '+(i===4?'am':'g'),'middle')+HD.T(x+w/2,196,b[2],'t4 mut','middle'));if(i<4)o+=HD.G(i+1,HD.A(x+w+2,145,x+186-2,145,'g'))});
  o+=S(4,R(20,256,920,70,'bx-r','En sitio ≠ recuperable ≠ reservas|en no convencionales el FR se calibra con producción real y el volumen es solo una primera estimación','t3'));
  return o}});
/* ---------- g9 · escenarios extremos vs Monte Carlo ---------- */
HD.def('mc',{n:5,alt:'Escenarios bajo y alto frente a la distribución de Monte Carlo con P90, P50 y P10',draw:function(){
  var o=HD.T(20,34,'Escenarios determinísticos','t2 g')+HD.T(520,34,'Simulación Monte Carlo','t2 g'),Xv=function(v){return 500+(v-200)/650*430},Y=function(v){return 300-v*240};
  o+=HD.G(0,'<rect x="20" y="70" width="'+239/818*380+'" height="46" rx="6" class="f-bl"/>'+HD.T(30+239/818*380,100,'Bajo · 239 MMbbl','t2'));
  o+=HD.G(1,'<rect x="20" y="140" width="380" height="46" rx="6" class="f-am"/>'+HD.T(30,170,'Alto · 818 MMbbl','t2 dk')+HD.T(20,222,'Razón alto / bajo = 3,4','t2 am')+HD.T(20,252,'Es muy poco probable que todos|los parámetros estén en su extremo','t4 mut'));
  var pdf=function(x){var v=200+(x-500)/430*650,z=(v-450)/80;return 296-190*Math.exp(-z*z/2)*(v>450?1:Math.exp(-0.0*z))};
  o+=S(2,HD.axes(500,296,930,80,'Petróleo en sitio (MMbbl)','')+HD.fn(pdf,500,930,90,'ln s-bl'));
  [[365,'P90','am'],[445,'P50','g'],[532,'P10','bl']].forEach(function(q,i){o+=S(i<3?2:3,'<line x1="'+Xv(q[0])+'" y1="86" x2="'+Xv(q[0])+'" y2="296" class="ln s-'+q[2]+' dash"/>'+HD.T(Xv(q[0]),76,q[1],'t2 '+q[2],'middle'))+S(3,HD.T(Xv(q[0]),316,String(q[0]),'t3 '+q[2],'middle'))});
  o+=S(2,HD.T(930,352,'P90: se supera con 90 % de probabilidad · P10: con solo 10 %','t4 mut','end'));
  o+=S(4,R(20,284,440,60,'bx-g','P10 / P90 = 1,46, mucho menor que 3,4:|apilar extremos no produce un P90 ni un P10','t3'));
  return o}});
/* ---------- g9 · qué dato reduce la incertidumbre ---------- */
HD.def('tor',{n:6,alt:'Correlación de cada parámetro con el volumen: el espesor y el área pesan más',draw:function(){
  var rows=[['Espesor neto',.74],['Área',.58],['Porosidad',.28],['Saturación de agua',.03],['Factor volumétrico',.02]],o=HD.T(20,34,'Correlación con el petróleo en sitio','t2 g');
  rows.forEach(function(r,i){var y=56+i*50;o+=HD.G(i,HD.T(20,y+28,r[0],'t2')+'<rect x="260" y="'+y+'" width="'+Math.max(4,r[1]*560)+'" height="36" rx="6" class="'+(i<2?'f-am':'f-bl')+'"/>'+HD.T(270+Math.max(4,r[1]*560),y+26,'0,'+String(Math.round(r[1]*100)).padStart(2,'0'),'t2'))});
  o+=S(5,R(20,298,920,56,'bx-g','Valor de la información: se gasta donde la incertidumbre pesa más|mejor sísmica y conversión a profundidad, más pozos con espesor neto, cortes con núcleo','t3'));
  return o}});
})();
