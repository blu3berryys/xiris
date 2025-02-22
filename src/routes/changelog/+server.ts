import { redirect, type RequestHandler } from "@sveltejs/kit";

import { loadCache } from '$lib/cache';

export const GET: RequestHandler = async ({ params, url }) => {
    const cache = await loadCache()
    return redirect(308, `/changelog/${cache.latest.version}`)
}