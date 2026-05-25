"use client";

import { useTranslation } from "react-i18next";

import {
	Badge,
	Dialog,
	DialogBody,
	DialogContent,
	DialogHeader,
	DialogTitle,
	NotFoundState,
	SomeErrorState,
} from "@/components";
import {
	getAttendanceStatusLabel,
	getAttendanceStatusTone,
	resolveAttendanceProjectLabel,
	resolveAttendanceStudentLabel,
	resolveAttendanceValidatorLabel,
} from "@/features/project/attendance/utils";
import type { AttendanceDetailDialogProps } from "@/types/client/project";
import { WebApiError } from "@/utils/web-api";

export function AttendanceDetailDialog({
	adminById,
	attendance,
	error,
	isError,
	isLoading,
	onOpenChange,
	onRefresh,
	open,
	projectById,
	studentById,
}: AttendanceDetailDialogProps) {
	const { t } = useTranslation();
	const student = attendance
		? studentById.get(attendance.studentId)
		: undefined;

	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
			isLoading={isLoading}
			loadingLabel={t("project.attendancePage.loading.detail")}
		>
			<DialogContent>
				<DialogHeader overhead={t("project.attendancePage.dialog.overhead")}>
					<DialogTitle>
						{attendance
							? resolveAttendanceStudentLabel(studentById, attendance.studentId)
							: t("project.attendancePage.dialog.titleFallback")}
					</DialogTitle>
				</DialogHeader>
				<DialogBody className="grid justify-items-start gap-6">
					{isError ? (
						error instanceof WebApiError && error.status === 404 ? (
							<NotFoundState
								title={t("project.attendancePage.dialog.notFound.title")}
								description={t(
									"project.attendancePage.dialog.notFound.description",
								)}
							/>
						) : (
							<SomeErrorState
								title={t("project.attendancePage.dialog.error.title")}
								description={t(
									"project.attendancePage.dialog.error.description",
								)}
								onRefresh={onRefresh}
							/>
						)
					) : attendance ? (
						<div className="grid w-full gap-6 lg:grid-cols-2 lg:gap-8">
							<div className="grid gap-4">
								<div className="grid gap-1">
									<p className="ty-helper">
										{t("project.attendancePage.dialog.fields.student")}
									</p>
									<p className="ty-sm-semibold">
										{resolveAttendanceStudentLabel(
											studentById,
											attendance.studentId,
										)}
									</p>
								</div>
								<div className="grid gap-1">
									<p className="ty-helper">
										{t("project.attendancePage.dialog.fields.studentId")}
									</p>
									<p className="ty-sm-semibold">{attendance.studentId}</p>
								</div>
								<div className="grid gap-1">
									<p className="ty-helper">
										{t("project.attendancePage.dialog.fields.email")}
									</p>
									<p className="ty-sm-semibold">
										{student?.accountEmail ??
											t("project.attendancePage.dialog.values.unknownStudent")}
									</p>
								</div>
								<div className="grid gap-1">
									<p className="ty-helper">
										{t("project.attendancePage.dialog.fields.registration")}
									</p>
									<p className="ty-sm-semibold">
										{student?.academicRegistration ??
											t("project.attendancePage.dialog.values.unknownStudent")}
									</p>
								</div>
								<div className="grid gap-1">
									<p className="ty-helper">
										{t("project.attendancePage.dialog.fields.project")}
									</p>
									<p className="ty-sm-semibold">
										{resolveAttendanceProjectLabel(
											projectById,
											attendance.projectId,
										)}
									</p>
								</div>
								<div className="grid gap-1">
									<p className="ty-helper">
										{t("project.attendancePage.dialog.fields.projectId")}
									</p>
									<p className="ty-sm-semibold">{attendance.projectId}</p>
								</div>
							</div>

							<div className="grid gap-4">
								<div className="grid gap-1">
									<p className="ty-helper">
										{t("project.attendancePage.dialog.fields.duration")}
									</p>
									<p className="ty-sm-semibold">{attendance.duration}</p>
								</div>
								<div className="grid gap-1">
									<p className="ty-helper">
										{t("project.attendancePage.dialog.fields.status")}
									</p>
									<div className="flex">
										<Badge
											tone={getAttendanceStatusTone(attendance.status)}
											variant="primary"
										>
											{getAttendanceStatusLabel(t, attendance.status)}
										</Badge>
									</div>
								</div>
								<div className="grid gap-1">
									<p className="ty-helper">
										{t("project.attendancePage.dialog.fields.qrValidationHash")}
									</p>
									<p className="ty-sm-semibold break-all">
										{attendance.qrValidationHash}
									</p>
								</div>
								<div className="grid gap-1">
									<p className="ty-helper">
										{t("project.attendancePage.dialog.fields.validatedBy")}
									</p>
									<p className="ty-sm-semibold">
										{resolveAttendanceValidatorLabel(
											adminById,
											attendance.validatedById,
										) ?? t("project.attendancePage.dialog.values.notValidated")}
									</p>
								</div>
								<div className="grid gap-1">
									<p className="ty-helper">
										{t("project.attendancePage.dialog.fields.validatedAt")}
									</p>
									<p className="ty-sm-semibold">
										{attendance.validatedAt
											? attendance.validatedAtFormatted
											: t("project.attendancePage.dialog.values.notValidated")}
									</p>
								</div>
								<div className="grid gap-1">
									<p className="ty-helper">
										{t("project.attendancePage.dialog.fields.id")}
									</p>
									<p className="ty-sm-semibold">{attendance.id}</p>
								</div>
								<div className="grid gap-1">
									<p className="ty-helper">
										{t("project.attendancePage.dialog.fields.createdAt")}
									</p>
									<p className="ty-sm-semibold">
										{attendance.auditInfo.createdAtFormatted}
									</p>
								</div>
								<div className="grid gap-1">
									<p className="ty-helper">
										{t("project.attendancePage.dialog.fields.updatedAt")}
									</p>
									<p className="ty-sm-semibold">
										{attendance.auditInfo.updatedAtFormatted}
									</p>
								</div>
							</div>
						</div>
					) : (
						<NotFoundState
							title={t("project.attendancePage.dialog.notFound.title")}
						/>
					)}
				</DialogBody>
			</DialogContent>
		</Dialog>
	);
}
