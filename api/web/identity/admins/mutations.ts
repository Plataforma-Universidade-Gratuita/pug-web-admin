"use client";

import {
	useMutation,
	useQueryClient,
	type QueryClient,
} from "@tanstack/react-query";

import { accountKeys } from "@/api/web/identity/accounts";
import { userKeys } from "@/api/web/identity/users";
import type { AccountResponse, UserResponse } from "@/types";
import type {
	AdminCreateMutationVariables,
	AdminResponse,
	AdminSetActiveMutationVariables,
	AdminUpdateMutationVariables,
	PatchAdminCachesArgs,
	RemoveAdminMutationVariables,
} from "@/types";

/*
 * This import must remain relative because this mutation module owns the local
 * service implementation files directly, and routing the import through a barrel
 * would add needless indirection inside the same service folder.
 */
import { create, remove, setActive, update } from "./endpoints";
/*
 * This import must remain relative because this mutation module owns the local
 * service implementation files directly, and routing the import through a barrel
 * would add needless indirection inside the same service folder.
 */
import { adminKeys } from "./keys";

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

function getCachedAccount(queryClient: QueryClient, accountId: string) {
	const directAccount = queryClient.getQueryData<AccountResponse>(
		accountKeys.detail(accountId),
	);

	if (directAccount) {
		return directAccount;
	}

	const linkedAccount = queryClient.getQueryData<AccountResponse>(
		adminKeys.linkedAccount(accountId),
	);

	if (linkedAccount) {
		return linkedAccount;
	}

	const accounts = queryClient.getQueryData<AccountResponse[]>(
		accountKeys.list(),
	);

	return accounts?.find(account => account.id === accountId);
}

function getCachedUser(queryClient: QueryClient, userId: string) {
	const directUser = queryClient.getQueryData<UserResponse>(
		userKeys.detail(userId),
	);

	if (directUser) {
		return directUser;
	}

	const linkedUser = queryClient.getQueryData<UserResponse>(
		adminKeys.linkedUser(userId),
	);

	if (linkedUser) {
		return linkedUser;
	}

	const users = queryClient.getQueryData<UserResponse[]>(userKeys.list());
	return users?.find(user => user.id === userId);
}

function buildNextAccountRecord(
	admin: AdminResponse,
	options: {
		active: boolean;
		existing?: AccountResponse;
	},
): AccountResponse {
	return {
		...admin.accountResponse,
		active: options.active,
		auditInfo: createAuditInfo(
			admin.accountResponse.auditInfo ?? options.existing?.auditInfo,
		),
	};
}

function buildNextUserRecord(
	admin: AdminResponse,
	options: {
		cpf?: string;
		existing?: UserResponse;
		name: string;
	},
) {
	const cpf = options.cpf ?? options.existing?.cpf;

	if (!cpf) {
		return null;
	}

	return {
		id: admin.accountResponse.userId,
		cpf,
		cpfFormatted: formatCpf(cpf),
		name: options.name,
		auditInfo: createAuditInfo(options.existing?.auditInfo),
	} satisfies UserResponse;
}

function writeAdminCaches(queryClient: QueryClient, admin: AdminResponse) {
	queryClient.setQueryData(adminKeys.detail(admin.accountResponse.id), admin);
	queryClient.setQueryData<AdminResponse | undefined>(
		adminKeys.me(),
		current =>
			current?.accountResponse.id === admin.accountResponse.id
				? admin
				: current,
	);
	queryClient.invalidateQueries({ queryKey: adminKeys.directory() });
	queryClient.invalidateQueries({ queryKey: adminKeys.searchRoot() });
}

function patchAdminCaches(
	queryClient: QueryClient,
	{ accountId, accountActive }: PatchAdminCachesArgs,
) {
	queryClient.setQueryData<AdminResponse | undefined>(
		adminKeys.detail(accountId),
		current =>
			current
				? {
						...current,
						accountResponse: {
							...current.accountResponse,
							active: accountActive,
						},
					}
				: current,
	);
	queryClient.setQueryData<AdminResponse | undefined>(
		adminKeys.me(),
		current =>
			current?.accountResponse.id === accountId
				? {
						...current,
						accountResponse: {
							...current.accountResponse,
							active: accountActive,
						},
					}
				: current,
	);
	queryClient.invalidateQueries({ queryKey: adminKeys.directory() });
	queryClient.invalidateQueries({ queryKey: adminKeys.searchRoot() });
}

function writeAccountCaches(
	queryClient: QueryClient,
	account: AccountResponse,
) {
	queryClient.setQueryData(accountKeys.detail(account.id), account);
	queryClient.setQueryData(adminKeys.linkedAccount(account.id), account);
	queryClient.setQueryData<AccountResponse[]>(accountKeys.list(), current =>
		upsertListItem(current, account, item => item.id),
	);
	queryClient.setQueryData<AccountResponse | undefined>(
		accountKeys.me(),
		current => (current?.id === account.id ? account : current),
	);
}

