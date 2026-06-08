"use client";

import { useTranslation } from "react-i18next";

import { RecordActionDialogs } from "@/components/composite";
import type { StaffPageDialogsProps } from "@/types/client";

export function StaffPageDialogs({
	onDeleteConfirm,
	onDeleteOpenChange,
	onStatusConfirm,
	onStatusOpenChange,
	pendingDeleteRecord,
	pendingStatusRecord,
}: StaffPageDialogsProps) {
	const { t } = useTranslation();

	return (
		<RecordActionDialogs
			cancelLabel={t("common.cancel")}
			{...(pendingDeleteRecord
				? {
						deleteDialog: {
							actionLabel: t("table.actions.delete"),
							description: t("partner.staffPage.delete.confirm.description", {
								name: pendingDeleteRecord.account.user.name,
							}),
							onAction: onDeleteConfirm,
							onOpenChange: onDeleteOpenChange,
							open: true,
							title: t("partner.staffPage.delete.confirm.title"),
							variant: "danger" as const,
						},
					}
				: {})}
			{...(pendingStatusRecord
				? {
						statusDialog: {
							actionLabel: t(
								pendingStatusRecord.active
									? "table.actions.reactivate"
									: "table.actions.deactivate",
							),
							description: t(
								pendingStatusRecord.active
									? "partner.staffPage.reactivate.confirm.description"
									: "partner.staffPage.deactivate.confirm.description",
								{
									name: pendingStatusRecord.record.account.user.name,
								},
							),
							onAction: onStatusConfirm,
							onOpenChange: onStatusOpenChange,
							open: true,
							title: t(
								pendingStatusRecord.active
									? "partner.staffPage.reactivate.confirm.title"
									: "partner.staffPage.deactivate.confirm.title",
							),
							variant: pendingStatusRecord.active
								? ("success" as const)
								: ("warning" as const),
						},
					}
				: {})}
		/>
	);
}
