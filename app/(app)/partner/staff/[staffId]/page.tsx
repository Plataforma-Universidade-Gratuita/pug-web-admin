import { StaffPage } from "@/features";
import type { StaffRoutePageProps } from "@/types/client";

export default async function Page({ params }: StaffRoutePageProps) {
	const { staffId } = await params;

	return <StaffPage staffId={staffId} />;
}
