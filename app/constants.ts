import type { QueryClientConfig } from "@tanstack/react-query";

import { THEME_COOKIE_NAME } from "@/constants";

const QUERY_DEFAULT_RETRY_COUNT = 1;

const QUERY_DEFAULT_STALE_TIME_MS = 1000 * 60 * 5;

export const APP_QUERY_CLIENT_OPTIONS = {
	defaultOptions: {
		queries: {
			retry: QUERY_DEFAULT_RETRY_COUNT,
			staleTime: QUERY_DEFAULT_STALE_TIME_MS,
			refetchOnWindowFocus: false,
		},
	},
} satisfies QueryClientConfig;

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
