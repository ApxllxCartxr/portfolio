---
name: run
description: Launch the SvelteKit dev server for the portfolio frontend. Use when asked to run, start, or preview the site.
---

Start the dev server from the `frontend/` directory:

```
cd frontend && pnpm run dev
```

- Default URL: http://localhost:5173
- Add `--open` to auto-open a browser tab, or `--port <n>` if 5173 is taken.
- Run in the background (or a separate terminal) if you need the shell free afterward; stop it with Ctrl-C or by killing the `vite dev` process.
- To check a production build instead: `pnpm run build && pnpm run preview` from `frontend/`.
