/* H3L · Cursos Online · núcleo: idioma de la interfaz, progreso (localStorage), catálogo, utilidades */
(function(){'use strict';
var HC=window.HC={};
var LANGS=['es','en','fr','pt'];
/* ---------- textos de la interfaz (el contenido de los cursos está en español) ---------- */
var D={
es:{home:'Sitio H3L',cat:'Cursos',admin:'Administrar',verify:'Verificar certificado',pill:'Cursos Online H3L',
 hero_h:'Aprendé oil & gas y transición energética con casos reales',
 hero_p:'Lecciones narradas e interactivas con laboratorios, mapas, planillas Excel de práctica, evaluaciones y certificado H3L publicable en LinkedIn. Podés pausar, retroceder, leer la transcripción y tomar notas.',
 st_c:'cursos',st_l:'lecciones',st_q:'evaluaciones',st_x:'Excel de práctica',
 sec_h:'Catálogo de cursos',sec_p:'Quince especialidades, cada una con módulos, laboratorios dinámicos, evaluaciones intermedias, examen final y certificación.',
 lang_note:'Contenido de los cursos en español. La interfaz está disponible en 4 idiomas.',vw:'Vista',vw_cards:'Tarjetas',vw_list:'Listado',vw_tree:'Explorador',q_ph:'Buscar curso, tema o lección…',ex_all:'Expandir todo',co_all:'Contraer todo',th_c:'Curso',th_s:'Sección',th_lv:'Nivel',th_ls:'Lecciones',th_du:'Duración',th_pr:'Progreso',th_ac:'Acción',nores:'Sin resultados para la búsqueda.',tr_files:'Archivos de práctica',tr_hint:'Usá las flechas del teclado para recorrer el árbol y Enter para abrir.',tr_exam:'Examen final y certificado',
 how1:'1 · Mirá y experimentá',how1p:'Lecciones narradas con transcripción, subtítulos, velocidad y retroceso. Los laboratorios te piden mover variables.',
 how2:'2 · Practicá en Excel',how2p:'Cada curso incluye planillas descargables con fórmulas vivas y datos de ejemplo.',
 how3:'3 · Evaluate',how3p:'Preguntas rápidas en la lección, quiz por módulo (aprobás con 70 %) y examen final.',
 how4:'4 · Certificate',how4p:'Certificado H3L con código verificable; lo agregás a tu perfil de LinkedIn en un clic.',
 start:'Comenzar',resume:'Continuar',review:'Repasar',lessons:'lecciones',min:'min',done:'completado',level:'Nivel',
 ex:'Excel',exams:'evaluaciones',certok:'Certificado obtenido',
 back:'← Catálogo',course:'Curso',content:'Contenido del curso',files:'Archivos de práctica',tab_ov:'Resumen',tab_tr:'Transcripción',tab_nt:'Notas',tab_fl:'Archivos',tab_rf:'Bibliografía y casos',tab_cm:'Mapa de competencias',tab_ce:'Certificado',
 play:'Reproducir',pause:'Pausar',b10:'Retroceder 10 s',f10:'Adelantar 10 s',prev:'Anterior',next:'Siguiente',speed:'Velocidad',voice:'Voz',nosound:'Sin narración (solo subtítulos)',cc:'Subtítulos',
 cont:'Continuar ▶',lab:'Laboratorio: movés las variables y después presionás Continuar.',
 lesson_done:'Lección completada',up_next:'Siguiente lección',
 srch:'Buscar en la transcripción…',dl_tx:'Descargar transcripción',copy:'Copiar',print:'Imprimir',copied:'Copiado',
 add_note:'Agregar nota en este momento',note_ph:'Escribí tu nota…',save:'Guardar',del:'Eliminar',dl_nt:'Descargar mis notas',nonotes:'Todavía no hay notas.',
 quiz:'Evaluación',quiz_m:'Quiz del módulo',exam:'Examen final',q_start:'Rendir',q_send:'Corregir',q_retry:'Reintentar',q_close:'Cerrar',q_pass:'Aprobado',q_fail:'No alcanzaste el mínimo (70 %). Repasá las lecciones y reintentá.',score:'Puntaje',answer_all:'Respondé todas las preguntas.',
 q_lock:'Completá antes todas las lecciones.',exam_lock:'Disponible al completar lecciones y quizzes de módulo.',
 cp_t:'Pregunta rápida',cp_ok:'Correcto',cp_no:'Revisá: ',cp_go:'Seguir',
 xl_get:'Descargar',xl_done:'Marcar como practicado',xl_dn:'Practicado ✓',
 cert_h:'Certificado H3L',cert_p:'Al aprobar el curso podés generar tu certificado. El nombre que escribas aparecerá en el documento y en el código de verificación.',
 cert_name:'Nombre completo',cert_gen:'Generar certificado',cert_png:'Descargar PNG',cert_li:'Agregar a LinkedIn',cert_sh:'Compartir publicación',cert_url:'Enlace de verificación',cert_lock:'Para obtener el certificado necesitás completar todas las lecciones, aprobar los quizzes de módulo y el examen final.',
 cert_note:'La verificación comprueba que el código coincide con los datos del certificado (nombre, curso, fecha y puntaje). Es un control de integridad, no un registro central.',
 prog:'Tu progreso',lbl_ls:'Lecciones',lbl_qz:'Quizzes',lbl_ex:'Examen',
 lv1:'Conocer',lv2:'Aprender',lv3:'Aplicar',lv4:'Transferir',lv5:'Transformar',cm_p:'Cada competencia avanza de nivel con tu actividad: ver las lecciones, responder las preguntas, usar laboratorios y Excel, aprobar quizzes y el examen final.',cm_c:'Competencia',
 refs_p:'Bibliografía técnica y casos reales usados en el curso. Antes de citarlos en un trabajo, verificá la edición en OnePetro u otra fuente primaria.',
 demo:'Los datos numéricos de los laboratorios y de los Excel son ejemplos didácticos, no datos de campos reales.',
 adm_h:'Administración de cursos',adm_p:'Vista de gestión: secciones, lecciones, evaluaciones y archivos. Los cambios de visibilidad y orden se guardan en este navegador y se exportan a catalog.json para publicarlos.',
 adm_exp:'Exportar catalog.json',adm_rst:'Restablecer',pub:'Publicado',hid:'Oculto',ord:'Orden',ttl:'Título',vis:'Visible',
 ver_h:'Verificar certificado H3L',ver_ok:'Certificado válido: los datos coinciden con el código.',ver_bad:'El código no coincide con los datos. El certificado fue alterado o el enlace está incompleto.',ver_none:'Pegá el enlace de verificación del certificado o abrilo desde el QR/enlace.'},
en:{home:'H3L site',cat:'Courses',admin:'Manage',verify:'Verify certificate',pill:'H3L Online Courses',
 hero_h:'Learn oil & gas and energy transition through real cases',
 hero_p:'Narrated, interactive lessons with labs, maps, practice Excel workbooks, assessments and an H3L certificate you can post on LinkedIn. Pause, rewind, read the transcript and take notes.',
 st_c:'courses',st_l:'lessons',st_q:'assessments',st_x:'practice Excel files',
 sec_h:'Course catalog',sec_p:'Fifteen specialties, each with modules, dynamic labs, mid-course assessments, a final exam and certification.',
 lang_note:'Course content is in Spanish. The interface is available in 4 languages.',vw:'View',vw_cards:'Cards',vw_list:'List',vw_tree:'Explorer',q_ph:'Search course, topic or lesson…',ex_all:'Expand all',co_all:'Collapse all',th_c:'Course',th_s:'Section',th_lv:'Level',th_ls:'Lessons',th_du:'Duration',th_pr:'Progress',th_ac:'Action',nores:'No results for the search.',tr_files:'Practice files',tr_hint:'Use the arrow keys to move through the tree and Enter to open.',tr_exam:'Final exam and certificate',
 how1:'1 · Watch and experiment',how1p:'Narrated lessons with transcript, captions, speed and rewind. Labs ask you to move the variables.',
 how2:'2 · Practice in Excel',how2p:'Every course includes downloadable workbooks with live formulas and sample data.',
 how3:'3 · Get assessed',how3p:'Quick questions inside lessons, a quiz per module (pass at 70%) and a final exam.',
 how4:'4 · Get certified',how4p:'H3L certificate with a verifiable code; add it to your LinkedIn profile in one click.',
 start:'Start',resume:'Continue',review:'Review',lessons:'lessons',min:'min',done:'completed',level:'Level',ex:'Excel',exams:'assessments',certok:'Certificate earned',
 back:'← Catalog',course:'Course',content:'Course content',files:'Practice files',tab_ov:'Overview',tab_tr:'Transcript',tab_nt:'Notes',tab_fl:'Files',tab_rf:'References & cases',tab_cm:'Competency map',tab_ce:'Certificate',
 play:'Play',pause:'Pause',b10:'Back 10 s',f10:'Forward 10 s',prev:'Previous',next:'Next',speed:'Speed',voice:'Voice',nosound:'No narration (captions only)',cc:'Captions',
 cont:'Continue ▶',lab:'Lab: move the variables, then press Continue.',lesson_done:'Lesson completed',up_next:'Next lesson',
 srch:'Search the transcript…',dl_tx:'Download transcript',copy:'Copy',print:'Print',copied:'Copied',
 add_note:'Add note at this moment',note_ph:'Write your note…',save:'Save',del:'Delete',dl_nt:'Download my notes',nonotes:'No notes yet.',
 quiz:'Assessment',quiz_m:'Module quiz',exam:'Final exam',q_start:'Take it',q_send:'Submit',q_retry:'Retry',q_close:'Close',q_pass:'Passed',q_fail:'You did not reach the minimum (70%). Review the lessons and retry.',score:'Score',answer_all:'Answer every question.',
 q_lock:'Complete all lessons first.',exam_lock:'Available after completing lessons and module quizzes.',
 cp_t:'Quick question',cp_ok:'Correct',cp_no:'Review: ',cp_go:'Keep going',
 xl_get:'Download',xl_done:'Mark as practiced',xl_dn:'Practiced ✓',
 cert_h:'H3L certificate',cert_p:'When you pass the course you can generate your certificate. The name you type appears on the document and in the verification code.',
 cert_name:'Full name',cert_gen:'Generate certificate',cert_png:'Download PNG',cert_li:'Add to LinkedIn',cert_sh:'Share a post',cert_url:'Verification link',cert_lock:'To earn the certificate, complete all lessons, pass the module quizzes and the final exam.',
 cert_note:'Verification checks that the code matches the certificate data (name, course, date, score). It is an integrity check, not a central registry.',
 prog:'Your progress',lbl_ls:'Lessons',lbl_qz:'Quizzes',lbl_ex:'Exam',
 lv1:'Know',lv2:'Learn',lv3:'Apply',lv4:'Transfer',lv5:'Transform',cm_p:'Each competency moves up a level with your activity: watching lessons, answering questions, using labs and Excel, passing quizzes and the final exam.',cm_c:'Competency',
 refs_p:'Technical references and real cases used in the course. Before citing them in a paper, check the edition in OnePetro or another primary source.',
 demo:'Numeric data in labs and Excel files are teaching examples, not real field data.',
 adm_h:'Course administration',adm_p:'Management view: sections, lessons, assessments and files. Visibility and order changes are saved in this browser and exported to catalog.json for publishing.',
 adm_exp:'Export catalog.json',adm_rst:'Reset',pub:'Published',hid:'Hidden',ord:'Order',ttl:'Title',vis:'Visible',
 ver_h:'Verify an H3L certificate',ver_ok:'Valid certificate: the data matches the code.',ver_bad:'The code does not match the data. The certificate was altered or the link is incomplete.',ver_none:'Open the certificate verification link to check it.'},
fr:{home:'Site H3L',cat:'Cours',admin:'Gérer',verify:'Vérifier un certificat',pill:'Cours en ligne H3L',
 hero_h:"Apprenez le pétrole, le gaz et la transition énergétique avec des cas réels",
 hero_p:"Leçons narrées et interactives avec laboratoires, cartes, classeurs Excel d'exercices, évaluations et certificat H3L publiable sur LinkedIn. Pause, retour en arrière, transcription et notes.",
 st_c:'cours',st_l:'leçons',st_q:'évaluations',st_x:"Excel d'exercices",
 sec_h:'Catalogue des cours',sec_p:"Quinze spécialités, chacune avec modules, laboratoires dynamiques, évaluations intermédiaires, examen final et certification.",
 lang_note:"Le contenu des cours est en espagnol. L'interface est disponible en 4 langues.",vw:'Affichage',vw_cards:'Cartes',vw_list:'Liste',vw_tree:'Explorateur',q_ph:'Chercher un cours, un thème ou une leçon…',ex_all:'Tout développer',co_all:'Tout réduire',th_c:'Cours',th_s:'Section',th_lv:'Niveau',th_ls:'Leçons',th_du:'Durée',th_pr:'Progression',th_ac:'Action',nores:'Aucun résultat pour la recherche.',tr_files:'Fichiers de pratique',tr_hint:"Utilisez les flèches du clavier pour parcourir l'arbre et Entrée pour ouvrir.",tr_exam:'Examen final et certificat',
 how1:'1 · Regardez et expérimentez',how1p:'Leçons narrées avec transcription, sous-titres, vitesse et retour. Les laboratoires demandent de modifier les variables.',
 how2:'2 · Pratiquez sur Excel',how2p:"Chaque cours inclut des classeurs téléchargeables avec formules actives et données d'exemple.",
 how3:'3 · Évaluez-vous',how3p:'Questions rapides dans la leçon, quiz par module (réussite à 70 %) et examen final.',
 how4:'4 · Certifiez-vous',how4p:'Certificat H3L avec code vérifiable ; ajoutez-le à LinkedIn en un clic.',
 start:'Commencer',resume:'Continuer',review:'Réviser',lessons:'leçons',min:'min',done:'terminé',level:'Niveau',ex:'Excel',exams:'évaluations',certok:'Certificat obtenu',
 back:'← Catalogue',course:'Cours',content:'Contenu du cours',files:"Fichiers d'exercices",tab_ov:'Résumé',tab_tr:'Transcription',tab_nt:'Notes',tab_fl:'Fichiers',tab_rf:'Bibliographie et cas',tab_cm:'Carte des compétences',tab_ce:'Certificat',
 play:'Lecture',pause:'Pause',b10:'Reculer de 10 s',f10:'Avancer de 10 s',prev:'Précédent',next:'Suivant',speed:'Vitesse',voice:'Voix',nosound:'Sans narration (sous-titres)',cc:'Sous-titres',
 cont:'Continuer ▶',lab:'Labo : modifiez les variables puis appuyez sur Continuer.',lesson_done:'Leçon terminée',up_next:'Leçon suivante',
 srch:'Rechercher dans la transcription…',dl_tx:'Télécharger la transcription',copy:'Copier',print:'Imprimer',copied:'Copié',
 add_note:'Ajouter une note ici',note_ph:'Écrivez votre note…',save:'Enregistrer',del:'Supprimer',dl_nt:'Télécharger mes notes',nonotes:'Aucune note.',
 quiz:'Évaluation',quiz_m:'Quiz du module',exam:'Examen final',q_start:'Passer',q_send:'Corriger',q_retry:'Réessayer',q_close:'Fermer',q_pass:'Réussi',q_fail:"Minimum (70 %) non atteint. Révisez les leçons et réessayez.",score:'Score',answer_all:'Répondez à toutes les questions.',
 q_lock:"Terminez d'abord toutes les leçons.",exam_lock:'Disponible après les leçons et les quiz de module.',
 cp_t:'Question rapide',cp_ok:'Correct',cp_no:'À revoir : ',cp_go:'Continuer',
 xl_get:'Télécharger',xl_done:'Marquer comme pratiqué',xl_dn:'Pratiqué ✓',
 cert_h:'Certificat H3L',cert_p:"En réussissant le cours, vous pouvez générer votre certificat. Le nom saisi apparaît sur le document et dans le code de vérification.",
 cert_name:'Nom complet',cert_gen:'Générer le certificat',cert_png:'Télécharger PNG',cert_li:'Ajouter à LinkedIn',cert_sh:'Partager une publication',cert_url:'Lien de vérification',cert_lock:"Pour obtenir le certificat : terminer toutes les leçons, réussir les quiz de module et l'examen final.",
 cert_note:"La vérification contrôle que le code correspond aux données (nom, cours, date, score). C'est un contrôle d'intégrité, pas un registre central.",
 prog:'Votre progression',lbl_ls:'Leçons',lbl_qz:'Quiz',lbl_ex:'Examen',
 lv1:'Connaître',lv2:'Apprendre',lv3:'Appliquer',lv4:'Transférer',lv5:'Transformer',cm_p:"Chaque compétence monte d'un niveau avec votre activité : leçons, questions, labos et Excel, quiz et examen final.",cm_c:'Compétence',
 refs_p:"Références techniques et cas réels utilisés dans le cours. Avant de les citer, vérifiez l'édition sur OnePetro ou une source primaire.",
 demo:"Les données numériques des labos et des Excel sont des exemples pédagogiques, pas des données de champs réels.",
 adm_h:'Administration des cours',adm_p:"Vue de gestion : sections, leçons, évaluations et fichiers. Les changements de visibilité et d'ordre sont enregistrés dans ce navigateur et exportés vers catalog.json.",
 adm_exp:'Exporter catalog.json',adm_rst:'Réinitialiser',pub:'Publié',hid:'Masqué',ord:'Ordre',ttl:'Titre',vis:'Visible',
 ver_h:'Vérifier un certificat H3L',ver_ok:'Certificat valide : les données correspondent au code.',ver_bad:'Le code ne correspond pas aux données : certificat modifié ou lien incomplet.',ver_none:'Ouvrez le lien de vérification du certificat.'},
pt:{home:'Site H3L',cat:'Cursos',admin:'Gerenciar',verify:'Verificar certificado',pill:'Cursos Online H3L',
 hero_h:'Aprenda petróleo, gás e transição energética com casos reais',
 hero_p:'Aulas narradas e interativas com laboratórios, mapas, planilhas Excel de prática, avaliações e certificado H3L publicável no LinkedIn. Pause, volte, leia a transcrição e faça anotações.',
 st_c:'cursos',st_l:'aulas',st_q:'avaliações',st_x:'Excel de prática',
 sec_h:'Catálogo de cursos',sec_p:'Quinze especialidades, cada uma com módulos, laboratórios dinâmicos, avaliações intermediárias, exame final e certificação.',
 lang_note:'O conteúdo dos cursos está em espanhol. A interface está disponível em 4 idiomas.',vw:'Visualização',vw_cards:'Cartões',vw_list:'Lista',vw_tree:'Explorador',q_ph:'Buscar curso, tema ou lição…',ex_all:'Expandir tudo',co_all:'Recolher tudo',th_c:'Curso',th_s:'Seção',th_lv:'Nível',th_ls:'Lições',th_du:'Duração',th_pr:'Progresso',th_ac:'Ação',nores:'Sem resultados para a busca.',tr_files:'Arquivos de prática',tr_hint:'Use as setas do teclado para percorrer a árvore e Enter para abrir.',tr_exam:'Exame final e certificado',
 how1:'1 · Assista e experimente',how1p:'Aulas narradas com transcrição, legendas, velocidade e retrocesso. Os laboratórios pedem que você mova as variáveis.',
 how2:'2 · Pratique no Excel',how2p:'Cada curso inclui planilhas para baixar com fórmulas vivas e dados de exemplo.',
 how3:'3 · Avalie-se',how3p:'Perguntas rápidas na aula, quiz por módulo (aprovação com 70 %) e exame final.',
 how4:'4 · Certifique-se',how4p:'Certificado H3L com código verificável; adicione ao LinkedIn em um clique.',
 start:'Começar',resume:'Continuar',review:'Revisar',lessons:'aulas',min:'min',done:'concluído',level:'Nível',ex:'Excel',exams:'avaliações',certok:'Certificado obtido',
 back:'← Catálogo',course:'Curso',content:'Conteúdo do curso',files:'Arquivos de prática',tab_ov:'Resumo',tab_tr:'Transcrição',tab_nt:'Notas',tab_fl:'Arquivos',tab_rf:'Bibliografia e casos',tab_cm:'Mapa de competências',tab_ce:'Certificado',
 play:'Reproduzir',pause:'Pausar',b10:'Voltar 10 s',f10:'Avançar 10 s',prev:'Anterior',next:'Próxima',speed:'Velocidade',voice:'Voz',nosound:'Sem narração (só legendas)',cc:'Legendas',
 cont:'Continuar ▶',lab:'Laboratório: mova as variáveis e depois pressione Continuar.',lesson_done:'Aula concluída',up_next:'Próxima aula',
 srch:'Buscar na transcrição…',dl_tx:'Baixar transcrição',copy:'Copiar',print:'Imprimir',copied:'Copiado',
 add_note:'Adicionar nota neste momento',note_ph:'Escreva sua nota…',save:'Salvar',del:'Excluir',dl_nt:'Baixar minhas notas',nonotes:'Ainda não há notas.',
 quiz:'Avaliação',quiz_m:'Quiz do módulo',exam:'Exame final',q_start:'Fazer',q_send:'Corrigir',q_retry:'Tentar de novo',q_close:'Fechar',q_pass:'Aprovado',q_fail:'Você não atingiu o mínimo (70 %). Revise as aulas e tente de novo.',score:'Pontuação',answer_all:'Responda todas as perguntas.',
 q_lock:'Conclua antes todas as aulas.',exam_lock:'Disponível após concluir aulas e quizzes dos módulos.',
 cp_t:'Pergunta rápida',cp_ok:'Correto',cp_no:'Revise: ',cp_go:'Seguir',
 xl_get:'Baixar',xl_done:'Marcar como praticado',xl_dn:'Praticado ✓',
 cert_h:'Certificado H3L',cert_p:'Ao ser aprovado no curso você pode gerar seu certificado. O nome digitado aparece no documento e no código de verificação.',
 cert_name:'Nome completo',cert_gen:'Gerar certificado',cert_png:'Baixar PNG',cert_li:'Adicionar ao LinkedIn',cert_sh:'Compartilhar publicação',cert_url:'Link de verificação',cert_lock:'Para obter o certificado: concluir todas as aulas, passar nos quizzes de módulo e no exame final.',
 cert_note:'A verificação confere se o código coincide com os dados (nome, curso, data, pontuação). É um controle de integridade, não um registro central.',
 prog:'Seu progresso',lbl_ls:'Aulas',lbl_qz:'Quizzes',lbl_ex:'Exame',
 lv1:'Conhecer',lv2:'Aprender',lv3:'Aplicar',lv4:'Transferir',lv5:'Transformar',cm_p:'Cada competência sobe de nível com sua atividade: aulas, perguntas, laboratórios e Excel, quizzes e exame final.',cm_c:'Competência',
 refs_p:'Bibliografia técnica e casos reais usados no curso. Antes de citar, confira a edição no OnePetro ou em outra fonte primária.',
 demo:'Os dados numéricos dos laboratórios e dos Excel são exemplos didáticos, não dados de campos reais.',
 adm_h:'Administração de cursos',adm_p:'Visão de gestão: seções, aulas, avaliações e arquivos. Mudanças de visibilidade e ordem ficam neste navegador e são exportadas para catalog.json.',
 adm_exp:'Exportar catalog.json',adm_rst:'Restaurar',pub:'Publicado',hid:'Oculto',ord:'Ordem',ttl:'Título',vis:'Visível',
 ver_h:'Verificar certificado H3L',ver_ok:'Certificado válido: os dados coincidem com o código.',ver_bad:'O código não coincide com os dados: certificado alterado ou link incompleto.',ver_none:'Abra o link de verificação do certificado.'}
};
function ls(k,v){try{if(v===undefined)return localStorage.getItem(k);if(v===null)localStorage.removeItem(k);else localStorage.setItem(k,v)}catch(e){}return null}
var lang=ls('h3l_lang');try{var q=new URLSearchParams(location.search).get('lang');if(q&&LANGS.indexOf(q)>=0){lang=q;ls('h3l_lang',q)}}catch(e){}
if(LANGS.indexOf(lang)<0){lang=((navigator.language||'es').slice(0,2).toLowerCase());if(LANGS.indexOf(lang)<0)lang='es'}
HC.lang=lang;HC.LANGS=LANGS;
HC.t=function(k,v){var s=(D[HC.lang]&&D[HC.lang][k]);if(s==null)s=D.es[k];if(s==null)return k;if(v)s=s.replace(/\{(\w+)\}/g,function(m,n){return v[n]!=null?v[n]:m});return s};
HC.setLang=function(l){if(LANGS.indexOf(l)<0)return;HC.lang=l;ls('h3l_lang',l);document.documentElement.lang=l;HC.apply();if(HC.onlang)HC.onlang(l)};
HC.apply=function(root){root=root||document;var q=root.querySelectorAll('[data-t]'),i;for(i=0;i<q.length;i++)q[i].textContent=HC.t(q[i].getAttribute('data-t'));
  q=root.querySelectorAll('[data-ta]');for(i=0;i<q.length;i++){var p=q[i].getAttribute('data-ta').split(':');q[i].setAttribute(p[0],HC.t(p[1]))}};
HC.langSelect=function(el){el.innerHTML='';LANGS.forEach(function(l){var o=document.createElement('option');o.value=l;o.textContent=l.toUpperCase();el.appendChild(o)});el.value=HC.lang;el.setAttribute('aria-label','Idioma / Language');el.addEventListener('change',function(){HC.setLang(el.value)})};
document.documentElement.lang=lang;
/* ---------- utilidades ---------- */
HC.esc=function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
HC.fmt=function(s){s=Math.max(0,Math.round(s));var m=Math.floor(s/60),x=s%60;return m+':'+(x<10?'0':'')+x};
HC.words=function(s){return String(s).trim().split(/\s+/).length};
HC.cueDur=function(c){return Math.max(3.2,HC.words(c.say||'')/2.4+0.8)};
HC.$=function(s,r){return(r||document).querySelector(s)};
HC.$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
HC.el=function(tag,attrs,html){var e=document.createElement(tag);if(attrs)for(var k in attrs){if(k==='class')e.className=attrs[k];else e.setAttribute(k,attrs[k])}if(html!=null)e.innerHTML=html;return e};
HC.ico={play:'<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>',pause:'<svg viewBox="0 0 24 24"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>',
 b10:'<svg viewBox="0 0 24 24"><path d="M12 5V2L7 6l5 4V7a6 6 0 1 1-6 6H4a8 8 0 1 0 8-8z"/></svg>',f10:'<svg viewBox="0 0 24 24"><path d="M12 5V2l5 4-5 4V7a6 6 0 1 0 6 6h2a8 8 0 1 1-8-8z"/></svg>',
 prev:'<svg viewBox="0 0 24 24"><path d="M6 6h2v12H6zM9.5 12 18 6v12z"/></svg>',next:'<svg viewBox="0 0 24 24"><path d="M16 6h2v12h-2zM6 18V6l8.5 6z"/></svg>',
 cc:'<svg viewBox="0 0 24 24"><path d="M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm3 5.2a2 2 0 0 0 0 3.6h1.6v-1.3H7.4a.7.7 0 0 1 0-1h1.2V10.2zm7 0a2 2 0 0 0 0 3.6h1.6v-1.3h-1.2a.7.7 0 0 1 0-1h1.2V10.2z"/></svg>',
 snd:'<svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 4V5L7 9zm13.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4z"/></svg>',mute:'<svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 4V5L7 9zm13 .6L14.6 11l1.4 1.4-1.4 1.4L16 15.2l1.4-1.4 1.4 1.4 1.4-1.4-1.4-1.4 1.4-1.4-1.4-1.4-1.4 1.4z"/></svg>',
 file:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/></svg>',
 lay:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5M3 17.5l9 5 9-5" opacity=".5"/></svg>',
 geo:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18h18M3 14c3-2 5 1 9-1s6-3 9-1M3 10c3-2 5 1 9-1s6-3 9-1"/></svg>',
 res:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20V4M4 20h16M7 8c3 0 3 8 6 8s3-5 7-5"/></svg>',
 wf:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/><path d="M9 15a3 3 0 0 0 3 3" /></svg>',
 per:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v14M9 16l3 6 3-6M7 6l5-4 5 4M8 10h8"/></svg>',
 pta:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18h4l2-9 3 12 3-15 2 12h4"/></svg>',
 nod:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="12" r="2.4"/><circle cx="18" cy="6" r="2.4"/><circle cx="18" cy="18" r="2.4"/><path d="M8.2 11l7.6-4M8.2 13l7.6 4"/></svg>',
 frac:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v6l-3 3 4 3-2 6"/><path d="M5 8l4 1M19 8l-4 1M4 15l5-1M20 15l-5-1"/></svg>',
 eco:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20V10M10 20V4M16 20v-8M22 20H2"/><path d="M4 7l6-3 6 7 5-4"/></svg>',
 sim:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="1"/><path d="M4 9.3h16M4 14.7h16M9.3 4v16M14.7 4v16"/></svg>', eor:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3c3 4 5 6.5 5 9.5a5 5 0 0 1-10 0C7 9.5 9 7 12 3z"/><path d="M9.5 14a2.5 2.5 0 0 0 2.5 2.5"/></svg>', rta:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20V4M4 20h16"/><path d="M6 8c3 0 3 7 6 7s3-3 7-3"/></svg>', alm:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h16M4 8v11h16V8"/><path d="M12 3v7M9 7l3 3 3-3"/></svg>', rpx:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h14v16H5z"/><path d="M8 9h8M8 13h8M8 17h5"/></svg>',
 dat:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"/></svg>',
 gei:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 19c8 0 14-6 14-14-8 0-14 6-14 14zM5 19c2-5 6-8 10-10"/></svg>'};
/* ---------- progreso (localStorage, solo en este navegador) ---------- */
var KEY='h3l-cursos-v1';
var S=null;
function load(){if(S)return S;var r=ls(KEY);try{S=r?JSON.parse(r):{}}catch(e){S={}}if(!S.c)S.c={};return S}
function save(){ls(KEY,JSON.stringify(S))}
HC.state=function(){return load()};
HC.cs=function(id){var s=load();if(!s.c[id])s.c[id]={l:{},q:{},x:{},n:[],e:null};return s.c[id]};
HC.save=save;
HC.setName=function(n){load().name=n;save()};HC.getName=function(){return load().name||''};
HC.lessonDone=function(id,lid){var c=HC.cs(id);return !!(c.l[lid]&&c.l[lid].d)};
/* ---------- catálogo ---------- */
HC.catalog=null;
HC.loadCatalog=function(){if(HC.catalog)return Promise.resolve(HC.catalog);return fetch('data/catalog.json').then(function(r){return r.json()}).then(function(c){
  var o=null;try{o=JSON.parse(ls('h3l-cursos-admin')||'null')}catch(e){}
  if(o&&!HC.adminMode){c.courses=c.courses.filter(function(x){return !(o.hidden||[]).includes(x.id)});c.courses.sort(function(a,b){var i=(o.order||[]).indexOf(a.id),j=(o.order||[]).indexOf(b.id);return(i<0?99:i)-(j<0?99:j)})}
  if(!HC.adminMode)c.courses=c.courses.filter(function(x){return !x.hidden});HC.catalog=c;return c})};
HC.courseCache={};
/* presentación (estética de inicio de los videos de servicios) y cierre (logo a la izquierda, frase y contacto a la derecha) */
function bumpers(c){var I=c.intro,O=c.outro,q=I.questions,st=I.star,mods=c.modules.map(function(m){return m.title});
  if(!I.cues)I.cues=[{say:'Bienvenido a '+c.title+'. '+I.hook,scene:{t:'bin'},hl:-1},
   {say:'Este curso responde tres preguntas que agregan valor a cualquier equipo técnico. Primera: '+q[0],hl:0},{say:'Segunda: '+q[1],hl:1},{say:'Y tercera: '+q[2],hl:2},
   {say:'Todo se aplica con la metodología STAR sobre un caso real: '+st.caso+'. Primero, la situación. '+st.S,scene:{t:'star'},hl:0},{say:'La tarea. '+st.T,hl:1},{say:'La acción. '+st.A,hl:2},{say:'Y el resultado. '+st.R,hl:3},
   {say:'El curso tiene '+c.modules.length+' módulos. Cada uno termina con un quiz, hay planillas Excel para practicar y un examen final. Al aprobar, obtenés tu certificado H3L, publicable en LinkedIn.',scene:{t:'bul',k:'Ruta del curso',h:'Cómo está organizado',items:mods.concat(['Excel de práctica','Examen final y certificado H3L'])}}];
  var can=(O.can&&O.can.length)?O.can:c.competencies.map(function(x){return x.name});
  var nl=0,nlab=0;c.modules.forEach(function(m){m.lessons.forEach(function(l){nl++;l.cues.forEach(function(q){if(q.lab)nlab++})})});
  var nx=(c.downloads||[]).length;
  if(!O.cues){O.cues=O.recap.map(function(r,i){var o={say:r,hl:i};if(!i){o.say='Repasemos lo esencial. '+r;o.scene={t:'bul',k:'Para llevarte',h:'Ideas clave',items:O.recap}}return o});
   O.cues.push({say:'Al terminar este curso, usted ahora puede analizar y validar: '+can.join('; ')+'.',scene:{t:'can',k:'Al finalizar el curso',h:'Usted ahora puede analizar y validar',items:can}});
   O.cues.push({say:'Ítems vistos: '+nl+' lecciones en '+c.modules.length+' módulos'+(nlab?', '+nlab+' laboratorios interactivos':'')+(nx?', '+nx+(nx===1?' planilla Excel':' planillas Excel'):'')+', y un quiz por módulo más el examen final.',scene:{t:'seen'}});
   O.cues.push({say:O.phrase+' Gracias por aprender con H3L Global Energy. Contacto: info@h3lglobalenergy.com',tts:O.phrase+' Gracias por aprender con H3L Global Energy. Escribinos a info, arroba, h3l global energy, punto com.',scene:{t:'bout'}})}}
HC.loadCourse=function(id){if(HC.courseCache[id])return Promise.resolve(HC.courseCache[id]);return fetch('data/'+id+'.json').then(function(r){if(!r.ok)throw new Error(r.status);return r.json()}).then(function(c){
  bumpers(c);var n=0;c.modules.forEach(function(m){m.lessons.forEach(function(l){l.dur=l.cues.reduce(function(a,q){return a+HC.cueDur(q)},0);n+=l.dur})});
  c.introDur=(c.intro.cues||[]).reduce(function(a,q){return a+HC.cueDur(q)},0);c.outroDur=(c.outro.cues||[]).reduce(function(a,q){return a+HC.cueDur(q)},0);
  c.totalSec=n+c.introDur+c.outroDur;HC.courseCache[id]=c;return c})};
/* lecciones planas del curso: presentación → lecciones → cierre */
HC.flat=function(c){var a=[{id:'intro',title:c.intro.title||'Presentación del curso',kind:'intro',cues:c.intro.cues,dur:c.introDur,mod:null}];
  c.modules.forEach(function(m){m.lessons.forEach(function(l){a.push({id:l.id,title:l.title,kind:'lesson',cues:l.cues,dur:l.dur,mod:m.id,comp:l.comp})})});
  a.push({id:'outro',title:c.outro.title||'Cierre',kind:'outro',cues:c.outro.cues,dur:c.outroDur,mod:null});return a};
HC.lessonsOnly=function(c){var a=[];c.modules.forEach(function(m){m.lessons.forEach(function(l){a.push(l)})});return a};
HC.progress=function(c){var cs=HC.cs(c.id),all=HC.flat(c),d=0;all.forEach(function(l){if(cs.l[l.id]&&cs.l[l.id].d)d++});
  var qm=c.modules.filter(function(m){return cs.q[m.id]&&cs.q[m.id].best>=70}).length;var ex=cs.e&&cs.e.best>=70;
  var tot=all.length+c.modules.length+1,got=d+qm+(ex?1:0);
  return{lessons:d,lessonsTotal:all.length,quizzes:qm,quizzesTotal:c.modules.length,exam:!!ex,pct:Math.round(100*got/tot),
    allLessons:d===all.length,allQuizzes:qm===c.modules.length,cert:d===all.length&&qm===c.modules.length&&!!ex}};
HC.hrs=function(c){var min=(c.totalSec/60)*1.8+(c.practiceMin||60);return Math.max(1,Math.round(min/30)/2)};
})();
