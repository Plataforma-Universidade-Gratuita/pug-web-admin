"use client";

import { useMemo } from "react";

import { useTranslation } from "react-i18next";

import { Badge, NotFoundState, SomeErrorState } from "@/components";
import { useCoursesQuery } from "@/features/academic/courses/queries";
import { useFormerStudentDetailQuery } from "@/features/academic/former-students/queries";
import {
	getStudentCoursesErrorToastContent,
	getStudentDetailErrorToastContent,
	resolveFormerStudentCourseLabel,
} from "@/features/academic/former-students/utils";
import { useAccountDetailQuery } from "@/features/identity/accounts/queries";
import { useUserDetailQuery } from "@/features/identity/users/queries";
import {
	EntityPageFieldsGrid,
	EntityPageFieldsGridSkeleton,
	EntityPageShell,
} from "@/features/shared/entity-pages";
import { useQueryErrorToasts } from "@/hooks";
import type { FormerStudentPageProps } from "@/types";
import { WebApiError } from "@/utils";

export function FormerStudentPage({
	formerStudentId,
}: FormerStudentPageProps) {
	const { t } = useTranslation();
	const formerStudentDetailQuery = useFormerStudentDetailQuery(formerStudentId);
	const accountDetailQuery = useAccountDetailQuery(
		formerStudentDetailQuery.data?.accountId ?? null,
	);
	const userDetailQuery = useUserDetailQuery(
		accountDetailQuery.data?.userId ?? null,
	);
	const coursesQuery = useCoursesQuery();

	useQueryErrorToasts([
		{
			key: `former-student-detail-${formerStudentId}`,
			error: formerStudentDetailQuery.error,
			errorUpdatedAt: formerStudentDetailQuery.errorUpdatedAt,
			getContent: error => getStudentDetailErrorToastContent(t, error),
			isError: formerStudentDetailQuery.isError,
		},
		{
			key: `former-student-courses-${formerStudentId}`,
			error: coursesQuery.error,
			errorUpdatedAt: coursesQuery.errorUpdatedAt,
			getContent: error => getStudentCoursesErrorToastContent(t, error),
			isError: coursesQuery.isError,
		},
	]);

	const courseById = useMemo(
		() => new Map((coursesQuery.data ?? []).map(course => [course.id, course])),
		[coursesQuery.data],
	);
	const formerStudent = formerStudentDetailQuery.data;
	const account = accountDetailQuery.data;
	const user = userDetailQuery.data;
	const fields = useMemo(
		() =>
			formerStudent
				? [
						{
							id: "accountId",
							label: t("academic.studentPage.dialog.fields.accountId"),
							value: formerStudent.accountId,
						},
						{
							id: "name",
							label: t("academic.studentPage.dialog.fields.name"),
							value: user?.name ?? "-",
						},
						{
							id: "cpf",
							label: t("academic.studentPage.dialog.fields.cpf"),
							value: user?.cpfFormatted ?? "-",
						},
						{
							id: "email",
							label: t("academic.studentPage.dialog.fields.email"),
							value: account?.email ?? "-",
						},
						{
							id: "active",
							label: t("academic.studentPage.dialog.fields.active"),
							value: (
								<Badge
									className="min-h-5 px-2 py-0.5"
									tone={account?.active ? "success" : "danger"}
									variant="primary"
								>
									{account?.active
										? t("academic.studentPage.dialog.active.yes")
										: t("academic.studentPage.dialog.active.no")}
								</Badge>
							),
						},
						{
							id: "academicRegistration",
							label: t(
								"academic.studentPage.dialog.fields.academicRegistration",
							),
							value: formerStudent.academicRegistration,
						},
						{
							id: "campus",
							label: t("academic.studentPage.dialog.fields.campus"),
							value: formerStudent.campus.campusFormatted,
						},
						{
							id: "course",
							label: t("academic.studentPage.dialog.fields.course"),
							value: resolveFormerStudentCourseLabel(
								courseById,
								formerStudent.courseId,
							),
						},
						{
							id: "requiredHours",
							label: t("academic.studentPage.dialog.fields.requiredHours"),
							value: formerStudent.counterpartHours.requiredHours,
						},
						{
							id: "completedHours",
							label: t("academic.studentPage.dialog.fields.completedHours"),
							value: formerStudent.counterpartHours.completedHours,
						},
						{
							id: "missingHours",
							label: t("academic.studentPage.dialog.fields.missingHours"),
							value: formerStudent.counterpartHours.missingHours,
						},
						{
							id: "startDate",
							label: t("academic.studentPage.dialog.fields.startDate"),
							value: formerStudent.period.startDateFormatted,
						},
						{
							id: "dueDate",
							label: t("academic.studentPage.dialog.fields.dueDate"),
							value: formerStudent.period.dueDateFormatted,
						},
						{
							id: "remainingDays",
							label: t("academic.studentPage.dialog.fields.remainingDays"),
							value: formerStudent.period.remainingDaysFormatted,
						},
						{
							id: "createdAt",
							label: t("academic.studentPage.dialog.fields.createdAt"),
							value: formerStudent.auditInfo.createdAtFormatted,
						},
						{
							id: "updatedAt",
							label: t("academic.studentPage.dialog.fields.updatedAt"),
							value: formerStudent.auditInfo.updatedAtFormatted,
						},
					]
				: [],
		[account?.active, account?.email, courseById, formerStudent, t, user?.cpfFormatted, user?.name],
	);

	return (
		<EntityPageShell
			title={user?.name ?? t("academic.studentPage.dialog.titleFallback")}
			description={t("academic.studentPage.description")}
		>
			{formerStudentDetailQuery.isError ? (
				formerStudentDetailQuery.error instanceof WebApiError &&
				formerStudentDetailQuery.error.status === 404 ? (
					<NotFoundState
						title={t("academic.studentPage.dialog.notFound.title")}
						description={t("academic.studentPage.dialog.notFound.description")}
					/>
				) : (
					<SomeErrorState
						title={t("academic.studentPage.dialog.error.title")}
						description={t("academic.studentPage.dialog.error.description")}
						onRefresh={() => {
							void formerStudentDetailQuery.refetch();
						}}
					/>
				)
			) : formerStudent ? (
				<EntityPageFieldsGrid fields={fields} />
			) : formerStudentDetailQuery.isLoading ? (
				<EntityPageFieldsGridSkeleton />
			) : (
				<NotFoundState
					title={t("academic.studentPage.dialog.notFound.title")}
				/>
			)}
		</EntityPageShell>
	);
}
