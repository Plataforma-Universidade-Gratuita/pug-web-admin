"use client";

import { ViewDetailsRowAction } from "@/components";
import type { UsersRowActionsProps } from "@/types";

export function UsersRowActions({ href }: UsersRowActionsProps) {
	return <ViewDetailsRowAction href={href} />;
}
