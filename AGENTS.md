# LigaMob

## Quick Start
```bash
node server.js  # runs on http://localhost:3000
```

## Tech Stack
- Express.js server (ES modules)
- Vanilla JS/CSS/HTML frontend in `/public`
- Upstream API: `https://technology-10.com/api/v1`

## Key Files
- `server.js` - Express server, all API routes, upstream data normalization
- `public/app.js` - Main SPA logic, all views, overlays
- `public/style.css` - All CSS (single file, ~2000 lines)
- `public/index.html` - Main shell with overlay containers

## Running Tests
```bash
node test_app.cjs        # basic app test
node test_puppeteer.cjs # browser test (requires server running)
```

## Important Conventions
- Frontend uses template literals for HTML, not JSX
- API routes normalize upstream data before returning
- Overlay components are defined in index.html, rendered via app.js
- Date formatting uses `es-PA` locale
- Player photos: `https://dt6mt1pwzn2ao.cloudfront.net/images/players/{id}.jpg`
- Team logos: `https://dt6mt1pwzn2ao.cloudfront.net/images/teams/logos/{id}.png`

## Common Errors
- Quote mismatch in template literals (backticks vs single quotes)
- Server port 3000 already in use - kill existing process first

## Caveats
- No build step - edit directly in `/public`
- Upstream API may be slow or unavailable (no error handling beyond basic catch)