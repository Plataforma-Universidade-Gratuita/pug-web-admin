"use client";

import { useTranslation } from "react-i18next";

import { ServicePageConfirmDialog } from "@/features/shared/service-pages";
import type { StaffActionDialogsProps } from "@/types";

export function StaffActionDialogs({
	onConfirmDelete,
	onConfirmStatusChange,
	onDeleteOpenChange,
	onStatusOpenChange,
	pendingDeleteStaff,
	pendingStatusStaff,
}: StaffActionDialogsProps) {
	const { t } = useTranslation();

	return (
		<>
			<ServicePageConfirmDialog
				open={pendingStatusStaff !== null}
				onOpenChange={onStatusOpenChange}
				variant={pendingStatusStaff?.active ? "success" : "warning"}
				title={t(
					pendingStatusStaff?.active
						? "partner.staffPage.reactivate.confirm.title"
						: "partner.staffPage.deactivate.confirm.title",
				)}
				description={t(
					pendingStatusStaff?.active
						? "partner.staffPage.reactivate.confirm.description"
						: "partner.staffPage.deactivate.confirm.description",
					{
						name: pendingStatusStaff?.staff.account.user.name ?? "",
					},
				)}
				cancelLabel={t("common.cancel")}
				actionLabel={t(
					pendingStatusStaff?.active
						? "common.table.actions.reactivate"
						: "common.table.actions.deactivate",
				)}
				onAction={onConfirmStatusChange}
			/>

			<ServicePageConfirmDialog
				open={pendingDeleteStaff !== null}
				onOpenChange={onDeleteOpenChange}
				variant="danger"
				title={t("partner.staffPage.delete.confirm.title")}
				description={t("partner.staffPage.delete.confirm.description", {
					name: pendingDeleteStaff?.account.user.name ?? "",
				})}
				cancelLabel={t("common.cancel")}
				actionLabel={t("common.table.actions.delete")}
				onAction={onConfirmDelete}
			/>
		</>
	);
}
