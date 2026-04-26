"use client";

import { useEffect } from "react";

import { RouteBoundaryScreen } from "@/features/routing/RouteBoundaryScreen";

type ErrorPageProps = {
	error: Error & { digest?: string };
	reset: () => void;
};

export function ErrorPageContent({
	error,
	reset,
}: ErrorPageProps) {
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

export default function ErrorPage(props: ErrorPageProps) {
	return <ErrorPageContent {...props} />;
}
