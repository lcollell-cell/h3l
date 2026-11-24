/* H3L · Cursos · diagramas del curso "Más allá de las reservas comprobadas" (pr2). Esquemas didácticos, no a escala. Datos de ejemplo. */
(function(){'use strict';var HD=window.HD;if(!HD)return;var T=HD.T,S=HD.S,G=HD.G,R=HD.R,L=HD.L,A=HD.A,AP=HD.AP,C=HD.C;
/* ---------- marco de clasificación: clase (vertical) y categoría (horizontal) ---------- */
HD.def('pxfra',{n:5,alt:'Marco PRMS: tres clases por chance de comercialidad y tres estimaciones de incertidumbre, baja, mejor y alta',draw:function(){
  var o='',cx=[330,540,750],cw=190,hd=['Estimación baja|P90','Mejor estimación|P50','Estimación alta|P10'],i;
  o+=G(0,hd.map(function(h,i){return R(cx[i],14,cw,52,'bx',h,'t3')}).join('')+T(20,45,'Incertidumbre →','t3 mut'));
  var rows=[['Reservas','Pc de 90 % o más','bx-g',['1P','2P','3P'],'Probadas, probables y posibles'],['Recursos contingentes','Pc = Pd','bx-am',['1C','2C','3C'],'Descubiertos, no comerciales'],['Recursos prospectivos','Pc = Pg × Pd','bx',['1U','2U','3U'],'Sin descubrir; sin riesgo']];
  rows.forEach(function(r,k){var y=84+k*84;o+=S(k+1,R(20,y,290,72,r[2],'','t2')+T(34,y+28,r[0],'t2')+T(34,y+50,r[1],'t3 mut')+cx.map(function(x,j){return R(x,y,cw,72,r[2],r[3][j],'t1')}).join('')+T(34,y+66,r[4],'t4 mut'))});
  o+=S(4,T(20,352,'Clase: chance de comercialidad (vertical). Categoría: incertidumbre (horizontal)','t3 am'));
  return o}});
/* ---------- categorías: curva de excedencia con P90, P50 y P10 ---------- */
HD.def('pxcat',{n:4,alt:'Curva de probabilidad de excedencia con las estimaciones baja, mejor y alta y los incrementos probable y posible',draw:function(){
  var x0=70,x1=640,y0=300,y1=40,xm=355,s=70,f=function(x){return y0-(y0-y1)*(1/(1+Math.exp((x-xm)/s)))},o='';
  o+=HD.axes(x0,y0,x1,y1)+T(x1,y0+50,'Volumen recuperable →','t4 mut','end')+T(x0+6,y1-12,'Probabilidad de igualar o superar el volumen','t4 mut');
  o+=G(0,HD.fn(f,x0+10,x1-10,60,'ln s-bl')+T(x0-8,y1+4,'100','t4 mut','end')+T(x0-8,y0+4,'0','t4 mut','end'));
  var pts=[[1,.9,'P90 · baja','1P / 1C / 1U','g'],[2,.5,'P50 · mejor','2P / 2C / 2U','am'],[3,.1,'P10 · alta','3P / 3C / 3U','r']];
  pts.forEach(function(q){var x=xm+s*Math.log((1-q[1])/q[1]),y=f(x);o+=S(q[0],L(x,y,x,y0,'s-'+q[4])+L(x0,y,x,y,'s-'+q[4])+C(x,y,7,'f-'+q[4])+T(x,y0+22,q[2],'t3','middle')+T(x0+8,y-8,Math.round(q[1]*100)+' %','t4 '+q[4]))});
  o+=S(3,R(690,40,240,88,'bx-g','Probadas = estimación baja','t3')+R(690,140,240,66,'bx-am','Probables: de la baja|a la mejor','t3')+R(690,218,240,66,'bx-r','Posibles: de la mejor|a la alta','t3'));
  return o}});
/* ---------- Pc = Pg × Pd por clase ---------- */
HD.def('pxpc',{n:5,alt:'Chance de comercialidad como producto de la chance de descubrimiento y la de desarrollo para prospectivos, contingentes y reservas',draw:function(){
  var rows=[['Recurso prospectivo','Pg','×','Pd','=','Pc = Pg × Pd','bx'],['Recurso contingente','Pg = 1','×','Pd','=','Pc = Pd','bx-am'],['Reserva','Pg = 1','×','Pd ≥ 90 %','=','Pc ≥ 90 %','bx-g']],o='';
  rows.forEach(function(r,k){var y=24+k*92;o+=G(k,T(20,y+44,r[0],'t2')+R(250,y+10,150,60,r[6],r[1],'t2')+T(412,y+50,r[2],'t1','middle')+R(430,y+10,170,60,r[6],r[3],'t2')+T(612,y+50,r[4],'t1','middle')+R(630,y+10,300,60,r[6],r[5],'t2 g'))});
  o+=S(3,R(250,290,350,40,'bx-am','Ejemplo: 30 % × 50 % = 15 %','t2 am')+T(620,316,'Datos de ejemplo','t4 mut'));
  o+=S(4,T(20,350,'Pd exige cumplir los criterios de comercialidad y el compromiso de desarrollo','t3 g','start'),5);
  return o}});
/* ---------- el reloj de cinco años ---------- */
HD.def('pxtime',{n:4,alt:'Línea de tiempo desde la clasificación inicial: dos proyectos de ejemplo frente a la referencia de cinco años para iniciar el desarrollo',draw:function(){
  var x0=70,u=110,X=function(a){return x0+a*u},y=160,o='';
  o+=G(0,L(x0,y,X(7.5),y,'s-m')+[0,1,2,3,4,5,6,7].map(function(a){return L(X(a),y-6,X(a),y+6,'s-m')+T(X(a),y+26,String(a),'t4 mut','middle')}).join('')+T(X(7.5),y+26,'años','t4 mut','end')+T(x0,y-30,'Clasificación inicial','t3')+C(x0,y,7,'f-g'));
  o+=S(1,L(X(5),70,X(5),250,'s-am')+T(X(5)+8,78,'referencia de PRMS: cinco años','t3 am'));
  o+=S(2,R(X(0),96,X(2.5)-X(0),30,'bx-g','espera: 2,5 años','t3')+T(X(2.5)+8,116,'inicio del desarrollo: dentro de la referencia','t4 g'));
  o+=S(3,R(X(0),196,X(6.5)-X(0),30,'bx-r','espera: 6,5 años','t3')+T(X(6.5)+8,216,'inicio a los 6,5','t4 r')+T(x0,300,'Sin justificación, el volumen no cumple el criterio de reservas y se evalúa como contingente','t3 am'));
  return o}});
/* ---------- gasto menor frente a un pozo nuevo ---------- */
HD.def('pxdnp',{n:4,alt:'Costo de reactivar un pozo frente a un pozo nuevo y rango de umbrales que usan las compañías para definir gasto menor',draw:function(){
  var x0=60,w=840,X=function(p){return x0+w*p/100},o='';
  o+=G(0,R(x0,40,w,44,'bx-bl','Costo de un pozo nuevo = 100 %','t2')+T(x0,120,'Costo de reactivar o completar un pozo existente, como porcentaje del anterior','t3 mut'));
  o+=S(1,'<rect x="'+X(10)+'" y="136" width="'+(X(50)-X(10))+'" height="36" rx="6" class="bx-am"/>'+T(X(30),159,'Umbrales de las compañías: 10 a 50 %','t4','middle'));
  o+=S(2,'<rect x="'+X(25)+'" y="182" width="'+(X(35)-X(25))+'" height="24" rx="5" class="f-am"/>'+T(X(30),224,'Lo más común: 25 a 35 %','t3 am','middle')+T(x0,254,'PRMS no fija un porcentaje: cada compañía define y documenta el suyo y lo aplica igual a todos los pozos','t4 mut'));
  o+=S(3,R(X(5),270,X(20)-X(5),44,'bx-g','Ejemplo: 15 %|gasto menor','t4')+R(X(60),270,X(80)-X(60),44,'bx-r','Ejemplo: 70 %|no desarrollada','t4')+T(x0,344,'Ejemplos didácticos con un umbral de 30 %; el límite lo define cada compañía','t4 mut'));
  return o}});
})();
