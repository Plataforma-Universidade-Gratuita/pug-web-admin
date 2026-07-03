"use client";

/*
 * Copyright (c) 2026 Mateus Fernandes and Plataforma Universidade Gratuita.
 * All rights reserved.
 *
 * This source code is proprietary and confidential. Unauthorized use,
 * copying, modification, distribution, or deployment is prohibited.
 */
import { FloatingPageSelectors } from "@/components/composite";
/*
 * Exception: app route wrappers import feature entries directly instead of
 * through the root features barrel to keep Next.js client/server boundaries
 * explicit during build collection.
 */
import { LoginForm } from "@/features/auth/login/LoginForm";
import { LoginHero } from "@/features/auth/login/LoginHero";

export default function Page() {
	return (
		<main className="login-page">
			<FloatingPageSelectors />
			<section className="login-page-content">
				<div className="login-page-panel login-page-panel-hero">
					<LoginHero />
				</div>
				<div className="login-page-panel login-page-panel-form">
					<LoginForm />
				</div>
			</section>
		</main>
	);
}
