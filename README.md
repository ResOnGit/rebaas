<p align="center">
<img src="REBAAS.png" width="200" alt="REBAAS">
</p>

# REBAAS

REBAAS (Res Backend-as-a-Service) is a self-hosted backend for the Revits apps. It is a modified [Supabase](https://github.com/supabase/supabase) Studio and stack: one Postgres database, one dashboard, and one API. Each warung or app is a schema inside that database, not a separate cloud project.

- [x] Postgres database. [Docs](https://supabase.com/docs/guides/database)
- [x] Authentication (GoTrue), including email one-time passwords. [Docs](https://supabase.com/docs/guides/auth)
- [x] Auto-generated REST API (PostgREST). [Docs](https://supabase.com/docs/guides/api)
- [x] Dashboard (Studio), rebranded for REBAAS
- [ ] Storage, Realtime, and Edge Functions stay in the repo. They are hidden in the sidebar until a Revits app needs them.

## What changed

Studio is trimmed for a single self-hosted install:

- Purple REBAAS mark, used as the favicon and the sidebar home link
- **Connect** is a page for API URL, keys, and connection strings
- **how 2** is the in-app guide: schemas, row level security, and day-to-day use
- Project home has search. The top bar is removed. Assistant and Advisor open from the sidebar
- Storage, Realtime, and Edge Functions are hidden, not deleted

Upstream product docs still apply to Postgres, Auth, and the Data API. They do not describe the REBAAS layout.

## How it works

REBAAS is one toolbox pointed at one database. Apps share the API URL and keys. A client selects its schema (for example `ims_bts`). Row Level Security keeps one app out of another app's rows.

**Services this install is built around**

- [Postgres](https://www.postgresql.org/) stores every instance. An instance is a schema, such as `ims_bts` or `scfn`.
- [PostgREST](https://postgrest.org/) turns those tables into a REST API (`/rest/v1/...`).
- [GoTrue](https://github.com/supabase/auth) issues sessions. Revits sign-in is a 6-digit email code. Mail delivery is Resend, outside this repo.
- [postgres-meta](https://github.com/supabase/postgres-meta) lets Studio inspect and change the database.
- [Envoy](https://github.com/envoyproxy/envoy) is the API gateway in front of Auth and PostgREST.
- Studio (`apps/studio`) is the dashboard.

| Piece | Role |
| --- | --- |
| `apps/studio` | REBAAS dashboard |
| `packages/` | Shared libraries Studio still needs |
| `docker/` | Self-hosted stack |
| `resnotes/` | Private notes. Not part of the product |

#### Client

Revits apps use [`supabase-js`](https://github.com/supabase/supabase-js). After `createClient`, call `.schema('ims_bts')` (or that app's schema) so requests hit the right folder. Live URL and keys are on the Connect page inside Studio.

## License

Original work is from [supabase/supabase](https://github.com/supabase/supabase), copyright Supabase and its contributors, used under the [Apache License 2.0](./LICENSE).

REBAAS changes are in this repository. The Supabase name and logo are trademarks of their owners. This project is not an official Supabase release.
