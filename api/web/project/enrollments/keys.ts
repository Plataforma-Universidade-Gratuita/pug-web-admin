/*
 * Copyright (c) 2026 Mateus Fernandes and Plataforma Universidade Gratuita.
 * All rights reserved.
 *
 * This source code is proprietary and confidential. Unauthorized use,
 * copying, modification, distribution, or deployment is prohibited.
 */

export const enrollmentKeys = {
	all: ["project", "enrollment"] as const,
	list: () => [...enrollmentKeys.all, "list"] as const,
	search: (page: number, size: number, filtersKey: string) =>
		[...enrollmentKeys.all, "search", page, size, filtersKey] as const,
	detail: (projectId: string, formerStudentId: string) =>
		[...enrollmentKeys.all, "detail", projectId, formerStudentId] as const,
	idleDetail: () => [...enrollmentKeys.all, "detail", "idle", "idle"] as const,
};
