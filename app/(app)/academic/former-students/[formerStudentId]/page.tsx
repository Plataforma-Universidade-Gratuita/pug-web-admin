import { FormerStudentPage } from "@/features";
import type { FormerStudentRoutePageProps } from "@/types/client";

export default async function Page({ params }: FormerStudentRoutePageProps) {
	const { formerStudentId } = await params;

	return <FormerStudentPage formerStudentId={formerStudentId} />;
}
