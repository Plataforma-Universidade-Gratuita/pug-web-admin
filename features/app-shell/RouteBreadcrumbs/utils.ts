import { UNKNOWN_ROUTE_LABEL } from "@/constants";
import type { RouteBreadcrumbEntry } from "@/types";

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
		const label = routeLabels[href] ?? UNKNOWN_ROUTE_LABEL;

		items.push({
			href,
			label,
			current: isCurrent,
		});
	}

	return items;
}
