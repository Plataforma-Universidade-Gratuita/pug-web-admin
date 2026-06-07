import { AttendancePage } from "@/features";
import type { AttendanceRoutePageProps } from "@/types/client";

export default async function Page({ params }: AttendanceRoutePageProps) {
	const { attendanceId } = await params;

	return <AttendancePage attendanceId={attendanceId} />;
}
