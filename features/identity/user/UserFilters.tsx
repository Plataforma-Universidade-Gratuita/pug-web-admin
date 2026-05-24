"use client";

import { useTranslation } from "react-i18next";

import {
	AuditInfoFilter,
	NumberFieldFilter,
	TextFieldFilter,
} from "@/features/shared/service-pages";
import type { UserFiltersProps } from "@/types/client/identity";

export function UserFilters({
	cpfSearch,
	dateField,
	dateFiltersOpen,
	endDate,
	nameSearch,
	onCpfSearchChange,
	onDateFieldChange,
	onDateFiltersOpenChange,
	onEndDateChange,
	onNameSearchChange,
	onStartDateChange,
	startDate,
}: UserFiltersProps) {
	const { t } = useTranslation();

	return (
		<>
			<TextFieldFilter
				label={t("identity.userPage.filters.name.label")}
				value={nameSearch}
				onChange={onNameSearchChange}
				placeholder={t("identity.userPage.filters.name.placeholder")}
			/>
			<NumberFieldFilter
				label={t("identity.userPage.filters.cpf.label")}
				value={cpfSearch}
				onChange={onCpfSearchChange}
				placeholder={t("identity.userPage.filters.cpf.placeholder")}
			/>
			<AuditInfoFilter
				label={t("identity.userPage.filters.advanced.label")}
				triggerLabel={t("identity.userPage.filters.advanced.trigger")}
				activeLabel={t("identity.userPage.filters.advanced.active")}
				open={dateFiltersOpen}
				onOpenChange={onDateFiltersOpenChange}
				dateFieldLabel={t("identity.userPage.filters.dateField.label")}
				dateFieldPlaceholder={t(
					"identity.userPage.filters.dateField.placeholder",
				)}
				dateField={dateField}
				onDateFieldChange={value =>
					onDateFieldChange(value as typeof dateField)
				}
				dateFieldOptions={[
					{
						value: "createdAt",
						label: t("identity.userPage.filters.dateField.options.createdAt"),
					},
					{
						value: "updatedAt",
						label: t("identity.userPage.filters.dateField.options.updatedAt"),
					},
				]}
				startDateLabel={t("identity.userPage.filters.startDate.label")}
				startDatePlaceholder={t(
					"identity.userPage.filters.startDate.placeholder",
				)}
				startDate={startDate}
				onStartDateChange={onStartDateChange}
				endDateLabel={t("identity.userPage.filters.endDate.label")}
				endDatePlaceholder={t("identity.userPage.filters.endDate.placeholder")}
				endDate={endDate}
				onEndDateChange={onEndDateChange}
			/>
		</>
	);
}
