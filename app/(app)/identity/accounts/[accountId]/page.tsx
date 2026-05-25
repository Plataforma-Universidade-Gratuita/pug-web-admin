import { AccountPage } from "@/features/identity/accounts/account/AccountPage";
import type { AccountRoutePageProps } from "@/types";

export default async function Page({ params }: AccountRoutePageProps) {
	const { accountId } = await params;

	return <AccountPage accountId={accountId} />;
}
