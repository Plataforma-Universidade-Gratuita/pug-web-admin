"use client";

import { useMemo } from "react";

import { useTranslation } from "react-i18next";

import {
	Checkbox,
	Combobox,
	DatePicker,
	Label,
	SomeErrorState,
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/components";
import { getFormerStudentCampusOptions } from "@/features/academic/former-students/utils";
import {
	NumberFieldFilter,
	ServicePageFiltersDrawer,
	TextFieldFilter,
} from "@/features/shared/service-pages";
import type { FormerStudentsFiltersDrawerProps } from "@/types";

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
			activeLabel={t("academic.studentPage.filters.drawer.active")}
			applyLabel={t("academic.studentPage.filters.drawer.apply")}
			clearConfirmDescription={t(
				"academic.studentPage.filters.drawer.clearConfirm.description",
			)}
			clearConfirmTitle={t(
				"academic.studentPage.filters.drawer.clearConfirm.title",
			)}
			clearLabel={t("academic.studentPage.filters.clear")}
			hasActiveFilters={hasActiveFilters}
			label={t("academic.studentPage.filters.drawer.label")}
			onApply={onApply}
			onClear={onClear}
			onOpenChange={onOpenChange}
			open={open}
			overhead={t("academic.studentPage.filters.drawer.overhead")}
			title={t("academic.studentPage.filters.drawer.title")}
			triggerLabel={t("academic.studentPage.filters.drawer.trigger")}
		>
			<Tabs
				defaultValue="identity"
				className="drawer-sticky-tabs grid gap-4"
			>
				<TabsList className="w-full">
					<TabsTrigger value="identity">
						{t("academic.studentPage.filters.tabs.identity")}
					</TabsTrigger>
					<TabsTrigger value="academic">
						{t("academic.studentPage.filters.tabs.academic")}
					</TabsTrigger>
					<TabsTrigger value="status">
						{t("academic.studentPage.filters.tabs.status")}
					</TabsTrigger>
				</TabsList>

				<TabsContent
					value="identity"
					className="grid gap-4"
				>
					<TextFieldFilter
						label={t("identity.accountPage.filters.name.label")}
						value={name}
						onChange={onNameChange}
						placeholder={t("identity.accountPage.filters.name.placeholder")}
					/>

					<NumberFieldFilter
						label={t("identity.accountPage.filters.cpf.label")}
						value={cpf}
						onChange={onCpfChange}
						placeholder={t("identity.accountPage.filters.cpf.placeholder")}
					/>

					<TextFieldFilter
						label={t("identity.accountPage.filters.email.label")}
						value={email}
						onChange={onEmailChange}
						placeholder={t("identity.accountPage.filters.email.placeholder")}
					/>

					<TextFieldFilter
						label={t("academic.studentPage.table.columns.academicRegistration")}
						value={academicRegistration}
						onChange={onAcademicRegistrationChange}
						placeholder={t(
							"academic.studentPage.filters.academicRegistration.placeholder",
						)}
					/>
				</TabsContent>

				<TabsContent
					value="academic"
					className="grid gap-4"
				>
					<div className="grid gap-2">
						<Label>{t("academic.studentPage.filters.campus.label")}</Label>
						<Combobox
							multiple
							options={campusOptions}
							values={campi}
							onValuesChange={value => onCampiChange(value as typeof campi)}
							placeholder={t("academic.studentPage.filters.campus.placeholder")}
							searchPlaceholder={t(
								"academic.studentPage.filters.campus.searchPlaceholder",
							)}
							emptyMessage={t("academic.studentPage.filters.campus.emptyMessage")}
						/>
					</div>

					{coursesError ? (
						<SomeErrorState
							title={t("academic.studentPage.filters.course.error.title")}
							description={t(
								"academic.studentPage.filters.course.error.description",
							)}
							onRefresh={onRefreshCourses}
						/>
					) : (
						<>
							<div className="grid gap-2">
								<Label>{t("academic.studentPage.filters.course.label")}</Label>
								<Combobox
									multiple
									options={courseOptions}
									values={courseIds}
									onValuesChange={onCourseIdsChange}
									placeholder={t("academic.studentPage.filters.course.placeholder")}
									searchPlaceholder={t(
										"academic.studentPage.filters.course.searchPlaceholder",
									)}
									emptyMessage={t(
										"academic.studentPage.filters.course.emptyMessage",
									)}
									disabled={isCoursesLoading}
								/>
							</div>

							<div className="grid gap-2">
								<Label>{t("academic.studentPage.filters.areaOfExpertise.label")}</Label>
								<Combobox
									multiple
									options={areaOfExpertiseOptions}
									values={areaOfExpertiseIds}
									onValuesChange={onAreaOfExpertiseIdsChange}
									placeholder={t(
										"academic.studentPage.filters.areaOfExpertise.placeholder",
									)}
									searchPlaceholder={t(
										"academic.studentPage.filters.areaOfExpertise.searchPlaceholder",
									)}
									emptyMessage={t(
										"academic.studentPage.filters.areaOfExpertise.emptyMessage",
									)}
									disabled={isAreasOfExpertiseLoading}
								/>
							</div>
						</>
					)}

					<div className="grid min-w-0 gap-2">
						<Label>{t("academic.studentPage.filters.periodFrom.label")}</Label>
						<DatePicker
							value={periodFrom}
							onValueChange={onPeriodFromChange}
							placeholder={t("academic.studentPage.filters.periodFrom.placeholder")}
						/>
					</div>

					<div className="grid min-w-0 gap-2">
						<Label>{t("academic.studentPage.filters.periodTo.label")}</Label>
						<DatePicker
							value={periodTo}
							onValueChange={onPeriodToChange}
							placeholder={t("academic.studentPage.filters.periodTo.placeholder")}
						/>
					</div>

					<Checkbox
						checked={includeConcluded}
						onCheckedChange={checked =>
							onIncludeConcludedChange(checked === true)
						}
						label={t("academic.studentPage.filters.includeConcluded.label")}
						description={t(
							"academic.studentPage.filters.includeConcluded.description",
						)}
					/>
				</TabsContent>

				<TabsContent
					value="status"
					className="grid gap-4"
				>
					<div className="grid min-w-0 gap-2">
						<Label>{t("identity.accountPage.filters.startDate.label")}</Label>
						<DatePicker
							value={dateFrom}
							onValueChange={onDateFromChange}
							placeholder={t("identity.accountPage.filters.startDate.placeholder")}
						/>
					</div>

					<div className="grid min-w-0 gap-2">
						<Label>{t("identity.accountPage.filters.endDate.label")}</Label>
						<DatePicker
							value={dateTo}
							onValueChange={onDateToChange}
							placeholder={t("identity.accountPage.filters.endDate.placeholder")}
						/>
					</div>

					<Checkbox
						checked={activeOnly}
						onCheckedChange={checked => onActiveOnlyChange(checked === true)}
						label={t("identity.accountPage.filters.activeOnly.label")}
						description={t("identity.accountPage.filters.activeOnly.description")}
					/>
				</TabsContent>
			</Tabs>
		</ServicePageFiltersDrawer>
	);
}
