// ─── State ────────────────────────────────────────────────────────────────────
let league = 'ligaplus';
let leagues = [];
let currentTab = 'home';
let matchesSubtab = 'upcoming';
let playersSubtab = 'goals';
let gameDetailTab = 'lineup';
const cache = {};

// ─── SVG Icons ───────────────────────────────────────────────────────────────
const CDN = 'https://dt6mt1pwzn2ao.cloudfront.net/images/players';

const ICON = {
  // ⚽ Goal ball
  goal: `<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" width="15" height="15">
    <circle cx="8" cy="8" r="7" stroke="#ffffff" stroke-width="1.4" fill="rgba(0,0,0,0.5)"/>
    <polygon points="8,3.5 9.8,6.5 13,6.5 10.6,8.5 11.5,11.5 8,9.5 4.5,11.5 5.4,8.5 3,6.5 6.2,6.5" fill="#ffffff" opacity=".95"/>
  </svg>`,
  // ⚽ Small pitch goal icon
  goalSmall: `<svg viewBox="0 0 13 13" fill="none" width="13" height="13">
    <circle cx="6.5" cy="6.5" r="5.5" fill="rgba(255,255,255,0.9)" stroke="rgba(0,0,0,0.4)" stroke-width="0.8"/>
    <polygon points="6.5,2.5 8,5 10.5,5 8.5,6.7 9.2,9.2 6.5,7.6 3.8,9.2 4.5,6.7 2.5,5 5,5" fill="#1a4a28"/>
  </svg>`,
  // Arrow assist
  assist: `<svg viewBox="0 0 16 16" fill="none" width="15" height="15">
    <circle cx="8" cy="8" r="7" fill="rgba(0,0,0,0.5)" stroke="#9a9a9a" stroke-width="1.4"/>
    <path d="M3.5 10.5 C5 5.5, 11 5.5, 12.5 10.5" stroke="white" stroke-width="1.5" stroke-linecap="round" fill="none" opacity=".8"/>
    <path d="M10 7.5 L12.5 10.5 L10 13" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity=".8"/>
  </svg>`,
  // Yellow card
  yellowCard: `<svg viewBox="0 0 10 14" width="10" height="14"><rect width="10" height="14" rx="1.5" fill="#fbbf24"/><rect x="1" y="1" width="8" height="12" rx="1" fill="rgba(255,255,255,0.15)"/></svg>`,
  // Red card
  redCard: `<svg viewBox="0 0 10 14" width="10" height="14"><rect width="10" height="14" rx="1.5" fill="#ef4444"/><rect x="1" y="1" width="8" height="12" rx="1" fill="rgba(255,255,255,0.15)"/></svg>`,
  // Sub in (green up arrow)
  subIn: `<svg viewBox="0 0 14 14" width="13" height="13" fill="none">
    <circle cx="7" cy="7" r="6" fill="#22c55e" fill-opacity=".85"/>
    <path d="M7 10V4M4 7l3-3 3 3" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
  // Sub out (red down arrow)
  subOut: `<svg viewBox="0 0 14 14" width="13" height="13" fill="none">
    <circle cx="7" cy="7" r="6" fill="#ef4444" fill-opacity=".85"/>
    <path d="M7 4v6M4 7l3 3 3-3" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
  // Own goal
  ownGoal: `<svg viewBox="0 0 14 14" width="13" height="13" fill="none">
    <circle cx="7" cy="7" r="6" fill="rgba(239,68,68,0.85)"/>
    <path d="M4.5 4.5l5 5M9.5 4.5l-5 5" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
  </svg>`,
  // Large icons for player tab pills
  goalLg: `<svg viewBox="0 0 18 18" fill="none" width="16" height="16"><circle cx="9" cy="9" r="7.5" stroke="currentColor" stroke-width="1.5"/><polygon points="9,4 11,7.5 15,7.5 12,9.8 13,13 9,11 5,13 6,9.8 3,7.5 7,7.5" fill="currentColor"/></svg>`,
  assistLg: `<svg viewBox="0 0 18 18" fill="none" width="16" height="16"><path d="M3 13 C5.5 5, 12.5 5, 15 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M12 10L15 13L12 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  gamesLg: `<svg viewBox="0 0 18 18" fill="none" width="16" height="16"><rect x="2" y="3" width="14" height="13" rx="2" stroke="currentColor" stroke-width="1.5"/><line x1="12" y1="1" x2="12" y2="5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="6" y1="1" x2="6" y2="5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="2" y1="8" x2="16" y2="8" stroke="currentColor" stroke-width="1.5"/></svg>`,
};

// ─── Ratings ─────────────────────────────────────────────────────────────────
// Fantasy pts → display rating (scale: 5.0 – 9.9)
// pts: 1=just played, +6 goal, +3 assist, +3 clean sheet, -1 yellow, -3 red
function ptsToRating(pts) {
  if (!pts || pts < 1) return null;
  const r = Math.min(9.9, Math.max(5.0, pts * 0.55 + 4.45));
  return r.toFixed(1);
}

function ratingClass(r) {
  const v = parseFloat(r);
  if (v >= 8.5) return 'r-green';
  if (v >= 7.5) return 'r-teal';
  if (v >= 6.5) return 'r-amber';
  if (v >= 5.5) return 'r-orange';
  return 'r-gray';
}

// ─── API ──────────────────────────────────────────────────────────────────────
async function api(path) {
  if (cache[path]) return cache[path];
  const r = await fetch(path);
  if (!r.ok) throw new Error(r.status);
  return (cache[path] = await r.json());
}
function clearLeagueCache() {
  Object.keys(cache).forEach(k => { if (k.includes(`/${league}/`) || k.includes('/leagues/')) delete cache[k]; });
}

// ─── Formatters ───────────────────────────────────────────────────────────────
function fmtDate(s) { if (!s) return ''; return new Date(s).toLocaleDateString('es-PA', { weekday: 'short', month: 'short', day: 'numeric' }); }
function fmtTime(s) { if (!s) return ''; return new Date(s).toLocaleTimeString('es-PA', { hour: '2-digit', minute: '2-digit' }); }
function fmtDateLong(s) { if (!s) return ''; return new Date(s).toLocaleDateString('es-PA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }); }
function fmtAge(dob) { if (!dob) return '—'; return Math.floor((Date.now() - new Date(dob)) / (365.25*24*3600*1000)); }
function shortName(n) { if (!n) return '—'; const p = n.trim().split(' '); return p[0]; }
function playerPhoto(id) { return `${CDN}/${id || 'default'}.jpg`; }

// ─── Overlays ─────────────────────────────────────────────────────────────────
function openOverlay(id) { const el = document.getElementById(id); el.setAttribute('aria-hidden','false'); el.classList.add('open'); document.body.style.overflow='hidden'; }
function closeOverlay(id) { const el = document.getElementById(id); el.setAttribute('aria-hidden','true'); el.classList.remove('open'); document.body.style.overflow=''; }

// ─── League Picker ────────────────────────────────────────────────────────────
async function loadLeagues() {
  if (leagues.length) return leagues;
  leagues = await api('/api/leagues');
  return leagues;
}

async function openLeaguePicker() {
  openOverlay('league-overlay');
  const grid = document.getElementById('league-grid');
  grid.innerHTML = '<div class="spinner-wrap"><div class="spinner"></div></div>';
  try {
    const list = await loadLeagues();
    grid.innerHTML = list.map(l => `
      <div class="league-card fade-item ${l.id === league ? 'selected' : ''}" data-id="${l.id}">
        <img class="league-card-logo" src="${l.logo}" alt="${l.name}" loading="lazy" onerror="this.style.opacity='.15'">
        <div class="league-card-name">${l.name}</div>
        <div class="selected-check"><svg viewBox="0 0 10 10" fill="none"><path d="M1.5 5L4 7.5 8.5 2.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
      </div>`).join('');
    grid.querySelectorAll('.league-card').forEach(c => c.addEventListener('click', () => selectLeague(c.dataset.id)));
  } catch {
    grid.innerHTML = '<div class="empty-state"><div class="empty-msg">Failed to load</div></div>';
  }
}

function selectLeague(id) {
  if (id === league) { closeOverlay('league-overlay'); return; }
  league = id;
  clearLeagueCache();
  closeOverlay('league-overlay');
  updateTopbarLeague();
  loadCurrentTab();
}

async function updateTopbarLeague() {
  try {
    const list = await loadLeagues();
    const l = list.find(x => x.id === league) || list[0];
    if (!l) return;
    document.getElementById('league-name-topbar').textContent = l.name;
    const logo = document.getElementById('league-logo-topbar');
    logo.src = l.logo; logo.style.opacity = '1';
    document.getElementById('league-name-pill').textContent = l.name;
    const pill = document.getElementById('league-logo-pill');
    pill.src = l.logo; pill.style.opacity = '1';
  } catch {}
}

// ─── Spinner / Empty ──────────────────────────────────────────────────────────
function spin(id) { document.getElementById(id).innerHTML = '<div class="spinner-wrap"><div class="spinner"></div></div>'; }
function empty(id, msg='Nothing here') { document.getElementById(id).innerHTML = `<div class="empty-state"><div class="empty-icon">⚽</div><div class="empty-msg">${msg}</div></div>`; }
function fail(id)  { empty(id, 'Failed to load.'); }

// ─── Match Row (FotMob compact) ───────────────────────────────────────────────
function matchRow(g) {
  const isFinal   = g.status === 'final';
  const isLive    = g.status === 'live';
  const upcoming  = g.status === 'upcoming';

  let statusHtml, centerHtml;
  if (isLive) {
    statusHtml = `<div class="mrow-status live">● LIVE</div>`;
    centerHtml = `<div class="mrow-center"><div class="mrow-score">${g.home.score ?? '—'}<span class="sep"> - </span>${g.away.score ?? '—'}</div></div>`;
  } else if (isFinal) {
    statusHtml = `<div class="mrow-status ft">FT</div>`;
    centerHtml = `<div class="mrow-center"><div class="mrow-score">${g.home.score ?? '—'}<span class="sep"> - </span>${g.away.score ?? '—'}</div></div>`;
  } else {
    statusHtml = `<div class="mrow-status soon">${fmtTime(g.date)}</div>`;
    centerHtml = `<div class="mrow-center"><div class="mrow-time">${fmtDate(g.date)}</div></div>`;
  }

  return `
    <div class="match-row fade-item ${isLive ? 'live-row' : ''}" data-game-id="${g.id}" role="button" tabindex="0">
      ${statusHtml}
      <div class="mrow-home">
        <span class="mrow-name">${g.home.name ?? '—'}</span>
        <img class="mrow-logo" src="${g.home.logo}" loading="lazy" alt="" onerror="this.style.opacity='.15'">
      </div>
      ${centerHtml}
      <div class="mrow-away">
        <img class="mrow-logo" src="${g.away.logo}" loading="lazy" alt="" onerror="this.style.opacity='.15'">
        <span class="mrow-name">${g.away.name ?? '—'}</span>
      </div>
    </div>`;
}

function groupByMatchday(games) {
  const groups = new Map();
  for (const g of games) {
    const key = g.matchday?.name ?? fmtDate(g.date);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(g);
  }
  return groups;
}

// ─── HOME ─────────────────────────────────────────────────────────────────────
async function loadHome() {
  spin('view-home');
  try {
    const [homeData, results] = await Promise.all([
      api(`/api/leagues/${league}/home`),
      api(`/api/leagues/${league}/results`).catch(() => []),
    ]);
    let html = '';

    const featured = homeData.upcomingGames?.[0] ?? results[0];
    if (featured) {
      const isFinal = featured.status === 'final';
      const isLive  = featured.status === 'live';
      html += `
        <div class="home-hero fade-item" data-game-id="${featured.id}">
          <div class="hero-label">${isLive ? '● Live Now' : isFinal ? 'Latest Result' : 'Next Match'} · ${featured.tournament?.name ?? ''}</div>
          <div class="hero-match">
            <div class="hero-team">
              <img class="hero-logo" src="${featured.home.logo}" alt="" onerror="this.style.opacity='.2'">
              <div class="hero-team-name">${featured.home.name ?? '—'}</div>
            </div>
            <div class="hero-center">
              ${isFinal || isLive
                ? `<div class="hero-score">${featured.home.score ?? '—'}<span class="sep"> - </span>${featured.away.score ?? '—'}</div>
                   <div class="hero-status">${isLive ? '● Live' : 'Full Time'}</div>`
                : `<div class="hero-score" style="font-size:28px;letter-spacing:2px;color:var(--text-2)">${fmtTime(featured.date)}</div>
                   <div class="hero-status">${fmtDate(featured.date)}</div>`}
            </div>
            <div class="hero-team">
              <img class="hero-logo" src="${featured.away.logo}" alt="" onerror="this.style.opacity='.2'">
              <div class="hero-team-name">${featured.away.name ?? '—'}</div>
            </div>
          </div>
          <div class="hero-meta">${featured.matchday?.name ?? ''} · ${featured.stadium?.name ?? fmtDate(featured.date)}</div>
        </div>`;
    }

    const recent = results.slice(0, 8);
    if (recent.length > 1) {
      html += '<div class="section-label">Recent Results</div>';
      html += '<div class="results-strip">';
      html += recent.map(g => `
        <div class="result-chip" data-game-id="${g.id}">
          <div class="result-chip-teams">
            <img class="result-chip-logo" src="${g.home.logo}" alt="" onerror="this.style.opacity='.15'">
            <span class="result-chip-score">${g.home.score} - ${g.away.score}</span>
            <img class="result-chip-logo" src="${g.away.logo}" alt="" onerror="this.style.opacity='.15'">
          </div>
          <div class="result-chip-names">
            <span class="result-chip-name">${shortName(g.home.name)}</span>
            <span class="result-chip-sep">v</span>
            <span class="result-chip-name away">${shortName(g.away.name)}</span>
          </div>
        </div>`).join('');
      html += '</div>';
    }

    if (homeData.standings?.length) {
      html += '<div class="section-label">League Table</div>';
      html += '<div style="padding:0 12px">';
      html += standingsGroupHtml(homeData.standings[0], { preview: true });
      html += '</div>';
    }

    if (homeData.latestNews?.length) {
      html += '<div class="section-label">News</div>';
      html += '<div class="news-wrap">';
      html += homeData.latestNews.map(n => `
        <div class="news-card fade-item">
          <img class="news-thumb" src="${n.image}" loading="lazy" alt="" onerror="this.style.opacity='.2'">
          <div class="news-body">
            <div class="news-title">${n.title}</div>
            <div class="news-date">${fmtDate(n.date)}</div>
          </div>
        </div>`).join('');
      html += '</div>';
    }

    document.getElementById('view-home').innerHTML = html || '<div class="empty-state"><div class="empty-msg">Nothing to show.</div></div>';
    bindClickable('view-home');
  } catch(e) { console.error(e); fail('view-home'); }
}

// ─── MATCHES ──────────────────────────────────────────────────────────────────
function loadMatches() { renderMatchesShell(); }

function renderMatchesShell() {
  document.getElementById('view-matches').innerHTML = `
    <div class="pill-tabs">
      <div class="pill-tab ${matchesSubtab==='upcoming'?'active':''}" data-mtab="upcoming">Upcoming</div>
      <div class="pill-tab ${matchesSubtab==='results'?'active':''}" data-mtab="results">Results</div>
    </div>
    <div id="matches-body"><div class="spinner-wrap"><div class="spinner"></div></div></div>`;
  document.querySelectorAll('.pill-tab[data-mtab]').forEach(t => {
    t.addEventListener('click', () => {
      matchesSubtab = t.dataset.mtab;
      document.querySelectorAll('.pill-tab[data-mtab]').forEach(x => x.classList.remove('active'));
      t.classList.add('active');
      loadMatchesBody();
    });
  });
  loadMatchesBody();
}

async function loadMatchesBody() {
  const body = document.getElementById('matches-body');
  if (!body) return;
  body.innerHTML = '<div class="spinner-wrap"><div class="spinner"></div></div>';
  try {
    const endpoint = matchesSubtab === 'upcoming' ? `/api/leagues/${league}/games` : `/api/leagues/${league}/results`;
    const games = await api(endpoint);
    if (!games.length) {
      body.innerHTML = `<div class="empty-state"><div class="empty-icon">📅</div><div class="empty-msg">No ${matchesSubtab === 'upcoming' ? 'upcoming matches' : 'results'} yet.</div></div>`;
      return;
    }
    const groups = groupByMatchday(games);
    let html = '<div class="match-group">';
    for (const [label, list] of groups) {
      html += `<div class="match-group-header">${label}</div>`;
      html += `<div class="match-block">`;
      html += list.map(matchRow).join('');
      html += `</div>`;
    }
    html += '</div>';
    body.innerHTML = html;
    bindClickable('matches-body');
  } catch(e) {
    console.error(e);
    body.innerHTML = '<div class="empty-state"><div class="empty-icon">⚠️</div><div class="empty-msg">Failed to load.</div></div>';
  }
}

// ─── STANDINGS ────────────────────────────────────────────────────────────────
async function loadStandings() {
  spin('view-standings');
  try {
    const d = await api(`/api/leagues/${league}/standings`);
    const groups = d.groups ?? [];
    let html = '<div class="standings-wrap">';
    html += `<div class="zone-legend">
      <div class="zone-item"><div class="zone-dot" style="background:var(--champ-zone)"></div>Champion / Advance</div>
      <div class="zone-item"><div class="zone-dot" style="background:var(--promo-zone)"></div>Promotion</div>
      <div class="zone-item"><div class="zone-dot" style="background:var(--relegation)"></div>Relegation</div>
    </div>`;
    html += groups.length ? groups.map(g => standingsGroupHtml(g)).join('') : '<div class="empty-state"><div class="empty-msg">Standings not available.</div></div>';
    html += '</div>';
    document.getElementById('view-standings').innerHTML = html;
  } catch(e) { console.error(e); fail('view-standings'); }
}

function standingsGroupHtml(group, { preview = false } = {}) {
  const rows = preview ? (group.rows ?? []).slice(0, 5) : (group.rows ?? []);
  const total = rows.length;
  let html = '<div class="group-card fade-item">';
  if (group.group) html += `<div class="group-name-row">Group ${group.group}</div>`;
  html += `<div class="standings-header"><span>#</span><span>Team</span><span>P</span><span>W</span><span>D</span><span>L</span><span>GD</span><span>Pts</span></div>`;
  rows.forEach((r, i) => {
    const pos = r.position ?? i + 1;
    const gd = r.goalDiff;
    const gdClass = gd > 0 ? 'pos' : gd < 0 ? 'neg' : '';
    const zone = getZoneClass(pos, total);
    html += `
      <div class="standings-row ${zone}">
        <span class="s-pos">${pos}</span>
        <span class="s-team-cell">
          <img class="s-logo" src="${r.team.logo}" loading="lazy" alt="" onerror="this.style.opacity='.15'">
          <span class="s-team-name">${r.team.name ?? '—'}</span>
        </span>
        <span>${r.played}</span><span>${r.won}</span><span>${r.drawn}</span><span>${r.lost}</span>
        <span class="s-gd ${gdClass}">${gd > 0 ? '+' : ''}${gd}</span>
        <span class="s-pts">${r.points}</span>
      </div>`;
  });
  html += '</div>';
  return html;
}

