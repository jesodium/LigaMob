# Ligamob Architecture & Design Document

## 1. Overview
Ligamob is a full-featured football platform for Panama school/youth leagues (Liga 10, Liga+, etc.), heavily inspired by FotMob. The MVP is a polished, fast, local-first Next.js application that proxies and normalizes real data from `technology-10.com`.

## 2. Tech Stack
- **Framework:** Next.js 15+ (App Router, Server & Client Components)
- **Language:** TypeScript
- **Styling:** TailwindCSS (Dark mode default, FotMob aesthetic) + shadcn/ui
- **Animations:** Framer Motion (page transitions, tabs, expanding cards)
- **Data Fetching:** TanStack Query (React Query) for client-side state, Next.js native `fetch` with caching for SSR/Route Handlers.
- **Database (Local MVP):** SQLite with Prisma ORM (for local caching, structural normalization, and future-proofing).
- **Icons:** Lucide React + custom SVG placeholders for football events.

## 3. Visual & UX Direction
- **Aesthetic:** Dark modern sports UI. Premium, native-app feel.
- **Colors:** Deep dark background (`bg-zinc-950` or `#121212`), elevated card panels (`bg-zinc-900`), and a vibrant FotMob-style neon green accent.
- **Typography:** Clean, readable sans-serif (Inter/Geist) with compact spacing.
- **Navigation:** Sticky top navigation for leagues/context, and a mobile bottom tab bar (Home, Matches, Leagues, News).
- **Loaders:** Skeleton loading states for all async content. Fast initial loads.
- **Imagery:** Real CDN image URLs (CloudFront) mapped from the API recon files. Fallbacks for missing assets.

## 4. Architecture: Frontend & Internal API Layer
To prevent tight coupling to the upstream public API, Ligamob will use Next.js Route Handlers as a proxy/BFF (Backend-For-Frontend) layer.

**Directory Structure:**
```text
/src
  /app
    /(main)                 # Layout with bottom tabs
      /page.tsx             # Home Screen
      /matches/page.tsx     # Match List / Live
      /standings/page.tsx   # Standings
      /news/page.tsx        # News & Media
    /match/[id]/page.tsx    # Match Detail (Tabs: Overview, Lineups, Stats)
    /matchday/page.tsx      # Matchday Viewer
    /team/[id]/page.tsx     # Team Profile
    /player/[id]/page.tsx   # Player Profile
    /api                    # Internal Route Handlers
      /home/route.ts
      /matches/live/route.ts
      /match/[id]/route.ts
      /standings/[siteId]/route.ts
      ...
  /components
    /ui                     # shadcn/ui primitives
    /matches                # MatchCard, MatchHeader, LiveBadge, Timeline
    /pitch                  # FormationPitch, PlayerCard
    /standings              # StandingsTable
    /shared                 # TeamBadge, PlayerRow, StatBar
  /lib
    /api                    # Upstream fetchers & normalization logic
    /types                  # TypeScript interfaces for Ligamob & Upstream
    /prisma                 # Prisma client instance
prisma/
  schema.prisma             # SQLite schema for caching/models
```

## 5. Core Features & Implementation Plan

### Phase 1: Foundation & Internal API
- Setup Next.js, Tailwind, shadcn/ui, Prisma (SQLite).
- Build the BFF layer (`/api/...`) mapping `technology-10.com` endpoints.
- Create base UI layout (Top Nav, Bottom Tabs, Dark theme).

### Phase 2: Core Viewing Experience
- **Home Screen:** Fetch upcoming/live games, recent results, and latest news.
- **Matches Page:** List fixtures grouped by date/status (Live, HT, FT, Upcoming).
- **Match Detail View:** Header with logos/scores. Tabs for Overview, Lineups, Stats.
- **Lineup Pitch:** CSS-based pitch UI with player nodes, numbers, and event icon placeholders.

### Phase 3: Leagues & Profiles
- **Standings:** Render group tables with points, GD, form.
- **Team Pages:** Roster, stats, recent form.
- **Player Pages:** Profile photo, stats, bio details.
- **Matchday Viewer:** Navigate fixtures by matchday/knockout stage.

## 6. Data Modeling (Prisma / SQLite)
While the API acts as the primary data source, the local DB will be structured to cache and normalize:
- `League` (e.g., Liga+, Liga10)
- `Tournament` (e.g., U16 2026, U18 2026)
- `Team`, `Player`, `Match`, `Matchday`
*(Note: Initial MVP will heavily rely on pass-through proxying to ensure speed, moving to DB caching as the schema stabilizes).*

## 7. Next Steps for Execution
1. Await user approval on this architecture plan.
2. Exit Plan Mode.
3. Initialize Next.js project locally.
4. Install dependencies (Tailwind, shadcn, Prisma, TanStack Query, Framer Motion).
5. Begin Phase 1 implementation.