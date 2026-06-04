"use client";

import { useRouter } from "next/navigation";

import {
	ArrowUpRight,
	Ban,
	CheckCheck,
	CopyPlus,
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
import type { ProjectsRowActionsProps } from "@/types";

export function ProjectsRowActions({
	href,
	onDelete,
	onDuplicate,
	onOpenEditor,
	onStatusAction,
	project,
}: ProjectsRowActionsProps) {
	const { t } = useTranslation();
	const router = useRouter();

	return (
		<>
			<DropdownMenuInfoItem
				icon={ArrowUpRight}
				label={t("common.table.actions.viewDetails")}
				onClick={() => {
					router.push(href);
				}}
			/>
			<DropdownMenuItem
				icon={PenSquare}
				label={t("common.table.actions.update")}
				onClick={() => onOpenEditor(project.id, "update")}
			/>
			<DropdownMenuItem
				icon={CopyPlus}
				label={t("common.table.actions.duplicate")}
				onClick={() => onDuplicate(project)}
			/>

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
			<DropdownMenuDangerItem
				icon={Trash2}
				label={t("common.table.actions.delete")}
				onClick={() => onDelete(project)}
			/>
		</>
	);
}
