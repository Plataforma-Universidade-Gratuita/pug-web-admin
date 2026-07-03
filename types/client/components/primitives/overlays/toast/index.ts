/*
 * Copyright (c) 2026 Mateus Fernandes and Plataforma Universidade Gratuita.
 * All rights reserved.
 *
 * This source code is proprietary and confidential. Unauthorized use,
 * copying, modification, distribution, or deployment is prohibited.
 */
import type { MouseEvent, ReactNode } from "react";

import type { ExternalToast, ToasterProps } from "sonner";

export interface AppToastOptions extends Omit<
	ExternalToast,
	"description" | "duration" | "action"
> {
	description?: ReactNode;
	duration?: number;
}

export interface AppToastUndoOptions extends AppToastOptions {
	onUndo: (event: MouseEvent<HTMLButtonElement>) => void;
	undoLabel?: ReactNode;
}

export interface AppToastPromiseOptions<ToastData> extends Omit<
	AppToastOptions,
	"description"
> {
	loading: ReactNode;
	success: ReactNode | ((data: ToastData) => ReactNode);
	error: ReactNode | ((error: unknown) => ReactNode);
	description?: ReactNode | ((data: ToastData) => ReactNode);
}

export type ToastProviderProps = Omit<
	ToasterProps,
	| "duration"
	| "expand"
	| "offset"
	| "position"
	| "theme"
	| "toastOptions"
	| "visibleToasts"
>;
