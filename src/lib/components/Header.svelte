<script>
	export let username;
</script>

<header>
	<div class="header">
		<div class="inner-header">
			<div class="logo">
				<p class="text text-logo">PostmanExpress</p>
			</div>
			<div class="menu">
				<p class="text">Menu</p>
			</div>
		</div>
	</div>
</header>

<style lang="scss">
	.header {
		position: fixed;
		width: 100%;
		box-shadow: 0 8px 20px rgba($color: #000000, $alpha: 0.25);

		.inner-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 0 3.6rem;
			height: 7.2rem;
			background-color: var(--s-bg-color);
			z-index: 10; /* Ensure it stays above other content */

			.text {
				font-size: 2.4rem;
			}

			.text-logo {
				color: var(--accent-color);
			}
		}
	}
</style>
