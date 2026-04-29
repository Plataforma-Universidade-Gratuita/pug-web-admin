import clsx from "clsx";

import { Section } from "@/components";
import { DOCS_SECTION_PANEL_CLASS_NAME } from "@/constants/docs";
import type { SectionProps } from "@/types/client";

export function DocsSectionPanel({
	children,
	className,
	...props
}: SectionProps) {
	return (
		<Section
			className={clsx(DOCS_SECTION_PANEL_CLASS_NAME, className)}
			{...props}
		>
			{children}
		</Section>
	);
}
