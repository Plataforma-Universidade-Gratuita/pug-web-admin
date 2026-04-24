import type { MouseEvent, ReactNode } from "react";

import type { ExternalToast } from "sonner";

export interface AppToastOptions
	extends Omit<ExternalToast, "description" | "duration" | "action"> {
	description?: ReactNode;
	duration?: number;
}

export interface AppToastUndoOptions extends AppToastOptions {
	onUndo: (event: MouseEvent<HTMLButtonElement>) => void;
	undoLabel?: ReactNode;
}

export interface AppToastPromiseOptions<ToastData>
	extends Omit<AppToastOptions, "description"> {
	loading: ReactNode;
	success: ReactNode | ((data: ToastData) => ReactNode);
	error: ReactNode | ((error: unknown) => ReactNode);
	description?: ReactNode | ((data: ToastData) => ReactNode);
}
