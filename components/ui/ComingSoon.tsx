import { Clock } from "lucide-react";

export function ComingSoon({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-text-muted">{desc}</p>
      </div>
      <div className="card flex flex-col items-center gap-3 px-6 py-16 text-center">
        <span className="grid size-12 place-items-center rounded-full bg-primary/10 text-primary">
          <Clock className="size-6" />
        </span>
        <p className="text-base font-semibold">En construcción</p>
        <p className="max-w-sm text-sm text-text-muted">
          Esta pantalla llega en la siguiente iteración del prototipo (Fase B).
        </p>
        <span className="rounded-full border border-line bg-surface px-3 py-1 text-xs text-text-faint">
          Próximamente
        </span>
      </div>
    </div>
  );
}
