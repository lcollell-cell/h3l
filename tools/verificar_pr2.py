"""Verifica las reglas y los modelos de cursos/px-model.js (curso pr2) contra calculos independientes en Python. Uso: python3 tools/verificar_pr2.py (desde la raiz del repo)."""
import json,math,subprocess,sys
JS=r"""
var M=require('./cursos/px-model.js');
var base={disc:true,tech:true,econ:true,appr:true,mkt:true,intent:true,yrs:3,just:false};
function c(o){var i=Object.assign({},base,o);return M.classify(i)}
var out={
 r_just:c({fase:'just'}), r_impl:c({fase:'impl'}), r_prod:c({fase:'prod'}),
 c_pend:c({appr:false,estado:'active'}), c_hold:c({mkt:false,estado:'hold'}), c_uncl:c({tech:false,estado:'incomplete'}), c_nv:c({econ:false,estado:'none'}),
 t6:c({yrs:6.5,just:false,estado:'active'}), t6j:c({yrs:6.5,just:true,fase:'just'}), t5:c({yrs:5,fase:'just'}),
 p_def:c({disc:false,tgt:'def'}), p_poor:c({disc:false,tgt:'poor'}), p_tr:c({disc:false,tgt:'trend'}),
 d1:M.dnp({tipo:'shut',pct:20,thr:30,evid:true,mkt:true}), d2:M.dnp({tipo:'bp',pct:20,thr:30,evid:true,mkt:true}), d3:M.dnp({tipo:'shut',pct:60,thr:30,evid:true,mkt:true}),
 d4:M.dnp({tipo:'shut',pct:20,thr:30,evid:false,mkt:true}), d5:M.dnp({tipo:'shut',pct:20,thr:30,evid:true,mkt:false}), d6:M.dnp({tipo:'new',pct:10,thr:30,evid:true,mkt:true}), d7:M.dnp({tipo:'shut',pct:30,thr:30,evid:true,mkt:true}),
 pc1:M.pc({disc:false,pg:.3,pd:.5,u1:50,u2:100,u3:180}), pc2:M.pc({disc:true,pg:.3,pd:.8,u1:50,u2:100,u3:180}),
 e1:M.exp(300,.2,20), e2:M.exp(250,.2,20), e3:M.exp(300,.15,20), e4:M.exp(300,.3,20), e5:M.exp(350,.2,20),
 a0:M.arps(500,.5,0,20), a3:M.arps(500,.5,.3,20), a5:M.arps(500,.5,.5,20), a8:M.arps(500,.5,.8,20),
 dobs:M.declObs(1200,780,1), rem:M.exp(780,M.declObs(1200,780,1),60),
 npv:[M.npv(240,15.5,3.6),M.npv(300,15.5,4.2),M.npv(300,15.5,4.83),M.npv(360,15.5,4.83)],
 pe:[M.pExceed(14,.5,14),M.pExceed(14,.5,11.2),M.pExceed(14,.5,280/30),M.pExceed(14,.5,280/20)], be:[M.breakeven(280,20),M.breakeven(280,25),M.breakeven(280,30)]
};
console.log(JSON.stringify(out));
"""
r=json.loads(subprocess.check_output(['node','-e',JS]))
fails=[]
def chk(name,cond,info=''):
    if not cond: fails.append((name,info))
chk('just',(r['r_just']['cls'],r['r_just']['sub'])==('Reservas','Justificado para desarrollo'))
chk('impl',r['r_impl']['sub']=='Aprobado para desarrollo'); chk('prod',r['r_prod']['sub']=='En producción')
chk('pend',(r['c_pend']['cls'],r['c_pend']['sub'])==('Recursos contingentes','Desarrollo pendiente') and len(r['c_pend']['missing'])==1)
chk('hold',r['c_hold']['sub']=='Desarrollo en espera'); chk('uncl',r['c_uncl']['sub']=='Desarrollo sin aclarar'); chk('nv',r['c_nv']['sub']=='Desarrollo no viable' and r['c_nv']['econ']==False)
chk('t6',r['t6']['cls']=='Recursos contingentes' and any('cinco años' in m for m in r['t6']['missing'])); chk('t6j',r['t6j']['cls']=='Reservas'); chk('t5',r['t5']['cls']=='Reservas')
chk('prosp',[r['p_def']['sub'],r['p_poor']['sub'],r['p_tr']['sub']]==['Prospecto','Lead','Play'])
chk('dnp',[r[k]['res'] for k in('d1','d2','d3','d4','d5','d6','d7')]==['Reserva desarrollada no productiva (cerrada)','Reserva desarrollada no productiva (behind-pipe)','Reserva no desarrollada','Sin evidencia suficiente','Recurso contingente en espera','Reserva no desarrollada','Reserva desarrollada no productiva (cerrada)'])
chk('pc1',abs(r['pc1']['pc']-.15)<1e-12 and abs(r['pc1']['riskedBest']-15)<1e-9); chk('pc2',abs(r['pc2']['pc']-.8)<1e-12)
# independientes en Python
chk('e1',abs(r['e1']['cum']-(300-20)*365/.2)<1e-6 and round(r['e1']['cum']/1000)==511)
chk('e2',round(r['e2']['cum']/1000)==420); chk('e3',round(r['e3']['cum']/1000)==681); chk('e4',round(r['e4']['cum']/1000)==341); chk('e5',round(r['e5']['cum']/1000)==602)
def arps(qi,D,b,qa):
    if b==0: return (qi-qa)*365/D, math.log(qi/qa)/D
    return qi**b/((1-b)*D)*(qi**(1-b)-qa**(1-b))*365, ((qi/qa)**b-1)/(b*D)
for k,b in (('a0',0),('a3',.3),('a5',.5),('a8',.8)):
    n,t=arps(500,.5,b,20); chk(k,abs(r[k]['cum']-n)<1e-3 and abs(r[k]['t']-t)<1e-9)
chk('arps-valores',[round(r[k]['cum']/1000) for k in('a0','a3','a5','a8')]==[350,467,584,866] and [round(r[k]['t'],1) for k in('a0','a3','a5','a8')]==[6.4,10.8,16.0,30.3])
chk('dobs',abs(r['dobs']-math.log(1200/780))<1e-12 and round(r['dobs'],2)==.43); chk('rem',round(r['rem']['cum']/1000)==610,r['rem'])
chk('npv',[round(x,2) for x in r['npv']]==[.12,.45,-.18,.75],r['npv'])
def pexc(p50,s,x): return 0.5*math.erfc(math.log(x/p50)/s/math.sqrt(2))
for got,x in zip(r['pe'],[14,11.2,280/30,14.0]): pass
exp=[pexc(14,.5,14),pexc(14,.5,11.2),pexc(14,.5,280/30),pexc(14,.5,280/20)]
chk('pexceed',all(abs(a-b)<2e-7 for a,b in zip(r['pe'],exp)),(r['pe'],exp))
chk('be',[round(x,2) for x in r['be']]==[14.0,11.2,9.33])
print('FALLAS' if fails else 'OK', fails if fails else '33 comprobaciones')
sys.exit(1 if fails else 0)
