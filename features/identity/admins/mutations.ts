"use client";

import {
	useMutation,
	useQueryClient,
	type QueryClient,
} from "@tanstack/react-query";

import { create, remove, setActive, update } from "@/api/web/identity/admins";
import { accountQueryKeys } from "@/features/identity/accounts/queries";
import { adminQueryKeys } from "@/features/identity/admins/queries";
import { userQueryKeys } from "@/features/identity/users/queries";
import type { AccountResponse, UserResponse } from "@/types";
import type {
	AdminCreateMutationVariables,
	AdminResponse,
	AdminSetActiveMutationVariables,
	AdminUpdateMutationVariables,
	PatchAdminCachesArgs,
	RemoveAdminMutationVariables,
} from "@/types";

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
		accountQueryKeys.detail(accountId),
	);

	if (directAccount) {
		return directAccount;
	}

	const linkedAccount = queryClient.getQueryData<AccountResponse>(
		adminQueryKeys.linkedAccount(accountId),
	);

	if (linkedAccount) {
		return linkedAccount;
	}

	const accounts = queryClient.getQueryData<AccountResponse[]>(
		accountQueryKeys.list(),
	);

	return accounts?.find(account => account.id === accountId);
}

function getCachedUser(queryClient: QueryClient, userId: string) {
	const directUser = queryClient.getQueryData<UserResponse>(
		userQueryKeys.detail(userId),
	);

	if (directUser) {
		return directUser;
	}

	const linkedUser = queryClient.getQueryData<UserResponse>(
		adminQueryKeys.linkedUser(userId),
	);

	if (linkedUser) {
		return linkedUser;
	}

	const users = queryClient.getQueryData<UserResponse[]>(userQueryKeys.list());
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
		id: admin.accountId,
		userId: admin.userId,
		email: admin.accountEmail,
		accountType: options.existing?.accountType ?? "ADMIN",
		accountTypeFormatted: options.existing?.accountTypeFormatted ?? "ADMIN",
		active: options.active,
		auditInfo: createAuditInfo(options.existing?.auditInfo),
	};
}

function buildNextUserRecord(
	admin: AdminResponse,
	options: {
		cpf?: string;
		existing?: UserResponse;
	},
) {
	const cpf = options.cpf ?? options.existing?.cpf;

	if (!cpf) {
		return null;
	}

	return {
		id: admin.userId,
		cpf,
		cpfFormatted: formatCpf(cpf),
		name: admin.userName,
		auditInfo: createAuditInfo(options.existing?.auditInfo),
	} satisfies UserResponse;
}

function writeAdminCaches(queryClient: QueryClient, admin: AdminResponse) {
	queryClient.setQueryData(adminQueryKeys.detail(admin.accountId), admin);
	queryClient.setQueryData<AdminResponse | undefined>(
		adminQueryKeys.me(),
		current => (current?.accountId === admin.accountId ? admin : current),
	);
	queryClient.invalidateQueries({ queryKey: adminQueryKeys.directory() });
	queryClient.invalidateQueries({ queryKey: adminQueryKeys.searchRoot() });
}

function patchAdminCaches(
	queryClient: QueryClient,
	{ accountId, accountActive }: PatchAdminCachesArgs,
) {
	queryClient.setQueryData<AdminResponse | undefined>(
		adminQueryKeys.detail(accountId),
		current =>
			current
				? {
						...current,
						accountActive,
					}
				: current,
	);
	queryClient.setQueryData<AdminResponse | undefined>(
		adminQueryKeys.me(),
		current =>
			current?.accountId === accountId
				? {
						...current,
						accountActive,
					}
				: current,
	);
	queryClient.invalidateQueries({ queryKey: adminQueryKeys.directory() });
	queryClient.invalidateQueries({ queryKey: adminQueryKeys.searchRoot() });
}

function writeAccountCaches(queryClient: QueryClient, account: AccountResponse) {
	queryClient.setQueryData(accountQueryKeys.detail(account.id), account);
	queryClient.setQueryData(adminQueryKeys.linkedAccount(account.id), account);
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
	queryClient.setQueryData(adminQueryKeys.linkedUser(user.id), user);
	queryClient.setQueryData<UserResponse[]>(userQueryKeys.list(), current =>
		upsertListItem(current, user, item => item.id),
	);
	queryClient.setQueryData<UserResponse | undefined>(
		userQueryKeys.me(),
		current => (current?.id === user.id ? user : current),
	);
}

function removeAdminRelatedCaches(
	queryClient: QueryClient,
	ids: {
		accountId: string;
		userId: string;
	},
) {
	queryClient.removeQueries({ queryKey: adminQueryKeys.detail(ids.accountId) });
	queryClient.removeQueries({
		queryKey: adminQueryKeys.linkedAccount(ids.accountId),
	});
	queryClient.removeQueries({
		queryKey: adminQueryKeys.linkedUser(ids.userId),
	});
	queryClient.setQueryData<AdminResponse | undefined>(
		adminQueryKeys.me(),
		current => (current?.accountId === ids.accountId ? undefined : current),
	);
	queryClient.invalidateQueries({ queryKey: adminQueryKeys.directory() });
	queryClient.invalidateQueries({ queryKey: adminQueryKeys.searchRoot() });

	queryClient.setQueryData<AccountResponse[]>(
		accountQueryKeys.list(),
		current => removeListItem(current, ids.accountId, item => item.id),
	);
	queryClient.removeQueries({
		queryKey: accountQueryKeys.detail(ids.accountId),
	});
	queryClient.setQueryData<AccountResponse | undefined>(
		accountQueryKeys.me(),
		current => (current?.id === ids.accountId ? undefined : current),
	);

	queryClient.setQueryData<UserResponse[]>(userQueryKeys.list(), current =>
		removeListItem(current, ids.userId, item => item.id),
	);
	queryClient.removeQueries({ queryKey: userQueryKeys.detail(ids.userId) });
	queryClient.setQueryData<UserResponse | undefined>(
		userQueryKeys.me(),
		current => (current?.id === ids.userId ? undefined : current),
	);
}

export function useCreateAdminMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ active, body }: AdminCreateMutationVariables) => {
			const admin = await create(body);

			if (!active) {
				await setActive(admin.accountId, false);
			}

			return { active, admin, body };
		},
		onSuccess: ({ active, admin, body }) => {
			const nextAdmin =
				admin.accountActive === active
					? admin
					: {
							...admin,
							accountActive: active,
						};
			writeAdminCaches(queryClient, nextAdmin);

			const nextAccount = buildNextAccountRecord(nextAdmin, { active });
			writeAccountCaches(queryClient, nextAccount);

			const nextUser = buildNextUserRecord(nextAdmin, {
				...(body.cpf ? { cpf: body.cpf } : {}),
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

			const existingAccount = getCachedAccount(queryClient, admin.accountId);
			const nextAccount = buildNextAccountRecord(admin, {
				active: variables.body.active ?? existingAccount?.active ?? true,
				...(existingAccount ? { existing: existingAccount } : {}),
			});
			writeAccountCaches(queryClient, nextAccount);

			const existingUser = getCachedUser(queryClient, admin.userId);
			const nextUser = buildNextUserRecord(admin, {
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
