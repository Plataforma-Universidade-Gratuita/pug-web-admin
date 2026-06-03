"use client";

import { useMemo } from "react";

import { useTranslation } from "react-i18next";

import { EntityPageFieldsGrid } from "@/features/shared/entity-pages";
import type { AreaOfExpertiseResponse, EntityPageField } from "@/types";

interface AreaOfExpertiseDetailsContentProps {
	areaOfExpertise: AreaOfExpertiseResponse;
	columns?: 2 | 3;
	includeName?: boolean;
}

export function AreaOfExpertiseDetailsContent({
	areaOfExpertise,
	columns = 3,
	includeName = true,
}: AreaOfExpertiseDetailsContentProps) {
	const { t } = useTranslation();
	const fields = useMemo<EntityPageField[]>(() => {
		const baseFields: EntityPageField[] = [
			{
				id: "id",
				label: t("academic.schoolPage.dialog.fields.id"),
				value: areaOfExpertise.id,
			},
			{
				id: "createdAt",
				label: t("academic.schoolPage.dialog.fields.createdAt"),
				value: areaOfExpertise.auditInfo.createdAtFormatted,
			},
			{
				id: "updatedAt",
				label: t("academic.schoolPage.dialog.fields.updatedAt"),
				value: areaOfExpertise.auditInfo.updatedAtFormatted,
			},
		];

		if (!includeName) {
			return baseFields;
		}

		return [
			{
				id: "name",
				label: t("academic.schoolPage.dialog.fields.name"),
				value: areaOfExpertise.name,
			},
			...baseFields,
		];
	}, [areaOfExpertise, includeName, t]);

	return (
		<EntityPageFieldsGrid
			fields={fields}
			columns={columns}
		/>
	);
}
