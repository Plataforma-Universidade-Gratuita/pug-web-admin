import { StaffPage } from "@/features/partner/staff/staff/StaffPage";
import type { StaffRoutePageProps } from "@/types";

export default async function Page({ params }: StaffRoutePageProps) {
	const { staffId } = await params;

	// return <StaffPage staffId={staffId} />;
    return (<></>);
}
