<script>
	export let status_timestamps;

	const convertDateFormat = (/** @type {string} */ dateStr) => {
		let parts = dateStr.split('.');
		let year = parts[2];

		if (year.length === 2) {
			year = '20' + year;
		}

		return parts[0] + '.' + parts[1] + '.' + year;
	};
</script>

<div class="timestamps">
	{#each status_timestamps as timestamp, index}
		<div class="timestamp-box">
			<p
				class="status"
				class:first={index === status_timestamps.length - 1}
				class:last={index === 0}
				class:delivered={timestamp.status === 'delivered'}
			>
				<span>
					{timestamp.status.charAt(0).toUpperCase() + timestamp.status.slice(1)}
				</span>
			</p>
			<p class="timestamp">at {timestamp.time} on {convertDateFormat(timestamp.date)}</p>
		</div>
	{/each}
</div>

<style lang="scss">
	.timestamps {
		padding: 3.2rem 0 0 6.4rem;
		display: flex;
		flex-direction: column;
		gap: 3.6rem;

		.timestamp-box {
			display: flex;
			flex-direction: column;
			gap: 0.8rem;
			position: relative;

			.status {
				position: relative;
				color: var(--accent-color);

				span {
					white-space: nowrap;
				}

				&::after {
					content: '';
					height: 1rem;
					width: 1rem;
					border-radius: 100%;
					position: absolute;
					background-color: var(--delivered);
					top: 50%;
					left: -3.4rem;
					transform: translateY(-50%);
					z-index: 2;
				}

				&::before {
					content: '';
					height: 7.8rem;
					width: 1px;
					position: absolute;
					background-color: var(--section-sep);
					top: 55%;
					left: -3rem;
					z-index: 1;
				}

				&.first {
					&::before {
						display: none;
					}
				}

				&.last {
					&::after {
						background-color: var(--awaiting-drop-off);
					}

					&.delivered {
						&::after {
							background-color: var(--delivered);
						}
					}
				}
			}

			.timestamp {
				font-size: 1.2rem;
			}
		}
	}
	@media only screen and (max-width: 30em) {
		.timestamps {
			padding: 2.4rem 0 0 4.8rem;
		}
	}
</style>
