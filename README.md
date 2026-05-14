# LigaMob

FotMob parody for Liga+ and Liga10 — Panamanian school/youth football.

## Structure

```
.
├── public/             # Frontend (vanilla SPA)
│   ├── index.html      # Main shell with overlays
│   ├── css/
│   │   └── style.css   # All styles
│   ├── js/
│   │   ├── app.js      # SPA logic, views, overlays
│   │   ├── game.js     # Standalone match detail
│   │   ├── player.js   # Standalone player detail
│   │   └── team.js     # Standalone team detail
│   └── pages/
│       ├── game.html   # Standalone match page
│       ├── player.html # Standalone player page
│       └── team.html   # Standalone team page
├── server.js           # Express server + API proxy
├── scripts/            # Test / utility scripts
├── docs/
│   ├── AGENTS.md       # Agent instructions
│   └── archive/        # Design docs, API recon, reference
│       ├── LIGAMOB_DESIGN.md
│       ├── liga-10-api-recon.md
│       ├── liga-plus-api-recon.md
│       └── snippets/
├── eslint.config.js    # ESLint config (flat)
├── .prettierrc         # Prettier config
└── .github/workflows/  # CI pipelines
```

## Quick Start

```bash
npm start  # runs on http://localhost:3000
```

## Branches

- `main` — stable, deployable
- `develop` — active work
- feature branches off `develop`

## CI

Pushes/PRs to `main` and `develop` trigger automated checks via GitHub Actions.
