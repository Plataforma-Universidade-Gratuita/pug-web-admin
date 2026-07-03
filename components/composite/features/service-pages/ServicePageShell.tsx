/*
 * Copyright (c) 2026 Mateus Fernandes and Plataforma Universidade Gratuita.
 * All rights reserved.
 *
 * This source code is proprietary and confidential. Unauthorized use,
 * copying, modification, distribution, or deployment is prohibited.
 */
import { PageShell } from "@/components/primitives";
import type { ServicePageShellProps } from "@/types/client";

export function ServicePageShell({ children }: ServicePageShellProps) {
	return (
		<PageShell
			width="wide"
			className="grid h-[calc(100dvh-4.5rem)] min-h-[48rem] grid-rows-[auto_minmax(0,1fr)] gap-4 overflow-hidden p-4 lg:p-6"
		>
			{children}
		</PageShell>
	);
}
