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
	{#if $page.url.pathname === '/auth/login' || $page.url.pathname === '/auth/signup'}
		<style>
			.page-content {
				min-height: auto !important;
			}
		</style>
	{/if}
	<meta
		name="description"
		content={$page.data.description
			? $page.data.description
			: 'Track your parcels without any problems.'}
	/>
	<title>{$page.data.title ? `${$page.data.title} - PostmanExpress` : 'PostmanExpress'}</title>
</svelte:head>

<Notifications />

<!-- {#if user} -->
{#if $page.url.pathname !== '/auth/login' && $page.url.pathname !== '/auth/signup'}
	<div
		class="header"
		bind:this={header}
		style:opacity={headerOpacity}
		style:box-shadow={`0 8px 20px rgba(0, 0, 0, ${headerShadowAlpha})`}
	></div>
	<Header username={user ? user.username : null}></Header>
	{#if isLoading}
		<div class="loader"><Loader></Loader></div>
	{/if}
{/if}
<!-- {/if} -->
<main>
	<div class="page-content">
		<slot />
	</div>
	{#if $page.url.pathname !== '/auth/login' && $page.url.pathname !== '/auth/signup'}
		<Footer></Footer>
	{/if}
</main>

<style lang="scss">
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
		padding: 9.6rem 8rem 3.6rem 8rem;

		.page-content {
			min-height: calc(100vh - 9.6rem - 8.2rem);
			padding: 2rem 3.6rem 0 3.6rem;
			margin-bottom: 8.2rem;
		}
	}

	@media only screen and (max-width: 45em) {
		main {
			padding: 9.6rem 4.8rem 2.4rem 4.8rem;

			.page-content {
				min-height: calc(100vh - 9.6rem - 8.2rem);
				padding: 1.2rem 2rem;
			}
		}
	}

	@media only screen and (max-width: 30em) {
		main {
			padding: 9.6rem 2rem 2.4rem 2rem;

			.page-content {
				min-height: calc(100vh - 9.6rem - 8.2rem);
				padding: 1.2rem 2rem;
			}
		}
	}
</style>
