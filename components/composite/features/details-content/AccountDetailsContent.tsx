"use client";

import { useMemo } from "react";

import { useTranslation } from "react-i18next";

import * as web from "@/api/web";
import { WebApiError } from "@/api/web";
import {
	EntityPageFieldsGrid,
	EntityPageFieldsGridSkeleton,
	UserDetailsContent,
} from "@/components/composite";
import {
	getAccountDetailErrorToastContent,
	getAccountTypeLabel,
	getAccountTypeTone,
} from "@/components/composite/features/details-content/utils";
import { Badge, NotFoundState, SomeErrorState } from "@/components/primitives";
import { useQueryErrorToasts } from "@/hooks";
import type { AccountDetailsContentProps } from "@/types/client";

const { accounts: accountsApi } = web.identity;
const { useAccountDetailQuery } = accountsApi;

export function AccountDetailsContent({
	accountId,
	includeLinkedUser = true,
}: AccountDetailsContentProps) {
	const { t } = useTranslation();
	const accountDetailQuery = useAccountDetailQuery(accountId);

	useQueryErrorToasts([
		{
			key: `account-detail-${accountId}`,
			error: accountDetailQuery.error,
			errorUpdatedAt: accountDetailQuery.errorUpdatedAt,
			getContent: error => getAccountDetailErrorToastContent(t, error),
			isError: accountDetailQuery.isError,
		},
	]);

	const account = accountDetailQuery.data;
	const fields = useMemo(
		() =>
			account
				? [
						{
							id: "id",
							label: t("common.fields.id"),
							value: account.id,
						},
						{
							id: "email",
							label: t("common.fields.email"),
							value: account.email,
						},
						{
							id: "accountType",
							label: t("common.fields.accountType"),
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
							label: t("common.fields.active"),
							value: (
								<Badge
									className="min-h-5 px-2 py-0.5"
									tone={account.active ? "success" : "danger"}
									variant="primary"
								>
									{account.active
										? t("common.status.active")
										: t("common.status.inactive")}
								</Badge>
							),
						},
						{
							id: "createdAt",
							label: t("common.fields.createdAt"),
							value: account.auditInfo.createdAtFormatted,
						},
						{
							id: "updatedAt",
							label: t("common.fields.updatedAt"),
							value: account.auditInfo.updatedAtFormatted,
						},
					]
				: [],
		[account, t],
	);

	if (accountDetailQuery.isError) {
		return accountDetailQuery.error instanceof WebApiError &&
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
		);
	}

	if (account) {
		return (
			<div className="grid gap-6">
				<EntityPageFieldsGrid fields={fields} />
				{includeLinkedUser ? (
					<div className="grid gap-3">
						<p className="ty-overhead">{t("common.linkedUser.overhead")}</p>
						<UserDetailsContent userId={account.userId} />
					</div>
				) : null}
			</div>
		);
	}

	if (accountDetailQuery.isLoading) {
		return <EntityPageFieldsGridSkeleton />;
	}

	return (
		<NotFoundState title={t("identity.accountPage.dialog.notFound.title")} />
	);
}
