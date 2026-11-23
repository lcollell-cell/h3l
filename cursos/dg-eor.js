(function(){'use strict';var HD=window.HD;if(!HD)return;
var T=HD.T,S=HD.S,G=HD.G,A=HD.A,AP=HD.AP,R=HD.R,C=HD.C,L=HD.L,P=HD.P;
/* ---------- e1 · etapas de recuperación ---------- */
HD.def('stg',{n:4,alt:'Etapas de recuperación primaria, secundaria y terciaria, e IOR como término más amplio',draw:function(){
  var B=[['Primaria','Energía natural|del reservorio'],['Secundaria','Inyección de agua o gas:|mantiene la presión|y empuja el petróleo'],['Terciaria · EOR','Química, gas miscible|y térmica: cambian|la física del desplazamiento']],o='';
  B.forEach(function(b,i){var x=20+i*318;o+=G(i,R(x,40,290,170,i===2?'bx-g':'bx')+T(x+20,84,b[0],'t1'+(i===2?' g':''))+T(x+20,124,b[1],'t3 mut'));if(i<2)o+=G(i+1,A(x+292,125,x+316,125,'g'))});
  o+=S(3,'<path d="M20 232 L20 244 L940 244 L940 232" class="nf ln s-am"/>'+T(480,276,'IOR (recuperación incrementada): término más amplio','t2 am','middle')+T(480,304,'incluye también mejoras operativas, perforación de relleno y otras acciones','t3 mut','middle'));
  return o}});
/* ---------- e1 · eficiencia de desplazamiento a escala de poro ---------- */
HD.def('ed',{n:3,alt:'Saturación de agua connata y petróleo residual: eficiencia de desplazamiento máxima',draw:function(){
  var o=T(480,34,'Escala de poro: ¿cuánto petróleo saca el agua de la roca que sí barre?','t2 g','middle');
  o+=G(0,'<rect x="40" y="70" width="170" height="64" fill="#3A6BD0"/>'+T(125,108,'S_{wc}','t2 w','middle')+'<rect x="210" y="70" width="460" height="64" fill="#e8a15a"/>'+T(440,108,'petróleo móvil','t2 dk','middle')+'<rect x="670" y="70" width="250" height="64" fill="#9a5b28"/>'+T(795,108,'S_{or}','t2 w','middle')+T(40,160,'Agua connata','t4 mut')+T(920,160,'Residual: el agua no lo desplaza','t4 mut','end'));
  o+=S(1,'<path d="M210 176 L210 188 L670 188 L670 176" class="nf ln s-am"/>'+T(440,214,'Esto es lo que el agua puede sacar','t3 am','middle'));
  o+=S(2,R(150,240,660,90,'bx-g')+T(480,278,'E_{D,máx} = (1 − S_{wc} − S_{or}) / (1 − S_{wc})','t1','middle')+T(480,312,'Aunque barras todo el yacimiento, con agua no pasás de ahí','t3 mut','middle'));
  return o}});
/* ---------- e1 · barrido: el agua toma los caminos permeables ---------- */
HD.def('sweep',{n:3,alt:'Corte vertical con inyector y productor: el agua barre primero las capas permeables y deja petróleo sin tocar',draw:function(){
  var ks=[['k alta','#d2bc86'],['k media','#b79f6c'],['k baja','#8b7752']],o='',fr=[.92,.55,.28],y;
  ks.forEach(function(k,i){y=60+i*74;o+=G(0,'<rect x="120" y="'+y+'" width="680" height="62" fill="#9a5b28"/>'+T(930,y+36,k[0],'t3 mut','end'))});
  ks.forEach(function(k,i){y=60+i*74;o+=S(1,'<rect x="120" y="'+y+'" width="'+680*fr[i]+'" height="62" fill="rgba(58,107,208,.7)"/><line x1="'+(120+680*fr[i])+'" y1="'+y+'" x2="'+(120+680*fr[i])+'" y2="'+(y+62)+'" class="ln s-bl"/>')});
  o+=G(0,'<rect x="106" y="40" width="14" height="250" class="f-gr"/><rect x="800" y="40" width="14" height="250" class="f-gr"/>'+T(113,300,'Inyector','t3','middle')+T(807,300,'Productor','t3','middle'));
  o+=S(2,R(250,312,460,34,'bx-am','petróleo sin tocar: capas lentas y zonas no barridas','t4 am'));
  return o}});
/* ---------- e1 · del petróleo original al recuperado ---------- */
HD.def('rf',{n:3,alt:'Factor de recuperación como producto de eficiencias, con el ejemplo del modelo de capas',draw:function(){
  var o=T(480,34,'FR = E_{A} × E_{V} × E_{D}','t1 g','middle'),W=560;
  o+=G(0,T(20,98,'Petróleo original','t2')+'<rect x="280" y="70" width="'+W+'" height="40" rx="6" class="f-gr"/>'+T(270+W,98,'100 %','t2 dk','end'));
  o+=G(1,T(20,170,'Zona barrida','t2')+T(20,194,'E_{V} = 66 % (E_{A} = 100 %)','t4 mut')+'<rect x="280" y="142" width="'+W*.66+'" height="40" rx="6" class="f-bl"/>'+T(270+W*.66,170,'66 %','t2 w','end'));
  o+=G(2,T(20,242,'Recuperado','t2')+T(20,266,'× E_{D} = 62,5 %','t4 mut')+'<rect x="280" y="214" width="'+W*.41+'" height="40" rx="6" class="f-am"/>'+T(270+W*.41,242,'41 %','t2 dk','end')+R(540,276,380,56,'bx-r','Queda 59 % del petróleo en la roca','t2'));
  return o}});
/* ---------- e2 · movilidad y razón de movilidad ---------- */
HD.def('mob',{n:4,alt:'Movilidades del agua y del petróleo, razón de movilidad y tipo de frente',draw:function(){
  var o='';
  o+=G(0,R(20,30,430,92,'bx')+T(38,62,'λ_{w} = k_{rw} / μ_{w}','t2')+T(38,100,'0,35 / 0,5 = 0,7','t2 bl')+R(20,138,430,92,'bx')+T(38,170,'λ_{o} = k_{ro} / μ_{o}','t2')+T(38,208,'0,9 / 6 = 0,15','t2 am'));
  o+=G(1,R(20,246,430,90,'bx-g')+T(38,280,'M = λ_{w} / λ_{o}','t2')+T(38,318,'0,7 / 0,15 = 4,7','t1 g'));
  /* frentes */
  var pn=function(x,t){return R(x,30,230,200,'bx')+T(x+115,258,t,'t2','middle')};
  o+=S(2,pn(480,'M > 1 · digitación')+'<rect x="494" y="44" width="202" height="172" fill="#9a5b28"/><path d="M494 44 L494 216 L560 216 C 580 200, 540 190, 585 176 C 640 168, 570 150, 640 134 C 690 124, 600 100, 650 80 C 676 70, 640 56, 662 44Z" fill="rgba(58,107,208,.75)"/>'+T(480+115,284,'el agua se adelanta y deja|petróleo atrás','t4 mut','middle'));
  o+=S(3,pn(720,'M < 1 · frente estable')+'<rect x="734" y="44" width="202" height="172" fill="#9a5b28"/><rect x="734" y="44" width="110" height="172" fill="rgba(58,107,208,.75)"/><line x1="844" y1="44" x2="844" y2="216" class="ln s-bl"/>'+T(720+115,284,'casi un pistón','t4 mut','middle'));
  return o}});
/* ---------- e2 · flujo fraccional (Buckley–Leverett) ---------- */
HD.def('fw',{n:5,alt:'Curva de flujo fraccional, tangente de Welge y efecto de la razón de movilidad',draw:function(){
  var X=function(s){return 100+s*520},Y=function(f){return 310-f*260},fw=function(s,M){if(s<=0)return 0;if(s>=1)return 1;return 1/(1+Math.pow((1-s)/s,2)/M)},o='';
  function tan(M){var b=0,bs=0,i,s,v;for(i=1;i<200;i++){s=i/200;v=fw(s,M)/s;if(v>b){b=v;bs=s}}return{s:bs,f:fw(bs,M),m:b}}
  var t1=tan(4.7),t2=tan(.47);
  o+=HD.axes(100,310,640,40,'Saturación de agua normalizada','Flujo fraccional de agua f_{w}')+T(100,326,'0','t4 mut','middle')+T(620,326,'1','t4 mut','middle');
  o+=S(0,T(690,70,'f_{w} = fracción de agua|en el fluido total que|fluye','t3'));
  o+=S(1,HD.fn(function(x){return Y(fw((x-100)/520,4.7))},100,620,90,'ln s-am')+T(690,170,'M = 4,7','t2 am'));
  o+=S(2,L(100,310,X(t1.s*1)+((1-t1.f)/t1.m*520)*0+X(1/t1.m)-100,Y(1),'s-w dash')+C(X(t1.s),Y(t1.f),6,'f-g')+T(X(t1.s)-12,Y(t1.f)-14,'frente (shock)','t3 g','end'));
  o+=S(3,L(X(1/t1.m),Y(1),X(1/t1.m),310,'s-g thin dash')+T(X(1/t1.m),Y(1)-8,'1/pendiente = volumen poroso hasta la irrupción','t4 g','start'));
  o+=S(4,HD.fn(function(x){return Y(fw((x-100)/520,.47))},100,620,90,'ln s-bl')+T(690,208,'M = 0,47','t2 bl')+T(690,240,'frente a mayor|saturación: irrumpe|más tarde','t4 mut'));
  return o}});
/* ---------- e2 / e4 · M en función de la viscosidad del agua ---------- */
HD.def('mred',{n:6,alt:'Razón de movilidad en función de la viscosidad del agua inyectada',draw:function(){
  var rows=[[.5,4.67],[1,2.33],[2,1.17],[2.33,1],[5,.47]],o=T(20,34,'M = 2,33 / μ_{w}','t2 g')+T(940,34,'M ≤ 1: desplazamiento estable','t3 am','end'),Wm=480,L1=20+250;
  rows.forEach(function(r,i){var y=58+i*52,w=Math.max(6,Wm*r[1]/5);o+=G(i,T(20,y+27,'μ_{w} = '+String(r[0]).replace('.',',')+' cP','t2')+'<rect x="'+L1+'" y="'+y+'" width="'+w+'" height="38" rx="6" class="f-'+(r[1]>1.05?'am':'g')+'"/>'+T(Math.max(L1+w,L1+Wm/5)+14,y+28,'M = '+String(r[1]).replace('.',','),'t2'))});
  o+=S(0,'<line x1="'+(L1+Wm/5)+'" y1="50" x2="'+(L1+Wm/5)+'" y2="320" class="ln s-w dash"/>'+T(L1+Wm/5,342,'M = 1','t3','middle'));
  return o}});
/* ---------- e3 · coeficiente de Dykstra–Parsons ---------- */
HD.def('dpv',{n:3,alt:'Coeficiente de Dykstra y Parsons a partir de la distribución de permeabilidades',draw:function(){
  var X=function(p){return 110+p*3.8},Y=function(k){return 310-(Math.log10(k)+0)*80},k=function(p){var z=(p-50)/34.1*1;return Math.pow(10,2.1-0.7*0.0+ -z*0.5)};
  var o=HD.axes(110,310,500,50,'% de datos con permeabilidad mayor','Permeabilidad (escala log)');
  o+=S(0,HD.L(X(2),Y(k(2)),X(98),Y(k(98)),'s-bl')+T(350,336,'','t4'));
  o+=S(1,'<line x1="'+X(50)+'" y1="'+Y(k(50))+'" x2="'+X(50)+'" y2="310" class="ln s-w thin dash"/><line x1="'+X(84.1)+'" y1="'+Y(k(84.1))+'" x2="'+X(84.1)+'" y2="310" class="ln s-w thin dash"/>'+C(X(50),Y(k(50)),6,'f-am')+C(X(84.1),Y(k(84.1)),6,'f-am')+T(X(50),324,'50 %','t4','middle')+T(X(84.1),324,'84,1 %','t4','middle')+T(X(50)-8,Y(k(50))-12,'k_{50}','t3 am','end')+T(X(84.1)+10,Y(k(84.1))-12,'k_{84,1}','t3 am')+R(570,40,370,92,'bx')+T(588,76,'V = (k_{50} − k_{84,1}) / k_{50}','t2')+T(588,110,'diferencia con la mediana, normalizada','t4 mut'));
  o+=S(2,R(570,150,370,120,'bx-am')+'<rect x="590" y="176" width="330" height="16" rx="8" fill="url(#dpg)"/><defs><linearGradient id="dpg"><stop offset="0" stop-color="#5fd1a4"/><stop offset="1" stop-color="#ff8f7a"/></linearGradient></defs>'+T(590,216,'0 · uniforme','t4 mut')+T(920,216,'1 · muy heterogéneo','t4 mut','end')+'<circle cx="'+(590+330*.7)+'" cy="184" r="10" class="f-am"/>'+T(590+330*.7,252,'V = 0,7 en el ejemplo','t3 am','middle'));
  return o}});
/* ---------- e3 · modelo de capas ---------- */
HD.def('lay',{n:5,alt:'Modelo de capas sin comunicación vertical: frentes de agua en cada capa para M mayor y menor que uno',draw:function(){
  var ks=['k alta','','','','k baja'],o='',pan=function(x,fr,tag,cl,ex){var s=R(x,20,450,300,cl||'bx')+T(x+225,52,tag,'t2'+(cl?' am':''),'middle');fr.forEach(function(f,i){var y=74+i*46;s+='<rect x="'+(x+40)+'" y="'+y+'" width="380" height="38" fill="#9a5b28"/><rect x="'+(x+40)+'" y="'+y+'" width="'+380*f+'" height="38" fill="rgba(58,107,208,.72)"/><line x1="'+(x+40+380*f)+'" y1="'+y+'" x2="'+(x+40+380*f)+'" y2="'+(y+38)+'" class="ln s-bl"/>'});return s+(ex||'')};
  o+=G(0,R(20,20,450,300,'bx')+T(60,52,'Cada capa, a su velocidad','t3')+[0,1,2,3,4].map(function(i){var y=74+i*46;return '<rect x="60" y="'+y+'" width="380" height="38" fill="#9a5b28"/>'}).join('')+T(48,100,'','t4')+T(245,306,'pistón por capa · sin comunicación vertical','t4 mut','middle'));
  var f1=[1,.72,.48,.3,.16];
  o+=S(1,[0,1,2,3,4].map(function(i){var y=74+i*46;return '<rect x="60" y="'+y+'" width="'+380*f1[i]+'" height="38" fill="rgba(58,107,208,.72)"/><line x1="'+(60+380*f1[i])+'" y1="'+y+'" x2="'+(60+380*f1[i])+'" y2="'+(y+38)+'" class="ln s-bl"/>'}).join(''));
  o+=S(2,'<rect x="440" y="74" width="14" height="38" fill="#ff8f7a"/>'+T(246,70,'','t4')+T(446,64,'irrumpe','t4 r','end'));
  o+=S(3,T(245,336,'M > 1: las capas rápidas se aceleran','t3 am','middle'));
  o+=S(4,pan(490,[.82,.74,.66,.58,.52],'M < 1: avance más parejo','bx-g')+T(715,336,'el polímero ordena el barrido','t3 g','middle'));
  return o}});
/* ---------- e3/e4 · barrido y recuperación con polímero ---------- */
HD.def('polres',{n:2,alt:'Barrido vertical y factor de recuperación sin y con polímero',draw:function(){
  var o=T(20,34,'Modelo de capas · M = 4,7 → M = 0,47','t2 g'),r=[['Barrido vertical',66,90,'66 %','≈ 90 %'],['Factor de recuperación',41,56,'41 %','56 %']];
  r.forEach(function(q,i){var y=66+i*130;o+=T(20,y+22,q[0],'t2')+G(0,'<rect x="20" y="'+(y+34)+'" width="'+q[1]*6.2+'" height="30" rx="6" class="f-am"/>'+T(30+q[1]*6.2,y+57,q[3]+' · sin polímero','t3'))+G(1,'<rect x="20" y="'+(y+70)+'" width="'+q[2]*6.2+'" height="30" rx="6" class="f-g"/>'+T(30+q[2]*6.2,y+93,q[4]+' · con polímero (5 cP)','t3'))});
  return o}});
/* ---------- e4 · polímeros: HPAM y xantano ---------- */
HD.def('pol',{n:3,alt:'Moléculas de HPAM y xantano y efecto de la salinidad',draw:function(){
  var coil=function(cx,cy,r,k){var d='M'+cx+' '+cy,i;for(i=1;i<=k;i++){var a=i*0.9;d+=' L'+(cx+Math.cos(a)*r*(.35+i/k*.65)).toFixed(1)+' '+(cy+Math.sin(a)*r*(.35+i/k*.65)).toFixed(1)}return d},o='';
  o+=G(0,R(20,30,290,300,'bx')+T(165,64,'HPAM','t1','middle')+HD.P(coil(165,185,92,40),'ln s-bl')+T(165,300,'barato · mucho poder viscosificante','t4 mut','middle')+T(165,322,'agua dulce: cadena extendida','t4 bl','middle'));
  o+=S(1,R(335,30,290,300,'bx-am')+T(480,64,'HPAM + sal / dureza','t2 am','middle')+HD.P(coil(480,185,44,40),'ln s-am')+[[430,120],[540,128],[436,256],[538,250]].map(function(q){return C(q[0],q[1],9,'f-am')+T(q[0],q[1]+4,'+','t4 dk','middle')}).join('')+T(480,300,'los cationes divalentes comprimen','t4 mut','middle')+T(480,322,'la molécula: baja la viscosidad','t4 am','middle'));
  o+=S(2,R(650,30,290,300,'bx-g')+T(795,64,'Xantano','t1 g','middle')+HD.P('M700 190 L890 190','ln s-g')+'<path d="M700 190 L890 190" class="ln s-g" stroke-width="8" stroke-opacity=".4"/>'+T(795,260,'tolera sal y cizalla; más caro,','t4 mut','middle')+T(795,282,'sensible a degradación biológica','t4 mut','middle'));
  return o}});
/* ---------- e5 · número capilar ---------- */
HD.def('ncap',{n:3,alt:'Saturación residual de petróleo en función del número capilar',draw:function(){
  var X=function(e){return 90+(e+8)*(520/6)},Y=function(s){return 300-s*220},o=HD.axes(90,300,640,40,'Número capilar N_{c} (escala log)','Petróleo residual S_{or}');
  o+=[-8,-7,-6,-5,-4,-3,-2].map(function(e){return T(X(e),316,'10^{'+e+'}','t4 mut','middle')}).join('');
  o+=S(0,R(690,40,250,82,'bx-bl')+T(706,70,'N_{c} = μ·v / σ','t2')+T(706,100,'fuerzas viscosas / capilares','t4 mut'));
  o+=S(1,'<rect x="'+X(-7)+'" y="50" width="'+(X(-6)-X(-7))+'" height="250" fill="rgba(232,161,90,.2)"/>'+T((X(-7)+X(-6))/2,64,'inyección de agua','t4 am','middle')+HD.fn(function(x){var e=-8+(x-90)/(520/6);return Y(.3/(1+Math.exp((e+4.3)*1.6))+.02)},90,610,70,'ln s-w')+T(X(-4.3)+30,Y(.17)-44,'S_{or} baja al superar|un N_{c} crítico','t4','start'));
  o+=S(2,HD.A(X(-6.4),170,X(-3.2),170,'g')+T(X(-4.8),150,'×1 000 o más','t3 g','middle')+R(690,140,250,150,'bx-g')+T(706,170,'Bajar la tensión','t3 g')+T(706,194,'interfacial σ de decenas','t3')+T(706,218,'de mN/m a milésimas:','t3')+T(706,242,'tensión ultrabaja','t3 g'));
  return o}});
/* ---------- e5 · comportamiento de fases (Winsor) ---------- */
HD.def('win',{n:2,alt:'Tubos de Winsor I, III y II al aumentar la salinidad',draw:function(){
  var tube=function(cx,lv,tag){var s='<rect x="'+(cx-50)+'" y="40" width="100" height="220" rx="12" class="bx"/>';lv.forEach(function(l){s+='<rect x="'+(cx-48)+'" y="'+l[0]+'" width="96" height="'+l[1]+'" fill="'+l[2]+'"/>'});return s+T(cx,292,tag,'t2','middle')},o='';
  o+=G(0,tube(200,[[44,70,'#e8a15a'],[114,142,'#8d6fd1'],[256,0,'']],'Winsor I')+T(200,320,'baja salinidad','t4 mut','middle')+tube(760,[[44,142,'#8d6fd1'],[186,70,'#3A6BD0'],[256,0,'']],'Winsor II')+T(760,320,'alta salinidad','t4 mut','middle'));
  o+=S(1,tube(480,[[44,70,'#e8a15a'],[114,70,'#5fd1a4'],[184,72,'#3A6BD0']],'Winsor III')+T(480,320,'salinidad óptima','t4 g','middle')+R(538,70,170,92,'bx-g')+T(552,100,'fase intermedia:','t3')+T(552,124,'tensión interfacial','t3')+T(552,148,'mínima','t3 g')+HD.A(536,116,502,116,'g'));
  o+=HD.A(300,170,380,170,'w')+HD.A(580,170,660,170,'w').replace('','');
  return o}});
/* ---------- e6 · desplazamiento inmiscible vs miscible ---------- */
HD.def('mis',{n:4,alt:'Desplazamiento inmiscible y miscible y presión mínima de miscibilidad',draw:function(){
  var o='';
  o+=G(0,R(20,30,500,150,'bx')+T(40,60,'Inmiscible · pistón de baja viscosidad','t2 am')+'<rect x="40" y="76" width="460" height="82" fill="#9a5b28"/><rect x="40" y="76" width="170" height="82" fill="rgba(160,224,205,.7)"/>'+T(380,124,'Sor alto','t3 w','middle')+T(125,124,'gas','t3 dk','middle'));
  o+=G(0,R(20,200,500,140,'bx-g')+T(40,230,'Miscible · se mezcla con el petróleo','t2 g')+'<rect x="40" y="246" width="460" height="74" fill="#9a5b28"/><rect x="40" y="246" width="330" height="74" fill="rgba(95,209,164,.55)"/>'+T(205,290,'casi sin petróleo residual','t3 w','middle'));
  var Y=function(p){return 330-p*1.25};
  o+=S(1,'<rect x="600" y="'+Y(100)+'" width="320" height="'+(330-Y(100))+'" fill="rgba(232,161,90,.18)"/><rect x="600" y="'+Y(210)+'" width="320" height="'+(Y(100)-Y(210))+'" fill="rgba(95,209,164,.2)"/>'+L(590,Y(100),930,Y(100),'s-g')+T(930,Y(100)+22,'MMP','t2 g','end')+T(610,Y(80),'inmiscible o parcial','t3 am')+T(610,Y(155),'miscible','t3 g')+T(600,24,'Presión del yacimiento','t3 mut'));
  o+=S(2,L(590,Y(210),930,Y(210),'s-r dash')+T(930,Y(210)-8,'techo: presión de fractura','t3 r','end'));
  o+=S(3,R(620,258,300,66,'bx-bl')+T(636,284,'CO₂: por encima de 31 °C y 74 bar','t3')+T(636,308,'fluido denso; MMP menor que N₂ o CH₄','t4 bl'));
  return o}});
/* ---------- e6 · WAG ---------- */
HD.def('wag',{n:3,alt:'Gas de baja viscosidad que digita y alternancia agua-gas',draw:function(){
  var o='';
  o+=G(0,R(20,30,440,270,'bx')+T(240,62,'Gas solo: dedos y segregación','t2 am','middle')+'<rect x="40" y="84" width="400" height="176" fill="#9a5b28"/><path d="M40 90 L240 90 C 260 100, 250 108, 330 110 C 360 114, 300 120, 420 124 L420 130 L40 130Z" fill="rgba(160,224,205,.8)"/><path d="M40 130 L150 130 C 170 150, 130 160, 200 170 L40 170Z" fill="rgba(160,224,205,.65)"/>'+T(240,286,'barre una fracción pequeña del reservorio','t4 mut','middle'));
  o+=S(1,R(480,30,460,270,'bx-g')+T(710,62,'WAG: agua y gas alternados','t2 g','middle')+'<rect x="500" y="84" width="420" height="176" fill="#9a5b28"/>'+[0,1,2,3,4,5].map(function(i){return '<rect x="'+(500+i*70)+'" y="84" width="70" height="176" fill="'+(i%2?'rgba(58,107,208,.75)':'rgba(160,224,205,.8)')+'"/>'}).join('')+T(710,286,'el agua frena al gas y mejora el barrido','t4 g','middle'));
  o+=S(2,R(480,312,460,38,'bx','Relación agua/gas · tamaño de ciclo · histéresis','t3'));
  return o}});
/* ---------- e7 · métodos térmicos ---------- */
HD.def('therm',{n:4,alt:'Estimulación cíclica con vapor, vapor continuo, SAGD y combustión in situ',draw:function(){
  var o='',pan=function(i,t,s){var x=20+i*236;return R(x,20,220,320,'bx')+T(x+110,54,t,'t2','middle')+T(x+110,324,s,'t4 mut','middle')+'<rect x="'+(x+14)+'" y="86" width="192" height="206" fill="#9a5b28"/>'};
  o+=G(0,pan(0,'Cíclica (huff & puff)','un solo pozo, por ciclos')+'<rect x="112" y="60" width="8" height="150" class="f-gr" transform="translate(0 28)"/><ellipse cx="116" cy="230" rx="70" ry="38" fill="rgba(240,176,112,.6)"/>'+T(116,236,'vapor','t4 dk','middle'));
  o+=S(1,pan(1,'Vapor continuo','inyector y productor')+'<rect x="268" y="110" width="8" height="150" class="f-gr"/><rect x="432" y="110" width="8" height="150" class="f-gr"/><path d="M276 130 L376 160 L376 230 L276 258Z" fill="rgba(240,176,112,.6)"/>'+A(280,196,420,196,'am'));
  o+=S(2,pan(2,'SAGD','dos pozos horizontales')+'<line x1="530" y1="150" x2="680" y2="150" class="ln s-w" stroke-width="7"/><line x1="530" y1="228" x2="680" y2="228" class="ln s-w" stroke-width="7"/><path d="M540 150 L680 150 L640 110 L580 110Z" fill="rgba(240,176,112,.6)"/>'+A(605,150,605,222,'am'));
  o+=S(3,pan(3,'Combustión in situ','arde parte del petróleo')+'<rect x="740" y="110" width="8" height="150" class="f-gr"/><path d="M750 130 C 800 150, 800 220, 750 250" class="nf ln s-r" stroke-width="5"/>'+T(842,196,'aire','t4 w','middle')+A(745,196,800,196,'bl'));
  return o}});
/* ---------- e8 · screening de métodos ---------- */
HD.def('scr',{n:4,alt:'Resultados del screening de siete métodos para un campo de ejemplo',draw:function(){
  var M=[['Polímero','Candidato'],['Tensioactivo / ASP','Descartado'],['CO₂ miscible','Descartado'],['Gas de hidrocarburo','Descartado'],['N₂ y gas de combustión','Descartado'],['Vapor','Candidato'],['Combustión in situ','Candidato']],o='',cl={'Candidato':'bx-g','Descartado':'bx-r','Revisar':'bx-am'};
  M.forEach(function(m,i){var y=26+i*44;o+=G(0,T(20,y+27,m[0],'t2')+'<line x1="20" y1="'+(y+38)+'" x2="470" y2="'+(y+38)+'" class="ln s-gr thin"/>');
    var u=i===0?3:undefined;o+=S(2,R(300,y+2,160,32,cl[m[1]],m[1],'t3'),u)});
  o+=S(3,R(300,28,160,32,'bx-am','Revisar','t3')+T(20,342,'A 200 cP el polímero falla un criterio y pasa a Revisar','t3 am'));
  o+=S(1,R(620,26,320,290,'bx')+T(640,58,'Criterios fallados','t2 g')+[['Candidato','ninguno','g'],['Revisar','uno','am'],['Descartado','dos o más','r']].map(function(q,i){return T(640,110+i*70,q[0],'t2 '+q[2])+T(640,134+i*70,q[1],'t3 mut')}).join('')+T(780,306,'✓ cumple · ✗ no · n/a no aplica','t4 mut','middle'));
  return o}});
/* ---------- e9 · economía del piloto ---------- */
HD.def('econ',{n:6,alt:'Costo del piloto, costo por barril incremental y valor actual neto en tres escenarios',draw:function(){
  var o='';
  o+=G(0,R(20,24,430,90,'bx')+T(38,56,'Polímero: 300 t × 3,5 US$/kg','t2')+T(38,92,'= 1,05 MM US$','t1 am'));
  o+=G(1,R(20,126,430,90,'bx')+T(38,158,'Pozos y planta 4 + otros 1 + polímero','t3')+T(38,196,'Piloto = 6,05 MM US$','t1 am'));
  o+=G(2,R(20,228,430,100,'bx-g')+T(38,258,'287 000 bbl incrementales (6 % OOIP)','t3')+T(38,296,'21 US$/bbl · equilibrio 28 US$/bbl','t2 g')+T(38,318,'(sin descontar)','t4 mut'));
  o+=T(500,40,'Valor actual neto simple (MM US$)','t2 g');
  var Z=640,sc=40;
  o+=L(Z,60,Z,330,'s-m');
  [[3,'Precio 65 US$/bbl',5.5,'g'],[4,'Precio 45 US$/bbl',2,'bl'],[5,'45 US$ y respuesta a la mitad',-2,'r']].forEach(function(q,i){var y=76+i*84,w=Math.abs(q[2])*sc,x=q[2]>=0?Z:Z-w;o+=G(q[0],T(500,y+62,q[1],'t3')+'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="38" rx="6" class="f-'+q[3]+'"/>'+T(q[2]>=0?Z+w+12:Z+12,y+28,(q[2]>0?'+':'−')+String(Math.abs(q[2])).replace('.',','),'t2'))});
  return o}});
})();
