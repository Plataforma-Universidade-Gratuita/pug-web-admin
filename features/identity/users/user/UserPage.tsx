"use client";

import { useTranslation } from "react-i18next";

import * as web from "@/api/web";
import { EntityPageShell, UserDetailsContent } from "@/components/composite";
import type { UserPageProps } from "@/types/client";

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
