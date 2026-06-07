/*
 * Exception: app route wrappers import feature entries directly instead of
 * through the root features barrel to keep Next.js client/server boundaries
 * explicit during build collection.
 */
import { AccountPage } from "@/features/identity/accounts/account/AccountPage";
import type { AccountRoutePageProps } from "@/types/client";

export default async function Page({ params }: AccountRoutePageProps) {
	const { accountId } = await params;

	return <AccountPage accountId={accountId} />;
}
