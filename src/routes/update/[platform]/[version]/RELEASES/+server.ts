import { json, text } from '@sveltejs/kit';
import { loadCache } from '$lib/cache';
export async function GET() {
	const cache = await loadCache();
 
	return text(cache.latest.files.RELEASES);
}
