<script>
	import { applyAction, enhance } from '$app/forms';
	import { PageContentFade, Loader, LocationSelect } from '$components';
	import { notifications } from '$stores';
	import { ArrowLeft, Check } from 'lucide-svelte';
	import { fade } from 'svelte/transition';

	let newParcelStep = 0;

	let weight;
	let height;
	let length;
	let width;
	let recipient_email = '';
	let parcel_name;
	let ship_from = '';
	let ship_to = '';

	let isLoading = false;

	const checkEmailLength = () => {
		if (
			recipient_email.length === 0 &&
			!$notifications.some((notification) => notification.message === 'Recipient email is required')
		) {
			notifications.warning('Recipient email is required');
		}
	};

	const step2Check = () => {
		if (
			(ship_from.length === 0 || ship_to.length === 0) &&
			!$notifications.some((notification) => notification.message === 'Invalid location')
		) {
			notifications.warning('Invalid location');
			return;
		} else if (
			ship_from === ship_to &&
			!$notifications.some(
				(notification) => notification.message === "You can't send parcel to the same location."
			)
		) {
			notifications.warning("You can't send parcel to the same location.");
			return;
		}

		stepForward();
	};

	const selectShipFrom = (/** @type {{ detail: string; }} */ event) => {
		ship_from = event.detail;
	};

	const selectShipTo = (/** @type {{ detail: string; }} */ event) => {
		ship_to = event.detail;
	};

	const stepForward = () => {
		newParcelStep++;
	};

	const stepBackward = () => {
		newParcelStep--;
	};

	$: step1BtnDisabled = recipient_email.length === 0 ? true : false;
	$: step2BtnDisabled = ship_from.length === 0 || ship_to.length === 0 ? true : false;

	const navigateToStep2 = () => {
		if (!step1BtnDisabled) newParcelStep = 1;
	};

	const navigateToStep3 = () => {
		if (!step2BtnDisabled) newParcelStep = 2;
	};
</script>

