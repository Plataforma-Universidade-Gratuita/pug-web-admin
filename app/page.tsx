"use client";

export default function Page() {
	return (
		<main className="mx-auto max-w-6xl space-y-8 p-6">
			{/* Surfaces */}
			<section className="space-y-3">
				<h2 className="ty-title">Surfaces</h2>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
					<div className="surface-1 br-squircle shadow-weak border-default border p-4">
						<p className="ty-caption">surface-1</p>
						<p className="ty-helper">Page background layer</p>
					</div>
					<div className="surface-2 br-squircle shadow-normal border-default border p-4">
						<p className="ty-caption">surface-2</p>
						<p className="ty-helper">Card layer</p>
					</div>
					<div className="surface-3 br-squircle shadow-strong border-default border p-4">
						<p className="ty-caption">surface-3</p>
						<p className="ty-helper">Inset/closest layer</p>
					</div>
				</div>
			</section>

			{/* Typography */}
			<section className="surface-2 br-squircle shadow-normal border-default space-y-2 border p-6">
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

			{/* Brand / brand Buttons */}
			<section className="surface-2 br-squircle shadow-normal border-default border p-6">
				<h2 className="ty-title">Brand / brand</h2>
				<div className="mt-3 flex flex-wrap gap-3">
					<button className="br-squircle ty-body-semibold bg-brand-500 muted px-4 py-2">
						Brand
					</button>
					<button className="br-circle ty-body-semibold bg-success muted px-4 py-2">
						Success
					</button>
					<button className="br-squircle ty-body-semibold bg-warning muted px-4 py-2">
						Warning
					</button>
					<button className="br-squircle ty-body-semibold bg-danger muted px-4 py-2">
						Error
					</button>
					<button className="br-squircle ty-body-semibold bg-info muted px-4 py-2">
						Information
					</button>
					<a
						href="#"
						className="br-squircle ty-body-semibold bg-neutral-900 px-4 py-2 text-neutral-50 no-underline hover:bg-neutral-400 dark:bg-neutral-200 dark:text-neutral-900"
					>
						Neutral CTA
					</a>
				</div>
			</section>

			{/* Radii + Shadows */}
			<section className="space-y-3">
				<h2 className="ty-title">Radii + Shadows</h2>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
					<div className="surface-2 br-square shadow-weak border-default border p-6">
						<p className="ty-caption">br-square + shadow-weak</p>
					</div>
					<div className="surface-2 br-squircle shadow-normal border-default border p-6">
						<p className="ty-caption">br-squircle + shadow-normal</p>
					</div>
					<div className="surface-2 br-circle shadow-strong border-default border p-6">
						<p className="ty-caption">br-circle + shadow-strong</p>
					</div>
				</div>
			</section>

			{/* Combined example */}
			<section className="surface-2 br-squircle shadow-strong border-default space-y-3 border p-6">
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
