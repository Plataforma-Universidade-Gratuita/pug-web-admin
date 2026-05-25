import { UserPage } from "@/features/identity/users/user/UserPage";
import type { UserRoutePageProps } from "@/types";

export default async function Page({ params }: UserRoutePageProps) {
	const { userId } = await params;

	return <UserPage userId={userId} />;
}
