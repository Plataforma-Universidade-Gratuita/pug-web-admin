/*
 * Copyright (c) 2026 Mateus Fernandes and Plataforma Universidade Gratuita.
 * All rights reserved.
 *
 * This source code is proprietary and confidential. Unauthorized use,
 * copying, modification, distribution, or deployment is prohibited.
 */
import type { ReactNode } from "react";

export interface EntityPageField {
	id: string;
	label: ReactNode;
	value: ReactNode;
}

export interface EntityPageFieldsGridProps {
	fields: EntityPageField[];
	className?: string;
	columns?: 2 | 3;
}

export interface EntityPageFieldsGridSkeletonProps {
	count?: number;
	className?: string;
	columns?: 2 | 3;
}
