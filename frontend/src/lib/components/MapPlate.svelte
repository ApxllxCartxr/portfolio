<!--
	Chennai as a map plate behind the hero: coastline of the Bay of Bengal,
	the Cooum and the Adyar running out to it, the Buckingham Canal parallel
	inland, and the sea hatched so it thickens as it leaves the shore. No
	labels — at this size the geography is the only thing that has to read.

	It is a drawing, not a generator — the glyph grid below is fixed art, so
	it renders identically everywhere and costs nothing but a <pre>. Land is
	deliberately left empty: that is where the name and the bio sit.

	No motion. A plate printed behind the type is the whole idea.
-->
<script lang="ts">
	const plate = String.raw`                                                  |            . ~
                                                   \   .     ~~    ~
                                                   |       .    ~ .
                                                    \          .~ ~
                                                    |         .~   .
                                                     \      ~    ~ ~
                                              :      |    .      . ~
                                               :      \       .~~
                                               :      |      .    ~
                                               :      |    ~   ~  ~
                                              :      /   .      .~
                                             :      /        .~    ~
                                            :      /        .   ~. .
                                           :      / .     ~      ~~
                                          :      /      .      ~
                                           :      \         .~   ~
                                           :      |        .  ~ . .~
                                            :      \     ~      ~
            __~______~______~______~______~______~_ \  .      .   ~
                                             :      |      .~  ~   ~
                                              :      \         . ~
                                              :      |         ~   ~
                                              :      |       .  ~
                                              :      |    .~      ~
                                             :      /         .~.
                                            :      /          ~  ~.
                                           :      /  .      . ~    ~
                                          :      /       .~     ~~
       ~______~______~______~______~______~_____ |      .    ~ .  ~
                                         :      /            ~ ~ .
                                         :      |   .      .     ~.
                                          :      \      .~    ~ ~  ~
                                                 |          . . ~
                                                /           ~~  . ~~
                                               /   .      .    ~ .
                                              /        .~   ~  ~ ~`;
</script>

<pre class="plate" aria-hidden="true">{plate}</pre>

<style>
	.plate {
		position: absolute;
		inset: 0;
		/* Bleed past the hero's own padding-top so the plate meets the top of
		   the viewport rather than the top of the text column. */
		top: calc(clamp(0.75rem, 2vh, 1.5rem) * -1 - 4vh);
		left: 50%;
		width: 100vw;
		transform: translateX(-50%);
		display: flex;
		/* Anchored to the top of the hero so the coastline runs off the top
		   edge of the viewport rather than floating in the middle. */
		align-items: flex-start;
		justify-content: center;
		/* Sits just right of centre — the coastline clears the type column
		   and the sea fills the right half without falling off the page. */
		padding-left: clamp(7.5rem, 47vw, 58rem);
		margin: 0;
		overflow: hidden;
		font-family: var(--font-mono);
		/* Sized so the 36 rows overrun the viewport rather than fitting it
		   exactly — the plate is meant to be cropped by the top and bottom
		   edges, not to sit inside them. */
		font-size: calc(100dvh / 30);
		line-height: 1.16;
		white-space: pre;
		color: var(--comment);
		opacity: 0.5;
		pointer-events: none;
		user-select: none;
		z-index: 0;
		/* The plate still has to surrender to the type where they overlap. */
		-webkit-mask-image: linear-gradient(to right, transparent 48%, #000 80%);
		mask-image: linear-gradient(to right, transparent 48%, #000 80%);
	}
</style>
