"use client";

import { useState } from "react";

import { Controller, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
	Badge,
	Combobox,
	CpfFormField,
	Input,
	Label,
	NotFoundState,
	SomeErrorState,
} from "@/components";
import {
	getAccountTypeLabel,
	getAccountTypeTone,
} from "@/features/identity/accounts/utils";
import { UserDetailsContent } from "@/features/identity/users/user/UserDetailsContent";
import { EntityDetailsContent } from "@/features/partner/entities/entity/EntityDetailsContent";
import type { CpfFormFieldExistingUser, StaffEditorFormProps } from "@/types";
import { WebApiError } from "@/utils";

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
					title={t("partner.staffPage.update.notFound.title")}
					description={t("partner.staffPage.update.notFound.description")}
				/>
			);
		}

		return (
			<SomeErrorState
				title={t("partner.staffPage.update.loadError.title")}
				description={t("partner.staffPage.update.loadError.description")}
				onRefresh={onRefreshStaff}
			/>
		);
	}

	if (userError) {
		if (userError instanceof WebApiError && userError.status === 404) {
			return (
				<NotFoundState
					title={t("partner.staffPage.dialog.linkedUser.notFound.title")}
					description={t(
						"partner.staffPage.dialog.linkedUser.notFound.description",
					)}
				/>
			);
		}

		return (
			<SomeErrorState
				title={t("partner.staffPage.dialog.linkedUser.error.title")}
				description={t("partner.staffPage.dialog.linkedUser.error.description")}
				onRefresh={onRefreshUser}
			/>
		);
	}

	if (entitiesError) {
		return (
			<SomeErrorState
				title={t("partner.staffPage.editor.entityLoadError.title")}
				description={t("partner.staffPage.editor.entityLoadError.description")}
				onRefresh={onRefreshEntities}
			/>
		);
	}

	if (!canRenderForm || (!isUpdateMode && !staff)) {
		return (
			<NotFoundState title={t("partner.staffPage.update.notFound.title")} />
		);
	}

	const hasCpfValue = (watchedCpf ?? "").trim().length > 0;
	const isNameDisabled =
		isCreateLikeMode && (!hasCpfValue || matchedExistingUser != null);
	const accountIsActive = staff?.account.active ?? true;
	const accountStatusLabel = accountIsActive
		? t("identity.accountPage.dialog.active.yes")
		: t("identity.accountPage.dialog.active.no");
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
					<Label htmlFor="staff-email">
						{t("partner.staffPage.editor.fields.email")}
					</Label>
					<Input
						id="staff-email"
						type="email"
						{...form.register("email")}
						aria-describedby={
							form.formState.errors.email ? "staff-email-error" : undefined
						}
						aria-invalid={form.formState.errors.email ? "true" : "false"}
						placeholder={t("partner.staffPage.editor.fields.email")}
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
					<Label htmlFor="staff-entity">
						{t("partner.staffPage.editor.fields.entity")}
					</Label>
					<Controller
						control={form.control}
						name="entityId"
						render={({ field }) => (
							<Combobox
								id="staff-entity"
								options={entityOptions}
								value={field.value}
								onValueChange={field.onChange}
								placeholder={t(
									"partner.staffPage.editor.fields.entityPlaceholder",
								)}
								searchPlaceholder={t(
									"partner.staffPage.editor.fields.entitySearchPlaceholder",
								)}
								emptyMessage={t(
									"partner.staffPage.editor.fields.entityEmptyMessage",
								)}
							/>
						)}
					/>
					{form.formState.errors.entityId ? (
						<p className="field-error">
							{form.formState.errors.entityId.message}
						</p>
					) : null}
				</div>

				<div className="grid gap-4 md:grid-cols-2">
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

					<div className="grid gap-2">
						<Label>{t("identity.adminPage.update.fields.active")}</Label>
						<div>
							<Badge
								className="min-h-5 px-2 py-0.5"
								tone={accountStatusTone}
								variant="primary"
							>
								{accountStatusLabel}
							</Badge>
						</div>
					</div>
				</div>
			</section>

			{isUpdateMode && staff && linkedEntityId ? (
				<Accordion
					type="single"
					collapsible
					className="pt-2"
					defaultValue="linked-user"
				>
					<AccordionItem value="linked-user">
						<AccordionTrigger>
							{t("identity.adminPage.update.tabs.user")}
						</AccordionTrigger>
						<AccordionContent>
							<UserDetailsContent
								userId={staff.account.userId}
								columns={2}
							/>
						</AccordionContent>
					</AccordionItem>
					<AccordionItem value="linked-entity">
						<AccordionTrigger>
							{t("partner.staffPage.editor.sections.linkedEntity")}
						</AccordionTrigger>
						<AccordionContent>
							<EntityDetailsContent
								entityId={linkedEntityId}
								columns={2}
							/>
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			) : null}
		</>
	);
}
