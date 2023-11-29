<script>
	import { ChevronDown, Eye } from 'lucide-svelte';
	import { statusMap } from '$helpers/const.js';
	import { StatusTimestamps } from '$components';
	import { tick } from 'svelte';

	export let parcelData;

	let timestampsOpen = true;
	let isIdOpen = false;
	let isNameOpen = false;

	const openCloseTimestamps = async () => {
		await tick();
		timestampsOpen = !timestampsOpen;
	};

	const idSwitch = () => {
		isIdOpen = !isIdOpen;
		if (isNameOpen) isNameOpen = false;

		console.log(isIdOpen, isNameOpen);
	};

	const nameSwitch = () => {
		isNameOpen = !isNameOpen;
		if (isIdOpen) isIdOpen = false;
	};
</script>

<div class="parcel-info">
	<div class="left">
		<div class="left-top">
			<div class="placeholders">
				<p>ID:</p>
				<p>Name:</p>
				<p>Status:</p>
			</div>
			<div class="contents">
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<div class="wrapper" on:click={idSwitch}>
					<button class="icon"><Eye size={18} /></button>
					<p class="parcel-id">{parcelData.parcel_id}</p>
					<span class="full" style:display={isIdOpen ? 'inline-block' : 'none'}
						>{parcelData.parcel_id}</span
					>
				</div>

				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<div class="wrapper" on:click={nameSwitch}>
					<button class="icon"><Eye size={18} /></button>
					<p class="parcel-name">{parcelData.parcel_name}</p>
					<span class="full" style:display={isIdOpen ? 'inline-block' : 'none'}
						>{parcelData.parcel_name}</span
					>
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
				<StatusTimestamps status_timestamps={parcelData.status_timestamps} />
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
	.parcel-info {
		font-size: 1.8rem;
		background-color: var(--s-bg-color);
		border: 2px solid var(--border);
		border-radius: 20px;
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		padding: 3.2rem;
		box-shadow: 0 4px 12px 2px rgba(0, 0, 0, 0.25);
		gap: 3.6rem;

		.left {
			display: flex;
			flex-direction: column;
			gap: 3.2rem;
		}
		.left-bottom {
			display: flex;
			flex-direction: column;
			button {
				background-color: transparent;
				border: none;
				font-size: inherit;
				color: inherit;
				font-weight: inherit;
				font-family: inherit;
				display: flex;
				max-width: max-content;
				gap: 0.8rem;
				cursor: pointer;
				padding-inline: 0;
				padding-block: 0;
				transition: all 0.3s;

				.icon {
					display: flex;
					align-items: center;
					justify-content: center;
					transition: all 0.3s;
					&.open {
						transform: rotate(180deg);
					}
				}

				&:hover {
					color: var(--accent-color);
				}
			}
		}
		.left-top,
		.right {
			display: flex;
			gap: 3.6rem;

			.contents {
				color: var(--accent-color);

				.wrapper {
					display: flex;
					position: relative;

					.icon {
						background-color: transparent;
						border: none;
						color: var(--text-color);
						display: none;
					}

					.full {
						position: absolute;
						left: 3.2rem;
						background-color: var(--s-bg-color);
						border-radius: 8px;
						border: 2px solid var(--border);
						padding: 1.2rem;
						z-index: 10;
						transform: translateY(-1.2rem);
					}
				}

				p {
					white-space: nowrap;

					&.parcel-name,
					&.names {
						overflow: hidden;
						text-overflow: ellipsis;
						width: 25rem;
					}
				}

				.status {
					position: relative;
					&::after {
						content: '';
						display: block;
						position: absolute;
						top: 50%;
						transform: translateY(-50%);
						left: -1.4rem;
						width: 1rem;
						height: 1rem;
						border-radius: 100%;
					}

					&.awaiting-drop-off::after {
						background-color: var(--awaiting-drop-off);
					}
					&.prepared-for-delivery::after {
						background-color: var(--prepared-for-delivery);
					}
					&.at-warehouse::after {
						background-color: var(--at-warehouse);
					}
					&.en-route::after {
						background-color: var(--en-route);
					}
					&.ready-for-pick-up::after {
						background-color: var(--ready-for-pick-up);
					}
					&.delivered::after {
						background-color: var(--delivered);
					}
				}
			}

			.placeholders,
			.contents {
				display: flex;
				flex-direction: column;
				gap: 3.2rem;
			}
		}
	}

	@media only screen and (max-width: 67.5em) {
		.parcel-info {
			grid-template-columns: 1fr;
		}

		.parcel-id {
			overflow: hidden;
			text-overflow: ellipsis;
			max-width: 25rem;
		}

		.parcel-info {
			.left-top,
			.right {
				.contents {
					.wrapper {
						.icon {
							display: flex;
						}
					}
				}
			}
		}
	}
</style>
