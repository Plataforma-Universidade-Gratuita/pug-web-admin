"use client";

/*
 * Copyright (c) 2026 Mateus Fernandes and Plataforma Universidade Gratuita.
 * All rights reserved.
 *
 * This source code is proprietary and confidential. Unauthorized use,
 * copying, modification, distribution, or deployment is prohibited.
 */
import { createContext, useContext } from "react";

import type { SelectContextValue, SelectProviderProps } from "@/types/client";

const SelectContext = createContext<SelectContextValue>({
	clearSelection: () => undefined,
	disabled: false,
	hasValue: false,
});

export function SelectProvider({ children, value }: SelectProviderProps) {
	return (
		<SelectContext.Provider value={value}>{children}</SelectContext.Provider>
	);
}

export function useSelect(): SelectContextValue {
	return useContext(SelectContext);
}
