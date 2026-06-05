export const enrollmentKeys = {
	all: ["project", "enrollment"] as const,
	list: () => [...enrollmentKeys.all, "list"] as const,
	search: (page: number, size: number, filtersKey: string) =>
		[...enrollmentKeys.all, "search", page, size, filtersKey] as const,
	detail: (projectId: string, formerStudentId: string) =>
		[...enrollmentKeys.all, "detail", projectId, formerStudentId] as const,
	idleDetail: () => [...enrollmentKeys.all, "detail", "idle", "idle"] as const,
};
