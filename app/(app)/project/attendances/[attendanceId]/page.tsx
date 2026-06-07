/*
 * Exception: app route wrappers import feature entries directly instead of
 * through the root features barrel to keep Next.js client/server boundaries
 * explicit during build collection.
 */
import { AttendancePage } from "@/features/project/attendances/attendance/AttendancePage";
import type { AttendanceRoutePageProps } from "@/types/client";

export default async function Page({ params }: AttendanceRoutePageProps) {
	const { attendanceId } = await params;

	return <AttendancePage attendanceId={attendanceId} />;
}
