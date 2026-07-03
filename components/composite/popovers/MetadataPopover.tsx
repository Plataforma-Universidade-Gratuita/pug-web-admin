/*
 * Copyright (c) 2026 Mateus Fernandes and Plataforma Universidade Gratuita.
 * All rights reserved.
 *
 * This source code is proprietary and confidential. Unauthorized use,
 * copying, modification, distribution, or deployment is prohibited.
 */
import { Info } from "lucide-react";

import {
	Button,
	NoContentState,
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/primitives";
import type { ServicePageMetadataPopoverProps } from "@/types/client";

export function MetadataPopover({
	triggerLabel,
	emptyTitle,
	emptyDescription,
}: ServicePageMetadataPopoverProps) {
	return (
		<Popover>
			<PopoverTrigger>
				<Button
					aria-label={triggerLabel}
					size="icon"
					tooltipContent={triggerLabel}
					variant="secondary"
				>
					<Info className="h-4 w-4" />
				</Button>
			</PopoverTrigger>
			<PopoverContent
				className="w-80"
				side={"left"}
			>
				<NoContentState
					title={emptyTitle}
					description={emptyDescription}
				/>
			</PopoverContent>
		</Popover>
	);
}
