/*
 * Copyright (c) 2026 Mateus Fernandes and Plataforma Universidade Gratuita.
 * All rights reserved.
 *
 * This source code is proprietary and confidential. Unauthorized use,
 * copying, modification, distribution, or deployment is prohibited.
 */
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
