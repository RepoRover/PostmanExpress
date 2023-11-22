<script>
	import { SectionLine } from '$components';
	import { Twitter, Facebook, Instagram } from 'lucide-svelte';
</script>

<SectionLine></SectionLine>
<footer>
	<div class="right">
		<a href="/" class="link-block">
			<Twitter size={20}></Twitter>
			<p>PostmanExpress Twitter</p>
		</a>
		<a href="/" class="link-block">
			<Facebook size={20}></Facebook>
			<p>PostmanExpress Facebook</p>
		</a>
		<a href="/" class="link-block">
			<Instagram size={20}></Instagram>
			<p>PostmanExpress Instagram</p>
		</a>
	</div>
	<div class="left">
		<a href="https://github.com/RepoRover/PostmanExpress" target="_blank">Projects’ GitHub</a>
		<p>Copyright ©</p>
	</div>
</footer>

<style lang="scss">
	footer {
		display: flex;
		justify-content: space-between;
		font-size: 1.4rem;
		padding: 2.4rem 0;
		// border: 1px solid red;

		.right,
		.left {
			display: flex;
			flex-direction: column;
			gap: 2.2rem;

			.link-block {
				display: flex;
				align-items: center;
				gap: 1.2rem;
			}

			a:link,
			a:visited {
				text-decoration: none;
				color: var(--accent-color);
			}

			p {
				color: var(--accent-color);
			}
		}
	}
</style>
