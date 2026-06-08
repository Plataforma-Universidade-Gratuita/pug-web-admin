"use client";

import { useMemo } from "react";

import { useTranslation } from "react-i18next";

import {
	AsyncComboboxFilterField,
	DateRangeFilterFields,
} from "@/components/composite";
import {
	NumberFieldFilter,
	ServicePageFiltersDrawer,
	TextFieldFilter,
} from "@/components/composite";
import {
	Checkbox,
	Combobox,
	Label,
	SomeErrorState,
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/components/primitives";
import { getFormerStudentCampusOptions } from "@/features/academic/former-students/utils";
import type { FormerStudentsFiltersDrawerProps } from "@/types/client";

export function FormerStudentsFiltersDrawer({
	academicRegistration,
	activeOnly,
	areaOfExpertiseIds,
	areaOfExpertiseOptions,
	campi,
	courseIds,
	courseOptions,
	cpf,
	coursesError,
	dateFrom,
	dateTo,
	email,
	hasActiveFilters,
	includeConcluded,
	isAreasOfExpertiseLoading,
	isCoursesLoading,
	name,
	onAcademicRegistrationChange,
	onActiveOnlyChange,
	onApply,
	onAreaOfExpertiseIdsChange,
	onCampiChange,
	onClear,
	onCourseIdsChange,
	onCpfChange,
	onDateFromChange,
	onDateToChange,
	onEmailChange,
	onIncludeConcludedChange,
	onNameChange,
	onOpenChange,
	onPeriodFromChange,
	onPeriodToChange,
	onRefreshCourses,
	open,
	periodFrom,
	periodTo,
}: FormerStudentsFiltersDrawerProps) {
	const { t } = useTranslation();
	const campusOptions = useMemo(() => getFormerStudentCampusOptions(t), [t]);

	return (
		<ServicePageFiltersDrawer
			activeLabel={t("common.filters.active")}
			applyLabel={t("common.filters.apply")}
			clearConfirmDescription={t("common.filters.clearConfirm.description")}
			clearConfirmTitle={t("common.filters.clearConfirm.title")}
			clearLabel={t("common.filters.clear")}
			hasActiveFilters={hasActiveFilters}
			label={t("common.filters.label")}
			onApply={onApply}
			onClear={onClear}
			onOpenChange={onOpenChange}
			open={open}
			overhead={t("common.filters.overhead")}
			title={t("common.filters.title")}
			triggerLabel={t("common.filters.more")}
		>
			<Tabs
				defaultValue="identity"
				className="drawer-sticky-tabs grid gap-4"
			>
				<TabsList className="w-full">
					<TabsTrigger value="identity">
						{t("academic.formerStudentPage.filters.tabs.identity")}
					</TabsTrigger>
					<TabsTrigger value="academic">
						{t("academic.formerStudentPage.filters.tabs.academic")}
					</TabsTrigger>
					<TabsTrigger value="status">
						{t("academic.formerStudentPage.filters.tabs.status")}
					</TabsTrigger>
				</TabsList>

				<TabsContent
					value="identity"
					className="grid gap-4"
				>
					<TextFieldFilter
						label={t("common.filters.name.label")}
						value={name}
						onChange={onNameChange}
						placeholder={t("common.filters.name.placeholder")}
					/>

					<NumberFieldFilter
						label={t("common.filters.cpf.label")}
						value={cpf}
						onChange={onCpfChange}
						placeholder={t("common.filters.cpf.placeholder")}
					/>

					<TextFieldFilter
						label={t("common.filters.email.label")}
						value={email}
						onChange={onEmailChange}
						placeholder={t("common.filters.email.placeholder")}
					/>

					<TextFieldFilter
						label={t(
							"academic.formerStudentPage.table.columns.academicRegistration",
						)}
						value={academicRegistration}
						onChange={onAcademicRegistrationChange}
						placeholder={t(
							"academic.formerStudentPage.filters.academicRegistration.placeholder",
						)}
					/>
				</TabsContent>

				<TabsContent
					value="academic"
					className="grid gap-4"
				>
					<div className="grid gap-2">
						<Label>
							{t("academic.formerStudentPage.filters.campus.label")}
						</Label>
						<Combobox
							multiple
							options={campusOptions}
							values={campi}
							onValuesChange={value => onCampiChange(value as typeof campi)}
							placeholder={t("common.placeholders.select")}
							searchPlaceholder={t("common.placeholders.search")}
							emptyMessage={t("common.placeholders.noResults")}
						/>
					</div>

					{coursesError ? (
						<SomeErrorState
							title={t("academic.formerStudentPage.filters.course.error.title")}
							description={t(
								"academic.formerStudentPage.filters.course.error.description",
							)}
							onRefresh={onRefreshCourses}
						/>
					) : (
						<>
							<AsyncComboboxFilterField
								multiple
								label={t("academic.formerStudentPage.filters.course.label")}
								options={courseOptions}
								values={courseIds}
								onValuesChange={onCourseIdsChange}
								placeholder={t("common.placeholders.select")}
								searchPlaceholder={t("common.placeholders.search")}
								emptyMessage={t("common.placeholders.noResults")}
								disabled={isCoursesLoading}
							/>

							<AsyncComboboxFilterField
								multiple
								label={t(
									"academic.formerStudentPage.filters.areaOfExpertise.label",
								)}
								options={areaOfExpertiseOptions}
								values={areaOfExpertiseIds}
								onValuesChange={onAreaOfExpertiseIdsChange}
								placeholder={t("common.placeholders.select")}
								searchPlaceholder={t("common.placeholders.search")}
								emptyMessage={t("common.placeholders.noResults")}
								disabled={isAreasOfExpertiseLoading}
							/>
						</>
					)}

					<DateRangeFilterFields
						startLabel={t(
							"academic.formerStudentPage.filters.periodFrom.label",
						)}
						startValue={periodFrom}
						onStartValueChange={onPeriodFromChange}
						startPlaceholder={t(
							"academic.formerStudentPage.filters.periodFrom.placeholder",
						)}
						endLabel={t("academic.formerStudentPage.filters.periodTo.label")}
						endValue={periodTo}
						onEndValueChange={onPeriodToChange}
						endPlaceholder={t(
							"academic.formerStudentPage.filters.periodTo.placeholder",
						)}
					/>

					<Checkbox
						checked={includeConcluded}
						onCheckedChange={checked =>
							onIncludeConcludedChange(checked === true)
						}
						label={t(
							"academic.formerStudentPage.filters.includeConcluded.label",
						)}
						description={t(
							"academic.formerStudentPage.filters.includeConcluded.description",
						)}
					/>
				</TabsContent>

				<TabsContent
					value="status"
					className="grid gap-4"
				>
					<DateRangeFilterFields
						startLabel={t("common.filters.startDate.label")}
						startValue={dateFrom}
						onStartValueChange={onDateFromChange}
						startPlaceholder={t("common.filters.startDate.placeholder")}
						endLabel={t("common.filters.endDate.label")}
						endValue={dateTo}
						onEndValueChange={onDateToChange}
						endPlaceholder={t("common.filters.endDate.placeholder")}
					/>

					<Checkbox
						checked={activeOnly}
						onCheckedChange={checked => onActiveOnlyChange(checked === true)}
						label={t("common.filters.activeOnly.label")}
						description={t("common.filters.activeOnly.description")}
					/>
				</TabsContent>
			</Tabs>
		</ServicePageFiltersDrawer>
	);
}
