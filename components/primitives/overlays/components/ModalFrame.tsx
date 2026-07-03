/*
 * Copyright (c) 2026 Mateus Fernandes and Plataforma Universidade Gratuita.
 * All rights reserved.
 *
 * This source code is proprietary and confidential. Unauthorized use,
 * copying, modification, distribution, or deployment is prohibited.
 */
import type { ReactNode } from "react";

import { APP_TOPBAR_HEIGHT } from "@/components/primitives/overlays/constants";

interface ModalFrameProps {
	children: ReactNode;
}

export function ModalFrame({ children }: ModalFrameProps) {
	return (
		<div
			className="modal-frame"
			style={{ top: APP_TOPBAR_HEIGHT }}
		>
			{children}
		</div>
	);
}
