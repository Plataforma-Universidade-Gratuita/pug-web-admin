import type { ColumnDef } from "@tanstack/react-table";
import type { TFunction } from "i18next";

import { Badge, TableText } from "@/components";
import { TABLE_TRUNCATED_COLUMN_WIDTH } from "@/constants";
import { getAccountOptionClassName } from "@/features/identity/accounts/utils";
import type {
	CityResponse,
	EntityResponse,
	StaffComplexSearchFilters,
	StaffComplexSearchRequest,
	StaffCreateExistingUser,
	StaffCreateRequest,
	StaffEditorFormValues,
	StaffResponse,
	StaffSearchResponse,
	StaffUpdateRequest,
	UserResponse,
} from "@/types";
import type { StaffFilterSummaryArgs } from "@/types";
import { getApiErrorToastContent } from "@/utils";
import {
	compareNormalizedText,
	matchesAnyDateRange,
	normalizeDigits,
	normalizeTextForSearch,
	toSearchDateOffsetDateTime,
} from "@/utils";

export { createStaffEditorFormSchema } from "@/schemas";

const TABLE_IDENTIFIER_TEXT_WIDTH = 50;

function normalizeCpf(value: string) {
	return normalizeDigits(value).slice(0, 11);
}

function buildStaffSearchResponse(
	staff: StaffResponse,
	userById: Map<string, UserResponse>,
	entityById: Map<string, EntityResponse>,
): StaffSearchResponse {
	const user = userById.get(staff.account.userId);
	const entity = entityById.get(staff.entityId);

	return {
		account: {
			id: staff.account.id,
			user: {
				id: staff.account.userId,
				name: user?.name ?? staff.account.userId,
			},
			email: staff.account.email,
			accountType: staff.account.accountType,
			auditInfo: staff.account.auditInfo,
			active: staff.account.active,
		},
		entity: {
			id: staff.entityId,
			name: entity?.name ?? staff.entityId,
		},
	};
}

export function buildStaffEntityOptions(entities: EntityResponse[]) {
	return [...entities]
		.sort((left, right) => compareNormalizedText(left.name, right.name))
		.map(entity => ({
			value: entity.id,
			label: entity.name,
			description: entity.cnpjFormatted,
			keywords: [entity.cnpjFormatted, entity.cnpj],
		}));
}

export function buildStaffCityOptions(cities: CityResponse[]) {
	return [...cities]
		.sort((left, right) => compareNormalizedText(left.name, right.name))
		.map(city => ({
			value: city.id,
			label: city.name,
			description: city.ibgeCode,
			keywords: [city.ibgeCode],
		}));
}

export function createStaffColumns(
	t: TFunction,
): ColumnDef<StaffSearchResponse>[] {
	return [
		{
			accessorFn: row => row.account.active,
			id: "active",
			size: TABLE_TRUNCATED_COLUMN_WIDTH,
			header: () => (
				<div className="flex w-full justify-center">
					{t("partner.staffPage.table.columns.active")}
				</div>
			),
			cell: ({ row }) => {
				const isActive = row.original.account.active;

				return (
					<div className="flex w-full justify-center">
						<Badge
							className="min-h-5 px-2 py-0.5"
							tone={isActive ? "success" : "danger"}
							variant="primary"
						>
							{isActive
								? t("partner.staffPage.table.active.yes")
								: t("partner.staffPage.table.active.no")}
						</Badge>
					</div>
				);
			},
		},
		{
			accessorFn: row => row.account.id,
			id: "id",
			header: t("partner.staffPage.table.columns.id"),
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
			header: t("partner.staffPage.table.columns.name"),
			cell: ({ row }) => row.original.account.user.name,
		},
		{
			accessorFn: row => row.account.email,
			id: "email",
			header: t("partner.staffPage.table.columns.email"),
			cell: ({ row }) => row.original.account.email,
		},
		{
			accessorFn: row => row.entity.name,
			id: "entity",
			header: t("partner.staffPage.table.columns.entity"),
			cell: ({ row }) => row.original.entity.name,
		},
		{
			accessorFn: row => row.account.auditInfo.createdAt,
			id: "createdAt",
			header: t("partner.staffPage.table.columns.createdAt"),
			cell: ({ row }) => row.original.account.auditInfo.createdAtFormatted,
		},
		{
			accessorFn: row => row.account.auditInfo.updatedAt,
			id: "updatedAt",
			header: t("partner.staffPage.table.columns.updatedAt"),
			cell: ({ row }) => row.original.account.auditInfo.updatedAtFormatted,
		},
	];
}

