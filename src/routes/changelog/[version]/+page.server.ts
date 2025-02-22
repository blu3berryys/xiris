import { loadCache } from '$lib/cache';

export const load = async ({ params }) => {

    const cacheData = await loadCache();
    const { raw, ...rest } = cacheData;
    const cache = { ...rest }

    const current = await cache.releases.find((release) => release.version === params.version)
    
    return { 
        current,
        cache
    };

};
