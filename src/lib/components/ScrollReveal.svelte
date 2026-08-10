<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children, delay = 0 }: { children: Snippet; delay?: number } = $props();

	let el: HTMLDivElement;
	let visible = $state(false);

	$effect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					visible = true;
					observer.disconnect();
				}
			},
			{ threshold: 0.15 }
		);
		observer.observe(el);
		return () => observer.disconnect();
	});
</script>

<div
	bind:this={el}
	class="reveal"
	class:visible
	style="transition-delay: {delay}ms"
>
	{@render children()}
</div>

<style>
	.reveal {
		opacity: 0;
		transform: translateY(32px);
		transition: opacity 0.7s ease-out, transform 0.7s ease-out;
	}

	.reveal.visible {
		opacity: 1;
		transform: translateY(0);
	}
</style>
