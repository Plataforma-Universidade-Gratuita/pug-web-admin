import clsx from "clsx";

import { Section, SectionContent, Table } from "@/components/primitives";
import type { ServicePageTableSectionProps } from "@/types/client";

export function ServicePageTableSection<TData extends object>({
	footer,
	tableProps,
}: ServicePageTableSectionProps<TData>) {
	return (
		<div className="grid h-full min-h-0">
			<Section
				className={clsx(
					"shadow-normal grid h-full min-h-0 rounded-[calc(var(--twc-radius-xl)+0.25rem)] border border-[color:var(--twc-border-2)] bg-[color:var(--twc-surface-1)]",
					footer && "grid-rows-[minmax(0,1fr)_auto] gap-0 overflow-hidden",
				)}
			>
				<SectionContent className="h-full min-h-0 overflow-hidden">
					<Table
						{...tableProps}
						className={clsx(
							tableProps.className ?? "h-full",
							footer && "table-root-with-footer",
						)}
					/>
				</SectionContent>
				{footer}
			</Section>
		</div>
	);
}
