import {
	ArrowRight,
	CheckCircle2,
	Compass,
	Download,
	Info,
	OctagonAlert,
	ShieldAlert,
	TriangleAlert,
} from "lucide-react";

export const DOCS_HOME_AREAS = [
	{
		href: "/docs/primitives",
		path: "/docs/primitives",
		title: "Primitive contracts",
		description:
			"Open this when the work is about variants, states, escalation boundaries, or shared interaction patterns.",
		badge: "System",
		tone: "info",
	},
	{
		href: "/docs/routing",
		path: "/docs/routing",
		title: "Route boundaries",
		description:
			"Open this when the work is about fallback scope, route-file ownership, and what the app should preserve when a page, segment, or shell fails.",
		badge: "Runtime",
		tone: "success",
	},
] as const;

export const DOCS_HOME_PREVIEWS = [
	{
		href: "/docs/routing/not-found",
		path: "/docs/routing/not-found",
		title: "Missing-route and missing-record fallback surface.",
	},
	{
		href: "/docs/routing/error",
		path: "/docs/routing/error",
		title: "Segment-level runtime error surface with retry-focused recovery.",
	},
	{
		href: "/docs/routing/global-error",
		path: "/docs/routing/global-error",
		title: "Root fallback mirror for shell-level catastrophic failures.",
	},
] as const;

export const DOCS_AREAS = [
	{
		href: "/docs/primitives",
		label: "Primitives",
		title: "Primitives",
		description:
			"Browse the shared primitive library, states, usage notes, and visual contracts.",
	},
	{
		href: "/docs/routing",
		label: "App Router",
		title: "Routing",
		description:
			"Review the implemented Next.js route boundaries and inspect their real preview screens.",
	},
] as const;

export const PRIMITIVE_AREA_KEYS = [
	"actions",
	"display",
	"forms",
	"navigation",
	"overlays",
	"structure",
] as const;

export const PRIMITIVE_SUMMARY_CARD_KEYS = [
	"organization",
	"patterns",
	"exploration",
] as const;

export const ROUTE_FILE_RECOMMENDATIONS = [
	{
		file: "not-found.tsx",
		status: "Implemented",
		tone: "success",
		summary: "Give missing routes and missing records a proper fallback.",
		reason:
			"This is the most broadly useful routing file. It improves broken links, bad URLs, and resource-level 404 states without needing parallel routes or advanced layout behavior.",
	},
	{
		file: "error.tsx",
		status: "Implemented",
		tone: "success",
		summary: "Add segment-level recovery for normal runtime failures.",
		reason:
			"This is the right boundary for app-area failures such as broken fetches, rendering exceptions, or unexpected client/server state issues inside a route segment.",
	},
	{
		file: "global-error.tsx",
		status: "Implemented",
		tone: "success",
		summary:
			"Cover failures that escape normal route-segment error boundaries.",
		reason:
			"Use a minimal global fallback for catastrophic layout-level failures. It should stay simple, branded, and able to recover with a hard refresh or a link back into the app.",
	},
	{
		file: "loading.tsx",
		status: "Implement when needed",
		tone: "warning",
		summary: "Use it only where the route actually suspends or streams data.",
		reason:
			"Loading files are worth adding on data-heavy pages, but they should follow real async boundaries. Adding them everywhere up front usually creates noise instead of better UX.",
	},
	{
		file: "template.tsx",
		status: "Skip for now",
		tone: "neutral",
		summary:
			"Only useful when you explicitly need remount-on-navigation behavior.",
		reason:
			"Templates reset state and effects on navigation. That is a specialized tool for things like per-navigation animations or deliberate state resets, not a default routing primitive.",
	},
	{
		file: "default.tsx",
		status: "Skip for now",
		tone: "neutral",
		summary: "Relevant only if the app adopts parallel routes.",
		reason:
			"This file exists to provide fallback content for unmatched parallel route slots. Without parallel routes, it adds no value and just increases maintenance surface.",
	},
] as const;

export const ROUTE_PREVIEW_CARDS = [
	{
		href: "/docs/routing/not-found",
		title: "not-found.tsx",
		tone: "success",
		label: "Live preview",
		description:
			"Renders the same 404 fallback UI used when a route or record does not resolve.",
		note: "Use this route to inspect missing-page and missing-record behavior without forcing a real broken link first.",
	},
	{
		href: "/docs/routing/error",
		title: "error.tsx",
		tone: "success",
		label: "Live preview",
		description:
			"Uses the implemented segment error boundary with retry-focused UI.",
		note: "This preview exists because real route failures are not a safe way to inspect the design contract during normal development.",
	},
	{
		href: "/docs/routing/global-error",
		title: "global-error.tsx",
		tone: "warning",
		label: "Visual preview",
		description:
			"Shows the same UI used by the root boundary. The real file only appears when the app shell itself fails.",
		note: "Treat this as a design mirror of the real root fallback, not a flow you should trigger manually in normal work.",
	},
] as const;

export const ROUTE_FILE_STATUS_TONE = {
	Implemented: "success",
	"Implement when needed": "warning",
	"Skip for now": "neutral",
} as const;

export const ROUTE_FILE_GROUPS = [
	"Implemented",
	"Implement when needed",
	"Skip for now",
] as const;

export const ROUTE_BOUNDARY_CONFIG = {
	"not-found": {
		code: "404",
		title: "This route does not exist.",
		description:
			"The page may have moved, the URL may be incorrect, or the route may not be available in the current app area.",
		icon: Compass,
		tone: "brand",
		previewNote: undefined,
	},
	error: {
		code: "500",
		title: "Something broke while rendering this route.",
		description:
			"The route failed before it could complete. Retry the current view or go back to a stable part of the app.",
		icon: TriangleAlert,
		tone: "warning",
		previewNote: undefined,
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
} as const;

export const BUTTON_PARTICLE_USAGE_ITEMS = [
	{ key: "primary", icon: ArrowRight },
	{ key: "secondary", icon: Download },
	{ key: "success", icon: CheckCircle2 },
	{ key: "info", icon: Info },
	{ key: "warning", icon: OctagonAlert },
	{ key: "danger", icon: ShieldAlert },
] as const;

export const TABLE_PARTICLE_STATUS_TONES = {
	active: "success",
	hold: "warning",
	planning: "info",
} as const;
