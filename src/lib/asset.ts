import type { ErrorResponse, Asset } from '$lib/types';
import { GITHUB_TOKEN } from '$env/static/private';
import { error, redirect } from '@sveltejs/kit';

export async function downloadAsset(asset: Asset) {
	const shouldUseProxyDownload =
		GITHUB_TOKEN && GITHUB_TOKEN.length > 0;

	if (shouldUseProxyDownload) {
		console.log('Using proxy download')

		const res = await fetch(asset.api_url, {
			headers: {
				Accept: 'application/octet-stream',
				Authorization: `Bearer ${GITHUB_TOKEN}`
			}
		});
		if (!res.ok) {
			return error(500, {
				code: 'download_failed',
				message: `Download failed: ${res.status} ${res.statusText}`
			} as ErrorResponse);
		}
		const contentType = res.headers.get('content-type') || 'application/octet-stream';
		return new Response(res.body, {
			headers: {
				'Content-Type': contentType,
				'Content-Disposition': `attachment; filename=${asset.name}`,
				'Content-Length': res.headers.get('content-length') || '0'
			}
		});
	} else {
		return redirect(301, asset.url);
	}
}
