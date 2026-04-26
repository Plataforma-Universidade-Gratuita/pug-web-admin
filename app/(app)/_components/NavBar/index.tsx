"use client";

import { useEffect, useState } from "react";

import { RouteBreadcrumbs } from "@/app/(app)/_components/NavBar/RouteBreadcrumbs";
import { Sidebar } from "@/app/(app)/_components/NavBar/Sidebar";
import { TopBar } from "@/app/(app)/_components/NavBar/Topbar";
import { SIDEBAR_STORAGE_KEY } from "@/constants/navigation";

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
