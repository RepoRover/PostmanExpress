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
	const regex = /^[A-Za-z0-9$£€?!@#&%-+<>]+$/;

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

	$: submitDisabled = !passwordValid || user_email.length === 0 || isLoading ? true : false;
</script>

<div class="login" in:fade={{ delay: 425, duration: 400 }} out:fade={{ duration: 350 }}>
	<div class="subtitle">
		<!-- <h1>PostmanExpress</h1> -->
		<div class="loader">
			{#if isLoading}
				<Loader></Loader>
			{/if}
		</div>
		<p>Customer Log In</p>
	</div>
	<div class="user-inputs">
		<div class="input-box">
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
		<div class="input-box">
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
							on:input={checkPwdValid}
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
							on:input={checkPwdValid}
						/>
						<button class="icon" type="button" on:click={switchPwdVisibility}>
							<Eye size={19}></Eye>
						</button>
					</div>
				{/if}
			</div>
		</div>
		<form
			method="POST"
			use:enhance={() => {
				isLoading = true;
				return async ({ result }) => {
					if (result.type === 'failure') {
						notifications.error(result.data.message);
					} else if (result.type === 'redirect') {
						notifications.success('Success', 'You successfully logged in', 100000);
					}
					await applyAction(result);
					isLoading = false;
				};
			}}
		>
			<input type="text" name="password" bind:value={password} style:display="none" />
			<input type="text" name="user_email" bind:value={user_email} style:display="none" />
			<button type="submit" class="submit-btn" disabled={submitDisabled}>Apply</button>
		</form>
		<div class="message-auth">
			<p>Don't have an account yet? <a href="/auth/signup">Sign up</a></p>
		</div>
	</div>
</div>
