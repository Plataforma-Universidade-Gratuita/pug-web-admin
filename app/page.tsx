"use client";

export default function Page() {
	return (
		<main className="mx-auto max-w-6xl space-y-8 p-6">
			{/* Surfaces */}
			<section className="space-y-3">
				<h2 className="ty-title">Surfaces</h2>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
					<div className="surface-1 br-squircle shadow-weak border border-neutral-200 p-4 dark:border-neutral-800">
						<p className="ty-caption">surface-1</p>
						<p className="ty-helper">Page background layer</p>
					</div>
					<div className="surface-2 br-squircle shadow-normal border border-neutral-200 p-4 dark:border-neutral-800">
						<p className="ty-caption">surface-2</p>
						<p className="ty-helper">Card layer</p>
					</div>
					<div className="surface-3 br-squircle shadow-strong border border-neutral-200 p-4 dark:border-neutral-800">
						<p className="ty-caption">surface-3</p>
						<p className="ty-helper">Inset/closest layer</p>
					</div>
				</div>
			</section>

			{/* Typography */}
			<section className="surface-2 br-squircle shadow-normal space-y-2 border border-neutral-200 p-6 dark:border-neutral-800">
				<h2 className="ty-title">Typography</h2>
				<p className="ty-body">ty-body — regular 16px</p>
				<p className="ty-body-semibold">ty-body-semibold — 16px</p>
				<p className="ty-body-bold">ty-body-bold — 16px</p>
				<p className="ty-sm">ty-sm — 14px</p>
				<p className="ty-sm-semibold">ty-sm-semibold — 14px</p>
				<p className="ty-sm-bold">ty-sm-bold — 14px</p>
				<p className="ty-title">ty-title — 18px semibold</p>
				<p className="ty-title-alt">ty-title-alt — 18px regular</p>
				<p className="ty-header">ty-header — 16px semibold</p>
				<p className="ty-helper">ty-helper — 16px subtle</p>
				<p className="text-muted">text-muted utility applied here</p>
			</section>

			{/* Brand / Accent Buttons */}
			<section className="surface-2 br-squircle shadow-normal border border-neutral-200 p-6 dark:border-neutral-800">
				<h2 className="ty-title">Brand / Accent</h2>
				<div className="mt-3 flex flex-wrap gap-3">
					<button className="br-squircle ty-body-semibold bg-brand-600 hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600 px-4 py-2 text-neutral-50">
						Brand
					</button>
					<button className="br-squircle ty-body-semibold bg-accent-600 hover:bg-accent-700 dark:bg-accent-500 dark:hover:bg-accent-600 px-4 py-2 text-neutral-50">
						Accent
					</button>
					<a
						href="#"
						className="br-squircle ty-body-semibold bg-neutral-900 px-4 py-2 text-neutral-50 no-underline hover:bg-neutral-800 dark:bg-neutral-200 dark:text-neutral-900"
					>
						Neutral CTA
					</a>
				</div>
			</section>

			{/* Radii + Shadows */}
			<section className="space-y-3">
				<h2 className="ty-title">Radii + Shadows</h2>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
					<div className="surface-2 br-square shadow-weak border border-neutral-200 p-6 dark:border-neutral-800">
						<p className="ty-caption">br-square + shadow-weak</p>
					</div>
					<div className="surface-2 br-squircle shadow-normal border border-neutral-200 p-6 dark:border-neutral-800">
						<p className="ty-caption">br-squircle + shadow-normal</p>
					</div>
					<div className="surface-2 br-circle shadow-strong border border-neutral-200 p-6 dark:border-neutral-800">
						<p className="ty-caption">br-circle + shadow-strong</p>
					</div>
				</div>
			</section>

			{/* Combined example */}
			<section className="surface-2 br-squircle shadow-strong space-y-3 border border-neutral-200 p-6 dark:border-neutral-800">
				<h2 className="ty-title">Card Example</h2>
				<p className="ty-body">
					This card uses <code>surface-2</code>, <code>br-squircle</code>, and{" "}
					<code>shadow-strong</code>. Text styles are utilities.
				</p>
				<div className="surface-3 br-squircle p-4">
					<p className="ty-sm">Nested surface-3 content.</p>
				</div>
			</section>
		</main>
	);
}
