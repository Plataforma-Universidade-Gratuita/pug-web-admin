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
	formatProjectSchoolNames,
	getProjectStatusLabel,
	getProjectStatusTone,
	resolveProjectCreatorLabel,
	resolveProjectEntityLabel,
} from "@/features/project/project/utils";
import type { ProjectDetailDialogProps } from "@/types";
import { WebApiError } from "@/utils";

export function ProjectDetailDialog({
	adminById,
	entityById,
	error,
	isError,
	isLoading,
	onOpenChange,
	onRefresh,
	onRefreshSchools,
	open,
	project,
	schools,
	schoolsIsError,
	schoolsIsLoading,
}: ProjectDetailDialogProps) {
	const { t } = useTranslation();
	const schoolNames = formatProjectSchoolNames(schools);

	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
			isLoading={isLoading}
			loadingLabel={t("project.projectPage.loading.detail")}
		>
			<DialogContent>
				<DialogHeader overhead={t("project.projectPage.dialog.overhead")}>
					<DialogTitle>
						{project?.name ?? t("project.projectPage.dialog.titleFallback")}
					</DialogTitle>
				</DialogHeader>
				<DialogBody className="grid justify-items-start gap-6">
					{isError ? (
						error instanceof WebApiError && error.status === 404 ? (
							<NotFoundState
								title={t("project.projectPage.dialog.notFound.title")}
								description={t(
									"project.projectPage.dialog.notFound.description",
								)}
							/>
						) : (
							<SomeErrorState
								title={t("project.projectPage.dialog.error.title")}
								description={t("project.projectPage.dialog.error.description")}
								onRefresh={onRefresh}
							/>
						)
					) : project ? (
						<div className="grid w-full gap-6 lg:grid-cols-2 lg:gap-8">
							<div className="grid gap-4">
								<div className="grid gap-1">
									<p className="ty-helper">
										{t("project.projectPage.dialog.fields.name")}
									</p>
									<p className="ty-sm-semibold">{project.name}</p>
								</div>
								<div className="grid gap-1">
									<p className="ty-helper">
										{t("project.projectPage.dialog.fields.entity")}
									</p>
									<p className="ty-sm-semibold">
										{resolveProjectEntityLabel(entityById, project.entityId)}
									</p>
								</div>
								<div className="grid gap-1">
									<p className="ty-helper">
										{t("project.projectPage.dialog.fields.createdBy")}
									</p>
									<p className="ty-sm-semibold">
										{resolveProjectCreatorLabel(adminById, project.createdBy)}
									</p>
								</div>
								<div className="grid gap-1">
									<p className="ty-helper">
										{t("project.projectPage.dialog.fields.description")}
									</p>
									<p className="ty-sm-semibold whitespace-pre-wrap">
										{project.description ||
											t("project.projectPage.dialog.values.noDescription")}
									</p>
								</div>
								<div className="grid gap-1">
									<p className="ty-helper">
										{t("project.projectPage.dialog.fields.status")}
									</p>
									<div className="flex">
										<Badge
											tone={getProjectStatusTone(project.status)}
											variant="primary"
										>
											{getProjectStatusLabel(t, project.status)}
										</Badge>
									</div>
								</div>
							</div>

							<div className="grid gap-4">
								<div className="grid gap-1">
									<p className="ty-helper">
										{t("project.projectPage.dialog.fields.offeredHours")}
									</p>
									<p className="ty-sm-semibold">{project.offeredHours}</p>
								</div>
								<div className="grid gap-1">
									<p className="ty-helper">
										{t("project.projectPage.dialog.fields.completedHours")}
									</p>
									<p className="ty-sm-semibold">{project.completedHours}</p>
								</div>
								<div className="grid gap-1">
									<p className="ty-helper">
										{t("project.projectPage.dialog.fields.maxParticipants")}
									</p>
									<p className="ty-sm-semibold">
										{project.maxParticipants ??
											t("project.projectPage.dialog.values.unlimited")}
									</p>
								</div>
								<div className="grid gap-1">
									<p className="ty-helper">
										{t("project.projectPage.dialog.fields.closedAt")}
									</p>
									<p className="ty-sm-semibold">
										{project.closedAt
											? project.closedAtFormatted
											: t("project.projectPage.dialog.values.open")}
									</p>
								</div>
								<div className="grid gap-1">
									<p className="ty-helper">
										{t("project.projectPage.dialog.fields.schools")}
									</p>
									{schoolsIsError ? (
										<SomeErrorState
											title={t("project.projectPage.dialog.schoolsError.title")}
											description={t(
												"project.projectPage.dialog.schoolsError.description",
											)}
											onRefresh={onRefreshSchools}
										/>
									) : (
										<p className="ty-sm-semibold">
											{schoolsIsLoading
												? t("project.projectPage.loading.schools")
												: (schoolNames ??
													t("project.projectPage.dialog.values.noSchools"))}
										</p>
									)}
								</div>
								<div className="grid gap-1">
									<p className="ty-helper">
										{t("project.projectPage.dialog.fields.id")}
									</p>
									<p className="ty-sm-semibold">{project.id}</p>
								</div>
								<div className="grid gap-1">
									<p className="ty-helper">
										{t("project.projectPage.dialog.fields.createdAt")}
									</p>
									<p className="ty-sm-semibold">
										{project.auditInfo.createdAtFormatted}
									</p>
								</div>
								<div className="grid gap-1">
									<p className="ty-helper">
										{t("project.projectPage.dialog.fields.updatedAt")}
									</p>
									<p className="ty-sm-semibold">
										{project.auditInfo.updatedAtFormatted}
									</p>
								</div>
							</div>
						</div>
					) : (
						<NotFoundState
							title={t("project.projectPage.dialog.notFound.title")}
						/>
					)}
				</DialogBody>
			</DialogContent>
		</Dialog>
	);
}
