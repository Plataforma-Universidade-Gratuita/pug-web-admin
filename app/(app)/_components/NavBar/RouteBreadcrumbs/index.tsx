"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
	Breadcrumb,
	BreadcrumbCurrent,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbSeparator,
} from "@/components";
import { APP_ROUTE_LABELS } from "@/constants/navigation";
import type { RouteBreadcrumbEntry } from "@/types/client";

function formatRouteSegmentLabel(segment: string) {
	return segment
		.split("-")
		.map(part => part.charAt(0).toUpperCase() + part.slice(1))
		.join(" ");
}

function getRouteBreadcrumbs(pathname: string): RouteBreadcrumbEntry[] {
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
		const label = APP_ROUTE_LABELS[href] ?? formatRouteSegmentLabel(segment);

		items.push({
			href,
			label,
			current: isCurrent,
		});
	}

	return items;
}

export function RouteBreadcrumbs() {
	const pathname = usePathname();
	const items = getRouteBreadcrumbs(pathname);

	if (items.length === 0) {
		return null;
	}

	return (
		<div className="app-route-breadcrumbs">
			<Breadcrumb className="app-route-breadcrumbs-shell">
				<BreadcrumbList>
					{items.map(item => (
						<BreadcrumbItem key={item.href}>
							{item.current ? (
								<BreadcrumbCurrent>{item.label}</BreadcrumbCurrent>
							) : (
								<>
									<Link
										href={item.href}
										className="breadcrumb-link"
									>
										{item.label}
									</Link>
									<BreadcrumbSeparator />
								</>
							)}
						</BreadcrumbItem>
					))}
				</BreadcrumbList>
			</Breadcrumb>
		</div>
	);
}
