"use client";

import { useQuery } from "@tanstack/react-query";

import { accountQueryKeys } from "@/constants";
import { buildAccountComplexSearchRequest } from "@/features/identity/accounts/utils";
import type { AccountComplexSearchFilters } from "@/types";

import { get, getMe, list, search } from "./endpoints";

export { accountQueryKeys };

export function useAccountsQuery(enabled = true) {
	return useQuery({
		queryKey: accountQueryKeys.list(),
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
		queryKey: accountQueryKeys.search(page, size, filtersKey),
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
		queryKey:
			id === null ? accountQueryKeys.idleDetail() : accountQueryKeys.detail(id),
		queryFn: () => get(id!),
		enabled: id !== null,
	});
}

export function useCurrentAccountQuery() {
	return useQuery({
		queryKey: accountQueryKeys.me(),
		queryFn: getMe,
	});
}
