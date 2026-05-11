"use client";

import { useQuery } from "@tanstack/react-query";

import { get, getMe, list } from "@/api/web/identity/accounts";
import { get as getUser } from "@/api/web/identity/users";

export const accountQueryKeys = {
	all: ["identity", "account"] as const,
	list: () => [...accountQueryKeys.all, "list"] as const,
	detail: (id: string) => [...accountQueryKeys.all, "detail", id] as const,
	idleDetail: () => [...accountQueryKeys.all, "detail", "idle"] as const,
	linkedUser: (id: string) =>
		[...accountQueryKeys.all, "linked-user", id] as const,
	idleLinkedUser: () =>
		[...accountQueryKeys.all, "linked-user", "idle"] as const,
	me: () => [...accountQueryKeys.all, "me"] as const,
};

export function useAccountsQuery() {
	return useQuery({
		queryKey: accountQueryKeys.list(),
		queryFn: () => list(),
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

export function useLinkedUserQuery(userId: string | null) {
	return useQuery({
		queryKey:
			userId === null
				? accountQueryKeys.idleLinkedUser()
				: accountQueryKeys.linkedUser(userId),
		queryFn: () => getUser(userId!),
		enabled: userId !== null,
	});
}

export function useCurrentAccountQuery() {
	return useQuery({
		queryKey: accountQueryKeys.me(),
		queryFn: getMe,
	});
}
