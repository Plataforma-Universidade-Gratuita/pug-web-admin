"use client";

import { forwardRef } from "react";

import clsx from "clsx";

import type { TextAreaProps } from "@/types/client";

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
	function TextArea({ className, ...props }, ref) {
		return (
			<textarea
				ref={ref}
				className={clsx("text-area-root", className)}
				{...props}
			/>
		);
	},
);
