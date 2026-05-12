import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

const UPSTREAM = 'https://technology-10.com/api/v1';
const CDN = 'https://dt6mt1pwzn2ao.cloudfront.net';

const STATUS = { 0:'upcoming', 1:'final', 2:'live', 3:'postponed', 4:'final', 5:'final', 6:'final' };
const PLAYED = new Set([1,4,5,6]);

// Simple TTL cache for heavy upstream calls
const _cache = new Map();
async function upCached(path, ttlMs = 120000) {
  const hit = _cache.get(path);
  if (hit && Date.now() - hit.ts < ttlMs) return hit.data;
  const data = await up(path);
  _cache.set(path, { data, ts: Date.now() });
  return data;
}

const img = {
  player: (id, siteId) =>
    siteId === 'ptycityfc' && id && id !== 'default'
      ? `${CDN}/images/players/ptycityfc/${id}.jpg`
      : `${CDN}/images/players/${id || 'default'}.jpg`,
  team: id => `${CDN}/images/teams/logos/${id}.png`,
  site: id => `${CDN}/images/logos/${id}/logo.png`,
  news: id => `${CDN}/images/news/${id}.jpg`,
};

function arr(v) { return Array.isArray(v) ? v : []; }

async function up(path) {
  const res = await fetch(`${UPSTREAM}${path}`, {
    headers: { 'User-Agent': 'LigaMob/1.0', Accept: 'application/json' },
  });
  if (!res.ok) throw new Error(`upstream ${res.status} ${path}`);
  return res.json();
}

// ── Normalizers ────────────────────────────────────────────────────────────────
function normalizeGame(g) {
  const statusCode = g.status?.id ?? g.status ?? 0;
  return {
    id: g.id, date: g.date,
    status: STATUS[statusCode] ?? 'unknown',
    statusCode,
    home: { id: g.teamOne?.id, name: g.teamOne?.name, logo: img.team(g.teamOne?.id), score: g.goalsTeamOne ?? null },
    away: { id: g.teamTwo?.id, name: g.teamTwo?.name, logo: img.team(g.teamTwo?.id), score: g.goalsTeamTwo ?? null },
    matchday:   g.matchday   ? { id: g.matchday.id,   name: g.matchday.name }             : null,
    tournament: g.tournament ? { id: g.tournament.id, name: g.tournament.tournamentName } : null,
    stadium: g.stadium ?? null,
  };
}

function normalizeStandingsRow(r) {
  // Support both raw row format and {team, teamStatistics} format
  const stats = r.teamStatistics ?? r;
  const team  = r.team ?? { id: stats.team?.id, name: stats.team?.name };
  const won   = stats.gamesWon ?? stats.won ?? 0;
  const drawn = stats.gamesDraw ?? stats.drawn ?? 0;
  const lost  = stats.gamesLost ?? stats.lost ?? 0;
  return {
    position: stats.position ?? r.position,
    team: { id: team.id, name: team.name, logo: img.team(team.id) },
    points: stats.points, played: won + drawn + lost, won, drawn, lost,
    goalsFor: stats.goalsInFavor ?? 0, goalsAgainst: stats.goalsAgainst ?? 0,
    goalDiff: (stats.goalsInFavor ?? 0) - (stats.goalsAgainst ?? 0),
  };
}

function normalizeStandingsData(data) {
  // Format: {table: {'Group A': [{team, teamStatistics}]}, groups: [...]}
  if (data && typeof data === 'object' && !Array.isArray(data) && data.table) {
    return Object.entries(data.table).map(([groupName, rows]) => ({
      group: groupName.replace(/^Grupo\s*/i, ''),
      rows: arr(rows).map(normalizeStandingsRow),
    }));
  }
  if (!Array.isArray(data) || !data.length) return [];
  // Format: [{group, rows/teams}]
  if (data[0]?.teams || data[0]?.rows || data[0]?.group !== undefined)
    return data.map((g, i) => ({ group: g.group ?? g.groupName ?? String.fromCharCode(65 + i), rows: arr(g.teams ?? g.rows).map(normalizeStandingsRow) }));
  // Flat array
  return [{ group: null, rows: data.map(normalizeStandingsRow) }];
}

function normalizeNews(n) {
  return { id: n.id, title: n.title, date: n.date, image: img.news(n.imageId), preview: n.previewText ?? null };
}

function normalizeTeam(t) {
  return { id: t.id, name: t.name, longName: t.longName, colors: { primary: t.primaryColor, secondary: t.secondaryColor }, logo: img.team(t.id) };
}

function normalizePlayerRow(p) {
  return { id: p.id, firstName: p.firstName, lastName: p.lastName, position: p.positionName, goals: p.goals ?? 0, assists: p.assists ?? 0, points: p.points ?? 0, gamesPlayed: p.gamesPlayed ?? 0, photo: img.player(p.id) };
}

