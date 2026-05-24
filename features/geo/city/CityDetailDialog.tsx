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
import type { CityDetailDialogProps } from "@/types/client/geo";
import { WebApiError } from "@/utils/web-api";

export function CityDetailDialog({
	city,
	error,
	isError,
	isLoading,
	onOpenChange,
	onRefresh,
	open,
}: CityDetailDialogProps) {
	const { t } = useTranslation();

	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
			isLoading={isLoading}
			loadingLabel={t("geo.cityPage.loading.detail")}
		>
			<DialogContent>
				<DialogHeader overhead={t("geo.cityPage.dialog.overhead")}>
					<DialogTitle>
						{city?.name ?? t("geo.cityPage.dialog.titleFallback")}
					</DialogTitle>
				</DialogHeader>
				<DialogBody className="grid justify-items-start gap-4">
					{isError ? (
						error instanceof WebApiError && error.status === 404 ? (
							<NotFoundState
								title={t("geo.cityPage.dialog.notFound.title")}
								description={t("geo.cityPage.dialog.notFound.description")}
							/>
						) : (
							<SomeErrorState
								title={t("geo.cityPage.dialog.error.title")}
								description={t("geo.cityPage.dialog.error.description")}
								onRefresh={onRefresh}
							/>
						)
					) : city ? (
						<div className="grid gap-4">
							<div className="grid gap-1">
								<p className="ty-helper">
									{t("geo.cityPage.dialog.fields.id")}
								</p>
								<p className="ty-sm-semibold">{city.id}</p>
							</div>
							<div className="grid gap-1">
								<p className="ty-helper">
									{t("geo.cityPage.dialog.fields.name")}
								</p>
								<p className="ty-sm-semibold">{city.name}</p>
							</div>
							<div className="grid gap-1">
								<p className="ty-helper">
									{t("geo.cityPage.dialog.fields.ibgeCode")}
								</p>
								<p className="ty-sm-semibold">{city.ibgeCode}</p>
							</div>
						</div>
					) : (
						<NotFoundState title={t("geo.cityPage.dialog.notFound.title")} />
					)}
				</DialogBody>
			</DialogContent>
		</Dialog>
	);
}
