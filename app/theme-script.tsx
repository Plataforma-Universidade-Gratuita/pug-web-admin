const THEME_BOOTSTRAP_SCRIPT = `
(() => {
	const match = document.cookie.match(/(?:^|; )theme=([^;]+)/);
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

export function ThemeScript() {
	return (
		<script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP_SCRIPT }} />
	);
}
