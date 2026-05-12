# LigaMob

FotMob parody for Liga+ and Liga10 — Panamanian school/youth football.

## Structure

```
.
├── public/             # Frontend (vanilla SPA)
│   ├── index.html      # Main shell with overlays
│   ├── app.js          # SPA logic, views, overlays
│   ├── style.css       # All styles
│   ├── game.html/js    # Standalone match detail
│   ├── player.html/js  # Standalone player detail
│   └── team.html/js    # Standalone team detail
├── server.js           # Express server + API proxy
├── scripts/            # Test / utility scripts
├── docs/               # Design docs, API recon, notes
│   ├── LIGAMOB_DESIGN.md
│   ├── AGENTS.md
│   ├── liga-10-api-recon.md
│   ├── liga-plus-api-recon.md
│   └── snippets/       # HTML/CSS reference snippets
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
