"use client";

import { useState } from "react";

import { Controller, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { WebApiError } from "@/api/web";
import {
	AccountSummaryBadges,
	CpfFormField,
	LinkedDetailsAccordion,
	UserDetailsContent,
} from "@/components/composite";
import {
	Input,
	Label,
	NotFoundState,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SomeErrorState,
} from "@/components/primitives";
import {
	getAccountTypeLabel,
	getAccountTypeTone,
} from "@/features/identity/accounts/utils";
import type {
	AdminEditorContentProps,
	CpfFormFieldExistingUser,
} from "@/types/client";

export function AdminEditorContent({
	admin,
	adminError,
	canRenderForm,
	campusOptions,
	existingUsers,
	form,
	linkedAccount,
	linkedAccountError,
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
	const [matchedExistingUser, setMatchedExistingUser] =
		useState<CpfFormFieldExistingUser | null>(null);

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

	if (linkedUserError) {
		if (
			linkedUserError instanceof WebApiError &&
			linkedUserError.status === 404
		) {
			return (
				<NotFoundState
					title={t("common.linkedUser.notFound.title")}
					description={t("common.linkedUser.notFound.description")}
				/>
			);
		}

		return (
			<SomeErrorState
				title={t("common.linkedUser.error.title")}
				description={t("common.linkedUser.error.description")}
				onRefresh={onRefreshUser}
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
	const accountIsActive = linkedAccount?.active ?? true;
	const accountStatusLabel = accountIsActive
		? t("common.status.active")
		: t("common.status.inactive");
	const accountStatusTone = accountIsActive ? "success" : "danger";
	const hasCpfValue = (watchedCpf ?? "").trim().length > 0;
	const isNameDisabled =
		isCreateMode && (!hasCpfValue || matchedExistingUser != null);

	return (
		<>
			<section className="grid gap-4">
				<div className="grid gap-1">
					<p className="ty-overhead">
						{t("identity.adminPage.update.tabs.profile")}
					</p>
				</div>
				{isCreateMode ? (
					<div className="grid gap-2">
						<CpfFormField
							id="admin-cpf"
							form={form}
							existingUsers={existingUsers}
							label={t("common.fields.cpf")}
							tooltipContent={t("identity.adminPage.update.fields.cpfHelp")}
							placeholder={t("identity.adminPage.update.fields.cpfPlaceholder")}
							searchPlaceholder={t(
								"identity.adminPage.update.fields.cpfSearchPlaceholder",
							)}
							emptyMessage={t("identity.adminPage.update.fields.cpfEmpty")}
							createOptionLabel={value =>
								t("identity.adminPage.update.fields.cpfCreateOption", {
									value,
								})
							}
							onExistingUserChange={user => setMatchedExistingUser(user)}
						/>
					</div>
				) : null}

				<div className="grid gap-2">
					<Label htmlFor="admin-name">{t("common.fields.name")}</Label>
					<Input
						id="admin-name"
						{...form.register("name")}
						disabled={isNameDisabled}
						aria-describedby={
							form.formState.errors.name ? "admin-name-error" : undefined
						}
						aria-invalid={form.formState.errors.name ? "true" : "false"}
						placeholder={t("identity.adminPage.update.fields.namePlaceholder")}
					/>
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
					<Label htmlFor="admin-email">{t("common.fields.email")}</Label>
					<Input
						id="admin-email"
						type="email"
						{...form.register("email")}
						aria-describedby={
							form.formState.errors.email ? "admin-email-error" : undefined
						}
						aria-invalid={form.formState.errors.email ? "true" : "false"}
						placeholder={t("common.fields.email")}
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
			</section>

			<section className="grid gap-4">
				<div className="grid gap-1">
					<p className="ty-overhead">
						{t("identity.adminPage.update.tabs.access")}
					</p>
				</div>
				<div className="grid gap-2">
					<Label htmlFor="admin-campus">{t("common.fields.campus")}</Label>
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
									placeholder={t("common.placeholders.select")}
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

				<AccountSummaryBadges
					accountTypeFieldLabel={t("common.fields.accountType")}
					accountTypeLabel={accountTypeLabel}
					accountTypeTone={accountTypeTone}
					activeFieldLabel={t("common.fields.active")}
					activeLabel={accountStatusLabel}
					activeTone={accountStatusTone}
				/>

				{!isCreateMode && admin ? (
					<div className="grid gap-1">
						<p className="ty-helper">
							{t("identity.adminPage.update.fields.grantedAt")}
						</p>
						<p className="ty-sm-semibold">{admin.grantedAtFormatted}</p>
					</div>
				) : null}
			</section>

			{!isCreateMode && admin ? (
				<LinkedDetailsAccordion
					className="pt-2"
					defaultValue="linked-user"
					items={[
						{
							value: "linked-user",
							title: t("identity.adminPage.update.tabs.user"),
							content: (
								<UserDetailsContent
									userId={admin.accountResponse.userId}
									columns={2}
								/>
							),
						},
					]}
				/>
			) : null}
		</>
	);
}
