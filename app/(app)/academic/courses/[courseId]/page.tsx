import { CoursePage } from "@/features/academic/courses/course/CoursePage";
import type { CourseRoutePageProps } from "@/types";

export default async function Page({ params }: CourseRoutePageProps) {
	const { courseId } = await params;

	// return <CoursePage courseId={courseId} />;
	return <></>;
}
