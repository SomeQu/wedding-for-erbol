<script lang="ts">
	import { lang, t } from '$lib/i18n';

	let l = $derived($lang);
</script>

<footer class="footer">
	<span class="monogram">Э & С</span>
	<span class="text">{t(l, 'footer')}</span>
</footer>

<style>
	.footer {
		padding: 28px 24px;
		text-align: center;
		border-top: 1px solid var(--border);
	}

	.monogram {
		font-size: 24px;
		font-family: var(--font-serif);
		font-style: italic;
		color: var(--sage);
		display: block;
	}

	.text {
		font-family: var(--font-sans);
		font-size: 13px;
		font-weight: 300;
		color: var(--text-muted);
		margin-top: 4px;
		display: block;
	}
</style>
