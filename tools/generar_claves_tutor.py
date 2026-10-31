#!/usr/bin/env python3
"""Genera una clave de acceso por curso para el editor de tutores (cursos/tutor.html).
Uso: python3 tools/generar_claves_tutor.py sim eor rta      (ids de curso; sin argumentos: todos los de cursos/data/catalog.json)
Imprime UNA VEZ las claves (entregar a cada tutor por un canal privado) y los dos secretos a cargar en Cloudflare:
  wrangler secret put TUTOR_CODES   (pegar el JSON de hashes)
  wrangler secret put TUTOR_SECRET  (pegar la clave de firma)
No guarda nada en disco ni en el repo. Para rotar una clave, volver a correr y reemplazar el secreto."""
import hashlib, json, secrets, sys
from pathlib import Path
ids = sys.argv[1:]
if not ids:
    ids = [c['id'] for c in json.loads((Path(__file__).resolve().parent.parent / 'cursos/data/catalog.json').read_text(encoding='utf-8'))['courses']]
alfabeto = 'abcdefghjkmnpqrstuvwxyz23456789'
claves = {i: '-'.join(''.join(secrets.choice(alfabeto) for _ in range(5)) for _ in range(4)) for i in ids}
print('Claves por curso (entregar en privado):')
for i, k in claves.items(): print(f'  {i}: {k}')
print('\nTUTOR_CODES =', json.dumps({i: hashlib.sha256(k.encode()).hexdigest() for i, k in claves.items()}))
print('\nTUTOR_SECRET =', secrets.token_hex(32))
