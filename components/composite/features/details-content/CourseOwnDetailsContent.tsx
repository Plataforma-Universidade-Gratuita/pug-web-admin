"use client";

import { useMemo } from "react";

import { useTranslation } from "react-i18next";

import { EntityPageFieldsGrid } from "@/components";
import type { CourseOwnDetailsContentProps, EntityPageField } from "@/types";

export function CourseOwnDetailsContent({
	course,
	columns = 3,
	includeName = false,
}: CourseOwnDetailsContentProps) {
	const { t } = useTranslation();
	const fields = useMemo<EntityPageField[]>(() => {
		const baseFields: EntityPageField[] = [
			{
				id: "id",
				label: t("common.fields.id"),
				value: course.id,
			},
			{
				id: "createdAt",
				label: t("common.fields.createdAt"),
				value: course.auditInfo.createdAtFormatted,
			},
			{
				id: "updatedAt",
				label: t("common.fields.updatedAt"),
				value: course.auditInfo.updatedAtFormatted,
			},
		];

		if (!includeName) {
			return baseFields;
		}

		return [
			{
				id: "name",
				label: t("academic.coursePage.dialog.fields.name"),
				value: course.name,
			},
			...baseFields,
		];
	}, [course, includeName, t]);

	return (
		<EntityPageFieldsGrid
			fields={fields}
			columns={columns}
		/>
	);
}
