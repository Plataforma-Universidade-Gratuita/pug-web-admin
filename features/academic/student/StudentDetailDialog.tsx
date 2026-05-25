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
import type { StudentDetailDialogProps } from "@/types";
import { WebApiError } from "@/utils";

export function StudentDetailDialog({
	courseName,
	error,
	isError,
	isLoading,
	onOpenChange,
	onRefresh,
	open,
	student,
}: StudentDetailDialogProps) {
	const { t } = useTranslation();

	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
			isLoading={isLoading}
			loadingLabel={t("academic.studentPage.loading.detail")}
		>
			<DialogContent>
				<DialogHeader overhead={t("academic.studentPage.dialog.overhead")}>
					<DialogTitle>
						{student?.userName ??
							t("academic.studentPage.dialog.titleFallback")}
					</DialogTitle>
				</DialogHeader>
				<DialogBody className="grid justify-items-start gap-6">
					{isError ? (
						error instanceof WebApiError && error.status === 404 ? (
							<NotFoundState
								title={t("academic.studentPage.dialog.notFound.title")}
								description={t(
									"academic.studentPage.dialog.notFound.description",
								)}
							/>
						) : (
							<SomeErrorState
								title={t("academic.studentPage.dialog.error.title")}
								description={t("academic.studentPage.dialog.error.description")}
								onRefresh={onRefresh}
							/>
						)
					) : student ? (
						<div className="grid w-full gap-6 lg:grid-cols-2 lg:gap-8">
							<div className="grid gap-4">
								<div className="grid gap-1">
									<p className="ty-helper">
										{t("academic.studentPage.dialog.fields.userId")}
									</p>
									<p className="ty-sm-semibold">{student.userId}</p>
								</div>
								<div className="grid gap-1">
									<p className="ty-helper">
										{t("academic.studentPage.dialog.fields.accountId")}
									</p>
									<p className="ty-sm-semibold">{student.accountId}</p>
								</div>
								<div className="grid gap-1">
									<p className="ty-helper">
										{t("academic.studentPage.dialog.fields.name")}
									</p>
									<p className="ty-sm-semibold">{student.userName}</p>
								</div>
								<div className="grid gap-1">
									<p className="ty-helper">
										{t("academic.studentPage.dialog.fields.email")}
									</p>
									<p className="ty-sm-semibold">{student.accountEmail}</p>
								</div>
								<div className="grid gap-1">
									<p className="ty-helper">
										{t("academic.studentPage.dialog.fields.active")}
									</p>
									<div>
										<Badge
											className="min-h-5 px-2 py-0.5"
											tone={student.accountActive ? "success" : "danger"}
											variant="primary"
										>
											{student.accountActive
												? t("academic.studentPage.dialog.active.yes")
												: t("academic.studentPage.dialog.active.no")}
										</Badge>
									</div>
								</div>
								<div className="grid gap-1">
									<p className="ty-helper">
										{t(
											"academic.studentPage.dialog.fields.academicRegistration",
										)}
									</p>
									<p className="ty-sm-semibold">
										{student.academicRegistration}
									</p>
								</div>
							</div>

							<div className="grid gap-4">
								<div className="grid gap-1">
									<p className="ty-helper">
										{t("academic.studentPage.dialog.fields.campus")}
									</p>
									<p className="ty-sm-semibold">
										{student.campus.campusFormatted}
									</p>
								</div>
								<div className="grid gap-1">
									<p className="ty-helper">
										{t("academic.studentPage.dialog.fields.course")}
									</p>
									<p className="ty-sm-semibold">{courseName}</p>
								</div>
								<div className="grid gap-1">
									<p className="ty-helper">
										{t("academic.studentPage.dialog.fields.requiredHours")}
									</p>
									<p className="ty-sm-semibold">{student.requiredHours}</p>
								</div>
								<div className="grid gap-1">
									<p className="ty-helper">
										{t("academic.studentPage.dialog.fields.completedHours")}
									</p>
									<p className="ty-sm-semibold">{student.completedHours}</p>
								</div>
								<div className="grid gap-1">
									<p className="ty-helper">
										{t("academic.studentPage.dialog.fields.missingHours")}
									</p>
									<p className="ty-sm-semibold">{student.missingHours}</p>
								</div>
								<div className="grid gap-1">
									<p className="ty-helper">
										{t("academic.studentPage.dialog.fields.startDate")}
									</p>
									<p className="ty-sm-semibold">{student.startDateFormatted}</p>
								</div>
								<div className="grid gap-1">
									<p className="ty-helper">
										{t("academic.studentPage.dialog.fields.dueDate")}
									</p>
									<p className="ty-sm-semibold">{student.dueDateFormatted}</p>
								</div>
								<div className="grid gap-1">
									<p className="ty-helper">
										{t("academic.studentPage.dialog.fields.remainingDays")}
									</p>
									<p className="ty-sm-semibold">
										{student.remainingDaysFormatted}
									</p>
								</div>
								<div className="grid gap-1">
									<p className="ty-helper">
										{t("academic.studentPage.dialog.fields.createdAt")}
									</p>
									<p className="ty-sm-semibold">
										{student.auditInfo.createdAtFormatted}
									</p>
								</div>
								<div className="grid gap-1">
									<p className="ty-helper">
										{t("academic.studentPage.dialog.fields.updatedAt")}
									</p>
									<p className="ty-sm-semibold">
										{student.auditInfo.updatedAtFormatted}
									</p>
								</div>
							</div>
						</div>
					) : (
						<NotFoundState
							title={t("academic.studentPage.dialog.notFound.title")}
						/>
					)}
				</DialogBody>
			</DialogContent>
		</Dialog>
	);
}
