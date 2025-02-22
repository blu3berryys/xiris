<script lang="ts">
	import { i18n } from '$lib/i18n';
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import { Button } from 'bits-ui';
	import { page } from '$app/state';
	import '$lib/app.css';
	import { cn } from '$lib/utils';
	import { onMount } from 'svelte';
	let { children } = $props();
	let loaded = $state()

	const routes = [
		{ href: '/', name: 'Home', route: "/" },
		{ href: '/changelog', name: 'Changelog', route: "/changelog/[version]" }
	];

	const activeRouteStyle = ' !text-gray-1000 !font-semibold bg-gray-200';

	onMount(() => {
		loaded = true
	})
</script>

{#if loaded}
<div class="flex flex-col h-full">
	<header class="flex items-center justify-center top-0 w-full p-5 gap-2 z-5">
		{#each routes as route}
			<Button.Root
				class={cn(
					page.route.id === route.route ? activeRouteStyle : '',
					' px-3 py-1.5 text-gray-alpha-800 hover:text-gray-1000 rounded-lg text-sm active:scale-95 transition-all'
				)}
				href={route.href}>{route.name}</Button.Root
			>
		{/each}
	</header>
	<ParaglideJS {i18n}>
		{@render children()}
	</ParaglideJS>

	<footer class="bottom-0 w-full py-4 px-8">
		<span class="text-sm text-gray-800">Using xiris by OpenAnime Labs ©{new Date().getFullYear()} </span>
	</footer>
</div>
{:else}

{/if}