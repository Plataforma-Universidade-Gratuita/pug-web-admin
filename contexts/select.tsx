"use client";

import { createContext, useContext } from "react";

import type { SelectContextValue, SelectProviderProps } from "@/types";

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