function writeUserCaches(queryClient: QueryClient, user: UserResponse) {
	queryClient.setQueryData(userKeys.detail(user.id), user);
	queryClient.setQueryData(adminKeys.linkedUser(user.id), user);
	queryClient.setQueryData<UserResponse[]>(userKeys.list(), current =>
		upsertListItem(current, user, item => item.id),
	);
	queryClient.setQueryData<UserResponse | undefined>(userKeys.me(), current =>
		current?.id === user.id ? user : current,
	);
}

function removeAdminRelatedCaches(
	queryClient: QueryClient,
	ids: {
		accountId: string;
		userId: string;
	},
) {
	queryClient.removeQueries({ queryKey: adminKeys.detail(ids.accountId) });
	queryClient.removeQueries({
		queryKey: adminKeys.linkedAccount(ids.accountId),
	});
	queryClient.removeQueries({
		queryKey: adminKeys.linkedUser(ids.userId),
	});
	queryClient.setQueryData<AdminResponse | undefined>(
		adminKeys.me(),
		current =>
			current?.accountResponse.id === ids.accountId ? undefined : current,
	);
	queryClient.invalidateQueries({ queryKey: adminKeys.directory() });
	queryClient.invalidateQueries({ queryKey: adminKeys.searchRoot() });

	queryClient.setQueryData<AccountResponse[]>(accountKeys.list(), current =>
		removeListItem(current, ids.accountId, item => item.id),
	);
	queryClient.removeQueries({
		queryKey: accountKeys.detail(ids.accountId),
	});
	queryClient.setQueryData<AccountResponse | undefined>(
		accountKeys.me(),
		current => (current?.id === ids.accountId ? undefined : current),
	);

	queryClient.setQueryData<UserResponse[]>(userKeys.list(), current =>
		removeListItem(current, ids.userId, item => item.id),
	);
	queryClient.removeQueries({ queryKey: userKeys.detail(ids.userId) });
	queryClient.setQueryData<UserResponse | undefined>(userKeys.me(), current =>
		current?.id === ids.userId ? undefined : current,
	);
}

export function useCreateAdminMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ body }: AdminCreateMutationVariables) => {
			const admin = await create(body);
			return { admin, body };
		},
		onSuccess: ({ admin, body }) => {
			writeAdminCaches(queryClient, admin);

			const nextAccount = buildNextAccountRecord(admin, {
				active: admin.accountResponse.active,
			});
			writeAccountCaches(queryClient, nextAccount);

			const existingUser = getCachedUser(
				queryClient,
				admin.accountResponse.userId,
			);
			const nextUser = buildNextUserRecord(admin, {
				cpf: body.cpfString,
				name: body.name,
				...(existingUser ? { existing: existingUser } : {}),
			});
			if (nextUser) {
				writeUserCaches(queryClient, nextUser);
			}
		},
	});
}

export function useUpdateAdminMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, body }: AdminUpdateMutationVariables) =>
			update(id, body),
		onSuccess: (admin, variables) => {
			writeAdminCaches(queryClient, admin);

			const existingAccount = getCachedAccount(
				queryClient,
				admin.accountResponse.id,
			);
			const nextAccount = buildNextAccountRecord(admin, {
				active: existingAccount?.active ?? admin.accountResponse.active,
				...(existingAccount ? { existing: existingAccount } : {}),
			});
			writeAccountCaches(queryClient, nextAccount);

			const existingUser = getCachedUser(
				queryClient,
				admin.accountResponse.userId,
			);
			const nextUser = buildNextUserRecord(admin, {
				name: variables.body.name,
				...(existingUser ? { existing: existingUser } : {}),
			});
			if (nextUser) {
				writeUserCaches(queryClient, nextUser);
			}
		},
	});
}

export function useSetAdminActiveMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ active, id }: AdminSetActiveMutationVariables) =>
			setActive(id, active),
		onSuccess: (_data, variables) => {
			patchAdminCaches(queryClient, {
				accountId: variables.id,
				accountActive: variables.active,
			});
			const existingAccount = getCachedAccount(queryClient, variables.id);

			if (!existingAccount) {
				return;
			}

			const nextAccount = {
				...existingAccount,
				active: variables.active,
				auditInfo: createAuditInfo(existingAccount.auditInfo),
			} satisfies AccountResponse;

			writeAccountCaches(queryClient, nextAccount);
		},
	});
}

export function useRemoveAdminMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ accountId }: RemoveAdminMutationVariables) =>
			remove(accountId),
		onSuccess: (_data, variables) => {
			removeAdminRelatedCaches(queryClient, variables);
		},
	});
}
