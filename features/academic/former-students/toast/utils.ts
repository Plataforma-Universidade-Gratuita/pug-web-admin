import type { TFunction } from "i18next";

import { getCrudErrorToastContent } from "@/features/utils";
import { getApiErrorToastContent } from "@/utils";

export function getStudentsListErrorToastContent(t: TFunction, error: unknown) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("common.errors.listLoad.title"),
		fallbackDescription: t("common.errors.listLoad.description"),
	});
}

export function getStudentDetailErrorToastContent(
	t: TFunction,
	error: unknown,
) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("common.errors.detailLoad.title"),
		fallbackDescription: t("common.errors.detailLoad.description"),
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
	return getCrudErrorToastContent(
		t,
		error,
		"create",
		t("common.objects.formerStudent"),
	);
}

export function getStudentDuplicateErrorToastContent(
	t: TFunction,
	error: unknown,
) {
	return getCrudErrorToastContent(
		t,
		error,
		"duplicate",
		t("common.objects.formerStudent"),
	);
}

export function getStudentUpdateErrorToastContent(
	t: TFunction,
	error: unknown,
) {
	return getCrudErrorToastContent(
		t,
		error,
		"update",
		t("common.objects.formerStudent"),
	);
}

export function getStudentDeleteErrorToastContent(
	t: TFunction,
	error: unknown,
) {
	return getCrudErrorToastContent(
		t,
		error,
		"delete",
		t("common.objects.formerStudent"),
	);
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
