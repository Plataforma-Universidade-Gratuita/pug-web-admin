"use client";

import { Badge, Label } from "@/components";
import type { AccountSummaryBadgesProps } from "@/types";

export function AccountSummaryBadges({
	accountTypeFieldLabel,
	accountTypeLabel,
	accountTypeTone,
	activeFieldLabel,
	activeLabel,
	activeTone,
	className,
}: AccountSummaryBadgesProps) {
	return (
		<div
			className={["grid gap-4 md:grid-cols-2", className]
				.filter(Boolean)
				.join(" ")}
		>
			<div className="grid gap-2">
				<Label>{accountTypeFieldLabel}</Label>
				<div>
					<Badge
						className="min-h-5 px-2 py-0.5"
						tone={accountTypeTone}
						variant="primary"
					>
						{accountTypeLabel}
					</Badge>
				</div>
			</div>

			<div className="grid gap-2">
				<Label>{activeFieldLabel}</Label>
				<div>
					<Badge
						className="min-h-5 px-2 py-0.5"
						tone={activeTone}
						variant="primary"
					>
						{activeLabel}
					</Badge>
				</div>
			</div>
		</div>
	);
}
