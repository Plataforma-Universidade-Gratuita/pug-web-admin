import type { ColumnDef } from "@tanstack/react-table";
import type { TFunction } from "i18next";

import {
	createActiveBadgeColumn,
	createDateTimeColumn,
	createTableTextColumn,
} from "@/components/composite";
import { Badge } from "@/components/primitives";
import { TABLE_TRUNCATED_COLUMN_WIDTH } from "@/features/constants";
import { TABLE_IDENTIFIER_TEXT_WIDTH } from "@/features/identity/accounts/constants";
import {
	matchesAnyDateRange,
	toSearchDateOffsetDateTime,
} from "@/features/utils";
import type {
	AccountType,
	AccountTypeResponse,
	AccountResponse,
	AccountSearchResponse,
	UserResponse,
} from "@/types/api";
import type {
	AccountComplexSearchFilters,
	AccountFilterArgs,
} from "@/types/client";
import { getApiErrorToastContent, normalizeTextForSearch } from "@/utils";

function getAccountTypeValue(accountType: AccountType | AccountTypeResponse) {
	return typeof accountType === "string"
		? accountType
		: accountType.accountType;
}

export function getAccountOptionClassName(kind: "active", value: string) {
	if (kind === "active") {
		return value === "true"
			? "text-[color:var(--twc-success-strong)]"
			: "text-[color:var(--twc-danger-strong)]";
	}

	return "";
}

export function getAccountTypeTone(
	accountType: AccountType | AccountTypeResponse,
) {
	switch (getAccountTypeValue(accountType)) {
		case "ADMIN":
			return "warning";
		case "PARTNER":
			return "info";
		case "FORMER_STUDENT":
			return "brand";
		default:
			return "neutral";
	}
}

export function getAccountTypeLabel(
	t: TFunction,
	accountType: AccountType | AccountTypeResponse,
) {
	if (
		typeof accountType !== "string" &&
		accountType.accountTypeFormatted.trim()
	) {
		return accountType.accountTypeFormatted;
	}

	const accountTypeValue = getAccountTypeValue(accountType);
	const localized = t(
		`identity.accountPage.filters.accountType.options.${accountTypeValue}`,
	);

	if (
		!localized.includes("identity.accountPage.filters.accountType.options.")
	) {
		return localized;
	}

	return accountTypeValue
		.toLowerCase()
		.split("_")
		.map(segment => segment.charAt(0).toUpperCase() + segment.slice(1))
		.join(" ");
}

export function createAccountColumns(
	t: TFunction,
): ColumnDef<AccountSearchResponse>[] {
	return [
		createActiveBadgeColumn<AccountSearchResponse>({
			id: "active",
			header: t("identity.accountPage.table.columns.active"),
			value: row => row.active,
			activeLabel: t("common.status.active"),
			inactiveLabel: t("common.status.inactive"),
			size: TABLE_TRUNCATED_COLUMN_WIDTH,
		}),
		createTableTextColumn<AccountSearchResponse>({
			id: "id",
			accessorKey: "id",
			header: t("common.fields.id"),
			text: row => row.id,
			size: TABLE_IDENTIFIER_TEXT_WIDTH,
			maxWidth: TABLE_IDENTIFIER_TEXT_WIDTH,
		}),
		{
			accessorFn: row => row.user.name,
			id: "name",
			header: t("identity.accountPage.table.columns.name"),
			cell: ({ row }) => row.original.user.name,
		},
		{
			accessorKey: "email",
			header: t("common.fields.email"),
			cell: ({ row }) => row.original.email,
		},
		{
			accessorKey: "accountType",
			size: TABLE_TRUNCATED_COLUMN_WIDTH,
			header: t("common.fields.accountType"),
			cell: ({ row }) => {
				const label = getAccountTypeLabel(t, row.original.accountType);

				return (
					<div className="flex w-full justify-center">
						<Badge
							className="min-h-5 max-w-full overflow-hidden px-2 py-0.5 text-ellipsis whitespace-nowrap"
							tone={getAccountTypeTone(row.original.accountType)}
							variant="primary"
						>
							<span className="block max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
								{label}
							</span>
						</Badge>
					</div>
				);
			},
		},
		createDateTimeColumn<AccountSearchResponse>({
			id: "createdAt",
			header: t("common.fields.createdAt"),
			value: row => row.auditInfo.createdAt,
			formattedValue: row => row.auditInfo.createdAtFormatted,
		}),
		createDateTimeColumn<AccountSearchResponse>({
			id: "updatedAt",
			header: t("common.fields.updatedAt"),
			value: row => row.auditInfo.updatedAt,
			formattedValue: row => row.auditInfo.updatedAtFormatted,
		}),
	];
}

export function mapAccountsToSearchResponses(
	accounts: AccountResponse[],
	userNameById: Map<string, string>,
) {
	return accounts.map<AccountSearchResponse>(account => ({
		id: account.id,
		user: {
			id: account.userId,
			name: userNameById.get(account.userId) ?? account.userId,
		},
		email: account.email,
		accountType: account.accountType,
		auditInfo: account.auditInfo,
		active: account.active,
	}));
}

function normalizeCpfSearch(value: string) {
	return value.replace(/\D+/g, "");
}

