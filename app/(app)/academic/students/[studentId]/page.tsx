import { StudentPage } from "@/features/academic/students/student/StudentPage";
import type { FormerStudentRoutePageProps } from "@/types";

export default async function Page({ params }: FormerStudentRoutePageProps) {
	const { formerStudentId } = await params;

	// return <StudentPage studentId={studentId} />;
	return <></>;
}
