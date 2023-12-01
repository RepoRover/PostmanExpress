<script>
	import { applyAction, enhance } from '$app/forms';
	import { PageContentFade } from '$components';
	import { notifications } from '$stores';
	import { Check } from 'lucide-svelte';
	import { fade } from 'svelte/transition';

	let newParcelStep = 0;

	let weight;
	let height;
	let length;
	let width;
	let recipient_email;
	let parcel_name;

	let isLoading = false;

	const stepForward = () => {
		newParcelStep++;
	};

	const stepBackward = () => {
		newParcelStep++;
	};
</script>

<PageContentFade>
	<h2 slot="title">New Parcel</h2>
	<div slot="content">
		<div class="new-parcel-map">
			<div class="step" class:done={newParcelStep > 0} class:active={newParcelStep === 0}>
				<div class="circle circle-1">
					{#if newParcelStep > 0}
						<Check color="#4e4e4e" size={16} />
					{/if}
				</div>
				<div class="line"></div>
			</div>
			<div class="step" class:done={newParcelStep > 1} class:active={newParcelStep === 1}>
				<div class="circle circle-2">
					{#if newParcelStep > 1}
						<Check color="#4e4e4e" size={16} />
					{/if}
				</div>
				<div class="line"></div>
			</div>
			<div class="step" class:done={newParcelStep > 2} class:active={newParcelStep === 2}>
				<div class="circle circle-3">
					{#if newParcelStep > 2}
						<Check color="#4e4e4e" size={16} />
					{/if}
				</div>
				<div class="line"></div>
			</div>
			<div class="step" class:done={newParcelStep > 3} class:active={newParcelStep === 3}>
				<div class="circle circle-4">
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
				<div
					class="input-box"
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
							/>
						</div>
					</div>
				</div>
				<form
					action="?/validateUser"
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
					<input type="text" name="parcel_name" style:display="none" bind:value={parcel_name} />
					<button
						type="submit"
						class="submit-btn"
						in:fade={{ duration: 350, delay: 475 }}
						out:fade={{ duration: 350, delay: 50 }}>Continue</button
					>
				</form>
				<!-- Parcel name and recipient email step -->
			{:else if newParcelStep === 1}
				<!-- Locations step -->
				<div></div>
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
			}
			.circle {
				position: relative;
				height: 2rem;
				width: 2rem;
				border-radius: 100%;
				border: 2px solid var(--dis-action-btn);
				transition: all 0.3s;
				display: flex;
				align-items: center;
				justify-content: center;

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
			}

			&.done {
				.circle {
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
