"use client";

import { useQuery } from "@tanstack/react-query";

import { userQueryKeys } from "@/constants/query-keys";

import { get, getMe, list } from "@/api/web/identity/users";

export { userQueryKeys };

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
