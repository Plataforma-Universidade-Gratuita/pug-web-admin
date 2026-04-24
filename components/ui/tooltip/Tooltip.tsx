"use client";

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
						className="surface-3 shadow-strong rounded-[var(--twc-radius-md)] px-2 py-1 text-xs font-medium text-[color:var(--twc-text)]"
					>
						{content}
						<RadixTooltip.Arrow className="fill-[color:var(--twc-surface-3)]" />
					</RadixTooltip.Content>
				</RadixTooltip.Portal>
			</RadixTooltip.Root>
		</RadixTooltip.Provider>
	);
}
