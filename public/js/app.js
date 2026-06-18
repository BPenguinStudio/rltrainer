// ─────────────────────────────────────────────────────────────────────────
//  RL Trainer — front-end application (vanilla JS, no build step)
// ─────────────────────────────────────────────────────────────────────────
import { RANKS, SKILLS, TOTAL_SKILLS } from './skills.js';
import { rankEmblem, rankColors } from './emblems.js';

const DIVISIONS = [
  'Bronze I', 'Bronze II', 'Bronze III',
  'Silver I', 'Silver II', 'Silver III',
  'Gold I', 'Gold II', 'Gold III',
  'Platinum I', 'Platinum II', 'Platinum III',
  'Diamond I', 'Diamond II', 'Diamond III',
  'Champion I', 'Champion II', 'Champion III',
  'Grand Champion I', 'Grand Champion II', 'Grand Champion III',
  'Supersonic Legend'
];
const TIER_ORDER = RANKS.map((r) => r.key);

const state = {
  config: { discordEnabled: false },
  user: null,
  page: 'profile',     // profile | train | community
  rankTab: 'bronze',
  open: new Set(),     // open skill ids
  community: null,
  loginBusy: false
};

const app = document.getElementById('app');

// ── small DOM helper ─────────────────────────────────────────────────────
const esc = (s) => String(s).replace(/[&<>"']/g, (c) =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// ── rank math (mirrors the server) ───────────────────────────────────────
function rankInfo(masteredCount) {
  const total = TOTAL_SKILLS || 1;
  const ratio = masteredCount / total;
  let index = Math.floor(ratio * DIVISIONS.length);
  if (index >= DIVISIONS.length) index = DIVISIONS.length - 1;
  const perDiv = total / DIVISIONS.length;
  const intoDiv = masteredCount - index * perDiv;
  const pctToNext = index >= DIVISIONS.length - 1 ? 100 : Math.max(0, Math.min(100, (intoDiv / perDiv) * 100));
  return {
    index,
    name: DIVISIONS[index],
    tierKey: TIER_ORDER[Math.min(Math.floor(index / 3), TIER_ORDER.length - 1)],
    pctToNext: Math.round(pctToNext),
    overallPct: Math.round(ratio * 100)
  };
}

function masteredCount() {
  return Object.values(state.user?.progress || {}).filter(Boolean).length;
}

// ── API ──────────────────────────────────────────────────────────────────
async function api(path, opts = {}) {
  const res = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    ...opts
  });
  if (!res.ok && res.status !== 401) throw new Error(`${path} -> ${res.status}`);
  return res.json().catch(() => ({}));
}

// ── toasts ───────────────────────────────────────────────────────────────
function toast(msg, kind = '') {
  let wrap = document.querySelector('.toast-wrap');
  if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toast-wrap'; document.body.appendChild(wrap); }
  const t = document.createElement('div');
  t.className = `toast ${kind}`;
  t.innerHTML = msg;
  wrap.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; t.style.transition = 'opacity .4s'; }, 3200);
  setTimeout(() => t.remove(), 3700);
}

