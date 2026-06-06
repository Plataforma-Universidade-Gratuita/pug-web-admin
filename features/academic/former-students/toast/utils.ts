import type { TFunction } from "i18next";

import { getApiErrorToastContent } from "@/utils";

export function getStudentsListErrorToastContent(t: TFunction, error: unknown) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("academic.formerStudentPage.feedback.listError.title"),
		fallbackDescription: t(
			"academic.formerStudentPage.feedback.listError.description",
		),
	});
}

export function getStudentDetailErrorToastContent(
	t: TFunction,
	error: unknown,
) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("academic.formerStudentPage.feedback.detailError.title"),
		fallbackDescription: t(
			"academic.formerStudentPage.feedback.detailError.description",
		),
	});
}

export function getStudentCoursesErrorToastContent(
	t: TFunction,
	error: unknown,
) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("academic.formerStudentPage.feedback.coursesError.title"),
		fallbackDescription: t(
			"academic.formerStudentPage.feedback.coursesError.description",
		),
	});
}

export function getStudentCreateErrorToastContent(
	t: TFunction,
	error: unknown,
) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("academic.formerStudentPage.create.feedback.error.title"),
		fallbackDescription: t(
			"academic.formerStudentPage.create.feedback.error.description",
		),
	});
}

export function getStudentDuplicateErrorToastContent(
	t: TFunction,
	error: unknown,
) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t(
			"academic.formerStudentPage.duplicate.feedback.error.title",
		),
		fallbackDescription: t(
			"academic.formerStudentPage.duplicate.feedback.error.description",
		),
	});
}

export function getStudentUpdateErrorToastContent(
	t: TFunction,
	error: unknown,
) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("academic.formerStudentPage.update.feedback.error.title"),
		fallbackDescription: t(
			"academic.formerStudentPage.update.feedback.error.description",
		),
	});
}

export function getStudentDeleteErrorToastContent(
	t: TFunction,
	error: unknown,
) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("academic.formerStudentPage.delete.feedback.error.title"),
		fallbackDescription: t(
			"academic.formerStudentPage.delete.feedback.error.description",
		),
	});
}

export function getStudentSetActiveErrorToastContent(
	t: TFunction,
	error: unknown,
	active: boolean,
) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t(
			active
				? "academic.formerStudentPage.reactivate.feedback.error.title"
				: "academic.formerStudentPage.deactivate.feedback.error.title",
		),
		fallbackDescription: t(
			active
				? "academic.formerStudentPage.reactivate.feedback.error.description"
				: "academic.formerStudentPage.deactivate.feedback.error.description",
		),
	});
}
