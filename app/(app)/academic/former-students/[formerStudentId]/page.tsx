import { FormerStudentPage } from "@/features/academic/former-students/former-student/FormerStudentPage";
import type { FormerStudentRoutePageProps } from "@/types";

export default async function Page({ params }: FormerStudentRoutePageProps) {
	const { formerStudentId } = await params;

	return <FormerStudentPage formerStudentId={formerStudentId} />;
}
