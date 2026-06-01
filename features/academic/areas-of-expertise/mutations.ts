"use client";

import {
	useMutation,
	useQueryClient,
	type QueryClient,
} from "@tanstack/react-query";

import { create, remove, update } from "@/api/web/academic/areas-of-expertise";
import { areaOfExpertiseQueryKeys } from "@/features/academic/areas-of-expertise/queries";
import type { AreaOfExpertiseResponse } from "@/types";
import type {
	AreaOfExpertiseCreateMutationVariables,
	AreaOfExpertiseUpdateMutationVariables,
	RemoveAreaOfExpertiseMutationVariables,
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

function writeAreaOfExpertiseCaches(
	queryClient: QueryClient,
	areaOfExpertise: AreaOfExpertiseResponse,
) {
	queryClient.setQueryData(
		areaOfExpertiseQueryKeys.detail(areaOfExpertise.id),
		areaOfExpertise,
	);
	queryClient.setQueryData<AreaOfExpertiseResponse[]>(
		areaOfExpertiseQueryKeys.list(),
		current => upsertListItem(current, areaOfExpertise, item => item.id),
	);
}

function removeAreaOfExpertiseCaches(
	queryClient: QueryClient,
	areaOfExpertiseId: string,
) {
	queryClient.setQueryData<AreaOfExpertiseResponse[]>(
		areaOfExpertiseQueryKeys.list(),
		current => removeListItem(current, areaOfExpertiseId, item => item.id),
	);
	queryClient.removeQueries({
		queryKey: areaOfExpertiseQueryKeys.detail(areaOfExpertiseId),
	});
}

export function useCreateAreaOfExpertiseMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ body }: AreaOfExpertiseCreateMutationVariables) =>
			create(body),
		onSuccess: areaOfExpertise => {
			writeAreaOfExpertiseCaches(queryClient, areaOfExpertise);
		},
	});
}

export function useUpdateAreaOfExpertiseMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, body }: AreaOfExpertiseUpdateMutationVariables) =>
			update(id, body),
		onSuccess: areaOfExpertise => {
			writeAreaOfExpertiseCaches(queryClient, areaOfExpertise);
		},
	});
}

export function useRemoveAreaOfExpertiseMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id }: RemoveAreaOfExpertiseMutationVariables) => remove(id),
		onSuccess: (_data, variables) => {
			removeAreaOfExpertiseCaches(queryClient, variables.id);
		},
	});
}
