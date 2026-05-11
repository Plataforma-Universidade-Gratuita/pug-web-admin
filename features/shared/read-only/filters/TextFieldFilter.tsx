import { Input, Label } from "@/components";
import type { TextFieldFilterProps } from "@/types/client";

export function TextFieldFilter({
	label,
	value,
	onChange,
	placeholder,
	className,
}: TextFieldFilterProps) {
	return (
		<div className="grid gap-2">
			{label ? <Label>{label}</Label> : null}
			<Input
				type="search"
				value={value}
				onChange={event => onChange(event.target.value)}
				placeholder={placeholder}
				className={className ?? "w-full"}
			/>
		</div>
	);
}
