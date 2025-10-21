// components/NavBar/Sidebar/Settings.tsx
"use client";

import { useRouter } from "next/navigation";
import * as Popover from "@radix-ui/react-popover";
import { Laptop, Moon, Sun, ChevronDown, LogOut, Settings as Gear } from "lucide-react";
import { setLang } from "@/utils/lang";
import type { AppLang } from "@/utils/locale";
import { setTheme, type AppTheme } from "@/utils/theme";

type Props = { inline?: boolean; compact?: boolean };

export default function Settings({ inline = false, compact = false }: Props) {
  const router = useRouter();
  const pickTheme = (v: AppTheme) => setTheme(v);
  const pickLang = (l: AppLang) => { setLang(l); router.refresh(); };

  const Row = ({ children }: { children: React.ReactNode }) =>
    <div className="surface-2 br-squircle shadow-weak border px-3 py-3">{children}</div>;
  const Btn = ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) =>
    <button onClick={onClick} className="surface-2 hover:surface-3 br-squircle ty-sm w-full border px-3 py-2 text-left">{children}</button>;

  const Panel = (
    <div className="w-72">
      <div className="ty-header mb-2">Tema da Interface:</div>
      <Row>
        <div className="grid grid-cols-3 gap-2">
          <Btn onClick={() => pickTheme("light")}><span className="inline-flex items-center gap-2"><Sun size={16}/>Light</span></Btn>
          <Btn onClick={() => pickTheme("dark")}><span className="inline-flex items-center gap-2"><Moon size={16}/>Dark</span></Btn>
          <Btn onClick={() => pickTheme("system")}><span className="inline-flex items-center gap-2"><Laptop size={16}/>System</span></Btn>
        </div>
      </Row>

      <div className="ty-header mt-3 mb-2">Idioma:</div>
      <Row>
        <div className="space-y-2">
          <Btn onClick={() => pickLang("en-US")}>🇺🇸 Inglês</Btn>
          <Btn onClick={() => pickLang("pt-BR")}>🇧🇷 Português</Btn>
        </div>
      </Row>

      <div className="mt-3">
        <Btn onClick={() => {/* TODO: logout */}}>
          <span className="inline-flex items-center gap-2"><LogOut size={16}/>Logout</span>
        </Btn>
      </div>
    </div>
  );

  if (inline) return <div className="space-y-2">{Panel}</div>;

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          className={[
            "surface-2 hover:surface-3 br-squircle shadow-weak",
            "inline-flex items-center justify-center gap-2 border px-3 py-2 w-full",
            compact ? "h-10 px-2 py-0 justify-center" : "",
          ].join(" ")}
          aria-label="Open settings"
        >
          <Gear size={16} />
          {!compact && <span className="ty-sm-semibold">Settings</span>}
          {!compact && <ChevronDown size={14} />}
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content sideOffset={8} className="surface-2 br-squircle shadow-strong border p-2 z-50">
          {Panel}
          <Popover.Arrow className="fill-[color:var(--twc-border)]" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
