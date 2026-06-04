"use client";

import "@/app/globals.css";
import { Providers } from "@/app/providers";
import { Button, FloatingPageSelectors } from "@/components";
import type { RouteBoundaryPageProps } from "@/types";

export default function GlobalErrorPage(props: RouteBoundaryPageProps) {
	return (
		<html lang="en">
			<body className="surface-1 w-full antialiased">
				<Providers
					initialLangCookieValue={undefined}
					initialThemeCookieValue={undefined}
				>
					<FloatingPageSelectors />
					<div className="surface-1 flex min-h-dvh items-center justify-center px-6 py-12">
						<div className="surface-2 border-border flex w-full max-w-xl flex-col gap-4 rounded-lg border p-6 shadow-sm">
							<p className="field-label">Application error</p>
							<h1 className="ty-display text-balance">
								The application hit an unrecoverable error.
							</h1>
							<p className="ty-body text-muted-foreground">
								Reload the application and try again.
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
									Reload
								</Button>
							</div>
						</div>
					</div>
				</Providers>
			</body>
		</html>
	);
}
