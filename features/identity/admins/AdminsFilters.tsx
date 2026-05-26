"use client";

import { useMemo } from "react";

import { MultiSelect } from "@/components";
import { useTranslation } from "react-i18next";

import { getAdminCampusOptions } from "@/features/identity/admins/utils";
import { TextFieldFilter } from "@/features/shared/service-pages";
import type { AdminsFiltersProps } from "@/types";

import { AdminsFiltersDrawer } from "./AdminsFiltersDrawer";

export function AdminsFilters({
	backendFilters,
	backendFiltersOpen,
	frontendCampusFilters,
	frontendQuerySearch,
	hasBackendFilters,
	onApplyBackendFilters,
	onBackendFilterChange,
	onBackendFiltersOpenChange,
	onClearBackendFilters,
	onFrontendCampusFiltersChange,
	onFrontendQuerySearchChange,
}: AdminsFiltersProps) {
	const { t } = useTranslation();
	const campusOptions = useMemo(() => getAdminCampusOptions(t), [t]);

	return (
		<div className="grid gap-2 lg:grid-cols-[minmax(0,1.6fr)_minmax(16rem,1fr)_auto] lg:items-end">
			<TextFieldFilter
				label={t("identity.adminPage.filters.search.label")}
				value={frontendQuerySearch}
				onChange={onFrontendQuerySearchChange}
				placeholder={t("identity.adminPage.filters.search.placeholder")}
			/>
			<MultiSelect
				options={campusOptions}
				value={frontendCampusFilters}
				onValueChange={value =>
					onFrontendCampusFiltersChange(value as typeof frontendCampusFilters)
				}
				placeholder={t("identity.adminPage.filters.campus.placeholder")}
			/>
			<AdminsFiltersDrawer
				filters={backendFilters}
				hasActiveFilters={hasBackendFilters}
				onApply={onApplyBackendFilters}
				onClear={onClearBackendFilters}
				onFilterChange={onBackendFilterChange}
				onOpenChange={onBackendFiltersOpenChange}
				open={backendFiltersOpen}
			/>
		</div>
	);
}
