<script>
	import { tick, createEventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition';

	const dispatcher = createEventDispatcher();

	/**
	 * @type {string}
	 */
	export let overlayLocation;

	const overlayClick = async () => {
		await tick();

		if (overlayLocation === 'menu') {
			dispatcher('closeMenu');
		}
	};
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="overlay" on:click={overlayClick} transition:fade={{ duration: 350 }}></div>

<style lang="scss">
	.overlay {
		position: fixed;
		z-index: 200;
		height: 100dvh;
		width: 100dvw;
		backdrop-filter: blur(0.3rem);
		-webkit-backdrop-filter: blur(0.3rem);
		overflow: hidden;
		background-color: rgba($color: #000000, $alpha: 0.4);
	}
</style>
