"use client";

import { useEffect, useState, useTransition } from "react";

import { useRouter } from "next/navigation";

import { useQueryClient } from "@tanstack/react-query";
import { KeyRound } from "lucide-react";
import { useTranslation } from "react-i18next";

import * as web from "@/api/web";
import { WebApiError } from "@/api/web";
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	Button,
	Icon,
	Input,
	Label,
	toast,
} from "@/components/primitives";
import { useLocalizedZodForm } from "@/hooks";
import { createWireCredentialsFormSchema } from "@/schemas/client";
import type {
	WireCredentialsDialogProps,
	WireCredentialsFormValues,
} from "@/types/client";

const { auth: authApi } = web.identity;
const { admins: adminsApi } = web.identity;
const { wireCredentials } = authApi;
const { useCurrentAdminQuery } = adminsApi;

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
	const currentAdminQuery = useCurrentAdminQuery();
	const currentEmail =
		currentAdminQuery.data?.accountResponse.email?.trim() ?? "";
	const {
		register,
		handleSubmit,
		reset,
		setValue,
		formState: { errors },
	} = useLocalizedZodForm<WireCredentialsFormValues>({
		schemaFactory: createWireCredentialsFormSchema,
		defaultValues: {
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	useEffect(() => {
		if (!currentEmail) {
			return;
		}

		setValue("email", currentEmail, {
			shouldDirty: false,
			shouldTouch: false,
			shouldValidate: true,
		});
	}, [currentEmail, setValue]);

	function onSubmit(values: WireCredentialsFormValues) {
		setError(null);
		if (!currentEmail) {
			const message = t("auth.login.wireCredentials.feedback.error");
			setError(message);
			toast.danger(message);
			return;
		}

		const password = values.password?.trim() ?? "";

		startTransition(async () => {
			try {
				await wireCredentials({
					email: currentEmail,
					password,
				});

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
						reset({
							email: currentEmail,
							password: "",
							confirmPassword: "",
						});
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
									disabled
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

					<AlertDialogFooter className="sm:flex-nowrap">
						<Button
							type="button"
							variant="secondary"
							className="ml-auto"
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
							disabled={currentAdminQuery.isLoading || !currentEmail}
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
					</AlertDialogFooter>
				</form>
			</AlertDialogContent>
		</AlertDialog>
	);
}
