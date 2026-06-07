export function subscribeToSystemTheme(callback: () => void) {
	const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
	mediaQuery.addEventListener("change", callback);
	return () => mediaQuery.removeEventListener("change", callback);
}

export function getSystemThemeSnapshot() {
	return window.matchMedia("(prefers-color-scheme: dark)").matches;
}
