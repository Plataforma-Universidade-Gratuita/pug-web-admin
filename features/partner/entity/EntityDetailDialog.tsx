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
import { resolveEntityCityLabel } from "@/features/partner/entity/utils";
import type { EntityDetailDialogProps } from "@/types/client/partner";
import { WebApiError } from "@/utils/web-api";

export function EntityDetailDialog({
	cityById,
	entity,
	error,
	isError,
	isLoading,
	onOpenChange,
	onRefresh,
	open,
}: EntityDetailDialogProps) {
	const { t } = useTranslation();

	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
			isLoading={isLoading}
			loadingLabel={t("partner.entityPage.loading.detail")}
		>
			<DialogContent>
				<DialogHeader overhead={t("partner.entityPage.dialog.overhead")}>
					<DialogTitle>
						{entity?.name ?? t("partner.entityPage.dialog.titleFallback")}
					</DialogTitle>
				</DialogHeader>
				<DialogBody className="grid justify-items-start gap-6">
					{isError ? (
						error instanceof WebApiError && error.status === 404 ? (
							<NotFoundState
								title={t("partner.entityPage.dialog.notFound.title")}
								description={t(
									"partner.entityPage.dialog.notFound.description",
								)}
							/>
						) : (
							<SomeErrorState
								title={t("partner.entityPage.dialog.error.title")}
								description={t("partner.entityPage.dialog.error.description")}
								onRefresh={onRefresh}
							/>
						)
					) : entity ? (
						<div className="grid w-full gap-6 lg:grid-cols-2 lg:gap-8">
							<div className="grid gap-4">
								<div className="grid gap-1">
									<p className="ty-helper">
										{t("partner.entityPage.dialog.fields.name")}
									</p>
									<p className="ty-sm-semibold">{entity.name}</p>
								</div>
								<div className="grid gap-1">
									<p className="ty-helper">
										{t("partner.entityPage.dialog.fields.cnpj")}
									</p>
									<p className="ty-sm-semibold">{entity.cnpjFormatted}</p>
								</div>
								<div className="grid gap-1">
									<p className="ty-helper">
										{t("partner.entityPage.dialog.fields.city")}
									</p>
									<p className="ty-sm-semibold">
										{resolveEntityCityLabel(cityById, entity.cityId)}
									</p>
								</div>
								<div className="grid gap-1">
									<p className="ty-helper">
										{t("partner.entityPage.dialog.fields.address")}
									</p>
									<p className="ty-sm-semibold">
										{entity.address ||
											t("partner.entityPage.dialog.values.noAddress")}
									</p>
								</div>
							</div>

							<div className="grid gap-4">
								<div className="grid gap-1">
									<p className="ty-helper">
										{t("partner.entityPage.dialog.fields.id")}
									</p>
									<p className="ty-sm-semibold">{entity.id}</p>
								</div>
								<div className="grid gap-1">
									<p className="ty-helper">
										{t("partner.entityPage.dialog.fields.createdAt")}
									</p>
									<p className="ty-sm-semibold">
										{entity.auditInfo.createdAtFormatted}
									</p>
								</div>
								<div className="grid gap-1">
									<p className="ty-helper">
										{t("partner.entityPage.dialog.fields.updatedAt")}
									</p>
									<p className="ty-sm-semibold">
										{entity.auditInfo.updatedAtFormatted}
									</p>
								</div>
							</div>
						</div>
					) : (
						<NotFoundState
							title={t("partner.entityPage.dialog.notFound.title")}
						/>
					)}
				</DialogBody>
			</DialogContent>
		</Dialog>
	);
}
