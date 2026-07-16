"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Bell, UserRound, FlaskConical } from "lucide-react";
import { navItems } from "@/lib/constants";
import { EcgLogo } from "@/components/ui/EcgLogo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { SupportButton } from "@/components/support/SupportButton";

function titleFor(pathname: string): string {
  if (pathname.startsWith("/flota/")) return "Detalle de Unidad";
  const item = navItems.find(
    (i) =>
      i.href === pathname ||
      (i.href !== "/dashboard" && pathname.startsWith(i.href + "/")),
  );
  return item?.label ?? "Resumen";
}

export function Header({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-line bg-bg/80 px-4 backdrop-blur-md md:px-6">
      <button
        onClick={onToggleSidebar}
        aria-label="Alternar menú lateral"
        className="hidden size-9 place-items-center rounded-lg text-text-muted transition-colors hover:bg-surface-2 hover:text-text md:grid"
      >
        <Menu className="size-5" />
      </button>
      <span className="md:hidden">
        <EcgLogo size={30} />
      </span>

      <h1 className="min-w-0 flex-1 truncate text-base font-semibold md:text-lg">
        {titleFor(pathname)}
      </h1>

      <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
        <span
          title="Prototipo con datos simulados — la arquitectura ya está lista para conectar datos reales (modo live)."
          className="inline-flex shrink-0 cursor-help items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary"
        >
          <FlaskConical className="size-3" />
          <span className="hidden sm:inline">Demo · datos simulados</span>
          <span className="sm:hidden">Demo</span>
        </span>

        <SupportButton />

        <ThemeToggle />

        <Link
          href="/alertas"
          aria-label="Notificaciones"
          className="relative grid size-9 place-items-center rounded-lg text-text-muted transition-colors hover:bg-surface-2 hover:text-text"
        >
          <Bell className="size-5" />
          <span className="pulse-critical absolute right-1 top-1 grid size-4 min-w-4 place-items-center rounded-full bg-critical px-1 text-[10px] font-bold text-white">
            3
          </span>
        </Link>

        <div className="flex items-center gap-2 rounded-lg border border-line bg-surface px-2 py-1.5">
          <span className="grid size-7 place-items-center rounded-full bg-primary/15 text-primary">
            <UserRound className="size-4" />
          </span>
          <div className="hidden flex-col leading-tight pr-1 sm:flex">
            <span className="text-xs font-semibold">Operador 01</span>
            <span className="text-[10px] text-text-faint">Centro de Control</span>
          </div>
        </div>
      </div>
    </header>
  );
}
