<script>
	import { ChevronDown } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition';

	const dispatcher = createEventDispatcher();

	let selectIsOpen = false;
	let location = null;
	export let selectedLocationLabel = 'Select your location';
	let locationOptions = [
		{ value: 'helsinki', label: 'Helsinki' },
		{ value: 'oulu', label: 'Oulu' },
		{ value: 'espoo', label: 'Espoo' },
		{ value: 'turku', label: 'Turku' },
		{ value: 'tampere', label: 'Tampere' }
	];

	const selectOption = (/** @type {{ value: string; label: string; }} */ option) => {
		location = option.value;
		selectedLocationLabel = option.label;
		selectIsOpen = false;

		dispatcher('selectLocation', { value: location, label: selectedLocationLabel });
	};

	/**
	 * @param {HTMLDivElement} node
	 */
	const clickOutside = (node) => {
		const handleClick = (/** @type {{ target: Node; defaultPrevented: any; }} */ event) => {
			if (node && !node.contains(event.target) && !event.defaultPrevented) {
				selectIsOpen = false;
			}
		};

		// @ts-ignore
		window.addEventListener('click', handleClick);

		return {
			destroy() {
				// @ts-ignore
				window.removeEventListener('click', handleClick);
			}
		};
	};
</script>

<div
	class="input-box"
	use:clickOutside
	in:fade={{ delay: 350, duration: 350 }}
	out:fade={{ duration: 350 }}
>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="inner-box select-box">
		<div class="select-action" on:click={() => (selectIsOpen = !selectIsOpen)}></div>
		<div class="absolute">
			<div class="select">
				<div
					class="selected-value"
					class:selected={locationOptions.some(
						(location) => location.label === selectedLocationLabel
					)}
				>
					{selectedLocationLabel}
				</div>
				{#if selectIsOpen}
					<div class="options-container" transition:fade={{ duration: 200 }}>
						{#each locationOptions as locationItem (locationItem.value)}
							<div
								class="option"
								class:active={location === locationItem.value}
								on:click={() => selectOption(locationItem)}
							>
								<p>
									{locationItem.label}
								</p>
							</div>
						{/each}
					</div>
				{/if}
			</div>
			<button class="icon" class:opened={selectIsOpen} type="button">
				<ChevronDown size={19}></ChevronDown>
			</button>
		</div>
	</div>
</div>

<style lang="scss">
	// Select element
	.select-action {
		width: 100%;
		height: 100%;
		z-index: 21;
	}

	.select {
		font-size: 1.8rem;
		position: relative;
		width: 100%;

		.selected-value.selected {
			color: var(--accent-color);
		}

		.options-container {
			position: absolute;
			margin-top: 0.8rem;
			right: -4rem;
			width: 128%;
			background-color: var(--s-bg-color);
			border-radius: 8px;
		}

		.option {
			padding: 0.4rem 0 0.4rem 1.8rem;
			cursor: pointer;
			transition: all 0.3s;
			p {
				transition: all 0.3s;
			}

			&:hover {
				color: var(--accent-color);
				background-color: var(--t-bg-color);

				p {
					transform: translateX(0.5rem);
				}
			}

			&.active {
				color: var(--accent-color);
				background-color: var(--t-bg-color);

				p {
					transform: translateX(0.5rem);
				}
			}

			&:first-child {
				padding-top: 0.8rem;
				border-radius: 8px 8px 0 0;
			}
			&:last-child {
				padding-bottom: 0.8rem;
				border-radius: 0 0 8px 8px;
			}
		}
	}
</style>
