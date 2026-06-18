# 🚀 RL Trainer

> **From Bronze to Supersonic Legend** — a beautiful, Rocket League-themed skills
> guide that takes you from your very first powerslide all the way to flip-reset
> double taps and the Psycho.

RL Trainer is a polished web app with **Discord login**, a **per-rank skill
curriculum** ordered exactly how you should learn it, **step-by-step coaching**,
**embedded video tutorials**, and a **rank that climbs automatically** as you
master skills — all saved to your account so it's waiting for you next time.

![ranks](https://img.shields.io/badge/Bronze%20I-→%20Supersonic%20Legend-ff7a18)
![skills](https://img.shields.io/badge/60-skills-2f6cd6)
![deps](https://img.shields.io/badge/dependencies-zero-2fe08a)

---

## ✨ Features

- **🎮 Log in with Discord** — one click links your Discord account; your
  username and avatar come straight from your profile. (A built-in **demo
  profile** lets you use the whole app instantly, even before Discord is set up.)
- **👤 Profile / Garage** — your avatar, name, live rank emblem, a boost-meter
  progress bar, and a full rank ladder.
- **🎯 Train** — a tab for every competitive tier (**Bronze → Supersonic
  Legend**). Each tier holds a list of skills **sorted in the order you should
  learn them**, each with:
  - a clear difficulty rating and the division it belongs to,
  - a numbered **step-by-step "How To Do It"** guide,
  - **Coach's Tips**, and
  - an **embedded YouTube tutorial** (plus a "more tutorials" search link).
- **📈 Auto-ranking** — mark a skill *Mastered* and your rank rises in real time,
  with a satisfying **RANK UP!** toast. Progress is **saved to your account**.
- **🏆 Community leaderboard** — see everyone training on RL Trainer, ranked by
  skills mastered, with your own row highlighted.

> **A note on Discord friends:** Discord's public API does **not** expose a
> user's friends list to third-party apps, so a true "friends who signed up"
> list isn't technically possible. Instead, the **Community** tab shows the whole
> community leaderboard so you can compete with everyone.

---

## 🏃 Quick start

No build step, **no `npm install`** — the server uses only Node's built-ins.

```bash
# Node 18+ required
node server.js
```

Then open **http://localhost:3000** and click **Try a Demo Profile** to dive
straight in.

Change the port with `PORT=8080 node server.js`.

---

## 🔗 Enabling "Log in with Discord"

Discord login works as soon as you give the app OAuth credentials.

1. Go to the **[Discord Developer Portal](https://discord.com/developers/applications)**
   → **New Application**.
2. Copy the **Application ID** → this is your `DISCORD_CLIENT_ID`.
3. Open the **OAuth2** tab → **Reset Secret** → copy it → this is your
   `DISCORD_CLIENT_SECRET`.
4. Still on **OAuth2**, under **Redirects**, add:
   ```
   http://localhost:3000/auth/discord/callback
   ```
   (Use your real domain instead of `localhost:3000` in production.)
5. Copy `.env.example` to `.env` and fill in the values:

   ```bash
   cp .env.example .env
   ```
   ```env
   PUBLIC_URL=http://localhost:3000
   DISCORD_CLIENT_ID=your_application_id
   DISCORD_CLIENT_SECRET=your_client_secret
   ```
6. Restart the server. The login screen's **Log in with Discord** button now
   runs the real OAuth flow — which opens Discord (and hands off to the Discord
   desktop/mobile app if it's installed) to authorize, then drops you back into
   RL Trainer signed in.

The app reads the `identify` scope only (username + avatar). Nothing is posted
to Discord on your behalf.

---

## 🗂️ Project structure

```
rltrainer/
├── server.js            # Zero-dependency Node server: static hosting,
│                        # Discord OAuth, sessions, JSON persistence, API
├── public/
│   ├── index.html       # App shell
│   ├── css/styles.css   # The neon-arena theme
│   └── js/
│       ├── app.js       # SPA: login, profile, train, community
│       ├── skills.js    # The full 60-skill curriculum (data)
│       └── emblems.js   # Procedural SVG rank badges
├── data/                # Created at runtime (gitignored):
│                        #   db.json (users + progress), .session-secret
├── .env.example         # Configuration template
└── package.json
```

### How data is stored

User accounts and progress are persisted to `data/db.json`. Sessions are tracked
with an HMAC-signed, HttpOnly cookie. The signing key lives in
`data/.session-secret` (auto-generated) or `SESSION_SECRET` if you set one. The
whole `data/` directory is gitignored.

> For a single small site this file-based store is plenty. To scale, swap the
> `loadDB`/`saveDB` helpers in `server.js` for a real database — the rest of the
> server doesn't care how persistence works.

---

## 🎓 The curriculum

60 skills across 8 tiers, ordered beginner → expert:

| Tier | Sample skills |
|------|---------------|
| **Bronze** | Settings, Powerslide, Boost Management, Ball Control, Kickoffs |
| **Silver** | First Aerials, Half-Flip, Rotation, Power Shots, Catching |
| **Gold** | Fast Aerial, Wave Dash, Wall Play, Shadow Defense, Recoveries |
| **Platinum** | Speed Flip, Directional Air Roll, Ground Dribbling, Redirects |
| **Diamond** | Air Dribbles, Dribble Flicks, Musty Flick, Ground Pinches |
| **Champion** | Flip Reset, Ceiling Shot, Double Tap, Breezi Flick, Tornado |
| **Grand Champion** | Consistent Resets, Tight Double Taps, Stalls, Mind Games |
| **Supersonic Legend** | Flip Reset Double Tap, The Psycho, ADFR, Mechanical Chaining |

Want to add or tweak a skill? It's all plain data in
[`public/js/skills.js`](public/js/skills.js) — add an entry with `steps`, `tips`,
and an optional `youtubeId`, and it appears in the right tab automatically.

---

## 📜 License

MIT — go climb the ranks. 🏆
