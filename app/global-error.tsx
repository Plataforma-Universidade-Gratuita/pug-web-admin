"use client";

import "@/app/globals.css";

import { Providers } from "@/app/providers";
import { GlobalErrorPageContent } from "@/features/docs/routing/RouteBoundaryPages";
import { FloatingPageControls } from "@/features/floating-page-controls";
import type { RouteBoundaryPageProps } from "@/types/client";

export default function GlobalErrorPage(props: RouteBoundaryPageProps) {
	return (
		<html lang="en">
			<body className="surface-1 w-full antialiased">
				<Providers
					initialLangCookieValue={undefined}
					initialThemeCookieValue={undefined}
				>
					<FloatingPageControls />
					<GlobalErrorPageContent {...props} />
				</Providers>
			</body>
		</html>
	);
}
