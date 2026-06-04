import type { ColumnDef } from "@tanstack/react-table";
import type { TFunction } from "i18next";

import { Badge, TableText } from "@/components";
import { TABLE_TRUNCATED_COLUMN_WIDTH } from "@/constants";
import type {
	AdminComplexSearchFilters,
	AdminComplexSearchRequest,
	AdminCreateExistingUser,
	AdminCreateRequest,
	AdminEditorFormValues,
	AdminLinkedUser,
	AdminResponse,
	AdminSearchResponse,
	AdminUpdateRequest,
} from "@/types";
import type { AdminFrontendFilterArgs } from "@/types";
import {
	getApiErrorToastContent,
	matchesAnyDateRange,
	normalizeTextForSearch,
	toSearchDateOffsetDateTime,
} from "@/utils";

export { createAdminEditorFormSchema } from "@/schemas";

const TABLE_IDENTIFIER_TEXT_WIDTH = 50;

function normalizeCpf(value: string) {
	return value.replace(/\D+/g, "");
}

export function createAdminColumns(
	t: TFunction,
): ColumnDef<AdminSearchResponse>[] {
	return [
		{
			accessorFn: row => row.account.active,
			id: "active",
			size: TABLE_TRUNCATED_COLUMN_WIDTH,
			header: () => (
				<div className="flex w-full justify-center">
					{t("common.fields.status")}
				</div>
			),
			cell: ({ row }) => (
				<div className="flex w-full justify-center">
					<Badge
						className="min-h-5 px-2 py-0.5"
						tone={row.original.account.active ? "success" : "danger"}
						variant="primary"
					>
						{row.original.account.active
							? t("identity.adminPage.table.active.yes")
							: t("identity.adminPage.table.active.no")}
					</Badge>
				</div>
			),
		},
		{
			accessorFn: row => row.account.id,
			id: "id",
			header: t("common.fields.id"),
			size: TABLE_IDENTIFIER_TEXT_WIDTH,
			cell: ({ row }) => (
				<TableText
					text={row.original.account.id}
					maxWidth={TABLE_IDENTIFIER_TEXT_WIDTH}
					tooltiped
				/>
			),
		},
		{
			accessorFn: row => row.account.user.name,
			id: "name",
			header: t("identity.adminPage.table.columns.name"),
			cell: ({ row }) => row.original.account.user.name,
		},
		{
			accessorFn: row => row.account.email,
			id: "email",
			header: t("common.fields.email"),
			cell: ({ row }) => row.original.account.email,
		},
		{
			accessorFn: row => row.campus.campus,
			id: "campus",
			header: t("common.fields.campus"),
			cell: ({ row }) => row.original.campus.campusFormatted,
		},
		{
			accessorKey: "grantedAt",
			header: t("identity.adminPage.table.columns.grantedAt"),
			cell: ({ row }) => row.original.grantedAtFormatted,
		},
		{
			accessorFn: row => row.account.auditInfo.createdAt,
			id: "createdAt",
			header: t("common.fields.createdAt"),
			cell: ({ row }) => row.original.account.auditInfo.createdAtFormatted,
		},
		{
			accessorFn: row => row.account.auditInfo.updatedAt,
			id: "updatedAt",
			header: t("common.fields.updatedAt"),
			cell: ({ row }) => row.original.account.auditInfo.updatedAtFormatted,
		},
	];
}

export function buildAdminComplexSearchRequest(
	filters: AdminComplexSearchFilters,
): AdminComplexSearchRequest {
	const normalizedName = filters.name.trim();
	const normalizedCpf = normalizeCpf(filters.cpf.trim());
	const normalizedEmail = filters.email.trim();
	const normalizedDateFrom = toSearchDateOffsetDateTime(
		filters.dateFrom.trim(),
		"start",
	);
	const normalizedDateTo = toSearchDateOffsetDateTime(
		filters.dateTo.trim(),
		"end",
	);

	return {
		name: normalizedName || undefined,
		cpf: normalizedCpf || undefined,
		email: normalizedEmail || undefined,
		dateFrom: normalizedDateFrom,
		dateTo: normalizedDateTo,
		activeOnly: filters.activeOnly,
	};
}

