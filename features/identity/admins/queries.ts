"use client";

import { useQuery } from "@tanstack/react-query";

import { get as getAccount } from "@/api/web/identity/accounts";
import { get, getMe, search } from "@/api/web/identity/admins";
import { get as getUser } from "@/api/web/identity/users";
import { adminQueryKeys } from "@/constants";
import type { AdminComplexSearchFilters } from "@/types";

import { buildAdminComplexSearchRequest } from "./utils";

export { adminQueryKeys };

const ADMIN_DIRECTORY_SEARCH_PAGE_SIZE = 100;

export function useAdminsQuery(enabled = true) {
	return useQuery({
		queryKey: adminQueryKeys.directory(),
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
		queryKey: adminQueryKeys.search(page, size, filtersKey),
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
		queryKey:
			id === null ? adminQueryKeys.idleDetail() : adminQueryKeys.detail(id),
		queryFn: () => get(id!),
		enabled: id !== null,
	});
}

export function useLinkedAdminAccountQuery(accountId: string | null) {
	return useQuery({
		queryKey:
			accountId === null
				? adminQueryKeys.idleLinkedAccount()
				: adminQueryKeys.linkedAccount(accountId),
		queryFn: () => getAccount(accountId!),
		enabled: accountId !== null,
	});
}

export function useLinkedAdminUserQuery(userId: string | null) {
	return useQuery({
		queryKey:
			userId === null
				? adminQueryKeys.idleLinkedUser()
				: adminQueryKeys.linkedUser(userId),
		queryFn: () => getUser(userId!),
		enabled: userId !== null,
	});
}

export function useCurrentAdminQuery() {
	return useQuery({
		queryKey: adminQueryKeys.me(),
		queryFn: getMe,
	});
}
