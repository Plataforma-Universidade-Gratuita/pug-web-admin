"use client";

import { useQuery } from "@tanstack/react-query";

import { getMe } from "@/api/web/identity/accounts";

export const accountQueryKeys = {
	all: ["identity", "account"] as const,
	me: () => [...accountQueryKeys.all, "me"] as const,
};

export function useCurrentAccountQuery() {
	return useQuery({
		queryKey: accountQueryKeys.me(),
		queryFn: getMe,
	});
}
