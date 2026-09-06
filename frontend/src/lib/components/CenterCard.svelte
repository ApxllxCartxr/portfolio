<!--
	Hero: the name is the thesis — Redaction 35's halftone texture is the most
	distinctive thing on the page, so it gets the size and everything under it
	stays quiet. The source portrait is a transparent torn-paper cutout, so it
	sits directly on the page background — no panel, no frame, no circle mask.

	Copy is deliberately short: the experience and project sections below carry
	the detail, and repeating it here just made the hero read like a cover
	letter.
-->
<div class="layout">
	<div class="copy">
		<h1 class="name">
			<span class="intro">hi i'm</span>
			Joseph Fernando <span class="accent">*</span>
		</h1>

		<p class="headline">
			Full-stack&nbsp;systems&nbsp;&amp; <span class="quiet">real-time software</span>
		</p>

		<div class="bio">
			<p>
				I work on backends and simulation: a discrete-event model of Chennai's metro network in Go,
				and a real-time crowd-safety app for one of the world's largest gatherings.
			</p>
			<p class="context">
				Currently a dev intern at Picabord Technologies, building a multi-tenant CRM. CS student in
				Chennai.
			</p>
		</div>

		<div class="links">
			<a href="mailto:josephfernando05@proton.me">Email</a>
			<a href="https://github.com/apxllxcartxr" target="_blank" rel="noreferrer">GitHub</a>
			<a href="https://www.linkedin.com/in/joseph-fernando05/" target="_blank" rel="noreferrer"
				>LinkedIn</a
			>
			<a href="https://leetcode.com/u/apxllxcartxr/" target="_blank" rel="noreferrer">LeetCode</a>
		</div>
	</div>

	<figure class="portrait">
		<img
			class="avatar"
			src="/headshot.webp"
			alt="Portrait of Joseph Fernando"
			width="880"
			height="883"
			fetchpriority="high"
		/>
	</figure>
</div>

<style>
	.layout {
		display: grid;
		gap: clamp(2rem, 5vw, 3.5rem);
		align-items: center;
	}

	.copy {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
	}

	.portrait {
		margin: 0;
		justify-self: center;
		width: min(100%, 420px);
	}

	.avatar {
		display: block;
		width: 100%;
		height: auto;
	}

	.name {
		font-family: var(--font-display);
		font-size: clamp(2.6rem, 8vw, 5.25rem);
		line-height: 0.98;
		font-weight: 700;
		margin: 0;
		text-wrap: balance;
	}

	/* Handwriting annotating print: the greeting hangs off the name's first
	   line rather than stacking above it as a separate block. */
	.intro {
		display: block;
		margin-bottom: -0.3em;
		font-family: var(--font-hand);
		/* Relative to the name so it scales with it, floored so the handwriting
		   stays legible once the name drops to its mobile size. */
		font-size: max(1.05rem, 0.3em);
		font-weight: 400;
		line-height: 1;
		color: var(--muted);
	}

	/* Redaction's asterisk sits at cap height with wide side bearings, so at
	   the name's size it drifts off on its own. Pulled in and scaled down it
	   reads as a mark on the name instead of a footnote to nothing. */
	.accent {
		display: inline-block;
		margin-left: -0.32em;
		font-size: 0.44em;
		vertical-align: 0.62em;
		color: var(--accent);
	}

	/* Same face as the name at a third the size and a lighter weight, so it
	   reads as the same voice continuing rather than a second heading. */
	.headline {
		font-family: var(--font-display);
		font-size: clamp(1.4rem, 2.8vw, 2rem);
		font-weight: 700;
		line-height: 1.3;
		margin: 1.6rem 0 0;
		max-width: 24ch;
		text-wrap: balance;
	}

	/* Stepped back by weight as well as colour — in dark mode --muted and --fg
	   are close enough that colour alone barely separates them. */
	.quiet {
		font-weight: 400;
		color: var(--muted);
	}

	.bio {
		display: flex;
		flex-direction: column;
		gap: 0.7rem;
		margin-top: 1.6rem;
		max-width: 52ch;
		font-family: var(--font-body);
		font-size: 1.02rem;
		line-height: 1.6;
	}

	.context {
		color: var(--muted);
		font-size: 0.95rem;
	}

	.links {
		display: flex;
		flex-wrap: wrap;
		gap: 1.25rem;
		margin-top: 1.6rem;
		padding-top: 0.9rem;
		border-top: 1px solid var(--line);
		width: 100%;
		max-width: 52ch;
		font-family: var(--font-mono);
		font-size: 0.8rem;
	}

	.links a {
		font-weight: 700;
		text-decoration: underline;
		text-underline-offset: 3px;
	}

	.links a:hover,
	.links a:focus-visible {
		color: var(--accent);
	}

	/* Stacked on narrow screens: portrait first, at a size that reads as a
	   figure rather than a full-bleed image. */
	@media (max-width: 899px) {
		.portrait {
			order: -1;
			width: min(100%, 260px);
			justify-self: start;
		}
	}

	@media (min-width: 900px) {
		.layout {
			grid-template-columns: minmax(0, 1fr) minmax(0, 0.72fr);
		}
	}
</style>