// ═══════════════════════════════════════════════════════════════════════
//  LOGIN SCREEN
// ═══════════════════════════════════════════════════════════════════════
function renderLogin() {
  const params = new URLSearchParams(location.search);
  let banner = '';
  if (params.get('error')) {
    const map = {
      discord_not_configured: 'Discord login isn\'t configured on this server yet. Try a demo profile below, or see the README to set up Discord OAuth.',
      oauth_state: 'Login session expired or was tampered with. Please try again.',
      oauth_failed: 'Something went wrong talking to Discord. Please try again.'
    };
    banner = `<div class="banner banner-error">${esc(map[params.get('error')] || 'Login failed. Please try again.')}</div>`;
  }

  const chips = DIVISIONS.filter((_, i) => [0, 3, 6, 9, 12, 15, 18, 21].includes(i))
    .map((d) => `<span class="rank-chip">${esc(d)}</span>`).join('');

  app.innerHTML = `
  <div class="login">
    <div class="login-hero">
      <div class="brand">
        <div class="brand-mark">🚀</div>
        <div class="brand-name">RL<span>Trainer</span></div>
      </div>
      <h1 class="hero-title">From <span class="grad">Bronze</span><br/>to <span class="grad">Supersonic<br/>Legend</span></h1>
      <p class="hero-sub">The complete, no-filler Rocket League skills curriculum. ${TOTAL_SKILLS} mechanics laid out in the exact order to learn them — each with step-by-step coaching and a video tutorial. Your rank climbs as you master them.</p>
      <div class="rank-strip">${chips}</div>
    </div>

    <div class="login-card-wrap">
      <div class="login-card">
        ${banner}
        <h2>Get in the arena</h2>
        <p class="muted">Sign in to track your progress and watch your rank rise.</p>

        <button class="btn btn-discord btn-block" id="discordBtn">
          <svg width="22" height="22" viewBox="0 0 127 96" fill="currentColor"><path d="M107.7 8.07A105.15 105.15 0 0 0 81.47 0a72.06 72.06 0 0 0-3.36 6.83 97.68 97.68 0 0 0-29.11 0A72.37 72.37 0 0 0 45.64 0a105.89 105.89 0 0 0-26.25 8.09C2.79 32.65-1.71 56.6.54 80.21a105.73 105.73 0 0 0 32.17 16.15 77.7 77.7 0 0 0 6.89-11.11 68.42 68.42 0 0 1-10.85-5.18c.91-.66 1.8-1.34 2.66-2a75.57 75.57 0 0 0 64.32 0c.87.71 1.76 1.39 2.66 2a68.68 68.68 0 0 1-10.87 5.19 77 77 0 0 0 6.89 11.1 105.25 105.25 0 0 0 32.19-16.14c2.64-27.38-4.51-51.11-18.9-72.15ZM42.45 65.69C36.18 65.69 31 60 31 53s5-12.74 11.43-12.74S54 46 53.89 53s-5.05 12.69-11.44 12.69Zm42.24 0C78.41 65.69 73.25 60 73.25 53s5-12.74 11.44-12.74S96.23 46 96.12 53s-5.04 12.69-11.43 12.69Z"/></svg>
          Log in with Discord
        </button>

        <div class="login-divider">OR</div>

        <input class="demo-field" id="demoName" maxlength="24" placeholder="Pick a display name (optional)" />
        <button class="btn btn-ghost btn-block" id="demoBtn">Try a Demo Profile</button>

        <ul class="feature-bullets">
          <li>Your rank updates automatically as you master skills</li>
          <li>Progress saves and syncs every time you return</li>
          <li>Climb the community leaderboard of fellow trainees</li>
        </ul>

        <p class="login-note">${state.config.discordEnabled
          ? 'Discord login opens Discord to securely connect your account — your username & avatar come straight from your profile.'
          : 'Heads up: Discord login isn\'t configured on this server. The demo profile gives you the full experience right now; see the README to enable real Discord sign-in.'}
        </p>
      </div>
    </div>
  </div>`;

  document.getElementById('discordBtn').onclick = () => {
    if (!state.config.discordEnabled) {
      toast('⚠️ Discord isn\'t configured on this server — try a demo profile!', '');
      return;
    }
    window.location.href = '/auth/discord';
  };
  document.getElementById('demoBtn').onclick = doDemoLogin;
  document.getElementById('demoName').addEventListener('keydown', (e) => { if (e.key === 'Enter') doDemoLogin(); });
}

async function doDemoLogin() {
  if (state.loginBusy) return;
  state.loginBusy = true;
  const name = document.getElementById('demoName')?.value?.trim() || '';
  try {
    const data = await api('/api/demo-login', { method: 'POST', body: JSON.stringify({ username: name }) });
    state.user = data.user;
    history.replaceState({}, '', '/');
    render();
    toast('🚀 Welcome to the arena! Head to Train to start climbing.', '');
  } catch {
    toast('Could not start a demo session. Please retry.', '');
  } finally {
    state.loginBusy = false;
  }
}

