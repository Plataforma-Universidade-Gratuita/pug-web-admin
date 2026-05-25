"use client";

import {
	ArrowUpRight,
	Ban,
	Check,
	CheckCheck,
	Trash2,
	UserMinus,
	XCircle,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import {
	DropdownMenuDangerItem,
	DropdownMenuInfoItem,
	DropdownMenuSeparator,
	DropdownMenuSuccessItem,
	DropdownMenuWarningItem,
} from "@/components";
import type { EnrollmentsRowActionsProps } from "@/types";

export function EnrollmentsRowActions({
	enrollment,
	href,
	onDelete,
	onStatusAction,
}: EnrollmentsRowActionsProps) {
	const { t } = useTranslation();

	return (
		<>
			<DropdownMenuInfoItem
				icon={ArrowUpRight}
				label={t("project.enrollmentPage.table.actions.viewDetails")}
				onClick={() => {
					window.open(href, "_blank", "noopener,noreferrer");
				}}
			/>

			{enrollment.status === "PENDING" ? (
				<>
					<DropdownMenuSeparator />
					<DropdownMenuSuccessItem
						icon={Check}
						label={t("project.enrollmentPage.table.actions.accept")}
						onClick={() => onStatusAction(enrollment, "accept")}
					/>
					<DropdownMenuWarningItem
						icon={XCircle}
						label={t("project.enrollmentPage.table.actions.reject")}
						onClick={() => onStatusAction(enrollment, "reject")}
					/>
					<DropdownMenuWarningItem
						icon={Ban}
						label={t("project.enrollmentPage.table.actions.cancel")}
						onClick={() => onStatusAction(enrollment, "cancel")}
					/>
					<DropdownMenuDangerItem
						icon={UserMinus}
						label={t("project.enrollmentPage.table.actions.remove")}
						onClick={() => onStatusAction(enrollment, "remove")}
					/>
				</>
			) : null}

			{enrollment.status === "APPROVED" ? (
				<>
					<DropdownMenuSeparator />
					<DropdownMenuSuccessItem
						icon={CheckCheck}
						label={t("project.enrollmentPage.table.actions.complete")}
						onClick={() => onStatusAction(enrollment, "complete")}
					/>
					<DropdownMenuWarningItem
						icon={Ban}
						label={t("project.enrollmentPage.table.actions.cancel")}
						onClick={() => onStatusAction(enrollment, "cancel")}
					/>
					<DropdownMenuDangerItem
						icon={UserMinus}
						label={t("project.enrollmentPage.table.actions.remove")}
						onClick={() => onStatusAction(enrollment, "remove")}
					/>
				</>
			) : null}

			<DropdownMenuSeparator />
			<DropdownMenuDangerItem
				icon={Trash2}
				label={t("project.enrollmentPage.table.actions.delete")}
				onClick={() => onDelete(enrollment)}
			/>
		</>
	);
}
