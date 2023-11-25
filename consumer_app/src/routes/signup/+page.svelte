<script>
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
	/**
	 * @type {HTMLInputElement}
	 */
	let textInput;
	/**
	 * @type {HTMLInputElement}
	 */
	let passInput;
	/**
	 * @type {HTMLInputElement}
	 */
	let textInputConfirm;
	/**
	 * @type {HTMLInputElement}
	 */
	let passInputConfirm;
	let passConfirmFieldLast = false;
	let confirmTouched = false;
	let selectIsOpen = false;
	/**
	 * @type {string | null}
	 */
	let user_location = null;
	let selectedLocationLabel = 'Select an option';
	let locationOptions = [
		{ value: 'helsinki', label: 'Helsinki' },
		{ value: 'oulu', label: 'Oulu' },
		{ value: 'espoo', label: 'Espoo' },
		{ value: 'turku', label: 'Turku' },
		{ value: 'tampere', label: 'Tampere' }
	];
	let confirmValid = false;

	$: user_email = user_email.trim();
	$: password = password.trim();
	$: amntNotifications = $notifications.length;

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
		if (
			!$notifications.some((notification) => notification.message === 'Password is required') &&
			password.length === 0
		) {
			passwordValid = false;
			notifications.warning('Password is required');
			return;
		}

		passwordValid = regex.test(password) ? true : false;

		if (
			!passwordValid &&
			!$notifications.some(
				(notification) => notification.message === 'Passwords contains invalid charachters'
			)
		) {
			notifications.warning('Passwords contains invalid charachters');
		}
	};

	const checkConfirmValid = () => {
		if (
			!$notifications.some(
				(notification) => notification.message === 'Password confirm is required'
			) &&
			password_confirm.length === 0
		) {
			confirmValid = false;
			notifications.warning('Password confirm is required');
			return;
		}

		confirmValid = regex.test(password_confirm) ? true : false;

		if (
			!confirmValid &&
			!$notifications.some(
				(notification) => notification.message === 'Passwords confirm contains invalid charachters'
			)
		) {
			notifications.warning('Passwords confirm contains invalid charachters');
		}
	};

	const checkEmailLength = () => {
		if (user_email.length === 0 && amntNotifications <= 2) {
			notifications.warning('Email is required');
		}
	};

	const selectOption = (/** @type {{ value: string; label: string; }} */ option) => {
		user_location = option.value;
		selectedLocationLabel = option.label;
		selectIsOpen = false;
	};

	/**
	 * @param {HTMLDivElement} node
	 */
	function clickOutside(node) {
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
	}

	const passwordMatchCheck = () => {
		if (
			password !== password_confirm &&
			!$notifications.some((notification) => notification.message === "Passwords don't match") &&
			confirmTouched
		)
			notifications.warning("Passwords don't match");
	};

	$: submitDisabled =
		!passwordValid ||
		!confirmValid ||
		user_email.length === 0 ||
		!user_location ||
		user_name.length === 0
			? true
			: false;
</script>

<div class="logo" in:fade={{ delay: 450, duration: 350 }} out:fade={{ duration: 350 }}>
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
				notifications.success('Success', 'You successfully signed up');
			}
			await applyAction(result);
			isLoading = false;
		};
	}}
>
	<div
		class="input-box"
		in:fade={{ delay: 475, duration: 350 }}
		out:fade={{ duration: 350, delay: 25 }}
	>
		<div class="inner-box">
			<div class="absolute">
				<input
					class="text-input"
					name="user_name"
					type="text"
					placeholder="Full name"
					bind:value={user_name}
					on:input={(e) => {
						if (
							user_name.length === 0 &&
							!$notifications.some((notification) => notification.message === 'Name is required')
						) {
							notifications.warning('Name is required');
						}
						checkConfirmFieldFocus(e);
					}}
				/>
			</div>
		</div>
	</div>
	<div
		class="input-box"
		in:fade={{ delay: 500, duration: 350 }}
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
		in:fade={{ delay: 525, duration: 350 }}
		out:fade={{ duration: 350, delay: 75 }}
	>
		<div class="inner-box overflow-hidden">
			{#if showPassword}
				<div class="absolute" in:fly={{ y: -40, duration: 400 }} out:fly={{ y: 40, duration: 400 }}>
					<input
						name="password"
						type="text"
						placeholder="Password"
						bind:value={password}
						bind:this={textInput}
						on:input={(e) => {
							checkPwdValid();
							checkConfirmFieldFocus(e);
						}}
						on:blur={passwordMatchCheck}
					/>
					<button class="icon" type="button" on:click={switchPwdVisibility}>
						<EyeOff size={19}></EyeOff>
					</button>
				</div>
			{:else}
				<div class="absolute" in:fly={{ y: -40, duration: 400 }} out:fly={{ y: 40, duration: 400 }}>
					<input
						name="password"
						type="password"
						placeholder="Password"
						bind:value={password}
						bind:this={passInput}
						on:input={(e) => {
							checkPwdValid();
							checkConfirmFieldFocus(e);
						}}
						on:blur={passwordMatchCheck}
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
		in:fade={{ delay: 550, duration: 350 }}
		out:fade={{ duration: 350, delay: 100 }}
	>
		<div class="inner-box overflow-hidden">
			{#if showPassword}
				<div class="absolute" in:fly={{ y: -40, duration: 400 }} out:fly={{ y: 40, duration: 400 }}>
					<input
						name="password_confirm"
						type="text"
						placeholder="Password confirm"
						bind:value={password_confirm}
						bind:this={textInputConfirm}
						on:input={(e) => {
							checkConfirmValid();
							checkConfirmFieldFocus(e);
						}}
						on:blur={() => {
							passwordMatchCheck();
							confirmTouched = true;
						}}
					/>
					<button class="icon" type="button" on:click={switchPwdVisibility}>
						<EyeOff size={19}></EyeOff>
					</button>
				</div>
			{:else}
				<div class="absolute" in:fly={{ y: -40, duration: 400 }} out:fly={{ y: 40, duration: 400 }}>
					<input
						name="password_confirm"
						type="password"
						placeholder="Password confirm"
						bind:value={password_confirm}
						bind:this={passInputConfirm}
						on:input={(e) => {
							checkConfirmValid();
							checkConfirmFieldFocus(e);
						}}
						on:blur={() => {
							passwordMatchCheck();
							confirmTouched = true;
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
		use:clickOutside
		in:fade={{ delay: 575, duration: 350 }}
		out:fade={{ duration: 350, delay: 125 }}
	>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div class="inner-box select-box">
			<div class="select-action" on:click={() => (selectIsOpen = !selectIsOpen)}></div>
			<div class="absolute">
				<div class="select">
					<div class="selected-value" class:selected={selectedLocationLabel !== 'Select an option'}>
						{selectedLocationLabel}
					</div>
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
		disabled={submitDisabled}
		in:fade={{ delay: 600, duration: 350 }}
		out:fade={{ duration: 350, delay: 150 }}>Apply</button
	>
</form>

<div
	class="message"
	in:fade={{ delay: 625, duration: 350 }}
	out:fade={{ duration: 350, delay: 175 }}
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
		width: 27rem;
		gap: 2.4rem;

		.input-box {
			height: 4rem;
			width: 100%;
			align-self: center;
			background-color: var(--s-bg-color);
			border: 2px solid var(--border);
			border-radius: 8px;
			transition: transform 0.3s;
			box-shadow: 0 4px 12px 2px rgba(0, 0, 0, 0.25);

			&:focus-within {
				transform: translateY(-0.5rem);
			}

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

				input {
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
				background-color: var(--dis-action-btn);
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
