"use client";

import { useEffect, useState } from "react";

import { Sidebar } from "@/components/NavBar/Sidebar";
import { TopBar } from "@/components/NavBar/Topbar";

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
		<div className="min-h-dvh">
			<TopBar
				collapsed={collapsed}
				onToggleSidebar={() => setCollapsed(v => !v)}
			/>
			<div className="flex">
				<Sidebar collapsed={collapsed} />
				<main className="mx-auto max-w-6xl min-w-0 flex-1 px-4 py-6">
					{children}
				</main>
			</div>
		</div>
	);
}
