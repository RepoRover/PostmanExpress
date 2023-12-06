<script>
	import { fade } from 'svelte/transition';

	export let width = '2rem';
	export let aspectRatio = '1';

	$: styleVars = `--pseudo-width: ${width}; --pseudo-aspect-ratio: ${aspectRatio};`;
</script>

<div class="loader">
	<div class="square-circle-3" transition:fade={{ duration: 200 }} style={styleVars}></div>
</div>

<style lang="scss">
	.loader {
		position: fixed;
		z-index: 201;
		bottom: 4rem;
		left: 4rem;
	}
	.square-circle-3 {
		display: flex;
		gap: 5px;
	}

	.square-circle-3:before,
	.square-circle-3:after {
		content: '';
		box-shadow: 0 0 0 2px inset #fff;
		animation: 2s infinite linear;
		animation-name: sc3-1, sc3-2;
		animation-delay: -1s, 0s;
		width: var(--pseudo-width);
		aspect-ratio: var(--pseudo-aspect-ratio);
	}

	.square-circle-3:after {
		--s: -1;
	}

	@keyframes sc3-1 {
		0% {
			border-radius: 50% 0 0 50%;
		}
		25% {
			border-radius: 50% 50% 0 0;
		}
		50% {
			border-radius: 0 50% 50% 0;
		}
		75% {
			border-radius: 0 0 50% 50%;
		}
		100% {
			border-radius: 50% 0 0 50%;
		}
	}
	@keyframes sc3-2 {
		0% {
			transform: scaleX(var(--s, 1)) rotate(0deg);
		}
		100% {
			transform: scaleX(var(--s, 1)) rotate(-360deg);
		}
	}
</style>
