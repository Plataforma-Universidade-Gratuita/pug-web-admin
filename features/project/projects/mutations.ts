"use client";

import {
	useMutation,
	useQueryClient,
	type QueryClient,
} from "@tanstack/react-query";

import {
	create,
	remove,
	update,
	updateStatus,
} from "@/api/web/project/projects";
import { projectQueryKeys } from "@/features/project/projects/queries";
import type { ProjectResponse } from "@/types";
import type {
	ProjectCreateMutationVariables,
	ProjectRemoveMutationVariables,
	ProjectStatusMutationVariables,
	ProjectUpdateMutationVariables,
} from "@/types";

function upsertListItem<TItem>(
	items: TItem[] | undefined,
	nextItem: TItem,
	getId: (item: TItem) => string,
) {
	if (!items) {
		return [nextItem];
	}

	const nextId = getId(nextItem);
	const existingIndex = items.findIndex(item => getId(item) === nextId);

	if (existingIndex === -1) {
		return [nextItem, ...items];
	}

	return items.map((item, index) =>
		index === existingIndex ? nextItem : item,
	);
}

function removeListItem<TItem>(
	items: TItem[] | undefined,
	id: string,
	getId: (item: TItem) => string,
) {
	return items?.filter(item => getId(item) !== id) ?? items;
}

function writeProjectCaches(
	queryClient: QueryClient,
	project: ProjectResponse,
) {
	queryClient.setQueryData(projectQueryKeys.detail(project.id), project);
	queryClient.setQueryData<ProjectResponse[]>(
		projectQueryKeys.list(),
		current => upsertListItem(current, project, item => item.id),
	);
}

function removeProjectCaches(queryClient: QueryClient, projectId: string) {
	queryClient.setQueryData<ProjectResponse[]>(
		projectQueryKeys.list(),
		current => removeListItem(current, projectId, item => item.id),
	);
	queryClient.removeQueries({ queryKey: projectQueryKeys.detail(projectId) });
	queryClient.removeQueries({
		queryKey: projectQueryKeys.areasOfExpertise(projectId),
	});
}

async function runProjectStatusAction({
	action,
	id,
}: ProjectStatusMutationVariables) {
	switch (action) {
		case "cancel":
			return updateStatus(id, "CANCELED");
		case "complete":
			return updateStatus(id, "COMPLETED");
		case "hold":
			return updateStatus(id, "ON_HOLD");
		case "retake":
			return updateStatus(id, "IN_PROGRESS");
		case "start":
		default:
			return updateStatus(id, "IN_PROGRESS");
	}
}

export function useCreateProjectMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ body }: ProjectCreateMutationVariables) => create(body),
		onSuccess: project => {
			writeProjectCaches(queryClient, project);
		},
	});
}

export function useUpdateProjectMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ body, id }: ProjectUpdateMutationVariables) =>
			update(id, body),
		onSuccess: project => {
			writeProjectCaches(queryClient, project);
		},
	});
}

export function useRemoveProjectMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id }: ProjectRemoveMutationVariables) => remove(id),
		onSuccess: (_data, variables) => {
			removeProjectCaches(queryClient, variables.id);
		},
	});
}

export function useProjectStatusMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: runProjectStatusAction,
		onSuccess: project => {
			writeProjectCaches(queryClient, project);
		},
	});
}
