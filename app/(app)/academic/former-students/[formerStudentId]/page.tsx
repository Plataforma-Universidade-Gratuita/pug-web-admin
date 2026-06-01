
import type { FormerStudentRoutePageProps } from "@/types";
import { FormerStudentPage } from "@/features/academic/former-students/former-student/FormerStudentPage";

export default async function Page({ params }: FormerStudentRoutePageProps) {
	const { formerStudentId } = await params;

	return <FormerStudentPage formerStudentId={formerStudentId} />;
}
