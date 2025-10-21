"use client";

export type AppTheme = "light" | "dark" | "system";

export function setTheme(mode: AppTheme) {
  if (mode === "system") {
    document.documentElement.removeAttribute("data-theme");
    document.cookie = `theme=system; Path=/; Max-Age=31536000; SameSite=Lax`;
    return;
  }
  document.documentElement.setAttribute("data-theme", mode);
  document.cookie = `theme=${mode}; Path=/; Max-Age=31536000; SameSite=Lax`;
}
