<script>
	import { ParcelItem, NoParcel, PageContentFade } from '$components';
	import { notifications } from '$stores';
	import { fade } from 'svelte/transition';

	export let data;

	$: user_parcels = data.status === 'success' ? data.data.parcels : null;
	$: if (user_parcels === null) {
		notifications.error('Something went wrong while getting your active parcels');
	}
</script>

<PageContentFade>
	<h2 slot="title">Parcel History</h2>

	<div slot="content">
		{#if user_parcels.length > 0}
			<div class="items" in:fade={{ duration: 350, delay: 650 }} out:fade={{ duration: 350 }}>
				{#each user_parcels as parcel}
					<ParcelItem {parcel}></ParcelItem>
				{/each}
			</div>
		{:else}
			<NoParcel />
		{/if}
	</div>
</PageContentFade>
