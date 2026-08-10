<script lang="ts">
	import { lang, t } from '$lib/i18n';
	import LangToggle from './LangToggle.svelte';

	let l = $derived($lang);

	let scrollY = $state(0);
	let heroH = $state(0);

	let progress = $derived(heroH > 0 ? Math.min(scrollY / heroH, 1) : 0);
	let contentOpacity = $derived(Math.max(1 - progress * 2, 0));
	let darkOverlay = $derived(progress * 0.7);
</script>

<svelte:window bind:scrollY />

<div class="hero-wrapper" bind:clientHeight={heroH}>
	<section class="hero">
		<div class="dark-overlay" style="opacity: {darkOverlay}"></div>
		<div class="lang-pos">
			<LangToggle />
		</div>
		<div class="content" style="opacity: {contentOpacity}; transform: scale({1 - progress * 0.05})">
			<span class="subtitle">{t(l, 'invitation')}</span>
			<h1 class="name">Эрбол</h1>
			<span class="amp">&</span>
			<h1 class="name">Сайкал</h1>
			<span class="date">17 · 09 · 2026</span>
		</div>
		<div class="scroll-hint" style="opacity: {contentOpacity}">
			<span class="scroll-text">{t(l, 'scrollHint')}</span>
			<div class="scroll-arrow">
				<svg width="20" height="10" viewBox="0 0 20 10" fill="none">
					<path d="M1 9L10 1L19 9" stroke="rgba(255,255,255,0.6)" stroke-width="1.5" stroke-linecap="round"/>
				</svg>
			</div>
		</div>
	</section>
</div>

<style>
	.hero-wrapper {
		height: 100svh;
		scroll-snap-align: start;
	}

	.hero {
		background: linear-gradient(180deg, #8FA88B 0%, #A3B89E 50%, #C6D4BE 100%);
		height: 100svh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		color: white;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 0;
		padding: 24px;
	}

	.dark-overlay {
		position: absolute;
		inset: 0;
		background: black;
		pointer-events: none;
	}

	.lang-pos {
		position: absolute;
		top: 16px;
		right: 16px;
		z-index: 2;
	}

	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		z-index: 1;
		will-change: opacity, transform;
	}

	.subtitle {
		font-size: 11px;
		letter-spacing: 4px;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.8);
		margin-bottom: 12px;
	}

	.name {
		font-size: clamp(36px, 10vw, 56px);
		font-family: var(--font-serif);
		font-style: italic;
		font-weight: 400;
		line-height: 1.2;
	}

	.amp {
		font-size: 18px;
		color: rgba(255, 255, 255, 0.7);
		margin: 6px 0;
	}

	.date {
		margin-top: 16px;
		font-size: 14px;
		letter-spacing: 3px;
		color: rgba(255, 255, 255, 0.85);
	}

	.scroll-hint {
		position: absolute;
		bottom: 32px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
		z-index: 1;
		animation: float 2s ease-in-out infinite;
	}

	.scroll-text {
		font-size: 12px;
		letter-spacing: 1px;
		color: rgba(255, 255, 255, 0.6);
	}

	.scroll-arrow {
		animation: bounce 2s ease-in-out infinite;
	}

	@keyframes bounce {
		0%, 100% { transform: translateY(0); }
		50% { transform: translateY(6px); }
	}
</style>
