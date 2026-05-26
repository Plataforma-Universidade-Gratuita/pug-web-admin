"use client";

import { useMemo } from "react";

import { useTranslation } from "react-i18next";

import { NotFoundState, SomeErrorState } from "@/components";
import { AccountDetailsContent } from "@/features/identity/accounts/account/AccountDetailsContent";
import { useAdminDetailQuery } from "@/features/identity/admins/queries";
import { getAdminDetailErrorToastContent } from "@/features/identity/admins/utils";
import {
	EntityPageFieldsGrid,
	EntityPageFieldsGridSkeleton,
	EntityPageShell,
} from "@/features/shared/entity-pages";
import { useQueryErrorToasts } from "@/hooks";
import type { AdminPageProps } from "@/types";
import { WebApiError } from "@/utils";

export function AdminPage({ adminId }: AdminPageProps) {
	const { t } = useTranslation();
	const adminDetailQuery = useAdminDetailQuery(adminId);

	useQueryErrorToasts([
		{
			key: `admin-detail-${adminId}`,
			error: adminDetailQuery.error,
			errorUpdatedAt: adminDetailQuery.errorUpdatedAt,
			getContent: error => getAdminDetailErrorToastContent(t, error),
			isError: adminDetailQuery.isError,
		},
	]);

	const admin = adminDetailQuery.data;
	const fields = useMemo(
		() =>
			admin
				? [
						{
							id: "userId",
							label: t("identity.adminPage.dialog.fields.userId"),
							value: admin.userId,
						},
						{
							id: "name",
							label: t("identity.adminPage.dialog.fields.name"),
							value: admin.userName,
						},
						{
							id: "email",
							label: t("identity.adminPage.dialog.fields.email"),
							value: admin.accountEmail,
						},
						{
							id: "campus",
							label: t("identity.adminPage.dialog.fields.campus"),
							value: admin.campus.campusFormatted,
						},
						{
							id: "grantedAt",
							label: t("identity.adminPage.dialog.fields.grantedAt"),
							value: admin.grantedAtFormatted,
						},
					]
				: [],
		[admin, t],
	);

	return (
		<EntityPageShell
			title={admin?.userName ?? t("identity.adminPage.dialog.titleFallback")}
			description={t("identity.adminPage.description")}
		>
			{adminDetailQuery.isError ? (
				adminDetailQuery.error instanceof WebApiError &&
				adminDetailQuery.error.status === 404 ? (
					<NotFoundState
						title={t("identity.adminPage.dialog.notFound.title")}
						description={t("identity.adminPage.dialog.notFound.description")}
					/>
				) : (
					<SomeErrorState
						title={t("identity.adminPage.dialog.error.title")}
						description={t("identity.adminPage.dialog.error.description")}
						onRefresh={() => {
							void adminDetailQuery.refetch();
						}}
					/>
				)
			) : admin ? (
				<div className="grid gap-6">
					<EntityPageFieldsGrid fields={fields} />
					<div className="grid gap-3">
						<p className="ty-overhead">
							{t("identity.adminPage.dialog.linkedAccount.overhead")}
						</p>
						<AccountDetailsContent accountId={admin.accountId} />
					</div>
				</div>
			) : adminDetailQuery.isLoading ? (
				<EntityPageFieldsGridSkeleton />
			) : (
				<NotFoundState title={t("identity.adminPage.dialog.notFound.title")} />
			)}
		</EntityPageShell>
	);
}
