"use client";

import { useEffect, useRef, useState } from "react";

import { ScrollArea } from "@/components";
import { SIDEBAR_STORAGE_KEY } from "@/constants/navigation";
import { RouteBreadcrumbs } from "@/features/app-shell/RouteBreadcrumbs";
import { Sidebar } from "@/features/app-shell/Sidebar";
import { TopBar } from "@/features/app-shell/Topbar";

export function Navbar({ children }: { children: React.ReactNode }) {
	const [collapsed, setCollapsed] = useState(true);
	const topbarRef = useRef<HTMLDivElement | null>(null);
	const sidebarRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const saved = localStorage.getItem(SIDEBAR_STORAGE_KEY);
		if (saved) setCollapsed(saved === "1");
	}, []);
	useEffect(() => {
		localStorage.setItem(SIDEBAR_STORAGE_KEY, collapsed ? "1" : "0");
	}, [collapsed]);
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
	}, [collapsed]);

	return (
		<div className="navbar-shell">
			<div ref={topbarRef}>
				<TopBar
					collapsed={collapsed}
					onToggleSidebar={() => setCollapsed(v => !v)}
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
