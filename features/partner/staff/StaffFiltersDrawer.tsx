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
			label={t("common.filters.label")}
			activeLabel={t("common.filters.active")}
			triggerLabel={t("common.filters.more")}
			overhead={t("common.filters.overhead")}
			title={t("common.filters.title")}
			clearConfirmTitle={t(
				"partner.staffPage.filters.drawer.clearConfirm.title",
			)}
			clearConfirmDescription={t(
				"partner.staffPage.filters.drawer.clearConfirm.description",
			)}
			clearLabel={t("common.filters.clear")}
			applyLabel={t("common.filters.apply")}
			onClear={onClear}
			onApply={onApply}
		>
			<TextFieldFilter
				label={t("common.filters.name.label")}
				value={filters.name}
				onChange={value => onFilterChange("name", value)}
				placeholder={t("common.filters.name.placeholder")}
			/>

			<NumberFieldFilter
				label={t("common.filters.cpf.label")}
				value={filters.cpf}
				onChange={value => onFilterChange("cpf", value)}
				placeholder={t("common.filters.cpf.placeholder")}
			/>

			<TextFieldFilter
				label={t("common.filters.email.label")}
				value={filters.email}
				onChange={value => onFilterChange("email", value)}
				placeholder={t("common.filters.email.placeholder")}
			/>

			{entitiesError ? (
				<SomeErrorState
					title={t("common.loadErrors.entities.title")}
					description={t("common.loadErrors.entities.description")}
					onRefresh={onRefreshEntities}
				/>
			) : (
				<div className="grid gap-2">
					<Label>{t("common.fields.entity")}</Label>
					<Combobox
						multiple
						options={entityOptions}
						values={filters.entityIds}
						onValuesChange={value => onFilterChange("entityIds", value)}
						placeholder={t("common.placeholders.select")}
						searchPlaceholder={t("common.placeholders.search")}
						emptyMessage={t("common.placeholders.noResults")}
						disabled={isEntitiesLoading}
					/>
				</div>
			)}

			<div className="grid min-w-0 gap-2">
				<Label>{t("common.filters.startDate.label")}</Label>
				<DatePicker
					value={filters.dateFrom}
					onValueChange={value => onFilterChange("dateFrom", value)}
					placeholder={t("common.filters.startDate.placeholder")}
				/>
			</div>

			<div className="grid min-w-0 gap-2">
				<Label>{t("common.filters.endDate.label")}</Label>
				<DatePicker
					value={filters.dateTo}
					onValueChange={value => onFilterChange("dateTo", value)}
					placeholder={t("common.filters.endDate.placeholder")}
				/>
			</div>

			<Checkbox
				checked={filters.activeOnly}
				onCheckedChange={checked =>
					onFilterChange("activeOnly", checked === true)
				}
				label={t("common.filters.activeOnly.label")}
				description={t("common.filters.activeOnly.description")}
			/>
		</ServicePageFiltersDrawer>
	);
}
