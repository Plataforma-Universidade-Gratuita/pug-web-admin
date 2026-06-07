/*
 * Exception: app route wrappers import feature entries directly instead of
 * through the root features barrel to keep Next.js client/server boundaries
 * explicit during build collection.
 */
import { UserPage } from "@/features/identity/users/user/UserPage";
import type { UserRoutePageProps } from "@/types/client";

export default async function Page({ params }: UserRoutePageProps) {
	const { userId } = await params;

	return <UserPage userId={userId} />;
}
