"use client";

import { useMemo } from "react";

import { useTranslation } from "react-i18next";

import { EntityPageFieldsGrid } from "@/features/shared/entity-pages";
import type { CourseResponse, EntityPageField } from "@/types";

interface CourseOwnDetailsContentProps {
	course: CourseResponse;
	columns?: 2 | 3;
}

export function CourseOwnDetailsContent({
	course,
	columns = 3,
}: CourseOwnDetailsContentProps) {
	const { t } = useTranslation();
	const fields = useMemo<EntityPageField[]>(
		() => [
			{
				id: "id",
				label: t("academic.coursePage.dialog.fields.id"),
				value: course.id,
			},
			{
				id: "createdAt",
				label: t("academic.coursePage.dialog.fields.createdAt"),
				value: course.auditInfo.createdAtFormatted,
			},
			{
				id: "updatedAt",
				label: t("academic.coursePage.dialog.fields.updatedAt"),
				value: course.auditInfo.updatedAtFormatted,
			},
		],
		[course, t],
	);

	return (
		<EntityPageFieldsGrid
			fields={fields}
			columns={columns}
		/>
	);
}
