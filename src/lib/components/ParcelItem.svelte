<script>
	import { Info } from 'lucide-svelte';
	import { statusMap } from '$helpers/const.js';

	export let parcel;

	$: if (
		parcel.parcel_status === 'en route to the warehouse' ||
		parcel.parcel_status === 'en route to the pickup location'
	)
		parcel.parcel_status = 'en route';
</script>

<a href="/parcels/{parcel.parcel_id}">
	<div class="top">
		<p class="parcel-name"><span>Name: </span>{parcel.parcel_name}</p>
		<p class="last-updated"><span>Updated: </span>{parcel.last_status_date}</p>
	</div>
	<div class="bottom">
		<div class="status">
			<div class="status-circle {statusMap[parcel.parcel_status]}"></div>
			<p>{parcel.parcel_status.charAt(0).toUpperCase() + parcel.parcel_status.slice(1)}</p>
		</div>
		<p class="more-info"><span>More info</span><Info size={10}></Info></p>
	</div>
</a>

<style lang="scss">
	a {
		&:link,
		&:visited {
			text-decoration: none;
			display: flex;
			flex-direction: column;
			width: 42.5rem;
			padding: 2.4rem 3.6rem;
			background-color: var(--s-bg-color);
			border-radius: 20px;
			border: 2px solid var(--border);
			gap: 3.2rem;
			font-size: 1.8rem;
			box-shadow: 0 4px 12px 2px rgba(0, 0, 0, 0.25);
			transition: all 0.3s;
		}

		&:hover,
		&:active {
			transform: scale(1.03);
			box-shadow: 0 6px 16px 4px rgba(0, 0, 0, 0.25);
			.bottom {
				.more-info {
					color: var(--accent-color);
					span {
						color: var(--accent-color);
					}
				}
			}
		}

		@media only screen and (max-width: 82em) {
			&:link,
			&:visited {
				width: calc(42.5rem - 4.8rem);
			}
		}

		@media only screen and (max-width: 67.5em) {
			&:link,
			&:visited {
				width: 48rem;
			}
		}
		@media only screen and (max-width: 48em) {
			&:link,
			&:visited {
				padding: 2rem 3.2rem;
				gap: 2.4rem;
				.top,
				.bottom {
					.parcel-name {
						width: 12rem;
					}
				}
			}

			.parcel-name {
				span {
					display: none;
				}
			}
		}
		@media only screen and (max-width: 39em) {
			&:link,
			&:visited {
				width: 32rem;
				padding: 2rem 3.2rem;
				gap: 2.4rem;
				.top,
				.bottom {
					.parcel-name {
						width: 12rem;
					}
				}
			}

			.parcel-name {
				span {
					display: none;
				}
			}
		}

		@media only screen and (max-width: 30em) {
			&:link,
			&:visited {
				width: 28rem;
				padding: 2rem 2.4rem;

				.top,
				.bottom {
					.parcel-name {
						width: 10rem;
					}
				}
			}
		}

		.top,
		.bottom {
			display: flex;
			justify-content: space-between;

			span {
				color: var(--text-color);
			}

			p {
				color: var(--accent-color);
			}

			.parcel-name {
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				width: 20rem;
			}

			.status {
				display: flex;
				align-items: center;
				gap: 0.4rem;

				.status-circle {
					border-radius: 100%;
					width: 1.1rem;
					height: 1.1rem;

					&.awaiting-drop-off {
						background-color: var(--awaiting-drop-off);
					}
					&.prepared-for-delivery {
						background-color: var(--prepared-for-delivery);
					}
					&.at-warehouse {
						background-color: var(--at-warehouse);
					}
					&.en-route {
						background-color: var(--en-route);
					}
					&.ready-for-pick-up {
						background-color: var(--ready-for-pick-up);
					}
					&.delivered {
						background-color: var(--delivered);
					}
				}
			}

			.more-info {
				display: flex;
				gap: 0.4rem;
				align-items: center;
				transition: all 0.3s;
				color: var(--text-color);

				span {
					transition: all 0.3s;
					color: var(--text-color);
				}
			}
		}
	}
</style>
