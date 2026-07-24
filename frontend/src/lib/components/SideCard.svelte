<script lang="ts">
	import { profile } from '$lib/resume';
</script>

<aside class="side">
	<div class="side__top">
		<span class="side__eyebrow">{profile.eyebrow}</span>
		<span class="side__loc">{profile.location}</span>
	</div>

	<h2 class="side__headline">{profile.tagline}</h2>

	<div class="side__foot">
		<span class="side__dot" aria-hidden="true"></span>
		Open to internships
	</div>
</aside>

<style>
	.side {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		gap: 1.5rem;
		height: 100%;
		padding: 1.6rem;
		background: var(--blue);
		color: var(--blue-fg);
		border-radius: 14px;
		overflow: hidden;
	}

	.side__top {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
		font-size: 0.78rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}
	.side__eyebrow {
		font-weight: 600;
	}
	.side__loc {
		opacity: 0.72;
	}

	.side__headline {
		font-family: var(--font-redaction50);
		font-weight: 400;
		font-size: 2.5rem;
		line-height: 1;
		letter-spacing: -0.005em;
		text-wrap: balance;
	}

	.side__foot {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.82rem;
		opacity: 0.9;
	}
	.side__dot {
		width: 0.5rem;
		height: 0.5rem;
		border-radius: 999px;
		background: var(--blue-fg);
		/* flat, no glow */
	}

	@media (max-width: 900px) {
		.side {
			height: auto;
			gap: 2rem;
			padding: 1.4rem 1.3rem;
		}
	}
</style>
