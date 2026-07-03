"use client";

/*
 * Copyright (c) 2026 Mateus Fernandes and Plataforma Universidade Gratuita.
 * All rights reserved.
 *
 * This source code is proprietary and confidential. Unauthorized use,
 * copying, modification, distribution, or deployment is prohibited.
 */
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
			label={label ?? t("table.actions.viewDetails")}
			onClick={() => {
				router.push(href);
			}}
		/>
	);
}
