"use client";

/*
 * Copyright (c) 2026 Mateus Fernandes and Plataforma Universidade Gratuita.
 * All rights reserved.
 *
 * This source code is proprietary and confidential. Unauthorized use,
 * copying, modification, distribution, or deployment is prohibited.
 */
import { forwardRef } from "react";

import clsx from "clsx";

import type { TextAreaProps } from "@/types/client";

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
	function TextArea({ className, ...props }, ref) {
		return (
			<textarea
				ref={ref}
				className={clsx("text-area-root", className)}
				{...props}
			/>
		);
	},
);
