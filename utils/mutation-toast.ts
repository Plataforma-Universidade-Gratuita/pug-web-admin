import type { UseMutationOptions } from "@tanstack/react-query";

import { toast } from "@/components";
import type {
	MutationToastOptions,
	ResolvedToastValue,
} from "@/types/client";
import { getApiErrorToastContent } from "@/utils/api-errors";

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
			resolveToastValue(
				options.success.title,
				data,
				variables,
				onMutateResult,
			),
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
