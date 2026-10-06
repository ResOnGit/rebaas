export const HOW_2_MARKDOWN = `
## The model

REBAAS is one Studio pointed at one Postgres database. There is no Organizations screen and no "new project" button. That is the self-hosted shape, not a missing feature.

An **instance** (one warung, one Revits app) is a **schema**: a folder of tables inside that database.

| App | Schema |
| --- | --- |
| Kiosk BTS | \`ims_bts\` |
| Kiosk APIPA | \`ims_apipa\` |
| SCFN | \`scfn\` |

Every app uses the **same** API URL and keys. They do not share tables. Pick the schema in the client so requests land in the right folder. Row Level Security (RLS) is what stops one app from reading another app's rows.

The API is one door (\`/rest/v1/...\`) and many rooms (schemas).

## Wire an app

Open [Connect](/project/{{ref}}/connect) for the live URL, keys, install command, and \`.env\` values. Those change when you deploy or rotate a key. This page does not.

In \`supabase-js\`, after \`createClient\`, call \`.schema('ims_bts')\` (or whichever schema that app owns) on the queries that should hit that instance.

## Add an instance

1. Open the [SQL Editor](/project/{{ref}}/sql) and create a schema. Use lowercase letters, numbers, and underscores.

   \`\`\`sql
   create schema if not exists ims_bts;
   \`\`\`

2. Create that instance's tables **in that schema** (SQL, or the [Table Editor](/project/{{ref}}/editor) after you switch schema). Do not dump every kiosk into \`public\`.

3. Turn on RLS for those tables and add policies before you store real rows. [Security Advisor](/project/{{ref}}/advisors/security) is the checklist for gaps.

4. Expose the schema on the API. PostgREST only serves schemas listed in \`PGRST_DB_SCHEMAS\` (comma-separated, for example \`public,ims_bts,ims_apipa\`). Add the new name there and restart the \`rest\` service. [API settings](/project/{{ref}}/settings/api) shows the list Studio is using.

5. Point that Revits app at the schema (step under "Wire an app"). Same URL and keys as the other apps.

## Auth

GoTrue stays on. Sign-in for Revits is a **6-digit email code** sent through Resend. Skip magic links. They break inside the iOS PWA sandbox.

Users live in one \`auth.users\` table for the whole database. Separate apps by where you store profile rows (usually that app's schema) and by RLS, not by creating another REBAAS project.

Manage people in [Auth users](/project/{{ref}}/auth/users). Mail delivery itself is Resend (your domain, SMTP into GoTrue). Studio does not send the email. It only starts the login.

## Day to day

- Tables: [Table Editor](/project/{{ref}}/editor) or [SQL Editor](/project/{{ref}}/sql). Switch schema before you edit.
- "Is the API up, what do I paste into the app?": [Connect](/project/{{ref}}/connect).
- "Did I leave a table wide open?": [Security Advisor](/project/{{ref}}/advisors/security).
- Keys: [API keys](/project/{{ref}}/settings/api-keys). Rotate if one leaks, then update the apps.

Home is sparse on purpose. Usage charts and the cloud instance map are platform-only. They do not appear on a self-hosted REBAAS.

## Two stacks

Run a second Docker Compose stack (its own env, ports, and Studio) only when one database must not be able to see the other at all. That costs RAM and a second thing to patch. For warung-sized apps, another schema on this database is the normal move.

## Not on this page

How the Debian box is installed, Compose, Tailscale, and backups live in your deployment notes. This page is only how you run instances once REBAAS is already up.
`.trim()
