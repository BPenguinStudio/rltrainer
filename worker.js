// ─────────────────────────────────────────────────────────────────────────
//  RL Trainer — Cloudflare Worker
//
//  A port of server.js to the Cloudflare Workers runtime.
//    • Static assets (public/) are served by the platform via the ASSETS binding
//    • User accounts + progress live in Cloudflare KV (binding: KV)
//    • Sessions are a stateless HMAC-signed cookie (Web Crypto)
//    • Discord OAuth2 uses the built-in fetch
//
//  Deploy with wrangler — see CLOUDFLARE.md.
// ─────────────────────────────────────────────────────────────────────────

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

function rankFromProgress(mastered, total) {
  if (!total) return { index: 0, name: DIVISIONS[0] };
  let index = Math.floor((mastered / total) * DIVISIONS.length);
  if (index >= DIVISIONS.length) index = DIVISIONS.length - 1;
  if (index < 0) index = 0;
  return { index, name: DIVISIONS[index] };
}

// ── crypto helpers (Web Crypto) ──────────────────────────────────────────
const enc = new TextEncoder();

function b64url(buf) {
  const bytes = new Uint8Array(buf);
  let s = '';
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function hmacB64(secret, value) {
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(value));
  return b64url(sig);
}

async function sign(secret, value) {
  return `${value}.${await hmacB64(secret, value)}`;
}

async function unsign(secret, signed) {
  if (!signed) return null;
  const i = signed.lastIndexOf('.');
  if (i === -1) return null;
  const value = signed.slice(0, i);
  const mac = signed.slice(i + 1);
  const expected = await hmacB64(secret, value);
  if (mac.length !== expected.length) return null;
  let diff = 0;
  for (let k = 0; k < mac.length; k++) diff |= mac.charCodeAt(k) ^ expected.charCodeAt(k);
  return diff === 0 ? value : null;
}

function randomHex(bytes = 16) {
  const a = new Uint8Array(bytes);
  crypto.getRandomValues(a);
  return [...a].map((b) => b.toString(16).padStart(2, '0')).join('');
}

// ── misc helpers ─────────────────────────────────────────────────────────
function secretOf(env) {
  return env.SESSION_SECRET || 'rltrainer-insecure-default-secret-please-set-SESSION_SECRET';
}
function discordEnabled(env) {
  return Boolean(env.DISCORD_CLIENT_ID && env.DISCORD_CLIENT_SECRET);
}

function parseCookies(request) {
  const header = request.headers.get('cookie');
  const out = {};
  if (!header) return out;
  for (const part of header.split(';')) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    out[part.slice(0, idx).trim()] = decodeURIComponent(part.slice(idx + 1).trim());
  }
  return out;
}

function json(obj, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...extraHeaders }
  });
}

function redirect(location, extraHeaders = {}) {
  return new Response(null, { status: 302, headers: { Location: location, ...extraHeaders } });
}

function sessionCookie(signedValue) {
  return `rlt_uid=${encodeURIComponent(signedValue)}; HttpOnly; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax; Secure`;
}
const CLEAR_SESSION = 'rlt_uid=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax; Secure';

// ── user model ───────────────────────────────────────────────────────────
function masteredCount(user) {
  return Object.values(user.progress || {}).filter(Boolean).length;
}

function publicUser(u) {
  if (!u) return null;
  return {
    id: u.id,
    username: u.username,
    displayName: u.displayName || u.username,
    avatar: u.avatar || null,
    provider: u.provider,
    progress: u.progress || {},
    masteredCount: masteredCount(u),
    createdAt: u.createdAt
  };
}

async function putUser(env, user) {
  await env.KV.put(`user:${user.id}`, JSON.stringify(user), {
    metadata: {
      dn: user.displayName || user.username,
      av: user.avatar || null,
      pr: user.provider,
      mc: masteredCount(user)
    }
  });
}

async function getUserFromRequest(request, env) {
  const cookies = parseCookies(request);
  const uid = await unsign(secretOf(env), cookies.rlt_uid);
  if (!uid) return null;
  return env.KV.get(`user:${uid}`, 'json');
}

function avatarURL(d) {
  if (d.avatar) {
    const ext = d.avatar.startsWith('a_') ? 'gif' : 'png';
    return `https://cdn.discordapp.com/avatars/${d.id}/${d.avatar}.${ext}?size=256`;
  }
  const idx = d.discriminator && d.discriminator !== '0'
    ? parseInt(d.discriminator, 10) % 5
    : Number((BigInt(d.id) >> 22n) % 6n);
  return `https://cdn.discordapp.com/embed/avatars/${idx}.png`;
}

function redirectUri(env, url) {
  return env.DISCORD_REDIRECT_URI || `${url.origin}/auth/discord/callback`;
}

// ── Discord OAuth ────────────────────────────────────────────────────────
function discordAuthURL(env, url, state) {
  const params = new URLSearchParams({
    client_id: env.DISCORD_CLIENT_ID,
    redirect_uri: redirectUri(env, url),
    response_type: 'code',
    scope: 'identify',
    state,
    prompt: 'consent'
  });
  return `https://discord.com/oauth2/authorize?${params.toString()}`;
}

