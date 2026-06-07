/*
 * Exception: app route wrappers import feature entries directly instead of
 * through the root features barrel to keep Next.js client/server boundaries
 * explicit during build collection.
 */
import { StaffPage as StaffDirectoryPage } from "@/features/partner/staff/StaffPage";

export default function Page() {
	return <StaffDirectoryPage />;
}
