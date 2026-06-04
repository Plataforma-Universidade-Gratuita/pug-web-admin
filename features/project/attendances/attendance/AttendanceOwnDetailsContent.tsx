"use client";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { Badge } from "@/components";
import { getAttendanceStatusTone } from "@/features/project/attendances/utils";
import { EntityPageFieldsGrid } from "@/features/shared/entity-pages";
import type { AttendanceResponse } from "@/types";

export function AttendanceOwnDetailsContent({
	attendance,
	columns = 3,
}: {
	attendance: AttendanceResponse;
	columns?: 2 | 3;
}) {
	const { t } = useTranslation();
	const fields = useMemo(
		() => [
			{
				id: "id",
				label: t("project.attendancePage.dialog.fields.id"),
				value: attendance.id,
			},
			{
				id: "projectId",
				label: t("project.attendancePage.dialog.fields.projectId"),
				value: attendance.projectId,
			},
			{
				id: "studentId",
				label: t("project.attendancePage.dialog.fields.studentId"),
				value: attendance.formerStudentId,
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
		],
		[attendance, t],
	);

	return (
		<EntityPageFieldsGrid
			fields={fields}
			columns={columns}
		/>
	);
}
