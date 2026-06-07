import type { TFunction } from "i18next";

import type {
	AccountType,
	AccountTypeResponse,
	CityResponse,
	ProjectStatus,
} from "@/types/api";
import type { BadgeTone } from "@/types/client";
import { getApiErrorToastContent } from "@/utils";

function getAccountTypeValue(accountType: AccountType | AccountTypeResponse) {
	return typeof accountType === "string"
		? accountType
		: accountType.accountType;
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

export function resolveEntityCityLabel(
	cityById: Map<string, CityResponse>,
	cityId: string,
) {
	return cityById.get(cityId)?.name ?? cityId;
}

export function getEntityDetailErrorToastContent(t: TFunction, error: unknown) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("partner.entityPage.feedback.detailError.title"),
		fallbackDescription: t(
			"partner.entityPage.feedback.detailError.description",
		),
	});
}

export function getEntityCitiesErrorToastContent(t: TFunction, error: unknown) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("partner.entityPage.feedback.citiesError.title"),
		fallbackDescription: t(
			"partner.entityPage.feedback.citiesError.description",
		),
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

export function getProjectStatusLabel(t: TFunction, status: ProjectStatus) {
	return t(`project.projectPage.status.options.${status}`);
}

export function getProjectStatusTone(status: ProjectStatus): BadgeTone {
	switch (status) {
		case "CANCELED":
			return "danger";
		case "COMPLETED":
			return "success";
		case "IN_PROGRESS":
			return "info";
		case "ON_HOLD":
			return "warning";
		case "PLANNED":
		default:
			return "brand";
	}
}
