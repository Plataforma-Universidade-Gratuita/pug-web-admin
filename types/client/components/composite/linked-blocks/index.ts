import type { ReactNode } from "react";

import type { AccountResponse, UserResponse } from "@/types/api";

export interface ServicePageLinkedAccountBlockProps {
	account: AccountResponse | undefined;
	activeLabels: {
		no: ReactNode;
		yes: ReactNode;
	};
	emptyTitle: ReactNode;
	error: unknown;
	errorDescription: ReactNode;
	errorTitle: ReactNode;
	fields: {
		active: ReactNode;
		id: ReactNode;
		type: ReactNode;
	};
	isError: boolean;
	isLoading: boolean;
	loadingLabel: ReactNode;
	notFoundDescription?: ReactNode;
	notFoundTitle: ReactNode;
	onRefresh: () => void;
	renderAccountTypeLabel: (
		accountType: AccountResponse["accountType"],
	) => ReactNode;
	renderAccountTypeTone: (
		accountType: AccountResponse["accountType"],
	) => "brand" | "danger" | "info" | "neutral" | "success" | "warning";
}

export interface ServicePageLinkedUserBlockProps {
	emptyTitle: ReactNode;
	error: unknown;
	errorDescription: ReactNode;
	errorTitle: ReactNode;
	fields: {
		cpf: ReactNode;
		id: ReactNode;
		name: ReactNode;
	};
	isError: boolean;
	isLoading: boolean;
	loadingLabel: ReactNode;
	notFoundDescription?: ReactNode;
	notFoundTitle: ReactNode;
	onRefresh: () => void;
	user: Pick<UserResponse, "cpfFormatted" | "id" | "name"> | undefined;
}
