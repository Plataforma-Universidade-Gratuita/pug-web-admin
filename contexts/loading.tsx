"use client";

/*
 * Copyright (c) 2026 Mateus Fernandes and Plataforma Universidade Gratuita.
 * All rights reserved.
 *
 * This source code is proprietary and confidential. Unauthorized use,
 * copying, modification, distribution, or deployment is prohibited.
 */
import { createContext, useContext } from "react";

import type { LoadingContextValue, LoadingProviderProps } from "@/types/client";

const LoadingContext = createContext<LoadingContextValue>({
	isLoading: false,
});

export function LoadingProvider({ children, value }: LoadingProviderProps) {
	return (
		<LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>
	);
}

export function useLoading(): LoadingContextValue {
	return useContext(LoadingContext);
}
