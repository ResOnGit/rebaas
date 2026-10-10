export const HOW_2_MARKDOWN = `
## The model

REBAAS is one Studio pointed at one Postgres database. There is no Organizations screen and no "new project" button. That is the self-hosted shape, not a missing feature.

An **entity group** is a customer or org you isolate in data: your own \`res\`, warung \`k1\`, warung \`k2\`, and so on (aim for roughly 50 on one host). In Postgres that is usually **one schema per entity**, not a nested "schema inside a schema."

| Entity | Schema example | Revits apps |
| --- | --- | --- |
| You (Revits) | \`res\` | internal / dogfood |
| Warung K1 | \`k1\` | IMS build, maybe SCFN later |
| Warung K2 | \`k2\` | IMS build |

**IMS** and **SCFN** are **templates** (many tables each), not single tables named \`ims\` or \`scfn\`. Rows live in tables like \`orders\`, \`products\`.

Every Revits app uses the **same** API URL and keys. The app calls \`.schema('k1')\` (or \`k1_ims\`) so PostgREST hits the right drawer. **Row Level Security (RLS)** plus a **membership** table is what stops K1 from reading K2 — not the schema name alone.

Templates (IMS, SCFN, Flow) are developed separately from a deployed, customized end product. Security ships **in the SQL template** and is **applied again** each time you create a new entity schema.

## Wire an app

Open [Connect](/project/{{ref}}/connect) for the live URL, keys, install command, and \`.env\` values.

In \`supabase-js\`, after \`createClient\`, call \`.schema('k1')\` (or your entity schema) on queries for that warung.

Never put the **service role** key in a Revits client. Use the publishable/anon key and the user session JWT.

## New entity group (res, k1, k2, …)

Do this when a new warung (or \`res\`) goes live — REBAAS does not run these steps for you automatically.

1. **Create the schema** in the [SQL Editor](/project/{{ref}}/sql). Use lowercase letters, numbers, and underscores.

   \`\`\`sql
   create schema if not exists k1;
   \`\`\`

2. **Apply your Revits template** — create that entity's tables inside the schema (IMS migration, then RM35 tweaks). Use the [Table Editor](/project/{{ref}}/editor) after switching schema, or run SQL.

3. **Enable RLS** on every table that holds tenant data before real rows go in. Use [Security Advisor](/project/{{ref}}/advisors/security) to catch gaps.

4. **Membership** — keep a shared table (for example \`public.tenant_members\`) mapping \`auth.users.id\` to allowed schemas (\`k1\`, \`k2\`, \`res\`). Policies in \`k1\` should check membership, not a \`business_id\` sent from the browser.

5. **Expose the schema** — add \`k1\` to \`PGRST_DB_SCHEMAS\` in \`docker/.env\`, then restart the \`rest\` service. [API settings](/project/{{ref}}/settings/api) shows what Studio sees.

6. **Add people** in [Auth users](/project/{{ref}}/auth/users) if needed, then insert their \`tenant_members\` rows for \`k1\` only.

7. **Test** — log in as a K1-only user, call the API with \`.schema('k2')\` or REST against \`k2\` tables. You should get no rows or a policy error.

## Two apps for one entity (K1 wants IMS and SCFN)

Postgres cannot nest schemas. Pick one layout:

- **One schema \`k1\`** — IMS tables and SCFN tables together; use prefixes (\`scfn_jobs\`) if names clash.
- **Two schemas \`k1_ims\` and \`k1_scfn\`** — same table names as the template; add **both** to \`PGRST_DB_SCHEMAS\`.

Revits IMS and Revits SCFN are separate builds; they can point at the same or different schemas as above.

## Auth

GoTrue stays on. Revits sign-in is a **6-digit email code** via Resend (not magic links in the iOS PWA sandbox).

There is **one** \`auth.users\` table per REBAAS stack. All entities share it. Separate warungs with **membership + RLS**, not a second REBAAS install.

**Two logins — do not merge them:**

- **Studio** — Tailscale or LAN, dashboard password (\`DASHBOARD_*\` on the gateway). Database manager for you.
- **Revits app** — GoTrue OTP for the warung owner/staff.

## Day to day

- Tables: [Table Editor](/project/{{ref}}/editor) or [SQL Editor](/project/{{ref}}/sql). Switch schema first.
- API health and keys: [Connect](/project/{{ref}}/connect).
- Open RLS holes: [Security Advisor](/project/{{ref}}/advisors/security).
- Rotate keys: [API keys](/project/{{ref}}/settings/api-keys), then update deployed Revits env.

## Second full stack?

A second Docker Compose project (second Postgres, second Studio) is only for a **hard wall** between databases. It costs RAM and patching time. For warung scale on one box, **schemas + RLS** on one REBAAS is the normal move.

## Not on this page

Install, Compose, Tailscale, and backups live in \`docker/DEPLOY.md\` and \`docker/BACKUPS.md\`. This page is entity schemas, templates, and security once REBAAS is up.
`.trim()
