"use client";

import { useEffect, useState } from "react";

import { SIDEBAR_STORAGE_KEY } from "@/constants/navigation";
import { RouteBreadcrumbs } from "@/features/app-shell/RouteBreadcrumbs";
import { Sidebar } from "@/features/app-shell/Sidebar";
import { TopBar } from "@/features/app-shell/Topbar";

export function Navbar({ children }: { children: React.ReactNode }) {
	const [collapsed, setCollapsed] = useState(true);

	useEffect(() => {
		const saved = localStorage.getItem(SIDEBAR_STORAGE_KEY);
		if (saved) setCollapsed(saved === "1");
	}, []);
	useEffect(() => {
		localStorage.setItem(SIDEBAR_STORAGE_KEY, collapsed ? "1" : "0");
	}, [collapsed]);

	return (
		<div className="navbar-shell">
			<TopBar
				collapsed={collapsed}
				onToggleSidebar={() => setCollapsed(v => !v)}
			/>
			<div className="navbar-main">
				<Sidebar collapsed={collapsed} />
				<main className="navbar-content">
					<div className="navbar-content-inner">
						<div className="space-y-6">
							<RouteBreadcrumbs />
							{children}
						</div>
					</div>
				</main>
			</div>
		</div>
	);
}
