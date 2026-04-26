import clsx from "clsx";
import { Section } from "@/components";
import type { SectionProps } from "@/types/client";

export const docsSectionPanelClassName =
	"surface-2 shadow-weak rounded-[calc(var(--twc-radius-xl)+0.25rem)] border border-[color:var(--twc-border-2)] p-6";

export function DocsSectionPanel({
	children,
	className,
	...props
}: SectionProps) {
	return (
		<Section
			className={clsx(docsSectionPanelClassName, className)}
			{...props}
		>
			{children}
		</Section>
	);
}
