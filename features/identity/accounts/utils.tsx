import type { ColumnDef } from "@tanstack/react-table";
import type { TFunction } from "i18next";

import { Badge, TableText } from "@/components";
import { TABLE_TRUNCATED_COLUMN_WIDTH } from "@/constants";
import type {
	AccountComplexSearchFilters,
	AccountFilterArgs,
	AccountResponse,
	AccountSearchResponse,
	UserResponse,
} from "@/types";
import { getApiErrorToastContent, normalizeTextForSearch } from "@/utils";

const TABLE_IDENTIFIER_TEXT_WIDTH = 50;

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

export function createAccountColumns(
	t: TFunction,
): ColumnDef<AccountSearchResponse>[] {
	return [
		{
			accessorKey: "active",
			size: TABLE_TRUNCATED_COLUMN_WIDTH,
			header: t("identity.accountPage.table.columns.active"),
			cell: ({ row }) => {
				const label = row.original.active
					? t("identity.accountPage.table.active.yes")
					: t("identity.accountPage.table.active.no");

				return (
					<div className="flex w-full justify-center">
						<Badge
							className="min-h-5 max-w-full overflow-hidden px-2 py-0.5 text-ellipsis whitespace-nowrap"
							tone={row.original.active ? "success" : "danger"}
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
		{
			accessorKey: "id",
			header: t("identity.accountPage.table.columns.id"),
			size: TABLE_IDENTIFIER_TEXT_WIDTH,
			cell: ({ row }) => (
				<TableText
					text={row.original.id}
					maxWidth={TABLE_IDENTIFIER_TEXT_WIDTH}
					tooltiped
				/>
			),
		},
		{
			accessorFn: row => row.user.name,
			id: "name",
			header: t("identity.accountPage.table.columns.name"),
			cell: ({ row }) => row.original.user.name,
		},
		{
			accessorKey: "email",
			header: t("identity.accountPage.table.columns.email"),
			cell: ({ row }) => row.original.email,
		},
		{
			accessorKey: "accountType",
			size: TABLE_TRUNCATED_COLUMN_WIDTH,
			header: t("identity.accountPage.table.columns.accountType"),
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
		accountTypeFormatted: account.accountTypeFormatted,
		auditInfo: account.auditInfo,
		active: account.active,
	}));
}

function normalizeCpfSearch(value: string) {
	return value.replace(/\D+/g, "");
}

function getStartOfDayTimestamp(value: string) {
	const date = new Date(value);
	date.setHours(0, 0, 0, 0);
	return date.getTime();
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

		if (request.accountType && account.accountType !== request.accountType) {
			return false;
		}

		if (request.dateFrom || request.dateTo) {
			const createdAt = getStartOfDayTimestamp(account.auditInfo.createdAt);
			const updatedAt = getStartOfDayTimestamp(account.auditInfo.updatedAt);
			const startTimestamp = request.dateFrom
				? getStartOfDayTimestamp(request.dateFrom)
				: null;
			const endTimestamp = request.dateTo
				? getStartOfDayTimestamp(request.dateTo)
				: null;

			if (
				startTimestamp !== null &&
				createdAt < startTimestamp &&
				updatedAt < startTimestamp
			) {
				return false;
			}

			if (
				endTimestamp !== null &&
				createdAt > endTimestamp &&
				updatedAt > endTimestamp
			) {
				return false;
			}
		}

		return true;
	});
}

export function buildAccountComplexSearchRequest(
	filters: AccountComplexSearchFilters,
) {
	const normalizedName = filters.name.trim();
	const normalizedCpf = normalizeCpfSearch(filters.cpf.trim());
	const normalizedEmail = filters.email.trim();
	const normalizedDateFrom = filters.dateFrom.trim();
	const normalizedDateTo = filters.dateTo.trim();

	return {
		name: normalizedName || undefined,
		cpf: normalizedCpf || undefined,
		email: normalizedEmail || undefined,
		accountType: filters.accountType || undefined,
		dateFrom: normalizedDateFrom || undefined,
		dateTo: normalizedDateTo || undefined,
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
		typeof (account as { user?: { cpf?: string } }).user?.cpf === "string"
	) {
		const accountCpf = normalizeCpfSearch(
			(account as { user: { cpf: string } }).user.cpf,
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

	if (filters.accountType && account.accountType !== filters.accountType) {
		return false;
	}

	if (filters.dateFrom || filters.dateTo) {
		const createdAt = getStartOfDayTimestamp(account.auditInfo.createdAt);
		const updatedAt = getStartOfDayTimestamp(account.auditInfo.updatedAt);
		const startTimestamp = filters.dateFrom
			? getStartOfDayTimestamp(filters.dateFrom)
			: null;
		const endTimestamp = filters.dateTo
			? getStartOfDayTimestamp(filters.dateTo)
			: null;

		if (
			startTimestamp !== null &&
			createdAt < startTimestamp &&
			updatedAt < startTimestamp
		) {
			return false;
		}

		if (
			endTimestamp !== null &&
			createdAt > endTimestamp &&
			updatedAt > endTimestamp
		) {
			return false;
		}
	}

	return true;
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
			normalizeTextForSearch(account.id).includes(normalizedQuery) ||
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

	if (filters.accountType) {
		parts.push(
			t(
				`identity.accountPage.filters.accountType.options.${filters.accountType}`,
			),
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
