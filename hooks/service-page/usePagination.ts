"use client";

import { useCallback, useEffect, useMemo } from "react";

import { DEFAULT_SERVICE_PAGE, DEFAULT_SERVICE_PAGE_SIZE } from "@/constants";
import { usePaginationStore } from "@/stores";
import type {
	ServicePageSizeOption,
	UseServicePagePaginationOptions,
	UseServicePagePaginationResult,
} from "@/types/client";

function normalizeTotalPages(totalPages?: number) {
	if (!totalPages || totalPages < 1) {
		return 1;
	}

	return totalPages;
}

function clampPage(page: number, totalPages: number) {
	return Math.min(Math.max(page, DEFAULT_SERVICE_PAGE), totalPages);
}

export function usePagination({
	key,
	totalPages: providedTotalPages,
	defaultPage = DEFAULT_SERVICE_PAGE,
	defaultSize = DEFAULT_SERVICE_PAGE_SIZE,
}: UseServicePagePaginationOptions): UseServicePagePaginationResult {
	const entry = usePaginationStore(state => state.entries[key]);
	const setEntry = usePaginationStore(state => state.setEntry);
	const currentPage = entry?.page ?? defaultPage;
	const pageSize = entry?.size ?? defaultSize;
	const totalPages = normalizeTotalPages(providedTotalPages);
	const isAll = pageSize === "all";
	const normalizedCurrentPage = isAll
		? DEFAULT_SERVICE_PAGE
		: clampPage(currentPage, totalPages);

	useEffect(() => {
		if (!entry) {
			setEntry(key, {
				page: defaultPage,
				size: defaultSize,
			});
			return;
		}

		if (
			entry.page !== normalizedCurrentPage ||
			(isAll && entry.page !== DEFAULT_SERVICE_PAGE)
		) {
			setEntry(key, {
				page: normalizedCurrentPage,
				size: pageSize,
			});
		}
	}, [
		defaultPage,
		defaultSize,
		entry,
		isAll,
		key,
		normalizedCurrentPage,
		pageSize,
		setEntry,
	]);

	const setCurrentPage = useCallback(
		(page: number) => {
			setEntry(key, {
				page: isAll
					? DEFAULT_SERVICE_PAGE
					: Math.max(page, DEFAULT_SERVICE_PAGE),
				size: pageSize,
			});
		},
		[isAll, key, pageSize, setEntry],
	);

	const setPageSize = useCallback(
		(size: ServicePageSizeOption) => {
			setEntry(key, {
				page: DEFAULT_SERVICE_PAGE,
				size,
			});
		},
		[key, setEntry],
	);

	const resetPage = useCallback(() => {
		setEntry(key, {
			page: DEFAULT_SERVICE_PAGE,
			size: pageSize,
		});
	}, [key, pageSize, setEntry]);

	const paginationState = useMemo(
		() => ({
			currentPage: normalizedCurrentPage,
			pageSize,
			isAll,
			backendPage: isAll ? null : normalizedCurrentPage - 1,
			backendSize: isAll ? null : Number(pageSize),
			totalPages,
			canGoToPreviousPage:
				!isAll && normalizedCurrentPage > DEFAULT_SERVICE_PAGE,
			canGoToNextPage: !isAll && normalizedCurrentPage < totalPages,
		}),
		[isAll, normalizedCurrentPage, pageSize, totalPages],
	);

	return {
		...paginationState,
		setCurrentPage,
		setPageSize,
		resetPage,
		goToFirstPage: () => {
			setCurrentPage(DEFAULT_SERVICE_PAGE);
		},
		goToPreviousPage: () => {
			setCurrentPage(normalizedCurrentPage - 1);
		},
		goToNextPage: () => {
			setCurrentPage(normalizedCurrentPage + 1);
		},
		goToLastPage: () => {
			setCurrentPage(totalPages);
		},
	};
}
