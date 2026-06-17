import type { ReactNode } from "react";

export interface ModulePageChildPath {
	description?: ReactNode;
	href: string;
	label: ReactNode;
}

export interface ModulePageShellProps {
	children: ReactNode;
	description?: ReactNode;
	title: ReactNode;
}

export interface ModulePageComingSoonProps {
	className?: string;
	description?: ReactNode;
	moduleName?: string;
	paths?: ModulePageChildPath[];
	title?: ReactNode;
}
