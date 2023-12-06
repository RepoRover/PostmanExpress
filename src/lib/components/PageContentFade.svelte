<script>
	import { fade } from 'svelte/transition';
</script>

<div class="page-title" in:fade={{ duration: 350, delay: 350 }} out:fade={{ duration: 350 }}>
	<slot name="title" />
</div>

<div in:fade={{ duration: 350, delay: 650 }} out:fade={{ duration: 350 }}>
	<slot name="content" />
</div>
