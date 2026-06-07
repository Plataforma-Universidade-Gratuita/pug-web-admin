"use client";

import { useMemo } from "react";

import { useTranslation } from "react-i18next";

import * as web from "@/api/web";
import { WebApiError } from "@/api/web";
import {
	AccountDetailsContent,
	EntityPageFieldsGrid,
	EntityPageFieldsGridSkeleton,
	EntityPageShell,
} from "@/components/composite";
import { NotFoundState, SomeErrorState } from "@/components/primitives";
import {
	getAdminDetailErrorToastContent,
	getLinkedAdminUserErrorToastContent,
} from "@/features/identity/admins/utils";
import { useQueryErrorToasts } from "@/hooks";
import type { AdminPageProps } from "@/types/client";

const { admins: adminsApi } = web.identity;
const { useAdminDetailQuery, useLinkedAdminUserQuery } = adminsApi;

export function AdminPage({ adminId }: AdminPageProps) {
	const { t } = useTranslation();
	const adminDetailQuery = useAdminDetailQuery(adminId);
	const linkedUserQuery = useLinkedAdminUserQuery(
		adminDetailQuery.data?.accountResponse.userId ?? null,
	);

	useQueryErrorToasts([
		{
			key: `admin-detail-${adminId}`,
			error: adminDetailQuery.error,
			errorUpdatedAt: adminDetailQuery.errorUpdatedAt,
			getContent: error => getAdminDetailErrorToastContent(t, error),
			isError: adminDetailQuery.isError,
		},
		{
			key: `admin-detail-linked-user-${adminId}`,
			error: linkedUserQuery.error,
			errorUpdatedAt: linkedUserQuery.errorUpdatedAt,
			getContent: error => getLinkedAdminUserErrorToastContent(t, error),
			isError: linkedUserQuery.isError,
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
							value: admin.accountResponse.userId,
						},
						{
							id: "name",
							label: t("common.fields.name"),
							value: linkedUserQuery.data?.name ?? "-",
						},
						{
							id: "email",
							label: t("common.fields.email"),
							value: admin.accountResponse.email,
						},
						{
							id: "campus",
							label: t("common.fields.campus"),
							value: admin.campus.campusFormatted,
						},
						{
							id: "grantedAt",
							label: t("identity.adminPage.dialog.fields.grantedAt"),
							value: admin.grantedAtFormatted,
						},
					]
				: [],
		[admin, linkedUserQuery.data, t],
	);

	return (
		<EntityPageShell
			title={
				linkedUserQuery.data?.name ??
				t("identity.adminPage.dialog.titleFallback")
			}
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
			) : linkedUserQuery.isError ? (
				<SomeErrorState
					title={t("identity.adminPage.dialog.error.title")}
					description={t("identity.adminPage.dialog.error.description")}
					onRefresh={() => {
						void linkedUserQuery.refetch();
					}}
				/>
			) : admin ? (
				<div className="grid gap-6">
					<EntityPageFieldsGrid fields={fields} />
					<div className="grid gap-3">
						<p className="ty-overhead">{t("common.linkedAccount.overhead")}</p>
						<AccountDetailsContent accountId={admin.accountResponse.id} />
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
