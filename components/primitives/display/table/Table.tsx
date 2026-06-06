"use client";

import { useCallback, useState } from "react";

import {
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	type SortingFn,
	useReactTable,
} from "@tanstack/react-table";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

import type { TableProps } from "@/types";

import { SortIcon } from "./SortIcon";
import { TableBody } from "./TableBody";
import { useTableScrollbars } from "./useTableScrollbars";
import { compareTableValues, getTableColumnStyle } from "./utils";

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
	const { t } = useTranslation();
	const [sorting, setSorting] = useState(initialSorting);
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
	const {
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
	} = useTableScrollbars({
		columns,
		data,
		hasTabularContent,
		isLoading,
	});

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
						>
							<thead className="table-head">
								{table.getHeaderGroups().map(headerGroup => (
									<tr
										key={headerGroup.id}
										className="table-header-row"
									>
										{headerGroup.headers.map(header => {
											const renderedHeaderContent = flexRender(
												header.column.columnDef.header,
												header.getContext(),
											);

											return (
												<th
													key={header.id}
													className="table-header-cell"
													scope="col"
													style={getTableColumnStyle(
														header.column.columnDef.size,
													)}
												>
													{header.isPlaceholder ? null : header.column.getCanSort() ? (
														<button
															type="button"
															className="table-sort-button"
															onClick={header.column.getToggleSortingHandler()}
														>
															<span className="table-sort-label">
																{renderedHeaderContent}
															</span>
															<SortIcon
																direction={header.column.getIsSorted()}
															/>
														</button>
													) : (
														renderedHeaderContent
													)}
												</th>
											);
										})}
										{hasRowActions ? (
											<th
												aria-label={t("components.table.actions")}
												className="table-header-cell table-header-cell-actions"
												scope="col"
											/>
										) : null}
									</tr>
								))}
							</thead>

							<TableBody
								rows={rows}
								leafColumns={leafColumns}
								hasRowActions={hasRowActions}
								getRowActions={getRowActions}
								isLoading={isLoading}
								loadingRowCount={loadingRowCount}
								emptyState={emptyState}
								totalColumnCount={totalColumnCount}
							/>
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
							aria-label={t("components.table.scroll.vertical")}
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
							aria-label={t("components.table.scroll.horizontal")}
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
