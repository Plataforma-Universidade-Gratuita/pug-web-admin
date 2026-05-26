"use client";

import { useTranslation } from "react-i18next";

import {
	NumberFieldFilter,
	TextFieldFilter,
} from "@/features/shared/service-pages";
import type { UsersFiltersProps } from "@/types";

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
				label={t("identity.userPage.filters.frontend.name.label")}
				value={frontendNameSearch}
				onChange={onFrontendNameSearchChange}
				placeholder={t("identity.userPage.filters.frontend.name.placeholder")}
			/>
			<NumberFieldFilter
				label={t("identity.userPage.filters.frontend.cpf.label")}
				value={frontendCpfSearch}
				onChange={onFrontendCpfSearchChange}
				placeholder={t("identity.userPage.filters.frontend.cpf.placeholder")}
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
