"use client";

/*
 * Copyright (c) 2026 Mateus Fernandes and Plataforma Universidade Gratuita.
 * All rights reserved.
 *
 * This source code is proprietary and confidential. Unauthorized use,
 * copying, modification, distribution, or deployment is prohibited.
 */
import { ViewDetailsRowAction } from "@/components/composite";
import type { UsersRowActionsProps } from "@/types/client";

export function UsersRowActions({ href }: UsersRowActionsProps) {
	return <ViewDetailsRowAction href={href} />;
}
