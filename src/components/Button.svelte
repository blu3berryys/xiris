<script lang="ts">
	import { Button } from 'bits-ui';
	import { cn } from '$lib/utils';
	import { tv } from 'tailwind-variants';
	let { rounded = false, type = 'accent', class: className, children, ...restProps } = $props();

	const button = tv({
		base: 'flex items-center justify-between font-medium px-8 py-2 rounded-xl active:scale-95 hover:scale-102 active:opacity-80 transition-all focusable select-none',
		variants: {
			type: {
				accent: 'bg-pink-700 hover:bg-pink-800 text-white',
				ghost: 'text-pink-700 hover:bg-pink-800/10'
			},
			rounded: {
				true: 'rounded-full'
			}
		}
	});
</script>

<Button.Root {...restProps} class={cn(className, button({ type, rounded }))}>
	{@render children()}
</Button.Root>
