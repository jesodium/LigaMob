# Liga-Plus.com — API Reverse Engineering Report
*Date: 2026-05-10 | Platform: technology-10.com (same as liga-10)*

---

## Site Profile

| Property | Value |
|----------|-------|
| siteId | `ligaplus` |
| Name | Liga+ |
| URL | https://liga-plus.com |
| Contact | info@ligaplus.com |
| Description | Torneo de fútbol masculino colegial en Panamá categoría Sub-18. Torneo de ascenso a Liga 10. Desde 2017. Organizado por Grupo 10. |
| priorityOrder | 4 |
| Players per team | 11 |

**Social:**
- Twitter: `superliga10_`
- Instagram: `ligaplus_`
- Facebook: `SuperLiga-Panama-267410057080195`
- YouTube: `channel/UCKLPScUcvWJgAYyyqejDd6w`
- Analytics: `UA-22938363-12`

---

## Feature Toggles

| Toggle | Value |
|--------|-------|
| ENABLE_PHOTO_BY_CATEGORY_FILTER | true |
| ENABLE_PLAYOFF_BRACKET | true |
| ENABLE_RULES | true |
| ENABLE_POW | true |
| ENABLE_STATS_LEADERS | true |
| STATISTICS_MINUTE_BY_MINUTE | true |
| **FANTASY** | **false** ← disabled |
| FANTASY_LEADERS_OVERRIDE | false |

---

## Sponsors / Associates

| Type | Sponsors |
|------|---------|
| Main (1) | Banco General, McDonald's, Delta, +Más |
| Team sponsors (2) | Mobil, Hankook, Nature Valley, Bambito, U of Louisville, N Solar, Hisense, Malta Vigor, Towncenter Consultorios |
| Official teamwear (3) | Adidas |
| Official sports drink (4) | Gatorade |
| Media partner (5) | Cable Onda Sports |
| Insurance (11) | IFS |
| Official supporters (8) | MEDUCA, FEPAFUT, Yappy Park, Panama City FC |
| Suppliers/others | Fábricas Promocionales, Swaptty, SEMM 2 |

---

## Tournaments

**Parent:** `c33245f6-b01b-11eb-bb5a-02fa7e4f6181` — Superliga U18

| id | Name | Year | Active |
|----|------|------|--------|
| **1000302** | **Liga+ U16** | **2026** | **DEFAULT** |
| 1000305 | Liga+ U18 | 2026 | active |
| 10000002 | SuperCup U18 | 2026 | active |
| 1000240 | Liga+ U18 | 2025 | no |
| 1000239 | Liga+ U16 | 2025 | no |
| 1000201 | Liga+ U18 | 2024 | no |
| 1000130 | Liga+ U18 | 2023 | no |
| 1000100 | Liga+ U18 | 2022 | no |
| 31 | Liga+ U18 | 2021 | no |
| 29 | Liga+ U18 | 2019 | no |
| 24 | Liga+ U18 | 2018 | no |
| 18 | Liga+ U18 | 2017 | no |

---

## Active Tournament: Liga+ U16 2026 (id: 1000302)

- Format: 2 groups × 6 teams + knockout bracket
- Matchday endpoints: `GET /api/v1/sites/ligaplus/tournaments/1000302/matchdays`

| id | Name | Type | Date | Done? |
|----|------|------|------|-------|
| 1 | Fecha 1 | regular | 2026-04-19 | ✓ |
| 2 | Fecha 2 | regular | 2026-04-26 | ✓ |
| 3 | Fecha 3 | regular | 2026-05-03 | ✓ |
| 4 | Fecha 4 | regular | 2026-05-10 | today |
| 5 | Fecha 5 | regular | 2026-05-17 | — |
| 10 | Cuartos de Final | playoff | 2026-05-24 | — |
| 13 | Semifinales | playoff | 2026-05-31 | — |
| 14 | Final | playoff | 2026-06-07 | — |
| 15 | Tercer Lugar | playoff | 2026-06-07 | — |

---

## Standings — After Fecha 3

**Grupo A**

