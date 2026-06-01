"use client";

import { useTranslation } from "react-i18next";

import { Input, Label, NotFoundState, SomeErrorState } from "@/components";
import { AreaOfExpertiseDetailsContent } from "@/features/academic/areas-of-expertise/area-of-expertise/AreaOfExpertiseDetailsContent";
import type { AreaOfExpertiseEditorFormProps } from "@/types";
import { WebApiError } from "@/utils";

export function AreaOfExpertiseEditorForm({
	canRenderForm,
	form,
	mode,
	onRefreshAreaOfExpertise,
	areaOfExpertise,
	areaOfExpertiseError,
}: AreaOfExpertiseEditorFormProps) {
	const { t } = useTranslation();
	const isCreateMode = mode === "create";

	if (!isCreateMode && areaOfExpertiseError) {
		if (
			areaOfExpertiseError instanceof WebApiError &&
			areaOfExpertiseError.status === 404
		) {
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
				onRefresh={onRefreshAreaOfExpertise}
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

			{!isCreateMode && areaOfExpertise ? (
				<AreaOfExpertiseDetailsContent
					areaOfExpertise={areaOfExpertise}
					columns={2}
					includeName={false}
				/>
			) : null}
		</div>
	);
}
