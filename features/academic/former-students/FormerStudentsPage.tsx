"use client";

import { useDeferredValue, useMemo, useState } from "react";

import { useTranslation } from "react-i18next";

import { get as getFormerStudent } from "@/api/web/academic/former-students";
import { get as getAccount } from "@/api/web/identity/accounts";
import { get as getUser } from "@/api/web/identity/users";
import { NoContentState, SomeErrorState, toast } from "@/components";
import { useCoursesQuery } from "@/features/academic/courses/queries";
import { FormerStudentEditorDrawer } from "@/features/academic/former-students/FormerStudentEditorDrawer";
import { FormerStudentsFiltersDrawer } from "@/features/academic/former-students/FormerStudentsFiltersDrawer";
import { FormerStudentsRowActions } from "@/features/academic/former-students/FormerStudentsRowActions";
import {
	useCreateFormerStudentMutation,
	useRemoveFormerStudentMutation,
	useSetFormerStudentActiveMutation,
} from "@/features/academic/former-students/mutations";
import { useFormerStudentsQuery } from "@/features/academic/former-students/queries";
import {
	buildFormerStudentAreaOfExpertiseOptions,
	buildFormerStudentCourseOptions,
	buildFormerStudentDirectoryItems,
	appendCopyToEmail,
	createFormerStudentColumns,
	filterFormerStudents,
	getStudentCoursesErrorToastContent,
	getStudentDeleteErrorToastContent,
	getStudentDuplicateErrorToastContent,
	getStudentEmptyStateCopy,
	getStudentFilterSummary,
	getStudentSetActiveErrorToastContent,
	getStudentsListErrorToastContent,
} from "@/features/academic/former-students/utils";
import { useAccountsQuery } from "@/features/identity/accounts/queries";
import { useUsersQuery } from "@/features/identity/users/queries";
import {
	ServicePageConfirmDialog,
	ServicePageHeader,
	ServicePageHeaderActions,
	ServicePageShell,
	ServicePageTableSection,
	TextFieldFilter,
} from "@/features/shared/service-pages";
import {
	useDeferredUndoAction,
	useDraftFilters,
	useQueryErrorToasts,
	useServicePageEditorState,
} from "@/hooks";
import type {
	FormerStudentDirectoryItem,
	FormerStudentEditorMode,
	FormerStudentSecondaryFilters,
} from "@/types";