export function mapStaffToSearchResponses(
	staff: StaffResponse[],
	userById: Map<string, UserResponse>,
	entityById: Map<string, EntityResponse>,
) {
	return staff.map(item => buildStaffSearchResponse(item, userById, entityById));
}

export function buildStaffComplexSearchRequest(
	filters: StaffComplexSearchFilters,
): StaffComplexSearchRequest {
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
		entityIds: filters.entityIds.length > 0 ? filters.entityIds : undefined,
		dateFrom: normalizedDateFrom,
		dateTo: normalizedDateTo,
		activeOnly: filters.activeOnly,
	};
}

export function filterStaffListByBackendFilters(
	staff: StaffResponse[],
	userById: Map<string, UserResponse>,
	entityById: Map<string, EntityResponse>,
	filters: StaffComplexSearchFilters,
) {
	const request = buildStaffComplexSearchRequest(filters);

	return staff
		.filter(item => {
			const user = userById.get(item.account.userId);
			const entity = entityById.get(item.entityId);

			if (request.activeOnly && !item.account.active) {
				return false;
			}

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
				!normalizeCpf(user?.cpf ?? "").includes(request.cpf)
			) {
				return false;
			}

			if (
				request.email &&
				!normalizeTextForSearch(item.account.email).includes(
					normalizeTextForSearch(request.email),
				)
			) {
				return false;
			}

			if (
				request.entityIds?.length &&
				!request.entityIds.includes(item.entityId)
			) {
				return false;
			}

			if (!request.dateFrom && !request.dateTo) {
				return true;
			}

			const timestamps = [
				item.account.auditInfo.createdAt,
				item.account.auditInfo.updatedAt,
				user?.auditInfo.createdAt,
				user?.auditInfo.updatedAt,
				entity?.auditInfo.createdAt,
				entity?.auditInfo.updatedAt,
			].filter((value): value is string => Boolean(value));

			if (timestamps.length === 0) {
				return false;
			}

			const range: {
				dateFrom?: string;
				dateTo?: string;
			} = {};

			if (request.dateFrom) {
				range.dateFrom = request.dateFrom;
			}

			if (request.dateTo) {
				range.dateTo = request.dateTo;
			}

			return matchesAnyDateRange(timestamps, range);
		})
		.map(item => buildStaffSearchResponse(item, userById, entityById));
}

export function filterStaffByFrontendQuery(
	staff: StaffSearchResponse[],
	query: string,
) {
	const normalizedQuery = normalizeTextForSearch(query.trim());

	if (!normalizedQuery) {
		return staff;
	}

	return staff.filter(item => {
		const normalizedId = normalizeTextForSearch(item.account.id);
		const normalizedEmail = normalizeTextForSearch(item.account.email);
		const normalizedName = normalizeTextForSearch(item.account.user.name);
		const normalizedEntity = normalizeTextForSearch(item.entity.name);

		return (
			normalizedId.includes(normalizedQuery) ||
			normalizedEmail.includes(normalizedQuery) ||
			normalizedName.includes(normalizedQuery) ||
			normalizedEntity.includes(normalizedQuery)
		);
	});
}

export function getStaffEmptyStateCopy(t: TFunction, query: string) {
	return {
		title: t("partner.staffPage.empty.title"),
		description: query
			? t("partner.staffPage.empty.filteredDescription", { value: query })
			: t("partner.staffPage.empty.defaultDescription"),
	};
}

export function getStaffFilterSummary(
	t: TFunction,
	{
		activeOnly,
		dateFrom,
		dateTo,
		entityById,
		entityIds,
		query,
	}: StaffFilterSummaryArgs,
) {
	const parts: string[] = [];

	if (query.trim()) {
		parts.push(query.trim());
	}

	if (entityIds.length > 0) {
		parts.push(
			entityIds
				.map(entityId => entityById.get(entityId)?.name ?? entityId)
				.join(", "),
		);
	}

	if (dateFrom || dateTo) {
		parts.push([dateFrom || "...", dateTo || "..."].join(" - "));
	}

	if (!activeOnly) {
		parts.push(t("identity.accountPage.filters.activeOnly.off"));
	}

	return parts.join(" | ");
}

export function getEmptyStaffEditorFormValues(): StaffEditorFormValues {
	return {
		cpf: "",
		name: "",
		email: "",
		entityId: "",
	};
}

export function buildStaffUpdateFormValues(
	staff: StaffResponse,
	linkedUser: Pick<UserResponse, "name">,
): StaffEditorFormValues {
	return {
		cpf: "",
		name: linkedUser.name,
		email: staff.account.email,
		entityId: staff.entityId,
	};
}

