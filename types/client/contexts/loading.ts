import type { ReactNode } from "react";

export interface LoadingContextValue {
	isLoading: boolean;
	loadingLabel?: string | undefined;
}

export interface LoadingProviderProps {
	children: ReactNode;
	value: LoadingContextValue;
}