// ── API handlers ───────────────────────────────────────────────────────────────
async function getLeagues() {
  const sites = await up('/sites');
  const SUPPORTED = new Set(['liga10','ligaplus','ligajr','ptycityfc','ligaw','ligau','liga123']);
  return sites.filter(s => SUPPORTED.has(s.id)).map(s => ({ id: s.id, name: s.name, url: s.url, logo: img.site(s.id) }));
}

function normalizeTournament(raw) {
  if (Array.isArray(raw)) raw = raw[0];
  if (!raw) return null;
  return { id: raw.id ?? raw.tournamentId, name: raw.tournamentName ?? raw.name };
}

async function getDefaultTournament(siteId) {
  const raw = await up(`/sites/${siteId}/tournaments/default`);
  return normalizeTournament(raw);
}

async function getLeagueHome(siteId) {
  const [rawTournament, games, news] = await Promise.all([
    up(`/sites/${siteId}/tournaments/default`).catch(() => null),
    up(`/sites/${siteId}/games/to-be-played`).catch(() => []),
    up(`/sites/${siteId}/news`).catch(() => []),
  ]);
  const tournament = normalizeTournament(rawTournament);
  let standings = null;
  if (tournament?.id)
    standings = await up(`/sites/${siteId}/tournaments/${tournament.id}/positions-table`).catch(() => null);
  return {
    tournament: tournament ?? null,
    upcomingGames: arr(games).slice(0, 10).map(normalizeGame),
    standings: standings ? normalizeStandingsData(standings) : null,
    latestNews: arr(news).slice(0, 5).map(normalizeNews),
  };
}

async function getStandings(siteId, query) {
  let tid = query.tournamentId;
  if (!tid) { const t = await getDefaultTournament(siteId); tid = t?.id; }
  const data = await up(`/sites/${siteId}/tournaments/${tid}/positions-table`);
  return { tournamentId: tid, groups: normalizeStandingsData(data) };
}

async function getLeagueGames(siteId, query) {
  const games = await up(`/sites/${siteId}/games/to-be-played`).catch(() => []);
  let rows = arr(games).map(normalizeGame);
  if (query.status) rows = rows.filter(g => g.status === query.status);
  return rows;
}

async function getTeams(siteId)   { return arr(await up(`/sites/${siteId}/teams`)).map(normalizeTeam); }
async function getPlayers(siteId) {
  const t = await getDefaultTournament(siteId).catch(() => null);
  const url = t?.id ? `/sites/${siteId}/players?tournamentId=${t.id}` : `/sites/${siteId}/players`;
  return arr(await up(url)).map(normalizePlayerRow);
}
async function getNews(siteId)    { return arr(await up(`/sites/${siteId}/news`)).map(normalizeNews); }

async function getResults(siteId) {
  const t = await getDefaultTournament(siteId).catch(() => null);
  if (!t?.id) return [];
  const raw = await upCached('/games/all', 180000);
  const allGames = arr(raw?.elements ?? raw);
  const statusId = g => g.status?.id ?? g.status ?? -1;
  return allGames
    .filter(g => (g.tournament?.id == t.id) && PLAYED.has(statusId(g)))
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 40)
    .map(normalizeGame);
}

async function getTournaments(siteId) {
  const ts = await up(`/sites/${siteId}/tournaments`);
  return arr(ts).map(t => ({ id: t.id, name: t.tournamentName, startDate: t.startDate }));
}

async function getMatchdays(siteId, tid) {
  if (!tid) { const t = await getDefaultTournament(siteId); tid = t?.id; }
  const mds = await up(`/sites/${siteId}/tournaments/${tid}/matchdays`);
  return arr(mds).map(m => ({ id: m.id, name: m.name, isPlayoff: !!m.isPlayoff, order: m.matchdayOrder }));
}

