"use client";

import { useQuery } from "@tanstack/react-query";

import { get as getAccount } from "@/api/web/identity/accounts";
import { get, getMe, list } from "@/api/web/identity/admins";
import { get as getUser } from "@/api/web/identity/users";

export const adminQueryKeys = {
	all: ["identity", "admin"] as const,
	list: () => [...adminQueryKeys.all, "list"] as const,
	detail: (id: string) => [...adminQueryKeys.all, "detail", id] as const,
	idleDetail: () => [...adminQueryKeys.all, "detail", "idle"] as const,
	linkedAccount: (id: string) =>
		[...adminQueryKeys.all, "linked-account", id] as const,
	idleLinkedAccount: () =>
		[...adminQueryKeys.all, "linked-account", "idle"] as const,
	linkedUser: (id: string) =>
		[...adminQueryKeys.all, "linked-user", id] as const,
	idleLinkedUser: () => [...adminQueryKeys.all, "linked-user", "idle"] as const,
	me: () => [...adminQueryKeys.all, "me"] as const,
};

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
