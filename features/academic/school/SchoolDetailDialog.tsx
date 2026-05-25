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
import type { SchoolDetailDialogProps } from "@/types";
import { WebApiError } from "@/utils";

export function SchoolDetailDialog({
	error,
	isError,
	isLoading,
	onOpenChange,
	onRefresh,
	open,
	school,
}: SchoolDetailDialogProps) {
	const { t } = useTranslation();

	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
			isLoading={isLoading}
			loadingLabel={t("academic.schoolPage.loading.detail")}
		>
			<DialogContent>
				<DialogHeader overhead={t("academic.schoolPage.dialog.overhead")}>
					<DialogTitle>
						{school?.name ?? t("academic.schoolPage.dialog.titleFallback")}
					</DialogTitle>
				</DialogHeader>
				<DialogBody className="grid justify-items-start gap-6">
					{isError ? (
						error instanceof WebApiError && error.status === 404 ? (
							<NotFoundState
								title={t("academic.schoolPage.dialog.notFound.title")}
								description={t(
									"academic.schoolPage.dialog.notFound.description",
								)}
							/>
						) : (
							<SomeErrorState
								title={t("academic.schoolPage.dialog.error.title")}
								description={t("academic.schoolPage.dialog.error.description")}
								onRefresh={onRefresh}
							/>
						)
					) : school ? (
						<div className="grid w-full gap-6 lg:grid-cols-2 lg:gap-8">
							<div className="grid gap-4">
								<div className="grid gap-1">
									<p className="ty-helper">
										{t("academic.schoolPage.dialog.fields.name")}
									</p>
									<p className="ty-sm-semibold">{school.name}</p>
								</div>
								<div className="grid gap-1">
									<p className="ty-helper">
										{t("academic.schoolPage.dialog.fields.id")}
									</p>
									<p className="ty-sm-semibold">{school.id}</p>
								</div>
							</div>

							<div className="grid gap-4">
								<div className="grid gap-1">
									<p className="ty-helper">
										{t("academic.schoolPage.dialog.fields.createdAt")}
									</p>
									<p className="ty-sm-semibold">
										{school.auditInfo.createdAtFormatted}
									</p>
								</div>
								<div className="grid gap-1">
									<p className="ty-helper">
										{t("academic.schoolPage.dialog.fields.updatedAt")}
									</p>
									<p className="ty-sm-semibold">
										{school.auditInfo.updatedAtFormatted}
									</p>
								</div>
							</div>
						</div>
					) : (
						<NotFoundState
							title={t("academic.schoolPage.dialog.notFound.title")}
						/>
					)}
				</DialogBody>
			</DialogContent>
		</Dialog>
	);
}
