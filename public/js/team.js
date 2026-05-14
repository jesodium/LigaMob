const CDN = 'https://dt6mt1pwzn2ao.cloudfront.net/images/players';
const urlParams = new URLSearchParams(window.location.search);
const league = urlParams.get('league') || 'ligaplus';
const teamId = urlParams.get('id');

function playerPhoto(id) { return `${CDN}/${id || 'default'}.jpg`; }

function fmtDate(s) { if (!s) return ''; return new Date(s).toLocaleDateString('es-PA', { month: 'short', day: 'numeric' }); }
function fmtTime(s) { if (!s) return ''; return new Date(s).toLocaleTimeString('es-PA', { hour: '2-digit', minute: '2-digit' }); }

async function api(path) {
  const r = await fetch(path);
  if (!r.ok) throw new Error(r.status);
  return r.json();
}

async function loadTeam() {
  if (!teamId) {
    document.getElementById('team-content').innerHTML = '<div style="padding:40px;text-align:center;color:var(--text-3)">No team specified</div>';
    return;
  }

  try {
    const [team, squad, recentGames, upcomingGames, stats] = await Promise.all([
      api(`/api/teams/${teamId}`).catch(() => null),
      api(`/api/teams/${teamId}/squad`).catch(() => []),
      api(`/api/teams/${teamId}/games/recent`).catch(() => []),
      api(`/api/teams/${teamId}/games/upcoming`).catch(() => []),
      api(`/api/teams/${teamId}/stats`).catch(() => ({})),
    ]);

    if (!team) {
      document.getElementById('team-content').innerHTML = '<div style="padding:40px;text-align:center;color:var(--text-3)">Team not found</div>';
      return;
    }

    document.title = `${team.name} — LigaMob`;
    renderTeam(team, squad, recentGames, upcomingGames, stats);
  } catch(e) {
    console.error(e);
    document.getElementById('team-content').innerHTML = '<div style="padding:40px;text-align:center;color:var(--text-3)">Failed to load team</div>';
  }
}

