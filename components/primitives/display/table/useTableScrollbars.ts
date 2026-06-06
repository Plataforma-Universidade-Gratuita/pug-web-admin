"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
	getScrollOffsetFromThumbOffset,
	getTableScrollbarMetrics,
} from "./utils";

export function useTableScrollbars({
	columns,
	data,
	hasTabularContent,
	isLoading,
}: {
	columns: unknown[];
	data: unknown[];
	hasTabularContent: boolean;
	isLoading: boolean;
}) {
	const [horizontalScrollbarMetrics, setHorizontalScrollbarMetrics] = useState(
		() => ({
			isScrollable: false,
			thumbOffsetPx: 0,
			thumbSizePx: 0,
		}),
	);
	const [verticalScrollbarMetrics, setVerticalScrollbarMetrics] = useState(
		() => ({
			isScrollable: false,
			thumbOffsetPx: 0,
			thumbSizePx: 0,
		}),
	);
	const scrollContainerRef = useRef<HTMLDivElement | null>(null);
	const horizontalScrollbarTrackRef = useRef<HTMLDivElement | null>(null);
	const verticalScrollbarTrackRef = useRef<HTMLDivElement | null>(null);
	const horizontalDragStateRef = useRef<{
		pointerId: number;
		startScrollOffset: number;
		startPointerOffset: number;
	} | null>(null);
	const verticalDragStateRef = useRef<{
		pointerId: number;
		startScrollOffset: number;
		startPointerOffset: number;
	} | null>(null);

	const syncScrollbar = useCallback(() => {
		const scrollContainer = scrollContainerRef.current;
		const horizontalScrollbarTrack = horizontalScrollbarTrackRef.current;
		const verticalScrollbarTrack = verticalScrollbarTrackRef.current;

		if (!scrollContainer) {
			return;
		}

		setHorizontalScrollbarMetrics(
			getTableScrollbarMetrics({
				clientSize: scrollContainer.clientWidth,
				scrollOffset: scrollContainer.scrollLeft,
				scrollSize: scrollContainer.scrollWidth,
				trackSize:
					horizontalScrollbarTrack?.offsetWidth ?? scrollContainer.clientWidth,
			}),
		);
		setVerticalScrollbarMetrics(
			getTableScrollbarMetrics({
				clientSize: scrollContainer.clientHeight,
				scrollOffset: scrollContainer.scrollTop,
				scrollSize: scrollContainer.scrollHeight,
				trackSize:
					verticalScrollbarTrack?.offsetHeight ?? scrollContainer.clientHeight,
			}),
		);
	}, []);

	useEffect(() => {
		syncScrollbar();

		const scrollContainer = scrollContainerRef.current;
		const horizontalScrollbarTrack = horizontalScrollbarTrackRef.current;
		const verticalScrollbarTrack = verticalScrollbarTrackRef.current;

		if (!scrollContainer) {
			return;
		}

		const resizeObserver = new ResizeObserver(() => {
			syncScrollbar();
		});

		resizeObserver.observe(scrollContainer);
		if (horizontalScrollbarTrack) {
			resizeObserver.observe(horizontalScrollbarTrack);
		}
		if (verticalScrollbarTrack) {
			resizeObserver.observe(verticalScrollbarTrack);
		}

		const tableElement = scrollContainer.querySelector("table");
		if (tableElement instanceof HTMLElement) {
			resizeObserver.observe(tableElement);
		}

		scrollContainer.addEventListener("scroll", syncScrollbar, {
			passive: true,
		});
		window.addEventListener("resize", syncScrollbar);

		return () => {
			resizeObserver.disconnect();
			scrollContainer.removeEventListener("scroll", syncScrollbar);
			window.removeEventListener("resize", syncScrollbar);
		};
	}, [syncScrollbar, columns, data, hasTabularContent, isLoading]);

	function handleHorizontalTrackPointerDown(
		event: React.PointerEvent<HTMLDivElement>,
	) {
		if (
			!horizontalScrollbarMetrics.isScrollable ||
			event.target !== event.currentTarget
		) {
			return;
		}

		const scrollContainer = scrollContainerRef.current;
		const scrollbarTrack = horizontalScrollbarTrackRef.current;

		if (!scrollContainer || !scrollbarTrack) {
			return;
		}

		const trackBounds = scrollbarTrack.getBoundingClientRect();
		const nextThumbOffset =
			event.clientX -
			trackBounds.left -
			horizontalScrollbarMetrics.thumbSizePx / 2;
		const maxScrollOffset = Math.max(
			scrollContainer.scrollWidth - scrollContainer.clientWidth,
			0,
		);
		const maxThumbOffset = Math.max(
			scrollbarTrack.offsetWidth - horizontalScrollbarMetrics.thumbSizePx,
			0,
		);

		scrollContainer.scrollLeft = getScrollOffsetFromThumbOffset({
			maxScrollOffset,
			maxThumbOffset,
			thumbOffsetPx: nextThumbOffset,
		});
	}

	function handleVerticalTrackPointerDown(
		event: React.PointerEvent<HTMLDivElement>,
	) {
		if (
			!verticalScrollbarMetrics.isScrollable ||
			event.target !== event.currentTarget
		) {
			return;
		}

		const scrollContainer = scrollContainerRef.current;
		const scrollbarTrack = verticalScrollbarTrackRef.current;

		if (!scrollContainer || !scrollbarTrack) {
			return;
		}

		const trackBounds = scrollbarTrack.getBoundingClientRect();
		const nextThumbOffset =
			event.clientY -
			trackBounds.top -
			verticalScrollbarMetrics.thumbSizePx / 2;
		const maxScrollOffset = Math.max(
			scrollContainer.scrollHeight - scrollContainer.clientHeight,
			0,
		);
		const maxThumbOffset = Math.max(
			scrollbarTrack.offsetHeight - verticalScrollbarMetrics.thumbSizePx,
			0,
		);

		scrollContainer.scrollTop = getScrollOffsetFromThumbOffset({
			maxScrollOffset,
			maxThumbOffset,
			thumbOffsetPx: nextThumbOffset,
		});
	}

	function handleHorizontalThumbPointerDown(
		event: React.PointerEvent<HTMLButtonElement>,
	) {
		if (!horizontalScrollbarMetrics.isScrollable) {
			return;
		}

		const scrollContainer = scrollContainerRef.current;

		if (!scrollContainer) {
			return;
		}

		horizontalDragStateRef.current = {
			pointerId: event.pointerId,
			startScrollOffset: scrollContainer.scrollLeft,
			startPointerOffset: event.clientX,
		};

		event.currentTarget.setPointerCapture(event.pointerId);
		event.preventDefault();
	}

	function handleVerticalThumbPointerDown(
		event: React.PointerEvent<HTMLButtonElement>,
	) {
		if (!verticalScrollbarMetrics.isScrollable) {
			return;
		}

		const scrollContainer = scrollContainerRef.current;

		if (!scrollContainer) {
			return;
		}

		verticalDragStateRef.current = {
			pointerId: event.pointerId,
			startScrollOffset: scrollContainer.scrollTop,
			startPointerOffset: event.clientY,
		};

		event.currentTarget.setPointerCapture(event.pointerId);
		event.preventDefault();
	}

	function handleHorizontalThumbPointerMove(
		event: React.PointerEvent<HTMLButtonElement>,
	) {
		const dragState = horizontalDragStateRef.current;
		const scrollContainer = scrollContainerRef.current;
		const scrollbarTrack = horizontalScrollbarTrackRef.current;

		if (
			!dragState ||
			dragState.pointerId !== event.pointerId ||
			!scrollContainer ||
			!scrollbarTrack
		) {
			return;
		}

		const maxScrollOffset = Math.max(
			scrollContainer.scrollWidth - scrollContainer.clientWidth,
			0,
		);
		const maxThumbOffset = Math.max(
			scrollbarTrack.offsetWidth - horizontalScrollbarMetrics.thumbSizePx,
			0,
		);
		const deltaX = event.clientX - dragState.startPointerOffset;
		const startThumbOffset =
			maxScrollOffset === 0
				? 0
				: (dragState.startScrollOffset / maxScrollOffset) * maxThumbOffset;

		scrollContainer.scrollLeft = getScrollOffsetFromThumbOffset({
			maxScrollOffset,
			maxThumbOffset,
			thumbOffsetPx: startThumbOffset + deltaX,
		});
	}

	function handleVerticalThumbPointerMove(
		event: React.PointerEvent<HTMLButtonElement>,
	) {
		const dragState = verticalDragStateRef.current;
		const scrollContainer = scrollContainerRef.current;
		const scrollbarTrack = verticalScrollbarTrackRef.current;

		if (
			!dragState ||
			dragState.pointerId !== event.pointerId ||
			!scrollContainer ||
			!scrollbarTrack
		) {
			return;
		}

		const maxScrollOffset = Math.max(
			scrollContainer.scrollHeight - scrollContainer.clientHeight,
			0,
		);
		const maxThumbOffset = Math.max(
			scrollbarTrack.offsetHeight - verticalScrollbarMetrics.thumbSizePx,
			0,
		);
		const deltaY = event.clientY - dragState.startPointerOffset;
		const startThumbOffset =
			maxScrollOffset === 0
				? 0
				: (dragState.startScrollOffset / maxScrollOffset) * maxThumbOffset;

		scrollContainer.scrollTop = getScrollOffsetFromThumbOffset({
			maxScrollOffset,
			maxThumbOffset,
			thumbOffsetPx: startThumbOffset + deltaY,
		});
	}

	function clearHorizontalThumbDrag() {
		horizontalDragStateRef.current = null;
	}

	function clearVerticalThumbDrag() {
		verticalDragStateRef.current = null;
	}

	return {
		scrollContainerRef,
		horizontalScrollbarTrackRef,
		verticalScrollbarTrackRef,
		horizontalScrollbarMetrics,
		verticalScrollbarMetrics,
		handleHorizontalTrackPointerDown,
		handleVerticalTrackPointerDown,
		handleHorizontalThumbPointerDown,
		handleVerticalThumbPointerDown,
		handleHorizontalThumbPointerMove,
		handleVerticalThumbPointerMove,
		clearHorizontalThumbDrag,
		clearVerticalThumbDrag,
	};
}
