"use client";

import { ViewDetailsRowAction } from "@/components";
import type { AccountsRowActionsProps } from "@/types";

export function AccountsRowActions({ href }: AccountsRowActionsProps) {
	return <ViewDetailsRowAction href={href} />;
}
