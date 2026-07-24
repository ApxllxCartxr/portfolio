<script lang="ts">
	import { profile } from '$lib/resume';
	import HeroCard from '$lib/components/HeroCard.svelte';
</script>

<svelte:head>
	<title>{profile.fullName} — {profile.eyebrow}</title>
	<meta name="description" content={profile.lead + ' ' + profile.intro} />
</svelte:head>

<main class="page">
	<HeroCard />
</main>

<style>
	.page {
		max-width: 960px;
		margin-inline: auto;
		padding: 2rem 1.25rem 4rem;
	}

	@media (max-width: 900px) {
		.page {
			padding: clamp(0.6rem, 3vw, 1.15rem) clamp(0.6rem, 3vw, 1.15rem) 3rem;
		}
	}
</style>
