/*
 * Copyright (c) 2026 Mateus Fernandes and Plataforma Universidade Gratuita.
 * All rights reserved.
 *
 * This source code is proprietary and confidential. Unauthorized use,
 * copying, modification, distribution, or deployment is prohibited.
 */
import { Children, isValidElement, type ReactNode } from "react";

export function getAccessibleText(node: ReactNode): string | undefined {
	const text = Children.toArray(node)
		.map(child => {
			if (typeof child === "string" || typeof child === "number") {
				return String(child);
			}

			if (isValidElement<{ children?: ReactNode }>(child)) {
				return getAccessibleText(child.props.children);
			}

			return "";
		})
		.join(" ")
		.replace(/\s+/g, " ")
		.trim();

	return text || undefined;
}
