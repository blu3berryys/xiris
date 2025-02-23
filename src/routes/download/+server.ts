import { error, type RequestHandler } from '@sveltejs/kit';
import { loadCache } from '$lib/cache';
import type { ErrorResponse } from '$lib/types';
import { UAParser } from 'ua-parser-js';
import { downloadAsset } from '$lib/asset';

export const GET: RequestHandler = async ({ request, url }) => {
	const isUpdate = url.searchParams.get('update') === 'true';

	const os = UAParser(request.headers.get('User-Agent') || '').os.name?.toLowerCase();
	let platform;

	if (os === 'windows') {
		platform = 'exe';
	} else if (os === 'macos' && !isUpdate) {
		platform = 'dmg';
	} else if (os === 'macos' && isUpdate) {
		platform = 'darwin';
	} else if (os === 'linux') {
		platform = 'appimage';
	} else {
		return error(404, {
			code: 'no_downloads',
			message: 'No downloads available for your platform'
		} as ErrorResponse);
	}

	const { latest } = await loadCache();
	if (!latest.platforms[platform]) {
		error(404, {
			code: 'no_asset',
			message: 'No assets found for this platform'
		} as ErrorResponse);
	}
	console.log(latest.platforms[platform]);
	return downloadAsset(latest.platforms[platform]);
};
