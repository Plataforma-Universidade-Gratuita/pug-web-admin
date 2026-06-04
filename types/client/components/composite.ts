import type { ReactNode } from "react";

export interface RowActionNavigateProps {
	href: string;
	label?: ReactNode;
}

export interface RowActionClickProps {
	onClick: () => void;
	label?: ReactNode;
}
