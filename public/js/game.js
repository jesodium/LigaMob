// ─── State ────────────────────────────────────────────────────────────────────
const CDN = 'https://dt6mt1pwzn2ao.cloudfront.net/images/players';
const urlParams = new URLSearchParams(window.location.search);
const league = urlParams.get('league') || 'ligaplus';
const gameId = urlParams.get('id');
let gameDetailTab = 'lineup';

function playerPhoto(id) { return `${CDN}/${id || 'default'}.jpg`; }

function fmtDate(s) { if (!s) return ''; return new Date(s).toLocaleDateString('es-PA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }); }
function fmtTime(s) { if (!s) return ''; return new Date(s).toLocaleTimeString('es-PA', { hour: '2-digit', minute: '2-digit' }); }

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

const STAR_SVG = `<svg width="100%" height="100%" viewBox="0 0 13 13" version="1.1" xmlns="http://www.w3.org/2000/svg"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g fill="currentColor" fill-rule="nonzero"><path d="M4.63272179,7.41941433 L6.88042179,8.77921433 C7.06648135,8.89214518 7.30210963,8.88253227 7.47835171,8.75482062 C7.65459378,8.62710897 7.73710097,8.40618894 7.68772179,8.19421433 L7.09232179,5.63711433 L9.08002179,3.91461433 C9.244408,3.77228731 9.30756604,3.54534836 9.24033937,3.33856253 C9.1731127,3.13177669 8.98857687,2.98536373 8.77192179,2.96691433 L6.15502179,2.74461433 L5.13192179,0.329214332 C5.04665941,0.129541157 4.85048708,0 4.63337179,0 C4.4162565,0 4.22008416,0.129541157 4.13482179,0.329214332 L3.11172179,2.73941433 L0.496121789,2.96171433 C0.279238733,2.97970287 0.0942685405,3.12594289 0.0267269593,3.33282446 C-0.0408146219,3.53970602 0.0222330995,3.7669176 0.186721789,3.90941433 L2.17442179,5.62541433 L1.57772179,8.18771433 C1.52834261,8.39968894 1.6108498,8.62060897 1.78709187,8.74832062 C1.96333395,8.87603227 2.19896223,8.88564518 2.38502179,8.77271433 L4.63272179,7.41941433 Z"/></g></g></svg>`;

function ratingBadge(rating, cls, size = 'md') {
  const s = size === 'lg' ? 'pd-rating-badge lg' : size === 'sm' ? 'pd-rating-badge sm' : 'pd-rating-badge';
  return `<div class="${s} ${cls}"><span>${rating}</span>${STAR_SVG}</div>`;
}

// ─── API ──────────────────────────────────────────────────────────────────────
async function api(path) {
  const r = await fetch(path);
  if (!r.ok) throw new Error(r.status);
  return r.json();
}

function getStats(g) {
  if (Array.isArray(g.playerStatistics) && g.playerStatistics.length) return g.playerStatistics;
  if (Array.isArray(g.statistics) && g.statistics.length) return g.statistics;
  return [];
}

// ─── Init ─────────────────────────────────────────────────────────────────────
async function loadGame() {
  if (!gameId) {
    document.getElementById('game-content').innerHTML = '<div style="padding:40px;text-align:center;color:var(--text-3)">No match specified</div>';
    return;
  }

  try {
    const g = await api(`/api/games/${gameId}`);
    document.title = `${g.home.name} vs ${g.away.name} — LigaMob`;
    renderGameDetailShell(g);
  } catch(e) {
    console.error(e);
    document.getElementById('game-content').innerHTML = '<div style="padding:40px;text-align:center;color:var(--text-3)">Failed to load match.</div>';
  }
}

function renderGameDetailShell(g) {
  const isFinal = g.status === 'final';
  const isLive  = g.status === 'live';
  const upcoming = g.status === 'upcoming';

  const scoreSection = upcoming
    ? `<div class="gd-score" style="font-size:30px;letter-spacing:2px;color:var(--text-2)">${fmtTime(g.date)}</div><div class="gd-status">${fmtDate(g.date)}</div>`
    : `<div class="gd-score">${g.home.score ?? '—'}<span class="sep"> - </span>${g.away.score ?? '—'}</div><div class="gd-status">${isLive ? '● Live' : 'Full Time'}</div>`;

  document.getElementById('game-content').innerHTML = `
    <div class="detail-fade-in">
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
        <div class="gd-date">${fmtDate(g.date)}${g.stadium ? ' · ' + (g.stadium.name ?? '') : ''}</div>
      </div>
      <div class="gd-tabs" id="gd-tabs">
        <div class="gd-tab active" data-gtab="lineup">Lineup</div>
        <div class="gd-tab" data-gtab="stats">Stats</div>
        <div class="gd-tab" data-gtab="players">Players</div>
      </div>
      <div class="gd-body" id="gd-body"></div>
    </div>`;

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
  if (gameDetailTab === 'lineup')  body.innerHTML = fadedHtml(renderPitchLineup(g));
  else if (gameDetailTab === 'stats')   body.innerHTML = fadedHtml(renderStatsTab(g));
  else if (gameDetailTab === 'players') body.innerHTML = fadedHtml(renderPlayersTab(g));
  body.style.animation = 'none';
  body.offsetHeight;
  body.style.animation = '';
  body.querySelectorAll('[data-player-id]').forEach(n =>
    n.addEventListener('click', () => window.location.href = `/player.html?id=${n.dataset.playerId}&league=${league}`));
}

function fadedHtml(html) { return `<div class="detail-fade-in">${html}</div>`; }

// ─── PITCH LINEUP ─────────────────────────────────────────────────────────────
function renderPitchLineup(g) {
  const lineups = Array.isArray(g.lineups) ? g.lineups : [];
  if (!lineups.length) {
    return `<div class="empty-state"><div class="empty-icon">📋</div><div class="empty-msg">${g.status === 'upcoming' ? 'Lineups not announced yet' : 'Lineups not available'}</div></div>`;
  }

  const stats = getStats(g);
  const statsByName = new Map();
  for (const s of stats) {
    const key = (s.firstName + ' ' + s.lastName).toLowerCase().trim();
    statsByName.set(key, s);
  }
  function getStat(player) {
    const key = (player.firstName + ' ' + player.lastName).toLowerCase().trim();
    return statsByName.get(key) ?? null;
  }

  let homePlayers = lineups.filter(p => p.teamId === g.home.id);
  let awayPlayers = lineups.filter(p => p.teamId === g.away.id);

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

  function renderPlayerNode(player, stat) {
    const pts    = stat?.points ?? 0;
    const goals  = stat?.goals ?? 0;
    const rating = pts > 0 ? ptsToRating(pts) : '5.0';
    const rClass = ratingClass(rating);
    const firstName = (player.firstName ?? '').split(' ')[0];
    const lastName  = (player.lastName  ?? '').split(' ')[0];

    return `
      <div class="pitch-player-node" data-player-id="${player.playerId}">
        <div class="pitch-photo-wrap">
          <img class="pitch-photo" src="${playerPhoto(player.playerId)}" loading="lazy" alt="${firstName}" onerror="this.src='${playerPhoto('default')}'">
          <div class="pitch-rating ${rClass}">${rating}</div>
        </div>
        <div class="pitch-player-label">
          <span class="pitch-player-name">${firstName} ${lastName}</span>
        </div>
      </div>`;
  }

  function renderPitchTeam(starters, reversed) {
    const rows = groupByPos(starters);
    const displayRows = reversed ? [...rows].reverse() : rows;
    let html = `<div class="pitch-half ${reversed ? 'away' : 'home'}">`;
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

  let html = `<div class="pitch-wrapper">`;
  html += `<div class="pitch-field">`;
  html += renderPitchTeam(homeStart, false);
  html += `<div class="pitch-divider"></div>`;
  html += renderPitchTeam(awayStart, true);
  html += `</div>`;

  const subArrowSvg = `<svg viewBox="0 0 12 12" fill="none"><path d="M6 2v8M2 6l4 4 4-4" stroke="#22c55e" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const renderSubCol = (subs) => {
    if (!subs.length) return `<div class="subs-col"></div>`;
    let c = `<div class="subs-col">`;
    subs.forEach(p => {
      const stat = getStat(p);
      const pts = stat?.points ?? 0;
      const rating = pts > 0 ? ptsToRating(pts) : null;
      const rClass = rating ? ratingClass(rating) : null;
      c += `
        <div class="sub-row" data-player-id="${p.playerId}" style="cursor:pointer">
          <img class="sub-photo" src="${playerPhoto(p.playerId)}" loading="lazy" alt="" onerror="this.src='${playerPhoto('default')}'">
          <div class="sub-info">
            <div class="sub-name-row">
              <span class="sub-name">${p.firstName} ${p.lastName}</span>
            </div>
            <span class="sub-pos-tag">${p.position ?? ''}</span>
          </div>
          <div class="sub-right">
            ${rating ? `<span class="sub-rating-pill ${rClass}">${rating}</span>` : ''}
          </div>
        </div>`;
    });
    c += `</div>`;
    return c;
  };

  if (homeSubs.length || awaySubs.length) {
    html += `<div class="subs-panel">`;
    html += `<div class="subs-title">Substitutes</div>`;
    html += `<div class="subs-cols">`;
    html += renderSubCol(homeSubs);
    html += renderSubCol(awaySubs);
    html += `</div></div>`;
  }

  html += `</div>`;
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
    { label: 'Yellow Cards', h: sum(home,'yellowCards'),   a: sum(away,'yellowCards') },
    { label: 'Red Cards',    h: sum(home,'redCards'),      a: sum(away,'redCards') },
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
  return html;
}

// ─── PLAYERS TAB ─────────────────────────────────────────────────────────────
function renderPlayersTab(g) {
  const players = getStats(g);
  if (!players.length) {
    return `<div class="empty-state"><div class="empty-icon">👤</div><div class="empty-msg">Player stats not available</div></div>`;
  }

  const homeId = g.home.id;
  const homePlayers = players.filter(p => (p.team?.id ?? p.teamId) === homeId);
  const awayPlayers = players.filter(p => (p.team?.id ?? p.teamId) !== homeId);

  const playerCard = p => {
    const pts = p.points ?? 0;
    const rating = pts > 0 ? ptsToRating(pts) : '5.0';
    const rClass = ratingClass(rating);
    const pid = p.playerId ?? p.id ?? '';

    return `
      <div class="pcard" data-player-id="${pid}" style="cursor:pointer">
        <div class="pcard-rating ${rClass}">${rating}</div>
        <img class="pcard-photo" src="${playerPhoto(pid)}" loading="lazy" alt="" onerror="this.src='${playerPhoto('default')}'">
        <div class="pcard-info">
          <div class="pcard-name">${p.firstName ?? ''} ${p.lastName ?? ''}</div>
          <div class="pcard-pos">${p.position ?? ''}</div>
        </div>
      </div>`;
  };

  const teamSection = (list, teamName, teamLogo, accentColor) => {
    if (!list.length) return '';
    return `
      <div class="pteam-section">
        <div class="pteam-section-head">
          <img class="pteam-section-logo" src="${teamLogo}" alt="" onerror="this.style.opacity='.2'">
          <span class="pteam-section-name">${teamName}</span>
        </div>
        <div class="pteam-section-grid">
          ${list.map(playerCard).join('')}
        </div>
      </div>`;
  };

  return `<div class="pdetail-wrap">
    ${teamSection(homePlayers, g.home.name, g.home.logo)}
    ${teamSection(awayPlayers, g.away.name, g.away.logo)}
  </div>`;
}

loadGame();