"use client";

import { useEffect, useRef } from "react";

import { ScrollArea } from "@/components";
import { RouteBreadcrumbs } from "@/features/app-shell/RouteBreadcrumbs";
import { Sidebar } from "@/features/app-shell/Sidebar";
import { TopBar } from "@/features/app-shell/Topbar";
import { useAppShellStore } from "@/store";
import type { NavbarProps } from "@/types/client";

export function Navbar({ children }: NavbarProps) {
	const collapsed = useAppShellStore(state => state.collapsed);
	const setCollapsed = useAppShellStore(state => state.setCollapsed);
	const toggleCollapsed = useAppShellStore(state => state.toggleCollapsed);
	const topbarRef = useRef<HTMLDivElement | null>(null);
	const sidebarRef = useRef<HTMLDivElement | null>(null);
	useEffect(() => {
		if (collapsed) {
			return;
		}

		const onPointerDown = (event: PointerEvent) => {
			const target = event.target;
			if (!(target instanceof Node)) {
				return;
			}

			if (sidebarRef.current?.contains(target)) {
				return;
			}

			if (topbarRef.current?.contains(target)) {
				return;
			}

			setCollapsed(true);
		};

		document.addEventListener("pointerdown", onPointerDown);

		return () => {
			document.removeEventListener("pointerdown", onPointerDown);
		};
	}, [collapsed, setCollapsed]);

	return (
		<div className="navbar-shell">
			<div ref={topbarRef}>
				<TopBar
					collapsed={collapsed}
					onToggleSidebar={toggleCollapsed}
				/>
			</div>
			<div className="navbar-main">
				<div ref={sidebarRef}>
					<Sidebar collapsed={collapsed} />
				</div>
				<main className="navbar-content">
					<ScrollArea
						className="navbar-content-scroll"
						viewportClassName="navbar-content-scroll-viewport"
					>
						<div className="navbar-content-inner">
							<div className="space-y-6">
								<RouteBreadcrumbs />
								{children}
							</div>
						</div>
					</ScrollArea>
				</main>
			</div>
		</div>
	);
}
