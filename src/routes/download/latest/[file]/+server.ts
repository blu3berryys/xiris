import { error, json, text, type RequestHandler } from '@sveltejs/kit';
import { loadCache } from '$lib/cache';
import type { ErrorResponse } from '$lib/types';
import { downloadAsset } from '$lib/asset';

export const GET: RequestHandler = async ({ params, url }) => {

    const { latest } = await loadCache();
    const file = params.file;

    if (!latest.files[file]) {
        error(404, {
            code: 'no_file',
            message: 'File not found'
        } as ErrorResponse);
    }
    return downloadAsset(latest.files[file]);
};
