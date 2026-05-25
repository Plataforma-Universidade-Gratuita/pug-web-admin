"use client";

import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

import {
	Combobox,
	Input,
	Label,
	NotFoundState,
	SomeErrorState,
	TextArea,
} from "@/components";
import { resolveProjectEntityLabel } from "@/features/project/projects/utils";
import type { ProjectsEditorFormProps } from "@/types";
import { WebApiError } from "@/utils";

export function ProjectsEditorForm({
	canRenderForm,
	entitiesError,
	entityById,
	entityOptions,
	form,
	mode,
	onRefreshEntities,
	onRefreshProject,
	project,
	projectError,
}: ProjectsEditorFormProps) {
	const { t } = useTranslation();
	const isCreateMode = mode === "create";
	const isUpdateMode = mode === "update";

	if (!isCreateMode && projectError) {
		if (projectError instanceof WebApiError && projectError.status === 404) {
			return (
				<NotFoundState
					title={t("project.projectPage.update.notFound.title")}
					description={t("project.projectPage.update.notFound.description")}
				/>
			);
		}

		return (
			<SomeErrorState
				title={t("project.projectPage.update.loadError.title")}
				description={t("project.projectPage.update.loadError.description")}
				onRefresh={onRefreshProject}
			/>
		);
	}

	if (entitiesError && !isUpdateMode) {
		return (
			<SomeErrorState
				title={t("project.projectPage.editor.entityLoadError.title")}
				description={t(
					"project.projectPage.editor.entityLoadError.description",
				)}
				onRefresh={onRefreshEntities}
			/>
		);
	}

	if (!canRenderForm) {
		return (
			<NotFoundState title={t("project.projectPage.update.notFound.title")} />
		);
	}

	return (
		<div className="grid gap-4">
			<div className="grid gap-2">
				<Label htmlFor="project-name">
					{t("project.projectPage.editor.fields.name")}
				</Label>
				<Input
					id="project-name"
					{...form.register("name")}
					aria-describedby={
						form.formState.errors.name ? "project-name-error" : undefined
					}
					aria-invalid={form.formState.errors.name ? "true" : "false"}
					placeholder={t("project.projectPage.editor.fields.namePlaceholder")}
				/>
				{form.formState.errors.name ? (
					<p
						id="project-name-error"
						className="field-error"
					>
						{form.formState.errors.name.message}
					</p>
				) : null}
			</div>

			{isUpdateMode ? (
				<div className="grid gap-1">
					<p className="ty-helper">
						{t("project.projectPage.editor.fields.entity")}
					</p>
					<p className="ty-sm-semibold">
						{project
							? resolveProjectEntityLabel(entityById, project.entityId)
							: form.getValues("entityId")}
					</p>
				</div>
			) : (
				<div className="grid gap-2">
					<Label htmlFor="project-entity">
						{t("project.projectPage.editor.fields.entity")}
					</Label>
					<Controller
						control={form.control}
						name="entityId"
						render={({ field }) => (
							<Combobox
								id="project-entity"
								options={entityOptions}
								value={field.value}
								onValueChange={field.onChange}
								placeholder={t(
									"project.projectPage.editor.fields.entityPlaceholder",
								)}
								searchPlaceholder={t(
									"project.projectPage.editor.fields.entitySearchPlaceholder",
								)}
								emptyMessage={t(
									"project.projectPage.editor.fields.entityEmptyMessage",
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

			<div className="grid gap-2 sm:grid-cols-2">
				<div className="grid gap-2">
					<Label htmlFor="project-offered-hours">
						{t("project.projectPage.editor.fields.offeredHours")}
					</Label>
					<Input
						id="project-offered-hours"
						inputMode="numeric"
						{...form.register("offeredHours")}
						aria-describedby={
							form.formState.errors.offeredHours
								? "project-offered-hours-error"
								: undefined
						}
						aria-invalid={form.formState.errors.offeredHours ? "true" : "false"}
						placeholder={t(
							"project.projectPage.editor.fields.offeredHoursPlaceholder",
						)}
					/>
					{form.formState.errors.offeredHours ? (
						<p
							id="project-offered-hours-error"
							className="field-error"
						>
							{form.formState.errors.offeredHours.message}
						</p>
					) : null}
				</div>

				<div className="grid gap-2">
					<Label htmlFor="project-max-participants">
						{t("project.projectPage.editor.fields.maxParticipants")}
					</Label>
					<Input
						id="project-max-participants"
						inputMode="numeric"
						{...form.register("maxParticipants")}
						aria-describedby={
							form.formState.errors.maxParticipants
								? "project-max-participants-error"
								: undefined
						}
						aria-invalid={
							form.formState.errors.maxParticipants ? "true" : "false"
						}
						placeholder={t(
							"project.projectPage.editor.fields.maxParticipantsPlaceholder",
						)}
					/>
					{form.formState.errors.maxParticipants ? (
						<p
							id="project-max-participants-error"
							className="field-error"
						>
							{form.formState.errors.maxParticipants.message}
						</p>
					) : null}
				</div>
			</div>

			<div className="grid gap-2">
				<Label htmlFor="project-description">
					{t("project.projectPage.editor.fields.description")}
				</Label>
				<TextArea
					id="project-description"
					rows={5}
					{...form.register("description")}
					placeholder={t(
						"project.projectPage.editor.fields.descriptionPlaceholder",
					)}
				/>
			</div>

			{!isCreateMode && project ? (
				<div className="grid gap-4 pt-2 sm:grid-cols-3">
					<div className="grid gap-1">
						<p className="ty-helper">
							{t("project.projectPage.dialog.fields.id")}
						</p>
						<p className="ty-sm-semibold">{project.id}</p>
					</div>
					<div className="grid gap-1">
						<p className="ty-helper">
							{t("project.projectPage.dialog.fields.createdAt")}
						</p>
						<p className="ty-sm-semibold">
							{project.auditInfo.createdAtFormatted}
						</p>
					</div>
					<div className="grid gap-1">
						<p className="ty-helper">
							{t("project.projectPage.dialog.fields.updatedAt")}
						</p>
						<p className="ty-sm-semibold">
							{project.auditInfo.updatedAtFormatted}
						</p>
					</div>
				</div>
			) : null}
		</div>
	);
}
