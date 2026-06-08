"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";

import { useTranslation } from "react-i18next";

import * as web from "@/api/web";
import { NoContentState, SomeErrorState, toast } from "@/components/primitives";
import { DEFAULT_SERVICE_PAGE_SIZE } from "@/constants";
import {
	buildProjectCreatorOptions,
	buildProjectEntityOptions,
	createProjectColumns,
	filterProjectsByBackendFilters,
	filterProjectsByFrontendFilters,
	getProjectDeleteErrorToastContent,
	getProjectDuplicateErrorToastContent,
	getProjectEmptyStateCopy,
	getProjectEntitiesErrorToastContent,
	getProjectFilterSummary,
	getProjectsListErrorToastContent,
	getProjectStatusActionErrorToastContent,
	getProjectStatusOptions,
} from "@/features/project/projects/utils";
import {
	appendCopyToText,
	getCrudDeleteUndoToastContent,
	getCrudSuccessToastContent,
} from "@/features/utils";
import {
	useDeferredUndoAction,
	useDraftFilters,
	useQueryErrorToasts,
	useServicePageEditorState,
	useServicePagePagination,
} from "@/hooks";
import type { ProjectResponse, ProjectStatus } from "@/types/api";
import type {
	ProjectComplexSearchFilters,
	ProjectEditorMode,
	ProjectStatusAction,
} from "@/types/client";

const { entities: entitiesApi } = web.partner;
const { projects: projectsApi } = web.project;
const { useEntitiesQuery } = entitiesApi;
const {
	useCreateProjectMutation,
	useProjectStatusMutation,
	useRemoveProjectMutation,
	useProjectsQuery,
	useProjectsSearchQuery,
} = projectsApi;

