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
