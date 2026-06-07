"use client";

import { useQuery } from "@tanstack/react-query";

import { get as getAccount } from "@/api/web/identity/accounts";
import { get as getUser } from "@/api/web/identity/users";
import { buildAdminComplexSearchRequest } from "@/features/identity/admins/utils";
import type { AdminComplexSearchFilters } from "@/types";

import { get, getMe, search } from "./endpoints";
import { adminKeys as keys } from "./keys";

const ADMIN_DIRECTORY_SEARCH_PAGE_SIZE = 100;

export function useAdminsQuery(enabled = true) {
	return useQuery({
		queryKey: keys.directory(),
		queryFn: async () => {
			const admins = [];
			let page = 0;
			let totalPages = 1;

			while (page < totalPages) {
				const response = await search(
					{
						page,
						size: ADMIN_DIRECTORY_SEARCH_PAGE_SIZE,
					},
					{
						name: "",
						cpf: "",
						email: "",
						dateFrom: "",
						dateTo: "",
						activeOnly: false,
					},
				);

				admins.push(...response.content);
				totalPages = Math.max(response.totalPages, 1);
				page += 1;
			}

			return admins;
		},
		enabled,
	});
}

export function useAdminsSearchQuery(
	page: number,
	size: number,
	filters: AdminComplexSearchFilters,
	enabled = true,
) {
	const complexSearchRequest = buildAdminComplexSearchRequest(filters);
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

export function useAdminDetailQuery(id: string | null) {
	return useQuery({
		queryKey: id === null ? keys.idleDetail() : keys.detail(id),
		queryFn: () => get(id!),
		enabled: id !== null,
	});
}

export function useLinkedAdminAccountQuery(accountId: string | null) {
	return useQuery({
		queryKey:
			accountId === null
				? keys.idleLinkedAccount()
				: keys.linkedAccount(accountId),
		queryFn: () => getAccount(accountId!),
		enabled: accountId !== null,
	});
}

export function useLinkedAdminUserQuery(userId: string | null) {
	return useQuery({
		queryKey: userId === null ? keys.idleLinkedUser() : keys.linkedUser(userId),
		queryFn: () => getUser(userId!),
		enabled: userId !== null,
	});
}

export function useCurrentAdminQuery() {
	return useQuery({
		queryKey: keys.me(),
		queryFn: getMe,
	});
}
