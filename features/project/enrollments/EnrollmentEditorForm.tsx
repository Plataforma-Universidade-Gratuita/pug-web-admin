"use client";

import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { WebApiError } from "@/api/web";
import {
	FormerStudentOwnDetailsContent,
	ProjectOwnDetailsContent,
} from "@/components/composite";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
	Combobox,
	Label,
	NotFoundState,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SomeErrorState,
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/components/primitives";
import { EnrollmentOwnDetailsContent } from "@/features/project/enrollments/enrollment/EnrollmentOwnDetailsContent";
import { getEditableEnrollmentStatusOptions } from "@/features/project/enrollments/utils";
import type { EnrollmentEditorFormProps } from "@/types/client";

export function EnrollmentEditorForm({
	canRenderForm,
	enrollment,
	enrollmentError,
	form,
	formerStudent,
	formerStudentError,
	formerStudentOptions,
	mode,
	onRefreshEnrollment,
	onRefreshFormerStudent,
	onRefreshProject,
	onRefreshProjects,
	project,
	projectError,
	projectOptions,
	projectsError,
}: EnrollmentEditorFormProps) {
	const { t } = useTranslation();
	const isCreateMode = mode === "create";

	if (!isCreateMode && enrollmentError) {
		if (
			enrollmentError instanceof WebApiError &&
			enrollmentError.status === 404
		) {
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
					object: t("common.objects.enrollment"),
				})}
				description={t("common.errors.editorLoad.description", {
					object: t("common.objects.enrollment"),
				})}
				onRefresh={onRefreshEnrollment}
			/>
		);
	}

	if (projectsError) {
		return (
			<SomeErrorState
				title={t("common.loadErrors.projects.title")}
				description={t("common.loadErrors.projects.description")}
				onRefresh={onRefreshProjects}
			/>
		);
	}

	if (!isCreateMode && projectError) {
		return (
			<SomeErrorState
				title={t("common.loadErrors.projects.title")}
				description={t("common.loadErrors.projects.description")}
				onRefresh={onRefreshProject}
			/>
		);
	}

	if (!isCreateMode && formerStudentError) {
		return (
			<SomeErrorState
				title={t("common.loadErrors.formerStudents.title")}
				description={t("common.loadErrors.formerStudents.description")}
				onRefresh={onRefreshFormerStudent}
			/>
		);
	}

	if (!canRenderForm) {
		return <NotFoundState title={t("common.notFound.title")} />;
	}

	const options = enrollment
		? getEditableEnrollmentStatusOptions(t, enrollment.status.status)
		: [];

	const editorSection = (
		<section className="grid gap-4">
			{isCreateMode ? (
				<>
					<div className="grid gap-2">
						<Label>{t("common.fields.project")}</Label>
						<Controller
							control={form.control}
							name="projectId"
							render={({ field }) => (
								<Combobox
									options={projectOptions}
									value={field.value}
									onValueChange={field.onChange}
									placeholder={t("common.placeholders.select")}
									searchPlaceholder={t("common.placeholders.search")}
									emptyMessage={t("common.placeholders.noResults")}
								/>
							)}
						/>
						{form.formState.errors.projectId ? (
							<p className="field-error">
								{form.formState.errors.projectId.message}
							</p>
						) : null}
					</div>

					<div className="grid gap-2">
						<Label>{t("common.fields.formerStudent")}</Label>
						<Controller
							control={form.control}
							name="formerStudentId"
							render={({ field }) => (
								<Combobox
									options={formerStudentOptions}
									value={field.value}
									onValueChange={field.onChange}
									placeholder={t("common.placeholders.select")}
									searchPlaceholder={t("common.placeholders.search")}
									emptyMessage={t("common.placeholders.noResults")}
								/>
							)}
						/>
						{form.formState.errors.formerStudentId ? (
							<p className="field-error">
								{form.formState.errors.formerStudentId.message}
							</p>
						) : null}
					</div>
				</>
			) : (
				<div className="grid gap-2">
					<Label>{t("common.fields.status")}</Label>
					<Controller
						control={form.control}
						name="status"
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
									{options.map(option => (
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
					{form.formState.errors.status ? (
						<p className="field-error">
							{form.formState.errors.status.message}
						</p>
					) : null}
				</div>
			)}
		</section>
	);

	if (isCreateMode || !enrollment) {
		return editorSection;
	}

	return (
		<Tabs
			defaultValue="enrollment"
			className="drawer-sticky-tabs grid gap-4"
		>
			<TabsList className="w-full">
				<TabsTrigger value="enrollment">
					{t("project.enrollmentPage.editor.tabs.enrollment")}
				</TabsTrigger>
				<TabsTrigger value="linked">
					{t("project.enrollmentPage.editor.tabs.linked")}
				</TabsTrigger>
			</TabsList>

			<TabsContent
				value="enrollment"
				className="grid gap-6"
			>
				{editorSection}
			</TabsContent>

			<TabsContent
				value="linked"
				className="grid gap-6"
			>
				<EnrollmentOwnDetailsContent
					enrollment={enrollment}
					columns={2}
				/>

				{formerStudent ? (
					<Accordion
						type="single"
						collapsible
						defaultValue="linked-student"
					>
						<AccordionItem value="linked-student">
							<AccordionTrigger>
								{t("common.linkedFormerStudent.overhead")}
							</AccordionTrigger>
							<AccordionContent>
								<FormerStudentOwnDetailsContent
									formerStudent={formerStudent}
									columns={2}
								/>
							</AccordionContent>
						</AccordionItem>
					</Accordion>
				) : null}

				{project ? (
					<Accordion
						type="single"
						collapsible
						defaultValue="linked-project"
					>
						<AccordionItem value="linked-project">
							<AccordionTrigger>
								{t("project.enrollmentPage.dialog.linkedProject.overhead")}
							</AccordionTrigger>
							<AccordionContent>
								<ProjectOwnDetailsContent
									project={project}
									createdByLabel={project.projectInfo.createdBy.name}
									columns={2}
								/>
							</AccordionContent>
						</AccordionItem>
					</Accordion>
				) : null}
			</TabsContent>
		</Tabs>
	);
}
