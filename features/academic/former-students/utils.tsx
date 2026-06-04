import type { ColumnDef } from "@tanstack/react-table";
import type { TFunction } from "i18next";

import { Badge, TableText } from "@/components";
import { ADMIN_CAMPI_VALUES } from "@/constants";
import type {
	AccountResponse,
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

function getEndOfDayTimestamp(value: string) {
	const date = new Date(value);
	date.setHours(23, 59, 59, 999);
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

export function buildFormerStudentAreaOfExpertiseOptions(
	courses: CourseResponse[],
): ComboboxOption[] {
	const uniqueAreas = new Map<string, ComboboxOption>();

	for (const course of courses) {
		uniqueAreas.set(course.areaOfExpertise.id, {
			value: course.areaOfExpertise.id,
			label: course.areaOfExpertise.name,
		});
	}

	return [...uniqueAreas.values()].sort((left, right) =>
		compareNormalizedText(String(left.label), String(right.label)),
	);
}

export function getFormerStudentCampusOptions(t: TFunction) {
	return ADMIN_CAMPI_VALUES.map(value => ({
		value,
		label: t(`identity.adminPage.filters.campus.options.${value}`),
	}));
}

export function createFormerStudentColumns(
	t: TFunction,
): ColumnDef<FormerStudentDirectoryItem>[] {
	return [
		{
			accessorFn: row => row.account?.active ?? false,
			id: "active",
			size: 96,
			header: () => (
				<div className="flex w-full justify-center">
					{t("academic.formerStudentPage.table.columns.active")}
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
							? t("academic.formerStudentPage.table.active.yes")
							: t("academic.formerStudentPage.table.active.no")}
					</Badge>
				</div>
			),
		},
		{
			accessorFn: row => row.account?.id ?? row.accountId,
			id: "accountId",
			header: t("academic.formerStudentPage.dialog.fields.accountId"),
			cell: ({ row }) => (
				<TableText
					text={row.original.account?.id ?? row.original.accountId}
					maxWidth={50}
					tooltiped
				/>
			),
		},
		{
			accessorFn: row => row.user?.name ?? row.accountId,
			id: "name",
			header: t("academic.formerStudentPage.table.columns.name"),
		},
		{
			accessorFn: row => row.account?.email ?? "",
			id: "email",
			header: t("academic.formerStudentPage.table.columns.email"),
		},
		{
			accessorKey: "academicRegistration",
			header: t(
				"academic.formerStudentPage.table.columns.academicRegistration",
			),
		},
		{
			accessorFn: row => row.campus.campus,
			id: "campus",
			header: t("academic.formerStudentPage.table.columns.campus"),
			cell: ({ row }) => row.original.campus.campusFormatted,
		},
		{
			accessorFn: row => row.counterpartHours.requiredHours,
			id: "requiredHours",
			header: t("academic.formerStudentPage.dialog.fields.requiredHours"),
		},
		{
			accessorFn: row => row.counterpartHours.completedHours,
			id: "completedHours",
			header: t("academic.formerStudentPage.dialog.fields.completedHours"),
		},
		{
			accessorFn: row => row.counterpartHours.missingHours,
			id: "missingHours",
			header: t("academic.formerStudentPage.dialog.fields.missingHours"),
		},
		{
			accessorFn: row => row.counterpartHours.progress,
			id: "progress",
			header: t("academic.formerStudentPage.table.columns.progress"),
			cell: ({ row }) =>
				`${row.original.counterpartHours.progress.toFixed(2)}%`,
		},
		{
			accessorFn: row => row.counterpartHours.concluded,
			id: "concluded",
			header: t("academic.formerStudentPage.table.columns.concluded"),
			cell: ({ row }) => (
				<div className="flex w-full justify-center">
					<Badge
						className="min-h-5 px-2 py-0.5"
						tone={
							row.original.counterpartHours.concluded ? "success" : "warning"
						}
						variant="primary"
					>
						{row.original.counterpartHours.concluded
							? t("academic.formerStudentPage.table.concluded.yes")
							: t("academic.formerStudentPage.table.concluded.no")}
					</Badge>
				</div>
			),
		},
		{
			accessorFn: row => row.period.startDate,
			id: "startDate",
			header: t("academic.formerStudentPage.dialog.fields.startDate"),
			cell: ({ row }) => row.original.period.startDateFormatted,
		},
		{
			accessorFn: row => row.period.dueDate,
			id: "dueDate",
			header: t("academic.formerStudentPage.dialog.fields.dueDate"),
			cell: ({ row }) => row.original.period.dueDateFormatted,
		},
		{
			accessorFn: row => row.period.remainingDays,
			id: "remainingDays",
			header: t("academic.formerStudentPage.dialog.fields.remainingDays"),
			cell: ({ row }) => row.original.period.remainingDaysFormatted,
		},
		{
			accessorFn: row => row.course?.name ?? row.courseId,
			id: "course",
			header: t("academic.formerStudentPage.table.columns.course"),
		},
		{
			accessorFn: row => row.course?.areaOfExpertise.name ?? "",
			id: "areaOfExpertise",
			header: t("academic.formerStudentPage.table.columns.areaOfExpertise"),
		},
		{
			accessorFn: row => row.auditInfo.createdAt,
			id: "createdAt",
			header: t("academic.formerStudentPage.dialog.fields.createdAt"),
			cell: ({ row }) => row.original.auditInfo.createdAtFormatted,
		},
		{
			accessorFn: row => row.auditInfo.updatedAt,
			id: "updatedAt",
			header: t("academic.formerStudentPage.dialog.fields.updatedAt"),
			cell: ({ row }) => row.original.auditInfo.updatedAtFormatted,
		},
	];
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

export function appendCopyToEmail(
	email: string,
	existingEmails: string[] = [],
) {
	const separatorIndex = email.indexOf("@");
	const localPart =
		separatorIndex === -1 ? email : email.slice(0, separatorIndex);
	const domainPart = separatorIndex === -1 ? "" : email.slice(separatorIndex);
	const match = localPart.match(/^(.*?)(Copy(?:\d+)?)$/);
	const normalizedExistingEmails = new Set(
		existingEmails.map(currentEmail => currentEmail.trim().toLowerCase()),
	);

	if (!match) {
		const candidate = `${localPart}Copy${domainPart}`;
		if (!normalizedExistingEmails.has(candidate.toLowerCase())) {
			return candidate;
		}

		let nextNumber = 2;
		while (true) {
			const numberedCandidate = `${localPart}Copy${nextNumber}${domainPart}`;
			if (!normalizedExistingEmails.has(numberedCandidate.toLowerCase())) {
				return numberedCandidate;
			}
			nextNumber += 1;
		}
	}

	const baseLocalPart = match[1] ?? localPart;
	const currentSuffix = localPart.slice(baseLocalPart.length);
	let nextNumber =
		currentSuffix === "Copy"
			? 2
			: (Number(currentSuffix.slice("Copy".length)) || 1) + 1;

	while (true) {
		const candidate = `${baseLocalPart}Copy${nextNumber}${domainPart}`;
		if (!normalizedExistingEmails.has(candidate.toLowerCase())) {
			return candidate;
		}
		nextNumber += 1;
	}
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
