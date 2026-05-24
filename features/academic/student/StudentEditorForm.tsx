"use client";

import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

import {
	Combobox,
	DatePicker,
	Input,
	Label,
	NotFoundState,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SomeErrorState,
} from "@/components";
import { getStudentCampusOptions } from "@/features/academic/student/utils";
import type { StudentEditorFormProps } from "@/types/client/academic";
import { WebApiError } from "@/utils/web-api";

export function StudentEditorForm({
	canRenderForm,
	courseOptions,
	coursesError,
	form,
	mode,
	onRefreshCourses,
	onRefreshStudent,
	student,
	studentError,
}: StudentEditorFormProps) {
	const { t } = useTranslation();
	const campusOptions = getStudentCampusOptions(t);
	const showIdentityFields = mode !== "update";
	const passwordPlaceholder = t(
		mode === "create"
			? "academic.studentPage.create.fields.passwordPlaceholder"
			: mode === "duplicate"
				? "academic.studentPage.duplicate.fields.passwordPlaceholder"
				: "academic.studentPage.update.fields.passwordPlaceholder",
	);

	if (studentError) {
		if (studentError instanceof WebApiError && studentError.status === 404) {
			return (
				<NotFoundState
					title={t("academic.studentPage.update.notFound.title")}
					description={t("academic.studentPage.update.notFound.description")}
				/>
			);
		}

		return (
			<SomeErrorState
				title={t("academic.studentPage.update.loadError.title")}
				description={t("academic.studentPage.update.loadError.description")}
				onRefresh={onRefreshStudent}
			/>
		);
	}

	if (coursesError) {
		return (
			<SomeErrorState
				title={t("academic.studentPage.editor.courseLoadError.title")}
				description={t(
					"academic.studentPage.editor.courseLoadError.description",
				)}
				onRefresh={onRefreshCourses}
			/>
		);
	}

	if (!canRenderForm) {
		return (
			<NotFoundState title={t("academic.studentPage.update.notFound.title")} />
		);
	}

	return (
		<div className="grid gap-6">
			<div className="grid gap-4 lg:grid-cols-2">
				{showIdentityFields ? (
					<div className="grid gap-2">
						<Label htmlFor="student-cpf">
							{t("academic.studentPage.editor.fields.cpf")}
						</Label>
						<Input
							id="student-cpf"
							{...form.register("cpf")}
							placeholder={t(
								"academic.studentPage.editor.fields.cpfPlaceholder",
							)}
						/>
						{form.formState.errors.cpf ? (
							<p className="field-error">{form.formState.errors.cpf.message}</p>
						) : null}
					</div>
				) : null}

				<div className="grid gap-2">
					<Label htmlFor="student-name">
						{t("academic.studentPage.editor.fields.name")}
					</Label>
					<Input
						id="student-name"
						{...form.register("name")}
						placeholder={t(
							"academic.studentPage.editor.fields.namePlaceholder",
						)}
					/>
					{form.formState.errors.name ? (
						<p className="field-error">{form.formState.errors.name.message}</p>
					) : null}
				</div>

				<div className="grid gap-2">
					<Label htmlFor="student-email">
						{t("academic.studentPage.editor.fields.email")}
					</Label>
					<Input
						id="student-email"
						type="email"
						{...form.register("email")}
						placeholder={t(
							"academic.studentPage.editor.fields.emailPlaceholder",
						)}
					/>
					{form.formState.errors.email ? (
						<p className="field-error">{form.formState.errors.email.message}</p>
					) : null}
				</div>

				<div className="grid gap-2">
					<Label htmlFor="student-password">
						{t("academic.studentPage.editor.fields.password")}
					</Label>
					<Input
						id="student-password"
						type="password"
						{...form.register("password")}
						placeholder={passwordPlaceholder}
					/>
					{form.formState.errors.password ? (
						<p className="field-error">
							{form.formState.errors.password.message}
						</p>
					) : null}
				</div>

				<div className="grid gap-2">
					<Label htmlFor="student-registration">
						{t("academic.studentPage.editor.fields.academicRegistration")}
					</Label>
					<Input
						id="student-registration"
						{...form.register("academicRegistration")}
						placeholder={t(
							"academic.studentPage.editor.fields.academicRegistrationPlaceholder",
						)}
					/>
					{form.formState.errors.academicRegistration ? (
						<p className="field-error">
							{form.formState.errors.academicRegistration.message}
						</p>
					) : null}
				</div>
			</div>

			<div className="grid gap-4 lg:grid-cols-3">
				<div className="grid gap-2">
					<Label>{t("academic.studentPage.editor.fields.campus")}</Label>
					<Controller
						control={form.control}
						name="campus"
						render={({ field }) => (
							<Select
								value={field.value}
								onValueChange={field.onChange}
							>
								<SelectTrigger
									className="w-full"
									placeholder={t(
										"academic.studentPage.editor.fields.campusPlaceholder",
									)}
								/>
								<SelectContent>
									{campusOptions.map(option => (
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
					{form.formState.errors.campus ? (
						<p className="field-error">
							{form.formState.errors.campus.message}
						</p>
					) : null}
				</div>

				<div className="grid gap-2 lg:col-span-2">
					<Label>{t("academic.studentPage.editor.fields.course")}</Label>
					<Controller
						control={form.control}
						name="courseId"
						render={({ field }) => (
							<Combobox
								options={courseOptions}
								value={field.value}
								onValueChange={field.onChange}
								placeholder={t(
									"academic.studentPage.editor.fields.coursePlaceholder",
								)}
								searchPlaceholder={t(
									"academic.studentPage.editor.fields.courseSearchPlaceholder",
								)}
								emptyMessage={t(
									"academic.studentPage.editor.fields.courseEmptyMessage",
								)}
							/>
						)}
					/>
					{form.formState.errors.courseId ? (
						<p className="field-error">
							{form.formState.errors.courseId.message}
						</p>
					) : null}
				</div>
			</div>

			<div className="grid gap-4 lg:grid-cols-3">
				<div className="grid gap-2">
					<Label htmlFor="student-required-hours">
						{t("academic.studentPage.editor.fields.requiredHours")}
					</Label>
					<Input
						id="student-required-hours"
						type="number"
						min="0"
						{...form.register("requiredHours")}
						placeholder={t(
							"academic.studentPage.editor.fields.requiredHoursPlaceholder",
						)}
					/>
					{form.formState.errors.requiredHours ? (
						<p className="field-error">
							{form.formState.errors.requiredHours.message}
						</p>
					) : null}
				</div>

				<div className="grid gap-2">
					<Label>{t("academic.studentPage.editor.fields.startDate")}</Label>
					<Controller
						control={form.control}
						name="startDate"
						render={({ field }) => (
							<DatePicker
								value={field.value}
								onValueChange={field.onChange}
								placeholder={t(
									"academic.studentPage.editor.fields.startDatePlaceholder",
								)}
							/>
						)}
					/>
					{form.formState.errors.startDate ? (
						<p className="field-error">
							{form.formState.errors.startDate.message}
						</p>
					) : null}
				</div>

				<div className="grid gap-2">
					<Label>{t("academic.studentPage.editor.fields.dueDate")}</Label>
					<Controller
						control={form.control}
						name="dueDate"
						render={({ field }) => (
							<DatePicker
								value={field.value}
								onValueChange={field.onChange}
								placeholder={t(
									"academic.studentPage.editor.fields.dueDatePlaceholder",
								)}
							/>
						)}
					/>
					{form.formState.errors.dueDate ? (
						<p className="field-error">
							{form.formState.errors.dueDate.message}
						</p>
					) : null}
				</div>
			</div>

			{student ? (
				<div className="grid gap-4 pt-2 sm:grid-cols-3">
					<div className="grid gap-1">
						<p className="ty-helper">
							{t("academic.studentPage.dialog.fields.userId")}
						</p>
						<p className="ty-sm-semibold">{student.userId}</p>
					</div>
					<div className="grid gap-1">
						<p className="ty-helper">
							{t("academic.studentPage.dialog.fields.createdAt")}
						</p>
						<p className="ty-sm-semibold">
							{student.auditInfo.createdAtFormatted}
						</p>
					</div>
					<div className="grid gap-1">
						<p className="ty-helper">
							{t("academic.studentPage.dialog.fields.updatedAt")}
						</p>
						<p className="ty-sm-semibold">
							{student.auditInfo.updatedAtFormatted}
						</p>
					</div>
				</div>
			) : null}
		</div>
	);
}
