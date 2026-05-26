import type { Dispatch, ReactNode, SetStateAction } from "react";

import type { RowData } from "@tanstack/react-table";

import type { AccountResponse, UserResponse } from "@/types";
import type { TableProps } from "@/types";

export interface ServicePageMetadataPopoverProps {
	triggerLabel: string;
	emptyTitle: ReactNode;
	emptyDescription: ReactNode;
}

export interface ServicePageHeaderProps {
	title: ReactNode;
	description: ReactNode;
	metadata: ServicePageMetadataPopoverProps;
	actions?: ReactNode;
	children: ReactNode;
	filtersClassName?: string;
}

export interface ServicePageHeaderActionsProps {
	clearLabel: ReactNode;
	createLabel: ReactNode;
	hasFilters: boolean;
	onClear: () => void;
	onCreate: () => void;
}

export interface ServicePageTableSectionProps<TData extends RowData> {
	tableProps: TableProps<TData>;
	footer?: ReactNode;
}

export interface ServicePageShellProps {
	children: ReactNode;
}

export interface ServicePageFiltersDrawerProps {
	activeLabel: ReactNode;
	applyLabel: ReactNode;
	children: ReactNode;
	clearConfirmDescription: ReactNode;
	clearConfirmTitle: ReactNode;
	clearLabel: ReactNode;
	hasActiveFilters: boolean;
	label: ReactNode;
	onApply: () => void;
	onClear: () => void;
	onOpenChange: (open: boolean) => void;
	open: boolean;
	overhead: ReactNode;
	title: ReactNode;
	triggerLabel: ReactNode;
}

export interface ServicePageConfirmDialogProps {
	actionLabel: ReactNode;
	cancelLabel: ReactNode;
	description: ReactNode;
	onAction: () => void;
	onOpenChange: (open: boolean) => void;
	open: boolean;
	title: ReactNode;
	variant?: "danger" | "success" | "warning";
}

export interface ServicePageLinkedAccountBlockProps {
	account: AccountResponse | undefined;
	activeLabels: {
		no: ReactNode;
		yes: ReactNode;
	};
	emptyTitle: ReactNode;
	error: unknown;
	errorDescription: ReactNode;
	errorTitle: ReactNode;
	fields: {
		active: ReactNode;
		id: ReactNode;
		type: ReactNode;
	};
	isError: boolean;
	isLoading: boolean;
	loadingLabel: ReactNode;
	notFoundDescription?: ReactNode;
	notFoundTitle: ReactNode;
	onRefresh: () => void;
	renderAccountTypeLabel: (
		accountType: AccountResponse["accountType"],
	) => ReactNode;
	renderAccountTypeTone: (
		accountType: AccountResponse["accountType"],
	) => "brand" | "danger" | "info" | "neutral" | "success" | "warning";
}

export interface ServicePageLinkedUserBlockProps {
	emptyTitle: ReactNode;
	error: unknown;
	errorDescription: ReactNode;
	errorTitle: ReactNode;
	fields: {
		cpf: ReactNode;
		id: ReactNode;
		name: ReactNode;
	};
	isError: boolean;
	isLoading: boolean;
	loadingLabel: ReactNode;
	notFoundDescription?: ReactNode;
	notFoundTitle: ReactNode;
	onRefresh: () => void;
	user: Pick<UserResponse, "cpfFormatted" | "id" | "name"> | undefined;
}

export interface TextFieldFilterProps {
	label?: ReactNode;
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	className?: string;
}

export interface NumberFieldFilterProps {
	label?: ReactNode;
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	className?: string;
}

export interface AuditInfoFilterOption {
	value: string;
	label: ReactNode;
}

export interface AuditInfoFilterFieldsProps {
	dateFieldLabel: ReactNode;
	dateFieldPlaceholder: string;
	dateField: string;
	onDateFieldChange: (value: string) => void;
	dateFieldOptions: AuditInfoFilterOption[];
	startDateLabel: ReactNode;
	startDatePlaceholder?: string | undefined;
	startDate: string;
	onStartDateChange: (value: string) => void;
	endDateLabel: ReactNode;
	endDatePlaceholder?: string | undefined;
	endDate: string;
	onEndDateChange: (value: string) => void;
}

export interface AuditInfoFilterProps extends AuditInfoFilterFieldsProps {
	label: ReactNode;
	triggerLabel: ReactNode;
	activeLabel: ReactNode;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export type ServicePageDraftFilters = object;

export type ServicePageSizeOption = 25 | 50 | 100 | "all";

export interface UseServicePagePaginationOptions {
	key: string;
	totalPages?: number;
	defaultPage?: number;
	defaultSize?: ServicePageSizeOption;
}

export interface UseServicePagePaginationResult {
	currentPage: number;
	pageSize: ServicePageSizeOption;
	isAll: boolean;
	backendPage: number | null;
	backendSize: number | null;
	totalPages: number;
	canGoToPreviousPage: boolean;
	canGoToNextPage: boolean;
	setCurrentPage: (page: number) => void;
	setPageSize: (size: ServicePageSizeOption) => void;
	resetPage: () => void;
	goToFirstPage: () => void;
	goToPreviousPage: () => void;
	goToNextPage: () => void;
	goToLastPage: () => void;
}

export interface ServicePagePaginationProps {
	currentPage: number;
	pageSize: ServicePageSizeOption;
	totalElements: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	onPageSizeChange: (size: ServicePageSizeOption) => void;
	disabled?: boolean;
}

export interface UseDraftFiltersOptions<
	TFilters extends ServicePageDraftFilters,
> {
	initialFilters: TFilters;
}

export interface UseDraftFiltersResult<
	TFilters extends ServicePageDraftFilters,
> {
	appliedFilters: TFilters;
	draftFilters: TFilters;
	hasAppliedFilters: boolean;
	applyDraftFilters: () => void;
	clearFilters: () => void;
	setAppliedFilters: Dispatch<SetStateAction<TFilters>>;
	setDraftFilter: <TKey extends keyof TFilters>(
		key: TKey,
		value: TFilters[TKey],
	) => void;
	setDraftFilters: Dispatch<SetStateAction<TFilters>>;
}

export interface ServicePageDetailState<TId extends string = string> {
	selectedId: TId | null;
	isOpen: boolean;
	openDetail: (id: TId) => void;
	closeDetail: () => void;
	handleOpenChange: (open: boolean) => void;
	clearIfMatches: (id: TId) => void;
}

export interface UseServicePageEditorStateOptions<TMode extends string> {
	createMode: TMode;
	defaultMode: TMode;
}

export interface ServicePageEditorState<
	TMode extends string,
	TId extends string = string,
> {
	editorId: TId | null;
	editorMode: TMode;
	isOpen: boolean;
	openCreate: () => void;
	openEditor: (id: TId, mode: TMode) => void;
	closeEditor: () => void;
	handleOpenChange: (open: boolean) => void;
	clearIfMatches: (id: TId) => void;
}
