/*
 * Exception: app route wrappers import feature entries directly instead of
 * through the root features barrel to keep Next.js client/server boundaries
 * explicit during build collection.
 */
import { CitiesPage } from "@/features/geo/cities/CitiesPage";

export default function Page() {
	return <CitiesPage />;
}
