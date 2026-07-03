/*
 * Copyright (c) 2026 Mateus Fernandes and Plataforma Universidade Gratuita.
 * All rights reserved.
 *
 * This source code is proprietary and confidential. Unauthorized use,
 * copying, modification, distribution, or deployment is prohibited.
 */
import { Plus } from "lucide-react";

import { Button } from "@/components/primitives";
import type { ServicePageHeaderActionsProps } from "@/types/client";

export function ServicePageHeaderActions({
	clearLabel,
	createLabel,
	hasFilters,
	onClear,
	onCreate,
}: ServicePageHeaderActionsProps) {
	return (
		<>
			{hasFilters ? (
				<Button
					variant="secondary"
					onClick={onClear}
				>
					{clearLabel}
				</Button>
			) : null}
			<Button
				leadingIcon={<Plus className="h-4 w-4" />}
				onClick={onCreate}
			>
				{createLabel}
			</Button>
		</>
	);
}
