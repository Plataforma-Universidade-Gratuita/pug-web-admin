"use client";

import { useTranslation } from "react-i18next";

import {
	ServicePageHeader,
	ServicePageHeaderActions,
	TextFieldFilter,
} from "@/components/composite";
import { StaffFiltersDrawer } from "@/features/partner/staff/StaffFiltersDrawer";
import type { StaffPageFiltersProps } from "@/types/client";

export function StaffPageFilters({
	entityOptions,
	entitiesError,
	filters,
	filtersOpen,
	hasActiveFilters,
	isEntitiesLoading,
	onApply,
	onClear,
	onFilterChange,
	onOpenChange,
	onQuerySearchChange,
	onRefreshEntities,
	onCreate,
	querySearch,
}: StaffPageFiltersProps) {
	const { t } = useTranslation();

	return (
		<ServicePageHeader
			title={t("partner.staffPage.title")}
			description={t("partner.staffPage.description")}
			metadata={{
				triggerLabel: t("common.metadata.trigger"),
				emptyTitle: t("common.metadata.empty.title"),
				emptyDescription: t("common.metadata.empty.description"),
			}}
			actions={
				<ServicePageHeaderActions
					clearLabel={t("common.filters.clear")}
					createLabel={t("partner.staffPage.create.open")}
					hasFilters={Boolean(querySearch.trim() || hasActiveFilters)}
					onClear={onClear}
					onCreate={onCreate}
				/>
			}
			filtersClassName="grid gap-4 lg:grid-cols-[minmax(0,1.8fr)_auto]"
		>
			<TextFieldFilter
				label={t("partner.staffPage.filters.search.label")}
				value={querySearch}
				onChange={onQuerySearchChange}
				placeholder={t("partner.staffPage.filters.search.placeholder")}
			/>

			<StaffFiltersDrawer
				filters={filters}
				entitiesError={entitiesError}
				entityOptions={entityOptions}
				hasActiveFilters={hasActiveFilters}
				isEntitiesLoading={isEntitiesLoading}
				onApply={onApply}
				onClear={onClear}
				onFilterChange={onFilterChange}
				onOpenChange={onOpenChange}
				onRefreshEntities={onRefreshEntities}
				open={filtersOpen}
			/>
		</ServicePageHeader>
	);
}
