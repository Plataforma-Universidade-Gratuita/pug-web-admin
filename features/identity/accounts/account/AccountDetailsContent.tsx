"use client";

import { useMemo } from "react";

import { useTranslation } from "react-i18next";

import { Badge, NotFoundState, SomeErrorState } from "@/components";
import { useAccountDetailQuery } from "@/features/identity/accounts/queries";
import {
	getAccountDetailErrorToastContent,
	getAccountTypeLabel,
	getAccountTypeTone,
} from "@/features/identity/accounts/utils";
import { UserDetailsContent } from "@/features/identity/users/user/UserDetailsContent";
import {
	EntityPageFieldsGrid,
	EntityPageFieldsGridSkeleton,
} from "@/features/shared/entity-pages";
import { useQueryErrorToasts } from "@/hooks";
import type { AccountDetailsContentProps } from "@/types";
import { WebApiError } from "@/utils";

export function AccountDetailsContent({
	accountId,
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
				<div className="grid gap-3">
					<p className="ty-overhead">
						{t("identity.accountPage.dialog.linkedUser.overhead")}
					</p>
					<UserDetailsContent userId={account.userId} />
				</div>
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
