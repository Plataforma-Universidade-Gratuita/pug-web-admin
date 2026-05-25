export const cityQueryKeys = {
	all: ["geo", "cities"] as const,
	list: () => [...cityQueryKeys.all, "list"] as const,
	detail: (id: string) => [...cityQueryKeys.all, "detail", id] as const,
	idleDetail: () => [...cityQueryKeys.all, "detail", "idle"] as const,
};
