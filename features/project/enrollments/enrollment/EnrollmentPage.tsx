"use client";

import { useMemo } from "react";

import { useTranslation } from "react-i18next";

import { Badge, NotFoundState, SomeErrorState } from "@/components";
import { useFormerStudentsQuery } from "@/features/academic/former-students/queries";
import { useAccountsQuery } from "@/features/identity/accounts/queries";
import { useUsersQuery } from "@/features/identity/users/queries";
import { useEnrollmentDetailQuery } from "@/features/project/enrollments/queries";
import {
	getEnrollmentDetailErrorToastContent,
	getEnrollmentProjectsErrorToastContent,
	getEnrollmentStatusTone,
	getEnrollmentStudentsErrorToastContent,
	parseEnrollmentCompositeKey,
	resolveEnrollmentFormerStudentLabel,
	resolveEnrollmentProjectLabel,
} from "@/features/project/enrollments/utils";
import { useProjectsQuery } from "@/features/project/projects/queries";
import {
	EntityPageFieldsGrid,
	EntityPageFieldsGridSkeleton,
	EntityPageShell,
} from "@/features/shared/entity-pages";
import { useQueryErrorToasts } from "@/hooks";
import type { EnrollmentPageProps } from "@/types";
import { WebApiError } from "@/utils";

