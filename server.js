// ─────────────────────────────────────────────────────────────────────────
//  RL Trainer — zero-dependency Node.js server
//
//  • Serves the static front-end in /public
//  • Real "Log in with Discord" via OAuth2 (when configured)
//  • A "demo profile" login so the site is fully usable with no setup
//  • Per-user progress + rank, persisted to disk as JSON
//
//  Run with:  node server.js   (no `npm install` required)
// ─────────────────────────────────────────────────────────────────────────

import http from 'node:http';
import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, normalize, extname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(__dirname, 'public');
const DATA_DIR = join(__dirname, 'data');
const DB_FILE = join(DATA_DIR, 'db.json');
const SECRET_FILE = join(DATA_DIR, '.session-secret');

// ── Tiny .env loader (no dependency) ─────────────────────────────────────
function loadEnv() {
  const envPath = join(__dirname, '.env');
  if (!existsSync(envPath)) return;
  for (const raw of readFileSync(envPath, 'utf8').split('\n')) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let val = line.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = val;
  }
}
loadEnv();

const PORT = parseInt(process.env.PORT || '3000', 10);
const PUBLIC_URL = (process.env.PUBLIC_URL || `http://localhost:${PORT}`).replace(/\/$/, '');
const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID || '';
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET || '';
const DISCORD_REDIRECT_URI = process.env.DISCORD_REDIRECT_URI || `${PUBLIC_URL}/auth/discord/callback`;
const DISCORD_ENABLED = Boolean(DISCORD_CLIENT_ID && DISCORD_CLIENT_SECRET);

// ── Persistence ──────────────────────────────────────────────────────────
if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });

function loadDB() {
  if (!existsSync(DB_FILE)) return { users: {}, sessions: {} };
  try {
    return JSON.parse(readFileSync(DB_FILE, 'utf8'));
  } catch {
    return { users: {}, sessions: {} };
  }
}
let db = loadDB();
let saveTimer = null;
function saveDB() {
  // debounce writes a touch so rapid progress toggles don't thrash disk
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
  }, 50);
}

function getSecret() {
  if (process.env.SESSION_SECRET) return process.env.SESSION_SECRET;
  if (existsSync(SECRET_FILE)) return readFileSync(SECRET_FILE, 'utf8');
  const s = randomBytes(32).toString('hex');
  writeFileSync(SECRET_FILE, s);
  return s;
}
const SECRET = getSecret();

// ── Cookie signing ───────────────────────────────────────────────────────
function sign(value) {
  const mac = createHmac('sha256', SECRET).update(value).digest('base64url');
  return `${value}.${mac}`;
}
function unsign(signed) {
  if (!signed) return null;
  const i = signed.lastIndexOf('.');
  if (i === -1) return null;
  const value = signed.slice(0, i);
  const mac = signed.slice(i + 1);
  const expected = createHmac('sha256', SECRET).update(value).digest('base64url');
  const a = Buffer.from(mac);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  return value;
}

function parseCookies(req) {
  const header = req.headers.cookie;
  const out = {};
  if (!header) return out;
  for (const part of header.split(';')) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    out[part.slice(0, idx).trim()] = decodeURIComponent(part.slice(idx + 1).trim());
  }
  return out;
}

// ── Rank model ───────────────────────────────────────────────────────────
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

function rankFromProgress(masteredCount, totalSkills) {
  if (!totalSkills) return { index: 0, name: DIVISIONS[0], pct: 0 };
  const ratio = masteredCount / totalSkills;
  let index = Math.floor(ratio * DIVISIONS.length);
  if (index >= DIVISIONS.length) index = DIVISIONS.length - 1;
  return { index, name: DIVISIONS[index], pct: Math.round(ratio * 100) };
}

// ── User helpers ─────────────────────────────────────────────────────────
function publicUser(u) {
  if (!u) return null;
  const masteredCount = Object.values(u.progress || {}).filter(Boolean).length;
  return {
    id: u.id,
    username: u.username,
    displayName: u.displayName || u.username,
    avatar: u.avatar || null,
    provider: u.provider,
    progress: u.progress || {},
    masteredCount,
    createdAt: u.createdAt
  };
}

function newSession(userId) {
  const sid = randomBytes(24).toString('hex');
  db.sessions[sid] = { userId, createdAt: Date.now() };
  saveDB();
  return sid;
}

function userFromReq(req) {
  const cookies = parseCookies(req);
  const sid = unsign(cookies.rlt_sid);
  if (!sid) return null;
  const sess = db.sessions[sid];
  if (!sess) return null;
  return db.users[sess.userId] || null;
}

