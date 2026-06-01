import type { ColumnDef } from "@tanstack/react-table";
import type { TFunction } from "i18next";

import { Badge } from "@/components";
import { ADMIN_CAMPI_VALUES } from "@/constants";
import { getAccountOptionClassName } from "@/features/identity/accounts/utils";
import type {
	AccountResponse,
	Campi,
	CourseResponse,
	FormerStudentCreateRequest,
	FormerStudentDirectoryItem,
	FormerStudentEditorFormValues,
	FormerStudentFilterArgs,
	FormerStudentResponse,
	FormerStudentUpdateRequest,
	UserResponse,
} from "@/types";
import type { ComboboxOption } from "@/types";
import { getApiErrorToastContent } from "@/utils";
import { compareNormalizedText, normalizeTextForSearch } from "@/utils";

export { createFormerStudentEditorFormSchema } from "@/schemas";

function normalizeCpf(value: string) {
	return value.replace(/\D+/g, "");
}

function getStartOfDayTimestamp(value: string) {
	const date = new Date(value);
	date.setHours(0, 0, 0, 0);
	return date.getTime();
}

export function buildFormerStudentDirectoryItems(
	formerStudents: FormerStudentResponse[],
	accounts: AccountResponse[],
	users: UserResponse[],
	courses: CourseResponse[],
): FormerStudentDirectoryItem[] {
	const accountById = new Map(accounts.map(account => [account.id, account]));
	const userById = new Map(users.map(user => [user.id, user]));
	const courseById = new Map(courses.map(course => [course.id, course]));

	return formerStudents.map(formerStudent => {
		const account = accountById.get(formerStudent.accountId) ?? null;
		const user = account ? (userById.get(account.userId) ?? null) : null;
		const course = courseById.get(formerStudent.courseId) ?? null;

		return {
			...formerStudent,
			account,
			course,
			user,
		};
	});
}

export function resolveFormerStudentCourseLabel(
	courseById: Map<string, CourseResponse>,
	courseId: string,
) {
	return courseById.get(courseId)?.name ?? courseId;
}

export function buildFormerStudentCourseOptions(
	courses: CourseResponse[],
): ComboboxOption[] {
	return [...courses]
		.sort((left, right) => compareNormalizedText(left.name, right.name))
		.map(course => ({
			value: course.id,
			label: course.name,
			description: course.areaOfExpertise.name,
		}));
}

export function getFormerStudentCampusOptions(t: TFunction) {
	return ADMIN_CAMPI_VALUES.map(value => ({
		value,
		label: t(`identity.adminPage.filters.campus.options.${value}`),
	}));
}

export function createFormerStudentColumns(
	t: TFunction,
	courseById: Map<string, CourseResponse>,
): ColumnDef<FormerStudentDirectoryItem>[] {
	return [
		{
			accessorFn: row => row.account?.active ?? false,
			id: "active",
			size: 96,
			header: () => (
				<div className="flex w-full justify-center">
					{t("academic.studentPage.table.columns.active")}
				</div>
			),
			cell: ({ row }) => (
				<div className="flex w-full justify-center">
					<Badge
						className="min-h-5 px-2 py-0.5"
						tone={row.original.account?.active ? "success" : "danger"}
						variant="primary"
					>
						{row.original.account?.active
							? t("academic.studentPage.table.active.yes")
							: t("academic.studentPage.table.active.no")}
					</Badge>
				</div>
			),
		},
		{
			accessorFn: row => row.user?.name ?? row.accountId,
			id: "name",
			header: t("academic.studentPage.table.columns.name"),
		},
		{
			accessorFn: row => row.account?.email ?? "",
			id: "email",
			header: t("academic.studentPage.table.columns.email"),
		},
		{
			accessorKey: "academicRegistration",
			header: t("academic.studentPage.table.columns.academicRegistration"),
		},
		{
			accessorFn: row => row.campus.campus,
			id: "campus",
			header: t("academic.studentPage.table.columns.campus"),
			cell: ({ row }) => row.original.campus.campusFormatted,
		},
		{
			accessorFn: row =>
				resolveFormerStudentCourseLabel(courseById, row.courseId),
			id: "course",
			header: t("academic.studentPage.table.columns.course"),
		},
	];
}

