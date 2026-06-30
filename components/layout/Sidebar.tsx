"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { ChevronsLeft, LogOut } from "lucide-react";
import { navItems } from "@/lib/constants";
import { navIcon } from "@/components/ui/icons";
import { EcgLogo } from "@/components/ui/EcgLogo";

function isActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === href;
  return pathname === href || pathname.startsWith(href + "/");
}

export function Sidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  const pathname = usePathname();

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 240 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 z-30 hidden h-dvh shrink-0 flex-col border-r border-line bg-surface md:flex"
    >
      <div className="flex h-16 items-center gap-2.5 overflow-hidden px-4">
        <EcgLogo size={32} />
        {!collapsed && (
          <span className="truncate text-[15px] font-bold tracking-tight">
            E-Bus <span className="text-primary">Control</span>
          </span>
        )}
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-hidden px-2.5 py-2">
        {navItems.map((item) => {
          const Icon = navIcon[item.icon];
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={`group relative flex items-center gap-3 rounded-lg px-2.5 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-primary/10 text-primary"
                  : "text-text-muted hover:bg-surface-2 hover:text-text"
              }`}
            >
              {active && (
                <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-primary" />
              )}
              <Icon className="size-5 shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
              {!collapsed && item.badge && (
                <span className="ml-auto grid min-w-5 place-items-center rounded-full bg-critical px-1 text-[11px] font-bold text-white">
                  {item.badge}
                </span>
              )}
              {collapsed && item.badge && (
                <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-critical" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-line p-2.5">
        <button
          onClick={onToggle}
          className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2.5 text-sm font-medium text-text-muted transition-colors hover:bg-surface-2 hover:text-text"
        >
          <ChevronsLeft
            className={`size-5 shrink-0 transition-transform duration-200 ${
              collapsed ? "rotate-180" : ""
            }`}
          />
          {!collapsed && <span>Colapsar</span>}
        </button>
        <Link
          href="/login"
          title={collapsed ? "Cerrar sesión" : undefined}
          className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2.5 text-sm font-medium text-text-muted transition-colors hover:bg-surface-2 hover:text-text"
        >
          <LogOut className="size-5 shrink-0" />
          {!collapsed && <span>Cerrar sesión</span>}
        </Link>
      </div>
    </motion.aside>
  );
}
