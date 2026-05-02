"use client";

import {
	useCallback,
	useEffect,
	useRef,
	useState,
	type CSSProperties,
} from "react";

import {
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import clsx from "clsx";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

import { EmptyState } from "@/components/display/empty-state/EmptyState";
import { Icon } from "@/components/display/icon/Icon";
import { Skeleton } from "@/components/display/skeleton/Skeleton";
import type { TableProps } from "@/types/client";

import {
	getScrollLeftFromThumbOffset,
	getTableScrollbarMetrics,
} from "./utils";

export function Table<TData extends object>({
	data,
	columns,
	caption,
	className,
	emptyState,
	enableSorting = true,
	getRowId,
	initialSorting = [],
	isLoading = false,
	loadingLabel,
	loadingRowCount = 4,
	style,
	...props
}: TableProps<TData>) {
	const [sorting, setSorting] = useState(initialSorting);
	const [scrollbarMetrics, setScrollbarMetrics] = useState(() => ({
		isScrollable: false,
		thumbOffsetPx: 0,
		thumbWidthPx: 0,
	}));
	const scrollContainerRef = useRef<HTMLDivElement | null>(null);
	const scrollbarTrackRef = useRef<HTMLDivElement | null>(null);
	const dragStateRef = useRef<{
		pointerId: number;
		startScrollLeft: number;
		startX: number;
	} | null>(null);

	// eslint-disable-next-line react-hooks/incompatible-library
	const table = useReactTable({
		data,
		columns,
		state: {
			sorting,
		},
		onSortingChange: setSorting,
		...(getRowId ? { getRowId } : {}),
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		enableSorting,
	});

	const leafColumns = table.getAllLeafColumns();
	const rows = table.getRowModel().rows;
	const hasTabularContent = isLoading || rows.length > 0;
	const tableStyle = hasTabularContent
		? ({
				minWidth: `${Math.max(leafColumns.length, 1) * 10}rem`,
			} as CSSProperties)
		: undefined;

	const syncScrollbar = useCallback(() => {
		const scrollContainer = scrollContainerRef.current;
		const scrollbarTrack = scrollbarTrackRef.current;

		if (!scrollContainer) {
			return;
		}

		setScrollbarMetrics(
			getTableScrollbarMetrics({
				clientWidth: scrollContainer.clientWidth,
				scrollLeft: scrollContainer.scrollLeft,
				scrollWidth: scrollContainer.scrollWidth,
				trackWidth: scrollbarTrack?.offsetWidth ?? scrollContainer.clientWidth,
			}),
		);
	}, []);

	useEffect(() => {
		syncScrollbar();

		const scrollContainer = scrollContainerRef.current;
		const scrollbarTrack = scrollbarTrackRef.current;

		if (!scrollContainer) {
			return;
		}

		const resizeObserver = new ResizeObserver(() => {
			syncScrollbar();
		});

		resizeObserver.observe(scrollContainer);
		if (scrollbarTrack) {
			resizeObserver.observe(scrollbarTrack);
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
	}, [
		syncScrollbar,
		columns,
		data,
		hasTabularContent,
		isLoading,
		scrollbarMetrics.isScrollable,
	]);

	function handleTrackPointerDown(event: React.PointerEvent<HTMLDivElement>) {
		if (
			!scrollbarMetrics.isScrollable ||
			event.target !== event.currentTarget
		) {
			return;
		}

		const scrollContainer = scrollContainerRef.current;
		const scrollbarTrack = scrollbarTrackRef.current;

		if (!scrollContainer || !scrollbarTrack) {
			return;
		}

		const trackBounds = scrollbarTrack.getBoundingClientRect();
		const nextThumbOffset =
			event.clientX - trackBounds.left - scrollbarMetrics.thumbWidthPx / 2;
		const maxScrollLeft = Math.max(
			scrollContainer.scrollWidth - scrollContainer.clientWidth,
			0,
		);
		const maxThumbOffset = Math.max(
			scrollbarTrack.offsetWidth - scrollbarMetrics.thumbWidthPx,
			0,
		);

		scrollContainer.scrollLeft = getScrollLeftFromThumbOffset({
			maxScrollLeft,
			maxThumbOffset,
			thumbOffsetPx: nextThumbOffset,
		});
	}

	function handleThumbPointerDown(
		event: React.PointerEvent<HTMLButtonElement>,
	) {
		if (!scrollbarMetrics.isScrollable) {
			return;
		}

		const scrollContainer = scrollContainerRef.current;

		if (!scrollContainer) {
			return;
		}

		dragStateRef.current = {
			pointerId: event.pointerId,
			startScrollLeft: scrollContainer.scrollLeft,
			startX: event.clientX,
		};

		event.currentTarget.setPointerCapture(event.pointerId);
		event.preventDefault();
	}

	function handleThumbPointerMove(
		event: React.PointerEvent<HTMLButtonElement>,
	) {
		const dragState = dragStateRef.current;
		const scrollContainer = scrollContainerRef.current;
		const scrollbarTrack = scrollbarTrackRef.current;

		if (
			!dragState ||
			dragState.pointerId !== event.pointerId ||
			!scrollContainer ||
			!scrollbarTrack
		) {
			return;
		}

		const maxScrollLeft = Math.max(
			scrollContainer.scrollWidth - scrollContainer.clientWidth,
			0,
		);
		const maxThumbOffset = Math.max(
			scrollbarTrack.offsetWidth - scrollbarMetrics.thumbWidthPx,
			0,
		);
		const deltaX = event.clientX - dragState.startX;
		const startThumbOffset =
			maxScrollLeft === 0
				? 0
				: (dragState.startScrollLeft / maxScrollLeft) * maxThumbOffset;

		scrollContainer.scrollLeft = getScrollLeftFromThumbOffset({
			maxScrollLeft,
			maxThumbOffset,
			thumbOffsetPx: startThumbOffset + deltaX,
		});
	}

	function clearThumbDrag() {
		dragStateRef.current = null;
	}

	return (
		<div
			aria-busy={isLoading || undefined}
			aria-live={isLoading ? "polite" : undefined}
			className={clsx("table-root", className)}
			role={isLoading ? "status" : undefined}
			style={style}
			{...props}
		>
			{isLoading && loadingLabel ? (
				<span className="sr-only">{loadingLabel}</span>
			) : null}

			<div className="table-native-scroll-shell">
				<div
					ref={scrollContainerRef}
					className="table-native-scroll"
				>
					<div
						className={clsx(
							"table-inner",
							!hasTabularContent && "table-inner-empty",
						)}
					>
						<table
							className={clsx(
								"table-element",
								!hasTabularContent && "table-element-empty",
							)}
							style={tableStyle}
						>
							{caption ? (
								<caption className="table-caption">{caption}</caption>
							) : null}

							<thead className="table-head">
								{table.getHeaderGroups().map(headerGroup => (
									<tr
										key={headerGroup.id}
										className="table-header-row"
									>
										{headerGroup.headers.map(header => (
											<th
												key={header.id}
												className="table-header-cell"
												scope="col"
											>
												{header.isPlaceholder ? null : header.column.getCanSort() ? (
													<button
														type="button"
														className="table-sort-button"
														onClick={header.column.getToggleSortingHandler()}
													>
														<span className="table-sort-label">
															{flexRender(
																header.column.columnDef.header,
																header.getContext(),
															)}
														</span>
														<SortIcon direction={header.column.getIsSorted()} />
													</button>
												) : (
													flexRender(
														header.column.columnDef.header,
														header.getContext(),
													)
												)}
											</th>
										))}
									</tr>
								))}
							</thead>

							<tbody className="table-body">
								{isLoading ? (
									Array.from({ length: loadingRowCount }).map((_, rowIndex) => (
										<tr
											key={`loading-${rowIndex}`}
											className="table-body-row"
										>
											{leafColumns.map(column => (
												<td
													key={`${column.id}-${rowIndex}`}
													className="table-body-cell"
												>
													<Skeleton className="h-4 w-full max-w-36 rounded-md" />
												</td>
											))}
										</tr>
									))
								) : rows.length > 0 ? (
									rows.map(row => (
										<tr
											key={row.id}
											className="table-body-row"
										>
											{row.getVisibleCells().map(cell => (
												<td
													key={cell.id}
													className="table-body-cell"
												>
													{flexRender(
														cell.column.columnDef.cell,
														cell.getContext(),
													)}
												</td>
											))}
										</tr>
									))
								) : (
									<tr className="table-empty-row">
										<td
											colSpan={leafColumns.length || 1}
											className="table-empty-cell"
										>
											<div className="table-empty-content">
												{emptyState ?? (
													<EmptyState
														className="table-empty-state"
														title={<span className="ty-sm-semibold">-</span>}
														description={<span className="ty-helper"> </span>}
													/>
												)}
											</div>
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</div>
			</div>

			{scrollbarMetrics.isScrollable ? (
				<div className="table-scrollbar">
					<div
						ref={scrollbarTrackRef}
						className="table-scrollbar-track"
						onPointerDown={handleTrackPointerDown}
					>
						<button
							aria-label="Scroll table horizontally"
							className="table-scrollbar-thumb"
							style={{
								transform: `translateX(${scrollbarMetrics.thumbOffsetPx}px)`,
								width: `${scrollbarMetrics.thumbWidthPx}px`,
							}}
							type="button"
							onPointerCancel={clearThumbDrag}
							onPointerDown={handleThumbPointerDown}
							onPointerMove={handleThumbPointerMove}
							onLostPointerCapture={clearThumbDrag}
							onPointerUp={clearThumbDrag}
						/>
					</div>
				</div>
			) : null}
		</div>
	);
}

function SortIcon({ direction }: { direction: false | "asc" | "desc" }) {
	if (direction === "asc") {
		return (
			<Icon
				icon={ArrowUp}
				className="h-4 w-4"
				decorative
			/>
		);
	}

	if (direction === "desc") {
		return (
			<Icon
				icon={ArrowDown}
				className="h-4 w-4"
				decorative
			/>
		);
	}

	return (
		<Icon
			icon={ArrowUpDown}
			className="h-4 w-4"
			decorative
		/>
	);
}
