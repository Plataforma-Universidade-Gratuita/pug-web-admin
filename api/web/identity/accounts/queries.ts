"use client";

import { useQuery } from "@tanstack/react-query";

import { accounts } from "@/api/web";
import { buildAccountComplexSearchRequest } from "@/features/identity/accounts/utils";
import type { AccountComplexSearchFilters } from "@/types";

const { get, getMe, list, search, accountKeys: keys } = accounts;

export function useAccountsQuery(enabled = true) {
	return useQuery({
		queryKey: keys.list(),
		queryFn: () => list(),
		enabled,
	});
}

export function useAccountsSearchQuery(
	page: number,
	size: number,
	filters: AccountComplexSearchFilters,
	enabled = true,
) {
	const complexSearchRequest = buildAccountComplexSearchRequest(filters);
	const filtersKey = JSON.stringify(complexSearchRequest);

	return useQuery({
		queryKey: keys.search(page, size, filtersKey),
		queryFn: () =>
			search(
				{
					page,
					size,
				},
				complexSearchRequest,
			),
		enabled,
	});
}

export function useAccountDetailQuery(id: string | null) {
	return useQuery({
		queryKey: id === null ? keys.idleDetail() : keys.detail(id),
		queryFn: () => get(id!),
		enabled: id !== null,
	});
}

export function useCurrentAccountQuery() {
	return useQuery({
		queryKey: keys.me(),
		queryFn: getMe,
	});
}
