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
			<div
				className="pointer-events-none absolute inset-0"
				style={{
					background:
						"radial-gradient(circle at top left, color-mix(in oklab, var(--color-brand) 20%, transparent), transparent 28%), radial-gradient(circle at bottom right, color-mix(in oklab, var(--color-brand) 14%, transparent), transparent 24%)",
				}}
			/>

			<div className="grid min-h-[calc(100dvh-8rem)] gap-8 p-4 sm:p-6 lg:grid-cols-[1.15fr_0.85fr] lg:p-8">
				<div
					className="flex flex-col justify-between gap-8 rounded-[calc(var(--twc-radius-squircle)+0.25rem)] border p-6 shadow-lg sm:p-8"
					style={{
						borderColor:
							"color-mix(in oklab, var(--color-base-50) 10%, transparent)",
						background:
							"linear-gradient(140deg, color-mix(in oklab, var(--twc-surface-1) 74%, var(--color-brand)), color-mix(in oklab, var(--twc-surface-1) 82%, black))",
						color: "var(--color-base-50)",
					}}
				>
					<div className="space-y-5">
						<div
							className="inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium"
							style={{
								borderColor:
									"color-mix(in oklab, var(--color-base-50) 14%, transparent)",
								backgroundColor:
									"color-mix(in oklab, var(--color-base-50) 8%, transparent)",
								color:
									"color-mix(in oklab, var(--color-base-50) 80%, transparent)",
							}}
						>
							<ShieldCheck className="h-4 w-4" />
							Admin access
						</div>

						<div className="space-y-3">
							<p
								className="text-sm font-medium tracking-[0.28em] uppercase"
								style={{
									color:
										"color-mix(in oklab, var(--color-base-50) 56%, transparent)",
								}}
							>
								PUG Web Admin
							</p>
							<h1 className="max-w-md text-4xl leading-tight font-semibold text-balance sm:text-5xl">
								Sign in to manage sessions, people, and project data.
							</h1>
							<p
								className="max-w-xl text-base leading-7"
								style={{
									color:
										"color-mix(in oklab, var(--color-base-50) 72%, transparent)",
								}}
							>
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
								className="rounded-2xl border p-4 text-sm leading-6 backdrop-blur-sm"
								style={{
									borderColor:
										"color-mix(in oklab, var(--color-base-50) 12%, transparent)",
									backgroundColor:
										"color-mix(in oklab, var(--color-base-50) 7%, transparent)",
									color:
										"color-mix(in oklab, var(--color-base-50) 74%, transparent)",
								}}
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
									className="field-base focus-ring w-full"
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
								<div className="border-default-2 focus-ring flex items-center rounded-2xl border transition-colors">
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
										className="mr-2 inline-flex h-10 w-10 items-center justify-center rounded-full text-[color:var(--twc-muted)] transition hover:bg-[color:var(--twc-surface-2)] hover:text-[color:var(--twc-text)]"
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
								className="btn-primary focus-ring inline-flex w-full items-center justify-center gap-2"
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
