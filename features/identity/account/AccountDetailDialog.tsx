"use client";

import { useTranslation } from "react-i18next";

import {
	Badge,
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
import { ServicePageLinkedUserBlock } from "@/features/shared/service-pages";
import type { AccountDetailDialogProps } from "@/types/client/identity";
import { WebApiError } from "@/utils/web-api";

export function AccountDetailDialog({
	account,
	error,
	isError,
	isLoading,
	linkedUser,
	linkedUserError,
	linkedUserIsError,
	linkedUserIsLoading,
	onLinkedUserRefresh,
	onOpenChange,
	onRefresh,
	open,
}: AccountDetailDialogProps) {
	const { t } = useTranslation();

	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
			isLoading={isLoading}
			loadingLabel={t("identity.accountPage.loading.detail")}
		>
			<DialogContent>
				<DialogHeader overhead={t("identity.accountPage.dialog.overhead")}>
					<DialogTitle>
						{account?.email ?? t("identity.accountPage.dialog.titleFallback")}
					</DialogTitle>
				</DialogHeader>
				<DialogBody className="grid justify-items-start gap-6">
					{isError ? (
						error instanceof WebApiError && error.status === 404 ? (
							<NotFoundState
								title={t("identity.accountPage.dialog.notFound.title")}
								description={t(
									"identity.accountPage.dialog.notFound.description",
								)}
							/>
						) : (
							<SomeErrorState
								title={t("identity.accountPage.dialog.error.title")}
								description={t("identity.accountPage.dialog.error.description")}
								onRefresh={onRefresh}
							/>
						)
					) : account ? (
						<div className="grid w-full gap-6 lg:grid-cols-2 lg:gap-8">
							<div className="grid gap-4">
								<div className="grid gap-1">
									<p className="ty-helper">
										{t("identity.accountPage.dialog.fields.id")}
									</p>
									<p className="ty-sm-semibold">{account.id}</p>
								</div>
								<div className="grid gap-1">
									<p className="ty-helper">
										{t("identity.accountPage.dialog.fields.email")}
									</p>
									<p className="ty-sm-semibold">{account.email}</p>
								</div>
								<div className="grid gap-1">
									<p className="ty-helper">
										{t("identity.accountPage.dialog.fields.accountType")}
									</p>
									<div>
										<Badge
											className="min-h-5 px-2 py-0.5"
											tone={getAccountTypeTone(account.accountType)}
											variant="primary"
										>
											{getAccountTypeLabel(t, account.accountType)}
										</Badge>
									</div>
								</div>
								<div className="grid gap-1">
									<p className="ty-helper">
										{t("identity.accountPage.dialog.fields.active")}
									</p>
									<div>
										<Badge
											className="min-h-5 px-2 py-0.5"
											tone={account.active ? "success" : "danger"}
											variant="primary"
										>
											{account.active
												? t("identity.accountPage.dialog.active.yes")
												: t("identity.accountPage.dialog.active.no")}
										</Badge>
									</div>
								</div>
								<div className="grid gap-1">
									<p className="ty-helper">
										{t("identity.accountPage.dialog.fields.createdAt")}
									</p>
									<p className="ty-sm-semibold">
										{account.auditInfo.createdAtFormatted}
									</p>
								</div>
								<div className="grid gap-1">
									<p className="ty-helper">
										{t("identity.accountPage.dialog.fields.updatedAt")}
									</p>
									<p className="ty-sm-semibold">
										{account.auditInfo.updatedAtFormatted}
									</p>
								</div>
							</div>

							<div className="grid w-full content-start gap-3">
								<p className="ty-overhead">
									{t("identity.accountPage.dialog.linkedUser.overhead")}
								</p>
								<ServicePageLinkedUserBlock
									user={linkedUser}
									isLoading={linkedUserIsLoading}
									isError={linkedUserIsError}
									error={linkedUserError}
									loadingLabel={t(
										"identity.accountPage.dialog.linkedUser.loading",
									)}
									notFoundTitle={t(
										"identity.accountPage.dialog.linkedUser.notFound.title",
									)}
									notFoundDescription={t(
										"identity.accountPage.dialog.linkedUser.notFound.description",
									)}
									errorTitle={t(
										"identity.accountPage.dialog.linkedUser.error.title",
									)}
									errorDescription={t(
										"identity.accountPage.dialog.linkedUser.error.description",
									)}
									emptyTitle={t(
										"identity.accountPage.dialog.linkedUser.notFound.title",
									)}
									onRefresh={onLinkedUserRefresh}
									fields={{
										cpf: t("identity.accountPage.dialog.linkedUser.fields.cpf"),
										id: t("identity.accountPage.dialog.linkedUser.fields.id"),
										name: t(
											"identity.accountPage.dialog.linkedUser.fields.name",
										),
									}}
								/>
							</div>
						</div>
					) : (
						<NotFoundState
							title={t("identity.accountPage.dialog.notFound.title")}
						/>
					)}
				</DialogBody>
			</DialogContent>
		</Dialog>
	);
}
