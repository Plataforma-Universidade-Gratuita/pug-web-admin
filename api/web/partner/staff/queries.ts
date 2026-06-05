"use client";

import { useQuery } from "@tanstack/react-query";

import { get as getAccount } from "@/api/web/identity/accounts";
import { get as getUser } from "@/api/web/identity/users";
import { list as listEntities, listCities } from "@/api/web/partner/entities";
import { staffQueryKeys } from "@/constants";
import { buildStaffComplexSearchRequest } from "@/features/partner/staff/utils";
import type { StaffComplexSearchFilters } from "@/types";

import { get, list, search } from "./endpoints";

export { staffQueryKeys };

export function useStaffQuery(enabled = true) {
	return useQuery({
		queryKey: staffQueryKeys.list(),
		queryFn: () => list(),
		enabled,
	});
}

export function useStaffSearchQuery(
	page: number,
	size: number,
	filters: StaffComplexSearchFilters,
	enabled = true,
) {
	const complexSearchRequest = buildStaffComplexSearchRequest(filters);
	const filtersKey = JSON.stringify(complexSearchRequest);

	return useQuery({
		queryKey: staffQueryKeys.search(page, size, filtersKey),
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

export function useStaffDetailQuery(id: string | null) {
	return useQuery({
		queryKey:
			id === null ? staffQueryKeys.idleDetail() : staffQueryKeys.detail(id),
		queryFn: () => get(id!),
		enabled: id !== null,
	});
}

export function useLinkedStaffAccountQuery(accountId: string | null) {
	return useQuery({
		queryKey:
			accountId === null
				? staffQueryKeys.idleLinkedAccount()
				: staffQueryKeys.linkedAccount(accountId),
		queryFn: () => getAccount(accountId!),
		enabled: accountId !== null,
	});
}

export function useLinkedStaffUserQuery(userId: string | null) {
	return useQuery({
		queryKey:
			userId === null
				? staffQueryKeys.idleLinkedUser()
				: staffQueryKeys.linkedUser(userId),
		queryFn: () => getUser(userId!),
		enabled: userId !== null,
	});
}

export function useStaffCitiesQuery() {
	return useQuery({
		queryKey: staffQueryKeys.supportingCities(),
		queryFn: listCities,
	});
}

export function useStaffEntitiesQuery() {
	return useQuery({
		queryKey: staffQueryKeys.supportingEntities(),
		queryFn: () => listEntities(),
	});
}
