export const attendanceQueryKeys = {
	all: ["project", "attendance"] as const,
	list: () => [...attendanceQueryKeys.all, "list"] as const,
	detail: (id: string) => [...attendanceQueryKeys.all, "detail", id] as const,
	idleDetail: () => [...attendanceQueryKeys.all, "detail", "idle"] as const,
};

export const enrollmentQueryKeys = {
	all: ["project", "enrollment"] as const,
	list: () => [...enrollmentQueryKeys.all, "list"] as const,
	detail: (projectId: string, formerStudentId: string) =>
		[...enrollmentQueryKeys.all, "detail", projectId, formerStudentId] as const,
	idleDetail: () =>
		[...enrollmentQueryKeys.all, "detail", "idle", "idle"] as const,
};

export const projectQueryKeys = {
	all: ["project", "project"] as const,
	list: () => [...projectQueryKeys.all, "list"] as const,
	detail: (id: string) => [...projectQueryKeys.all, "detail", id] as const,
	idleDetail: () => [...projectQueryKeys.all, "detail", "idle"] as const,
	schools: (id: string) => [...projectQueryKeys.all, "schools", id] as const,
	idleSchools: () => [...projectQueryKeys.all, "schools", "idle"] as const,
};
