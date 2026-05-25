export const accountQueryKeys = {
	all: ["identity", "account"] as const,
	list: () => [...accountQueryKeys.all, "list"] as const,
	detail: (id: string) => [...accountQueryKeys.all, "detail", id] as const,
	idleDetail: () => [...accountQueryKeys.all, "detail", "idle"] as const,
	linkedUser: (id: string) =>
		[...accountQueryKeys.all, "linked-user", id] as const,
	idleLinkedUser: () =>
		[...accountQueryKeys.all, "linked-user", "idle"] as const,
	me: () => [...accountQueryKeys.all, "me"] as const,
};

export const adminQueryKeys = {
	all: ["identity", "admin"] as const,
	list: () => [...adminQueryKeys.all, "list"] as const,
	detail: (id: string) => [...adminQueryKeys.all, "detail", id] as const,
	idleDetail: () => [...adminQueryKeys.all, "detail", "idle"] as const,
	linkedAccount: (id: string) =>
		[...adminQueryKeys.all, "linked-account", id] as const,
	idleLinkedAccount: () =>
		[...adminQueryKeys.all, "linked-account", "idle"] as const,
	linkedUser: (id: string) =>
		[...adminQueryKeys.all, "linked-user", id] as const,
	idleLinkedUser: () => [...adminQueryKeys.all, "linked-user", "idle"] as const,
	me: () => [...adminQueryKeys.all, "me"] as const,
};

export const userQueryKeys = {
	all: ["identity", "user"] as const,
	list: () => [...userQueryKeys.all, "list"] as const,
	detail: (id: string) => [...userQueryKeys.all, "detail", id] as const,
	idleDetail: () => [...userQueryKeys.all, "detail", "idle"] as const,
	me: () => [...userQueryKeys.all, "me"] as const,
};