| Pos | Team | Pts | PJ | PG | PE | PP | GF | GC | DIF |
|-----|------|-----|----|----|----|----|----|-----|-----|
| 1 | Episcopal (CEP) | 7 | 3 | 2 | 1 | 0 | 6 | 0 | +6 |
| 2 | P. de Maria (CPM) | 5 | 3 | 1 | 2 | 0 | 4 | 2 | +2 |
| 3 | St Mary (SMS) | 5 | 3 | 1 | 2 | 0 | 1 | 0 | +1 |
| 4 | OIS (Coyotes) | 4 | 3 | 1 | 1 | 1 | 2 | 1 | +1 |
| 5 | María Inmaculada | 3 | 3 | 1 | 0 | 2 | 1 | 4 | -3 |
| 6 | Instituto Sun Yat Sen | 0 | 3 | 0 | 0 | 3 | 2 | 9 | -7 |

**Grupo B**

| Pos | Team | Pts | PJ | PG | PE | PP | GF | GC | DIF |
|-----|------|-----|----|----|----|----|----|-----|-----|
| 1 | Balboa (Dragons) | 9 | 3 | 3 | 0 | 0 | 9 | 0 | +9 |
| 2 | San Agustín | 7 | 3 | 2 | 1 | 0 | 5 | 0 | +5 |
| 3 | Oxford | 6 | 3 | 2 | 0 | 1 | 9 | 1 | +8 |
| 4 | IC International School | 4 | 3 | 1 | 1 | 1 | 3 | 1 | +2 |
| 5 | AIP CV (Wild Lynx) | 0 | 3 | 0 | 0 | 3 | 0 | 8 | -8 |
| 6 | L. Academy (Lincoln) | 0 | 3 | 0 | 0 | 3 | 0 | 16 | -16 |

Endpoint: `GET https://technology-10.com/api/v1/sites/ligaplus/tournaments/1000302/positions-table`

---

## Teams (19 total)

| id | Short | Full Name | Colors | Instagram | Location |
|----|-------|-----------|--------|-----------|---------|
| f868c32b-4441-4012-b7b4-0f3f9c744b51 | AIP CV | AIP Cerro Viento | #212121 / #FFF | aip_cerroviento | Cerro Viento |
| e9455f02-13cf-4c7c-8004-87918b7110fc | Atenea | Instituto Atenea | #D81B60 / #FFF | ateneathunders | Albrook Park |
| f7971d97-e6a8-4322-bff4-b846b2f1784d | Balboa | Balboa Academy | #1A237E / #FFF | dragonsbalboa | Clayton |
| 741687c7-217c-4461-88ec-759ca580d8af | ECP | El Colegio de Panamá | #2E7D32 / #FFF | ecp_eagles | San Francisco |
| cf2a5bd1-f8eb-489f-93c3-dfd00d96659f | Enrico Fermi | Colegio Enrico Fermi | #FFB300 / — | — | — |
| 409e8ad2-1ea1-11e4-b20e-099df5f7f6e9 | Episcopal | Colegio Episcopal de Panamá | #F5F5F5 / #FFF | episcopal_pa | El Carmen |
| 06747a46-5206-4c93-901c-f75faa0c3568 | IC International | IC International School | #00838F / #FFF | cultural_pa | San Miguelito |
| 409fd41e-1ea1-11e4-b20e-099df5f7f6e9 | ISYS | Instituto Sun Yat Sen | #C62828 / #DDD | chinopanameno | El Dorado |
| 40259f32-d716-4e5d-b5f4-5770324b4490 | IPA | Instituto Panamericano | #9E9E9E / #222 | ipa_panama_ | Pueblo Nuevo |
| 7264592f-2e5e-46d9-aa9d-709615d94b5f | L. Academy | Lincoln Academy | #212121 / — | — | — |
| 5314b984-119f-4374-8237-6ce155e3aa0e | María Inmaculada | Colegio María Inmaculada | #7B1FA2 / #FFF | — | — |
| 8c2790ce-d5cd-4a6b-9eb0-31ff1d434382 | MET | Metropolitan School | #6A1B9A / #FFF | jaguars.met | Green Valley |
| 40a362b4-1ea1-11e4-b20e-099df5f7f6e9 | OIS | Oxford International School | #E65C00 / #000 | oiscoyotes | Via España |
| 40a2b0da-1ea1-11e4-b20e-099df5f7f6e9 | Oxford | The Oxford School | #1A237E / #EEE | the_oxfordpa | Transístmica |
| fa082938-5239-43b1-88f9-722b5897ec80 | P. de Maria | Colegio Pureza de Maria | #1565C0 / #000 | — | — |
| 40a053da-1ea1-11e4-b20e-099df5f7f6e9 | San Agustín | Colegio San Agustín | #F57C00 / #EEE | sanagustin_pa | Costa del Este |
| 1ad5e26d-85d5-4836-be47-a6c541cf5a89 | Smart | Smart Academy | #757575 / #FFF | saptigers | Brisas del Golf |
| 409f3a0e-1ea1-11e4-b20e-099df5f7f6e9 | St Mary | Colegio St. Mary | #CC0000 / #EEE | stmarypa | Albrook Park |
| 6b4bf61b-7f28-4c5a-971c-264d9c79f88d | TJS | Thomas Jefferson School | #E65100 / #000 | — | — |

