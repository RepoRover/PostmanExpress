<script>
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import { X } from 'lucide-svelte';
	import { tick, createEventDispatcher } from 'svelte';
	import { fade, fly } from 'svelte/transition';

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
<div class="overlay" on:click={closeMenu} transition:fade={{ duration: 200 }}></div>

<nav in:fly={{ x: 196 }} out:fly={{ x: 196 }} class:opened={isMenuOpen}>
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
		<div class="bottom"></div>
	</div>
</nav>

<style lang="scss">
	.overlay {
		position: fixed;
		z-index: 200;
		height: 100dvh;
		width: 100dvw;
		backdrop-filter: blur(0.3rem);
		overflow: hidden;
		background-color: rgba($color: #000000, $alpha: 0.4);
	}

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
		}
	}
</style>
