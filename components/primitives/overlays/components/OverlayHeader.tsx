import type { ReactNode } from "react";

import { Header } from "@/components/primitives/structure";

interface OverlayHeaderProps {
	children: ReactNode;
	className?: string | undefined;
	mainClassName: string;
	overhead?: ReactNode;
	overheadClassName?: string | undefined;
	closeButton?: ReactNode | undefined;
}

export function OverlayHeader({
	children,
	className,
	mainClassName,
	overhead,
	overheadClassName,
	closeButton,
}: OverlayHeaderProps) {
	return (
		<Header className={className}>
			<div className={mainClassName}>
				{overhead ? <p className={overheadClassName}>{overhead}</p> : null}
				{children}
			</div>
			{closeButton}
		</Header>
	);
}
