"use client";

/*
 * Copyright (c) 2026 Mateus Fernandes and Plataforma Universidade Gratuita.
 * All rights reserved.
 *
 * This source code is proprietary and confidential. Unauthorized use,
 * copying, modification, distribution, or deployment is prohibited.
 */
import * as RadixTooltip from "@radix-ui/react-tooltip";

import type { TooltipProps } from "@/types/client";

export function Tooltip({
	children,
	content,
	side = "top",
	align = "center",
}: TooltipProps) {
	return (
		<RadixTooltip.Provider delayDuration={300}>
			<RadixTooltip.Root>
				<RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
				<RadixTooltip.Portal>
					<RadixTooltip.Content
						side={side}
						align={align}
						sideOffset={8}
						className="tooltip-content"
					>
						{content}
						<RadixTooltip.Arrow className="tooltip-arrow" />
					</RadixTooltip.Content>
				</RadixTooltip.Portal>
			</RadixTooltip.Root>
		</RadixTooltip.Provider>
	);
}
