"use client";

import { useEffect, useState } from "react";

import { Sidebar } from "app/(app)/_components/NavBar/Sidebar";
import { TopBar } from "app/(app)/_components/NavBar/Topbar";

export function Navbar({ children }: { children: React.ReactNode }) {
	const [collapsed, setCollapsed] = useState(true);

	useEffect(() => {
		const saved = localStorage.getItem("pug.sidebar");
		if (saved) setCollapsed(saved === "1");
	}, []);
	useEffect(() => {
		localStorage.setItem("pug.sidebar", collapsed ? "1" : "0");
	}, [collapsed]);

	return (
		<div className="flex h-dvh flex-col overflow-hidden">
			<TopBar
				collapsed={collapsed}
				onToggleSidebar={() => setCollapsed(v => !v)}
			/>
			<div className="flex min-h-0 flex-1 overflow-hidden">
				<Sidebar collapsed={collapsed} />
				<main className="min-w-0 flex-1 overflow-y-auto">
					<div className="mx-auto max-w-6xl px-4 py-6">{children}</div>
				</main>
			</div>
		</div>
	);
}
