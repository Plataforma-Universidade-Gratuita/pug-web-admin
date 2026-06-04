"use client";

import { useTranslation } from "react-i18next";

import { ServicePageConfirmDialog } from "@/features/shared/service-pages";
import type { AdminsActionDialogsProps } from "@/types";

export function AdminsActionDialogs({
	onConfirmDelete,
	onConfirmStatusChange,
	onDeleteOpenChange,
	onStatusOpenChange,
	pendingDeleteAdmin,
	pendingStatusAdmin,
}: AdminsActionDialogsProps) {
	const { t } = useTranslation();

	return (
		<>
			<ServicePageConfirmDialog
				open={pendingStatusAdmin !== null}
				onOpenChange={onStatusOpenChange}
				variant={pendingStatusAdmin?.active ? "success" : "warning"}
				title={t(
					pendingStatusAdmin?.active
						? "identity.adminPage.reactivate.confirm.title"
						: "identity.adminPage.deactivate.confirm.title",
				)}
				description={t(
					pendingStatusAdmin?.active
						? "identity.adminPage.reactivate.confirm.description"
						: "identity.adminPage.deactivate.confirm.description",
					{
						name: pendingStatusAdmin?.admin.account.user.name ?? "",
					},
				)}
				cancelLabel={t("common.cancel")}
				actionLabel={t(
					pendingStatusAdmin?.active
						? "common.table.actions.reactivate"
						: "common.table.actions.deactivate",
				)}
				onAction={onConfirmStatusChange}
			/>

			<ServicePageConfirmDialog
				open={pendingDeleteAdmin !== null}
				onOpenChange={onDeleteOpenChange}
				variant="danger"
				title={t("identity.adminPage.delete.confirm.title")}
				description={t("identity.adminPage.delete.confirm.description", {
					name: pendingDeleteAdmin?.account.user.name ?? "",
				})}
				cancelLabel={t("common.cancel")}
				actionLabel={t("common.table.actions.delete")}
				onAction={onConfirmDelete}
			/>
		</>
	);
}
