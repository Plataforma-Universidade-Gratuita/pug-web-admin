"use client";

export type AppTheme = "light" | "dark" | "system";

export function setTheme(mode: AppTheme) {
	const html = document.documentElement;
	const current = html.getAttribute("data-theme") ?? "system";

	if (current === mode) return;

	html.classList.add("theme-anim");

	requestAnimationFrame(() => {
		switch (mode) {
			case "dark":
				html.classList.add("dark");
				html.setAttribute("data-theme", "dark");
				document.cookie = "theme=dark; Path=/; Max-Age=31536000; SameSite=Lax";
				break;
			case "light":
				html.classList.remove("dark");
				html.setAttribute("data-theme", "light");
				document.cookie = "theme=light; Path=/; Max-Age=31536000; SameSite=Lax";
				break;
			default:
				html.classList.remove("dark");
				html.removeAttribute("data-theme");
				document.cookie =
					"theme=system; Path=/; Max-Age=31536000; SameSite=Lax";
				break;
		}

		setTimeout(() => html.classList.remove("theme-anim"), 250);
	});
}
