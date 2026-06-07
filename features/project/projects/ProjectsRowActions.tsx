"use client";

import { Ban, CheckCheck, Pause, Play, RotateCcw } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
	DeleteRowAction,
	DuplicateRowAction,
	UpdateRowAction,
	ViewDetailsRowAction,
} from "@/components/composite";
import {
	DropdownMenuDangerItem,
	DropdownMenuInfoItem,
	DropdownMenuSeparator,
	DropdownMenuSuccessItem,
	DropdownMenuWarningItem,
} from "@/components/primitives";
import type { ProjectsRowActionsProps } from "@/types/client";

export function ProjectsRowActions({
	href,
	onDelete,
	onDuplicate,
	onOpenEditor,
	onStatusAction,
	project,
}: ProjectsRowActionsProps) {
	const { t } = useTranslation();

	return (
		<>
			<ViewDetailsRowAction href={href} />
			<UpdateRowAction onClick={() => onOpenEditor(project.id, "update")} />
			<DuplicateRowAction onClick={() => onDuplicate(project)} />

			{project.status.status === "PLANNED" ? (
				<>
					<DropdownMenuSeparator />
					<DropdownMenuSuccessItem
						icon={Play}
						label={t("project.projectPage.table.actions.start")}
						onClick={() => onStatusAction(project, "start")}
					/>
					<DropdownMenuDangerItem
						icon={Ban}
						label={t("project.projectPage.table.actions.cancel")}
						onClick={() => onStatusAction(project, "cancel")}
					/>
				</>
			) : null}

			{project.status.status === "IN_PROGRESS" ? (
				<>
					<DropdownMenuSeparator />
					<DropdownMenuWarningItem
						icon={Pause}
						label={t("project.projectPage.table.actions.hold")}
						onClick={() => onStatusAction(project, "hold")}
					/>
					<DropdownMenuSuccessItem
						icon={CheckCheck}
						label={t("project.projectPage.table.actions.complete")}
						onClick={() => onStatusAction(project, "complete")}
					/>
					<DropdownMenuDangerItem
						icon={Ban}
						label={t("project.projectPage.table.actions.cancel")}
						onClick={() => onStatusAction(project, "cancel")}
					/>
				</>
			) : null}

			{project.status.status === "ON_HOLD" ? (
				<>
					<DropdownMenuSeparator />
					<DropdownMenuInfoItem
						icon={RotateCcw}
						label={t("project.projectPage.table.actions.retake")}
						onClick={() => onStatusAction(project, "retake")}
					/>
					<DropdownMenuDangerItem
						icon={Ban}
						label={t("project.projectPage.table.actions.cancel")}
						onClick={() => onStatusAction(project, "cancel")}
					/>
				</>
			) : null}

			<DropdownMenuSeparator />
			<DeleteRowAction onClick={() => onDelete(project)} />
		</>
	);
}
