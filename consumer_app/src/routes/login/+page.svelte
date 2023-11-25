<script>
	import { enhance, applyAction } from '$app/forms';
	import { Eye, EyeOff } from 'lucide-svelte';
	import { tick } from 'svelte';
	import { fly, fade } from 'svelte/transition';
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
				passwordValid = false;
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

<div class="logo" in:fade={{ delay: 525, duration: 400 }} out:fade={{ duration: 350 }}>
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
			} else if (result.type === 'redirect') {
				notifications.success('Success', 'You successfully logged in');
			}
			await applyAction(result);
			isLoading = false;
		};
	}}
>
	<div
		class="input-box"
		in:fade={{ delay: 550, duration: 350 }}
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
					on:input={checkEmailLength}
				/>
			</div>
		</div>
	</div>
	<div
		class="input-box"
		in:fade={{ delay: 575, duration: 350 }}
		out:fade={{ duration: 350, delay: 50 }}
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
						on:input={checkPwdValid}
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
						on:input={checkPwdValid}
					/>
					<button class="icon" type="button" on:click={switchPwdVisibility}>
						<Eye size={19}></Eye>
					</button>
				</div>
			{/if}
		</div>
	</div>
	<button
		type="submit"
		class="submit-btn"
		disabled={submitDisabled}
		in:fade={{ delay: 600, duration: 350 }}
		out:fade={{ duration: 350, delay: 75 }}>Apply</button
	>
</form>
<div
	class="message"
	in:fade={{ delay: 625, duration: 350 }}
	out:fade={{ duration: 350, delay: 100 }}
>
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
			}

			.icon {
				display: flex;
				cursor: pointer;
				background-color: transparent;
				border: none;
				color: var(--accent-color);
				border-radius: 12px;
				outline-offset: 0;
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
				background-color: var(--dis-action-btn);
				transform: none;
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
