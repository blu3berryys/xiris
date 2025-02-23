<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { i18n } from '$lib/i18n';

	let { data } = $props();

	goto('/changelog/' + data.latest.version);
</script>

<div class="flex flex-1"></div>
