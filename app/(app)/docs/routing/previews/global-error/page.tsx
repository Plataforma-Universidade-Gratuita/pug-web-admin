"use client";

import { GlobalErrorPageContent } from "../../../../../../features/docs/routing/RouteBoundaryPages";

export default function GlobalErrorPreviewPage() {
	return (
		<GlobalErrorPageContent
			error={
				new Error(
					"Preview only: this is the same UI used by the real root global error boundary.",
				)
			}
			reset={() => window.location.reload()}
		/>
	);
}
