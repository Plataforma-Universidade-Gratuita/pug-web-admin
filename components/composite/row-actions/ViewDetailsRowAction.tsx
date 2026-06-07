"use client";

import { useRouter } from "next/navigation";

import { ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";

import { DropdownMenuInfoItem } from "@/components/primitives";
import type { RowActionNavigateProps } from "@/types/client";

export function ViewDetailsRowAction({ href, label }: RowActionNavigateProps) {
	const { t } = useTranslation();
	const router = useRouter();

	return (
		<DropdownMenuInfoItem
			icon={ArrowUpRight}
			label={label ?? t("common.table.actions.viewDetails")}
			onClick={() => {
				router.push(href);
			}}
		/>
	);
}
