"use client";

import { ErrorPageContent } from "@/features/docs/routing/RouteBoundaryPages";
import { FloatingPageControls } from "@/features/floating-page-controls";
import type { RouteBoundaryPageProps } from "@/types/client";

export default function ErrorPage(props: RouteBoundaryPageProps) {
	return (
		<>
			<FloatingPageControls />
			<ErrorPageContent {...props} />
		</>
	);
}
