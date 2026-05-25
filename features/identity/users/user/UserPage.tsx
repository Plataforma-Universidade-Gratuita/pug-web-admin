"use client";

import { useMemo } from "react";

import { useTranslation } from "react-i18next";

import { NotFoundState, SomeErrorState } from "@/components";
import { useUserDetailQuery } from "@/features/identity/users/queries";
import { getUserDetailErrorToastContent } from "@/features/identity/users/utils";
import {
	EntityPageFieldsGrid,
	EntityPageFieldsGridSkeleton,
	EntityPageShell,
} from "@/features/shared/entity-pages";
import { useQueryErrorToasts } from "@/hooks";
import type { UserPageProps } from "@/types";
import { WebApiError } from "@/utils";

export function UserPage({ userId }: UserPageProps) {
	const { t } = useTranslation();
	const userDetailQuery = useUserDetailQuery(userId);

	useQueryErrorToasts([
		{
			key: `user-detail-${userId}`,
			error: userDetailQuery.error,
			errorUpdatedAt: userDetailQuery.errorUpdatedAt,
			getContent: error => getUserDetailErrorToastContent(t, error),
			isError: userDetailQuery.isError,
		},
	]);

	const user = userDetailQuery.data;
	const fields = useMemo(
		() =>
			user
				? [
						{
							id: "id",
							label: t("identity.userPage.dialog.fields.id"),
							value: user.id,
						},
						{
							id: "name",
							label: t("identity.userPage.dialog.fields.name"),
							value: user.name,
						},
						{
							id: "cpf",
							label: t("identity.userPage.dialog.fields.cpf"),
							value: user.cpfFormatted,
						},
						{
							id: "createdAt",
							label: t("identity.userPage.dialog.fields.createdAt"),
							value: user.auditInfo.createdAtFormatted,
						},
						{
							id: "updatedAt",
							label: t("identity.userPage.dialog.fields.updatedAt"),
							value: user.auditInfo.updatedAtFormatted,
						},
					]
				: [],
		[user, t],
	);

	return (
		<EntityPageShell
			title={user?.name ?? t("identity.userPage.dialog.titleFallback")}
			description={t("identity.userPage.description")}
		>
			{userDetailQuery.isError ? (
				userDetailQuery.error instanceof WebApiError &&
				userDetailQuery.error.status === 404 ? (
					<NotFoundState
						title={t("identity.userPage.dialog.notFound.title")}
						description={t("identity.userPage.dialog.notFound.description")}
					/>
				) : (
					<SomeErrorState
						title={t("identity.userPage.dialog.error.title")}
						description={t("identity.userPage.dialog.error.description")}
						onRefresh={() => {
							void userDetailQuery.refetch();
						}}
					/>
				)
			) : user ? (
				<EntityPageFieldsGrid fields={fields} />
			) : userDetailQuery.isLoading ? (
				<EntityPageFieldsGridSkeleton />
			) : (
				<NotFoundState title={t("identity.userPage.dialog.notFound.title")} />
			)}
		</EntityPageShell>
	);
}
