"use client";

import { ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";

import { DropdownMenuInfoItem } from "@/components";
import type { UsersRowActionsProps } from "@/types";

export function UsersRowActions({ href }: UsersRowActionsProps) {
	const { t } = useTranslation();

	return (
		<DropdownMenuInfoItem
			icon={ArrowUpRight}
			label={t("identity.userPage.table.actions.viewDetails")}
			onClick={() => {
				window.open(href, "_blank", "noopener,noreferrer");
			}}
		/>
	);
}
