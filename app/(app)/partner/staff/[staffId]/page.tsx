/*
 * Exception: app route wrappers import feature entries directly instead of
 * through the root features barrel to keep Next.js client/server boundaries
 * explicit during build collection.
 */
import { StaffPage } from "@/features/partner/staff/staff/StaffPage";
import type { StaffRoutePageProps } from "@/types/client";

export default async function Page({ params }: StaffRoutePageProps) {
	const { staffId } = await params;

	return <StaffPage staffId={staffId} />;
}
