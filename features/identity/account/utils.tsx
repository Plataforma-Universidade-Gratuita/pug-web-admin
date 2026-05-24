import type { ColumnDef } from "@tanstack/react-table";
import type { TFunction } from "i18next";

import { Badge } from "@/components";
import type { AccountResponse } from "@/types/api";
import type {
	AccountActiveFilter,
	AccountAuditDateField,
	AccountTypeFilter,
} from "@/types/client/identity";
import { getApiErrorToastContent } from "@/utils/api-errors";
import { normalizeTextForSearch } from "@/utils/lang";

export function getAccountTypeTone(
	accountType: AccountResponse["accountType"],
) {
	switch (accountType) {
		case "ADMIN":
			return "warning";
		case "PARTNER":
			return "info";
		case "STUDENT":
			return "brand";
		default:
			return "neutral";
	}
}

export function getAccountTypeLabel(
	t: TFunction,
	accountType: AccountResponse["accountType"],
) {
	return t(`identity.accountPage.filters.accountType.options.${accountType}`);
}

export function getAccountOptionClassName(
	type: "active" | "accountType",
	value: string,
) {
	if (type === "active") {
		if (value === "true") {
			return "data-[highlighted=true]:border-transparent data-[highlighted=true]:bg-[color:color-mix(in_srgb,var(--color-success)_14%,var(--twc-surface-2))] data-[highlighted=true]:text-[color:var(--color-success)]";
		}

		if (value === "false") {
			return "data-[highlighted=true]:border-transparent data-[highlighted=true]:bg-[color:color-mix(in_srgb,var(--color-danger)_14%,var(--twc-surface-2))] data-[highlighted=true]:text-[color:var(--color-danger)]";
		}

		return "";
	}

	switch (value) {
		case "ADMIN":
			return "data-[highlighted=true]:border-transparent data-[highlighted=true]:bg-[color:color-mix(in_srgb,var(--color-warning)_14%,var(--twc-surface-2))] data-[highlighted=true]:text-[color:var(--color-warning)]";
		case "PARTNER":
			return "data-[highlighted=true]:border-transparent data-[highlighted=true]:bg-[color:color-mix(in_srgb,var(--color-info)_14%,var(--twc-surface-2))] data-[highlighted=true]:text-[color:var(--color-info)]";
		case "STUDENT":
			return "data-[highlighted=true]:border-transparent data-[highlighted=true]:bg-[color:color-mix(in_srgb,var(--color-brand)_14%,var(--twc-surface-2))] data-[highlighted=true]:text-[color:var(--color-brand)]";
		default:
			return "";
	}
}

export function createAccountColumns(
	t: TFunction,
): ColumnDef<AccountResponse>[] {
	return [
		{
			accessorKey: "active",
			size: 96,
			header: () => (
				<div className="flex w-full justify-center">
					{t("identity.accountPage.table.columns.active")}
				</div>
			),
			cell: ({ row }) => (
				<div className="flex w-full justify-center">
					<Badge
						className="min-h-5 px-2 py-0.5"
						tone={row.original.active ? "success" : "danger"}
						variant="primary"
					>
						{row.original.active
							? t("identity.accountPage.table.active.yes")
							: t("identity.accountPage.table.active.no")}
					</Badge>
				</div>
			),
		},
		{
			accessorKey: "userName",
			header: t("identity.accountPage.table.columns.name"),
		},
		{
			accessorKey: "email",
			header: t("identity.accountPage.table.columns.email"),
		},
		{
			accessorKey: "accountType",
			size: 116,
			header: () => (
				<div className="flex w-full justify-center">
					{t("identity.accountPage.table.columns.accountType")}
				</div>
			),
			cell: ({ row }) => (
				<div className="flex w-full justify-center">
					<Badge
						className="min-h-5 px-2 py-0.5"
						tone={getAccountTypeTone(row.original.accountType)}
						variant="primary"
					>
						{getAccountTypeLabel(t, row.original.accountType)}
					</Badge>
				</div>
			),
		},
		{
			accessorFn: row => row.auditInfo.createdAt,
			id: "createdAt",
			header: t("identity.accountPage.table.columns.createdAt"),
			cell: ({ row }) => row.original.auditInfo.createdAtFormatted,
		},
		{
			accessorFn: row => row.auditInfo.updatedAt,
			id: "updatedAt",
			header: t("identity.accountPage.table.columns.updatedAt"),
			cell: ({ row }) => row.original.auditInfo.updatedAtFormatted,
		},
	];
}