export function filterFormerStudents(
	formerStudents: FormerStudentDirectoryItem[],
	{
		activeFilter,
		campusFilter,
		courseById,
		courseIdFilter,
		dateField,
		endDate,
		query,
		startDate,
	}: FormerStudentFilterArgs,
) {
	const normalizedQuery = normalizeTextForSearch(query.trim());
	const hasQuery = normalizedQuery.length > 0;
	const hasActiveFilter = activeFilter !== "";
	const hasCampusFilter = campusFilter !== "";
	const hasCourseFilter = courseIdFilter !== "";
	const startTimestamp = startDate ? getStartOfDayTimestamp(startDate) : null;
	const endTimestamp = endDate ? getStartOfDayTimestamp(endDate) : null;

	if (
		!hasQuery &&
		!hasActiveFilter &&
		!hasCampusFilter &&
		!hasCourseFilter &&
		!dateField &&
		startTimestamp === null &&
		endTimestamp === null
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
			const normalizedCpf = normalizeTextForSearch(
				formerStudent.user?.cpfFormatted ?? formerStudent.user?.cpf ?? "",
			);
			const normalizedRegistration = normalizeTextForSearch(
				formerStudent.academicRegistration,
			);
			const normalizedCourse = normalizeTextForSearch(
				resolveFormerStudentCourseLabel(courseById, formerStudent.courseId),
			);

			if (
				!normalizedName.includes(normalizedQuery) &&
				!normalizedEmail.includes(normalizedQuery) &&
				!normalizedCpf.includes(normalizedQuery) &&
				!normalizedRegistration.includes(normalizedQuery) &&
				!normalizedCourse.includes(normalizedQuery)
			) {
				return false;
			}
		}

		if (
			hasActiveFilter &&
			String(formerStudent.account?.active ?? false) !== activeFilter
		) {
			return false;
		}

		if (hasCampusFilter && formerStudent.campus.campus !== campusFilter) {
			return false;
		}

		if (hasCourseFilter && formerStudent.courseId !== courseIdFilter) {
			return false;
		}

		if (dateField && (startTimestamp !== null || endTimestamp !== null)) {
			const auditTimestamp = getStartOfDayTimestamp(
				formerStudent.auditInfo[dateField],
			);

			if (startTimestamp !== null && auditTimestamp < startTimestamp) {
				return false;
			}

			if (endTimestamp !== null && auditTimestamp > endTimestamp) {
				return false;
			}
		}

		return true;
	});
}

export function getStudentEmptyStateCopy(t: TFunction, query: string) {
	return {
		title: t("academic.studentPage.empty.title"),
		description: query
			? t("academic.studentPage.empty.filteredDescription", { value: query })
			: t("academic.studentPage.empty.defaultDescription"),
	};
}

export function getStudentsListErrorToastContent(t: TFunction, error: unknown) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("academic.studentPage.feedback.listError.title"),
		fallbackDescription: t(
			"academic.studentPage.feedback.listError.description",
		),
	});
}

export function getStudentDetailErrorToastContent(
	t: TFunction,
	error: unknown,
) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("academic.studentPage.feedback.detailError.title"),
		fallbackDescription: t(
			"academic.studentPage.feedback.detailError.description",
		),
	});
}

export function getStudentCoursesErrorToastContent(
	t: TFunction,
	error: unknown,
) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("academic.studentPage.feedback.coursesError.title"),
		fallbackDescription: t(
			"academic.studentPage.feedback.coursesError.description",
		),
	});
}

export function getStudentCreateErrorToastContent(
	t: TFunction,
	error: unknown,
) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("academic.studentPage.create.feedback.error.title"),
		fallbackDescription: t(
			"academic.studentPage.create.feedback.error.description",
		),
	});
}

export function getStudentDuplicateErrorToastContent(
	t: TFunction,
	error: unknown,
) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("academic.studentPage.duplicate.feedback.error.title"),
		fallbackDescription: t(
			"academic.studentPage.duplicate.feedback.error.description",
		),
	});
}

