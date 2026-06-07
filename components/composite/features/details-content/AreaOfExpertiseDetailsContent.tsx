"use client";

import { useMemo } from "react";

import { useTranslation } from "react-i18next";

import { EntityPageFieldsGrid } from "@/components/composite";
import type {
	AreaOfExpertiseDetailsContentProps,
	EntityPageField,
} from "@/types/client";

export function AreaOfExpertiseDetailsContent({
	areaOfExpertise,
	columns = 3,
	includeAuditInfo = true,
	includeName = true,
}: AreaOfExpertiseDetailsContentProps) {
	const { t } = useTranslation();
	const fields = useMemo<EntityPageField[]>(() => {
		const baseFields: EntityPageField[] = [
			{
				id: "id",
				label: t("academic.areaOfExpertisePage.dialog.fields.id"),
				value: areaOfExpertise.id,
			},
		];

		if (includeAuditInfo) {
			baseFields.push(
				{
					id: "createdAt",
					label: t("academic.areaOfExpertisePage.dialog.fields.createdAt"),
					value: areaOfExpertise.auditInfo.createdAtFormatted,
				},
				{
					id: "updatedAt",
					label: t("academic.areaOfExpertisePage.dialog.fields.updatedAt"),
					value: areaOfExpertise.auditInfo.updatedAtFormatted,
				},
			);
		}

		if (!includeName) {
			return baseFields;
		}

		return [
			{
				id: "name",
				label: t("academic.areaOfExpertisePage.dialog.fields.name"),
				value: areaOfExpertise.name,
			},
			...baseFields,
		];
	}, [areaOfExpertise, includeAuditInfo, includeName, t]);

	return (
		<EntityPageFieldsGrid
			fields={fields}
			columns={columns}
		/>
	);
}
