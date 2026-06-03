"use client";

import { useMemo } from "react";

import { useTranslation } from "react-i18next";

import { Badge, NotFoundState, SomeErrorState } from "@/components";
import { useFormerStudentsQuery } from "@/features/academic/former-students/queries";
import { useAccountsQuery } from "@/features/identity/accounts/queries";
import { useUsersQuery } from "@/features/identity/users/queries";
import { useAttendanceDetailQuery } from "@/features/project/attendances/queries";
import {
	getAttendanceAdminsErrorToastContent,
	getAttendanceDetailErrorToastContent,
	getAttendanceProjectsErrorToastContent,
	getAttendanceStatusTone,
	getAttendanceStudentsErrorToastContent,
	resolveAttendanceFormerStudentLabel,
	resolveAttendanceProjectLabel,
	resolveAttendanceValidatorLabel,
} from "@/features/project/attendances/utils";
import { useProjectsQuery } from "@/features/project/projects/queries";
import {
	EntityPageFieldsGrid,
	EntityPageFieldsGridSkeleton,
	EntityPageShell,
} from "@/features/shared/entity-pages";
import { useQueryErrorToasts } from "@/hooks";
import type { AttendancePageProps } from "@/types";
import { WebApiError } from "@/utils";

export function AttendancePage({ attendanceId }: AttendancePageProps) {
	const { t } = useTranslation();
	const attendanceDetailQuery = useAttendanceDetailQuery(attendanceId);
	const projectsQuery = useProjectsQuery();
	const formerStudentsQuery = useFormerStudentsQuery();
	const accountsQuery = useAccountsQuery();
	const usersQuery = useUsersQuery();

	useQueryErrorToasts([
		{
			key: `attendance-detail-${attendanceId}`,
			error: attendanceDetailQuery.error,
			errorUpdatedAt: attendanceDetailQuery.errorUpdatedAt,
			getContent: error => getAttendanceDetailErrorToastContent(t, error),
			isError: attendanceDetailQuery.isError,
		},
		{
			key: `attendance-projects-${attendanceId}`,
			error: projectsQuery.error,
			errorUpdatedAt: projectsQuery.errorUpdatedAt,
			getContent: error => getAttendanceProjectsErrorToastContent(t, error),
			isError: projectsQuery.isError,
		},
		{
			key: `attendance-students-${attendanceId}`,
			error: formerStudentsQuery.error,
			errorUpdatedAt: formerStudentsQuery.errorUpdatedAt,
			getContent: error => getAttendanceStudentsErrorToastContent(t, error),
			isError: formerStudentsQuery.isError,
		},
		{
			key: `attendance-admins-${attendanceId}`,
			error: accountsQuery.error,
			errorUpdatedAt: accountsQuery.errorUpdatedAt,
			getContent: error => getAttendanceAdminsErrorToastContent(t, error),
			isError: accountsQuery.isError,
		},
	]);

	const projectById = useMemo(
		() =>
			new Map((projectsQuery.data ?? []).map(project => [project.id, project])),
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
		() =>
			new Map((accountsQuery.data ?? []).map(account => [account.id, account])),
		[accountsQuery.data],
	);
	const userById = useMemo(
		() => new Map((usersQuery.data ?? []).map(user => [user.id, user])),
		[usersQuery.data],
	);

	const attendance = attendanceDetailQuery.data;
	const formerStudent = attendance
		? formerStudentById.get(attendance.formerStudentId)
		: undefined;
	const formerStudentAccount = formerStudent
		? accountById.get(formerStudent.accountId)
		: undefined;
	const formerStudentUser = formerStudentAccount
		? userById.get(formerStudentAccount.userId)
		: undefined;
	const fields = useMemo(
		() =>
			attendance
				? [
						{
							id: "id",
							label: t("project.attendancePage.dialog.fields.id"),
							value: attendance.id,
						},
						{
							id: "student",
							label: t("project.attendancePage.dialog.fields.student"),
							value: resolveAttendanceFormerStudentLabel(
								formerStudentById,
								accountById,
								userById,
								attendance.formerStudentId,
							),
						},
						{
							id: "studentId",
							label: t("project.attendancePage.dialog.fields.studentId"),
							value: attendance.formerStudentId,
						},
						{
							id: "email",
							label: t("project.attendancePage.dialog.fields.email"),
							value:
								formerStudentAccount?.email ??
								t("project.attendancePage.dialog.values.unknownStudent"),
						},
						{
							id: "registration",
							label: t("project.attendancePage.dialog.fields.registration"),
							value:
								formerStudent?.academicRegistration ??
								t("project.attendancePage.dialog.values.unknownStudent"),
						},
						{
							id: "project",
							label: t("project.attendancePage.dialog.fields.project"),
							value: resolveAttendanceProjectLabel(
								projectById,
								attendance.projectId,
							),
						},
						{
							id: "projectId",
							label: t("project.attendancePage.dialog.fields.projectId"),
							value: attendance.projectId,
						},
						{
							id: "duration",
							label: t("project.attendancePage.dialog.fields.duration"),
							value: attendance.qrValidationInfo.duration,
						},
						{
							id: "status",
							label: t("project.attendancePage.dialog.fields.status"),
							value: (
								<Badge
									className="min-h-5 px-2 py-0.5"
									tone={getAttendanceStatusTone(attendance.status.status)}
									variant="primary"
								>
									{attendance.status.statusFormatted}
								</Badge>
							),
						},
						{
							id: "qrValidationHash",
							label: t("project.attendancePage.dialog.fields.qrValidationHash"),
							value: attendance.qrValidationInfo.qrValidationHash,
						},
						{
							id: "validatedBy",
							label: t("project.attendancePage.dialog.fields.validatedBy"),
							value:
								resolveAttendanceValidatorLabel(
									accountById,
									userById,
									attendance.attendanceInfo.validatedBy,
								) ?? t("project.attendancePage.dialog.values.notValidated"),
						},
						{
							id: "validatedAt",
							label: t("project.attendancePage.dialog.fields.validatedAt"),
							value: attendance.attendanceInfo.validatedAt
								? attendance.attendanceInfo.validatedAtFormatted
								: t("project.attendancePage.dialog.values.notValidated"),
						},
						{
							id: "createdAt",
							label: t("project.attendancePage.dialog.fields.createdAt"),
							value: attendance.attendanceInfo.auditInfo.createdAtFormatted,
						},
						{
							id: "updatedAt",
							label: t("project.attendancePage.dialog.fields.updatedAt"),
							value: attendance.attendanceInfo.auditInfo.updatedAtFormatted,
						},
					]
				: [],
		[
			accountById,
			attendance,
			formerStudent?.academicRegistration,
			formerStudentAccount?.email,
			formerStudentById,
			projectById,
			t,
			userById,
		],
	);

	return (
		<EntityPageShell
			title={
				formerStudentUser?.name ??
				t("project.attendancePage.dialog.titleFallback")
			}
			description={t("project.attendancePage.description")}
		>
			{attendanceDetailQuery.isError ? (
				attendanceDetailQuery.error instanceof WebApiError &&
				attendanceDetailQuery.error.status === 404 ? (
					<NotFoundState
						title={t("project.attendancePage.dialog.notFound.title")}
						description={t(
							"project.attendancePage.dialog.notFound.description",
						)}
					/>
				) : (
					<SomeErrorState
						title={t("project.attendancePage.dialog.error.title")}
						description={t("project.attendancePage.dialog.error.description")}
						onRefresh={() => {
							void attendanceDetailQuery.refetch();
						}}
					/>
				)
			) : attendance ? (
				<EntityPageFieldsGrid fields={fields} />
			) : attendanceDetailQuery.isLoading ? (
				<EntityPageFieldsGridSkeleton count={14} />
			) : (
				<NotFoundState
					title={t("project.attendancePage.dialog.notFound.title")}
				/>
			)}
		</EntityPageShell>
	);
}
