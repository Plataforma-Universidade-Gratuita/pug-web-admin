"use client";

import { useMemo } from "react";

import { useTranslation } from "react-i18next";

import { Badge } from "@/components";
import { EntityPageFieldsGrid } from "@/features/shared/entity-pages";
import type { FormerStudentResponse, EntityPageField } from "@/types";

interface FormerStudentOwnDetailsContentProps {
	formerStudent: FormerStudentResponse;
	columns?: 2 | 3;
	includeEditableFields?: boolean;
}

export function FormerStudentOwnDetailsContent({
	formerStudent,
	columns = 2,
	includeEditableFields = true,
}: FormerStudentOwnDetailsContentProps) {
	const { t } = useTranslation();
	const fields = useMemo<EntityPageField[]>(() => {
		const baseFields: EntityPageField[] = [
			{
				id: "accountId",
				label: t("academic.formerStudentPage.dialog.fields.accountId"),
				value: formerStudent.accountId,
			},
			{
				id: "completedHours",
				label: t("academic.formerStudentPage.dialog.fields.completedHours"),
				value: formerStudent.counterpartHours.completedHours,
			},
			{
				id: "missingHours",
				label: t("academic.formerStudentPage.dialog.fields.missingHours"),
				value: formerStudent.counterpartHours.missingHours,
			},
			{
				id: "progress",
				label: t("academic.formerStudentPage.table.columns.progress"),
				value: `${formerStudent.counterpartHours.progress.toFixed(2)}%`,
			},
			{
				id: "concluded",
				label: t("academic.formerStudentPage.table.columns.concluded"),
				value: (
					<Badge
						className="min-h-5 px-2 py-0.5"
						tone={
							formerStudent.counterpartHours.concluded ? "success" : "warning"
						}
						variant="primary"
					>
						{formerStudent.counterpartHours.concluded
							? t("academic.formerStudentPage.table.concluded.yes")
							: t("academic.formerStudentPage.table.concluded.no")}
					</Badge>
				),
			},
			{
				id: "remainingDays",
				label: t("academic.formerStudentPage.dialog.fields.remainingDays"),
				value: formerStudent.period.remainingDaysFormatted,
			},
			{
				id: "createdAt",
				label: t("academic.formerStudentPage.dialog.fields.createdAt"),
				value: formerStudent.auditInfo.createdAtFormatted,
			},
			{
				id: "updatedAt",
				label: t("academic.formerStudentPage.dialog.fields.updatedAt"),
				value: formerStudent.auditInfo.updatedAtFormatted,
			},
		];

		if (!includeEditableFields) {
			return baseFields;
		}

		return [
			{
				id: "academicRegistration",
				label: t(
					"academic.formerStudentPage.dialog.fields.academicRegistration",
				),
				value: formerStudent.academicRegistration,
			},
			{
				id: "campus",
				label: t("academic.formerStudentPage.dialog.fields.campus"),
				value: formerStudent.campus.campusFormatted,
			},
			{
				id: "requiredHours",
				label: t("academic.formerStudentPage.dialog.fields.requiredHours"),
				value: formerStudent.counterpartHours.requiredHours,
			},
			...baseFields,
			{
				id: "startDate",
				label: t("academic.formerStudentPage.dialog.fields.startDate"),
				value: formerStudent.period.startDateFormatted,
			},
			{
				id: "dueDate",
				label: t("academic.formerStudentPage.dialog.fields.dueDate"),
				value: formerStudent.period.dueDateFormatted,
			},
		];
	}, [formerStudent, includeEditableFields, t]);

	return (
		<EntityPageFieldsGrid
			fields={fields}
			columns={columns}
		/>
	);
}
