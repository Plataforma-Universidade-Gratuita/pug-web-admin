"use client";

import { useMemo } from "react";

import { useTranslation } from "react-i18next";

import { Badge, NotFoundState, SomeErrorState } from "@/components";
import {
	useAccountDetailQuery,
	useLinkedUserQuery,
} from "@/features/identity/accounts/queries";
import {
	getAccountTypeLabel,
	getAccountTypeTone,
	getAccountDetailErrorToastContent,
	getLinkedUserErrorToastContent,
} from "@/features/identity/accounts/utils";
import {
	EntityPageFieldsGrid,
	EntityPageFieldsGridSkeleton,
	EntityPageShell,
} from "@/features/shared/entity-pages";
import { ServicePageLinkedUserBlock } from "@/features/shared/service-pages";
import { useQueryErrorToasts } from "@/hooks";
import type { AccountPageProps } from "@/types";
import { WebApiError } from "@/utils";

export function AccountPage({ accountId }: AccountPageProps) {
	const { t } = useTranslation();
	const accountDetailQuery = useAccountDetailQuery(accountId);
	const linkedUserQuery = useLinkedUserQuery(
		accountDetailQuery.data?.userId ?? null,
	);

	useQueryErrorToasts([
		{
			key: `account-detail-${accountId}`,
			error: accountDetailQuery.error,
			errorUpdatedAt: accountDetailQuery.errorUpdatedAt,
			getContent: error => getAccountDetailErrorToastContent(t, error),
			isError: accountDetailQuery.isError,
		},
		{
			key: `account-linked-user-${accountId}`,
			error: linkedUserQuery.error,
			errorUpdatedAt: linkedUserQuery.errorUpdatedAt,
			getContent: error => getLinkedUserErrorToastContent(t, error),
			isError: linkedUserQuery.isError,
		},
	]);

	const account = accountDetailQuery.data;
	const fields = useMemo(
		() =>
			account
				? [
						{
							id: "id",
							label: t("identity.accountPage.dialog.fields.id"),
							value: account.id,
						},
						{
							id: "email",
							label: t("identity.accountPage.dialog.fields.email"),
							value: account.email,
						},
						{
							id: "accountType",
							label: t("identity.accountPage.dialog.fields.accountType"),
							value: (
								<Badge
									className="min-h-5 px-2 py-0.5"
									tone={getAccountTypeTone(account.accountType)}
									variant="primary"
								>
									{getAccountTypeLabel(t, account.accountType)}
								</Badge>
							),
						},
						{
							id: "active",
							label: t("identity.accountPage.dialog.fields.active"),
							value: (
								<Badge
									className="min-h-5 px-2 py-0.5"
									tone={account.active ? "success" : "danger"}
									variant="primary"
								>
									{account.active
										? t("identity.accountPage.dialog.active.yes")
										: t("identity.accountPage.dialog.active.no")}
								</Badge>
							),
						},
						{
							id: "createdAt",
							label: t("identity.accountPage.dialog.fields.createdAt"),
							value: account.auditInfo.createdAtFormatted,
						},
						{
							id: "updatedAt",
							label: t("identity.accountPage.dialog.fields.updatedAt"),
							value: account.auditInfo.updatedAtFormatted,
						},
					]
				: [],
		[account, t],
	);

	return (
		<EntityPageShell
			title={account?.email ?? t("identity.accountPage.dialog.titleFallback")}
			description={t("identity.accountPage.description")}
		>
			{accountDetailQuery.isError ? (
				accountDetailQuery.error instanceof WebApiError &&
				accountDetailQuery.error.status === 404 ? (
					<NotFoundState
						title={t("identity.accountPage.dialog.notFound.title")}
						description={t("identity.accountPage.dialog.notFound.description")}
					/>
				) : (
					<SomeErrorState
						title={t("identity.accountPage.dialog.error.title")}
						description={t("identity.accountPage.dialog.error.description")}
						onRefresh={() => {
							void accountDetailQuery.refetch();
						}}
					/>
				)
			) : account ? (
				<div className="grid gap-6">
					<EntityPageFieldsGrid fields={fields} />
					<div className="grid gap-3">
						<p className="ty-overhead">
							{t("identity.accountPage.dialog.linkedUser.overhead")}
						</p>
						<ServicePageLinkedUserBlock
							user={linkedUserQuery.data}
							isLoading={linkedUserQuery.isLoading}
							isError={linkedUserQuery.isError}
							error={linkedUserQuery.error}
							loadingLabel={t("identity.accountPage.dialog.linkedUser.loading")}
							notFoundTitle={t(
								"identity.accountPage.dialog.linkedUser.notFound.title",
							)}
							notFoundDescription={t(
								"identity.accountPage.dialog.linkedUser.notFound.description",
							)}
							errorTitle={t(
								"identity.accountPage.dialog.linkedUser.error.title",
							)}
							errorDescription={t(
								"identity.accountPage.dialog.linkedUser.error.description",
							)}
							emptyTitle={t(
								"identity.accountPage.dialog.linkedUser.notFound.title",
							)}
							onRefresh={() => {
								void linkedUserQuery.refetch();
							}}
							fields={{
								cpf: t("identity.accountPage.dialog.linkedUser.fields.cpf"),
								id: t("identity.accountPage.dialog.linkedUser.fields.id"),
								name: t("identity.accountPage.dialog.linkedUser.fields.name"),
							}}
						/>
					</div>
				</div>
			) : accountDetailQuery.isLoading ? (
				<EntityPageFieldsGridSkeleton />
			) : (
				<NotFoundState
					title={t("identity.accountPage.dialog.notFound.title")}
				/>
			)}
		</EntityPageShell>
	);
}
