# Liga-10.com — API Reverse Engineering Report
*Date: 2026-05-10*

---

## Site Architecture

| Property | Detail |
|----------|--------|
| Frontend Framework | Angular SPA (Ivy, Angular CLI, hashed bundles) |
| Frontend Hosting | Cloudflare CDN (`172.67.134.76`, `104.21.25.142`) |
| Frontend WAF | Cloudflare bot management — blocks automated crawlers (403) |
| Backend API Domain | `https://technology-10.com` (separate, no Cloudflare, fully open) |
| Image / Asset CDN | AWS CloudFront: `https://dt6mt1pwzn2ao.cloudfront.net/` |
| JS Main Bundle | `main.43d8d7fb6080dd81.js` (~15MB minified Angular bundle) |
| Auth System | JWT-based — `/api/v1/auth/...` prefix |
| Platform | Multi-tenant — 8 league sites on the same API |

**Multi-tenant site IDs:**

| siteId | Site |
|--------|------|
| `liga10` | liga-10.com (U16/U18 Panama) |
| `ligajr` | liga-jr.com (U12/U14) |
| `ptycityfc` | panamacityfc.com |
| `ligaplus` | liga-plus.com |
| `ligaw` | liga-w.com (women's) |
| `ligau` | liga-u.com |
| `liga123` | 123liga.com |
| `testsite` | grupo-10.com |

---

## Discovered Endpoints

**Base URL:** `https://technology-10.com/api/v1`
**Auth:** None required for all GET public endpoints
**CORS:** Fully open (`Access-Control-Allow-Origin: *`) — callable directly from any browser

### Platform / Sites

| Method | Endpoint | Returns |
|--------|----------|---------|
| GET | `/api/v1/sites` | All league sites: `id, name, url, twitterAccount, instagramAccount, analyticsId` |
| GET | `/api/v1/sites/{siteId}` | Full site object |
| GET | `/api/v1/sites/settings` | Feature flags per site: `enableFantasy, fantasyTransfersPerMatchday, displayPositionsTable` |
| GET | `/api/v1/sites/{siteId}/feature-toggles` | `ENABLE_PHOTO_BY_CATEGORY_FILTER, ENABLE_PLAYOFF_BRACKET, ENABLE_RULES, STATISTICS_MINUTE_BY_MINUTE, FANTASY` |
| GET | `/api/v1/sites/{siteId}/associates` | Sponsor/partner logos per site |
| GET | `/api/v1/associates` | All sponsors globally: `id, name` |

### Tournaments

| Method | Endpoint | Returns |
|--------|----------|---------|
| GET | `/api/v1/sites/{siteId}/tournaments` | All tournaments: `id, tournamentName, startDate` |
| GET | `/api/v1/sites/{siteId}/tournaments/default` | Active/current tournament (full object + category + site) |
| GET | `/api/v1/sites/{siteId}/parent-tournaments` | Parent categories: `id, tournamentName` |
| GET | `/api/v1/sites/{siteId}/tournaments/{tournamentId}/matchdays` | Matchdays: `id, name, isPlayoff, gamesDates[], matchdayOrder` |
| GET | `/api/v1/sites/{siteId}/tournaments/{tournamentId}/photo-albums` | Album list for tournament |
| GET | `/api/v1/matchdays` | All matchday reference types |

**Current active tournament for liga10:** `tournamentId = 1000293` (Liga10 U18 2026)

### Standings

| Method | Endpoint | Returns |
|--------|----------|---------|
| GET | `/api/v1/sites/{siteId}/tournaments/{tournamentId}/positions-table` | Standings by group: `position, points, gamesWon, gamesLost, gamesDraw, goalsInFavor, goalsAgainst` |
| GET | `/api/v1/sites/{siteId}/positions-table` | All-time standings across all tournaments |

### Teams

| Method | Endpoint | Returns |
|--------|----------|---------|
| GET | `/api/v1/sites/{siteId}/teams` | All teams: `id, name, longName, alternateName, primaryColor, secondaryColor, instagram, location, webpageUrl` |
| GET | `/api/v1/sites/{siteId}/teams/{teamId}/tournaments` | Team's tournament history |
| GET | `/api/v1/sites/{siteId}/teams/{teamId}/tournaments/years` | Year list for team |
| GET | `/api/v1/sites/{siteId}/teams/{teamId}/videos` | Team-specific YouTube videos |
| GET | `/api/v1/sites/{siteId}/tournaments/teams/{teamId}` | Team info within a tournament |

### Players

| Method | Endpoint | Returns |
|--------|----------|---------|
| GET | `/api/v1/sites/{siteId}/players` | Player leaderboard: `id, firstName, lastName, goals, assists, yellowCards, redCards, points, gamesPlayed, cleanSheets, positionName` |
| GET | `/api/v1/sites/{siteId}/players/positions` | Position type reference |
| GET | `/api/v1/players/{playerId}` | Full profile: `idPlayer, firstName, lastName, dateOfBirth, countryOfBirth, positionName, jerseyNumber, mainTeamName, combinedTeamName` |
| GET | `/api/v1/players` | Global player list (all sites) |
| GET | `/api/v1/players/positions` | All positions |
| GET | `/api/v1/players/preferred-feet` | Foot preference options |
| GET | `/api/v1/players/statistics/sort/criteria` | Sort criteria for stat tables |
| GET | `/api/v1/players/statistics/types` | Stat type reference |
| GET | `/api/v1/sites/{siteId}/players/{playerId}/statistics/all-leagues` | Player stats per matchday + tournament |
| GET | `/api/v1/sites/{siteId}/players/{playerId}/awards` | Player of the week awards: `matchdayName, tournamentName, categoryName` |
| GET | `/api/v1/sites/{siteId}/players/{playerId}/games/records` | Win/loss/tie record |
| GET | `/api/v1/sites/{siteId}/players/statistics/{tournamentId}/aggregate` | Aggregated stats for all players in a tournament |
| GET | `/api/v1/sites/{siteId}/tournaments/players/{playerId}/statistics` | Player stats across all tournaments |
| GET | `/api/v1/sites/{siteId}/search/players?q={query}` | ⚠️ **PII leak** — returns `email, dateOfBirth, validated, nickname` with no auth |

### Games / Fixtures / Results

| Method | Endpoint | Returns |
|--------|----------|---------|
| GET | `/api/v1/games/all` | **All 4,686 games** (back to 2013) — wrapped: `{elements: [...], count: N}`. Fields: `id, date, teamOne, teamTwo, goalsTeamOne, goalsTeamTwo, status, matchday, tournament, video, news, stadium, attendance, broadcaster` |
| GET | `/api/v1/games/{gameId}` | Single game full object |
| GET | `/api/v1/games/{gameId}/lineups` | Lineups (returns `[]` if not set). Fields: `playerId, teamId, firstName, lastName, jerseyNumber, positionName, participation: {id, name}` (id=1 = starter) |
| GET | `/api/v1/games/{gameId}/statistics` | Game-level stats |
| GET | `/api/v1/games/{gameId}/players/statistics` | Per-player stats. Fields: `id` (stat record ID ≠ playerId), `firstName, lastName, jerseyNumber, goals, assists, yellowCards, redCards, points, gamesPlayed, cleanSheets, captain` |
| GET | `/api/v1/games/{gameId}/teams/staff` | Staff for both teams |
| GET | `/api/v1/games/{gameId}/teams/staff/statistics` | Staff stats |
| GET | `/api/v1/games/{gameId}/members/suspensions` | Suspension info |
| GET | `/api/v1/games/{gameId}/players/absences` | Absence/injury info |
| GET | `/api/v1/games/status` | Status codes: `0=Por Jugar, 1=Final, 2=En Vivo, 3=Pospuesto, 4/5/6=special finals` |
| GET | `/api/v1/sites/{siteId}/games/to-be-played` | Upcoming games for a site |
| GET | `/api/v1/sites/{siteId}/games/tickets` | Ticket purchase links |
| GET | `/api/v1/sites/{siteId}/games/years` | Years with games |
| GET | `/api/v1/sites/{siteId}/games/{gameId}/photo-albums` | Photo albums per game |

**Upcoming liga10 fixtures (tournamentId 1000293):**
| Round | Date |
|-------|------|
| Cuartos de Final | 2026-05-30 |
| Semifinales | 2026-06-06 |
| Tercer Lugar | 2026-06-14 |
| Final | 2026-06-14 |

### News

| Method | Endpoint | Returns |
|--------|----------|---------|
| GET | `/api/v1/sites/{siteId}/news` | Articles: `id, imageId, title, date, content (HTML)` |
| GET | `/api/v1/sites/{siteId}/news/latest` | Single latest article |
| GET | `/api/v1/sites/{siteId}/news/years` | Available year filters |
| GET | `/api/v1/news/{newsId}` | Full article with HTML content |
| GET | `/api/v1/sites/{siteId}/search/news` | News search |

### Media — Videos & Photos

| Method | Endpoint | Returns |
|--------|----------|---------|
| GET | `/api/v1/sites/{siteId}/videos` | YouTube videos: `id (ytId), title, typeName, typeId` |
| GET | `/api/v1/sites/{siteId}/videos/years` | Years filter |
| GET | `/api/v1/sites/photo-albums` | All albums across all sites |
| GET | `/api/v1/sites/{siteId}/photo-albums/{albumId}` | Album with photo filename list |

### Fantasy

| Method | Endpoint | Returns |
|--------|----------|---------|
| GET | `/api/v1/fantasy/rules` | Scoring rules by position and action |
| GET | `/api/v1/fantasy/sites/tournaments/{tournamentId}/players/trending` | Trending: `playerId, firstName, lastName, userCount, pickPercentage` |
| GET | `/api/v1/fantasy/sites/{siteId}/statistics` | Fantasy site stats |
| GET | `/api/v1/fantasy/tournaments/{tournamentId}/players/leaders` | Top fantasy players |
| GET | `/api/v1/fantasy/tournaments/{tournamentId}/users/leaders` | Fantasy leaderboard |

### Registration / Admin (informational)

| Method | Endpoint | Notes |
|--------|----------|-------|
| GET | `/api/v1/registration/files/types` | Document type list (Cédula, Pasaporte, etc.) — no auth needed |

### Auth Endpoints

| Method | Endpoint | Notes |
|--------|----------|-------|
| POST | `/api/v1/auth/accounts/login` | Returns JWT |
| POST | `/api/v1/auth/users/accounts` | Register |
| POST | `/api/v1/auth/accounts/tokens/validate` | Validate JWT |
| PUT | `/api/v1/auth/users/{userId}/accounts/password` | Change password |

### Private / Admin (401 without token)

All under `/api/v1/private/` — requires auth:
- `/private/accounts/admin` — admin user list
- `/private/alerts` — system alerts
- `/private/sites` — site management
- `/private/emails/bodies` — email templates
- `/private/entitlements` — entitlements (returns empty even unauthenticated)
- `/private/files/reupload` — CDN file reupload
- `/private/images/file-uploads` — image upload

---

## Player Image URL Patterns

CDN Base: `https://dt6mt1pwzn2ao.cloudfront.net/images/`

```
# Player photo (standard)
https://dt6mt1pwzn2ao.cloudfront.net/images/players/{playerId}.jpg

# Player photo — Panama City FC only (different subfolder)
https://dt6mt1pwzn2ao.cloudfront.net/images/players/ptycityfc/{playerId}.jpg

# Player fallback
https://dt6mt1pwzn2ao.cloudfront.net/images/players/default.jpg

# Team logo
https://dt6mt1pwzn2ao.cloudfront.net/images/teams/logos/{teamId}.png

# Site logo
https://dt6mt1pwzn2ao.cloudfront.net/images/logos/{siteId}/logo.png

# News article image
https://dt6mt1pwzn2ao.cloudfront.net/images/news/{imageId}.jpg

# Staff photo
https://dt6mt1pwzn2ao.cloudfront.net/images/staff/{staffId}.jpg

# Photo album — game
https://dt6mt1pwzn2ao.cloudfront.net/images/photos/games/{matchId}/{filename}

# Photo album — site-level
https://dt6mt1pwzn2ao.cloudfront.net/images/photos/sites/{siteId}/{filename}

# Fantasy team logos
https://dt6mt1pwzn2ao.cloudfront.net/images/assets/fantasy/teams-logos/{id}.png

# Broadcaster logos
https://dt6mt1pwzn2ao.cloudfront.net/images/broadcasters/{id}.png

# Sponsor/associate logos
https://dt6mt1pwzn2ao.cloudfront.net/images/associates/{id}.png

# Rules PDF
https://dt6mt1pwzn2ao.cloudfront.net/rules/{siteId}/rules.pdf
```

All CDN paths are publicly accessible — no auth, no signed URLs.

**JS source logic (extracted from bundle):**
```javascript
const oi = "https://dt6mt1pwzn2ao.cloudfront.net/";
playerImage: (playerId, siteId) =>
  "default" !== playerId && "ptycityfc" === siteId
    ? `${oi}images/players/${siteId}/${playerId || "default"}.jpg`
    : `${oi}images/players/${playerId || "default"}.jpg`
```

---

## Upcoming Games — Best Endpoint

```
GET https://technology-10.com/api/v1/sites/liga10/games/to-be-played
GET https://technology-10.com/api/v1/sites/liga10/tournaments/1000293/matchdays
GET https://technology-10.com/api/v1/games/all  (filter by status=0 "Por Jugar")
```

Game status codes:
- `0` = Por Jugar (upcoming)
- `1` = Final (completed)
- `2` = En Vivo (live)
- `3` = Pospuesto (postponed)
- `4/5/6` = special final states

---

## Data Shape Gotchas (Confirmed)

### `/games/all` — Wrapped Response
Returns `{elements: [], count: N}`, NOT a plain array. Always access `raw.elements`.

### Game `status` — Object, Not Number
```json
{ "id": 1, "name": "Final", "gameStatus": "Finalizado", "shouldAddGoals": true, "finalized": true }
```
Access via `status?.id ?? status`. Codes: `0=upcoming, 1=final, 2=live, 3=postponed, 4/5/6=special finals`.

### `/tournaments/default` — Returns Array
Returns `[{tournamentId, tournamentName, ...}]` — an array with one element, using `tournamentId` (not `id`). Must unwrap.

### `playerStatistics` `id` Field ≠ `playerId`
In `/games/{id}/players/statistics`, the `id` field is a **stat-record ID** (e.g., 5977), NOT the player's ID (e.g., 8535). To match stats to lineup players, use `(firstName+lastName).toLowerCase()` as the lookup key.

### No Minute-Level Events
There is NO timeline/events API. All "goal at 45'" style data does not exist. Stats are cumulative totals per game only.

### No Possession/Shots Aggregates
Game-level stats (`/statistics`) does not expose possession %, shots on target, corners, etc. Only per-player counting stats are available.

---

## Fantasy Scoring Rules (from `/api/v1/fantasy/rules`)

| Action | Points |
|--------|--------|
| Goal scored | +6 |
| Assist | +3 |
| Clean sheet (GK/DEF) | +3 |
| Game played | +1 |
| Yellow card | −1 |
| Red card | −3 |
| Own goal | −2 |

These same `points` values appear in `/games/{id}/players/statistics` — usable as a proxy **performance rating** by mapping to a 5.0–9.9 scale: `rating = clamp(pts * 0.55 + 4.45, 5.0, 9.9)`.

---

## Hidden / Interesting Data

### ⚠️ PII Exposed Without Auth
`GET /api/v1/sites/{siteId}/search/players?q={term}` returns:
- Player `email`
- `dateOfBirth`
- `validated` status
- `nickname`

No authentication required. Any string query works.

### All 4,686 Historical Games in One Call
`GET /api/v1/games/all` — no pagination, returns entire dataset going back to 2013. Includes scores, team IDs, matchday, tournament, video/news links, stadium, attendance, broadcaster.

### Cross-Site Data Leakage
The unauthenticated API has no site-based access control. A request for `siteId=ligaw` returns all data for the women's league — from any context.

### Fantasy User Exposure
Fantasy endpoints expose pick percentages, user counts, and likely usernames in leaderboard endpoints — all unauthenticated.

### Registration Document Infrastructure
`/api/v1/registration/files/types` confirms the platform stores national ID documents (Cédula front/back, passport) for players. Upload endpoints exist but require auth.

### Test Data in Production API
`testsite` ("La Champions") has games referencing Barcelona, PSG, Real Madrid with placeholder UUIDs (e.g., `aaaaaaaa-0002-0002-0002-000000000002`). Live in the same production database.

### Angular Config Object (Extracted from Bundle)
```javascript
// Env config (module 67376)
{ endpoints: { api: "https://technology-10.com" }, site: "" }
```

---

## Login Gate Assessment

**Login is NOT needed for:**
- All player data, stats, profiles, images
- All team data, logos, rosters
- All game data — past, upcoming, live
- All standings / posiciones
- All news, photos, videos
- Player search (including PII — email, DOB)
- Fantasy rules, leaderboards, trending picks

**Login required for:**
- Fantasy team management (selecting your own team)
- Admin panel (`/private/*`)
- Write operations (creating games, uploading files, etc.)

**Verdict:** The entire read API is wide open. Login unlocks only fantasy team management and admin functions.

---

## Angular Route Map

From bundle extraction:
```
/jugadores           Players leaderboard
/equipos             Teams list
/posiciones          Standings table
/partidos            Games/results
/fotos               Photo albums
/noticias            News
/videos              Videos
/jugador/{id}        Player profile
/players/{id}        (alias)
/staff/{id}          Staff profile
/fantasy/home
/fantasy/mi-equipo
/fantasy/mis-ligas
/fantasy/torneos
/accounts/login
/accounts/sign-up
/accounts/profile
/boletos             Tickets
/store               Store
/store/carro-compras Shopping cart
/reglamento          Rules PDF
```

---

## Caveats

| Issue | Detail |
|-------|--------|
| **Anti-bot on frontend** | Cloudflare blocks automated requests to `liga-10.com` HTML pages (403). JS static assets still served. |
| **robots.txt disallows** | `/admin`, `/registro`, `/cgi-bin`. Explicitly lists: ClaudeBot, GPTBot, CCBot, Google-Extended, Bytespider |
| **API has zero protection** | `technology-10.com` has no WAF, no rate limiting, open CORS (`*`) |
| **No rate limiting detected** | All probed endpoints responded instantly with no 429s |
| **SSL** | `technology-10.com` cert via Google Trust Services, valid through July 2026 |
| **HTTP 500** | `/api/v1/news/core` and `/api/v1/news/core/summary` returned 500 errors |
| **CDN** | All CloudFront asset URLs are public — no signed URLs or expiry |

---

## Quick Reference — Key Calls for liga10

```bash
# Active tournament
curl https://technology-10.com/api/v1/sites/liga10/tournaments/default

# Standings
curl https://technology-10.com/api/v1/sites/liga10/tournaments/1000293/positions-table

# Players + stats leaderboard
curl https://technology-10.com/api/v1/sites/liga10/players

# Full player profile
curl https://technology-10.com/api/v1/players/{playerId}

# Upcoming games
curl https://technology-10.com/api/v1/sites/liga10/games/to-be-played

# All games (historical + upcoming)
curl https://technology-10.com/api/v1/games/all

# Player image
https://dt6mt1pwzn2ao.cloudfront.net/images/players/{playerId}.jpg

# Team logo
https://dt6mt1pwzn2ao.cloudfront.net/images/teams/logos/{teamId}.png
```
