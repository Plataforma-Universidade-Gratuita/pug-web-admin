import type { ReactNode } from "react";

import type { BadgeTone } from "@/types/client/components/primitives/display/badge";

export interface AccountSummaryBadgesProps {
	accountTypeFieldLabel: ReactNode;
	accountTypeLabel: ReactNode;
	accountTypeTone: BadgeTone;
	activeFieldLabel: ReactNode;
	activeLabel: ReactNode;
	activeTone: BadgeTone;
	className?: string;
}

export interface LinkedDetailsAccordionItem {
	value: string;
	title: ReactNode;
	content: ReactNode;
}

export interface LinkedDetailsAccordionProps {
	items: LinkedDetailsAccordionItem[];
	defaultValue?: string;
	className?: string;
}
