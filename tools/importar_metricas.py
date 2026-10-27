#!/usr/bin/env python3
"""H3L Global Energy: base local de seguimiento del sitio (SQLite).

Carga las métricas diarias del sitio en un archivo SQLite de tu computadora, para consultarlas con SQL,
Excel, Power BI, Python, etc. Solo usa la biblioteca estándar de Python 3.8+.

Dos maneras de alimentarla (se pueden combinar; importar el mismo día dos veces lo reemplaza, no lo duplica):

  1) Desde los CSV que llegan adjuntos en el mail diario (h3l_metricas_AAAA-MM-DD.csv):
       python importar_metricas.py --csv carpeta_con_los_csv

  2) Directo desde el sitio (sin tocar el mail), con la clave REPORT_KEY del Worker:
       set H3L_CLAVE=la_clave                       (Windows)   |   export H3L_CLAVE=la_clave   (Mac/Linux)
       python importar_metricas.py --descargar --desde 2026-10-01
     Se puede programar a diario con el Programador de tareas de Windows o con cron.

  Ver un resumen:   python importar_metricas.py --resumen

Por defecto la base queda en ./h3l_metricas.sqlite (cambiar con --db). No subir ese archivo ni los CSV al repositorio.
"""
import argparse
import csv
import datetime as dt
import glob
import io
import os
import sqlite3
import sys
import urllib.error
import urllib.parse
import urllib.request

SERVICIOS = [
    ("reservas", "Evaluación de Recursos y Reservas"),
    ("auditoria", "Auditoría Energética y Diagnóstico de Descarbonización"),
    ("emisiones", "Gestión de Emisiones y Estrategias de Compensación"),
    ("datos", "Ciencia de Datos Aplicada a Energía"),
    ("transicion", "Estrategias para la Transición Energética"),
    ("plataformas", "Desarrollo de Plataformas Digitales Propias"),
    ("geociencias", "Geociencias"),
    ("capacitacion", "Capacitación y Formación Especializada"),
]

ESQUEMA = """
CREATE TABLE IF NOT EXISTS metricas (
  fecha   TEXT NOT NULL,            -- AAAA-MM-DD (hora de Argentina)
  metrica TEXT NOT NULL,            -- ver docs al final de este archivo
  dim1    TEXT NOT NULL DEFAULT '', -- p. ej. país, servicio, acción
  dim2    TEXT NOT NULL DEFAULT '', -- p. ej. país dentro de un servicio
  valor   REAL NOT NULL,
  PRIMARY KEY (fecha, metrica, dim1, dim2)
);
CREATE INDEX IF NOT EXISTS ix_metricas_metrica ON metricas (metrica, fecha);
CREATE TABLE IF NOT EXISTS servicios (id TEXT PRIMARY KEY, nombre TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS importaciones (
  cuando TEXT NOT NULL, origen TEXT NOT NULL, dias INTEGER NOT NULL, filas INTEGER NOT NULL
);

DROP VIEW IF EXISTS v_diario;
CREATE VIEW v_diario AS
SELECT fecha,
  MAX(CASE WHEN metrica='vistas' THEN valor END)           AS vistas,
  MAX(CASE WHEN metrica='visitantes' THEN valor END)       AS visitantes,
  MAX(CASE WHEN metrica='sesiones' THEN valor END)         AS sesiones,
  MAX(CASE WHEN metrica='tiempo_medio_s' THEN valor END)   AS tiempo_medio_s,
  MAX(CASE WHEN metrica='tiempo_mediano_s' THEN valor END) AS tiempo_mediano_s,
  MAX(CASE WHEN metrica='rebote_sesiones' THEN valor END)  AS rebote_sesiones
FROM metricas WHERE dim1='' AND dim2='' GROUP BY fecha;

DROP VIEW IF EXISTS v_paises;
CREATE VIEW v_paises AS
SELECT fecha, dim1 AS pais,
  MAX(CASE WHEN metrica='pais_sesiones' THEN valor END)        AS sesiones,
  MAX(CASE WHEN metrica='pais_vistas' THEN valor END)          AS vistas,
  MAX(CASE WHEN metrica='pais_tiempo_medio_s' THEN valor END)  AS tiempo_medio_s
FROM metricas WHERE metrica LIKE 'pais\\_%' ESCAPE '\\' GROUP BY fecha, dim1;

DROP VIEW IF EXISTS v_servicios;
CREATE VIEW v_servicios AS
SELECT m.fecha, m.dim1 AS servicio, COALESCE(s.nombre, m.dim1) AS nombre,
  MAX(CASE WHEN m.metrica='servicio_visitantes_clic' THEN m.valor END) AS visitantes_clic,
  MAX(CASE WHEN m.metrica='servicio_repro_clic' THEN m.valor END)      AS repro_por_clic,
  MAX(CASE WHEN m.metrica='servicio_repro_auto' THEN m.valor END)      AS repro_automaticas,
  MAX(CASE WHEN m.metrica='servicio_segundos_vistos' THEN m.valor END) AS segundos_vistos,
  MAX(CASE WHEN m.metrica='servicio_completados' THEN m.valor END)     AS completados,
  MAX(CASE WHEN m.metrica='servicio_cotizaciones' THEN m.valor END)    AS cotizaciones,
  MAX(CASE WHEN m.metrica='servicio_ver_mas' THEN m.valor END)         AS ver_mas
FROM metricas m LEFT JOIN servicios s ON s.id = m.dim1
WHERE m.metrica IN ('servicio_visitantes_clic','servicio_repro_clic','servicio_repro_auto','servicio_segundos_vistos','servicio_completados','servicio_cotizaciones','servicio_ver_mas')
GROUP BY m.fecha, m.dim1;

DROP VIEW IF EXISTS v_servicio_pais;
CREATE VIEW v_servicio_pais AS
SELECT fecha, dim1 AS servicio, dim2 AS pais, valor AS visitantes_clic
FROM metricas WHERE metrica='servicio_visitantes_clic_pais';

DROP VIEW IF EXISTS v_acciones;
CREATE VIEW v_acciones AS
SELECT a.fecha, a.dim1 AS accion, a.valor AS veces, p.dim2 AS pais, p.valor AS veces_pais
FROM metricas a LEFT JOIN metricas p
  ON p.fecha=a.fecha AND p.metrica='accion_pais' AND p.dim1=a.dim1
WHERE a.metrica='accion_veces';

DROP VIEW IF EXISTS v_horas;
CREATE VIEW v_horas AS
SELECT fecha, CAST(dim1 AS INTEGER) AS hora, valor AS vistas FROM metricas WHERE metrica='hora_vistas';
"""


