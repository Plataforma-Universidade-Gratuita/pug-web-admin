import { Input, Label } from "@/components";
import type { NumberFieldFilterProps } from "@/types/client/service-pages";

export function NumberFieldFilter({
	label,
	value,
	onChange,
	placeholder,
	className,
}: NumberFieldFilterProps) {
	return (
		<div className="grid gap-2">
			{label ? <Label>{label}</Label> : null}
			<Input
				type="search"
				inputMode="numeric"
				value={value}
				onChange={event => onChange(event.target.value)}
				placeholder={placeholder}
				className={className ?? "w-full"}
			/>
		</div>
	);
}
