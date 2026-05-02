"use client";

import { useMemo } from "react";

import type { ColumnDef } from "@tanstack/react-table";
import { CircleAlert, FolderKanban } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Badge, EmptyState, Icon, Table } from "@/components";
import { ParticleContainer } from "@/features/docs/primitives/ParticleContainer";
import { ParticleSection } from "@/features/docs/primitives/ParticleSection";

interface TableExampleRow {
	name: string;
	campus: string;
	status: "active" | "planning" | "hold";
	updatedAt: string;
}

const STATUS_TONES = {
	active: "success",
	hold: "warning",
	planning: "info",
} as const;

export default function TableParticle() {
	const { t } = useTranslation();

	const columns = useMemo<ColumnDef<TableExampleRow>[]>(
		() => [
			{
				accessorKey: "name",
				header: t("docs.table.columns.name"),
			},
			{
				accessorKey: "campus",
				header: t("docs.table.columns.campus"),
			},
			{
				accessorKey: "status",
				header: t("docs.table.columns.status"),
				cell: ({ row }) => {
					const value = row.original.status;

					return (
						<Badge tone={STATUS_TONES[value]}>
							{t(`docs.table.status.${value}`)}
						</Badge>
					);
				},
			},
			{
				accessorKey: "updatedAt",
				header: t("docs.table.columns.updatedAt"),
			},
		],
		[t],
	);

	const rows = useMemo<TableExampleRow[]>(
		() => [
			{
				name: t("docs.table.rows.atlas.name"),
				campus: t("docs.table.rows.atlas.campus"),
				status: "active",
				updatedAt: t("docs.table.rows.atlas.updatedAt"),
			},
			{
				name: t("docs.table.rows.connections.name"),
				campus: t("docs.table.rows.connections.campus"),
				status: "planning",
				updatedAt: t("docs.table.rows.connections.updatedAt"),
			},
			{
				name: t("docs.table.rows.labs.name"),
				campus: t("docs.table.rows.labs.campus"),
				status: "hold",
				updatedAt: t("docs.table.rows.labs.updatedAt"),
			},
		],
		[t],
	);

	return (
		<ParticleContainer
			eyebrow={t("docs.shared.eyebrow")}
			title={t("docs.table.title")}
			description={t("docs.table.description")}
			patternNotesTitle={t("docs.shared.patternNotesTitle")}
			patternNotesItems={[
				{ description: t("docs.table.patternNotes.items.headless") },
				{ description: t("docs.table.patternNotes.items.columns") },
				{ description: t("docs.table.patternNotes.items.sorting") },
				{ description: t("docs.table.patternNotes.items.overflow") },
			]}
			patternNotesApiLabel={t("docs.shared.patternNotesApiLabel")}
			patternNotesSnippet={t("docs.table.patternNotes.snippet")}
		>
			<ParticleSection
				title={t("docs.table.sections.structure.title")}
				description={t("docs.table.sections.structure.description")}
				defaultExpanded
			>
				<Table
					data={rows}
					columns={columns}
					caption={t("docs.table.caption")}
				/>
			</ParticleSection>

			<ParticleSection
				title={t("docs.table.sections.states.title")}
				description={t("docs.table.sections.states.description")}
			>
				<div className="grid gap-4 xl:grid-cols-2">
					<Table
						data={rows}
						columns={columns}
						isLoading
						loadingLabel={t("docs.table.loadingLabel")}
					/>

					<Table
						data={[]}
						columns={columns}
						emptyState={
							<EmptyState
								className="items-center text-center"
								icon={
									<Icon
										icon={FolderKanban}
										className="h-5 w-5 text-[color:var(--twc-muted)]"
									/>
								}
								title={t("docs.table.empty.title")}
								description={t("docs.table.empty.description")}
							/>
						}
					/>
				</div>

				<div className="surface-2 mt-4 flex items-start gap-3 rounded-[var(--twc-radius-lg)] p-4">
					<Icon
						icon={CircleAlert}
						className="mt-0.5 h-4 w-4 text-[color:var(--color-brand)]"
					/>
					<p className="ty-helper">{t("docs.table.statesNote")}</p>
				</div>
			</ParticleSection>
		</ParticleContainer>
	);
}
