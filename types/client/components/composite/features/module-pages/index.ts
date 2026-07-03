/*
 * Copyright (c) 2026 Mateus Fernandes and Plataforma Universidade Gratuita.
 * All rights reserved.
 *
 * This source code is proprietary and confidential. Unauthorized use,
 * copying, modification, distribution, or deployment is prohibited.
 */
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
