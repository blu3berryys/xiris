import { loadCache } from '$lib/cache';
import { UAParser } from 'ua-parser-js';

export const load = async ({ request }) => {
	const ua = UAParser(request.headers.get('User-Agent') || '');
	const os = {
		name: ua.os.name,
		version: ua.os.version
	};
	console.log(os);
	const data = await loadCache();
	const { raw, ...rest } = data;
	return {
		cache: { ...rest },
		os
	};
};
