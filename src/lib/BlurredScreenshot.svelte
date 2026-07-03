<script lang="ts">
	import { onMount } from 'svelte';

	export let src: string;
	export let alt: string;
	export let blurRegions: Array<{ top: string; left: string; width: string; height: string }> = [];

	let show = false;

	onMount(() => {
		show = true;
	});
</script>

<div class="screenshot-container">
	<img {src} {alt} class="w-full h-auto" />
	{#if show}
		{#each blurRegions as region}
			<div
				class="blur-date-id"
				style="top: {region.top}; left: {region.left}; width: {region.width}; height: {region.height};"
			/>
		{/each}
	{/if}
</div>

<style>
	.screenshot-container {
		position: relative;
		display: inline-block;
		width: 100%;
	}

	.blur-date-id {
		position: absolute;
		backdrop-filter: blur(10px);
		border-radius: 0.375rem;
		pointer-events: none;
		z-index: 10;
	}
</style>
