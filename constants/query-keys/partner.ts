export const entityQueryKeys = {
	all: ["partner", "entity"] as const,
	list: () => [...entityQueryKeys.all, "list"] as const,
	cities: () => [...entityQueryKeys.all, "cities"] as const,
	detail: (id: string) => [...entityQueryKeys.all, "detail", id] as const,
	idleDetail: () => [...entityQueryKeys.all, "detail", "idle"] as const,
};

export const staffQueryKeys = {
	all: ["partner", "staff"] as const,
	list: () => [...staffQueryKeys.all, "list"] as const,
	detail: (id: string) => [...staffQueryKeys.all, "detail", id] as const,
	idleDetail: () => [...staffQueryKeys.all, "detail", "idle"] as const,
	linkedAccount: (id: string) =>
		[...staffQueryKeys.all, "linked-account", id] as const,
	idleLinkedAccount: () =>
		[...staffQueryKeys.all, "linked-account", "idle"] as const,
	linkedUser: (id: string) =>
		[...staffQueryKeys.all, "linked-user", id] as const,
	idleLinkedUser: () => [...staffQueryKeys.all, "linked-user", "idle"] as const,
	supportingCities: () => [...staffQueryKeys.all, "supporting-cities"] as const,
	supportingEntities: () =>
		[...staffQueryKeys.all, "supporting-entities"] as const,
};
