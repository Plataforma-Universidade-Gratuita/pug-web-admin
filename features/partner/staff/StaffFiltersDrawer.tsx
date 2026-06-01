"use client";

import { useTranslation } from "react-i18next";

import {
	Checkbox,
	Combobox,
	DatePicker,
	Label,
	SomeErrorState,
} from "@/components";
import {
	NumberFieldFilter,
	ServicePageFiltersDrawer,
	TextFieldFilter,
} from "@/features/shared/service-pages";
import type { StaffFiltersDrawerProps } from "@/types";

export function StaffFiltersDrawer({
	filters,
	entitiesError,
	entityOptions,
	hasActiveFilters,
	isEntitiesLoading,
	onApply,
	onClear,
	onFilterChange,
	onOpenChange,
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
			<TextFieldFilter
				label={t("identity.accountPage.filters.name.label")}
				value={filters.name}
				onChange={value => onFilterChange("name", value)}
				placeholder={t("identity.accountPage.filters.name.placeholder")}
			/>

			<NumberFieldFilter
				label={t("identity.accountPage.filters.cpf.label")}
				value={filters.cpf}
				onChange={value => onFilterChange("cpf", value)}
				placeholder={t("identity.accountPage.filters.cpf.placeholder")}
			/>

			<TextFieldFilter
				label={t("identity.accountPage.filters.email.label")}
				value={filters.email}
				onChange={value => onFilterChange("email", value)}
				placeholder={t("identity.accountPage.filters.email.placeholder")}
			/>

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
						multiple
						options={entityOptions}
						values={filters.entityIds}
						onValuesChange={value => onFilterChange("entityIds", value)}
						placeholder={t("partner.staffPage.filters.entity.placeholder")}
						searchPlaceholder={t(
							"partner.staffPage.filters.entity.searchPlaceholder",
						)}
						emptyMessage={t("partner.staffPage.filters.entity.emptyMessage")}
						disabled={isEntitiesLoading}
					/>
				</div>
			)}

			<div className="grid min-w-0 gap-2">
				<Label>{t("identity.accountPage.filters.startDate.label")}</Label>
				<DatePicker
					value={filters.dateFrom}
					onValueChange={value => onFilterChange("dateFrom", value)}
					placeholder={t("identity.accountPage.filters.startDate.placeholder")}
				/>
			</div>

			<div className="grid min-w-0 gap-2">
				<Label>{t("identity.accountPage.filters.endDate.label")}</Label>
				<DatePicker
					value={filters.dateTo}
					onValueChange={value => onFilterChange("dateTo", value)}
					placeholder={t("identity.accountPage.filters.endDate.placeholder")}
				/>
			</div>

			<Checkbox
				checked={filters.activeOnly}
				onCheckedChange={checked =>
					onFilterChange("activeOnly", checked === true)
				}
				label={t("identity.accountPage.filters.activeOnly.label")}
				description={t("identity.accountPage.filters.activeOnly.description")}
			/>
		</ServicePageFiltersDrawer>
	);
}
