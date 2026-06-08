"use client";

import { useTranslation } from "react-i18next";

import { RecordActionDialogs, TextFieldFilter } from "@/components/composite";
import { FormerStudentsFiltersDrawer } from "@/features/academic/former-students/FormerStudentsFiltersDrawer";
import { getCrudDeleteConfirmCopy } from "@/features/utils";
import type {
	ComboboxOption,
	FormerStudentDirectoryItem,
	FormerStudentSecondaryFilters,
} from "@/types/client";

export function FormerStudentsPageFilters({
	querySearch,
	onQuerySearchChange,
	registrationSearch,
	onRegistrationSearchChange,
	draftFilters,
	courseOptions,
	areaOfExpertiseOptions,
	coursesError,
	coursesLoading,
	hasAppliedFilters,
	filtersOpen,
	onApply,
	onClear,
	onOpenChange,
	onRefreshCourses,
	onFilterChange,
}: {
	querySearch: string;
	onQuerySearchChange: (value: string) => void;
	registrationSearch: string;
	onRegistrationSearchChange: (value: string) => void;
	draftFilters: FormerStudentSecondaryFilters;
	courseOptions: ComboboxOption[];
	areaOfExpertiseOptions: ComboboxOption[];
	coursesError: boolean;
	coursesLoading: boolean;
	hasAppliedFilters: boolean;
	filtersOpen: boolean;
	onApply: () => void;
	onClear: () => void;
	onOpenChange: (open: boolean) => void;
	onRefreshCourses: () => void;
	onFilterChange: <K extends keyof FormerStudentSecondaryFilters>(
		key: K,
		value: FormerStudentSecondaryFilters[K],
	) => void;
}) {
	const { t } = useTranslation();

	return (
		<>
			<TextFieldFilter
				label={t("common.filters.search.label")}
				value={querySearch}
				onChange={onQuerySearchChange}
				placeholder={t("common.filters.search.placeholder")}
			/>

			<TextFieldFilter
				label={t(
					"academic.formerStudentPage.filters.frontendAcademicRegistration.label",
				)}
				value={registrationSearch}
				onChange={onRegistrationSearchChange}
				placeholder={t(
					"academic.formerStudentPage.filters.frontendAcademicRegistration.placeholder",
				)}
			/>

			<FormerStudentsFiltersDrawer
				name={draftFilters.name}
				cpf={draftFilters.cpf}
				email={draftFilters.email}
				academicRegistration={draftFilters.academicRegistration}
				activeOnly={draftFilters.activeOnly}
				campi={draftFilters.campi}
				courseIds={draftFilters.courseIds}
				areaOfExpertiseIds={draftFilters.areaOfExpertiseIds}
				includeConcluded={draftFilters.includeConcluded}
				periodFrom={draftFilters.periodFrom}
				periodTo={draftFilters.periodTo}
				dateFrom={draftFilters.dateFrom}
				dateTo={draftFilters.dateTo}
				courseOptions={courseOptions}
				areaOfExpertiseOptions={areaOfExpertiseOptions}
				coursesError={coursesError}
				hasActiveFilters={hasAppliedFilters}
				isCoursesLoading={coursesLoading}
				isAreasOfExpertiseLoading={coursesLoading}
				onNameChange={value => onFilterChange("name", value)}
				onCpfChange={value => onFilterChange("cpf", value)}
				onEmailChange={value => onFilterChange("email", value)}
				onAcademicRegistrationChange={value =>
					onFilterChange("academicRegistration", value)
				}
				onActiveOnlyChange={value => onFilterChange("activeOnly", value)}
				onApply={onApply}
				onCampiChange={value => onFilterChange("campi", value)}
				onClear={onClear}
				onCourseIdsChange={value => onFilterChange("courseIds", value)}
				onAreaOfExpertiseIdsChange={value =>
					onFilterChange("areaOfExpertiseIds", value)
				}
				onIncludeConcludedChange={value =>
					onFilterChange("includeConcluded", value)
				}
				onPeriodFromChange={value => onFilterChange("periodFrom", value)}
				onPeriodToChange={value => onFilterChange("periodTo", value)}
				onDateFromChange={value => onFilterChange("dateFrom", value)}
				onDateToChange={value => onFilterChange("dateTo", value)}
				onOpenChange={onOpenChange}
				onRefreshCourses={onRefreshCourses}
				open={filtersOpen}
			/>
		</>
	);
}

export function FormerStudentsPageDialogs({
	pendingDeleteRecord,
	pendingStatusRecord,
	onDeleteOpenChange,
	onStatusOpenChange,
	onDeleteConfirm,
	onStatusConfirm,
}: {
	pendingDeleteRecord: FormerStudentDirectoryItem | null;
	pendingStatusRecord: {
		active: boolean;
		record: FormerStudentDirectoryItem;
	} | null;
	onDeleteOpenChange: (open: boolean) => void;
	onStatusOpenChange: (open: boolean) => void;
	onDeleteConfirm: () => void;
	onStatusConfirm: () => void;
}) {
	const { t } = useTranslation();
	const deleteConfirmCopy = pendingDeleteRecord
		? getCrudDeleteConfirmCopy(
				t,
				t("common.objects.formerStudent"),
				pendingDeleteRecord.user?.name ?? "",
			)
		: null;

	return (
		<RecordActionDialogs
			cancelLabel={t("common.cancel")}
			{...(pendingDeleteRecord
				? {
						deleteDialog: {
							actionLabel: t("table.actions.delete"),
							description: deleteConfirmCopy?.description ?? "",
							onAction: onDeleteConfirm,
							onOpenChange: onDeleteOpenChange,
							open: true,
							title: deleteConfirmCopy?.title ?? "",
							variant: "danger" as const,
						},
					}
				: {})}
			{...(pendingStatusRecord
				? {
						statusDialog: {
							actionLabel: t(
								pendingStatusRecord.active
									? "table.actions.reactivate"
									: "table.actions.deactivate",
							),
							description: t(
								pendingStatusRecord.active
									? "academic.formerStudentPage.reactivate.confirm.description"
									: "academic.formerStudentPage.deactivate.confirm.description",
								{
									name: pendingStatusRecord.record.user?.name ?? "",
								},
							),
							onAction: onStatusConfirm,
							onOpenChange: onStatusOpenChange,
							open: true,
							title: t(
								pendingStatusRecord.active
									? "academic.formerStudentPage.reactivate.confirm.title"
									: "academic.formerStudentPage.deactivate.confirm.title",
							),
							variant: pendingStatusRecord.active
								? ("success" as const)
								: ("warning" as const),
						},
					}
				: {})}
		/>
	);
}
