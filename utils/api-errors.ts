import { ApiError } from "@/api/utils";
import { WebApiError } from "@/api/web";
import type {
	ApiErrorToastContent,
	ApiErrorToastOptions,
} from "@/types/client";
import {normalizePathSegments} from "@/utils/utils";

function isMeaningfulMessage(message: string | undefined): message is string {
	if (!message) return false;
	return !/^HTTP\s\d{3}$/.test(message);
}

export function getApiErrorMessage(error: unknown): string | undefined {
	if (error instanceof ApiError || error instanceof WebApiError) {
		return isMeaningfulMessage(error.message) ? error.message : undefined;
	}

	if (error instanceof Error) {
		return isMeaningfulMessage(error.message) ? error.message : undefined;
	}

	return undefined;
}

export function getApiErrorToastContent(
	error: unknown,
	options: ApiErrorToastOptions,
): ApiErrorToastContent {
	const description = getApiErrorMessage(error) ?? options.fallbackDescription;

	return {
		title: options.fallbackTitle,
		description,
	};
}

export function getApiErrorFieldErrors(error: unknown) {
	if (error instanceof ApiError) {
		return error.fieldErrors;
	}

	if (error instanceof WebApiError) {
		return error.fieldErrors;
	}

	return {};
}

export function hasNestedFieldValue(value: unknown, path: string): boolean {
    if (!path) {
        return false;
    }

    const segments = normalizePathSegments(path);
    let current: unknown = value;

    for (const segment of segments) {
        if (Array.isArray(current)) {
            const index = Number(segment);
            if (!Number.isInteger(index) || index < 0 || index >= current.length) {
                return false;
            }
            current = current[index];
            continue;
        }

        if (current == null || typeof current !== "object") {
            return false;
        }

        if (!(segment in current)) {
            return false;
        }

        current = (current as Record<string, unknown>)[segment];
    }

    return true;
}
