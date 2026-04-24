"use client";

import Link from "next/link";

import { useTranslation } from "react-i18next";

import type { MenuItemProps } from "@/types/client";

import { Icon as AppIcon } from "../../../../index";

export function MenuItem({
	collapsed,
	href,
	label,
	Icon,
	active,
}: MenuItemProps) {
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
						? "cursor-default bg-[color:color-mix(in_oklab,var(--color-brand)_12%,transparent)]"
						: "",
				].join(" ")}
				onClick={e => {
					if (active) {
						e.preventDefault();
						return;
					}
				}}
			>
				<AppIcon
					icon={Icon}
					size={20}
					strokeWidth={2}
					className={
						active
							? "stroke-brand fill-[color:color-mix(in_oklab,var(--color-brand)_18%,transparent)]"
							: "text-base-800"
					}
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
