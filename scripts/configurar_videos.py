#!/usr/bin/env python3
"""Fija de donde salen los videos del sitio (assets/site.js) y habilita ese origen en la CSP (media-src).

Uso:
  python3 scripts/configurar_videos.py https://media.h3lglobalenergy.com/    # videos desde el bucket R2
  python3 scripts/configurar_videos.py --local                               # vuelve a media/ (este sitio)
  python3 scripts/configurar_videos.py https://media.h3lglobalenergy.com/ --version 2   # tras reemplazar un video (cambia ?v=)

Despues de correrlo, revisar con `git diff` y probar en develop antes de pasar a main.
"""
import argparse, re, sys
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parent.parent
CSP_FILES = ['_headers', 'index.html', 'privacidad.html', 'es/index.html', 'en/index.html', 'fr/index.html', 'pt/index.html'] + \
    [str(p.relative_to(ROOT)) for p in list((ROOT / 'v2').glob('*.html')) + list((ROOT / 'calculadoras').glob('*.html'))]
MEDIA = re.compile(r"media-src ([^;\"]*)")


def set_csp(origin):
    """Deja en media-src 'self' blob: data: y, si hay origen, ese origen (y ningun otro host externo)."""
    n = 0
    for rel in sorted(set(CSP_FILES)):
        p = ROOT / rel
        if not p.exists():
            continue
        s = p.read_text(encoding='utf-8')

        def fix(m):
            toks = [t for t in m.group(1).split() if not t.startswith('https://')]
            if origin:
                toks.append(origin)
            return 'media-src ' + ' '.join(toks)
        t = MEDIA.sub(fix, s)
        if t != s:
            p.write_text(t, encoding='utf-8'); n += 1
    return n


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('base', nargs='?')
    ap.add_argument('--local', action='store_true')
    ap.add_argument('--version')
    a = ap.parse_args()
    if a.local == bool(a.base):
        ap.error('indicar la direccion de los videos o --local')
    if a.local:
        base, origin = '', ''
    else:
        u = urlparse(a.base)
        if u.scheme != 'https' or not u.hostname or u.path not in ('', '/') or u.query or u.fragment:
            sys.exit('La direccion debe ser https://dominio/ (sin ruta ni parametros).')
        if not re.fullmatch(r'[a-z0-9.-]+', u.hostname):
            sys.exit('Dominio no valido.')
        origin = f'https://{u.hostname}'
        base = origin + '/'
    sj = ROOT / 'assets' / 'site.js'
    s = sj.read_text(encoding='utf-8')
    m = re.search(r"var VIDEO_BASE='[^']*',VIDEO_VER='([^']*)';", s)
    if not m:
        sys.exit('No encuentro VIDEO_BASE en assets/site.js')
    ver = a.version or m.group(1)
    s = s.replace(m.group(0), f"var VIDEO_BASE='{base}',VIDEO_VER='{ver}';")
    sj.write_text(s, encoding='utf-8')
    # cambia el ?v= de site.js en index.html para que no quede en cache la version anterior
    ih = ROOT / 'index.html'
    t = ih.read_text(encoding='utf-8')
    t = re.sub(r'assets/site\.js\?v=(\d+)', lambda mm: f'assets/site.js?v={int(mm.group(1)) + 1}', t, count=1)
    ih.write_text(t, encoding='utf-8')
    n = set_csp(origin)
    print(f'videos desde: {base or "media/ (local)"}  | CSP actualizada en {n} archivos')


if __name__ == '__main__':
    main()
