"use client";

import { useTranslation } from "react-i18next";

import { CpfFormField } from "@/components/composite";
import { Input, Label } from "@/components/primitives";
import type { FormerStudentProfileSectionProps } from "@/types/client";

export function FormerStudentProfileSection({
	existingUsers,
	form,
	isCreateLikeMode,
	isNameDisabled,
	onMatchedExistingUserChange,
}: FormerStudentProfileSectionProps) {
	const { t } = useTranslation();

	return (
		<section className="grid gap-4">
			<div className="grid gap-1">
				<p className="ty-overhead">
					{t("identity.adminPage.update.tabs.profile")}
				</p>
			</div>
			{isCreateLikeMode ? (
				<CpfFormField
					id="former-student-cpf"
					form={form}
					existingUsers={existingUsers}
					label={t("academic.formerStudentPage.editor.fields.cpf")}
					placeholder={t(
						"academic.formerStudentPage.editor.fields.cpfPlaceholder",
					)}
					searchPlaceholder={t(
						"academic.formerStudentPage.editor.fields.cpfSearchPlaceholder",
					)}
					emptyMessage={t("academic.formerStudentPage.editor.fields.cpfEmpty")}
					createOptionLabel={value =>
						t("academic.formerStudentPage.editor.fields.cpfCreateOption", {
							value,
						})
					}
					onExistingUserChange={onMatchedExistingUserChange}
				/>
			) : null}

			<div className="grid gap-2">
				<Label htmlFor="former-student-name">
					{t("academic.formerStudentPage.editor.fields.name")}
				</Label>
				<Input
					id="former-student-name"
					{...form.register("name")}
					disabled={isNameDisabled}
					aria-describedby={
						form.formState.errors.name ? "former-student-name-error" : undefined
					}
					aria-invalid={form.formState.errors.name ? "true" : "false"}
					placeholder={t(
						"academic.formerStudentPage.editor.fields.namePlaceholder",
					)}
				/>
				{form.formState.errors.name ? (
					<p
						id="former-student-name-error"
						className="field-error"
					>
						{form.formState.errors.name.message}
					</p>
				) : null}
			</div>

			<div className="grid gap-2">
				<Label htmlFor="former-student-email">
					{t("academic.formerStudentPage.editor.fields.email")}
				</Label>
				<Input
					id="former-student-email"
					type="email"
					{...form.register("email")}
					aria-describedby={
						form.formState.errors.email
							? "former-student-email-error"
							: undefined
					}
					aria-invalid={form.formState.errors.email ? "true" : "false"}
					placeholder={t(
						"academic.formerStudentPage.editor.fields.emailPlaceholder",
					)}
				/>
				{form.formState.errors.email ? (
					<p
						id="former-student-email-error"
						className="field-error"
					>
						{form.formState.errors.email.message}
					</p>
				) : null}
			</div>

			<div className="grid gap-2">
				<Label htmlFor="former-student-registration">
					{t("academic.formerStudentPage.editor.fields.academicRegistration")}
				</Label>
				<Input
					id="former-student-registration"
					{...form.register("academicRegistration")}
					placeholder={t(
						"academic.formerStudentPage.editor.fields.academicRegistrationPlaceholder",
					)}
				/>
				{form.formState.errors.academicRegistration ? (
					<p className="field-error">
						{form.formState.errors.academicRegistration.message}
					</p>
				) : null}
			</div>
		</section>
	);
}
