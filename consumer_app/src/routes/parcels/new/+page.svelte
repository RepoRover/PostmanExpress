<script>
	// @ts-nocheck

	import { applyAction, enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { PageContentFade, Loader, LocationSelect } from '$components';
	import { notifications } from '$stores';
	import { ArrowLeft, ArrowRight, Check } from 'lucide-svelte';
	import { fade } from 'svelte/transition';

	$: username = $page.data.user.username;

	let newParcelStep = 0;

	let weight;
	let height;
	let length;
	let width;
	let recipient_email = '';
	let parcel_name = '';
	let ship_from = '';
	let ship_to = '';

	let isLoading = false;
	let selectedShipToLabel = 'Select ship to';
	let selectedShipFromLabel = 'Select ship from';
	let confirmed = false;
	let deliveryPin;

	const hasOneDecimal = (number) => {
		const parts = number.toString().split('.');
		return !parts[1] || parts[1].length === 1;
	};

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
				(notification) => notification.message === "You can't send parcel to the same location"
			)
		) {
			notifications.warning("You can't send parcel to the same location");
			return;
		}

		stepForward();
	};

	const step3Check = () => {
		if (
			(!weight || !height || !length || !width) &&
			!$notifications.some((notification) => notification.message === 'Some dimentions are missing')
		) {
			notifications.warning('Some dimentions are missing');
			return;
		}

		if (
			(!hasOneDecimal(weight) ||
				!hasOneDecimal(height) ||
				!hasOneDecimal(length) ||
				!hasOneDecimal(width)) &&
			!$notifications.some((notification) => notification.message === 'One decimal point maximum')
		) {
			notifications.warning('One decimal point maximum');
			return;
		}
		stepForward();
	};

	const selectShipFrom = (/** @type {{ detail: object; }} */ event) => {
		ship_from = event.detail.value;
		selectedShipFromLabel = event.detail.label;
	};

	const selectShipTo = (/** @type {{ detail: object; }} */ event) => {
		ship_to = event.detail.value;
		selectedShipToLabel = event.detail.label;
	};

	const stepForward = () => {
		newParcelStep++;
	};

	const stepBackward = () => {
		newParcelStep--;
	};

	$: step1BtnDisabled = recipient_email.length === 0 ? true : false;
	$: step2BtnDisabled = ship_from.length === 0 || ship_to.length === 0 ? true : false;
	$: step3BtnDisabled = !weight || !height || !length || !width ? true : false;
	$: step4BtnDisabled = !confirmed;

	const navigateToStep1 = () => {
		if (newParcelStep !== 5) newParcelStep = 0;
	};

	const navigateToStep2 = () => {
		if (!step1BtnDisabled && newParcelStep !== 5) newParcelStep = 1;
	};

	const navigateToStep3 = () => {
		if (!step2BtnDisabled && newParcelStep !== 5) newParcelStep = 2;
	};

	const navigateToStep4 = () => {
		if (!step3BtnDisabled && newParcelStep !== 5) newParcelStep = 3;
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
				<div class="circle circle-1" on:click={navigateToStep1}>
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
				<div class="circle circle-4" on:click={navigateToStep4}>
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

		{#if newParcelStep === 0}
			<div class="user-inputs">
				<!-- Parcel name and recipient email step -->
				<div
					class="input-box parcel-name-input"
					in:fade={{ duration: 350, delay: 350 }}
					out:fade={{ duration: 350 }}
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
				<div class="input-box" in:fade={{ duration: 350, delay: 350 }} out:fade={{ duration: 350 }}>
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
						in:fade={{ duration: 350, delay: 350 }}
						out:fade={{ duration: 350 }}
						disabled={step1BtnDisabled}>Continue</button
					>
				</form>
			</div>
		{:else if newParcelStep === 1}
			<!-- Locations step -->
			<div class="user-inputs">
				<div class="location-1">
					<LocationSelect
						on:selectLocation={selectShipFrom}
						selectedLocationLabel={selectedShipFromLabel}
					/>
				</div>
				<LocationSelect
					on:selectLocation={selectShipTo}
					selectedLocationLabel={selectedShipToLabel}
				/>

				<form
					class="move-btns submit-form"
					in:fade={{ delay: 350, duration: 350 }}
					out:fade={{ duration: 350 }}
				>
					<button type="button" class="btn-back" on:click={stepBackward}
						><ArrowLeft></ArrowLeft></button
					>
					<button type="button" class="submit-btn" on:click={step2Check} disabled={step2BtnDisabled}
						>Continue</button
					>
				</form>
			</div>
		{:else if newParcelStep === 2}
			<div class="user-inputs">
				<div
					class="input-box kg"
					in:fade={{ duration: 350, delay: 350 }}
					out:fade={{ duration: 350 }}
				>
					<div class="inner-box">
						<div class="absolute">
							<input
								class="text-input"
								type="number"
								name="weight"
								bind:value={weight}
								placeholder="Weight"
							/>
						</div>
					</div>
				</div>
				<div
					class="input-box m"
					in:fade={{ duration: 350, delay: 350 }}
					out:fade={{ duration: 350 }}
				>
					<div class="inner-box">
						<div class="absolute">
							<input
								class="text-input"
								type="number"
								name="height"
								bind:value={height}
								placeholder="Height"
							/>
						</div>
					</div>
				</div>
				<div
					class="input-box m"
					in:fade={{ duration: 350, delay: 350 }}
					out:fade={{ duration: 350 }}
				>
					<div class="inner-box">
						<div class="absolute">
							<input
								class="text-input"
								type="number"
								name="length"
								bind:value={length}
								placeholder="Length"
							/>
						</div>
					</div>
				</div>
				<div
					class="input-box m"
					in:fade={{ duration: 350, delay: 350 }}
					out:fade={{ duration: 350 }}
				>
					<div class="inner-box">
						<div class="absolute">
							<input
								class="text-input"
								type="number"
								name="width"
								bind:value={width}
								placeholder="Width"
							/>
						</div>
					</div>
				</div>
				<form
					class="move-btns submit-form"
					in:fade={{ delay: 350, duration: 350 }}
					out:fade={{ duration: 350 }}
				>
					<button type="button" class="btn-back" on:click={stepBackward}
						><ArrowLeft></ArrowLeft></button
					>
					<button type="button" class="submit-btn" disabled={step3BtnDisabled} on:click={step3Check}
						>Continue</button
					>
				</form>
			</div>
		{:else if newParcelStep === 3}
			<!-- Confirmation -->
			<div
				class="new-parcel-info"
				in:fade={{ duration: 350, delay: 350 }}
				out:fade={{ duration: 350 }}
			>
				<div class="new-parcel-left">
					<div class="labels">
						<p>Name:</p>
						<p>Sender:</p>
						<p>Recipient:</p>
						<p>From:</p>
						<p>To:</p>
					</div>
					<div class="new-parcel-content">
						<p class="new-parcel-field">{parcel_name ? parcel_name : 'Parcel'}</p>
						<p class="new-parcel-field">{username}</p>
						<p class="new-parcel-field">{recipient_email}</p>
						<p>{selectedShipFromLabel}</p>
						<p>{selectedShipToLabel}</p>
					</div>
				</div>
				<div class="new-parcel-right">
					<div class="labels">
						<div>Weight:</div>
						<div>Height:</div>
						<div>Length:</div>
						<div>Width:</div>
					</div>
					<div class="new-parcel-content">
						<p>{weight} kg</p>
						<p>{height} m</p>
						<p>{length} m</p>
						<p>{width} m</p>
					</div>
				</div>
			</div>
			<div class="user-inputs confimation-checkbox">
				<label class="confirmation-box"
					>Confirm that all parcel details are accurate
					<input type="checkbox" bind:checked={confirmed} />
					<span class="checkmark"></span>
				</label>
			</div>
			<div class="user-inputs">
				<form
					class="move-btns submit-form"
					action="?/postNewParcel"
					method="post"
					use:enhance={() => {
						isLoading = true;
						return async ({ result }) => {
							if (result.type === 'failure') {
								notifications.warning(result.data.message);
							} else {
								deliveryPin = result.data.data.delivery_pin;
								newParcelStep = 5;
							}
							await applyAction(result);
							isLoading = false;
						};
					}}
					in:fade={{ delay: 350, duration: 350 }}
					out:fade={{ duration: 350 }}
				>
					<input type="text" name="ship_from" bind:value={ship_from} style:display="none" />
					<input type="text" name="ship_to" bind:value={ship_to} style:display="none" />
					<input type="text" name="parcel_name" bind:value={parcel_name} style:display="none" />
					<input type="text" name="weight" bind:value={weight} style:display="none" />
					<input type="text" name="height" bind:value={height} style:display="none" />
					<input type="text" name="length" bind:value={length} style:display="none" />
					<input type="text" name="width" bind:value={width} style:display="none" />
					<input
						type="text"
						name="recipient_email"
						bind:value={recipient_email}
						style:display="none"
					/>
					<button type="button" class="btn-back" on:click={stepBackward}
						><ArrowLeft></ArrowLeft></button
					>
					<button type="submit" class="submit-btn" disabled={step4BtnDisabled}>Create</button>
				</form>
			</div>
		{:else if newParcelStep === 5}
			<!-- Created -->
			<div class="flex-box">
				<div
					class="new-parcel-created"
					in:fade={{ delay: 350, duration: 350 }}
					out:fade={{ duration: 350 }}
				>
					<h2>Your parcel was successfully created!</h2>
					<p>Delivery pin:</p>
					<p class="pin">{deliveryPin}</p>
					<p class="message">You also get an email with this pin and further instructions</p>
					<a href="/"><span>Go home</span><ArrowRight size={12} /></a>
				</div>
			</div>
		{/if}
	</div>
</PageContentFade>

<style lang="scss">
	.new-parcel-info {
		overflow: hidden;
		font-size: 1.8rem;
		background-color: var(--s-bg-color);
		border: 2px solid var(--border);
		border-radius: 20px;
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		padding: 3.2rem;
		box-shadow: 0 4px 12px 2px rgba(0, 0, 0, 0.25);
		gap: 3.6rem;
	}

	.new-parcel-left,
	.new-parcel-right {
		display: flex;
		gap: 3.6rem;

		.labels,
		.new-parcel-content {
			display: flex;
			flex-direction: column;
			gap: 3.6rem;
		}

		.new-parcel-content {
			color: var(--accent-color);
		}
	}

	.new-parcel-field {
		white-space: nowrap;
		overflow: hidden;
		width: 20rem;
		text-overflow: ellipsis;
	}

	.user-inputs.confimation-checkbox {
		margin-bottom: 2rem;
	}
	.confirmation-box {
		display: block;
		position: relative;
		padding-left: 3.2rem;
		cursor: pointer;
		font-size: 1.2rem;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}

	.confirmation-box input {
		position: absolute;
		opacity: 0;
		cursor: pointer;
		height: 0;
		width: 0;
	}

	.checkmark {
		position: absolute;
		top: 50%;
		left: 0;
		transform: translateY(-50%);
		height: 1.8rem;
		width: 1.8rem;
		border-radius: 4px;
		background-color: var(--text-color);
		transition: all 0.3s;
	}

	.confirmation-box:hover input ~ .checkmark {
		background-color: var(--action-btn);
	}

	.confirmation-box input:checked ~ .checkmark {
		background-color: var(--action-btn);
	}

	.checkmark:after {
		content: '';
		position: absolute;
		display: none;
	}

	.confirmation-box input:checked ~ .checkmark:after {
		display: block;
	}

	.confirmation-box .checkmark:after {
		left: 0.6rem;
		top: 0.2rem;
		width: 0.4rem;
		height: 1rem;
		border: solid #000;
		border-width: 0 2px 2px 0;
		-webkit-transform: rotate(45deg);
		-ms-transform: rotate(45deg);
		transform: rotate(45deg);
	}
	.parcel-name-input {
		&::after {
			content: 'Optional';
			position: absolute;
			top: 50%;
			right: -4.8rem;
			transform: translateY(-50%);
		}
	}

	.kg {
		&::after {
			content: 'kg';
			position: absolute;
			top: 50%;
			right: -2.4rem;
			transform: translateY(-50%);
		}
	}
	.m {
		&::after {
			content: 'm';
			position: absolute;
			top: 50%;
			right: -2.4rem;
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

	.flex-box {
		display: flex;
		justify-content: center;
	}
	.new-parcel-created {
		background-color: var(--s-bg-color);
		border-radius: 20px;
		border: 2px solid var(--border);
		padding: 3.2rem;
		text-align: center;

		h2 {
			font-size: 2.4rem;
			font-weight: 300;
			color: var(--accent-color);
			margin-bottom: 2.4rem;
		}
		p {
			font-size: 1.8rem;
			margin-bottom: 1.2rem;

			&.pin {
				font-size: 2.4rem;
				color: var(--accent-color);
				margin-bottom: 3.2rem;
			}

			&.message {
				font-size: 1.4rem;
			}
		}

		a {
			display: inline-flex;
			align-items: center;
			gap: 0.4rem;
			&:link,
			&:visited {
				font-size: 1.4rem;
				text-decoration: none;
				transition: all 0.3s;
				color: var(--text-color);
			}

			&:hover,
			&:active {
				color: var(--accent-color);
			}
		}
	}

	@media only screen and (max-width: 48em) {
		.new-parcel-info {
			grid-template-columns: 1fr;
		}

		.new-parcel-right {
			gap: 5.5rem;
		}
	}

	@media only screen and (max-width: 30em) {
		.new-parcel-field {
			width: 12rem;
		}

		.new-parcel-map {
			padding: 0 1.2rem;
			margin-bottom: 3.6rem;
			.step {
				.circle {
					&::after {
						font-size: 1rem;
					}
				}
			}
		}

		.new-parcel-created {
			h2 {
				font-size: 2rem;
			}
			p {
				&.pin {
					font-size: 2rem;
				}
			}
		}
	}
</style>
