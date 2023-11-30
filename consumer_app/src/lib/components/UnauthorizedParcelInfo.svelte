<script>
	import { ChevronDown, Eye, EyeOff } from 'lucide-svelte';
	import { statusMap } from '$helpers/const.js';
	import { StatusTimestamps } from '$components';
	import { tick } from 'svelte';

	export let parcelData;

	$: if (
		parcelData.parcel_status === 'en route to the warehouse' ||
		parcelData.parcel_status === 'en route to the pickup location'
	)
		parcelData.parcel_status = 'en route';

	$: timeStamps = parcelData.status_timestamps.reverse();

	let timestampsOpen = true;
	let isIdOpen = false;

	const openCloseTimestamps = async () => {
		await tick();
		timestampsOpen = !timestampsOpen;
	};

	const idSwitch = () => {
		isIdOpen = !isIdOpen;
	};
</script>

<div class="parcel-info">
	<div class="left">
		<div class="left-top">
			<div class="placeholders">
				<p>ID:</p>
				<p>Status:</p>
			</div>
			<div class="contents">
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<div class="wrapper">
					{#if isIdOpen}
						<button class="icon" on:click={idSwitch}><EyeOff size={18} /></button>
					{:else}
						<button class="icon" on:click={idSwitch}><Eye size={18} /></button>
					{/if}
					<p class="parcel-id">{parcelData.parcel_id}</p>
					<span class="full" class:shown={isIdOpen}>{parcelData.parcel_id}</span>
				</div>

				<p class="status {statusMap[parcelData.parcel_status]}">
					{parcelData.parcel_status.charAt(0).toUpperCase() + parcelData.parcel_status.slice(1)}
				</p>
			</div>
		</div>
		<div class="left-bottom">
			<button on:click={openCloseTimestamps} class:open={timestampsOpen}
				>Status roadmap
				<div class="icon" class:open={timestampsOpen}><ChevronDown size={19} /></div>
			</button>
			{#if timestampsOpen}
				<StatusTimestamps status_timestamps={timeStamps} />
			{/if}
		</div>
	</div>
	<div class="right">
		<div class="placeholders">
			<p>From:</p>
			<p>To:</p>
		</div>
		<div class="contents">
			<p>
				{parcelData.ship_from.charAt(0).toUpperCase() + parcelData.ship_from.slice(1)}
			</p>
			<p>
				{parcelData.ship_to.charAt(0).toUpperCase() + parcelData.ship_to.slice(1)}
			</p>
		</div>
	</div>
</div>
