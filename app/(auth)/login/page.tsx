"use client";

import { useState, useTransition } from "react";

import { useRouter } from "next/navigation";

import { ArrowRight, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { login } from "@/api/web/identity/auth";
import { HOME_ROUTE } from "@/constants/auth";
import { WebApiError } from "@/utils/web-api";

export default function Page() {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [form, setForm] = useState({
		email: "",
		password: "",
	});

	function updateField(field: "email" | "password", value: string) {
		setForm(current => ({ ...current, [field]: value }));
		if (error) setError(null);
	}

	function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setError(null);

		startTransition(async () => {
			try {
				await login({
					email: form.email.trim(),
					password: form.password,
				});

				toast.success("Signed in successfully.");
				router.replace(HOME_ROUTE);
				router.refresh();
			} catch (submitError) {
				const message =
					submitError instanceof WebApiError
						? submitError.message
						: "Unable to sign in right now.";

				setError(message);
				toast.error(message);
			}
		});
	}

	return (
		<section className="br-squircle border-default-2 surface-2 shadow-normal relative isolate overflow-hidden border">
			<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(180,45,34,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(180,45,34,0.12),transparent_24%)]" />

			<div className="grid min-h-[calc(100dvh-8rem)] gap-8 p-4 sm:p-6 lg:grid-cols-[1.15fr_0.85fr] lg:p-8">
				<div className="flex flex-col justify-between gap-8 rounded-[calc(var(--twc-radius-squircle)+0.25rem)] border border-white/10 bg-[linear-gradient(140deg,rgba(18,18,18,0.92),rgba(59,19,15,0.88))] p-6 text-neutral-50 shadow-lg sm:p-8">
					<div className="space-y-5">
						<div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3 py-1.5 text-sm font-medium text-white/80">
							<ShieldCheck className="h-4 w-4" />
							Admin access
						</div>

						<div className="space-y-3">
							<p className="text-sm font-medium tracking-[0.28em] text-white/55 uppercase">
								PUG Web Admin
							</p>
							<h1 className="max-w-md text-4xl leading-tight font-semibold text-balance sm:text-5xl">
								Sign in to manage sessions, people, and project data.
							</h1>
							<p className="max-w-xl text-base leading-7 text-white/72">
								Use an administrator account. The session cookie flow is handled
								after authentication, so you only need to sign in once here.
							</p>
						</div>
					</div>

					<div className="grid gap-3 sm:grid-cols-3">
						{[
							"JWT validation for ADMIN accounts",
							"Refresh token rotation through middleware",
							"HTTP-only cookies for session continuity",
						].map(item => (
							<div
								key={item}
								className="rounded-2xl border border-white/12 bg-white/7 p-4 text-sm leading-6 text-white/75 backdrop-blur-sm"
							>
								{item}
							</div>
						))}
					</div>
				</div>

				<div className="flex items-center">
					<div className="border-default-2 shadow-strong mx-auto w-full max-w-md rounded-[calc(var(--twc-radius-squircle)+0.25rem)] border bg-[color:var(--twc-surface-3)] p-6 sm:p-8">
						<div className="mb-8 space-y-2">
							<h2 className="text-3xl leading-tight font-semibold text-[color:var(--twc-text)]">
								Login
							</h2>
							<p className="text-sm leading-6 text-[color:var(--twc-muted)]">
								Enter your administrator credentials to continue.
							</p>
						</div>

						<form
							className="space-y-5"
							onSubmit={handleSubmit}
						>
							<div className="space-y-2">
								<label
									htmlFor="email"
									className="block text-sm font-medium text-[color:var(--twc-text)]"
								>
									Email
								</label>
								<input
									id="email"
									type="email"
									autoComplete="email"
									required
									value={form.email}
									onChange={event => updateField("email", event.target.value)}
									className="border-default-2 w-full rounded-2xl border bg-transparent px-4 py-3 text-base text-[color:var(--twc-text)] transition outline-none focus:border-[color:var(--color-brand-400)] focus:ring-2 focus:ring-[color:var(--color-brand-100)]"
									placeholder="admin@pug.edu.br"
								/>
							</div>

							<div className="space-y-2">
								<label
									htmlFor="password"
									className="block text-sm font-medium text-[color:var(--twc-text)]"
								>
									Password
								</label>
								<div className="border-default-2 flex items-center rounded-2xl border focus-within:border-[color:var(--color-brand-400)] focus-within:ring-2 focus-within:ring-[color:var(--color-brand-100)]">
									<input
										id="password"
										type={showPassword ? "text" : "password"}
										autoComplete="current-password"
										required
										value={form.password}
										onChange={event =>
											updateField("password", event.target.value)
										}
										className="w-full bg-transparent px-4 py-3 text-base text-[color:var(--twc-text)] outline-none"
										placeholder="Enter your password"
									/>
									<button
										type="button"
										onClick={() => setShowPassword(current => !current)}
										className="mr-2 inline-flex h-10 w-10 items-center justify-center rounded-full text-[color:var(--twc-muted)] transition hover:bg-black/5 hover:text-[color:var(--twc-text)]"
										aria-label={
											showPassword ? "Hide password" : "Show password"
										}
									>
										{showPassword ? (
											<EyeOff className="h-4 w-4" />
										) : (
											<Eye className="h-4 w-4" />
										)}
									</button>
								</div>
							</div>

							{error ? (
								<p className="rounded-2xl border border-[color:var(--color-danger-200)] bg-[color:var(--color-danger-50)] px-4 py-3 text-sm text-[color:var(--color-danger-700)]">
									{error}
								</p>
							) : null}

							<button
								type="submit"
								disabled={isPending}
								className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[color:var(--color-brand-500)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[color:var(--color-brand-600)] disabled:cursor-not-allowed disabled:opacity-70"
							>
								{isPending ? "Signing in..." : "Continue"}
								<ArrowRight className="h-4 w-4" />
							</button>
						</form>
					</div>
				</div>
			</div>
		</section>
	);
}
