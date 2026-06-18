# ☁️ Deploy RL Trainer to Cloudflare Workers

This gets RL Trainer onto a **free, permanent** link like
`https://rltrainer.<your-name>.workers.dev` — no domain to buy, no server to
keep running on your PC.

You only have to do this once; after that, updates are a single `deploy` command.

> **Prerequisites:** [Node.js](https://nodejs.org) (LTS) installed, and a free
> [Cloudflare account](https://dash.cloudflare.com/sign-up). Everything below is
> run from the project folder in a terminal (on Windows: open the folder, type
> `cmd` in the address bar, press Enter).

---

## 1. Install the tools

```bash
npm install
```

This pulls in **Wrangler** (Cloudflare's CLI). All following commands use
`npx wrangler …`.

## 2. Log in to Cloudflare

```bash
npx wrangler login
```

A browser window opens — approve the access. This links the CLI to your account.

## 3. Create the database (KV namespace)

```bash
npx wrangler kv namespace create KV
```

It prints something like:

```
[[kv_namespaces]]
binding = "KV"
id = "abc123def456...."
```

Copy that **`id`** value and paste it into **`wrangler.toml`**, replacing
`PASTE_KV_NAMESPACE_ID_HERE`:

```toml
[[kv_namespaces]]
binding = "KV"
id = "abc123def456...."
```

## 4. Add a session secret (recommended)

This signs login cookies. Pick any long random string:

```bash
npx wrangler secret put SESSION_SECRET
```

Paste a random value when prompted (e.g. mash your keyboard, or run
`node -e "console.log(crypto.randomUUID()+crypto.randomUUID())"`).

## 5. Deploy 🚀

```bash
npx wrangler deploy
```

- If it's your first Worker, Wrangler asks you to register a free
  `*.workers.dev` subdomain — accept it.
- When it finishes, it prints your live URL:

  ```
  https://rltrainer.<your-subdomain>.workers.dev
  ```

Open it in any browser, on any device, and tap **Try a Demo Profile**. Done. 🎉

To push changes later, just run `npx wrangler deploy` again.

---

## 6. (Optional) Turn on "Log in with Discord"

The demo profile already gives the full experience. To enable real Discord
login on your deployed site:

1. At the [Discord Developer Portal](https://discord.com/developers/applications),
   create an application. Copy the **Application ID** and reset/copy the
   **Client Secret** (OAuth2 tab).
2. In the **OAuth2 → Redirects** section, add your deployed callback URL:
   ```
   https://rltrainer.<your-subdomain>.workers.dev/auth/discord/callback
   ```
3. Give the Worker the credentials:
   ```bash
   npx wrangler secret put DISCORD_CLIENT_ID
   npx wrangler secret put DISCORD_CLIENT_SECRET
   ```
   (Paste each value when prompted.)
4. Redeploy:
   ```bash
   npx wrangler deploy
   ```

The **Log in with Discord** button now runs the real OAuth flow — it opens
Discord (handing off to the desktop/mobile app if installed) to authorize, then
signs you in with your Discord username and avatar.

---

## Test it locally first (optional)

Run the Worker on your machine with Cloudflare's local runtime (uses a simulated
local KV, so no account needed):

```bash
npx wrangler dev
```

Then open the printed `http://localhost:8787`. For local Discord testing, copy
`.dev.vars.example` to `.dev.vars` and fill in the values.

---

## How it maps to the code

| Piece | Where |
|-------|-------|
| Worker entrypoint (API, OAuth, SPA fallback) | [`worker.js`](worker.js) |
| Static front-end (served via the `ASSETS` binding) | [`public/`](public/) |
| User accounts + progress | Cloudflare **KV** (`KV` binding) |
| Config + bindings | [`wrangler.toml`](wrangler.toml) |

> The original [`server.js`](server.js) (plain Node, file-based storage) still
> works for running locally or on hosts like Render — the Worker is just an
> additional, Cloudflare-native way to run the exact same app.
