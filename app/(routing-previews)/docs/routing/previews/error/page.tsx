"use client";

import { ErrorPageContent } from "@/app/error";

export default function ErrorPreviewPage() {
	return (
		<ErrorPageContent
			error={
				new Error("Preview only: this is the same UI used by the real route error boundary.")
			}
			reset={() => window.location.reload()}
		/>
	);
}
