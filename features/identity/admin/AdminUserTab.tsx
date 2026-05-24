"use client";

import { useTranslation } from "react-i18next";

import { NotFoundState, SomeErrorState, TabsContent } from "@/components";
import type { AdminUserTabProps } from "@/types/client/identity";
import { WebApiError } from "@/utils/web-api";

export function AdminUserTab({
	admin,
	linkedUser,
	linkedUserError,
	onRefreshUser,
}: AdminUserTabProps) {
	const { t } = useTranslation();

	return (
		<TabsContent
			value="user"
			className="grid gap-4 pt-4"
		>
			<div className="grid gap-1">
				<p className="ty-helper">
					{t("identity.adminPage.update.fields.accountId")}
				</p>
				<p className="ty-sm-semibold">{admin.accountId}</p>
			</div>
			<div className="grid gap-1">
				<p className="ty-helper">
					{t("identity.adminPage.update.fields.userId")}
				</p>
				<p className="ty-sm-semibold">{admin.userId}</p>
			</div>

			{linkedUserError ? (
				linkedUserError instanceof WebApiError &&
				linkedUserError.status === 404 ? (
					<NotFoundState
						title={t("identity.adminPage.dialog.linkedUser.notFound.title")}
						description={t(
							"identity.adminPage.dialog.linkedUser.notFound.description",
						)}
					/>
				) : (
					<SomeErrorState
						title={t("identity.adminPage.dialog.linkedUser.error.title")}
						description={t(
							"identity.adminPage.dialog.linkedUser.error.description",
						)}
						onRefresh={onRefreshUser}
					/>
				)
			) : linkedUser ? (
				<>
					<div className="grid gap-1">
						<p className="ty-helper">
							{t("identity.adminPage.update.fields.userName")}
						</p>
						<p className="ty-sm-semibold">{linkedUser.name}</p>
					</div>
					<div className="grid gap-1">
						<p className="ty-helper">
							{t("identity.adminPage.update.fields.cpf")}
						</p>
						<p className="ty-sm-semibold">{linkedUser.cpfFormatted}</p>
					</div>
				</>
			) : (
				<NotFoundState
					title={t("identity.adminPage.dialog.linkedUser.notFound.title")}
				/>
			)}
		</TabsContent>
	);
}
