/*
 * Exception: app route wrappers import feature entries directly instead of
 * through the root features barrel to keep Next.js client/server boundaries
 * explicit during build collection.
 */
import { FormerStudentsPage } from "@/features/academic/former-students/FormerStudentsPage";

export default function Page() {
	return <FormerStudentsPage />;
}
