import { AdminPage } from "@/features";
import type { AdminRoutePageProps } from "@/types/client";

export default async function Page({ params }: AdminRoutePageProps) {
	const { adminId } = await params;

	return <AdminPage adminId={adminId} />;
}
