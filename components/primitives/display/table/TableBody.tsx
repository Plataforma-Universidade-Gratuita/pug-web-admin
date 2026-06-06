"use client";

import { flexRender, type Column, type Row } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";

import { NoContentState, Skeleton } from "@/components";

import { RowActionsCell } from "./RowActionsCell";
import { getTableColumnStyle } from "./utils";

export function TableBody<TData extends object>({
	rows,
	leafColumns,
	hasRowActions,
	getRowActions,
	isLoading,
	loadingRowCount,
	emptyState,
	totalColumnCount,
}: {
	rows: Row<TData>[];
	leafColumns: Column<TData, unknown>[];
	hasRowActions: boolean;
	getRowActions: ((row: TData) => React.ReactNode) | undefined;
	isLoading: boolean;
	loadingRowCount: number;
	emptyState?: React.ReactNode;
	totalColumnCount: number;
}) {
	const { t } = useTranslation();

	return (
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
									style={getTableColumnStyle(cell.column.columnDef.size)}
								>
									{flexRender(cell.column.columnDef.cell, cell.getContext())}
								</td>
							))}
							{hasRowActions && getRowActions ? (
								<td className="table-body-cell table-body-cell-actions">
									<RowActionsCell
										row={row.original}
										getRowActions={getRowActions}
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
								<NoContentState
									className="table-empty-state"
									title={t("components.table.empty.title")}
								/>
							)}
						</div>
					</td>
				</tr>
			)}
		</tbody>
	);
}
