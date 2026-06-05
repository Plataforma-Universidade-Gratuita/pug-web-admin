"use client";

import {
	useMutation,
	useQueryClient,
	type QueryClient,
} from "@tanstack/react-query";

import { accountQueryKeys } from "@/api/web/identity/accounts";
import { userQueryKeys } from "@/api/web/identity/users";
import type { AccountResponse, StaffResponse, UserResponse } from "@/types";
import type {
	PatchStaffCachesArgs,
	StaffCreateMutationVariables,
	StaffRemoveMutationVariables,
	StaffSetActiveMutationVariables,
	StaffUpdateMutationVariables,
} from "@/types";

import { create, remove, setActive, update } from "./endpoints";
import { staffQueryKeys } from "./queries";

function formatCpf(value: string) {
	const digits = value.replace(/\D+/g, "").slice(0, 11);

	if (digits.length !== 11) {
		return value;
	}

	return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

function createAuditInfo<
	TAuditInfo extends AccountResponse["auditInfo"] | UserResponse["auditInfo"],
>(existing?: TAuditInfo) {
	const now = new Date();
	const timestamp = now.toISOString();
	const formattedTimestamp = now.toLocaleString("en-US");

	if (!existing) {
		return {
			createdAt: timestamp,
			createdAtFormatted: formattedTimestamp,
			updatedAt: timestamp,
			updatedAtFormatted: formattedTimestamp,
		} as TAuditInfo;
	}

	return {
		...existing,
		updatedAt: timestamp,
		updatedAtFormatted: formattedTimestamp,
	} as TAuditInfo;
}

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
	queryClient.setQueryData(staffQueryKeys.detail(staff.account.id), staff);
	queryClient.setQueryData<StaffResponse[]>(staffQueryKeys.list(), current =>
		upsertListItem(current, staff, item => item.account.id),
	);
	queryClient.invalidateQueries({ queryKey: staffQueryKeys.searchRoot() });
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
						account: {
							...current.account,
							active: accountActive,
						},
					}
				: current,
	);
	queryClient.setQueryData<StaffResponse[]>(
		staffQueryKeys.list(),
		current =>
			current?.map(staff =>
				staff.account.id === accountId
					? {
							...staff,
							account: {
								...staff.account,
								active: accountActive,
							},
						}
					: staff,
			) ?? current,
	);
	queryClient.invalidateQueries({ queryKey: staffQueryKeys.searchRoot() });
}

function writeAccountCaches(
	queryClient: QueryClient,
	account: AccountResponse,
) {
	queryClient.setQueryData(accountQueryKeys.detail(account.id), account);
	queryClient.setQueryData(staffQueryKeys.linkedAccount(account.id), account);
	queryClient.setQueryData<AccountResponse[]>(
		accountQueryKeys.list(),
		current => upsertListItem(current, account, item => item.id),
	);
	queryClient.setQueryData<AccountResponse | undefined>(
		accountQueryKeys.me(),
		current => (current?.id === account.id ? account : current),
	);
}

function writeUserCaches(queryClient: QueryClient, user: UserResponse) {
	queryClient.setQueryData(userQueryKeys.detail(user.id), user);
	queryClient.setQueryData(staffQueryKeys.linkedUser(user.id), user);
	queryClient.setQueryData<UserResponse[]>(userQueryKeys.list(), current =>
		upsertListItem(current, user, item => item.id),
	);
	queryClient.setQueryData<UserResponse | undefined>(
		userQueryKeys.me(),
		current => (current?.id === user.id ? user : current),
	);
}

function getCachedUser(queryClient: QueryClient, userId: string) {
	const directUser = queryClient.getQueryData<UserResponse>(
		userQueryKeys.detail(userId),
	);

	if (directUser) {
		return directUser;
	}

	const linkedUser = queryClient.getQueryData<UserResponse>(
		staffQueryKeys.linkedUser(userId),
	);

	if (linkedUser) {
		return linkedUser;
	}

	const users = queryClient.getQueryData<UserResponse[]>(userQueryKeys.list());
	return users?.find(user => user.id === userId);
}

function removeStaffCaches(
	queryClient: QueryClient,
	{ accountId, userId }: StaffRemoveMutationVariables,
) {
	queryClient.setQueryData<StaffResponse[]>(staffQueryKeys.list(), current =>
		removeListItem(current, accountId, item => item.account.id),
	);
	queryClient.removeQueries({ queryKey: staffQueryKeys.detail(accountId) });
	queryClient.removeQueries({
		queryKey: staffQueryKeys.linkedAccount(accountId),
	});
	queryClient.removeQueries({ queryKey: staffQueryKeys.linkedUser(userId) });
	queryClient.invalidateQueries({ queryKey: staffQueryKeys.searchRoot() });

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

export function useCreateStaffMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ body }: StaffCreateMutationVariables) => {
			const staff = await create(body);
			return { body, staff };
		},
		onSuccess: ({ body, staff }) => {
			writeStaffCaches(queryClient, staff);
			writeAccountCaches(queryClient, staff.account);

			const existingUser = getCachedUser(queryClient, staff.account.userId);
			writeUserCaches(queryClient, {
				id: staff.account.userId,
				cpf: body.cpfString,
				cpfFormatted: formatCpf(body.cpfString),
				name: body.name,
				auditInfo: createAuditInfo(existingUser?.auditInfo),
			});
		},
	});
}

export function useUpdateStaffMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, body }: StaffUpdateMutationVariables) =>
			update(id, body),
		onSuccess: (staff, variables) => {
			writeStaffCaches(queryClient, staff);
			writeAccountCaches(queryClient, {
				...staff.account,
				email: variables.body.emailString,
				auditInfo: createAuditInfo(staff.account.auditInfo),
			});

			const existingUser = getCachedUser(queryClient, staff.account.userId);

			if (!existingUser) {
				return;
			}

			writeUserCaches(queryClient, {
				...existingUser,
				name: variables.body.name,
				auditInfo: createAuditInfo(existingUser.auditInfo),
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

			queryClient.setQueryData<AccountResponse | undefined>(
				accountQueryKeys.detail(variables.id),
				current =>
					current
						? {
								...current,
								active: variables.active,
								auditInfo: createAuditInfo(current.auditInfo),
							}
						: current,
			);
			queryClient.setQueryData<AccountResponse | undefined>(
				staffQueryKeys.linkedAccount(variables.id),
				current =>
					current
						? {
								...current,
								active: variables.active,
								auditInfo: createAuditInfo(current.auditInfo),
							}
						: current,
			);
			queryClient.setQueryData<AccountResponse[]>(
				accountQueryKeys.list(),
				current =>
					current?.map(account =>
						account.id === variables.id
							? {
									...account,
									active: variables.active,
									auditInfo: createAuditInfo(account.auditInfo),
								}
							: account,
					) ?? current,
			);
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
