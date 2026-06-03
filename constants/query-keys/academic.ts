export const courseQueryKeys = {
	all: ["academic", "course"] as const,
	list: () => [...courseQueryKeys.all, "list"] as const,
	detail: (id: string) => [...courseQueryKeys.all, "detail", id] as const,
	idleDetail: () => [...courseQueryKeys.all, "detail", "idle"] as const,
};

export const areaOfExpertiseQueryKeys = {
	all: ["academic", "area-of-expertise"] as const,
	list: () => [...areaOfExpertiseQueryKeys.all, "list"] as const,
	detail: (id: string) =>
		[...areaOfExpertiseQueryKeys.all, "detail", id] as const,
	idleDetail: () =>
		[...areaOfExpertiseQueryKeys.all, "detail", "idle"] as const,
};

export const formerStudentQueryKeys = {
	all: ["academic", "former-student"] as const,
	list: () => [...formerStudentQueryKeys.all, "list"] as const,
	detail: (id: string) =>
		[...formerStudentQueryKeys.all, "detail", id] as const,
	idleDetail: () => [...formerStudentQueryKeys.all, "detail", "idle"] as const,
};
