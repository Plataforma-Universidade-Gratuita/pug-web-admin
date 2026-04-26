"use client";

import {
	ErrorPageContent,
	type RouteBoundaryPageProps,
} from "../features/docs/routing/RouteBoundaryPages";

export default function ErrorPage(props: RouteBoundaryPageProps) {
	return <ErrorPageContent {...props} />;
}
