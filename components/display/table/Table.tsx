"use client";

import {
	Children,
	Fragment,
	isValidElement,
	useCallback,
	useEffect,
	useRef,
	useState,
	type CSSProperties,
	type ReactElement,
	type ReactNode,
} from "react";

import {
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	useReactTable,
	type SortingFn,
} from "@tanstack/react-table";
import clsx from "clsx";
import { ArrowDown, ArrowUp, ArrowUpDown, MoreHorizontal } from "lucide-react";

import { EmptyState } from "@/components/display/empty-state/EmptyState";
import { Icon } from "@/components/display/icon/Icon";
import { Skeleton } from "@/components/display/skeleton/Skeleton";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/navigation/dropdown-menu/DropdownMenu";
import type { DropdownMenuItemProps } from "@/types/client";
import type { TableProps } from "@/types/client";

import {
	compareTableValues,
	getScrollOffsetFromThumbOffset,
	getTableScrollbarMetrics,
} from "./utils";

export function Table<TData extends object>({
	data,
	columns,
	className,
	emptyState,
	enableSorting = true,
	getRowId,
	initialSorting = [],
	isLoading = false,
	loadingLabel,
	loadingRowCount = 4,
	getRowActions,
	style,
	...props
}: TableProps<TData>) {
	const [sorting, setSorting] = useState(initialSorting);
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
	const accentInsensitiveSorting = useCallback<SortingFn<TData>>(
		(rowA, rowB, columnId) =>
			compareTableValues(rowA.getValue(columnId), rowB.getValue(columnId)),
		[],
	);

	// eslint-disable-next-line react-hooks/incompatible-library
	const table = useReactTable({
		data,
		columns,
		defaultColumn: {
			sortingFn: accentInsensitiveSorting,
		},
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
	const hasRowActions = Boolean(getRowActions);
	const totalColumnCount = leafColumns.length + (hasRowActions ? 1 : 0);
	const tableStyle = hasTabularContent
		? ({
				minWidth: `${Math.max(leafColumns.length, 1) * 10 + (hasRowActions ? 4 : 0)}rem`,
			} as CSSProperties)
		: undefined;

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
										{hasRowActions ? (
											<th
												aria-label="Actions"
												className="table-header-cell table-header-cell-actions"
												scope="col"
											/>
										) : null}
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
											{hasRowActions ? (
												<td className="table-body-cell table-body-cell-actions">
													<Skeleton className="h-7 w-7 rounded-full" />
												</td>
											) : null}
										</tr>
									))
								) : rows.length > 0 ? (
									<>
										{rows.map(row => (
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
												{hasRowActions ? (
													<td className="table-body-cell table-body-cell-actions">
														<RowActionsCell
															row={row.original}
															getRowActions={getRowActions!}
														/>
													</td>
												) : null}
											</tr>
										))}
										<tr
											aria-hidden="true"
											className="table-spacer-row"
										>
											<td
												colSpan={totalColumnCount || 1}
												className="table-spacer-cell"
											/>
										</tr>
									</>
								) : (
									<tr className="table-empty-row">
										<td
											colSpan={totalColumnCount || 1}
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

			{verticalScrollbarMetrics.isScrollable ? (
				<div className="table-scrollbar table-scrollbar-vertical">
					<div
						ref={verticalScrollbarTrackRef}
						className="table-scrollbar-track table-scrollbar-track-vertical"
						onPointerDown={handleVerticalTrackPointerDown}
					>
						<button
							aria-label="Scroll table vertically"
							className="table-scrollbar-thumb table-scrollbar-thumb-vertical"
							style={{
								transform: `translateY(${verticalScrollbarMetrics.thumbOffsetPx}px)`,
								height: `${verticalScrollbarMetrics.thumbSizePx}px`,
							}}
							type="button"
							onPointerCancel={clearVerticalThumbDrag}
							onPointerDown={handleVerticalThumbPointerDown}
							onPointerMove={handleVerticalThumbPointerMove}
							onLostPointerCapture={clearVerticalThumbDrag}
							onPointerUp={clearVerticalThumbDrag}
						/>
					</div>
				</div>
			) : null}

			{horizontalScrollbarMetrics.isScrollable ? (
				<div className="table-scrollbar table-scrollbar-horizontal">
					<div
						ref={horizontalScrollbarTrackRef}
						className="table-scrollbar-track table-scrollbar-track-horizontal"
						onPointerDown={handleHorizontalTrackPointerDown}
					>
						<button
							aria-label="Scroll table horizontally"
							className="table-scrollbar-thumb table-scrollbar-thumb-horizontal"
							style={{
								transform: `translateX(${horizontalScrollbarMetrics.thumbOffsetPx}px)`,
								width: `${horizontalScrollbarMetrics.thumbSizePx}px`,
							}}
							type="button"
							onPointerCancel={clearHorizontalThumbDrag}
							onPointerDown={handleHorizontalThumbPointerDown}
							onPointerMove={handleHorizontalThumbPointerMove}
							onLostPointerCapture={clearHorizontalThumbDrag}
							onPointerUp={clearHorizontalThumbDrag}
						/>
					</div>
				</div>
			) : null}

			{horizontalScrollbarMetrics.isScrollable &&
			verticalScrollbarMetrics.isScrollable ? (
				<div className="table-scrollbar-corner" />
			) : null}
		</div>
	);
}

function RowActionsCell<TData extends object>({
	row,
	getRowActions,
}: {
	row: TData;
	getRowActions: NonNullable<TableProps<TData>["getRowActions"]>;
}) {
	const actions = flattenActionNodes(getRowActions(row));
	const [singleAction] = actions;
	const directAction =
		actions.length === 1 && singleAction
			? getDirectActionProps(singleAction)
			: null;

	if (directAction) {
		const label =
			typeof directAction.label === "string" ? directAction.label : undefined;

		return (
			<button
				aria-label={label}
				className="table-row-action-button"
				title={label}
				disabled={directAction.disabled}
				type="button"
				onClick={event => {
					directAction.onClick?.(event as never);

					if (directAction.onSelect) {
						directAction.onSelect(event as never);
					}
				}}
			>
				<Icon
					icon={directAction.icon}
					className="h-4 w-4"
					decorative
				/>
			</button>
		);
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger>
				<button
					aria-label="Open row actions"
					className="table-row-action-button"
					type="button"
				>
					<Icon
						icon={MoreHorizontal}
						className="h-4 w-4"
						decorative
					/>
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>{getRowActions(row)}</DropdownMenuContent>
		</DropdownMenu>
	);
}
function flattenActionNodes(children: ReactNode): ReactElement[] {
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

function getDirectActionProps(element: ReactElement) {
	if (element.type === DropdownMenuSeparator) {
		return null;
	}

	const props = element.props as DropdownMenuItemProps;

	if (!props.icon || !props.label) {
		return null;
	}

	return props;
}

function SortIcon({ direction }: { direction: false | "asc" | "desc" }) {
	if (direction === "asc") {
		return (
			<Icon
				icon={ArrowUp}
				className="h-3 w-3"
				decorative
			/>
		);
	}

	if (direction === "desc") {
		return (
			<Icon
				icon={ArrowDown}
				className="h-3 w-3"
				decorative
			/>
		);
	}

	return (
		<Icon
			icon={ArrowUpDown}
			className="h-3 w-3"
			decorative
		/>
	);
}
