"use client";

import {
	useMutation,
	useQueryClient,
	type QueryClient,
} from "@tanstack/react-query";

import { create, remove, update } from "@/api/web/partner/entities";
import { entityQueryKeys } from "@/features/partner/entity/queries";
import type { EntityResponse } from "@/types/api";
import type {
	EntityCreateMutationVariables,
	RemoveEntityMutationVariables,
	EntityUpdateMutationVariables,
} from "@/types/client/partner";

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

function writeEntityCaches(queryClient: QueryClient, entity: EntityResponse) {
	queryClient.setQueryData(entityQueryKeys.detail(entity.id), entity);
	queryClient.setQueryData<EntityResponse[]>(entityQueryKeys.list(), current =>
		upsertListItem(current, entity, item => item.id),
	);
}

function removeEntityCaches(queryClient: QueryClient, entityId: string) {
	queryClient.setQueryData<EntityResponse[]>(entityQueryKeys.list(), current =>
		removeListItem(current, entityId, item => item.id),
	);
	queryClient.removeQueries({ queryKey: entityQueryKeys.detail(entityId) });
}

export function useCreateEntityMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ body }: EntityCreateMutationVariables) => create(body),
		onSuccess: entity => {
			writeEntityCaches(queryClient, entity);
		},
	});
}

export function useUpdateEntityMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, body }: EntityUpdateMutationVariables) =>
			update(id, body),
		onSuccess: entity => {
			writeEntityCaches(queryClient, entity);
		},
	});
}

export function useRemoveEntityMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id }: RemoveEntityMutationVariables) => remove(id),
		onSuccess: (_data, variables) => {
			removeEntityCaches(queryClient, variables.id);
		},
	});
}
