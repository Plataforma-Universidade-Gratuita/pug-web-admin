import type { ReactNode } from "react";

import type { ExternalToast } from "sonner";

import { TOAST_OFFSET_TOP } from "@/components/primitives/overlays/toast/constants";
import { LOGIN_ROUTE } from "@/constants";
import type { AppToastOptions } from "@/types/client";

export function withToastDefaults(
	options: AppToastOptions | undefined,
	duration: number,
): ExternalToast {
	return {
		duration,
		...options,
	};
}

export function resolveToastValue<TData>(
	value: ReactNode | ((data: TData) => ReactNode),
	data: TData,
) {
	return typeof value === "function"
		? (value as (data: TData) => ReactNode)(data)
		: value;
}

export function resolveToastOffset(path: string) {
	const topValue = path !== LOGIN_ROUTE ? TOAST_OFFSET_TOP : "1rem";
	return { top: topValue, right: "1rem" };
}
