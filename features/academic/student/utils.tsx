import type { ColumnDef } from "@tanstack/react-table";
import type { TFunction } from "i18next";
import { z } from "zod";

import { Badge } from "@/components";
import { ADMIN_CAMPI_VALUES } from "@/constants/identity";
import { getAccountOptionClassName } from "@/features/identity/account/utils";
import type {
	Campi,
	CourseResponse,
	StudentCreateRequest,
	StudentResponse,
	StudentUpdateRequest,
} from "@/types/api";
import type { ComboboxOption } from "@/types/client";
import type {
	StudentEditorFormValues,
	StudentEditorMode,
	StudentFilterArgs,
} from "@/types/client/academic";
import { getApiErrorToastContent } from "@/utils/api-errors";
import { compareNormalizedText, normalizeTextForSearch } from "@/utils/lang";

function normalizeCpf(value: string) {
	return value.replace(/\D+/g, "");
}

function getStartOfDayTimestamp(value: string) {
	const date = new Date(value);
	date.setHours(0, 0, 0, 0);
	return date.getTime();
}

export function resolveStudentCourseLabel(
	courseById: Map<string, CourseResponse>,
	courseId: string,
) {
	return courseById.get(courseId)?.name ?? courseId;
}

export function buildStudentCourseOptions(
	courses: CourseResponse[],
): ComboboxOption[] {
	return [...courses]
		.sort((left, right) => compareNormalizedText(left.name, right.name))
		.map(course => ({
			value: course.id,
			label: course.name,
			description: course.school.name,
		}));
}

export function getStudentCampusOptions(t: TFunction) {
	return ADMIN_CAMPI_VALUES.map(value => ({
		value,
		label: t(`identity.adminPage.filters.campus.options.${value}`),
	}));
}

export function createStudentColumns(
	t: TFunction,
	courseById: Map<string, CourseResponse>,
): ColumnDef<StudentResponse>[] {
	return [
		{
			accessorFn: row => row.accountActive,
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
						tone={row.original.accountActive ? "success" : "danger"}
						variant="primary"
					>
						{row.original.accountActive
							? t("academic.studentPage.table.active.yes")
							: t("academic.studentPage.table.active.no")}
					</Badge>
				</div>
			),
		},
		{
			accessorKey: "userName",
			header: t("academic.studentPage.table.columns.name"),
		},
		{
			accessorKey: "accountEmail",
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
			accessorFn: row => resolveStudentCourseLabel(courseById, row.courseId),
			id: "course",
			header: t("academic.studentPage.table.columns.course"),
		},
	];
}

