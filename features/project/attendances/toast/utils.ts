import type { TFunction } from "i18next";

import type { AttendanceValidationAction } from "@/types";
import { getApiErrorToastContent } from "@/utils";

export function getAttendancesListErrorToastContent(
	t: TFunction,
	error: unknown,
) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("project.attendancePage.feedback.listError.title"),
		fallbackDescription: t(
			"project.attendancePage.feedback.listError.description",
		),
	});
}

export function getAttendanceDetailErrorToastContent(
	t: TFunction,
	error: unknown,
) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("project.attendancePage.feedback.detailError.title"),
		fallbackDescription: t(
			"project.attendancePage.feedback.detailError.description",
		),
	});
}

export function getAttendanceProjectsErrorToastContent(
	t: TFunction,
	error: unknown,
) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("common.loadErrors.projects.title"),
		fallbackDescription: t("common.loadErrors.projects.description"),
	});
}

export function getAttendanceStudentsErrorToastContent(
	t: TFunction,
	error: unknown,
) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("common.loadErrors.formerStudents.title"),
		fallbackDescription: t("common.loadErrors.formerStudents.description"),
	});
}

export function getAttendanceAdminsErrorToastContent(
	t: TFunction,
	error: unknown,
) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("project.attendancePage.feedback.adminsError.title"),
		fallbackDescription: t(
			"project.attendancePage.feedback.adminsError.description",
		),
	});
}

export function getAttendanceCreateErrorToastContent(
	t: TFunction,
	error: unknown,
) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("project.attendancePage.feedback.createError.title"),
		fallbackDescription: t(
			"project.attendancePage.feedback.createError.description",
		),
	});
}

export function getAttendanceUpdateErrorToastContent(
	t: TFunction,
	error: unknown,
) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("project.attendancePage.update.feedback.error.title"),
		fallbackDescription: t(
			"project.attendancePage.update.feedback.error.description",
		),
	});
}

export function getAttendanceDeleteErrorToastContent(
	t: TFunction,
	error: unknown,
) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("project.attendancePage.feedback.deleteError.title"),
		fallbackDescription: t(
			"project.attendancePage.feedback.deleteError.description",
		),
	});
}

export function getAttendanceValidateErrorToastContent(
	t: TFunction,
	error: unknown,
	action?: AttendanceValidationAction,
) {
	return getApiErrorToastContent(error, {
		fallbackTitle: action
			? t(`project.attendancePage.${action}.feedback.error.title`)
			: t("project.attendancePage.feedback.updateError.title"),
		fallbackDescription: action
			? t(`project.attendancePage.${action}.feedback.error.description`)
			: t("project.attendancePage.feedback.updateError.description"),
	});
}
