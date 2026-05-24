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
import type { AttendanceCreateFormProps } from "@/types/client/project";

export function AttendanceCreateForm({
	canRenderForm,
	form,
	onRefreshProjects,
	onRefreshStudents,
	projectOptions,
	projectsError,
	studentOptions,
	studentsError,
}: AttendanceCreateFormProps) {
	const { t } = useTranslation();

	if (projectsError) {
		return (
			<SomeErrorState
				title={t("project.attendancePage.editor.projectLoadError.title")}
				description={t(
					"project.attendancePage.editor.projectLoadError.description",
				)}
				onRefresh={onRefreshProjects}
			/>
		);
	}

	if (studentsError) {
		return (
			<SomeErrorState
				title={t("project.attendancePage.editor.studentLoadError.title")}
				description={t(
					"project.attendancePage.editor.studentLoadError.description",
				)}
				onRefresh={onRefreshStudents}
			/>
		);
	}

	if (!canRenderForm) {
		return (
			<NotFoundState title={t("project.attendancePage.editor.notReady.title")} />
		);
	}

	return (
		<div className="grid gap-4">
			<div className="grid gap-2">
				<Label htmlFor="attendance-project">
					{t("project.attendancePage.editor.fields.project")}
				</Label>
				<Controller
					control={form.control}
					name="projectId"
					render={({ field }) => (
						<Combobox
							id="attendance-project"
							options={projectOptions}
							value={field.value}
							onValueChange={field.onChange}
							placeholder={t(
								"project.attendancePage.editor.fields.projectPlaceholder",
							)}
							searchPlaceholder={t(
								"project.attendancePage.editor.fields.projectSearchPlaceholder",
							)}
							emptyMessage={t(
								"project.attendancePage.editor.fields.projectEmptyMessage",
							)}
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
				<Label htmlFor="attendance-student">
					{t("project.attendancePage.editor.fields.student")}
				</Label>
				<Controller
					control={form.control}
					name="studentId"
					render={({ field }) => (
						<Combobox
							id="attendance-student"
							options={studentOptions}
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
				{form.formState.errors.studentId ? (
					<p className="field-error">
						{form.formState.errors.studentId.message}
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
					aria-describedby={
						form.formState.errors.duration
							? "attendance-duration-error"
							: undefined
					}
					aria-invalid={form.formState.errors.duration ? "true" : "false"}
					placeholder={t(
						"project.attendancePage.editor.fields.durationPlaceholder",
					)}
				/>
				{form.formState.errors.duration ? (
					<p
						id="attendance-duration-error"
						className="field-error"
					>
						{form.formState.errors.duration.message}
					</p>
				) : null}
			</div>
		</div>
	);
}
