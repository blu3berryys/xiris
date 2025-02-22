import type { ErrorResponse, Asset } from "$lib/types";
import { GITHUB_TOKEN } from '$env/static/private';
import { error, redirect } from "@sveltejs/kit";

export async function downloadAsset(asset: Asset) {
    const shouldUseProxyDownload = GITHUB_TOKEN && typeof GITHUB_TOKEN === 'string' && GITHUB_TOKEN.length > 0

    if (shouldUseProxyDownload) {
        const url = asset.url.replace(
            'https://api.github.com/',
            `https://${GITHUB_TOKEN}@api.github.com/`
        )
        const res = await fetch(url)
        if (!res.ok) {
            return error(500, {
                code: 'download_failed',
                message: 'Failed to download asset'
            } as ErrorResponse)
        }
        const contentType = res.headers.get('content-type') || 'application/octet-stream'
        return new Response(res.body, {
            headers: {
                'Content-Type': contentType,
                'Content-Disposition': `attachment; filename=${asset.name}`,
                'Content-Length': res.headers.get('content-length') || '0'
            }
        })
    } else {
        return redirect(301, asset.url)
    }
}