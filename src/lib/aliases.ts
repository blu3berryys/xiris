export const aliases = {
	darwin: ['macOS', 'macos', 'mac', 'osx'],
	exe: ['Windows', 'windows', 'win32', 'win'],
	deb: ['Debian', 'debian'],
	rpm: ['Fedora', 'fedora'],
	AppImage: ['AppImage', 'appimage'],
	dmg: ['dmg']
} as Record<string, string[]>;

export function checkAlias(platform: string) {
	// If the input matches a canonical platform key, return it directly.
	if (aliases[platform]) {
		return platform;
	}

	// Otherwise, check each canonical platform's alias list.
	for (const [canonical, aliasList] of Object.entries(aliases)) {
		if (aliasList.includes(platform)) {
			return canonical;
		}
	}

	// Return false if no match was found.
	return false;
}
export function checkPlatform(fileName: string) {
	const extension = fileName.split('.').pop() || '';
	const arch = fileName.includes('arm64') || fileName.includes('aarch64') ? '_arm64' : '';

	if ((fileName.includes('mac') || fileName.includes('darwin')) && extension === 'zip') {
		return 'darwin' + arch;
	}

	const directCache = ['exe', 'dmg', 'rpm', 'deb', 'AppImage'];
	return directCache.includes(extension) ? extension + arch : false;
}
