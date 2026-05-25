import { AdminPage } from "@/features/identity/admins/admin/AdminPage";
import type { AdminRoutePageProps } from "@/types";

export default async function Page({ params }: AdminRoutePageProps) {
	const { adminId } = await params;

	return <AdminPage adminId={adminId} />;
}
