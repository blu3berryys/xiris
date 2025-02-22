<script lang="ts">
	import { Button } from 'bits-ui';
	import { page } from '$app/state';
	import { cn } from '$lib/utils';
	import type { Plugin } from 'svelte-exmarkdown';
	import Markdown from 'svelte-exmarkdown';
	import rehypeHighlight from 'rehype-highlight';
	import typescript from 'highlight.js/lib/languages/typescript';
	import javascript from 'highlight.js/lib/languages/javascript';
	import 'highlight.js/styles/stackoverflow-dark.css';

	let { data } = $props();

	const activeRouteStyle = ' !text-pink-900 !font-semibold bg-pink-100';
	console.log(page);

	const plugins: Plugin[] = [
		{
			rehypePlugin: [rehypeHighlight, { ignoreMissing: true, languages: { typescript } }]
		}
	];
</script>

<div class="flex flex-1 w-2/3 m-auto gap-10">
	<aside class="flex flex-col w-[15rem]">
		<h3 class="mb-2 text-lg font-semibold">Releases</h3>
		{#each data.cache.releases as release}
			<Button.Root
				href="/changelog/{release.version}"
				class={cn(
					page.params.version === release.version ? activeRouteStyle : '',
					'flex items-center justify-between px-3 py-2.5 text-gray-alpha-800 hover:text-gray-1000 text-sm rounded-lg transition-colors'
				)}
			>
				{release.version}
				{#if release.prerelease}
					<span class="text-xs font-semibold bg-amber-200 text-amber-900 px-3 py-1 rounded-full">
						Pre-release
					</span>
				{/if}
			</Button.Root>
		{/each}
	</aside>
	<div>
		<div class="markdown-content">
			<Markdown md={data.current.notes} {plugins} />
		</div>
	</div>
</div>

