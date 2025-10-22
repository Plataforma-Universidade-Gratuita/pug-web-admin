import { useState } from "react";

import { ChevronDown, type LucideProps } from "lucide-react";
import { useTranslation } from "react-i18next";

type IconType = React.ForwardRefExoticComponent<
	Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
>;

type Option = {
	Icon?: IconType;
	label: string;
	value: string;
	onClick: () => void;
};

export default function SettingCard({
	title,
	selectedOption = { label: "", value: "" },
	options,
}: {
	title: string;
	selectedOption?: { label: string; value: string; Icon?: IconType };
	options: Option[];
}) {
	const { t } = useTranslation();
	const [open, setOpen] = useState(false);

	return (
		<div className="surface-2 br-squircle border-default-3 shadow-weak border">
			<button
				type="button"
				aria-haspopup="listbox"
				aria-expanded={open}
				onClick={() => setOpen(v => !v)}
				className="hover:surface-3 flex w-full items-center gap-2 rounded-t-[inherit] px-3 py-2 focus:outline-none"
			>
				<span className="ty-sm-semibold">{t(title)}</span>
				<span className="mx-2 h-[1px] flex-1 bg-[color:var(--twc-surface-3)]" />
				{selectedOption.Icon ? (
					<selectedOption.Icon
						size={16}
						className="shrink-0"
					/>
				) : null}
				<span className="ty-sm-semibold">{t(selectedOption.label)}</span>
				<ChevronDown
					size={16}
					className={`ml-1 transition-transform ${open ? "rotate-180" : ""}`}
				/>
			</button>
			<div
				className={`overflow-hidden transition-[max-height,opacity,transform] duration-200 ${open ? "max-h-96 translate-y-0 opacity-100" : "max-h-0 -translate-y-1 opacity-0"}`}
			>
				<ul role="listbox">
					{options.map(({ Icon, label, value, onClick }, i) => {
						const active = value === selectedOption.value;
						return (
							<li key={value}>
								<button
									role="option"
									aria-selected={active}
									onClick={() => {
										onClick();
										setOpen(false);
									}}
									className={[
										"ty-sm br-square border-default-3 w-full border-t-1 px-3 py-2 text-left",
										"surface-2 hover:surface-3",
										active
											? "bg-brand-500/15 border-brand-500/30 ty-sm-semibold"
											: "",
										i === options.length - 1 ? "rounded-b-lg" : "",
									].join(" ")}
								>
									{Icon ? (
										<Icon
											size={16}
											className="mr-2 inline-block"
										/>
									) : null}
									{t(label)}
								</button>
							</li>
						);
					})}
				</ul>
			</div>
		</div>
	);
}
