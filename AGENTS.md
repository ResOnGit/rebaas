# REBAAS monorepo

pnpm 11 + Turborepo. Requires Node >= 22.13. This fork keeps **Studio**, shared **packages/**, **docker/**, and Studio E2E only.

## Structure

| Directory              | Purpose                                                                                  |
| ---------------------- | ---------------------------------------------------------------------------------------- |
| `apps/studio`          | REBAAS dashboard — see `apps/studio/AGENTS.md`                                           |
| `packages/*`           | Shared libraries Studio depends on (`ui`, `ui-patterns`, `common`, `api-types`, …)     |
| `docker/`              | Self-hosted stack and backup scripts — see `docker/BACKUPS.md`                            |
| `e2e/studio`           | Playwright E2E for Studio (optional)                                                     |
| `supabase/`            | Local Supabase CLI project (migrations, functions) when using `pnpm setup:cli`           |

Removed from this fork (upstream still has them): `apps/docs`, `www`, `design-system`, `ui-library`, `lite-studio`, `kb`, `learn`, `e2e/docs`, `e2e/www`.

## Common Commands

```bash
pnpm dev:studio              # Studio → http://localhost:8082
pnpm test:studio             # Studio unit tests (vitest)
pnpm e2e                     # Studio E2E (playwright)
pnpm build:studio            # build Studio
pnpm build:studio:docker     # production Docker image → rebaas-studio:local
pnpm lint                    # lint Studio
pnpm typecheck               # typecheck Studio + workspace dependencies
pnpm format                  # Prettier (studio, packages, docker)
pnpm generate:types          # local DB types → supabase/functions/common/database-types.ts
pnpm api:codegen             # platform Management API types → packages/api-types
```

## CI

Every PR must pass typecheck + lint (one workflow), Prettier, and a typos check. Other checks are path-filtered: Studio unit tests/build and the lint ratchet (ESLint warning count must not increase) run on `apps/studio/**` changes; app-specific test suites run on their own paths.

Never hand-edit generated files: `packages/api-types/types/**`, `**/routeTree.gen.ts`, `**/__generated__/**`, `apps/docs/features/docs/generated/**`, `apps/www/.generated/**`, `supabase/functions/common/database-types.ts`, `apps/docs/content/_partials/access-control/scoped_pat_*.mdx` (run `make -C apps/docs/spec generate.partials.access-control`).

## Conventions

**UI** — import from `'ui'`; primitives are shadcn/ui-based and exported unsuffixed (`Input`, `Select`, `Form`, …). Use `Button` — the in-house component and the standard everywhere (a raw shadcn `Button_Shadcn_` also exists but is rarely the right choice). Check `packages/ui/index.tsx` before creating new primitives. Higher-level patterns live in `packages/ui-patterns`.

**Styling** — Tailwind only, semantic tokens (`bg-muted`, `text-foreground-light`), no hardcoded colors.

**Exports** — named exports only; default exports are allowed only where a framework requires them (`pages/**`, `app/**`, config files — the eslint preset has the exact carve-out list). Lint-enforced across all apps via `eslint-config-supabase` (severity `warn` everywhere; hard-enforced in Studio by the lint ratchet).

**Language** — Use U.S. English everywhere.

**Public surfaces** — this repo is public: PR descriptions, issues, and code comments are world-readable. Keep internal content out of them: absolute production metrics (event counts, user counts, revenue figures: state percentages, ratios, or relative change instead), internal decision detail (vendor, legal, pricing, or strategy discussions), and competitor names (protocol identifiers such as user-agent strings are fine). Put that context in the Linear issue and link it.

## Skills

The skills in `.agents/skills/` are the source of truth for conventions. Load the relevant ones before working, don't guess. One exception: for docs **content** style, `apps/docs/style-guide/` is the source of truth and the docs skills are the process that applies it.

- `copywriting` — any user-facing text, anywhere in the monorepo
- `pm-the-docs` / `write-the-docs` / `edit-the-docs` / `ask-the-docs` / `review-the-docs` — anything under `apps/docs` (see `apps/docs/CONTRIBUTING.md` for the authoring skill model, and `apps/docs/style-guide/` for the content style rules they apply)
- `telemetry-standards` — PostHog events, `packages/common/telemetry-constants.ts`
- `dev-toolbar-review` — `packages/dev-tools`, `packages/common/posthog-client.ts`, `packages/common/feature-flags.tsx`
- `safe-sql-execution` — any code that builds or executes SQL against user databases
- `react-hook-form` — writing or modifying any form code, anywhere in the monorepo
- `vitest` / `vercel-composition-patterns` — generic unit-testing and React composition references

## Studio

Before working on anything in `apps/studio`, read `apps/studio/AGENTS.md` if it isn't already in context — it maps Studio tasks to required skills and covers the TanStack Start migration rules.
