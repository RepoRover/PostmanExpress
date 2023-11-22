<script>
	import { SideBar } from '$components';

	/**
	 * @type {string}
	 */
	export let username;
	let isMenuOpen = false;

	const openMenu = () => {
		isMenuOpen = true;
	};

	const closeMenu = () => {
		isMenuOpen = false;
	};
</script>

<header>
	<div class="header">
		<div class="inner-header">
			<div class="logo">
				<a class="text text-logo" href="/">PostmanExpress</a>
			</div>
			<div class="menu">
				<button on:click={openMenu} class="text menu-btn">Menu</button>
			</div>
		</div>
	</div>
</header>

{#if isMenuOpen}
	<SideBar {username} {isMenuOpen} on:closeMenu={closeMenu}></SideBar>
{/if}

<style lang="scss">
	.header {
		position: fixed;
		width: 100%;
		z-index: 10;
		// box-shadow: 0 8px 20px rgba($color: #000000, $alpha: 0.25);

		.inner-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 0 3.6rem;
			height: 7.2rem;
			// background-color: var(--s-bg-color);
			// z-index: 10; /* Ensure it stays above other content */

			.text {
				font-size: 2.4rem;
				text-decoration: none;
			}

			.menu-btn {
				background-color: transparent;
				border: none;
				color: var(--text-color);
				font-family: inherit;
				cursor: pointer;
				transition: all 0.3s;

				&:hover {
					color: var(--accent-color);
				}
			}

			.text-logo {
				color: var(--accent-color);
			}
		}
	}
</style>
