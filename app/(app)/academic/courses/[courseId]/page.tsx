/*
 * Exception: app route wrappers import feature entries directly instead of
 * through the root features barrel to keep Next.js client/server boundaries
 * explicit during build collection.
 */
import { CoursePage } from "@/features/academic/courses/course/CoursePage";
import type { CourseRoutePageProps } from "@/types/client";

export default async function Page({ params }: CourseRoutePageProps) {
	const { courseId } = await params;

	return <CoursePage courseId={courseId} />;
}
