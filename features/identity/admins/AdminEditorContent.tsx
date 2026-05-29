"use client";

import { useEffect, useMemo, useRef } from "react";

import { Controller, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";

import {
	Badge,
	Input,
	Label,
	NotFoundState,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SomeErrorState,
	Switch,
	TabsContent,
} from "@/components";
import {
	getAccountTypeLabel,
	getAccountTypeTone,
} from "@/features/identity/accounts/utils";
import { findAdminExistingUserByCpf } from "@/features/identity/admins/utils";
import { AdminUserTab } from "@/features/identity/admins/AdminUserTab";
import type { AdminEditorContentProps } from "@/types";
import { WebApiError } from "@/utils";

export function AdminEditorContent({
	admin,
	adminError,
	canRenderForm,
	campusOptions,
	existingUsers,
	form,
	linkedAccount,
	linkedAccountError,
	linkedUser,
	linkedUserError,
	mode,
	onRefreshAccount,
	onRefreshAdmin,
	onRefreshUser,
}: AdminEditorContentProps) {
	const { t } = useTranslation();
	const isCreateMode = mode === "create";
	const watchedCpf = useWatch({
		control: form.control,
		name: "cpf",
	});
	const matchedExistingUser = useMemo(
		() => findAdminExistingUserByCpf(existingUsers, watchedCpf ?? ""),
		[existingUsers, watchedCpf],
	);
	const lastAutoFilledNameRef = useRef<string | null>(null);

	useEffect(() => {
		if (!isCreateMode) {
			return;
		}

		if (matchedExistingUser) {
			if (form.getValues("name") !== matchedExistingUser.name) {
				form.setValue("name", matchedExistingUser.name, {
					shouldDirty: true,
					shouldValidate: true,
				});
			}

			lastAutoFilledNameRef.current = matchedExistingUser.name;
			return;
		}

		if (
			lastAutoFilledNameRef.current &&
			form.getValues("name") === lastAutoFilledNameRef.current
		) {
			form.setValue("name", "", {
				shouldDirty: true,
				shouldValidate: true,
			});
		}

		lastAutoFilledNameRef.current = null;
	}, [form, isCreateMode, matchedExistingUser]);

	if (!isCreateMode && adminError) {
		if (adminError instanceof WebApiError && adminError.status === 404) {
			return (
				<NotFoundState
					title={t("identity.adminPage.update.notFound.title")}
					description={t("identity.adminPage.update.notFound.description")}
				/>
			);
		}

		return (
			<SomeErrorState
				title={t("identity.adminPage.update.loadError.title")}
				description={t("identity.adminPage.update.loadError.description")}
				onRefresh={onRefreshAdmin}
			/>
		);
	}

	if (linkedAccountError) {
		if (
			linkedAccountError instanceof WebApiError &&
			linkedAccountError.status === 404
		) {
			return (
				<NotFoundState
					title={t("identity.adminPage.update.accountNotFound.title")}
					description={t(
						"identity.adminPage.update.accountNotFound.description",
					)}
				/>
			);
		}

		return (
			<SomeErrorState
				title={t("identity.adminPage.update.accountLoadError.title")}
				description={t(
					"identity.adminPage.update.accountLoadError.description",
				)}
				onRefresh={onRefreshAccount}
			/>
		);
	}

	if (!canRenderForm || (!isCreateMode && !admin)) {
		return (
			<NotFoundState title={t("identity.adminPage.update.notFound.title")} />
		);
	}

	const accountTypeLabel = isCreateMode
		? getAccountTypeLabel(t, "ADMIN")
		: linkedAccount
			? getAccountTypeLabel(t, linkedAccount.accountType)
			: undefined;
	const accountTypeTone =
		isCreateMode || !linkedAccount
			? "warning"
			: getAccountTypeTone(linkedAccount.accountType);

	return (
		<>
			<TabsContent
				value="profile"
				className="grid gap-4 pt-4"
			>
				<div className="grid gap-2">
					<Label htmlFor="admin-name">
						{t("identity.adminPage.update.fields.name")}
					</Label>
					<Input
						id="admin-name"
						{...form.register("name")}
						disabled={isCreateMode && matchedExistingUser != null}
						aria-describedby={
							form.formState.errors.name ? "admin-name-error" : undefined
						}
						aria-invalid={form.formState.errors.name ? "true" : "false"}
						placeholder={t("identity.adminPage.update.fields.namePlaceholder")}
					/>
					{isCreateMode ? (
						<p className="control-description">
							{matchedExistingUser
								? t("identity.adminPage.update.fields.nameLockedDescription")
								: t("identity.adminPage.update.fields.nameEditableDescription")}
						</p>
					) : null}
					{form.formState.errors.name ? (
						<p
							id="admin-name-error"
							className="field-error"
						>
							{form.formState.errors.name.message}
						</p>
					) : null}
				</div>

				<div className="grid gap-2">
					<Label htmlFor="admin-email">
						{t("identity.adminPage.update.fields.email")}
					</Label>
					<Input
						id="admin-email"
						type="email"
						{...form.register("email")}
						aria-describedby={
							form.formState.errors.email ? "admin-email-error" : undefined
						}
						aria-invalid={form.formState.errors.email ? "true" : "false"}
						placeholder={t("identity.adminPage.update.fields.email")}
					/>
					{form.formState.errors.email ? (
						<p
							id="admin-email-error"
							className="field-error"
						>
							{form.formState.errors.email.message}
						</p>
					) : null}
				</div>

				{isCreateMode ? (
					<div className="grid gap-2">
						<Label htmlFor="admin-cpf">
							{t("identity.adminPage.update.fields.cpf")}
						</Label>
						<Input
							id="admin-cpf"
							inputMode="numeric"
							list="admin-cpf-options"
							{...form.register("cpf")}
							aria-describedby={
								form.formState.errors.cpf ? "admin-cpf-error" : undefined
							}
							aria-invalid={form.formState.errors.cpf ? "true" : "false"}
							placeholder={t("identity.adminPage.update.fields.cpfPlaceholder")}
						/>
						<datalist id="admin-cpf-options">
							{existingUsers.map(user => (
								<option
									key={user.id}
									value={user.cpfFormatted}
								>
									{`${user.cpfFormatted} - ${user.name}`}
								</option>
							))}
						</datalist>
						{form.formState.errors.cpf ? (
							<p
								id="admin-cpf-error"
								className="field-error"
							>
								{form.formState.errors.cpf.message}
							</p>
						) : null}
					</div>
				) : null}

				{!isCreateMode ? (
					<div className="grid gap-2">
						<Label htmlFor="admin-password">
							{t("identity.adminPage.update.fields.password")}
						</Label>
						<Input
							id="admin-password"
							type="password"
							showPasswordToggle
							{...form.register("password")}
							aria-describedby={
								form.formState.errors.password
									? "admin-password-error"
									: undefined
							}
							aria-invalid={form.formState.errors.password ? "true" : "false"}
							placeholder={t(
								"identity.adminPage.update.fields.passwordPlaceholder",
							)}
						/>
						{form.formState.errors.password ? (
							<p
								id="admin-password-error"
								className="field-error"
							>
								{form.formState.errors.password.message}
							</p>
						) : null}
					</div>
				) : null}
			</TabsContent>

			<TabsContent
				value="access"
				className="grid gap-4 pt-4"
			>
				<div className="grid gap-2">
					<Label htmlFor="admin-campus">
						{t("identity.adminPage.update.fields.campus")}
					</Label>
					<Controller
						control={form.control}
						name="campus"
						render={({ field }) => (
							<Select
								value={field.value}
								onValueChange={field.onChange}
							>
								<SelectTrigger
									className="w-full"
									placeholder={t(
										"identity.adminPage.filters.campus.placeholder",
									)}
								/>
								<SelectContent>
									{campusOptions.map(option => (
										<SelectItem
											key={option.value}
											value={option.value}
										>
											{option.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						)}
					/>
					{form.formState.errors.campus ? (
						<p className="field-error">
							{form.formState.errors.campus.message}
						</p>
					) : null}
				</div>

				<div className="grid gap-2">
					<Label>{t("identity.adminPage.update.fields.accountType")}</Label>
					<div>
						<Badge
							className="min-h-5 px-2 py-0.5"
							tone={accountTypeTone}
							variant="primary"
						>
							{accountTypeLabel}
						</Badge>
					</div>
				</div>

				<Controller
					control={form.control}
					name="active"
					render={({ field }) => (
						<Switch
							checked={field.value}
							onCheckedChange={field.onChange}
							disabled={isCreateMode}
							label={t("identity.adminPage.update.fields.active")}
							description={
								isCreateMode
									? t("identity.adminPage.update.fields.activeDescription")
									: field.value
										? t("identity.adminPage.update.fields.activeValues.active")
										: t(
												"identity.adminPage.update.fields.activeValues.inactive",
											)
							}
						/>
					)}
				/>

				{!isCreateMode && admin ? (
					<div className="grid gap-1">
						<p className="ty-helper">
							{t("identity.adminPage.update.fields.grantedAt")}
						</p>
						<p className="ty-sm-semibold">{admin.grantedAtFormatted}</p>
					</div>
				) : null}
			</TabsContent>

			{!isCreateMode && admin ? (
				<AdminUserTab
					admin={admin}
					linkedUser={linkedUser}
					linkedUserError={linkedUserError}
					onRefreshUser={onRefreshUser}
				/>
			) : null}
		</>
	);
}
