"use client";

import { ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";

import { DropdownMenuInfoItem } from "@/components";
import type { CitiesRowActionsProps } from "@/types";

export function CitiesRowActions({ href }: CitiesRowActionsProps) {
	const { t } = useTranslation();

	return (
		<DropdownMenuInfoItem
			icon={ArrowUpRight}
			label={t("geo.cityPage.table.actions.viewDetails")}
			onClick={() => {
				window.open(href, "_blank", "noopener,noreferrer");
			}}
		/>
	);
}