function getZoneClass(pos, total) {
  if (pos === 1) return 'zone-champ';
  if (pos === 2 && total >= 4) return 'zone-promo';
  if (pos >= total - 1 && total >= 4) return 'zone-relegate';
  return '';
}

// ─── PLAYERS ──────────────────────────────────────────────────────────────────
function loadPlayers() { renderPlayersShell(); }

function renderPlayersShell() {
  document.getElementById('view-players').innerHTML = `
    <div class="pill-tabs">
      <div class="pill-tab ${playersSubtab==='goals'?'active':''}" data-ptab="goals">${ICON.goalLg} Goals</div>
      <div class="pill-tab ${playersSubtab==='assists'?'active':''}" data-ptab="assists">${ICON.assistLg} Assists</div>
      <div class="pill-tab ${playersSubtab==='games'?'active':''}" data-ptab="games">${ICON.gamesLg} Apps</div>
    </div>
    <div id="players-body"><div class="spinner-wrap"><div class="spinner"></div></div></div>`;
  document.querySelectorAll('.pill-tab[data-ptab]').forEach(t => {
    t.addEventListener('click', () => {
      playersSubtab = t.dataset.ptab;
      document.querySelectorAll('.pill-tab[data-ptab]').forEach(x => x.classList.remove('active'));
      t.classList.add('active');
      loadPlayersBody();
    });
  });
  loadPlayersBody();
}

