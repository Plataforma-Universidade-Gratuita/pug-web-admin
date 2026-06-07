/*
 * Exception: app route wrappers import feature entries directly instead of
 * through the root features barrel to keep Next.js client/server boundaries
 * explicit during build collection.
 */
import { FormerStudentPage } from "@/features/academic/former-students/former-student/FormerStudentPage";
import type { FormerStudentRoutePageProps } from "@/types/client";

export default async function Page({ params }: FormerStudentRoutePageProps) {
	const { formerStudentId } = await params;

	return <FormerStudentPage formerStudentId={formerStudentId} />;
}
