"use client";

import { LoginForm } from "@/features/auth/login/LoginForm";
import { LoginHero } from "@/features/auth/login/LoginHero";

export default function Page() {
	return (
		<main className="login-page">
			<div className="login-page-content">
				<LoginHero />
				<LoginForm />
			</div>
		</main>
	);
}
