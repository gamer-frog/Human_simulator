# Manifiesto de importación — Conductor / Agent studio

**Fecha:** 2026-11-09
**Repo destino:** `gamer-frog/Human_simulator` (checkout de trabajo `opencode/42555119990`)
**Ubicación:** `conductor/` (subcarpeta, porque la raíz ya tiene el juego HUMAN.SIM)
**Repo origen:** `https://github.com/gamer-frog/PlayGround` (sólo lectura; no se modificó)
**Branch canónica:** `origen/agentes-ia-estudio-plan` @ `bad4938`
**Checkpoint más nuevo revisado:** `origen/opencode-checkpoints/24` @ `95a0a3c`

## 1. Manifiesto de archivos copiados

```
conductor/
├── index.html
├── styles.css
├── app-actions.js
├── app-agents.js
├── app-command.js
├── app-core.js
├── app-home.js
├── app-missions.js
├── app-plan.js
├── app-world.js
├── ORCHESTRATION.md
├── README.md
├── Agents.md
├── SEPARACION.md
├── 00_cerebro_loop/
│   ├── PROTOCOL.md
│   ├── HANDOFF.md
│   ├── ROADMAP.md
│   ├── TODO.md
│   ├── USER_REQUESTS.md
│   └── CEMETERY.md
├── docs/
│   └── COMPETITIVE_ANALYSIS.md
├── orchestra/
│   ├── state.json
│   ├── seed.json
│   ├── coord.py
│   ├── test_coord.py
│   ├── AGENT_ONBOARDING.md
│   └── events/
│       ├── .gitkeep
│       ├── acd2ebb3ee924bd599ad6934c9c71397.json
│       └── b491755e1c614659a4d8be17e01beb6f.json
├── .github/
│   └── ISSUE_TEMPLATE/
│       └── agent-mission.yml
├── checkpoints/
│   └── 21/   (respaldo histórico del checkpoint 21, no lo sirve la app)
└── IMPORT_MANIFEST.md
```

## 2. Branches del origen revisadas

| Branch | Commit | Relación con la consolidada | Datos únicos rescatados |
| --- | --- | --- | --- |
| `agentes-ia-estudio-plan` | `bad4938` | Canónica (elegida) | App, orchestra, docs, plan |
| `opencode-checkpoints/4` | `fa7ed63` | Anterior; la consolidada es superconjunto | Ninguno (la consolidada agrega más archivos/líneas) |
| `opencode-checkpoints/9` | `bcb640f` | Mismo Conductor; sólo difieren `.omgithub` y el plan | Ninguno funcional |
| `opencode-checkpoints/19` | `500a682` | Mismo Conductor; sólo difieren `.omgithub` y el plan | Ninguno funcional |
| `opencode-checkpoints/21` | `e86916b` | Versión previa con datos mock y UI distinta | **Sí**: 44 agentes mock en seed/state, app-*.js y styles.css previos. Archivado completo en `conductor/checkpoints/21/` |
| `opencode-checkpoints/24` | `95a0a3c` | Base más nueva de la consolidada | Ninguno funcional (la consolidada ya lo incluye) |

Comando usado para comparar:

```sh
git diff --stat origen/agentes-ia-estudio-plan..origen/opencode-checkpoints/<N> -- orchestra docs ORCHESTRATION.md
git diff --stat origen/agentes-ia-estudio-plan..origen/opencode-checkpoints/<N>
```

## 3. Verificación en navegador

- Servidor: `python3 -m http.server 3003 --bind 127.0.0.1 --directory conductor`
- URL: `http://localhost:3003`
- Título: **`Conductor — Agent studio`**
- Navegación verificada por clic real: **Hoy · El estudio · Misiones · Agentes · Plan**
- `orchestra/state.json`: **HTTP 200** (`curl -o /dev/null -w '%{http_code}'` → `200`)
- Consola: **0 errores, 0 warnings**. Hay 1 mensaje `[VERBOSE]` de Chrome sobre
  formularios anidados; el prompt indica que los `[VERBOSE]` no cuentan.
- Captura: `screenshots/conductor.jpg` (viewport 1280×900)
- Dato del snapshot (no bloqueante): la barra lateral muestra “Sin repositorios”
  y una tarjeta de loops muestra `undefined activos`. La app carga y navega bien;
  es un desajuste entre el `state.json` del snapshot y lo que espera la UI.
  Se documenta tal cual, sin inventar datos.

## 4. Archivos del origen deliberadamente NO copiados

| Archivo | Motivo |
| --- | --- |
| `.omgithub/conversation.json` (62 MB) | Log de sesión, no es dato funcional de la app |
| `.omgithub/checkpoint.json` | Metadata de checkpoint/sesión |
| `game.js`, `index.html` del juego, `styles.css` del juego, `assets/ao/`, `scripts/extract_ao_assets.py` | El juego no forma parte de Conductor. Además la branch consolidada ya no los contiene |
| `capture.sh`, `start.sh`, `startup.sh` | Scripts genéricos del harness; el destino ya tiene los suyos |
| `.gitignore` | El destino ya tiene el suyo y no se debe sobreescribir |

## 5. Checklist de completitud

- [x] `app-*.js` (8 módulos)
- [x] `index.html` + `styles.css`
- [x] `orchestra/` (state, seed, events, coord.py, test_coord.py, onboarding)
- [x] `docs/` + `ORCHESTRATION.md`
- [x] `Agents.md` + `README.md` dentro de `conductor/`
- [x] `00_cerebro_loop/` (plan completo)
- [x] Ningún dato único de los checkpoints 4/9/19/21/24 quedó afuera
      (checkpoint 21 archivado en `conductor/checkpoints/21/`)

## 6. Confirmación

**El repo origen no fue modificado.** Sólo se usaron `git remote add`, `git fetch`,
`git archive`, `git show` y `git diff` sobre las refs `origen/*`.

## 7. Cómo correrlo

```sh
# Desde la raíz del repo destino
python3 -m http.server 3003 --bind 127.0.0.1 --directory conductor
# Abrir http://localhost:3003
```

También funciona servido desde la raíz del repo como `http://localhost:3003/conductor/`,
porque todas las rutas de la app son relativas.
