"use client";

import { Eye } from "lucide-react";
import { useTranslation } from "react-i18next";

import { DropdownMenuInfoItem } from "@/components";
import type { CityRowActionsProps } from "@/types/client";

export function CityRowActions({ city, onView }: CityRowActionsProps) {
	const { t } = useTranslation();

	return (
		<DropdownMenuInfoItem
			icon={Eye}
			label={t("geo.cityPage.table.actions.viewDetails")}
			onClick={() => onView(city.id)}
		/>
	);
}
