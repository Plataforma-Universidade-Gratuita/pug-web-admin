import { EntityPage } from "@/features";
import type { EntityRoutePageProps } from "@/types/client";

export default async function Page({ params }: EntityRoutePageProps) {
	const { entityId } = await params;

	return <EntityPage entityId={entityId} />;
}
