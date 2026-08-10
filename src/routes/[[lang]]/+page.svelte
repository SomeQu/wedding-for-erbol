<script lang="ts">
	import Hero from '$lib/components/Hero.svelte';
	import Schedule from '$lib/components/Schedule.svelte';
	import Venue from '$lib/components/Venue.svelte';
	import Rsvp from '$lib/components/Rsvp.svelte';
	import Countdown from '$lib/components/Countdown.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import ScrollReveal from '$lib/components/ScrollReveal.svelte';
</script>

<svelte:head>
	<title>Эрбол & Сайкал — 17.09.2026</title>
	<meta name="description" content="Приглашение на свадьбу Эрбола и Сайкал. 17 сентября 2026 года." />

	<meta property="og:title" content="Эрбол & Сайкал — Приглашение на свадьбу" />
	<meta property="og:description" content="17 сентября 2026 года. Мы будем рады видеть вас на нашем празднике!" />
	<meta property="og:image" content="/og-image.png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:type" content="website" />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Эрбол & Сайкал — Приглашение на свадьбу" />
	<meta name="twitter:description" content="17 сентября 2026 года. Мы будем рады видеть вас на нашем празднике!" />
	<meta name="twitter:image" content="/og-image.png" />
</svelte:head>

<main>
	<Hero />
	<div class="content-layer">
		<ScrollReveal>
			<Schedule />
		</ScrollReveal>
		<ScrollReveal delay={100}>
			<Venue />
		</ScrollReveal>
		<ScrollReveal delay={100}>
			<Rsvp />
		</ScrollReveal>
		<ScrollReveal>
			<Countdown />
		</ScrollReveal>
		<ScrollReveal>
			<Footer />
		</ScrollReveal>
	</div>
</main>

<style>
	.content-layer {
		position: relative;
		z-index: 1;
		background: var(--ivory);
		scroll-snap-align: start;
	}
</style>