async function getGame(gameId) {
  const [game, lineups, stats, playerStats] = await Promise.all([
    up(`/games/${gameId}`),
    up(`/games/${gameId}/lineups`).catch(() => []),
    up(`/games/${gameId}/statistics`).catch(() => null),
    up(`/games/${gameId}/players/statistics`).catch(() => []),
  ]);

  const nameKey = p => `${p.firstName} ${p.lastName}`.toLowerCase().replace(/\s+/g, ' ').trim();
  const participationMap = new Map();
  const playerIdMap = new Map();
  for (const p of arr(lineups)) {
    const k = nameKey(p);
    participationMap.set(k, p.participation?.name ?? 'SUBSTITUTE');
    playerIdMap.set(k, p.playerId);
  }

  const normalizedStats = arr(playerStats).map(p => {
    const k = nameKey(p);
    return {
      id: p.id, playerId: playerIdMap.get(k) ?? null,
      firstName: p.firstName?.trim(), lastName: p.lastName?.trim(),
      jerseyNumber: p.jerseyNumber ?? null,
      position: p.position?.name ?? (typeof p.position === 'string' ? p.position : null),
      team: { id: p.team?.id, name: p.team?.name },
      goals: p.goals ?? 0, assists: p.assists ?? 0,
      yellowCards: p.yellowCards ?? 0, redCards: p.redCards ?? 0,
      ownGoals: p.ownGoals ?? 0, isCleanSheet: !!p.isCleanSheet,
      captain: !!p.captain, points: p.points ?? 0,
      subbedInMinute: p.subbedInMinute ?? null,
      subbedOutMinute: p.subbedOutMinute ?? null,
      goalMinutes: arr(p.goalMinutes ?? p.goalsMinutes),
      yellowCardMinutes: arr(p.yellowCardMinutes),
      redCardMinutes: arr(p.redCardMinutes),
      penaltiesStopped: p.penaltiesStopped ?? 0, penaltiesFailed: p.penaltiesFailed ?? 0,
      penaltiesReceived: p.penaltiesReceived ?? 0, penaltiesGiven: p.penaltiesGiven ?? 0,
      participation: participationMap.get(k) ?? 'SUBSTITUTE',
    };
  });

  // Players who attended but have no stats record (true DNPs)
  const statNames = new Set(arr(playerStats).map(nameKey));
  const dnpPlayers = arr(lineups)
    .filter(p => p.participation?.name === 'ATTENDED_NOT_PLAYED' && !statNames.has(nameKey(p)))
    .map(p => ({
      id: null, playerId: p.playerId,
      firstName: p.firstName?.trim(), lastName: p.lastName?.trim(),
      jerseyNumber: null,
      position: p.position?.name ?? (typeof p.position === 'string' ? p.position : null),
      team: { id: p.teamId, name: p.teamName },
      goals: 0, assists: 0, yellowCards: 0, redCards: 0,
      ownGoals: 0, isCleanSheet: false, captain: false, points: 0,
      penaltiesStopped: 0, penaltiesFailed: 0, penaltiesReceived: 0, penaltiesGiven: 0,
      participation: 'ATTENDED_NOT_PLAYED',
    }));

  return {
    ...normalizeGame(game),
    lineups: arr(lineups),
    statistics: stats ?? null,
    playerStatistics: [...normalizedStats, ...dnpPlayers],
  };
}

async function getPlayer(id) {
  const p = await up(`/players/${id}`);
  return {
    id: p.idPlayer, firstName: p.firstName, lastName: p.lastName,
    position: p.positionName, dateOfBirth: p.dateOfBirth ?? null, country: p.countryOfBirth ?? null,
    team: { id: p.mainTeamId, name: p.mainTeamName, jerseyNumber: p.mainTeamJerseyNumber ?? null, logo: img.team(p.mainTeamId) },
    photo: img.player(p.idPlayer),
  };
}

async function getNewsArticle(id) {
  const n = await up(`/news/${id}`);
  return { ...normalizeNews(n), content: n.content ?? null, views: n.numberOfViews ?? 0 };
}

// ── Middleware ─────────────────────────────────────────────────────────────────
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// ── Routes ─────────────────────────────────────────────────────────────────────
function route(fn) {
  return async (req, res) => {
    try {
      const data = await fn(req);
      res.json(data);
    } catch (e) {
      res.status(500).json({ error: e?.message ?? 'Internal error' });
    }
  };
}

app.get('/api/leagues',                          route(()    => getLeagues()));
app.get('/api/leagues/:site/home',               route(req   => getLeagueHome(req.params.site)));
app.get('/api/leagues/:site/standings',          route(req   => getStandings(req.params.site, req.query)));
app.get('/api/leagues/:site/games',              route(req   => getLeagueGames(req.params.site, req.query)));
app.get('/api/leagues/:site/teams',              route(req   => getTeams(req.params.site)));
app.get('/api/leagues/:site/players',            route(req   => getPlayers(req.params.site)));
app.get('/api/leagues/:site/news',               route(req   => getNews(req.params.site)));
app.get('/api/leagues/:site/results',            route(req   => getResults(req.params.site)));
app.get('/api/leagues/:site/tournaments',        route(req   => getTournaments(req.params.site)));
app.get('/api/leagues/:site/matchdays',          route(req   => getMatchdays(req.params.site, req.query.tournamentId)));
app.get('/api/games/:id',                        route(req   => getGame(req.params.id)));
app.get('/api/players/:id',                      route(req   => getPlayer(req.params.id)));
app.get('/api/leagues/:site/players/:id/statistics',     route(req => up(`/sites/${req.params.site}/tournaments/players/${req.params.id}/statistics`)));
app.get('/api/leagues/:site/players/:id/history',        route(req => up(`/sites/${req.params.site}/players/${req.params.id}/statistics/all-leagues`)));
app.get('/api/leagues/:site/players/:id/awards',         route(req => up(`/sites/${req.params.site}/players/${req.params.id}/awards`)));
app.get('/api/leagues/:site/players/:id/records',        route(req => up(`/sites/${req.params.site}/players/${req.params.id}/games/records`)));
app.get('/api/news/:id',                         route(req   => getNewsArticle(req.params.id)));

app.use(express.static(join(__dirname, 'public')));

app.listen(3000, () => console.log('http://localhost:3000'));
