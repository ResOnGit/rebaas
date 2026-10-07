# Deploy REBAAS (Docker)

REBAAS boots **six** containers: `db`, `auth`, `rest`, `api-gw`, `studio`, `meta`.  
Realtime, Storage, Edge Functions, and Supavisor are not part of this compose file.

Two ways to expose it:

| Mode | When | Public URL |
| --- | --- | --- |
| **Direct** | LAN, Tailscale IP, first boot | `http://<host>:8000` |
| **Caddy** | Domain + Let's Encrypt on the N100 | `https://<PROXY_DOMAIN>` |

---

## 1. Build the Studio image

On a machine with Node 22+, pnpm, and Docker (your laptop or the server):

```bash
git clone <your-rebaas-repo>
cd rebaas
pnpm install
pnpm build:studio:docker
```

This tags **`rebaas-studio:local`** (see root `package.json`).

To use another tag:

```bash
docker tag rebaas-studio:local myregistry/rebaas-studio:1.0.0
```

On the server without building: save/load the image:

```bash
# laptop
docker save rebaas-studio:local | gzip > rebaas-studio.tar.gz
# server
docker load < rebaas-studio.tar.gz
```

## 2. Server layout

```text
/opt/rebaas/
  docker/                    # this folder from git (compose, volumes/, scripts)
  docker/.env                # not in git — copy from .env.example
  docker/volumes/db/data/    # created on first `up` (Postgres data)
  docker/backups/            # optional — see BACKUPS.md
```

Copy `docker/` with git, rsync, or SFTP. Do **not** commit `.env`.

## 3. Configure `.env`

```bash
cd docker
cp .env.example .env
sh utils/generate-keys.sh    # or follow comments in .env.example
```

Important:

| Variable | Notes |
| --- | --- |
| `REBAAS_STUDIO_IMAGE` | Default `rebaas-studio:local` — must exist on the host (`docker images`) |
| `PGRST_DB_SCHEMAS` | Comma-separated API schemas, e.g. `public,ims_bts,ims_apipa` |
| `SUPABASE_PUBLIC_URL` | **Must match how clients reach you** (see modes below) |
| `API_EXTERNAL_URL` | `{SUPABASE_PUBLIC_URL}/auth/v1` |
| `SITE_URL` | Usually same origin as `SUPABASE_PUBLIC_URL` |
| SMTP (`SMTP_*`) | Resend (or your provider) for email OTP |
| `STUDIO_DEFAULT_ORGANIZATION` / `STUDIO_DEFAULT_PROJECT` | Labels in Studio |
| `PROXY_DOMAIN` | **Caddy only** — FQDN with DNS → this server |
| `DASHBOARD_USERNAME` / `DASHBOARD_PASSWORD` | Basic auth (Envoy on :8000, or Caddy in front of Studio) |

---

## 4a. Start — direct (port 8000)

No Caddy. Good for home lab, Tailscale, or before you have a domain.

```bash
cd docker
# COMPOSE_FILE=docker-compose.yml   (default)
sh run.sh start
```

Set in `.env`:

```env
SUPABASE_PUBLIC_URL=http://YOUR_TAILSCALE_OR_LAN_IP:8000
API_EXTERNAL_URL=http://YOUR_TAILSCALE_OR_LAN_IP:8000/auth/v1
SITE_URL=http://YOUR_TAILSCALE_OR_LAN_IP:8000
```

Open `http://<host>:8000`. Envoy basic auth uses `DASHBOARD_USERNAME` / `DASHBOARD_PASSWORD`.

Revits apps and `supabase-js` use the same `SUPABASE_PUBLIC_URL` (no trailing slash).

---

## 4b. Start — Caddy (HTTPS)

1. Point **DNS** `A` / `AAAA` for your domain to the N100.
2. Open **80** and **443** on the router/firewall (or use Cloudflare tunnel later).
3. In `.env`:

```env
PROXY_DOMAIN=rebaas.example.com
SUPABASE_PUBLIC_URL=https://rebaas.example.com
API_EXTERNAL_URL=https://rebaas.example.com/auth/v1
SITE_URL=https://rebaas.example.com
```

4. Enable the override (persists in `.env` `COMPOSE_FILE`):

```bash
cd docker
sh run.sh config add caddy
sh run.sh start
```

Caddy (`rebaas-caddy`) terminates TLS. **API** paths (`/auth/v1`, `/rest/v1`, `/graphql/v1`, `/pg`) go to Envoy without Studio basic auth. **Everything else** (Studio UI) goes to Studio with basic auth (`DASHBOARD_*`).

`api-gw` is **not** published on `:8000` when Caddy is enabled — only 80/443 on the host.

Certs live in Docker volume `caddy_data` (auto Let's Encrypt).

To turn Caddy off:

```bash
sh run.sh config remove caddy
sh run.sh recreate api-gw    # re-bind :8000 if you need direct access again
```

Config file: `volumes/proxy/caddy/Caddyfile`.

---

## 5. Smoke test

**Direct**

1. `http://<host>:8000` — REBAAS Studio.
2. **Connect** page URLs match your `.env`.
3. `curl -H "apikey: <anon>" http://<host>:8000/rest/v1/`

**Caddy**

1. `https://<PROXY_DOMAIN>` — browser auth prompt, then Studio.
2. `curl -H "apikey: <anon>" https://<PROXY_DOMAIN>/rest/v1/` (no dashboard basic auth on API paths).
3. OTP email still depends on SMTP in `.env`, not Caddy.

Common checks:

- Create a schema in SQL Editor; add to `PGRST_DB_SCHEMAS`; `sh run.sh restart rest`.
- Auth OTP from a Revits app.

## 6. Upgrades

1. `sh run.sh backup`
2. Pull git changes under `docker/`
3. Rebuild Studio image if `apps/studio` changed
4. `sh run.sh pull` then `sh run.sh recreate`

## Disabled API paths

Envoy returns **404** JSON for `/functions/v1/`, `/storage/v1/`, and `/realtime/v1/`.

## See also

- [BACKUPS.md](./BACKUPS.md) — `sh run.sh backup` / `restore`
- [MONOREPO.md](../MONOREPO.md) — trimmed repo layout
- Root [README.md](../README.md) — product overview
