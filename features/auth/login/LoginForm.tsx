"use client";

import { useState, useTransition } from "react";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";

import { login } from "@/api/web/identity/auth";
import { Button, Icon, Input, Label, toast } from "@/components";
import { HOME_ROUTE } from "@/constants/auth";
import { LoginFormSchema } from "@/schemas/client";
import type { LoginFormValues } from "@/types/client";
import { WebApiError } from "@/utils/web-api";

export function LoginForm() {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const [error, setError] = useState<string | null>(null);
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormValues>({
		resolver: zodResolver(LoginFormSchema),
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
				toast.danger(message);
			}
		});
	}

	return (
		<div className="login-form-shell">
			<div className="login-card">
				<div className="login-card-copy">
					<div className="login-card-brand">
						<div className="login-card-brand-mark">
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
					<h2 className="login-card-title">Login</h2>
					<p className="login-card-description">
						Enter your administrator credentials to continue.
					</p>
				</div>

				<form
					className="login-form-grid"
					noValidate
					onSubmit={handleSubmit(onSubmit)}
				>
					<div className="login-field">
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
								className="login-field-error"
							>
								{errors.email.message}
							</p>
						) : null}
					</div>

					<div className="login-field">
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
								className="login-field-error"
							>
								{errors.password.message}
							</p>
						) : null}
					</div>

					{error ? <p className="login-form-error">{error}</p> : null}

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
