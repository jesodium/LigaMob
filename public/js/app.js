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
  // ⚽ Goal ball (FotMob style)
  goal: `<svg width="22" height="22" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#cg)"><circle cx="7" cy="7" r="5.25" fill="#fff"/><path d="M8.88284 9.49699C8.72009 9.49699 8.55734 9.48591 8.39459 9.46958C8.34242 9.4595 8.29347 9.43694 8.25192 9.40382C8.21037 9.3707 8.17746 9.32802 8.156 9.27941C7.988 8.65524 7.82525 8.06374 7.66775 7.48858C7.6388 7.41343 7.63706 7.33052 7.66285 7.25423C7.68863 7.17794 7.74031 7.11308 7.80892 7.07091L9.17625 5.84591C9.2334 5.7961 9.30665 5.76865 9.38246 5.76865C9.45827 5.76865 9.53152 5.7961 9.58867 5.84591C10.0474 6.09633 10.4588 6.42503 10.8043 6.81716C10.8827 6.91412 10.9266 7.03436 10.9292 7.15899C10.932 7.84171 10.7287 8.50937 10.3458 9.07466C10.342 9.09048 10.3346 9.10523 10.3243 9.11782C10.253 9.2147 10.1577 9.29131 10.0478 9.34008C9.67045 9.44934 9.27911 9.50241 8.88634 9.49758L8.88284 9.49699Z" fill="#1a4a28"/><path d="M4.46584 8.17283C4.40038 8.17345 4.33693 8.15023 4.28734 8.10749C3.85925 7.84832 3.48656 7.50715 3.19067 7.10358C3.14231 7.03529 3.11586 6.95391 3.11484 6.87024C3.11458 6.23357 3.28305 5.60821 3.60309 5.05783C3.60723 5.03788 3.61894 5.02032 3.63575 5.00883C3.68407 4.96581 3.74151 4.93429 3.80375 4.91666C4.17914 4.77018 4.57855 4.69501 4.9815 4.69499C5.1061 4.68414 5.23141 4.68414 5.356 4.69499C5.42674 4.70258 5.49274 4.73415 5.54304 4.78445C5.59335 4.83475 5.62492 4.90076 5.6325 4.97149C5.72992 5.39499 5.83842 5.82899 5.94167 6.26299L6.02334 6.61299C6.03691 6.666 6.036 6.72167 6.02071 6.77421C6.00542 6.82674 5.97631 6.87421 5.93642 6.91166L4.67234 8.09699C4.64603 8.1233 4.61472 8.14409 4.58026 8.15811C4.5458 8.17214 4.50888 8.17912 4.47167 8.17866H4.46584V8.17283Z" fill="#1a4a28"/><path d="M6.99984 1.16699C5.84612 1.16699 4.7183 1.50911 3.75901 2.15009C2.79973 2.79106 2.05205 3.7021 1.61054 4.76801C1.16903 5.83391 1.05351 7.0068 1.27859 8.13835C1.50367 9.26991 2.05924 10.3093 2.87505 11.1251C3.69086 11.9409 4.73026 12.4965 5.86181 12.7216C6.99337 12.9467 8.16626 12.8311 9.23216 12.3896C10.2981 11.9481 11.2091 11.2004 11.8501 10.2412C12.4911 9.28186 12.8332 8.15405 12.8332 7.00033C12.8332 5.45323 12.2186 3.9695 11.1246 2.87554C10.0307 1.78157 8.54694 1.16699 6.99984 1.16699Z" fill="#1a4a28" opacity=".18"/></g><defs><clipPath id="cg"><rect width="14" height="14" fill="white"/></clipPath></defs></svg>`,
  // ⚽ Small pitch goal icon (same, slightly smaller)
  goalSmall: `<svg width="18" height="18" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#cgs)"><circle cx="7" cy="7" r="5.25" fill="#fff"/><path d="M8.88284 9.49699C8.72009 9.49699 8.55734 9.48591 8.39459 9.46958C8.34242 9.4595 8.29347 9.43694 8.25192 9.40382C8.21037 9.3707 8.17746 9.32802 8.156 9.27941C7.988 8.65524 7.82525 8.06374 7.66775 7.48858C7.6388 7.41343 7.63706 7.33052 7.66285 7.25423C7.68863 7.17794 7.74031 7.11308 7.80892 7.07091L9.17625 5.84591C9.2334 5.7961 9.30665 5.76865 9.38246 5.76865C9.45827 5.76865 9.53152 5.7961 9.58867 5.84591C10.0474 6.09633 10.4588 6.42503 10.8043 6.81716C10.8827 6.91412 10.9266 7.03436 10.9292 7.15899C10.932 7.84171 10.7287 8.50937 10.3458 9.07466C10.342 9.09048 10.3346 9.10523 10.3243 9.11782C10.253 9.2147 10.1577 9.29131 10.0478 9.34008C9.67045 9.44934 9.27911 9.50241 8.88634 9.49758L8.88284 9.49699Z" fill="#1a4a28"/><path d="M4.46584 8.17283C4.40038 8.17345 4.33693 8.15023 4.28734 8.10749C3.85925 7.84832 3.48656 7.50715 3.19067 7.10358C3.14231 7.03529 3.11586 6.95391 3.11484 6.87024C3.11458 6.23357 3.28305 5.60821 3.60309 5.05783C3.60723 5.03788 3.61894 5.02032 3.63575 5.00883C3.68407 4.96581 3.74151 4.93429 3.80375 4.91666C4.17914 4.77018 4.57855 4.69501 4.9815 4.69499C5.1061 4.68414 5.23141 4.68414 5.356 4.69499C5.42674 4.70258 5.49274 4.73415 5.54304 4.78445C5.59335 4.83475 5.62492 4.90076 5.6325 4.97149C5.72992 5.39499 5.83842 5.82899 5.94167 6.26299L6.02334 6.61299C6.03691 6.666 6.036 6.72167 6.02071 6.77421C6.00542 6.82674 5.97631 6.87421 5.93642 6.91166L4.67234 8.09699C4.64603 8.1233 4.61472 8.14409 4.58026 8.15811C4.5458 8.17214 4.50888 8.17912 4.47167 8.17866H4.46584V8.17283Z" fill="#1a4a28"/><path d="M6.99984 1.16699C5.84612 1.16699 4.7183 1.50911 3.75901 2.15009C2.79973 2.79106 2.05205 3.7021 1.61054 4.76801C1.16903 5.83391 1.05351 7.0068 1.27859 8.13835C1.50367 9.26991 2.05924 10.3093 2.87505 11.1251C3.69086 11.9409 4.73026 12.4965 5.86181 12.7216C6.99337 12.9467 8.16626 12.8311 9.23216 12.3896C10.2981 11.9481 11.2091 11.2004 11.8501 10.2412C12.4911 9.28186 12.8332 8.15405 12.8332 7.00033C12.8332 5.45323 12.2186 3.9695 11.1246 2.87554C10.0307 1.78157 8.54694 1.16699 6.99984 1.16699Z" fill="#1a4a28" opacity=".18"/></g><defs><clipPath id="cgs"><rect width="14" height="14" fill="white"/></clipPath></defs></svg>`,
  // Assist (FotMob hand pass icon)
  assist: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 14 14"><ellipse cx="7" cy="7" rx="7" ry="7" fill="rgba(255,255,255,0.15)"/><g id="ic_assist" transform="translate(1 1)"><path fill="rgba(255,255,255,0.9)" fill-rule="evenodd" d="M10.608 4.7c-.175.1-.377.209-.6.337-.156.09-.322.188-.493.3-.806.524-6.651 4.113-7.836 4.793s-3.035.929-3.565.016 1.029-1.952 1.948-3.055C1.11 5.833 2.48 4.461 2.48 4.461c-.088-.426.332-.712.494-.805a.607.607 0 0 1 .06-.03c-.117-.5.631-.929.631-.929l1.147-2.518a.231.231 0 0 1 .094-.105.236.236 0 0 1 .208-.013l1.024.424c.673.283-.769 1.89-.465 1.962a1.67 1.67 0 0 0 1.043-.273 2.826 2.826 0 0 0 .735-.614c.48-.56-.03-1.38.249-1.543.1-.054.287-.034.642.095 1.393.535 2.192 2.211 2.776 3.254.402.709.121.973-.51 1.334z"/></g></svg>`,
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
  goalLg: `<svg viewBox="0 0 18 18" fill="none" width="24" height="24"><circle cx="9" cy="9" r="7.5" stroke="currentColor" stroke-width="1.5"/><polygon points="9,4 11,7.5 15,7.5 12,9.8 13,13 9,11 5,13 6,9.8 3,7.5 7,7.5" fill="currentColor"/></svg>`,
  assistLg: `<svg viewBox="0 0 18 18" fill="none" width="24" height="24"><path d="M3 13 C5.5 5, 12.5 5, 15 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M12 10L15 13L12 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  gamesLg: `<svg viewBox="0 0 18 18" fill="none" width="24" height="24"><rect x="2" y="3" width="14" height="13" rx="2" stroke="currentColor" stroke-width="1.5"/><line x1="12" y1="1" x2="12" y2="5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="6" y1="1" x2="6" y2="5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="2" y1="8" x2="16" y2="8" stroke="currentColor" stroke-width="1.5"/></svg>`,
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

const STAR_SVG = `<svg width="100%" height="100%" viewBox="0 0 13 13" version="1.1" xmlns="http://www.w3.org/2000/svg"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g fill="currentColor" fill-rule="nonzero"><path d="M4.63272179,7.41941433 L6.88042179,8.77921433 C7.06648135,8.89214518 7.30210963,8.88253227 7.47835171,8.75482062 C7.65459378,8.62710897 7.73710097,8.40618894 7.68772179,8.19421433 L7.09232179,5.63711433 L9.08002179,3.91461433 C9.244408,3.77228731 9.30756604,3.54534836 9.24033937,3.33856253 C9.1731127,3.13177669 8.98857687,2.98536373 8.77192179,2.96691433 L6.15502179,2.74461433 L5.13192179,0.329214332 C5.04665941,0.129541157 4.85048708,0 4.63337179,0 C4.4162565,0 4.22008416,0.129541157 4.13482179,0.329214332 L3.11172179,2.73941433 L0.496121789,2.96171433 C0.279238733,2.97970287 0.0942685405,3.12594289 0.0267269593,3.33282446 C-0.0408146219,3.53970602 0.0222330995,3.7669176 0.186721789,3.90941433 L2.17442179,5.62541433 L1.57772179,8.18771433 C1.52834261,8.39968894 1.6108498,8.62060897 1.78709187,8.74832062 C1.96333395,8.87603227 2.19896223,8.88564518 2.38502179,8.77271433 L4.63272179,7.41941433 Z"/></g></g></svg>`;

function ratingBadge(rating, cls, size = 'md') {
  const s = size === 'lg' ? 'pd-rating-badge lg' : size === 'sm' ? 'pd-rating-badge sm' : 'pd-rating-badge';
  return `<div class="${s} ${cls}"><span>${rating}</span>${STAR_SVG}</div>`;
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
function fmtMins(mins) {
  if (!mins || !Array.isArray(mins) || !mins.length) return '';
  return `<span class="event-mins">${mins.map(m => m + "'").join(', ')}</span>`;
}

// ─── Overlays ─────────────────────────────────────────────────────────────────
function openOverlay(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.setAttribute('aria-hidden','false');
  el.classList.add('open');
  document.body.style.overflow='hidden';
  const m = el.querySelector('.modal');
  if (m) m.scrollTop = 0;
}
function closeOverlay(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.setAttribute('aria-hidden','true');
  el.classList.remove('open');
  setTimeout(() => {
    if (!document.querySelector('.overlay.open')) document.body.style.overflow='';
  }, 300); // Wait for transition
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function showToast(msg) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.remove('show');
  void toast.offsetWidth;
  toast.classList.add('show');
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => toast.classList.remove('show'), 3000);
}

// ─── League Picker ────────────────────────────────────────────────────────────
async function loadLeagues() {
  if (leagues.length) return leagues;
  leagues = await api('/api/leagues');
  return leagues;
}

function toggleLeagueDropdown(open) {
  const dropdown = document.getElementById('league-dropdown');
  const trigger = document.getElementById('league-btn-pill');
  const menu = document.getElementById('league-dropdown-menu');
  const list = document.getElementById('league-grid');
  
  if (open) {
    // Populate list if empty
    if (list.innerHTML.trim() === '') {
      list.innerHTML = '<div class="spinner-wrap"><div class="spinner"></div></div>';
      loadLeagues().then(leaguesList => {
        list.innerHTML = leaguesList.map(l => `
          <div class="league-dropdown-item ${l.id === 'ligaplus-u18' ? 'disabled' : ''}" data-id="${l.id}">
            <img src="${l.logo}" alt="${l.name}" loading="lazy" onerror="this.style.opacity='.15'">
            <span>${l.name}${l.id === 'ligaplus-u18' ? ' <span style="font-size:10px;color:var(--text-4)">(bugged)</span>' : ''}</span>
          </div>`).join('');
        
        list.querySelectorAll('.league-dropdown-item').forEach(item => {
          item.addEventListener('click', () => {
            if (item.classList.contains('disabled')) {
              showToast('This tournament is currently bugged.');
              return;
            }
            selectLeague(item.dataset.id);
          });
        });
      }).catch(() => {
        list.innerHTML = '<div style="padding:16px;text-align:center;color:var(--text-3)">Failed to load</div>';
      });
    }
    dropdown.classList.add('open');
    trigger.classList.add('open');
  } else {
    dropdown.classList.remove('open');
    trigger.classList.remove('open');
  }
}

async function openLeaguePicker() {
  toggleLeagueDropdown(true);
}

function selectLeague(id) {
  if (id === league) { toggleLeagueDropdown(false); return; }
  league = id;
  clearLeagueCache();
  toggleLeagueDropdown(false);
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
function fadedHtml(html) { return `<div class="detail-fade-in">${html}</div>`; }
function empty(id, msg='Nothing here') { document.getElementById(id).innerHTML = fadedHtml(`<div class="empty-state"><div class="empty-icon">⚽</div><div class="empty-msg">${msg}</div></div>`); }
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
      <div class="mrow-home" data-team-id="${g.home.id}" style="cursor:pointer">
        <span class="mrow-name">${g.home.name ?? '—'}</span>
        <img class="mrow-logo" src="${g.home.logo}" loading="lazy" alt="" onerror="this.style.opacity='.15'">
      </div>
      ${centerHtml}
      <div class="mrow-away" data-team-id="${g.away.id}" style="cursor:pointer">
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

    // ======= News content =======
    const newsHtml = homeData.latestNews?.length 
      ? homeData.latestNews.map(n => `
          <div class="news-card fade-item" data-news-id="${n.id}" style="cursor:pointer">
            <img class="news-thumb" src="${n.image}" loading="lazy" alt="" onerror="this.style.opacity='.2'">
            <div class="news-body">
              <div class="news-title">${n.title}</div>
              <div class="news-date">${fmtDate(n.date)}</div>
            </div>
          </div>`).join('')
      : '<div class="empty-state"><div class="empty-msg">No news available</div></div>';
    
    // ======= Best Team content =======
    let bestTeamHtml = '<div class="spinner-wrap"><div class="spinner"></div></div>';
    try {
      const [allPlayers, recentGames] = await Promise.all([
        api(`/api/leagues/${league}/players`),
        api(`/api/leagues/${league}/results`).catch(() => []),
      ]);
      
      if (allPlayers?.length && recentGames?.length) {
        const gameIds = recentGames.slice(0, 15).map(g => g.id);
        const gameStats = await Promise.all(
          gameIds.map(id => api(`/api/games/${id}`).catch(() => null))
        );
        
        const playerRatings = new Map();
        const playerIdMap = new Map();
        const gkFromGames = new Map();
        
        for (const game of gameStats.filter(Boolean)) {
          const stats = game.playerStatistics ?? [];
          for (const p of stats) {
            if (p.position === 'POR' && p.playerId && !gkFromGames.has(p.playerId)) {
              gkFromGames.set(p.playerId, {
                id: p.playerId,
                firstName: p.firstName || '',
                lastName: p.lastName || '',
                position: 'Portero',
                points: 0,
                gamesPlayed: 0
              });
            }
            let key = p.playerId ? String(p.playerId) : null;
            const nameKey = p.firstName && p.lastName 
              ? `${p.firstName.toLowerCase().trim()}_${p.lastName.toLowerCase().trim()}` 
              : null;
            if (nameKey && !playerIdMap.has(nameKey)) playerIdMap.set(nameKey, key);
            if (key) {
              if (!playerRatings.has(key)) playerRatings.set(key, []);
              const rating = ptsToRating(p.points);
              if (rating) {
                const r = parseFloat(rating);
                if (r >= 5.0 && r <= 9.9) playerRatings.get(key).push(r);
              }
            }
          }
        }
        
        for (const p of allPlayers) {
          const nameKey = `${p.firstName?.toLowerCase().trim()}_${p.lastName?.toLowerCase().trim()}`;
          if (playerIdMap.has(nameKey) && !playerRatings.has(String(p.id))) {
            const originalId = playerIdMap.get(nameKey);
            if (originalId && playerRatings.has(originalId)) playerRatings.set(String(p.id), playerRatings.get(originalId));
          }
        }
        
        for (const [pid, gk] of gkFromGames) {
          if (!allPlayers.find(p => String(p.id) === String(pid))) allPlayers.push(gk);
        }
        
        const getMedianRating = (ratings) => {
          if (!ratings || ratings.length < 2) return null;
          const sorted = [...ratings].slice().sort((a, b) => a - b);
          const len = sorted.length;
          const mid = Math.floor(len / 2);
          return len % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
        };
        
        const playersWithMedian = [];
        for (const p of allPlayers) {
          const ratings = playerRatings.get(String(p.id));
          const median = getMedianRating(ratings);
          if (median !== null) playersWithMedian.push({ ...p, medianRating: median });
        }
        
        if (playersWithMedian.length) {
          const sortedByMedian = [...playersWithMedian].sort((a, b) => b.medianRating - a.medianRating);
          bestTeamHtml = renderBestTeam(sortedByMedian, true);
        } else {
          bestTeamHtml = '<div class="empty-state"><div class="empty-msg">Not enough game data</div></div>';
        }
      } else {
        bestTeamHtml = '<div class="empty-state"><div class="empty-msg">No player data</div></div>';
      }
    } catch(e) {
      console.error('Failed to load best team:', e);
      bestTeamHtml = '<div class="empty-state"><div class="empty-msg">Failed to load</div></div>';
    }
    
    // ======= FULL PAGE 3-COLUMN LAYOUT =======
    html += '<div class="home-page-grid">';
    
    // LEFT COLUMN: News
    html += '<div class="home-page-left">';
    html += '<div class="section"><div class="section-head"><div class="section-title">News</div></div><div class="news-wrap">' + newsHtml + '</div></div>';
    html += '</div>';
    
    // CENTER COLUMN: Quick scores + Featured match + Recent results + League table
    html += '<div class="home-page-center">';

    // Featured Match - Hero Section
    const featured = homeData.upcomingGames?.[0] ?? results[0];
    if (featured) {
      const isFinal = featured.status === 'final';
      const isLive  = featured.status === 'live';
      const isUpcoming = featured.status === 'upcoming';
      html += `
        <div class="hero fade-item" data-game-id="${featured.id}">
          <div class="hero-top">
            <div class="hero-context">
              ${isLive 
                ? `<span class="badge live">● LIVE</span>` 
                : isFinal ? '<span class="badge ft">Full Time</span>' : '<span class="badge upcoming">Upcoming</span>'}
              <span>${featured.tournament?.name ?? ''}</span>
            </div>
          </div>
          <div class="hero-match">
            <div class="hero-team" data-team-id="${featured.home.id}" style="cursor:pointer">
              <img class="hero-logo" src="${featured.home.logo}" alt="" onerror="this.style.opacity='.2'">
              <div class="hero-team-name">${featured.home.name ?? '—'}</div>
            </div>
            <div class="hero-center">
              ${isFinal || isLive
                ? `<div class="hero-score">${featured.home.score ?? '—'}<span class="sep"> - </span>${featured.away.score ?? '—'}</div>
                   <div class="hero-status ${isLive ? 'live' : ''}">${isLive ? '● Live Now' : 'Full Time'}</div>`
                : `<div class="hero-time">${fmtTime(featured.date)}</div>
                   <div class="hero-status">${fmtDate(featured.date)}</div>`}
            </div>
            <div class="hero-team" data-team-id="${featured.away.id}" style="cursor:pointer">
              <img class="hero-logo" src="${featured.away.logo}" alt="" onerror="this.style.opacity='.2'">
              <div class="hero-team-name">${featured.away.name ?? '—'}</div>
            </div>
          </div>
          <div class="hero-bottom">
            <span>${featured.matchday?.name ?? ''}</span>
            <span class="sep-dot"></span>
            <span>${featured.stadium?.name ?? 'League Match'}</span>
          </div>
        </div>`;
    }

    // Recent Results Strip - show all remaining results
    const recent = results.slice(1);
    if (recent.length > 0) {
      html += '<div class="section">';
      html += '<div class="section-head"><div class="section-title">Recent Results</div></div>';
      html += '<div class="results-strip">';
      html += recent.map(g => `
        <div class="result-chip" data-game-id="${g.id}">
          <div class="result-chip-teams">
            <img class="result-chip-logo" src="${g.home.logo}" alt="" onerror="this.style.opacity='.15'" data-team-id="${g.home.id}" style="cursor:pointer">
            <span class="result-chip-score">${g.home.score} - ${g.away.score}</span>
            <img class="result-chip-logo" src="${g.away.logo}" alt="" onerror="this.style.opacity='.15'" data-team-id="${g.away.id}" style="cursor:pointer">
          </div>
          <div class="result-chip-names">
            <span class="result-chip-name" data-team-id="${g.home.id}" style="cursor:pointer">${shortName(g.home.name)}</span>
            <span class="result-chip-sep">v</span>
            <span class="result-chip-name away" data-team-id="${g.away.id}" style="cursor:pointer">${shortName(g.away.name)}</span>
          </div>
        </div>`).join('');
      html += '</div></div>';
    }

    // League Table Preview
    if (homeData.standings?.length) {
      html += '<div class="section">';
      html += '<div class="section-head"><div class="section-title">League Table</div><a class="section-link" data-tab="standings">View all →</a></div>';
      html += '<div style="padding:0">';
      html += standingsGroupHtml(homeData.standings[0], { preview: true });
      html += '</div></div>';
    }

    html += '</div>'; // close center column

    // RIGHT COLUMN: Best Team
    html += '<div class="home-page-right">';
    html += '<div class="section"><div class="section-head"><div class="section-title">Best Team</div></div><div class="best-team-wrap">' + bestTeamHtml + '</div></div>';
    html += '</div>';

    html += '</div>'; // close home-page-grid

    document.getElementById('view-home').innerHTML = fadedHtml(html || '<div class="empty-state"><div class="empty-msg">Nothing to show.</div></div>');
    bindClickable('view-home');
    bindNewsClickable('view-home');
    bindBestTeamClickable('view-home');
    
    // Add click handler for "View all" link
    document.querySelectorAll('.section-link[data-tab]').forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const tab = link.dataset.tab;
        document.querySelectorAll('.nav-tab').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        document.querySelectorAll(`.nav-tab[data-tab="${tab}"]`).forEach(b => b.classList.add('active'));
        document.getElementById('view-' + tab).classList.add('active');
        document.getElementById('page-title').textContent = PAGE_TITLES[tab] ?? tab;
        currentTab = tab;
        loaders[tab]?.();
      });
    });
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
    body.innerHTML = fadedHtml(html);
    bindClickable('matches-body');
  } catch(e) {
    console.error(e);
    body.innerHTML = fadedHtml('<div class="empty-state"><div class="empty-icon">⚠️</div><div class="empty-msg">Failed to load.</div></div>');
  }
}

// ─── STANDINGS ────────────────────────────────────────────────────────────────
async function loadStandings() {
  spin('view-standings');
  try {
    const [standingsData, playersData] = await Promise.all([
      api(`/api/leagues/${league}/standings`),
      api(`/api/leagues/${league}/players`).catch(() => []),
    ]);
    
    const groups = standingsData?.groups ?? [];
    let html = '<div class="standings-wrap">';
    html += `<div class="zone-legend">
      <div class="zone-item"><div class="zone-dot" style="background:var(--champ-zone)"></div>Champion / Advance</div>
      <div class="zone-item"><div class="zone-dot" style="background:var(--promo-zone)"></div>Promotion</div>
      <div class="zone-item"><div class="zone-dot" style="background:var(--relegation)"></div>Relegation</div>
    </div>`;
    
    // Add league standings groups
    html += groups.length ? groups.map(g => standingsGroupHtml(g)).join('') : '<div class="empty-state"><div class="empty-msg">Standings not available.</div></div>';
    
    // Add Best Team as a group
    if (playersData?.length) {
      const sorted = [...playersData].sort((a, b) => (b.points ?? 0) - (a.points ?? 0));
      const positions = {
        'POR': sorted.filter(p => p.position === 'Goalkeeper' || p.position === 'Portero').slice(0, 1),
        'DEF': sorted.filter(p => p.position === 'Defender' || p.position === 'Defensa').slice(0, 5),
        'MED': sorted.filter(p => p.position === 'Midfielder' || p.position === 'Mediocampo').slice(0, 3),
        'DEL': sorted.filter(p => p.position === 'Forward' || p.position === 'Delantero').slice(0, 2),
      };
      
      const bestTeamPlayers = [...positions.POR, ...positions.DEF, ...positions.MED, ...positions.DEL];
      if (bestTeamPlayers.length) {
        const bestTeamRows = bestTeamPlayers.map((p, i) => ({
          position: i + 1,
          team: { id: p.id, name: `${p.firstName} ${p.lastName}`, logo: playerPhoto(p.id) },
          played: p.gamesPlayed ?? 0,
          won: 0, drawn: 0, lost: 0,
          goalDiff: 0,
          points: p.points ?? 0,
        }));
        
        const bestTeamGroup = { group: 'Best Team', rows: bestTeamRows };
        html += `<div class="group-card fade-item">`;
        html += `<div class="group-name-row" style="color:var(--accent)">Best Team</div>`;
        html += `<div class="standings-header"><span>#</span><span>Player</span><span>GP</span><span>Pts</span></div>`;
        bestTeamRows.forEach((r, i) => {
          const posLabel = i < 1 ? 'GK' : i < 4 ? 'DEF' : i < 7 ? 'MID' : 'FWD';
          html += `
            <div class="standings-row" data-player-id="${r.team.id}">
              <span class="s-pos">${r.position}</span>
              <span class="s-team-cell">
                <img class="s-logo" src="${r.team.logo}" loading="lazy" alt="" onerror="this.style.opacity='.15'" style="width:24px;height:24px;border-radius:50%">
                <span class="s-team-name">${r.team.name ?? '—'}</span>
                <span class="s-team-pos" style="font-size:10px;color:var(--text-3);margin-left:4px">${posLabel}</span>
              </span>
              <span>${r.played}</span>
              <span class="s-pts">${r.points}</span>
            </div>`;
        });
        html += '</div>';
      }
    }
    
    html += '</div>';
    document.getElementById('view-standings').innerHTML = fadedHtml(html);
    
    // Bind player and team clicks in standings
    document.getElementById('view-standings').querySelectorAll('[data-player-id]').forEach(node => {
      node.addEventListener('click', () => openPlayerDetail(node.dataset.playerId, league));
    });
    bindTeamClickable('view-standings');

  } catch(e) { console.error(e); fail('view-standings'); }
}

