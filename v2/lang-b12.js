/* H3L · textos de los tableros estratégico y operativo (es, en, fr, pt). Desarrollado por Leandro Collell. */
(function(){'use strict';
var A=window.__H3L_DASH_A;

/* ===== 1 · Estratégico ===== */
var P1={
 A:[["Infill Norte","Infill","Infill"],["North infill","Infill","Infill"],["Infill Nord","Infill","Infill"],["Infill Norte","Infill","Infill"]],
 B:[["Waterflood fase 2","Waterflood","Water."],["Waterflood phase 2","Waterflood","Water."],["Waterflood phase 2","Waterflood","Water."],["Waterflood fase 2","Waterflood","Water."]],
 C:[["Compresión de gas Sur","Compresión","Compr."],["South gas compression","Compression","Compr."],["Compression de gaz Sud","Compression","Compr."],["Compressão de gás Sul","Compressão","Compr."]],
 D:[["Exploración Bloque 7","Expl. B7","B7"],["Block 7 exploration","Expl. B7","B7"],["Exploration Bloc 7","Expl. B7","B7"],["Exploração Bloco 7","Expl. B7","B7"]],
 E:[["Planta de tratamiento","Planta","Planta"],["Treatment plant","Plant","Plant"],["Usine de traitement","Usine","Usine"],["Planta de tratamento","Planta","Planta"]],
 F:[["Fracturamiento etapa 3","Fractura","Fract."],["Fracturing stage 3","Fracking","Frac."],["Fracturation étape 3","Fractur.","Fract."],["Fraturamento etapa 3","Fratura","Frat."]],
 G:[["Electrificación de campos","Electrif.","Elec."],["Field electrification","Electrif.","Elec."],["Électrification des champs","Électrif.","Élec."],["Eletrificação de campos","Eletrif.","Elet."]],
 H:[["Revamp de oleoducto","Oleoducto","Oleod."],["Pipeline revamp","Pipeline","Pipe."],["Modernisation de l’oléoduc","Oléoduc","Oléo."],["Revamp do oleoduto","Oleoduto","Oleod."]]};
Object.keys(P1).forEach(function(id){var p=P1[id];
  A('b1.n'+id,p[0][0],p[1][0],p[2][0],p[3][0]);A('b1.s'+id,p[0][1],p[1][1],p[2][1],p[3][1]);A('b1.ss'+id,p[0][2],p[1][2],p[2][2],p[3][2])});

A('b1.tab',"Estratégico","Strategic","Stratégique","Estratégico");
A('b1.short',"¿Qué proyectos financiamos?","Which projects do we fund?","Quels projets finançons-nous ?","Quais projetos financiamos?");
A('b1.q',"¿Qué proyectos del portafolio financiamos este año con USD {bud} MM?","Which portfolio projects do we fund this year with USD {bud} MM?","Quels projets du portefeuille finançons-nous cette année avec {bud} M USD ?","Quais projetos do portfólio financiamos este ano com USD {bud} MM?");
A('b1.who',"comité de inversiones","investment committee","comité d’investissement","comitê de investimentos");
A('b1.fr',"trimestral","quarterly","trimestrielle","trimestral");
A('b1.cr',"VPN por dólar invertido (VPI) y sensibilidad al precio","NPV per dollar invested (PI) and price sensitivity","VAN par dollar investi (IP) et sensibilité au prix","VPL por dólar investido (IL) e sensibilidade ao preço");
A('b1.k1',"VPN del portafolio","Portfolio NPV","VAN du portefeuille","VPL do portfólio");
A('b1.k1s',"Con USD {bud} MM de presupuesto","With a USD {bud} MM budget","Avec un budget de {bud} M USD","Com orçamento de USD {bud} MM");
A('b1.k2',"Capex comprometido","Committed capex","Capex engagé","Capex comprometido");
A('b1.k2s',"Techo: {bud} MM","Ceiling: {bud} MM","Plafond : {bud} M","Teto: {bud} MM");
A('b1.k3',"VPI del portafolio","Portfolio PI","IP du portefeuille","IL do portfólio");
A('b1.k3s',"VPN ÷ capex","NPV ÷ capex","VAN ÷ capex","VPL ÷ capex");
A('b1.k4',"Proyectos financiados","Funded projects","Projets financés","Projetos financiados");
A('b1.k4u',"de {n}","of {n}","sur {n}","de {n}");
A('b1.k4s',"Candidatos evaluados: {n}","Candidates assessed: {n}","Candidats évalués : {n}","Candidatos avaliados: {n}");
A('b1.c1t',"Qué rinde cada dólar invertido","What each dollar invested returns","Ce que rapporte chaque dollar investi","Quanto rende cada dólar investido");
A('b1.c1s',"VPI por proyecto, ordenado de mayor a menor. Azul: financiado en este escenario.","PI by project, highest to lowest. Blue: funded in this scenario.","IP par projet, du plus élevé au plus bas. Bleu : financé dans ce scénario.","IL por projeto, do maior ao menor. Azul: financiado neste cenário.");
A('b1.status',"Estado","Status","Statut","Status");
A('b1.ref',"VPI = {v}","PI = {v}","IP = {v}","IL = {v}");
A('b1.t1h',"Proyecto|Capex (MM)|VPN (MM)|VPI|Estado","Project|Capex (MM)|NPV (MM)|PI|Status","Projet|Capex (M)|VAN (M)|IP|Statut","Projeto|Capex (MM)|VPL (MM)|IL|Status");
A('b1.c2t',"De dónde sale el cambio en VPN","Where the change in NPV comes from","D’où vient la variation de la VAN","De onde vem a mudança no VPL");
A('b1.c2s',"Puente entre el plan actual y la reasignación, en MM USD.","Bridge between the current plan and the reallocation, in MM USD.","Passage du plan actuel à la réaffectation, en M USD.","Ponte entre o plano atual e a realocação, em MM USD.");
A('b1.add',"Suma","Adds","Ajoute","Soma");
A('b1.sub',"Resta","Subtracts","Retranche","Subtrai");
A('b1.out',"Sale {n}","Out: {n}","Sort : {n}","Sai: {n}");
A('b1.in',"Entra {n}","In: {n}","Entre : {n}","Entra: {n}");
A('b1.t2h',"Paso|VPN (MM USD)","Step|NPV (MM USD)","Étape|VAN (M USD)","Passo|VPL (MM USD)");
A('b1.c3t',"Qué mueve el resultado","What drives the result","Ce qui fait bouger le résultat","O que move o resultado");
A('b1.c3s',"Cambio en el VPN del escenario elegido, en MM USD.","Change in the NPV of the chosen scenario, in MM USD.","Variation de la VAN du scénario choisi, en M USD.","Variação do VPL do cenário escolhido, em MM USD.");
A('b1.unf',"Caso desfavorable","Unfavorable case","Cas défavorable","Caso desfavorável");
A('b1.fav',"Caso favorable","Favorable case","Cas favorable","Caso favorável");
A('b1.r1',"Precio del Brent, ±15 USD/bbl","Brent price, ±15 USD/bbl","Prix du Brent, ±15 USD/bbl","Preço do Brent, ±15 USD/bbl");
A('b1.r2',"Capex, ±15 %","Capex, ±15%","Capex, ±15 %","Capex, ±15%");
A('b1.r3',"Declinación de los pozos, ±10 %","Well decline, ±10%","Déclin des puits, ±10 %","Declínio dos poços, ±10%");
A('b1.r4',"Tasa de descuento, 13 % / 8 %","Discount rate, 13% / 8%","Taux d’actualisation, 13 % / 8 %","Taxa de desconto, 13% / 8%");
A('b1.t3h',"Variable|Desfavorable|Favorable","Variable|Unfavorable|Favorable","Variable|Défavorable|Favorable","Variável|Desfavorável|Favorável");
A('b1.t3r',"Brent ±15 USD/bbl|Capex ±15 %|Declinación ±10 %|Tasa 13 % / 8 %","Brent ±15 USD/bbl|Capex ±15%|Decline ±10%|Rate 13% / 8%","Brent ±15 USD/bbl|Capex ±15 %|Déclin ±10 %|Taux 13 % / 8 %","Brent ±15 USD/bbl|Capex ±15%|Declínio ±10%|Taxa 13% / 8%");
A('b1.c4t',"Qué pasa si el petróleo baja","What if oil falls","Que se passe-t-il si le pétrole baisse","E se o petróleo cair");
A('b1.c4s',"VPN del portafolio según el precio del Brent, en MM USD.","Portfolio NPV by Brent price, in MM USD.","VAN du portefeuille selon le prix du Brent, en M USD.","VPL do portfólio conforme o preço do Brent, em MM USD.");
A('b1.assume',"Supuesto: 70","Assumption: 70","Hypothèse : 70","Premissa: 70");
A('b1.t4h',"Brent (USD/bbl)|Plan actual|Con la decisión","Brent (USD/bbl)|Current plan|With the decision","Brent (USD/bbl)|Plan actuel|Avec la décision","Brent (USD/bbl)|Plano atual|Com a decisão");
A('b1.rd1',"Dos proyectos financiados hoy rinden menos de {one} por cada dólar: <b>{a} ({va})</b> y <b>{b} ({vb})</b>. Juntos usan <b>{low} MM</b> del presupuesto.","Two projects funded today return less than {one} per dollar: <b>{a} ({va})</b> and <b>{b} ({vb})</b>. Together they use <b>{low} MM</b> of the budget.","Deux projets financés aujourd’hui rapportent moins de {one} par dollar : <b>{a} ({va})</b> et <b>{b} ({vb})</b>. Ensemble, ils utilisent <b>{low} M</b> du budget.","Dois projetos financiados hoje rendem menos de {one} por dólar: <b>{a} ({va})</b> e <b>{b} ({vb})</b>. Juntos usam <b>{low} MM</b> do orçamento.");
A('b1.rd2',"Pasar esos {oc} MM a {n} proyectos de mayor VPI <b>suma {ip} MM de VPN y quita {op}</b>: neto <b>{g} MM</b> con el mismo techo.","Moving those {oc} MM to {n} higher-PI projects <b>adds {ip} MM of NPV and removes {op}</b>: net <b>{g} MM</b> under the same ceiling.","Réaffecter ces {oc} M à {n} projets à IP plus élevé <b>ajoute {ip} M de VAN et en retire {op}</b> : net <b>{g} M</b> avec le même plafond.","Passar esses {oc} MM para {n} projetos de maior IL <b>soma {ip} MM de VPL e tira {op}</b>: líquido <b>{g} MM</b> com o mesmo teto.");
A('b1.rd3',"El resultado depende más del precio que del capex: ±15 USD de Brent mueven el VPN en <b>±{v} MM</b>. Por eso se mira el gráfico 4.","The result depends more on price than on capex: ±15 USD of Brent moves NPV by <b>±{v} MM</b>. That is why we look at chart 4.","Le résultat dépend plus du prix que du capex : ±15 USD de Brent font varier la VAN de <b>±{v} M</b>. D’où le graphique 4.","O resultado depende mais do preço do que do capex: ±15 USD de Brent movem o VPL em <b>±{v} MM</b>. Por isso se olha o gráfico 4.");
A('b1.rd4',"Con Brent a 55 USD el plan actual deja <b>{a} MM</b> de VPN y la decisión <b>{b} MM</b>. A 50 USD: {c} contra {d}.","With Brent at 55 USD the current plan leaves <b>{a} MM</b> of NPV and the decision <b>{b} MM</b>. At 50 USD: {c} versus {d}.","Avec un Brent à 55 USD, le plan actuel laisse <b>{a} M</b> de VAN et la décision <b>{b} M</b>. À 50 USD : {c} contre {d}.","Com Brent a 55 USD o plano atual deixa <b>{a} MM</b> de VPL e a decisão <b>{b} MM</b>. A 50 USD: {c} contra {d}.");
A('b1.dwhat',"Mover el presupuesto de {out} hacia {in}.","Move the budget from {out} to {in}.","Transférer le budget de {out} vers {in}.","Mover o orçamento de {out} para {in}.");
A('b1.du',"MM USD de VPN ({p})","MM USD of NPV ({p})","M USD de VAN ({p})","MM USD de VPL ({p})");
A('b1.dcap',"Con el mismo techo de USD {bud} MM: el capex pasa de {a} a {b} MM.","With the same USD {bud} MM ceiling: capex goes from {a} to {b} MM.","Avec le même plafond de {bud} M USD : le capex passe de {a} à {b} M.","Com o mesmo teto de USD {bud} MM: o capex passa de {a} para {b} MM.");
A('b1.dg1',"VPI del portafolio: <b>{a} → {b}</b> por dólar invertido.","Portfolio PI: <b>{a} → {b}</b> per dollar invested.","IP du portefeuille : <b>{a} → {b}</b> par dollar investi.","IL do portfólio: <b>{a} → {b}</b> por dólar investido.");
A('b1.dg2',"Con Brent a 50 USD el VPN sigue en <b>{a} MM</b> (plan actual: {b} MM).","With Brent at 50 USD, NPV still stands at <b>{a} MM</b> (current plan: {b} MM).","Avec un Brent à 50 USD, la VAN reste à <b>{a} M</b> (plan actuel : {b} M).","Com Brent a 50 USD o VPL segue em <b>{a} MM</b> (plano atual: {b} MM).");
A('b1.dg3',"Cada proyecto queda ordenado por VPI, con sus supuestos a la vista para el comité.","Every project is ranked by PI, with its assumptions in plain view for the committee.","Chaque projet est classé par IP, avec ses hypothèses visibles pour le comité.","Cada projeto fica ordenado por IL, com suas premissas à vista para o comitê.");
A('b1.note',"Datos de demostración. VPN a 10 %, Brent 70 USD/bbl.","Demo data. NPV at 10%, Brent 70 USD/bbl.","Données de démonstration. VAN à 10 %, Brent à 70 USD/bbl.","Dados de demonstração. VPL a 10%, Brent 70 USD/bbl.");
A('b1.a1',"Detecté que {w} de los {n} proyectos financiados rinden menos de {one} de VPI: {list}.","I found that {w} of the {n} funded projects return a PI below {one}: {list}.","J’ai détecté que {w} des {n} projets financés ont un IP inférieur à {one} : {list}.","Detectei que {w} dos {n} projetos financiados têm IL abaixo de {one}: {list}.");
A('b1.a1s',"Fuente: plan de inversiones y flujos de caja por proyecto.","Source: investment plan and cash flows by project.","Source : plan d’investissement et flux de trésorerie par projet.","Fonte: plano de investimentos e fluxos de caixa por projeto.");
A('b1.a2',"Reordené los {n} candidatos por VPI dentro de USD {bud} MM: salen {o}, entran {i}. VPN del portafolio de {a} a {b} MM.","I re-ranked the {n} candidates by PI within USD {bud} MM: {o} out, {i} in. Portfolio NPV from {a} to {b} MM.","J’ai reclassé les {n} candidats par IP dans les {bud} M USD : {o} sortent, {i} entrent. VAN du portefeuille de {a} à {b} M.","Reordenei os {n} candidatos por IL dentro de USD {bud} MM: saem {o}, entram {i}. VPL do portfólio de {a} para {b} MM.");
A('b1.a2s',"Cálculo: VPN a 10 %, Brent 70 USD/bbl, sensibilidad a capex ±15 %.","Calculation: NPV at 10%, Brent 70 USD/bbl, capex sensitivity ±15%.","Calcul : VAN à 10 %, Brent à 70 USD/bbl, sensibilité au capex ±15 %.","Cálculo: VPL a 10%, Brent 70 USD/bbl, sensibilidade ao capex ±15%.");
A('b1.a3',"Revisé sumas y supuestos. Marqué que el VPN de Exploración B7 está ponderado por riesgo geológico: conviene confirmar su probabilidad de éxito antes de descartarlo.","I checked the sums and assumptions. I flagged that the NPV of Block 7 exploration is risk-weighted for geology: confirm its chance of success before dropping it.","J’ai vérifié les sommes et les hypothèses. J’ai signalé que la VAN de l’exploration du Bloc 7 est pondérée par le risque géologique : mieux vaut confirmer sa probabilité de succès avant de l’écarter.","Revisei somas e premissas. Sinalizei que o VPL da Exploração do Bloco 7 é ponderado por risco geológico: convém confirmar sua probabilidade de sucesso antes de descartá-lo.");
A('b1.a3s',"Regla aplicada: todo proyecto descartado deja su justificación escrita.","Rule applied: every dropped project leaves a written justification.","Règle appliquée : tout projet écarté laisse une justification écrite.","Regra aplicada: todo projeto descartado deixa sua justificativa por escrito.");
A('b1.a4',"Preparé la nota para el comité con la comparación, los supuestos, la sensibilidad y las fuentes. Falta su aprobación.","I prepared the committee note with the comparison, assumptions, sensitivity and sources. It still needs your approval.","J’ai préparé la note pour le comité avec la comparaison, les hypothèses, la sensibilité et les sources. Il manque votre approbation.","Preparei a nota para o comitê com a comparação, as premissas, a sensibilidade e as fontes. Falta a sua aprovação.");

/* ===== 2 · Operativo ===== */
A('b2.cpump',"bombas","pumps","pompes","bombas");
A('b2.celec',"falla eléctrica","electrical failure","panne électrique","falha elétrica");
A('b2.cstim',"estimulación","stimulation","stimulation","estimulação");
A('b2.ccomp',"compresión","compression","compression","compressão");
A('b2.lpump',"Bombas ineficientes","Inefficient pumps","Pompes inefficaces","Bombas ineficientes");
A('b2.lelec',"Fallas eléctricas","Electrical failures","Pannes électriques","Falhas elétricas");
A('b2.lcomp',"Restricción de compresión","Compression constraint","Restriction de compression","Restrição de compressão");
A('b2.lstim',"Estimulación pendiente","Pending stimulation","Stimulation en attente","Estimulação pendente");
A('b2.ldecl',"Declinación mayor a la esperada","Decline above expectations","Déclin supérieur aux prévisions","Declínio maior que o esperado");
A('b2.tab',"Operativo","Operational","Opérationnel","Operacional");
A('b2.short',"¿Qué pozos intervenimos?","Which wells do we work on?","Sur quels puits intervenons-nous ?","Em quais poços intervimos?");
A('b2.q',"¿Qué pozos intervenimos esta semana para acercar la producción a la meta?","Which wells do we work on this week to bring production closer to target?","Sur quels puits intervenons-nous cette semaine pour rapprocher la production de l’objectif ?","Em quais poços intervimos esta semana para aproximar a produção da meta?");
A('b2.who',"jefe de operaciones","head of operations","chef des opérations","chefe de operações");
A('b2.fr',"diaria","daily","quotidienne","diária");
A('b2.cr',"días en recuperar la inversión (límite {lim})","days to pay back the investment (limit {lim})","jours pour récupérer l’investissement (limite {lim})","dias para recuperar o investimento (limite {lim})");
A('b2.k1',"Producción a 14 días","Production at 14 days","Production à 14 jours","Produção em 14 dias");
A('b2.k1s',"Hoy: {v} bopd","Today: {v} bopd","Aujourd’hui : {v} bopd","Hoje: {v} bopd");
A('b2.k2',"Brecha contra la meta","Gap to target","Écart par rapport à l’objectif","Lacuna em relação à meta");
A('b2.k2s',"Meta: {v} bopd","Target: {v} bopd","Objectif : {v} bopd","Meta: {v} bopd");
A('b2.k3',"Inversión en intervenciones","Investment in interventions","Investissement en interventions","Investimento em intervenções");
A('b2.k3s',"Nada aprobado todavía","Nothing approved yet","Rien d’approuvé pour l’instant","Nada aprovado ainda");
A('b2.k4',"Recupera la inversión en","Pays back in","Récupère l’investissement en","Recupera o investimento em");
A('b2.k4v',"{v} días","{v} days","{v} jours","{v} dias");
A('b2.k4s',"Si se aprueba, se calcula","Calculated if approved","Calculé si approuvé","Calculado se aprovado");
A('b2.k4d',"En conjunto, con netback de {nb} USD/bbl","Overall, at a netback of {nb} USD/bbl","Au total, avec un netback de {nb} USD/bbl","No conjunto, com netback de {nb} USD/bbl");
A('b2.c1t',"Producción del campo y qué pasa en los próximos 14 días","Field production and what happens over the next 14 days","Production du champ et ce qui se passe dans les 14 prochains jours","Produção do campo e o que acontece nos próximos 14 dias");
A('b2.c1s',"bopd. Las intervenciones suman su aporte desde el día en que se ejecutan.","bopd. Each intervention adds its contribution from the day it is carried out.","bopd. Les interventions ajoutent leur apport dès le jour où elles sont réalisées.","bopd. As intervenções somam sua contribuição a partir do dia em que são executadas.");
A('b2.withI',"Con las intervenciones","With the interventions","Avec les interventions","Com as intervenções");
A('b2.t1h',"Día|Plan actual (bopd)|Con intervenciones (bopd)","Day|Current plan (bopd)|With interventions (bopd)","Jour|Plan actuel (bopd)|Avec interventions (bopd)","Dia|Plano atual (bopd)|Com intervenções (bopd)");
A('b2.c2t',"De dónde viene la brecha","Where the gap comes from","D’où vient l’écart","De onde vem a lacuna");
A('b2.c2s',"bopd perdidos contra la meta, según la causa.","bopd lost against target, by cause.","bopd perdus par rapport à l’objectif, selon la cause.","bopd perdidos em relação à meta, por causa.");
A('b2.rec',"Se recupera con la decisión","Recovered with the decision","Récupéré avec la décision","Recuperado com a decisão");
A('b2.lost',"Sigue perdido","Still lost","Reste perdu","Continua perdido");
A('b2.recS',"Se recupera","Recovered","Récupéré","Recuperado");
A('b2.cause',"Causa","Cause","Cause","Causa");
A('b2.t2h',"Causa|Perdido (bopd)|Se recupera","Cause|Lost (bopd)|Recovered","Cause|Perdu (bopd)|Récupéré","Causa|Perdido (bopd)|Recuperado");
A('b2.c3t',"En cuánto tiempo se paga cada intervención","How fast each intervention pays back","En combien de temps chaque intervention est rentabilisée","Em quanto tempo cada intervenção se paga");
A('b2.c3s',"Días para recuperar la inversión, con netback de {nb} USD/bbl.","Days to recover the investment, at a netback of {nb} USD/bbl.","Jours pour récupérer l’investissement, avec un netback de {nb} USD/bbl.","Dias para recuperar o investimento, com netback de {nb} USD/bbl.");
A('b2.in',"Entra: paga en {lim} días o menos","In: pays back in {lim} days or less","Retenu : rentabilisé en {lim} jours ou moins","Entra: paga em {lim} dias ou menos");
A('b2.defer',"Se difiere","Deferred","Reporté","Adiado");
A('b2.payin',"Recupera en","Pays back in","Récupéré en","Recupera em");
A('b2.contrib',"Aporte","Contribution","Apport","Contribuição");
A('b2.invest',"Inversión","Investment","Investissement","Investimento");
A('b2.days',"Días","Days","Jours","Dias");
A('b2.limit',"Límite: {lim} días","Limit: {lim} days","Limite : {lim} jours","Limite: {lim} dias");
A('b2.t3h',"Pozo|Causa|Aporte (bopd)|Inversión (mil USD)|Recupera en (días)","Well|Cause|Contribution (bopd)|Investment (k USD)|Pays back in (days)","Puits|Cause|Apport (bopd)|Investissement (k USD)|Récupéré en (jours)","Poço|Causa|Contribuição (bopd)|Investimento (mil USD)|Recupera em (dias)");
A('b2.rd1',"Hoy se producen <b>{p} bopd</b>, {g} por debajo de la meta. Sin intervenir, en 14 días la brecha sube a <b>{g14}</b>.","Today we produce <b>{p} bopd</b>, {g} below target. Without intervening, the gap grows to <b>{g14}</b> in 14 days.","Aujourd’hui, la production est de <b>{p} bopd</b>, soit {g} sous l’objectif. Sans intervention, l’écart passe à <b>{g14}</b> en 14 jours.","Hoje se produzem <b>{p} bopd</b>, {g} abaixo da meta. Sem intervir, em 14 dias a lacuna sobe para <b>{g14}</b>.");
A('b2.rd2',"El {pc} de la brecha tiene causa y solución conocidas: <b>bombas ({a})</b> y <b>fallas eléctricas ({b})</b> suman <b>{g} bopd</b>.","{pc} of the gap has a known cause and fix: <b>pumps ({a})</b> and <b>electrical failures ({b})</b> add up to <b>{g} bopd</b>.","{pc} de l’écart a une cause et une solution connues : <b>pompes ({a})</b> et <b>pannes électriques ({b})</b> totalisent <b>{g} bopd</b>.","{pc} da lacuna tem causa e solução conhecidas: <b>bombas ({a})</b> e <b>falhas elétricas ({b})</b> somam <b>{g} bopd</b>.");
A('b2.rd3',"Esos {n} pozos recuperan la inversión en <b>menos de {d} días</b> cada uno. Estimulación y compresión tardan más de {m} meses y no entran.","Those {n} wells pay back the investment in <b>under {d} days</b> each. Stimulation and compression take over {m} months and do not make the cut.","Ces {n} puits récupèrent l’investissement en <b>moins de {d} jours</b> chacun. La stimulation et la compression prennent plus de {m} mois et sont écartées.","Esses {n} poços recuperam o investimento em <b>menos de {d} dias</b> cada um. Estimulação e compressão levam mais de {m} meses e ficam de fora.");
A('b2.dwhat',"Programar esta semana las intervenciones en {n} pozos (fallas eléctricas y bombas) y diferir estimulación y compresión.","Schedule this week the interventions on {n} wells (electrical failures and pumps) and defer stimulation and compression.","Programmer cette semaine les interventions sur {n} puits (pannes électriques et pompes) et reporter la stimulation et la compression.","Programar esta semana as intervenções em {n} poços (falhas elétricas e bombas) e adiar estimulação e compressão.");
A('b2.du',"bopd en {d} días","bopd in {d} days","bopd en {d} jours","bopd em {d} dias");
A('b2.dcap',"Inversión de USD {k} mil. Ingreso neto adicional de unos USD {m} mil por mes.","Investment of USD {k} thousand. Additional net income of about USD {m} thousand per month.","Investissement de {k} k USD. Revenu net supplémentaire d’environ {m} k USD par mois.","Investimento de USD {k} mil. Receita líquida adicional de cerca de USD {m} mil por mês.");
A('b2.dg1',"Recupera la inversión en <b>{d} días</b> en conjunto.","Pays back the investment in <b>{d} days</b> overall.","Récupère l’investissement en <b>{d} jours</b> au total.","Recupera o investimento em <b>{d} dias</b> no conjunto.");
A('b2.dg2',"La brecha contra la meta baja de <b>{a}</b> a <b>{b}</b> bopd en 14 días.","The gap to target falls from <b>{a}</b> to <b>{b}</b> bopd in 14 days.","L’écart par rapport à l’objectif passe de <b>{a}</b> à <b>{b}</b> bopd en 14 jours.","A lacuna em relação à meta cai de <b>{a}</b> para <b>{b}</b> bopd em 14 dias.");
A('b2.dg3',"Quedan {a} bopd de brecha: {b} tienen solución más cara y {c} son declinación (se revisan en Reservas).","{a} bopd of gap remain: {b} have a costlier fix and {c} is decline (reviewed under Reserves).","Il reste {a} bopd d’écart : {b} ont une solution plus coûteuse et {c} relèvent du déclin (revus dans Réserves).","Restam {a} bopd de lacuna: {b} têm solução mais cara e {c} são declínio (revisados em Reservas).");
A('b2.note',"Datos de demostración. Netback de {nb} USD/bbl.","Demo data. Netback of {nb} USD/bbl.","Données de démonstration. Netback de {nb} USD/bbl.","Dados de demonstração. Netback de {nb} USD/bbl.");
A('b2.a1',"La producción de hoy es {p} bopd, {g} bajo la meta. Hubo una caída de tres días en los pozos con falla eléctrica y no se recuperó.","Today’s production is {p} bopd, {g} below target. Wells with electrical failures dropped over three days and did not recover.","La production du jour est de {p} bopd, soit {g} sous l’objectif. Les puits en panne électrique ont chuté pendant trois jours sans se rétablir.","A produção de hoje é {p} bopd, {g} abaixo da meta. Houve uma queda de três dias nos poços com falha elétrica e não se recuperou.");
A('b2.a1s',"Fuente: SCADA, producción diaria por pozo.","Source: SCADA, daily production by well.","Source : SCADA, production quotidienne par puits.","Fonte: SCADA, produção diária por poço.");
A('b2.a2',"Calculé el tiempo de repago de {n} intervenciones. {s} recuperan la inversión en {lim} días o menos: suman +{g} bopd por USD {k} mil.","I calculated the payback time of {n} interventions. {s} recover the investment in {lim} days or less: they add +{g} bopd for USD {k} thousand.","J’ai calculé le délai de récupération de {n} interventions. {s} récupèrent l’investissement en {lim} jours ou moins : elles ajoutent +{g} bopd pour {k} k USD.","Calculei o tempo de retorno de {n} intervenções. {s} recuperam o investimento em {lim} dias ou menos: somam +{g} bopd por USD {k} mil.");
A('b2.a2s',"Cálculo: netback {nb} USD/bbl, declinación base {d} diaria.","Calculation: netback {nb} USD/bbl, base decline {d} per day.","Calcul : netback {nb} USD/bbl, déclin de base {d} par jour.","Cálculo: netback {nb} USD/bbl, declínio base {d} ao dia.");
A('b2.a3',"Verifiqué que ninguna intervención dependa de equipos ya asignados esta semana y que el cronograma entre en 9 días.","I verified that no intervention depends on crews already assigned this week and that the schedule fits in 9 days.","J’ai vérifié qu’aucune intervention ne dépend d’équipes déjà affectées cette semaine et que le calendrier tient en 9 jours.","Verifiquei que nenhuma intervenção dependa de equipes já alocadas esta semana e que o cronograma caiba em 9 dias.");
A('b2.a3s',"Regla aplicada: máximo dos equipos de servicio por día.","Rule applied: at most two service crews per day.","Règle appliquée : au maximum deux équipes de service par jour.","Regra aplicada: no máximo duas equipes de serviço por dia.");
A('b2.a4',"Armé la orden de trabajo con prioridad, costo y ganancia esperada por pozo. Falta su aprobación.","I drafted the work order with priority, cost and expected gain per well. It still needs your approval.","J’ai préparé l’ordre de travail avec priorité, coût et gain attendu par puits. Il manque votre approbation.","Montei a ordem de serviço com prioridade, custo e ganho esperado por poço. Falta a sua aprovação.");
A('b2.a4s',"Documento listo para el supervisor de campo.","Document ready for the field supervisor.","Document prêt pour le superviseur de terrain.","Documento pronto para o supervisor de campo.");
})();
