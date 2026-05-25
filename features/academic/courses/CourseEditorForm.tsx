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
import type { CourseEditorFormProps } from "@/types";
import { WebApiError } from "@/utils";

export function CourseEditorForm({
	canRenderForm,
	course,
	courseError,
	form,
	onRefreshCourse,
	onRefreshSchools,
	schoolOptions,
	schoolsError,
}: CourseEditorFormProps) {
	const { t } = useTranslation();

	if (courseError) {
		if (courseError instanceof WebApiError && courseError.status === 404) {
			return (
				<NotFoundState
					title={t("academic.coursePage.update.notFound.title")}
					description={t("academic.coursePage.update.notFound.description")}
				/>
			);
		}

		return (
			<SomeErrorState
				title={t("academic.coursePage.update.loadError.title")}
				description={t("academic.coursePage.update.loadError.description")}
				onRefresh={onRefreshCourse}
			/>
		);
	}

	if (schoolsError) {
		return (
			<SomeErrorState
				title={t("academic.coursePage.editor.schoolLoadError.title")}
				description={t(
					"academic.coursePage.editor.schoolLoadError.description",
				)}
				onRefresh={onRefreshSchools}
			/>
		);
	}

	if (!canRenderForm) {
		return (
			<NotFoundState title={t("academic.coursePage.update.notFound.title")} />
		);
	}

	return (
		<div className="grid gap-4">
			<div className="grid gap-2">
				<Label htmlFor="course-name">
					{t("academic.coursePage.editor.fields.name")}
				</Label>
				<Input
					id="course-name"
					{...form.register("name")}
					aria-describedby={
						form.formState.errors.name ? "course-name-error" : undefined
					}
					aria-invalid={form.formState.errors.name ? "true" : "false"}
					placeholder={t("academic.coursePage.editor.fields.namePlaceholder")}
				/>
				{form.formState.errors.name ? (
					<p
						id="course-name-error"
						className="field-error"
					>
						{form.formState.errors.name.message}
					</p>
				) : null}
			</div>

			<div className="grid gap-2">
				<Label htmlFor="course-school">
					{t("academic.coursePage.editor.fields.school")}
				</Label>
				<Controller
					control={form.control}
					name="schoolId"
					render={({ field }) => (
						<Combobox
							id="course-school"
							options={schoolOptions}
							value={field.value}
							onValueChange={field.onChange}
							placeholder={t(
								"academic.coursePage.editor.fields.schoolPlaceholder",
							)}
							searchPlaceholder={t(
								"academic.coursePage.editor.fields.schoolSearchPlaceholder",
							)}
							emptyMessage={t(
								"academic.coursePage.editor.fields.schoolEmptyMessage",
							)}
						/>
					)}
				/>
				{form.formState.errors.schoolId ? (
					<p className="field-error">
						{form.formState.errors.schoolId.message}
					</p>
				) : null}
			</div>

			{course ? (
				<div className="grid gap-4 pt-2 sm:grid-cols-3">
					<div className="grid gap-1">
						<p className="ty-helper">
							{t("academic.coursePage.dialog.fields.id")}
						</p>
						<p className="ty-sm-semibold">{course.id}</p>
					</div>
					<div className="grid gap-1">
						<p className="ty-helper">
							{t("academic.coursePage.dialog.fields.createdAt")}
						</p>
						<p className="ty-sm-semibold">
							{course.auditInfo.createdAtFormatted}
						</p>
					</div>
					<div className="grid gap-1">
						<p className="ty-helper">
							{t("academic.coursePage.dialog.fields.updatedAt")}
						</p>
						<p className="ty-sm-semibold">
							{course.auditInfo.updatedAtFormatted}
						</p>
					</div>
				</div>
			) : null}
		</div>
	);
}
