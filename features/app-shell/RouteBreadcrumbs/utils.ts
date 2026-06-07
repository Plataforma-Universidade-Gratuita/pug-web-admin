import { UNKNOWN_ROUTE_LABEL } from "@/constants";
import type { RouteBreadcrumbEntry } from "@/types/client";

function isDynamicRouteSegment(segment: string) {
	return /^\[[^\]]+\]$/.test(segment);
}

function resolveRouteLabel(
	href: string,
	routeLabels: Record<string, string>,
): string {
	const exactLabel = routeLabels[href];
	if (exactLabel) {
		return exactLabel;
	}

	const hrefSegments = href.split("/").filter(Boolean);

	for (const [pattern, label] of Object.entries(routeLabels)) {
		const patternSegments = pattern.split("/").filter(Boolean);

		if (patternSegments.length !== hrefSegments.length) {
			continue;
		}

		const matches = patternSegments.every((patternSegment, index) => {
			const hrefSegment = hrefSegments[index];

			if (!hrefSegment) {
				return false;
			}

			return (
				isDynamicRouteSegment(patternSegment) || patternSegment === hrefSegment
			);
		});

		if (matches) {
			return label;
		}
	}

	return UNKNOWN_ROUTE_LABEL;
}

export function getRouteBreadcrumbs(
	pathname: string,
	routeLabels: Record<string, string>,
): RouteBreadcrumbEntry[] {
	const normalizedPath = pathname === "/" ? "/" : pathname.replace(/\/$/, "");

	if (normalizedPath === "/") {
		return [];
	}

	const segments = normalizedPath.split("/").filter(Boolean);
	const items: RouteBreadcrumbEntry[] = [];

	for (let index = 0; index < segments.length; index += 1) {
		const segment = segments[index];

		if (!segment) {
			continue;
		}

		const href = `/${segments.slice(0, index + 1).join("/")}`;
		const isCurrent = index === segments.length - 1;
		const label = resolveRouteLabel(href, routeLabels);

		items.push({
			href,
			label,
			current: isCurrent,
		});
	}

	return items;
}
