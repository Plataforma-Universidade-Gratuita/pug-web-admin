"use client";

import { useQuery } from "@tanstack/react-query";

import { get, getMe, list } from "@/api/web/identity/users";

export const userQueryKeys = {
	all: ["identity", "user"] as const,
	list: () => [...userQueryKeys.all, "list"] as const,
	detail: (id: string) => [...userQueryKeys.all, "detail", id] as const,
	idleDetail: () => [...userQueryKeys.all, "detail", "idle"] as const,
	me: () => [...userQueryKeys.all, "me"] as const,
};

export function useUsersQuery() {
	return useQuery({
		queryKey: userQueryKeys.list(),
		queryFn: () => list(),
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
