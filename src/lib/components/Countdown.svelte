<script lang="ts">
	import { lang, t } from '$lib/i18n';

	let l = $derived($lang);

	const weddingDate = new Date('2026-09-17T00:00:00');

	let now = $state(new Date());

	$effect(() => {
		const id = setInterval(() => {
			now = new Date();
		}, 1000);
		return () => clearInterval(id);
	});

	let diff = $derived(Math.max(0, weddingDate.getTime() - now.getTime()));
	let days = $derived(Math.floor(diff / (1000 * 60 * 60 * 24)));
	let hours = $derived(Math.floor((diff / (1000 * 60 * 60)) % 24));
	let minutes = $derived(Math.floor((diff / (1000 * 60)) % 60));
	let seconds = $derived(Math.floor((diff / 1000) % 60));
</script>

<section class="countdown">
	<span class="label">{t(l, 'countdown')}</span>

	<div class="units">
		<div class="unit">
			<span class="number">{days}</span>
			<span class="unit-label">{t(l, 'days')}</span>
		</div>
		<span class="sep">:</span>
		<div class="unit">
			<span class="number">{String(hours).padStart(2, '0')}</span>
			<span class="unit-label">{t(l, 'hours')}</span>
		</div>
		<span class="sep">:</span>
		<div class="unit">
			<span class="number">{String(minutes).padStart(2, '0')}</span>
			<span class="unit-label">{t(l, 'minutes')}</span>
		</div>
		<span class="sep">:</span>
		<div class="unit">
			<span class="number">{String(seconds).padStart(2, '0')}</span>
			<span class="unit-label">{t(l, 'seconds')}</span>
		</div>
	</div>
</section>

<style>
	.countdown {
		padding: 56px 24px;
		text-align: center;
		background: linear-gradient(180deg, var(--ivory) 0%, var(--cream) 100%);
	}

	.label {
		font-family: var(--font-sans);
		font-size: 13px;
		font-weight: 300;
		letter-spacing: 3px;
		text-transform: uppercase;
		color: var(--sage);
		display: block;
		margin-bottom: 20px;
	}

	.units {
		display: flex;
		justify-content: center;
		align-items: flex-start;
		gap: 16px;
	}

	.unit {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.number {
		font-size: 40px;
		font-weight: 300;
		color: var(--gold);
		font-family: var(--font-serif);
	}

	.unit-label {
		font-family: var(--font-sans);
		font-size: 12px;
		font-weight: 300;
		letter-spacing: 2px;
		text-transform: uppercase;
		color: var(--text-muted);
		margin-top: 4px;
	}

	.sep {
		color: var(--border);
		font-size: 30px;
		padding-top: 4px;
	}
</style>
