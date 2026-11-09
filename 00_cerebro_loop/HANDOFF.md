# HANDOFF (Estado Actual)

## Última acción completada
Juego **HUMAN.SIM** implementado y verificado, y proyecto **Conductor / Agent studio**
importado desde `gamer-frog/PlayGround` dentro de `conductor/`, con manifiesto de
borrado seguro en `conductor/IMPORT_MANIFEST.md`.

## Estado del build/navegador
🟢 Verde / Ambas apps son estáticas, sin build ni dependencias.
- Juego en `http://localhost:3002` (raíz del repo): partida completa automatizada
  (95 pasos, 46 eventos) hasta los 90 años, 0 errores de consola, sin overflow mobile.
- Conductor en `http://localhost:3003` (`--directory conductor`): título correcto,
  5 vistas navegadas, `orchestra/state.json` HTTP 200, 0 errores de consola.

## Commits y referencias
- `cd35dd1` — feat(game): HUMAN.SIM completo y jugable.
- `117b523` — feat(conductor): importación de Conductor + orchestra + plan.
- Tag del hito del juego: `humansim-save-001` (el nombre `save-001` ya existía en
  los tags traídos del repo origen, no se sobreescribió).
- Branch de revisión de la importación: `conductor/import`.
- `origin/main` actualizado hasta `117b523` (fast-forward, sin force).

## Decisiones de diseño tomadas
- El juego es 100% estático (sin dependencias, sin build): se sirve con `start.sh` en el puerto 3002.
- Un turno = 1 año (2 años desde los 30, 3 años desde los 60) para mantener la partida ágil.
- Stats 0-100 (salud, mente, social, felicidad) + energía + dinero + carrera + amor.
- Contenido generado por datos (acciones y eventos) para facilitar ampliar sin tocar el motor.
- `type` no se usa como nombre de campo mutable; se usan `kind`/`id` para evitar colisiones.
- Sin dependencias externas ni CDN: funciona offline.
- Conductor vive en `conductor/` porque la raíz ya hospeda el juego; la app usa rutas
  relativas, así que se sirve como raíz web propia en 3003.
- Deliverable extra: `conductor/checkpoints/21/` conserva los datos únicos del
  checkpoint 21 (44 agentes mock y UI previa) que no están en la branch consolidada.

## PRÓXIMO PASO INMEDIATO
1. Revisar `conductor/import` y, si está OK, mantener `main` como fuente única.
2. Actualizar el `README.md` de la raíz para describir el juego y `conductor/`.
3. Ampliar el catálogo de eventos del juego y balancear la economía a largo plazo.

## Contexto importante
- El usuario pidió priorizar compatibilidad mobile y estética cuidada.
- Verificar SIEMPRE consola del navegador antes de pushear (ver PROTOCOL.md).
- Los screenshots de control van en `screenshots/` (ignorado por git).
- El repo origen `PlayGround` es sólo lectura: no se modificó, borró ni pusheó nada allí.
