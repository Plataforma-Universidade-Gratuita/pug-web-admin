import {
	Button,
	Label,
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components";
import { AuditInfoFilterFields } from "@/components";
import type { AuditInfoFilterProps } from "@/types";

export function AuditInfoFilter({
	label,
	triggerLabel,
	activeLabel,
	open,
	onOpenChange,
	dateFieldLabel,
	dateFieldPlaceholder,
	dateField,
	onDateFieldChange,
	dateFieldOptions,
	startDateLabel,
	startDatePlaceholder,
	startDate,
	onStartDateChange,
	endDateLabel,
	endDatePlaceholder,
	endDate,
	onEndDateChange,
}: AuditInfoFilterProps) {
	const hasActiveFilters = Boolean(dateField || startDate || endDate);

	return (
		<Popover
			open={open}
			onOpenChange={onOpenChange}
		>
			<div className="grid gap-2 self-end">
				<Label>{label}</Label>
				<PopoverTrigger>
					<Button
						variant="secondary"
						usage={hasActiveFilters ? "info" : "secondary"}
						className="w-full justify-start"
					>
						{hasActiveFilters ? activeLabel : triggerLabel}
					</Button>
				</PopoverTrigger>
			</div>
			<PopoverContent
				className="grid w-[30rem] gap-4"
				side={"left"}
			>
				<AuditInfoFilterFields
					dateFieldLabel={dateFieldLabel}
					dateFieldPlaceholder={dateFieldPlaceholder}
					dateField={dateField}
					onDateFieldChange={onDateFieldChange}
					dateFieldOptions={dateFieldOptions}
					startDateLabel={startDateLabel}
					startDatePlaceholder={startDatePlaceholder}
					startDate={startDate}
					onStartDateChange={onStartDateChange}
					endDateLabel={endDateLabel}
					endDatePlaceholder={endDatePlaceholder}
					endDate={endDate}
					onEndDateChange={onEndDateChange}
				/>
			</PopoverContent>
		</Popover>
	);
}
