"use client";

import { useState, useTransition } from "react";

import { useRouter } from "next/navigation";

import { useQueryClient } from "@tanstack/react-query";
import { KeyRound } from "lucide-react";
import { useTranslation } from "react-i18next";

import { web } from "@/api";
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogHeader,
	AlertDialogTitle,
	Button,
	Footer,
	Icon,
	Input,
	Label,
	toast,
} from "@/components";
import { writePasswordWiredCookie } from "@/features/app-shell/utils";
import { useLocalizedZodForm } from "@/hooks";
import { createWireCredentialsFormSchema } from "@/schemas";
import type {
	WireCredentialsDialogProps,
	WireCredentialsFormValues,
} from "@/types";
import { WebApiError } from "@/utils";

const { auth: authApi } = web.identity;
const { wireCredentials } = authApi;

export function WireCredentialsDialog({
	open,
	onOpenChange,
	onWired,
}: WireCredentialsDialogProps) {
	const { t } = useTranslation();
	const router = useRouter();
	const queryClient = useQueryClient();
	const [isPending, startTransition] = useTransition();
	const [error, setError] = useState<string | null>(null);
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useLocalizedZodForm<WireCredentialsFormValues>({
		schemaFactory: createWireCredentialsFormSchema,
		defaultValues: {
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	function onSubmit(values: WireCredentialsFormValues) {
		setError(null);

		startTransition(async () => {
			try {
				await wireCredentials({
					email: values.email.trim(),
					password: values.password.trim(),
				});

				writePasswordWiredCookie(true);
				await queryClient.invalidateQueries();
				onWired();
				reset();
				toast.success(t("auth.login.wireCredentials.feedback.success"));
				router.refresh();
			} catch (submitError) {
				const message =
					submitError instanceof WebApiError
						? submitError.message
						: t("auth.login.wireCredentials.feedback.error");

				setError(message);
				toast.danger(message);
			}
		});
	}

	return (
		<AlertDialog
			open={open}
			onOpenChange={nextOpen => {
				if (!isPending) {
					if (!nextOpen) {
						reset();
						setError(null);
					}
					onOpenChange(nextOpen);
				}
			}}
		>
			<AlertDialogContent className="sm:max-w-[42rem]">
				<AlertDialogHeader overhead={t("auth.login.wireCredentials.overhead")}>
					<AlertDialogTitle>
						{t("auth.login.wireCredentials.title")}
					</AlertDialogTitle>
					<AlertDialogDescription>
						{t("auth.login.wireCredentials.description")}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<form
					className="space-y-4"
					noValidate
					onSubmit={handleSubmit(onSubmit)}
				>
					<div className="space-y-4 px-6">
						<div className="grid gap-4">
							<div>
								<Label htmlFor="wire-email">
									{t("auth.login.wireCredentials.fields.email.label")}
								</Label>
								<Input
									id="wire-email"
									type="email"
									autoComplete="email"
									{...register("email", {
										onChange: () => {
											if (error) setError(null);
										},
									})}
									aria-describedby={
										errors.email ? "wire-email-error" : undefined
									}
									aria-invalid={errors.email ? "true" : "false"}
									placeholder={t(
										"auth.login.wireCredentials.fields.email.placeholder",
									)}
								/>
								{errors.email ? (
									<p
										id="wire-email-error"
										className="login-field-error"
									>
										{errors.email.message}
									</p>
								) : null}
							</div>
							<div>
								<Label htmlFor="wire-password">
									{t("auth.login.wireCredentials.fields.password.label")}
								</Label>
								<Input
									id="wire-password"
									type="password"
									autoComplete="new-password"
									showPasswordToggle
									{...register("password", {
										onChange: () => {
											if (error) setError(null);
										},
									})}
									aria-describedby={
										errors.password ? "wire-password-error" : undefined
									}
									aria-invalid={errors.password ? "true" : "false"}
									placeholder={t(
										"auth.login.wireCredentials.fields.password.placeholder",
									)}
								/>
								{errors.password ? (
									<p
										id="wire-password-error"
										className="login-field-error"
									>
										{errors.password.message}
									</p>
								) : null}
							</div>
							<div>
								<Label htmlFor="wire-confirm-password">
									{t("auth.login.wireCredentials.fields.confirmPassword.label")}
								</Label>
								<Input
									id="wire-confirm-password"
									type="password"
									autoComplete="new-password"
									showPasswordToggle
									{...register("confirmPassword", {
										onChange: () => {
											if (error) setError(null);
										},
									})}
									aria-describedby={
										errors.confirmPassword
											? "wire-confirm-password-error"
											: undefined
									}
									aria-invalid={errors.confirmPassword ? "true" : "false"}
									placeholder={t(
										"auth.login.wireCredentials.fields.confirmPassword.placeholder",
									)}
								/>
								{errors.confirmPassword ? (
									<p
										id="wire-confirm-password-error"
										className="login-field-error"
									>
										{errors.confirmPassword.message}
									</p>
								) : null}
							</div>
						</div>

						{error ? <p className="login-form-error">{error}</p> : null}
					</div>

					<Footer className="alert-dialog-footer dialog-footer px-6 pb-6 sm:flex-nowrap">
						<Button
							type="button"
							variant="secondary"
							disabled={isPending}
							onClick={() => {
								reset();
								setError(null);
								onOpenChange(false);
							}}
						>
							{t("auth.login.wireCredentials.actions.dismiss")}
						</Button>
						<Button
							type="submit"
							usage="danger"
							variant="secondary"
							className="whitespace-nowrap"
							isLoading={isPending}
							loadingText={t("auth.login.wireCredentials.actions.pending")}
							leadingIcon={
								<Icon
									icon={KeyRound}
									className="h-4 w-4"
								/>
							}
						>
							{t("auth.login.wireCredentials.actions.submit")}
						</Button>
					</Footer>
				</form>
			</AlertDialogContent>
		</AlertDialog>
	);
}
