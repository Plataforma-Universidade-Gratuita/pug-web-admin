import { SchoolPage } from "@/features/academic/schools/school/SchoolPage";
import type { SchoolRoutePageProps } from "@/types";

export default async function Page({ params }: SchoolRoutePageProps) {
	const { schoolId } = await params;

	return <SchoolPage schoolId={schoolId} />;
}
