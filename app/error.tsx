"use client";

import {
	ErrorPageContent,
	type RouteBoundaryPageProps,
} from "@/features/routing/RouteBoundaryPages";

export default function ErrorPage(props: RouteBoundaryPageProps) {
	return <ErrorPageContent {...props} />;
}
