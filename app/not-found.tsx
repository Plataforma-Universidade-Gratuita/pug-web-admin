import Link from "next/link";

import { FloatingPageSelectors } from "@/components";

export default function NotFoundPage() {
	return (
		<>
			<FloatingPageSelectors />
			<div className="surface-1 flex min-h-dvh items-center justify-center px-6 py-12">
				<div className="surface-2 border-border flex w-full max-w-xl flex-col gap-4 rounded-lg border p-6 shadow-sm">
					<p className="field-label">Not found</p>
					<h1 className="ty-display text-balance">This page does not exist.</h1>
					<p className="ty-body text-muted-foreground">
						Check the URL or return to the application home.
					</p>
					<div className="flex justify-end">
						<Link
							href="/"
							className="btn-base btn-usage-secondary btn-variant-secondary focus-ring inline-flex min-h-10 shrink-0 items-center justify-center gap-2 whitespace-nowrap"
						>
							<span>Go home</span>
						</Link>
					</div>
				</div>
			</div>
		</>
	);
}
