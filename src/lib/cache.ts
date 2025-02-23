import { QuickDB } from 'quick.db';
import ms, { type StringValue } from 'ms';
import retry from 'async-retry';
import { checkPlatform } from './aliases';
import {
	APP_URL,
	GITHUB_REPO,
	GITHUB_TOKEN,
	GITHUB_PRE_UPDATE,
	GITHUB_PRE_RELEASES,
	REFRESH_INTERVAL
} from '$env/static/private';
import { prerelease } from 'semver';
import { error } from '@sveltejs/kit';
import type { ErrorResponse } from './types';

const db = new QuickDB({ filePath: './cache.sqlite' });

// Process the "RELEASES" asset by replacing .nupkg entries with full URLs.
async function cacheReleaseList(url: string): Promise<string> {
	console.log(url)
	const headers: any = { Accept: 'application/octet-stream' };
	if (GITHUB_TOKEN && GITHUB_TOKEN.length > 0) {
		headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
	}

	const response = await retry(
		async () => {
			const res = await fetch(url, { headers });
			if (!res.ok) {
				error(500, {
					code: 'github_api_error',
					message: `GitHub API responded with ${res.status} for url ${url}`
				} as ErrorResponse);
			}
			return res;
		},
		{ retries: 2 }
	);

	let content = await response.text();
	const matches = content.match(/[^ ]*\.nupkg/gim);
	if (!matches || matches.length === 0) {
		throw new Error("RELEASES content doesn't contain nupkg");
	}
	content = content.replace(
		matches[0],
		`${APP_URL}/download/latest/${matches[0]}`
	)
	return content
}

// Transform a GitHub release into our desired structure.
async function transformRelease(release: any): Promise<any> {
	const transformed: any = {
		version: release.tag_name,
		notes: release.body,
		pub_date: release.published_at,
		prerelease: release.prerelease,
		platforms: {},
		files: {}
	};

	for (const asset of release.assets) {
		const { name, browser_download_url, url: apiUrl, content_type, size } = asset;
		if (name === 'RELEASES') {
			try {
				const releasesContent = await cacheReleaseList(apiUrl);
				transformed.files['RELEASES'] = releasesContent;
			} catch (err) {
				error(500, {
					code: 'error_caching',
					message: `Error caching RELEASES for release ${release.tag_name}`
				} as ErrorResponse);
			}
			continue;
		} else {
			transformed.files[name] = {
				name,
				api_url: apiUrl,
				url: browser_download_url,
				content_type,
				size: Math.round((size / 1000000) * 10) / 10,
			};
		}
		const platform = checkPlatform(name);
		if (!platform) {
			console.warn(`Invalid platform name: ${name}`);
			continue;
		}
		transformed.platforms[platform] = {
			name,
			api_url: apiUrl,
			url: browser_download_url,
			content_type,
			size: Math.round((size / 1000000) * 10) / 10,
		};
	}

	return transformed;
}

// Fetch releases from GitHub, process each release, and save to cache.
async function refreshCache() {
	const repo = GITHUB_REPO || 'Kax675/hazel-demo-electron';
	const url = `https://api.github.com/repos/${repo}/releases?per_page=100`;
	const headers: any = { Accept: 'application/vnd.github.preview' };
	if (GITHUB_TOKEN && GITHUB_TOKEN.length > 0) {
		headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
	}

	const response = await retry(
		async () => {
			const res = await fetch(url, { headers });
			if (!res.ok) {
				error(500, {
					code: 'github_api_error',
					message: `GitHub API responded with ${res.status} for url ${url}`
				} as ErrorResponse);
			}
			return res;
		},
		{ retries: 2 }
	);

	const data = await response.json();
	if (!Array.isArray(data) || data.length === 0) {
		console.warn('No releases found from GitHub');
		return;
	}

	// Determine which releases to include based on environment variables.
	const includePreLatest = GITHUB_PRE_UPDATE === 'true';
	const includePreAll = GITHUB_PRE_RELEASES === 'true';

	// Filter for the latest release using includePreLatest.
	const filteredLatest = data.filter(
		(item: any) => !item.draft && (includePreLatest ? true : !item.prerelease)
	);
	const transformedLatest =
		filteredLatest.length > 0 ? await transformRelease(filteredLatest[0]) : null;

	// Filter for all valid releases using includePreAll.
	const filteredAll = data.filter(
		(item: any) => !item.draft && (includePreAll ? true : !item.prerelease)
	);
	const transformedAll = await Promise.all(
		filteredAll.map(async (release: any) => await transformRelease(release))
	);

	const cacheData = {
		releases: transformedAll, // Array of transformed release objects.
		latest: transformedLatest, // The latest transformed release.
		raw: data, // The original GitHub API response.
		timestamp: Date.now()
	};

	await db.delete('cache');
	await db.set('cache', cacheData);
	return cacheData;
}

// Public function to load the cache: refresh if outdated, otherwise return cached data.
export async function loadCache() {
	const cached = await db.get('cache');
	const interval = REFRESH_INTERVAL || '1m';

	if (!cached || !cached.timestamp || Date.now() - cached.timestamp > ms(interval as StringValue)) {
		console.log('Refreshing cache');
		return await refreshCache();
	} else {
		console.log('Using cache');
		return cached;
	}
}
