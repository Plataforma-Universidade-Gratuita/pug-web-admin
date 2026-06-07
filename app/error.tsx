"use client";

import { FloatingPageSelectors } from "@/components/composite";
import { Button } from "@/components/primitives";
import type { RouteBoundaryPageProps } from "@/types/client";

export default function ErrorPage(props: RouteBoundaryPageProps) {
	return (
		<>
			<FloatingPageSelectors />
			<div className="surface-1 flex min-h-dvh items-center justify-center px-6 py-12">
				<div className="surface-2 border-border flex w-full max-w-xl flex-col gap-4 rounded-lg border p-6 shadow-sm">
					<p className="field-label">Page error</p>
					<h1 className="ty-display text-balance">Something went wrong.</h1>
					<p className="ty-body text-muted-foreground">
						The page could not be rendered right now. Retry the operation.
					</p>
					{props.error?.message ? (
						<div className="border-border bg-surface-1 rounded-md border px-3 py-2 font-mono text-sm break-all">
							{props.error.message}
						</div>
					) : null}
					<div className="flex justify-end">
						<Button
							variant="secondary"
							onClick={props.reset}
						>
							Try again
						</Button>
					</div>
				</div>
			</div>
		</>
	);
}
