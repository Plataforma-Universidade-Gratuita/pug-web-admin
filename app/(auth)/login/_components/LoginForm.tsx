"use client";

import { useState, useTransition } from "react";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { login } from "@/api/web/identity/auth";
import { Button } from "@/components/ui/Button";
import { HOME_ROUTE } from "@/constants/auth";
import { WebApiError } from "@/utils/web-api";

const loginSchema = z.object({
	email: z.email("Enter a valid email address."),
	password: z.string().min(1, "Enter your password."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	function onSubmit(values: LoginFormValues) {
		setError(null);

		startTransition(async () => {
			try {
				await login({
					email: values.email.trim(),
					password: values.password,
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
					noValidate
					onSubmit={handleSubmit(onSubmit)}
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
							{...register("email", {
								onChange: () => {
									if (error) setError(null);
								},
							})}
							aria-describedby={errors.email ? "email-error" : undefined}
							aria-invalid={errors.email ? "true" : "false"}
							className="field-base focus-ring w-full"
							placeholder="admin@pug.edu.br"
						/>
						{errors.email ? (
							<p
								id="email-error"
								className="text-sm text-[color:var(--color-danger-700)]"
							>
								{errors.email.message}
							</p>
						) : null}
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
								{...register("password", {
									onChange: () => {
										if (error) setError(null);
									},
								})}
								aria-describedby={
									errors.password ? "password-error" : undefined
								}
								aria-invalid={errors.password ? "true" : "false"}
								className="w-full bg-transparent px-4 py-3 text-base text-[color:var(--twc-text)] outline-none"
								placeholder="Enter your password"
							/>
							<button
								type="button"
								onClick={() => setShowPassword(current => !current)}
								className="mr-2 inline-flex h-10 w-10 items-center justify-center rounded-full text-[color:var(--twc-muted)] transition hover:bg-[color:var(--twc-surface-2)] hover:text-[color:var(--twc-text)]"
								aria-label={showPassword ? "Hide password" : "Show password"}
							>
								{showPassword ? (
									<EyeOff className="h-4 w-4" />
								) : (
									<Eye className="h-4 w-4" />
								)}
							</button>
						</div>
						{errors.password ? (
							<p
								id="password-error"
								className="text-sm text-[color:var(--color-danger-700)]"
							>
								{errors.password.message}
							</p>
						) : null}
					</div>

					{error ? (
						<p className="rounded-2xl border border-[color:var(--color-danger-200)] bg-[color:var(--color-danger-50)] px-4 py-3 text-sm text-[color:var(--color-danger-700)]">
							{error}
						</p>
					) : null}

					<Button
						type="submit"
						isLoading={isPending}
						className="w-full"
					>
						{isPending ? "Signing in..." : "Continue"}
						<ArrowRight className="h-4 w-4" />
					</Button>
				</form>
			</div>
		</div>
	);
}
