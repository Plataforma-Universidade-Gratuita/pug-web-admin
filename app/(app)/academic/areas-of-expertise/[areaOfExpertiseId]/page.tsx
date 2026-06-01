import {AreaOfExpertisePage} from "@/features/academic/areas-of-expertise/area-of-expertise/AreaOfExpertisePage";
import type { AreaOfExpertiseRoutePageProps } from "@/types";

export default async function Page({ params }: AreaOfExpertiseRoutePageProps) {
    const { areaOfExpertiseId } = await params;

	return <AreaOfExpertisePage areaOfExpertiseId={areaOfExpertiseId} />;
}
