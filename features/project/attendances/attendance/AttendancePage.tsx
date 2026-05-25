"use client";

import { useMemo } from "react";

import { useTranslation } from "react-i18next";

import { Badge, NotFoundState, SomeErrorState } from "@/components";
import { useStudentsQuery } from "@/features/academic/students/queries";
import { useAdminsQuery } from "@/features/identity/admins/queries";
import { useAttendanceDetailQuery } from "@/features/project/attendances/queries";
import {
	getAttendanceAdminsErrorToastContent,
	getAttendanceDetailErrorToastContent,
	getAttendanceProjectsErrorToastContent,
	getAttendanceStatusLabel,
	getAttendanceStatusTone,
	getAttendanceStudentsErrorToastContent,
	resolveAttendanceProjectLabel,
	resolveAttendanceStudentLabel,
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
	const studentsQuery = useStudentsQuery();
	const adminsQuery = useAdminsQuery();

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
			error: studentsQuery.error,
			errorUpdatedAt: studentsQuery.errorUpdatedAt,
			getContent: error => getAttendanceStudentsErrorToastContent(t, error),
			isError: studentsQuery.isError,
		},
		{
			key: `attendance-admins-${attendanceId}`,
			error: adminsQuery.error,
			errorUpdatedAt: adminsQuery.errorUpdatedAt,
			getContent: error => getAttendanceAdminsErrorToastContent(t, error),
			isError: adminsQuery.isError,
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
	const adminById = useMemo(
		() =>
			new Map((adminsQuery.data ?? []).map(admin => [admin.accountId, admin])),
		[adminsQuery.data],
	);

	const attendance = attendanceDetailQuery.data;
	const student = attendance
		? studentById.get(attendance.studentId)
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
							value: resolveAttendanceStudentLabel(
								studentById,
								attendance.studentId,
							),
						},
						{
							id: "studentId",
							label: t("project.attendancePage.dialog.fields.studentId"),
							value: attendance.studentId,
						},
						{
							id: "email",
							label: t("project.attendancePage.dialog.fields.email"),
							value:
								student?.accountEmail ??
								t("project.attendancePage.dialog.values.unknownStudent"),
						},
						{
							id: "registration",
							label: t("project.attendancePage.dialog.fields.registration"),
							value:
								student?.academicRegistration ??
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
							value: attendance.duration,
						},
						{
							id: "status",
							label: t("project.attendancePage.dialog.fields.status"),
							value: (
								<Badge
									className="min-h-5 px-2 py-0.5"
									tone={getAttendanceStatusTone(attendance.status)}
									variant="primary"
								>
									{getAttendanceStatusLabel(t, attendance.status)}
								</Badge>
							),
						},
						{
							id: "qrValidationHash",
							label: t("project.attendancePage.dialog.fields.qrValidationHash"),
							value: attendance.qrValidationHash,
						},
						{
							id: "validatedBy",
							label: t("project.attendancePage.dialog.fields.validatedBy"),
							value:
								resolveAttendanceValidatorLabel(
									adminById,
									attendance.validatedById,
								) ?? t("project.attendancePage.dialog.values.notValidated"),
						},
						{
							id: "validatedAt",
							label: t("project.attendancePage.dialog.fields.validatedAt"),
							value: attendance.validatedAt
								? attendance.validatedAtFormatted
								: t("project.attendancePage.dialog.values.notValidated"),
						},
						{
							id: "createdAt",
							label: t("project.attendancePage.dialog.fields.createdAt"),
							value: attendance.auditInfo.createdAtFormatted,
						},
						{
							id: "updatedAt",
							label: t("project.attendancePage.dialog.fields.updatedAt"),
							value: attendance.auditInfo.updatedAtFormatted,
						},
					]
				: [],
		[adminById, attendance, projectById, student, studentById, t],
	);

	return (
		<EntityPageShell
			title={
				attendance
					? resolveAttendanceStudentLabel(studentById, attendance.studentId)
					: t("project.attendancePage.dialog.titleFallback")
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
