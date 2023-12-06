<script>
	import { enhance, applyAction } from '$app/forms';
	import { Eye, EyeOff, ChevronDown, ArrowLeft } from 'lucide-svelte';
	import { tick } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { notifications } from '$stores';
	import { Loader, LocationSelect } from '$components';

	let password = '';
	let user_email = '';
	let password_confirm = '';
	let username = '';
	let showPassword = false;
	let isLoading = false;
	let passwordValid = false;
	const regex = /^[A-Za-z0-9$£€?!@#&%-+<>]+$/;
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
	/**
	 * @type {string | null}
	 */
	let location = null;
	let selectedLocationLabel = 'Select your location';
	let confirmValid = false;
	let signUpStep = 0;

	$: user_email = user_email.trim();
	$: password = password.trim();
	$: password_confirm = password_confirm.trim();

	const checkConfirmFieldFocus = (
		/** @type {Event & { currentTarget: EventTarget & HTMLInputElement; }} */ e
	) => {
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
		if (
			user_email.length === 0 &&
			!$notifications.some((notification) => notification.message === 'Email is required')
		) {
			notifications.warning('Email is required');
		}
	};

	const selectLocation = (/** @type {{ detail: object; }} */ event) => {
		location = event.detail.value;
		selectedLocationLabel = event.detail.label;
	};

	const stepForward = () => {
		signUpStep++;
	};

	const stepBackward = () => {
		signUpStep--;
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

<div class="signup" in:fade={{ delay: 350, duration: 350 }} out:fade={{ duration: 350 }}>
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
			<div class="input-box" in:fade={{ duration: 350, delay: 350 }} out:fade={{ duration: 350 }}>
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
			<div class="input-box" in:fade={{ duration: 350, delay: 350 }} out:fade={{ duration: 350 }}>
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
				class="submit-form"
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
				<input type="text" name="user_email" style:display="none" bind:value={user_email} />
				<input type="text" name="username" style:display="none" bind:value={username} />
				<button
					type="submit"
					class="submit-btn"
					disabled={step1BtnDisabled}
					in:fade={{ duration: 350, delay: 350 }}
					out:fade={{ duration: 350 }}>Continue</button
				>
			</form>
			<div
				class="message-auth"
				in:fade={{ delay: 350, duration: 350 }}
				out:fade={{ duration: 350 }}
			>
				<p>Already have an account? <a href="/auth/login">Log in</a></p>
			</div>
		{:else if signUpStep === 1}
			<div class="input-box" in:fade={{ duration: 350, delay: 350 }} out:fade={{ duration: 350 }}>
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
			<div class="input-box" in:fade={{ delay: 350, duration: 350 }} out:fade={{ duration: 350 }}>
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
			<div
				class="message-auth"
				in:fade={{ delay: 350, duration: 350 }}
				out:fade={{ duration: 350 }}
			>
				<p>Already have an account? <a href="/auth/login">Log in</a></p>
			</div>
		{:else if signUpStep === 2}
			<LocationSelect on:selectLocation={selectLocation} {selectedLocationLabel} />
			<form
				class="move-btns submit-form"
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
				in:fade={{ delay: 350, duration: 350 }}
				out:fade={{ duration: 350 }}
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
				class="message-auth"
				in:fade={{ delay: 350, duration: 350 }}
				out:fade={{ duration: 350 }}
			>
				<p>Already have an account? <a href="/auth/login">Log in</a></p>
			</div>
		{/if}
	</div>
</div>
