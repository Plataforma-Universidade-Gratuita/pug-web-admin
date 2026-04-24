import type { HTMLAttributes, ReactNode } from "react";

export interface LoadingContextValue {
	isLoading: boolean;
	loadingLabel?: string | undefined;
}

export interface LoadingProviderProps {
	children: ReactNode;
	value: LoadingContextValue;
}

export interface HeaderProps extends HTMLAttributes<HTMLDivElement> {
	children?: ReactNode;
	isLoading?: boolean;
}

export interface ContentProps extends HTMLAttributes<HTMLDivElement> {
	children?: ReactNode;
	isLoading?: boolean;
}

export interface FooterProps extends HTMLAttributes<HTMLDivElement> {
	children?: ReactNode;
	isLoading?: boolean;
}
