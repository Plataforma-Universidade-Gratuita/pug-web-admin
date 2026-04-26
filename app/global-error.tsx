"use client";

import "@/app/globals.css";
import {
	GlobalErrorPageContent,
	type RouteBoundaryPageProps,
} from "@/features/routing/RouteBoundaryPages";

export default function GlobalErrorPage(props: RouteBoundaryPageProps) {
	return (
		<html lang="en">
			<body className="surface-1 w-full antialiased">
				<GlobalErrorPageContent {...props} />
			</body>
		</html>
	);
}
