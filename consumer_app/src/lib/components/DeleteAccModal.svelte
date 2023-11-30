<script>
	import { invalidateAll } from '$app/navigation';
	import { notifications } from '$stores';
	import { createEventDispatcher, tick } from 'svelte';
	import { fade } from 'svelte/transition';

	const dispatcher = createEventDispatcher();

	let confirmed = false;

	const closeAccDeleteModal = async () => {
		await tick();
		dispatcher('closeAccDeleteModal');
	};
</script>

<svelte:head>
	<style>
		body {
			overflow: hidden;
		}
	</style>
</svelte:head>

<div class="delete-acc-modal" transition:fade={{ duration: 350 }}>
	<h2>Account deletion</h2>
	<ul>
		<li>
			Once your account is deleted, you will no longer be able to access the detailed data of your
			parcels.
		</li>
		<li>
			This includes historical tracking information, delivery statuses, and any other related data.
		</li>
		<li>Account deletion is irreversible. Once your account is deleted, it cannot be recovered.</li>
		<li>
			Ensure that you have saved or noted any essential parcel information you may need in the
			future before proceeding with the account deletion.
		</li>
	</ul>

	<label class="confirmation-box"
		>I understand the consequences
		<input type="checkbox" bind:checked={confirmed} />
		<span class="checkmark"></span>
	</label>

	<div class="actions">
		<button class="cancel" on:click={closeAccDeleteModal}>Cancel</button>
		<form
			method="DELETE"
			action="/api/me"
			on:submit|preventDefault={async () => {
				const response = await fetch('/api/me', {
					method: 'DELETE',
					headers: {
						accept: 'application/json'
					}
				});

				const resJSON = await response.json();
				if (response.ok) {
					await invalidateAll();
					notifications.success('Success', 'You successfully deleted account.');
				} else {
					notifications.error(resJSON.message, 5000);
				}
			}}
		>
			<button class="delete" type="submit" disabled={!confirmed}>Delete</button>
		</form>
	</div>
</div>

<style lang="scss">
	.delete-acc-modal {
		position: fixed;
		z-index: 300;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background-color: var(--s-bg-color);
		width: 44rem;
		border-radius: 20px;
		border: 2px solid var(--border);
		padding: 3.2rem;
		box-shadow: 0 4px 12px 2px rgba(0, 0, 0, 0.25);

		h2 {
			text-align: center;
			font-size: 2.4rem;
			font-weight: 700;
			font-family: inherit;
			margin-bottom: 2.4rem;
		}

		ul {
			padding-inline-start: 4rem;
			margin-bottom: 2.4rem;
		}
		li {
			font-size: 1.2rem;
			margin-bottom: 1.2rem;
			line-height: 1.6;
		}
	}

	.confirmation-box {
		display: block;
		position: relative;
		margin-left: 4rem;
		padding-left: 3.2rem;
		cursor: pointer;
		font-size: 1.2rem;
		margin-bottom: 2.4rem;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}

	.confirmation-box input {
		position: absolute;
		opacity: 0;
		cursor: pointer;
		height: 0;
		width: 0;
	}

	.checkmark {
		position: absolute;
		top: 0;
		left: 0;
		height: 1.8rem;
		width: 1.8rem;
		border-radius: 4px;
		background-color: var(--text-color);
		transition: all 0.3s;
	}

	.confirmation-box:hover input ~ .checkmark {
		background-color: var(--error);
	}

	.confirmation-box input:checked ~ .checkmark {
		background-color: var(--error);
	}

	.checkmark:after {
		content: '';
		position: absolute;
		display: none;
	}

	.confirmation-box input:checked ~ .checkmark:after {
		display: block;
	}

	.confirmation-box .checkmark:after {
		left: 0.6rem;
		top: 0.2rem;
		width: 0.4rem;
		height: 1rem;
		border: solid #000;
		border-width: 0 2px 2px 0;
		-webkit-transform: rotate(45deg);
		-ms-transform: rotate(45deg);
		transform: rotate(45deg);
	}

	.actions {
		display: flex;
		justify-content: space-between;
		padding: 0 3.6rem;

		button {
			border-radius: 8px;
			padding: 0.8rem 2.4rem;
			cursor: pointer;
			transition: all 0.3s;

			&.delete {
				font-family: inherit;
				font-weight: 700;
				background-color: var(--bg-color);
				border: none;
				color: var(--error);

				&:hover {
					transform: scale(1.05);
					color: var(--s-error);
				}

				&:disabled {
					cursor: not-allowed;
					transform: none;
					color: var(--dis-action-btn);
				}
			}

			&.cancel {
				background-color: var(--bg-color);
				border: none;
				font-family: inherit;
				font-weight: 700;
				color: var(--text-color);

				&:hover {
					transform: scale(1.05);
					color: var(--accent-color);
				}
			}
		}
	}

	@media only screen and (max-width: 30em) {
		.delete-acc-modal {
			width: 28rem;
			padding: 2rem;

			ul {
				padding-inline-start: 2rem;
			}
		}

		.confirmation-box {
			margin-left: 2rem;
		}

		.actions {
			padding: 0 2rem;
		}
	}
</style>
