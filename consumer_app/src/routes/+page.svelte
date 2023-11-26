<script>
	import { notifications } from '$stores';
	import { ParcelItem } from '$components';
	import { fade } from 'svelte/transition';

	export let data;

	$: user_parcels = data.status === 'success' ? data.data.user_parcels : null;
	$: if (user_parcels === null) {
		notifications.error('Something went wrong while getting your active parcels');
	}
</script>

<div class="page-title" in:fade={{ duration: 350, delay: 350 }} out:fade={{ duration: 350 }}>
	<h2>Active Parcels</h2>
</div>

<div class="items" in:fade={{ duration: 350, delay: 650 }} out:fade={{ duration: 350 }}>
	{#each user_parcels as parcel}
		<ParcelItem {parcel}></ParcelItem>
	{/each}
</div>

<style lang="scss">
	.items {
		margin-top: 6.4rem;
		display: grid;
		// justify-content: space-around;
		grid-template-columns: repeat(2, 1fr);
		justify-items: center;
		flex-wrap: wrap;
		gap: 4.8rem;
	}

	@media only screen and (max-width: 67.5em) {
		.items {
			grid-template-columns: 1fr;
		}
	}
	@media only screen and (max-width: 30em) {
		.items {
			margin-top: 3.2rem;
		}
	}
</style>
