<!--
	Floating pill nav — sticks to the top of every route. Routes on the left,
	theme toggle on the right, hairline border and nothing else: no shadow, no
	blur, no gradient.
-->
<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { theme, toggleTheme } from '$lib/theme.svelte';

	let home = resolve('/');
	let blog = resolve('/blog');
	let onBlog = $derived(page.url.pathname.startsWith(blog));
</script>

<nav class="nav" aria-label="Site">
	<div class="pill">
		<a href={home} class="item" class:current={!onBlog} aria-current={!onBlog ? 'page' : undefined}
			>Home</a
		>
		<a href={blog} class="item" class:current={onBlog} aria-current={onBlog ? 'page' : undefined}
			>Blog</a
		>
		<span class="sep" aria-hidden="true"></span>
		<button
			type="button"
			class="item toggle"
			onclick={toggleTheme}
			aria-label="Switch to {theme() === 'dark' ? 'light' : 'dark'} theme"
		>
			{theme() === 'dark' ? '☾' : '☀'}
		</button>
	</div>
</nav>

<style>
	.nav {
		position: sticky;
		top: 0;
		z-index: 20;
		display: flex;
		justify-content: center;
		padding: 0.5rem 1rem;
		/* No background — the strip is transparent so the page scrolls
		   straight under the floating pill. */
		background: transparent;
	}

	.pill {
		display: flex;
		align-items: center;
		gap: 0.35rem;
		padding: 0.3rem;
		border: 1px solid var(--line);
		border-radius: 999px;
		background: var(--bg-raised);
	}

	.item {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.3rem 0.85rem;
		border: none;
		border-radius: 999px;
		background: none;
		color: var(--muted);
		font-family: var(--font-body);
		font-size: 0.956rem;
		line-height: 1.4;
		text-decoration: none;
		cursor: pointer;
	}

	.item:hover,
	.item:focus-visible {
		color: var(--fg);
	}

	.item.current {
		background: color-mix(in srgb, var(--fg) 7%, transparent);
		color: var(--fg);
		font-weight: 600;
	}

	.sep {
		width: 1px;
		height: 1.1rem;
		margin: 0 0.15rem;
		background: var(--line);
	}

	.toggle {
		font-size: 1.013rem;
		padding-inline: 0.6rem;
	}
</style>
