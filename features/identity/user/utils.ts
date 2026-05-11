import type { ColumnDef } from "@tanstack/react-table";
import type { TFunction } from "i18next";

import type { UserResponse } from "@/types/api";
import { getApiErrorToastContent } from "@/utils/api-errors";
import { normalizeTextForSearch } from "@/utils/lang";

export type UserAuditDateField = "" | "createdAt" | "updatedAt";

export function createUserColumns(t: TFunction): ColumnDef<UserResponse>[] {
	return [
		{
			accessorKey: "name",
			header: t("identity.userPage.table.columns.name"),
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

export function filterUsers(
	users: UserResponse[],
	{
		cpfQuery,
		dateField,
		endDate,
		nameQuery,
		startDate,
	}: {
		cpfQuery: string;
		dateField: UserAuditDateField;
		endDate: string;
		nameQuery: string;
		startDate: string;
	},
) {
	const normalizedNameQuery = normalizeTextForSearch(nameQuery.trim());
	const normalizedCpfQuery = normalizeCpfSearch(cpfQuery.trim());
	const hasNameQuery = normalizedNameQuery.length > 0;
	const hasCpfQuery = normalizedCpfQuery.length > 0;
	const hasDateField = Boolean(dateField);
	const startTimestamp = startDate ? getStartOfDayTimestamp(startDate) : null;
	const endTimestamp = endDate ? getStartOfDayTimestamp(endDate) : null;

	if (
		!hasNameQuery &&
		!hasCpfQuery &&
		!hasDateField &&
		startTimestamp === null &&
		endTimestamp === null
	) {
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

		if (dateField && (startTimestamp !== null || endTimestamp !== null)) {
			const auditTimestamp = getStartOfDayTimestamp(user.auditInfo[dateField]);

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
