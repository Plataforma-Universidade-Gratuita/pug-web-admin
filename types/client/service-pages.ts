import type { ReactNode } from "react";

import type { RowData } from "@tanstack/react-table";

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

export interface ServicePageTableSectionProps<TData extends RowData> {
	tableProps: TableProps<TData>;
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
