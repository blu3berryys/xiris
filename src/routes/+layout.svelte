<script lang="ts">
	import { i18n } from '$lib/i18n';
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import type { AvailableLanguageTag } from '$lib/paraglide/runtime';
	import { goto } from '$app/navigation';
	import { Button } from 'bits-ui';
	import { page } from '$app/state';
	import Icon from '@iconify/svelte';
	import '$lib/app.css';
	import { cn } from '$lib/utils';
	import { onMount } from 'svelte';
	import * as m from '$lib/paraglide/messages.js';
	let { children } = $props();
	let loaded = $state();

	function switchToLanguage(newLanguage: AvailableLanguageTag) {
		const canonicalPath = i18n.route(page.url.pathname);
		const localisedPath = i18n.resolveRoute(canonicalPath, newLanguage);
		return localisedPath;
	}

	let routes = $state([
		{ href: '/', name: m.home(), route: '/' },
		{ href: '/changelog', name: m.changelog(), route: '/changelog/[version]' }
	]);

	$effect(() => {
		routes = [
			{ href: '/', name: m.home(), route: '/' },
			{ href: '/changelog', name: m.changelog(), route: '/changelog/[version]' }
		];
	});

	const languages = [
		{ name: 'English', tag: 'en' },
		{ name: 'Türkçe', tag: 'tr' },
		{ name: 'Deutsch', tag: 'de' },
		{ name: '日本語', tag: 'jp' }
	];

	const activeRouteStyle = ' !text-gray-1000 !font-semibold bg-gray-200';
	let version = $state('');

	onMount(() => {
		loaded = true;
		fetch('/version')
			.then((response) => response.text())
			.then((data) => {
				version = data;
			});
	});
</script>

<ParaglideJS {i18n}>
	{#if loaded}
		<div class="flex flex-col h-full">
			<header class="flex items-center justify-center top-0 w-full p-5 gap-2 z-5">
				{#each routes as route}
					<Button.Root
						class={cn(
							page.route.id === route.route ? activeRouteStyle : '',
							' px-3 py-1.5 text-gray-900 hover:text-gray-1000 rounded-lg text-sm active:scale-95 transition-all select-none'
						)}
						href={route.href}>{route.name}</Button.Root
					>
				{/each}
			</header>
			{@render children()}

			<footer class="flex flex-col bottom-0 w-full py-4 px-8 gap-2">
				<div class="flex gap-3" data-sveltekit-reload>
					{#each languages as language}
						<a
							href={switchToLanguage(language.tag)}
							class="flex flex-col text-sm font-bold text-gray-900 select-none"
							data-no-translate
						>
							{language.name}
						</a>
					{/each}
				</div>
				<span class="text-sm text-gray-800"
					>{m.footer({ date: new Date().getFullYear(), version })}
				</span>
			</footer>
		</div>
	{:else}{/if}
</ParaglideJS>
