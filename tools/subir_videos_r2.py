#!/usr/bin/env python3
"""Sube los videos de media/ (*.mp4) al bucket R2 con wrangler y, con --verificar, comprueba que se vean desde la direccion publica.

Requisitos: Node y haber iniciado sesion con `npx wrangler login` (cuenta de Cloudflare del sitio).
Uso:
  python tools/subir_videos_r2.py --bucket h3l-media                       # sube todos los mp4
  python tools/subir_videos_r2.py --verificar https://media.h3lglobalenergy.com/   # solo verifica
Los posters (jpg) no se suben: se siguen sirviendo desde el sitio.
"""
import argparse, subprocess, sys, urllib.request
from pathlib import Path

SERVICIOS = ['reservas', 'auditoria', 'emisiones', 'datos', 'transicion', 'plataformas', 'geociencias', 'capacitacion']
NOMBRES = [f'svc-{sv}{sfx}.mp4' for sv in SERVICIOS for sfx in ('', '-en', '-fr', '-pt')]
MEDIA = Path(__file__).resolve().parent.parent / 'media'  # los mp4 ya no estan en el repo: usar --carpeta con la copia de respaldo


def subir(bucket):
    files = sorted(MEDIA.glob('svc-*.mp4'))
    if not files:
        sys.exit('No hay mp4 en media/')
    for f in files:
        cmd = ['npx', 'wrangler', 'r2', 'object', 'put', f'{bucket}/{f.name}', '--file', str(f), '--content-type', 'video/mp4',
               '--cache-control', 'public, max-age=31536000, immutable', '--remote']
        print('subiendo', f.name, f'({f.stat().st_size // 1024} KB)')
        r = subprocess.run(cmd, shell=(sys.platform == 'win32'))
        if r.returncode:
            sys.exit(f'Fallo la subida de {f.name}. Se detiene aca.')
    print(f'{len(files)} videos subidos a {bucket}')


def verificar(base):
    base = base.rstrip('/') + '/'
    mal = 0
    for nombre in NOMBRES:
        # Cloudflare bloquea con 403 el User-Agent por defecto de urllib: se identifica como un navegador.
        req = urllib.request.Request(base + nombre, headers={'Range': 'bytes=0-1023', 'User-Agent': 'Mozilla/5.0 (verificacion H3L)'})
        try:
            with urllib.request.urlopen(req, timeout=20) as r:
                ok = r.status in (200, 206) and r.headers.get('Content-Type', '').startswith('video/')
                print('OK ' if ok else 'MAL', nombre, r.status, r.headers.get('Content-Type'))
                mal += 0 if ok else 1
        except Exception as e:
            print('MAL', nombre, e); mal += 1
    sys.exit(1 if mal else 0)


if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('--bucket')
    ap.add_argument('--verificar', metavar='URL')
    ap.add_argument('--carpeta', help='carpeta con los svc-*.mp4 (por defecto media/)')
    a = ap.parse_args()
    if a.carpeta:
        MEDIA = Path(a.carpeta)
    if a.verificar:
        verificar(a.verificar)
    elif a.bucket:
        subir(a.bucket)
    else:
        ap.error('indicar --bucket o --verificar')
