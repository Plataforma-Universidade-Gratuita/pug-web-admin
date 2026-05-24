"use client";

import { useTranslation } from "react-i18next";

import {
	Dialog,
	DialogBody,
	DialogContent,
	DialogHeader,
	DialogTitle,
	NotFoundState,
	SomeErrorState,
} from "@/components";
import type { CourseDetailDialogProps } from "@/types/client/academic";
import { WebApiError } from "@/utils/web-api";

export function CourseDetailDialog({
	course,
	error,
	isError,
	isLoading,
	onOpenChange,
	onRefresh,
	open,
}: CourseDetailDialogProps) {
	const { t } = useTranslation();

	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
			isLoading={isLoading}
			loadingLabel={t("academic.coursePage.loading.detail")}
		>
			<DialogContent>
				<DialogHeader overhead={t("academic.coursePage.dialog.overhead")}>
					<DialogTitle>
						{course?.name ?? t("academic.coursePage.dialog.titleFallback")}
					</DialogTitle>
				</DialogHeader>
				<DialogBody className="grid justify-items-start gap-6">
					{isError ? (
						error instanceof WebApiError && error.status === 404 ? (
							<NotFoundState
								title={t("academic.coursePage.dialog.notFound.title")}
								description={t(
									"academic.coursePage.dialog.notFound.description",
								)}
							/>
						) : (
							<SomeErrorState
								title={t("academic.coursePage.dialog.error.title")}
								description={t("academic.coursePage.dialog.error.description")}
								onRefresh={onRefresh}
							/>
						)
					) : course ? (
						<div className="grid w-full gap-6 lg:grid-cols-2 lg:gap-8">
							<div className="grid gap-4">
								<div className="grid gap-1">
									<p className="ty-helper">
										{t("academic.coursePage.dialog.fields.name")}
									</p>
									<p className="ty-sm-semibold">{course.name}</p>
								</div>
								<div className="grid gap-1">
									<p className="ty-helper">
										{t("academic.coursePage.dialog.fields.school")}
									</p>
									<p className="ty-sm-semibold">{course.school.name}</p>
								</div>
								<div className="grid gap-1">
									<p className="ty-helper">
										{t("academic.coursePage.dialog.fields.id")}
									</p>
									<p className="ty-sm-semibold">{course.id}</p>
								</div>
							</div>

							<div className="grid gap-4">
								<div className="grid gap-1">
									<p className="ty-helper">
										{t("academic.coursePage.dialog.fields.createdAt")}
									</p>
									<p className="ty-sm-semibold">
										{course.auditInfo.createdAtFormatted}
									</p>
								</div>
								<div className="grid gap-1">
									<p className="ty-helper">
										{t("academic.coursePage.dialog.fields.updatedAt")}
									</p>
									<p className="ty-sm-semibold">
										{course.auditInfo.updatedAtFormatted}
									</p>
								</div>
							</div>
						</div>
					) : (
						<NotFoundState
							title={t("academic.coursePage.dialog.notFound.title")}
						/>
					)}
				</DialogBody>
			</DialogContent>
		</Dialog>
	);
}
