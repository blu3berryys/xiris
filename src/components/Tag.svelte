<script lang="ts">
	import { cn } from '$lib/utils';

	let { class: className, children, ...restProps } = $props();
</script>

<span class={cn(className, 'text-sm font-semibold px-3 py-1 rounded-full')}>
	{@render children()}
</span>
