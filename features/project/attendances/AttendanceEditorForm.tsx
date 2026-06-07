"use client";

import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { WebApiError } from "@/api/web";
import {
	AccountDetailsContent,
	FormerStudentOwnDetailsContent,
	ProjectOwnDetailsContent,
} from "@/components/composite";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
	Combobox,
	Input,
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
import { AttendanceOwnDetailsContent } from "@/features/project/attendances/attendance/AttendanceOwnDetailsContent";
import { getAttendanceStatusOptions } from "@/features/project/attendances/utils";
import type { AttendanceEditorFormProps } from "@/types/client";

export function AttendanceEditorForm({
	attendance,
	attendanceError,
	canRenderForm,
	form,
	formerStudent,
	formerStudentError,
	formerStudentOptions,
	mode,
	onRefreshAttendance,
	onRefreshFormerStudent,
	onRefreshProjects,
	project,
	projectError,
	projectOptions,
	projectsError,
}: AttendanceEditorFormProps) {
	const { t } = useTranslation();
	const isCreateMode = mode === "create";
	const statusOptions = getAttendanceStatusOptions(t);

	if (!isCreateMode && attendanceError) {
		if (
			attendanceError instanceof WebApiError &&
			attendanceError.status === 404
		) {
			return (
				<NotFoundState
					title={t("project.attendancePage.update.notFound.title")}
					description={t("project.attendancePage.update.notFound.description")}
				/>
			);
		}

		return (
			<SomeErrorState
				title={t("project.attendancePage.update.loadError.title")}
				description={t("project.attendancePage.update.loadError.description")}
				onRefresh={onRefreshAttendance}
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
				onRefresh={onRefreshProjects}
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
		return (
			<NotFoundState
				title={t("project.attendancePage.update.notFound.title")}
			/>
		);
	}

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
									placeholder={t("common.fields.projectPlaceholder")}
									searchPlaceholder={t(
										"common.fields.projectSearchPlaceholder",
									)}
									emptyMessage={t("common.fields.projectEmptyMessage")}
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
						<Label>{t("project.attendancePage.editor.fields.student")}</Label>
						<Controller
							control={form.control}
							name="formerStudentId"
							render={({ field }) => (
								<Combobox
									options={formerStudentOptions}
									value={field.value}
									onValueChange={field.onChange}
									placeholder={t(
										"project.attendancePage.editor.fields.studentPlaceholder",
									)}
									searchPlaceholder={t(
										"project.attendancePage.editor.fields.studentSearchPlaceholder",
									)}
									emptyMessage={t(
										"project.attendancePage.editor.fields.studentEmptyMessage",
									)}
								/>
							)}
						/>
						{form.formState.errors.formerStudentId ? (
							<p className="field-error">
								{form.formState.errors.formerStudentId.message}
							</p>
						) : null}
					</div>

					<div className="grid gap-2">
						<Label htmlFor="attendance-duration">
							{t("project.attendancePage.editor.fields.duration")}
						</Label>
						<Input
							id="attendance-duration"
							inputMode="decimal"
							{...form.register("duration")}
							placeholder={t(
								"project.attendancePage.editor.fields.durationPlaceholder",
							)}
						/>
						{form.formState.errors.duration ? (
							<p className="field-error">
								{form.formState.errors.duration.message}
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
									placeholder={t("common.fields.statusPlaceholder")}
								/>
								<SelectContent>
									{statusOptions.map(option => (
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

	if (isCreateMode || !attendance) {
		return editorSection;
	}

	return (
		<Tabs
			defaultValue="attendance"
			className="drawer-sticky-tabs grid gap-4"
		>
			<TabsList className="w-full">
				<TabsTrigger value="attendance">
					{t("project.attendancePage.editor.tabs.attendance")}
				</TabsTrigger>
				<TabsTrigger value="linked">
					{t("project.attendancePage.editor.tabs.linked")}
				</TabsTrigger>
			</TabsList>

			<TabsContent
				value="attendance"
				className="grid gap-6"
			>
				{editorSection}
			</TabsContent>

			<TabsContent
				value="linked"
				className="grid gap-6"
			>
				<AttendanceOwnDetailsContent
					attendance={attendance}
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
								{t("project.attendancePage.dialog.linkedStudent.overhead")}
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

				{formerStudent ? (
					<Accordion
						type="single"
						collapsible
						defaultValue="linked-account"
					>
						<AccordionItem value="linked-account">
							<AccordionTrigger>
				{t("common.linkedAccount.overhead")}
							</AccordionTrigger>
							<AccordionContent>
								<AccountDetailsContent
									accountId={formerStudent.accountId}
									includeLinkedUser={false}
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
								{t("project.attendancePage.dialog.linkedProject.overhead")}
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
