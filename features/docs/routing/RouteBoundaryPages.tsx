"use client";

import { useEffect } from "react";

import { RouteBoundaryScreen } from "features/docs/routing/RouteBoundaryScreen";

export type RouteBoundaryPageProps = {
	error: Error & { digest?: string };
	reset: () => void;
};

export function NotFoundPageContent() {
	return (
		<RouteBoundaryScreen
			variant="not-found"
			mode="full"
		/>
	);
}

export function ErrorPageContent({ error, reset }: RouteBoundaryPageProps) {
	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<RouteBoundaryScreen
			variant="error"
			error={error}
			onRetry={reset}
			mode="page"
		/>
	);
}

export function GlobalErrorPageContent({
	error,
	reset,
}: RouteBoundaryPageProps) {
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
