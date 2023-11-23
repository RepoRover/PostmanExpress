<script>
	// @ts-nocheck

	import { enhance, applyAction } from '$app/forms';
	import { Eye, EyeOff } from 'lucide-svelte';
	import { tick } from 'svelte';
	import { fly } from 'svelte/transition';
	import { notifications } from '$stores';
	import { Loader } from '$components';
	let password = '';
	let user_email = '';

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

	const switchPwdVisibility = () => {
		showPassword = !showPassword;
		tick().then(() => {
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

	$: submitDisabled = !passwordValid || user_email.length === 0 ? true : false;
</script>

<div class="logo">
	<h1>PostmanExpress</h1>
	<div class="loader">
		{#if isLoading}
			<Loader></Loader>
		{/if}
	</div>
	<p>Customer Log In</p>
</div>
<form
	method="POST"
	use:enhance={() => {
		isLoading = true;
		return async ({ result }) => {
			if (result.type === 'failure') {
				notifications.error(result.data.message);
			}
			await applyAction(result);
			isLoading = false;
		};
	}}
>
	<div class="input-box">
		<input
			name="user_email"
			type="text"
			placeholder="Email"
			bind:value={user_email}
			on:input={checkEmailLength}
		/>
	</div>
	<div class="password-block">
		{#if showPassword}
			<div
				class="input-box pwd-input"
				in:fly={{ y: -40, duration: 400 }}
				out:fly={{ y: 40, duration: 400 }}
			>
				<input
					name="password"
					type="text"
					placeholder="Password"
					bind:value={password}
					bind:this={textInput}
					on:input={checkPwdValid}
				/>
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<button class="icon" type="button" on:click={switchPwdVisibility}>
					<EyeOff></EyeOff>
				</button>
			</div>
		{:else}
			<div
				class="input-box pwd-input"
				in:fly={{ y: -40, duration: 400 }}
				out:fly={{ y: 40, duration: 400 }}
			>
				<input
					name="password"
					type="password"
					placeholder="Password"
					bind:value={password}
					bind:this={passInput}
					on:input={checkPwdValid}
				/>
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<button class="icon" type="button" on:click={switchPwdVisibility}>
					<Eye></Eye>
				</button>
			</div>
		{/if}
	</div>
	<button type="submit" class="submit-btn" disabled={submitDisabled}>Apply</button>
</form>
<div class="message">
	<p>Don't have an account yet? <a href="/signup">Sign up</a></p>
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
		align-items: flex-end;
		margin: 2rem auto 3.6rem auto;
		width: 25.6rem;
		.input-box {
			width: 100%;
			display: flex;
			align-self: center;
			align-items: center;
			justify-content: space-between;
			background-color: var(--s-bg-color);
			border: 2px solid var(--border);
			border-radius: 8px;
			padding: 0.7rem 0.7rem 0.7rem 1.8rem;
			margin-bottom: 2.4rem;

			.icon {
				display: flex;
				cursor: pointer;
				background-color: transparent;
				border: none;
				color: var(--accent-color);
				border-radius: 12px;
				outline-offset: 0;
			}

			input {
				background-color: transparent;
				border: none;
				font-family: inherit;
				outline: none;
				font-size: 1.8rem;
				color: var(--accent-color);

				&::placeholder {
					color: var(--text-color);
				}
			}
		}

		.password-block {
			align-self: center;
			position: relative;
			width: 100%;
			display: flex;
			justify-content: center;
			margin-bottom: 4.2rem;
			margin-top: 3.2rem;

			.pwd-input {
				position: absolute;
				z-index: 20;
			}
		}

		.submit-btn {
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
