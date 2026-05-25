"use client";

import { useDeferredValue, useMemo, useState } from "react";

import { useTranslation } from "react-i18next";

import { Button, NoContentState, SomeErrorState, toast } from "@/components";
import { useStudentsQuery } from "@/features/academic/students/queries";
import { EnrollmentsFiltersDrawer } from "@/features/project/enrollments/EnrollmentsFiltersDrawer";
import { EnrollmentsRowActions } from "@/features/project/enrollments/EnrollmentsRowActions";
import {
	useDeleteEnrollmentMutation,
	useEnrollmentStatusMutation,
} from "@/features/project/enrollments/mutations";
import { useEnrollmentsQuery } from "@/features/project/enrollments/queries";
import {
	buildEnrollmentProjectOptions,
	buildEnrollmentStudentOptions,
	createEnrollmentColumns,
	createEnrollmentCompositeKey,
	filterEnrollments,
	getEnrollmentDeleteErrorToastContent,
	getEnrollmentEmptyStateCopy,
	getEnrollmentFilterSummary,
	getEnrollmentProjectsErrorToastContent,
	getEnrollmentsListErrorToastContent,
	getEnrollmentStatusActionErrorToastContent,
	getEnrollmentStudentsErrorToastContent,
	resolveEnrollmentProjectLabel,
	resolveEnrollmentStudentLabel,
} from "@/features/project/enrollments/utils";
import { useProjectsQuery } from "@/features/project/projects/queries";
import {
	ServicePageConfirmDialog,
	ServicePageHeader,
	ServicePageShell,
	ServicePageTableSection,
	TextFieldFilter,
} from "@/features/shared/service-pages";
import {
	useDeferredUndoAction,
	useDraftFilters,
	useQueryErrorToasts,
} from "@/hooks";
import type { EnrollmentResponse } from "@/types";
import type {
	EnrollmentSecondaryFilters,
	EnrollmentStatusAction,
} from "@/types";

function getStatusDialogVariant(action: EnrollmentStatusAction) {
	switch (action) {
		case "accept":
		case "complete":
			return "success" as const;
		case "cancel":
		case "reject":
			return "warning" as const;
		case "remove":
		default:
			return "danger" as const;
	}
}

