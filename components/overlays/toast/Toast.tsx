"use client";

import type { ComponentProps, ReactNode } from "react";

import {
	AlertCircle,
	CheckCircle2,
	Info,
	LoaderCircle,
	RotateCcw,
	TriangleAlert,
} from "lucide-react";
import {
	Toaster as SonnerToaster,
	toast as sonnerToast,
	type ExternalToast,
} from "sonner";

import { APP_TOPBAR_HEIGHT } from "@/constants/components";
import { useTheme } from "@/contexts/theme";
import type {
	AppToastOptions,
	AppToastPromiseOptions,
	AppToastUndoOptions,
} from "@/types/client";

const DEFAULT_TOAST_DURATION = 3000;
const UNDO_TOAST_DURATION = 5000;
const TOAST_OFFSET_TOP = `calc(${APP_TOPBAR_HEIGHT} + 1rem)`;

type ToastProviderProps = Omit<
	ComponentProps<typeof SonnerToaster>,
	| "duration"
	| "expand"
	| "offset"
	| "position"
	| "theme"
	| "toastOptions"
	| "visibleToasts"
>;

function withDefaults(options?: AppToastOptions): ExternalToast {
	return {
		duration: DEFAULT_TOAST_DURATION,
		...options,
	};
}

function resolveValue<TData>(
	value: ReactNode | ((data: TData) => ReactNode),
	data: TData,
) {
	return typeof value === "function"
		? (value as (data: TData) => ReactNode)(data)
		: value;
}

export function ToastProvider(props: ToastProviderProps) {
	const { mode } = useTheme();

	return (
		<SonnerToaster
			expand={false}
			theme={mode === "system" ? "system" : mode}
			position="top-right"
			visibleToasts={3}
			duration={DEFAULT_TOAST_DURATION}
			offset={{ top: TOAST_OFFSET_TOP, right: "1rem" }}
			toastOptions={{
				unstyled: true,
				classNames: {
					toast:
						"toast-root shadow-strong flex w-[min(24rem,calc(100vw-2rem))] items-start gap-3 rounded-[calc(var(--twc-radius-xl)+0.125rem)] px-4 py-3 backdrop-blur-sm",
					content: "min-w-0 flex-1",
					title: "toast-title",
					description: "toast-description",
					icon: "toast-icon mt-0.5 shrink-0",
					actionButton: "toast-action-button",
					cancelButton: "toast-cancel-button",
					success: "toast-tone-success",
					info: "toast-tone-info",
					warning: "toast-tone-warning",
					error: "toast-tone-danger",
					loading: "toast-tone-brand",
				},
			}}
			icons={{
				success: <CheckCircle2 className="h-4 w-4" />,
				info: <Info className="h-4 w-4" />,
				warning: <TriangleAlert className="h-4 w-4" />,
				error: <AlertCircle className="h-4 w-4" />,
				loading: <LoaderCircle className="h-4 w-4 animate-spin" />,
			}}
			{...props}
		/>
	);
}

function baseToast(message: ReactNode, options?: AppToastOptions) {
	return sonnerToast(message, withDefaults(options));
}

export const toast = Object.assign(baseToast, {
	success(message: ReactNode, options?: AppToastOptions) {
		return sonnerToast.success(message, withDefaults(options));
	},
	info(message: ReactNode, options?: AppToastOptions) {
		return sonnerToast.info(message, withDefaults(options));
	},
	warning(message: ReactNode, options?: AppToastOptions) {
		return sonnerToast.warning(message, withDefaults(options));
	},
	danger(message: ReactNode, options?: AppToastOptions) {
		return sonnerToast.error(message, withDefaults(options));
	},
	error(message: ReactNode, options?: AppToastOptions) {
		return sonnerToast.error(message, withDefaults(options));
	},
	promise<ToastData>(
		promise: Promise<ToastData> | (() => Promise<ToastData>),
		options: AppToastPromiseOptions<ToastData>,
	) {
		const { loading, success, error, description, ...rest } = options;

		return sonnerToast.promise(promise, {
			...withDefaults(rest),
			loading,
			success: data => resolveValue(success, data),
			error: err => resolveValue(error, err),
			description:
				typeof description === "function"
					? (data: ToastData) => resolveValue(description, data)
					: description,
		});
	},
	undo(message: ReactNode, options: AppToastUndoOptions) {
		const { onUndo, undoLabel = "Undo", duration, ...rest } = options;
		const actionButtonClassName = [
			rest.classNames?.actionButton,
			"toast-action-button-brand",
		]
			.filter(Boolean)
			.join(" ");

		return sonnerToast.message(message, {
			...withDefaults(rest),
			duration: duration ?? UNDO_TOAST_DURATION,
			icon: <RotateCcw className="h-4 w-4" />,
			classNames: {
				...rest.classNames,
				actionButton: actionButtonClassName,
			},
			action: {
				label: undoLabel,
				onClick: onUndo,
			},
		});
	},
	dismiss(id?: string | number) {
		return sonnerToast.dismiss(id);
	},
});
