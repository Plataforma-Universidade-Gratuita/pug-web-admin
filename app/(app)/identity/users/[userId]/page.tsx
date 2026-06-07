import { UserPage } from "@/features";
import type { UserRoutePageProps } from "@/types/client";

export default async function Page({ params }: UserRoutePageProps) {
	const { userId } = await params;

	return <UserPage userId={userId} />;
}
