"use client";

import type { ReactNode } from "react";

import { Home, RefreshCcw } from "lucide-react";

import { Badge, Button, EmptyState, Icon } from "@/components";
import { HOME_ROUTE } from "@/constants/auth";
import { ROUTE_BOUNDARY_CONFIG } from "@/constants/docs";
import {
	getRouteBoundaryDiagnosticsClassName,
	getRouteBoundaryPanelClassName,
	getRouteBoundaryScreenShellClassName,
} from "@/features/docs/routing/utils";
import type { RouteBoundaryScreenProps } from "@/types/client";

export function RouteBoundaryScreen({
	variant,
	error,
	mode = "page",
	onRetry,
}: RouteBoundaryScreenProps) {
	const config = ROUTE_BOUNDARY_CONFIG[variant];
	const isPreview = mode === "preview";
	const shouldShowErrorMessage =
		variant !== "not-found" &&
		error &&
		(isPreview || process.env.NODE_ENV !== "production");

	const diagnosticItems: ReactNode[] = [];

	if (config.previewNote && isPreview) {
		diagnosticItems.push(
			<p
				key="preview-note"
				className="ty-sm text-[color:var(--twc-muted)]"
			>
				{config.previewNote}
			</p>,
		);
	}

	if (shouldShowErrorMessage && error?.message) {
		diagnosticItems.push(
			<div
				key="error-message"
				className="space-y-2"
			>
				<p className="ty-sm-semibold text-[color:var(--twc-text)]">
					Diagnostic message
				</p>
				<code className="block text-xs break-words whitespace-pre-wrap text-[color:var(--twc-muted)]">
					{error.message}
				</code>
			</div>,
		);
	}

	if (shouldShowErrorMessage && error?.digest) {
		diagnosticItems.push(
			<p
				key="error-digest"
				className="ty-helper text-[color:var(--twc-muted)]"
			>
				Digest: {error.digest}
			</p>,
		);
	}

	return (
		<main className={getRouteBoundaryScreenShellClassName(mode)}>
			<div className={getRouteBoundaryPanelClassName(mode)}>
				<EmptyState
					className="gap-6"
					icon={
						<Icon
							icon={config.icon}
							className="h-6 w-6 text-[color:var(--color-brand)]"
						/>
					}
					title={config.title}
					description={config.description}
					actions={
						<>
							{variant !== "not-found" ? (
								<Button
									usage="primary"
									variant="primary"
									leadingIcon={
										<Icon
											icon={RefreshCcw}
											className="h-4 w-4"
										/>
									}
									disabled={isPreview}
									onClick={() => {
										if (isPreview) return;
										if (onRetry) {
											onRetry();
											return;
										}

										window.location.reload();
									}}
								>
									{variant === "global-error" ? "Reload app" : "Try again"}
								</Button>
							) : null}

							<Button
								usage={variant === "not-found" ? "primary" : "secondary"}
								variant={variant === "not-found" ? "primary" : "secondary"}
								leadingIcon={
									<Icon
										icon={Home}
										className="h-4 w-4"
									/>
								}
								disabled={isPreview}
								onClick={() => {
									if (isPreview) return;
									window.location.assign(HOME_ROUTE);
								}}
							>
								Go to home
							</Button>
						</>
					}
				>
					<div className="grid w-full gap-4">
						<div className="flex flex-wrap justify-center gap-2">
							<Badge tone={config.tone}>{config.code}</Badge>
							<Badge
								tone="neutral"
								variant="secondary"
							>
								{isPreview ? "Preview" : "Live fallback"}
							</Badge>
						</div>

						{diagnosticItems.length > 0 ? (
							<div className={getRouteBoundaryDiagnosticsClassName(mode)}>
								{diagnosticItems}
							</div>
						) : null}
					</div>
				</EmptyState>
			</div>
		</main>
	);
}