function getStartOfDayTimestamp(value: string) {
	const date = new Date(value);
	date.setHours(0, 0, 0, 0);
	return date.getTime();
}

export function filterAccounts(
	accounts: AccountResponse[],
	{
		activeFilter,
		accountTypeFilter,
		dateField,
		query,
		endDate,
		startDate,
	}: {
		activeFilter: AccountActiveFilter;
		accountTypeFilter: AccountTypeFilter;
		dateField: AccountAuditDateField;
		query: string;
		endDate: string;
		startDate: string;
	},
) {
	const normalizedQuery = normalizeTextForSearch(query.trim());
	const hasQuery = normalizedQuery.length > 0;
	const hasDateField = Boolean(dateField);
	const hasActiveFilter = activeFilter !== "";
	const hasAccountTypeFilter = accountTypeFilter !== "";
	const startTimestamp = startDate ? getStartOfDayTimestamp(startDate) : null;
	const endTimestamp = endDate ? getStartOfDayTimestamp(endDate) : null;

	if (
		!hasQuery &&
		!hasDateField &&
		!hasActiveFilter &&
		!hasAccountTypeFilter &&
		startTimestamp === null &&
		endTimestamp === null
	) {
		return accounts;
	}

	return accounts.filter(account => {
		if (hasQuery) {
			const normalizedEmail = normalizeTextForSearch(account.email);
			const normalizedUserName = normalizeTextForSearch(account.userName);

			if (
				!normalizedEmail.includes(normalizedQuery) &&
				!normalizedUserName.includes(normalizedQuery)
			) {
				return false;
			}
		}

		if (hasActiveFilter && String(account.active) !== activeFilter) {
			return false;
		}

		if (hasAccountTypeFilter && account.accountType !== accountTypeFilter) {
			return false;
		}

		if (dateField && (startTimestamp !== null || endTimestamp !== null)) {
			const auditTimestamp = getStartOfDayTimestamp(
				account.auditInfo[dateField],
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

export function getAccountEmptyStateCopy(t: TFunction, query: string) {
	return {
		title: t("identity.accountPage.empty.title"),
		description: query
			? t("identity.accountPage.empty.filteredDescription", { value: query })
			: t("identity.accountPage.empty.defaultDescription"),
	};
}

export function getAccountsListErrorToastContent(t: TFunction, error: unknown) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("identity.accountPage.feedback.listError.title"),
		fallbackDescription: t(
			"identity.accountPage.feedback.listError.description",
		),
	});
}

export function getAccountDetailErrorToastContent(
	t: TFunction,
	error: unknown,
) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("identity.accountPage.feedback.detailError.title"),
		fallbackDescription: t(
			"identity.accountPage.feedback.detailError.description",
		),
	});
}

export function getLinkedUserErrorToastContent(t: TFunction, error: unknown) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("identity.accountPage.feedback.linkedUserError.title"),
		fallbackDescription: t(
			"identity.accountPage.feedback.linkedUserError.description",
		),
	});
}

export function getAccountFilterSummary(
	t: TFunction,
	{
		activeFilter,
		accountTypeFilter,
		dateField,
		query,
		endDate,
		startDate,
	}: {
		activeFilter: AccountActiveFilter;
		accountTypeFilter: AccountTypeFilter;
		dateField: AccountAuditDateField;
		query: string;
		endDate: string;
		startDate: string;
	},
) {
	const parts: string[] = [];

	if (query.trim()) {
		parts.push(query.trim());
	}

	if (accountTypeFilter) {
		parts.push(
			t(
				`identity.accountPage.filters.accountType.options.${accountTypeFilter}`,
			),
		);
	}

	if (activeFilter) {
		parts.push(
			t(
				activeFilter === "true"
					? "identity.accountPage.filters.active.options.active"
					: "identity.accountPage.filters.active.options.inactive",
			),
		);
	}

	if (dateField) {
		parts.push(
			t(`identity.accountPage.filters.dateField.options.${dateField}`),
		);
	}

	if (startDate || endDate) {
		parts.push([startDate || "...", endDate || "..."].join(" - "));
	}

	return parts.join(" | ");
}
