export const cityQueryKeys = {
	all: ["geo", "cities"] as const,
	list: () => [...cityQueryKeys.all, "list"] as const,
	search: (page: number, size: number, name: string) =>
		[...cityQueryKeys.all, "search", page, size, name] as const,
	detail: (id: string) => [...cityQueryKeys.all, "detail", id] as const,
	idleDetail: () => [...cityQueryKeys.all, "detail", "idle"] as const,
};