// ── HTTP helpers ─────────────────────────────────────────────────────────
function sendJSON(res, status, obj, headers = {}) {
  const body = JSON.stringify(obj);
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', ...headers });
  res.end(body);
}
function redirect(res, location, headers = {}) {
  res.writeHead(302, { Location: location, ...headers });
  res.end();
}
function sessionCookie(sid) {
  const secure = PUBLIC_URL.startsWith('https') ? ' Secure;' : '';
  return `rlt_sid=${encodeURIComponent(sign(sid))}; HttpOnly; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax;${secure}`;
}
function readBody(req) {
  return new Promise((resolve) => {
    let data = '';
    req.on('data', (c) => {
      data += c;
      if (data.length > 1e6) req.destroy();
    });
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch {
        resolve({});
      }
    });
  });
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json'
};

function serveStatic(req, res, urlPath) {
  let rel = decodeURIComponent(urlPath.split('?')[0]);
  if (rel === '/') rel = '/index.html';
  const filePath = normalize(join(PUBLIC_DIR, rel));
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    return res.end('Forbidden');
  }
  if (!existsSync(filePath)) {
    // SPA fallback for unknown non-asset routes
    if (!extname(filePath)) {
      const index = join(PUBLIC_DIR, 'index.html');
      res.writeHead(200, { 'Content-Type': MIME['.html'] });
      return res.end(readFileSync(index));
    }
    res.writeHead(404);
    return res.end('Not found');
  }
  const ext = extname(filePath);
  const cache = ext === '.html' ? 'no-cache' : 'public, max-age=3600';
  res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream', 'Cache-Control': cache });
  res.end(readFileSync(filePath));
}

// ── Discord OAuth ────────────────────────────────────────────────────────
function discordAuthURL(state) {
  const params = new URLSearchParams({
    client_id: DISCORD_CLIENT_ID,
    redirect_uri: DISCORD_REDIRECT_URI,
    response_type: 'code',
    scope: 'identify',
    state,
    prompt: 'consent'
  });
  return `https://discord.com/oauth2/authorize?${params.toString()}`;
}

async function discordExchange(code) {
  const body = new URLSearchParams({
    client_id: DISCORD_CLIENT_ID,
    client_secret: DISCORD_CLIENT_SECRET,
    grant_type: 'authorization_code',
    code,
    redirect_uri: DISCORD_REDIRECT_URI
  });
  const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body
  });
  if (!tokenRes.ok) throw new Error('token exchange failed');
  const token = await tokenRes.json();
  const userRes = await fetch('https://discord.com/api/users/@me', {
    headers: { Authorization: `Bearer ${token.access_token}` }
  });
  if (!userRes.ok) throw new Error('user fetch failed');
  return userRes.json();
}

function avatarURL(discordUser) {
  if (discordUser.avatar) {
    const ext = discordUser.avatar.startsWith('a_') ? 'gif' : 'png';
    return `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.${ext}?size=256`;
  }
  // default avatar
  const idx = discordUser.discriminator && discordUser.discriminator !== '0'
    ? parseInt(discordUser.discriminator, 10) % 5
    : Number((BigInt(discordUser.id) >> 22n) % 6n);
  return `https://cdn.discordapp.com/embed/avatars/${idx}.png`;
}

