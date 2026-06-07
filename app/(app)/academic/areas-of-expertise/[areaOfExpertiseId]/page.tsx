import { AreaOfExpertisePage } from "@/features";
import type { AreaOfExpertiseRoutePageProps } from "@/types/client";

export default async function Page({ params }: AreaOfExpertiseRoutePageProps) {
	const { areaOfExpertiseId } = await params;

	return <AreaOfExpertisePage areaOfExpertiseId={areaOfExpertiseId} />;
}
