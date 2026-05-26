import type { ColumnDef } from "@tanstack/react-table";
import type { TFunction } from "i18next";

import { TableText } from "@/components";
import { TABLE_TRUNCATED_COLUMN_WIDTH } from "@/constants";
import type {
	UserComplexSearchFilters,
	UserComplexSearchRequest,
	UserFrontendFilterArgs,
	UserResponse,
} from "@/types";
import { getApiErrorToastContent, normalizeTextForSearch } from "@/utils";

export function createUserColumns(t: TFunction): ColumnDef<UserResponse>[] {
	return [
		{
			accessorKey: "id",
			header: t("identity.userPage.table.columns.id"),
			size: TABLE_TRUNCATED_COLUMN_WIDTH,
			cell: ({ row }) => (
				<TableText
					text={row.original.id}
					maxWidth={TABLE_TRUNCATED_COLUMN_WIDTH}
					tooltiped
				/>
			),
		},
		{
			accessorKey: "name",
			header: t("identity.userPage.table.columns.name"),
			cell: ({ row }) => row.original.name,
		},
		{
			accessorKey: "cpf",
			header: t("identity.userPage.table.columns.cpf"),
			cell: ({ row }) => row.original.cpfFormatted,
		},
		{
			accessorFn: row => row.auditInfo.createdAt,
			id: "createdAt",
			header: t("identity.userPage.table.columns.createdAt"),
			cell: ({ row }) => row.original.auditInfo.createdAtFormatted,
		},
		{
			accessorFn: row => row.auditInfo.updatedAt,
			id: "updatedAt",
			header: t("identity.userPage.table.columns.updatedAt"),
			cell: ({ row }) => row.original.auditInfo.updatedAtFormatted,
		},
	];
}

function normalizeCpfSearch(value: string) {
	return value.replace(/\D+/g, "");
}

function getStartOfDayTimestamp(value: string) {
	const date = new Date(value);
	date.setHours(0, 0, 0, 0);
	return date.getTime();
}

function matchesName(user: UserResponse, value: string) {
	return normalizeTextForSearch(user.name).includes(
		normalizeTextForSearch(value),
	);
}

function matchesCpf(user: UserResponse, value: string) {
	return normalizeCpfSearch(user.cpf).includes(normalizeCpfSearch(value));
}

function matchesDateFrom(user: UserResponse, value: string) {
	const threshold = getStartOfDayTimestamp(value);
	const createdAt = getStartOfDayTimestamp(user.auditInfo.createdAt);
	const updatedAt = getStartOfDayTimestamp(user.auditInfo.updatedAt);

	return createdAt >= threshold || updatedAt >= threshold;
}

function matchesDateTo(user: UserResponse, value: string) {
	const threshold = getStartOfDayTimestamp(value);
	const createdAt = getStartOfDayTimestamp(user.auditInfo.createdAt);
	const updatedAt = getStartOfDayTimestamp(user.auditInfo.updatedAt);

	return createdAt <= threshold || updatedAt <= threshold;
}

export function buildUserComplexSearchRequest(
	filters: UserComplexSearchFilters,
): UserComplexSearchRequest {
	const normalizedName = filters.name.trim();
	const normalizedCpf = normalizeCpfSearch(filters.cpf.trim());
	const normalizedDateFrom = filters.dateFrom.trim();
	const normalizedDateTo = filters.dateTo.trim();

	return {
		name: normalizedName || undefined,
		cpf: normalizedCpf || undefined,
		dateFrom: normalizedDateFrom || undefined,
		dateTo: normalizedDateTo || undefined,
	};
}

export function filterUsersByComplexSearch(
	users: UserResponse[],
	filters: UserComplexSearchFilters,
) {
	const request = buildUserComplexSearchRequest(filters);
	const criteria = [
		request.name
			? (user: UserResponse) => matchesName(user, request.name!)
			: null,
		request.cpf ? (user: UserResponse) => matchesCpf(user, request.cpf!) : null,
		request.dateFrom
			? (user: UserResponse) => matchesDateFrom(user, request.dateFrom!)
			: null,
		request.dateTo
			? (user: UserResponse) => matchesDateTo(user, request.dateTo!)
			: null,
	].filter((criterion): criterion is (user: UserResponse) => boolean =>
		Boolean(criterion),
	);

	if (criteria.length === 0) {
		return users;
	}

	return users.filter(user => criteria.every(criterion => criterion(user)));
}

export function filterUsersByFrontendFilters(
	users: UserResponse[],
	{ cpfQuery, nameQuery }: UserFrontendFilterArgs,
) {
	const normalizedNameQuery = normalizeTextForSearch(nameQuery.trim());
	const normalizedCpfQuery = normalizeCpfSearch(cpfQuery.trim());
	const hasNameQuery = normalizedNameQuery.length > 0;
	const hasCpfQuery = normalizedCpfQuery.length > 0;

	if (!hasNameQuery && !hasCpfQuery) {
		return users;
	}

	return users.filter(user => {
		if (hasNameQuery) {
			const normalizedName = normalizeTextForSearch(user.name);
			if (!normalizedName.includes(normalizedNameQuery)) {
				return false;
			}
		}

		if (hasCpfQuery) {
			const normalizedCpf = normalizeCpfSearch(user.cpf);
			if (!normalizedCpf.includes(normalizedCpfQuery)) {
				return false;
			}
		}

		return true;
	});
}

export function getUserEmptyStateCopy(t: TFunction, query: string) {
	return {
		title: t("identity.userPage.empty.title"),
		description: query
			? t("identity.userPage.empty.filteredDescription", { value: query })
			: t("identity.userPage.empty.defaultDescription"),
	};
}

export function getUsersListErrorToastContent(t: TFunction, error: unknown) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("identity.userPage.feedback.listError.title"),
		fallbackDescription: t("identity.userPage.feedback.listError.description"),
	});
}

export function getUserDetailErrorToastContent(t: TFunction, error: unknown) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("identity.userPage.feedback.detailError.title"),
		fallbackDescription: t(
			"identity.userPage.feedback.detailError.description",
		),
	});
}
