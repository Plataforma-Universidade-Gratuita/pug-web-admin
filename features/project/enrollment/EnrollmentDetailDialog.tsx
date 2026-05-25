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
	getEnrollmentStatusLabel,
	getEnrollmentStatusTone,
	resolveEnrollmentProjectLabel,
	resolveEnrollmentStudentLabel,
} from "@/features/project/enrollment/utils";
import type { EnrollmentDetailDialogProps } from "@/types";
import { WebApiError } from "@/utils";

export function EnrollmentDetailDialog({
	enrollment,
	error,
	isError,
	isLoading,
	onOpenChange,
	onRefresh,
	open,
	projectById,
	studentById,
}: EnrollmentDetailDialogProps) {
	const { t } = useTranslation();
	const student = enrollment
		? studentById.get(enrollment.studentId)
		: undefined;

	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
			isLoading={isLoading}
			loadingLabel={t("project.enrollmentPage.loading.detail")}
		>
			<DialogContent>
				<DialogHeader overhead={t("project.enrollmentPage.dialog.overhead")}>
					<DialogTitle>
						{enrollment
							? resolveEnrollmentStudentLabel(studentById, enrollment.studentId)
							: t("project.enrollmentPage.dialog.titleFallback")}
					</DialogTitle>
				</DialogHeader>
				<DialogBody className="grid justify-items-start gap-6">
					{isError ? (
						error instanceof WebApiError && error.status === 404 ? (
							<NotFoundState
								title={t("project.enrollmentPage.dialog.notFound.title")}
								description={t(
									"project.enrollmentPage.dialog.notFound.description",
								)}
							/>
						) : (
							<SomeErrorState
								title={t("project.enrollmentPage.dialog.error.title")}
								description={t(
									"project.enrollmentPage.dialog.error.description",
								)}
								onRefresh={onRefresh}
							/>
						)
					) : enrollment ? (
						<div className="grid w-full gap-6 lg:grid-cols-2 lg:gap-8">
							<div className="grid gap-4">
								<div className="grid gap-1">
									<p className="ty-helper">
										{t("project.enrollmentPage.dialog.fields.student")}
									</p>
									<p className="ty-sm-semibold">
										{resolveEnrollmentStudentLabel(
											studentById,
											enrollment.studentId,
										)}
									</p>
								</div>
								<div className="grid gap-1">
									<p className="ty-helper">
										{t("project.enrollmentPage.dialog.fields.studentId")}
									</p>
									<p className="ty-sm-semibold">{enrollment.studentId}</p>
								</div>
								<div className="grid gap-1">
									<p className="ty-helper">
										{t("project.enrollmentPage.dialog.fields.email")}
									</p>
									<p className="ty-sm-semibold">
										{student?.accountEmail ??
											t("project.enrollmentPage.dialog.values.unknownStudent")}
									</p>
								</div>
								<div className="grid gap-1">
									<p className="ty-helper">
										{t("project.enrollmentPage.dialog.fields.registration")}
									</p>
									<p className="ty-sm-semibold">
										{student?.academicRegistration ??
											t("project.enrollmentPage.dialog.values.unknownStudent")}
									</p>
								</div>
								<div className="grid gap-1">
									<p className="ty-helper">
										{t("project.enrollmentPage.dialog.fields.project")}
									</p>
									<p className="ty-sm-semibold">
										{resolveEnrollmentProjectLabel(
											projectById,
											enrollment.projectId,
										)}
									</p>
								</div>
								<div className="grid gap-1">
									<p className="ty-helper">
										{t("project.enrollmentPage.dialog.fields.projectId")}
									</p>
									<p className="ty-sm-semibold">{enrollment.projectId}</p>
								</div>
							</div>

							<div className="grid gap-4">
								<div className="grid gap-1">
									<p className="ty-helper">
										{t("project.enrollmentPage.dialog.fields.status")}
									</p>
									<div className="flex">
										<Badge
											tone={getEnrollmentStatusTone(enrollment.status)}
											variant="primary"
										>
											{getEnrollmentStatusLabel(t, enrollment.status)}
										</Badge>
									</div>
								</div>
								<div className="grid gap-1">
									<p className="ty-helper">
										{t("project.enrollmentPage.dialog.fields.acceptedAt")}
									</p>
									<p className="ty-sm-semibold">
										{enrollment.acceptedAt
											? enrollment.acceptedAtFormatted
											: t("project.enrollmentPage.dialog.values.notAccepted")}
									</p>
								</div>
								<div className="grid gap-1">
									<p className="ty-helper">
										{t("project.enrollmentPage.dialog.fields.closingStatusAt")}
									</p>
									<p className="ty-sm-semibold">
										{enrollment.closingStatusAt
											? enrollment.closingStatusAtFormatted
											: t("project.enrollmentPage.dialog.values.open")}
									</p>
								</div>
								<div className="grid gap-1">
									<p className="ty-helper">
										{t("project.enrollmentPage.dialog.fields.createdAt")}
									</p>
									<p className="ty-sm-semibold">
										{enrollment.auditInfo.createdAtFormatted}
									</p>
								</div>
								<div className="grid gap-1">
									<p className="ty-helper">
										{t("project.enrollmentPage.dialog.fields.updatedAt")}
									</p>
									<p className="ty-sm-semibold">
										{enrollment.auditInfo.updatedAtFormatted}
									</p>
								</div>
							</div>
						</div>
					) : (
						<NotFoundState
							title={t("project.enrollmentPage.dialog.notFound.title")}
						/>
					)}
				</DialogBody>
			</DialogContent>
		</Dialog>
	);
}
