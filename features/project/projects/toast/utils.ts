import type { TFunction } from "i18next";

import type { ProjectStatusAction } from "@/types/client";
import { getApiErrorToastContent } from "@/utils";

export function getProjectsListErrorToastContent(t: TFunction, error: unknown) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("common.loadErrors.projects.title"),
		fallbackDescription: t("common.loadErrors.projects.description"),
	});
}

export function getProjectDetailErrorToastContent(
	t: TFunction,
	error: unknown,
) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("project.projectPage.feedback.detailError.title"),
		fallbackDescription: t(
			"project.projectPage.feedback.detailError.description",
		),
	});
}

export function getProjectEntitiesErrorToastContent(
	t: TFunction,
	error: unknown,
) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("common.loadErrors.entities.title"),
		fallbackDescription: t("common.loadErrors.entities.description"),
	});
}

export function getProjectAdminsErrorToastContent(
	t: TFunction,
	error: unknown,
) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("project.projectPage.feedback.adminsError.title"),
		fallbackDescription: t(
			"project.projectPage.feedback.adminsError.description",
		),
	});
}

export function getProjectAreasOfExpertiseErrorToastContent(
	t: TFunction,
	error: unknown,
) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t(
			"project.projectPage.feedback.areasOfExpertiseError.title",
		),
		fallbackDescription: t(
			"project.projectPage.feedback.areasOfExpertiseError.description",
		),
	});
}

export function getProjectCreateErrorToastContent(
	t: TFunction,
	error: unknown,
) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("project.projectPage.create.feedback.error.title"),
		fallbackDescription: t(
			"project.projectPage.create.feedback.error.description",
		),
	});
}

export function getProjectDuplicateErrorToastContent(
	t: TFunction,
	error: unknown,
) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("project.projectPage.duplicate.feedback.error.title"),
		fallbackDescription: t(
			"project.projectPage.duplicate.feedback.error.description",
		),
	});
}

export function getProjectUpdateErrorToastContent(
	t: TFunction,
	error: unknown,
) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("project.projectPage.update.feedback.error.title"),
		fallbackDescription: t(
			"project.projectPage.update.feedback.error.description",
		),
	});
}

export function getProjectDeleteErrorToastContent(
	t: TFunction,
	error: unknown,
) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("project.projectPage.delete.feedback.error.title"),
		fallbackDescription: t(
			"project.projectPage.delete.feedback.error.description",
		),
	});
}

export function getProjectStatusActionErrorToastContent(
	t: TFunction,
	error: unknown,
	action: ProjectStatusAction,
) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t(`project.projectPage.${action}.feedback.error.title`),
		fallbackDescription: t(
			`project.projectPage.${action}.feedback.error.description`,
		),
	});
}
