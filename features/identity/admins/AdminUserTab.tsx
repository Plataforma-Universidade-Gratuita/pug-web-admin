"use client";

import { useTranslation } from "react-i18next";

import { WebApiError } from "@/api/web";
import { NotFoundState, SomeErrorState } from "@/components/primitives";
import type { AdminUserTabProps } from "@/types/client";

export function AdminUserTab({
	admin,
	linkedUser,
	linkedUserError,
	onRefreshUser,
}: AdminUserTabProps) {
	const { t } = useTranslation();

	return (
		<div className="grid gap-4">
			<div className="grid gap-1">
				<p className="ty-helper">
					{t("identity.adminPage.update.fields.accountId")}
				</p>
				<p className="ty-sm-semibold">{admin.accountResponse.id}</p>
			</div>
			<div className="grid gap-1">
				<p className="ty-helper">
					{t("identity.adminPage.update.fields.userId")}
				</p>
				<p className="ty-sm-semibold">{admin.accountResponse.userId}</p>
			</div>

			{linkedUserError ? (
				linkedUserError instanceof WebApiError &&
				linkedUserError.status === 404 ? (
					<NotFoundState
						title={t("common.linkedUser.notFound.title")}
						description={t("common.linkedUser.notFound.description")}
					/>
				) : (
					<SomeErrorState
						title={t("common.linkedUser.error.title")}
						description={t("common.linkedUser.error.description")}
						onRefresh={onRefreshUser}
					/>
				)
			) : linkedUser ? (
				<>
					<div className="grid gap-1">
						<p className="ty-helper">{t("common.fields.name")}</p>
						<p className="ty-sm-semibold">{linkedUser.name}</p>
					</div>
					<div className="grid gap-1">
						<p className="ty-helper">{t("common.fields.cpf")}</p>
						<p className="ty-sm-semibold">{linkedUser.cpfFormatted}</p>
					</div>
				</>
			) : (
				<NotFoundState title={t("common.linkedUser.notFound.title")} />
			)}
		</div>
	);
}
