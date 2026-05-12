// ─── State ────────────────────────────────────────────────────────────────────
const CDN = 'https://dt6mt1pwzn2ao.cloudfront.net/images/players';
const urlParams = new URLSearchParams(window.location.search);
const league = urlParams.get('league') || 'ligaplus';
const teamId = urlParams.get('id');

function playerPhoto(id) { return `${CDN}/${id || 'default'}.jpg`; }

function fmtDate(s) { if (!s) return ''; return new Date(s).toLocaleDateString('es-PA', { month: 'short', day: 'numeric' }); }
function fmtTime(s) { if (!s) return ''; return new Date(s).toLocaleTimeString('es-PA', { hour: '2-digit', minute: '2-digit' }); }

const ICON = {
  goal: `<svg width="18" height="18" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="7" cy="7" r="5.25" fill="#fff"/><path d="M8.88284 9.49699C8.72009 9.49699 8.55734 9.48591 8.39459 9.46958C8.34242 9.4595 8.29347 9.43694 8.25192 9.40382C8.21037 9.3707 8.17746 9.32802 8.156 9.27941C7.988 8.65524 7.82525 8.06374 7.66775 7.48858C7.6388 7.41343 7.63706 7.33052 7.66285 7.25423C7.68863 7.17794 7.74031 7.11308 7.80892 7.07091L9.17625 5.84591C9.2334 5.7961 9.30665 5.76865 9.38246 5.76865C9.45827 5.76865 9.53152 5.7961 9.58867 5.84591C10.0474 6.09633 10.4588 6.42503 10.8043 6.81716C10.8827 6.91412 10.9266 7.03436 10.9292 7.15899C10.932 7.84171 10.7287 8.50937 10.3458 9.07466C10.342 9.09048 10.3346 9.10523 10.3243 9.11782C10.253 9.2147 10.1577 9.29131 10.0478 9.34008C9.67045 9.44934 9.27911 9.50241 8.88634 9.49758L8.88284 9.49699Z" fill="#1a4a28"/><path d="M4.46584 8.17283C4.40038 8.17345 4.33693 8.15023 4.28734 8.10749C3.85925 7.84832 3.48656 7.50715 3.19067 7.10358C3.14231 7.03529 3.11586 6.95391 3.11484 6.87024C3.11458 6.23357 3.28305 5.60821 3.60309 5.05783C3.60723 5.03788 3.61894 5.02032 3.63575 5.00883C3.68407 4.96581 3.74151 4.93429 3.80375 4.91666C4.17914 4.77018 4.57855 4.69501 4.9815 4.69499C5.1061 4.68414 5.23141 4.68414 5.356 4.69499C5.42674 4.70258 5.49274 4.73415 5.54304 4.78445C5.59335 4.83475 5.62492 4.90076 5.6325 4.97149C5.72992 5.39499 5.83842 5.82899 5.94167 6.26299L6.02334 6.61299C6.03691 6.666 6.036 6.72167 6.02071 6.77421C6.00542 6.82674 5.97631 6.87421 5.93642 6.91166L4.67234 8.09699C4.64603 8.1233 4.61472 8.14409 4.58026 8.15811C4.5458 8.17214 4.50888 8.17912 4.47167 8.17866H4.46584V8.17283Z" fill="#1a4a28"/><path d="M6.99984 1.16699C5.84612 1.16699 4.7183 1.50911 3.75901 2.15009C2.79973 2.79106 2.05205 3.7021 1.61054 4.76801C1.16903 5.83391 1.05351 7.0068 1.27859 8.13835C1.50367 9.26991 2.05924 10.3093 2.87505 11.1251C3.69086 11.9409 4.73026 12.4965 5.86181 12.7216C6.99337 12.9467 8.16626 12.8311 9.29782 12.606C10.4294 12.3809 11.4688 11.8253 12.2846 11.0095C13.1004 10.1937 13.656 9.15433 13.8811 8.02278C14.1062 6.89122 13.9906 5.71833 13.5491 4.65243C13.1076 3.58652 12.3599 2.67548 11.4006 2.03451C10.4413 1.39353 9.3135 1.05141 8.15984 1.05141C7.70915 1.05141 7.26556 1.1314 6.84607 1.28697C6.42658 1.44253 6.03901 1.67102 5.70116 1.96133C5.3633 1.25165 4.87268 0.629199 4.26534 0.141398C3.658 0.346642 3.09264 0.681926 2.61306 1.12134C2.13347 1.56076 1.75173 2.09171 1.50013 2.67576C1.24853 3.2598 1.13352 3.88191 1.16505 4.50006C1.19658 5.11821 1.3739 5.71802 1.68557 6.25856C1.99723 6.7991 2.43389 7.26705 2.96714 7.62919C3.50039 7.99133 4.1175 8.24011 4.77283 8.35768C5.42816 8.47526 6.10611 8.45906 6.75968 8.31036C7.41325 8.16166 8.02754 7.88468 8.56079 7.50027C9.09399 7.11585 9.53156 6.63325 9.84321 6.09271C10.1549 5.55217 10.3322 4.95236 10.3637 4.33421C10.3953 3.71606 10.2802 3.09395 10.0286 2.50991C9.77704 1.92586 9.3953 1.39491 8.91571 0.955492C8.43613 0.516073 7.87077 0.180789 7.26343 0.0245449C6.6453 0.131826 6.05791 0.359314 5.54566 0.691377C5.03341 1.02344 4.60979 1.45231 4.30544 1.94764C4.0011 1.44231 3.57748 1.01344 3.06523 0.681377C2.55298 0.349311 1.9656 0.121824 1.34747 0.0145419C0.739822 0.170786 0.174465 0.50607 0 0.900476C0.174465 1.29488 0.739822 1.63017 1.34747 1.78641C1.9656 1.67889 2.55298 1.4514 3.06523 1.11934C3.57748 0.787276 4.0011 0.358406 4.30544 0.146941L4.30544 0.146941C4.60979 0.358406 5.03341 0.787276 5.54566 1.11934C6.05791 1.4514 6.6453 1.67889 7.26343 1.78641C7.87077 1.63017 8.43613 1.29488 8.61059 0.900476C8.43613 0.50607 7.87077 0.170786 7.26343 0.0145419C6.6453 0.121824 6.05791 0.349311 5.54566 0.681377C5.03341 1.01344 4.60979 1.44231 4.30544 1.94764C4.60979 2.45297 5.03341 2.88184 5.54566 3.21391C6.05791 3.54597 6.6453 3.77346 7.26343 3.88098C7.87077 3.72474 8.43613 3.38945 8.61059 2.99505C8.43613 2.60065 7.87077 2.26537 7.26343 2.10912C6.6453 2.21665 6.05791 2.44413 5.54566 2.7762C5.03341 3.10827 4.60979 3.53714 4.30544 4.04247C4.60979 4.5478 5.03341 4.97667 5.54566 5.30873C6.05791 5.6408 6.6453 5.86828 7.26343 5.97581C7.87077 5.81957 8.43613 5.48428 8.61059 5.08988C8.43613 4.69548 7.87077 4.36019 7.26343 4.20395C6.6453 4.31147 6.05791 4.53896 5.54566 4.87102C5.03341 5.20309 4.60979 5.63196 4.30544 6.13729C4.60979 6.64262 5.03341 7.07149 5.54566 7.40356C6.05791 7.73562 6.6453 7.96311 7.26343 8.07063C7.87077 7.91439 8.43613 7.5791 8.61059 7.1847C8.43613 6.7903 7.87077 6.45502 7.26343 6.29877C6.6453 6.4063 6.05791 6.63378 5.54566 6.96585C5.03341 7.29791 4.60979 7.72679 4.30544 8.23212C4.60979 8.73745 5.03341 9.16632 5.54566 9.49839C6.05791 9.83045 6.6453 10.0579 7.26343 10.1655C7.87077 10.0092 8.43613 9.67393 8.61059 9.27953C8.43613 8.88513 7.87077 8.54984 7.26343 8.3936C6.6453 8.50112 6.05791 8.72861 5.54566 9.06067C5.03341 9.39274 4.60979 9.82161 4.30544 10.3269C4.60979 10.8323 5.03341 11.2611 5.54566 11.5932C6.05791 11.9253 6.6453 12.1527 7.26343 12.2603C7.87077 12.104 8.43613 11.7687 8.61059 11.3743C8.43613 10.9799 7.87077 10.6446 7.26343 10.4884C6.6453 10.5959 6.05791 10.8234 5.54566 11.1555C5.03341 11.4875 4.60979 11.9164 4.30544 12.4217C4.60979 12.9271 5.03341 13.3559 5.54566 13.688C6.05791 14.0201 6.6453 14.2475 7.26343 14.3551C7.87077 14.1988 8.43613 13.8635 8.61059 13.4691C8.43613 13.0747 7.87077 12.7394 7.26343 12.5832C6.6453 12.6907 6.05791 12.9182 5.54566 13.2502C5.03341 13.5823 4.60979 14.0112 4.30544 14.5165C4.60979 15.0219 5.03341 15.4507 5.54566 15.7828C6.05791 16.1149 6.6453 16.3423 7.26343 16.4499C7.87077 16.2936 8.43613 15.9583 8.61059 15.5639C8.43613 15.1695 7.87077 14.8342 7.26343 14.678C6.6453 14.7855 6.05791 15.013 5.54566 15.3451C5.03341 15.6771 4.60979 16.106 4.30544 16.6113C4.60979 17.1167 5.03341 17.5455 5.54566 17.8776C6.05791 18.2097 6.6453 18.4371 7.26343 18.5447C7.87077 18.3884 8.43613 18.0531 8.61059 17.6587C8.43613 17.2643 7.87077 16.929 7.26343 16.7728C6.6453 16.8803 6.05791 17.1078 5.54566 17.4399C5.03341 17.7719 4.60979 18.2008 4.30544 18.7061L6.99984 1.16699Z" fill="#1a4a28"/></svg>`,
};