export function filterStudents(
	students: StudentResponse[],
	{
		activeFilter,
		campusFilter,
		courseById,
		courseIdFilter,
		dateField,
		endDate,
		query,
		startDate,
	}: StudentFilterArgs,
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
		return students;
	}

	return students.filter(student => {
		if (hasQuery) {
			const normalizedName = normalizeTextForSearch(student.userName);
			const normalizedEmail = normalizeTextForSearch(student.accountEmail);
			const normalizedRegistration = normalizeTextForSearch(
				student.academicRegistration,
			);
			const normalizedCourse = normalizeTextForSearch(
				resolveStudentCourseLabel(courseById, student.courseId),
			);

			if (
				!normalizedName.includes(normalizedQuery) &&
				!normalizedEmail.includes(normalizedQuery) &&
				!normalizedRegistration.includes(normalizedQuery) &&
				!normalizedCourse.includes(normalizedQuery)
			) {
				return false;
			}
		}

		if (hasActiveFilter && String(student.accountActive) !== activeFilter) {
			return false;
		}

		if (hasCampusFilter && student.campus.campus !== campusFilter) {
			return false;
		}

		if (hasCourseFilter && student.courseId !== courseIdFilter) {
			return false;
		}

		if (dateField && (startTimestamp !== null || endTimestamp !== null)) {
			const auditTimestamp = getStartOfDayTimestamp(
				student.auditInfo[dateField],
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

export function createStudentEditorFormSchema(
	t: TFunction,
	mode: StudentEditorMode,
) {
	const requiresIdentityFields = mode !== "update";

	return z.object({
		cpf: requiresIdentityFields
			? z
					.string()
					.trim()
					.min(1, t("academic.studentPage.editor.validation.cpf.required"))
			: z.string(),
		name: z
			.string()
			.trim()
			.min(1, t("academic.studentPage.editor.validation.name.required")),
		email: z
			.string()
			.trim()
			.min(1, t("academic.studentPage.editor.validation.email.required"))
			.email(t("academic.studentPage.editor.validation.email.invalid")),
		password: requiresIdentityFields
			? z
					.string()
					.trim()
					.min(1, t("academic.studentPage.editor.validation.password.required"))
			: z.string(),
		academicRegistration: z
			.string()
			.trim()
			.min(
				1,
				t(
					"academic.studentPage.editor.validation.academicRegistration.required",
				),
			),
		campus: z
			.string()
			.min(1, t("academic.studentPage.editor.validation.campus.required"))
			.refine(
				(value): value is Campi =>
					ADMIN_CAMPI_VALUES.includes(
						value as (typeof ADMIN_CAMPI_VALUES)[number],
					),
				{
					message: t("academic.studentPage.editor.validation.campus.required"),
				},
			),
		courseId: z
			.string()
			.trim()
			.min(1, t("academic.studentPage.editor.validation.course.required")),
		requiredHours: z
			.string()
			.trim()
			.min(
				1,
				t("academic.studentPage.editor.validation.requiredHours.required"),
			)
			.refine(value => !Number.isNaN(Number(value)) && Number(value) > 0, {
				message: t(
					"academic.studentPage.editor.validation.requiredHours.invalid",
				),
			}),
		startDate: z
			.string()
			.trim()
			.min(1, t("academic.studentPage.editor.validation.startDate.required")),
		dueDate: z
			.string()
			.trim()
			.min(1, t("academic.studentPage.editor.validation.dueDate.required")),
	});
}

export function getEmptyStudentEditorFormValues(): StudentEditorFormValues {
	return {
		cpf: "",
		name: "",
		email: "",
		password: "",
		academicRegistration: "",
		campus: "JARAGUA_DO_SUL",
		courseId: "",
		requiredHours: "",
		startDate: "",
		dueDate: "",
	};
}

export function buildStudentUpdateFormValues(
	student: StudentResponse,
): StudentEditorFormValues {
	return {
		cpf: "",
		name: student.userName,
		email: student.accountEmail,
		password: "",
		academicRegistration: student.academicRegistration,
		campus: student.campus.campus,
		courseId: student.courseId,
		requiredHours: String(student.requiredHours),
		startDate: student.startDate,
		dueDate: student.dueDate,
	};
}

export function buildStudentDuplicateFormValues(
	student: StudentResponse,
): StudentEditorFormValues {
	return {
		cpf: "",
		name: student.userName,
		email: student.accountEmail,
		password: "",
		academicRegistration: student.academicRegistration,
		campus: student.campus.campus,
		courseId: student.courseId,
		requiredHours: String(student.requiredHours),
		startDate: student.startDate,
		dueDate: student.dueDate,
	};
}

export function toStudentCreateRequest(
	values: StudentEditorFormValues,
): StudentCreateRequest {
	return {
		cpf: normalizeCpf(values.cpf.trim()),
		name: values.name.trim(),
		email: values.email.trim(),
		password: values.password.trim(),
		academicRegistration: values.academicRegistration.trim(),
		campus: values.campus,
		courseId: values.courseId,
		requiredHours: Number(values.requiredHours),
		startDate: values.startDate,
		dueDate: values.dueDate,
	};
}

export function toStudentUpdateRequest(
	values: StudentEditorFormValues,
): StudentUpdateRequest {
	const password = values.password.trim();

	return {
		name: values.name.trim(),
		email: values.email.trim(),
		password: password.length > 0 ? password : null,
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
	}: StudentFilterArgs,
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
		parts.push(resolveStudentCourseLabel(courseById, courseIdFilter));
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
