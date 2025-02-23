import { loadCache } from '$lib/cache';

export const load = async ({ params }) => {
	const cacheData = await loadCache();

	return {
		latest: cacheData.latest
	};
};
