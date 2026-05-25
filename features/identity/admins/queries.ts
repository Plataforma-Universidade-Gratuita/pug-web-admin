"use client";

import { useQuery } from "@tanstack/react-query";

import { get as getAccount } from "@/api/web/identity/accounts";
import { get, getMe, list } from "@/api/web/identity/admins";
import { get as getUser } from "@/api/web/identity/users";
import { adminQueryKeys } from "@/constants";

export { adminQueryKeys };

export function useAdminsQuery() {
	return useQuery({
		queryKey: adminQueryKeys.list(),
		queryFn: () => list(),
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
