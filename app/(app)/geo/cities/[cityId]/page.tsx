import { CityPage } from "@/features";
import type { CityRoutePageProps } from "@/types/client";

export default async function Page({ params }: CityRoutePageProps) {
	const { cityId } = await params;

	return <CityPage cityId={cityId} />;
}
