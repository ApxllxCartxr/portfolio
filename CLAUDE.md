# Portfolio

Personal portfolio site with a blog, built with SvelteKit. Deployed to Vercel (GitHub Pages may be added later as a secondary static target).

- **Package manager:** pnpm (always use `pnpm`, not `npm`/`yarn`, to keep the lockfile consistent)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 (via `@tailwindcss/vite`)
- **Adapter:** `@sveltejs/adapter-vercel`, pinned to `runtime: 'nodejs22.x'` in `frontend/vite.config.ts` (the adapter can't infer a runtime from unreleased local Node versions, so it's set explicitly rather than left on auto-detect)
- **Testing:** Vitest (`pnpm run test`)
- Use the `run` skill (`/run`) to start the dev server instead of re-deriving the command.

## Layout

- `frontend/` — the SvelteKit site (this is the primary app; see conventions below).
- `backend/` — a Go/Postgres API that serves blog posts (`backend/handlers.go`, `backend/posts.go`), deployed separately (see `backend/railway.toml`, `backend/Dockerfile`). The frontend talks to it server-side only, via `frontend/src/lib/server/blog-api.ts` (`BLOG_API_BASE_URL`) — never from the browser.
- `docs/` — misc reference docs (e.g. `docs/resume.md`), not app code.

## SvelteKit conventions

- This SvelteKit version merges adapter/plugin config into `frontend/vite.config.ts` — there is no separate `svelte.config.js`.
- Prefer `+page.server.ts` load functions for data that doesn't need client-side reactivity (e.g., blog post lists) over client-side `fetch`.
- Use `$lib` for shared code, not relative `../../` imports.
- Use `resolve()` from `$app/paths` for internal `href`s (e.g., `resolve('/blog/[slug]', { slug })`), not raw template strings — the ESLint rule `svelte/no-navigation-without-resolve` enforces this and it keeps links type-checked against real routes.
- Keep components small and colocate route-specific logic in `+page.server.ts`/`+page.ts` rather than pushing everything into `+page.svelte`.
- Favor SvelteKit's SSR-by-default behavior; don't reach for client-only rendering unless a feature genuinely requires it.

## Blog

- Posts are stored in Postgres and served by the `backend/` Go API, not as local Markdown files.
- `frontend/src/lib/server/blog-api.ts` wraps the API (fetch + retry on transient failures) and is the only place that should call it; routes/load functions go through it rather than hitting `BLOG_API_BASE_URL` directly.
- `frontend/src/routes/blog/` renders posts for visitors; `frontend/src/routes/admin/` is the write-side UI, gated by `frontend/src/lib/server/admin-auth.ts`.
- `frontend/src/lib/types/post.ts` has the shared `Post`/`PostInput`/`PostSummary` types.

## General dev practices

- Before considering frontend work done, run from `frontend/`: `pnpm run check` (types), `pnpm run lint` (Prettier + ESLint), and `pnpm run test` if logic changed.
- No premature abstractions — this is a personal portfolio, not a platform. Don't build for hypothetical future requirements (multi-author blog, CMS integration, i18n) unless asked.
- Commit messages: short, imperative, explain why not just what.

## For LLM sessions working in this repo (token efficiency)

- Never read `frontend/node_modules/`, `frontend/.svelte-kit/`, or `frontend/build/` — they're generated/vendored. Use `pnpm run check`/`lint` output instead of grepping through them.
- Prefer targeted greps or reading a specific known file over listing/reading whole directories.
- Use the `run` skill to start the dev server rather than re-deriving `cd frontend && pnpm run dev` each session.
- Keep diffs scoped to what's asked — this is a small personal project, not a codebase that benefits from speculative refactors.
- When verifying a change works, prefer `pnpm run check`/`build` (fast, deterministic) over spinning up the dev server and screenshotting, unless the change is visual/interactive.