Endpoint: `GET https://technology-10.com/api/v1/sites/ligaplus/teams`

---

## Top Players (Career Leaderboard)

| Rank | id | Name | Position | Goals | Assists | Pts | GP |
|------|----|------|----------|-------|---------|-----|----|
| 1 | 7867 | José Hope | Mediocampo | 20 | 3 | 164 | 23 |
| 2 | 8532 | Fabian Barroeta | Delantero | 14 | 0 | 82 | 13 |
| 3 | 7859 | Aurelio Perfetti | Delantero | 13 | 1 | 81 | 15 |
| 4 | 5037 | Alessandro Galeano | Mediocampo | 8 | 4 | 85 | 14 |
| 5 | 8564 | Anel Caballero | Delantero | 10 | 1 | 71 | 15 |
| 6 | 8566 | Andre Anaya | Mediocampo | 6 | 7 | 83 | 16 |
| 7 | 7846 | Carlos Brito | Mediocampo | 4 | 7 | 79 | 14 |
| 8 | 7817 | Daniel Zelenka | Mediocampo | 7 | 5 | 70 | 12 |
| 9 | 4512 | Omar Echeverria | Mediocampo | 5 | 2 | 73 | 17 |
| 10 | 8573 | Max Alvear | Delantero | 7 | 2 | 60 | 13 |
| 11 | 4450 | Diego Pantoja | Delantero | 6 | 5 | 58 | 11 |
| 12 | 3270 | Daniel Leitao | Mediocampo | 5 | 0 | 53 | 14 |
| 13 | 7687 | Mateo Gómez | Delantero | 5 | 3 | 45 | 8 |
| 14 | 7853 | Felipe Spiegel | Delantero | 5 | 2 | 43 | 10 |
| 15 | 3722 | Moises Berenguer | Mediocampo | 5 | 0 | 40 | 6 |
| 16 | 7798 | Alessandro Galeano | Mediocampo | 4 | 1 | 38 | 6 |
| 17 | 5777 | Felipe Korngold | Mediocampo | 4 | 2 | 50 | 12 |
| 18 | 5884 | Andres Guerra | Delantero | 4 | 0 | 36 | 10 |
| 19 | 8494 | Juan Antonio Rios | Mediocampo | 6 | 4 | 69 | 15 |
| 20 | 8303 | Miguel Espinosa | Delantero | 7 | 1 | 29 | 0 |

Endpoint: `GET https://technology-10.com/api/v1/sites/ligaplus/players`
Note: career/aggregate across all tournaments — not current season only.

---

## Player Profiles (Top 3)

**José Hope — id: 7867**
- Position: Mediocampo (id=3)
- DOB: 2009-06-03 | Country: Panamá
- Team: Enrico Fermi | Jersey: #10

**Fabian Barroeta — id: 8532**
- Position: Delantero (id=4)
- DOB: 2009-10-26 | Country: Venezuela
- Team: OIS | Jersey: #9

**Aurelio Perfetti — id: 7859**
- Position: Delantero (id=4)
- DOB: 2006-04-18 | Country: Italia
- Main team: Enrico Fermi #9 | Combined team: Panama City FC #78

Profile fields: `idPlayer, idPlayerPosition, idPlayerPreferredFoot, positionFullName, firstName, lastName, positionName, dateOfBirth, countryOfBirth, mainTeamJerseyNumber, combinedTeamJerseyNumber, mainTeamId, combinedTeamId, mainTeamName, combinedTeamName`