async function loadPlayersBody() {
  const body = document.getElementById('players-body');
  if (!body) return;
  body.innerHTML = '<div class="spinner-wrap"><div class="spinner"></div></div>';
  try {
    const players = await api(`/api/leagues/${league}/players`);
    if (!players.length) { body.innerHTML = '<div class="empty-state"><div class="empty-msg">No players.</div></div>'; return; }
    const sorted = [...players].sort((a, b) => {
      if (playersSubtab === 'goals')   return (b.goals ?? 0) - (a.goals ?? 0);
      if (playersSubtab === 'assists') return (b.assists ?? 0) - (a.assists ?? 0);
      return (b.gamesPlayed ?? 0) - (a.gamesPlayed ?? 0);
    }).slice(0, 25);

    let html = '<div class="players-wrap">';
    sorted.forEach((p, i) => {
      const main = playersSubtab === 'goals' ? p.goals : playersSubtab === 'assists' ? p.assists : p.gamesPlayed;
      const mainIcon = playersSubtab === 'goals' ? ICON.goalLg : playersSubtab === 'assists' ? ICON.assistLg : ICON.gamesLg;
      html += `
        <div class="player-row fade-item" data-player-id="${p.id}">
          <span class="p-rank ${i < 3 ? 'top3' : ''}">${i + 1}</span>
          <img class="p-photo" src="${playerPhoto(p.id)}" loading="lazy" alt="" onerror="this.src='${playerPhoto('default')}'">
          <div class="p-info">
            <div class="p-name">${p.firstName} ${p.lastName}</div>
            <div class="p-meta"><span class="p-position-badge">${abbrevPos(p.position)}</span></div>
          </div>
          <div class="p-stat-bubble">
            <div class="p-stat-icon">${mainIcon}</div>
            <div class="p-stat-num">${main ?? 0}</div>
          </div>
          <div class="p-secondary-stats">
            ${playersSubtab!=='goals'   ? `<div class="p-sec-stat"><div class="p-sec-val">${p.goals??0}</div><div class="p-sec-lbl">G</div></div>` : ''}
            ${playersSubtab!=='assists' ? `<div class="p-sec-stat"><div class="p-sec-val">${p.assists??0}</div><div class="p-sec-lbl">A</div></div>` : ''}
            ${playersSubtab!=='games'   ? `<div class="p-sec-stat"><div class="p-sec-val">${p.gamesPlayed??0}</div><div class="p-sec-lbl">GP</div></div>` : ''}
          </div>
        </div>`;
    });
    html += '</div>';
    body.innerHTML = html;
    body.querySelectorAll('[data-player-id]').forEach(r => r.addEventListener('click', () => openPlayerDetail(r.dataset.playerId)));
  } catch(e) { console.error(e); body.innerHTML = '<div class="empty-state"><div class="empty-msg">Failed to load.</div></div>'; }
}

