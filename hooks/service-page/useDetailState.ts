"use client";

import { useCallback, useState } from "react";

import type { ServicePageDetailState } from "@/types";

export function useDetailState<
	TId extends string = string,
>(): ServicePageDetailState<TId> {
	const [selectedId, setSelectedId] = useState<TId | null>(null);

	const openDetail = useCallback((id: TId) => {
		setSelectedId(id);
	}, []);

	const closeDetail = useCallback(() => {
		setSelectedId(null);
	}, []);

	const handleOpenChange = useCallback((open: boolean) => {
		if (!open) {
			setSelectedId(null);
		}
	}, []);

	const clearIfMatches = useCallback((id: TId) => {
		setSelectedId(current => (current === id ? null : current));
	}, []);

	return {
		selectedId,
		isOpen: selectedId !== null,
		openDetail,
		closeDetail,
		handleOpenChange,
		clearIfMatches,
	};
}
