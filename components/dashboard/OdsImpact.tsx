import Link from "next/link";
import {
  HeartPulse,
  Zap,
  Leaf,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";
import { ods } from "@/lib/constants";
import { fallasEvitadas } from "@/lib/data";

const odsIcon: Record<number, LucideIcon> = {
  3: HeartPulse,
  7: Zap,
  13: Leaf,
};

/** Banda de impacto: conecta los ODS 3/7/13 con funcionalidades concretas. */
export function OdsImpact() {
  return (
    <section className="card p-4 md:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold">Impacto & Sostenibilidad</h3>
          <p className="text-xs text-text-muted">
            Cada Objetivo de Desarrollo Sostenible se concreta en una función de
            E-Bus Control.
          </p>
        </div>
        <span className="hidden shrink-0 rounded-lg bg-healthy/10 px-3 py-1.5 text-xs font-semibold text-healthy sm:inline">
          {fallasEvitadas} fallas evitadas este mes · meta +25% vida útil
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {ods.map((o) => {
          const Icon = odsIcon[o.num] ?? Leaf;
          return (
            <Link
              key={o.num}
              href={o.href}
              className="group flex flex-col gap-2 rounded-xl border border-line bg-surface p-4 transition-colors hover:border-primary/40 hover:bg-surface-2"
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="grid size-9 shrink-0 place-items-center rounded-lg text-sm font-bold text-white"
                  style={{ backgroundColor: o.color }}
                >
                  {o.num}
                </span>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-text-faint">
                    ODS {o.num}
                  </p>
                  <p className="truncate text-sm font-semibold">{o.nombre}</p>
                </div>
                <Icon
                  className="ml-auto size-4 shrink-0 text-text-faint"
                  style={{ color: o.color }}
                />
              </div>
              <p className="text-xs leading-relaxed text-text-muted">
                {o.detalle}
              </p>
              <span className="mt-auto inline-flex items-center gap-1 pt-1 text-xs font-medium text-primary transition-colors group-hover:text-primary-hover">
                {o.accion}
                <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </Link>
          );
        })}
      </div>

      <span className="mt-3 block rounded-lg bg-healthy/10 px-3 py-2 text-center text-xs font-semibold text-healthy sm:hidden">
        {fallasEvitadas} fallas evitadas este mes · meta +25% vida útil
      </span>
    </section>
  );
}
