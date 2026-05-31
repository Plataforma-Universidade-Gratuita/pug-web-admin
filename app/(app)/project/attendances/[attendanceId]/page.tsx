import { AttendancePage } from "@/features/project/attendances/attendance/AttendancePage";
import type { AttendanceRoutePageProps } from "@/types";

export default async function Page({ params }: AttendanceRoutePageProps) {
	const { attendanceId } = await params;

	// return <AttendancePage attendanceId={attendanceId} />;
    return (<></>);
}
