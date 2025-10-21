// components/NavBar/Sidebar/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
	Home,
	Loader,
	MessageCircleX,
	Ban,
	CircleHelp as CircleQuestionMark,
	Settings as SettingsIcon,
} from "lucide-react";

import Settings from "./Settings";

// components/NavBar/Sidebar/Sidebar.tsx

// components/NavBar/Sidebar/Sidebar.tsx

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
				"sticky top-14 h-[calc(100dvh-3.5rem)]",
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
									<span
										className={[
											"absolute top-1 bottom-1 left-0 w-1 rounded-r-full",
											active ? "bg-brand" : "bg-transparent",
										].join(" ")}
										aria-hidden
									/>
									<Icon
										size={18}
										className="shrink-0"
									/>
									<span
										className={[
											"ty-sm truncate",
											"hidden data-[collapsed=false]:inline",
										].join(" ")}
									>
										{label}
									</span>
									<span className="sr-only data-[collapsed=true]:inline">
										{label}
									</span>
								</Link>
							</li>
						);
					})}
				</ul>
			</nav>

			<div className="mt-auto p-2">
				<div className="br-squircle surface-2 shadow-weak p-2">
					<div className="mb-2 flex items-center gap-2">
						<SettingsIcon size={16} />
						{!collapsed && <span className="ty-sm-semibold">Settings</span>}
					</div>

					{collapsed ? <Settings compact /> : <Settings inline />}
				</div>
			</div>
		</aside>
	);
}
