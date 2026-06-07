"use client";

import { ViewDetailsRowAction } from "@/components/composite";
import type { UsersRowActionsProps } from "@/types/client";

export function UsersRowActions({ href }: UsersRowActionsProps) {
	return <ViewDetailsRowAction href={href} />;
}
