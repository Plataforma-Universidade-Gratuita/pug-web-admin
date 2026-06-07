/*
 * Exception: app route wrappers import feature entries directly instead of
 * through the root features barrel to keep Next.js client/server boundaries
 * explicit during build collection.
 */
import { AreasOfExpertisePage } from "@/features/academic/areas-of-expertise/AreasOfExpertisePage";

export default function Page() {
	return <AreasOfExpertisePage />;
}
