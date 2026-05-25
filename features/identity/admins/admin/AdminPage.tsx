"use client";

import { useMemo } from "react";

import { useTranslation } from "react-i18next";

import { NotFoundState, SomeErrorState } from "@/components";
import {
	getAccountTypeLabel,
	getAccountTypeTone,
} from "@/features/identity/accounts/utils";
import {
	useAdminDetailQuery,
	useLinkedAdminAccountQuery,
	useLinkedAdminUserQuery,
} from "@/features/identity/admins/queries";
import {
	getAdminDetailErrorToastContent,
	getLinkedAdminAccountErrorToastContent,
	getLinkedAdminUserErrorToastContent,
} from "@/features/identity/admins/utils";
import {
	EntityPageFieldsGrid,
	EntityPageFieldsGridSkeleton,
	EntityPageShell,
} from "@/features/shared/entity-pages";
import {
	ServicePageLinkedAccountBlock,
	ServicePageLinkedUserBlock,
} from "@/features/shared/service-pages";
import { useQueryErrorToasts } from "@/hooks";
import type { AdminPageProps } from "@/types";
import { WebApiError } from "@/utils";

export function AdminPage({ adminId }: AdminPageProps) {
	const { t } = useTranslation();
	const adminDetailQuery = useAdminDetailQuery(adminId);
	const linkedAccountQuery = useLinkedAdminAccountQuery(
		adminDetailQuery.data?.accountId ?? null,
	);
	const linkedUserQuery = useLinkedAdminUserQuery(
		adminDetailQuery.data?.userId ?? null,
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
			key: `admin-linked-account-${adminId}`,
			error: linkedAccountQuery.error,
			errorUpdatedAt: linkedAccountQuery.errorUpdatedAt,
			getContent: error => getLinkedAdminAccountErrorToastContent(t, error),
			isError: linkedAccountQuery.isError,
		},
		{
			key: `admin-linked-user-${adminId}`,
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
					<div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
						<div className="grid gap-3">
							<p className="ty-overhead">
								{t("identity.adminPage.dialog.linkedAccount.overhead")}
							</p>
							<ServicePageLinkedAccountBlock
								account={linkedAccountQuery.data}
								isLoading={linkedAccountQuery.isLoading}
								isError={linkedAccountQuery.isError}
								error={linkedAccountQuery.error}
								loadingLabel={t(
									"identity.adminPage.dialog.linkedAccount.loading",
								)}
								notFoundTitle={t(
									"identity.adminPage.dialog.linkedAccount.notFound.title",
								)}
								notFoundDescription={t(
									"identity.adminPage.dialog.linkedAccount.notFound.description",
								)}
								errorTitle={t(
									"identity.adminPage.dialog.linkedAccount.error.title",
								)}
								errorDescription={t(
									"identity.adminPage.dialog.linkedAccount.error.description",
								)}
								emptyTitle={t(
									"identity.adminPage.dialog.linkedAccount.notFound.title",
								)}
								onRefresh={() => {
									void linkedAccountQuery.refetch();
								}}
								activeLabels={{
									no: t("identity.adminPage.dialog.linkedAccount.active.no"),
									yes: t("identity.adminPage.dialog.linkedAccount.active.yes"),
								}}
								fields={{
									active: t(
										"identity.adminPage.dialog.linkedAccount.fields.active",
									),
									id: t("identity.adminPage.dialog.linkedAccount.fields.id"),
									type: t(
										"identity.adminPage.dialog.linkedAccount.fields.type",
									),
								}}
								renderAccountTypeLabel={accountType =>
									getAccountTypeLabel(t, accountType)
								}
								renderAccountTypeTone={getAccountTypeTone}
							/>
						</div>

						<div className="grid gap-3">
							<p className="ty-overhead">
								{t("identity.adminPage.dialog.linkedUser.overhead")}
							</p>
							<ServicePageLinkedUserBlock
								user={linkedUserQuery.data}
								isLoading={linkedUserQuery.isLoading}
								isError={linkedUserQuery.isError}
								error={linkedUserQuery.error}
								loadingLabel={t("identity.adminPage.dialog.linkedUser.loading")}
								notFoundTitle={t(
									"identity.adminPage.dialog.linkedUser.notFound.title",
								)}
								notFoundDescription={t(
									"identity.adminPage.dialog.linkedUser.notFound.description",
								)}
								errorTitle={t(
									"identity.adminPage.dialog.linkedUser.error.title",
								)}
								errorDescription={t(
									"identity.adminPage.dialog.linkedUser.error.description",
								)}
								emptyTitle={t(
									"identity.adminPage.dialog.linkedUser.notFound.title",
								)}
								onRefresh={() => {
									void linkedUserQuery.refetch();
								}}
								fields={{
									cpf: t("identity.adminPage.dialog.linkedUser.fields.cpf"),
									id: t("identity.adminPage.dialog.linkedUser.fields.id"),
									name: t("identity.adminPage.dialog.linkedUser.fields.name"),
								}}
							/>
						</div>
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
