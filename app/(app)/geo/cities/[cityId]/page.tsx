import { CityPage } from "@/features/geo/cities/city/CityPage";
import type { CityRoutePageProps } from "@/types";

export default async function Page({ params }: CityRoutePageProps) {
	const { cityId } = await params;

	return <CityPage cityId={cityId} />;
}
