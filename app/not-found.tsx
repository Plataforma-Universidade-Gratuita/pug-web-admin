import { NotFoundPageContent } from "@/features/docs/routing/RouteBoundaryPages";
import { FloatingPageControls } from "@/features/floating-page-controls";

export default function NotFoundPage() {
	return (
		<>
			<FloatingPageControls />
			<NotFoundPageContent />
		</>
	);
}
