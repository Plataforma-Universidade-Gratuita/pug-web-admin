"use client";

import { useRouter } from "next/navigation";

import { ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";

import { DropdownMenuInfoItem } from "@/components";
import type { AccountsRowActionsProps } from "@/types";

export function AccountsRowActions({ href }: AccountsRowActionsProps) {
	const { t } = useTranslation();
	const router = useRouter();

	return (
		<DropdownMenuInfoItem
			icon={ArrowUpRight}
			label={t("common.table.actions.viewDetails")}
			onClick={() => {
				router.push(href);
			}}
		/>
	);
}
