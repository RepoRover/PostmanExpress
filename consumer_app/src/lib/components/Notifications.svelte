<script>
	import { notifications } from '$stores';
	import { fade, fly } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { X } from 'lucide-svelte';
</script>

{#if $notifications.length > 0}
	<div class="notifications">
		{#each $notifications as notification (notification.id)}
			<div
				class="notification {notification.type}"
				transition:fade={{ duration: 300 }}
				animate:flip={{ duration: 700 }}
			>
				<div class="top">
					<p class="title">{notification.title}</p>
					<button
						class="close"
						aria-label="Close notification"
						on:click={() => {
							notifications.remove(notification.id);
						}}
					>
						<X focusable="false" aria-hidden color="var(--text-color)" />
					</button>
				</div>
				<div class="bottom">
					{#if notification.parcel_id}
						<a
							href="/parcels/{notification.parcel_id}"
							class="message"
							on:click={() => {
								notifications.remove(notification.id);
							}}>{notification.message}</a
						>
					{:else}
						<p class="message" class:not-full={notification.status}>{notification.message}</p>
					{/if}
					{#if notification.status}
						<div class="status-box">
							<div class="status-circle {notification.status}"></div>
							<p class="status">
								{notification.status.charAt(0).toUpperCase() + notification.status.slice(1)}
							</p>
						</div>
					{/if}
				</div>
			</div>
		{/each}
	</div>
{/if}

<style lang="scss">
	.notifications {
		position: fixed;
		display: flex;
		flex-direction: column;
		top: 2.8rem;
		left: 3.6rem;
		gap: 2.4rem;
		z-index: 100;

		.notification {
			width: 24.5rem;
			font-size: 1.2rem;
			background-color: var(--s-bg-color);
			border-radius: 12px;
			padding: 1.6rem 4.4rem 1.6rem 2.4rem;
			position: relative;

			&.info {
				border: 2px solid var(--border);
			}
			&.success {
				border: 2px solid var(--action-btn);
			}
			&.warning {
				border: 2px solid var(--en-route);

				.title {
					color: var(--en-route);
				}
			}
			&.error {
				border: 2px solid var(--error);

				.title {
					color: var(--error);
				}
			}

			.top {
				display: flex;
				margin-bottom: 1.6rem;
				color: var(--accent-color);

				.title {
					font-size: 1.4rem;
				}
			}
			.bottom {
				display: flex;
				justify-content: space-between;

				.status-box {
					display: flex;
					gap: 0.4rem;
					align-items: center;

					.status-circle {
						height: 0.9rem;
						width: 0.9rem;
						border-radius: 100%;
						&.delivered {
							background-color: var(--delivered);
						}
					}
				}

				.message {
					&.not-full {
						width: 16rem;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}

					&:link,
					&:visited {
						text-decoration: none;
						color: var(--text-color);
					}
				}
			}

			.close {
				position: absolute;
				top: 1rem;
				right: 1rem;
				background-color: transparent;
				border: none;
				cursor: pointer;
				transition: all 0.3s;

				&:hover {
					color: var(--accent-color);
					transform: scale(1.1);
				}
			}
		}
	}

	@media only screen and (max-width: 45em) {
		.notifications {
			.notification {
				width: 20rem;

				.bottom {
					.message {
						&.not-full {
							width: 16rem;
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
						}
					}
				}
			}
		}
	}

	@media only screen and (max-width: 30em) {
		.notifications {
			top: 2rem;
			left: 2.4rem;

			.notification {
				width: 18rem;
			}
		}
	}
</style>
