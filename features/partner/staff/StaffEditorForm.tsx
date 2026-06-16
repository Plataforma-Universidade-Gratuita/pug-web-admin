"use client";

import { useState } from "react";

import { Controller, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { WebApiError } from "@/api/web";
import {
	AccountSummaryBadges,
	CpfFormField,
	EntityDetailsContent,
	LinkedDetailsAccordion,
	UserDetailsContent,
} from "@/components/composite";
import {
	Combobox,
	Input,
	Label,
	NotFoundState,
	SomeErrorState,
} from "@/components/primitives";
import {
	getAccountTypeLabel,
	getAccountTypeTone,
} from "@/features/identity/accounts/utils";
import type {
	CpfFormFieldExistingUser,
	StaffEditorFormProps,
} from "@/types/client";

export function StaffEditorForm({
	canRenderForm,
	entityOptions,
	entitiesError,
	existingUsers,
	form,
	mode,
	onRefreshEntities,
	onRefreshStaff,
	onRefreshUser,
	staff,
	staffError,
	userError,
}: StaffEditorFormProps) {
	const { t } = useTranslation();
	const isUpdateMode = mode === "update";
	const isCreateLikeMode = mode !== "update";
	const watchedCpf = useWatch({
		control: form.control,
		name: "cpf",
	});
	const watchedEntityId = useWatch({
		control: form.control,
		name: "entityId",
	});
	const [matchedExistingUser, setMatchedExistingUser] =
		useState<CpfFormFieldExistingUser | null>(null);

	if (mode !== "create" && staffError) {
		if (staffError instanceof WebApiError && staffError.status === 404) {
			return (
				<NotFoundState
					title={t("common.notFound.title")}
					description={t("common.notFound.description")}
				/>
			);
		}

		return (
			<SomeErrorState
				title={t("common.errors.editorLoad.title", {
					object: t("common.objects.staffMember"),
				})}
				description={t("common.errors.editorLoad.description", {
					object: t("common.objects.staffMember"),
				})}
				onRefresh={onRefreshStaff}
			/>
		);
	}

	if (userError) {
		if (userError instanceof WebApiError && userError.status === 404) {
			return (
				<NotFoundState
					title={t("common.notFound.title")}
					description={t("common.notFound.description")}
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

	if (entitiesError) {
		return (
			<SomeErrorState
				title={t("common.loadErrors.entities.title")}
				description={t("common.loadErrors.entities.description")}
				onRefresh={onRefreshEntities}
			/>
		);
	}

	if (!canRenderForm || (mode === "duplicate" && !staff)) {
		return <NotFoundState title={t("common.notFound.title")} />;
	}

	const hasCpfValue = (watchedCpf ?? "").trim().length > 0;
	const isNameDisabled =
		isCreateLikeMode && (!hasCpfValue || matchedExistingUser != null);
	const accountIsActive = staff?.account.active ?? true;
	const accountStatusLabel = accountIsActive
		? t("common.status.active")
		: t("common.status.inactive");
	const accountStatusTone = accountIsActive ? "success" : "danger";
	const accountTypeLabel = getAccountTypeLabel(
		t,
		staff?.account.accountType ?? "PARTNER",
	);
	const accountTypeTone = staff?.account
		? getAccountTypeTone(staff.account.accountType)
		: "info";
	const linkedEntityId = staff?.entityId ?? watchedEntityId;

	return (
		<>
			<section className="grid gap-4">
				<div className="grid gap-1">
					<p className="ty-overhead">
						{t("identity.adminPage.update.tabs.profile")}
					</p>
				</div>
				{isCreateLikeMode ? (
					<CpfFormField
						id="staff-cpf"
						form={form}
						existingUsers={existingUsers}
						label={t("partner.staffPage.editor.fields.cpf")}
						tooltipContent={t("identity.adminPage.update.fields.cpfHelp")}
						placeholder={t("partner.staffPage.editor.fields.cpfPlaceholder")}
						searchPlaceholder={t(
							"partner.staffPage.editor.fields.cpfSearchPlaceholder",
						)}
						emptyMessage={t("partner.staffPage.editor.fields.cpfEmpty")}
						createOptionLabel={value =>
							t("partner.staffPage.editor.fields.cpfCreateOption", {
								value,
							})
						}
						onExistingUserChange={user => setMatchedExistingUser(user)}
					/>
				) : null}

				<div className="grid gap-2">
					<Label htmlFor="staff-name">
						{t("partner.staffPage.editor.fields.name")}
					</Label>
					<Input
						id="staff-name"
						{...form.register("name")}
						disabled={isNameDisabled}
						aria-describedby={
							form.formState.errors.name ? "staff-name-error" : undefined
						}
						aria-invalid={form.formState.errors.name ? "true" : "false"}
						placeholder={t("partner.staffPage.editor.fields.name")}
					/>
					{form.formState.errors.name ? (
						<p
							id="staff-name-error"
							className="field-error"
						>
							{form.formState.errors.name.message}
						</p>
					) : null}
				</div>

				<div className="grid gap-2">
					<Label htmlFor="staff-email">{t("common.fields.email")}</Label>
					<Input
						id="staff-email"
						type="email"
						{...form.register("email")}
						aria-describedby={
							form.formState.errors.email ? "staff-email-error" : undefined
						}
						aria-invalid={form.formState.errors.email ? "true" : "false"}
						placeholder={t("common.fields.email")}
					/>
					{form.formState.errors.email ? (
						<p
							id="staff-email-error"
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
						{t("partner.staffPage.editor.sections.organization")}
					</p>
				</div>
				<div className="grid gap-2">
					<Label htmlFor="staff-entity">{t("common.fields.entity")}</Label>
					<Controller
						control={form.control}
						name="entityId"
						render={({ field }) => (
							<Combobox
								id="staff-entity"
								options={entityOptions}
								value={field.value}
								onValueChange={field.onChange}
								placeholder={t("common.placeholders.select")}
								searchPlaceholder={t("common.placeholders.search")}
								emptyMessage={t("common.placeholders.noResults")}
							/>
						)}
					/>
					{form.formState.errors.entityId ? (
						<p className="field-error">
							{form.formState.errors.entityId.message}
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
			</section>

			{isUpdateMode && staff && linkedEntityId ? (
				<LinkedDetailsAccordion
					className="pt-2"
					defaultValue="linked-user"
					items={[
						{
							value: "linked-user",
							title: t("identity.adminPage.update.tabs.user"),
							content: (
								<UserDetailsContent
									userId={staff.account.userId}
									columns={2}
								/>
							),
						},
						{
							value: "linked-entity",
							title: t("partner.staffPage.editor.sections.linkedEntity"),
							content: (
								<EntityDetailsContent
									entityId={linkedEntityId}
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
