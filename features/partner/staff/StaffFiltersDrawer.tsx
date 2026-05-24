"use client";

import { useTranslation } from "react-i18next";

import {
	Combobox,
	Label,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SomeErrorState,
} from "@/components";
import { getStaffActiveOptionClassName } from "@/features/partner/staff/utils";
import { ServicePageFiltersDrawer } from "@/features/shared/service-pages";
import type {
	StaffActiveFilter,
	StaffFiltersDrawerProps,
} from "@/types/client/partner";

export function StaffFiltersDrawer({
	activeFilter,
	citiesError,
	cityIdFilter,
	cityOptions,
	entitiesError,
	entityIdFilter,
	entityOptions,
	hasActiveFilters,
	isCitiesLoading,
	isEntitiesLoading,
	onActiveFilterChange,
	onApply,
	onCityIdChange,
	onClear,
	onEntityIdChange,
	onOpenChange,
	onRefreshCities,
	onRefreshEntities,
	open,
}: StaffFiltersDrawerProps) {
	const { t } = useTranslation();

	return (
		<ServicePageFiltersDrawer
			open={open}
			onOpenChange={onOpenChange}
			hasActiveFilters={hasActiveFilters}
			label={t("partner.staffPage.filters.drawer.label")}
			activeLabel={t("partner.staffPage.filters.drawer.active")}
			triggerLabel={t("partner.staffPage.filters.drawer.trigger")}
			overhead={t("partner.staffPage.filters.drawer.overhead")}
			title={t("partner.staffPage.filters.drawer.title")}
			clearConfirmTitle={t(
				"partner.staffPage.filters.drawer.clearConfirm.title",
			)}
			clearConfirmDescription={t(
				"partner.staffPage.filters.drawer.clearConfirm.description",
			)}
			clearLabel={t("partner.staffPage.filters.clear")}
			applyLabel={t("partner.staffPage.filters.drawer.apply")}
			onClear={onClear}
			onApply={onApply}
		>
			{entitiesError ? (
				<SomeErrorState
					title={t("partner.staffPage.filters.entity.error.title")}
					description={t("partner.staffPage.filters.entity.error.description")}
					onRefresh={onRefreshEntities}
				/>
			) : (
				<div className="grid gap-2">
					<Label>{t("partner.staffPage.filters.entity.label")}</Label>
					<Combobox
						options={entityOptions}
						value={entityIdFilter}
						onValueChange={onEntityIdChange}
						placeholder={t("partner.staffPage.filters.entity.placeholder")}
						searchPlaceholder={t(
							"partner.staffPage.filters.entity.searchPlaceholder",
						)}
						emptyMessage={t("partner.staffPage.filters.entity.emptyMessage")}
						disabled={isEntitiesLoading}
					/>
				</div>
			)}

			{citiesError ? (
				<SomeErrorState
					title={t("partner.staffPage.filters.city.error.title")}
					description={t("partner.staffPage.filters.city.error.description")}
					onRefresh={onRefreshCities}
				/>
			) : (
				<div className="grid gap-2">
					<Label>{t("partner.staffPage.filters.city.label")}</Label>
					<Combobox
						options={cityOptions}
						value={cityIdFilter}
						onValueChange={onCityIdChange}
						placeholder={t("partner.staffPage.filters.city.placeholder")}
						searchPlaceholder={t(
							"partner.staffPage.filters.city.searchPlaceholder",
						)}
						emptyMessage={t("partner.staffPage.filters.city.emptyMessage")}
						disabled={isCitiesLoading}
					/>
				</div>
			)}

			<div className="grid gap-2">
				<Label>{t("partner.staffPage.filters.active.label")}</Label>
				<Select
					value={activeFilter || "ALL"}
					onValueChange={value =>
						onActiveFilterChange(
							value === "ALL" ? "" : (value as StaffActiveFilter),
						)
					}
				>
					<SelectTrigger
						className="w-full"
						placeholder={t("partner.staffPage.filters.active.placeholder")}
					/>
					<SelectContent>
						<SelectItem value="ALL">
							{t("partner.staffPage.filters.active.options.all")}
						</SelectItem>
						<SelectItem
							value="true"
							className={getStaffActiveOptionClassName("true")}
						>
							{t("partner.staffPage.filters.active.options.active")}
						</SelectItem>
						<SelectItem
							value="false"
							className={getStaffActiveOptionClassName("false")}
						>
							{t("partner.staffPage.filters.active.options.inactive")}
						</SelectItem>
					</SelectContent>
				</Select>
			</div>
		</ServicePageFiltersDrawer>
	);
}
