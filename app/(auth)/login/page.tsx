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

	const securityHighlights = [
		"Administrator-only access",
		"Session continuity with secure cookies",
		"Token refresh handled automatically",
	];

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
				<div
					className="shadow-strong hidden min-h-[38rem] flex-col justify-between overflow-hidden rounded-[calc(var(--twc-radius-xl)+0.25rem)] border p-8 lg:flex"
					style={{
						borderColor: "color-mix(in oklab, white 12%, transparent)",
						background:
							"linear-gradient(155deg, color-mix(in oklab, var(--color-brand) 42%, #0f1115), #0f1115 58%, color-mix(in oklab, var(--color-brand) 16%, #0b0d10))",
						color: "rgba(255,255,255,0.96)",
					}}
				>
					<div className="space-y-6">
						<div
							className="inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5"
							style={{
								borderColor: "rgba(255,255,255,0.18)",
								backgroundColor: "color-mix(in oklab, white 7%, transparent)",
								color: "rgba(255,255,255,0.86)",
							}}
						>
							<ShieldCheck className="h-4 w-4" />
							Admin access
						</div>

						<p
							className="text-xs font-medium tracking-[0.32em] uppercase"
							style={{ color: "rgba(255,255,255,0.58)" }}
						>
							PUG Web Admin
						</p>
						<h1 className="max-w-xl text-5xl leading-[1.02] font-semibold tracking-[-0.04em] text-balance">
							Sign in to manage academic operations with clarity.
						</h1>
					</div>

					<div className="grid gap-3">
						{securityHighlights.map(item => (
							<div
								key={item}
								className="rounded-[var(--twc-radius-lg)] border px-4 py-3 text-sm leading-6 backdrop-blur-sm"
								style={{
									borderColor: "rgba(255,255,255,0.12)",
									backgroundColor: "color-mix(in oklab, white 6%, transparent)",
									color: "rgba(255,255,255,0.74)",
								}}
							>
								{item}
							</div>
						))}
					</div>
				</div>

				<div className="flex items-center justify-center">
					<div className="border-default-2 surface-2 shadow-strong w-full max-w-lg rounded-[calc(var(--twc-radius-xl)+0.25rem)] border p-6 sm:p-8">
						<div className="mb-8 space-y-4">
							<div className="flex items-center gap-3 lg:hidden">
								<div className="flex h-11 w-11 items-center justify-center rounded-[var(--twc-radius-lg)] bg-[color:color-mix(in_oklab,var(--color-brand)_16%,transparent)]">
									<ShieldCheck
										className="h-5 w-5"
										style={{ color: "var(--color-brand)" }}
									/>
								</div>
								<div>
									<p className="ty-sm-semibold">PUG Web Admin</p>
									<p className="ty-sm">Administrator access</p>
								</div>
							</div>
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
								<div className="border-default-2 surface-1 focus-ring flex items-center rounded-[var(--twc-radius-lg)] border transition-colors">
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
		</main>
	);
}
