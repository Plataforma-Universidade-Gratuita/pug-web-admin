"use client";

import { useTranslation } from "react-i18next";

import { web } from "@/api";
import { WebApiError } from "@/api/web";
import { NotFoundState, SomeErrorState } from "@/components";
import { AccountDetailsContent } from "@/features/identity/accounts/account/AccountDetailsContent";
import { UserDetailsContent } from "@/features/identity/users/user/UserDetailsContent";
import { EntityDetailsContent } from "@/features/partner/entities/entity/EntityDetailsContent";
import { getStaffDetailErrorToastContent } from "@/features/partner/staff/utils";
import { EntityPageShell } from "@/features/shared/entity-pages";
import { useQueryErrorToasts } from "@/hooks";
import type { StaffPageProps } from "@/types";

const { staff: staffApi } = web.partner;
const { useStaffDetailQuery } = staffApi;

export function StaffPage({ staffId }: StaffPageProps) {
	const { t } = useTranslation();
	const staffDetailQuery = useStaffDetailQuery(staffId);

	useQueryErrorToasts([
		{
			key: `staff-detail-${staffId}`,
			error: staffDetailQuery.error,
			errorUpdatedAt: staffDetailQuery.errorUpdatedAt,
			getContent: error => getStaffDetailErrorToastContent(t, error),
			isError: staffDetailQuery.isError,
		},
	]);

	const staff = staffDetailQuery.data;

	return (
		<EntityPageShell
			title={t("partner.staffPage.dialog.titleFallback")}
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
					<div className="grid gap-3">
						<p className="ty-overhead">
							{t("partner.staffPage.dialog.linkedAccount.overhead")}
						</p>
						<AccountDetailsContent accountId={staff.account.id} />
					</div>

					<div className="grid gap-3">
						<p className="ty-overhead">
							{t("partner.staffPage.dialog.linkedUser.overhead")}
						</p>
						<UserDetailsContent userId={staff.account.userId} />
					</div>

					<div className="grid gap-3">
						<p className="ty-overhead">
							{t("partner.staffPage.dialog.entity.overhead")}
						</p>
						<EntityDetailsContent entityId={staff.entityId} />
					</div>
				</div>
			) : (
				<NotFoundState title={t("partner.staffPage.dialog.notFound.title")} />
			)}
		</EntityPageShell>
	);
}