function abbrevPos(pos) {
  if (!pos) return '?';
  const m = { 'Portero':'GK','Goalkeeper':'GK','Defensa':'DEF','Defender':'DEF','Mediocampo':'MID','Midfielder':'MID','Delantero':'FWD','Forward':'FWD' };
  return m[pos] ?? pos.slice(0,3).toUpperCase();
}

// ─── GAME DETAIL ──────────────────────────────────────────────────────────────
async function openGameDetail(gameId) {
  openOverlay('game-overlay');
  document.getElementById('game-detail-content').innerHTML = '<div class="spinner-wrap" style="padding:80px"><div class="spinner"></div></div>';
  gameDetailTab = 'lineup';
  try {
    const g = await api(`/api/games/${gameId}`);
    renderGameDetailShell(g);
  } catch(e) {
    console.error(e);
    document.getElementById('game-detail-content').innerHTML = '<div class="empty-state"><div class="empty-msg">Failed to load match.</div></div>';
  }
}

function renderGameDetailShell(g) {
  const isFinal = g.status === 'final';
  const isLive  = g.status === 'live';
  const upcoming = g.status === 'upcoming';

  const scoreSection = upcoming
    ? `<div class="gd-score" style="font-size:30px;letter-spacing:2px;color:var(--text-2)">${fmtTime(g.date)}</div><div class="gd-status">${fmtDate(g.date)}</div>`
    : `<div class="gd-score">${g.home.score ?? '—'}<span class="sep"> - </span>${g.away.score ?? '—'}</div><div class="gd-status">${isLive ? '● Live' : 'Full Time'}</div>`;

  document.getElementById('game-detail-content').innerHTML = `
    <div class="gd-header">
      <div class="gd-tournament-row">${g.tournament?.name ?? ''} · ${g.matchday?.name ?? ''}</div>
      <div class="gd-teams">
        <div class="gd-team">
          <img class="gd-logo" src="${g.home.logo}" alt="" onerror="this.style.opacity='.2'">
          <div class="gd-team-name">${g.home.name ?? '—'}</div>
        </div>
        <div class="gd-score-center">${scoreSection}</div>
        <div class="gd-team">
          <img class="gd-logo" src="${g.away.logo}" alt="" onerror="this.style.opacity='.2'">
          <div class="gd-team-name">${g.away.name ?? '—'}</div>
        </div>
      </div>
      <div class="gd-date">${fmtDateLong(g.date)}${g.stadium ? ' · ' + (g.stadium.name ?? '') : ''}</div>
    </div>
    <div class="gd-tabs" id="gd-tabs">
      <div class="gd-tab active" data-gtab="lineup">Lineup</div>
      <div class="gd-tab" data-gtab="stats">Stats</div>
      <div class="gd-tab" data-gtab="players">Players</div>
    </div>
    <div class="gd-body" id="gd-body"></div>`;

  document.querySelectorAll('.gd-tab[data-gtab]').forEach(t => {
    t.addEventListener('click', () => {
      document.querySelectorAll('.gd-tab').forEach(x => x.classList.remove('active'));
      t.classList.add('active');
      gameDetailTab = t.dataset.gtab;
      renderGDBody(g);
    });
  });
  renderGDBody(g);
}

function renderGDBody(g) {
  const body = document.getElementById('gd-body');
  if (!body) return;
  if (gameDetailTab === 'lineup')  body.innerHTML = renderPitchLineup(g);
  else if (gameDetailTab === 'stats')   body.innerHTML = renderStatsTab(g);
  else if (gameDetailTab === 'players') body.innerHTML = renderPlayersTab(g);
  // re-trigger tab-in animation
  body.style.animation = 'none';
  body.offsetHeight; // reflow
  body.style.animation = '';
  body.querySelectorAll('.pitch-player-node[data-player-id]').forEach(n =>
    n.addEventListener('click', () => openPlayerDetail(n.dataset.playerId, league)));
  body.querySelectorAll('.sub-row[data-player-id]').forEach(n =>
    n.addEventListener('click', () => openPlayerDetail(n.dataset.playerId, league)));
}