{#if isLoading}
	<Loader />
{/if}

<PageContentFade>
	<h2 slot="title">New Parcel</h2>
	<div slot="content">
		<div class="new-parcel-map">
			<div class="step" class:done={newParcelStep > 0} class:active={newParcelStep === 0}>
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<div class="circle circle-1" on:click={() => (newParcelStep = 0)}>
					{#if newParcelStep > 0}
						<Check color="#4e4e4e" size={16} />
					{/if}
				</div>
				<div class="line"></div>
			</div>
			<div class="step" class:done={newParcelStep > 1} class:active={newParcelStep === 1}>
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<div class="circle circle-2" on:click={navigateToStep2}>
					{#if newParcelStep > 1}
						<Check color="#4e4e4e" size={16} />
					{/if}
				</div>
				<div class="line"></div>
			</div>
			<div class="step" class:done={newParcelStep > 2} class:active={newParcelStep === 2}>
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<div class="circle circle-3" on:click={navigateToStep3}>
					{#if newParcelStep > 2}
						<Check color="#4e4e4e" size={16} />
					{/if}
				</div>
				<div class="line"></div>
			</div>
			<div class="step" class:done={newParcelStep > 3} class:active={newParcelStep === 3}>
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<div class="circle circle-4" on:click={() => (newParcelStep = 3)}>
					{#if newParcelStep > 3}
						<Check color="#4e4e4e" size={16} />
					{/if}
				</div>
				<div class="line"></div>
			</div>
			<div class="step last" class:done={newParcelStep > 4} class:active={newParcelStep === 4}>
				<div class="circle circle-5">
					{#if newParcelStep > 4}
						<Check color="#4e4e4e" size={16} />
					{/if}
				</div>
			</div>
		</div>

		<div class="user-inputs">
			{#if newParcelStep === 0}
				<!-- Parcel name and recipient email step -->
				<div
					class="input-box parcel-name"
					in:fade={{ duration: 350, delay: 450 }}
					out:fade={{ duration: 350, delay: 25 }}
				>
					<div class="inner-box">
						<div class="absolute">
							<input
								class="text-input"
								name="parcel_name"
								type="text"
								placeholder="Package name"
								bind:value={parcel_name}
							/>
						</div>
					</div>
				</div>
				<div
					class="input-box"
					in:fade={{ duration: 350, delay: 450 }}
					out:fade={{ duration: 350, delay: 25 }}
				>
					<div class="inner-box">
						<div class="absolute">
							<input
								class="text-input"
								name="recipient_email"
								type="text"
								placeholder="Recipient email"
								bind:value={recipient_email}
								on:input={checkEmailLength}
							/>
						</div>
					</div>
				</div>
				<form
					class="submit-form"
					action="?/validateEmail"
					method="post"
					use:enhance={() => {
						isLoading = true;
						return async ({ result }) => {
							if (result.type === 'failure') {
								notifications.warning(result.data.message);
							} else {
								stepForward();
							}
							await applyAction(result);
							isLoading = false;
						};
					}}
				>
					<input
						type="text"
						name="recipient_email"
						style:display="none"
						bind:value={recipient_email}
					/>
					<button
						type="submit"
						class="submit-btn"
						in:fade={{ duration: 350, delay: 475 }}
						out:fade={{ duration: 350, delay: 50 }}
						disabled={step1BtnDisabled}>Continue</button
					>
				</form>
			{:else if newParcelStep === 1}
				<div class="location-1">
					<LocationSelect on:selectLocation={selectShipFrom} />
				</div>
				<LocationSelect on:selectLocation={selectShipTo} />
				<!-- Locations step -->
				<form
					class="move-btns submit-form"
					in:fade={{ delay: 450, duration: 350 }}
					out:fade={{ duration: 350, delay: 50 }}
				>
					<button type="button" class="btn-back" on:click={stepBackward}
						><ArrowLeft></ArrowLeft></button
					>
					<button type="button" class="submit-btn" on:click={step2Check} disabled={step2BtnDisabled}
						>Continue</button
					>
				</form>
			{:else if newParcelStep === 2}
				<input type="number" name="weight" bind:value={weight} placeholder="Weight" />
				<input type="number" name="height" bind:value={height} placeholder="Height" />
				<input type="number" name="length" bind:value={length} placeholder="Length" />
				<input type="number" name="width" bind:value={width} placeholder="Width" />
			{:else if newParcelStep === 3}
				<!-- Confirmation -->
			{:else if newParcelStep === 4}
				<!-- Created -->
			{/if}
		</div>
	</div>
</PageContentFade>

<style lang="scss">
	.parcel-name {
		&::after {
			content: 'Optional';
			position: absolute;
			top: 50%;
			right: -4.8rem;
			transform: translateY(-50%);
		}
	}

	.location-1 {
		width: 100%;
		z-index: 50;
	}
	.new-parcel-map {
		height: 2rem;
		display: flex;
		justify-content: space-between;
		padding: 0 3.2rem;
		margin-bottom: 6.4rem;
		.step {
			display: flex;
			align-items: center;
			width: 100%;

			font-size: 1.2rem;

			&.last {
				width: auto;

				.circle {
					cursor: default;
				}
			}
			.circle {
				position: relative;
				height: 2rem;
				width: 2rem;
				border-radius: 100%;
				border: 2px solid var(--dis-action-btn);
				transition: all 0.35s;
				display: flex;
				align-items: center;
				justify-content: center;
				cursor: pointer;

				&::after {
					white-space: nowrap;
					top: 125%;
					left: 50%;
					transform: translateX(-50%);
				}
				&-1 {
					&::after {
						content: 'Parcel name';
						position: absolute;
					}
				}
				&-2 {
					&::after {
						content: 'Locations';
						position: absolute;
					}
				}
				&-3 {
					&::after {
						content: 'Dimentions';
						position: absolute;
					}
				}
				&-4 {
					&::after {
						content: 'Confirmation';
						position: absolute;
					}
				}
				&-5 {
					&::after {
						content: 'Created';
						position: absolute;
					}
				}
			}

			.line {
				width: calc(100% - 2.4rem);
				height: 1px;
				background-color: var(--section-sep);
				border-radius: 5px;
				transition: all 0.35s;
			}

			&.done {
				.circle {
					background-color: var(--delivered);
				}

				.line {
					background-color: var(--delivered);
				}
			}

			&.active {
				.circle {
					background-color: var(--text-color);
				}
			}
		}
	}
</style>
