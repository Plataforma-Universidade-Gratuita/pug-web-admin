import { AccountPage } from "@/features";
import type { AccountRoutePageProps } from "@/types/client";

export default async function Page({ params }: AccountRoutePageProps) {
	const { accountId } = await params;

	return <AccountPage accountId={accountId} />;
}