// ═══════════════════════════════════════════════════════════════════════
//  APP SHELL
// ═══════════════════════════════════════════════════════════════════════
function avatarEl(user, size = 40, cls = 'avatar') {
  if (user.avatar) {
    return `<img class="${cls}" src="${esc(user.avatar)}" alt="" referrerpolicy="no-referrer" onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'${cls === 'avatar' ? 'avatar-fallback' : 'profile-avatar-fallback'}',textContent:'${esc((user.displayName || '?')[0].toUpperCase())}',style:'background:linear-gradient(135deg,#ff7a18,#2f6cd6)'}))" />`;
  }
  const letter = esc((user.displayName || '?')[0].toUpperCase());
  const fb = cls === 'avatar' ? 'avatar-fallback' : 'profile-avatar-fallback';
  return `<div class="${fb}" style="background:linear-gradient(135deg,#ff7a18,#2f6cd6)">${letter}</div>`;
}

function renderShell(inner) {
  const r = rankInfo(masteredCount());
  const cols = rankColors(r.tierKey);
  app.innerHTML = `
  <div class="shell">
    <header class="app-header">
      <div class="container header-row">
        <div class="header-brand"><div class="brand-mark">🚀</div>RL<span>Trainer</span></div>
        <nav class="nav">
          <button class="nav-btn" data-page="profile">👤 Profile</button>
          <button class="nav-btn" data-page="train">🎯 Train</button>
          <button class="nav-btn" data-page="community">🏆 Community</button>
        </nav>
        <div class="header-spacer"></div>
        <div class="header-user">
          <div class="header-rankline">
            <div class="nm">${esc(state.user.displayName)}</div>
            <div class="rk" style="color:${cols.b}">${esc(r.name)}</div>
          </div>
          <span style="width:34px;height:34px;display:inline-block">${rankEmblem(r.tierKey, 34)}</span>
          ${avatarEl(state.user, 40, 'avatar')}
          <button class="btn btn-ghost" id="logoutBtn" style="padding:8px 12px">Log out</button>
        </div>
      </div>
    </header>
    <main class="main"><div class="container" id="pageRoot">${inner}</div></main>
    <nav class="mobile-nav">
      <button data-page="profile"><span class="mi">👤</span>Profile</button>
      <button data-page="train"><span class="mi">🎯</span>Train</button>
      <button data-page="community"><span class="mi">🏆</span>Community</button>
    </nav>
  </div>`;

  // nav state + handlers
  document.querySelectorAll('[data-page]').forEach((b) => {
    if (b.dataset.page === state.page) b.classList.add('active');
    b.onclick = () => goto(b.dataset.page);
  });
  document.getElementById('logoutBtn').onclick = doLogout;
}

function goto(page) {
  state.page = page;
  render();
  document.getElementById('pageRoot')?.scrollIntoView({ block: 'start' });
}

async function doLogout() {
  try { await api('/api/logout', { method: 'POST' }); } catch {}
  state.user = null;
  state.open.clear();
  render();
}

