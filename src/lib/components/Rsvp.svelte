<script lang="ts">
	import { lang, t } from '$lib/i18n';
	import { slide } from 'svelte/transition';
	import { sendRsvp } from '$lib/telegram';

	let l = $derived($lang);

	let expanded = $state(false);
	let submitted = $state(false);
	let sending = $state(false);
	let fullName = $state('');
	let side = $state<'groom' | 'bride' | null>(null);
	let relationship = $state<string | null>(null);
	let comment = $state('');

	const relationships = ['relative', 'friend', 'colleague', 'neighbor', 'other'] as const;

	async function submit() {
		if (!fullName.trim()) return;
		sending = true;
		await sendRsvp({ fullName, side, relationship, comment });
		sending = false;
		submitted = true;
	}
</script>

<section class="rsvp">
	<span class="label">{t(l, 'confirmation')}</span>

	{#if submitted}
		<div class="thank-you" transition:slide={{ duration: 300 }}>
			<span class="thank-you-text">{t(l, 'thankYou')}</span>
		</div>
	{:else if !expanded}
		<button class="collapsed" onclick={() => (expanded = true)}>
			<span class="title">{t(l, 'iWillCome')}</span>
			<span class="hint">{t(l, 'clickToConfirm')}</span>
		</button>
	{:else}
		<div class="form" transition:slide={{ duration: 300 }}>
			<div class="form-header">{t(l, 'iWillCome')}</div>

			<div class="field">
				<label for="fullname">{t(l, 'fullName')}</label>
				<input
					id="fullname"
					type="text"
					bind:value={fullName}
					placeholder={t(l, 'fullNamePlaceholder')}
				/>
			</div>

			<div class="field">
				<label>{t(l, 'whoseSide')}</label>
				<div class="sides">
					<button
						class="side-btn"
						class:selected={side === 'groom'}
						onclick={() => (side = 'groom')}
					>
						{t(l, 'groom')}
					</button>
					<button
						class="side-btn"
						class:selected={side === 'bride'}
						onclick={() => (side = 'bride')}
					>
						{t(l, 'bride')}
					</button>
				</div>
			</div>

			<div class="field">
				<label>{t(l, 'relationship')}</label>
				<div class="chips">
					{#each relationships as rel}
						<button
							class="chip"
							class:selected={relationship === rel}
							onclick={() => (relationship = rel)}
						>
							{t(l, rel)}
						</button>
					{/each}
				</div>
			</div>

			<div class="field">
				<label for="comment">{t(l, 'leaveComment')}</label>
				<textarea
					id="comment"
					bind:value={comment}
					placeholder={t(l, 'commentPlaceholder')}
					rows="3"
				></textarea>
			</div>

			<button class="submit-btn" onclick={submit} disabled={sending || !fullName.trim()}>
				{sending ? '...' : t(l, 'send')}
			</button>
		</div>
	{/if}
</section>

<style>
	.rsvp {
		padding: 48px 24px;
		text-align: center;
	}

	.label {
		font-family: var(--font-sans);
		font-size: 11px;
		font-weight: 300;
		letter-spacing: 3px;
		text-transform: uppercase;
		color: var(--sage);
		display: block;
		margin-bottom: 16px;
	}

	.collapsed {
		border: 1px solid var(--border);
		border-radius: 12px;
		padding: 18px 24px;
		cursor: pointer;
		background: var(--ivory);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
		display: block;
		width: 100%;
		max-width: 400px;
		margin: 0 auto;
		font-family: var(--font-sans);
	}

	.collapsed .title {
		font-family: var(--font-serif);
		font-size: 22px;
		color: var(--gold);
		display: block;
	}

	.collapsed .hint {
		font-size: 14px;
		color: var(--text-muted);
		margin-top: 4px;
		display: block;
	}

	.thank-you {
		border: 1px solid var(--sage);
		border-radius: 12px;
		padding: 32px 24px;
		background: var(--sage-bg);
		max-width: 400px;
		margin: 0 auto;
	}

	.thank-you-text {
		font-size: 24px;
		color: var(--sage);
		font-family: var(--font-serif);
	}

	.form {
		border: 1px solid var(--border);
		border-radius: 12px;
		padding: 24px;
		background: #f6f9f5;
		box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
		text-align: left;
		max-width: 400px;
		margin: 0 auto;
	}

	.form-header {
		text-align: center;
		font-size: 20px;
		font-family: var(--font-serif);
		color: var(--sage);
		margin-bottom: 20px;
	}

	.field {
		margin-bottom: 16px;
	}

	.field label {
		font-size: 11px;
		letter-spacing: 2px;
		text-transform: uppercase;
		color: var(--sage);
		display: block;
		margin-bottom: 6px;
		font-family: var(--font-sans);
	}

	.field input,
	.field textarea {
		width: 100%;
		border: 1px solid var(--border);
		border-radius: 8px;
		padding: 12px 14px;
		font-size: 14px;
		color: var(--text-dark);
		background: white;
		font-family: var(--font-sans);
		resize: none;
	}

	.field input::placeholder,
	.field textarea::placeholder {
		color: #aaa;
	}

	.field input:focus,
	.field textarea:focus {
		outline: none;
		border-color: var(--sage);
	}

	.sides {
		display: flex;
		gap: 8px;
	}

	.side-btn {
		flex: 1;
		border: 1px solid var(--border);
		border-radius: 8px;
		padding: 10px;
		text-align: center;
		font-size: 13px;
		color: var(--text-muted);
		background: white;
		cursor: pointer;
		font-family: var(--font-sans);
		transition: all 0.2s;
	}

	.side-btn.selected {
		border-color: var(--sage);
		background: var(--sage-bg);
		color: var(--sage-text);
		font-weight: 600;
	}

	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	.chip {
		border: 1px solid var(--border);
		border-radius: 20px;
		padding: 7px 14px;
		font-size: 12px;
		color: #777;
		background: white;
		cursor: pointer;
		font-family: var(--font-sans);
		transition: all 0.2s;
	}

	.chip.selected {
		border-color: var(--sage);
		background: var(--sage-bg);
		color: var(--sage-text);
		font-weight: 600;
	}

	.submit-btn {
		width: 100%;
		background: var(--gold);
		color: white;
		border: none;
		border-radius: 8px;
		padding: 14px;
		font-size: 14px;
		letter-spacing: 1px;
		cursor: pointer;
		font-family: var(--font-sans);
		margin-top: 4px;
		transition: opacity 0.2s;
	}

	.submit-btn:hover:not(:disabled) {
		opacity: 0.9;
	}

	.submit-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>
