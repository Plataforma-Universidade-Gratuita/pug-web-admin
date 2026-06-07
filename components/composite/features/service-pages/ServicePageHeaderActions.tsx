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
