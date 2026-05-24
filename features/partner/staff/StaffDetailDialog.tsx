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
import type { StaffDetailDialogProps } from "@/types/client/partner";
import { WebApiError } from "@/utils/web-api";

export function StaffDetailDialog({
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
	staff,
}: StaffDetailDialogProps) {
	const { t } = useTranslation();

	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
			isLoading={isLoading}
			loadingLabel={t("partner.staffPage.loading.detail")}
		>
			<DialogContent>
				<DialogHeader overhead={t("partner.staffPage.dialog.overhead")}>
					<DialogTitle>
						{staff?.userName ?? t("partner.staffPage.dialog.titleFallback")}
					</DialogTitle>
				</DialogHeader>
				<DialogBody className="grid justify-items-start gap-6">
					{isError ? (
						error instanceof WebApiError && error.status === 404 ? (
							<NotFoundState
								title={t("partner.staffPage.dialog.notFound.title")}
								description={t("partner.staffPage.dialog.notFound.description")}
							/>
						) : (
							<SomeErrorState
								title={t("partner.staffPage.dialog.error.title")}
								description={t("partner.staffPage.dialog.error.description")}
								onRefresh={onRefresh}
							/>
						)
					) : staff ? (
						<div className="grid w-full gap-6 lg:grid-cols-2 lg:gap-8">
							<div className="grid gap-4">
								<div className="grid gap-1">
									<p className="ty-helper">
										{t("partner.staffPage.dialog.fields.userId")}
									</p>
									<p className="ty-sm-semibold">{staff.userId}</p>
								</div>
								<div className="grid gap-1">
									<p className="ty-helper">
										{t("partner.staffPage.dialog.fields.name")}
									</p>
									<p className="ty-sm-semibold">{staff.userName}</p>
								</div>
								<div className="grid gap-1">
									<p className="ty-helper">
										{t("partner.staffPage.dialog.fields.email")}
									</p>
									<p className="ty-sm-semibold">{staff.accountEmail}</p>
								</div>
								<div className="grid gap-1">
									<p className="ty-helper">
										{t("partner.staffPage.dialog.fields.entity")}
									</p>
									<p className="ty-sm-semibold">{staff.entityName}</p>
								</div>
							</div>

							<div className="grid w-full content-start gap-6">
								<div className="grid gap-3">
									<p className="ty-overhead">
										{t("partner.staffPage.dialog.linkedAccount.overhead")}
									</p>
									<ServicePageLinkedAccountBlock
										account={linkedAccount}
										isLoading={linkedAccountIsLoading}
										isError={linkedAccountIsError}
										error={linkedAccountError}
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
										onRefresh={onLinkedAccountRefresh}
										activeLabels={{
											no: t("partner.staffPage.dialog.linkedAccount.active.no"),
											yes: t(
												"partner.staffPage.dialog.linkedAccount.active.yes",
											),
										}}
										fields={{
											active: t(
												"partner.staffPage.dialog.linkedAccount.fields.active",
											),
											id: t("partner.staffPage.dialog.linkedAccount.fields.id"),
											type: t(
												"partner.staffPage.dialog.linkedAccount.fields.type",
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
										{t("partner.staffPage.dialog.linkedUser.overhead")}
									</p>
									<ServicePageLinkedUserBlock
										user={linkedUser}
										isLoading={linkedUserIsLoading}
										isError={linkedUserIsError}
										error={linkedUserError}
										loadingLabel={t(
											"partner.staffPage.dialog.linkedUser.loading",
										)}
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
										onRefresh={onLinkedUserRefresh}
										fields={{
											cpf: t("partner.staffPage.dialog.linkedUser.fields.cpf"),
											id: t("partner.staffPage.dialog.linkedUser.fields.id"),
											name: t(
												"partner.staffPage.dialog.linkedUser.fields.name",
											),
										}}
									/>
								</div>
							</div>
						</div>
					) : (
						<NotFoundState
							title={t("partner.staffPage.dialog.notFound.title")}
						/>
					)}
				</DialogBody>
			</DialogContent>
		</Dialog>
	);
}
