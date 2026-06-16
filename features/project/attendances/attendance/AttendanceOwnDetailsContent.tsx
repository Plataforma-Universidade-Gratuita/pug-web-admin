"use client";

import { useMemo } from "react";

import { useTranslation } from "react-i18next";

import { EntityPageFieldsGrid } from "@/components/composite";
import { Badge, Tooltip } from "@/components/primitives";
import { getAttendanceStatusTone } from "@/features/project/attendances/utils";
import type { AttendanceResponse } from "@/types/api";

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
				label: t("common.fields.formerStudentId"),
				value: attendance.formerStudentId,
			},
			{
				id: "duration",
				label: t("project.attendancePage.dialog.fields.duration"),
				value: attendance.qrValidationInfo.duration,
			},
			{
				id: "status",
				label: t("common.fields.status"),
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
				value: (
					<Tooltip content={attendance.qrValidationInfo.qrValidationHash}>
						<span className="block max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
							{attendance.qrValidationInfo.qrValidationHash}
						</span>
					</Tooltip>
				),
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
				label: t("common.fields.createdAt"),
				value: attendance.attendanceInfo.auditInfo.createdAtFormatted,
			},
			{
				id: "updatedAt",
				label: t("common.fields.updatedAt"),
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
