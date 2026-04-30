"use client";

import { useQuery } from "@tanstack/react-query";

import { getMe } from "@/api/web/identity/users";

export const userQueryKeys = {
	all: ["identity", "user"] as const,
	me: () => [...userQueryKeys.all, "me"] as const,
};

export function useCurrentUserQuery() {
	return useQuery({
		queryKey: userQueryKeys.me(),
		queryFn: getMe,
	});
}
