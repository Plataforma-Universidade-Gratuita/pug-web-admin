import type {
	AnchorHTMLAttributes,
	HTMLAttributes,
	LiHTMLAttributes,
	OlHTMLAttributes,
	ReactNode,
} from "react";

export interface BreadcrumbProps extends HTMLAttributes<HTMLElement> {
	children: ReactNode;
}

export interface BreadcrumbListProps extends OlHTMLAttributes<HTMLOListElement> {
	children: ReactNode;
}

export interface BreadcrumbItemProps extends LiHTMLAttributes<HTMLLIElement> {
	children: ReactNode;
}

export interface BreadcrumbLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
	children: ReactNode;
}

export interface BreadcrumbCurrentProps extends HTMLAttributes<HTMLSpanElement> {
	children: ReactNode;
}

export interface BreadcrumbSeparatorProps extends HTMLAttributes<HTMLSpanElement> {
	children?: ReactNode;
}
