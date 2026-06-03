"use client";

import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
	Combobox,
	Input,
	Label,
	NoContentState,
	NotFoundState,
	SomeErrorState,
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
	TextArea,
} from "@/components";
import { AreaOfExpertiseDetailsContent } from "@/features/academic/areas-of-expertise/area-of-expertise/AreaOfExpertiseDetailsContent";
import { EntityDetailsContent } from "@/features/partner/entities/entity/EntityDetailsContent";
import { ProjectOwnDetailsContent } from "@/features/project/projects/project/ProjectOwnDetailsContent";
import { useProjectAreasOfExpertiseQuery } from "@/features/project/projects/queries";
import type { ProjectsEditorFormProps } from "@/types";
import { WebApiError } from "@/utils";

export function ProjectsEditorForm({
	canRenderForm,
	entitiesError,
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
	const linkedAreasOfExpertiseQuery = useProjectAreasOfExpertiseQuery(
		isUpdateMode && project ? project.id : null,
	);
	const createdByLabel = project
		? project.projectInfo.createdBy.name
		: "";

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

	const projectSection = (
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

			{isUpdateMode ? null : (
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
		</div>
	);

	if (!isUpdateMode || !project) {
		return projectSection;
	}

	return (
		<Tabs
			defaultValue="project"
			className="drawer-sticky-tabs grid gap-4"
		>
			<TabsList className="w-full">
				<TabsTrigger value="project">
					{t("project.projectPage.editor.tabs.project")}
				</TabsTrigger>
				<TabsTrigger value="linked">
					{t("project.projectPage.editor.tabs.linked")}
				</TabsTrigger>
			</TabsList>

			<TabsContent
				value="project"
				className="grid gap-6"
			>
				{projectSection}
			</TabsContent>

			<TabsContent
				value="linked"
				className="grid gap-6"
			>
				<ProjectOwnDetailsContent
					project={project}
					createdByLabel={createdByLabel}
					columns={2}
					includeEditableFields={false}
				/>

				<Accordion
					type="single"
					collapsible
					defaultValue="linked-entity"
				>
					<AccordionItem value="linked-entity">
						<AccordionTrigger>
							{t("project.projectPage.dialog.linkedEntity.overhead")}
						</AccordionTrigger>
						<AccordionContent>
							<EntityDetailsContent
								entityId={project.entity.id}
								columns={2}
							/>
						</AccordionContent>
					</AccordionItem>

					<AccordionItem value="linked-areas-of-expertise">
						<AccordionTrigger>
							{t("project.projectPage.dialog.linkedAreasOfExpertise.overhead")}
						</AccordionTrigger>
						<AccordionContent>
							{linkedAreasOfExpertiseQuery.isError ? (
								<SomeErrorState
									title={t(
										"project.projectPage.dialog.areasOfExpertiseError.title",
									)}
									description={t(
										"project.projectPage.dialog.areasOfExpertiseError.description",
									)}
									onRefresh={() => {
										void linkedAreasOfExpertiseQuery.refetch();
									}}
								/>
							) : linkedAreasOfExpertiseQuery.data &&
							  linkedAreasOfExpertiseQuery.data.length > 0 ? (
								<div className="grid gap-4">
									{linkedAreasOfExpertiseQuery.data.map(areaOfExpertise => (
										<AreaOfExpertiseDetailsContent
											key={areaOfExpertise.id}
											areaOfExpertise={areaOfExpertise}
											columns={2}
										/>
									))}
								</div>
							) : linkedAreasOfExpertiseQuery.isLoading ? null : (
								<NoContentState
									title={t(
										"project.projectPage.dialog.linkedAreasOfExpertise.empty.title",
									)}
									description={t(
										"project.projectPage.dialog.linkedAreasOfExpertise.empty.description",
									)}
								/>
							)}
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			</TabsContent>
		</Tabs>
	);
}
