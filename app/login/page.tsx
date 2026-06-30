"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Lock } from "lucide-react";
import { EcgLogo } from "@/components/ui/EcgLogo";
import { roles, ods, institucion, tagline } from "@/lib/constants";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [rol, setRol] = useState<string>(roles[0]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // Mock: cualquier credencial entra al dashboard.
    setTimeout(() => router.push("/dashboard"), 1100);
  }

  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      {/* Panel marca */}
      <aside className="relative hidden flex-col justify-between overflow-hidden border-r border-white/5 bg-sidebar p-10 text-sidebar-fg lg:flex">
        <div className="street-grid pointer-events-none absolute inset-0 opacity-40" />
        <div className="relative">
          <EcgLogo size={48} />
          <h1 className="mt-6 text-4xl font-bold tracking-tight">
            E-Bus <span className="text-primary">Control</span>
          </h1>
          <p className="mt-2 text-lg text-sidebar-muted">{tagline}</p>
        </div>

        <div className="relative">
          <svg viewBox="0 0 400 60" fill="none" className="w-full max-w-md">
            <path
              d="M0 30 H80 l10 -22 l14 44 l12 -34 l9 18 H400"
              stroke="#00D4AA"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="ecg-line"
            />
          </svg>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-sidebar-muted">
            Como un monitor cardíaco, E-Bus Control vigila el{" "}
            <span className="font-semibold text-sidebar-fg">pulso</span> de cada
            batería, predice fallas y alerta al instante al Centro de Control.
          </p>
          <p className="mt-4 text-xs font-medium uppercase tracking-wider text-sidebar-muted/70">
            {institucion}
          </p>
        </div>
      </aside>

      {/* Panel formulario */}
      <main className="flex flex-col items-center justify-center px-6 py-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex flex-col items-center text-center lg:hidden">
            <EcgLogo size={44} />
            <h1 className="mt-4 text-2xl font-bold tracking-tight">
              E-Bus <span className="text-primary">Control</span>
            </h1>
            <p className="mt-1 text-sm text-text-muted">{tagline}</p>
          </div>

          <h2 className="text-xl font-semibold">Iniciar sesión</h2>
          <p className="mt-1 text-sm text-text-muted">
            Accede al centro de monitoreo de tu flota.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-text-muted">Usuario</span>
              <span className="relative">
                <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-faint" />
                <input
                  type="text"
                  defaultValue="operador01"
                  className="w-full rounded-lg border border-line bg-surface py-2.5 pl-9 pr-3 text-sm outline-none transition-colors focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
                  placeholder="Tu usuario"
                />
              </span>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-text-muted">
                Contraseña
              </span>
              <span className="relative">
                <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-faint" />
                <input
                  type="password"
                  defaultValue="········"
                  className="w-full rounded-lg border border-line bg-surface py-2.5 pl-9 pr-3 text-sm outline-none transition-colors focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
                  placeholder="Tu contraseña"
                />
              </span>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-text-muted">Rol</span>
              <select
                value={rol}
                onChange={(e) => setRol(e.target.value)}
                className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
              >
                {roles.map((r) => (
                  <option key={r} value={r} className="bg-surface">
                    {r}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-bg transition-colors hover:bg-primary-hover disabled:opacity-80"
            >
              {loading ? (
                <>
                  <span className="size-4 animate-spin rounded-full border-2 border-bg/30 border-t-bg" />
                  Ingresando…
                </>
              ) : (
                "Ingresar al panel"
              )}
            </button>
          </form>

          {/* ODS */}
          <div className="mt-8 border-t border-line pt-5">
            <p className="mb-3 text-center text-xs text-text-faint">
              Comprometidos con los Objetivos de Desarrollo Sostenible
            </p>
            <div className="flex items-center justify-center gap-3">
              {ods.map((o) => (
                <span
                  key={o.num}
                  title={`ODS ${o.num} — ${o.nombre}`}
                  className="grid size-9 place-items-center rounded-md text-xs font-bold text-white"
                  style={{ backgroundColor: o.color }}
                >
                  {o.num}
                </span>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
