import { StudentPage } from "@/features/academic/students/student/StudentPage";
import type { StudentRoutePageProps } from "@/types";

export default async function Page({ params }: StudentRoutePageProps) {
	const { studentId } = await params;

	return <StudentPage studentId={studentId} />;
}
