/*
 * Copyright (c) 2026 Mateus Fernandes and Plataforma Universidade Gratuita.
 * All rights reserved.
 *
 * This source code is proprietary and confidential. Unauthorized use,
 * copying, modification, distribution, or deployment is prohibited.
 */
import { DatePicker, Label } from "@/components/primitives";
import type { DateRangeFilterFieldsProps } from "@/types/client";

export function DateRangeFilterFields({
	startLabel,
	startValue,
	onStartValueChange,
	endLabel,
	endValue,
	onEndValueChange,
	startPlaceholder,
	endPlaceholder,
	startDisabled = false,
	endDisabled = false,
	className,
}: DateRangeFilterFieldsProps) {
	return (
		<div className={className ?? "grid gap-4"}>
			<div className="grid min-w-0 gap-2">
				<Label>{startLabel}</Label>
				<DatePicker
					disabled={startDisabled}
					value={startValue}
					onValueChange={onStartValueChange}
					placeholder={startPlaceholder}
				/>
			</div>

			<div className="grid min-w-0 gap-2">
				<Label>{endLabel}</Label>
				<DatePicker
					disabled={endDisabled}
					value={endValue}
					onValueChange={onEndValueChange}
					placeholder={endPlaceholder}
				/>
			</div>
		</div>
	);
}
