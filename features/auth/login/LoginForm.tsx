"use client";

import { useState, useSyncExternalStore, useTransition } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

import * as web from "@/api/web";
import { WebApiError } from "@/api/web";
import {
	Button,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	Icon,
	Input,
	Label,
	toast,
} from "@/components/primitives";
import { HOME_ROUTE } from "@/constants";
import { useTheme } from "@/contexts";
import {
	getSystemThemeSnapshot,
	subscribeToSystemTheme,
} from "@/features/auth/login/utils";
import { useLocalizedZodForm } from "@/hooks";
import { createLoginFormSchema } from "@/schemas/client";
import type { LoginFormProps, LoginFormValues } from "@/types/client";

const { auth: authApi } = web.identity;
const { login } = authApi;

export function LoginForm({ panelRef }: LoginFormProps) {
	const { t } = useTranslation();
	const router = useRouter();
	const { mode } = useTheme();
	const [isPending, startTransition] = useTransition();
	const isSystemDark = useSyncExternalStore(
		subscribeToSystemTheme,
		getSystemThemeSnapshot,
		() => false,
	);
	const isDark = mode === "dark" || (mode === "system" && isSystemDark);
	const [error, setError] = useState<string | null>(null);
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useLocalizedZodForm<LoginFormValues>({
		schemaFactory: createLoginFormSchema,
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

				toast.success(t("auth.login.feedback.success"));
				router.replace(HOME_ROUTE);
				router.refresh();
			} catch (submitError) {
				const message =
					submitError instanceof WebApiError
						? submitError.message
						: t("auth.login.feedback.error");

				setError(message);
				toast.danger(message);
			}
		});
	}

	return (
		<div className="login-form-shell">
			<div ref={panelRef}>
				<Card className="login-card">
					<CardHeader className="login-card-copy">
						<div className="login-card-brand">
							<div className="login-card-brand-mark">
								<Image
									src={
										isDark
											? "/assets/brand/pug-logo-inverted.svg"
											: "/assets/brand/pug-logo.svg"
									}
									alt={t("auth.login.brand.name")}
									width={28}
									height={28}
									priority
								/>
							</div>
							<div>
								<p className="ty-sm-semibold">{t("auth.login.brand.name")}</p>
								<p className="ty-sm text-[color:var(--twc-muted)]">
									{t("auth.login.brand.subtitle")}
								</p>
							</div>
						</div>
						<div className="space-y-2">
							<CardTitle className="login-card-title">
								{t("auth.login.form.title")}
							</CardTitle>
							<CardDescription className="login-card-description">
								{t("auth.login.form.description")}
							</CardDescription>
						</div>
					</CardHeader>

					<CardContent className="login-card-content">
						<form
							className="login-form-grid"
							noValidate
							onSubmit={handleSubmit(onSubmit)}
						>
							<div className="login-field">
								<Label htmlFor="email">
									{t("auth.login.form.fields.email.label")}
								</Label>
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
									placeholder={t("auth.login.form.fields.email.placeholder")}
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
								<Label htmlFor="password">
									{t("auth.login.form.fields.password.label")}
								</Label>
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
									aria-describedby={
										errors.password ? "password-error" : undefined
									}
									aria-invalid={errors.password ? "true" : "false"}
									placeholder={t("auth.login.form.fields.password.placeholder")}
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
								trailingIcon={
									<Icon
										icon={ArrowRight}
										className="h-4 w-4"
									/>
								}
							>
								{isPending
									? t("auth.login.form.submitPending")
									: t("auth.login.form.submit")}
							</Button>
						</form>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
