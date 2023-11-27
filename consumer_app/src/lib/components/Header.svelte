<script>
	import { SideBar } from '$components';
	import { onMount, tick } from 'svelte';

	/**
	 * @type {string}
	 */
	export let username;
	let isMenuOpen = false;

	const openMenu = async () => {
		await tick();
		isMenuOpen = true;
	};

	const closeMenu = async () => {
		await tick();
		isMenuOpen = false;
	};

	const handleKeyDown = (/** @type {{ preventDefault: () => void; key: string; }} */ event) => {
		if (event.key === 'm') {
			event.preventDefault();
			if (isMenuOpen) {
				closeMenu();
			} else {
				openMenu();
			}
		}
	};

	onMount(() => {
		window.addEventListener('keydown', handleKeyDown);
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	});
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

		.inner-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 0 3.6rem;
			height: 7.2rem;

			.text {
				font-size: 2.4rem;
				text-decoration: none;

				&-logo {
					color: var(--accent-color);
					position: relative;

					&::after {
						content: 'SvelteKit';
						font-size: 1rem;
						position: absolute;
						right: -5rem;
						cursor: default;
					}
				}
			}

			.menu-btn {
				padding-inline: 0;
				padding-block: 0;
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
		}
	}

	@media only screen and (max-width: 30em) {
		.header {
			.inner-header {
				padding: 0 2.4rem;
				height: 6.4rem;
			}
		}
	}
</style>
