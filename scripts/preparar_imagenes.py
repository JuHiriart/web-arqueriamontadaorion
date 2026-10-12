#!/usr/bin/env python3
"""
Prepara las fotos del inicio, la galería y eventos para publicar el sitio.

GitHub Actions lo ejecuta solo en cada publicación (ver .github/workflows/publicar.yml),
así que no hace falta correrlo a mano. Para cada carpeta de CARPETAS:

  - achica las fotos demasiado grandes (solo en la copia que se publica, el repo no cambia),
  - genera miniaturas livianas para las grillas y los carruseles,
  - escribe datos/<carpeta>.json con la lista de fotos que leen las páginas.

Las fotos se ordenan por nombre de archivo.
"""
import json
import re
from pathlib import Path

from PIL import Image, ImageOps

RAIZ = Path(__file__).resolve().parent.parent
CARPETAS = ["inicio", "galeria", "eventos"]
EXTENSIONES = {".jpg", ".jpeg", ".png", ".webp"}
LADO_MAXIMO = 2000
LADO_MINIATURA = 800


def orden_natural(nombre):
    return [int(t) if t.isdigit() else t.lower() for t in re.split(r"(\d+)", nombre)]


def ruta_web(ruta):
    return ruta.relative_to(RAIZ).as_posix()


def guardar_achicada(imagen, ruta):
    if ruta.suffix.lower() in {".jpg", ".jpeg"}:
        imagen.convert("RGB").save(ruta, "JPEG", quality=85, optimize=True, progressive=True)
    elif ruta.suffix.lower() == ".webp":
        imagen.save(ruta, "WEBP", quality=85)
    else:
        imagen.save(ruta, "PNG", optimize=True)


def preparar(carpeta):
    origen = RAIZ / "assets" / "img" / carpeta
    miniaturas = RAIZ / "assets" / "img" / "miniaturas" / carpeta
    miniaturas.mkdir(parents=True, exist_ok=True)

    fotos = sorted(
        (p for p in origen.iterdir() if p.is_file() and p.suffix.lower() in EXTENSIONES),
        key=lambda p: orden_natural(p.name),
    ) if origen.exists() else []

    lista = []
    for foto in fotos:
        with Image.open(foto) as original:
            imagen = ImageOps.exif_transpose(original)
            if max(imagen.size) > LADO_MAXIMO:
                imagen.thumbnail((LADO_MAXIMO, LADO_MAXIMO), Image.LANCZOS)
                guardar_achicada(imagen, foto)
            ancho, alto = imagen.size

            mini = imagen.convert("RGB")
            mini.thumbnail((LADO_MINIATURA, LADO_MINIATURA), Image.LANCZOS)
            destino = miniaturas / (foto.name + ".jpg")
            mini.save(destino, "JPEG", quality=80, optimize=True, progressive=True)

        lista.append({"src": ruta_web(foto), "mini": ruta_web(destino), "ancho": ancho, "alto": alto})

    salida = RAIZ / "datos" / f"{carpeta}.json"
    salida.parent.mkdir(exist_ok=True)
    salida.write_text(json.dumps(lista, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"{carpeta}: {len(lista)} fotos")


if __name__ == "__main__":
    for carpeta in CARPETAS:
        preparar(carpeta)
