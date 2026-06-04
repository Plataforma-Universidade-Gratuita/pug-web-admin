"use client";

import { Check, QrCode, UserRoundX } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
	DeleteRowAction,
	DropdownMenuInfoItem,
	DropdownMenuSeparator,
	DropdownMenuSuccessItem,
	ViewDetailsRowAction,
	DropdownMenuWarningItem,
} from "@/components";
import type { AttendancesRowActionsProps } from "@/types";

export function AttendancesRowActions({
	attendance,
	href,
	onDelete,
	onValidate,
	onViewQrCode,
}: AttendancesRowActionsProps) {
	const { t } = useTranslation();

	return (
		<>
			<ViewDetailsRowAction href={href} />
			<DropdownMenuInfoItem
				icon={QrCode}
				label={t("project.attendancePage.table.actions.viewQrCode")}
				onClick={() => onViewQrCode(attendance)}
			/>
			<DropdownMenuSeparator />
			{attendance.status.status !== "PRESENT" ? (
				<DropdownMenuSuccessItem
					icon={Check}
					label={t("project.attendancePage.table.actions.markPresent")}
					onClick={() => onValidate(attendance, "markPresent")}
				/>
			) : null}
			{attendance.status.status !== "ABSENT" ? (
				<DropdownMenuWarningItem
					icon={UserRoundX}
					label={t("project.attendancePage.table.actions.markAbsent")}
					onClick={() => onValidate(attendance, "markAbsent")}
				/>
			) : null}
			<DropdownMenuSeparator />
			<DeleteRowAction onClick={() => onDelete(attendance)} />
		</>
	);
}
