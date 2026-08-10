<script lang="ts">
	import { lang, t } from '$lib/i18n';

	let l = $derived($lang);

	const events = [
		{ time: '15:00', key: 'registration' as const },
		{ time: '16:00', key: 'photoSession' as const },
		{ time: '17:00', key: 'banquet' as const },
		{ time: '19:00', key: 'dancing' as const }
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
				<span class="desc">{t(l, event.key)}</span>
			</div>
		{/each}
	</div>
</section>

<style>
	.schedule {
		padding: 48px 24px;
		text-align: center;
	}

	.label {
		font-size: 11px;
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
		min-width: 56px;
		font-size: 13px;
		font-weight: 600;
		color: var(--gold);
	}

	.line {
		width: 1px;
		height: 32px;
		background: var(--border);
	}

	.desc {
		font-size: 13px;
		color: var(--text-body);
	}
</style>
