"use client";

import { useTranslation } from "react-i18next";

import {
	ServicePageConfirmDialog,
	TextFieldFilter,
} from "@/components/composite";
import { Combobox, Label } from "@/components/primitives";
import { AttendanceQrCodeDialog } from "@/features/project/attendances/AttendanceQrCodeDialog";
import { AttendancesFiltersDrawer } from "@/features/project/attendances/AttendancesFiltersDrawer";
import { getAttendanceValidationVariant } from "@/features/project/attendances/components/utils";
import type {
	AttendanceComplexSearchFilters,
	AttendanceDirectoryItem,
	AttendanceValidationAction,
	ComboboxOption,
} from "@/types/client";

export function AttendancesPageFilters({
	querySearch,
	onQuerySearchChange,
	frontendStatuses,
	onFrontendStatusesChange,
	statusOptions,
	draftFilters,
	filtersOpen,
	projectOptions,
	formerStudentOptions,
	validatorOptions,
	hasAppliedFilters,
	projectsError,
	formerStudentsError,
	validatorsError,
	onApply,
	onClear,
	onFilterChange,
	onOpenChange,
	onRefreshFormerStudents,
	onRefreshProjects,
	onRefreshValidators,
}: {
	querySearch: string;
	onQuerySearchChange: (value: string) => void;
	frontendStatuses: AttendanceDirectoryItem["status"]["status"][];
	onFrontendStatusesChange: (
		value: AttendanceDirectoryItem["status"]["status"][],
	) => void;
	statusOptions: ComboboxOption[];
	draftFilters: AttendanceComplexSearchFilters;
	filtersOpen: boolean;
	projectOptions: ComboboxOption[];
	formerStudentOptions: ComboboxOption[];
	validatorOptions: ComboboxOption[];
	hasAppliedFilters: boolean;
	projectsError: boolean;
	formerStudentsError: boolean;
	validatorsError: boolean;
	onApply: () => void;
	onClear: () => void;
	onFilterChange: <K extends keyof AttendanceComplexSearchFilters>(
		key: K,
		value: AttendanceComplexSearchFilters[K],
	) => void;
	onOpenChange: (open: boolean) => void;
	onRefreshFormerStudents: () => void;
	onRefreshProjects: () => void;
	onRefreshValidators: () => void;
}) {
	const { t } = useTranslation();

	return (
		<>
			<div className="grid gap-4 lg:grid-cols-[minmax(0,1.8fr)_minmax(220px,0.8fr)]">
				<TextFieldFilter
					label={t("common.filters.search.label")}
					value={querySearch}
					onChange={onQuerySearchChange}
					placeholder={t("common.filters.search.placeholder")}
				/>

				<div className="grid gap-2">
					<Label>{t("common.fields.status")}</Label>
					<Combobox
						multiple
						options={statusOptions}
						values={frontendStatuses}
						onValuesChange={value =>
							onFrontendStatusesChange(
								value as AttendanceDirectoryItem["status"]["status"][],
							)
						}
						placeholder={t("common.placeholders.select")}
						searchPlaceholder={t("common.placeholders.search")}
						emptyMessage={t("common.placeholders.noResults")}
						maxVisibleValues={1}
					/>
				</div>
			</div>

			<AttendancesFiltersDrawer
				filters={draftFilters}
				formerStudentOptions={formerStudentOptions}
				formerStudentsError={formerStudentsError}
				hasActiveFilters={hasAppliedFilters}
				onApply={onApply}
				onClear={onClear}
				onFilterChange={onFilterChange}
				onOpenChange={onOpenChange}
				onRefreshFormerStudents={onRefreshFormerStudents}
				onRefreshProjects={onRefreshProjects}
				onRefreshValidators={onRefreshValidators}
				open={filtersOpen}
				projectOptions={projectOptions}
				projectsError={projectsError}
				validatorOptions={validatorOptions}
				validatorsError={validatorsError}
			/>
		</>
	);
}

export function AttendancesPageDialogs({
	qrDialogAttendance,
	pendingDeleteAttendance,
	pendingValidation,
	onQrDialogOpenChange,
	onDeleteOpenChange,
	onValidationOpenChange,
	onDeleteConfirm,
	onValidationConfirm,
}: {
	qrDialogAttendance: AttendanceDirectoryItem | null;
	pendingDeleteAttendance: AttendanceDirectoryItem | null;
	pendingValidation: {
		action: AttendanceValidationAction;
		attendance: AttendanceDirectoryItem;
	} | null;
	onQrDialogOpenChange: (open: boolean) => void;
	onDeleteOpenChange: (open: boolean) => void;
	onValidationOpenChange: (open: boolean) => void;
	onDeleteConfirm: () => void;
	onValidationConfirm: () => void;
}) {
	const { t } = useTranslation();

	return (
		<>
			<AttendanceQrCodeDialog
				hash={qrDialogAttendance?.qrValidationInfo.qrValidationHash ?? null}
				onOpenChange={onQrDialogOpenChange}
				open={qrDialogAttendance !== null}
			/>

			<ServicePageConfirmDialog
				open={pendingDeleteAttendance !== null}
				onOpenChange={onDeleteOpenChange}
				variant="danger"
				title={t("project.attendancePage.delete.confirm.title")}
				description={t("project.attendancePage.delete.confirm.description", {
					id: pendingDeleteAttendance?.id ?? "",
					project: pendingDeleteAttendance?.project.name ?? "",
					formerStudent: pendingDeleteAttendance?.student.account.name ?? "",
				})}
				cancelLabel={t("common.cancel")}
				actionLabel={t("table.actions.delete")}
				onAction={onDeleteConfirm}
			/>

			<ServicePageConfirmDialog
				open={pendingValidation !== null}
				onOpenChange={onValidationOpenChange}
				variant={
					pendingValidation
						? getAttendanceValidationVariant(pendingValidation.action)
						: "success"
				}
				title={
					pendingValidation
						? t(
								`project.attendancePage.${pendingValidation.action}.confirm.title`,
							)
						: ""
				}
				description={
					pendingValidation
						? t(
								`project.attendancePage.${pendingValidation.action}.confirm.description`,
								{
									project: pendingValidation.attendance.project.name,
									formerStudent:
										pendingValidation.attendance.student.account.name,
								},
							)
						: ""
				}
				cancelLabel={t("common.cancel")}
				actionLabel={
					pendingValidation
						? t(
								`project.attendancePage.table.actions.${pendingValidation.action}`,
							)
						: ""
				}
				onAction={onValidationConfirm}
			/>
		</>
	);
}
