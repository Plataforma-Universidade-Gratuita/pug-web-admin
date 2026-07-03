/*
 * Copyright (c) 2026 Mateus Fernandes and Plataforma Universidade Gratuita.
 * All rights reserved.
 *
 * This source code is proprietary and confidential. Unauthorized use,
 * copying, modification, distribution, or deployment is prohibited.
 */
import { FLOATING_BOUNDARY_SELECTOR } from "@/components/primitives/overlays/constants";

export function getFloatingLayerBoundary(
	element: Element | null,
): HTMLElement | undefined {
	return element?.closest(FLOATING_BOUNDARY_SELECTOR) ?? undefined;
}

export function usesAppTopbarCollisionPadding(
	boundary: HTMLElement | undefined,
): boolean {
	if (!boundary) return false;

	return (
		boundary.classList.contains("navbar-content") ||
		boundary.classList.contains("navbar-content-scroll-viewport")
	);
}
