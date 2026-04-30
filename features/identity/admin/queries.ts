"use client";

import { useQuery } from "@tanstack/react-query";

import { getMe } from "@/api/web/identity/admins";

export const adminQueryKeys = {
	all: ["identity", "admin"] as const,
	me: () => [...adminQueryKeys.all, "me"] as const,
};

export function useCurrentAdminQuery() {
	return useQuery({
		queryKey: adminQueryKeys.me(),
		queryFn: getMe,
	});
}
