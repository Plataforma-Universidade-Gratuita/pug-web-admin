"use client";

import { useCallback, useMemo, useState } from "react";

import type {
	ServicePageDraftFilters,
	UseDraftFiltersOptions,
	UseDraftFiltersResult,
} from "@/types";

function hasTruthyFilterValue(value: boolean | string) {
	if (typeof value === "boolean") {
		return value;
	}

	return value.length > 0;
}

export function useDraftFilters<TFilters extends ServicePageDraftFilters>({
	initialFilters,
}: UseDraftFiltersOptions<TFilters>): UseDraftFiltersResult<TFilters> {
	const [draftFilters, setDraftFilters] = useState<TFilters>(initialFilters);
	const [appliedFilters, setAppliedFilters] =
		useState<TFilters>(initialFilters);

	const hasAppliedFilters = useMemo(
		() => Object.values(appliedFilters).some(hasTruthyFilterValue),
		[appliedFilters],
	);

	const applyDraftFilters = useCallback(() => {
		setAppliedFilters(draftFilters);
	}, [draftFilters]);

	const clearFilters = useCallback(() => {
		setDraftFilters(initialFilters);
		setAppliedFilters(initialFilters);
	}, [initialFilters]);

	const setDraftFilter = useCallback(
		<TKey extends keyof TFilters>(key: TKey, value: TFilters[TKey]) => {
			setDraftFilters(current => ({
				...current,
				[key]: value,
			}));
		},
		[],
	);

	return {
		appliedFilters,
		draftFilters,
		hasAppliedFilters,
		applyDraftFilters,
		clearFilters,
		setAppliedFilters,
		setDraftFilter,
		setDraftFilters,
	};
}
