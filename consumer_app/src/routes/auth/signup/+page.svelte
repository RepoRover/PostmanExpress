<script>
	import { enhance, applyAction } from '$app/forms';
	import { Eye, EyeOff, ChevronDown, ArrowLeft } from 'lucide-svelte';
	import { tick } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { notifications } from '$stores';
	import { Loader } from '$components';

	let password = '';
	let user_email = '';
	let password_confirm = '';
	let username = '';
	let showPassword = false;
	let isLoading = false;
	let passwordValid = false;
	const regex = /^[A-Za-z0-9$£€?!@#&%]+$/;
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
	let selectIsOpen = false;
	/**
	 * @type {string | null}
	 */
	let location = null;
	let selectedLocationLabel = 'Select your location';
	let locationOptions = [
		{ value: 'helsinki', label: 'Helsinki' },
		{ value: 'oulu', label: 'Oulu' },
		{ value: 'espoo', label: 'Espoo' },
		{ value: 'turku', label: 'Turku' },
		{ value: 'tampere', label: 'Tampere' }
	];
	let confirmValid = false;
	let signUpStep = 0;

	$: user_email = user_email.trim();
	$: password = password.trim();
	$: password_confirm = password_confirm.trim();
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
		location = option.value;
		selectedLocationLabel = option.label;
		selectIsOpen = false;
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

	const stepForward = () => {
		signUpStep++;
	};

	const stepBackward = () => {
		signUpStep--;
	};

	const step1Check = () => {
		console.log(username.trim().split(/\s+/).length);

		if (username.split(/\s+/).length < 2) {
			notifications.warning('Full name must contain at least two names');
			return;
		}
	};

	const step2Check = () => {
		if (
			password.length < 8 &&
			!$notifications.some(
				(notification) => notification.message === 'Password must be at least 8 characters long'
			)
		) {
			notifications.warning('Password must be at least 8 characters long');
			return;
		}
		stepForward();
	};

	$: step1BtnDisabled = username.length === 0 || user_email.length === 0 ? true : false;
	$: step2BtnDisabled =
		!passwordValid || !confirmValid || password !== password_confirm ? true : false;

	$: submitDisabled =
		!passwordValid ||
		!confirmValid ||
		user_email.length === 0 ||
		!location ||
		username.length === 0 ||
		isLoading
			? true
			: false;
</script>

<div class="signup" in:fade={{ delay: 375, duration: 350 }} out:fade={{ duration: 350 }}>
	<div class="subtitle">
		<!-- <h1>PostmanExpress</h1> -->
		<div class="loader">
			{#if isLoading}
				<Loader></Loader>
			{/if}
		</div>
		<p>Customer Sign Up</p>
	</div>

	<div class="user-inputs">
		{#if signUpStep === 0}
			<div class="input-box" in:fade={{ duration: 350, delay: 425 }} out:fade={{ duration: 350 }}>
				<div class="inner-box">
					<div class="absolute">
						<input
							class="text-input"
							name="username"
							type="text"
							placeholder="Full name"
							bind:value={username}
							on:input={(e) => {
								if (
									username.length === 0 &&
									!$notifications.some(
										(notification) => notification.message === 'Name is required'
									)
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
				in:fade={{ duration: 350, delay: 450 }}
				out:fade={{ duration: 350, delay: 25 }}
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
			<form
				action="?/validateEmail"
				method="post"
				use:enhance={() => {
					isLoading = true;
					return async ({ result }) => {
						if (result.type === 'failure') {
							notifications.error(result.data.message);
						} else {
							stepForward();
						}
						await applyAction(result);
						isLoading = false;
					};
				}}
			>
				<input type="text" name="user_email" style:display="none" bind:value={user_email} />
				<button
					type="submit"
					class="submit-btn"
					disabled={step1BtnDisabled}
					on:click={step1Check}
					in:fade={{ duration: 350, delay: 475 }}
					out:fade={{ duration: 350, delay: 50 }}>Continue</button
				>
			</form>
			<div
				class="message"
				in:fade={{ delay: 500, duration: 350 }}
				out:fade={{ duration: 350, delay: 75 }}
			>
				<p>Already have an account? <a href="/auth/login">Log in</a></p>
			</div>
		{:else if signUpStep === 1}
			<div class="input-box" in:fade={{ duration: 350, delay: 400 }} out:fade={{ duration: 350 }}>
				<div class="inner-box overflow-hidden">
					{#if showPassword}
						<div
							class="absolute"
							in:fly={{ y: -40, duration: 400 }}
							out:fly={{ y: 40, duration: 400 }}
						>
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
							/>
							<button class="icon" type="button" on:click={switchPwdVisibility}>
								<EyeOff size={19}></EyeOff>
							</button>
						</div>
					{:else}
						<div
							class="absolute"
							in:fly={{ y: -40, duration: 400 }}
							out:fly={{ y: 40, duration: 400 }}
						>
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
				in:fade={{ delay: 425, duration: 350 }}
				out:fade={{ duration: 350, delay: 25 }}
			>
				<div class="inner-box overflow-hidden">
					{#if showPassword}
						<div
							class="absolute"
							in:fly={{ y: -40, duration: 400 }}
							out:fly={{ y: 40, duration: 400 }}
						>
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
							/>
							<button class="icon" type="button" on:click={switchPwdVisibility}>
								<EyeOff size={19}></EyeOff>
							</button>
						</div>
					{:else}
						<div
							class="absolute"
							in:fly={{ y: -40, duration: 400 }}
							out:fly={{ y: 40, duration: 400 }}
						>
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
							/>
							<button class="icon" type="button" on:click={switchPwdVisibility}>
								<Eye size={19}></Eye>
							</button>
						</div>
					{/if}
				</div>
			</div>
			<form
				class="move-btns"
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
			<div
				class="message"
				in:fade={{ delay: 475, duration: 350 }}
				out:fade={{ duration: 350, delay: 75 }}
			>
				<p>Already have an account? <a href="/auth/login">Log in</a></p>
			</div>
		{:else if signUpStep === 2}
			<div
				class="input-box"
				use:clickOutside
				in:fade={{ delay: 425, duration: 350 }}
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
								class:selected={selectedLocationLabel !== 'Select an option'}
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
			<form
				class="move-btns"
				method="post"
				action="?/signup"
				use:enhance={() => {
					isLoading = true;
					return async ({ result }) => {
						if (result.type === 'failure') {
							signUpStep = 0;
							notifications.error(result.data.message);
						} else if (result.type === 'redirect') {
							notifications.success('Success', 'You successfully signed up');
						}
						await applyAction(result);
						isLoading = false;
					};
				}}
				in:fade={{ delay: 450, duration: 350 }}
				out:fade={{ duration: 350, delay: 25 }}
			>
				<input type="text" name="location" bind:value={location} style:display="none" />
				<input type="text" name="username" bind:value={username} style:display="none" />
				<input type="text" name="password" bind:value={password} style:display="none" />
				<input type="text" name="user_email" bind:value={user_email} style:display="none" />
				<button type="button" class="btn-back" on:click={stepBackward}
					><ArrowLeft></ArrowLeft></button
				>
				<button type="submit" class="submit-btn" disabled={submitDisabled}>Apply</button>
			</form>
			<div
				class="message"
				in:fade={{ delay: 475, duration: 350 }}
				out:fade={{ duration: 350, delay: 50 }}
			>
				<p>Already have an account? <a href="/auth/login">Log in</a></p>
			</div>
		{/if}
	</div>
</div>

<style lang="scss">
	.subtitle {
		display: flex;
		flex-direction: column;
		align-items: center;
		color: var(--accent-color);

		.loader {
			height: 2rem;
			width: 4.5rem;
		}

		p {
			margin-top: 1.2rem;
			font-size: 1.8rem;
		}
	}

	.user-inputs {
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

		form {
			width: 90%;

			&.move-btns {
				width: 90%;
				display: grid;
				grid-template-columns: 20fr 80fr;
				column-gap: 2rem;

				.submit-btn {
					width: 100%;
				}

				.btn-back {
					background-color: var(--t-bg-color);
					border: none;
					border-radius: 8px;
					transition: all 0.3s;
					cursor: pointer;
					box-shadow: 0 4px 12px 2px rgba(0, 0, 0, 0.25);
					color: var(--text-color);

					&:hover {
						background-color: var(--s-bg-color);
						transform: scale(1.08);
						color: var(--accent-color);
					}
				}
			}
		}

		.submit-btn {
			z-index: 10;
			background-color: var(--action-btn);
			border: none;
			width: 100%;
			padding: 1rem;
			border-radius: 8px;
			font-size: 1.8rem;
			color: var(--accent-color);
			font-family: inherit;
			transition: all 0.3s;
			cursor: pointer;
			outline-color: var(--s-action-btn);
			box-shadow: 0 4px 12px 2px rgba(0, 0, 0, 0.25);

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
		padding-bottom: 6.4rem;

		a {
			&:link,
			&:visited {
				color: var(--accent-color);
				text-decoration: none;
			}
		}
	}
</style>
