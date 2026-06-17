import type {
	ComponentPropsWithoutRef,
	HTMLAttributes,
	ReactNode,
} from "react";

export interface PageShellProps extends ComponentPropsWithoutRef<"main"> {
	width?: "default" | "wide";
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