// ═══════════════════════════════════════════════════════════════════════
//  PROFILE PAGE
// ═══════════════════════════════════════════════════════════════════════
function renderProfile() {
  const mc = masteredCount();
  const r = rankInfo(mc);
  const cols = rankColors(r.tierKey);
  const isSSL = r.index >= DIVISIONS.length - 1;

  // per-tier mastered counts for the ladder
  const ladder = RANKS.map((rk) => {
    const skillsInTier = SKILLS.filter((s) => s.rank === rk.key);
    const done = skillsInTier.filter((s) => state.user.progress?.[s.id]).length;
    return { rk, total: skillsInTier.length, done };
  });

  renderShell(`
    <div class="page-head">
      <h1>Your Garage</h1>
      <p>Master skills in the Train tab and watch your rank climb in real time.</p>
    </div>

    <div class="profile-grid">
      <div class="card">
        <div class="profile-id">
          ${avatarEl(state.user, 88, 'profile-avatar')}
          <div>
            <div class="profile-name">${esc(state.user.displayName)}</div>
            <div class="profile-tag">
              @${esc(state.user.username)}
              <span class="provider-pill ${state.user.provider === 'demo' ? 'demo' : ''}">${state.user.provider === 'discord' ? 'Discord' : 'Demo'}</span>
            </div>
          </div>
        </div>

        <div class="rank-display">
          <div class="rank-emblem-lg">${rankEmblem(r.tierKey, 110)}</div>
          <div class="rank-meta">
            <div class="rank-name-big" style="color:${cols.b}">${esc(r.name)}</div>
            <div class="rank-sub">${isSSL ? 'You\'ve reached the summit. Legend status. 👑' : `${r.pctToNext}% of the way to ${esc(DIVISIONS[r.index + 1])}`}</div>
            <div class="boost-meter">
              <div class="boost-meter-label"><span>RANK PROGRESS</span><span>${r.overallPct}%</span></div>
              <div class="boost-track"><div class="boost-fill" style="width:${Math.max(3, r.overallPct)}%"></div></div>
            </div>
          </div>
        </div>

        <div class="stat-row">
          <div class="stat"><div class="num">${mc}</div><div class="lbl">Skills Mastered</div></div>
          <div class="stat"><div class="num">${TOTAL_SKILLS - mc}</div><div class="lbl">Skills To Go</div></div>
          <div class="stat"><div class="num">${r.overallPct}%</div><div class="lbl">Completion</div></div>
        </div>
      </div>

      <div class="card">
        <h3 style="font-size:20px;margin-bottom:14px">Rank Ladder</h3>
        <div class="rankladder">
          ${ladder.map(({ rk, total, done }) => {
            const isCurrent = rk.key === r.tierKey;
            const complete = done === total && total > 0;
            return `<div class="ladder-row ${complete ? 'done' : ''} ${isCurrent ? 'current' : ''}">
              <span class="ladder-emblem">${rankEmblem(rk.key, 30)}</span>
              <span class="ladder-name" style="${isCurrent ? `color:${rankColors(rk.key).b}` : ''}">${esc(rk.name)}${complete ? ' ✓' : ''}</span>
              <span class="ladder-count">${done}/${total}</span>
            </div>`;
          }).join('')}
        </div>
        <div class="note-card">Your rank is calculated from how many skills you've mastered across the whole curriculum — keep checking them off in <b>Train</b> and you'll climb automatically.</div>
      </div>
    </div>
  `);
}

// ═══════════════════════════════════════════════════════════════════════
//  TRAIN PAGE
// ═══════════════════════════════════════════════════════════════════════
function youtubeSearchUrl(skill) {
  const q = skill.searchQuery || `${skill.name} rocket league tutorial`;
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;
}

function diffDots(n) {
  let out = '<span class="diff" title="Difficulty">';
  for (let i = 0; i < 5; i++) out += `<i class="${i < n ? 'on' : ''}"></i>`;
  return out + '</span>';
}

