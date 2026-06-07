"use client";

import { useMemo } from "react";

import { useTranslation } from "react-i18next";

import { TextFieldFilter } from "@/components/composite";
import { Combobox, Label } from "@/components/primitives";
import { getAdminCampusOptions } from "@/features/identity/admins/utils";
import type { AdminsFiltersProps } from "@/types/client";

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
				label={t("common.filters.search.label")}
				value={frontendQuerySearch}
				onChange={onFrontendQuerySearchChange}
				placeholder={t("common.filters.search.placeholder")}
			/>
			<div className="grid gap-2">
				<Label>{t("common.fields.campus")}</Label>
				<Combobox
					multiple
					options={campusOptions}
					values={frontendCampusFilters}
					onValuesChange={value =>
						onFrontendCampusFiltersChange(value as typeof frontendCampusFilters)
					}
					placeholder={t("common.placeholders.select")}
					className="min-h-11"
				/>
			</div>
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
