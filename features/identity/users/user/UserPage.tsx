"use client";

import { useTranslation } from "react-i18next";

import { web } from "@/api";
import { UserDetailsContent } from "@/features/identity/users/user/UserDetailsContent";
import { EntityPageShell } from "@/features/shared/entity-pages";
import type { UserPageProps } from "@/types";

const { users: usersApi } = web.identity;
const { useUserDetailQuery } = usersApi;

export function UserPage({ userId }: UserPageProps) {
	const { t } = useTranslation();
	const userDetailQuery = useUserDetailQuery(userId);

	return (
		<EntityPageShell
			title={
				userDetailQuery.data?.name ??
				t("identity.userPage.dialog.titleFallback")
			}
			description={t("identity.userPage.description")}
		>
			<UserDetailsContent userId={userId} />
		</EntityPageShell>
	);
}
