# Portfolio

Personal portfolio site with a blog, built with SvelteKit. Deployed to Vercel (GitHub Pages may be added later as a secondary static target).

- **Package manager:** pnpm (always use `pnpm`, not `npm`/`yarn`, to keep the lockfile consistent)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 (via `@tailwindcss/vite`)
- **Adapter:** `@sveltejs/adapter-vercel`, pinned to `runtime: 'nodejs22.x'` in `frontend/vite.config.ts` (the adapter can't infer a runtime from unreleased local Node versions, so it's set explicitly rather than left on auto-detect)
- **Testing:** Vitest (`pnpm run test`)
- Use the `run` skill (`/run`) to start the dev server instead of re-deriving the command.

## Layout

Everything lives under `frontend/`. `backend/` and `docs/` are separate top-level concerns for this repo — don't assume backend code exists yet.

## SvelteKit conventions

- This SvelteKit version merges adapter/plugin config into `frontend/vite.config.ts` — there is no separate `svelte.config.js`.
- Prefer `+page.server.ts` load functions for data that doesn't need client-side reactivity (e.g., blog post lists) over client-side `fetch`.
- Use `$lib` for shared code, not relative `../../` imports.
- Use `resolve()` from `$app/paths` for internal `href`s (e.g., `resolve('/blog/[slug]', { slug })`), not raw template strings — the ESLint rule `svelte/no-navigation-without-resolve` enforces this and it keeps links type-checked against real routes.
- Keep components small and colocate route-specific logic in `+page.server.ts`/`+page.ts` rather than pushing everything into `+page.svelte`.
- Favor SvelteKit's SSR-by-default behavior; don't reach for client-only rendering unless a feature genuinely requires it.

## Blog

- Posts live as Markdown files in `frontend/src/lib/posts/*.md` with front matter (`title`, `date`, `excerpt`).
- `frontend/src/lib/posts.ts` loads them via `import.meta.glob` and does minimal frontmatter parsing + a placeholder paragraph-only Markdown renderer.
- That renderer is intentionally minimal (no headings, lists, images, code blocks). Once posts need real Markdown features, replace it with **mdsvex** rather than hand-rolling more Markdown parsing.

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
