"use client";

import { MoreHorizontal } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
	Icon,
} from "@/components/primitives";
import type { RowActionsCellProps } from "@/types/client";

import { flattenActionNodes, getDirectActionProps } from "./utils";

export function RowActionsCell<TData extends object>({
	row,
	getRowActions,
}: RowActionsCellProps<TData>) {
	const { t } = useTranslation();
	const actions = flattenActionNodes(getRowActions(row));
	const [singleAction] = actions;
	const directAction =
		actions.length === 1 && singleAction
			? getDirectActionProps(singleAction)
			: null;

	if (directAction) {
		const label =
			typeof directAction.label === "string" ? directAction.label : undefined;

		return (
			<button
				aria-label={label}
				className="table-row-action-button"
				title={label}
				disabled={directAction.disabled}
				type="button"
				onClick={event => {
					directAction.onClick?.(event as never);

					if (directAction.onSelect) {
						directAction.onSelect(event as never);
					}
				}}
			>
				<Icon
					icon={directAction.icon}
					className="h-4 w-4"
					decorative
				/>
			</button>
		);
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger>
				<button
					aria-label={t("table.actions.openRowActions")}
					className="table-row-action-button"
					type="button"
				>
					<Icon
						icon={MoreHorizontal}
						className="h-4 w-4"
						decorative
					/>
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				collisionPadding={{
					top: 76,
					right: 12,
					bottom: 12,
					left: 12,
				}}
				className="max-h-[min(24rem,calc(100dvh-var(--app-topbar-height)-1.5rem))] overflow-y-auto"
			>
				{getRowActions(row)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
