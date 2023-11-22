<script>
	import '../styles/main.scss';
	import { Header, Footer } from '$components';
	import { page } from '$app/stores';

	/**
	 * @type {string}
	 */
	const username = 'Yuriy Gaitrov WOW';

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

	$: if (header) {
		headerOpacity = scrollY / header.offsetHeight < 1 ? scrollY / header.offsetHeight : 1;
	}

	$: if (header) {
		console.log(headerShadowAlpha);
		headerShadowAlpha =
			scrollY / header.offsetHeight < 1 ? (scrollY / header.offsetHeight) * 0.25 : 0.25;
	}

	// $: if (header) {
	// 	headerOpacity = scrollY / header.offsetHeight < 1 ? scrollY / header.offsetHeight : 1;
	// }
</script>

<svelte:window bind:scrollY />

<svelte:head>
	<title>{$page.data.title ? `${$page.data.title}` : 'PostmanExpress'}</title>
</svelte:head>

<div
	class="header"
	bind:this={header}
	style:opacity={headerOpacity}
	style:box-shadow={`0 8px 20px rgba(0, 0, 0, ${headerShadowAlpha})`}
></div>
<Header {username}></Header>
<main>
	<div class="page-content">
		<slot />
	</div>
	<Footer></Footer>
</main>

<style lang="scss">
	.header {
		height: 7.2rem;
		z-index: 5;
		position: fixed;
		width: 100%;
		background-color: var(--s-bg-color);
		// box-shadow: 0 8px 20px rgba($color: #000000, $alpha: 0.25);
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
