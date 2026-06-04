"use client";

import { ViewDetailsRowAction } from "@/components";
import type { CitiesRowActionsProps } from "@/types";

export function CitiesRowActions({ href }: CitiesRowActionsProps) {
	return <ViewDetailsRowAction href={href} />;
}
