import { ProjectPage } from "@/features";
import type { ProjectRoutePageProps } from "@/types/client";

export default async function Page({ params }: ProjectRoutePageProps) {
	const { projectId } = await params;

	return <ProjectPage projectId={projectId} />;
}