// ─── API ──────────────────────────────────────────────────────────────────────
async function api(path) {
  const r = await fetch(path);
  if (!r.ok) throw new Error(r.status);
  return r.json();
}

// ─── Init ─────────────────────────────────────────────────────────────────────
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

  const last5 = recentGames.slice(0, 5).reverse();
  const formHtml = last5.length ? `
    <div class="team-form-row">
      <span class="team-form-label">Form</span>
      <div class="team-form-badges">
        ${last5.map(g => {
          const isHome = g.home.id === teamId;
          const myScore = isHome ? g.home.score : g.away.score;
          const oppScore = isHome ? g.away.score : g.home.score;
          if (myScore === null || oppScore === null) return '';
          const result = myScore > oppScore ? 'W' : myScore < oppScore ? 'L' : 'D';
          return `<span class="team-form-badge ${result.toLowerCase()}">${result}</span>`;
        }).join('')}
      </div>
    </div>
  ` : '';

  const upcomingHtml = upcomingGames.length ? `
    <div class="team-section">
      <div class="team-section-title">Upcoming</div>
      <div class="team-matches-list">
        ${upcomingGames.map(g => {
          const isHome = g.home.id === teamId;
          const opp = isHome ? g.away : g.home;
          return `
            <div class="team-match-row" onclick="window.location.href='/game.html?id=${g.id}&league=${league}'">
              <div class="team-match-date">${fmtDate(g.date)}</div>
              <div class="team-match-teams">
                <img src="${g.home.logo}" alt="" onerror="this.style.opacity='0.2'">
                <span>vs</span>
                <img src="${g.away.logo}" alt="" onerror="this.style.opacity='0.2'">
              </div>
              <div class="team-match-time">${fmtTime(g.date)}</div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  ` : '';

  const gamesHtml = recentGames.length ? `
    <div class="team-section">
      <div class="team-section-title">Recent Results</div>
      <div class="team-matches-list">
        ${recentGames.map(g => {
          const isHome = g.home.id === teamId;
          const myScore = isHome ? g.home.score : g.away.score;
          const oppScore = isHome ? g.away.score : g.home.score;
          let result = null;
          if (myScore !== null && oppScore !== null) {
            result = myScore > oppScore ? 'W' : myScore < oppScore ? 'L' : 'D';
          }
          return `
            <div class="team-match-row" onclick="window.location.href='/game.html?id=${g.id}&league=${league}'">
              <div class="team-match-date">${fmtDate(g.date)}</div>
              <div class="team-match-teams">
                <img src="${g.home.logo}" alt="" onerror="this.style.opacity='0.2'">
                <span>vs</span>
                <img src="${g.away.logo}" alt="" onerror="this.style.opacity='0.2'">
              </div>
              <div class="team-match-score">${myScore !== null ? myScore + ' - ' + oppScore : '—'}</div>
              ${result ? `<div class="team-match-result ${result.toLowerCase()}">${result}</div>` : ''}
            </div>
          `;
        }).join('')}
      </div>
    </div>
  ` : '';

  const squadByPos = squad.reduce((acc, p) => {
    const pos = posLabel[p.position] || p.position || 'OTH';
    if (!acc[pos]) acc[pos] = [];
    acc[pos].push(p);
    return acc;
  }, {});

  const posOrder = ['POR', 'DEF', 'MED', 'DEL'];
  const squadHtml = squad.length ? `
    <div class="team-section">
      <div class="team-section-title">Squad</div>
      ${posOrder.map(pos => {
        const players = squadByPos[pos];
        if (!players?.length) return '';
        return `
          <div class="team-pos-group">
            <div class="team-pos-label">${pos === 'POR' ? 'Goalkeepers' : pos === 'DEF' ? 'Defenders' : pos === 'MED' ? 'Midfielders' : 'Forwards'}</div>
            <div class="team-squad-list">
              ${players.map(p => `
                <div class="team-player-row" onclick="window.location.href='/player.html?id=${p.id}&league=${league}'">
                  <img class="team-player-photo" src="${playerPhoto(p.id)}" alt="${p.firstName}" onerror="this.src='${playerPhoto('default')}'">
                  <div class="team-player-info">
                    <div class="team-player-name">${p.firstName} ${p.lastName}</div>
                    <div class="team-player-meta">${p.jerseyNumber ? '#' + p.jerseyNumber : ''}</div>
                  </div>
                  ${p.jerseyNumber ? `<div class="team-player-number">${p.jerseyNumber}</div>` : ''}
                </div>
              `).join('')}
            </div>
          </div>
        `;
      }).join('')}
    </div>
  ` : '';

  const statsData = stats || {};
  const goalDiff = (statsData.goalsFor || 0) - (statsData.goalsAgainst || 0);
  const statsHtml = (statsData.played || statsData.won || statsData.drawn || statsData.lost) ? `
    <div class="team-section">
      <div class="team-section-title">Season Stats</div>
      <div class="team-stats-grid">
        <div class="team-stat-card">
          <div class="team-stat-val">${statsData.played || 0}</div>
          <div class="team-stat-label">Played</div>
        </div>
        <div class="team-stat-card">
          <div class="team-stat-val">${statsData.won || 0}</div>
          <div class="team-stat-label">Wins</div>
        </div>
        <div class="team-stat-card">
          <div class="team-stat-val">${statsData.drawn || 0}</div>
          <div class="team-stat-label">Draws</div>
        </div>
        <div class="team-stat-card">
          <div class="team-stat-val">${statsData.lost || 0}</div>
          <div class="team-stat-label">Losses</div>
        </div>
        <div class="team-stat-card">
          <div class="team-stat-val">${statsData.goalsFor || 0}</div>
          <div class="team-stat-label">Goals For</div>
        </div>
        <div class="team-stat-card">
          <div class="team-stat-val">${statsData.goalsAgainst || 0}</div>
          <div class="team-stat-label">Goals Against</div>
        </div>
        <div class="team-stat-card wide">
          <div class="team-stat-val ${goalDiff > 0 ? 'pos' : goalDiff < 0 ? 'neg' : ''}">${goalDiff > 0 ? '+' : ''}${goalDiff}</div>
          <div class="team-stat-label">Goal Difference</div>
        </div>
      </div>
    </div>
  ` : '';

  document.getElementById('team-content').innerHTML = `
    <div class="team-header">
      <div class="team-header-logo">
        <img src="${team.logo}" alt="${team.name}" onerror="this.style.opacity='0.3'">
      </div>
      <div class="team-header-name">${team.name}</div>
      <div class="team-header-sub">${team.longName || ''}</div>
      ${formHtml}
    </div>
    ${statsHtml}
    ${upcomingHtml}
    ${gamesHtml}
    ${squadHtml}
  `;
}

loadTeam();