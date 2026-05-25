export const courseQueryKeys = {
	all: ["academic", "course"] as const,
	list: () => [...courseQueryKeys.all, "list"] as const,
	detail: (id: string) => [...courseQueryKeys.all, "detail", id] as const,
	idleDetail: () => [...courseQueryKeys.all, "detail", "idle"] as const,
};

export const schoolQueryKeys = {
	all: ["academic", "school"] as const,
	list: () => [...schoolQueryKeys.all, "list"] as const,
	detail: (id: string) => [...schoolQueryKeys.all, "detail", id] as const,
	idleDetail: () => [...schoolQueryKeys.all, "detail", "idle"] as const,
};

export const studentQueryKeys = {
	all: ["academic", "student"] as const,
	list: () => [...studentQueryKeys.all, "list"] as const,
	detail: (id: string) => [...studentQueryKeys.all, "detail", id] as const,
	idleDetail: () => [...studentQueryKeys.all, "detail", "idle"] as const,
};
