"use client";

import { ViewDetailsRowAction } from "@/components/composite";
import type { AccountsRowActionsProps } from "@/types/client";

export function AccountsRowActions({ href }: AccountsRowActionsProps) {
	return <ViewDetailsRowAction href={href} />;
}
