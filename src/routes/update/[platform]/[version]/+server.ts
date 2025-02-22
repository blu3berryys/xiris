import { error, json, type RequestHandler } from "@sveltejs/kit";
import { loadCache } from '$lib/cache';
import { valid, compare } from "semver";
import { checkAlias } from '$lib/aliases'
import { GITHUB_TOKEN } from '$env/static/private';
import type { CheckUpdateResponse, ErrorResponse } from '$lib/types';


export const GET: RequestHandler = async ({ params, url }) => {
	const { platform: platformName, version } = params as { platform: string; version: string };
	if (!valid(version)) {
		return error(400, {
			code: 'version_invalid',
			message: 'The specified version is not SemVer-compatible'
		} as ErrorResponse)
	}

	const platform = checkAlias(platformName)
	console.log(platform)

	if (!platform) {
		return error(400, {
			code: 'platform_invalid',
			message: 'The specified platform is not valid'
		} as ErrorResponse)
	}

	const { latest } = await loadCache()


	if (!latest.platforms || !latest.platforms[platform]) {
		return error(404, {
			code: 'no_content',
			message: 'The specified platform is not available or does not exist'
		} as ErrorResponse)
	}

	if (compare(version, latest.version) !== 0) {
		return json({
			code: 'version_outdated',
			message: 'The specified version is outdated'
		}, {
			status: 303
		} as ResponseInit)
	}
	const { notes, pub_date } = latest

	const shouldUseProxyDownload = GITHUB_TOKEN && typeof GITHUB_TOKEN === 'string' && GITHUB_TOKEN.length > 0
	return json({
		name: latest.version,
		notes,
		pub_date,
		url: shouldUseProxyDownload ? `${url.href}/download/${platformName}?update=true` : latest.platforms[platform].url
	} as CheckUpdateResponse)
}


