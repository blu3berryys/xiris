import { error, json, text, type RequestHandler } from "@sveltejs/kit";
import { loadCache } from '$lib/cache';
import type { ErrorResponse } from '$lib/types';
import { downloadAsset } from "$lib/asset";
import { checkAlias } from "$lib/aliases";



export const GET: RequestHandler = async ({ params, url }) => {
  const isUpdate = url.searchParams.get('update') === 'true'

  let { platform: platformName } = params as { platform: string | boolean }
  if (platformName === 'mac' && !isUpdate) {
    platformName = 'dmg'
  }
  if (platformName === 'mac_arm64' && !isUpdate) {
    platformName = 'dmg_arm64'
  }
  const { latest } = await loadCache()

  let platform = checkAlias(platformName as string)

  if (!platform) {
    error(400, {
      code: 'platform_invalid',
      message: 'The specified platform is not valid'
    } as ErrorResponse)
  }
  if (!latest.platforms[platform]) {
    error(404, {
      code: 'no_asset',
      message: "No assets found for this platform"
    } as ErrorResponse)
  }
  console.log(platform)
  return downloadAsset(latest.platforms[platform])
}