// ── Request router ───────────────────────────────────────────────────────
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, PUBLIC_URL);
  const path = url.pathname;

  try {
    // ---- Config ----
    if (path === '/api/config' && req.method === 'GET') {
      return sendJSON(res, 200, { discordEnabled: DISCORD_ENABLED });
    }

    // ---- Current user ----
    if (path === '/api/me' && req.method === 'GET') {
      const u = userFromReq(req);
      if (!u) return sendJSON(res, 200, { user: null });
      return sendJSON(res, 200, { user: publicUser(u) });
    }

    // ---- Demo login ----
    if (path === '/api/demo-login' && req.method === 'POST') {
      const body = await readBody(req);
      const name = (body.username || '').toString().trim().slice(0, 24) || `Rocketeer-${randomBytes(2).toString('hex')}`;
      const id = `demo_${randomBytes(8).toString('hex')}`;
      db.users[id] = {
        id,
        provider: 'demo',
        username: name,
        displayName: name,
        avatar: null,
        progress: {},
        createdAt: Date.now()
      };
      const sid = newSession(id);
      saveDB();
      return sendJSON(res, 200, { user: publicUser(db.users[id]) }, { 'Set-Cookie': sessionCookie(sid) });
    }

    // ---- Logout ----
    if (path === '/api/logout' && req.method === 'POST') {
      const cookies = parseCookies(req);
      const sid = unsign(cookies.rlt_sid);
      if (sid) {
        delete db.sessions[sid];
        saveDB();
      }
      return sendJSON(res, 200, { ok: true }, {
        'Set-Cookie': 'rlt_sid=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax;'
      });
    }

    // ---- Save progress ----
    if (path === '/api/progress' && req.method === 'POST') {
      const u = userFromReq(req);
      if (!u) return sendJSON(res, 401, { error: 'not authenticated' });
      const body = await readBody(req);
      const skillId = (body.skillId || '').toString();
      if (!skillId) return sendJSON(res, 400, { error: 'skillId required' });
      u.progress = u.progress || {};
      if (body.mastered) u.progress[skillId] = true;
      else delete u.progress[skillId];
      saveDB();
      return sendJSON(res, 200, { user: publicUser(u) });
    }

    // ---- Community / leaderboard ----
    if (path === '/api/community' && req.method === 'GET') {
      const total = parseInt(url.searchParams.get('total') || '0', 10);
      const list = Object.values(db.users)
        .map((u) => {
          const mastered = Object.values(u.progress || {}).filter(Boolean).length;
          const rank = rankFromProgress(mastered, total || mastered || 1);
          return {
            id: u.id,
            displayName: u.displayName || u.username,
            avatar: u.avatar || null,
            provider: u.provider,
            masteredCount: mastered,
            rankIndex: total ? rank.index : 0,
            rankName: total ? rank.name : DIVISIONS[0]
          };
        })
        .sort((a, b) => b.masteredCount - a.masteredCount)
        .slice(0, 100);
      return sendJSON(res, 200, { players: list });
    }

    // ---- Discord: start ----
    if (path === '/auth/discord' && req.method === 'GET') {
      if (!DISCORD_ENABLED) {
        return redirect(res, '/?error=discord_not_configured');
      }
      const state = randomBytes(16).toString('hex');
      db.sessions[`state_${state}`] = { state, createdAt: Date.now() };
      saveDB();
      const stateCookie = `rlt_state=${state}; HttpOnly; Path=/; Max-Age=600; SameSite=Lax;`;
      return redirect(res, discordAuthURL(state), { 'Set-Cookie': stateCookie });
    }

    // ---- Discord: callback ----
    if (path === '/auth/discord/callback' && req.method === 'GET') {
      const code = url.searchParams.get('code');
      const state = url.searchParams.get('state');
      const cookies = parseCookies(req);
      if (!code || !state || cookies.rlt_state !== state) {
        return redirect(res, '/?error=oauth_state');
      }
      try {
        const d = await discordExchange(code);
        // find existing user by discord id
        let user = Object.values(db.users).find((u) => u.provider === 'discord' && u.discordId === d.id);
        const displayName = d.global_name || d.username;
        if (!user) {
          const id = `discord_${d.id}`;
          user = {
            id,
            provider: 'discord',
            discordId: d.id,
            username: d.username,
            displayName,
            avatar: avatarURL(d),
            progress: {},
            createdAt: Date.now()
          };
          db.users[id] = user;
        } else {
          // refresh profile details on every login
          user.username = d.username;
          user.displayName = displayName;
          user.avatar = avatarURL(d);
        }
        const sid = newSession(user.id);
        saveDB();
        return redirect(res, '/?login=success', { 'Set-Cookie': sessionCookie(sid) });
      } catch (err) {
        return redirect(res, '/?error=oauth_failed');
      }
    }

    // ---- Static files / SPA ----
    if (req.method === 'GET') {
      return serveStatic(req, res, path);
    }

    res.writeHead(404);
    res.end('Not found');
  } catch (err) {
    console.error('Request error:', err);
    sendJSON(res, 500, { error: 'internal error' });
  }
});

server.listen(PORT, () => {
  console.log('\n  🚀  RL Trainer is live');
  console.log(`      ${PUBLIC_URL}`);
  console.log(`      Discord login: ${DISCORD_ENABLED ? 'ENABLED' : 'not configured (demo login available)'}`);
  if (!DISCORD_ENABLED) {
    console.log('      → Set DISCORD_CLIENT_ID & DISCORD_CLIENT_SECRET to enable "Log in with Discord".');
  }
  console.log('');
});
