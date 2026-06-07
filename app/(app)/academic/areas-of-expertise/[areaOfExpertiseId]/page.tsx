/*
 * Exception: app route wrappers import feature entries directly instead of
 * through the root features barrel to keep Next.js client/server boundaries
 * explicit during build collection.
 */
import { AreaOfExpertisePage } from "@/features/academic/areas-of-expertise/area-of-expertise/AreaOfExpertisePage";
import type { AreaOfExpertiseRoutePageProps } from "@/types/client";

export default async function Page({ params }: AreaOfExpertiseRoutePageProps) {
	const { areaOfExpertiseId } = await params;

	return <AreaOfExpertisePage areaOfExpertiseId={areaOfExpertiseId} />;
}
