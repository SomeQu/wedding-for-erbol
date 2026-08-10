<script lang="ts">
	import { lang, t } from '$lib/i18n';

	let l = $derived($lang);

	const events = [
		{ time: '16:00', key: 'gathering' as const, sub: 'gatheringSub' as const },
		{ time: '17:00', key: 'celebration' as const, sub: 'celebrationSub' as const },
		{ time: '18:30', key: 'program' as const, sub: 'programSub' as const },
		{ time: '21:00', key: 'dancing' as const, sub: 'dancingSub' as const }
	];
</script>

<section class="schedule">
	<span class="label">{t(l, 'schedule')}</span>
	<div class="divider"></div>

	<div class="timeline">
		{#each events as event}
			<div class="event">
				<span class="time">{event.time}</span>
				<div class="line"></div>
				<div class="desc-block">
					<span class="desc">{t(l, event.key)}</span>
					<span class="sub">{t(l, event.sub)}</span>
				</div>
			</div>
		{/each}
	</div>
</section>

<style>
	.schedule {
		min-height: 100svh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 48px 24px;
		text-align: center;
		background: var(--cream);
	}

	.label {
		font-family: var(--font-sans);
		font-size: 13px;
		font-weight: 300;
		letter-spacing: 3px;
		text-transform: uppercase;
		color: var(--sage);
	}

	.divider {
		width: 40px;
		height: 1px;
		background: var(--gold);
		margin: 8px auto 28px;
	}

	.timeline {
		display: flex;
		flex-direction: column;
		gap: 20px;
		max-width: 280px;
		margin: 0 auto;
	}

	.event {
		display: flex;
		align-items: center;
		gap: 16px;
		text-align: left;
	}

	.time {
		font-family: var(--font-serif);
		min-width: 56px;
		font-size: 28px;
		font-weight: 400;
		color: var(--gold);
	}

	.line {
		width: 1px;
		height: 32px;
		background: var(--border);
	}

	.desc-block {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.desc {
		font-family: var(--font-sans);
		font-size: 15px;
		font-weight: 500;
		color: var(--text-dark);
	}

	.sub {
		font-family: var(--font-sans);
		font-size: 13px;
		font-weight: 300;
		color: var(--text-muted);
	}
</style>
