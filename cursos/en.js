/* H3L · Cursos · textos fijos del reproductor en inglés. Solo actúa cuando el curso cargado está en inglés (HC.course lang 'en'):
   reemplaza frases fijas en español del reproductor por su versión en inglés. El contenido del curso viene de data/en/<id>.json.
   Pendiente (sigue en español): etiquetas dentro de los laboratorios interactivos, certificado (imagen) y planillas Excel. */
(function(){
'use strict';
var P=[
['CURSO H3L','H3L COURSE'],['Metodología STAR','STAR method'],['Aplicación a un caso real','Applied to a real case'],['Preguntas que respondemos','Questions we answer'],
['SITUACIÓN','SITUATION'],['TAREA','TASK'],['ACCIÓN','ACTION'],['RESULTADO','RESULT'],
['Resumen del curso','Course summary'],['Ítems vistos','Items covered'],['Quiz del módulo','Module quiz'],
['Consultoría en Oil & Gas y transición energética.','Oil & Gas consulting and energy transition.'],
['Laboratorio interactivo','Interactive lab'],['Concepto clave','Key concept'],['Comparativo','Comparison'],['Caso real','Real case'],
['Objetivos de aprendizaje','Learning objectives'],['Qué incluye','What is included'],['Herramientas de estudio','Study tools'],
['lecciones narradas + presentación y cierre','narrated lessons + introduction and closing'],['min de narración','min of narration'],
['Laboratorios interactivos y mapas:','Interactive labs and maps:'],['planilla(s) Excel de práctica con fórmulas vivas','practice Excel workbook(s) with live formulas'],
['quizzes de módulo, preguntas rápidas en las lecciones y examen final','module quizzes, quick questions inside lessons and a final exam'],
['Certificado H3L verificable, para compartir en tu perfil profesional','Verifiable H3L certificate to share on your professional profile'],
['Casos reales','Real cases'],['Bibliografía y estándares','References and standards'],['Caso','Case'],
['Esquema de 5 niveles de dominio: conocer → aprender → aplicar → transferir → transformar. Las competencias del curso se basan en un mapa de competencias técnicas de exploración y producción (geología, reservorios, producción, perforación).','Five mastery levels: know → learn → apply → transfer → transform. The course competencies are based on a technical competency map for exploration and production (geology, reservoirs, production, drilling).'],
['preguntas · mínimo 70 %','questions · minimum 70 %'],['preg. · 70 %','questions · 70 %'],['preg.','questions'],
['Presentación del curso','Course introduction'],['Presentación','Introduction'],['Cierre','Closing'],['No se pudo cargar el curso','The course could not be loaded']
];
function tr(s){for(var i=0;i<P.length;i++)if(s.indexOf(P[i][0])>=0)s=s.split(P[i][0]).join(P[i][1]);return s}
var busy=false;
function walk(n){if(n.nodeType===3){var v=n.nodeValue;if(v&&/[A-Za-zÁÉÍÓÚáéíóúñ]/.test(v)){var w=tr(v);if(w!==v)n.nodeValue=w}return}
  if(n.nodeType!==1||/^(SCRIPT|STYLE|CANVAS|TEXTAREA|INPUT)$/.test(n.tagName))return;
  if(n.id==='wdbox'||(n.closest&&n.closest('#wdbox')))return;
  for(var c=n.firstChild;c;c=c.nextSibling)walk(c)}
function on(){return window.HC&&HC.course&&HC.course.lang==='en'}
function run(root){if(busy||!on())return;busy=true;try{walk(root||document.body)}finally{busy=false}}
if(window.MutationObserver){var mo=new MutationObserver(function(ms){if(!on())return;busy=true;try{ms.forEach(function(m){if(m.type==='characterData')walk(m.target);m.addedNodes.forEach(function(a){walk(a)})})}finally{busy=false}});
  document.addEventListener('DOMContentLoaded',function(){mo.observe(document.body,{childList:true,subtree:true,characterData:true})})}
window.HC_EN={run:run};
})();