export function filterAdminsByBackendFilters(
	admins: AdminSearchResponse[],
	filters: AdminComplexSearchFilters,
) {
	const request = buildAdminComplexSearchRequest(filters);

	return admins.filter(admin => {
		if (request.activeOnly && !admin.account.active) {
			return false;
		}

		if (
			request.name &&
			!normalizeTextForSearch(admin.account.user.name).includes(
				normalizeTextForSearch(request.name),
			)
		) {
			return false;
		}

		if (
			request.email &&
			!normalizeTextForSearch(admin.account.email).includes(
				normalizeTextForSearch(request.email),
			)
		) {
			return false;
		}

		if (
			(request.dateFrom || request.dateTo) &&
			!matchesAnyDateRange(
				[
					admin.account.auditInfo.createdAt,
					admin.account.auditInfo.updatedAt,
					admin.grantedAt,
				],
				{
					...(request.dateFrom ? { dateFrom: request.dateFrom } : {}),
					...(request.dateTo ? { dateTo: request.dateTo } : {}),
				},
			)
		) {
			return false;
		}

		return true;
	});
}

export function filterAdminsByFrontendFilters(
	admins: AdminSearchResponse[],
	{ campusFilters, query }: AdminFrontendFilterArgs,
) {
	const normalizedQuery = normalizeTextForSearch(query.trim());
	const hasQuery = normalizedQuery.length > 0;
	const hasCampusFilters = campusFilters.length > 0;

	if (!hasQuery && !hasCampusFilters) {
		return admins;
	}

	return admins.filter(admin => {
		if (hasQuery) {
			const normalizedEmail = normalizeTextForSearch(admin.account.email);
			const normalizedUserName = normalizeTextForSearch(
				admin.account.user.name,
			);

			if (
				!normalizedEmail.includes(normalizedQuery) &&
				!normalizedUserName.includes(normalizedQuery)
			) {
				return false;
			}
		}

		if (hasCampusFilters && !campusFilters.includes(admin.campus.campus)) {
			return false;
		}

		return true;
	});
}

export function getAdminEmptyStateCopy(t: TFunction, query: string) {
	return {
		title: t("identity.adminPage.empty.title"),
		description: query
			? t("identity.adminPage.empty.filteredDescription", { value: query })
			: t("identity.adminPage.empty.defaultDescription"),
	};
}

export function getAdminsListErrorToastContent(t: TFunction, error: unknown) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("identity.adminPage.feedback.listError.title"),
		fallbackDescription: t("identity.adminPage.feedback.listError.description"),
	});
}

export function getAdminDetailErrorToastContent(t: TFunction, error: unknown) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("identity.adminPage.feedback.detailError.title"),
		fallbackDescription: t(
			"identity.adminPage.feedback.detailError.description",
		),
	});
}

export function getLinkedAdminUserErrorToastContent(
	t: TFunction,
	error: unknown,
) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("identity.adminPage.feedback.linkedUserError.title"),
		fallbackDescription: t(
			"identity.adminPage.feedback.linkedUserError.description",
		),
	});
}

export function getLinkedAdminAccountErrorToastContent(
	t: TFunction,
	error: unknown,
) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("identity.adminPage.feedback.linkedAccountError.title"),
		fallbackDescription: t(
			"identity.adminPage.feedback.linkedAccountError.description",
		),
	});
}

export function getAdminUpdateErrorToastContent(t: TFunction, error: unknown) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("identity.adminPage.update.feedback.error.title"),
		fallbackDescription: t(
			"identity.adminPage.update.feedback.error.description",
		),
	});
}

export function getAdminCreateErrorToastContent(t: TFunction, error: unknown) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("identity.adminPage.create.feedback.error.title"),
		fallbackDescription: t(
			"identity.adminPage.create.feedback.error.description",
		),
	});
}

