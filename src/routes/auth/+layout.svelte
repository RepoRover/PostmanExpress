<script>
	import { fade } from 'svelte/transition';
</script>

<div in:fade={{ duration: 350, delay: 350 }} out:fade={{ duration: 350 }}>
	<div class="logo">
		<h1>PostmanExpress</h1>
	</div>
</div>
<slot />

<style lang="scss">
	.logo {
		display: flex;
		flex-direction: column;
		align-items: center;
		color: var(--accent-color);
		h1 {
			font-weight: 300;
			margin-bottom: 3.2rem;
		}
	}
</style>
