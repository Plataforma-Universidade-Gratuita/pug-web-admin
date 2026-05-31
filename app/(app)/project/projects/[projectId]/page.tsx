import { ProjectPage } from "@/features/project/projects/project/ProjectPage";
import type { ProjectRoutePageProps } from "@/types";

export default async function Page({ params }: ProjectRoutePageProps) {
	const { projectId } = await params;

	// return <ProjectPage projectId={projectId} />;
    return (<></>);
}
