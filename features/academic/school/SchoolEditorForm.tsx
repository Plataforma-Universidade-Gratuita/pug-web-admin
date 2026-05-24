"use client";

import { useTranslation } from "react-i18next";

import { Input, Label, NotFoundState, SomeErrorState } from "@/components";
import type { SchoolEditorFormProps } from "@/types/client/academic";
import { WebApiError } from "@/utils/web-api";

export function SchoolEditorForm({
	canRenderForm,
	form,
	mode,
	onRefreshSchool,
	school,
	schoolError,
}: SchoolEditorFormProps) {
	const { t } = useTranslation();
	const isCreateMode = mode === "create";

	if (!isCreateMode && schoolError) {
		if (schoolError instanceof WebApiError && schoolError.status === 404) {
			return (
				<NotFoundState
					title={t("academic.schoolPage.update.notFound.title")}
					description={t("academic.schoolPage.update.notFound.description")}
				/>
			);
		}

		return (
			<SomeErrorState
				title={t("academic.schoolPage.update.loadError.title")}
				description={t("academic.schoolPage.update.loadError.description")}
				onRefresh={onRefreshSchool}
			/>
		);
	}

	if (!canRenderForm) {
		return (
			<NotFoundState title={t("academic.schoolPage.update.notFound.title")} />
		);
	}

	return (
		<div className="grid gap-4">
			<div className="grid gap-2">
				<Label htmlFor="school-name">
					{t("academic.schoolPage.editor.fields.name")}
				</Label>
				<Input
					id="school-name"
					{...form.register("name")}
					aria-describedby={
						form.formState.errors.name ? "school-name-error" : undefined
					}
					aria-invalid={form.formState.errors.name ? "true" : "false"}
					placeholder={t("academic.schoolPage.editor.fields.namePlaceholder")}
				/>
				{form.formState.errors.name ? (
					<p
						id="school-name-error"
						className="field-error"
					>
						{form.formState.errors.name.message}
					</p>
				) : null}
			</div>

			{!isCreateMode && school ? (
				<div className="grid gap-4 pt-2 sm:grid-cols-3">
					<div className="grid gap-1">
						<p className="ty-helper">
							{t("academic.schoolPage.dialog.fields.id")}
						</p>
						<p className="ty-sm-semibold">{school.id}</p>
					</div>
					<div className="grid gap-1">
						<p className="ty-helper">
							{t("academic.schoolPage.dialog.fields.createdAt")}
						</p>
						<p className="ty-sm-semibold">
							{school.auditInfo.createdAtFormatted}
						</p>
					</div>
					<div className="grid gap-1">
						<p className="ty-helper">
							{t("academic.schoolPage.dialog.fields.updatedAt")}
						</p>
						<p className="ty-sm-semibold">
							{school.auditInfo.updatedAtFormatted}
						</p>
					</div>
				</div>
			) : null}
		</div>
	);
}
