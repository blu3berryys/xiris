<script lang="ts">
	import { Button } from 'bits-ui';
	import { page } from '$app/state';
	import { cn } from '$lib/utils';
	import { aliases } from '$lib/aliases.js';
	import type { Plugin } from 'svelte-exmarkdown';
	import Markdown from 'svelte-exmarkdown';
	import rehypeHighlight from 'rehype-highlight';
	import typescript from 'highlight.js/lib/languages/typescript';
	import javascript from 'highlight.js/lib/languages/javascript';
	import * as m from '$lib/paraglide/messages.js';
	import 'highlight.js/styles/stackoverflow-light.css';
	import { languageTag } from '$lib/paraglide/runtime.js';
	import Tag from '$components/Tag.svelte';

	let { data } = $props();

	const activeRouteStyle = ' !text-pink-900 !font-semibold bg-pink-100';
	console.log(data);

	const downloadablePlatforms = data.current?.platforms ? Object.keys(data.current.platforms) : [];
	let platforms = $state([]);
	downloadablePlatforms.forEach((platform) => {
		platforms.push(aliases[platform][0]);
	});

	const plugins: Plugin[] = [
		{
			rehypePlugin: [rehypeHighlight, { ignoreMissing: true, languages: { typescript } }]
		}
	];
</script>

<div class="flex flex-1 w-2/3 m-auto gap-10">
	<aside class="flex flex-col w-[15rem]">
		<h3 class="mb-2 text-lg font-semibold">{m.releases()}</h3>
		{#each data.cache.releases as release}
			<Button.Root
				href="/changelog/{release.version}"
				class={cn(
					page.params.version === release.version ? activeRouteStyle : '',
					'flex items-center justify-between px-3 py-2.5 text-gray-900 hover:text-gray-1000 text-sm rounded-lg transition-colors'
				)}
			>
				{release.version}
				{#if release.prerelease}
					<Tag class="bg-amber-200 text-amber-900 !text-xs">{m.prerelease()}</Tag>
				{/if}
			</Button.Root>
		{/each}
	</aside>
	<div class="flex-1">
		<div class="flex flex-col gap-2">
			<h1 class="font-semibold text-5xl">{data.current.version}</h1>

			<span class="text-sm font-medium text-gray-900">
				{new Date(data.current.pub_date).toLocaleDateString(languageTag(), {
					month: 'long',
					day: 'numeric',
					year: 'numeric'
				})}
			</span>

			<div class="flex gap-2">
				{#if data.current.version === data.cache.latest.version}
					<Tag class="bg-blue-200 text-blue-900 !text-xs">
						{m.latest_version()}
					</Tag>
				{/if}
				{#if data.current.prerelease}
					<Tag class="bg-amber-200 text-amber-900 !text-xs">{m.prerelease()}</Tag>
				{/if}
			</div>
		</div>
		<div class="markdown-content mt-8">
			<Markdown md={data.current.notes} {plugins} />
		</div>
	</div>
</div>
