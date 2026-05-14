// ─── State ────────────────────────────────────────────────────────────────────
const CDN = 'https://dt6mt1pwzn2ao.cloudfront.net/images/players';
const urlParams = new URLSearchParams(window.location.search);
const league = urlParams.get('league') || 'ligaplus';
const playerId = urlParams.get('id');

function playerPhoto(id) { return `${CDN}/${id || 'default'}.jpg`; }

function fmtDate(s) { if (!s) return ''; return new Date(s).toLocaleDateString('es-PA', { month: 'short', day: 'numeric' }); }
function fmtAge(dob) { if (!dob) return '—'; return Math.floor((Date.now() - new Date(dob)) / (365.25*24*3600*1000)); }

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

// ─── Init ─────────────────────────────────────────────────────────────────────
async function loadPlayer() {
  if (!playerId) {
    document.getElementById('player-content').innerHTML = '<div style="padding:40px;text-align:center;color:var(--text-3)">No player specified</div>';
    return;
  }

  try {
    const [p, seasonArr, history, awards, records] = await Promise.all([
      api(`/api/players/${playerId}`),
      api(`/api/leagues/${league}/players/${playerId}/statistics`).catch(() => []),
      api(`/api/leagues/${league}/players/${playerId}/history`).catch(() => []),
      api(`/api/leagues/${league}/players/${playerId}/awards`).catch(() => ({})),
      api(`/api/leagues/${league}/players/${playerId}/records`).catch(() => ({})),
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
    const ownGoals= ts.ownGoals ?? 0;
    const cleanSheets = ts.cleanSheets ?? 0;
    const jersey  = ts.jerseyNumber ?? p.team.jerseyNumber ?? '';

    const recVals = Object.values(records ?? {});
    const rec = recVals.length ? recVals.reduce((a, b) => ({
      won: (a.won??0)+(b.won??0), lost: (a.lost??0)+(b.lost??0), tied: (a.tied??0)+(b.tied??0)
    }), {won:0,lost:0,tied:0}) : null;

    const totw = (awards?.teamsOfTheWeek ?? []);

    const allHistory = Array.isArray(history)
      ? [...history].sort((a,b) => (b.matchday?.matchdayOrder??0)-(a.matchday?.matchdayOrder??0))
      : [];
    const gameLogs = allHistory.filter(h => h.game?.gameFinalized);
    const upcoming = allHistory.filter(h => !h.game?.gameFinalized).slice(0, 1);

    const posFullName = { DEF: 'Defender', MED: 'Midfielder', DEL: 'Forward', POR: 'Goalkeeper' };
    const footName = { '1': 'Right', '2': 'Left', '3': 'Both' };

    const logRow = (h, isPending = false) => {
      const gPts    = h.points ?? 0;
      const gRating = (!isPending && gPts > 0) ? ptsToRating(gPts) : isPending ? null : '5.0';
      const gClass  = gRating ? ratingClass(gRating) : '';
      const isHome  = h.team?.id === h.game?.teamOne?.id;
      const opp     = isHome ? h.game?.teamTwo : h.game?.teamOne;
      const myGoals = isHome ? h.game?.goalsTeamOne : h.game?.goalsTeamTwo;
      const oppGoals= isHome ? h.game?.goalsTeamTwo : h.game?.goalsTeamOne;
      const result  = isPending ? null : myGoals > oppGoals ? 'W' : myGoals < oppGoals ? 'L' : 'D';
      const rColMap = { W: '#16a34a', L: '#ef4444', D: '#6b7280' };
      const rBg     = { W: 'rgba(22,163,74,0.12)', L: 'rgba(239,68,68,0.12)', D: 'rgba(107,114,128,0.08)' };

      return `
        <div class="pd-game-row ${isPending ? 'pd-game-pending' : ''}" style="${result ? `background:${rBg[result]}` : ''}">
          <div class="pd-game-left">
            ${result ? `<span class="pd-game-result-pill" style="background:${rColMap[result]}">${result}</span>` : `<span class="pd-game-result-pill" style="background:#374151">—</span>`}
            <div class="pd-game-score-block">
              <span class="pd-game-score">${isPending ? '—' : `${myGoals}–${oppGoals}`}</span>
              <span class="pd-game-opp">${opp?.name ?? '—'}</span>
            </div>
          </div>
          <div class="pd-game-right">
            <span class="pd-game-md">${h.matchday?.name ?? ''}</span>
            ${gRating ? ratingBadge(gRating, gClass, 'sm') : ''}
          </div>
        </div>`;
    };

    const totwHtml = totw.length ? `
      <div class="pd-section-title">Team of the Week</div>
      <div class="pd-totw-list">
        ${totw.map(a => `
          <div class="pd-totw-row">
            <svg width="16" height="16" viewBox="0 0 13 13" fill="none"><path d="M6.5,0.8 L7.9,4.6 L12,4.6 L8.7,7 L9.9,10.8 L6.5,8.4 L3.1,10.8 L4.3,7 L1,4.6 L5.1,4.6 Z" fill="#fbbf24"/></svg>
            <span class="pd-totw-info"><b>${a.matchdayName}</b> · ${a.tournamentName}</span>
          </div>`).join('')}
      </div>` : '';

    const gameLogHtml = (gameLogs.length || upcoming.length) ? `
      <div class="pd-section-title">Recent Games</div>
      <div class="pd-game-log">
        ${upcoming.map(h => logRow(h, true)).join('')}
        ${gameLogs.map(h => logRow(h, false)).join('')}
      </div>` : '';

    document.title = `${p.firstName} ${p.lastName} — LigaMob`;

    document.getElementById('player-content').innerHTML = `
      <div class="detail-fade-in">
        <div class="pd-hero">
          <div class="pd-hero-bg" style="background-image:url('${p.photo}')"></div>
          <div class="pd-hero-overlay"></div>
          <div class="pd-hero-content">
            <img class="pd-photo" src="${p.photo}" alt="" onerror="this.src='${playerPhoto('default')}'">
            <div class="pd-info">
              <div class="pd-name">${p.firstName} <strong>${p.lastName}</strong></div>
              <div class="pd-team"><img class="pd-team-logo" src="${p.team.logo}" alt="" onerror="this.style.opacity='.2'">${p.team.name ?? '—'}${jersey ? ` · #${jersey}` : ''}</div>
              <div class="pd-badges">
                <span class="pd-position-badge">${posFullName[p.position] ?? p.position ?? '—'}</span>
                ${ratingBadge(rating, rClass, 'lg')}
              </div>
            </div>
          </div>
        </div>

        <div class="pd-stat-row">
          <div class="pd-stat-pill"><div class="pd-stat-val">${games}</div><div class="pd-stat-lbl">Games</div></div>
          <div class="pd-stat-pill"><div class="pd-stat-val">${goals}</div><div class="pd-stat-lbl">Goals</div></div>
          <div class="pd-stat-pill"><div class="pd-stat-val">${assists}</div><div class="pd-stat-lbl">Assists</div></div>
          <div class="pd-stat-pill"><div class="pd-stat-val">${pts||0}</div><div class="pd-stat-lbl">Pts</div></div>
        </div>

        ${rec ? `
        <div class="pd-record-bar">
          <div class="pd-record-seg" style="flex:${rec.won};background:#16a34a" title="${rec.won} Wins"></div>
          <div class="pd-record-seg" style="flex:${rec.tied};background:#4b5563" title="${rec.tied} Draws"></div>
          <div class="pd-record-seg" style="flex:${rec.lost};background:#ef4444" title="${rec.lost} Losses"></div>
        </div>
        <div class="pd-record-legend">
          <span style="color:#16a34a">${rec.won}W</span>
          <span style="color:#9ca3af">${rec.tied}D</span>
          <span style="color:#ef4444">${rec.lost}L</span>
        </div>` : ''}

        <div class="pd-bio">
          ${p.dateOfBirth ? `<div class="pd-bio-row"><span class="pd-bio-label">Age</span><span class="pd-bio-val">${fmtAge(p.dateOfBirth)} yrs</span></div>` : ''}
          ${p.country     ? `<div class="pd-bio-row"><span class="pd-bio-label">Nationality</span><span class="pd-bio-val">${p.country}</span></div>` : ''}
          ${ts.preferredFootName ?? p.preferredFootName ? `<div class="pd-bio-row"><span class="pd-bio-label">Preferred foot</span><span class="pd-bio-val">${ts.preferredFootName ?? footName[p.preferredFootId] ?? '—'}</span></div>` : ''}
          ${yellow ? `<div class="pd-bio-row"><span class="pd-bio-label">Yellow cards</span><span class="pd-bio-val" style="display:flex;align-items:center;gap:5px">${yellow}</span></div>` : ''}
          ${red    ? `<div class="pd-bio-row"><span class="pd-bio-label">Red cards</span><span class="pd-bio-val" style="display:flex;align-items:center;gap:5px">${red}</span></div>` : ''}
          ${cleanSheets ? `<div class="pd-bio-row"><span class="pd-bio-label">Clean sheets</span><span class="pd-bio-val">${cleanSheets}</span></div>` : ''}
          ${ownGoals ? `<div class="pd-bio-row"><span class="pd-bio-label">Own goals</span><span class="pd-bio-val">${ownGoals}</span></div>` : ''}
          ${ts.tournamentName ? `<div class="pd-bio-row"><span class="pd-bio-label">Tournament</span><span class="pd-bio-val">${ts.tournamentName}</span></div>` : ''}
        </div>

        ${totwHtml}
        ${gameLogHtml}
      </div>`;
  } catch(e) {
    console.error(e);
    document.getElementById('player-content').innerHTML = '<div style="padding:40px;text-align:center;color:var(--text-3)">Failed to load player.</div>';
  }
}

loadPlayer();