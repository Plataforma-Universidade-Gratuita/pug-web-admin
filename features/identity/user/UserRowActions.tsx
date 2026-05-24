"use client";

import { Eye } from "lucide-react";
import { useTranslation } from "react-i18next";

import { DropdownMenuInfoItem } from "@/components";
import type { UserRowActionsProps } from "@/types/client";

export function UserRowActions({ onView, user }: UserRowActionsProps) {
	const { t } = useTranslation();

	return (
		<DropdownMenuInfoItem
			icon={Eye}
			label={t("identity.userPage.table.actions.viewDetails")}
			onClick={() => onView(user.id)}
		/>
	);
}
