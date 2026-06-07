/*
 * Exception: app route wrappers import feature entries directly instead of
 * through the root features barrel to keep Next.js client/server boundaries
 * explicit during build collection.
 */
import { EntitiesPage } from "@/features/partner/entities/EntitiesPage";

export default function Page() {
	return <EntitiesPage />;
}
