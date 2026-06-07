"use client";

import { useTranslation } from "react-i18next";

import { WebApiError } from "@/api/web";
import { AreaOfExpertiseDetailsContent } from "@/components/composite";
import {
	Input,
	Label,
	NotFoundState,
	SomeErrorState,
} from "@/components/primitives";
import type { AreaOfExpertiseEditorFormProps } from "@/types/client";

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
					title={t("academic.areaOfExpertisePage.update.notFound.title")}
					description={t(
						"academic.areaOfExpertisePage.update.notFound.description",
					)}
				/>
			);
		}

		return (
			<SomeErrorState
				title={t("academic.areaOfExpertisePage.update.loadError.title")}
				description={t(
					"academic.areaOfExpertisePage.update.loadError.description",
				)}
				onRefresh={onRefreshAreaOfExpertise}
			/>
		);
	}

	if (!canRenderForm) {
		return (
			<NotFoundState
				title={t("academic.areaOfExpertisePage.update.notFound.title")}
			/>
		);
	}

	return (
		<div className="grid gap-4">
			<div className="grid gap-2">
				<Label htmlFor="school-name">
					{t("academic.areaOfExpertisePage.editor.fields.name")}
				</Label>
				<Input
					id="school-name"
					{...form.register("name")}
					aria-describedby={
						form.formState.errors.name ? "school-name-error" : undefined
					}
					aria-invalid={form.formState.errors.name ? "true" : "false"}
					placeholder={t(
						"academic.areaOfExpertisePage.editor.fields.namePlaceholder",
					)}
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
