"use client";

import { useQuery } from "@tanstack/react-query";

import * as identity from "@/api/web/identity";
import { buildStaffComplexSearchRequest } from "@/features/partner/staff/utils";
import type { StaffComplexSearchFilters } from "@/types";

import * as entities from "../entities";
import { get, list, search } from "./endpoints";
import { staffKeys as keys } from "./keys";

const { accounts, users } = identity;
const { get: getAccount } = accounts;
const { list: listEntities, listCities } = entities;
const { get: getUser } = users;

export function useStaffQuery(enabled = true) {
	return useQuery({
		queryKey: keys.list(),
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

export function useStaffDetailQuery(id: string | null) {
	return useQuery({
		queryKey: id === null ? keys.idleDetail() : keys.detail(id),
		queryFn: () => get(id!),
		enabled: id !== null,
	});
}

export function useLinkedStaffAccountQuery(accountId: string | null) {
	return useQuery({
		queryKey:
			accountId === null
				? keys.idleLinkedAccount()
				: keys.linkedAccount(accountId),
		queryFn: () => getAccount(accountId!),
		enabled: accountId !== null,
	});
}

export function useLinkedStaffUserQuery(userId: string | null) {
	return useQuery({
		queryKey: userId === null ? keys.idleLinkedUser() : keys.linkedUser(userId),
		queryFn: () => getUser(userId!),
		enabled: userId !== null,
	});
}

export function useStaffCitiesQuery() {
	return useQuery({
		queryKey: keys.supportingCities(),
		queryFn: listCities,
	});
}

export function useStaffEntitiesQuery() {
	return useQuery({
		queryKey: keys.supportingEntities(),
		queryFn: () => listEntities(),
	});
}
