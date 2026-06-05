"use client";

import { useQuery } from "@tanstack/react-query";

import { userQueryKeys } from "@/constants";
import { buildUserComplexSearchRequest } from "@/features/identity/users/utils";
import type { UserComplexSearchFilters } from "@/types";

import { get, getMe, list, search } from "./endpoints";

export { userQueryKeys };

export function useUsersQuery(enabled = true) {
	return useQuery({
		queryKey: userQueryKeys.list(),
		queryFn: () => list(),
		enabled,
	});
}

export function useUsersSearchQuery(
	page: number,
	size: number,
	filters: UserComplexSearchFilters,
	enabled = true,
) {
	const complexSearchRequest = buildUserComplexSearchRequest(filters);
	const filtersKey = JSON.stringify(complexSearchRequest);

	return useQuery({
		queryKey: userQueryKeys.search(page, size, filtersKey),
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

export function useUserDetailQuery(id: string | null) {
	return useQuery({
		queryKey:
			id === null ? userQueryKeys.idleDetail() : userQueryKeys.detail(id),
		queryFn: () => get(id!),
		enabled: id !== null,
	});
}

export function useCurrentUserQuery() {
	return useQuery({
		queryKey: userQueryKeys.me(),
		queryFn: getMe,
	});
}
