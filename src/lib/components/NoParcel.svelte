<script>
	import { PackagePlus, PackageX } from 'lucide-svelte';

	export let heading = 'No parcels here yet';
	export let text = 'Create new parcel';
	export let link = true;
</script>

<div class="not-found">
	<div class="icon">
		<PackageX size={82} strokeWidth={1} color={'#868686'} />
	</div>
	<h2>{heading}</h2>
	<div class="message">
		{#if link}
			<a href="/parcels/new"><span>{text}</span><PackagePlus size={14} /></a>
		{:else}
			<p>{text}</p>
		{/if}
	</div>
</div>

<style lang="scss">
	.not-found {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		.icon {
			margin-bottom: 3.6rem;
		}

		h2 {
			font-size: 2rem;
			font-weight: 300;
			color: var(--not-found-color);
			margin-bottom: 1.2rem;
		}

		.message {
			color: var(--not-found-color);
			font-size: 1.6rem;
		}
		a {
			&:link,
			&:visited {
				text-decoration: none;
				color: var(--not-found-color);
				display: flex;
				align-items: center;
				gap: 0.4rem;
				transition: all 0.3s;
			}

			&:hover,
			&:active {
				color: var(--accent-color);
			}
		}
	}
</style>
