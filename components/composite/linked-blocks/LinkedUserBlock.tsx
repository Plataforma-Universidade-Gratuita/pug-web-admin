import { WebApiError } from "@/api/web";
import { NotFoundState, SomeErrorState } from "@/components";
import type { ServicePageLinkedUserBlockProps } from "@/types";

export function ServicePageLinkedUserBlock({
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
	user,
}: ServicePageLinkedUserBlockProps) {
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

	if (!user) {
		return <NotFoundState title={emptyTitle} />;
	}

	return (
		<div className="grid gap-4">
			<div className="grid gap-1">
				<p className="ty-helper">{fields.id}</p>
				<p className="ty-sm-semibold">{user.id}</p>
			</div>
			<div className="grid gap-1">
				<p className="ty-helper">{fields.name}</p>
				<p className="ty-sm-semibold">{user.name}</p>
			</div>
			<div className="grid gap-1">
				<p className="ty-helper">{fields.cpf}</p>
				<p className="ty-sm-semibold">{user.cpfFormatted}</p>
			</div>
		</div>
	);
}
