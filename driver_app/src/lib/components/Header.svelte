<script>
	import { page } from '$app/stores';
	import { Overlay, SideBar } from '$components';
	import { tick } from 'svelte';
	import { fade } from 'svelte/transition';

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
</script>

<header in:fade={{ duration: 350, delay: 350 }} out:fade={{ duration: 350 }}>
	<div class="header">
		<div class="inner-header">
			<div class="logo">
				<a class="text text-logo" href="/">PostmanExpress</a>
			</div>
			<div class="menu">
				{#if $page.data.user}
					<button on:click={openMenu} class="text menu-btn">Menu</button>
				{:else}
					<a href="/login" class="text menu-btn">Login</a>
				{/if}
			</div>
		</div>
	</div>
</header>

{#if isMenuOpen && username !== null}
	<SideBar {username} {isMenuOpen} on:closeMenu={closeMenu}></SideBar>
	<Overlay on:closeMenu={closeMenu} overlayLocation="menu"></Overlay>
{/if}

<style lang="scss">
	.header {
		position: fixed;
		width: 100%;
		z-index: 22;

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
