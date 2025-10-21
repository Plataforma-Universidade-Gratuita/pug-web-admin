"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
	Home,
	Loader,
	MessageCircleX,
	Ban,
	CircleHelp as CircleQuestionMark,
} from "lucide-react";

import { MenuItem } from "./MenuItem";
import Settings from "./Settings";

const items = [
	{ href: "/", label: "Home", Icon: Home },
	{ href: "/error", label: "Error", Icon: MessageCircleX },
	{ href: "/loading", label: "Loading", Icon: Loader },
	{ href: "/not-found", label: "Not Found", Icon: CircleQuestionMark },
	{ href: "/forbidden", label: "Forbidden", Icon: Ban },
];

type Props = { collapsed: boolean };

export function Sidebar({ collapsed }: Props) {
	const pathname = usePathname();

	return (
		<aside
			data-collapsed={collapsed}
			className={[
				"surface-2 border-r border-neutral-200 dark:border-neutral-800",
				"sticky top-16 h-[calc(100dvh-4rem)]",
				"flex flex-col",
				"w-16 transition-[width] duration-200 data-[collapsed=false]:w-56",
			].join(" ")}
			aria-label="Primary"
		>
			<nav className="mt-2 min-h-0 flex-1 overflow-y-auto px-2">
				<ul className="flex flex-col gap-2">
					{items.map(({ href, label, Icon }) => {
						const active = pathname === href || pathname.startsWith(href + "/");
						return (
							<MenuItem
								key={href}
								collapsed={collapsed}
								href={href}
								label={label}
								Icon={Icon}
								active={active}
							/>
						);
					})}
				</ul>
			</nav>
			{!collapsed ? <Settings /> : <Settings compact />}
		</aside>
	);
}