function standingsGroupHtml(group, { preview = false } = {}) {
  const rows = preview ? (group.rows ?? []).slice(0, 5) : (group.rows ?? []);
  const total = rows.length;
  let html = '<div class="group-card fade-item">';
  if (group.group) html += `<div class="group-name-row">Group ${group.group}</div>`;
  if (!preview) {
    html += `<div class="standings-header"><span>#</span><span>Team</span><span>P</span><span>W</span><span>D</span><span>L</span><span>GD</span><span>Pts</span></div>`;
  }
  rows.forEach((r, i) => {
    const pos = r.position ?? i + 1;
    const gd = r.goalDiff;
    const gdClass = gd > 0 ? 'pos' : gd < 0 ? 'neg' : '';
    const zone = getZoneClass(pos, total);
    if (preview) {
      // Compact preview row
      html += `
        <div class="standings-row-compact ${zone}">
          <span class="s-pos">${pos}</span>
          <span class="s-team-cell" data-team-id="${r.team.id}" style="cursor:pointer">
            <img class="s-logo" src="${r.team.logo}" loading="lazy" alt="" onerror="this.style.opacity='.15'">
            <span class="s-team-name">${r.team.name ?? '—'}</span>
          </span>
          <span class="s-pts">${r.points} pts</span>
        </div>`;
    } else {
      html += `
        <div class="standings-row ${zone}">
          <span class="s-pos">${pos}</span>
          <span class="s-team-cell" data-team-id="${r.team.id}" style="cursor:pointer">
            <img class="s-logo" src="${r.team.logo}" loading="lazy" alt="" onerror="this.style.opacity='.15'">
            <span class="s-team-name">${r.team.name ?? '—'}</span>
          </span>
          <span>${r.played}</span><span>${r.won}</span><span>${r.drawn}</span><span>${r.lost}</span>
          <span class="s-gd ${gdClass}">${gd > 0 ? '+' : ''}${gd}</span>
          <span class="s-pts">${r.points}</span>
        </div>`;
    }
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
            ${playersSubtab!=='goals'   ? `<div class="p-sec-stat"><div class="p-sec-val">${p.goals??0}</div><div class="p-sec-lbl">${ICON.goalSmall}</div></div>` : ''}
            ${playersSubtab!=='assists' ? `<div class="p-sec-stat"><div class="p-sec-val">${p.assists??0}</div><div class="p-sec-lbl">${ICON.assist}</div></div>` : ''}
            ${playersSubtab!=='games'   ? `<div class="p-sec-stat"><div class="p-sec-val">${p.gamesPlayed??0}</div><div class="p-sec-lbl">GP</div></div>` : ''}
          </div>
        </div>`;
    });
    html += '</div>';
    body.innerHTML = fadedHtml(html);
    body.querySelectorAll('[data-player-id]').forEach(r => r.addEventListener('click', () => openPlayerDetail(r.dataset.playerId)));
  } catch(e) { console.error(e); body.innerHTML = fadedHtml('<div class="empty-state"><div class="empty-msg">Failed to load.</div></div>'); }
}

function abbrevPos(pos) {
  if (!pos) return '?';
  const m = { 'Portero':'GK','Goalkeeper':'GK','Defensa':'DEF','Defender':'DEF','Mediocampo':'MID','Midfielder':'MID','Delantero':'FWD','Forward':'FWD' };
  return m[pos] ?? pos.slice(0,3).toUpperCase();
}

// ─── GAME DETAIL ──────────────────────────────────────────────────────────────
async function openGameDetail(gameId) {
  const content = document.getElementById('game-detail-content');
  content.innerHTML = '<div class="spinner-wrap"><div class="spinner"></div></div>';
  openOverlay('game-overlay');
  try {
    const g = await api(`/api/games/${gameId}`);
    renderGameDetailShell(g);
  } catch(e) {
    console.error(e);
    content.innerHTML = '<div class="empty-state"><div class="empty-msg">Failed to load match.</div></div>';
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
    <div class="detail-fade-in">
      <div class="gd-header">
        <div class="gd-tournament-row">${g.tournament?.name ?? ''} · ${g.matchday?.name ?? ''}</div>
        <div class="gd-teams">
          <div class="gd-team" data-team-id="${g.home.id}" style="cursor:pointer">
            <img class="gd-logo" src="${g.home.logo}" alt="" onerror="this.style.opacity='.2'">
            <div class="gd-team-name">${g.home.name ?? '—'}</div>
          </div>
          <div class="gd-score-center">${scoreSection}</div>
          <div class="gd-team" data-team-id="${g.away.id}" style="cursor:pointer">
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

  document.querySelectorAll('#game-detail-content [data-team-id]').forEach(n => {
    n.addEventListener('click', e => {
      e.stopPropagation();
      closeOverlay('game-overlay');
      openTeamDetail(n.dataset.teamId);
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
  // re-trigger tab-in animation
  body.style.animation = 'none';
  body.offsetHeight; // reflow
  body.style.animation = '';
  body.querySelectorAll('[data-player-id]').forEach(n =>
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
    const goalIcon  = goals > 0 ? `<span style="position:absolute;top:-8px;right:-8px;display:flex;gap:1px;z-index:4">${Array(Math.min(goals,2)).fill(ICON.goalSmall).join('')}</span>` : '';

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
    const align = reversed ? 'flex-end' : 'flex-start';

    return `
      <div class="pitch-th-side ${reversed ? 'away' : 'home'}">
        <img class="pitch-th-logo" src="${logo}" alt="" onerror="this.style.opacity='.3'">
        <div style="display:flex;flex-direction:column;align-items:${align};gap:1px">
          <span class="pitch-th-name">${name}</span>
          <span class="pitch-th-formation">${formation}</span>
        </div>
        ${avg ? `<div class="pitch-th-rating ${rc}">${avg}</div>` : ''}
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
  html += renderPitchTeam(homeStart, false);
  html += `<div class="pitch-divider"></div>`;
  html += renderPitchTeam(awayStart, true);
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
          <div class="ep-events">
            ${Array(p.goals).fill(ICON.goal).join('')}
            ${fmtMins(p.goalMinutes)}
          </div>
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
    const rating = pts > 0 ? ptsToRating(pts) : '5.0';
    const rClass = ratingClass(rating);
    const isDNP = p.participation === 'ATTENDED_NOT_PLAYED';
    const isSub = p.participation === 'SUBSTITUTE';
    const pLabel = participationLabel[p.participation] ?? 'SUB';
    const pid = p.playerId ?? p.id ?? '';
    const photo = playerPhoto(pid);

    const events = [
      p.goals > 0   ? `<span class="prow-event">${ICON.goalSmall}${fmtMins(p.goalMinutes)}</span>` : '',
      p.assists > 0 ? `<span class="prow-event assist">${ICON.assist}</span>` : '',
      p.ownGoals > 0 ? `<span class="prow-event og">${ICON.ownGoal}</span>` : '',
      p.yellowCards > 0 ? `<span class="prow-event">${ICON.yellowCard}${fmtMins(p.yellowCardMinutes)}</span>` : '',
      p.redCards > 0    ? `<span class="prow-event">${ICON.redCard}${fmtMins(p.redCardMinutes)}</span>`    : '',
      p.isCleanSheet ? `<span class="prow-event cs">CS</span>` : '',
      p.penaltiesStopped > 0 ? `<span class="prow-event ps">PS</span>` : '',
    ].filter(Boolean).join('');

    return `
      <div class="prow ${isDNP ? 'prow-dnp' : ''}" data-player-id="${pid}" style="cursor:pointer">
        <span class="prow-badge ${isSub ? 'prow-badge-sub' : isDNP ? 'prow-badge-dnp' : ''}">${pLabel}</span>
        <img class="prow-photo" src="${photo}" loading="lazy" alt="" onerror="this.src='${playerPhoto('default')}'">
        <div class="prow-info">
          <div class="prow-name">${p.captain ? '<span class="prow-captain">C</span>' : ''}${p.firstName ?? ''} ${p.lastName ?? ''}</div>
          <div class="prow-meta">${p.jerseyNumber ? `<span class="prow-jersey">#${p.jerseyNumber}</span>` : ''}${p.position ? `<span>${p.position}</span>` : ''}</div>
        </div>
        <div class="prow-events">${events}</div>
        ${ratingBadge(rating, rClass, 'sm')}
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
  const content = document.getElementById('player-detail-content');
  content.innerHTML = '<div class="spinner-wrap"><div class="spinner"></div></div>';
  openOverlay('player-overlay');
  try {
    const s = site || league;
    const [p, seasonArr, history, awards, records] = await Promise.all([
      api(`/api/players/${playerId}`),
      api(`/api/leagues/${s}/players/${playerId}/statistics`).catch(() => []),
      api(`/api/leagues/${s}/players/${playerId}/history`).catch(() => []),
      api(`/api/leagues/${s}/players/${playerId}/awards`).catch(() => ({})),
      api(`/api/leagues/${s}/players/${playerId}/records`).catch(() => ({})),
    ]);
    content.innerHTML = renderPlayerOverlay(p, seasonArr, history, awards, records);
    content.querySelectorAll('[data-game-id]').forEach(n =>
      n.addEventListener('click', () => {
        closeOverlay('player-overlay');
        openGameDetail(n.dataset.gameId);
      }));
    content.querySelectorAll('[data-team-id]').forEach(n =>
      n.addEventListener('click', e => {
        e.stopPropagation();
        closeOverlay('player-overlay');
        openTeamDetail(n.dataset.teamId);
      }));

  } catch(e) {
    console.error(e);
    content.innerHTML = '<div class="empty-state"><div class="empty-msg">Failed to load player.</div></div>';
  }
}

function renderPlayerOverlay(p, seasonArr, history, awards, records) {
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
  const jersey  = ts.jerseyNumber ?? p.team?.jerseyNumber ?? '';

  const recVals = Object.values(records ?? {});
  const rec = recVals.length ? recVals.reduce((a, b) => ({
    won: (a.won??0)+(b.won??0), lost: (a.lost??0)+(b.lost??0), tied: (a.tied??0)+(b.tied??0)
  }), {won:0,lost:0,tied:0}) : null;

  const totw = (awards?.teamsOfTheWeek ?? []);
  const allHistory = Array.isArray(history) ? [...history].sort((a,b) => (b.matchday?.matchdayOrder??0)-(a.matchday?.matchdayOrder??0)) : [];
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

  return `
    <div class="detail-fade-in">
      <div class="pd-hero">
        <div class="pd-hero-bg" style="background-image:url('${p.photo}')"></div>
        <div class="pd-hero-overlay"></div>
        <div class="pd-hero-content">
          <img class="pd-photo" src="${p.photo}" alt="" onerror="this.src='${playerPhoto('default')}'">
          <div class="pd-info">
            <div class="pd-name">${p.firstName} <strong>${p.lastName}</strong></div>
            <div class="pd-team" data-team-id="${p.team.id}" style="cursor:pointer"><img class="pd-team-logo" src="${p.team.logo}" alt="" onerror="this.style.opacity='.2'">${p.team.name ?? '—'}${jersey ? ` · #${jersey}` : ''}</div>
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
        ${p.dateOfBirth ? `<div class="pd-bio-row"><span class="pd-bio-label">Age</span><span class="pd-bio-val">${Math.floor((Date.now() - new Date(p.dateOfBirth)) / (365.25*24*3600*1000))} yrs</span></div>` : ''}
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
}

// ─── NEWS DETAIL ──────────────────────────────────────────────────────────────
async function openNewsDetail(newsId) {
  const content = document.getElementById('news-detail-content');
  content.innerHTML = '<div class="spinner-wrap"><div class="spinner"></div></div>';
  openOverlay('news-overlay');
  try {
    const n = await api(`/api/news/${newsId}`);
    content.innerHTML = renderNewsDetail(n);
  } catch(e) {
    console.error(e);
    content.innerHTML = '<div class="empty-state"><div class="empty-msg">Failed to load news.</div></div>';
  }
}

function renderNewsDetail(n) {
  const imgHtml = n.image ? `<div class="news-detail-image"><img src="${n.image}" alt="" onerror="this.style.display='none'"></div>` : '';
  const contentHtml = n.content ? `<div class="news-detail-body">${n.content}</div>` : '';
  return `
    <div class="detail-fade-in">
      <div class="news-detail">
        ${imgHtml}
        <div class="news-detail-content">
          <div class="news-detail-date">${fmtDateLong(n.date)}</div>
          <h1 class="news-detail-title">${n.title}</h1>
          ${contentHtml}
          <div class="news-detail-stats">
            <span>${n.views ?? 0} views</span>
          </div>
        </div>
      </div>
    </div>`;
}

function renderBestTeam(players, useMedian = false) {
  const positions = {
    'DEL': players.filter(p => p.position === 'Forward' || p.position === 'Delantero').slice(0, 2),
    'MED': players.filter(p => p.position === 'Midfielder' || p.position === 'Mediocampo').slice(0, 3),
    'DEF': players.filter(p => p.position === 'Defender' || p.position === 'Defensa').slice(0, 5),
    'POR': players.filter(p => p.position === 'Goalkeeper' || p.position === 'Portero').slice(0, 1),
  };

  function renderPlayerNode(p) {
    const ratingVal = useMedian && p.medianRating 
      ? p.medianRating 
      : (p.points ? parseFloat(ptsToRating(p.points)) : null);
    const rClass = ratingVal ? ratingClass(ratingVal.toFixed(1)) : 'r-gray';
    const ratingBadgeHtml = ratingVal 
      ? ratingBadge(ratingVal.toFixed(1), rClass, 'sm')
      : '<span style="color:var(--text-3)">—</span>';
    const firstName = p.firstName?.split(' ')[0] || '';
    return `
      <div class="best-team-player" data-player-id="${p.id}" style="cursor:pointer">
        <img class="best-team-player-photo" src="${playerPhoto(p.id)}" alt="${p.firstName}" onerror="this.src='${playerPhoto('default')}'">
        <div class="best-team-player-name">${firstName}</div>
        <div class="best-team-player-rating">${ratingBadgeHtml}</div>
      </div>`;
  }

  // Count total players rendered
  const totalPlayers = positions.DEL.length + positions.MED.length + positions.DEF.length + positions.POR.length;
  let html = `<div class="best-team-pitch${totalPlayers === 11 ? ' full' : ''}">`;
  
  // Forward line (2)
  html += `<div class="best-team-row">`;
  if (positions.DEL[0]) html += renderPlayerNode(positions.DEL[0]);
  if (positions.DEL[1]) html += renderPlayerNode(positions.DEL[1]);
  html += `</div>`;
  
  // Midfield line (3)
  html += `<div class="best-team-row">`;
  if (positions.MED[0]) html += renderPlayerNode(positions.MED[0]);
  if (positions.MED[1]) html += renderPlayerNode(positions.MED[1]);
  if (positions.MED[2]) html += renderPlayerNode(positions.MED[2]);
  html += `</div>`;
  
  // Defense line (5)
  html += `<div class="best-team-row def">`;
  if (positions.DEF[0]) html += renderPlayerNode(positions.DEF[0]);
  if (positions.DEF[1]) html += renderPlayerNode(positions.DEF[1]);
  if (positions.DEF[2]) html += renderPlayerNode(positions.DEF[2]);
  if (positions.DEF[3]) html += renderPlayerNode(positions.DEF[3]);
  if (positions.DEF[4]) html += renderPlayerNode(positions.DEF[4]);
  html += `</div>`;
  
  // Goalkeeper line (1) - only if we have GK data
  if (positions.POR[0]) {
    html += `<div class="best-team-row gk">`;
    html += renderPlayerNode(positions.POR[0]);
    html += `</div>`;
  }
  
  html += `</div>`;
  return html;
}

// ─── Click binding ────────────────────────────────────────────────────────────
function bindClickable(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.querySelectorAll('[data-game-id]').forEach(node => {
    node.addEventListener('click', () => openGameDetail(node.dataset.gameId));
    node.addEventListener('keydown', e => { if (e.key === 'Enter') openGameDetail(node.dataset.gameId); });
  });
  el.querySelectorAll('[data-team-id]').forEach(node => {
    node.addEventListener('click', e => {
      e.stopPropagation();
      openTeamDetail(node.dataset.teamId);
    });
    node.addEventListener('keydown', e => { if (e.key === 'Enter') openTeamDetail(node.dataset.teamId); });
  });
}

function bindTeamClickable(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.querySelectorAll('[data-team-id]').forEach(node => {
    node.addEventListener('click', e => {
      e.stopPropagation();
      openTeamDetail(node.dataset.teamId);
    });
  });
}

function bindNewsClickable(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.querySelectorAll('[data-news-id]').forEach(node => {
    node.addEventListener('click', () => openNewsDetail(node.dataset.newsId));
    node.addEventListener('keydown', e => { if (e.key === 'Enter') openNewsDetail(node.dataset.newsId); });
  });
}

function bindBestTeamClickable(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.querySelectorAll('[data-player-id]').forEach(node => {
    node.addEventListener('click', () => openPlayerDetail(node.dataset.playerId, league));
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
      <div class="team-card fade-item" data-team-id="${t.id}" role="button" tabindex="0">
        <img class="team-card-logo" src="${t.logo}" loading="lazy" alt="${t.name}" onerror="this.style.opacity='.15'">
        <div class="team-card-name">${t.name}</div>
        ${t.longName && t.longName !== t.name ? `<div class="team-card-sub">${t.longName}</div>` : ''}
      </div>`).join('');
    html += '</div>';
    document.getElementById('view-teams').innerHTML = fadedHtml(html);
    bindTeamClickable('view-teams');
  } catch(e) { console.error(e); fail('view-teams'); }
}

// ─── TEAM DETAIL ───────────────────────────────────────────────────────────────
let teamDetailTab = 'overview';

async function openTeamDetail(teamId) {
  const content = document.getElementById('team-detail-content');
  content.innerHTML = '<div class="spinner-wrap"><div class="spinner"></div></div>';
  openOverlay('team-overlay');
  teamDetailTab = 'overview';
  try {
    const [team, squad, stats, recent] = await Promise.all([
      api(`/api/teams/${teamId}?site=${league}`),
      api(`/api/teams/${teamId}/squad?site=${league}`).catch(() => []),
      api(`/api/teams/${teamId}/stats?site=${league}`).catch(() => ({})),
      api(`/api/teams/${teamId}/games/recent?site=${league}`).catch(() => []),
    ]);
    renderTeamDetailShell(team, squad, stats, recent);
  } catch(e) {
    console.error(e);
    content.innerHTML = '<div class="empty-state"><div class="empty-msg">Failed to load team.</div></div>';
  }
}

function renderTeamDetailShell(team, squad, stats, recent) {
  document.getElementById('team-detail-content').innerHTML = `
    <div class="detail-fade-in">
      <div class="gd-header">
        <div class="gd-teams">
          <div class="gd-team">
            <img class="gd-logo" src="${team.logo}" alt="" onerror="this.style.opacity='.2'">
            <div class="gd-team-name">${team.name}</div>
          </div>
          <div class="gd-score-center">
            <div class="gd-score" style="font-size:24px;color:var(--text-2)">${team.longName || team.name}</div>
          </div>
          <div class="gd-team"></div>
        </div>
      </div>
      <div class="gd-tabs-wrap">
        <div class="gd-tabs" id="td-tabs">
          <div class="gd-tab active" data-ttab="overview">Overview</div>
          <div class="gd-tab" data-ttab="squad">Squad</div>
          <div class="gd-tab" data-ttab="stats">Stats</div>
          <div class="gd-tab" data-ttab="matches">Matches</div>
        </div>
      </div>
      <div class="gd-body" id="td-body"></div>
    </div>`;

  document.querySelectorAll('#td-tabs .gd-tab').forEach(t => {
    t.addEventListener('click', () => {
      document.querySelectorAll('#td-tabs .gd-tab').forEach(x => x.classList.remove('active'));
      t.classList.add('active');
      teamDetailTab = t.dataset.ttab;
      renderTeamBody(team, squad, stats, recent);
    });
  });

  renderTeamBody(team, squad, stats, recent);
}

function renderTeamBody(team, squad, stats, recent) {
  const body = document.getElementById('td-body');
  if (!body) return;
  
  if (teamDetailTab === 'overview') body.innerHTML = fadedHtml(renderTeamOverview(team, stats, recent));
  else if (teamDetailTab === 'squad') body.innerHTML = fadedHtml(renderTeamSquad(squad));
  else if (teamDetailTab === 'stats') body.innerHTML = fadedHtml(renderTeamStats(stats));
  else if (teamDetailTab === 'matches') body.innerHTML = fadedHtml(renderTeamMatches(recent, team.id));

  body.style.animation = 'none';
  body.offsetHeight;
  body.style.animation = '';
  
  body.querySelectorAll('[data-player-id]').forEach(n =>
    n.addEventListener('click', () => openPlayerDetail(n.dataset.playerId, league)));
  body.querySelectorAll('[data-game-id]').forEach(n =>
    n.addEventListener('click', () => openGameDetail(n.dataset.gameId)));
}

function renderTeamOverview(team, stats, recent) {
  const gd = (stats.goalsFor || 0) - (stats.goalsAgainst || 0);
  const gdClass = gd > 0 ? 'pos' : gd < 0 ? 'neg' : '';
  
  const form = recent.filter(g => g.status === 'final').slice(0, 5).reverse().map(g => {
    const isHome = String(g.home.id) === String(team.id);
    const myScore = isHome ? g.home.score : g.away.score;
    const oppScore = isHome ? g.away.score : g.home.score;
    return myScore > oppScore ? 'W' : myScore < oppScore ? 'L' : 'D';
  });
  
  let formHtml = '';
  if (form.length) {
    const colors = { W: 'var(--accent)', L: 'var(--neg)', D: 'var(--text-3)' };
    formHtml = `<div class="gd-form-row"><span class="gd-form-label">Form</span><div class="gd-form-badges">${form.map(r => `<span class="gd-form-badge" style="background:${colors[r]}20;color:${colors[r]}">${r}</span>`).join('')}</div></div>`;
  }

  return `
    <div class="td-overview">
      <div class="gd-stat-row">
        <div class="gd-stat-pill"><div class="gd-stat-val">${stats.played ?? 0}</div><div class="gd-stat-lbl">Played</div></div>
        <div class="gd-stat-pill"><div class="gd-stat-val" style="color:var(--accent)">${stats.won ?? 0}</div><div class="gd-stat-lbl">Won</div></div>
        <div class="gd-stat-pill"><div class="gd-stat-val">${stats.drawn ?? 0}</div><div class="gd-stat-lbl">Drawn</div></div>
        <div class="gd-stat-pill"><div class="gd-stat-val" style="color:var(--neg)">${stats.lost ?? 0}</div><div class="gd-stat-lbl">Lost</div></div>
      </div>
      <div class="gd-stat-row" style="margin-top:var(--s-2)">
        <div class="gd-stat-pill"><div class="gd-stat-val" style="color:var(--accent)">${stats.goalsFor ?? 0}</div><div class="gd-stat-lbl">Goals For</div></div>
        <div class="gd-stat-pill"><div class="gd-stat-val ${gdClass}">${stats.goalsAgainst ?? 0}</div><div class="gd-stat-lbl">Goals Against</div></div>
        <div class="gd-stat-pill"><div class="gd-stat-val ${gdClass}">${gd > 0 ? '+' : ''}${gd}</div><div class="gd-stat-lbl">Goal Diff</div></div>
      </div>
      ${formHtml}
    </div>`;
}

function renderTeamSquad(squad) {
  if (!squad.length) return '<div class="empty-state"><div class="empty-icon">👥</div><div class="empty-msg">No squad data</div></div>';
  
  const posMap = { 'Goalkeeper': 'POR', 'Portero': 'POR', 'Defender': 'DEF', 'Defensa': 'DEF', 'Midfielder': 'MED', 'Mediocampo': 'MED', 'Forward': 'DEL', 'Delantero': 'DEL' };
  const groups = { POR: [], DEF: [], MED: [], DEL: [] };
  
  for (const p of squad) {
    const key = posMap[p.position] || 'MED';
    groups[key].push(p);
  }
  for (const key of Object.keys(groups)) {
    groups[key].sort((a, b) => (a.jerseyNumber || 99) - (b.jerseyNumber || 99));
  }
  
  const labels = { POR: 'Goalkeepers', DEF: 'Defenders', MED: 'Midfielders', DEL: 'Forwards' };
  const posOrder = ['POR', 'DEF', 'MED', 'DEL'];
  
  let html = '<div class="pteam-block">';
  for (const pos of posOrder) {
    const players = groups[pos];
    if (!players.length) continue;
    html += `<div class="td-pos-label">${labels[pos]}</div>`;
    html += players.map(p => `
      <div class="prow" data-player-id="${p.id}" style="cursor:pointer">
        <span class="prow-badge">${p.jerseyNumber || '—'}</span>
        <img class="prow-photo" src="${playerPhoto(p.id)}" loading="lazy" onerror="this.src='${playerPhoto('default')}'">
        <div class="prow-info">
          <div class="prow-name">${p.firstName || ''} ${p.lastName || ''}</div>
          <div class="prow-meta">${pos === 'POR' ? 'Goalkeeper' : pos === 'DEF' ? 'Defender' : pos === 'MED' ? 'Midfielder' : 'Forward'}</div>
        </div>
      </div>`).join('');
  }
  html += '</div>';
  return html;
}

function renderTeamStats(stats) {
  return `
    <div class="td-stats">
      <div class="gd-stat-row">
        <div class="gd-stat-pill"><div class="gd-stat-val">${stats.played ?? 0}</div><div class="gd-stat-lbl">Games</div></div>
        <div class="gd-stat-pill"><div class="gd-stat-val" style="color:var(--accent)">${stats.won ?? 0}</div><div class="gd-stat-lbl">Wins</div></div>
        <div class="gd-stat-pill"><div class="gd-stat-val" style="color:var(--text-3)">${stats.drawn ?? 0}</div><div class="gd-stat-lbl">Draws</div></div>
        <div class="gd-stat-pill"><div class="gd-stat-val" style="color:var(--neg)">${stats.lost ?? 0}</div><div class="gd-stat-lbl">Losses</div></div>
      </div>
    </div>`;
}

function renderTeamMatches(games, teamId) {
  if (!games.length) return '<div class="empty-state"><div class="empty-icon">📅</div><div class="empty-msg">No recent matches</div></div>';
  
  return games.map(g => {
    const isHome = String(g.home.id) === String(teamId);
    const myScore = isHome ? g.home.score : g.away.score;
    const oppScore = isHome ? g.away.score : g.home.score;
    const opponent = isHome ? g.away : g.home;
    const result = myScore > oppScore ? 'W' : myScore < oppScore ? 'L' : 'D';
    const colors = { W: 'var(--accent)', L: 'var(--neg)', D: 'var(--text-3)' };
    
    return `
      <div class="match-row" data-game-id="${g.id}">
        <div class="mrow-status ${g.status === 'final' ? 'ft' : g.status === 'live' ? 'live' : 'soon'}">${g.status === 'final' ? 'FT' : g.status === 'live' ? 'LIVE' : fmtTime(g.date)}</div>
        <div class="mrow-home">
          <span class="mrow-name">${g.home.name}</span>
          <img class="mrow-logo" src="${g.home.logo}" loading="lazy" alt="" onerror="this.style.opacity='.15'">
        </div>
        <div class="mrow-center">
          <div class="mrow-score">${g.home.score ?? '—'} - ${g.away.score ?? '—'}</div>
        </div>
        <div class="mrow-away">
          <img class="mrow-logo" src="${g.away.logo}" loading="lazy" alt="" onerror="this.style.opacity='.15'">
          <span class="mrow-name">${g.away.name}</span>
        </div>
      </div>`;
  }).join('');
}

// ─── Tab nav ──────────────────────────────────────────────────────────────────
const PAGE_TITLES = { home: 'Home', matches: 'Matches', standings: 'Table', teams: 'Teams', players: 'Players' };
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
document.getElementById('league-btn-pill').addEventListener('click', (e) => {
  e.stopPropagation();
  const dropdown = document.getElementById('league-dropdown');
  if (dropdown.classList.contains('open')) {
    toggleLeagueDropdown(false);
  } else {
    toggleLeagueDropdown(true);
  }
});

document.addEventListener('click', (e) => {
  const dropdown = document.getElementById('league-dropdown');
  if (!dropdown.contains(e.target)) {
    toggleLeagueDropdown(false);
  }
});

document.getElementById('game-scrim').addEventListener('click',   () => closeOverlay('game-overlay'));
document.getElementById('game-close-pill').addEventListener('click',   () => closeOverlay('game-overlay'));
document.getElementById('player-scrim').addEventListener('click', () => closeOverlay('player-overlay'));
document.getElementById('player-close-pill').addEventListener('click', () => closeOverlay('player-overlay'));
document.getElementById('news-scrim').addEventListener('click', () => closeOverlay('news-overlay'));
document.getElementById('news-close-pill').addEventListener('click', () => closeOverlay('news-overlay'));
document.getElementById('team-scrim').addEventListener('click', () => closeOverlay('team-overlay'));
document.getElementById('team-close-pill').addEventListener('click', () => closeOverlay('team-overlay'));

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