def abrir(ruta_db):
    con = sqlite3.connect(ruta_db)
    con.executescript(ESQUEMA)
    con.executemany("INSERT OR REPLACE INTO servicios (id, nombre) VALUES (?, ?)", SERVICIOS)
    con.commit()
    return con


def filas_de_csv(texto):
    lector = csv.DictReader(io.StringIO(texto.lstrip("﻿")))
    esperadas = {"fecha", "metrica", "dim1", "dim2", "valor"}
    if not lector.fieldnames or not esperadas.issubset(set(lector.fieldnames)):
        raise ValueError("el CSV no tiene las columnas fecha,metrica,dim1,dim2,valor")
    for r in lector:
        dt.date.fromisoformat(r["fecha"])  # valida la fecha
        yield (r["fecha"], r["metrica"], r["dim1"] or "", r["dim2"] or "", float(r["valor"]))


def cargar(con, filas, origen):
    filas = list(filas)
    dias = sorted({f[0] for f in filas})
    with con:
        for d in dias:  # reemplaza el día completo: importar dos veces no duplica
            con.execute("DELETE FROM metricas WHERE fecha = ?", (d,))
        con.executemany("INSERT OR REPLACE INTO metricas (fecha, metrica, dim1, dim2, valor) VALUES (?,?,?,?,?)", filas)
        con.execute("INSERT INTO importaciones VALUES (?,?,?,?)",
                    (dt.datetime.now().isoformat(timespec="seconds"), origen, len(dias), len(filas)))
    return len(dias), len(filas)


def desde_carpeta(con, carpeta):
    archivos = sorted(glob.glob(os.path.join(carpeta, "*.csv")))
    if not archivos:
        print(f"No hay archivos .csv en {carpeta}")
        return
    for a in archivos:
        try:
            with open(a, encoding="utf-8-sig", newline="") as f:
                d, n = cargar(con, filas_de_csv(f.read()), os.path.basename(a))
            print(f"OK  {os.path.basename(a)}: {d} día(s), {n} filas")
        except Exception as e:  # un archivo malo no frena a los demás
            print(f"ERROR {os.path.basename(a)}: {e}", file=sys.stderr)


def descargar(con, base_url, clave, desde, hasta):
    q = {}
    if desde:
        q["from"] = desde
    if hasta:
        q["to"] = hasta
    url = base_url.rstrip("/") + "/api/export" + ("?" + urllib.parse.urlencode(q) if q else "")
    req = urllib.request.Request(url, headers={"x-report-key": clave, "User-Agent": "h3l-importador/1"})
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            texto = r.read().decode("utf-8")
    except urllib.error.HTTPError as e:
        sys.exit(f"El sitio respondió {e.code}. 401 = clave incorrecta; 404 = el secreto REPORT_KEY no está definido en el Worker.")
    d, n = cargar(con, filas_de_csv(texto), url)
    print(f"OK  descargado: {d} día(s), {n} filas")


