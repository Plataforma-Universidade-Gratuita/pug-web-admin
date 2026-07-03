/*
 * Copyright (c) 2026 Mateus Fernandes and Plataforma Universidade Gratuita.
 * All rights reserved.
 *
 * This source code is proprietary and confidential. Unauthorized use,
 * copying, modification, distribution, or deployment is prohibited.
 */
import type { ReactNode } from "react";

import type { FieldValues, UseFormReturn } from "react-hook-form";

export interface CpfFormFieldExistingUser {
	cpf: string;
	cpfFormatted: string;
	name: string;
}

export interface CpfFormFieldProps<
	TValues extends FieldValues & {
		cpf: string;
		name: string;
	},
> {
	form: UseFormReturn<TValues>;
	existingUsers: CpfFormFieldExistingUser[];
	id?: string;
	label: ReactNode;
	tooltipContent?: ReactNode;
	placeholder?: ReactNode;
	searchPlaceholder?: string;
	emptyMessage?: ReactNode;
	createOptionLabel?: (value: string) => ReactNode;
	onExistingUserChange?: (user: CpfFormFieldExistingUser | null) => void;
}
