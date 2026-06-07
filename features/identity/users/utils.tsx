import type { ColumnDef } from "@tanstack/react-table";
import type { TFunction } from "i18next";

import {
	createDateTimeColumn,
	createTableTextColumn,
} from "@/components/composite";
import { TABLE_TRUNCATED_COLUMN_WIDTH } from "@/features/constants";
import {
	matchesAnyDateRange,
	toSearchDateOffsetDateTime,
} from "@/features/utils";
import type { UserComplexSearchRequest, UserResponse } from "@/types/api";
import type {
	UserComplexSearchFilters,
	UserFrontendFilterArgs,
} from "@/types/client";
import { getApiErrorToastContent, normalizeTextForSearch } from "@/utils";

export function createUserColumns(t: TFunction): ColumnDef<UserResponse>[] {
	return [
		createTableTextColumn<UserResponse>({
			id: "id",
			accessorKey: "id",
			header: t("common.fields.id"),
			text: row => row.id,
			size: TABLE_TRUNCATED_COLUMN_WIDTH,
			maxWidth: TABLE_TRUNCATED_COLUMN_WIDTH,
		}),
		{
			accessorKey: "name",
			header: t("identity.userPage.table.columns.name"),
			cell: ({ row }) => row.original.name,
		},
		{
			accessorKey: "cpf",
			header: t("common.fields.cpf"),
			cell: ({ row }) => row.original.cpfFormatted,
		},
		createDateTimeColumn<UserResponse>({
			id: "createdAt",
			header: t("common.fields.createdAt"),
			value: row => row.auditInfo.createdAt,
			formattedValue: row => row.auditInfo.createdAtFormatted,
		}),
		createDateTimeColumn<UserResponse>({
			id: "updatedAt",
			header: t("common.fields.updatedAt"),
			value: row => row.auditInfo.updatedAt,
			formattedValue: row => row.auditInfo.updatedAtFormatted,
		}),
	];
}

function normalizeCpfSearch(value: string) {
	return value.replace(/\D+/g, "");
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
	return matchesAnyDateRange(
		[user.auditInfo.createdAt, user.auditInfo.updatedAt],
		{ dateFrom: value },
	);
}

function matchesDateTo(user: UserResponse, value: string) {
	return matchesAnyDateRange(
		[user.auditInfo.createdAt, user.auditInfo.updatedAt],
		{ dateTo: value },
	);
}

export function buildUserComplexSearchRequest(
	filters: UserComplexSearchFilters,
): UserComplexSearchRequest {
	const normalizedName = filters.name.trim();
	const normalizedCpf = normalizeCpfSearch(filters.cpf.trim());
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
		dateFrom: normalizedDateFrom,
		dateTo: normalizedDateTo,
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
