"use client";

import { useTranslation } from "react-i18next";

import {
	Dialog,
	DialogBody,
	DialogContent,
	DialogHeader,
	DialogTitle,
	NotFoundState,
	SomeErrorState,
} from "@/components";
import {
	getAccountTypeLabel,
	getAccountTypeTone,
} from "@/features/identity/account/utils";
import {
	ServicePageLinkedAccountBlock,
	ServicePageLinkedUserBlock,
} from "@/features/shared/service-pages";
import type { AdminDetailDialogProps } from "@/types";
import { WebApiError } from "@/utils";

export function AdminDetailDialog({
	admin,
	error,
	isError,
	isLoading,
	linkedAccount,
	linkedAccountError,
	linkedAccountIsError,
	linkedAccountIsLoading,
	linkedUser,
	linkedUserError,
	linkedUserIsError,
	linkedUserIsLoading,
	onLinkedAccountRefresh,
	onLinkedUserRefresh,
	onOpenChange,
	onRefresh,
	open,
}: AdminDetailDialogProps) {
	const { t } = useTranslation();

	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
			isLoading={isLoading}
			loadingLabel={t("identity.adminPage.loading.detail")}
		>
			<DialogContent>
				<DialogHeader overhead={t("identity.adminPage.dialog.overhead")}>
					<DialogTitle>
						{admin?.userName ?? t("identity.adminPage.dialog.titleFallback")}
					</DialogTitle>
				</DialogHeader>
				<DialogBody className="grid justify-items-start gap-6">
					{isError ? (
						error instanceof WebApiError && error.status === 404 ? (
							<NotFoundState
								title={t("identity.adminPage.dialog.notFound.title")}
								description={t(
									"identity.adminPage.dialog.notFound.description",
								)}
							/>
						) : (
							<SomeErrorState
								title={t("identity.adminPage.dialog.error.title")}
								description={t("identity.adminPage.dialog.error.description")}
								onRefresh={onRefresh}
							/>
						)
					) : admin ? (
						<div className="grid w-full gap-6 lg:grid-cols-2 lg:gap-8">
							<div className="grid gap-4">
								<div className="grid gap-1">
									<p className="ty-helper">
										{t("identity.adminPage.dialog.fields.userId")}
									</p>
									<p className="ty-sm-semibold">{admin.userId}</p>
								</div>
								<div className="grid gap-1">
									<p className="ty-helper">
										{t("identity.adminPage.dialog.fields.name")}
									</p>
									<p className="ty-sm-semibold">{admin.userName}</p>
								</div>
								<div className="grid gap-1">
									<p className="ty-helper">
										{t("identity.adminPage.dialog.fields.email")}
									</p>
									<p className="ty-sm-semibold">{admin.accountEmail}</p>
								</div>
								<div className="grid gap-1">
									<p className="ty-helper">
										{t("identity.adminPage.dialog.fields.campus")}
									</p>
									<p className="ty-sm-semibold">
										{admin.campus.campusFormatted}
									</p>
								</div>
								<div className="grid gap-1">
									<p className="ty-helper">
										{t("identity.adminPage.dialog.fields.grantedAt")}
									</p>
									<p className="ty-sm-semibold">{admin.grantedAtFormatted}</p>
								</div>
							</div>

							<div className="grid w-full content-start gap-6">
								<div className="grid gap-3">
									<p className="ty-overhead">
										{t("identity.adminPage.dialog.linkedAccount.overhead")}
									</p>
									<ServicePageLinkedAccountBlock
										account={linkedAccount}
										isLoading={linkedAccountIsLoading}
										isError={linkedAccountIsError}
										error={linkedAccountError}
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
										onRefresh={onLinkedAccountRefresh}
										activeLabels={{
											no: t(
												"identity.adminPage.dialog.linkedAccount.active.no",
											),
											yes: t(
												"identity.adminPage.dialog.linkedAccount.active.yes",
											),
										}}
										fields={{
											active: t(
												"identity.adminPage.dialog.linkedAccount.fields.active",
											),
											id: t(
												"identity.adminPage.dialog.linkedAccount.fields.id",
											),
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
										user={linkedUser}
										isLoading={linkedUserIsLoading}
										isError={linkedUserIsError}
										error={linkedUserError}
										loadingLabel={t(
											"identity.adminPage.dialog.linkedUser.loading",
										)}
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
										onRefresh={onLinkedUserRefresh}
										fields={{
											cpf: t("identity.adminPage.dialog.linkedUser.fields.cpf"),
											id: t("identity.adminPage.dialog.linkedUser.fields.id"),
											name: t(
												"identity.adminPage.dialog.linkedUser.fields.name",
											),
										}}
									/>
								</div>
							</div>
						</div>
					) : (
						<NotFoundState
							title={t("identity.adminPage.dialog.notFound.title")}
						/>
					)}
				</DialogBody>
			</DialogContent>
		</Dialog>
	);
}
