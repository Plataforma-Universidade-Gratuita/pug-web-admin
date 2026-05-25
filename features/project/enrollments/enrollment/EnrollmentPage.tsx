"use client";

import { useMemo } from "react";

import { useTranslation } from "react-i18next";

import { Badge, NotFoundState, SomeErrorState } from "@/components";
import { useStudentsQuery } from "@/features/academic/students/queries";
import { useEnrollmentDetailQuery } from "@/features/project/enrollments/queries";
import {
	getEnrollmentDetailErrorToastContent,
	getEnrollmentProjectsErrorToastContent,
	getEnrollmentStatusLabel,
	getEnrollmentStatusTone,
	getEnrollmentStudentsErrorToastContent,
	parseEnrollmentCompositeKey,
	resolveEnrollmentProjectLabel,
	resolveEnrollmentStudentLabel,
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
	const studentsQuery = useStudentsQuery();
	const enrollmentDetailQuery = useEnrollmentDetailQuery(
		enrollmentIdentifier?.projectId ?? null,
		enrollmentIdentifier?.studentId ?? null,
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
			error: studentsQuery.error,
			errorUpdatedAt: studentsQuery.errorUpdatedAt,
			getContent: error => getEnrollmentStudentsErrorToastContent(t, error),
			isError: studentsQuery.isError,
		},
	]);

	const projectById = useMemo(
		() =>
			new Map((projectsQuery.data ?? []).map(project => [project.id, project])),
		[projectsQuery.data],
	);
	const studentById = useMemo(
		() =>
			new Map(
				(studentsQuery.data ?? []).map(student => [student.accountId, student]),
			),
		[studentsQuery.data],
	);

	const enrollment = enrollmentDetailQuery.data;
	const student = enrollment
		? studentById.get(enrollment.studentId)
		: undefined;
	const fields = useMemo(
		() =>
			enrollment
				? [
						{
							id: "student",
							label: t("project.enrollmentPage.dialog.fields.student"),
							value: resolveEnrollmentStudentLabel(
								studentById,
								enrollment.studentId,
							),
						},
						{
							id: "studentId",
							label: t("project.enrollmentPage.dialog.fields.studentId"),
							value: enrollment.studentId,
						},
						{
							id: "email",
							label: t("project.enrollmentPage.dialog.fields.email"),
							value:
								student?.accountEmail ??
								t("project.enrollmentPage.dialog.values.unknownStudent"),
						},
						{
							id: "registration",
							label: t("project.enrollmentPage.dialog.fields.registration"),
							value:
								student?.academicRegistration ??
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
									tone={getEnrollmentStatusTone(enrollment.status)}
									variant="primary"
								>
									{getEnrollmentStatusLabel(t, enrollment.status)}
								</Badge>
							),
						},
						{
							id: "acceptedAt",
							label: t("project.enrollmentPage.dialog.fields.acceptedAt"),
							value: enrollment.acceptedAt
								? enrollment.acceptedAtFormatted
								: t("project.enrollmentPage.dialog.values.notAccepted"),
						},
						{
							id: "closingStatusAt",
							label: t("project.enrollmentPage.dialog.fields.closingStatusAt"),
							value: enrollment.closingStatusAt
								? enrollment.closingStatusAtFormatted
								: t("project.enrollmentPage.dialog.values.open"),
						},
						{
							id: "createdAt",
							label: t("project.enrollmentPage.dialog.fields.createdAt"),
							value: enrollment.auditInfo.createdAtFormatted,
						},
						{
							id: "updatedAt",
							label: t("project.enrollmentPage.dialog.fields.updatedAt"),
							value: enrollment.auditInfo.updatedAtFormatted,
						},
					]
				: [],
		[enrollment, projectById, student, studentById, t],
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
				enrollment
					? resolveEnrollmentStudentLabel(studentById, enrollment.studentId)
					: t("project.enrollmentPage.dialog.titleFallback")
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
