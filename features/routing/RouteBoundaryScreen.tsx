"use client";

import type { ReactNode } from "react";

import { Compass, Home, RefreshCcw, ShieldAlert, TriangleAlert } from "lucide-react";

import { Badge, Button, EmptyState, Icon } from "@/components";
import { HOME_ROUTE } from "@/constants/auth";

type RouteBoundaryVariant = "not-found" | "error" | "global-error";
type RouteBoundaryMode = "full" | "page" | "preview";

type RouteBoundaryScreenProps = {
	variant: RouteBoundaryVariant;
	error?: Error & { digest?: string };
	mode?: RouteBoundaryMode;
	onRetry?: () => void;
};

type RouteBoundaryConfig = {
	code: string;
	title: string;
	description: string;
	icon: typeof Compass;
	tone: "brand" | "warning" | "danger";
	previewNote?: string;
};

const routeBoundaryConfig: Record<RouteBoundaryVariant, RouteBoundaryConfig> = {
	"not-found": {
		code: "404",
		title: "This route does not exist.",
		description:
			"The page may have moved, the URL may be incorrect, or the route may not be available in the current app area.",
		icon: Compass,
		tone: "brand",
	},
	error: {
		code: "500",
		title: "Something broke while rendering this route.",
		description:
			"The route failed before it could complete. Retry the current view or go back to a stable part of the app.",
		icon: TriangleAlert,
		tone: "warning",
	},
	"global-error": {
		code: "Root Boundary",
		title: "The app shell failed to load safely.",
		description:
			"This is the last-resort fallback for failures that escape normal route boundaries. Reload the app or return to the start.",
		icon: ShieldAlert,
		tone: "danger",
		previewNote:
			"The real global error screen only appears when the root app shell fails. This preview uses the same UI in a safe route.",
	},
};

function screenShellClassName(mode: RouteBoundaryMode) {
	if (mode === "full") {
		return "flex min-h-dvh items-center justify-center p-6 sm:p-8";
	}

	if (mode === "preview") {
		return "flex min-h-[34rem] items-center justify-center p-4";
	}

	return "flex min-h-[70vh] items-center justify-center p-6";
}

function panelClassName(mode: RouteBoundaryMode) {
	return mode === "preview"
		? "w-full max-w-4xl rounded-[calc(var(--twc-radius-xl)+0.25rem)] border border-[color:var(--twc-border-2)] bg-[color:var(--twc-surface-2)] p-4 shadow-[var(--twc-shadow-lg)] sm:p-6"
		: "w-full max-w-3xl rounded-[calc(var(--twc-radius-xl)+0.25rem)] border border-[color:var(--twc-border-2)] bg-[color:var(--twc-surface-2)] p-6 shadow-[var(--twc-shadow-lg)] sm:p-8";
}

function diagnosticsClassName(mode: RouteBoundaryMode) {
	return mode === "preview"
		? "w-full rounded-[var(--twc-radius-lg)] border border-[color:var(--twc-border-2)] bg-[color:var(--twc-surface-1)] p-4 text-left"
		: "w-full rounded-[var(--twc-radius-lg)] border border-[color:var(--twc-border-2)] bg-[color:var(--twc-surface-1)] p-4 text-left";
}

export function RouteBoundaryScreen({
	variant,
	error,
	mode = "page",
	onRetry,
}: RouteBoundaryScreenProps) {
	const config = routeBoundaryConfig[variant];
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
				<code className="block whitespace-pre-wrap break-words text-xs text-[color:var(--twc-muted)]">
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
		<main className={screenShellClassName(mode)}>
			<div className={panelClassName(mode)}>
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
									variant="flat"
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
								variant={variant === "not-found" ? "flat" : "ghost"}
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
								variant="outline"
							>
								{isPreview ? "Preview" : "Live fallback"}
							</Badge>
						</div>

						{diagnosticItems.length > 0 ? (
							<div className={diagnosticsClassName(mode)}>{diagnosticItems}</div>
						) : null}
					</div>
				</EmptyState>
			</div>
		</main>
	);
}
