import { Children, isValidElement, type ReactNode } from "react";

import { trim } from "zod";

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
		.replace(/\s+/g, " ");
	trim();

	return text || undefined;
}
