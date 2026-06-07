import type { TFunction } from "i18next";

import type { CourseResponse } from "@/types/api";
import type {
	FormerStudentDirectoryItem,
	FormerStudentFilterArgs,
} from "@/types/client";
import { normalizeTextForSearch } from "@/utils";

function normalizeCpf(value: string) {
	return value.replace(/\D+/g, "");
}

function getStartOfDayTimestamp(value: string) {
	const date = new Date(value);
	date.setHours(0, 0, 0, 0);
	return date.getTime();
}

function getEndOfDayTimestamp(value: string) {
	const date = new Date(value);
	date.setHours(23, 59, 59, 999);
	return date.getTime();
}

function resolveFormerStudentCourseLabel(
	courseById: Map<string, CourseResponse>,
	courseId: string,
) {
	return courseById.get(courseId)?.name ?? courseId;
}

export function filterFormerStudents(
	formerStudents: FormerStudentDirectoryItem[],
	{
		academicRegistration,
		activeOnly,
		areaOfExpertiseIds,
		campi,
		cpf,
		courseIds,
		dateFrom,
		dateTo,
		email,
		includeConcluded,
		name,
		periodFrom,
		periodTo,
		query,
		registrationQuery,
	}: FormerStudentFilterArgs,
) {
	const normalizedQuery = normalizeTextForSearch(query.trim());
	const hasQuery = normalizedQuery.length > 0;
	const normalizedRegistrationQuery = normalizeTextForSearch(
		registrationQuery.trim(),
	);
	const hasRegistrationQuery = normalizedRegistrationQuery.length > 0;
	const normalizedNameFilter = normalizeTextForSearch(name.trim());
	const normalizedCpfFilter = normalizeTextForSearch(cpf.trim());
	const normalizedEmailFilter = normalizeTextForSearch(email.trim());
	const normalizedAcademicRegistrationFilter = normalizeTextForSearch(
		academicRegistration.trim(),
	);
	const hasActiveFilter = activeOnly;
	const hasCampiFilter = campi.length > 0;
	const hasCourseFilter = courseIds.length > 0;
	const hasAreaOfExpertiseFilter = areaOfExpertiseIds.length > 0;
	const periodFromTimestamp = periodFrom
		? getStartOfDayTimestamp(periodFrom)
		: null;
	const periodToTimestamp = periodTo ? getEndOfDayTimestamp(periodTo) : null;
	const dateFromTimestamp = dateFrom ? getStartOfDayTimestamp(dateFrom) : null;
	const dateToTimestamp = dateTo ? getEndOfDayTimestamp(dateTo) : null;

	if (
		!hasQuery &&
		!hasRegistrationQuery &&
		!normalizedNameFilter &&
		!normalizedCpfFilter &&
		!normalizedEmailFilter &&
		!normalizedAcademicRegistrationFilter &&
		!hasActiveFilter &&
		!hasCampiFilter &&
		!hasCourseFilter &&
		!hasAreaOfExpertiseFilter &&
		includeConcluded &&
		periodFromTimestamp === null &&
		periodToTimestamp === null &&
		dateFromTimestamp === null &&
		dateToTimestamp === null
	) {
		return formerStudents;
	}

	return formerStudents.filter(formerStudent => {
		if (hasQuery) {
			const normalizedName = normalizeTextForSearch(
				formerStudent.user?.name ?? "",
			);
			const normalizedEmail = normalizeTextForSearch(
				formerStudent.account?.email ?? "",
			);
			if (
				!normalizedName.includes(normalizedQuery) &&
				!normalizedEmail.includes(normalizedQuery)
			) {
				return false;
			}
		}

		if (
			hasRegistrationQuery &&
			!normalizeTextForSearch(formerStudent.academicRegistration).includes(
				normalizedRegistrationQuery,
			)
		) {
			return false;
		}

		if (
			normalizedNameFilter &&
			!normalizeTextForSearch(formerStudent.user?.name ?? "").includes(
				normalizedNameFilter,
			)
		) {
			return false;
		}

		if (
			normalizedCpfFilter &&
			!normalizeTextForSearch(
				formerStudent.user?.cpfFormatted ?? formerStudent.user?.cpf ?? "",
			).includes(normalizedCpfFilter)
		) {
			return false;
		}

		if (
			normalizedEmailFilter &&
			!normalizeTextForSearch(formerStudent.account?.email ?? "").includes(
				normalizedEmailFilter,
			)
		) {
			return false;
		}

		if (
			normalizedAcademicRegistrationFilter &&
			!normalizeTextForSearch(formerStudent.academicRegistration).includes(
				normalizedAcademicRegistrationFilter,
			)
		) {
			return false;
		}

		if (hasActiveFilter && !(formerStudent.account?.active ?? false)) {
			return false;
		}

		if (hasCampiFilter && !campi.includes(formerStudent.campus.campus)) {
			return false;
		}

		if (hasCourseFilter && !courseIds.includes(formerStudent.courseId)) {
			return false;
		}

		if (
			hasAreaOfExpertiseFilter &&
			!areaOfExpertiseIds.includes(
				formerStudent.course?.areaOfExpertise.id ?? "",
			)
		) {
			return false;
		}

		if (!includeConcluded && formerStudent.counterpartHours.concluded) {
			return false;
		}

		if (periodFromTimestamp !== null || periodToTimestamp !== null) {
			const startTimestamp = getStartOfDayTimestamp(
				formerStudent.period.startDate,
			);
			const dueTimestamp = getEndOfDayTimestamp(formerStudent.period.dueDate);
			if (
				periodFromTimestamp !== null &&
				startTimestamp < periodFromTimestamp
			) {
				return false;
			}
			if (periodToTimestamp !== null && dueTimestamp > periodToTimestamp) {
				return false;
			}
		}

		if (dateFromTimestamp !== null || dateToTimestamp !== null) {
			const createdTimestamp = getStartOfDayTimestamp(
				formerStudent.auditInfo.createdAt,
			);
			const updatedTimestamp = getEndOfDayTimestamp(
				formerStudent.auditInfo.updatedAt,
			);
			const matchesStart =
				dateFromTimestamp === null ||
				createdTimestamp >= dateFromTimestamp ||
				updatedTimestamp >= dateFromTimestamp;
			const matchesEnd =
				dateToTimestamp === null ||
				createdTimestamp <= dateToTimestamp ||
				updatedTimestamp <= dateToTimestamp;

			if (!matchesStart || !matchesEnd) {
				return false;
			}
		}

		return true;
	});
}