export function buildStaffDuplicateFormValues(
	staff: StaffResponse,
): StaffEditorFormValues {
	return {
		cpf: "",
		name: "",
		email: appendCopyToEmail(staff.account.email),
		entityId: staff.entityId,
	};
}

export function toStaffCreateRequest(
	values: StaffEditorFormValues,
	existingUser?: StaffCreateExistingUser | null,
): StaffCreateRequest {
	if (existingUser) {
		return toStaffCreateRequest({
			...values,
			cpf: existingUser.cpf,
			name: existingUser.name,
		});
	}

	return {
		cpfString: normalizeCpf(values.cpf.trim()),
		name: values.name.trim(),
		emailString: values.email.trim(),
		entityId: values.entityId,
	};
}

export function toStaffUpdateRequest(
	values: StaffEditorFormValues,
): StaffUpdateRequest {
	return {
		name: values.name.trim(),
		emailString: values.email.trim(),
		entityId: values.entityId,
	};
}

export function findStaffExistingUserByCpf(
	users: StaffCreateExistingUser[],
	cpfValue: string,
) {
	const normalizedCpf = normalizeCpf(cpfValue.trim());
	if (normalizedCpf.length === 0) {
		return null;
	}

	return users.find(user => user.cpf === normalizedCpf) ?? null;
}

export function appendCopyToEmail(email: string) {
	const separatorIndex = email.indexOf("@");

	if (separatorIndex === -1) {
		return `${email}Copy`;
	}

	return `${email.slice(0, separatorIndex)}Copy${email.slice(separatorIndex)}`;
}

export function getStaffActiveOptionClassName(value: string) {
	return getAccountOptionClassName("active", value);
}

export function getStaffListErrorToastContent(t: TFunction, error: unknown) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("partner.staffPage.feedback.listError.title"),
		fallbackDescription: t("partner.staffPage.feedback.listError.description"),
	});
}

export function getStaffDetailErrorToastContent(t: TFunction, error: unknown) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("partner.staffPage.feedback.detailError.title"),
		fallbackDescription: t(
			"partner.staffPage.feedback.detailError.description",
		),
	});
}

export function getLinkedStaffAccountErrorToastContent(
	t: TFunction,
	error: unknown,
) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("partner.staffPage.feedback.linkedAccountError.title"),
		fallbackDescription: t(
			"partner.staffPage.feedback.linkedAccountError.description",
		),
	});
}

export function getLinkedStaffUserErrorToastContent(
	t: TFunction,
	error: unknown,
) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("partner.staffPage.feedback.linkedUserError.title"),
		fallbackDescription: t(
			"partner.staffPage.feedback.linkedUserError.description",
		),
	});
}

export function getStaffEntitiesErrorToastContent(
	t: TFunction,
	error: unknown,
) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("partner.staffPage.feedback.entitiesError.title"),
		fallbackDescription: t(
			"partner.staffPage.feedback.entitiesError.description",
		),
	});
}

export function getStaffCitiesErrorToastContent(t: TFunction, error: unknown) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("partner.staffPage.feedback.citiesError.title"),
		fallbackDescription: t(
			"partner.staffPage.feedback.citiesError.description",
		),
	});
}

export function getStaffCreateErrorToastContent(t: TFunction, error: unknown) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("partner.staffPage.create.feedback.error.title"),
		fallbackDescription: t(
			"partner.staffPage.create.feedback.error.description",
		),
	});
}

export function getStaffUpdateErrorToastContent(t: TFunction, error: unknown) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("partner.staffPage.update.feedback.error.title"),
		fallbackDescription: t(
			"partner.staffPage.update.feedback.error.description",
		),
	});
}

export function getStaffDuplicateErrorToastContent(
	t: TFunction,
	error: unknown,
) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("partner.staffPage.duplicate.feedback.error.title"),
		fallbackDescription: t(
			"partner.staffPage.duplicate.feedback.error.description",
		),
	});
}

export function getStaffSetActiveErrorToastContent(
	t: TFunction,
	error: unknown,
	active: boolean,
) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t(
			active
				? "partner.staffPage.reactivate.feedback.error.title"
				: "partner.staffPage.deactivate.feedback.error.title",
		),
		fallbackDescription: t(
			active
				? "partner.staffPage.reactivate.feedback.error.description"
				: "partner.staffPage.deactivate.feedback.error.description",
		),
	});
}

export function getStaffDeleteErrorToastContent(t: TFunction, error: unknown) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("partner.staffPage.delete.feedback.error.title"),
		fallbackDescription: t(
			"partner.staffPage.delete.feedback.error.description",
		),
	});
}
