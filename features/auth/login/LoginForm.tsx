"use client";

import { useState, useTransition } from "react";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { HOME_ROUTE } from "constants/auth";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { login } from "@/api/web/identity/auth";
import { Button, Icon, Input, Label } from "@/components";
import { WebApiError } from "@/utils/web-api";

const loginSchema = z.object({
	email: z.email("Enter a valid email address."),
	password: z.string().min(1, "Enter your password."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
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
							<Icon
								icon={ShieldCheck}
								className="h-5 w-5 text-[color:var(--color-brand)]"
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
						<Label htmlFor="email">Email</Label>
						<Input
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
						<Label htmlFor="password">Password</Label>
						<Input
							id="password"
							type="password"
							autoComplete="current-password"
							showPasswordToggle
							{...register("password", {
								onChange: () => {
									if (error) setError(null);
								},
							})}
							aria-describedby={errors.password ? "password-error" : undefined}
							aria-invalid={errors.password ? "true" : "false"}
							placeholder="Enter your password"
						/>
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
						<Icon
							icon={ArrowRight}
							className="h-4 w-4"
						/>
					</Button>
				</form>
			</div>
		</div>
	);
}
