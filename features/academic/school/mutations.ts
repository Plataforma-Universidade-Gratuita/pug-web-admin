"use client";

import {
	useMutation,
	useQueryClient,
	type QueryClient,
} from "@tanstack/react-query";

import { create, remove, update } from "@/api/web/academic/schools";
import { schoolQueryKeys } from "@/features/academic/school/queries";
import type { SchoolResponse } from "@/types/api";
import type {
	RemoveSchoolMutationVariables,
	SchoolCreateMutationVariables,
	SchoolUpdateMutationVariables,
} from "@/types/client/academic";

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

function writeSchoolCaches(queryClient: QueryClient, school: SchoolResponse) {
	queryClient.setQueryData(schoolQueryKeys.detail(school.id), school);
	queryClient.setQueryData<SchoolResponse[]>(schoolQueryKeys.list(), current =>
		upsertListItem(current, school, item => item.id),
	);
}

function removeSchoolCaches(queryClient: QueryClient, schoolId: string) {
	queryClient.setQueryData<SchoolResponse[]>(schoolQueryKeys.list(), current =>
		removeListItem(current, schoolId, item => item.id),
	);
	queryClient.removeQueries({ queryKey: schoolQueryKeys.detail(schoolId) });
}

export function useCreateSchoolMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ body }: SchoolCreateMutationVariables) => create(body),
		onSuccess: school => {
			writeSchoolCaches(queryClient, school);
		},
	});
}

export function useUpdateSchoolMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, body }: SchoolUpdateMutationVariables) =>
			update(id, body),
		onSuccess: school => {
			writeSchoolCaches(queryClient, school);
		},
	});
}

export function useRemoveSchoolMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id }: RemoveSchoolMutationVariables) => remove(id),
		onSuccess: (_data, variables) => {
			removeSchoolCaches(queryClient, variables.id);
		},
	});
}
