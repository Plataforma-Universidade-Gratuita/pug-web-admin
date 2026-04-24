"use client";

import { LoginForm } from "@/features/auth/login/LoginForm";
import { LoginHero } from "@/features/auth/login/LoginHero";

export default function Page() {
	return (
		<main className="surface-1 relative isolate min-h-dvh overflow-hidden">
			<div
				className="pointer-events-none absolute inset-0"
				style={{
					background:
						"radial-gradient(circle at top left, color-mix(in oklab, var(--color-brand) 18%, transparent), transparent 28%), radial-gradient(circle at bottom right, color-mix(in oklab, var(--color-brand) 12%, transparent), transparent 24%)",
				}}
			/>

			<div className="relative mx-auto grid min-h-dvh w-full max-w-7xl items-center gap-8 px-4 py-6 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-10">
				<LoginHero />
				<LoginForm />
			</div>
		</main>
	);
}
