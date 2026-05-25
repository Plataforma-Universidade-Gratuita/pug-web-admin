"use client";

import { useMemo } from "react";

import { useTranslation } from "react-i18next";

import { NotFoundState, SomeErrorState } from "@/components";
import {
	getAccountTypeLabel,
	getAccountTypeTone,
} from "@/features/identity/accounts/utils";
import {
	useLinkedStaffAccountQuery,
	useLinkedStaffUserQuery,
	useStaffDetailQuery,
} from "@/features/partner/staff/queries";
import {
	getLinkedStaffAccountErrorToastContent,
	getLinkedStaffUserErrorToastContent,
	getStaffDetailErrorToastContent,
} from "@/features/partner/staff/utils";
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
import type { StaffPageProps } from "@/types";
import { WebApiError } from "@/utils";

export function StaffPage({ staffId }: StaffPageProps) {
	const { t } = useTranslation();
	const staffDetailQuery = useStaffDetailQuery(staffId);
	const linkedAccountQuery = useLinkedStaffAccountQuery(
		staffDetailQuery.data?.accountId ?? null,
	);
	const linkedUserQuery = useLinkedStaffUserQuery(
		staffDetailQuery.data?.userId ?? null,
	);

	useQueryErrorToasts([
		{
			key: `staff-detail-${staffId}`,
			error: staffDetailQuery.error,
			errorUpdatedAt: staffDetailQuery.errorUpdatedAt,
			getContent: error => getStaffDetailErrorToastContent(t, error),
			isError: staffDetailQuery.isError,
		},
		{
			key: `staff-linked-account-${staffId}`,
			error: linkedAccountQuery.error,
			errorUpdatedAt: linkedAccountQuery.errorUpdatedAt,
			getContent: error => getLinkedStaffAccountErrorToastContent(t, error),
			isError: linkedAccountQuery.isError,
		},
		{
			key: `staff-linked-user-${staffId}`,
			error: linkedUserQuery.error,
			errorUpdatedAt: linkedUserQuery.errorUpdatedAt,
			getContent: error => getLinkedStaffUserErrorToastContent(t, error),
			isError: linkedUserQuery.isError,
		},
	]);

	const staff = staffDetailQuery.data;
	const fields = useMemo(
		() =>
			staff
				? [
						{
							id: "userId",
							label: t("partner.staffPage.dialog.fields.userId"),
							value: staff.userId,
						},
						{
							id: "name",
							label: t("partner.staffPage.dialog.fields.name"),
							value: staff.userName,
						},
						{
							id: "email",
							label: t("partner.staffPage.dialog.fields.email"),
							value: staff.accountEmail,
						},
						{
							id: "entity",
							label: t("partner.staffPage.dialog.fields.entity"),
							value: staff.entityName,
						},
					]
				: [],
		[staff, t],
	);

	return (
		<EntityPageShell
			title={staff?.userName ?? t("partner.staffPage.dialog.titleFallback")}
			description={t("partner.staffPage.description")}
		>
			{staffDetailQuery.isError ? (
				staffDetailQuery.error instanceof WebApiError &&
				staffDetailQuery.error.status === 404 ? (
					<NotFoundState
						title={t("partner.staffPage.dialog.notFound.title")}
						description={t("partner.staffPage.dialog.notFound.description")}
					/>
				) : (
					<SomeErrorState
						title={t("partner.staffPage.dialog.error.title")}
						description={t("partner.staffPage.dialog.error.description")}
						onRefresh={() => {
							void staffDetailQuery.refetch();
						}}
					/>
				)
			) : staff ? (
				<div className="grid gap-6">
					<EntityPageFieldsGrid fields={fields} />

					<div className="grid gap-6 lg:grid-cols-2">
						<div className="grid gap-3">
							<p className="ty-overhead">
								{t("partner.staffPage.dialog.linkedAccount.overhead")}
							</p>
							<ServicePageLinkedAccountBlock
								account={linkedAccountQuery.data}
								isLoading={linkedAccountQuery.isLoading}
								isError={linkedAccountQuery.isError}
								error={linkedAccountQuery.error}
								loadingLabel={t(
									"partner.staffPage.dialog.linkedAccount.loading",
								)}
								notFoundTitle={t(
									"partner.staffPage.dialog.linkedAccount.notFound.title",
								)}
								notFoundDescription={t(
									"partner.staffPage.dialog.linkedAccount.notFound.description",
								)}
								errorTitle={t(
									"partner.staffPage.dialog.linkedAccount.error.title",
								)}
								errorDescription={t(
									"partner.staffPage.dialog.linkedAccount.error.description",
								)}
								emptyTitle={t(
									"partner.staffPage.dialog.linkedAccount.notFound.title",
								)}
								onRefresh={() => {
									void linkedAccountQuery.refetch();
								}}
								activeLabels={{
									no: t("partner.staffPage.dialog.linkedAccount.active.no"),
									yes: t("partner.staffPage.dialog.linkedAccount.active.yes"),
								}}
								fields={{
									active: t(
										"partner.staffPage.dialog.linkedAccount.fields.active",
									),
									id: t("partner.staffPage.dialog.linkedAccount.fields.id"),
									type: t("partner.staffPage.dialog.linkedAccount.fields.type"),
								}}
								renderAccountTypeLabel={accountType =>
									getAccountTypeLabel(t, accountType)
								}
								renderAccountTypeTone={getAccountTypeTone}
							/>
						</div>

						<div className="grid gap-3">
							<p className="ty-overhead">
								{t("partner.staffPage.dialog.linkedUser.overhead")}
							</p>
							<ServicePageLinkedUserBlock
								user={linkedUserQuery.data}
								isLoading={linkedUserQuery.isLoading}
								isError={linkedUserQuery.isError}
								error={linkedUserQuery.error}
								loadingLabel={t("partner.staffPage.dialog.linkedUser.loading")}
								notFoundTitle={t(
									"partner.staffPage.dialog.linkedUser.notFound.title",
								)}
								notFoundDescription={t(
									"partner.staffPage.dialog.linkedUser.notFound.description",
								)}
								errorTitle={t(
									"partner.staffPage.dialog.linkedUser.error.title",
								)}
								errorDescription={t(
									"partner.staffPage.dialog.linkedUser.error.description",
								)}
								emptyTitle={t(
									"partner.staffPage.dialog.linkedUser.notFound.title",
								)}
								onRefresh={() => {
									void linkedUserQuery.refetch();
								}}
								fields={{
									cpf: t("partner.staffPage.dialog.linkedUser.fields.cpf"),
									id: t("partner.staffPage.dialog.linkedUser.fields.id"),
									name: t("partner.staffPage.dialog.linkedUser.fields.name"),
								}}
							/>
						</div>
					</div>
				</div>
			) : staffDetailQuery.isLoading ? (
				<EntityPageFieldsGridSkeleton />
			) : (
				<NotFoundState title={t("partner.staffPage.dialog.notFound.title")} />
			)}
		</EntityPageShell>
	);
}
