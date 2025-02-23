import { loadCache } from '$lib/cache';
import { error } from '@sveltejs/kit';
export const load = async ({ params }) => {
    const cacheData = await loadCache();
    const { raw, ...rest } = cacheData;
    const cache = { ...rest };

    const current = await cache.releases.find((release) => release.version === params.version);

    if (!current) {
        error(404, {
            code: 'version_not_found',
            message: 'The specified version is not found'
        });
    }

    return {
        current,
        cache
    };
};
