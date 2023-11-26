<script>
	import '../styles/main.scss';
	import { Header, Footer } from '$components';
	import { page } from '$app/stores';
	import { Notifications } from '$components';
	import { notifications } from '$stores';
	import { Loader } from '$components';
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import { fade } from 'svelte/transition';
	export let data;

	/**
	 * @type {string}
	 */

	/**
	 * @type {number}
	 */
	let scrollY;
	/**
	 * @type {HTMLElement}
	 */
	let header;
	let headerOpacity = 0;
	let headerShadowAlpha = 0;
	let isLoading = false;

	// @ts-ignore
	$: user = data.user;
	$: userNotifications = user ? user.notifications : [];

	$: if (userNotifications) {
		if (userNotifications.length > 0) {
			userNotifications.forEach(
				(
					/** @type {{ title: string; parcel_name: string; parcel_status: string; parcel_id: string; }} */ notification
				) => {
					notifications.info(
						notification.title,
						notification.parcel_name,
						10000,
						notification.parcel_status,
						notification.parcel_id
					);
				}
			);
		}
	}

	$: if (header) {
		headerOpacity = scrollY / header.offsetHeight < 1 ? scrollY / header.offsetHeight : 1;
		headerShadowAlpha =
			scrollY / header.offsetHeight < 1 ? (scrollY / header.offsetHeight) * 0.25 : 0.25;
	}

	beforeNavigate(() => {
		isLoading = true;
	});
	afterNavigate(() => {
		isLoading = false;
	});
</script>

<svelte:window bind:scrollY />

<svelte:head>
	<title>{$page.data.title ? `${$page.data.title}` : 'PostmanExpress'}</title>
</svelte:head>

<Notifications />

{#if user}
	<div
		class="header"
		bind:this={header}
		style:opacity={headerOpacity}
		style:box-shadow={`0 8px 20px rgba(0, 0, 0, ${headerShadowAlpha})`}
	></div>
	<Header username={user.username}></Header>
	{#if isLoading}
		<div class="loader"><Loader></Loader></div>
	{/if}
{/if}
<main>
	{#if $page.url.pathname === '/login' || $page.url.pathname === '/signup'}
		<div class="logo" in:fade={{ duration: 400 }} out:fade={{ duration: 350 }}>
			<h1>PostmanExpress</h1>
		</div>
	{/if}
	<div class="page-content">
		<slot />
	</div>
	{#if user}
		<Footer></Footer>
	{/if}
</main>

<style lang="scss">
	.logo {
		display: flex;
		flex-direction: column;
		align-items: center;
		color: var(--accent-color);
		h1 {
			font-weight: 300;
			margin-bottom: 3.2rem;
		}
	}
	.header {
		height: 7.2rem;
		z-index: 5;
		position: fixed;
		width: 100%;
		background-color: var(--s-bg-color);
		opacity: 0;
	}

	.loader {
		position: fixed;
		z-index: 10;
		bottom: 4rem;
		left: 4rem;
	}
	main {
		margin: 0 auto;
		max-width: 144rem;
		padding: 13.6rem 3.6rem 0 3.6rem;

		.page-content {
			height: calc(100dvh - 13.6rem - 8.2rem);
		}
	}
</style>
