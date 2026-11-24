"""Verificación independiente de los modelos del curso "Seguridad de procesos y control de pozos" (cursos/spc-model.js).
Uso (desde la raíz del repo):  python3 tools/verificar_spc.py
Reimplementa cada modelo en Python con otro camino numérico (bisección en vez de fórmula cerrada, integración directa) y lo compara con el JavaScript
que usan los laboratorios. También fija casos de libro (kill sheet, tubería corroída) para que cualquier cambio de fórmula se note."""
import json, math, random, subprocess, sys

G = 0.052
NODE = r"""
const M=require('./cursos/spc-model.js');
const cases=JSON.parse(require('fs').readFileSync(0,'utf8'));
const out=cases.map(c=>{
  if(c.k==='kill')return M.kill(c.a);
  if(c.k==='circ'){const r=M.circ(c.a,c.m,c.n);return {maxPc:r.maxPc,maxPsh:r.maxPsh,pts:r.pts.filter((_,i)=>i%20===0).map(p=>[p.Vp,p.pc,p.psh,p.dpp,p.zb,p.zt])}}
  if(c.k==='cement')return M.cement(c.a);
  if(c.k==='neg')return M.negTest(c.a);
  if(c.k==='rel')return M.release(c.a);
  if(c.k==='b31g')return M.b31g(c.a);
  if(c.k==='rem')return M.remLife(c.t0,c.t1,c.y,c.tmin);
  if(c.k==='lopa')return M.lopa(c.fi,c.p,c.t);
});
console.log(JSON.stringify(out));
"""
fails = []
def chk(name, got, exp, tol=1e-6):
    ok = abs(got - exp) <= tol * max(1, abs(exp))
    if not ok: fails.append(f"{name}: JS {got} ≠ Python {exp}")
    return ok

def run_js(cases):
    r = subprocess.run(["node", "-e", NODE], input=json.dumps(cases), capture_output=True, text=True)
    if r.returncode: print(r.stderr); sys.exit(2)
    return json.loads(r.stdout)

# ---------- referencias independientes ----------
def kill_py(a):
    kmw = a['mw'] + a['sidpp'] / (G * a['tvd'])
    return dict(kmw=kmw, icp=a['sidpp'] + a['scr'], fcp=a['scr'] * kmw / a['mw'],
                pf=G * a['mw'] * a['tvd'] + a['sidpp'], maasp=(a['fg'] - a['mw']) * G * a['shoeTvd'])

def circ_py(a, method, Vp):
    """Presión en el casing para un volumen bombeado Vp, resolviendo la burbuja por bisección (sin la fórmula cerrada del JS)."""
    k = kill_py(a); D = a['tvd']; ca = a['ca']; gg = a.get('gg', .1); pf = k['pf']; kmw = k['kmw']
    V0 = 0 if method == 'driller2' else a['gain']
    Dd = min(D, Vp / ca)
    hk = min(D, max(0, Vp - a['dpVol']) / ca) if method in ('ww', 'driller2') else 0
    below = G * (a['mw'] * max(0, Dd - hk) + kmw * min(hk, Dd))
    zb = max(0, D - Dd); pbot = pf - below
    if V0 <= 0 or zb <= 0:
        return max(0, pf - G * (a['mw'] * max(0, D - hk) + kmw * min(hk, D)))
    K = (pf - gg * (V0 / ca) / 2) * V0
    f = lambda L: (pbot - gg * L / 2) * ca * L - K          # p_medio * V - K = 0 (creciente en L en el rango físico)
    lo, hi = 0.0, min(zb, pbot / gg)                         # el máximo de f está en L = pbot/gg
    if f(hi) < 0: Lg = zb
    else:
        for _ in range(200):
            mid = (lo + hi) / 2
            if f(mid) < 0: lo = mid
            else: hi = mid
        Lg = (lo + hi) / 2
    zt = zb - Lg
    if zt < 0: return pbot - gg * zb
    return pbot - gg * Lg - G * a['mw'] * zt

def b31g_py(a):
    Sf = a['smys'] + 68.95
    z = a['L'] ** 2 / (a['D'] * a['t'])
    M = (1 + .6275 * z - .003375 * z * z) ** .5 if z <= 50 else .032 * z + 3.3
    x = .85 * a['d'] / a['t']
    Pf = (2 * a['t'] * Sf / a['D']) * (1 - x) / (1 - x / M)
    return dict(Pf=Pf, Ps=a['F'] * Pf, erf=a['maop'] / (a['F'] * Pf), M=M, z=z)