export function EnrollmentPage({ enrollmentId }: EnrollmentPageProps) {
	const { t } = useTranslation();
	const enrollmentIdentifier = useMemo(
		() => parseEnrollmentCompositeKey(enrollmentId),
		[enrollmentId],
	);
	const projectsQuery = useProjectsQuery();
	const formerStudentsQuery = useFormerStudentsQuery();
	const accountsQuery = useAccountsQuery();
	const usersQuery = useUsersQuery();
	const enrollmentDetailQuery = useEnrollmentDetailQuery(
		enrollmentIdentifier?.projectId ?? null,
		enrollmentIdentifier?.formerStudentId ?? null,
	);

	useQueryErrorToasts([
		{
			key: `enrollment-detail-${enrollmentId}`,
			error: enrollmentDetailQuery.error,
			errorUpdatedAt: enrollmentDetailQuery.errorUpdatedAt,
			getContent: error => getEnrollmentDetailErrorToastContent(t, error),
			isError: enrollmentDetailQuery.isError,
		},
		{
			key: `enrollment-projects-${enrollmentId}`,
			error: projectsQuery.error,
			errorUpdatedAt: projectsQuery.errorUpdatedAt,
			getContent: error => getEnrollmentProjectsErrorToastContent(t, error),
			isError: projectsQuery.isError,
		},
		{
			key: `enrollment-students-${enrollmentId}`,
			error: formerStudentsQuery.error,
			errorUpdatedAt: formerStudentsQuery.errorUpdatedAt,
			getContent: error => getEnrollmentStudentsErrorToastContent(t, error),
			isError: formerStudentsQuery.isError,
		},
	]);

	const projectById = useMemo(
		() => new Map((projectsQuery.data ?? []).map(project => [project.id, project])),
		[projectsQuery.data],
	);
	const formerStudentById = useMemo(
		() =>
			new Map(
				(formerStudentsQuery.data ?? []).map(formerStudent => [
					formerStudent.accountId,
					formerStudent,
				]),
			),
		[formerStudentsQuery.data],
	);
	const accountById = useMemo(
		() => new Map((accountsQuery.data ?? []).map(account => [account.id, account])),
		[accountsQuery.data],
	);
	const userById = useMemo(
		() => new Map((usersQuery.data ?? []).map(user => [user.id, user])),
		[usersQuery.data],
	);

	const enrollment = enrollmentDetailQuery.data;
	const formerStudent = enrollment
		? formerStudentById.get(enrollment.formerStudentId)
		: undefined;
	const formerStudentAccount = formerStudent
		? accountById.get(formerStudent.accountId)
		: undefined;
	const formerStudentUser =
		formerStudentAccount ? userById.get(formerStudentAccount.userId) : undefined;
	const fields = useMemo(
		() =>
			enrollment
				? [
						{
							id: "student",
							label: t("project.enrollmentPage.dialog.fields.student"),
							value: resolveEnrollmentFormerStudentLabel(
								formerStudentById,
								accountById,
								userById,
								enrollment.formerStudentId,
							),
						},
						{
							id: "studentId",
							label: t("project.enrollmentPage.dialog.fields.studentId"),
							value: enrollment.formerStudentId,
						},
						{
							id: "email",
							label: t("project.enrollmentPage.dialog.fields.email"),
							value:
								formerStudentAccount?.email ??
								t("project.enrollmentPage.dialog.values.unknownStudent"),
						},
						{
							id: "registration",
							label: t("project.enrollmentPage.dialog.fields.registration"),
							value:
								formerStudent?.academicRegistration ??
								t("project.enrollmentPage.dialog.values.unknownStudent"),
						},
						{
							id: "project",
							label: t("project.enrollmentPage.dialog.fields.project"),
							value: resolveEnrollmentProjectLabel(
								projectById,
								enrollment.projectId,
							),
						},
						{
							id: "projectId",
							label: t("project.enrollmentPage.dialog.fields.projectId"),
							value: enrollment.projectId,
						},
						{
							id: "status",
							label: t("project.enrollmentPage.dialog.fields.status"),
							value: (
								<Badge
									className="min-h-5 px-2 py-0.5"
									tone={getEnrollmentStatusTone(enrollment.status.status)}
									variant="primary"
								>
									{enrollment.status.statusFormatted}
								</Badge>
							),
						},
						{
							id: "acceptedAt",
							label: t("project.enrollmentPage.dialog.fields.acceptedAt"),
							value: enrollment.enrollmentInfo.acceptedAt
								? enrollment.enrollmentInfo.acceptedAtFormatted
								: t("project.enrollmentPage.dialog.values.notAccepted"),
						},
						{
							id: "closingStatusAt",
							label: t("project.enrollmentPage.dialog.fields.closingStatusAt"),
							value: enrollment.enrollmentInfo.closingStatusAt
								? enrollment.enrollmentInfo.closingStatusAtFormatted
								: t("project.enrollmentPage.dialog.values.open"),
						},
						{
							id: "createdAt",
							label: t("project.enrollmentPage.dialog.fields.createdAt"),
							value: enrollment.enrollmentInfo.auditInfo.createdAtFormatted,
						},
						{
							id: "updatedAt",
							label: t("project.enrollmentPage.dialog.fields.updatedAt"),
							value: enrollment.enrollmentInfo.auditInfo.updatedAtFormatted,
						},
					]
				: [],
		[
			accountById,
			enrollment,
			formerStudent?.academicRegistration,
			formerStudentAccount?.email,
			formerStudentById,
			projectById,
			t,
			userById,
		],
	);

	if (!enrollmentIdentifier) {
		return (
			<EntityPageShell
				title={t("project.enrollmentPage.dialog.titleFallback")}
				description={t("project.enrollmentPage.description")}
			>
				<NotFoundState
					title={t("project.enrollmentPage.dialog.notFound.title")}
				/>
			</EntityPageShell>
		);
	}

	return (
		<EntityPageShell
			title={
				formerStudentUser?.name ?? t("project.enrollmentPage.dialog.titleFallback")
			}
			description={t("project.enrollmentPage.description")}
		>
			{enrollmentDetailQuery.isError ? (
				enrollmentDetailQuery.error instanceof WebApiError &&
				enrollmentDetailQuery.error.status === 404 ? (
					<NotFoundState
						title={t("project.enrollmentPage.dialog.notFound.title")}
						description={t(
							"project.enrollmentPage.dialog.notFound.description",
						)}
					/>
				) : (
					<SomeErrorState
						title={t("project.enrollmentPage.dialog.error.title")}
						description={t("project.enrollmentPage.dialog.error.description")}
						onRefresh={() => {
							void enrollmentDetailQuery.refetch();
						}}
					/>
				)
			) : enrollment ? (
				<EntityPageFieldsGrid fields={fields} />
			) : enrollmentDetailQuery.isLoading ? (
				<EntityPageFieldsGridSkeleton count={11} />
			) : (
				<NotFoundState
					title={t("project.enrollmentPage.dialog.notFound.title")}
				/>
			)}
		</EntityPageShell>
	);
}
