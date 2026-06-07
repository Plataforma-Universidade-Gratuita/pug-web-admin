import { EnrollmentPage } from "@/features";
import type { EnrollmentRoutePageProps } from "@/types/client";

export default async function Page({ params }: EnrollmentRoutePageProps) {
	const { enrollmentId } = await params;

	return <EnrollmentPage enrollmentId={enrollmentId} />;
}
