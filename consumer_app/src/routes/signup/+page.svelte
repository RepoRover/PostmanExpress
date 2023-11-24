<script>
	// @ts-nocheck

	import { enhance, applyAction } from '$app/forms';
	import { Eye, EyeOff, ChevronDown } from 'lucide-svelte';
	import { tick } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { notifications } from '$stores';
	import { Loader } from '$components';
	let password = '';
	let user_email = '';
	let password_confirm = '';
	let user_name = '';

	let showPassword = false;
	let isLoading = false;
	let passwordValid = false;
	const regex = /^[A-Za-z0-9$£@#&%]+$/;

	$: user_email = user_email.trim();
	$: password = password.trim();
	$: amntNotifications = $notifications.length;

	/**
	 * @type {HTMLInputElement}
	 */
	let textInput;
	/**
	 * @type {HTMLInputElement}
	 */
	let passInput;
	let textInputConfirm;
	let passInputConfirm;
	let passConfirmFieldLast = false;

	const checkConfirmFieldFocus = (e) => {
		passConfirmFieldLast = e.target === textInputConfirm || e.target === passInputConfirm;
	};

	const switchPwdVisibility = () => {
		showPassword = !showPassword;
		tick().then(() => {
			if (passConfirmFieldLast) {
				showPassword ? textInputConfirm.focus() : passInputConfirm.focus();
				return;
			}
			showPassword ? textInput.focus() : passInput.focus();
		});
	};

	const checkPwdValid = () => {
		if (amntNotifications <= 2) {
			if (password.length === 0) {
				notifications.warning('Password is required');
				return;
			}
			passwordValid = regex.test(password) ? true : false;

			if (!passwordValid) {
				notifications.warning('Password contains invalid charachters');
			}
		}
	};

	const checkEmailLength = () => {
		if (user_email.length === 0 && amntNotifications <= 2) {
			notifications.warning('Email is required');
		}
	};

	// $: submitDisabled = !passwordValid || user_email.length === 0 ? true : false;

	let selectIsOpen = false;
	let user_location = null;
	let selectedLocationLabel = 'Select an option';
	let locationOptions = [
		{ value: 'helsinki', label: 'Helsinki' },
		{ value: 'oulu', label: 'Oulu' },
		{ value: 'espoo', label: 'Espoo' },
		{ value: 'turku', label: 'Turku' },
		{ value: 'tampere', label: 'Tampere' }
	];

	const selectOption = (option) => {
		user_location = option.value;
		selectedLocationLabel = option.label;
		selectIsOpen = false;
	};
</script>

<div class="logo" in:fade={{ delay: 550, duration: 350 }} out:fade={{ duration: 350 }}>
	<h1>PostmanExpress</h1>
	<div class="loader">
		{#if isLoading}
			<Loader></Loader>
		{/if}
	</div>
	<p>Customer Sign Up</p>
</div>
<form
	method="POST"
	use:enhance={() => {
		isLoading = true;
		return async ({ result }) => {
			if (result.type === 'failure') {
				notifications.error(result.data.message);
			} else if (result.type === 'redirect') {
				notifications.success('Success', 'You successfully logged in');
			}
			await applyAction(result);
			isLoading = false;
		};
	}}
>
	<div class="input-box" in:fade={{ delay: 600, duration: 350 }} out:fade={{ duration: 350 }}>
		<div class="inner-box">
			<div class="absolute">
				<input
					class="text-input"
					name="user_name"
					type="text"
					placeholder="Full name"
					bind:value={user_name}
					on:input={checkConfirmFieldFocus}
				/>
			</div>
		</div>
	</div>
	<div
		class="input-box"
		in:fade={{ delay: 650, duration: 350 }}
		out:fade={{ duration: 350, delay: 50 }}
	>
		<div class="inner-box">
			<div class="absolute">
				<input
					class="text-input"
					name="user_email"
					type="text"
					placeholder="Email"
					bind:value={user_email}
					on:input={(e) => {
						checkEmailLength();
						checkConfirmFieldFocus(e);
					}}
				/>
			</div>
		</div>
	</div>
	<div
		class="input-box"
		in:fade={{ delay: 700, duration: 350 }}
		out:fade={{ duration: 350, delay: 100 }}
	>
		<div class="inner-box overflow-hidden">
			{#if showPassword}
				<div class="absolute" in:fly={{ y: -40, duration: 400 }} out:fly={{ y: 40, duration: 400 }}>
					<input
						class="pwd-input"
						name="password"
						type="text"
						placeholder="Password"
						bind:value={password}
						bind:this={textInput}
						on:input={(e) => {
							checkPwdValid();
							checkConfirmFieldFocus(e);
						}}
					/>
					<button class="icon" type="button" on:click={switchPwdVisibility}>
						<EyeOff size={19}></EyeOff>
					</button>
				</div>
			{:else}
				<div class="absolute" in:fly={{ y: -40, duration: 400 }} out:fly={{ y: 40, duration: 400 }}>
					<input
						class="pwd-input"
						name="password"
						type="password"
						placeholder="Password"
						bind:value={password}
						bind:this={passInput}
						on:input={(e) => {
							checkPwdValid();
							checkConfirmFieldFocus(e);
						}}
					/>
					<button class="icon" type="button" on:click={switchPwdVisibility}>
						<Eye size={19}></Eye>
					</button>
				</div>
			{/if}
		</div>
	</div>
	<div
		class="input-box"
		in:fade={{ delay: 750, duration: 350 }}
		out:fade={{ duration: 350, delay: 150 }}
	>
		<div class="inner-box overflow-hidden">
			{#if showPassword}
				<div class="absolute" in:fly={{ y: -40, duration: 400 }} out:fly={{ y: 40, duration: 400 }}>
					<input
						class="pwd-input"
						name="password"
						type="text"
						placeholder="Password confirm"
						bind:value={password_confirm}
						bind:this={textInputConfirm}
						on:input={checkConfirmFieldFocus}
					/>
					<button class="icon" type="button" on:click={switchPwdVisibility}>
						<EyeOff size={19}></EyeOff>
					</button>
				</div>
			{:else}
				<div class="absolute" in:fly={{ y: -40, duration: 400 }} out:fly={{ y: 40, duration: 400 }}>
					<input
						class="pwd-input"
						name="password"
						type="password"
						placeholder="Password confirm"
						bind:value={password_confirm}
						bind:this={passInputConfirm}
						on:input={checkConfirmFieldFocus}
					/>
					<button class="icon" type="button" on:click={switchPwdVisibility}>
						<Eye size={19}></Eye>
					</button>
				</div>
			{/if}
		</div>
	</div>
	<div
		class="input-box"
		in:fade={{ delay: 800, duration: 350 }}
		out:fade={{ duration: 350, delay: 200 }}
	>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div class="inner-box select-box">
			<div class="select-action" on:click={() => (selectIsOpen = !selectIsOpen)}></div>
			<div class="absolute">
				<div class="select">
					<div class="selected-value">{selectedLocationLabel}</div>
					{#if selectIsOpen}
						<div class="options-container" transition:fade={{ duration: 200 }}>
							{#each locationOptions as location (location.value)}
								<div
									class="option"
									class:active={user_location === location.value}
									on:click={() => selectOption(location)}
								>
									<p>
										{location.label}
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
	<button
		type="submit"
		class="submit-btn"
		in:fade={{ delay: 850, duration: 350 }}
		out:fade={{ duration: 350, delay: 250 }}>Apply</button
	>
</form>

<div
	class="message"
	in:fade={{ delay: 550, duration: 350 }}
	out:fade={{ duration: 350, delay: 300 }}
>
	<p>Already have an account? <a href="/login">Log in</a></p>
</div>

<style lang="scss">
	.logo {
		display: flex;
		flex-direction: column;
		align-items: center;
		color: var(--accent-color);

		.loader {
			height: 2rem;
			width: 4.5rem;
		}
		h1 {
			font-weight: 300;
			margin-bottom: 3.2rem;
		}

		p {
			margin-top: 1.2rem;
			font-size: 1.8rem;
		}
	}
	form {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin: 2rem auto 3.6rem auto;
		width: 25.6rem;
		gap: 2.4rem;

		.input-box {
			height: 4rem;
			width: 100%;
			align-self: center;
			background-color: var(--s-bg-color);
			border: 2px solid var(--border);
			border-radius: 8px;

			.inner-box {
				width: 100%;
				height: 100%;
				position: relative;
				display: flex;

				&.select-box {
					cursor: pointer;
				}

				&.overflow-hidden {
					overflow: hidden;
				}

				.absolute {
					z-index: 20;
					left: 1.8rem;
					top: 50%;
					position: absolute;
					transform: translateY(-50%);
					width: calc(100% - 1.8rem - 4px - 0.7rem);
					display: flex;
					align-items: center;
					justify-content: space-between;
				}

				.text-input {
					background-color: transparent;
					border: none;
					font-family: inherit;
					outline: none;
					font-size: 1.8rem;
					color: var(--accent-color);
					width: 100%;

					&::placeholder {
						color: var(--text-color);
					}
				}

				.pwd-input {
					background-color: transparent;
					border: none;
					font-family: inherit;
					outline: none;
					font-size: 1.8rem;
					color: var(--accent-color);
					width: 100%;

					&::placeholder {
						color: var(--text-color);
					}
				}

				.icon {
					display: flex;
					cursor: pointer;
					background-color: transparent;
					border: none;
					color: var(--accent-color);
					border-radius: 12px;
					outline-offset: 0;
					transition: all 0.3s;

					&.opened {
						transform: rotate(180deg);
					}
				}
			}

			.select-action {
				width: 100%;
				height: 100%;
				z-index: 21;
			}

			.select {
				font-size: 1.8rem;
				position: relative;
				width: 100%;

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
		}

		.submit-btn {
			z-index: 10;
			background-color: var(--action-btn);
			border: none;
			width: 90%;
			padding: 1rem;
			border-radius: 8px;
			font-size: 1.8rem;
			color: var(--accent-color);
			font-family: inherit;
			transition: all 0.3s;
			cursor: pointer;
			outline-color: var(--s-action-btn);

			&:hover {
				background-color: var(--s-action-btn);
				transform: scale(1.05);
			}

			&:disabled {
				cursor: not-allowed;
				transform: none;
				background-color: var(--action-btn);
			}
		}
	}

	.message {
		display: flex;
		justify-content: center;
		font-size: 1.8rem;
		color: var(--text-color);

		a {
			&:link,
			&:visited {
				color: var(--accent-color);
				text-decoration: none;
			}
		}
	}
</style>
