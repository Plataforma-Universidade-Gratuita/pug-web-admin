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
	enrollmentOptions,
	enrollmentsError,
	form,
	formerStudent,
	formerStudentError,
	mode,
	onRefreshAttendance,
	onRefreshEnrollments,
	onRefreshFormerStudent,
	onRefreshProjects,
	project,
	projectError,
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
					title={t("common.notFound.title")}
					description={t("common.notFound.description")}
				/>
			);
		}

		return (
			<SomeErrorState
				title={t("common.errors.editorLoad.title", {
					object: t("common.objects.attendance"),
				})}
				description={t("common.errors.editorLoad.description", {
					object: t("common.objects.attendance"),
				})}
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

	if (isCreateMode && enrollmentsError) {
		return (
			<SomeErrorState
				title={t("common.errors.editorLoad.title", {
					object: t("common.objects.attendance"),
				})}
				description={t("common.errors.editorLoad.description", {
					object: t("common.objects.attendance"),
				})}
				onRefresh={onRefreshEnrollments}
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
		return <NotFoundState title={t("common.notFound.title")} />;
	}

	const editorSection = (
		<section className="grid gap-4">
			{isCreateMode ? (
				<>
					<div className="grid gap-2">
						<Label>{t("common.fields.enrollment")}</Label>
						<Controller
							control={form.control}
							name="enrollmentId"
							render={({ field }) => (
								<Combobox
									options={enrollmentOptions}
									value={field.value}
									onValueChange={field.onChange}
									placeholder={t("common.placeholders.select")}
									searchPlaceholder={t("common.placeholders.search")}
									emptyMessage={t("common.placeholders.noResults")}
								/>
							)}
						/>
						{form.formState.errors.enrollmentId ? (
							<p className="field-error">
								{form.formState.errors.enrollmentId.message}
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
									placeholder={t("common.placeholders.select")}
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
