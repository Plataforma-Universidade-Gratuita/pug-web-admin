"use client";

import {
	useMutation,
	useQueryClient,
	type QueryClient,
} from "@tanstack/react-query";

import { accountQueryKeys } from "@/api/web/identity/accounts";
import { userQueryKeys } from "@/api/web/identity/users";
import type {
	AccountResponse,
	FormerStudentResponse,
	UserResponse,
} from "@/types";
import type {
	FormerStudentCreateMutationVariables,
	FormerStudentSetActiveMutationVariables,
	FormerStudentUpdateMutationVariables,
	RemoveFormerStudentMutationVariables,
} from "@/types";

import { create, remove, setActive, update } from "./endpoints";
import { formerStudentQueryKeys } from "./queries";

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

function writeFormerStudentCaches(
	queryClient: QueryClient,
	formerStudent: FormerStudentResponse,
) {
	queryClient.setQueryData(
		formerStudentQueryKeys.detail(formerStudent.accountId),
		formerStudent,
	);
	queryClient.setQueryData<FormerStudentResponse[]>(
		formerStudentQueryKeys.list(),
		current => upsertListItem(current, formerStudent, item => item.accountId),
	);
}

function refreshFormerStudentDirectoryCaches(queryClient: QueryClient) {
	void queryClient.invalidateQueries({
		queryKey: formerStudentQueryKeys.list(),
	});
	void queryClient.invalidateQueries({
		queryKey: accountQueryKeys.list(),
	});
	void queryClient.invalidateQueries({
		queryKey: userQueryKeys.list(),
	});
}

function patchAccountCaches(
	queryClient: QueryClient,
	accountId: string,
	active: boolean,
) {
	queryClient.setQueryData<AccountResponse[]>(
		accountQueryKeys.list(),
		current =>
			current?.map(account =>
				account.id === accountId ? { ...account, active } : account,
			) ?? current,
	);
	queryClient.setQueryData<AccountResponse | undefined>(
		accountQueryKeys.detail(accountId),
		current => (current ? { ...current, active } : current),
	);
}

function removeFormerStudentCaches(
	queryClient: QueryClient,
	{ accountId, userId }: RemoveFormerStudentMutationVariables,
) {
	queryClient.setQueryData<FormerStudentResponse[]>(
		formerStudentQueryKeys.list(),
		current => removeListItem(current, accountId, item => item.accountId),
	);
	queryClient.removeQueries({
		queryKey: formerStudentQueryKeys.detail(accountId),
	});
	queryClient.setQueryData<AccountResponse[]>(
		accountQueryKeys.list(),
		current => removeListItem(current, accountId, item => item.id),
	);
	queryClient.removeQueries({ queryKey: accountQueryKeys.detail(accountId) });
	queryClient.setQueryData<UserResponse[]>(userQueryKeys.list(), current =>
		removeListItem(current, userId, item => item.id),
	);
	queryClient.removeQueries({ queryKey: userQueryKeys.detail(userId) });
}

export function useCreateFormerStudentMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ body }: FormerStudentCreateMutationVariables) =>
			create(body),
		onSuccess: formerStudent => {
			writeFormerStudentCaches(queryClient, formerStudent);
			refreshFormerStudentDirectoryCaches(queryClient);
		},
	});
}

export function useUpdateFormerStudentMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, body }: FormerStudentUpdateMutationVariables) =>
			update(id, body),
		onSuccess: formerStudent => {
			writeFormerStudentCaches(queryClient, formerStudent);
			refreshFormerStudentDirectoryCaches(queryClient);
		},
	});
}

export function useSetFormerStudentActiveMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ active, id }: FormerStudentSetActiveMutationVariables) =>
			setActive(id, active),
		onSuccess: (_data, variables) => {
			patchAccountCaches(queryClient, variables.id, variables.active);
		},
	});
}

export function useRemoveFormerStudentMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ accountId }: RemoveFormerStudentMutationVariables) =>
			remove(accountId),
		onSuccess: (_data, variables) => {
			removeFormerStudentCaches(queryClient, variables);
		},
	});
}
