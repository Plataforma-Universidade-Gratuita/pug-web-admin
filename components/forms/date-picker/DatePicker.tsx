"use client";

import { forwardRef } from "react";

import { CalendarDays } from "lucide-react";

import { Icon } from "@/components/display/icon/Icon";
import { Input } from "@/components/forms/input/Input";
import type { DatePickerProps } from "@/types/client";

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
	function DatePicker(props, ref) {
		return (
			<Input
				ref={ref}
				type="date"
				leadingIcon={
					<Icon
						icon={CalendarDays}
						className="h-4 w-4"
					/>
				}
				{...props}
			/>
		);
	},
);
