"use client";

import { useEffect } from "react";

import "@/app/globals.css";

import { RouteBoundaryScreen } from "@/features/routing/RouteBoundaryScreen";

type GlobalErrorPageProps = {
	error: Error & { digest?: string };
	reset: () => void;
};

export function GlobalErrorPageContent({
	error,
	reset,
}: GlobalErrorPageProps) {
	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<RouteBoundaryScreen
			variant="global-error"
			error={error}
			onRetry={reset}
			mode="full"
		/>
	);
}

export default function GlobalErrorPage(props: GlobalErrorPageProps) {
	return (
		<html lang="en">
			<body className="surface-1 w-full antialiased">
				<GlobalErrorPageContent {...props} />
			</body>
		</html>
	);
}
