"use client";

import { ErrorPageContent } from "@/features/docs/routing/RouteBoundaryPages";
import type { RouteBoundaryPageProps } from "@/types/client";

export default function ErrorPage(props: RouteBoundaryPageProps) {
	return <ErrorPageContent {...props} />;
}
