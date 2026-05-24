"use client";

import {
	useMutation,
	useQueryClient,
	type QueryClient,
} from "@tanstack/react-query";

import { create, remove, setActive, update } from "@/api/web/partner/staff";
import { accountQueryKeys } from "@/features/identity/account/queries";
import { userQueryKeys } from "@/features/identity/user/queries";
import { staffQueryKeys } from "@/features/partner/staff/queries";
import type { AccountResponse, StaffResponse, UserResponse } from "@/types/api";
import type {
	PatchStaffAccountCachesArgs,
	PatchStaffCachesArgs,
	PatchStaffUserCachesArgs,
	StaffCreateMutationVariables,
	StaffRemoveMutationVariables,
	StaffSetActiveMutationVariables,
	StaffUpdateMutationVariables,
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

function writeStaffCaches(queryClient: QueryClient, staff: StaffResponse) {
	queryClient.setQueryData(staffQueryKeys.detail(staff.accountId), staff);
	queryClient.setQueryData<StaffResponse[]>(staffQueryKeys.list(), current =>
		upsertListItem(current, staff, item => item.accountId),
	);
}

function patchStaffCaches(
	queryClient: QueryClient,
	{ accountId, accountActive }: PatchStaffCachesArgs,
) {
	queryClient.setQueryData<StaffResponse | undefined>(
		staffQueryKeys.detail(accountId),
		current =>
			current
				? {
						...current,
						accountActive,
					}
				: current,
	);
	queryClient.setQueryData<StaffResponse[]>(
		staffQueryKeys.list(),
		current =>
			current?.map(staff =>
				staff.accountId === accountId
					? {
							...staff,
							accountActive,
						}
					: staff,
			) ?? current,
	);
}

function patchAccountCaches(
	queryClient: QueryClient,
	{ accountId, active, email, userName }: PatchStaffAccountCachesArgs,
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
		staffQueryKeys.linkedAccount(accountId),
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
}

function patchUserCaches(
	queryClient: QueryClient,
	{ name, userId }: PatchStaffUserCachesArgs,
) {
	if (!name) {
		return;
	}

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
}

function removeStaffCaches(
	queryClient: QueryClient,
	{ accountId, userId }: StaffRemoveMutationVariables,
) {
	queryClient.setQueryData<StaffResponse[]>(staffQueryKeys.list(), current =>
		removeListItem(current, accountId, item => item.accountId),
	);
	queryClient.removeQueries({ queryKey: staffQueryKeys.detail(accountId) });
	queryClient.removeQueries({
		queryKey: staffQueryKeys.linkedAccount(accountId),
	});
	queryClient.removeQueries({ queryKey: staffQueryKeys.linkedUser(userId) });
	queryClient.setQueryData<AccountResponse[]>(
		accountQueryKeys.list(),
		current => removeListItem(current, accountId, item => item.id),
	);
	queryClient.removeQueries({ queryKey: accountQueryKeys.detail(accountId) });
	queryClient.removeQueries({ queryKey: userQueryKeys.detail(userId) });
}

export function useCreateStaffMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ body }: StaffCreateMutationVariables) => create(body),
		onSuccess: staff => {
			writeStaffCaches(queryClient, staff);
		},
	});
}

export function useUpdateStaffMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, body }: StaffUpdateMutationVariables) =>
			update(id, body),
		onSuccess: staff => {
			writeStaffCaches(queryClient, staff);
			patchAccountCaches(queryClient, {
				accountId: staff.accountId,
				email: staff.accountEmail,
				userName: staff.userName,
			});
			patchUserCaches(queryClient, {
				userId: staff.userId,
				name: staff.userName,
			});
		},
	});
}

export function useSetStaffActiveMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ active, id }: StaffSetActiveMutationVariables) =>
			setActive(id, active),
		onSuccess: (_data, variables) => {
			patchStaffCaches(queryClient, {
				accountId: variables.id,
				accountActive: variables.active,
			});
			patchAccountCaches(queryClient, {
				accountId: variables.id,
				active: variables.active,
			});
		},
	});
}

export function useRemoveStaffMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ accountId }: StaffRemoveMutationVariables) =>
			remove(accountId),
		onSuccess: (_data, variables) => {
			removeStaffCaches(queryClient, variables);
		},
	});
}
