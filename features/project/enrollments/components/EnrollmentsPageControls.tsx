"use client";

import { useTranslation } from "react-i18next";

import {
	ServicePageConfirmDialog,
	TextFieldFilter,
} from "@/components/composite";
import { Combobox, Label } from "@/components/primitives";
import { EnrollmentsFiltersDrawer } from "@/features/project/enrollments/EnrollmentsFiltersDrawer";
import type { EnrollmentStatus } from "@/types/api";
import type {
	ComboboxOption,
	EnrollmentComplexSearchFilters,
	EnrollmentDirectoryItem,
	EnrollmentStatusAction,
} from "@/types/client";

export function EnrollmentsPageFilters({
	querySearch,
	onQuerySearchChange,
	frontendStatuses,
	onFrontendStatusesChange,
	statusOptions,
	draftFilters,
	filtersOpen,
	projectOptions,
	formerStudentOptions,
	hasAppliedFilters,
	projectsError,
	formerStudentsError,
	onApply,
	onClear,
	onFilterChange,
	onOpenChange,
	onRefreshFormerStudents,
	onRefreshProjects,
}: {
	querySearch: string;
	onQuerySearchChange: (value: string) => void;
	frontendStatuses: EnrollmentStatus[];
	onFrontendStatusesChange: (value: EnrollmentStatus[]) => void;
	statusOptions: ComboboxOption[];
	draftFilters: EnrollmentComplexSearchFilters;
	filtersOpen: boolean;
	projectOptions: ComboboxOption[];
	formerStudentOptions: ComboboxOption[];
	hasAppliedFilters: boolean;
	projectsError: boolean;
	formerStudentsError: boolean;
	onApply: () => void;
	onClear: () => void;
	onFilterChange: <K extends keyof EnrollmentComplexSearchFilters>(
		key: K,
		value: EnrollmentComplexSearchFilters[K],
	) => void;
	onOpenChange: (open: boolean) => void;
	onRefreshFormerStudents: () => void;
	onRefreshProjects: () => void;
}) {
	const { t } = useTranslation();

	return (
		<>
			<div className="grid gap-4 lg:grid-cols-[minmax(0,1.8fr)_minmax(220px,0.8fr)]">
				<TextFieldFilter
					label={t("common.filters.search.label")}
					value={querySearch}
					onChange={onQuerySearchChange}
					placeholder={t("project.enrollmentPage.filters.search.placeholder")}
				/>

				<div className="grid gap-2">
					<Label>{t("common.fields.status")}</Label>
					<Combobox
						multiple
						options={statusOptions}
						values={frontendStatuses}
						onValuesChange={value =>
							onFrontendStatusesChange(value as EnrollmentStatus[])
						}
						placeholder={t("common.placeholders.select")}
						searchPlaceholder={t(
							"project.enrollmentPage.filters.frontStatus.searchPlaceholder",
						)}
						emptyMessage={t(
							"project.enrollmentPage.filters.frontStatus.emptyMessage",
						)}
						maxVisibleValues={1}
					/>
				</div>
			</div>

			<EnrollmentsFiltersDrawer
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
				open={filtersOpen}
				projectOptions={projectOptions}
				projectsError={projectsError}
			/>
		</>
	);
}

export function EnrollmentsPageDialogs({
	pendingDeleteEnrollment,
	pendingStatusAction,
	onDeleteOpenChange,
	onStatusOpenChange,
	onDeleteConfirm,
	onStatusConfirm,
}: {
	pendingDeleteEnrollment: EnrollmentDirectoryItem | null;
	pendingStatusAction: {
		action: EnrollmentStatusAction;
		enrollment: EnrollmentDirectoryItem;
	} | null;
	onDeleteOpenChange: (open: boolean) => void;
	onStatusOpenChange: (open: boolean) => void;
	onDeleteConfirm: () => void;
	onStatusConfirm: () => void;
}) {
	const { t } = useTranslation();

	return (
		<>
			<ServicePageConfirmDialog
				open={pendingDeleteEnrollment !== null}
				onOpenChange={onDeleteOpenChange}
				variant="danger"
				title={t("project.enrollmentPage.delete.confirm.title")}
				description={
					pendingDeleteEnrollment
						? t("project.enrollmentPage.delete.confirm.description", {
								project: pendingDeleteEnrollment.project.name,
								student: pendingDeleteEnrollment.student.account.name,
							})
						: ""
				}
				cancelLabel={t("common.cancel")}
				actionLabel={t("common.table.actions.delete")}
				onAction={onDeleteConfirm}
			/>

			<ServicePageConfirmDialog
				open={pendingStatusAction !== null}
				onOpenChange={onStatusOpenChange}
				variant={
					pendingStatusAction?.action === "accept" ||
					pendingStatusAction?.action === "complete"
						? "success"
						: pendingStatusAction?.action === "remove"
							? "danger"
							: "warning"
				}
				title={
					pendingStatusAction
						? t(
								`project.enrollmentPage.${pendingStatusAction.action}.confirm.title`,
							)
						: ""
				}
				description={
					pendingStatusAction
						? t(
								`project.enrollmentPage.${pendingStatusAction.action}.confirm.description`,
								{
									project: pendingStatusAction.enrollment.project.name,
									student: pendingStatusAction.enrollment.student.account.name,
								},
							)
						: ""
				}
				cancelLabel={t("common.cancel")}
				actionLabel={
					pendingStatusAction
						? t(
								`project.enrollmentPage.table.actions.${pendingStatusAction.action}`,
							)
						: ""
				}
				onAction={onStatusConfirm}
			/>
		</>
	);
}
