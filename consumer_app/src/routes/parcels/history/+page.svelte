<script>
	import { ParcelItem } from '$components';
	import { notifications } from '$stores';
	import { fade } from 'svelte/transition';

	export let data;

	$: user_parcels = data.status === 'success' ? data.data.parcels : null;
	$: if (user_parcels === null) {
		notifications.error('Something went wrong while getting your active parcels');
	}
</script>

<div class="page-title" in:fade={{ duration: 350, delay: 350 }} out:fade={{ duration: 350 }}>
	<h2>Parcel History</h2>
</div>

<div class="items" in:fade={{ duration: 350, delay: 650 }} out:fade={{ duration: 350 }}>
	{#each user_parcels as parcel}
		<ParcelItem {parcel}></ParcelItem>
	{/each}
</div>

<style lang="scss"></style>