export function getAdminDuplicateErrorToastContent(
	t: TFunction,
	error: unknown,
) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("identity.adminPage.duplicate.feedback.error.title"),
		fallbackDescription: t(
			"identity.adminPage.duplicate.feedback.error.description",
		),
	});
}

export function getAdminSetActiveErrorToastContent(
	t: TFunction,
	error: unknown,
	active: boolean,
) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t(
			active
				? "identity.adminPage.reactivate.feedback.error.title"
				: "identity.adminPage.deactivate.feedback.error.title",
		),
		fallbackDescription: t(
			active
				? "identity.adminPage.reactivate.feedback.error.description"
				: "identity.adminPage.deactivate.feedback.error.description",
		),
	});
}

export function getAdminDeleteErrorToastContent(t: TFunction, error: unknown) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("identity.adminPage.delete.feedback.error.title"),
		fallbackDescription: t(
			"identity.adminPage.delete.feedback.error.description",
		),
	});
}

export function getAdminCampusOptions(t: TFunction) {
	return [
		{
			value: "JARAGUA_DO_SUL" as const,
			label: t("identity.adminPage.filters.campus.options.JARAGUA_DO_SUL"),
		},
		{
			value: "JOINVILLE" as const,
			label: t("identity.adminPage.filters.campus.options.JOINVILLE"),
		},
	];
}

export function getEmptyAdminEditorFormValues(): AdminEditorFormValues {
	return {
		cpf: "",
		name: "",
		email: "",
		campus: "JARAGUA_DO_SUL",
	};
}

export function buildAdminUpdateFormValues(
	admin: AdminResponse,
	linkedUser: AdminLinkedUser,
): AdminEditorFormValues {
	return {
		cpf: "",
		name: linkedUser.name,
		email: admin.accountResponse.email,
		campus: admin.campus.campus,
	};
}

export function toAdminUpdateRequest(
	values: AdminEditorFormValues,
): AdminUpdateRequest {
	return {
		name: values.name.trim(),
		emailString: values.email.trim(),
		campus: values.campus,
	};
}

export function toAdminCreateRequest(
	values: AdminEditorFormValues,
	existingUser?: AdminCreateExistingUser | null,
): AdminCreateRequest {
	if (existingUser) {
		return toAdminCreateRequest({
			...values,
			cpf: existingUser.cpf,
			name: existingUser.name,
		});
	}

	return {
		cpfString: normalizeCpf(values.cpf.trim()),
		name: values.name.trim(),
		emailString: values.email.trim(),
		campus: values.campus,
	};
}

export function findAdminExistingUserByCpf(
	users: AdminCreateExistingUser[],
	cpfValue: string,
) {
	const normalizedCpf = normalizeCpf(cpfValue.trim());
	if (normalizedCpf.length === 0) {
		return null;
	}

	return users.find(user => user.cpf === normalizedCpf) ?? null;
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

export function getAdminFilterSummary(
	t: TFunction,
	frontendFilters: AdminFrontendFilterArgs,
	backendFilters: AdminComplexSearchFilters,
) {
	const parts: string[] = [];

	if (frontendFilters.query.trim()) {
		parts.push(frontendFilters.query.trim());
	}

	if (frontendFilters.campusFilters.length > 0) {
		parts.push(
			frontendFilters.campusFilters
				.map(campus => t(`identity.adminPage.filters.campus.options.${campus}`))
				.join(", "),
		);
	}

	if (backendFilters.name.trim()) {
		parts.push(backendFilters.name.trim());
	}

	if (backendFilters.cpf.trim()) {
		parts.push(backendFilters.cpf.trim());
	}

	if (backendFilters.email.trim()) {
		parts.push(backendFilters.email.trim());
	}

	if (backendFilters.dateFrom || backendFilters.dateTo) {
		parts.push(
			[backendFilters.dateFrom || "...", backendFilters.dateTo || "..."].join(
				" - ",
			),
		);
	}

	if (!backendFilters.activeOnly) {
		parts.push(t("identity.accountPage.filters.activeOnly.off"));
	}

	return parts.join(" | ");
}
