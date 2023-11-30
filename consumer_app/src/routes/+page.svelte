<script>
	import { notifications } from '$stores';
	import { ParcelItem, PageContentFade, NoParcel } from '$components';

	export let data;

	$: user_parcels = data.status === 'success' ? data.data.user_parcels : null;
	$: if (user_parcels === null) {
		notifications.error('Something went wrong while getting your active parcels');
	}
</script>

<PageContentFade>
	<h2 slot="title">Active Parcels</h2>
	<div slot="content">
		{#if user_parcels.length > 0}
			<div class="items">
				{#each user_parcels as parcel}
					<ParcelItem {parcel}></ParcelItem>
				{/each}
			</div>
		{:else}
			<NoParcel />
		{/if}
	</div>
</PageContentFade>
