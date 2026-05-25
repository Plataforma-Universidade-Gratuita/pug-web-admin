"use client";

import { useTranslation } from "react-i18next";

import {
	Label,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
} from "@/components";
import { ACCOUNT_TYPE_VALUES } from "@/constants";
import { getAccountOptionClassName } from "@/features/identity/accounts/utils";
import {
	AuditInfoFilterFields,
	ServicePageFiltersDrawer,
} from "@/features/shared/service-pages";
import type { AccountsFiltersDrawerProps } from "@/types";

export function AccountsFiltersDrawer({
	activeFilter,
	accountTypeFilter,
	dateField,
	endDate,
	hasActiveFilters,
	onActiveFilterChange,
	onAccountTypeChange,
	onApply,
	onClear,
	onDateFieldChange,
	onEndDateChange,
	onOpenChange,
	onStartDateChange,
	open,
	startDate,
}: AccountsFiltersDrawerProps) {
	const { t } = useTranslation();

	return (
		<ServicePageFiltersDrawer
			open={open}
			onOpenChange={onOpenChange}
			hasActiveFilters={hasActiveFilters}
			label={t("identity.accountPage.filters.drawer.label")}
			activeLabel={t("identity.accountPage.filters.drawer.active")}
			triggerLabel={t("identity.accountPage.filters.drawer.trigger")}
			overhead={t("identity.accountPage.filters.drawer.overhead")}
			title={t("identity.accountPage.filters.drawer.title")}
			clearConfirmTitle={t(
				"identity.accountPage.filters.drawer.clearConfirm.title",
			)}
			clearConfirmDescription={t(
				"identity.accountPage.filters.drawer.clearConfirm.description",
			)}
			clearLabel={t("identity.accountPage.filters.clear")}
			applyLabel={t("identity.accountPage.filters.drawer.apply")}
			onClear={onClear}
			onApply={onApply}
		>
			<div className="grid gap-2">
				<Label>{t("identity.accountPage.filters.active.label")}</Label>
				<Select
					value={activeFilter}
					onValueChange={value =>
						onActiveFilterChange(
							value === "ALL" ? "" : (value as typeof activeFilter),
						)
					}
				>
					<SelectTrigger
						className="w-full"
						placeholder={t("identity.accountPage.filters.active.placeholder")}
					/>
					<SelectContent>
						<SelectItem value="ALL">
							{t("identity.accountPage.filters.active.options.all")}
						</SelectItem>
						<SelectItem
							value="true"
							className={getAccountOptionClassName("active", "true")}
						>
							{t("identity.accountPage.filters.active.options.active")}
						</SelectItem>
						<SelectItem
							value="false"
							className={getAccountOptionClassName("active", "false")}
						>
							{t("identity.accountPage.filters.active.options.inactive")}
						</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<div className="grid gap-2">
				<Label>{t("identity.accountPage.filters.accountType.label")}</Label>
				<Select
					value={accountTypeFilter}
					onValueChange={value =>
						onAccountTypeChange(
							value === "ALL" ? "" : (value as typeof accountTypeFilter),
						)
					}
				>
					<SelectTrigger
						className="w-full"
						placeholder={t(
							"identity.accountPage.filters.accountType.placeholder",
						)}
					/>
					<SelectContent>
						<SelectItem value="ALL">
							{t("identity.accountPage.filters.accountType.options.all")}
						</SelectItem>
						{ACCOUNT_TYPE_VALUES.map(accountType => (
							<SelectItem
								key={accountType}
								value={accountType}
								className={getAccountOptionClassName(
									"accountType",
									accountType,
								)}
							>
								{t(
									`identity.accountPage.filters.accountType.options.${accountType}`,
								)}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<AuditInfoFilterFields
				dateFieldLabel={t("identity.accountPage.filters.dateField.label")}
				dateFieldPlaceholder={t(
					"identity.accountPage.filters.dateField.placeholder",
				)}
				dateField={dateField}
				onDateFieldChange={value =>
					onDateFieldChange(value as typeof dateField)
				}
				dateFieldOptions={[
					{
						value: "createdAt",
						label: t(
							"identity.accountPage.filters.dateField.options.createdAt",
						),
					},
					{
						value: "updatedAt",
						label: t(
							"identity.accountPage.filters.dateField.options.updatedAt",
						),
					},
				]}
				startDateLabel={t("identity.accountPage.filters.startDate.label")}
				startDatePlaceholder={t(
					"identity.accountPage.filters.startDate.placeholder",
				)}
				startDate={startDate}
				onStartDateChange={onStartDateChange}
				endDateLabel={t("identity.accountPage.filters.endDate.label")}
				endDatePlaceholder={t(
					"identity.accountPage.filters.endDate.placeholder",
				)}
				endDate={endDate}
				onEndDateChange={onEndDateChange}
			/>
		</ServicePageFiltersDrawer>
	);
}
