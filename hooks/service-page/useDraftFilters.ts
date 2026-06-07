"use client";

import { useCallback, useMemo, useState } from "react";

import type {
	ServicePageDraftFilters,
	UseDraftFiltersOptions,
	UseDraftFiltersResult,
} from "@/types/client";

function isPlainObject(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

function areFilterValuesEqual(left: unknown, right: unknown): boolean {
	if (Object.is(left, right)) {
		return true;
	}

	if (Array.isArray(left) && Array.isArray(right)) {
		if (left.length !== right.length) {
			return false;
		}

		return left.every((value, index) =>
			areFilterValuesEqual(value, right[index]),
		);
	}

	if (isPlainObject(left) && isPlainObject(right)) {
		const leftKeys = Object.keys(left);
		const rightKeys = Object.keys(right);

		if (leftKeys.length !== rightKeys.length) {
			return false;
		}

		return leftKeys.every(key => areFilterValuesEqual(left[key], right[key]));
	}

	return false;
}

function hasChangedFilterValue<TFilters extends ServicePageDraftFilters>(
	appliedFilters: TFilters,
	initialFilters: TFilters,
) {
	return (Object.keys(initialFilters) as Array<keyof TFilters>).some(
		key => !areFilterValuesEqual(appliedFilters[key], initialFilters[key]),
	);
}

export function useDraftFilters<TFilters extends ServicePageDraftFilters>({
	initialFilters,
}: UseDraftFiltersOptions<TFilters>): UseDraftFiltersResult<TFilters> {
	const [draftFilters, setDraftFilters] = useState<TFilters>(initialFilters);
	const [appliedFilters, setAppliedFilters] =
		useState<TFilters>(initialFilters);

	const hasAppliedFilters = useMemo(
		() => hasChangedFilterValue(appliedFilters, initialFilters),
		[appliedFilters, initialFilters],
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
