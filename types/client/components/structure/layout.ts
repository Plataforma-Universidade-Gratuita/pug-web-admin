import type { ComponentPropsWithoutRef } from "react";

export interface PageShellProps extends ComponentPropsWithoutRef<"main"> {
	width?: "default" | "wide";
}
