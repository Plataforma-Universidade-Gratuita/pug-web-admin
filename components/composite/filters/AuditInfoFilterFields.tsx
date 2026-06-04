import {
	DatePicker,
	Label,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
} from "@/components";
import type { AuditInfoFilterFieldsProps } from "@/types";

export function AuditInfoFilterFields({
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
}: AuditInfoFilterFieldsProps) {
	return (
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
	);
}
