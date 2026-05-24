import type { ColumnDef } from "@tanstack/react-table";
import type { TFunction } from "i18next";
import { z } from "zod";

import { Badge } from "@/components";
import { ADMIN_CAMPI_VALUES } from "@/constants/identity";
import type {
	AdminCreateRequest,
	AdminResponse,
	AdminUpdateRequest,
	Campi,
	UserResponse,
} from "@/types/api";
import type {
	AdminFilterArgs,
	AdminEditorFormValues,
	AdminEditorMode,
} from "@/types/client/identity";
import { getApiErrorToastContent } from "@/utils/api-errors";
import { normalizeTextForSearch } from "@/utils/lang";

function normalizeCpf(value: string) {
	return value.replace(/\D+/g, "");
}

export function createAdminEditorFormSchema(
	t: TFunction,
	mode: AdminEditorMode,
) {
	const requiresIdentityFields = mode !== "update";

	return z.object({
		cpf: requiresIdentityFields
			? z
					.string()
					.trim()
					.min(1, t("identity.adminPage.update.validation.cpf.required"))
			: z.string(),
		name: z
			.string()
			.trim()
			.min(1, t("identity.adminPage.update.validation.name")),
		email: z
			.string()
			.trim()
			.min(1, t("identity.adminPage.update.validation.email.required"))
			.email(t("identity.adminPage.update.validation.email.invalid")),
		campus: z
			.string()
			.min(1, t("identity.adminPage.update.validation.campus"))
			.refine(
				(value): value is Campi =>
					ADMIN_CAMPI_VALUES.includes(
						value as (typeof ADMIN_CAMPI_VALUES)[number],
					),
				{
					message: t("identity.adminPage.update.validation.campus"),
				},
			),
		password: requiresIdentityFields
			? z
					.string()
					.trim()
					.min(1, t("identity.adminPage.update.validation.password.required"))
			: z.string(),
		active: z.boolean(),
	});
}

export function createAdminColumns(t: TFunction): ColumnDef<AdminResponse>[] {
	return [
		{
			accessorFn: row => row.accountActive,
			id: "active",
			size: 96,
			header: () => (
				<div className="flex w-full justify-center">
					{t("identity.adminPage.table.columns.active")}
				</div>
			),
			cell: ({ row }) => (
				<div className="flex w-full justify-center">
					<Badge
						className="min-h-5 px-2 py-0.5"
						tone={row.original.accountActive ? "success" : "danger"}
						variant="primary"
					>
						{row.original.accountActive
							? t("identity.adminPage.table.active.yes")
							: t("identity.adminPage.table.active.no")}
					</Badge>
				</div>
			),
		},
		{
			accessorKey: "userName",
			header: t("identity.adminPage.table.columns.name"),
		},
		{
			accessorKey: "accountEmail",
			header: t("identity.adminPage.table.columns.email"),
		},
		{
			accessorFn: row => row.campus.campus,
			id: "campus",
			header: t("identity.adminPage.table.columns.campus"),
			cell: ({ row }) => row.original.campus.campusFormatted,
		},
		{
			accessorKey: "grantedAt",
			header: t("identity.adminPage.table.columns.grantedAt"),
			cell: ({ row }) => row.original.grantedAtFormatted,
		},
	];
}

export function filterAdmins(
	admins: AdminResponse[],
	{ campusFilter, query }: AdminFilterArgs,
) {
	const normalizedQuery = normalizeTextForSearch(query.trim());
	const hasQuery = normalizedQuery.length > 0;
	const hasCampusFilter = campusFilter !== "";

	if (!hasQuery && !hasCampusFilter) {
		return admins;
	}

	return admins.filter(admin => {
		if (hasQuery) {
			const normalizedEmail = normalizeTextForSearch(admin.accountEmail);
			const normalizedUserName = normalizeTextForSearch(admin.userName);

			if (
				!normalizedEmail.includes(normalizedQuery) &&
				!normalizedUserName.includes(normalizedQuery)
			) {
				return false;
			}
		}

		if (hasCampusFilter && admin.campus.campus !== campusFilter) {
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
		password: "",
		campus: "JARAGUA_DO_SUL",
		active: true,
	};
}

export function buildAdminUpdateFormValues(
	admin: AdminResponse,
): AdminEditorFormValues {
	return {
		cpf: "",
		name: admin.userName,
		email: admin.accountEmail,
		password: "",
		campus: admin.campus.campus,
		active: admin.accountActive,
	};
}

export function buildAdminDuplicateFormValues(
	admin: AdminResponse,
	user: UserResponse | null,
): AdminEditorFormValues {
	return {
		cpf: user?.cpf ?? "",
		name: admin.userName,
		email: admin.accountEmail,
		password: "",
		campus: admin.campus.campus,
		active: admin.accountActive,
	};
}

export function toAdminUpdateRequest(
	values: AdminEditorFormValues,
): AdminUpdateRequest {
	const password = values.password.trim();

	return {
		name: values.name.trim(),
		email: values.email.trim(),
		password: password.length > 0 ? password : null,
		campus: values.campus,
		active: values.active,
	};
}

export function toAdminCreateRequest(
	values: AdminEditorFormValues,
): AdminCreateRequest {
	return {
		cpf: normalizeCpf(values.cpf.trim()),
		name: values.name.trim(),
		email: values.email.trim(),
		password: values.password.trim(),
		campus: values.campus,
	};
}

export function getAdminFilterSummary(
	t: TFunction,
	{ campusFilter, query }: AdminFilterArgs,
) {
	const parts: string[] = [];

	if (query.trim()) {
		parts.push(query.trim());
	}

	if (campusFilter) {
		parts.push(t(`identity.adminPage.filters.campus.options.${campusFilter}`));
	}

	return parts.join(" | ");
}
