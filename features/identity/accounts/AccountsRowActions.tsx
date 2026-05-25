"use client";

import { ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";

import { DropdownMenuInfoItem } from "@/components";
import type { AccountsRowActionsProps } from "@/types";

export function AccountsRowActions({ href }: AccountsRowActionsProps) {
	const { t } = useTranslation();

	return (
		<DropdownMenuInfoItem
			icon={ArrowUpRight}
			label={t("identity.accountPage.table.actions.viewDetails")}
			onClick={() => {
				window.open(href, "_blank", "noopener,noreferrer");
			}}
		/>
	);
}
