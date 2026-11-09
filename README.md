# Human_simulator

<!-- omgithub:readme:start -->
## 🚀 Build, play, and remix with OMGithub

**Remixed using [OMGithub.com](https://go.ondev.store/).**

[![OMGithub](https://img.shields.io/badge/OMGithub-Open%20project-orange?style=for-the-badge)](https://go.ondev.store/gamer-frog/Human_simulator)
[![GitHub](https://img.shields.io/badge/GitHub-Source-181717?logo=github&style=for-the-badge)](https://github.com/gamer-frog/Human_simulator)

- 🎮 [Open the project](https://go.ondev.store/gamer-frog/Human_simulator).
- ✨ [Remix this project](https://go.ondev.store/gamer-frog/Human_simulator?remix=1).
- 💻 [Explore the source](https://github.com/gamer-frog/Human_simulator).
- 🛠️ [Check build runs](https://github.com/gamer-frog/Human_simulator/actions).
- 🐛 [Report an issue](https://github.com/gamer-frog/Human_simulator/issues).
- 👤 [Explore the creator's projects](https://go.ondev.store/gamer-frog).
- 🌍 [Create with OMGithub](https://go.ondev.store/).
- 🧬 [Explore the remix source](https://github.com/gamer-frog/Human_simulator).
<!-- omgithub:readme:end -->

## 🧬 HUMAN.SIM — simulador de vida

Juego estático (sin build ni dependencias) en la raíz del repo:

- `index.html`, `styles.css`, `game-data.js`, `game-events.js`, `game.js`
- Se sirve con `python3 -m http.server 3002` y se abre en `http://localhost:3002`
- Elegí nombre y origen, tomá decisiones año a año y llegá a los 90 con tu legado.

## 🎛️ Conductor — Agent studio

Importado desde `gamer-frog/PlayGround` dentro de `conductor/`:

- App estática: `index.html`, `styles.css`, `app-*.js`
- Datos y coordinación: `orchestra/` (`state.json`, `seed.json`, `events/`, `coord.py`)
- Se sirve con `python3 -m http.server 3003 --directory conductor`
- Manifiesto de importación: `conductor/IMPORT_MANIFEST.md`

