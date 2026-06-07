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