export function FormerStudentsPage() {
	const { t } = useTranslation();
	const [querySearch, setQuerySearch] = useState("");
	const [registrationSearch, setRegistrationSearch] = useState("");
	const [filtersOpen, setFiltersOpen] = useState(false);
	const initialSecondaryFilters = useMemo<FormerStudentSecondaryFilters>(
		() => ({
			name: "",
			cpf: "",
			email: "",
			academicRegistration: "",
			activeOnly: true,
			campi: [],
			courseIds: [],
			areaOfExpertiseIds: [],
			includeConcluded: false,
			periodFrom: "",
			periodTo: "",
			dateFrom: "",
			dateTo: "",
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
	} = useDraftFilters<FormerStudentSecondaryFilters>({
		initialFilters: initialSecondaryFilters,
	});
	const editorState = useServicePageEditorState<FormerStudentEditorMode>({
		createMode: "create",
		defaultMode: "update",
	});
	const [pendingStatusStudent, setPendingStatusStudent] =
		useState<FormerStudentDirectoryItem | null>(null);
	const [pendingDeleteStudent, setPendingDeleteStudent] =
		useState<FormerStudentDirectoryItem | null>(null);
	const deferredQuerySearch = useDeferredValue(querySearch.trim());
	const deferredRegistrationSearch = useDeferredValue(
		registrationSearch.trim(),
	);
	const formerStudentsQuery = useFormerStudentsQuery();
	const coursesQuery = useCoursesQuery();
	const accountsQuery = useAccountsQuery();
	const usersQuery = useUsersQuery();
	const createFormerStudentMutation = useCreateFormerStudentMutation();
	const removeFormerStudentMutation = useRemoveFormerStudentMutation();
	const setFormerStudentActiveMutation = useSetFormerStudentActiveMutation();
	const { schedule } = useDeferredUndoAction();

	const courseById = useMemo(
		() => new Map((coursesQuery.data ?? []).map(course => [course.id, course])),
		[coursesQuery.data],
	);
	const courseOptions = useMemo(
		() => buildFormerStudentCourseOptions(coursesQuery.data ?? []),
		[coursesQuery.data],
	);
	const areaOfExpertiseOptions = useMemo(
		() => buildFormerStudentAreaOfExpertiseOptions(coursesQuery.data ?? []),
		[coursesQuery.data],
	);
	const directoryItems = useMemo(
		() =>
			buildFormerStudentDirectoryItems(
				formerStudentsQuery.data ?? [],
				accountsQuery.data ?? [],
				usersQuery.data ?? [],
				coursesQuery.data ?? [],
			),
		[
			accountsQuery.data,
			coursesQuery.data,
			formerStudentsQuery.data,
			usersQuery.data,
		],
	);
	const filteredStudents = useMemo(
		() =>
			filterFormerStudents(directoryItems, {
				academicRegistration: appliedFilters.academicRegistration,
				activeOnly: appliedFilters.activeOnly,
				areaOfExpertiseIds: appliedFilters.areaOfExpertiseIds,
				campi: appliedFilters.campi,
				cpf: appliedFilters.cpf,
				courseById,
				courseIds: appliedFilters.courseIds,
				dateFrom: appliedFilters.dateFrom,
				dateTo: appliedFilters.dateTo,
				email: appliedFilters.email,
				includeConcluded: appliedFilters.includeConcluded,
				name: appliedFilters.name,
				periodFrom: appliedFilters.periodFrom,
				periodTo: appliedFilters.periodTo,
				query: deferredQuerySearch,
				registrationQuery: deferredRegistrationSearch,
			}),
		[
			appliedFilters,
			courseById,
			deferredQuerySearch,
			deferredRegistrationSearch,
			directoryItems,
		],
	);
	const columns = useMemo(() => createFormerStudentColumns(t), [t]);
	const hasAnyFilters = Boolean(
		querySearch.trim() || registrationSearch.trim() || hasAppliedFilters,
	);
	const filterSummary = useMemo(
		() =>
			getStudentFilterSummary(t, {
				academicRegistration: appliedFilters.academicRegistration,
				activeOnly: appliedFilters.activeOnly,
				areaOfExpertiseIds: appliedFilters.areaOfExpertiseIds,
				campi: appliedFilters.campi,
				cpf: appliedFilters.cpf,
				courseById,
				courseIds: appliedFilters.courseIds,
				dateFrom: appliedFilters.dateFrom,
				dateTo: appliedFilters.dateTo,
				email: appliedFilters.email,
				includeConcluded: appliedFilters.includeConcluded,
				name: appliedFilters.name,
				periodFrom: appliedFilters.periodFrom,
				periodTo: appliedFilters.periodTo,
				query: deferredQuerySearch,
				registrationQuery: deferredRegistrationSearch,
			}),
		[
			appliedFilters,
			courseById,
			deferredQuerySearch,
			deferredRegistrationSearch,
			t,
		],
	);
	const emptyStateCopy = useMemo(
		() => getStudentEmptyStateCopy(t, filterSummary),
		[filterSummary, t],
	);
	const tableEmptyState = useMemo(() => {
		if (formerStudentsQuery.isError) {
			return (
				<SomeErrorState
					title={t("academic.studentPage.table.error.title")}
					description={t("academic.studentPage.table.error.description")}
					onRefresh={() => {
						void formerStudentsQuery.refetch();
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
	}, [
		emptyStateCopy.description,
		emptyStateCopy.title,
		formerStudentsQuery,
		t,
	]);

	useQueryErrorToasts([
		{
			key: "former-students-list",
			error: formerStudentsQuery.error,
			errorUpdatedAt: formerStudentsQuery.errorUpdatedAt,
			getContent: error => getStudentsListErrorToastContent(t, error),
			isError: formerStudentsQuery.isError,
		},
		{
			key: "former-student-courses",
			error: coursesQuery.error,
			errorUpdatedAt: coursesQuery.errorUpdatedAt,
			getContent: error => getStudentCoursesErrorToastContent(t, error),
			isError: coursesQuery.isError,
		},
	]);

	function clearAllFilters() {
		setQuerySearch("");
		setRegistrationSearch("");
		clearDraftFilters();
		setFiltersOpen(false);
	}

	async function handleDuplicate(formerStudent: FormerStudentDirectoryItem) {
		try {
			const formerStudentDetail = await getFormerStudent(
				formerStudent.accountId,
			);
			const linkedAccount = await getAccount(formerStudent.accountId);
			const linkedUser = await getUser(linkedAccount.userId);

			createFormerStudentMutation.mutate(
				{
					body: {
						cpf: linkedUser.cpf,
						name: linkedUser.name,
						email: appendCopyToEmail(
							linkedAccount.email,
							(accountsQuery.data ?? []).map(account => account.email),
						),
						academicRegistration: formerStudentDetail.academicRegistration,
						campus: formerStudentDetail.campus.campus,
						courseId: formerStudentDetail.courseId,
						requiredHours: formerStudentDetail.counterpartHours.requiredHours,
						startDate: formerStudentDetail.period.startDate,
						dueDate: formerStudentDetail.period.dueDate,
					},
				},
				{
					onSuccess: () => {
						toast.success(
							t("academic.studentPage.duplicate.feedback.success.title"),
							{
								description: t(
									"academic.studentPage.duplicate.feedback.success.description",
									{
										name: linkedUser.name,
									},
								),
							},
						);
					},
					onError: error => {
						const { title, description } = getStudentDuplicateErrorToastContent(
							t,
							error,
						);
						toast.danger(title, { description });
					},
				},
			);
		} catch (error) {
			const { title, description } = getStudentDuplicateErrorToastContent(
				t,
				error,
			);
			toast.danger(title, { description });
		}
	}

	function handleStatusConfirm() {
		if (!pendingStatusStudent) {
			return;
		}

		const formerStudent = pendingStatusStudent;
		const nextActive = !(formerStudent.account?.active ?? false);

		setFormerStudentActiveMutation.mutate(
			{
				id: formerStudent.accountId,
				active: nextActive,
			},
			{
				onSuccess: () => {
					toast.success(
						t(
							nextActive
								? "academic.studentPage.reactivate.feedback.success.title"
								: "academic.studentPage.deactivate.feedback.success.title",
						),
						{
							description: t(
								nextActive
									? "academic.studentPage.reactivate.feedback.success.description"
									: "academic.studentPage.deactivate.feedback.success.description",
								{
									name: formerStudent.user?.name ?? formerStudent.accountId,
								},
							),
						},
					);
					setPendingStatusStudent(null);
				},
				onError: error => {
					const { title, description } = getStudentSetActiveErrorToastContent(
						t,
						error,
						nextActive,
					);
					toast.danger(title, { description });
					setPendingStatusStudent(null);
				},
			},
		);
	}

	function handleDeleteConfirm() {
		if (!pendingDeleteStudent) {
			return;
		}

		const formerStudent = pendingDeleteStudent;
		setPendingDeleteStudent(null);

		schedule({
			key: formerStudent.accountId,
			title: t("academic.studentPage.delete.undo.title"),
			description: t("academic.studentPage.delete.undo.description", {
				name: formerStudent.user?.name ?? formerStudent.accountId,
			}),
			undoLabel: t("academic.studentPage.delete.undo.action"),
			onCommit: () => {
				removeFormerStudentMutation.mutate(
					{
						accountId: formerStudent.accountId,
						userId: formerStudent.account?.userId ?? "",
					},
					{
						onSuccess: () => {
							toast.success(
								t("academic.studentPage.delete.feedback.success.title"),
								{
									description: t(
										"academic.studentPage.delete.feedback.success.description",
										{
											name: formerStudent.user?.name ?? formerStudent.accountId,
										},
									),
								},
							);

							editorState.clearIfMatches(formerStudent.accountId);
						},
						onError: error => {
							const { title, description } = getStudentDeleteErrorToastContent(
								t,
								error,
							);
							toast.danger(title, { description });
						},
					},
				);
			},
		});
	}

	return (
		<ServicePageShell>
			<ServicePageHeader
				title={t("academic.studentPage.title")}
				description={t("academic.studentPage.description")}
				metadata={{
					triggerLabel: t("academic.studentPage.metadata.trigger"),
					emptyTitle: t("academic.studentPage.metadata.empty.title"),
					emptyDescription: t(
						"academic.studentPage.metadata.empty.description",
					),
				}}
				actions={
					<ServicePageHeaderActions
						clearLabel={t("academic.studentPage.filters.clear")}
						createLabel={t("academic.studentPage.create.open")}
						hasFilters={hasAnyFilters}
						onClear={clearAllFilters}
						onCreate={editorState.openCreate}
					/>
				}
				filtersClassName="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_auto]"
			>
				<TextFieldFilter
					label={t("academic.studentPage.filters.search.label")}
					value={querySearch}
					onChange={setQuerySearch}
					placeholder={t("academic.studentPage.filters.search.placeholder")}
				/>

				<TextFieldFilter
					label={t(
						"academic.studentPage.filters.frontendAcademicRegistration.label",
					)}
					value={registrationSearch}
					onChange={setRegistrationSearch}
					placeholder={t(
						"academic.studentPage.filters.frontendAcademicRegistration.placeholder",
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
					coursesError={coursesQuery.isError}
					hasActiveFilters={hasAppliedFilters}
					isCoursesLoading={coursesQuery.isLoading}
					isAreasOfExpertiseLoading={coursesQuery.isLoading}
					onNameChange={value => setDraftFilter("name", value)}
					onCpfChange={value => setDraftFilter("cpf", value)}
					onEmailChange={value => setDraftFilter("email", value)}
					onAcademicRegistrationChange={value =>
						setDraftFilter("academicRegistration", value)
					}
					onActiveOnlyChange={value => setDraftFilter("activeOnly", value)}
					onApply={() => {
						applyDraftFilters();
						setFiltersOpen(false);
					}}
					onCampiChange={value => setDraftFilter("campi", value)}
					onClear={clearAllFilters}
					onCourseIdsChange={value => setDraftFilter("courseIds", value)}
					onAreaOfExpertiseIdsChange={value =>
						setDraftFilter("areaOfExpertiseIds", value)
					}
					onIncludeConcludedChange={value =>
						setDraftFilter("includeConcluded", value)
					}
					onPeriodFromChange={value => setDraftFilter("periodFrom", value)}
					onPeriodToChange={value => setDraftFilter("periodTo", value)}
					onDateFromChange={value => setDraftFilter("dateFrom", value)}
					onDateToChange={value => setDraftFilter("dateTo", value)}
					onOpenChange={setFiltersOpen}
					onRefreshCourses={() => {
						void coursesQuery.refetch();
					}}
					open={filtersOpen}
				/>
			</ServicePageHeader>

			<ServicePageTableSection<FormerStudentDirectoryItem>
				tableProps={{
					className: "h-full",
					columns,
					data: filteredStudents,
					emptyState: tableEmptyState,
					getRowActions: row => (
						<FormerStudentsRowActions
							href={`/academic/former-students/${row.accountId}`}
							formerStudent={row}
							onDelete={setPendingDeleteStudent}
							onDuplicate={handleDuplicate}
							onOpenEditor={editorState.openEditor}
							onSetActive={formerStudent =>
								setPendingStatusStudent(formerStudent)
							}
						/>
					),
					isLoading:
						formerStudentsQuery.isLoading ||
						coursesQuery.isLoading ||
						accountsQuery.isLoading ||
						usersQuery.isLoading,
					loadingLabel: t("academic.studentPage.loading.list"),
				}}
			/>

			<FormerStudentEditorDrawer
				mode={editorState.editorMode}
				onOpenChange={editorState.handleOpenChange}
				open={editorState.isOpen}
				formerStudentId={editorState.editorId}
			/>

			<ServicePageConfirmDialog
				open={pendingStatusStudent !== null}
				onOpenChange={open => {
					if (!open) {
						setPendingStatusStudent(null);
					}
				}}
				variant={pendingStatusStudent?.account?.active ? "warning" : "success"}
				title={t(
					pendingStatusStudent?.account?.active
						? "academic.studentPage.deactivate.confirm.title"
						: "academic.studentPage.reactivate.confirm.title",
				)}
				description={t(
					pendingStatusStudent?.account?.active
						? "academic.studentPage.deactivate.confirm.description"
						: "academic.studentPage.reactivate.confirm.description",
					{
						name: pendingStatusStudent?.user?.name ?? "",
					},
				)}
				cancelLabel={t("common.cancel")}
				actionLabel={t(
					pendingStatusStudent?.account?.active
						? "common.table.actions.deactivate"
						: "common.table.actions.reactivate",
				)}
				onAction={handleStatusConfirm}
			/>

			<ServicePageConfirmDialog
				open={pendingDeleteStudent !== null}
				onOpenChange={open => {
					if (!open) {
						setPendingDeleteStudent(null);
					}
				}}
				variant="danger"
				title={t("academic.studentPage.delete.confirm.title")}
				description={t("academic.studentPage.delete.confirm.description", {
					name: pendingDeleteStudent?.user?.name ?? "",
				})}
				cancelLabel={t("common.cancel")}
				actionLabel={t("common.table.actions.delete")}
				onAction={handleDeleteConfirm}
			/>
		</ServicePageShell>
	);
}
