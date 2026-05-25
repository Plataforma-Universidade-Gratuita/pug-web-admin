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
import type { UserDetailDialogProps } from "@/types";
import { WebApiError } from "@/utils";

export function UserDetailDialog({
	error,
	isError,
	isLoading,
	onOpenChange,
	onRefresh,
	open,
	user,
}: UserDetailDialogProps) {
	const { t } = useTranslation();

	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
			isLoading={isLoading}
			loadingLabel={t("identity.userPage.loading.detail")}
		>
			<DialogContent>
				<DialogHeader overhead={t("identity.userPage.dialog.overhead")}>
					<DialogTitle>
						{user?.name ?? t("identity.userPage.dialog.titleFallback")}
					</DialogTitle>
				</DialogHeader>
				<DialogBody className="grid justify-items-start gap-4">
					{isError ? (
						error instanceof WebApiError && error.status === 404 ? (
							<NotFoundState
								title={t("identity.userPage.dialog.notFound.title")}
								description={t("identity.userPage.dialog.notFound.description")}
							/>
						) : (
							<SomeErrorState
								title={t("identity.userPage.dialog.error.title")}
								description={t("identity.userPage.dialog.error.description")}
								onRefresh={onRefresh}
							/>
						)
					) : user ? (
						<div className="grid gap-4">
							<div className="grid gap-1">
								<p className="ty-helper">
									{t("identity.userPage.dialog.fields.id")}
								</p>
								<p className="ty-sm-semibold">{user.id}</p>
							</div>
							<div className="grid gap-1">
								<p className="ty-helper">
									{t("identity.userPage.dialog.fields.name")}
								</p>
								<p className="ty-sm-semibold">{user.name}</p>
							</div>
							<div className="grid gap-1">
								<p className="ty-helper">
									{t("identity.userPage.dialog.fields.cpf")}
								</p>
								<p className="ty-sm-semibold">{user.cpfFormatted}</p>
							</div>
							<div className="grid gap-1">
								<p className="ty-helper">
									{t("identity.userPage.dialog.fields.createdAt")}
								</p>
								<p className="ty-sm-semibold">
									{user.auditInfo.createdAtFormatted}
								</p>
							</div>
							<div className="grid gap-1">
								<p className="ty-helper">
									{t("identity.userPage.dialog.fields.updatedAt")}
								</p>
								<p className="ty-sm-semibold">
									{user.auditInfo.updatedAtFormatted}
								</p>
							</div>
						</div>
					) : (
						<NotFoundState
							title={t("identity.userPage.dialog.notFound.title")}
						/>
					)}
				</DialogBody>
			</DialogContent>
		</Dialog>
	);
}
