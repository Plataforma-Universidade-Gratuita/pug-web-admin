import { createContext, useContext } from "react";

import type { LoadingContextValue } from "@/types/client";

const LoadingContext = createContext<LoadingContextValue>({
	isLoading: false,
});

export function LoadingProvider({
	children,
	value,
}: {
	children: React.ReactNode;
	value: LoadingContextValue;
}) {
	return (
		<LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>
	);
}

export function useLoading(): LoadingContextValue {
	return useContext(LoadingContext);
}
