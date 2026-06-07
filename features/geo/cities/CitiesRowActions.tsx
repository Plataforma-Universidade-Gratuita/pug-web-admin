"use client";

import { ViewDetailsRowAction } from "@/components/composite";
import type { CitiesRowActionsProps } from "@/types/client";

export function CitiesRowActions({ href }: CitiesRowActionsProps) {
	return <ViewDetailsRowAction href={href} />;
}