def release_py(a):
    A = math.pi * (a['dHole'] / 1000) ** 2 / 4
    Pa = 101325; P1 = a['p'] * 1e6 + Pa
    if a['fluid'] == 'liquid':
        W = a['cd'] * A * math.sqrt(2 * a['rho'] * a['p'] * 1e6)
    else:
        g = a['gamma']; R = 8.314
        crit = ((g + 1) / 2) ** (g / (g - 1))
        if P1 / Pa >= crit:
            W = a['cd'] * A * P1 * math.sqrt(g * a['mw'] / (a['z'] * R * a['T'])) * (2 / (g + 1)) ** ((g + 1) / (2 * (g - 1)))
        else:
            r = Pa / P1
            W = a['cd'] * A * P1 * math.sqrt(2 * a['mw'] / (a['z'] * R * a['T']) * g / (g - 1) * (r ** (2 / g) - r ** ((g + 1) / g)))
    return dict(A=A, W=W, mass=min(a['inv'], W * (a['tDet'] + a['tIso'])))

# ---------- casos ----------
random.seed(7)
base = dict(mw=10.0, tvd=10000, sidpp=520, sicp=700, scr=700, gain=20, ca=.0459, dpVol=150, annVol=459, pump=.1, shoeTvd=6000, fg=14.5, gg=.1)
cases = []
# 1. caso de libro: KMW = MW + SIDPP / (0,052 · TVD)
cases.append(dict(k='kill', a=base))
for _ in range(25):
    a = dict(base); a.update(mw=round(random.uniform(8.6, 15), 1), tvd=random.choice([6000, 8000, 10000, 12000, 15000]),
        sidpp=random.choice([200, 350, 520, 800]), gain=random.choice([5, 10, 20, 40]), ca=random.choice([.0459, .0383, .0702]),
        gg=random.choice([.1, .12, .2]))
    a['sicp'] = a['sidpp'] + a['gain'] / a['ca'] * (G * a['mw'] - a['gg'])
    a['shoeTvd'] = a['tvd'] * random.choice([.4, .6, .8]); a['fg'] = a['mw'] + random.choice([2, 3, 4])
    a['dpVol'] = random.choice([100, 150, 220]); a['annVol'] = a['ca'] * a['tvd']
    for m in ('driller1', 'ww', 'driller2'):
        cases.append(dict(k='circ', a=a, m=m, n=240))
    cases.append(dict(k='kill', a=a))
bg = [dict(D=508, t=7.9, smys=358, d=3.2, L=100, F=.72, maop=6.0, cr=.2), dict(D=323.9, t=6.4, smys=290, d=2.0, L=60, F=.72, maop=5.0, cr=.3),
      dict(D=219.1, t=8.2, smys=359, d=4.5, L=300, F=.72, maop=9.0, cr=.15), dict(D=610, t=9.5, smys=414, d=1.0, L=800, F=.72, maop=7.0, cr=.1)]
for b in bg: cases.append(dict(k='b31g', a=b))
rel = [dict(fluid='gas', p=4.0, T=300, dHole=25, cd=.9, rho=0, gamma=1.3, mw=.0187, z=.95, inv=5000, tDet=60, tIso=120),
       dict(fluid='gas', p=.05, T=300, dHole=102, cd=.9, rho=0, gamma=1.3, mw=.0187, z=1, inv=2000, tDet=30, tIso=90),
       dict(fluid='liquid', p=1.5, T=300, dHole=25, cd=.61, rho=820, gamma=0, mw=0, z=1, inv=20000, tDet=300, tIso=900)]
for r in rel: cases.append(dict(k='rel', a=r))
cases.append(dict(k='rem', t0=9.5, t1=8.7, y=8, tmin=6.0))

