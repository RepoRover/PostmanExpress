<script>
	import '../styles/main.scss';
	import { Header, Footer } from '$components';
	import { page } from '$app/stores';

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

	const user = data.user;

	$: if (header) {
		headerOpacity = scrollY / header.offsetHeight < 1 ? scrollY / header.offsetHeight : 1;
		headerShadowAlpha =
			scrollY / header.offsetHeight < 1 ? (scrollY / header.offsetHeight) * 0.25 : 0.25;
	}
</script>

<svelte:window bind:scrollY />

<svelte:head>
	<title>{$page.data.title ? `${$page.data.title}` : 'PostmanExpress'}</title>
</svelte:head>

{#if user}
	<div
		class="header"
		bind:this={header}
		style:opacity={headerOpacity}
		style:box-shadow={`0 8px 20px rgba(0, 0, 0, ${headerShadowAlpha})`}
	></div>
	<Header username={user.username}></Header>
{/if}
<main>
	<div class="page-content">
		<slot />
	</div>
	{#if user}
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
	main {
		margin: 0 auto;
		max-width: 144rem;
		padding: 13.6rem 3.6rem 0 3.6rem;

		.page-content {
			height: calc(100dvh - 13.6rem - 8.2rem);
		}
	}
</style>
