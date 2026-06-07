import type { ColumnDef } from "@tanstack/react-table";
import type { TFunction } from "i18next";

import {
	createDateTimeColumn,
	createTableTextColumn,
} from "@/components/composite";
import { Badge, TableText } from "@/components/primitives";
import {
	TABLE_DESCRIPTION_TEXT_WIDTH,
	TABLE_IDENTIFIER_TEXT_WIDTH,
} from "@/features/project/projects/constants";
import type {
	AccountSimpleComplexSearchResponse,
	AreaOfExpertiseResponse,
	EntityResponse,
	ProjectResponse,
	ProjectStatus,
} from "@/types/api";
import type { BadgeTone, ComboboxOption } from "@/types/client";
import { compareNormalizedText } from "@/utils";

export function getProjectStatusLabel(t: TFunction, status: ProjectStatus) {
	return t(`project.projectPage.status.options.${status}`);
}

export function getProjectStatusTone(status: ProjectStatus): BadgeTone {
	switch (status) {
		case "CANCELED":
			return "danger";
		case "COMPLETED":
			return "success";
		case "IN_PROGRESS":
			return "info";
		case "ON_HOLD":
			return "warning";
		case "PLANNED":
		default:
			return "brand";
	}
}

export function resolveProjectEntityLabel(
	entityById: Map<string, EntityResponse>,
	entityId: string,
) {
	return entityById.get(entityId)?.name ?? entityId;
}

export function resolveProjectCreatorLabel(
	createdBy: string | AccountSimpleComplexSearchResponse,
) {
	return typeof createdBy === "string" ? createdBy : createdBy.name;
}

export function buildProjectEntityOptions(
	entities: EntityResponse[],
): ComboboxOption[] {
	return [...entities]
		.sort((left, right) => compareNormalizedText(left.name, right.name))
		.map(entity => ({
			value: entity.id,
			label: entity.name,
			description: entity.cnpjFormatted,
		}));
}

export function buildProjectCreatorOptions(
	creators: AccountSimpleComplexSearchResponse[],
): ComboboxOption[] {
	return [...creators]
		.sort((left, right) => compareNormalizedText(left.name, right.name))
		.map(createdBy => ({
			value: createdBy.id,
			label: createdBy.name,
			description: createdBy.email,
		}));
}

export function buildProjectAreaOfExpertiseOptions(
	areasOfExpertise: AreaOfExpertiseResponse[],
): ComboboxOption[] {
	return [...areasOfExpertise]
		.sort((left, right) => compareNormalizedText(left.name, right.name))
		.map(areaOfExpertise => ({
			value: areaOfExpertise.id,
			label: areaOfExpertise.name,
		}));
}

export function getProjectStatusOptions(t: TFunction) {
	return ["PLANNED", "IN_PROGRESS", "ON_HOLD", "COMPLETED", "CANCELED"].map(
		status => ({
			value: status as ProjectStatus,
			label: getProjectStatusLabel(t, status as ProjectStatus),
		}),
	);
}

export function createProjectColumns(
	t: TFunction,
): ColumnDef<ProjectResponse>[] {
	return [
		{
			accessorFn: row => row.status.status,
			id: "status",
			header: t("common.fields.status"),
			cell: ({ row }) => (
				<Badge
					tone={getProjectStatusTone(row.original.status.status)}
					variant="primary"
					className="min-h-5 px-2 py-0.5"
				>
					{getProjectStatusLabel(t, row.original.status.status)}
				</Badge>
			),
		},
		createTableTextColumn<ProjectResponse>({
			id: "id",
			accessorKey: "id",
			header: t("project.projectPage.table.columns.id"),
			text: row => row.id,
			size: TABLE_IDENTIFIER_TEXT_WIDTH,
			maxWidth: TABLE_IDENTIFIER_TEXT_WIDTH,
		}),
		{
			accessorKey: "name",
			header: t("project.projectPage.table.columns.name"),
		},
		{
			accessorKey: "description",
			header: t("project.projectPage.table.columns.description"),
			cell: ({ row }) => (
				<TableText
					text={row.original.description}
					maxWidth={TABLE_DESCRIPTION_TEXT_WIDTH}
					tooltiped
				/>
			),
		},
		{
			accessorFn: row => row.entity.name,
			id: "entity",
			header: t("common.fields.entity"),
		},
		{
			accessorFn: row => row.projectInfo.createdBy.name,
			id: "createdBy",
			header: t("common.fields.email"),
		},
		{
			accessorFn: row => row.projectInfo.offeredHours ?? "-",
			id: "offeredHours",
			header: t("project.projectPage.table.columns.offeredHours"),
		},
		{
			accessorFn: row => row.projectInfo.completedHours ?? "-",
			id: "completedHours",
			header: t("project.projectPage.table.columns.completedHours"),
		},
		{
			accessorFn: row =>
				row.projectInfo.maxParticipants ??
				t("project.projectPage.dialog.values.unlimited"),
			id: "maxParticipants",
			header: t("project.projectPage.table.columns.maxParticipants"),
		},
		{
			accessorFn: row =>
				row.projectInfo.closedAt
					? row.projectInfo.closedAtFormatted
					: t("project.projectPage.dialog.values.open"),
			id: "closedAt",
			header: t("project.projectPage.table.columns.closedAt"),
		},
		createDateTimeColumn<ProjectResponse>({
			id: "createdAt",
			header: t("common.fields.createdAt"),
			value: row => row.projectInfo.auditInfo.createdAt,
			formattedValue: row => row.projectInfo.auditInfo.createdAtFormatted,
		}),
		createDateTimeColumn<ProjectResponse>({
			id: "updatedAt",
			header: t("common.fields.updatedAt"),
			value: row => row.projectInfo.auditInfo.updatedAt,
			formattedValue: row => row.projectInfo.auditInfo.updatedAtFormatted,
		}),
	];
}
