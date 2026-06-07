import type { ReactNode } from "react";

import clsx from "clsx";

import { ScrollArea } from "@/components/primitives/structure";
import { useLoading } from "@/contexts";

interface OverlayScrollBodyProps {
	children: ReactNode;
	className?: string | undefined;
	outerClassName: string;
	scrollClassName: string;
	viewportClassName: string;
	innerClassName: string;
	loadingClassName?: string | undefined;
	loadingContent: ReactNode;
}

export function OverlayScrollBody({
	children,
	className,
	outerClassName,
	scrollClassName,
	viewportClassName,
	innerClassName,
	loadingClassName,
	loadingContent,
}: OverlayScrollBodyProps) {
	const { isLoading } = useLoading();

	return (
		<div className={outerClassName}>
			<ScrollArea
				className={scrollClassName}
				viewportClassName={viewportClassName}
			>
				<div
					className={clsx(
						innerClassName,
						isLoading ? loadingClassName : null,
						className,
					)}
				>
					{isLoading ? loadingContent : children}
				</div>
			</ScrollArea>
		</div>
	);
}