export function filterAccountListByBackendFilters(
	accounts: AccountResponse[],
	users: UserResponse[],
	filters: AccountComplexSearchFilters,
) {
	const request = buildAccountComplexSearchRequest(filters);
	const userById = new Map(users.map(user => [user.id, user]));

	return accounts.filter(account => {
		if (request.activeOnly && !account.active) {
			return false;
		}

		const user = userById.get(account.userId);

		if (
			request.name &&
			!normalizeTextForSearch(user?.name ?? "").includes(
				normalizeTextForSearch(request.name),
			)
		) {
			return false;
		}

		if (
			request.cpf &&
			!normalizeCpfSearch(user?.cpf ?? "").includes(request.cpf)
		) {
			return false;
		}

		if (
			request.email &&
			!normalizeTextForSearch(account.email).includes(
				normalizeTextForSearch(request.email),
			)
		) {
			return false;
		}

		if (
			request.accountTypes?.length &&
			!request.accountTypes.includes(account.accountType.accountType)
		) {
			return false;
		}

		return !(
			(request.dateFrom || request.dateTo) &&
			!matchesAnyDateRange(
				[account.auditInfo.createdAt, account.auditInfo.updatedAt],
				{
					...(request.dateFrom ? { dateFrom: request.dateFrom } : {}),
					...(request.dateTo ? { dateTo: request.dateTo } : {}),
				},
			)
		);
	});
}

export function buildAccountComplexSearchRequest(
	filters: AccountComplexSearchFilters,
) {
	const normalizedName = filters.name.trim();
	const normalizedCpf = normalizeCpfSearch(filters.cpf.trim());
	const normalizedEmail = filters.email.trim();
	const normalizedDateFrom = toSearchDateOffsetDateTime(
		filters.dateFrom.trim(),
		"start",
	);
	const normalizedDateTo = toSearchDateOffsetDateTime(
		filters.dateTo.trim(),
		"end",
	);
	const normalizedAccountTypes = filters.accountTypes.filter(
		(accountType): accountType is Exclude<typeof accountType, ""> =>
			accountType.length > 0,
	);

	return {
		name: normalizedName || undefined,
		cpf: normalizedCpf || undefined,
		email: normalizedEmail || undefined,
		accountTypes:
			normalizedAccountTypes.length > 0 ? normalizedAccountTypes : undefined,
		dateFrom: normalizedDateFrom,
		dateTo: normalizedDateTo,
		activeOnly: filters.activeOnly,
	};
}

function matchesBackendFilters(
	account: AccountSearchResponse,
	filters: ReturnType<typeof buildAccountComplexSearchRequest>,
) {
	if (filters.activeOnly && !account.active) {
		return false;
	}

	if (
		filters.name &&
		!normalizeTextForSearch(account.user.name).includes(
			normalizeTextForSearch(filters.name),
		)
	) {
		return false;
	}

	if (
		filters.cpf &&
		typeof (account as unknown as { user?: { cpf?: string } }).user?.cpf ===
			"string"
	) {
		const accountCpf = normalizeCpfSearch(
			(account as unknown as { user: { cpf: string } }).user.cpf,
		);
		if (!accountCpf.includes(filters.cpf)) {
			return false;
		}
	}

	if (
		filters.email &&
		!normalizeTextForSearch(account.email).includes(
			normalizeTextForSearch(filters.email),
		)
	) {
		return false;
	}

	if (
		filters.accountTypes?.length &&
		!filters.accountTypes.includes(account.accountType.accountType)
	) {
		return false;
	}

	return !(
		(filters.dateFrom || filters.dateTo) &&
		!matchesAnyDateRange(
			[account.auditInfo.createdAt, account.auditInfo.updatedAt],
			{
				...(filters.dateFrom ? { dateFrom: filters.dateFrom } : {}),
				...(filters.dateTo ? { dateTo: filters.dateTo } : {}),
			},
		)
	);
}

export function filterAccountsByBackendFilters(
	accounts: AccountSearchResponse[],
	filters: AccountComplexSearchFilters,
) {
	const request = buildAccountComplexSearchRequest(filters);
	return accounts.filter(account => matchesBackendFilters(account, request));
}

export function filterAccountsByFrontendFilters(
	accounts: AccountSearchResponse[],
	{ query }: AccountFilterArgs,
) {
	const normalizedQuery = normalizeTextForSearch(query.trim());

	if (!normalizedQuery) {
		return accounts;
	}

	return accounts.filter(account => {
		return (
			normalizeTextForSearch(account.user.name).includes(normalizedQuery) ||
			normalizeTextForSearch(account.email).includes(normalizedQuery)
		);
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

export function getAccountFilterSummary(
	t: TFunction,
	filters: AccountComplexSearchFilters,
	query: string,
) {
	const parts: string[] = [];

	if (query.trim()) {
		parts.push(query.trim());
	}

	if (filters.name.trim()) {
		parts.push(filters.name.trim());
	}

	if (filters.cpf.trim()) {
		parts.push(filters.cpf.trim());
	}

	if (filters.email.trim()) {
		parts.push(filters.email.trim());
	}

	if (filters.accountTypes.length > 0) {
		parts.push(
			filters.accountTypes
				.map(accountType =>
					t(`identity.accountPage.filters.accountType.options.${accountType}`),
				)
				.join(", "),
		);
	}

	if (filters.dateFrom || filters.dateTo) {
		parts.push(
			[filters.dateFrom || "...", filters.dateTo || "..."].join(" - "),
		);
	}

	if (!filters.activeOnly) {
		parts.push(t("identity.accountPage.filters.activeOnly.off"));
	}

	return parts.join(" | ");
}
