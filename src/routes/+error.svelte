<script lang="ts">
	import { page } from '$app/state';
</script>

<div class="flex flex-col flex-1 items-center justify-center">
	<h1 class="text-6xl font-semibold">{page.status}</h1>
	<p class="text-gray-900 font-semibold">{page.error?.message}</p>
</div>