js = run_js(cases)
for c, o in zip(cases, js):
    if c['k'] == 'kill':
        ref = kill_py(c['a'])
        for key in ref: chk('kill.' + key, o[key], ref[key])
    elif c['k'] == 'circ':
        for p in o['pts']:
            Vp, pc = p[0], p[1]
            chk(f"circ.{c['m']}.pc@{Vp:.0f}", pc, circ_py(c['a'], c['m'], Vp), 1e-6)
    elif c['k'] == 'b31g':
        ref = b31g_py(c['a'])
        for key in ('Pf', 'Ps', 'erf', 'M', 'z'): chk('b31g.' + key, o[key], ref[key])
    elif c['k'] == 'rel':
        ref = release_py(c['a'])
        for key in ('A', 'W', 'mass'): chk('rel.' + key, o[key], ref[key])
    elif c['k'] == 'rem':
        chk('rem.cr', o['cr'], (c['t0'] - c['t1']) / c['y']); chk('rem.life', o['life'], (c['t1'] - c['tmin']) / ((c['t0'] - c['t1']) / c['y']))

# ---------- cifras de libro (fijas) ----------
o0 = js[0]
chk('libro.KMW', o0['kmw'], 11.0)                      # 10 + 520 / (0,052·10000)
chk('libro.ICP', o0['icp'], 1220); chk('libro.FCP', o0['fcp'], 770)
chk('libro.MAASP', o0['maasp'], (14.5 - 10) * .052 * 6000)
# la presión de superficie debe valer SICP al inicio y SIDPP al terminar la 1.ª circulación del método del perforador
for c, o in zip(cases, js):
    if c['k'] == 'circ' and c['a'] is base or (c['k'] == 'circ' and c['a'] == base):
        if c['m'] == 'driller1': chk('driller1.fin', o['pts'][-1][1], 520, 1e-3); chk('driller1.ini', o['pts'][0][1], 703.0, 2e-3)
        if c['m'] == 'ww': chk('ww.fin', o['pts'][-1][1], 0, 1e-3)
# Esperar y densificar nunca debe dar más presión máxima en superficie que la 1.ª circulación del perforador (para el mismo influjo de gas)
for i in range(0, len(cases) - 2):
    if cases[i]['k'] == 'circ' and cases[i]['m'] == 'driller1' and cases[i + 1]['m'] == 'ww':
        if js[i + 1]['maxPc'] > js[i]['maxPc'] + 1e-6: fails.append(f"W&W con más Pc que driller (caso {i})")
# tubería sin defecto: la presión de falla modificada tiende a 2·t·Sf/D
a = dict(D=508, t=7.9, smys=358, d=1e-9, L=100, F=.72, maop=6.0, cr=.2)
chk('b31g.sin_defecto', run_js([dict(k='b31g', a=a)])[0]['Pf'], 2 * 7.9 * (358 + 68.95) / 508, 1e-6)
# cemento: hidrostática = suma de columnas
cm = dict(tvd=10000, dh=8.5, dpo=7, dpi=6.276, mw=10.5, sp=dict(rho=11.5, len=500), lead=dict(rho=13.5, len=1500), tail=dict(rho=15.8, len=1500), excess=.3, st=80, dispRho=10.5, pore=9.0, frac=15.0, fric=250, pump=.1, yield_=1.2)
cm['yield'] = cm.pop('yield_')
oc = run_js([dict(k='cement', a=cm)])[0]
hyd = G * (15.8 * 1500 + 13.5 * 1500 + 11.5 * 500 + 10.5 * (10000 - 3500)); chk('cem.hyd', oc['hyd'], hyd)
chk('cem.vol', oc['volCem'], (8.5 ** 2 - 7 ** 2) / 1029.4 * 3000 * 1.3)
chk('cem.dpU', oc['dpU'], hyd - (G * 10.5 * 9920 + G * 15.8 * 80))
# prueba negativa: subbalance = Pf - hidrostática con fluido liviano
on = run_js([dict(k='neg', a=dict(pf=11000, tvd=18000, mw=14, dispRho=8.6, dispLen=8000, leak=1))])[0]
chk('neg.under', on['underbalance'], 11000 - (G * 8.6 * 8000 + G * 14 * 10000))

ol = run_js([dict(k='lopa', fi=0.1, p=[0.1, 0.1], t=1e-4)])[0]
chk('lopa.f', ol['f'], 1e-3)
chk('lopa.gap', ol['gap'], 10)
chk('lopa.pfd', ol['sifPfd'], 0.1)

print('FALLAS:' if fails else 'OK', len(cases), 'casos comparados')
for f in fails[:30]: print(' -', f)
sys.exit(1 if fails else 0)
