import { Section, SectionContent, Table } from "@/components";
import type { ReadOnlyTableSectionProps } from "@/types/client";

export function ReadOnlyTableSection<TData extends object>({
	tableProps,
}: ReadOnlyTableSectionProps<TData>) {
	return (
		<div className="grid h-full min-h-0">
			<Section className="shadow-normal grid h-full min-h-0 rounded-[calc(var(--twc-radius-xl)+0.25rem)] border border-[color:var(--twc-border-2)] bg-[color:var(--twc-surface-1)]">
				<SectionContent className="h-full min-h-0 overflow-hidden">
					<Table
						{...tableProps}
						className={tableProps.className ?? "h-full"}
					/>
				</SectionContent>
			</Section>
		</div>
	);
}
