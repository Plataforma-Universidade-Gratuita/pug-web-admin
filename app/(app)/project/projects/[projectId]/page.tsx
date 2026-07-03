/*
 * Copyright (c) 2026 Mateus Fernandes and Plataforma Universidade Gratuita.
 * All rights reserved.
 *
 * This source code is proprietary and confidential. Unauthorized use,
 * copying, modification, distribution, or deployment is prohibited.
 */
/*
 * Exception: app route wrappers import feature entries directly instead of
 * through the root features barrel to keep Next.js client/server boundaries
 * explicit during build collection.
 */
import { ProjectPage } from "@/features/project/projects/project/ProjectPage";
import type { ProjectRoutePageProps } from "@/types/client";

export default async function Page({ params }: ProjectRoutePageProps) {
	const { projectId } = await params;

	return <ProjectPage projectId={projectId} />;
}
