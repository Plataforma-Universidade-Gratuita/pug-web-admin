import type { ReactNode } from "react";

export type PagePatternSlug =
	| "section-stack"
	| "operations-workspace"
	| "split-detail";

export interface PagePatternFrameProps {
	slug: PagePatternSlug;
}

export interface PageIntroSectionProps {
	eyebrow: string;
	tone: "brand" | "info" | "success";
	title: string;
	description: string;
	actions?: ReactNode;
	meta?: ReactNode;
	children?: ReactNode;
}

export interface RouteBoundaryPageProps {
	error: Error & { digest?: string };
	reset: () => void;
}

export type RouteBoundaryVariant = "not-found" | "error" | "global-error";
export type RouteBoundaryMode = "full" | "page" | "preview";

export interface RouteBoundaryScreenProps {
	variant: RouteBoundaryVariant;
	error?: Error & { digest?: string };
	mode?: RouteBoundaryMode;
	onRetry?: () => void;
}

export interface DocsTextLinkProps {
	children: ReactNode;
	className?: string;
	href: string;
}
