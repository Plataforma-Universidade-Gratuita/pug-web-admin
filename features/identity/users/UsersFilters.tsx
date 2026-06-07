"use client";

import { useTranslation } from "react-i18next";

import { NumberFieldFilter, TextFieldFilter } from "@/components/composite";
import type { UsersFiltersProps } from "@/types/client";

import { UsersFiltersDrawer } from "./UsersFiltersDrawer";

export function UsersFilters({
	backendFilters,
	backendFiltersOpen,
	frontendCpfSearch,
	frontendNameSearch,
	hasBackendFilters,
	onApplyBackendFilters,
	onBackendFilterChange,
	onBackendFiltersOpenChange,
	onClearBackendFilters,
	onFrontendCpfSearchChange,
	onFrontendNameSearchChange,
}: UsersFiltersProps) {
	const { t } = useTranslation();

	return (
		<div className="grid gap-2 lg:grid-cols-[minmax(0,1.6fr)_minmax(16rem,1fr)_auto] lg:items-end">
			<TextFieldFilter
				label={t("common.filters.name.label")}
				value={frontendNameSearch}
				onChange={onFrontendNameSearchChange}
				placeholder={t("common.filters.name.placeholder")}
			/>
			<NumberFieldFilter
				label={t("common.fields.cpf")}
				value={frontendCpfSearch}
				onChange={onFrontendCpfSearchChange}
				placeholder={t("common.filters.cpf.placeholder")}
			/>
			<UsersFiltersDrawer
				filters={backendFilters}
				hasActiveFilters={hasBackendFilters}
				onApply={onApplyBackendFilters}
				onFilterChange={onBackendFilterChange}
				onClear={onClearBackendFilters}
				onOpenChange={onBackendFiltersOpenChange}
				open={backendFiltersOpen}
			/>
		</div>
	);
}
