/*
 * Exception: app route wrappers import feature entries directly instead of
 * through the root features barrel to keep Next.js client/server boundaries
 * explicit during build collection.
 */
import { AdminPage } from "@/features/identity/admins/admin/AdminPage";
import type { AdminRoutePageProps } from "@/types/client";

export default async function Page({ params }: AdminRoutePageProps) {
	const { adminId } = await params;

	return <AdminPage adminId={adminId} />;
}