export function EnrollmentsPage() {
	const { t } = useTranslation();
	const [querySearch, setQuerySearch] = useState("");
	const [filtersOpen, setFiltersOpen] = useState(false);
	const initialSecondaryFilters = useMemo<EnrollmentSecondaryFilters>(
		() => ({
			dateField: "",
			endDate: "",
			projectIdFilter: "",
			startDate: "",
			statusFilter: "",
			studentIdFilter: "",
		}),
		[],
	);
	const {
		appliedFilters,
		applyDraftFilters,
		clearFilters: clearDraftFilters,
		draftFilters,
		hasAppliedFilters,
		setDraftFilter,
	} = useDraftFilters<EnrollmentSecondaryFilters>({
		initialFilters: initialSecondaryFilters,
	});
	const [pendingDeleteEnrollment, setPendingDeleteEnrollment] =
		useState<EnrollmentResponse | null>(null);
	const [pendingStatusAction, setPendingStatusAction] = useState<{
		action: EnrollmentStatusAction;
		enrollment: EnrollmentResponse;
	} | null>(null);
	const deferredQuerySearch = useDeferredValue(querySearch.trim());
	const enrollmentsQuery = useEnrollmentsQuery();
	const projectsQuery = useProjectsQuery();
	const studentsQuery = useStudentsQuery();
	const deleteEnrollmentMutation = useDeleteEnrollmentMutation();
	const enrollmentStatusMutation = useEnrollmentStatusMutation();
	const { schedule } = useDeferredUndoAction();

	const projectById = useMemo(
		() =>
			new Map((projectsQuery.data ?? []).map(project => [project.id, project])),
		[projectsQuery.data],
	);
	const studentById = useMemo(
		() =>
			new Map(
				(studentsQuery.data ?? []).map(student => [student.accountId, student]),
			),
		[studentsQuery.data],
	);
	const projectOptions = useMemo(
		() => buildEnrollmentProjectOptions(projectsQuery.data ?? []),
		[projectsQuery.data],
	);
	const studentOptions = useMemo(
		() => buildEnrollmentStudentOptions(studentsQuery.data ?? []),
		[studentsQuery.data],
	);
	const filteredEnrollments = useMemo(
		() =>
			filterEnrollments(enrollmentsQuery.data ?? [], {
				dateField: appliedFilters.dateField,
				endDate: appliedFilters.endDate,
				projectById,
				projectIdFilter: appliedFilters.projectIdFilter,
				query: deferredQuerySearch,
				startDate: appliedFilters.startDate,
				statusFilter: appliedFilters.statusFilter,
				studentById,
				studentIdFilter: appliedFilters.studentIdFilter,
			}),
		[
			appliedFilters,
			deferredQuerySearch,
			enrollmentsQuery.data,
			projectById,
			studentById,
		],
	);
	const columns = useMemo(
		() => createEnrollmentColumns(t, projectById, studentById),
		[projectById, studentById, t],
	);
	const hasAnyFilters = Boolean(querySearch.trim() || hasAppliedFilters);
	const filterSummary = useMemo(
		() =>
			getEnrollmentFilterSummary(t, {
				dateField: appliedFilters.dateField,
				endDate: appliedFilters.endDate,
				projectById,
				projectIdFilter: appliedFilters.projectIdFilter,
				query: deferredQuerySearch,
				startDate: appliedFilters.startDate,
				statusFilter: appliedFilters.statusFilter,
				studentById,
				studentIdFilter: appliedFilters.studentIdFilter,
			}),
		[appliedFilters, deferredQuerySearch, projectById, studentById, t],
	);
	const emptyStateCopy = useMemo(
		() => getEnrollmentEmptyStateCopy(t, filterSummary),
		[filterSummary, t],
	);
	const tableEmptyState = useMemo(() => {
		if (enrollmentsQuery.isError) {
			return (
				<SomeErrorState
					title={t("project.enrollmentPage.table.error.title")}
					description={t("project.enrollmentPage.table.error.description")}
					onRefresh={() => {
						void enrollmentsQuery.refetch();
					}}
				/>
			);
		}

		return (
			<NoContentState
				title={emptyStateCopy.title}
				description={emptyStateCopy.description}
			/>
		);
	}, [emptyStateCopy.description, emptyStateCopy.title, enrollmentsQuery, t]);

	useQueryErrorToasts([
		{
			key: "enrollments-list",
			error: enrollmentsQuery.error,
			errorUpdatedAt: enrollmentsQuery.errorUpdatedAt,
			getContent: error => getEnrollmentsListErrorToastContent(t, error),
			isError: enrollmentsQuery.isError,
		},
		{
			key: "enrollment-projects",
			error: projectsQuery.error,
			errorUpdatedAt: projectsQuery.errorUpdatedAt,
			getContent: error => getEnrollmentProjectsErrorToastContent(t, error),
			isError: projectsQuery.isError,
		},
		{
			key: "enrollment-students",
			error: studentsQuery.error,
			errorUpdatedAt: studentsQuery.errorUpdatedAt,
			getContent: error => getEnrollmentStudentsErrorToastContent(t, error),
			isError: studentsQuery.isError,
		},
	]);

	function clearAllFilters() {
		setQuerySearch("");
		clearDraftFilters();
		setFiltersOpen(false);
	}

	function getEnrollmentLabel(enrollment: EnrollmentResponse) {
		return {
			project: resolveEnrollmentProjectLabel(projectById, enrollment.projectId),
			student: resolveEnrollmentStudentLabel(studentById, enrollment.studentId),
		};
	}

	function handleDeleteConfirm() {
		if (!pendingDeleteEnrollment) {
			return;
		}

		const enrollment = pendingDeleteEnrollment;
		const labels = getEnrollmentLabel(enrollment);
		setPendingDeleteEnrollment(null);

		schedule({
			key: createEnrollmentCompositeKey(
				enrollment.projectId,
				enrollment.studentId,
			),
			title: t("project.enrollmentPage.delete.undo.title"),
			description: t("project.enrollmentPage.delete.undo.description", labels),
			undoLabel: t("project.enrollmentPage.delete.undo.action"),
			onCommit: () => {
				deleteEnrollmentMutation.mutate(
					{
						projectId: enrollment.projectId,
						studentId: enrollment.studentId,
					},
					{
						onSuccess: () => {
							toast.success(
								t("project.enrollmentPage.delete.feedback.success.title"),
								{
									description: t(
										"project.enrollmentPage.delete.feedback.success.description",
										labels,
									),
								},
							);
						},
						onError: error => {
							const { title, description } =
								getEnrollmentDeleteErrorToastContent(t, error);
							toast.danger(title, { description });
						},
					},
				);
			},
		});
	}

	function handleStatusConfirm() {
		if (!pendingStatusAction) {
			return;
		}

		const currentAction = pendingStatusAction;
		const labels = getEnrollmentLabel(currentAction.enrollment);
		setPendingStatusAction(null);

		enrollmentStatusMutation.mutate(
			{
				action: currentAction.action,
				projectId: currentAction.enrollment.projectId,
				studentId: currentAction.enrollment.studentId,
			},
			{
				onSuccess: () => {
					toast.success(
						t(
							`project.enrollmentPage.${currentAction.action}.feedback.success.title`,
						),
						{
							description: t(
								`project.enrollmentPage.${currentAction.action}.feedback.success.description`,
								labels,
							),
						},
					);
				},
				onError: error => {
					const { title, description } =
						getEnrollmentStatusActionErrorToastContent(
							t,
							error,
							currentAction.action,
						);
					toast.danger(title, { description });
				},
			},
		);
	}

	return (
		<ServicePageShell>
			<ServicePageHeader
				title={t("project.enrollmentPage.title")}
				description={t("project.enrollmentPage.description")}
				metadata={{
					triggerLabel: t("project.enrollmentPage.metadata.trigger"),
					emptyTitle: t("project.enrollmentPage.metadata.empty.title"),
					emptyDescription: t(
						"project.enrollmentPage.metadata.empty.description",
					),
				}}
				actions={
					hasAnyFilters ? (
						<Button
							variant="secondary"
							onClick={clearAllFilters}
						>
							{t("project.enrollmentPage.filters.clear")}
						</Button>
					) : null
				}
				filtersClassName="grid gap-4 lg:grid-cols-[minmax(0,1.8fr)_auto]"
			>
				<TextFieldFilter
					label={t("project.enrollmentPage.filters.search.label")}
					value={querySearch}
					onChange={setQuerySearch}
					placeholder={t("project.enrollmentPage.filters.search.placeholder")}
				/>

				<EnrollmentsFiltersDrawer
					dateField={draftFilters.dateField}
					endDate={draftFilters.endDate}
					hasActiveFilters={hasAppliedFilters}
					onApply={() => {
						applyDraftFilters();
						setFiltersOpen(false);
					}}
					onClear={clearAllFilters}
					onDateFieldChange={value => setDraftFilter("dateField", value)}
					onEndDateChange={value => setDraftFilter("endDate", value)}
					onOpenChange={setFiltersOpen}
					onProjectIdFilterChange={value =>
						setDraftFilter("projectIdFilter", value)
					}
					onRefreshProjects={() => {
						void projectsQuery.refetch();
					}}
					onRefreshStudents={() => {
						void studentsQuery.refetch();
					}}
					onStartDateChange={value => setDraftFilter("startDate", value)}
					onStatusFilterChange={value => setDraftFilter("statusFilter", value)}
					onStudentIdFilterChange={value =>
						setDraftFilter("studentIdFilter", value)
					}
					open={filtersOpen}
					projectIdFilter={draftFilters.projectIdFilter}
					projectOptions={projectOptions}
					projectsError={projectsQuery.isError}
					startDate={draftFilters.startDate}
					statusFilter={draftFilters.statusFilter}
					studentIdFilter={draftFilters.studentIdFilter}
					studentOptions={studentOptions}
					studentsError={studentsQuery.isError}
				/>
			</ServicePageHeader>

			<ServicePageTableSection<EnrollmentResponse>
				tableProps={{
					className: "h-full",
					columns,
					data: filteredEnrollments,
					emptyState: tableEmptyState,
					getRowActions: row => (
						<EnrollmentsRowActions
							enrollment={row}
							href={`/project/enrollments/${createEnrollmentCompositeKey(row.projectId, row.studentId)}`}
							onDelete={setPendingDeleteEnrollment}
							onStatusAction={(enrollment, action) =>
								setPendingStatusAction({ action, enrollment })
							}
						/>
					),
					isLoading: enrollmentsQuery.isLoading,
					loadingLabel: t("project.enrollmentPage.loading.list"),
				}}
			/>

			<ServicePageConfirmDialog
				open={pendingDeleteEnrollment !== null}
				onOpenChange={open => {
					if (!open) {
						setPendingDeleteEnrollment(null);
					}
				}}
				variant="danger"
				title={t("project.enrollmentPage.delete.confirm.title")}
				description={t("project.enrollmentPage.delete.confirm.description", {
					project: pendingDeleteEnrollment
						? resolveEnrollmentProjectLabel(
								projectById,
								pendingDeleteEnrollment.projectId,
							)
						: "",
					student: pendingDeleteEnrollment
						? resolveEnrollmentStudentLabel(
								studentById,
								pendingDeleteEnrollment.studentId,
							)
						: "",
				})}
				cancelLabel={t("common.cancel")}
				actionLabel={t("project.enrollmentPage.table.actions.delete")}
				onAction={handleDeleteConfirm}
			/>

			<ServicePageConfirmDialog
				open={pendingStatusAction !== null}
				onOpenChange={open => {
					if (!open) {
						setPendingStatusAction(null);
					}
				}}
				variant={
					pendingStatusAction
						? getStatusDialogVariant(pendingStatusAction.action)
						: "success"
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
								getEnrollmentLabel(pendingStatusAction.enrollment),
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
				onAction={handleStatusConfirm}
			/>
		</ServicePageShell>
	);
}