function renderTrain() {
  const tier = RANKS.find((r) => r.key === state.rankTab) || RANKS[0];
  const cols = rankColors(tier.key);
  const tierSkills = SKILLS.filter((s) => s.rank === tier.key);
  const doneInTier = tierSkills.filter((s) => state.user.progress?.[s.id]).length;

  const tabs = RANKS.map((r) => {
    const active = r.key === state.rankTab;
    const c = rankColors(r.key);
    return `<button class="rank-tab ${active ? 'active' : ''}" data-rank="${r.key}"
      style="${active ? `background:linear-gradient(120deg,${c.a},${c.b});box-shadow:0 8px 22px -8px ${c.a}` : ''}">
      <span class="te">${rankEmblem(r.key, 26)}</span>${esc(r.name)}</button>`;
  }).join('');

  const skillCards = tierSkills.map((s, i) => {
    const mastered = !!state.user.progress?.[s.id];
    const isOpen = state.open.has(s.id);
    const video = s.youtubeId
      ? `<h4>Video Tutorial</h4>
         <div class="video-wrap"><iframe loading="lazy" src="https://www.youtube-nocookie.com/embed/${esc(s.youtubeId)}" title="${esc(s.name)} tutorial" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>
         <a class="yt-link" href="${youtubeSearchUrl(s)}" target="_blank" rel="noopener">More ${esc(s.name)} tutorials on YouTube</a>`
      : `<a class="yt-link" href="${youtubeSearchUrl(s)}" target="_blank" rel="noopener">Watch ${esc(s.name)} tutorials on YouTube</a>`;

    return `<div class="skill ${isOpen ? 'open' : ''} ${mastered ? 'mastered' : ''}" data-skill="${s.id}">
      <div class="skill-head" data-toggle="${s.id}">
        <div class="skill-num">${i + 1}</div>
        <div class="skill-icon">${s.icon}</div>
        <div class="skill-headmeta">
          <div class="skill-name">${esc(s.name)} ${diffDots(s.difficulty)} <span class="div-tag">${esc(s.division)}</span></div>
          <div class="skill-short">${esc(s.short)}</div>
        </div>
        <div class="skill-actions">
          <button class="master-btn ${mastered ? 'on' : ''}" data-master="${s.id}">
            ${mastered ? '✓ <span class="lbltext">Mastered</span>' : '<span class="lbltext">Mark</span> Mastered'}
          </button>
          <span class="chev">▼</span>
        </div>
      </div>
      <div class="skill-body">
        <h4>How To Do It</h4>
        <ol class="steps">${s.steps.map((st) => `<li>${esc(st)}</li>`).join('')}</ol>
        ${s.tips.length ? `<h4>Coach's Tips</h4><ul class="tips">${s.tips.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>` : ''}
        ${video}
      </div>
    </div>`;
  }).join('');

  renderShell(`
    <div class="page-head">
      <h1>Train</h1>
      <p>Pick a rank, then work top-to-bottom — skills are ordered exactly how you should learn them.</p>
    </div>

    <div class="rank-tabs">${tabs}</div>

    <div class="rank-banner" style="background:linear-gradient(120deg, ${cols.a}22, ${cols.b}11);border-color:${cols.a}55">
      <div class="rank-banner-emblem">${rankEmblem(tier.key, 84)}</div>
      <div>
        <div class="tagline" style="color:${cols.b}">${esc(tier.tagline)}</div>
        <h2>${esc(tier.name)}</h2>
        <div class="blurb">${esc(tier.blurb)}</div>
      </div>
      <div class="order-pill">${doneInTier}/${tierSkills.length} MASTERED</div>
    </div>

    <div class="skill-list">${skillCards}</div>
  `);

  // tab handlers
  document.querySelectorAll('[data-rank]').forEach((b) => {
    b.onclick = () => { state.rankTab = b.dataset.rank; renderTrain(); document.querySelector('.rank-tabs')?.scrollIntoView({ block: 'nearest' }); };
  });
  // toggle open/close (but not when clicking the master button)
  document.querySelectorAll('[data-toggle]').forEach((el) => {
    el.onclick = (e) => {
      if (e.target.closest('[data-master]')) return;
      const id = el.dataset.toggle;
      if (state.open.has(id)) state.open.delete(id); else state.open.add(id);
      const card = el.closest('.skill');
      card.classList.toggle('open');
    };
  });
  // master toggle
  document.querySelectorAll('[data-master]').forEach((btn) => {
    btn.onclick = (e) => { e.stopPropagation(); toggleMaster(btn.dataset.master); };
  });
}

async function toggleMaster(skillId) {
  const before = rankInfo(masteredCount());
  const currently = !!state.user.progress?.[skillId];
  const next = !currently;

  // optimistic update
  state.user.progress = state.user.progress || {};
  if (next) state.user.progress[skillId] = true; else delete state.user.progress[skillId];

  const after = rankInfo(masteredCount());

  // refresh just the train view to reflect button + banner counts
  renderTrain();

  if (next && after.index > before.index) {
    const cols = rankColors(after.tierKey);
    toast(`<span style="font-size:18px">⬆️</span> <b>RANK UP!</b> You're now <b style="color:${cols.b}">${esc(after.name)}</b>`, 'rankup');
  } else if (next) {
    toast('✓ Skill mastered — nice!', '');
  }

  // persist
  try {
    const data = await api('/api/progress', { method: 'POST', body: JSON.stringify({ skillId, mastered: next }) });
    if (data.user) state.user = data.user;
  } catch {
    toast('Could not save that — check your connection.', '');
  }
}

// ═══════════════════════════════════════════════════════════════════════
//  COMMUNITY PAGE
// ═══════════════════════════════════════════════════════════════════════
async function renderCommunity() {
  renderShell(`
    <div class="page-head">
      <h1>Community</h1>
      <p>Everyone training on RL Trainer, ranked by skills mastered.</p>
    </div>
    <div id="commRoot"><div class="boot-loader" style="min-height:200px"><div class="boot-ball"></div><p>Loading the leaderboard…</p></div></div>
  `);

  let players = state.community;
  try {
    const data = await api(`/api/community?total=${TOTAL_SKILLS}`);
    players = data.players || [];
    state.community = players;
  } catch {
    players = players || [];
  }

  const root = document.getElementById('commRoot');
  if (!root) return;

  const friendsNote = `<div class="note-card">
    <b>About Discord friends:</b> Discord's API doesn't let apps read your friends list, so instead this board shows <i>everyone</i> training here. Compete with the whole community — climb the ranks and top the list!
  </div>`;

  if (!players.length) {
    root.innerHTML = `<div class="empty-state"><div class="big">🏟️</div><p>No trainees on the board yet — you could be #1. Go master some skills!</p></div>${friendsNote}`;
    return;
  }

  const rows = players.map((p, i) => {
    const tierKey = TIER_ORDER[Math.min(Math.floor((p.rankIndex || 0) / 3), TIER_ORDER.length - 1)];
    const cols = rankColors(tierKey);
    const me = state.user && p.id === state.user.id;
    const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`;
    return `<div class="player-row ${me ? 'me' : ''}">
      <div class="player-rankpos ${i < 3 ? 'top' : ''}">${medal}</div>
      <span class="player-emblem">${rankEmblem(tierKey, 36)}</span>
      <span class="player-name">${esc(p.displayName)}${me ? ' <span class="provider-pill">you</span>' : ''}</span>
      <span class="player-rank" style="color:${cols.b}">${esc(p.rankName || 'Bronze I')}</span>
      <span class="player-count">${p.masteredCount} skills</span>
    </div>`;
  }).join('');

  root.innerHTML = `<div class="community-list">${rows}</div>${friendsNote}`;
}

// ═══════════════════════════════════════════════════════════════════════
//  ROUTER
// ═══════════════════════════════════════════════════════════════════════
function render() {
  if (!state.user) { renderLogin(); return; }
  if (state.page === 'train') renderTrain();
  else if (state.page === 'community') renderCommunity();
  else renderProfile();
}

// ── boot ───────────────────────────────────────────────────────────────
async function boot() {
  try {
    const [cfg, me] = await Promise.all([api('/api/config'), api('/api/me')]);
    state.config = cfg || { discordEnabled: false };
    state.user = me?.user || null;
  } catch {
    state.config = { discordEnabled: false };
  }
  // success banner after discord login
  const params = new URLSearchParams(location.search);
  if (params.get('login') === 'success' && state.user) {
    history.replaceState({}, '', '/');
    setTimeout(() => toast(`🎮 Welcome, <b>${esc(state.user.displayName)}</b>! Let's climb.`, ''), 300);
  }
  render();
}

boot();
