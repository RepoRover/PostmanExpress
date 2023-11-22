<script>
	import '../styles/main.scss';
	import { Header, Footer } from '$components';

	/**
	 * @type {string}
	 */
	const username = 'Yuriy Gaitrov WOW';
</script>

<Header {username}></Header>
<main>
	<div class="page-content">
		<slot />
	</div>
	<Footer></Footer>
</main>

<style lang="scss">
	main {
		margin: 0 auto;
		max-width: 144rem;
		padding: 13.6rem 3.6rem 0 3.6rem;

		.page-content {
			height: calc(100dvh - 13.6rem - 8.2rem);
		}
	}
</style>
