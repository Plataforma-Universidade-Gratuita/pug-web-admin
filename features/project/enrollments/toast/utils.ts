import type { TFunction } from "i18next";

import type { EnrollmentStatusAction } from "@/types";
import { getApiErrorToastContent } from "@/utils";

export function getEnrollmentsListErrorToastContent(
	t: TFunction,
	error: unknown,
) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("project.enrollmentPage.feedback.listError.title"),
		fallbackDescription: t(
			"project.enrollmentPage.feedback.listError.description",
		),
	});
}

export function getEnrollmentDetailErrorToastContent(
	t: TFunction,
	error: unknown,
) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("project.enrollmentPage.feedback.detailError.title"),
		fallbackDescription: t(
			"project.enrollmentPage.feedback.detailError.description",
		),
	});
}

export function getEnrollmentProjectsErrorToastContent(
	t: TFunction,
	error: unknown,
) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("common.loadErrors.projects.title"),
		fallbackDescription: t("common.loadErrors.projects.description"),
	});
}

export function getEnrollmentStudentsErrorToastContent(
	t: TFunction,
	error: unknown,
) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("common.loadErrors.formerStudents.title"),
		fallbackDescription: t("common.loadErrors.formerStudents.description"),
	});
}

export function getEnrollmentDeleteErrorToastContent(
	t: TFunction,
	error: unknown,
) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("project.enrollmentPage.feedback.deleteError.title"),
		fallbackDescription: t(
			"project.enrollmentPage.feedback.deleteError.description",
		),
	});
}

export function getEnrollmentCreateErrorToastContent(
	t: TFunction,
	error: unknown,
) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("project.enrollmentPage.feedback.createError.title"),
		fallbackDescription: t(
			"project.enrollmentPage.feedback.createError.description",
		),
	});
}

export function getEnrollmentUpdateErrorToastContent(
	t: TFunction,
	error: unknown,
	action?: EnrollmentStatusAction,
) {
	return getApiErrorToastContent(error, {
		fallbackTitle: action
			? t(`project.enrollmentPage.${action}.feedback.error.title`)
			: t("project.enrollmentPage.feedback.updateError.title"),
		fallbackDescription: action
			? t(`project.enrollmentPage.${action}.feedback.error.description`)
			: t("project.enrollmentPage.feedback.updateError.description"),
	});
}

export function getEnrollmentStatusActionErrorToastContent(
	t: TFunction,
	error: unknown,
	action: EnrollmentStatusAction,
) {
	return getEnrollmentUpdateErrorToastContent(t, error, action);
}
