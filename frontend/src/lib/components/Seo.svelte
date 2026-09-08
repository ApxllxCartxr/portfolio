<!--
	Every page's share metadata in one place. Without this a link to the site
	dropped into Slack, LinkedIn or a DM renders as a bare URL with no title,
	description or preview — which is most of how a portfolio actually gets
	passed around.

	The canonical and og:url come from the request URL rather than a
	hard-coded origin, so previews are correct on the Vercel preview
	deployments as well as production. The card image is static/og.png, set
	in the page's own type.
-->
<script lang="ts">
	import { page } from '$app/state';

	let {
		title,
		description,
		type = 'website'
	}: { title: string; description: string; type?: 'website' | 'article' } = $props();

	const url = $derived(page.url.origin + page.url.pathname);
	const image = $derived(page.url.origin + '/og.png');
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={url} />

	<meta property="og:type" content={type} />
	<meta property="og:site_name" content="Joseph Fernando" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={url} />
	<meta property="og:image" content={image} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta
		property="og:image:alt"
		content="Joseph Fernando — full-stack systems and real-time software"
	/>

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={image} />
</svelte:head>
