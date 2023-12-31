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
				<p>Name:</p>
				<p>Status:</p>
				{#if parcelData.delivery_pin}
					<p>Delivery pin:</p>
				{/if}
				{#if parcelData.pickup_pin}
					<p>Pickup pin:</p>
				{/if}
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

				<p class="parcel-name">{parcelData.parcel_name}</p>

				<p class="status {statusMap[parcelData.parcel_status]}">
					{parcelData.parcel_status.charAt(0).toUpperCase() + parcelData.parcel_status.slice(1)}
				</p>
				{#if parcelData.delivery_pin}
					<p>{parcelData.delivery_pin}</p>
				{/if}
				{#if parcelData.pickup_pin}
					<p>{parcelData.pickup_pin}</p>
				{/if}
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
			<p>Recipient:</p>
			<p>Sender:</p>
			<p>From:</p>
			<p>To:</p>
			<p>Weight:</p>
			<p>Height:</p>
			<p>Width:</p>
			<p>Length:</p>
		</div>
		<div class="contents">
			<p class="names">{parcelData.receiver_name}</p>
			<p class="names">{parcelData.sender_name}</p>
			<p>
				{parcelData.ship_from.charAt(0).toUpperCase() + parcelData.ship_from.slice(1)}
			</p>
			<p>
				{parcelData.ship_to.charAt(0).toUpperCase() + parcelData.ship_to.slice(1)}
			</p>
			<p>{parcelData.weight} kg</p>
			<p>{parcelData.height} m</p>
			<p>{parcelData.width} m</p>
			<p>{parcelData.length} m</p>
		</div>
	</div>
</div>

<style lang="scss">
	.names {
		overflow: hidden;
		text-overflow: ellipsis;
		width: 25rem;
	}

	@media only screen and (max-width: 39em) {
		.parcel-name {
			overflow: hidden;
			text-overflow: ellipsis;
			max-width: 20rem;
		}
	}

	@media only screen and (max-width: 30em) {
		.parcel-name {
			overflow: hidden;
			text-overflow: ellipsis;
			max-width: 16rem;
		}
	}
</style>