// ─── PITCH LINEUP ─────────────────────────────────────────────────────────────
function renderPitchLineup(g) {
  const lineups = Array.isArray(g.lineups) ? g.lineups : [];

  if (!lineups.length) {
    return `<div class="empty-state"><div class="empty-icon">📋</div><div class="empty-msg">${g.status === 'upcoming' ? 'Lineups not announced yet' : 'Lineups not available'}</div></div>`;
  }

  // Get player stats and build lookup maps
  const stats = getStats(g);
  // Map by jersey number AND by lowercase full name
  const statsByJersey = new Map();
  const statsByName   = new Map();
  for (const s of stats) {
    if (s.jerseyNumber) statsByJersey.set(s.jerseyNumber, s);
    const key = (s.firstName + ' ' + s.lastName).toLowerCase().trim();
    statsByName.set(key, s);
  }
  function getStat(player) {
    const key = (player.firstName + ' ' + player.lastName).toLowerCase().trim();
    return statsByName.get(key) ?? null;
  }

  // Split by team
  let homePlayers = lineups.filter(p => p.teamId === g.home.id);
  let awayPlayers = lineups.filter(p => p.teamId === g.away.id);

  // Fallback if IDs don't match — split by teamId values
  if (!homePlayers.length && !awayPlayers.length) {
    const tids = [...new Set(lineups.map(p => p.teamId).filter(Boolean))];
    homePlayers = lineups.filter(p => p.teamId === tids[0]);
    awayPlayers = lineups.filter(p => p.teamId === tids[1]);
  }

  const isStarter = p => p.participation?.id === 1 || p.participation?.name === 'STARTER';

  const homeStart = homePlayers.filter(isStarter);
  const homeSubs  = homePlayers.filter(p => !isStarter(p));
  const awayStart = awayPlayers.filter(isStarter);
  const awaySubs  = awayPlayers.filter(p => !isStarter(p));

  // Group starters by position for formation rows
  function groupByPos(players) {
    const order = { POR:0, DEF:1, MED:2, DEL:3 };
    const groups = {};
    for (const p of players) {
      const posKey = p.position ?? 'MED';
      const bucket = order[posKey] ?? 2;
      if (!groups[bucket]) groups[bucket] = [];
      groups[bucket].push(p);
    }
    return Object.entries(groups).sort(([a],[b]) => Number(a)-Number(b)).map(([,v]) => v);
  }

  // Compute avg rating for a group of starters
  function avgRating(starters) {
    const rated = starters.map(p => {
      const s = getStat(p);
      return s?.points > 0 ? ptsToRating(s.points) : null;
    }).filter(Boolean);
    if (!rated.length) return null;
    return (rated.reduce((a,b) => a + parseFloat(b), 0) / rated.length).toFixed(1);
  }

  function renderPitchTeam(starters, reversed) {
    const rows = groupByPos(starters);
    const displayRows = reversed ? [...rows].reverse() : rows;
    let html = `<div class="pitch-half ${reversed ? 'home' : 'away'}">`;
    if (!reversed) html += `<div class="pitch-penalty-area"></div>`;
    displayRows.forEach(row => {
      html += `<div class="pitch-row">`;
      row.forEach(p => { html += renderPlayerNode(p, getStat(p)); });
      html += `</div>`;
    });
    if (reversed) html += `<div class="pitch-penalty-area"></div>`;
    html += `</div>`;
    return html;
  }

  function renderPlayerNode(player, stat) {
    const pts    = stat?.points ?? 0;
    const goals  = stat?.goals ?? 0;
    const yellow = stat?.yellowCards ?? 0;
    const red    = stat?.redCards ?? 0;
    const captain= stat?.captain ?? false;
    const jersey = stat?.jerseyNumber ?? player.jerseyNumber ?? '';
    const subMin = stat?.subbedOutMinute ?? null;
    const rating = pts > 0 ? ptsToRating(pts) : '5.0';
    const rClass = ratingClass(rating);
    const photoUrl = playerPhoto(player.playerId);
    const firstName = (player.firstName ?? '').split(' ')[0];
    const lastName  = (player.lastName  ?? '').split(' ')[0];
    const goalIcon  = goals > 0 ? `<span style="position:absolute;top:-6px;right:-5px;display:flex;gap:1px;z-index:4">${Array(Math.min(goals,2)).fill(ICON.goalSmall).join('')}</span>` : '';

    return `
      <div class="pitch-player-node" data-player-id="${player.playerId}">
        <div class="pitch-photo-wrap">
          <img class="pitch-photo" src="${photoUrl}" loading="lazy" alt="${firstName}" onerror="this.src='${playerPhoto('default')}'">
          <div class="pitch-rating ${rClass}">${rating}</div>
          ${yellow ? `<div class="pitch-card yellow"></div>` : ''}
          ${red    ? `<div class="pitch-card red"></div>` : ''}
          ${captain ? `<div class="pitch-captain">C</div>` : ''}
          ${subMin ? `<div class="pitch-sub-out">${subMin}'</div>` : goalIcon}
        </div>
        <div class="pitch-player-label">
          ${jersey ? `<span class="pitch-player-jersey">${jersey}</span>` : ''}
          <span class="pitch-player-name">${firstName} ${lastName}</span>
        </div>
      </div>`;
  }

  // Team header (FotMob style — above field)
  function renderTeamHeader(starters, logo, name, reversed) {
    const rows = groupByPos(starters);
    const formation = rows.map(r => r.length).join('-');
    const avg = avgRating(starters);
    const rc = avg ? ratingClass(parseFloat(avg)) : 'r-gray';
    if (reversed) {
      return `
        <div class="pitch-th-side away">
          <img class="pitch-th-logo" src="${logo}" alt="" onerror="this.style.opacity='.3'">
          <div style="display:flex;flex-direction:column;align-items:flex-end;gap:1px">
            <span class="pitch-th-name">${name}</span>
            <span class="pitch-th-formation">${formation}</span>
          </div>
          ${avg ? `<div class="pitch-th-rating ${rc}">${avg}</div>` : ''}
        </div>`;
    }
    return `
      <div class="pitch-th-side home">
        ${avg ? `<div class="pitch-th-rating ${rc}">${avg}</div>` : ''}
        <img class="pitch-th-logo" src="${logo}" alt="" onerror="this.style.opacity='.3'">
        <div style="display:flex;flex-direction:column;gap:1px">
          <span class="pitch-th-name">${name}</span>
          <span class="pitch-th-formation">${formation}</span>
        </div>
      </div>`;
  }

  const subArrowSvg = `<svg viewBox="0 0 12 12" fill="none"><path d="M6 2v8M2 6l4 4 4-4" stroke="#22c55e" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  const renderSubCol = (subs, label) => {
    if (!subs.length) return `<div class="subs-col"></div>`;
    let c = `<div class="subs-col">`;
    subs.forEach(p => {
      const stat = getStat(p);
      const pts = stat?.points ?? 0;
      const rating = pts > 0 ? ptsToRating(pts) : null;
      const rClass = rating ? ratingClass(rating) : null;
      const yellow = stat?.yellowCards ?? 0;
      const red = stat?.redCards ?? 0;
      const subMin = stat?.subbedInMinute ?? null;
      const jersey = stat?.jerseyNumber ?? p.jerseyNumber ?? '';
      const posLabel = p.position === 'POR' ? 'Goalkeeper' : p.position === 'DEF' ? 'Defender' : p.position === 'MED' ? 'Midfielder' : p.position === 'DEL' ? 'Attacker' : (p.position ?? '');
      c += `
        <div class="sub-row" data-player-id="${p.playerId}" style="cursor:pointer">
          <img class="sub-photo" src="${playerPhoto(p.playerId)}" loading="lazy" alt="" onerror="this.src='${playerPhoto('default')}'">
          <div class="sub-info">
            <div class="sub-name-row">
              ${jersey ? `<span class="sub-jersey">${jersey}</span>` : ''}
              <span class="sub-name">${p.firstName} ${p.lastName}</span>
              ${yellow ? ICON.yellowCard : ''}${red ? ICON.redCard : ''}
            </div>
            <span class="sub-pos-tag">${posLabel}</span>
          </div>
          <div class="sub-right">
            ${rating ? `<span class="sub-rating-pill ${rClass}">${rating}</span>` : ''}
            ${subMin ? `<span class="sub-time">${subMin}'</span><div class="sub-arrow">${subArrowSvg}</div>` : ''}
          </div>
        </div>`;
    });
    c += `</div>`;
    return c;
  };

  let html = `<div class="pitch-wrapper">`;

  // FotMob-style team header bar
  html += `<div class="pitch-team-header">
    ${renderTeamHeader(homeStart, g.home.logo, g.home.name, false)}
    ${renderTeamHeader(awayStart, g.away.logo, g.away.name, true)}
  </div>`;

  html += `<div class="pitch-field">`;
  html += renderPitchTeam(awayStart, false);
  html += `<div class="pitch-divider"></div>`;
  html += renderPitchTeam(homeStart, true);
  html += `</div>`; // pitch-field

  if (homeSubs.length || awaySubs.length) {
    html += `<div class="subs-panel">`;
    html += `<div class="subs-title">Substitutes</div>`;
    html += `<div class="subs-cols">`;
    html += renderSubCol(homeSubs, g.home.name);
    html += renderSubCol(awaySubs, g.away.name);
    html += `</div></div>`;
  }

  html += `</div>`; // pitch-wrapper

  // DNP section
  const allStats = getStats(g);
  const dnpHome = allStats.filter(p => p.participation === 'ATTENDED_NOT_PLAYED' && (p.team?.id ?? p.teamId) === g.home.id);
  const dnpAway = allStats.filter(p => p.participation === 'ATTENDED_NOT_PLAYED' && (p.team?.id ?? p.teamId) !== g.home.id);

  if (dnpHome.length || dnpAway.length) {
    const dnpCol = (list) => {
      if (!list.length) return `<div class="subs-col"></div>`;
      let c = `<div class="subs-col">`;
      list.forEach(p => {
        const posLabel = p.position === 'POR' ? 'Goalkeeper' : p.position === 'DEF' ? 'Defender' : p.position === 'MED' ? 'Midfielder' : p.position === 'DEL' ? 'Attacker' : (p.position ?? '');
        c += `
          <div class="sub-row" style="opacity:.5">
            <img class="sub-photo" src="${playerPhoto(p.playerId ?? '')}" loading="lazy" alt="" onerror="this.src='${playerPhoto('default')}'">
            <div class="sub-info">
              <span class="sub-name">${p.firstName} ${p.lastName}</span>
              <span class="sub-pos-tag">${posLabel}</span>
            </div>
          </div>`;
      });
      c += `</div>`;
      return c;
    };
    html += `<div class="subs-panel" style="border-top:1px solid var(--border)">
      <div class="subs-title" style="color:var(--text-3)">Bench</div>
      <div class="subs-cols">${dnpCol(dnpHome)}${dnpCol(dnpAway)}</div>
    </div>`;
  }

  return html;
}

// ─── STATS TAB ────────────────────────────────────────────────────────────────
function renderStatsTab(g) {
  const players = getStats(g);
  if (!players.length) {
    return `<div class="empty-state"><div class="empty-icon">📊</div><div class="empty-msg">${g.status === 'upcoming' ? 'Stats available after kickoff' : 'No statistics available'}</div></div>`;
  }

  const home = players.filter(p => (p.teamId ?? p.team?.id) === g.home.id);
  const away = players.filter(p => (p.teamId ?? p.team?.id) !== g.home.id);
  const sum  = (arr, k) => arr.reduce((s,p) => s+(p[k]??0), 0);

  const barItems = [
    { label: 'Goals',        h: sum(home,'goals'),        a: sum(away,'goals') },
    { label: 'Assists',      h: sum(home,'assists'),       a: sum(away,'assists') },
    { label: 'Clean Sheets', h: home.filter(p=>p.isCleanSheet).length > 0 ? 1 : 0, a: away.filter(p=>p.isCleanSheet).length > 0 ? 1 : 0 },
    { label: 'Yellow Cards', h: sum(home,'yellowCards'),   a: sum(away,'yellowCards') },
    { label: 'Red Cards',    h: sum(home,'redCards'),      a: sum(away,'redCards') },
    { label: 'Own Goals',    h: sum(home,'ownGoals'),      a: sum(away,'ownGoals') },
  ].filter(s => s.h > 0 || s.a > 0);

  let html = `
    <div class="stats-header">
      <div class="stats-header-name">${g.home.name}</div>
      <div class="stats-header-label">Stats</div>
      <div class="stats-header-name right">${g.away.name}</div>
    </div>
    <div class="stat-bar-group">`;

  for (const { label, h, a } of barItems) {
    const tot = h + a || 1;
    const hp = Math.round((h/tot)*100);
    html += `
      <div class="stat-bar-row">
        <span class="stat-bar-val">${h}</span>
        <div class="stat-bar-inner">
          <div class="stat-bar-label">${label}</div>
          <div class="stat-bar-track">
            <div class="stat-bar-fill home" style="width:${hp}%"></div>
            <div class="stat-bar-fill away" style="width:${100-hp}%"></div>
          </div>
        </div>
        <span class="stat-bar-val">${a}</span>
      </div>`;
  }
  html += `</div>`;

  // Goal scorers
  const scorers = players.filter(p => (p.goals ?? 0) > 0).sort((a,b) => b.goals - a.goals);
  if (scorers.length) {
    html += `<div class="events-section">`;
    html += `<div class="events-title">Goal Scorers</div>`;
    html += scorers.map(p => {
      const isHome = (p.teamId ?? p.team?.id) === g.home.id;
      return `
        <div class="event-player-row">
          ${isHome ? `<img class="ep-photo" src="${playerPhoto(p.id ?? '')}" loading="lazy" onerror="this.src='${playerPhoto('default')}'">` : `<div style="width:30px;flex-shrink:0"></div>`}
          ${isHome ? `<div class="ep-info"><div class="ep-name">${p.firstName} ${p.lastName}</div><div class="ep-team">${g.home.name}</div></div>` : `<div class="ep-info"></div>`}
          <div class="ep-events">${Array(p.goals).fill(ICON.goal).join('')}</div>
          ${!isHome ? `<div class="ep-info" style="text-align:right"><div class="ep-name">${p.firstName} ${p.lastName}</div><div class="ep-team">${g.away.name}</div></div>` : `<div class="ep-info"></div>`}
          ${!isHome ? `<img class="ep-photo" src="${playerPhoto(p.id ?? '')}" loading="lazy" onerror="this.src='${playerPhoto('default')}'">` : `<div style="width:30px;flex-shrink:0"></div>`}
        </div>`;
    }).join('');
    html += `</div>`;
  }

  return html;
}

// ─── PLAYERS TAB (in game detail) ─────────────────────────────────────────────
function renderPlayersTab(g) {
  const players = getStats(g);
  if (!players.length) {
    return `<div class="empty-state"><div class="empty-icon">👤</div><div class="empty-msg">Player stats not available</div></div>`;
  }

  const homeId = g.home.id;
  const homePlayers = players.filter(p => (p.team?.id ?? p.teamId) === homeId);
  const awayPlayers = players.filter(p => (p.team?.id ?? p.teamId) !== homeId);

  const participationLabel = { STARTER: 'XI', SUBSTITUTE: 'SUB', ATTENDED_NOT_PLAYED: 'DNP' };
  const participationOrder = { STARTER: 0, SUBSTITUTE: 1, ATTENDED_NOT_PLAYED: 2 };

  const sortedByParticipation = list => [...list].sort((a,b) => {
    const pa = participationOrder[a.participation] ?? 1;
    const pb = participationOrder[b.participation] ?? 1;
    if (pa !== pb) return pa - pb;
    return (b.points ?? 0) - (a.points ?? 0);
  });

  const playerRow = p => {
    const pts = p.points ?? 0;
    const rating = pts > 0 ? ptsToRating(pts) : null;
    const rClass = rating ? ratingClass(rating) : 'r-gray';
    const isDNP = p.participation === 'ATTENDED_NOT_PLAYED';
    const isSub = p.participation === 'SUBSTITUTE';
    const pLabel = participationLabel[p.participation] ?? 'SUB';
    const photo = playerPhoto(p.playerId ?? p.id ?? '');

    const events = [
      p.goals > 0   ? `<span class="prow-event">${ICON.goalSmall.replace('width="13"','width="11"').replace('height="13"','height="11"')} ${p.goals > 1 ? p.goals : ''}</span>` : '',
      p.assists > 0 ? `<span class="prow-event assist">${ICON.assist.replace('width="15"','width="11"').replace('height="15"','height="11"')} ${p.assists > 1 ? p.assists : ''}</span>` : '',
      p.ownGoals > 0 ? `<span class="prow-event og">${ICON.ownGoal} ${p.ownGoals > 1 ? p.ownGoals : ''}</span>` : '',
      p.yellowCards > 0 ? `<span class="prow-event">${ICON.yellowCard}</span>` : '',
      p.redCards > 0    ? `<span class="prow-event">${ICON.redCard}</span>`    : '',
      p.isCleanSheet ? `<span class="prow-event cs">CS</span>` : '',
      p.penaltiesStopped > 0 ? `<span class="prow-event ps">P.S</span>` : '',
    ].filter(Boolean).join('');

    return `
      <div class="prow ${isDNP ? 'prow-dnp' : ''}">
        <span class="prow-badge ${isSub ? 'prow-badge-sub' : isDNP ? 'prow-badge-dnp' : ''}">${pLabel}</span>
        <img class="prow-photo" src="${photo}" loading="lazy" alt="" onerror="this.src='${playerPhoto('default')}'">
        <div class="prow-info">
          <div class="prow-name">${p.captain ? '<span class="prow-captain">C</span>' : ''}${p.firstName ?? ''} ${p.lastName ?? ''}</div>
          <div class="prow-meta">${p.jerseyNumber ? `<span class="prow-jersey">#${p.jerseyNumber}</span>` : ''}${p.position ? `<span>${p.position}</span>` : ''}</div>
        </div>
        <div class="prow-events">${events}</div>
        ${rating ? `<div class="prow-rating ${rClass}">${rating}</div>` : '<div></div>'}
      </div>`;
  };

  const teamBlock = (list, teamName, teamLogo) => {
    if (!list.length) return '';
    const sorted = sortedByParticipation(list);
    return `
      <div class="pteam-block">
        <div class="pteam-header">
          <img class="pteam-logo" src="${teamLogo}" alt="" onerror="this.style.opacity='.2'">
          <span class="pteam-name">${teamName}</span>
        </div>
        <div class="prow-table-head">
          <span></span><span></span><span>Player</span><span>Events</span><span>Rtg</span>
        </div>
        ${sorted.map(playerRow).join('')}
      </div>`;
  };

  return `<div class="players-detail-wrap">
    ${teamBlock(homePlayers, g.home.name, g.home.logo)}
    ${teamBlock(awayPlayers, g.away.name, g.away.logo)}
  </div>`;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getStats(g) {
  if (Array.isArray(g.playerStatistics) && g.playerStatistics.length) return g.playerStatistics;
  if (Array.isArray(g.statistics) && g.statistics.length) return g.statistics;
  return [];
}

// ─── PLAYER DETAIL ────────────────────────────────────────────────────────────
async function openPlayerDetail(playerId, site) {
  openOverlay('player-overlay');
  const wrap = document.getElementById('player-detail-content');
  wrap.innerHTML = '<div class="spinner-wrap" style="padding:80px"><div class="spinner"></div></div>';
  const s = site || league;
  try {
    const [p, seasonArr, history, awards, records] = await Promise.all([
      api(`/api/players/${playerId}`),
      api(`/api/leagues/${s}/players/${playerId}/statistics`).catch(() => []),
      api(`/api/leagues/${s}/players/${playerId}/history`).catch(() => []),
      api(`/api/leagues/${s}/players/${playerId}/awards`).catch(() => ({})),
      api(`/api/leagues/${s}/players/${playerId}/records`).catch(() => ({})),
    ]);

    const ts = Array.isArray(seasonArr) ? (seasonArr[0] ?? {}) : (seasonArr ?? {});
    const pts    = ts.points ?? 0;
    const rating = pts > 0 ? ptsToRating(pts) : '5.0';
    const rClass = ratingClass(rating);
    const goals   = ts.goals ?? 0;
    const assists = ts.assists ?? 0;
    const games   = ts.gamesPlayed ?? 0;
    const yellow  = ts.yellowCards ?? 0;
    const red     = ts.redCards ?? 0;
    const jersey  = ts.jerseyNumber ?? p.team.jerseyNumber ?? '';

    // W/L/D from records object (keys are site names)
    const recVals = Object.values(records ?? {});
    const rec = recVals.length ? recVals.reduce((a, b) => ({
      won: (a.won??0)+(b.won??0), lost: (a.lost??0)+(b.lost??0), tied: (a.tied??0)+(b.tied??0)
    }), {won:0,lost:0,tied:0}) : null;

    // Team of the week awards
    const totw = (awards?.teamsOfTheWeek ?? []);

    // Per-game history — only played games (points field exists, game finalized)
    const gameLogs = Array.isArray(history)
      ? history.filter(h => h.game?.gameFinalized).sort((a,b) => (b.matchday?.matchdayOrder??0)-(a.matchday?.matchdayOrder??0))
      : [];

    const gameLogHtml = gameLogs.length ? `
      <div class="pd-section-title">Match Log</div>
      <div class="pd-game-log">
        ${gameLogs.map(h => {
          const gPts = h.points ?? 0;
          const gRating = gPts > 0 ? ptsToRating(gPts) : '5.0';
          const gClass  = ratingClass(gRating);
          const isHome  = h.team?.id === h.game?.teamOne?.id;
          const opp     = isHome ? h.game?.teamTwo : h.game?.teamOne;
          const myGoals = isHome ? h.game?.goalsTeamOne : h.game?.goalsTeamTwo;
          const oppGoals= isHome ? h.game?.goalsTeamTwo : h.game?.goalsTeamOne;
          const result  = myGoals > oppGoals ? 'W' : myGoals < oppGoals ? 'L' : 'D';
          const rCol    = result==='W'?'#16a34a':result==='L'?'#ef4444':'#6b7280';
          return `
          <div class="pd-game-row">
            <span class="pd-game-result" style="color:${rCol}">${result}</span>
            <span class="pd-game-score">${myGoals}-${oppGoals}</span>
            <span class="pd-game-opp">${opp?.name ?? '—'}</span>
            <span class="pd-game-md">${h.matchday?.name ?? ''}</span>
            <div class="pitch-rating ${gClass}" style="position:static;min-width:32px;height:18px;font-size:10px">${gRating}</div>
            ${h.goals ? `<span style="font-size:11px">${ICON.goalSmall.repeat(Math.min(h.goals,3))}</span>` : ''}
            ${h.yellowCards ? ICON.yellowCard : ''}${h.redCards ? ICON.redCard : ''}
          </div>`;
        }).join('')}
      </div>` : '';

    const totwHtml = totw.length ? `
      <div class="pd-section-title">Team of the Week</div>
      ${totw.map(a => `<div class="pd-bio-row"><span class="pd-bio-label">${a.matchdayName}</span><span class="pd-bio-val">${a.tournamentName}</span></div>`).join('')}
    ` : '';

    wrap.innerHTML = `
      <div class="pd-header">
        <img class="pd-photo" src="${p.photo}" alt="" onerror="this.src='${playerPhoto('default')}'">
        <div class="pd-info">
          <div class="pd-name">${p.firstName} ${p.lastName}</div>
          <div class="pd-team"><img class="pd-team-logo" src="${p.team.logo}" alt="" onerror="this.style.opacity='.2'">${p.team.name ?? '—'}${jersey ? ' · #'+jersey : ''}</div>
          <div style="display:flex;align-items:center;gap:8px;margin-top:6px">
            <div class="pd-position-badge">${p.position ?? '—'}</div>
            <div class="pitch-rating ${rClass}" style="position:static;min-width:36px;height:22px;font-size:12px">${rating}</div>
          </div>
        </div>
      </div>
      <div class="pd-stats-grid">
        <div class="pd-stat-cell"><div class="pd-stat-val">${goals}</div><div class="pd-stat-lbl">Goals</div></div>
        <div class="pd-stat-cell"><div class="pd-stat-val">${assists}</div><div class="pd-stat-lbl">Assists</div></div>
        <div class="pd-stat-cell"><div class="pd-stat-val">${games}</div><div class="pd-stat-lbl">Games</div></div>
        <div class="pd-stat-cell"><div class="pd-stat-val">${pts||'—'}</div><div class="pd-stat-lbl">Pts</div></div>
        ${yellow ? `<div class="pd-stat-cell"><div class="pd-stat-val" style="color:#fbbf24">${yellow}</div><div class="pd-stat-lbl">Yellow</div></div>` : ''}
        ${red    ? `<div class="pd-stat-cell"><div class="pd-stat-val" style="color:#ef4444">${red}</div><div class="pd-stat-lbl">Red</div></div>` : ''}
        ${rec    ? `<div class="pd-stat-cell"><div class="pd-stat-val" style="font-size:13px"><span style="color:#16a34a">${rec.won}W</span> <span style="color:#6b7280">${rec.tied}D</span> <span style="color:#ef4444">${rec.lost}L</span></div><div class="pd-stat-lbl">Record</div></div>` : ''}
      </div>
      <div class="pd-bio">
        ${p.dateOfBirth ? `<div class="pd-bio-row"><span class="pd-bio-label">Age</span><span class="pd-bio-val">${fmtAge(p.dateOfBirth)} years old</span></div>` : ''}
        ${p.country     ? `<div class="pd-bio-row"><span class="pd-bio-label">Nationality</span><span class="pd-bio-val">${p.country}</span></div>` : ''}
        ${ts.tournamentName ? `<div class="pd-bio-row"><span class="pd-bio-label">Tournament</span><span class="pd-bio-val">${ts.tournamentName}</span></div>` : ''}
      </div>
      ${totwHtml}
      ${gameLogHtml}`;
  } catch(e) {
    console.error(e);
    wrap.innerHTML = '<div class="empty-state"><div class="empty-msg">Failed to load player.</div></div>';
  }
}

// ─── Click binding ────────────────────────────────────────────────────────────
function bindClickable(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.querySelectorAll('[data-game-id]').forEach(node => {
    node.addEventListener('click', () => openGameDetail(node.dataset.gameId));
    node.addEventListener('keydown', e => { if (e.key === 'Enter') openGameDetail(node.dataset.gameId); });
  });
}

// ─── TEAMS ────────────────────────────────────────────────────────────────────
async function loadTeams() {
  spin('view-teams');
  try {
    const teams = await api(`/api/leagues/${league}/teams`);
    if (!teams.length) { empty('view-teams', 'No teams found.'); return; }
    let html = `<div class="teams-grid stagger">`;
    html += teams.map(t => `
      <div class="team-card fade-item">
        <img class="team-card-logo" src="${t.logo}" loading="lazy" alt="${t.name}" onerror="this.style.opacity='.15'">
        <div class="team-card-name">${t.name}</div>
        ${t.longName && t.longName !== t.name ? `<div class="team-card-sub">${t.longName}</div>` : ''}
      </div>`).join('');
    html += '</div>';
    document.getElementById('view-teams').innerHTML = html;
  } catch(e) { console.error(e); fail('view-teams'); }
}

// ─── Tab nav ──────────────────────────────────────────────────────────────────
const PAGE_TITLES = { home: 'Home', matches: 'Matches', standings: 'Standings', teams: 'Teams', players: 'Players' };
const loaders = { home: loadHome, matches: loadMatches, standings: loadStandings, teams: loadTeams, players: loadPlayers };

function loadCurrentTab() { loaders[currentTab]?.(); }

document.querySelectorAll('.nav-tab[data-tab]').forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault();
    const tab = btn.dataset.tab;
    document.querySelectorAll('.nav-tab').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.querySelectorAll(`.nav-tab[data-tab="${tab}"]`).forEach(b => b.classList.add('active'));
    document.getElementById('view-' + tab).classList.add('active');
    document.getElementById('page-title').textContent = PAGE_TITLES[tab] ?? tab;
    currentTab = tab;
    loaders[tab]?.();
  });
});

// ─── Overlay wiring ───────────────────────────────────────────────────────────
document.getElementById('league-btn').addEventListener('click', openLeaguePicker);
document.getElementById('league-btn-mobile').addEventListener('click', openLeaguePicker);
document.getElementById('league-scrim').addEventListener('click', () => closeOverlay('league-overlay'));
document.getElementById('league-close').addEventListener('click', () => closeOverlay('league-overlay'));
document.getElementById('game-scrim').addEventListener('click',   () => closeOverlay('game-overlay'));
document.getElementById('game-close-pill').addEventListener('click',   () => closeOverlay('game-overlay'));
document.getElementById('player-scrim').addEventListener('click', () => closeOverlay('player-overlay'));
document.getElementById('player-close-pill').addEventListener('click', () => closeOverlay('player-overlay'));

// ─── Init ─────────────────────────────────────────────────────────────────────
(async () => {
  await updateTopbarLeague();
  // also populate mobile pill
  try {
    const list = await loadLeagues();
    const l = list.find(x => x.id === league) || list[0];
    if (l) {
      document.getElementById('league-name-pill').textContent = l.name;
      const pill = document.getElementById('league-logo-pill');
      pill.src = l.logo; pill.style.opacity = '1';
    }
  } catch {}
  loadHome();
})();