Endpoint: `GET https://technology-10.com/api/v1/players/{playerId}`

---

## Upcoming Fixtures

**Fecha 4 — 2026-05-10 (TODAY) @ Yappy Park, all 15:00–20:00**

| id | Time | Home | Away |
|----|------|------|------|
| 5320 | 15:00 | OIS | Episcopal |
| 5321 | 16:00 | P. de Maria | María Inmaculada |
| 5322 | 17:00 | Instituto Sun Yat Sen | St Mary |
| 5323 | 18:00 | Balboa | Oxford |
| 5324 | 19:00 | IC International School | L. Academy |
| 5325 | 20:00 | San Agustín | AIP CV |

**Fecha 5 — 2026-05-17**

| id | Time | Home | Away |
|----|------|------|------|
| 5326 | 15:00 | IC International School | Oxford |
| 5327 | 16:00 | Balboa | San Agustín |
| 5328 | 17:00 | AIP CV | L. Academy |
| 5329 | 18:00 | P. de Maria | OIS |
| 5330 | 19:00 | Instituto Sun Yat Sen | María Inmaculada |
| 5331 | 20:00 | Episcopal | St Mary |

Broadcaster: YouTube. Stadium: Yappy Park (id=50, capacity 2,000).

Endpoints:
```
GET https://technology-10.com/api/v1/sites/ligaplus/games/to-be-played
GET https://technology-10.com/api/v1/games/all  (58 upcoming across all active tournaments)
```

---

## Recent Results — Fecha 3 (2026-05-03)

| Home | Score | Away |
|------|-------|------|
| P. de Maria | **4-2** | Instituto Sun Yat Sen |
| OIS | **0-0** | St Mary |
| María Inmaculada | **0-3** | Episcopal |
| San Agustín | **4-0** | Lincoln Academy |
| Balboa | **1-0** | IC International School |
| Oxford | **3-0** | AIP CV |

Fecha 3 top scorers: Juan Antonio Ríos ×2 (Episcopal), Marcelo Car ×2 (San Agustín)

---

## Image URL Patterns (Verified)

```
# Site logo — CONFIRMED 200
https://dt6mt1pwzn2ao.cloudfront.net/images/logos/ligaplus/logo.png

# Player photo
https://dt6mt1pwzn2ao.cloudfront.net/images/players/{playerId}.jpg
# Example (confirmed 200):
https://dt6mt1pwzn2ao.cloudfront.net/images/players/7867.jpg   ← José Hope

# News image — CONFIRMED 200
https://dt6mt1pwzn2ao.cloudfront.net/images/news/{imageId}.jpg
# Example:
https://dt6mt1pwzn2ao.cloudfront.net/images/news/1000033.jpg

# Team logo
https://dt6mt1pwzn2ao.cloudfront.net/images/teams/logos/{teamId}.png
# Note: direct team logo URLs returning 403 in some tests — may need exact UUID

# Game photo album
https://dt6mt1pwzn2ao.cloudfront.net/images/photos/games/{gameId}/{filename}

# Staff photo
https://dt6mt1pwzn2ao.cloudfront.net/images/staff/{staffId}.jpg
```

---

## ⚠️ PII Exposure (No Auth)

`GET https://technology-10.com/api/v1/sites/ligaplus/search/players?q={term}`

Returns per player:
- `idPlayer` (int)
- `firstName`, `lastName`
- `dateOfBirth` (full timestamp, e.g. `2011-05-04T00:00:00.000Z`)
- `email` (personal or school email)
- `nickname`
- `countryOfBirth`
- `validated` (bool)

**Affected are minors (U16 born 2009–2011).** Sample emails exposed:
- `Kamdarparita@gmail.com` — Atiksh Kamdar, DOB 2011-05-04
- `1004941christian@oxford.edu.pa` — Christian Borrajo, DOB 2010-05-05
- `1004952harshil@oxford.edu.pa` — Harshil Chauhan, DOB 2009-01-12
- `aaronarauz@gmail.com` — Aaron Arauz, DOB 2011-01-06

---

## Media

