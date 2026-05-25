"use client";

import { useMemo } from "react";

import { useTranslation } from "react-i18next";

import {
	Label,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
} from "@/components";
import { getAdminCampusOptions } from "@/features/identity/admins/utils";
import { TextFieldFilter } from "@/features/shared/service-pages";
import type { AdminCampusFilter, AdminsFiltersProps } from "@/types";

export function AdminsFilters({
	campusFilter,
	onCampusFilterChange,
	onSearchChange,
	querySearch,
}: AdminsFiltersProps) {
	const { t } = useTranslation();
	const campusOptions = useMemo(() => getAdminCampusOptions(t), [t]);

	return (
		<>
			<TextFieldFilter
				label={t("identity.adminPage.filters.search.label")}
				value={querySearch}
				onChange={onSearchChange}
				placeholder={t("identity.adminPage.filters.search.placeholder")}
			/>

			<div className="grid gap-2">
				<Label>{t("identity.adminPage.filters.campus.label")}</Label>
				<Select
					value={campusFilter || "ALL"}
					onValueChange={value =>
						onCampusFilterChange(
							value === "ALL" ? "" : (value as AdminCampusFilter),
						)
					}
				>
					<SelectTrigger
						className="w-full"
						placeholder={t("identity.adminPage.filters.campus.placeholder")}
					/>
					<SelectContent>
						<SelectItem value="ALL">
							{t("identity.adminPage.filters.campus.options.all")}
						</SelectItem>
						{campusOptions.map(option => (
							<SelectItem
								key={option.value}
								value={option.value}
							>
								{option.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
		</>
	);
}
