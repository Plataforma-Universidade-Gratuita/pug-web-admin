/*
 * Exception: app route wrappers import feature entries directly instead of
 * through the root features barrel to keep Next.js client/server boundaries
 * explicit during build collection.
 */
import { EnrollmentPage } from "@/features/project/enrollments/enrollment/EnrollmentPage";
import type { EnrollmentRoutePageProps } from "@/types/client";

export default async function Page({ params }: EnrollmentRoutePageProps) {
	const { enrollmentId } = await params;

	return <EnrollmentPage enrollmentId={enrollmentId} />;
}
