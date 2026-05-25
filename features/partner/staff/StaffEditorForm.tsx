"use client";

import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

import {
	Combobox,
	Input,
	Label,
	NotFoundState,
	SomeErrorState,
} from "@/components";
import type { StaffEditorFormProps } from "@/types";
import { WebApiError } from "@/utils";

export function StaffEditorForm({
	canRenderForm,
	entityById,
	entityOptions,
	entitiesError,
	form,
	mode,
	onRefreshEntities,
	onRefreshStaff,
	staff,
	staffError,
}: StaffEditorFormProps) {
	const { t } = useTranslation();
	const isCreateMode = mode === "create";

	if (!isCreateMode && staffError) {
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

	if (entitiesError) {
		return (
			<SomeErrorState
				title={t("partner.staffPage.editor.entityLoadError.title")}
				description={t("partner.staffPage.editor.entityLoadError.description")}
				onRefresh={onRefreshEntities}
			/>
		);
	}

	if (!canRenderForm) {
		return (
			<NotFoundState title={t("partner.staffPage.update.notFound.title")} />
		);
	}

	return (
		<div className="grid gap-4">
			{mode === "update" ? (
				<div className="grid gap-1">
					<p className="ty-helper">
						{t("partner.staffPage.editor.fields.entity")}
					</p>
					<p className="ty-sm-semibold">
						{staff?.entityName ??
							entityById.get(form.getValues("entityId"))?.name ??
							t("partner.staffPage.editor.fields.entityPlaceholder")}
					</p>
				</div>
			) : (
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
			)}

			{mode === "update" ? null : (
				<div className="grid gap-2">
					<Label htmlFor="staff-cpf">
						{t("partner.staffPage.editor.fields.cpf")}
					</Label>
					<Input
						id="staff-cpf"
						inputMode="numeric"
						{...form.register("cpf")}
						aria-describedby={
							form.formState.errors.cpf ? "staff-cpf-error" : undefined
						}
						aria-invalid={form.formState.errors.cpf ? "true" : "false"}
						placeholder={t("partner.staffPage.editor.fields.cpfPlaceholder")}
					/>
					{form.formState.errors.cpf ? (
						<p
							id="staff-cpf-error"
							className="field-error"
						>
							{form.formState.errors.cpf.message}
						</p>
					) : null}
				</div>
			)}

			<div className="grid gap-2">
				<Label htmlFor="staff-name">
					{t("partner.staffPage.editor.fields.name")}
				</Label>
				<Input
					id="staff-name"
					{...form.register("name")}
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

			<div className="grid gap-2">
				<Label htmlFor="staff-password">
					{t("partner.staffPage.editor.fields.password")}
				</Label>
				<Input
					id="staff-password"
					type="password"
					showPasswordToggle
					{...form.register("password")}
					aria-describedby={
						form.formState.errors.password ? "staff-password-error" : undefined
					}
					aria-invalid={form.formState.errors.password ? "true" : "false"}
					placeholder={t(
						mode === "create"
							? "partner.staffPage.create.fields.passwordPlaceholder"
							: mode === "duplicate"
								? "partner.staffPage.duplicate.fields.passwordPlaceholder"
								: "partner.staffPage.update.fields.passwordPlaceholder",
					)}
				/>
				{form.formState.errors.password ? (
					<p
						id="staff-password-error"
						className="field-error"
					>
						{form.formState.errors.password.message}
					</p>
				) : null}
			</div>
		</div>
	);
}
