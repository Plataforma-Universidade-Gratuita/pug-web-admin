import { CoursePage } from "@/features";
import type { CourseRoutePageProps } from "@/types/client";

export default async function Page({ params }: CourseRoutePageProps) {
	const { courseId } = await params;

	return <CoursePage courseId={courseId} />;
}
