"use client";

import { useMemo } from "react";

import { useTranslation } from "react-i18next";

import * as web from "@/api/web";
import { WebApiError } from "@/api/web";
import {
	EntityPageFieldsGrid,
	EntityPageFieldsGridSkeleton,
} from "@/components/composite";
import { getUserDetailErrorToastContent } from "@/components/composite/features/details-content/utils";
import { NotFoundState, SomeErrorState } from "@/components/primitives";
import { useQueryErrorToasts } from "@/hooks";
import type { UserDetailsContentProps } from "@/types/client";

const { users: usersApi } = web.identity;
const { useUserDetailQuery } = usersApi;

export function UserDetailsContent({
	userId,
	columns = 3,
}: UserDetailsContentProps & {
	columns?: 2 | 3;
}) {
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
							label: t("common.fields.id"),
							value: user.id,
						},
						{
							id: "name",
							label: t("common.fields.name"),
							value: user.name,
						},
						{
							id: "cpf",
							label: t("common.fields.cpf"),
							value: user.cpfFormatted,
						},
						{
							id: "createdAt",
							label: t("common.fields.createdAt"),
							value: user.auditInfo.createdAtFormatted,
						},
						{
							id: "updatedAt",
							label: t("common.fields.updatedAt"),
							value: user.auditInfo.updatedAtFormatted,
						},
					]
				: [],
		[user, t],
	);

	if (userDetailQuery.isError) {
		return userDetailQuery.error instanceof WebApiError &&
			userDetailQuery.error.status === 404 ? (
			<NotFoundState
				title={t("common.notFound.title")}
				description={t("common.notFound.description")}
			/>
		) : (
			<SomeErrorState
				title={t("identity.userPage.dialog.error.title")}
				description={t("identity.userPage.dialog.error.description")}
				onRefresh={() => {
					void userDetailQuery.refetch();
				}}
			/>
		);
	}

	if (user) {
		return (
			<EntityPageFieldsGrid
				fields={fields}
				columns={columns}
			/>
		);
	}

	if (userDetailQuery.isLoading) {
		return <EntityPageFieldsGridSkeleton columns={columns} />;
	}

	return <NotFoundState title={t("common.notFound.title")} />;
}
