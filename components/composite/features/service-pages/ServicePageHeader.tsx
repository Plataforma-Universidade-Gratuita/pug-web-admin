import clsx from "clsx";

import { MetadataPopover } from "@/components/composite";
import {
	Section,
	SectionActions,
	SectionContent,
	SectionDescription,
	SectionHeader,
	SectionTitle,
} from "@/components/primitives";
import type { ServicePageHeaderProps } from "@/types/client";

export function ServicePageHeader({
	title,
	description,
	metadata,
	actions,
	children,
	filtersClassName,
}: ServicePageHeaderProps) {
	return (
		<Section className="shadow-normal rounded-[calc(var(--twc-radius-xl)+0.25rem)] border border-[color:var(--twc-border-2)] bg-[color:var(--twc-surface-2)] px-5 py-4">
			<SectionHeader>
				<div className="grid gap-2">
					<SectionTitle className="text-3xl">{title}</SectionTitle>
					<SectionDescription className="max-w-none">
						{description}
					</SectionDescription>
				</div>
				<SectionActions>
					{actions}
					<MetadataPopover {...metadata} />
				</SectionActions>
			</SectionHeader>
			<SectionContent className={clsx("grid gap-4", filtersClassName)}>
				{children}
			</SectionContent>
		</Section>
	);
}
