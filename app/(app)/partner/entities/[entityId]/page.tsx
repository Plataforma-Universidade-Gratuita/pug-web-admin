import { EntityPage } from "@/features/partner/entities/entity/EntityPage";
import type { EntityRoutePageProps } from "@/types";

export default async function Page({ params }: EntityRoutePageProps) {
	const { entityId } = await params;

	// return <EntityPage entityId={entityId} />;
	return <></>;
}
