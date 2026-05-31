import { EnrollmentPage } from "@/features/project/enrollments/enrollment/EnrollmentPage";
import type { EnrollmentRoutePageProps } from "@/types";

export default async function Page({ params }: EnrollmentRoutePageProps) {
	const { enrollmentId } = await params;

	// return <EnrollmentPage enrollmentId={enrollmentId} />;
    return (<></>);
}
