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
import { getRouteBreadcrumbs } from "@/features/app-shell/RouteBreadcrumbs/utils";

export function RouteBreadcrumbs() {
	const pathname = usePathname();
	const items = getRouteBreadcrumbs(pathname, APP_ROUTE_LABELS);

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
