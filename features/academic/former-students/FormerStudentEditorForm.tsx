"use client";

import { useState } from "react";

import { useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { WebApiError } from "@/api/web";
import {
	AreaOfExpertiseDetailsContent,
	CourseOwnDetailsContent,
	FormerStudentOwnDetailsContent,
	LinkedDetailsAccordion,
	UserDetailsContent,
} from "@/components/composite";
import {
	NotFoundState,
	SomeErrorState,
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/components/primitives";
import { FormerStudentAcademicSection } from "@/features/academic/former-students/components/FormerStudentAcademicSection";
import { FormerStudentProfileSection } from "@/features/academic/former-students/components/FormerStudentProfileSection";
import { getFormerStudentCampusOptions } from "@/features/academic/former-students/utils";
import {
	getAccountTypeLabel,
	getAccountTypeTone,
} from "@/features/identity/accounts/utils";
import type {
	CpfFormFieldExistingUser,
	FormerStudentEditorFormProps,
} from "@/types/client";

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
					title={t("common.linkedUser.notFound.title")}
					description={t("common.linkedUser.notFound.description")}
				/>
			);
		}

		return (
			<SomeErrorState
				title={t("common.linkedUser.error.title")}
				description={t("common.linkedUser.error.description")}
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
		? t("common.status.active")
		: t("common.status.inactive");
	const accountStatusTone = accountIsActive ? "success" : "danger";
	const accountTypeLabel = getAccountTypeLabel(t, "FORMER_STUDENT");
	const accountTypeTone = linkedAccount
		? getAccountTypeTone(linkedAccount.accountType)
		: "warning";
	const linkedCourse = formerStudent
		? (courseById.get(formerStudent.courseId) ?? null)
		: (courseById.get(watchedCourseId ?? "") ?? null);

	if (!isUpdateMode || !formerStudent || !linkedAccount) {
		return (
			<>
				<FormerStudentProfileSection
					existingUsers={existingUsers}
					form={form}
					isCreateLikeMode={isCreateLikeMode}
					isNameDisabled={isNameDisabled}
					onMatchedExistingUserChange={setMatchedExistingUser}
				/>
				<FormerStudentAcademicSection
					accountStatusLabel={accountStatusLabel}
					accountStatusTone={accountStatusTone}
					accountTypeLabel={accountTypeLabel}
					accountTypeTone={accountTypeTone}
					campusOptions={campusOptions}
					courseOptions={courseOptions}
					form={form}
				/>
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
				<FormerStudentProfileSection
					existingUsers={existingUsers}
					form={form}
					isCreateLikeMode={isCreateLikeMode}
					isNameDisabled={isNameDisabled}
					onMatchedExistingUserChange={setMatchedExistingUser}
				/>
				<FormerStudentAcademicSection
					accountStatusLabel={accountStatusLabel}
					accountStatusTone={accountStatusTone}
					accountTypeLabel={accountTypeLabel}
					accountTypeTone={accountTypeTone}
					campusOptions={campusOptions}
					courseOptions={courseOptions}
					form={form}
				/>
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
