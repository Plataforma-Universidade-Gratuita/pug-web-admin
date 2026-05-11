import {
	Button,
	DatePicker,
	Label,
	Popover,
	PopoverContent,
	PopoverTrigger,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
} from "@/components";
import type { AuditInfoFilterProps } from "@/types/client";

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
				<div className="grid gap-4">
					<div className="grid gap-2">
						<Label>{dateFieldLabel}</Label>
						<Select
							value={dateField}
							onValueChange={value => {
								onDateFieldChange(value);
								if (!value) {
									onStartDateChange("");
									onEndDateChange("");
								}
							}}
						>
							<SelectTrigger
								className="w-full"
								placeholder={dateFieldPlaceholder}
							/>
							<SelectContent>
								{dateFieldOptions.map(option => (
									<SelectItem
										key={option.value}
										value={option.value}
									>
										{option.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="grid gap-4 sm:grid-cols-2">
						<div className="grid gap-2">
							<Label>{startDateLabel}</Label>
							<DatePicker
								disabled={!dateField}
								value={startDate}
								onValueChange={onStartDateChange}
								panelSide="left"
								panelAlign="start"
								panelAvoidCollisions
								panelCollisionPadding={16}
								placeholder={startDatePlaceholder}
							/>
						</div>
						<div className="grid gap-2">
							<Label>{endDateLabel}</Label>
							<DatePicker
								disabled={!dateField}
								value={endDate}
								onValueChange={onEndDateChange}
								panelSide="left"
								panelAlign="start"
								panelAvoidCollisions
								panelCollisionPadding={16}
								placeholder={endDatePlaceholder}
							/>
						</div>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
}
