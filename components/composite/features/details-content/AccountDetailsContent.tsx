"use client";

import { useMemo } from "react";

import type { TFunction } from "i18next";
import { useTranslation } from "react-i18next";

import { web } from "@/api";
import { WebApiError } from "@/api/web";
import { Badge, NotFoundState, SomeErrorState } from "@/components";
import {
	EntityPageFieldsGrid,
	EntityPageFieldsGridSkeleton,
	UserDetailsContent,
} from "@/components";
import { useQueryErrorToasts } from "@/hooks";
import type {
	AccountDetailsContentProps,
	AccountType,
	AccountTypeResponse,
} from "@/types";
import { getApiErrorToastContent } from "@/utils";

const { accounts: accountsApi } = web.identity;
const { useAccountDetailQuery } = accountsApi;

function getAccountTypeValue(accountType: AccountType | AccountTypeResponse) {
	return typeof accountType === "string"
		? accountType
		: accountType.accountType;
}

function getAccountTypeTone(accountType: AccountType | AccountTypeResponse) {
	switch (getAccountTypeValue(accountType)) {
		case "ADMIN":
			return "warning";
		case "PARTNER":
			return "info";
		case "FORMER_STUDENT":
			return "brand";
		default:
			return "neutral";
	}
}

function getAccountTypeLabel(
	t: TFunction,
	accountType: AccountType | AccountTypeResponse,
) {
	if (
		typeof accountType !== "string" &&
		accountType.accountTypeFormatted.trim()
	) {
		return accountType.accountTypeFormatted;
	}

	const accountTypeValue = getAccountTypeValue(accountType);
	const localized = t(
		`identity.accountPage.filters.accountType.options.${accountTypeValue}`,
	);

	if (
		!localized.includes("identity.accountPage.filters.accountType.options.")
	) {
		return localized;
	}

	return accountTypeValue
		.toLowerCase()
		.split("_")
		.map(segment => segment.charAt(0).toUpperCase() + segment.slice(1))
		.join(" ");
}

function getAccountDetailErrorToastContent(t: TFunction, error: unknown) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("identity.accountPage.feedback.detailError.title"),
		fallbackDescription: t(
			"identity.accountPage.feedback.detailError.description",
		),
	});
}

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
						<p className="ty-overhead">
							{t("identity.accountPage.dialog.linkedUser.overhead")}
						</p>
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
