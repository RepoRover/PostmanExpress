<script>
	import { AuthorizedParcelInfo, UnauthorizedParcelInfo } from '$components';
	import { fade } from 'svelte/transition';

	export let data;
	$: authorized = data.authorized;
	$: parcelData = data.parcel_info;
</script>

<div class="page-title" in:fade={{ duration: 350, delay: 350 }} out:fade={{ duration: 350 }}>
	<h2>Parcel Info</h2>
</div>

<div
	class="parcel-info-container"
	in:fade={{ duration: 350, delay: 650 }}
	out:fade={{ duration: 350 }}
>
	{#if authorized}
		<AuthorizedParcelInfo {parcelData} />
	{:else if !authorized}
		<UnauthorizedParcelInfo {parcelData} />
	{/if}
</div>

<style lang="scss">
	.parcel-info-container {
		padding: 3.6rem 6.4rem 0;
	}
	@media only screen and (max-width: 48em) {
		.parcel-info-container {
			padding: 3.6rem 1.2rem 0;
		}
	}
</style>