def resumen(con):
    cur = con.execute("SELECT COUNT(DISTINCT fecha), MIN(fecha), MAX(fecha) FROM metricas")
    n, a, b = cur.fetchone()
    if not n:
        print("La base está vacía. Importá primero con --csv o --descargar.")
        return
    print(f"Base: {n} día(s), del {a} al {b}\n")
    print("ÚLTIMOS 14 DÍAS")
    print(f"{'fecha':<11}{'vistas':>8}{'visitantes':>12}{'sesiones':>10}{'tiempo medio':>14}")
    for f, v, vi, s, t in con.execute("SELECT fecha, vistas, visitantes, sesiones, tiempo_medio_s FROM v_diario ORDER BY fecha DESC LIMIT 14"):
        print(f"{f:<11}{int(v or 0):>8}{int(vi or 0):>12}{int(s or 0):>10}{int(t or 0):>11} s")
    print("\nSERVICIOS (últimos 30 días del período)")
    q = """SELECT nombre, SUM(visitantes_clic), SUM(repro_por_clic), SUM(repro_automaticas), SUM(segundos_vistos), SUM(cotizaciones)
           FROM v_servicios WHERE fecha > date((SELECT MAX(fecha) FROM metricas), '-30 day')
           GROUP BY servicio ORDER BY SUM(visitantes_clic) DESC"""
    print(f"{'servicio':<58}{'clic':>6}{'repro':>7}{'auto':>6}{'seg':>7}{'cotiz':>7}")
    for r in con.execute(q):
        print(f"{r[0][:56]:<58}{int(r[1] or 0):>6}{int(r[2] or 0):>7}{int(r[3] or 0):>6}{int(r[4] or 0):>7}{int(r[5] or 0):>7}")
    print("\nPAÍSES (últimos 30 días del período)")
    q = """SELECT pais, SUM(sesiones), SUM(vistas) FROM v_paises
           WHERE fecha > date((SELECT MAX(fecha) FROM metricas), '-30 day') GROUP BY pais ORDER BY SUM(sesiones) DESC LIMIT 10"""
    for p, s, v in con.execute(q):
        print(f"  {p:<4}{int(s or 0):>6} sesiones{int(v or 0):>8} vistas")


def main():
    ap = argparse.ArgumentParser(description="Base local de seguimiento del sitio de H3L (SQLite).")
    ap.add_argument("--db", default="h3l_metricas.sqlite", help="archivo de la base (por defecto h3l_metricas.sqlite)")
    ap.add_argument("--csv", metavar="CARPETA", help="importa todos los .csv de esta carpeta")
    ap.add_argument("--descargar", action="store_true", help="baja el historial directo del sitio (requiere H3L_CLAVE)")
    ap.add_argument("--sitio", default="https://www.h3lglobalenergy.com", help="URL base para --descargar")
    ap.add_argument("--desde", help="AAAA-MM-DD (con --descargar)")
    ap.add_argument("--hasta", help="AAAA-MM-DD (con --descargar)")
    ap.add_argument("--resumen", action="store_true", help="muestra un resumen de lo guardado")
    a = ap.parse_args()
    if not (a.csv or a.descargar or a.resumen):
        ap.print_help()
        return
    con = abrir(a.db)
    if a.csv:
        desde_carpeta(con, a.csv)
    if a.descargar:
        clave = os.environ.get("H3L_CLAVE", "")
        if not clave:
            sys.exit("Falta la variable de entorno H3L_CLAVE (la clave REPORT_KEY del Worker).")
        descargar(con, a.sitio, clave, a.desde, a.hasta)
    if a.resumen:
        resumen(con)
    con.close()


if __name__ == "__main__":
    main()

"""
MÉTRICAS (columna `metrica`; fecha = día en hora de Argentina)

  Resumen del día (dim1 y dim2 vacías):
    vistas, visitantes, sesiones, tiempo_medio_s, tiempo_mediano_s, rebote_sesiones
  Por país (dim1 = código ISO, XX = desconocido):
    pais_sesiones, pais_vistas, pais_tiempo_medio_s
  Por servicio (dim1 = id del servicio):
    servicio_visitantes_clic, servicio_repro_clic, servicio_repro_auto, servicio_segundos_vistos,
    servicio_completados, servicio_cotizaciones, servicio_ver_mas
    servicio_visitantes_clic_pais (dim2 = país), servicio_visitantes_clic_idioma (dim2 = es/en/fr/pt),
    servicio_repro_auto_pais (dim2 = país)
  Acciones (dim1 = mailto, tel, linkedin, brochure, contact_send, chat_open, intro_skip, go:<sección>):
    accion_veces, accion_pais (dim2 = país)
  Audiencia y navegación:
    hora_vistas (dim1 = 0..23), idioma_sesiones, dispositivo_sesiones (movil/tablet/escritorio),
    origen_sesiones (dim1 = dominio o 'directo'), pagina_vistas (dim1 = ruta), seccion_vistas,
    tiempo_sesiones_rango (lt10, 10-30, 30-60, 60-180, gt180)

Cada cifra cuenta una vez por visita de página (no por clic repetido).
"""