async function discordExchange(env, url, code) {
  const body = new URLSearchParams({
    client_id: env.DISCORD_CLIENT_ID,
    client_secret: env.DISCORD_CLIENT_SECRET,
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri(env, url)
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

// ── API router ───────────────────────────────────────────────────────────
async function handleApi(request, env, url) {
  const path = url.pathname;
  const method = request.method;

  if (path === '/api/config' && method === 'GET') {
    return json({ discordEnabled: discordEnabled(env) });
  }

  if (path === '/api/me' && method === 'GET') {
    const u = await getUserFromRequest(request, env);
    return json({ user: publicUser(u) });
  }

  if (path === '/api/demo-login' && method === 'POST') {
    const body = await request.json().catch(() => ({}));
    const name = (body.username || '').toString().trim().slice(0, 24) || `Rocketeer-${randomHex(2)}`;
    const id = `demo_${randomHex(8)}`;
    const user = {
      id, provider: 'demo', username: name, displayName: name,
      avatar: null, progress: {}, createdAt: Date.now()
    };
    await putUser(env, user);
    const signed = await sign(secretOf(env), id);
    return json({ user: publicUser(user) }, 200, { 'Set-Cookie': sessionCookie(signed) });
  }

  if (path === '/api/logout' && method === 'POST') {
    return json({ ok: true }, 200, { 'Set-Cookie': CLEAR_SESSION });
  }

  if (path === '/api/progress' && method === 'POST') {
    const u = await getUserFromRequest(request, env);
    if (!u) return json({ error: 'not authenticated' }, 401);
    const body = await request.json().catch(() => ({}));
    const skillId = (body.skillId || '').toString();
    if (!skillId) return json({ error: 'skillId required' }, 400);
    u.progress = u.progress || {};
    if (body.mastered) u.progress[skillId] = true; else delete u.progress[skillId];
    await putUser(env, u);
    return json({ user: publicUser(u) });
  }

  if (path === '/api/community' && method === 'GET') {
    const total = parseInt(url.searchParams.get('total') || '0', 10);
    const listed = await env.KV.list({ prefix: 'user:', limit: 1000 });
    const players = listed.keys.map((k) => {
      const m = k.metadata || {};
      const mc = m.mc || 0;
      const rank = total ? rankFromProgress(mc, total) : { index: 0, name: DIVISIONS[0] };
      return {
        id: k.name.slice('user:'.length),
        displayName: m.dn || 'Rocketeer',
        avatar: m.av || null,
        provider: m.pr || 'demo',
        masteredCount: mc,
        rankIndex: rank.index,
        rankName: rank.name
      };
    }).sort((a, b) => b.masteredCount - a.masteredCount).slice(0, 100);
    return json({ players });
  }

  return json({ error: 'not found' }, 404);
}

// ── Auth router ──────────────────────────────────────────────────────────
async function handleAuth(request, env, url) {
  const path = url.pathname;

  if (path === '/auth/discord' && request.method === 'GET') {
    if (!discordEnabled(env)) return redirect('/?error=discord_not_configured');
    const state = randomHex(16);
    const stateCookie = `rlt_state=${state}; HttpOnly; Path=/; Max-Age=600; SameSite=Lax; Secure`;
    return redirect(discordAuthURL(env, url, state), { 'Set-Cookie': stateCookie });
  }

  if (path === '/auth/discord/callback' && request.method === 'GET') {
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const cookies = parseCookies(request);
    if (!code || !state || cookies.rlt_state !== state) {
      return redirect('/?error=oauth_state');
    }
    try {
      const d = await discordExchange(env, url, code);
      const id = `discord_${d.id}`;
      const displayName = d.global_name || d.username;
      let user = await env.KV.get(`user:${id}`, 'json');
      if (!user) {
        user = { id, provider: 'discord', discordId: d.id, username: d.username, displayName, avatar: avatarURL(d), progress: {}, createdAt: Date.now() };
      } else {
        user.username = d.username;
        user.displayName = displayName;
        user.avatar = avatarURL(d);
      }
      await putUser(env, user);
      const signed = await sign(secretOf(env), id);
      return redirect('/?login=success', { 'Set-Cookie': sessionCookie(signed) });
    } catch {
      return redirect('/?error=oauth_failed');
    }
  }

  return new Response('Not found', { status: 404 });
}

// ── entrypoint ───────────────────────────────────────────────────────────
export default {
  async fetch(request, env, ctx) {
    const u = new URL(request.url);
    const path = u.pathname;

    try {
      if (path.startsWith('/api/')) return await handleApi(request, env, u);
      if (path.startsWith('/auth/')) return await handleAuth(request, env, u);

      // Anything else that reached the Worker means no static asset matched
      // (assets are served automatically before the Worker runs). Serve the
      // SPA shell so client-side routes like /train work on refresh.
      const indexReq = new Request(`${u.origin}/index.html`, request);
      const res = await env.ASSETS.fetch(indexReq);
      return new Response(res.body, { status: 200, headers: res.headers });
    } catch (err) {
      return json({ error: 'internal error' }, 500);
    }
  }
};
