export const THEME_COOKIE_NAME = "theme";
export const THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
export const THEME_ANIMATION_CLASS = "theme-anim";

export const APP_THEMES = ["light", "dark", "system"] as const;

export const THEME_BOOTSTRAP_SCRIPT = `
(() => {
	const match = document.cookie.match(/(?:^|; )${THEME_COOKIE_NAME}=([^;]+)/);
	const mode = match ? decodeURIComponent(match[1]) : "system";
	const resolved =
		mode === "system"
			? window.matchMedia("(prefers-color-scheme: dark)").matches
				? "dark"
				: "light"
			: mode;

	document.documentElement.classList.remove("light", "dark");
	document.documentElement.classList.add(resolved);

	if (mode === "system") {
		document.documentElement.removeAttribute("data-theme");
	} else {
		document.documentElement.setAttribute("data-theme", mode);
	}

	document.documentElement.style.colorScheme = resolved;
})();
`;
