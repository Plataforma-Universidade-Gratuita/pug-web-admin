import type { ReactNode } from "react";

import type { RowData } from "@tanstack/react-table";

import type { ServicePageMetadataPopoverProps } from "@/types/client/components/composite/popovers/index";
import type { TableProps } from "@/types/client/components/primitives/display/table/index";
import type { TabsProps } from "@/types/client/components/primitives/navigation/tabs/index";

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

export interface ServicePageEditorDrawerTabsProps extends Omit<
	TabsProps,
	"children"
> {
	list: ReactNode;
}

export interface ServicePageEditorDrawerProps {
	bodyClassName?: string;
	children: ReactNode;
	footer: ReactNode;
	isLoading?: boolean;
	loadingLabel?: string;
	onOpenChange: (open: boolean) => void;
	open: boolean;
	overhead: ReactNode;
	tabs?: ServicePageEditorDrawerTabsProps;
	title: ReactNode;
}

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

export interface ActivatableRecordPendingStatus<TRecord> {
	active: boolean;
	record: TRecord;
}

export interface ActivatableRecordMutationLike<TVariables> {
	mutate: (
		variables: TVariables,
		options: {
			onSuccess: () => void;
			onError: (error: unknown) => void;
		},
	) => void;
}

export interface UseActivatableRecordActionsOptions<
	TRecord,
	TStatusVariables,
	TDeleteVariables,
> {
	deleteMutation: ActivatableRecordMutationLike<TDeleteVariables>;
	getDeleteErrorToastContent: (
		error: unknown,
		record: TRecord,
	) => {
		title: ReactNode;
		description?: ReactNode;
	};
	getDeleteSuccessToastContent: (record: TRecord) => {
		title: ReactNode;
		description?: ReactNode;
	};
	getDeleteUndoToastContent: (record: TRecord) => {
		key: string;
		title: ReactNode;
		description: ReactNode;
		undoLabel: ReactNode;
	};
	getDeleteVariables: (record: TRecord) => TDeleteVariables;
	getStatusErrorToastContent: (
		error: unknown,
		record: TRecord,
		active: boolean,
	) => {
		title: ReactNode;
		description?: ReactNode;
	};
	getStatusSuccessToastContent: (
		record: TRecord,
		active: boolean,
	) => {
		title: ReactNode;
		description?: ReactNode;
	};
	getStatusVariables: (record: TRecord, active: boolean) => TStatusVariables;
	onDeleteSuccess?: (record: TRecord) => void;
	statusMutation: ActivatableRecordMutationLike<TStatusVariables>;
}

export interface UseActivatableRecordActionsResult<TRecord> {
	confirmDelete: () => void;
	confirmStatusChange: () => void;
	pendingDeleteRecord: TRecord | null;
	pendingStatusRecord: ActivatableRecordPendingStatus<TRecord> | null;
	setPendingDeleteRecord: (record: TRecord | null) => void;
	setPendingStatusRecord: (
		pendingStatus: ActivatableRecordPendingStatus<TRecord> | null,
	) => void;
}
