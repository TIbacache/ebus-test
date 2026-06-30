"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { mobileNavIcons, navItems } from "@/lib/constants";
import { navIcon } from "@/components/ui/icons";

function isActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === href;
  return pathname === href || pathname.startsWith(href + "/");
}

export function MobileNav() {
  const pathname = usePathname();
  const items = mobileNavIcons
    .map((ic) => navItems.find((n) => n.icon === ic))
    .filter((n): n is (typeof navItems)[number] => Boolean(n));

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex h-16 items-stretch border-t border-white/5 bg-sidebar/95 text-sidebar-fg backdrop-blur-md md:hidden">
      {items.map((item) => {
        const Icon = navIcon[item.icon];
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`relative flex flex-1 flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors ${
              active ? "text-primary" : "text-sidebar-muted"
            }`}
          >
            <span className="relative">
              <Icon className="size-[22px]" />
              {item.badge && (
                <span className="absolute -right-2.5 -top-1.5 grid min-w-4 place-items-center rounded-full bg-critical px-1 text-[9px] font-bold text-white">
                  {item.badge}
                </span>
              )}
            </span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
