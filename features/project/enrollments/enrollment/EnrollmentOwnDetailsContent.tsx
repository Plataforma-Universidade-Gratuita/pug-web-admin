"use client";

import { useMemo } from "react";

import { useTranslation } from "react-i18next";

import { EntityPageFieldsGrid } from "@/components/composite";
import { Badge } from "@/components/primitives";
import { getEnrollmentStatusTone } from "@/features/project/enrollments/utils";
import type { EnrollmentResponse } from "@/types/api";

export function EnrollmentOwnDetailsContent({
	enrollment,
	columns = 3,
}: {
	enrollment: EnrollmentResponse;
	columns?: 2 | 3;
}) {
	const { t } = useTranslation();
	const fields = useMemo(
		() => [
			{
				id: "projectId",
				label: t("project.enrollmentPage.dialog.fields.projectId"),
				value: enrollment.projectId,
			},
			{
				id: "formerStudentId",
				label: t("common.fields.formerStudentId"),
				value: enrollment.formerStudentId,
			},
			{
				id: "status",
				label: t("common.fields.status"),
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
				label: t("common.fields.createdAt"),
				value: enrollment.enrollmentInfo.auditInfo.createdAtFormatted,
			},
			{
				id: "updatedAt",
				label: t("common.fields.updatedAt"),
				value: enrollment.enrollmentInfo.auditInfo.updatedAtFormatted,
			},
		],
		[enrollment, t],
	);

	return (
		<EntityPageFieldsGrid
			fields={fields}
			columns={columns}
		/>
	);
}
