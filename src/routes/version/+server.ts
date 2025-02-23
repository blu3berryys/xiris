import fs from 'fs';

let cachedVersion: string | null = null;
let lastCacheTime = 0;
const CACHE_DURATION = 2 * 60 * 1000;

export async function GET({ url }) {
    const now = Date.now();

    if (cachedVersion && now - lastCacheTime < CACHE_DURATION) {
        return new Response(cachedVersion, {
            headers: {
                'Cache-Control': `public, max-age=120`,
            },
        });
    }

    const version = JSON.parse(fs.readFileSync('package.json', 'utf-8')).version;

    cachedVersion = version;
    lastCacheTime = now;

    return new Response(version, {
        headers: {
            'Cache-Control': `public, max-age=120`,
        },
    });
}
