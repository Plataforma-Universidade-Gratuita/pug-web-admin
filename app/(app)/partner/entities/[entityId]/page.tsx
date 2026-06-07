/*
 * Exception: app route wrappers import feature entries directly instead of
 * through the root features barrel to keep Next.js client/server boundaries
 * explicit during build collection.
 */
import { EntityPage } from "@/features/partner/entities/entity/EntityPage";
import type { EntityRoutePageProps } from "@/types/client";

export default async function Page({ params }: EntityRoutePageProps) {
	const { entityId } = await params;

	return <EntityPage entityId={entityId} />;
}
