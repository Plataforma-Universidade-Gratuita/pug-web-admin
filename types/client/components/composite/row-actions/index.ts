/*
 * Copyright (c) 2026 Mateus Fernandes and Plataforma Universidade Gratuita.
 * All rights reserved.
 *
 * This source code is proprietary and confidential. Unauthorized use,
 * copying, modification, distribution, or deployment is prohibited.
 */
import type { ReactNode } from "react";

export interface RowActionNavigateProps {
	href: string;
	label?: ReactNode;
}

export interface RowActionClickProps {
	onClick: () => void;
	label?: ReactNode;
}
