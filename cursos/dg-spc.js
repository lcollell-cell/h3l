/* H3L · Cursos · diagramas del curso "Seguridad de procesos y control de pozos" (spc). Esquemas didácticos, no a escala. */
(function(){'use strict';var HD=window.HD;if(!HD)return;var T=HD.T,S=HD.S,G=HD.G,R=HD.R,L=HD.L,A=HD.A,AP=HD.AP,P=HD.P,C=HD.C;
/* ---------- barreras: dos envolventes y el modelo del queso suizo ---------- */
HD.def('swiss',{n:5,alt:'Capas de defensa con agujeros que se alinean: modelo del queso suizo aplicado a un pozo',draw:function(){
  var o=T(30,32,'Cada barrera tiene fallas; el evento ocurre cuando se alinean','t2 g'),L4=[['Diseño del pozo|y del lodo',120],['Detección|(flujo y pileta)',300],['BOP y|cierre',480],['Respuesta y|capacitación',660]],i;
  L4.forEach(function(q,i){var x=q[1];o+=G(i,'<rect x="'+x+'" y="62" width="110" height="250" rx="10" class="bx"/>'+T(x+55,92,q[0],'t3','middle')+C(x+55,150+i*18,13,'f-r')+C(x+30,240-i*10,9,'f-r')+C(x+80,200+i*6,8,'f-r'))});
  o+=S(4,AP('M40 195 L 860 195','r')+T(30,336,'La falla pasa por todos los huecos: por eso se mantienen dos envolventes verificadas','t3 am'));
  o+=S(0,T(40,185,'Peligro','t3 r','start'));return o}});
/* ---------- balance hidrostático ---------- */
HD.def('hyd',{n:5,alt:'Pozo con la columna de lodo, la presión hidrostática en el fondo y la presión de formación',draw:function(){
  var o='<rect x="60" y="30" width="150" height="290" rx="6" class="f-ov"/>';
  o+=G(0,'<rect x="100" y="30" width="70" height="250" class="f-wat"/>'+T(135,170,'Lodo|MW','t2 w','middle'));
  o+=S(1,R(60,290,150,30,'bx-am','Formación · Pf','t3 am')+AP('M135 290 L135 262','am')+T(240,260,'Presión de formación (Pf)','t3 am'));
  o+=S(2,AP('M135 40 L135 270','bl')+T(240,120,'Presión hidrostática','t2 bl')+T(240,148,'0,052 × MW × TVD','t2')+T(240,172,'(psi, con MW en ppg y TVD en ft)','t4 mut'));
  o+=S(3,R(560,40,360,90,'bx-g','Sobrebalance','t2 g')+T(740,95,'Hidrostática > Pf: el pozo está controlado','t3','middle')+R(560,150,360,90,'bx-r','Subbalance','t2 r')+T(740,205,'Hidrostática < Pf: el fluido de formación puede entrar','t3','middle'));
  o+=S(4,R(560,260,360,70,'bx-am','Margen de viaje','t2 am')+T(740,312,'Se densifica un poco más para cubrir el efecto de sacar la sarta','t4','middle'));return o}});
/* ---------- señales de una surgencia ---------- */
HD.def('kick',{n:6,alt:'Señales de alarma de una surgencia ordenadas desde las primeras a las seguras',draw:function(){
  var it=[['Aumento del caudal de retorno','con la bomba sin cambios','Señal positiva: advertencia primaria'],['Ganancia en piletas','nivel sube sin agregar fluido','Señal positiva'],['Pozo fluye con la bomba parada','prueba de flujo (flow check)','Confirma la surgencia'],['Pozo no toma el volumen','al sacar la sarta (hoja de maniobra)','Señal de llenado incorrecto'],['Baja de presión de bomba y suba de emboladas','influjo liviano en el anular','Señal indirecta'],['Gas de conexión y de maniobra','indica sobrebalance escaso','Tendencia a vigilar']],o='',i;
  it.forEach(function(q,i){var y=24+i*54;o+=G(i,R(30,y,900,46,i<3?'bx-r':'bx')+T(46,y+30,q[0],'t2')+T(520,y+30,q[1],'t3 mut')+T(960-30,y+30,'','t4'))});
  return o+S(5,T(30,352,'Ante la duda, se cierra el pozo: una falsa alarma cuesta minutos; una surgencia no controlada, el pozo','t3 am'))}});
/* ---------- secuencia de cierre ---------- */
HD.def('shut',{n:7,alt:'Secuencia de cierre duro del pozo tras detectar la surgencia',draw:function(){
  var p={items:[{t:'Detectar|y alertar',s:'alarma y|parar'},{t:'Levantar|la sarta',s:'junta sobre|la mesa'},{t:'Verificar|flujo',s:'bomba|parada'},{t:'Cerrar|el BOP',s:'choke|cerrado'},{t:'Avisar|al jefe',s:'y anotar|la hora'},{t:'Leer|presiones',s:'SIDPP, SICP|y ganancia'},{t:'Calcular',s:'peso de|control'}],h:210};
  return HD.defs.flow.draw(p)}});
/* ---------- conjunto de BOP ---------- */
HD.def('stack',{n:5,alt:'Conjunto de BOP con anular, arietes, ciego-cortante, líneas de kill y de choke',draw:function(){
  var cx=250,o='<rect x="'+(cx-12)+'" y="20" width="24" height="320" class="f-sh"/>';
  o+=G(0,'<rect x="'+(cx-70)+'" y="30" width="140" height="56" rx="14" class="f-seal"/>'+T(cx+84,64,'Preventor anular','t2'));
  o+=G(1,'<rect x="'+(cx-62)+'" y="104" width="124" height="44" rx="8" class="f-bl"/>'+T(cx+76,134,'Ariete de tubería','t2')+'<rect x="'+(cx-62)+'" y="262" width="124" height="44" rx="8" class="f-bl"/>'+T(cx+76,292,'Ariete de tubería','t2'));
  o+=G(2,'<rect x="'+(cx-62)+'" y="182" width="124" height="44" rx="8" class="f-am"/>'+T(cx+76,212,'Ciego-cortante (BSR)','t2'));
  o+=S(3,L(cx+62,244,cx+300,244,'s-am')+T(cx+310,250,'Línea del choke','t3 am')+L(cx-62,244,cx-190,244,'s-g')+T(cx-200,250,'Línea de kill','t3 g','end'));
  o+=S(4,R(640,40,290,110,'bx-am','Acumulador','t2 am')+T(785,108,'Energía para cerrar aun|sin potencia en el equipo','t4','middle')+R(640,180,290,110,'bx-g','Pruebas','t2 g')+T(785,248,'Baja y alta presión, con|registro y frecuencia','t4','middle'));
  return o}});
/* ---------- cementación: ventana y desplazamiento ---------- */
HD.def('cem',{n:5,alt:'Etapas de una cementación primaria y ventana de presión entre poro y fractura',draw:function(){
  var o='',st=['Acondicionar el lodo','Espaciador','Lechada guía y cola','Tapón y desplazar','Verificar'];
  st.forEach(function(q,i){var x=30+i*180;o+=G(i,R(x,60,160,110,i===4?'bx-g':'bx',q,'t3'))+(i<4?G(i+1,A(x+162,115,x+178,115,'g')):'')});
  o+=S(1,R(30,200,900,56,'bx-am','El espaciador separa lodo y cemento: sin él se contaminan y la lechada no fragua bien','t3'));
  o+=S(3,R(30,274,900,56,'bx-am','El desplazamiento debe terminar con el tapón asentado en el collar y sin retorno al soltar','t3'));
  o+=S(4,R(30,14,900,34,'bx-g','Registro de cemento (CBL / ultrasónico) y prueba de la barrera','t3'));return o}});
/* ---------- la cementación en la ventana ---------- */
HD.def('win',{n:4,alt:'Ventana operativa: la densidad equivalente debe quedar entre la presión de poro y la de fractura',draw:function(){
  var X=function(r){return 90+(r-8)/(18-8)*820},o=HD.axes(90,300,910,50,'Densidad equivalente (ppg)','');
  o+=S(0,'<rect x="'+X(8)+'" y="70" width="'+(X(10)-X(8))+'" height="70" class="f-wat"/>'+T(X(9),112,'Poro','t2 w','middle')+'<rect x="'+X(15)+'" y="70" width="'+(X(18)-X(15))+'" height="70" fill="rgba(255,100,80,.4)"/>'+T(X(16.5),112,'Fractura','t2 w','middle'));
  o+=S(1,'<rect x="'+X(10)+'" y="70" width="'+(X(15)-X(10))+'" height="70" fill="rgba(95,209,164,.18)"/>'+T(X(12.5),112,'Ventana operativa','t2 g','middle'));
  o+=S(2,L(X(13.2),150,X(13.2),250,'s-g')+T(X(13.2),270,'Equivalente estático','t3 g','middle')+L(X(14.4),150,X(14.4),220,'s-am')+T(X(14.4),240,'Con fricción (ECD)','t3 am','middle'));
  o+=S(3,R(90,300+14,820,36,'bx-am','Si el ECD toca la fractura: bajar caudal, aligerar la lechada o cementar por etapas','t3'));
  return o}});
/* ---------- capas de protección y LOPA ---------- */
HD.def('lopa',{n:6,alt:'Capas de protección independientes entre el evento iniciador y la consecuencia',draw:function(){
  var o='',names=['Proceso','Control y alarmas','Intervención del operador','Sistema instrumentado (SIS)','Alivio físico','Contención y emergencia'],i;
  for(i=0;i<6;i++){var r=165-i*27;o+=G(i,'<circle cx="190" cy="190" r="'+r+'" class="bx'+(i===3?'-g':'')+'"/>')}
  names.forEach(function(q,i){o+=G(i,T(400,50+i*50,(i+1)+'. '+q,'t2'))});
  o+=S(5,R(640,50,290,120,'bx-am','Frecuencia mitigada','t2 am')+T(785,118,'f = f(inicio) × PFD₁ × PFD₂ ×…','t3','middle')+T(785,150,'se compara con la meta de riesgo','t4 mut','middle')+R(640,200,290,100,'bx-g','Capa independiente','t2 g')+T(785,264,'Solo cuenta si falla sin depender de las demás','t4','middle'));
  return o}});
/* ---------- gestión del cambio ---------- */
HD.def('moc',{n:6,alt:'Pasos de la gestión del cambio: solicitar, evaluar, aprobar, implementar, verificar y cerrar',draw:function(){
  var p={items:[{t:'Solicitar',s:'qué cambia|y por qué'},{t:'Evaluar',s:'riesgos con|HAZOP'},{t:'Aprobar',s:'por quien|corresponda'},{t:'Implementar',s:'procedimientos|y capacitación'},{t:'Verificar',s:'antes de|arrancar'},{t:'Cerrar',s:'actualizar|documentos'}],h:200,last:true,note:'Un cambio temporal que se vuelve permanente sin evaluación es la causa clásica de accidentes'};
  return HD.defs.flow.draw(p)}});
/* ---------- corrosión y ductos ---------- */
HD.def('corr',{n:5,alt:'Corte de una cañería con pérdida de metal por corrosión y sus parámetros de profundidad y largo',draw:function(){
  var o='<rect x="60" y="80" width="520" height="150" rx="8" class="f-sh"/>';
  o+=G(0,'<path d="M60 150 Q200 150 260 162 Q300 190 340 162 Q400 150 580 150 L580 230 L60 230 Z" class="f-oil" opacity=".35"/>'+T(320,118,'Pared de la cañería (espesor t)','t3 mut','middle'));
  o+=S(1,'<path d="M230 80 Q290 80 290 155 Q290 190 330 190 Q370 190 370 80 Z" fill="rgba(255,120,90,.55)"/>'+T(300,70,'Defecto','t2 r','middle'));
  o+=S(2,L(230,52,370,52,'s-am')+T(300,44,'L (largo)','t3 am','middle')+L(395,80,395,190,'s-am')+T(405,140,'d (profundidad)','t3 am'));
  o+=S(3,R(640,40,290,110,'bx-am','Presión segura','t2 am')+T(785,112,'ASME B31G modificado,|con tensión de flujo','t4','middle')+R(640,170,290,100,'bx-g','Vida remanente','t2 g')+T(785,230,'(t − t mín) / velocidad','t4','middle'));
  o+=S(4,R(60,260,520,70,'bx-r','Inspeccionar antes de la mitad de la vida remanente; reparar si ERF ≥ 1','t3'));return o}});
/* ---------- ciclo de vida del pozo ---------- */
HD.def('life',{n:6,alt:'Ciclo de vida del pozo con las barreras requeridas en cada fase',draw:function(){
  var p={items:[{t:'Perforación',s:'lodo + BOP|y cañerías'},{t:'Terminación',s:'cañería y|válvulas'},{t:'Producción',s:'árbol, cabezal|y monitoreo'},{t:'Intervención',s:'BOP y fluido|de control'},{t:'Abandono',s:'tapones de|cemento'},{t:'Después',s:'vigilancia y|cierre'}],h:200,last:true,note:'En cada fase debe haber dos barreras verificadas entre el reservorio y la superficie'};
  return HD.defs.flow.draw(p)}});
/* ---------- tapones de abandono ---------- */
HD.def('abd',{n:4,alt:'Pozo abandonado con tapones de cemento, envolventes primaria y secundaria y corte del cabezal',draw:function(){
  var cx=220,o='<rect x="'+(cx-34)+'" y="20" width="6" height="320" class="f-sh"/><rect x="'+(cx+28)+'" y="20" width="6" height="320" class="f-sh"/>';
  o+=G(0,'<rect x="'+(cx-28)+'" y="270" width="56" height="60" class="f-oil"/>'+T(cx+50,305,'Zona con hidrocarburos','t3 am'));
  o+=S(1,'<rect x="'+(cx-28)+'" y="190" width="56" height="60" fill="#c9c3b5"/>'+T(cx+50,226,'Primera envolvente (tapón de cemento)','t3'));
  o+=S(2,'<rect x="'+(cx-28)+'" y="110" width="56" height="60" fill="#c9c3b5"/>'+T(cx+50,146,'Segunda envolvente (tapón de cemento)','t3'));
  o+=S(3,R(620,40,310,120,'bx-g','Se verifican','t2 g')+T(775,108,'Con peso (tag) y prueba|de presión','t4','middle')+R(620,180,310,120,'bx-am','Cierre de superficie','t2 am')+T(775,248,'Corte del cabezal, chapa|con identificación y vigilancia','t4','middle'));
  return o}});
})();