### News (latest 5)
| Date | Title | imageId |
|------|-------|---------|
| 2026-05-05 | Pureza de María resiste la reacción del ISYS y cierra con victoria | 1000033 |
| 2026-05-04 | OIS y St. Mary se neutralizan en un empate sin goles | 1000032 |
| 2026-05-04 | Balboa Academy resiste y se queda con un triunfo trabajado ante IC International | 1000031 |
| 2026-05-04 | Episcopal vence al María Inmaculada con un tornado de goles | 1000030 |
| 2026-05-04 | San Agustín arrasa y firma goleada contundente ante Lincoln Academy | 1000028 |

News fields: `id (UUID), imageId, date, siteName, siteId, title, content (full HTML), previewText, category, author, numberOfViews, hidden`

Endpoint: `GET https://technology-10.com/api/v1/sites/ligaplus/news`

### Videos
31 YouTube videos, types:
- "Partidos Completos" (full matches)
- "Resumenes de Partidos" (highlights)

Sample YouTube IDs:
- `EOCKXoiH2pY` — Fecha 4 San Agustín vs AIP CV (full)
- `GsmFXWJMfw0` — Fecha 3 Resumen
- `bxBSYhKcSmQ` — P. de Maria 4-2 ISYS (recap)

Thumbnail pattern: `https://img.youtube.com/vi/{ytId}/hqdefault.jpg`

### Photo Albums
6 albums for ligaplus (all from Fecha 3, 2026-05-03):

| id | Match | Photos |
|----|-------|--------|
| 3306 | P. de Maria 4-2 Instituto Sun Yat Sen | 84 |
| 3305 | OIS 0-0 St Mary | 82 |
| 3304 | María Inmaculada 0-3 Episcopal | 75 |
| 3303 | San Agustín 4-0 L. Academy | 85 |
| 3302 | Balboa 1-0 IC International School | 94 |
| 3301 | Oxford 3-0 AIP CV | 80 |

Endpoint: `GET https://technology-10.com/api/v1/sites/photo-albums` (global, filter `idSite == 'ligaplus'` client-side)
Note: `GET /sites/ligaplus/photo-albums` returns 404 — use global endpoint.

---

## Quick Reference — Key Calls

```bash
# Site info
curl https://technology-10.com/api/v1/sites/ligaplus

# Active tournament
curl https://technology-10.com/api/v1/sites/ligaplus/tournaments/default

# Standings
curl https://technology-10.com/api/v1/sites/ligaplus/tournaments/1000302/positions-table

# All teams
curl https://technology-10.com/api/v1/sites/ligaplus/teams

# Players leaderboard
curl https://technology-10.com/api/v1/sites/ligaplus/players

# Full player profile
curl https://technology-10.com/api/v1/players/7867

# Upcoming games
curl https://technology-10.com/api/v1/sites/ligaplus/games/to-be-played

# All games (58 upcoming + historical)
curl https://technology-10.com/api/v1/games/all

# Matchdays
curl https://technology-10.com/api/v1/sites/ligaplus/tournaments/1000302/matchdays

# News
curl https://technology-10.com/api/v1/sites/ligaplus/news

# Photo albums
curl https://technology-10.com/api/v1/sites/photo-albums
```

---

## API Gotchas (same as Liga-10)

See `liga-10-api-recon.md § Data Shape Gotchas` for full details. Short version:
- `/games/all` → `{elements: [], count: N}` (not plain array)
- `game.status` → object `{id, name}` (not a number)
- `/tournaments/default` → array with `tournamentId` field (not `id`)
- `/games/{id}/players/statistics` `id` ≠ `playerId` — match by `firstName+lastName` key
- No minute-level events, no possession/shots aggregate stats
- Fantasy scoring: Goal=+6, Assist=+3, Clean sheet=+3, Played=+1, Yellow=−1, Red=−3, OG=−2

---

## Differences vs Liga-10

| Aspect | Liga-Plus |
|--------|-----------|
| Fantasy | **Disabled** (liga-10 has it enabled) |
| Active tournaments | 3 simultaneous (U16-2026, U18-2026, SuperCup) |
| Stat aggregate endpoint | Returns empty body (tournament too young) |
| `/sites/ligaplus/photo-albums` | Returns 404 — must use global `/sites/photo-albums` |
| combinedTeam on players | Present (e.g. Perfetti plays for Panama City FC) |
| Stadium | Yappy Park (id=50, 2,000 cap) — named sponsor |
| siteId format | `ligaplus` (no hyphen — confirmed) |
