"use client";

import { useTranslation } from "react-i18next";

import * as web from "@/api/web";
import { WebApiError } from "@/api/web";
import {
	AccountDetailsContent,
	EntityDetailsContent,
	EntityPageShell,
	UserDetailsContent,
} from "@/components/composite";
import { NotFoundState, SomeErrorState } from "@/components/primitives";
import { getStaffDetailErrorToastContent } from "@/features/partner/staff/utils";
import { useQueryErrorToasts } from "@/hooks";
import type { StaffPageProps } from "@/types/client";

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
						<p className="ty-overhead">{t("common.linkedAccount.overhead")}</p>
						<AccountDetailsContent accountId={staff.account.id} />
					</div>

					<div className="grid gap-3">
						<p className="ty-overhead">{t("common.linkedUser.overhead")}</p>
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
