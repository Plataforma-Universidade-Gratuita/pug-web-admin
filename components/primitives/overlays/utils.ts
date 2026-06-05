import { FLOATING_BOUNDARY_SELECTOR } from "@/constants";

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
