import { Badge, NotFoundState, SomeErrorState } from "@/components";
import type { ServicePageLinkedAccountBlockProps } from "@/types/client/service-pages";
import { WebApiError } from "@/utils/web-api";

export function ServicePageLinkedAccountBlock({
	account,
	activeLabels,
	emptyTitle,
	error,
	errorDescription,
	errorTitle,
	fields,
	isError,
	isLoading,
	loadingLabel,
	notFoundDescription,
	notFoundTitle,
	onRefresh,
	renderAccountTypeLabel,
	renderAccountTypeTone,
}: ServicePageLinkedAccountBlockProps) {
	if (isLoading) {
		return (
			<p className="ty-sm text-[color:var(--twc-muted)]">{loadingLabel}</p>
		);
	}

	if (isError) {
		if (error instanceof WebApiError && error.status === 404) {
			return (
				<NotFoundState
					title={notFoundTitle}
					description={notFoundDescription}
				/>
			);
		}

		return (
			<SomeErrorState
				title={errorTitle}
				description={errorDescription}
				onRefresh={onRefresh}
			/>
		);
	}

	if (!account) {
		return <NotFoundState title={emptyTitle} />;
	}

	return (
		<div className="grid gap-4">
			<div className="grid gap-1">
				<p className="ty-helper">{fields.id}</p>
				<p className="ty-sm-semibold">{account.id}</p>
			</div>
			<div className="grid gap-1">
				<p className="ty-helper">{fields.type}</p>
				<div>
					<Badge
						className="min-h-5 px-2 py-0.5"
						tone={renderAccountTypeTone(account.accountType)}
						variant="primary"
					>
						{renderAccountTypeLabel(account.accountType)}
					</Badge>
				</div>
			</div>
			<div className="grid gap-1">
				<p className="ty-helper">{fields.active}</p>
				<div>
					<Badge
						className="min-h-5 px-2 py-0.5"
						tone={account.active ? "success" : "danger"}
						variant="primary"
					>
						{account.active ? activeLabels.yes : activeLabels.no}
					</Badge>
				</div>
			</div>
		</div>
	);
}
