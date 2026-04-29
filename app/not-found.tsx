import { FloatingPageControls } from "@/features/floating-page-controls";
import { NotFoundPageContent } from "@/features/docs/routing/RouteBoundaryPages";

export default function NotFoundPage() {
	return (
		<>
			<FloatingPageControls />
			<NotFoundPageContent />
		</>
	);
}
