<script>
	// @ts-nocheck

	import { AuthorizedParcelInfo, UnauthorizedParcelInfo, PageContentFade } from '$components';
	import NoParcel from '$components/NoParcel.svelte';

	export let data;

	$: errorMessage = data.message ? data.message : null;
	$: authorized = data.authorized === true || data.authorized === false ? data.authorized : null;
	$: parcelData = data.parcel_info ? data.parcel_info : null;
</script>

<PageContentFade>
	<h2 slot="title">Parcel Info</h2>
	<div slot="content">
		{#if parcelData && authorized !== null}
			<div class="parcel-info-container">
				{#if authorized}
					<AuthorizedParcelInfo {parcelData} />
				{:else if !authorized}
					<UnauthorizedParcelInfo {parcelData} />
				{/if}
			</div>
		{:else if errorMessage}
			<NoParcel heading="No parcel found" text={errorMessage.slice(0, -1)} link={false} />
		{/if}
	</div>
</PageContentFade>

<style lang="scss">
	.parcel-info-container {
		padding: 0 6.4rem 0;
	}
	@media only screen and (max-width: 48em) {
		.parcel-info-container {
			padding: 0 1.2rem 0;
		}
	}
</style>
