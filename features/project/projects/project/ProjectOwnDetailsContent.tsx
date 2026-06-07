"use client";

import { useMemo } from "react";

import { useTranslation } from "react-i18next";

import { EntityPageFieldsGrid } from "@/components/composite";
import { Badge } from "@/components/primitives";
import {
	getProjectStatusLabel,
	getProjectStatusTone,
} from "@/features/project/projects/utils";
import type {
	EntityPageField,
	ProjectOwnDetailsContentProps,
} from "@/types/client";

export function ProjectOwnDetailsContent({
	project,
	createdByLabel,
	columns = 3,
	includeEditableFields = true,
}: ProjectOwnDetailsContentProps) {
	const { t } = useTranslation();
	const fields = useMemo<EntityPageField[]>(() => {
		const baseFields: EntityPageField[] = [
			{
				id: "status",
				label: t("common.fields.status"),
				value: (
					<Badge
						className="min-h-5 px-2 py-0.5"
						tone={getProjectStatusTone(project.status.status)}
						variant="primary"
					>
						{getProjectStatusLabel(t, project.status.status)}
					</Badge>
				),
			},
			{
				id: "createdBy",
				label: t("project.projectPage.dialog.fields.createdBy"),
				value: createdByLabel,
			},
			{
				id: "completedHours",
				label: t("project.projectPage.dialog.fields.completedHours"),
				value: project.projectInfo.completedHours ?? "-",
			},
			{
				id: "closedAt",
				label: t("project.projectPage.dialog.fields.closedAt"),
				value: project.projectInfo.closedAt
					? project.projectInfo.closedAtFormatted
					: t("project.projectPage.dialog.values.open"),
			},
			{
				id: "id",
				label: t("project.projectPage.dialog.fields.id"),
				value: project.id,
			},
			{
				id: "createdAt",
				label: t("common.fields.createdAt"),
				value: project.projectInfo.auditInfo.createdAtFormatted,
			},
			{
				id: "updatedAt",
				label: t("common.fields.updatedAt"),
				value: project.projectInfo.auditInfo.updatedAtFormatted,
			},
		];

		if (!includeEditableFields) {
			return baseFields;
		}

		return [
			{
				id: "name",
				label: t("project.projectPage.dialog.fields.name"),
				value: project.name,
			},
			{
				id: "description",
				label: t("project.projectPage.dialog.fields.description"),
				value:
					project.description ||
					t("project.projectPage.dialog.values.noDescription"),
			},
			{
				id: "offeredHours",
				label: t("project.projectPage.dialog.fields.offeredHours"),
				value: project.projectInfo.offeredHours ?? "-",
			},
			{
				id: "maxParticipants",
				label: t("project.projectPage.dialog.fields.maxParticipants"),
				value:
					project.projectInfo.maxParticipants ??
					t("project.projectPage.dialog.values.unlimited"),
			},
			...baseFields,
		];
	}, [createdByLabel, includeEditableFields, project, t]);

	return (
		<EntityPageFieldsGrid
			fields={fields}
			columns={columns}
		/>
	);
}
