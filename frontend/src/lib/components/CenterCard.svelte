<!--
	Hero: the name is the thesis. EB Garamond at large size and weight is the
	most distinctive thing on the page, and everything under it is small and
	quiet by comparison.

	Type scale here is a cliff, not a slope:
	  display  ~5rem    EB Garamond, 700  (the name — one voice)
	  headline ~1.75rem Open Sauce 600 (the role)
	  body     1rem     Open Sauce, 400
	  caption  0.72rem  Iosevka, 500 + tracked + uppercase

	The accent (--accent) is the page's signal colour. It earns touchpoints
	here: the asterisk after the name, the layers glyph, and the link colour
	on the bio's in-page references.
-->
<script lang="ts"></script>

<div class="layout">
	<div class="copy">
		<h1 class="name">
			Joseph Fernando<span class="mark" aria-hidden="true">*</span>
		</h1>

		<p class="headline">
			<span class="role">Full-stack</span>
			<svg class="stack-icon" viewBox="0 0 24 24" aria-hidden="true">
				<path d="M12 2 22 7 12 12 2 7 12 2z" />
				<path
					d="M2 12l10 5 10-5"
					fill="none"
					stroke="currentColor"
					stroke-width="1.8"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
				<path
					d="M2 17l10 5 10-5"
					fill="none"
					stroke="currentColor"
					stroke-width="1.8"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
			<span class="role">systems</span>
			<span class="quiet">&amp; real-time software.</span>
		</p>

		<div class="bio">
			<p>
				I spend most of my time on backends and simulation. Right now that means
				<a href="#cmrlsim">cmrlsim</a>, a discrete-event model of Chennai's metro network in Go, and
				<a href="#simhalink">SimhaLink</a>, a real-time crowd-safety app built for one of the
				world's largest gatherings.
			</p>
			<p class="context">
				pre-final year cse grad @cit chennai, ex-sde intern @ picabord tech., president @ edc-citil.
			</p>
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
		align-items: end;
	}

	.copy {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		min-width: 0;
	}

	.portrait {
		margin: 0;
		justify-self: center;
		align-self: center;
		width: min(100%, 460px);
		/* The source cutout has a soft beige halo baked into the PNG; the
		   cream page bg reads through it, so no extra outline is needed. */
	}

	.avatar {
		display: block;
		width: 100%;
		height: auto;
	}

	.name {
		font-family: var(--font-display);
		font-size: var(--t-display);
		line-height: 0.78;
		font-weight: 700;
		letter-spacing: -0.01em;
		margin: 0;
		text-wrap: balance;
	}

	/* The asterisk glyph drifts off at cap height — pull it back so it
	   reads as a mark on the name, not a footnote to nothing. Retune if the
	   display face changes; the offset is tied to this glyph's metrics. */
	.mark {
		display: inline-block;
		margin-left: -0.12em;
		font-size: 0.85em;
		vertical-align: 0.58em;
		color: var(--accent);
	}

	.headline {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		column-gap: 0.5rem;
		margin: 1.4rem 0 0;
		max-width: 30ch;
		font-size: var(--t-h1);
		line-height: 1.18;
	}

	.role {
		font-weight: 600;
	}

	/* One geometric mark, one job: it stands in for the word "stack" between
	   the two halves of "Full-stack systems" instead of decorating them. */
	.stack-icon {
		width: 0.62em;
		height: 0.62em;
		align-self: center;
		color: var(--accent);
		fill: var(--accent);
	}

	.quiet {
		font-family: var(--font-body);
		font-weight: 400;
		color: var(--muted);
	}

	.bio {
		display: flex;
		flex-direction: column;
		gap: 0.85rem;
		margin-top: 1.6rem;
		max-width: 56ch;
		font-size: clamp(1.05rem, 1.3vw, 1.2rem);
		line-height: 1.65;
		color: var(--fg);
	}

	.bio a {
		color: var(--accent);
		text-decoration: underline;
		text-decoration-thickness: 1px;
		text-underline-offset: 3px;
	}

	.context {
		color: var(--fg);
	}

	@media (max-width: 899px) {
		.portrait {
			order: -1;
			width: min(100%, 220px);
			justify-self: start;
		}
	}

	@media (min-width: 900px) {
		.layout {
			grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
		}
	}
</style>
