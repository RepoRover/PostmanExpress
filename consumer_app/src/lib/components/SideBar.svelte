<script>
	import { afterNavigate, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import { notifications } from '$stores';
	import { X } from 'lucide-svelte';
	import { tick, createEventDispatcher } from 'svelte';
	import { fly } from 'svelte/transition';
	import { Overlay, DeleteAccModal } from '$components';

	const dispatcher = createEventDispatcher();
	/**
	 * @type {string}
	 */
	export let username;

	/**
	 * @type {boolean}
	 */
	export let isMenuOpen;

	const navigation = [
		{
			name: 'My Parcels',
			path: '/'
		},
		{
			name: 'New Parcel',
			path: '/parcels/new'
		},
		{
			name: 'Parcel History',
			path: '/parcels/history'
		}
	];

	const closeMenu = async () => {
		await tick();
		dispatcher('closeMenu');
	};

	const openDeleteAccModal = async () => {
		await tick();
		dispatcher('openAccDeleteModal');
	};

	afterNavigate(async () => {
		await closeMenu();
	});
</script>

<svelte:head>
	<style>
		body {
			overflow: hidden;
		}
	</style>
</svelte:head>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- <div class="overlay" on:click={closeMenu} transition:fade={{ duration: 350 }}></div> -->

<!-- <Overlay on:closeMenu={closeMenu} overlayLocation="menu"></Overlay> -->

<nav transition:fly={{ x: 196, duration: 350 }} class:opened={isMenuOpen}>
	<div class="inner-nav">
		<div class="top">
			<p class="username">{username}</p>
			<button class="x-icon" on:click={closeMenu}>
				<X size={24}></X>
			</button>
		</div>
		<div class="line"></div>
		<div class="mid">
			{#each navigation as item}
				<a class:active={item.path === $page.url.pathname} href={item.path}>{item.name}</a>
			{/each}
		</div>
		<div class="line"></div>
		<div class="bottom">
			<form
				method="POST"
				action="/api/auth/logout"
				on:submit|preventDefault={async () => {
					const response = await fetch('/api/auth/logout', {
						method: 'POST',
						headers: {
							accept: 'application/json'
						}
					});
					if (response.ok) {
						closeMenu();
						await invalidateAll();
						notifications.success('Success', 'You successfully logged out');
					}
				}}
			>
				<button class="error">Log out</button>
			</form>
			<button
				class="error"
				on:click={async () => {
					await closeMenu();
					openDeleteAccModal();
				}}>Delete account</button
			>
		</div>
	</div>
</nav>

<style lang="scss">
	nav {
		position: fixed;
		z-index: 300;
		background-color: var(--s-bg-color);
		height: 100dvh;
		width: 19.6rem;
		right: 0;
		top: 0;
		box-shadow: -8px 0 20px rgba($color: #000000, $alpha: 0.25);
		display: none;

		&.opened {
			display: block;
		}

		.line {
			height: 1px;
			background-color: var(--section-sep);
			width: 100%;
			border-radius: 10px;
		}

		.inner-nav {
			display: flex;
			flex-direction: column;
			padding: 0 0.8rem;

			.top {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 2.4rem 1.2rem;

				.username {
					font-size: 1.8rem;
					margin: 0;
					line-height: 1;
					color: var(--accent-color);
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					max-width: calc(100% - 40px);
				}

				.x-icon {
					display: flex;
					align-items: center;
					justify-content: center;
					background-color: transparent;
					border: none;
					color: var(--text-color);
					cursor: pointer;
					transition: all 0.3s;
					padding-block: 0;
					padding-inline: 0;

					&:hover {
						color: var(--accent-color);
						transform: scale(1.1);
					}
				}
			}

			.mid {
				display: flex;
				flex-direction: column;
				gap: 2.4rem;
				padding: 2.4rem 1.2rem;

				a {
					&:link,
					&:visited {
						text-decoration: none;
						color: var(--text-color);
						font-size: 1.8rem;
						transition: all 0.3s;
					}

					&:hover {
						color: var(--accent-color);
						transform: translateX(0.5rem);
					}

					&.active {
						color: var(--accent-color);
					}
				}
			}

			.bottom {
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				align-items: flex-start;
				min-height: calc(100dvh - 32rem);
				padding: 2.4rem 0.8rem;

				.error {
					background-color: transparent;
					border: none;
					font-size: 1.8rem;
					color: var(--error);
					font-family: inherit;
					transition: all 0.3s;

					&:hover {
						color: var(--s-error);
						cursor: pointer;
						transform: translateX(0.5rem);
					}
				}
			}
		}
	}
</style>
