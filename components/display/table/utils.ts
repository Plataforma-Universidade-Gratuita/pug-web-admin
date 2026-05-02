const MIN_TABLE_SCROLLBAR_THUMB_SIZE = 32;

export interface TableScrollbarMetrics {
	isScrollable: boolean;
	thumbOffsetPx: number;
	thumbWidthPx: number;
}

function clamp(value: number, min: number, max: number) {
	return Math.min(Math.max(value, min), max);
}

export function getTableScrollbarMetrics({
	clientWidth,
	scrollLeft,
	scrollWidth,
	trackWidth,
}: {
	clientWidth: number;
	scrollLeft: number;
	scrollWidth: number;
	trackWidth: number;
}): TableScrollbarMetrics {
	const maxScrollLeft = Math.max(scrollWidth - clientWidth, 0);

	if (maxScrollLeft <= 0 || trackWidth <= 0) {
		return {
			isScrollable: false,
			thumbOffsetPx: 0,
			thumbWidthPx: trackWidth,
		};
	}

	const thumbWidthPx = clamp(
		(clientWidth / scrollWidth) * trackWidth,
		MIN_TABLE_SCROLLBAR_THUMB_SIZE,
		trackWidth,
	);
	const maxThumbOffset = Math.max(trackWidth - thumbWidthPx, 0);
	const thumbOffsetPx =
		maxScrollLeft === 0 ? 0 : (scrollLeft / maxScrollLeft) * maxThumbOffset;

	return {
		isScrollable: true,
		thumbOffsetPx,
		thumbWidthPx,
	};
}

export function getScrollLeftFromThumbOffset({
	maxScrollLeft,
	maxThumbOffset,
	thumbOffsetPx,
}: {
	maxScrollLeft: number;
	maxThumbOffset: number;
	thumbOffsetPx: number;
}) {
	if (maxScrollLeft <= 0 || maxThumbOffset <= 0) {
		return 0;
	}

	return (
		clamp(thumbOffsetPx, 0, maxThumbOffset) * (maxScrollLeft / maxThumbOffset)
	);
}
