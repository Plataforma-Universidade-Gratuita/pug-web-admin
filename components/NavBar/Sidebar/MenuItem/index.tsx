"use client";

import type { LucideProps } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ForwardRefExoticComponent, RefAttributes } from "react";

type Props = {
	collapsed: boolean;
	href: string;
	label: string;
	Icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
	active: boolean;
};

export function MenuItem({ 
	collapsed,
	href,
	label,
	Icon,
	active, 
}: Props) {
	const pathname = usePathname();
	return (
		<li key={href}>
			<Link
				href={href}
				title={label}
				aria-current={active ? "page" : undefined}
				className={[
					"group relative flex h-10 w-full items-center",
					"gap-3 rounded-2xl px-2",
					"surface-2 hover:surface-3 shadow-weak no-underline",
					active ? "surface-3" : "",
				].join(" ")}
			>
				<Icon
					size={20}
					strokeWidth={2}
					className={`shrink-0 ${active ? "fill-brand-700/25 stroke-brand-700" : ""}`}
				/>
				{!collapsed && (
					<span
						className={[
							"ty-sm truncate",
							"data-[collapsed=false]:inline",
							`${active ? "text-brand-700" : ""}`,
						].join(" ")}
					>
						{label}
					</span>
				)}
			</Link>
		</li>
	);
}