export function useProjectsPage() {
	const { t } = useTranslation();
	const [querySearch, setQuerySearch] = useState("");
	const [frontendStatuses, setFrontendStatuses] = useState<ProjectStatus[]>([]);
	const [filtersOpen, setFiltersOpen] = useState(false);
	const [pendingDeleteProject, setPendingDeleteProject] =
		useState<ProjectResponse | null>(null);
	const [pendingStatusAction, setPendingStatusAction] = useState<{
		action: ProjectStatusAction;
		project: ProjectResponse;
	} | null>(null);
	const initialBackendFilters = useMemo<ProjectComplexSearchFilters>(
		() => ({
			name: "",
			entityIds: [],
			description: "",
			createdByIds: [],
			statuses: [],
			maxOfferedHours: "",
			minOfferedHours: "",
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
	} = useDraftFilters<ProjectComplexSearchFilters>({
		initialFilters: initialBackendFilters,
	});
	const editorState = useServicePageEditorState<ProjectEditorMode>({
		createMode: "create",
		defaultMode: "update",
	});
	const projectsPagination = useServicePagePagination({
		key: "project.projects",
	});
	const deferredQuerySearch = useDeferredValue(querySearch.trim());
	const projectsQuery = useProjectsQuery();
	const projectsSearchQuery = useProjectsSearchQuery(
		projectsPagination.backendPage ?? 0,
		projectsPagination.backendSize ?? DEFAULT_SERVICE_PAGE_SIZE,
		appliedFilters,
		!projectsPagination.isAll,
	);
	const entitiesQuery = useEntitiesQuery();
	const createProjectMutation = useCreateProjectMutation();
	const removeProjectMutation = useRemoveProjectMutation();
	const projectStatusMutation = useProjectStatusMutation();
	const { schedule } = useDeferredUndoAction();
	const activeQueryError = projectsPagination.isAll
		? projectsQuery.error
		: projectsSearchQuery.error;
	const activeQueryErrorUpdatedAt = projectsPagination.isAll
		? projectsQuery.errorUpdatedAt
		: projectsSearchQuery.errorUpdatedAt;
	const activeQueryIsError = projectsPagination.isAll
		? projectsQuery.isError
		: projectsSearchQuery.isError;
	const activeQueryIsLoading = projectsPagination.isAll
		? projectsQuery.isLoading
		: projectsSearchQuery.isLoading;

	const entityById = useMemo(
		() =>
			new Map((entitiesQuery.data ?? []).map(entity => [entity.id, entity])),
		[entitiesQuery.data],
	);
	const entityOptions = useMemo(
		() => buildProjectEntityOptions(entitiesQuery.data ?? []),
		[entitiesQuery.data],
	);
	const creatorOptions = useMemo(
		() =>
			projectsQuery.data
				? buildProjectCreatorOptions(
						Array.from(
							new Map(
								projectsQuery.data.map(project => [
									project.projectInfo.createdBy.id,
									project.projectInfo.createdBy,
								]),
							).values(),
						),
					)
				: [],
		[projectsQuery.data],
	);
	const statusOptions = useMemo(() => getProjectStatusOptions(t), [t]);
	const backendFilteredAllProjects = useMemo(
		() =>
			projectsPagination.isAll
				? filterProjectsByBackendFilters(
						projectsQuery.data ?? [],
						appliedFilters,
					)
				: [],
		[appliedFilters, projectsPagination.isAll, projectsQuery.data],
	);
	const tableSourceProjects = useMemo(
		() =>
			projectsPagination.isAll
				? backendFilteredAllProjects
				: (projectsSearchQuery.data?.content ?? []),
		[
			backendFilteredAllProjects,
			projectsPagination.isAll,
			projectsSearchQuery.data,
		],
	);
	const filteredProjects = useMemo(
		() =>
			filterProjectsByFrontendFilters(tableSourceProjects, {
				query: deferredQuerySearch,
				statuses: frontendStatuses,
			}),
		[deferredQuerySearch, frontendStatuses, tableSourceProjects],
	);
	const columns = useMemo(() => createProjectColumns(t), [t]);
	const hasAnyFilters = Boolean(
		querySearch.trim() || frontendStatuses.length > 0 || hasAppliedFilters,
	);
	const filterSummary = useMemo(
		() =>
			getProjectFilterSummary(t, {
				dateFrom: appliedFilters.dateFrom,
				dateTo: appliedFilters.dateTo,
				description: appliedFilters.description,
				entityById,
				entityIds: appliedFilters.entityIds,
				maxOfferedHours: appliedFilters.maxOfferedHours,
				minOfferedHours: appliedFilters.minOfferedHours,
				name: appliedFilters.name,
				query: deferredQuerySearch,
				statuses: appliedFilters.statuses,
			}),
		[appliedFilters, deferredQuerySearch, entityById, t],
	);
	const emptyStateCopy = useMemo(
		() => getProjectEmptyStateCopy(t, filterSummary),
		[filterSummary, t],
	);
	const tableEmptyState = useMemo(() => {
		if (activeQueryIsError) {
			return (
				<SomeErrorState
					title={t("common.loadErrors.projects.title")}
					description={t("common.loadErrors.projects.description")}
					onRefresh={() => {
						if (projectsPagination.isAll) {
							void projectsQuery.refetch();
							return;
						}

						void projectsSearchQuery.refetch();
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
		activeQueryIsError,
		emptyStateCopy.description,
		emptyStateCopy.title,
		projectsPagination.isAll,
		projectsQuery,
		projectsSearchQuery,
		t,
	]);

	const totalElements = projectsPagination.isAll
		? backendFilteredAllProjects.length
		: (projectsSearchQuery.data?.totalElements ?? 0);
	const totalPages = projectsPagination.isAll
		? 1
		: Math.max(projectsSearchQuery.data?.totalPages ?? 1, 1);

	useEffect(() => {
		if (
			projectsPagination.isAll ||
			!projectsSearchQuery.data ||
			projectsPagination.currentPage <= totalPages
		) {
			return;
		}

		projectsPagination.setCurrentPage(totalPages);
	}, [projectsPagination, projectsSearchQuery.data, totalPages]);

	useQueryErrorToasts([
		{
			key: "projects-list",
			error: activeQueryError,
			errorUpdatedAt: activeQueryErrorUpdatedAt,
			getContent: error => getProjectsListErrorToastContent(t, error),
			isError: activeQueryIsError,
		},
		{
			key: "projects-entities",
			error: entitiesQuery.error,
			errorUpdatedAt: entitiesQuery.errorUpdatedAt,
			getContent: error => getProjectEntitiesErrorToastContent(t, error),
			isError: entitiesQuery.isError,
		},
	]);

	function clearAllFilters() {
		setQuerySearch("");
		setFrontendStatuses([]);
		clearDraftFilters();
		projectsPagination.resetPage();
		setFiltersOpen(false);
	}

	function handleDuplicate(project: ProjectResponse) {
		createProjectMutation.mutate(
			{
				body: {
					description: project.description,
					entityId: project.entity.id,
					maxParticipants: project.projectInfo.maxParticipants,
					name: appendCopyToText(project.name),
					offeredHours: project.projectInfo.offeredHours ?? 0,
				},
			},
			{
				onSuccess: createdProject => {
					const { title, description } = getCrudSuccessToastContent(
						t,
						"duplicate",
						createdProject.name,
					);
					toast.success(title, { description });
				},
				onError: error => {
					const { title, description } = getProjectDuplicateErrorToastContent(
						t,
						error,
					);
					toast.danger(title, { description });
				},
			},
		);
	}

	function handleDeleteConfirm() {
		if (!pendingDeleteProject) {
			return;
		}

		const project = pendingDeleteProject;
		setPendingDeleteProject(null);

		schedule({
			key: project.id,
			...getCrudDeleteUndoToastContent(t, project.name),
			onCommit: () => {
				removeProjectMutation.mutate(
					{
						id: project.id,
					},
					{
						onSuccess: () => {
							const { title, description } = getCrudSuccessToastContent(
								t,
								"delete",
								project.name,
							);
							toast.success(title, { description });

							editorState.clearIfMatches(project.id);
						},
						onError: error => {
							const { title, description } = getProjectDeleteErrorToastContent(
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

	function handleStatusConfirm() {
		if (!pendingStatusAction) {
			return;
		}

		const currentAction = pendingStatusAction;
		setPendingStatusAction(null);

		projectStatusMutation.mutate(
			{
				action: currentAction.action,
				id: currentAction.project.id,
			},
			{
				onSuccess: project => {
					toast.success(
						t(
							`project.projectPage.${currentAction.action}.feedback.success.title`,
						),
						{
							description: t(
								`project.projectPage.${currentAction.action}.feedback.success.description`,
								{
									name: project.name,
								},
							),
						},
					);
				},
				onError: error => {
					const { title, description } =
						getProjectStatusActionErrorToastContent(
							t,
							error,
							currentAction.action,
						);
					toast.danger(title, { description });
				},
			},
		);
	}

	return {
		t,
		editorState,
		querySearch,
		setQuerySearch,
		frontendStatuses,
		setFrontendStatuses,
		filtersOpen,
		setFiltersOpen,
		draftFilters,
		hasAppliedFilters,
		entityOptions,
		creatorOptions,
		statusOptions,
		entitiesQuery,
		projectsQuery,
		columns,
		filteredProjects,
		activeQueryIsLoading,
		tableEmptyState,
		hasAnyFilters,
		totalElements,
		totalPages,
		projectsPagination,
		pendingDeleteProject,
		setPendingDeleteProject,
		pendingStatusAction,
		setPendingStatusAction,
		handleDeleteConfirm,
		handleDuplicate,
		handleStatusConfirm,
		clearAllFilters,
		applyDraftFilters,
		setDraftFilter,
	};
}
