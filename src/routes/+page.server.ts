import { loadCache } from '$lib/cache';
import { UAParser } from 'ua-parser-js';
import { error } from '@sveltejs/kit';

export const load = async ({ request }) => {
	const ua = UAParser(request.headers.get('User-Agent') || '');
	const os = {
		name: ua.os.name,
		version: ua.os.version
	};
	console.log(os);
	const data = await loadCache();
	if (!data.latest) {
		error(500, {
			code: 'no_latest_release',
			message: 'No latest release found'
		});
	}
	const { raw, ...rest } = data;
	return {
		cache: { ...rest },
		os
	};
};