export function getStudentEmptyStateCopy(t: TFunction, query: string) {
	return {
		title: t("academic.formerStudentPage.empty.title"),
		description: query
			? t("academic.formerStudentPage.empty.filteredDescription", {
					value: query,
				})
			: t("academic.formerStudentPage.empty.defaultDescription"),
	};
}

export function getStudentFilterSummary(
	t: TFunction,
	{
		academicRegistration,
		activeOnly,
		areaOfExpertiseIds,
		campi,
		cpf,
		courseById,
		courseIds,
		dateFrom,
		dateTo,
		email,
		includeConcluded,
		name,
		periodFrom,
		periodTo,
		query,
		registrationQuery,
	}: FormerStudentFilterArgs,
) {
	const parts: string[] = [];

	if (query.trim()) {
		parts.push(query.trim());
	}

	if (registrationQuery.trim()) {
		parts.push(registrationQuery.trim());
	}

	if (name.trim()) {
		parts.push(name.trim());
	}

	if (cpf.trim()) {
		parts.push(cpf.trim());
	}

	if (email.trim()) {
		parts.push(email.trim());
	}

	if (academicRegistration.trim()) {
		parts.push(academicRegistration.trim());
	}

	if (activeOnly) {
		parts.push(t("identity.accountPage.filters.activeOnly.label"));
	}

	if (!includeConcluded) {
		parts.push(t("academic.formerStudentPage.filters.includeConcluded.off"));
	}

	if (campi.length > 0) {
		parts.push(
			...campi.map(campus =>
				t(`identity.adminPage.filters.campus.options.${campus}`),
			),
		);
	}

	if (courseIds.length > 0) {
		parts.push(
			...courseIds.map(courseId =>
				resolveFormerStudentCourseLabel(courseById, courseId),
			),
		);
	}

	if (areaOfExpertiseIds.length > 0) {
		parts.push(t("academic.formerStudentPage.filters.areaOfExpertise.label"));
	}

	if (periodFrom || periodTo) {
		parts.push([periodFrom || "...", periodTo || "..."].join(" - "));
	}

	if (dateFrom || dateTo) {
		parts.push([dateFrom || "...", dateTo || "..."].join(" - "));
	}

	return parts.join(" | ");
}

export function toFormerStudentCreateCpf(value: string) {
	return normalizeCpf(value.trim());
}
