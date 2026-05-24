import type { ReactNode } from "react";

export type ResolvedToastValue<TArgs extends unknown[]> =
	| ReactNode
	| ((...args: TArgs) => ReactNode);

export interface ApiErrorToastContent {
	title: ReactNode;
	description?: ReactNode;
}

export interface QueryErrorToastContent {
	title: ReactNode;
	description?: ReactNode;
}

export interface QueryErrorToastProps {
	error: unknown;
	errorUpdatedAt: number;
	getContent: (error: unknown) => QueryErrorToastContent;
	isError: boolean;
}

export interface QueryErrorToastDescriptor extends QueryErrorToastProps {
	key: string;
}

export interface DeferredUndoActionOptions {
	description: string;
	duration?: number;
	key: string;
	onCommit: () => void;
	title: string;
	undoLabel: string;
}

export interface ApiErrorToastOptions {
	fallbackTitle: ReactNode;
	fallbackDescription?: ReactNode;
}

export interface MutationSuccessToastOptions<
	TData,
	TVariables,
	TOnMutateResult,
> {
	title: ResolvedToastValue<[TData, TVariables, TOnMutateResult | undefined]>;
	description?: ResolvedToastValue<
		[TData, TVariables, TOnMutateResult | undefined]
	>;
}

export interface MutationErrorToastOptions<
	TError,
	TVariables,
	TOnMutateResult,
> {
	fallbackTitle: ReactNode;
	fallbackDescription?: ReactNode;
	title?: ResolvedToastValue<
		[TError, TVariables | undefined, TOnMutateResult | undefined]
	>;
	description?: ResolvedToastValue<
		[TError, TVariables | undefined, TOnMutateResult | undefined]
	>;
}

export interface MutationToastOptions<
	TData,
	TError,
	TVariables,
	TOnMutateResult,
> {
	success?: MutationSuccessToastOptions<TData, TVariables, TOnMutateResult>;
	error?: MutationErrorToastOptions<TError, TVariables, TOnMutateResult>;
}
