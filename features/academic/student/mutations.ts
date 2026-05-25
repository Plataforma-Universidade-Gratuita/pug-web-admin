"use client";

import {
	useMutation,
	useQueryClient,
	type QueryClient,
} from "@tanstack/react-query";

import { create, remove, setActive, update } from "@/api/web/academic/students";
import { studentQueryKeys } from "@/features/academic/student/queries";
import { accountQueryKeys } from "@/features/identity/account/queries";
import { userQueryKeys } from "@/features/identity/user/queries";
import type { AccountResponse, StudentResponse, UserResponse } from "@/types";
import type {
	RemoveStudentMutationVariables,
	StudentCreateMutationVariables,
	StudentSetActiveMutationVariables,
	StudentUpdateMutationVariables,
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

function writeStudentCaches(
	queryClient: QueryClient,
	student: StudentResponse,
) {
	queryClient.setQueryData(studentQueryKeys.detail(student.accountId), student);
	queryClient.setQueryData<StudentResponse[]>(
		studentQueryKeys.list(),
		current => upsertListItem(current, student, item => item.accountId),
	);
}

function patchStudentCaches(
	queryClient: QueryClient,
	{
		accountActive,
		accountId,
	}: {
		accountActive: boolean;
		accountId: string;
	},
) {
	queryClient.setQueryData<StudentResponse | undefined>(
		studentQueryKeys.detail(accountId),
		current =>
			current
				? {
						...current,
						accountActive,
					}
				: current,
	);
	queryClient.setQueryData<StudentResponse[]>(
		studentQueryKeys.list(),
		current =>
			current?.map(student =>
				student.accountId === accountId
					? {
							...student,
							accountActive,
						}
					: student,
			) ?? current,
	);
}

function patchAccountCaches(
	queryClient: QueryClient,
	{
		accountId,
		active,
		email,
		userName,
	}: {
		accountId: string;
		active?: boolean;
		email?: string;
		userName?: string;
	},
) {
	queryClient.setQueryData<AccountResponse[]>(
		accountQueryKeys.list(),
		current =>
			current?.map(account =>
				account.id === accountId
					? {
							...account,
							active: active ?? account.active,
							email: email ?? account.email,
							userName: userName ?? account.userName,
						}
					: account,
			) ?? current,
	);
	queryClient.setQueryData<AccountResponse | undefined>(
		accountQueryKeys.detail(accountId),
		current =>
			current
				? {
						...current,
						active: active ?? current.active,
						email: email ?? current.email,
						userName: userName ?? current.userName,
					}
				: current,
	);
	queryClient.setQueryData<AccountResponse | undefined>(
		accountQueryKeys.me(),
		current =>
			current?.id === accountId
				? {
						...current,
						active: active ?? current.active,
						email: email ?? current.email,
						userName: userName ?? current.userName,
					}
				: current,
	);
}

function patchUserCaches(
	queryClient: QueryClient,
	{
		name,
		userId,
	}: {
		name: string;
		userId: string;
	},
) {
	queryClient.setQueryData<UserResponse | undefined>(
		userQueryKeys.detail(userId),
		current =>
			current
				? {
						...current,
						name,
					}
				: current,
	);
	queryClient.setQueryData<UserResponse[]>(
		userQueryKeys.list(),
		current =>
			current?.map(user =>
				user.id === userId
					? {
							...user,
							name,
						}
					: user,
			) ?? current,
	);
	queryClient.setQueryData<UserResponse | undefined>(
		userQueryKeys.me(),
		current =>
			current?.id === userId
				? {
						...current,
						name,
					}
				: current,
	);
}

function removeStudentCaches(
	queryClient: QueryClient,
	{ accountId, userId }: RemoveStudentMutationVariables,
) {
	queryClient.setQueryData<StudentResponse[]>(
		studentQueryKeys.list(),
		current => removeListItem(current, accountId, item => item.accountId),
	);
	queryClient.removeQueries({ queryKey: studentQueryKeys.detail(accountId) });
	queryClient.setQueryData<AccountResponse[]>(
		accountQueryKeys.list(),
		current => removeListItem(current, accountId, item => item.id),
	);
	queryClient.removeQueries({ queryKey: accountQueryKeys.detail(accountId) });
	queryClient.setQueryData<AccountResponse | undefined>(
		accountQueryKeys.me(),
		current => (current?.id === accountId ? undefined : current),
	);
	queryClient.setQueryData<UserResponse[]>(userQueryKeys.list(), current =>
		removeListItem(current, userId, item => item.id),
	);
	queryClient.removeQueries({ queryKey: userQueryKeys.detail(userId) });
	queryClient.setQueryData<UserResponse | undefined>(
		userQueryKeys.me(),
		current => (current?.id === userId ? undefined : current),
	);
}

export function useCreateStudentMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ body }: StudentCreateMutationVariables) => create(body),
		onSuccess: student => {
			writeStudentCaches(queryClient, student);
		},
	});
}

export function useUpdateStudentMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, body }: StudentUpdateMutationVariables) =>
			update(id, body),
		onSuccess: student => {
			writeStudentCaches(queryClient, student);
			patchAccountCaches(queryClient, {
				accountId: student.accountId,
				email: student.accountEmail,
				userName: student.userName,
			});
			patchUserCaches(queryClient, {
				name: student.userName,
				userId: student.userId,
			});
		},
	});
}

export function useSetStudentActiveMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ active, id }: StudentSetActiveMutationVariables) =>
			setActive(id, active),
		onSuccess: (_data, variables) => {
			patchStudentCaches(queryClient, {
				accountActive: variables.active,
				accountId: variables.id,
			});
			patchAccountCaches(queryClient, {
				accountId: variables.id,
				active: variables.active,
			});
		},
	});
}

export function useRemoveStudentMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ accountId }: RemoveStudentMutationVariables) =>
			remove(accountId),
		onSuccess: (_data, variables) => {
			removeStudentCaches(queryClient, variables);
		},
	});
}
