import { SchoolPage } from "@/features/academic/schools/school/SchoolPage";
// import type { SchoolRoutePageProps } from "@/types";

// export default async function Page({ params }: SchoolRoutePageProps) {
export default async function Page({ params }: any) {
	const { schoolId } = await params;

	// return <SchoolPage schoolId={schoolId} />;
    return (<></>);
}
