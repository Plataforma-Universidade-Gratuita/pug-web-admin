"use client";

/*
 * Copyright (c) 2026 Mateus Fernandes and Plataforma Universidade Gratuita.
 * All rights reserved.
 *
 * This source code is proprietary and confidential. Unauthorized use,
 * copying, modification, distribution, or deployment is prohibited.
 */
import * as RadixDialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { Button } from "@/components/primitives/actions";
import { Icon } from "@/components/primitives/display";

interface OverlayCloseButtonProps {
	label: string;
}

export function OverlayCloseButton({ label }: OverlayCloseButtonProps) {
	return (
		<RadixDialog.Close asChild>
			<Button
				size="icon"
				variant="secondary"
				title={label}
				aria-label={label}
			>
				<Icon
					icon={X}
					className="h-4 w-4"
				/>
			</Button>
		</RadixDialog.Close>
	);
}
