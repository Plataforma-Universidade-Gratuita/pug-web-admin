import { z } from "zod";
import { JSON_HEADERS } from "@/constants";

export { qs } from "@/api/utils";

export class WebApiError extends Error {
	public readonly status: number;
	public readonly code: string | undefined;

	constructor(status: number, message: string, code?: string) {
		super(message);
		this.name = "WebApiError";
		this.status = status;
		this.code = code;
	}
}

async function parseWebApiError(response: Response): Promise<never> {
	let message = `HTTP ${response.status}`;
	let code: string | undefined;

	try {
		const json = await response.json();
		if (typeof json?.message === "string") message = json.message;
		if (typeof json?.code === "string") code = json.code;
	} catch {
		// Fall back to the status text when no JSON error body is available.
	}

	throw new WebApiError(response.status, message, code);
}

function webRequest(path: string, init?: RequestInit): Promise<Response> {
	return fetch(path, {
		...init,
		cache: "no-store",
		credentials: "include",
		headers: { ...JSON_HEADERS, ...init?.headers },
	});
}

export async function webFetch<T extends z.ZodTypeAny>(
	path: string,
	schema: T,
	init?: RequestInit,
): Promise<z.infer<T>> {
	const response = await webRequest(path, init);
	if (!response.ok) return parseWebApiError(response);

	const json = await response.json();
	return schema.parse(json) as z.infer<T>;
}

export async function webVoid(path: string, init?: RequestInit): Promise<void> {
	const response = await webRequest(path, init);
	if (!response.ok) return parseWebApiError(response);
}

import type { UseMutationOptions } from "@tanstack/react-query";

import { toast } from "@/components";
import type { MutationToastOptions, ResolvedToastValue } from "@/types";
import { getApiErrorToastContent } from "@/utils/http/api-errors";

function resolveToastValue<TArgs extends unknown[]>(
    value: ResolvedToastValue<TArgs> | undefined,
    ...args: TArgs
) {
    if (typeof value === "function") {
        return value(...args);
    }

    return value;
}

export function createToastMutationOptions<
    TData = unknown,
    TError = Error,
    TVariables = void,
    TOnMutateResult = unknown,
>(
    options: MutationToastOptions<TData, TError, TVariables, TOnMutateResult>,
): Pick<
    UseMutationOptions<TData, TError, TVariables, TOnMutateResult>,
    "onError" | "onSuccess"
> {
    const onSuccess: NonNullable<
        UseMutationOptions<TData, TError, TVariables, TOnMutateResult>["onSuccess"]
    > = (data, variables, onMutateResult) => {
        if (!options.success) return;

        toast.success(
            resolveToastValue(options.success.title, data, variables, onMutateResult),
            {
                description: resolveToastValue(
                    options.success.description,
                    data,
                    variables,
                    onMutateResult,
                ),
            },
        );
    };

    const onError: NonNullable<
        UseMutationOptions<TData, TError, TVariables, TOnMutateResult>["onError"]
    > = (error, variables, onMutateResult) => {
        if (!options.error) return;

        const fallbackTitle =
            resolveToastValue(
                options.error.title,
                error,
                variables,
                onMutateResult,
            ) ?? options.error.fallbackTitle;
        const fallbackDescription =
            resolveToastValue(
                options.error.description,
                error,
                variables,
                onMutateResult,
            ) ?? options.error.fallbackDescription;

        const toastContent = getApiErrorToastContent(error, {
            fallbackTitle,
            fallbackDescription,
        });

        toast.danger(toastContent.title, {
            description: toastContent.description,
        });
    };

    return {
        onError,
        onSuccess,
    };
}