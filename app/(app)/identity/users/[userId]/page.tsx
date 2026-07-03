/*
 * Copyright (c) 2026 Mateus Fernandes and Plataforma Universidade Gratuita.
 * All rights reserved.
 *
 * This source code is proprietary and confidential. Unauthorized use,
 * copying, modification, distribution, or deployment is prohibited.
 */
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
