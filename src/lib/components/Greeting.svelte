<script lang="ts">
	import { lang, t } from '$lib/i18n';

	let l = $derived($lang);
</script>

<section class="greeting">
	<p class="main-text">{t(l, 'greetingMain')}</p>
	<div class="divider"></div>
	<p class="sub-text">{t(l, 'greetingSub')}</p>
</section>

<style>
	.greeting {
		padding: 56px 24px;
		text-align: center;
		max-width: 480px;
		margin: 0 auto;
	}

	.main-text {
		font-family: var(--font-sans);
		font-size: 14px;
		font-weight: 400;
		letter-spacing: 2px;
		line-height: 2;
		text-transform: uppercase;
		color: var(--text-dark);
	}

	.divider {
		width: 40px;
		height: 1px;
		background: var(--gold);
		margin: 24px auto;
	}

	.sub-text {
		font-family: var(--font-serif);
		font-size: 16px;
		font-style: italic;
		font-weight: 400;
		line-height: 1.7;
		color: var(--text-body);
	}
</style>
