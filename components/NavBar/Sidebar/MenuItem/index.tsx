"use client";

import type { ForwardRefExoticComponent, RefAttributes } from "react";

import Link from "next/link";

import type { LucideProps } from "lucide-react";
import { useTranslation } from "react-i18next";

type Props = {
	collapsed: boolean;
	href: string;
	label: string;
	Icon: ForwardRefExoticComponent<
		Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
	>;
	active: boolean;
};

export function MenuItem({ collapsed, href, label, Icon, active }: Props) {
	const { t } = useTranslation();
	return (
		<li key={href}>
			<Link
				href={href}
				title={t(label)}
				aria-current={active ? "page" : undefined}
				className={[
					"group relative flex h-10 w-full items-center",
					"gap-2 rounded-2xl px-[0.725rem]",
					"surface-2 hover:surface-3 shadow-weak no-underline transition-colors",
					active
						? "bg-[color:color-mix(in_oklab,var(--color-brand)_12%,transparent)] cursor-default"
						: "",
				].join(" ")}
				onClick={e => {
					if (active) {
						e.preventDefault();
						return;
					}
				}}
			>
				<Icon
					size={20}
					strokeWidth={2}
					className={`shrink-0 ${active ? "fill-[color:color-mix(in_oklab,var(--color-brand)_18%,transparent)] stroke-brand" : "text-base-800"}`}
				/>
				{!collapsed && (
					<span
						className={[
							"ty-sm truncate",
							"data-[collapsed=false]:inline",
							active ? "text-brand font-semibold" : "",
						].join(" ")}
					>
						{t(label)}
					</span>
				)}
			</Link>
		</li>
	);
}
