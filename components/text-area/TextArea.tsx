"use client";

import { forwardRef } from "react";

import clsx from "clsx";

import type { TextAreaProps } from "@/types/client";

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
	function TextArea({ className, ...props }, ref) {
		return (
			<textarea
				ref={ref}
				className={clsx(
					"border-default-2 surface-2 focus-ring min-h-28 w-full rounded-[var(--twc-radius-lg)] border px-3 py-2.5 text-base text-[color:var(--twc-text)] outline-none placeholder:text-[color:var(--twc-muted)] disabled:cursor-not-allowed disabled:opacity-60",
					className,
				)}
				{...props}
			/>
		);
	},
);
