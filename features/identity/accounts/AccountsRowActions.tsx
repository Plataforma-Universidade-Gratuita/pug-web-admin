"use client";

/*
 * Copyright (c) 2026 Mateus Fernandes and Plataforma Universidade Gratuita.
 * All rights reserved.
 *
 * This source code is proprietary and confidential. Unauthorized use,
 * copying, modification, distribution, or deployment is prohibited.
 */
import { ViewDetailsRowAction } from "@/components/composite";
import type { AccountsRowActionsProps } from "@/types/client";

export function AccountsRowActions({ href }: AccountsRowActionsProps) {
	return <ViewDetailsRowAction href={href} />;
}
