"use client";

import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import {
	Button,
	Icon,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
} from "@/components/primitives";
import {
	DEFAULT_SERVICE_PAGE_SIZE,
	SERVICE_PAGE_SIZE_OPTIONS,
} from "@/constants";
import type {
	ServicePagePaginationProps,
	ServicePageSizeOption,
} from "@/types/client";

export function ServicePagePagination({
	currentPage,
	pageSize,
	totalElements,
	totalPages,
	onPageChange,
	onPageSizeChange,
	disabled = false,
}: ServicePagePaginationProps) {
	const { t } = useTranslation();
	const isAll = pageSize === "all";
	const safeTotalPages = Math.max(totalPages, 1);
	const canGoToPreviousPage = !disabled && !isAll && currentPage > 1;
	const canGoToNextPage = !disabled && !isAll && currentPage < safeTotalPages;

	return (
		<div className="flex flex-col gap-3 border-t border-[color:var(--twc-border-2)] bg-[color:var(--twc-surface-2)] px-4 py-3 md:flex-row md:items-center md:justify-between">
			<div className="flex flex-col gap-2 md:flex-row md:items-center">
				<div className="service-page-pagination-page-size">
					<Select
						value={String(pageSize)}
						onValueChange={value => {
							if (!value) {
								onPageSizeChange(DEFAULT_SERVICE_PAGE_SIZE);
								return;
							}

							onPageSizeChange(
								(value === "all"
									? "all"
									: Number(value)) as ServicePageSizeOption,
							);
						}}
						disabled={disabled}
					>
						<SelectTrigger
							className="service-page-pagination-page-size-trigger"
							placeholder={t("components.pagination.pageSize.placeholder")}
						/>
						<SelectContent>
							{SERVICE_PAGE_SIZE_OPTIONS.map(option => (
								<SelectItem
									key={String(option)}
									value={String(option)}
								>
									{option === "all"
										? t("components.pagination.pageSize.options.all")
										: t("components.pagination.pageSize.options.number", {
												value: option,
											})}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<p className="text-xs text-[color:var(--twc-text-3)]">
					{t("components.pagination.total", { count: totalElements })}
				</p>
			</div>

			<div className="flex flex-col gap-2 md:flex-row md:items-center">
				<p className="text-xs text-[color:var(--twc-text-3)]">
					{t("components.pagination.page", {
						page: currentPage,
						totalPages: safeTotalPages,
					})}
				</p>
				<div className="flex items-center justify-end gap-2">
					<Button
						type="button"
						variant="secondary"
						size="icon"
						className="h-9 w-9"
						disabled={!canGoToPreviousPage}
						onClick={() => onPageChange(1)}
						title={t("components.pagination.firstPage")}
						aria-label={t("components.pagination.firstPage")}
					>
						<Icon
							icon={ChevronsLeft}
							className="h-4 w-4"
						/>
					</Button>
					<Button
						type="button"
						variant="secondary"
						size="icon"
						className="h-9 w-9"
						disabled={!canGoToPreviousPage}
						onClick={() => onPageChange(currentPage - 1)}
						title={t("components.pagination.previousPage")}
						aria-label={t("components.pagination.previousPage")}
					>
						<Icon
							icon={ChevronLeft}
							className="h-4 w-4"
						/>
					</Button>
					<Button
						type="button"
						variant="secondary"
						size="icon"
						className="h-9 w-9"
						disabled={!canGoToNextPage}
						onClick={() => onPageChange(currentPage + 1)}
						title={t("components.pagination.nextPage")}
						aria-label={t("components.pagination.nextPage")}
					>
						<Icon
							icon={ChevronRight}
							className="h-4 w-4"
						/>
					</Button>
					<Button
						type="button"
						variant="secondary"
						size="icon"
						className="h-9 w-9"
						disabled={!canGoToNextPage}
						onClick={() => onPageChange(safeTotalPages)}
						title={t("components.pagination.lastPage")}
						aria-label={t("components.pagination.lastPage")}
					>
						<Icon
							icon={ChevronsRight}
							className="h-4 w-4"
						/>
					</Button>
				</div>
			</div>
		</div>
	);
}
