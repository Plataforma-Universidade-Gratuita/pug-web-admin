import type { RouteBoundaryMode } from "@/types";

export function getRouteBoundaryScreenShellClassName(mode: RouteBoundaryMode) {
	if (mode === "full") {
		return "flex min-h-dvh items-center justify-center p-6 sm:p-8";
	}

	if (mode === "preview") {
		return "flex min-h-[34rem] items-center justify-center p-4";
	}

	return "flex min-h-[70vh] items-center justify-center p-6";
}

export function getRouteBoundaryPanelClassName(mode: RouteBoundaryMode) {
	return mode === "preview"
		? "w-full max-w-4xl rounded-[calc(var(--twc-radius-xl)+0.25rem)] border border-[color:var(--twc-border-2)] bg-[color:var(--twc-surface-2)] p-4 shadow-[var(--twc-shadow-lg)] sm:p-6"
		: "w-full max-w-3xl rounded-[calc(var(--twc-radius-xl)+0.25rem)] border border-[color:var(--twc-border-2)] bg-[color:var(--twc-surface-2)] p-6 shadow-[var(--twc-shadow-lg)] sm:p-8";
}

export function getRouteBoundaryDiagnosticsClassName(mode: RouteBoundaryMode) {
	return mode === "preview"
		? "w-full rounded-[var(--twc-radius-lg)] border border-[color:var(--twc-border-2)] bg-[color:var(--twc-surface-1)] p-4 text-left"
		: "w-full rounded-[var(--twc-radius-lg)] border border-[color:var(--twc-border-2)] bg-[color:var(--twc-surface-1)] p-4 text-left";
}
