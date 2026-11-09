# Checkpoint 21 — archivo histórico

Esta carpeta es una **copia de referencia** del checkpoint `opencode-checkpoints/21`
del repo `gamer-frog/PlayGround` (commit `e86916b`, 2026-11-07).

No la sirve la app principal. Se guarda porque ese checkpoint contiene datos que
no están en la branch consolidada `agentes-ia-estudio-plan`:

- `orchestra/seed.json` y `orchestra/state.json` con **44 agentes** (incluye 40
  agentes `mock-*` de demostración), frente a los 8 agentes curados de la versión
  consolidada.
- Una versión previa de los módulos `app-*.js` y `styles.css` con diferencias de
  UI (Trello / acciones) que la branch consolidada ya no incluye.

La versión canónica que usa la app es la de `../..` (importada desde
`agentes-ia-estudio-plan` @ `bad4938`). Los archivos de esta carpeta son solo un
respaldo para no perder el trabajo único del checkpoint antes de borrar las ramas
viejas del origen.

Si necesitás inspeccionarlo, serví esta carpeta por separado:

```sh
cd conductor/checkpoints/21
python3 -m http.server 3004 --bind 127.0.0.1
```
