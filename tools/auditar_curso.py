"""Auditoria de calidad de cursos H3L. Uso: python3 tools/auditar_curso.py [id ...]  (sin ids: todos). Correr desde la raiz del repo."""
import json,re,glob,os,collections,sys
ONLY=set(sys.argv[1:])
core=open('cursos/core.js',encoding='utf8').read()
def cues(d):
    for m in d['modules']:
        for l in m['lessons']:
            for i,c in enumerate(l['cues']): yield l,i,c
def allq(d):
    for m in d['modules']:
        for q in m['quiz']: yield 'quiz '+m['id'],q
    for q in d.get('exam',[]): yield 'examen',q
res=collections.defaultdict(list)
for f in sorted(glob.glob('cursos/data/*.json')):
    n=os.path.basename(f)[:-5]
    if n in('catalog','juego') or (ONLY and n not in ONLY): continue
    d=json.load(open(f,encoding='utf8'))
    R=res[n]
    # quizzes
    pos=collections.Counter(); longest=0;tot=0
    for w,q in allq(d):
        tot+=1; pos[q['a']]+=1
        if len(set(o.strip().lower() for o in q['o']))<len(q['o']): R.append(('quiz','opciones repetidas',w,q['q'][:50]))
        if not q.get('e'): R.append(('quiz','sin explicación',w,q['q'][:50]))
        if len(q['o'])<3: R.append(('quiz','menos de 3 opciones',w,q['q'][:50]))
        if max(range(len(q['o'])),key=lambda i:len(q['o'][i]))==q['a']: longest+=1
    if tot and pos.most_common(1)[0][1]/tot>.6: R.append(('quiz','respuesta correcta concentrada en una posición',dict(pos),''))
    if tot and longest/tot>.5: R.append(('quiz','la opción correcta suele ser la más larga (se adivina)',f'{longest}/{tot}',''))
    # cues
    for l,i,c in cues(d):
        t=c['say']
        for s in re.split(r'(?<=[.?!])\s+',t):
            if len(s.split())>38: R.append(('audio','oración larga (>38 palabras)',l['id']+'/'+str(i),s[:70]))
        if re.search(r'[%→≈≥≤×÷²³₂]|\bvs\.?\b|\be\.g\.|/',t): R.append(('audio','símbolo que la voz puede leer mal',l['id']+'/'+str(i),re.findall(r'[%→≈≥≤×÷²³₂]|\bvs\.?\b|\be\.g\.|/',t)[0]))
        if re.search(r'\d,\d|\d{4,}',t) and not re.search(r'\b(19|20)\d\d\b',t): R.append(('audio','cifra a revisar en voz',l['id']+'/'+str(i),re.search(r'.{0,25}(\d,\d|\d{4,}).{0,15}',t).group(0)))
        if '  ' in t or t!=t.strip(): R.append(('texto','espacios dobles',l['id']+'/'+str(i),''))
        if re.search(r'\bVAN\b|\bTIR\b.*\bTIR\b.*\bTIR\b',t): pass
        s=c.get('scene') or {}
        if s.get('t')=='bul':
            hls=set(x.get('hl') for x in l['cues'] if x.get('hl') is not None)
    # bul coverage
    for l in [l for m in d['modules'] for l in m['lessons']]:
        cs=l['cues']; j=None
        for i,c in enumerate(cs):
            s=c.get('scene')
            if s and s.get('t')=='bul':
                k=i+1; hs=[c.get('hl')] if c.get('hl') is not None else []
                while k<len(cs) and not cs[k].get('scene'):
                    if cs[k].get('hl') is not None: hs.append(cs[k]['hl'])
                    k+=1
                if len(set(hs))<len(s['items']): R.append(('sincronía','lista con ítems sin nombrar en el audio',l['id']+'/'+str(i),f'{len(set(hs))} de {len(s["items"])} ítems'))
    # texto del curso: socios y demo
    blob=json.dumps(d,ensure_ascii=False)
    for nm in ('Hernando','Escamilla','Lilibeth','Perdomo'):
        if nm in blob: R.append(('regla 4','nombre de socio en el curso',nm,''))
    if d.get('labs') and not re.search(r'ejemplo|demo|ilustrativ|simulad',blob,re.I): R.append(('regla 5','laboratorios sin aviso de "ejemplo"','',''))
    for dl in d.get('downloads',[]):
        if not os.path.exists('cursos/'+dl['file']): R.append(('archivos','descarga inexistente',dl['file'],''))
    for r in d.get('refs',[]):
        if not r.get('cite') or not r.get('why'): R.append(('refs','referencia incompleta',str(r)[:60],''))
    if len(d.get('refs',[]))<3: R.append(('refs','menos de 3 referencias',len(d.get('refs',[])),''))
    for cs in d.get('cases',[]):
        if not cs.get('src') and not cs.get('cite'): pass
    words=sum(len(c['say'].split()) for l,i,c in cues(d))
    R.append(('info','minutos de audio (150 ppm)',round(words/150,1),'lecciones %d'%sum(len(m['lessons']) for m in d['modules'])))
for n,R in res.items():
    prob=[r for r in R if r[0]!='info']
    print('==',n,'| hallazgos',len(prob),'|',[r for r in R if r[0]=='info'][0][2],'min')
    g=collections.Counter((r[0],r[1]) for r in prob)
    for k,v in g.items(): print('   ',v,'×',k, '| ej:',[r[2:] for r in prob if (r[0],r[1])==k][0])
