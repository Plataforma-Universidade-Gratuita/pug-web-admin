"use client";

import type { ReactNode } from "react";

import { usePathname } from "next/navigation";

import {
	AlertCircle,
	CheckCircle2,
	Info,
	LoaderCircle,
	RotateCcw,
	TriangleAlert,
} from "lucide-react";
import { Toaster as SonnerToaster, toast as sonnerToast } from "sonner";

import {
	resolveToastOffset,
	resolveToastValue,
	withToastDefaults,
} from "@/components/overlays/toast/utils";
import {
	TOAST_DEFAULT_DURATION,
	TOAST_UNDO_DURATION,
	TOAST_VISIBLE_COUNT,
} from "@/constants";
import { useTheme } from "@/contexts/theme";
import type {
	AppToastOptions,
	AppToastPromiseOptions,
	ToastProviderProps,
	AppToastUndoOptions,
} from "@/types";

export function ToastProvider(props: ToastProviderProps) {
	const { mode } = useTheme();
	const pathname = usePathname();

	return (
		<SonnerToaster
			expand={false}
			theme={mode === "system" ? "system" : mode}
			position="top-right"
			visibleToasts={TOAST_VISIBLE_COUNT}
			duration={TOAST_DEFAULT_DURATION}
			offset={resolveToastOffset(pathname)}
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

export const toast = Object.assign(
	(message: ReactNode, options?: AppToastOptions) =>
		sonnerToast(message, withToastDefaults(options, TOAST_DEFAULT_DURATION)),
	{
		success(message: ReactNode, options?: AppToastOptions) {
			return sonnerToast.success(
				message,
				withToastDefaults(options, TOAST_DEFAULT_DURATION),
			);
		},
		info(message: ReactNode, options?: AppToastOptions) {
			return sonnerToast.info(
				message,
				withToastDefaults(options, TOAST_DEFAULT_DURATION),
			);
		},
		warning(message: ReactNode, options?: AppToastOptions) {
			return sonnerToast.warning(
				message,
				withToastDefaults(options, TOAST_DEFAULT_DURATION),
			);
		},
		danger(message: ReactNode, options?: AppToastOptions) {
			return sonnerToast.error(
				message,
				withToastDefaults(options, TOAST_DEFAULT_DURATION),
			);
		},
		error(message: ReactNode, options?: AppToastOptions) {
			return sonnerToast.error(
				message,
				withToastDefaults(options, TOAST_DEFAULT_DURATION),
			);
		},
		promise<ToastData>(
			promise: Promise<ToastData> | (() => Promise<ToastData>),
			options: AppToastPromiseOptions<ToastData>,
		) {
			const { loading, success, error, description, ...rest } = options;

			return sonnerToast.promise(promise, {
				...withToastDefaults(rest, TOAST_DEFAULT_DURATION),
				loading,
				success: data => resolveToastValue(success, data),
				error: err => resolveToastValue(error, err),
				description:
					typeof description === "function"
						? (data: ToastData) => resolveToastValue(description, data)
						: description,
			});
		},
		undo(message: ReactNode, options: AppToastUndoOptions) {
			const { onUndo, undoLabel = "Undo", duration, ...rest } = options;
			const actionButtonClassName = [
				"toast-action-button",
				rest.classNames?.actionButton,
				"toast-action-button-brand",
			]
				.filter(Boolean)
				.join(" ");

			return sonnerToast(message, {
				...withToastDefaults(rest, TOAST_DEFAULT_DURATION),
				duration: duration ?? TOAST_UNDO_DURATION,
				icon: <RotateCcw className="h-4 w-4" />,
				classNames: {
					...rest.classNames,
					actionButton: actionButtonClassName,
				},
				action: {
					label: undoLabel,
					onClick: onUndo,
				},
				position: "bottom-right",
			});
		},
	},
);
