<script lang="ts">
	import Icon from '@iconify/svelte';
	import { Select } from 'bits-ui';
	import { expoOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';
	let { items, placeholder, value = $bindable() } = $props();

	const selectedLabel = $derived(
		value ? items.find((item) => item.value === value)?.label : placeholder
	);
</script>

<Select.Root type="single" onValueChange={(v) => (value = v)}>
	<Select.Trigger
		class="font-medium px-5 py-2 w-50 inline-flex justify-between select-none items-center bg-gray-100 hover:bg-gray-200 data-placeholder:text-gray-alpha-800 text-sm transition-all rounded-lg focusable"
		aria-label={placeholder}
	>
		{selectedLabel}
		<Icon icon="tabler:caret-up-down-filled" class="size-3" />
	</Select.Trigger>
	<Select.Portal>
		<Select.Content
			class="focus-override border-gray-alpha-200 p-1 bg-background-100 shadow-xl outline-hidden z-50 max-h-[var(--bits-select-content-available-height)] w-[var(--bits-select-anchor-width)] min-w-[var(--bits-select-anchor-width)] select-none rounded-xl border data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1"
			sideOffset={1}
			forceMount
		>
			{#snippet child({ wrapperProps, props, open })}
				{#if open}
					<div {...wrapperProps}>
						<div {...props} transition:fly={{ duration: 300, easing: expoOut, y: 10 }}>
							<Select.ScrollUpButton class="flex w-full items-center justify-center">
								<Icon icon="tabler:chevrons-up" class="size-3" />
							</Select.ScrollUpButton>
							<Select.Viewport class="p-1">
								{#each items as item, i (i + item.value)}
									<Select.Item
										class="data-highlighted:bg-gray-400 active:scale-95 rounded-md outline-hidden data-disabled:opacity-50 flex w-full select-none items-center py-1.5 pl-4 pr-2 text-sm transition-transform"
										value={item.value}
										label={item.label}
										disabled={item.disabled}
									>
										{#snippet children({ selected })}
											{item.label}
											{#if selected}
												<div class="ml-auto">
													<Icon icon="tabler:check" />
												</div>
											{/if}
										{/snippet}
									</Select.Item>
								{/each}
							</Select.Viewport>
							<Select.ScrollDownButton class="flex w-full items-center justify-center">
								<Icon icon="tabler:chevrons-down" class="size-3" />
							</Select.ScrollDownButton>
						</div>
					</div>
				{/if}
			{/snippet}
		</Select.Content>
	</Select.Portal>
</Select.Root>
