import {
	Children,
	Fragment,
	isValidElement,
	type ReactElement,
	type ReactNode,
} from "react";

import { MIN_TABLE_SCROLLBAR_THUMB_SIZE } from "@/constants";
import type { DropdownMenuItemProps } from "@/types";
import type {
	ScrollOffsetFromThumbOffsetArgs,
	TableScrollbarMetricsArgs,
} from "@/types";
import type { TableScrollbarMetrics } from "@/types";
import { compareNormalizedText } from "@/utils";

function clamp(value: number, min: number, max: number) {
	return Math.min(Math.max(value, min), max);
}

export function getTableScrollbarMetrics({
	clientSize,
	scrollOffset,
	scrollSize,
	trackSize,
}: TableScrollbarMetricsArgs): TableScrollbarMetrics {
	const maxScrollOffset = Math.max(scrollSize - clientSize, 0);

	if (maxScrollOffset <= 0 || trackSize <= 0) {
		return {
			isScrollable: false,
			thumbOffsetPx: 0,
			thumbSizePx: trackSize,
		};
	}

	const thumbSizePx = clamp(
		(clientSize / scrollSize) * trackSize,
		MIN_TABLE_SCROLLBAR_THUMB_SIZE,
		trackSize,
	);
	const maxThumbOffset = Math.max(trackSize - thumbSizePx, 0);
	const thumbOffsetPx =
		maxScrollOffset === 0
			? 0
			: (scrollOffset / maxScrollOffset) * maxThumbOffset;

	return {
		isScrollable: true,
		thumbOffsetPx,
		thumbSizePx,
	};
}

export function getScrollOffsetFromThumbOffset({
	maxScrollOffset,
	maxThumbOffset,
	thumbOffsetPx,
}: ScrollOffsetFromThumbOffsetArgs) {
	if (maxScrollOffset <= 0 || maxThumbOffset <= 0) {
		return 0;
	}

	return (
		clamp(thumbOffsetPx, 0, maxThumbOffset) * (maxScrollOffset / maxThumbOffset)
	);
}

export function compareTableValues(a: unknown, b: unknown) {
	if (typeof a === "number" && typeof b === "number") {
		return a - b;
	}

	if (typeof a === "bigint" && typeof b === "bigint") {
		return a > b ? 1 : a < b ? -1 : 0;
	}

	if (a instanceof Date && b instanceof Date) {
		return a.getTime() - b.getTime();
	}

	if (typeof a === "boolean" && typeof b === "boolean") {
		return Number(a) - Number(b);
	}

	return compareNormalizedText(String(a ?? ""), String(b ?? ""));
}

export function getTableColumnStyle(size: number | undefined) {
	if (typeof size !== "number") {
		return undefined;
	}

	return {
		width: `${size}px`,
		minWidth: `${size}px`,
	};
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

export function getDirectActionProps(element: ReactElement) {
	const props = element.props as Partial<DropdownMenuItemProps>;

	if (!props.icon || !props.label) {
		return null;
	}

	return props as DropdownMenuItemProps;
}
