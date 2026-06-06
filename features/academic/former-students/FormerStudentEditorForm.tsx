"use client";

import { useState } from "react";

import { Controller, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { WebApiError } from "@/api/web";
import {
	AccountSummaryBadges,
	AreaOfExpertiseDetailsContent,
	Combobox,
	CourseOwnDetailsContent,
	CpfFormField,
	DatePicker,
	FormerStudentOwnDetailsContent,
	Input,
	Label,
	LinkedDetailsAccordion,
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
	UserDetailsContent,
} from "@/components";
import { getFormerStudentCampusOptions } from "@/features/academic/former-students/utils";
import {
	getAccountTypeLabel,
	getAccountTypeTone,
} from "@/features/identity/accounts/utils";
import type {
	CpfFormFieldExistingUser,
	FormerStudentEditorFormProps,
} from "@/types";

export function FormerStudentEditorForm({
	canRenderForm,
	courseById,
	courseOptions,
	coursesError,
	existingUsers,
	form,
	linkedAccount,
	linkedAccountError,
	mode,
	onRefreshCourses,
	onRefreshFormerStudent,
	onRefreshUser,
	formerStudent,
	formerStudentError,
	userError,
}: FormerStudentEditorFormProps) {
	const { t } = useTranslation();
	const campusOptions = getFormerStudentCampusOptions(t);
	const isUpdateMode = mode === "update";
	const isCreateLikeMode = mode !== "update";
	const watchedCpf = useWatch({
		control: form.control,
		name: "cpf",
	});
	const watchedCourseId = useWatch({
		control: form.control,
		name: "courseId",
	});
	const [matchedExistingUser, setMatchedExistingUser] =
		useState<CpfFormFieldExistingUser | null>(null);

	if (mode !== "create" && formerStudentError) {
		if (
			formerStudentError instanceof WebApiError &&
			formerStudentError.status === 404
		) {
			return (
				<NotFoundState
					title={t("academic.formerStudentPage.update.notFound.title")}
					description={t(
						"academic.formerStudentPage.update.notFound.description",
					)}
				/>
			);
		}

		return (
			<SomeErrorState
				title={t("academic.formerStudentPage.update.loadError.title")}
				description={t(
					"academic.formerStudentPage.update.loadError.description",
				)}
				onRefresh={onRefreshFormerStudent}
			/>
		);
	}

	if (userError) {
		if (userError instanceof WebApiError && userError.status === 404) {
			return (
				<NotFoundState
					title={t("identity.adminPage.dialog.linkedUser.notFound.title")}
					description={t(
						"identity.adminPage.dialog.linkedUser.notFound.description",
					)}
				/>
			);
		}

		return (
			<SomeErrorState
				title={t("identity.adminPage.dialog.linkedUser.error.title")}
				description={t(
					"identity.adminPage.dialog.linkedUser.error.description",
				)}
				onRefresh={onRefreshUser}
			/>
		);
	}

	if (linkedAccountError) {
		if (
			linkedAccountError instanceof WebApiError &&
			linkedAccountError.status === 404
		) {
			return (
				<NotFoundState
					title={t("identity.accountPage.dialog.notFound.title")}
					description={t("identity.accountPage.dialog.notFound.description")}
				/>
			);
		}

		return (
			<SomeErrorState
				title={t("identity.accountPage.dialog.error.title")}
				description={t("identity.accountPage.dialog.error.description")}
				onRefresh={onRefreshFormerStudent}
			/>
		);
	}

	if (coursesError) {
		return (
			<SomeErrorState
				title={t("academic.formerStudentPage.editor.courseLoadError.title")}
				description={t(
					"academic.formerStudentPage.editor.courseLoadError.description",
				)}
				onRefresh={onRefreshCourses}
			/>
		);
	}

	if (
		!canRenderForm ||
		(!isUpdateMode && !formerStudent && mode !== "create")
	) {
		return (
			<NotFoundState
				title={t("academic.formerStudentPage.update.notFound.title")}
			/>
		);
	}

	const hasCpfValue = (watchedCpf ?? "").trim().length > 0;
	const isNameDisabled =
		isCreateLikeMode && (!hasCpfValue || matchedExistingUser != null);
	const accountIsActive = linkedAccount?.active ?? true;
	const accountStatusLabel = accountIsActive
		? t("identity.accountPage.dialog.active.yes")
		: t("identity.accountPage.dialog.active.no");
	const accountStatusTone = accountIsActive ? "success" : "danger";
	const accountTypeLabel = getAccountTypeLabel(t, "FORMER_STUDENT");
	const accountTypeTone = linkedAccount
		? getAccountTypeTone(linkedAccount.accountType)
		: "warning";
	const linkedCourse = formerStudent
		? (courseById.get(formerStudent.courseId) ?? null)
		: (courseById.get(watchedCourseId ?? "") ?? null);

	const profileSection = (
		<section className="grid gap-4">
			<div className="grid gap-1">
				<p className="ty-overhead">
					{t("identity.adminPage.update.tabs.profile")}
				</p>
			</div>
			{isCreateLikeMode ? (
				<CpfFormField
					id="former-student-cpf"
					form={form}
					existingUsers={existingUsers}
					label={t("academic.formerStudentPage.editor.fields.cpf")}
					placeholder={t(
						"academic.formerStudentPage.editor.fields.cpfPlaceholder",
					)}
					searchPlaceholder={t(
						"academic.formerStudentPage.editor.fields.cpfSearchPlaceholder",
					)}
					emptyMessage={t("academic.formerStudentPage.editor.fields.cpfEmpty")}
					createOptionLabel={value =>
						t("academic.formerStudentPage.editor.fields.cpfCreateOption", {
							value,
						})
					}
					onExistingUserChange={user => setMatchedExistingUser(user)}
				/>
			) : null}

			<div className="grid gap-2">
				<Label htmlFor="former-student-name">
					{t("academic.formerStudentPage.editor.fields.name")}
				</Label>
				<Input
					id="former-student-name"
					{...form.register("name")}
					disabled={isNameDisabled}
					aria-describedby={
						form.formState.errors.name ? "former-student-name-error" : undefined
					}
					aria-invalid={form.formState.errors.name ? "true" : "false"}
					placeholder={t(
						"academic.formerStudentPage.editor.fields.namePlaceholder",
					)}
				/>
				{form.formState.errors.name ? (
					<p
						id="former-student-name-error"
						className="field-error"
					>
						{form.formState.errors.name.message}
					</p>
				) : null}
			</div>

			<div className="grid gap-2">
				<Label htmlFor="former-student-email">
					{t("academic.formerStudentPage.editor.fields.email")}
				</Label>
				<Input
					id="former-student-email"
					type="email"
					{...form.register("email")}
					aria-describedby={
						form.formState.errors.email
							? "former-student-email-error"
							: undefined
					}
					aria-invalid={form.formState.errors.email ? "true" : "false"}
					placeholder={t(
						"academic.formerStudentPage.editor.fields.emailPlaceholder",
					)}
				/>
				{form.formState.errors.email ? (
					<p
						id="former-student-email-error"
						className="field-error"
					>
						{form.formState.errors.email.message}
					</p>
				) : null}
			</div>

			<div className="grid gap-2">
				<Label htmlFor="former-student-registration">
					{t("academic.formerStudentPage.editor.fields.academicRegistration")}
				</Label>
				<Input
					id="former-student-registration"
					{...form.register("academicRegistration")}
					placeholder={t(
						"academic.formerStudentPage.editor.fields.academicRegistrationPlaceholder",
					)}
				/>
				{form.formState.errors.academicRegistration ? (
					<p className="field-error">
						{form.formState.errors.academicRegistration.message}
					</p>
				) : null}
			</div>
		</section>
	);

	const academicSection = (
		<section className="grid gap-4">
			<div className="grid gap-1">
				<p className="ty-overhead">
					{t("academic.formerStudentPage.editor.sections.academic")}
				</p>
			</div>

			<div className="grid gap-2">
				<Label>{t("academic.formerStudentPage.editor.fields.campus")}</Label>
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
									"academic.formerStudentPage.editor.fields.campusPlaceholder",
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
					<p className="field-error">{form.formState.errors.campus.message}</p>
				) : null}
			</div>

			<div className="grid gap-2">
				<Label>{t("academic.formerStudentPage.editor.fields.course")}</Label>
				<Controller
					control={form.control}
					name="courseId"
					render={({ field }) => (
						<Combobox
							options={courseOptions}
							value={field.value}
							onValueChange={field.onChange}
							placeholder={t(
								"academic.formerStudentPage.editor.fields.coursePlaceholder",
							)}
							searchPlaceholder={t(
								"academic.formerStudentPage.editor.fields.courseSearchPlaceholder",
							)}
							emptyMessage={t(
								"academic.formerStudentPage.editor.fields.courseEmptyMessage",
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

			<div className="grid gap-2">
				<Label htmlFor="former-student-required-hours">
					{t("academic.formerStudentPage.editor.fields.requiredHours")}
				</Label>
				<Input
					id="former-student-required-hours"
					type="number"
					min="0"
					{...form.register("requiredHours")}
					placeholder={t(
						"academic.formerStudentPage.editor.fields.requiredHoursPlaceholder",
					)}
				/>
				{form.formState.errors.requiredHours ? (
					<p className="field-error">
						{form.formState.errors.requiredHours.message}
					</p>
				) : null}
			</div>

			<AccountSummaryBadges
				accountTypeFieldLabel={t(
					"identity.adminPage.update.fields.accountType",
				)}
				accountTypeLabel={accountTypeLabel}
				accountTypeTone={accountTypeTone}
				activeFieldLabel={t("identity.adminPage.update.fields.active")}
				activeLabel={accountStatusLabel}
				activeTone={accountStatusTone}
			/>

			<div className="grid gap-4 md:grid-cols-2">
				<div className="grid gap-2">
					<Label>
						{t("academic.formerStudentPage.editor.fields.startDate")}
					</Label>
					<Controller
						control={form.control}
						name="startDate"
						render={({ field }) => (
							<DatePicker
								value={field.value}
								onValueChange={field.onChange}
								placeholder={t(
									"academic.formerStudentPage.editor.fields.startDatePlaceholder",
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
					<Label>{t("academic.formerStudentPage.editor.fields.dueDate")}</Label>
					<Controller
						control={form.control}
						name="dueDate"
						render={({ field }) => (
							<DatePicker
								value={field.value}
								onValueChange={field.onChange}
								placeholder={t(
									"academic.formerStudentPage.editor.fields.dueDatePlaceholder",
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
		</section>
	);

	if (!isUpdateMode || !formerStudent || !linkedAccount) {
		return (
			<>
				{profileSection}
				{academicSection}
			</>
		);
	}

	return (
		<Tabs
			defaultValue="academic"
			className="drawer-sticky-tabs grid gap-4"
		>
			<TabsList className="w-full">
				<TabsTrigger value="academic">
					{t("academic.formerStudentPage.editor.tabs.academic")}
				</TabsTrigger>
				<TabsTrigger value="linked">
					{t("academic.formerStudentPage.editor.tabs.linked")}
				</TabsTrigger>
			</TabsList>

			<TabsContent
				value="academic"
				className="grid gap-6"
			>
				{profileSection}
				{academicSection}
			</TabsContent>

			<TabsContent
				value="linked"
				className="grid gap-6"
			>
				<FormerStudentOwnDetailsContent
					formerStudent={formerStudent}
					includeEditableFields={false}
				/>
				<LinkedDetailsAccordion
					defaultValue="linked-user"
					items={[
						{
							value: "linked-user",
							title: t("identity.adminPage.update.tabs.user"),
							content: (
								<UserDetailsContent
									userId={linkedAccount.userId}
									columns={2}
								/>
							),
						},
						...(linkedCourse
							? [
									{
										value: "linked-course",
										title: t(
											"academic.formerStudentPage.editor.sections.linkedCourse",
										),
										content: (
											<div className="grid gap-6">
												<CourseOwnDetailsContent
													course={linkedCourse}
													columns={2}
													includeName
												/>
												<AreaOfExpertiseDetailsContent
													areaOfExpertise={linkedCourse.areaOfExpertise}
													columns={2}
												/>
											</div>
										),
									},
								]
							: []),
					]}
				/>
			</TabsContent>
		</Tabs>
	);
}
