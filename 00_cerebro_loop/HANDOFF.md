# HANDOFF (Estado Actual)

## Última acción completada
Fundación del cerebro creada (PROTOCOL, HANDOFF, ROADMAP, TODO, USER_REQUESTS, CEMETERY) y juego Human Simulator implementado desde cero como app estática (index.html + styles.css + game.js).

## Estado del build/navegador
🟢 Verde / App estática sin build. Verificada con playwright-cli en desktop y mobile, consola limpia.

## Decisiones de diseño tomadas
- El juego es 100% estático (sin dependencias, sin build): se sirve con `start.sh` en el puerto 3002.
- Un turno = 1 año (2 años desde los 30, 3 años desde los 60) para mantener la partida ágil.
- Stats 0-100 (salud, mente, social, felicidad) + energía + dinero + carrera + amor.
- Contenido generado por datos (acciones y eventos) para facilitar ampliar sin tocar el motor.
- `type` no se usa como nombre de campo mutable; se usan `kind`/`id` para evitar colisiones.
- Sin dependencias externas ni CDN: funciona offline.

## PRÓXIMO PASO INMEDIATO
🚀 Ampliar el catálogo de eventos (bodas, hijos, mudanzas, crisis) y balancear economía a largo plazo.

## Contexto importante
- El usuario pidió priorizar compatibilidad mobile y estética cuidada.
- Verificar SIEMPRE consola del navegador antes de pushear (ver PROTOCOL.md).
- Los screenshots de control van en `screenshots/` (ignorado por git).
