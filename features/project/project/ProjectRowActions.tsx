"use client";

import {
	Ban,
	CheckCheck,
	CopyPlus,
	Eye,
	Pause,
	PenSquare,
	Play,
	RotateCcw,
	Trash2,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import {
	DropdownMenuDangerItem,
	DropdownMenuInfoItem,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuSuccessItem,
	DropdownMenuWarningItem,
} from "@/components";
import type { ProjectRowActionsProps } from "@/types";

export function ProjectRowActions({
	onDelete,
	onOpenEditor,
	onStatusAction,
	onView,
	project,
}: ProjectRowActionsProps) {
	const { t } = useTranslation();

	return (
		<>
			<DropdownMenuInfoItem
				icon={Eye}
				label={t("project.projectPage.table.actions.viewDetails")}
				onClick={() => onView(project.id)}
			/>
			<DropdownMenuItem
				icon={PenSquare}
				label={t("project.projectPage.table.actions.update")}
				onClick={() => onOpenEditor(project.id, "update")}
			/>
			<DropdownMenuItem
				icon={CopyPlus}
				label={t("project.projectPage.table.actions.duplicate")}
				onClick={() => onOpenEditor(project.id, "duplicate")}
			/>

			{project.status === "PLANNED" ? (
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

			{project.status === "IN_PROGRESS" ? (
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

			{project.status === "ON_HOLD" ? (
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

			{project.status === "COMPLETED" || project.status === "CANCELED" ? (
				<>
					<DropdownMenuSeparator />
					<DropdownMenuInfoItem
						icon={RotateCcw}
						label={t("project.projectPage.table.actions.retake")}
						onClick={() => onStatusAction(project, "retake")}
					/>
				</>
			) : null}

			<DropdownMenuSeparator />
			<DropdownMenuDangerItem
				icon={Trash2}
				label={t("project.projectPage.table.actions.delete")}
				onClick={() => onDelete(project)}
			/>
		</>
	);
}
