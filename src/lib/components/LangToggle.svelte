<script lang="ts">
	import { lang, setLang } from '$lib/i18n';

	let current = $derived($lang);
</script>

<button class="toggle" onclick={() => setLang(current === 'ru' ? 'ky' : 'ru')}>
	<span class:active={current === 'ru'}>РУС</span>
	<span class="sep">/</span>
	<span class:active={current === 'ky'}>КЫР</span>
</button>

<style>
	.toggle {
		background: rgba(255, 255, 255, 0.2);
		border: none;
		padding: 4px 12px;
		border-radius: 12px;
		backdrop-filter: blur(4px);
		font-size: 11px;
		letter-spacing: 1px;
		cursor: pointer;
		color: rgba(255, 255, 255, 0.6);
		font-family: var(--font-sans);
	}

	.active {
		color: white;
		font-weight: 600;
	}

	.sep {
		margin: 0 2px;
	}
</style>
