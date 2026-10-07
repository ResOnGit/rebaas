# REBAAS monorepo trim

This repository is trimmed to what you need to **build Studio** and **run the Docker stack**. Upstream Supabase apps are removed from git and from `pnpm-workspace.yaml`.

## What was removed

- `apps/docs`, `apps/www`, `apps/design-system`, `apps/ui-library`, `apps/lite-studio`, `apps/kb`, `apps/learn`
- `e2e/docs`, `e2e/www`
- `packages/marketing` (www-only)

## What remains

- `apps/studio`
- `packages/*` (Studio’s shared libraries)
- `docker/`
- `e2e/studio`, `e2e/shared`
- `supabase/` (local CLI), `examples/` (not in the workspace — inert unless you open them)

## Your machine after pulling

From the repo root:

```bash
pnpm install
pnpm dev:studio
```

If install fails on lockfile drift:

```bash
pnpm install --no-frozen-lockfile
```

Commit the updated `pnpm-lock.yaml` with the trim.

## CI note

GitHub Actions under `.github/workflows/` still include many **upstream** workflows (docs, www, …). They only run when those paths change; they should not block REBAAS-only PRs. Workflows that still matter for you:

- `typecheck.yml`, `prettier.yml`, `avoid-typos.yml`
- `studio-unit-tests.yml`, `studio-lint-ratchet.yml`, `studio-knip.yml` (when Studio changes)
- `studio-docker-build.yml` (optional)

You can delete unused workflow files later for a cleaner portfolio repo.

## Agent skills

Some `.agents/skills/` files still mention `apps/design-system` or `apps/docs` (upstream copywriting paths). Studio work should use `apps/studio/AGENTS.md` and skills listed there.
