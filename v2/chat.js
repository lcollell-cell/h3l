/* H3L Copilot · asistente de la v2. Respuestas guiadas, sin servidor. H3L Global Energy. */
(function(){'use strict';
var NAME='H3L Copilot';
var V2=location.pathname.indexOf('/v2/')>=0;
var LK={srv:(V2?'../':'')+'index.html?go=servicios',tab:(V2?'':'v2/')+'dashboards.html',con:(V2?'../':'')+'index.html?go=contacto',nos:(V2?'../':'')+'index.html?go=somos'};
function goTo(h){var m=/[?&]go=([a-z]+)/.exec(h);return !V2&&m&&window.goSection?m[1]:null}
/* textos por idioma: ui, enlaces, base de respuestas (k = palabras clave sin acentos), respuesta por defecto y botones */
var T={
es:{ui:{open:'Abrir chat con H3L Copilot',dlg:'Chat con H3L Copilot',sub:'Asistente de H3L Global Energy',close:'Cerrar el chat',ph:'Escribí tu consulta',ql:'Tu consulta',send:'Enviar',ft:'Respuestas guiadas sobre los servicios de H3L. Para una consulta técnica, solicitá una cotización.',hi:'Hola, soy H3L Copilot. Puedo contarte sobre los servicios de H3L: reservas, auditoría energética, emisiones, ciencia de datos, transición energética, plataformas digitales y capacitación.'},
 lk:{srv:'Ver los servicios',tab:'Ver los tableros de demostración',con:'Solicitar cotización',nos:'Conocer a H3L'},
 kb:[
 {k:['hola','buenas','buen dia','buenos'],t:'Hola, soy H3L Copilot. Puedo contarte sobre los siete servicios de H3L y cómo solicitar una cotización. ¿Por dónde querés empezar?',l:['srv']},
 {k:['reserva','recurso','prms','sec ','certific','yacimiento','reservorio'],t:'Evaluación de Recursos y Reservas: certificación bajo estándares internacionales (PRMS, SEC), evaluación económica en escenarios de transición energética, integración de indicadores de carbono y simulación de yacimientos con foco en eficiencia y recuperación mejorada.',l:['srv','con']},
 {k:['auditoria','diagnostico','descarboniz','eficiencia','ghg'],t:'Auditoría Energética y Diagnóstico de Descarbonización: evaluaciones de activos upstream, midstream y downstream, medición y verificación de consumo y emisiones de GEI (GHG Protocol), y oportunidades de eficiencia y tecnologías limpias aplicables a campo.',l:['srv','con']},
 {k:['emision','carbono','compensa','redd','ccs','flaring','alcance'],t:'Gestión de Emisiones y Estrategias de Compensación: inventario de emisiones (alcances 1, 2 y 3), planes de mitigación (flaring, fugas, combustión, transporte), proyectos de compensación (REDD+, CCS, bonos de carbono) y verificación de reducciones.',l:['srv','con']},
 {k:['dato','data science','ciencia de datos','predictiv','anomal','esg','modelo'],t:'Ciencia de Datos Aplicada a Energía: modelos predictivos de producción y consumo, detección temprana de ineficiencias y anomalías, visualización de intensidad de carbono por pozo o activo, y automatización de reportes técnicos, regulatorios y ESG.',l:['srv','tab']},
 {k:['transicion','hidrogeno','h2','solar','roadmap','taxonomia','verde'],t:'Estrategias para la Transición Energética: roadmaps de descarbonización por activo o portafolio, reconversión de campos maduros (gas → H₂, solar para operaciones), alineación con marcos regulatorios y taxonomías verdes, y asesoría en inversiones con criterios climáticos.',l:['srv','con']},
 {k:['plataforma','gemelo','scada','iot','dashboard','tablero','kpi','agente','inteligencia artificial'],t:'Desarrollo de Plataformas Digitales Propias: dashboards de reservas, consumo energético y huella de carbono, gemelos digitales de activos y monitoreo en tiempo real (SCADA + IoT + IA). Los tableros de demostración muestran cómo trabajan los agentes de IA, siempre con aprobación de una persona.',l:['tab','srv']},
 {k:['capacit','formacion','curso','taller','entrena'],t:'Capacitación y Formación Especializada: formación técnica en evaluación de reservas, sostenibilidad y ciencia de datos; cursos sobre auditorías energéticas y normativa ambiental para O&G; y talleres prácticos para desarrollar capacidades internas.',l:['srv','con']},
 {k:['servicio','ofrec','hacen'],t:'H3L ofrece siete servicios: Evaluación de Recursos y Reservas, Auditoría Energética y Descarbonización, Gestión de Emisiones y Compensación, Ciencia de Datos Aplicada a Energía, Estrategias para la Transición Energética, Plataformas Digitales Propias, y Capacitación y Formación. Cada uno tiene un video de la herramienta.',l:['srv']},
 {k:['precio','costo','cuanto','cotiz','tarifa','presupuesto','pagar'],t:'No hay un precio fijo: se cotiza según el alcance y los datos disponibles. Elegí el servicio que te interesa y usá «Solicitar cotización»: el formulario ya queda con el servicio indicado.',l:['con','srv']},
 {k:['contact','demostr','demo','reunion','hablar','mail','correo','escribir'],t:'Podés escribirnos a info@h3l.com o usar el formulario de contacto. Contanos qué necesitás y te respondemos en menos de 24 horas hábiles.',l:['con']},
 {k:['quien','nosotros','h3l','empresa','somos','experiencia'],t:'H3L Global Energy es una firma independiente de asesoría energética. Nuestro equipo reúne más de 20 años de experiencia en la industria, en distintas empresas multinacionales, con presencia en LATAM y Europa.',l:['nos']},
 {k:['segur','audit trail','trazab','registro','confiden'],t:'Cada evaluación se entrega con trazabilidad y transparencia: datos y fuentes usados, supuestos y versión del cálculo. Las condiciones de confidencialidad para tus datos reales se acuerdan en el proyecto.',l:['con']},
 {k:['gracias','chau','adios'],t:'De nada. Si querés avanzar, podés solicitar una cotización cuando quieras.',l:['con']}],
 def:{t:'Todavía no tengo una respuesta guiada para eso. Puedo contarte sobre los servicios de H3L o cómo solicitar una cotización.',l:['srv','con']},
 chips:[['Servicios','servicios'],['Ciencia de datos','ciencia de datos'],['Transición energética','transición'],['Solicitar cotización','cotización']]},
en:{ui:{open:'Open chat with H3L Copilot',dlg:'Chat with H3L Copilot',sub:'H3L Global Energy assistant',close:'Close chat',ph:'Type your question',ql:'Your question',send:'Send',ft:'Guided answers about H3L services. For a technical question, request a quote.',hi:"Hi, I'm H3L Copilot. I can tell you about H3L's services: reserves, energy audit, emissions, data science, energy transition, digital platforms and training."},
 lk:{srv:'See the services',tab:'See the demo boards',con:'Request a quote',nos:'About H3L'},
 kb:[
 {k:['hello','hi ','hey','good morning','good afternoon'],t:"Hi, I'm H3L Copilot. I can tell you about H3L's seven services and how to request a quote. Where would you like to start?",l:['srv']},
 {k:['reserve','resource','prms','sec ','certif','reservoir'],t:'Resources & Reserves Evaluation: certification under international standards (PRMS, SEC), economic evaluation in energy-transition scenarios, integration of carbon indicators, and reservoir simulation focused on efficiency and enhanced recovery.',l:['srv','con']},
 {k:['audit','diagnos','decarbon','efficiency','ghg'],t:'Energy Audit & Decarbonization Diagnostics: assessments of upstream, midstream and downstream assets, measurement and verification of energy use and GHG emissions (GHG Protocol), and efficiency and clean-technology opportunities for the field.',l:['srv','con']},
 {k:['emission','carbon','offset','redd','ccs','flaring','scope'],t:'Emissions Management & Offsetting Strategies: emissions inventory (scopes 1, 2 and 3), mitigation plans (flaring, leaks, combustion, transport), offset projects (REDD+, CCS, carbon credits) and verification of reductions.',l:['srv','con']},
 {k:['data','data science','predictive','anomal','esg','model'],t:'Data Science Applied to Energy: predictive models for production and consumption, early detection of inefficiencies and anomalies, carbon-intensity visualization by well or asset, and automation of technical, regulatory and ESG reports.',l:['srv','tab']},
 {k:['transition','hydrogen','h2','solar','roadmap','taxonomy','green'],t:'Energy Transition Strategies: decarbonization roadmaps by asset or portfolio, mature-field conversion (gas → H₂, solar for operations), alignment with regulatory frameworks and green taxonomies, and investment advice with climate criteria.',l:['srv','con']},
 {k:['platform','twin','scada','iot','dashboard','board','kpi','agent','artificial'],t:'Custom Digital Platform Development: dashboards for reserves, energy consumption and carbon footprint, digital twins of assets and real-time monitoring (SCADA + IoT + AI). The demo boards show how AI agents work, always with a person approving.',l:['tab','srv']},
 {k:['training','course','workshop','education','learn'],t:'Specialized Training: technical training in reserves evaluation, sustainability and data science; courses on energy audits and environmental regulation for O&G; and hands-on workshops to build in-house capabilities.',l:['srv','con']},
 {k:['service','offer','what do you do'],t:'H3L offers seven services: Resources & Reserves Evaluation, Energy Audit & Decarbonization, Emissions Management & Offsetting, Data Science Applied to Energy, Energy Transition Strategies, Custom Digital Platforms, and Training. Each one has a video of the tool.',l:['srv']},
 {k:['price','cost','how much','quote','quotation','fee','pay'],t:'There is no fixed price: it is quoted by scope and available data. Pick the service you are interested in and use “Request a quote”: the form comes pre-filled with the service.',l:['con','srv']},
 {k:['contact','demo','meeting','talk','mail','email','write'],t:'You can write to info@h3l.com or use the contact form. Tell us what you need and we reply within 24 business hours.',l:['con']},
 {k:['who','about','h3l','company','experience'],t:'H3L Global Energy is an independent energy advisory firm. Our team brings more than 20 years of industry experience across several multinational companies, with a presence in LATAM and Europe.',l:['nos']},
 {k:['secur','trace','record','confiden'],t:'Every evaluation is delivered with traceability and transparency: data and sources used, assumptions and calculation version. Confidentiality terms for your real data are agreed in the project.',l:['con']},
 {k:['thanks','thank you','bye'],t:'You are welcome. Whenever you want to move forward, you can request a quote.',l:['con']}],
 def:{t:"I don't have a guided answer for that yet. I can tell you about H3L's services or how to request a quote.",l:['srv','con']},
 chips:[['Services','services'],['Data science','data science'],['Energy transition','transition'],['Request a quote','quote']]},
fr:{ui:{open:'Ouvrir le chat avec H3L Copilot',dlg:'Chat avec H3L Copilot',sub:'Assistant de H3L Global Energy',close:'Fermer le chat',ph:'Écrivez votre question',ql:'Votre question',send:'Envoyer',ft:'Réponses guidées sur les services de H3L. Pour une question technique, demandez un devis.',hi:"Bonjour, je suis H3L Copilot. Je peux vous présenter les services de H3L : réserves, audit énergétique, émissions, data science, transition énergétique, plateformes numériques et formation."},
 lk:{srv:'Voir les services',tab:'Voir les tableaux de démonstration',con:'Demander un devis',nos:'Découvrir H3L'},
 kb:[
 {k:['bonjour','salut','bonsoir','coucou'],t:"Bonjour, je suis H3L Copilot. Je peux vous présenter les sept services de H3L et la façon de demander un devis. Par où voulez-vous commencer ?",l:['srv']},
 {k:['reserve','ressource','prms','sec ','certif','gisement','reservoir'],t:"Évaluation des Ressources et Réserves : certification selon les normes internationales (PRMS, SEC), évaluation économique dans des scénarios de transition énergétique, intégration d'indicateurs carbone et simulation de gisements axée sur l'efficacité et la récupération assistée.",l:['srv','con']},
 {k:['audit','diagnostic','decarbon','efficacite','ghg'],t:"Audit énergétique et diagnostic de décarbonation : évaluations d'actifs amont, intermédiaires et aval, mesure et vérification de la consommation d'énergie et des émissions de GES (GHG Protocol), et opportunités d'efficacité et de technologies propres sur le terrain.",l:['srv','con']},
 {k:['emission','carbone','compensation','redd','ccs','torchage','scope'],t:"Gestion des émissions et stratégies de compensation : inventaire des émissions (scopes 1, 2 et 3), plans d'atténuation (torchage, fuites, combustion, transport), projets de compensation (REDD+, CCS, crédits carbone) et vérification des réductions.",l:['srv','con']},
 {k:['donnee','data science','predictif','anomalie','esg','modele'],t:"Data science appliquée à l'énergie : modèles prédictifs de production et de consommation, détection précoce des inefficacités et des anomalies, visualisation de l'intensité carbone par puits ou actif, et automatisation des rapports techniques, réglementaires et ESG.",l:['srv','tab']},
 {k:['transition','hydrogene','h2','solaire','feuille de route','taxonomie','vert'],t:"Stratégies pour la transition énergétique : feuilles de route de décarbonation par actif ou portefeuille, reconversion de champs matures (gaz → H₂, solaire pour les opérations), alignement avec les cadres réglementaires et les taxonomies vertes, et conseil en investissements à critères climatiques.",l:['srv','con']},
 {k:['plateforme','jumeau','scada','iot','tableau','dashboard','kpi','agent','intelligence artificielle'],t:"Développement de plateformes numériques sur mesure : tableaux de bord pour les réserves, la consommation d'énergie et l'empreinte carbone, jumeaux numériques d'actifs et surveillance en temps réel (SCADA + IoT + IA). Les tableaux de démonstration montrent comment travaillent les agents IA, toujours avec l'approbation d'une personne.",l:['tab','srv']},
 {k:['formation','cours','atelier','former'],t:"Formation spécialisée : formation technique en évaluation des réserves, durabilité et data science ; cours sur les audits énergétiques et la réglementation environnementale pour O&G ; et ateliers pratiques pour développer les compétences internes.",l:['srv','con']},
 {k:['service','offre','que faites'],t:"H3L propose sept services : Évaluation des Ressources et Réserves, Audit énergétique et décarbonation, Gestion des émissions et compensation, Data science appliquée à l'énergie, Stratégies pour la transition énergétique, Plateformes numériques sur mesure et Formation spécialisée. Chacun a une vidéo de l'outil.",l:['srv']},
 {k:['prix','cout','combien','devis','tarif','budget','payer'],t:"Il n'y a pas de prix fixe : le devis dépend du périmètre et des données disponibles. Choisissez le service qui vous intéresse et utilisez « Demander un devis » : le formulaire est déjà rempli avec le service.",l:['con','srv']},
 {k:['contact','demonstr','demo','reunion','parler','mail','courriel','ecrire'],t:"Vous pouvez écrire à info@h3l.com ou utiliser le formulaire de contact. Dites-nous ce dont vous avez besoin et nous répondons sous 24 heures ouvrées.",l:['con']},
 {k:['qui','propos','h3l','entreprise','societe','experience'],t:"H3L Global Energy est un cabinet indépendant de conseil en énergie. Notre équipe réunit plus de 20 ans d'expérience dans l'industrie, au sein de plusieurs multinationales, avec une présence en Amérique latine et en Europe.",l:['nos']},
 {k:['secur','tracab','registre','confiden'],t:"Chaque évaluation est livrée avec traçabilité et transparence : données et sources utilisées, hypothèses et version du calcul. Les conditions de confidentialité pour vos données réelles sont convenues dans le projet.",l:['con']},
 {k:['merci','au revoir','salut'],t:"Avec plaisir. Quand vous voulez avancer, vous pouvez demander un devis.",l:['con']}],
 def:{t:"Je n'ai pas encore de réponse guidée pour cela. Je peux vous présenter les services de H3L ou la façon de demander un devis.",l:['srv','con']},
 chips:[['Services','services'],['Data science','data science'],['Transition énergétique','transition'],['Demander un devis','devis']]},
pt:{ui:{open:'Abrir chat com o H3L Copilot',dlg:'Chat com o H3L Copilot',sub:'Assistente da H3L Global Energy',close:'Fechar o chat',ph:'Escreva sua pergunta',ql:'Sua pergunta',send:'Enviar',ft:'Respostas guiadas sobre os serviços da H3L. Para uma consulta técnica, solicite um orçamento.',hi:'Olá, sou o H3L Copilot. Posso falar dos serviços da H3L: reservas, auditoria energética, emissões, ciência de dados, transição energética, plataformas digitais e capacitação.'},
 lk:{srv:'Ver os serviços',tab:'Ver os painéis de demonstração',con:'Solicitar orçamento',nos:'Conhecer a H3L'},
 kb:[
 {k:['ola','oi ','bom dia','boa tarde','boa noite'],t:'Olá, sou o H3L Copilot. Posso falar dos sete serviços da H3L e de como solicitar um orçamento. Por onde quer começar?',l:['srv']},
 {k:['reserva','recurso','prms','sec ','certific','reservatorio'],t:'Avaliação de Recursos e Reservas: certificação sob padrões internacionais (PRMS, SEC), avaliação econômica em cenários de transição energética, integração de indicadores de carbono e simulação de reservatórios com foco em eficiência e recuperação melhorada.',l:['srv','con']},
 {k:['auditoria','diagnostico','descarboniz','eficiencia','ghg'],t:'Auditoria Energética e Diagnóstico de Descarbonização: avaliações de ativos upstream, midstream e downstream, medição e verificação do consumo de energia e das emissões de GEE (GHG Protocol), e oportunidades de eficiência e tecnologias limpas aplicáveis ao campo.',l:['srv','con']},
 {k:['emiss','carbono','compensa','redd','ccs','flaring','escopo'],t:'Gestão de Emissões e Estratégias de Compensação: inventário de emissões (escopos 1, 2 e 3), planos de mitigação (flaring, vazamentos, combustão, transporte), projetos de compensação (REDD+, CCS, créditos de carbono) e verificação de reduções.',l:['srv','con']},
 {k:['dado','data science','ciencia de dados','preditiv','anomal','esg','modelo'],t:'Ciência de Dados Aplicada à Energia: modelos preditivos de produção e consumo, detecção precoce de ineficiências e anomalias, visualização da intensidade de carbono por poço ou ativo, e automação de relatórios técnicos, regulatórios e ESG.',l:['srv','tab']},
 {k:['transicao','hidrogenio','h2','solar','roadmap','taxonomia','verde'],t:'Estratégias para a Transição Energética: roadmaps de descarbonização por ativo ou portfólio, reconversão de campos maduros (gás → H₂, solar para operações), alinhamento com marcos regulatórios e taxonomias verdes, e assessoria em investimentos com critérios climáticos.',l:['srv','con']},
 {k:['plataforma','gemeo','scada','iot','painel','paineis','dashboard','kpi','agente','inteligencia artificial'],t:'Desenvolvimento de Plataformas Digitais Próprias: dashboards de reservas, consumo de energia e pegada de carbono, gêmeos digitais de ativos e monitoramento em tempo real (SCADA + IoT + IA). Os painéis de demonstração mostram como os agentes de IA trabalham, sempre com aprovação de uma pessoa.',l:['tab','srv']},
 {k:['capacit','formacao','curso','oficina','treinamento'],t:'Capacitação e Formação Especializada: formação técnica em avaliação de reservas, sustentabilidade e ciência de dados; cursos sobre auditorias energéticas e normas ambientais para O&G; e oficinas práticas para desenvolver capacidades internas.',l:['srv','con']},
 {k:['servico','oferec','fazem'],t:'A H3L oferece sete serviços: Avaliação de Recursos e Reservas, Auditoria Energética e Descarbonização, Gestão de Emissões e Compensação, Ciência de Dados Aplicada à Energia, Estratégias para a Transição Energética, Plataformas Digitais Próprias, e Capacitação e Formação. Cada um tem um vídeo da ferramenta.',l:['srv']},
 {k:['preco','custo','quanto','cotacao','orcamento','tarifa','pagar'],t:'Não há preço fixo: o orçamento depende do escopo e dos dados disponíveis. Escolha o serviço de interesse e use «Solicitar orçamento»: o formulário já vem preenchido com o serviço.',l:['con','srv']},
 {k:['contato','demonstr','demo','reuniao','falar','mail','email','escrever'],t:'Você pode escrever para info@h3l.com ou usar o formulário de contato. Conte o que precisa e respondemos em até 24 horas úteis.',l:['con']},
 {k:['quem','sobre','h3l','empresa','somos','experiencia'],t:'A H3L Global Energy é uma consultoria independente de assessoria energética. Nossa equipe reúne mais de 20 anos de experiência na indústria, em diferentes empresas multinacionais, com presença na América Latina e na Europa.',l:['nos']},
 {k:['seguran','rastre','registro','confiden'],t:'Cada avaliação é entregue com rastreabilidade e transparência: dados e fontes usados, premissas e versão do cálculo. Os termos de confidencialidade para seus dados reais são combinados no projeto.',l:['con']},
 {k:['obrigado','obrigada','tchau','valeu'],t:'De nada. Quando quiser avançar, pode solicitar um orçamento.',l:['con']}],
 def:{t:'Ainda não tenho uma resposta guiada para isso. Posso falar dos serviços da H3L ou de como solicitar um orçamento.',l:['srv','con']},
 chips:[['Serviços','serviços'],['Ciência de dados','ciência de dados'],['Transição energética','transição'],['Solicitar orçamento','orçamento']]}
};
function curLang(){var l=(window.H3L&&H3L.lang)||(window.H3LSite&&H3LSite.lang&&H3LSite.lang());if(!l){try{l=localStorage.getItem('h3l_lang')}catch(e){}}return T[l]?l:'es'}
function cl(){return T[curLang()]}
function norm(s){s=String(s).toLowerCase();return s.normalize?s.normalize('NFD').replace(/[̀-ͯ]/g,''):s}
function answer(q){var c=cl(),n=' '+norm(q)+' ';for(var i=0;i<c.kb.length;i++)for(var j=0;j<c.kb[i].k.length;j++)if(n.indexOf(norm(c.kb[i].k[j]))>=0)return c.kb[i];return c.def}

var css='#h3c-btn{position:fixed;right:max(18px,env(safe-area-inset-right));bottom:max(18px,env(safe-area-inset-bottom));z-index:40;width:56px;height:56px;border-radius:50%;border:0;background:#2A78D6;color:#fff;cursor:pointer;display:none;align-items:center;justify-content:center;box-shadow:0 8px 24px rgba(10,20,38,.35);transition:background .2s,transform .2s}'
+'#h3c-btn.on{display:flex}#h3c-btn:hover{background:#3a86e4}#h3c-btn:focus-visible,#h3c-p button:focus-visible,#h3c-p input:focus-visible,#h3c-p a:focus-visible{outline:3px solid #9CC3F5;outline-offset:2px}'
+'#h3c-btn svg{width:26px;height:26px}'
+'#h3c-p{position:fixed;right:max(18px,env(safe-area-inset-right));bottom:calc(max(18px,env(safe-area-inset-bottom)) + 70px);z-index:41;width:380px;max-width:calc(100vw - 24px);height:min(560px,calc(100vh - 120px));height:min(560px,calc(100dvh - 120px));background:#fff;color:#0E1A2B;border-radius:14px;box-shadow:0 18px 50px rgba(5,13,22,.45);display:none;flex-direction:column;overflow:hidden;font-family:"Montserrat",system-ui,-apple-system,"Segoe UI",sans-serif}'
+'#h3c-p.open{display:flex}'
+'#h3c-p .hd{background:#0A1426;color:#fff;padding:14px 16px;display:flex;align-items:center;gap:12px}'
+'#h3c-p .lg{font-weight:700;font-size:15px;letter-spacing:.01em}#h3c-p .lg b{color:#4FB27C}#h3c-p .sb{font-size:12px;color:#9FB0CC;margin-top:1px}'
+'#h3c-p .x{margin-left:auto;width:36px;height:36px;border-radius:8px;border:0;background:rgba(255,255,255,.1);color:#fff;font-size:20px;line-height:1;cursor:pointer}#h3c-p .x:hover{background:rgba(255,255,255,.2)}'
+'#h3c-p .log{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:12px;background:#F3F5F8;-webkit-overflow-scrolling:touch}'
+'#h3c-p .m{max-width:88%;padding:10px 13px;border-radius:12px;font-size:14px;line-height:1.5}'
+'#h3c-p .bot{align-self:flex-start;background:#fff;border:1px solid #DCE1E9;border-bottom-left-radius:4px}'
+'#h3c-p .me{align-self:flex-end;background:#0A1426;color:#fff;border-bottom-right-radius:4px}'
+'#h3c-p .lk{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}#h3c-p .lk a{font-size:13px;font-weight:600;color:#1F66BD;text-decoration:none;border:1px solid #BCD3F0;border-radius:8px;padding:7px 10px;background:#F4F8FE}#h3c-p .lk a:hover{background:#E6F0FC}'
+'#h3c-p .ch{display:flex;flex-wrap:wrap;gap:8px;padding:0 16px 12px;background:#F3F5F8}#h3c-p .ch button{font-size:13px;font-weight:600;font-family:inherit;color:#0E1A2B;background:#fff;border:1px solid #DCE1E9;border-radius:999px;padding:8px 12px;cursor:pointer;min-height:36px}#h3c-p .ch button:hover{background:#E9EEF5}'
+'#h3c-p form{display:flex;gap:8px;padding:12px;border-top:1px solid #DCE1E9;background:#fff}'
+'#h3c-p input{flex:1;min-width:0;font-size:16px;font-weight:400;font-family:inherit;border:1px solid #C5CCD8;border-radius:8px;padding:0 12px;min-height:44px;color:#0E1A2B}'
+'#h3c-p form button{min-height:44px;padding:0 16px;border:0;border-radius:8px;background:#2A78D6;color:#fff;font-size:14px;font-weight:600;font-family:inherit;cursor:pointer}#h3c-p form button:hover{background:#3a86e4}'
+'#h3c-p .ft{font-size:11.5px;color:#66717F;padding:0 14px 10px;background:#fff;line-height:1.4}'
+'@media (max-width:480px){#h3c-p{right:8px;left:8px;width:auto;max-width:none;bottom:calc(max(12px,env(safe-area-inset-bottom)) + 66px)}}'
+'@media (prefers-reduced-motion:reduce){#h3c-btn{transition:none}}@media print{#h3c-btn,#h3c-p{display:none!important}}';
var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);

function el(t,a,p,x){var e=document.createElement(t);if(a)for(var k in a)e.setAttribute(k,a[k]);if(x!=null)e.textContent=x;if(p)p.appendChild(e);return e}
var btn=el('button',{id:'h3c-btn',type:'button','aria-expanded':'false','aria-controls':'h3c-p'},document.body);
btn.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/></svg>';
var p=el('div',{id:'h3c-p',role:'dialog'},document.body);
var hd=el('div',{'class':'hd'},p),hb=el('div',null,hd),lg=el('div',{'class':'lg'},hb);lg.innerHTML='H<b>3</b>L Copilot';
var sb=el('div',{'class':'sb'},hb);
var x=el('button',{'class':'x',type:'button'},hd,'×');
var log=el('div',{'class':'log',role:'log','aria-live':'polite'},p);
var chips=el('div',{'class':'ch'},p);
var form=el('form',null,p),inp=el('input',{type:'text',autocomplete:'off',maxlength:'200'},form),sendB=el('button',{type:'submit'},form);
var ft=el('div',{'class':'ft'},p);

function add(txt,me,links){var m=el('div',{'class':'m '+(me?'me':'bot')},log,txt);
  if(links&&links.length){var d=el('div',{'class':'lk'},m);links.forEach(function(k){var aa=el('a',{href:LK[k]},d,cl().lk[k]);var g=goTo(LK[k]);if(g)aa.addEventListener('click',function(ev){ev.preventDefault();set(false);window.goSection(g)})})}
  log.scrollTop=log.scrollHeight}
function ask(q){q=q.trim();if(!q)return;add(q,true);var r=answer(q);setTimeout(function(){add(r.t,false,r.l)},reduce()?0:450)}
function reduce(){try{return matchMedia('(prefers-reduced-motion: reduce)').matches}catch(e){return false}}
/* textos de la interfaz: se vuelven a escribir al cambiar de idioma */
function paint(){var c=cl(),u=c.ui;
  btn.setAttribute('aria-label',u.open);p.setAttribute('aria-label',u.dlg);sb.textContent=u.sub;x.setAttribute('aria-label',u.close);
  inp.setAttribute('placeholder',u.ph);inp.setAttribute('aria-label',u.ql);sendB.textContent=u.send;ft.textContent=u.ft;
  chips.innerHTML='';c.chips.forEach(function(ch){var b=el('button',{type:'button'},chips,ch[0]);b.addEventListener('click',function(){ask(ch[1])})});
  log.innerHTML='';add(u.hi,false)}
paint();
if(window.H3L)H3L.on(paint);
if(window.H3LSite&&H3LSite.onLang)H3LSite.onLang(paint);

var open=false;
function set(o){open=o;p.classList.toggle('open',o);btn.setAttribute('aria-expanded',o?'true':'false');if(o){setTimeout(function(){try{inp.focus({preventScroll:true})}catch(e){}},30)}else{try{btn.focus({preventScroll:true})}catch(e){}}}
btn.addEventListener('click',function(){set(!open)});x.addEventListener('click',function(){set(false)});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&open)set(false)});
form.addEventListener('submit',function(e){e.preventDefault();var v=inp.value;inp.value='';ask(v)});

/* en la portada, el botón aparece cuando termina la introducción */
function ready(){var ld=document.getElementById('loader'),g=document.getElementById('gate');if(!ld)return true;return getComputedStyle(ld).display==='none'&&(!g||g.hidden)}
(function wait(){if(ready())btn.classList.add('on');else setTimeout(wait,300)})();
})();
