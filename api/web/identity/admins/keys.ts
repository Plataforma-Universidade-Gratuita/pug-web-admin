export const adminKeys = {
	all: ["identity", "admin"] as const,
	directory: () => [...adminKeys.all, "directory"] as const,
	searchRoot: () => [...adminKeys.all, "search"] as const,
	search: (page: number, size: number, filtersKey: string) =>
		[...adminKeys.searchRoot(), page, size, filtersKey] as const,
	detail: (id: string) => [...adminKeys.all, "detail", id] as const,
	idleDetail: () => [...adminKeys.all, "detail", "idle"] as const,
	linkedAccount: (id: string) =>
		[...adminKeys.all, "linked-account", id] as const,
	idleLinkedAccount: () =>
		[...adminKeys.all, "linked-account", "idle"] as const,
	linkedUser: (id: string) => [...adminKeys.all, "linked-user", id] as const,
	idleLinkedUser: () => [...adminKeys.all, "linked-user", "idle"] as const,
	me: () => [...adminKeys.all, "me"] as const,
};
