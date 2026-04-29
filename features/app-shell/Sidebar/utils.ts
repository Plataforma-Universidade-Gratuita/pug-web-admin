import type { CSSProperties } from "react";

import {
	SIDEBAR_ROW_BASE_PADDING_REM,
	SIDEBAR_ROW_NEST_STEP_REM,
} from "@/constants/app-shell";
import type { MenuLeafItem, MenuNode } from "@/types/client";

export function isLeafItem(item: MenuNode): item is MenuLeafItem {
	return "href" in item;
}

export function isNodeActive(pathname: string, item: MenuNode): boolean {
	if (isLeafItem(item)) {
		if (item.exact) {
			return pathname === item.href;
		}

		return pathname === item.href || pathname.startsWith(item.href + "/");
	}

	return item.childrenItems.some(child => isNodeActive(pathname, child));
}

export function getSidebarRowStyle(
	depth: number,
	collapsed: boolean,
): CSSProperties | undefined {
	if (depth <= 0 || collapsed) {
		return undefined;
	}

	return {
		paddingLeft: `${SIDEBAR_ROW_BASE_PADDING_REM + depth * SIDEBAR_ROW_NEST_STEP_REM}rem`,
	};
}
