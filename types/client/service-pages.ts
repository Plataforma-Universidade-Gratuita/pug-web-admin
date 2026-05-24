import type { ReactNode } from "react";

import type { RowData } from "@tanstack/react-table";

import type { AccountResponse, UserResponse } from "@/types/api";
import type { TableProps } from "@/types/client/components/display";

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