export function getStudentUpdateErrorToastContent(
	t: TFunction,
	error: unknown,
) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("academic.studentPage.update.feedback.error.title"),
		fallbackDescription: t(
			"academic.studentPage.update.feedback.error.description",
		),
	});
}

export function getStudentDeleteErrorToastContent(
	t: TFunction,
	error: unknown,
) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("academic.studentPage.delete.feedback.error.title"),
		fallbackDescription: t(
			"academic.studentPage.delete.feedback.error.description",
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
				? "academic.studentPage.reactivate.feedback.error.title"
				: "academic.studentPage.deactivate.feedback.error.title",
		),
		fallbackDescription: t(
			active
				? "academic.studentPage.reactivate.feedback.error.description"
				: "academic.studentPage.deactivate.feedback.error.description",
		),
	});
}

export function getEmptyFormerStudentEditorFormValues(): FormerStudentEditorFormValues {
	return {
		cpf: "",
		name: "",
		email: "",
		academicRegistration: "",
		campus: "JARAGUA_DO_SUL",
		courseId: "",
		requiredHours: "",
		startDate: "",
		dueDate: "",
	};
}

export function buildFormerStudentFormValues(
	formerStudent: FormerStudentResponse,
	account: AccountResponse | null,
	user: UserResponse | null,
): FormerStudentEditorFormValues {
	return {
		cpf: user?.cpfFormatted ?? user?.cpf ?? "",
		name: user?.name ?? "",
		email: account?.email ?? "",
		academicRegistration: formerStudent.academicRegistration,
		campus: formerStudent.campus.campus,
		courseId: formerStudent.courseId,
		requiredHours: String(formerStudent.counterpartHours.requiredHours),
		startDate: formerStudent.period.startDate,
		dueDate: formerStudent.period.dueDate,
	};
}

export function toFormerStudentCreateRequest(
	values: FormerStudentEditorFormValues,
): FormerStudentCreateRequest {
	return {
		cpf: normalizeCpf(values.cpf.trim()),
		name: values.name.trim(),
		email: values.email.trim(),
		academicRegistration: values.academicRegistration.trim(),
		campus: values.campus,
		courseId: values.courseId,
		requiredHours: Number(values.requiredHours),
		startDate: values.startDate,
		dueDate: values.dueDate,
	};
}

export function toFormerStudentUpdateRequest(
	values: FormerStudentEditorFormValues,
): FormerStudentUpdateRequest {
	return {
		name: values.name.trim(),
		cpf: normalizeCpf(values.cpf.trim()),
		email: values.email.trim(),
		academicRegistration: values.academicRegistration.trim(),
		campus: values.campus,
		courseId: values.courseId,
		requiredHours: Number(values.requiredHours),
		startDate: values.startDate,
		dueDate: values.dueDate,
	};
}

export function getStudentFilterSummary(
	t: TFunction,
	{
		activeFilter,
		campusFilter,
		courseById,
		courseIdFilter,
		dateField,
		endDate,
		query,
		startDate,
	}: FormerStudentFilterArgs,
) {
	const parts: string[] = [];

	if (query.trim()) {
		parts.push(query.trim());
	}

	if (activeFilter) {
		parts.push(
			t(
				activeFilter === "true"
					? "academic.studentPage.filters.active.options.active"
					: "academic.studentPage.filters.active.options.inactive",
			),
		);
	}

	if (campusFilter) {
		parts.push(
			t(`academic.studentPage.filters.campus.options.${campusFilter}`),
		);
	}

	if (courseIdFilter) {
		parts.push(resolveFormerStudentCourseLabel(courseById, courseIdFilter));
	}

	if (dateField) {
		parts.push(
			t(`academic.studentPage.filters.dateField.options.${dateField}`),
		);
	}

	if (startDate || endDate) {
		parts.push([startDate || "...", endDate || "..."].join(" - "));
	}

	return parts.join(" | ");
}

export function getStudentActiveOptionClassName(value: string) {
	return getAccountOptionClassName("active", value);
}
