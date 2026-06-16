"use client";

import { Check, CheckCheck, UserMinus, XCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

import { DeleteRowAction, ViewDetailsRowAction } from "@/components/composite";
import {
	DropdownMenuDangerItem,
	DropdownMenuSeparator,
	DropdownMenuSuccessItem,
	DropdownMenuWarningItem,
} from "@/components/primitives";
import type { EnrollmentsRowActionsProps } from "@/types/client";

export function EnrollmentsRowActions({
	enrollment,
	href,
	onDelete,
	onStatusAction,
}: EnrollmentsRowActionsProps) {
	const { t } = useTranslation();

	return (
		<>
			<ViewDetailsRowAction href={href} />

			{enrollment.status.status === "PENDING" ? (
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
				</>
			) : null}

			{enrollment.status.status === "APPROVED" ? (
				<>
					<DropdownMenuSeparator />
					<DropdownMenuSuccessItem
						icon={CheckCheck}
						label={t("project.enrollmentPage.table.actions.complete")}
						onClick={() => onStatusAction(enrollment, "complete")}
					/>
					<DropdownMenuDangerItem
						icon={UserMinus}
						label={t("project.enrollmentPage.table.actions.remove")}
						onClick={() => onStatusAction(enrollment, "remove")}
					/>
				</>
			) : null}

			<DropdownMenuSeparator />
			<DeleteRowAction onClick={() => onDelete(enrollment)} />
		</>
	);
}
