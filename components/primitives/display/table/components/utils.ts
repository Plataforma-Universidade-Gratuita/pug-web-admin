import {
	Children,
	Fragment,
	isValidElement,
	type ReactElement,
	type ReactNode,
} from "react";

import type { DropdownMenuItemProps } from "@/types/client";

export function getDirectActionProps(element: ReactElement) {
	const props = element.props as Partial<DropdownMenuItemProps>;

	if (!props.icon || !props.label) {
		return null;
	}

	return props as DropdownMenuItemProps;
}

export function flattenActionNodes(children: ReactNode): ReactElement[] {
	return Children.toArray(children).flatMap(child => {
		if (!isValidElement(child)) {
			return [];
		}

		if (child.type === Fragment) {
			return flattenActionNodes(
				(child as ReactElement<{ children?: ReactNode }>).props.children,
			);
		}

		return [child];
	});
}
