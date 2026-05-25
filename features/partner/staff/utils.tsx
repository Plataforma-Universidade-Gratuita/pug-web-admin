import type { ColumnDef } from "@tanstack/react-table";
import type { TFunction } from "i18next";

import { Badge } from "@/components";
import { getAccountOptionClassName } from "@/features/identity/account/utils";
import type {
	CityResponse,
	EntityResponse,
	StaffCreateRequest,
	StaffResponse,
	StaffUpdateRequest,
} from "@/types/api";
import type {
	StaffFilterArgs,
	StaffFilterSummaryArgs,
	StaffEditorFormValues,
	StaffEditorMode,
} from "@/types/client/partner";
import { getApiErrorToastContent } from "@/utils/api-errors";
import { normalizeTextForSearch } from "@/utils/lang";

export { createStaffEditorFormSchema } from "@/schemas/client/features/partner/staff";

function normalizeCpf(value: string) {
	return value.replace(/\D+/g, "");
}

export function buildStaffEntityOptions(entities: EntityResponse[]) {
	return entities.map(entity => ({
		value: entity.id,
		label: entity.name,
		description: entity.cnpjFormatted,
	}));
}

export function buildStaffCityOptions(cities: CityResponse[]) {
	return cities.map(city => ({
		value: city.id,
		label: city.name,
		description: city.ibgeCode,
	}));
}

export function resolveStaffCityLabel(
	cityById: Map<string, CityResponse>,
	cityId: string,
) {
	return cityById.get(cityId)?.name ?? cityId;
}

export function createStaffColumns(t: TFunction): ColumnDef<StaffResponse>[] {
	return [
		{
			accessorFn: row => row.accountActive,
			id: "active",
			size: 96,
			header: () => (
				<div className="flex w-full justify-center">
					{t("partner.staffPage.table.columns.active")}
				</div>
			),
			cell: ({ row }) => {
				const isActive = row.original.accountActive;

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
			accessorKey: "userName",
			header: t("partner.staffPage.table.columns.name"),
		},
		{
			accessorKey: "accountEmail",
			header: t("partner.staffPage.table.columns.email"),
		},
		{
			accessorKey: "entityName",
			header: t("partner.staffPage.table.columns.entity"),
		},
	];
}

export function filterStaff(
	staff: StaffResponse[],
	{ activeFilter, cityIdFilter, entityIdFilter, query }: StaffFilterArgs,
) {
	const normalizedQuery = normalizeTextForSearch(query.trim());
	const hasQuery = normalizedQuery.length > 0;
	const hasActiveFilter = activeFilter !== "";
	const hasEntityFilter = entityIdFilter !== "";
	const hasCityFilter = cityIdFilter !== "";

	if (!hasQuery && !hasActiveFilter && !hasEntityFilter && !hasCityFilter) {
		return staff;
	}

	return staff.filter(item => {
		if (hasQuery) {
			const normalizedEmail = normalizeTextForSearch(item.accountEmail);
			const normalizedName = normalizeTextForSearch(item.userName);
			const normalizedEntity = normalizeTextForSearch(item.entityName);

			if (
				!normalizedEmail.includes(normalizedQuery) &&
				!normalizedName.includes(normalizedQuery) &&
				!normalizedEntity.includes(normalizedQuery)
			) {
				return false;
			}
		}

		if (hasActiveFilter) {
			if (String(item.accountActive) !== activeFilter) {
				return false;
			}
		}

		if (hasEntityFilter && item.entityId !== entityIdFilter) {
			return false;
		}

		if (hasCityFilter && item.cityId !== cityIdFilter) {
			return false;
		}

		return true;
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
		activeFilter,
		cityById,
		cityIdFilter,
		entityById,
		entityIdFilter,
		query,
	}: StaffFilterSummaryArgs,
) {
	const parts: string[] = [];

	if (query.trim()) {
		parts.push(query.trim());
	}

	if (activeFilter) {
		parts.push(
			t(
				activeFilter === "true"
					? "partner.staffPage.filters.active.options.active"
					: "partner.staffPage.filters.active.options.inactive",
			),
		);
	}

	if (entityIdFilter) {
		parts.push(entityById.get(entityIdFilter)?.name ?? entityIdFilter);
	}

	if (cityIdFilter) {
		parts.push(resolveStaffCityLabel(cityById, cityIdFilter));
	}

	return parts.join(" | ");
}

export function getEmptyStaffEditorFormValues(): StaffEditorFormValues {
	return {
		cpf: "",
		name: "",
		email: "",
		password: "",
		entityId: "",
	};
}

export function buildStaffUpdateFormValues(
	staff: StaffResponse,
): StaffEditorFormValues {
	return {
		cpf: "",
		name: staff.userName,
		email: staff.accountEmail,
		password: "",
		entityId: staff.entityId,
	};
}

export function buildStaffDuplicateFormValues(
	staff: StaffResponse,
): StaffEditorFormValues {
	return {
		cpf: "",
		name: staff.userName,
		email: staff.accountEmail,
		password: "",
		entityId: staff.entityId,
	};
}

export function toStaffCreateRequest(
	values: StaffEditorFormValues,
): StaffCreateRequest {
	return {
		cpf: normalizeCpf(values.cpf.trim()),
		name: values.name.trim(),
		email: values.email.trim(),
		password: values.password.trim(),
		entityId: values.entityId,
	};
}

export function toStaffUpdateRequest(
	values: StaffEditorFormValues,
): StaffUpdateRequest {
	const password = values.password.trim();

	return {
		name: values.name.trim(),
		email: values.email.trim(),
		password: password.length > 0 ? password : null,
	};
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