function renderTeam(team, squad, recentGames, upcomingGames, stats) {
  const posLabel = { 'POR': 'GK', 'DEF': 'DEF', 'MED': 'MID', 'DEL': 'FWD' };

  // ── Form badges ──
  const last5 = recentGames.slice(0, 5).reverse();
  const formHtml = last5.length ? `
    <div class="td-form-row">
      <span class="td-form-label">Form</span>
      <div class="td-form-badges">
        ${last5.map(g => {
          const isHome = g.home.id === teamId;
          const myScore = isHome ? g.home.score : g.away.score;
          const oppScore = isHome ? g.away.score : g.home.score;
          if (myScore === null || oppScore === null) return '';
          const result = myScore > oppScore ? 'W' : myScore < oppScore ? 'L' : 'D';
          return `<span class="td-form-badge ${result.toLowerCase()}">${result}</span>`;
        }).join('')}
      </div>
    </div>
  ` : '';

  // ── Stats strip ──
  const statsData = stats || {};
  const goalDiff = (statsData.goalsFor || 0) - (statsData.goalsAgainst || 0);
  const hasStats = statsData.played || statsData.won || statsData.drawn || statsData.lost;
  const statsHtml = hasStats ? `
    <div class="team-stat-strip">
      <div class="tstat">
        <div class="tstat-val">${statsData.played || 0}</div>
        <div class="tstat-lbl">Played</div>
      </div>
      <div class="tstat">
        <div class="tstat-val">${statsData.won || 0}</div>
        <div class="tstat-lbl">Wins</div>
      </div>
      <div class="tstat">
        <div class="tstat-val">${statsData.drawn || 0}</div>
        <div class="tstat-lbl">Draws</div>
      </div>
      <div class="tstat">
        <div class="tstat-val">${statsData.lost || 0}</div>
        <div class="tstat-lbl">Losses</div>
      </div>
      <div class="tstat">
        <div class="tstat-val">${statsData.goalsFor || 0}</div>
        <div class="tstat-lbl">GF</div>
      </div>
      <div class="tstat">
        <div class="tstat-val">${statsData.goalsAgainst || 0}</div>
        <div class="tstat-lbl">GA</div>
      </div>
      <div class="tstat">
        <div class="tstat-val ${goalDiff > 0 ? 'pos' : goalDiff < 0 ? 'neg' : ''}">${goalDiff > 0 ? '+' : ''}${goalDiff}</div>
        <div class="tstat-lbl">Goal Diff</div>
      </div>
    </div>
  ` : '';

  // ── Upcoming matches ──
  const upcomingHtml = upcomingGames.length ? `
    <div class="td-section">
      <div class="td-section-title">Upcoming</div>
      <div class="td-matches-list">
        ${upcomingGames.map(g => {
          const isHome = g.home.id === teamId;
          const opp = isHome ? g.away : g.home;
          return `
            <div class="td-match-row" onclick="window.location.href='/game.html?id=${g.id}&league=${league}'">
              <div class="td-match-date">${fmtDate(g.date)}</div>
              <div class="td-match-teams">
                <img src="${g.home.logo}" alt="" onerror="this.style.opacity='0.2'">
                <span>vs</span>
                <img src="${g.away.logo}" alt="" onerror="this.style.opacity='0.2'">
              </div>
              <div class="td-match-time">${fmtTime(g.date)}</div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  ` : '';

  // ── Recent results ──
  const gamesHtml = recentGames.length ? `
    <div class="td-section">
      <div class="td-section-title">Recent Results</div>
      <div class="td-matches-list">
        ${recentGames.map(g => {
          const isHome = g.home.id === teamId;
          const myScore = isHome ? g.home.score : g.away.score;
          const oppScore = isHome ? g.away.score : g.home.score;
          let result = null;
          if (myScore !== null && oppScore !== null) {
            result = myScore > oppScore ? 'W' : myScore < oppScore ? 'L' : 'D';
          }
          return `
            <div class="td-match-row" onclick="window.location.href='/game.html?id=${g.id}&league=${league}'">
              <div class="td-match-date">${fmtDate(g.date)}</div>
              <div class="td-match-teams">
                <img src="${g.home.logo}" alt="" onerror="this.style.opacity='0.2'">
                <span>vs</span>
                <img src="${g.away.logo}" alt="" onerror="this.style.opacity='0.2'">
              </div>
              <div class="td-match-score">${myScore !== null ? myScore + ' - ' + oppScore : '—'}</div>
              ${result ? `<div class="td-match-result ${result.toLowerCase()}">${result}</div>` : ''}
            </div>
          `;
        }).join('')}
      </div>
    </div>
  ` : '';

  // ── Squad ──
  const squadByPos = squad.reduce((acc, p) => {
    const pos = posLabel[p.position] || p.position || 'OTH';
    if (!acc[pos]) acc[pos] = [];
    acc[pos].push(p);
    return acc;
  }, {});

  const posOrder = ['POR', 'DEF', 'MED', 'DEL'];
  const squadHtml = squad.length ? `
    <div class="td-section">
      <div class="td-section-title">Squad</div>
      ${posOrder.map(pos => {
        const players = squadByPos[pos];
        if (!players?.length) return '';
        return `
          <div class="td-pos-label">${pos === 'POR' ? 'Goalkeepers' : pos === 'DEF' ? 'Defenders' : pos === 'MED' ? 'Midfielders' : 'Forwards'}</div>
          <div class="td-squad-list">
            ${players.map(p => `
              <div class="td-player-row" onclick="window.location.href='/player.html?id=${p.id}&league=${league}'">
                <img class="td-player-photo" src="${playerPhoto(p.id)}" alt="${p.firstName}" onerror="this.src='${playerPhoto('default')}'">
                <div class="td-player-info">
                  <div class="td-player-name">${p.firstName} ${p.lastName}</div>
                  <div class="td-player-meta">${p.jerseyNumber ? '#' + p.jerseyNumber : ''}</div>
                </div>
                ${p.jerseyNumber ? `<div class="td-player-number">${p.jerseyNumber}</div>` : ''}
              </div>
            `).join('')}
          </div>
        `;
      }).join('')}
    </div>
  ` : '';

  const heroStyle = team.colors?.primary ? `--th-primary:${team.colors.primary}` : '';

  document.getElementById('team-content').innerHTML = `
    <div class="detail-fade-in">
      <div class="td-page">
        <div class="team-hero" style="${heroStyle}">
          <img class="team-hero-logo" src="${team.logo}" alt="${team.name}" onerror="this.style.opacity='0.3'">
          <div class="team-hero-info">
            <div class="team-hero-eyebrow">Team</div>
            <div class="team-hero-name">${team.name}</div>
            ${team.longName ? `<div class="team-hero-long">${team.longName}</div>` : ''}
            ${formHtml}
          </div>
        </div>

        ${statsHtml}

        <div class="team-layout">
          <div>
            ${upcomingHtml}
            ${gamesHtml}
          </div>
          <div>
            ${squadHtml}
          </div>
        </div>
      </div>
    </div>`;
}

loadTeam();
