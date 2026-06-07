/*
 * Exception: app route wrappers import feature entries directly instead of
 * through the root features barrel to keep Next.js client/server boundaries
 * explicit during build collection.
 */
import { ProjectOverviewPage } from "@/features/project/ProjectOverviewPage";

export default function Page() {
	return <ProjectOverviewPage />;
}
